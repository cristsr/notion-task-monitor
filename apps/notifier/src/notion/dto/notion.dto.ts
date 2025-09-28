export class Page {
  id: string;
  title: string;
  done: boolean;
  startDate: string;
  endDate: string;
  url: string;

  constructor(input: Page) {
    Object.assign(this, input);
  }
}
