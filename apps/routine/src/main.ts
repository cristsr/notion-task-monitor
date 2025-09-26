import { Client } from '@notionhq/client';
import { from, concatMap, tap, mergeMap, filter } from 'rxjs';
import { DateTime } from 'luxon';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
require('dotenv').config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.DATABASE_ID;

const updateDates = (done: string, keys: string[]) => {
  const timeZone = process.env.TIME_ZONE || 'America/Bogota';

  return from(
    notion.databases.query({
      database_id: DATABASE_ID,
    }),
  ).pipe(
    mergeMap((response) => from(response.results)),
    concatMap((page) =>
      from(
        notion.pages.update({
          page_id: page.id,
          properties: {
            [done]: {
              checkbox: false,
            },
          },
        }),
      ),
    ),
    concatMap((page: PageObjectResponse) =>
      from(keys).pipe(
        filter((key) => {
          const property = page.properties[key];
          return property?.type === 'date' && !!property.date?.start;
        }),
        concatMap((key) => {
          const isoDate = page.properties[key]['date'].start;

          const currentDate = DateTime.fromISO(isoDate).setZone(timeZone);

          const now = DateTime.now().setZone(timeZone);

          const nextDate = DateTime.fromObject(
            {
              year: now.year,
              month: now.month,
              day: now.day,
              hour: currentDate.hour,
              minute: currentDate.minute,
              second: currentDate.second,
            },
            {
              zone: timeZone,
            },
          );

          // Actualizar la página en Notion
          return from(
            notion.pages.update({
              page_id: page.id,
              properties: {
                [key]: {
                  date: {
                    start: nextDate.toISO(),
                  },
                },
              },
            }),
          ).pipe(
            tap(() =>
              console.log(
                `Actualizado: ${page.id} → ${currentDate.toISO()} ${nextDate.toISO()}`,
              ),
            ),
          );
        }),
      ),
    ),
  );
};

// Ejecutar y manejar errores
updateDates('Done', ['Start Date', 'End Date']).subscribe({
  complete: () => console.log('Proceso completado'),
  error: (err) => console.error('Error:', err),
});
