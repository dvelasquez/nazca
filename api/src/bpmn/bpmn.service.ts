import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Engine } from 'bpmn-engine';
import { EventEmitter } from 'events';
import { ProcessDefinition, ProcessInstance, UserTaskInstance } from '../entities';

@Injectable()
export class BpmnService {
  constructor(
    @InjectRepository(ProcessDefinition)
    private processDefinitionRepository: Repository<ProcessDefinition>,
    @InjectRepository(ProcessInstance)
    private processInstanceRepository: Repository<ProcessInstance>,
    @InjectRepository(UserTaskInstance)
    private userTaskInstanceRepository: Repository<UserTaskInstance>,
  ) {}

  async startProcess(
    definition: ProcessDefinition,
    variables: object,
  ): Promise<string> {
    const instance = await this.processInstanceRepository.save({
      processDefinition: definition,
      status: 'running',
      tenant: definition.tenant,
      variables: {},
    });

    const engine = new Engine({
      name: `engine-for-instance-${instance.id}`,
      source: definition.bpmnXml,
    });

    const listener = new EventEmitter();

    listener.on('wait', async (elementApi, execution) => {
      console.log(`[Instance: ${instance.id}] Waiting at task: ${elementApi.id}`);
      await this.userTaskInstanceRepository.save({
        processInstance: instance,
        taskId: elementApi.id,
        status: 'waiting',
        tenant: instance.tenant,
      });
      execution.stop();
    });

    listener.on('end', async (elementApi, execution) => {
      console.log(`[Instance: ${instance.id}] Process finished.`);
      await this.processInstanceRepository.update(instance.id, {
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
          await this.processInstanceRepository.update(instance.id, {
            status: 'failed',
          });
          throw err;
        }

        if (!execution) {
          console.log(`[Instance: ${instance.id}] Execution finished immediately.`);
          return;
        }

        const state = execution.getState();

        await this.processInstanceRepository.update(instance.id, {
          status: execution.state,
          variables: execution.environment.variables,
          state: state,
        });

        console.log(
          `[Instance: ${instance.id}] Engine state saved with status: ${execution.state}`,
        );
      },
    );

    if (!instance.id) {
      throw new Error('Failed to create process instance or get its ID.');
    }
    return instance.id;
  }

  async completeTask(userTaskId: string, variables: object): Promise<void> {
    const userTask = await this.userTaskInstanceRepository.findOne({ where: { id: userTaskId } });
    if (!userTask || userTask.status !== 'waiting') {
      throw new Error('Active user task not found or already completed.');
    }

    const instance = await this.processInstanceRepository.findOne({ where: { id: userTask.processInstance.id } });
    if (!instance || !instance.state) {
      throw new Error('Process instance or its state not found.');
    }

    const definition = await this.processDefinitionRepository.findOne({ where: { id: instance.processDefinition.id } });
    if (!definition) {
      throw new Error('Process definition not found.');
    }

    const engine = new Engine({
      name: `engine-for-instance-${instance.id}-resume`,
      source: definition.bpmnXml,
    });

    engine.recover(instance.state);

    const listener = new EventEmitter();
    listener.on('wait', async (elementApi, execution) => {
      await this.userTaskInstanceRepository.save({
        processInstance: instance,
        taskId: elementApi.id,
        status: 'waiting',
        tenant: instance.tenant,
      });
      execution.stop();
    });
    listener.on('end', async () => {
      await this.processInstanceRepository.update(instance.id, { status: 'completed' });
    });

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

        const taskApi = execution.getPostponed().find(p => p.id === userTask.taskId);
        if (!taskApi) {
          throw new Error(`Task ${userTask.taskId} not found in resumed execution.`);
        }

        taskApi.signal(variables);

        await this.userTaskInstanceRepository.update(userTaskId, { status: 'completed' });

        const newState = execution.getState();
        await this.processInstanceRepository.update(instance.id, {
          status: execution.state,
          variables: execution.environment.variables,
          state: newState,
        });

        console.log(`[Instance: ${instance.id}] Resumed and saved with status: ${execution.state}`);
      },
    );
  }
}
