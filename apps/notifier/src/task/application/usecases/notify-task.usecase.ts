import { Injectable, Logger } from '@nestjs/common';
import { DateTime } from 'luxon';
import dedent from 'dedent';
import { NotificationStage, Task, TaskRepository } from '../../domain';
import { NotifyTaskUseCasePort, NotionTaskRepositoryPort } from '../ports';
import { SendNotificationUsecasePort } from '../../../notification/application/ports';

@Injectable()
export class NotifyTaskUsecase implements NotifyTaskUseCasePort {
  private readonly logger = new Logger(NotifyTaskUsecase.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly notificationService: SendNotificationUsecasePort,
    private readonly notionRepository: NotionTaskRepositoryPort,
  ) {}

  async execute(): Promise<void> {
    const now = DateTime.local();

    this.logger.log(`Checking tasks for notification at ${now.toISO()}`);

    const tasks = await this.taskRepository.getAllTask();

    for (const task of tasks) {
      if (!task.shouldNotify()) {
        continue;
      }

      await this.verifyVisibility(task);

      await this.sendNotification(task);

      task.notify();

      await this.taskRepository.save(task);
    }
  }

  private async verifyVisibility(task: Task): Promise<void> {
    if (!task.mustBeVisible()) return;
    task.setVisible(true);
    await this.notionRepository.updateVisibility(task);
  }

  private async sendNotification(task: Task): Promise<void> {
    const endDate = task.date.toLocaleString({
      hour: 'numeric',
      minute: 'numeric',
    });

    const stageLabel = this.getStageLabel(task.getNotificationStage());

    const message = dedent`
         🔔 ${stageLabel}
         ⏲ Hora de finalizacion: ${endDate}
      `;

    this.notificationService.execute({
      message,
      title: task.title,
      url: task.url,
      urlTitle: '📝 Ver tarea',
    });

    this.logger.log(
      `Notification sent for task [${task.id.value}] ${task.title} - Stage: ${task.getNotificationStage()}`,
    );
  }

  private getStageLabel(stage: NotificationStage): string {
    const mapper = {
      BEFORE_24_HOURS: 'Recordatorio: Tarea en 24 horas',
      BEFORE_1_HOUR: 'Recordatorio: Tarea en 1 hora',
      BEFORE_15_MINUTES: 'Recordatorio: Tarea en 15 minutos',
      AFTER_NOW: 'Alerta: Tarea vencida',
    };

    return mapper[stage];
  }
}
