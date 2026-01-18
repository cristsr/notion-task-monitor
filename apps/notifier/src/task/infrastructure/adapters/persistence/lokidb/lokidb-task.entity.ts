export class LokidbTaskEntity {
  id: string;

  title: string;

  date: Date;

  notified: boolean;

  constructor(payload: Partial<LokidbTaskEntity>) {
    Object.assign(this, payload);
  }
}
