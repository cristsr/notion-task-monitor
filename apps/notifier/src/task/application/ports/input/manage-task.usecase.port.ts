import { Uuid } from '../../../../shared/domain/value-objects';

export abstract class ManageTaskUseCasePort {
  abstract syncTask(taskId: Uuid): Promise<void>;

  abstract removeTask(taskId: Uuid): Promise<void>;
}
