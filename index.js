const { Client } = require('@notionhq/client');
const { from, concatMap, tap, mergeMap, filter, } = require('rxjs');
require('dotenv').config()

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.DATABASE_ID;

const  updateDates = (done,keys) => {
  return from(
    notion.databases.query({
      database_id: DATABASE_ID,
    })
  ).pipe(
    mergeMap((response) => from(response.results)),
    concatMap(page => from(notion.pages.update({
      page_id: page.id,
      properties: {
        [done]: {
          checkbox: false,
        }
      }
    }))),
    concatMap((page) =>
      from(keys).pipe(
        filter((key) => {
          const property = page.properties[key];
          return property?.type === 'date' && property.date?.start;
        }),
        concatMap((key) => {
          const pageId = page.id;
          const property = page.properties[key];

          const currentDate = new Date(property.date.start);
          const newDate = new Date(currentDate);
          newDate.setDate(newDate.getDate() + 1);

          const date = {
            start: newDate.toISOString(),
          };

          // Actualizar la página en Notion
          return from(
            notion.pages.update({
              page_id: pageId,
              properties: { [key]: { date } },
            })
          ).pipe(
            tap(() =>
              console.log(`Actualizado: ${pageId} → ${newDate.toDateString()}`)
            )
          );
        })
      )
    )
  );
}

// Ejecutar y manejar errores
updateDates('Done', ['Start Date', 'End Date']).subscribe({
  complete: () => console.log('Proceso completado'),
  error: (err) => console.error('Error:', err),
});
  