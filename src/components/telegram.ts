import TeleBot from 'telebot';
import { Apartment } from '../types/main';

const bot = new TeleBot(process.env.TELEGRAM_TOKEN || '');

export const sendApartmentAlert = (apartment: Apartment) => bot.sendMessage(
  process.env.TELEGRAM_CHAT_ID || '',
  `New apartment found:\n
  ${apartment.title}\n
  ${apartment.subtitle}\n
  Price: ${apartment.price} eur\n
  From: ${new Date(apartment.dates.from).toDateString()}\n
  To: ${apartment.dates.to ? new Date(apartment.dates.to).toDateString() : ''}\n
  \n
  ${apartment.url}`,
);

export default sendApartmentAlert;
