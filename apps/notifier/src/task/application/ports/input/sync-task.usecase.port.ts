export abstract class SyncTaskUsecasePort {
  abstract execute(): Promise<void>;
}
