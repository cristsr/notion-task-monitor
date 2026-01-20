export abstract class NotifyTaskUseCasePort {
  abstract execute(): Promise<void>;
}
