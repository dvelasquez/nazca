import {injectable, BindingScope, Provider} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Engine} from 'bpmn-engine';
import {EventEmitter} from 'events';
import {
  ProcessDefinition,
  ProcessInstance,
  UserTaskInstance,
} from '../models';
import {
  ProcessDefinitionRepository,
  ProcessInstanceRepository,
  UserTaskInstanceRepository,
} from '../repositories';
import { HttpErrors } from '@loopback/rest';

// BpmnService interface definition
export interface BpmnService {
  startProcess(
    definition: ProcessDefinition,
    variables: object,
  ): Promise<string>;
  completeTask(taskId: string, variables: object): Promise<void>;
}

// BpmnServiceProvider provides the implementation of BpmnService
@injectable({scope: BindingScope.TRANSIENT})
export class BpmnServiceProvider implements Provider<BpmnService> {
  constructor(
    @repository(ProcessDefinitionRepository)
    public processDefinitionRepo: ProcessDefinitionRepository,
    @repository(ProcessInstanceRepository)
    public processInstanceRepo: ProcessInstanceRepository,
    @repository(UserTaskInstanceRepository)
    public userTaskInstanceRepo: UserTaskInstanceRepository,
  ) {}

  value(): BpmnService {
    return this;
  }

  /**
   * Starts a new instance of a process definition.
   * @param definition The process definition object from the database.
   * @param variables Initial variables to pass to the process.
   * @returns The ID of the newly created process instance.
   */
  async startProcess(
    definition: ProcessDefinition,
    variables: object,
  ): Promise<string> {
    const instance = await this.processInstanceRepo.create({
      definitionId: definition.id,
      status: 'running',
      tenantId: definition.tenantId,
      variables: {},
    });

    const engine = new Engine({
      name: `engine-for-instance-${instance.id}`,
      source: definition.bpmnXml,
    });

    const listener = new EventEmitter();

    listener.on('wait', async (elementApi, execution) => {
      console.log(`[Instance: ${instance.id}] Waiting at task: ${elementApi.id}`);
      await this.userTaskInstanceRepo.create({
        instanceId: instance.id,
        taskId: elementApi.id,
        status: 'waiting',
        tenantId: instance.tenantId,
      });
      execution.stop();
    });

    listener.on('end', async (elementApi, execution) => {
      console.log(`[Instance: ${instance.id}] Process finished.`);
      await this.processInstanceRepo.updateById(instance.id, {
        status: 'completed',
      });
    });

    engine.execute(
      {
        listener,
        variables: {
          ...variables,
          processInstanceId: instance.id,
        },
      },
      async (err, execution) => {
        if (err) {
          await this.processInstanceRepo.updateById(instance.id, {
            status: 'failed',
          });
          throw err;
        }

        if (!execution) {
          console.log(`[Instance: ${instance.id}] Execution finished immediately.`);
          return;
        }

        // --- FIXES START HERE ---

        // Get the full state of the engine. This is crucial for resuming later.
        const state = execution.getState();

        // Persist the engine's state and variables to our database.
        await this.processInstanceRepo.updateById(instance.id, {
          // FIX: The property is `state` which can be 'running' or 'idle'.
          status: execution.state,
          // FIX: The process variables are located in `execution.environment.variables`.
          variables: execution.environment.variables,
          // NOTE: For the `completeTask` function to work, you will need to add a
          // property to your `ProcessInstance` model to store the full engine state.
          // e.g., `state: {type: 'object'}`. This `state` object is what the
          // engine's `resume()` method will need.
          // state: state,
        });

        // Persist the engine's state and variables to our database.
        await this.processInstanceRepo.updateById(instance.id, {
          status: execution.state,
          variables: execution.environment.variables,
          // Now we save the complete engine state to the new property
          state: state,
        });

        console.log(
          // FIX: Use the correct `execution.state` property here as well.
          `[Instance: ${instance.id}] Engine state saved with status: ${execution.state}`,
        );
        // --- FIXES END HERE ---
      },
    );

    if (!instance.id) {
      throw new Error('Failed to create process instance or get its ID.');
    }
    return instance.id;
  }

  /**
   * Completes a user task and resumes the process instance.
   * @param userTaskId The ID of the UserTaskInstance from our database.
   * @param variables Output variables from the user's work.
   */
  async completeTask(userTaskId: string, variables: object): Promise<void> {
    // 1. Find the specific UserTaskInstance the user is trying to complete.
    const userTask = await this.userTaskInstanceRepo.findById(userTaskId);
    if (!userTask || userTask.status !== 'waiting') {
      throw new HttpErrors.NotFound('Active user task not found or already completed.');
    }

    // 2. Find the parent ProcessInstance to get the saved engine state.
    const instance = await this.processInstanceRepo.findById(userTask.instanceId);
    if (!instance || !instance.state) {
      throw new HttpErrors.InternalServerError('Process instance or its state not found.');
    }

    // 3. Find the original ProcessDefinition to get the BPMN source XML.
    const definition = await this.processDefinitionRepo.findById(
      instance.definitionId,
    );
    if (!definition) {
      throw new HttpErrors.InternalServerError('Process definition not found.');
    }

    // 4. Create a new engine.
    const engine = new Engine({
      name: `engine-for-instance-${instance.id}-resume`,
      source: definition.bpmnXml,
    });

    // 5. Recover the engine from the saved state. This is the crucial first step.
    engine.recover(instance.state);

    // The same listener logic applies to the resumed execution.
    const listener = new EventEmitter();
    listener.on('wait', (elementApi, execution) => {
      // Create the next task and stop the engine
      this.userTaskInstanceRepo.create({
        instanceId: instance.id,
        taskId: elementApi.id,
        status: 'waiting',
        tenantId: instance.tenantId,
      });
      execution.stop();
    });
    listener.on('end', async () => {
      // Mark the main process instance as completed
      await this.processInstanceRepo.updateById(instance.id, {status: 'completed'});
    });

    // 6. Resume the now-recovered engine.
    engine.resume(
      {
        listener,
      },
      async (err, execution) => {
        if (err) throw err;

        if (!execution) {
          console.log(`[Instance: ${instance.id}] Resumed and finished immediately.`);
          return;
        }

        // 7. Find the specific API for the waiting user task and signal it to continue.
        const taskApi = execution.getPostponed().find(p => p.id === userTask.taskId);
        if (!taskApi) {
          throw new HttpErrors.InternalServerError(`Task ${userTask.taskId} not found in resumed execution.`);
        }

        // Signal the task with the variables from the user. This "completes" the task.
        taskApi.signal(variables);

        // 8. Update the completed UserTaskInstance in our database.
        await this.userTaskInstanceRepo.updateById(userTaskId, {status: 'completed'});

        // 9. Save the new state of the main ProcessInstance.
        const newState = execution.getState();
        await this.processInstanceRepo.updateById(instance.id, {
          status: execution.state,
          variables: execution.environment.variables,
          state: newState,
        });

        console.log(`[Instance: ${instance.id}] Resumed and saved with status: ${execution.state}`);
      },
    );
  }
}
