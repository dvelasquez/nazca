import {Entity, model, property} from '@loopback/repository';

@model()
export class BaseEntity extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false, // Set to false because we provide a default function
    defaultFn: 'uuidv4', // This is the key part!
  })
  id: string;

  constructor(data?: Partial<BaseEntity>) {
    super(data);
  }
}