import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'developmentdb',
  connector: 'memory',
  localStorage: 'devdb',
  file: './data/in-memory-db.json'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DevelopmentdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'developmentdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.developmentdb', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
