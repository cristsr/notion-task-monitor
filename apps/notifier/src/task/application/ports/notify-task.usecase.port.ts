export abstract class NotifyTaskUseCasePort {
  abstract execute(taskId: string): Promise<void>;
}
