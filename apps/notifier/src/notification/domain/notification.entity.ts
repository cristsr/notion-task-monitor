export class Notification {
  title: string;

  message: string;

  url: string;

  urlTitle: string;

  ttl: number;

  private constructor(payload: Partial<Notification>) {
    Object.assign(this, payload);
  }
}
