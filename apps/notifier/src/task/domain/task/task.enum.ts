export enum TaskType {
  NORMAL = 'NORMAL',
  SCHEDULED = 'SCHEDULED',
  RECURRENT = 'RECURRENT',
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum NotificationStage {
  BEFORE_24_HOURS = 'BEFORE_24_HOURS',
  BEFORE_1_HOUR = 'BEFORE_1_HOUR',
  BEFORE_15_MINUTES = 'BEFORE_15_MINUTES',
  AFTER_NOW = 'AFTER_NOW',
}
