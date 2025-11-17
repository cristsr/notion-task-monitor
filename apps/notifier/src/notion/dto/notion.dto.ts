import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export class Page {
  id: string;
  title: string;
  done: boolean;
  startDate: string;
  endDate: string;
  url: string;

  constructor(input: Partial<Page>) {
    Object.assign(this, input);
  }

  compare(other: Page): number {
    return this.startDate.localeCompare(other.startDate);
  }

  static fromNotionPage(page: PageObjectResponse) {
    return new Page({
      id: page.id,
      title: page.properties['Habits']['title'][0].plain_text,
      startDate: page.properties['Start Date']['date'].start,
      endDate: page.properties['End Date']['date'].start,
      done: page.properties['Done']['checkbox'],
      url: page.url,
    });
  }
}

export function isValidNotionPage(page: PageObjectResponse) {
  return (
    page.properties['Habits']?.['title']?.[0]?.plain_text &&
    page.properties['Start Date']?.['date']?.start &&
    page.properties['End Date']?.['date']?.start
  );
}
