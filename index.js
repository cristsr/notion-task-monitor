const { Client } = require('@notionhq/client');
const { from, concatMap, tap, mergeMap, filter } = require('rxjs');
const luxon = require('luxon');
require('dotenv').config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.DATABASE_ID;

const updateDates = (done, keys) => {
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
    concatMap((page) =>
      from(keys).pipe(
        filter((key) => {
          const property = page.properties[key];
          return property?.type === 'date' && property.date?.start;
        }),
        concatMap((key) => {
          const isoDate = page.properties[key].date.start;

          const currentDate = luxon.DateTime.fromISO(isoDate);

          const now = luxon.DateTime.now().setZone(timeZone);

          const nextDate = luxon.DateTime.fromObject(
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
