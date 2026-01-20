import { TaskOutput } from '../dto';

export abstract class RetrieveTaskUsecasePort {
  abstract execute(): Promise<TaskOutput[]>;
}
