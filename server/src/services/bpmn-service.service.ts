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
   * (This is a placeholder for the next implementation step).
   * @param taskId The ID of the UserTaskInstance to complete.
   * @param variables Output variables from the user's work.
   */
  async completeTask(taskId: string, variables: object): Promise<void> {
    console.log(`Completing task ${taskId} with variables:`, variables);
    return Promise.resolve();
  }
}
