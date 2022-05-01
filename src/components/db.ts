import { knex } from 'knex';
import { Apartment } from '../types/main';

const knexClient = knex({
  client: 'sqlite3',
  connection: {
    filename: './mydb.sqlite',
    flags: ['OPEN_URI', 'OPEN_SHAREDCACHE'],
  },
  useNullAsDefault: true,
});

export const migrate = () => knexClient.schema.createTable('apartments', (table) => {
  table.increments();
  table.index('id');
  table.string('title').notNullable();
  table.string('subtitle').notNullable();
  table.integer('price').notNullable();
  table.dateTime('from').notNullable();
  table.dateTime('to');
  table.integer('size').notNullable();
  table.string('postedBy').notNullable();
  table.string('url').notNullable();
  table.string('img');
});

export const insertApartment = (element: Apartment) => knexClient('apartments').insert([
  {
    id: element.id,
    title: element.title,
    subtitle: element.subtitle,
    price: element.price,
    from: element.dates.from,
    to: element.dates.to,
    size: element.size,
    postedBy: element.postedBy,
    url: element.url,
    img: element.img,
  },
]);

export const getApartmentById = (id: string) => knexClient('apartments').where('id', id);

export const apartmentExist = (id: string) => knexClient('apartments')
  .where('id', id)
  .then((array) => array.length !== 0);
