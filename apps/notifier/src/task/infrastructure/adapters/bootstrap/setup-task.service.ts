import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  NotifyTaskUsecase,
  PurgeTaskUsecase,
  SetupTaskUsecase,
} from '../../../application/usecases';

@Injectable()
export class SetupTaskService implements OnModuleInit {
  constructor(
    private readonly syncTaskUsecase: SetupTaskUsecase,
    private readonly purgeTaskUsecase: PurgeTaskUsecase,
    private readonly notifyTaskUsecase: NotifyTaskUsecase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.syncTaskUsecase.execute();
    await this.purgeTaskUsecase.execute();
    await this.notifyTaskUsecase.execute();
  }
}
