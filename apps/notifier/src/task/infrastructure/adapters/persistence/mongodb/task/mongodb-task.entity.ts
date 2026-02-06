import { TaskPriority, TaskStatus, TaskType } from '../../../../../domain';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ModelDefinition } from '@nestjs/mongoose/dist/interfaces';

@Schema({ collection: 'tasks' })
export class MongodbTaskEntity {
  @Prop()
  id: string;

  @Prop(String)
  title: string;

  @Prop(Date)
  date: Date;

  @Prop(String)
  status: TaskStatus;

  @Prop(String)
  priority: TaskPriority;

  @Prop(String)
  type: TaskType;

  @Prop(String)
  assignedTo: string;

  @Prop(String)
  createdBy: string;

  @Prop(Date)
  createdAt: Date;

  @Prop([String])
  notificationStages: string[];

  @Prop(String)
  notifiedAt: string;

  @Prop(String)
  url: string;

  @Prop(Boolean)
  hidden: boolean;

  constructor(payload: MongodbTaskEntity) {
    Object.assign(this, payload);
  }
}

export const TaskSchema = SchemaFactory.createForClass(MongodbTaskEntity);

export const MongodbTaskEntityProvider: ModelDefinition = {
  name: MongodbTaskEntity.name,
  schema: TaskSchema,
};
