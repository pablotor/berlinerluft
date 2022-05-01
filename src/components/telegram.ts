import TeleBot from 'telebot';
import { Apartment } from '../types/main';

const bot = new TeleBot(process.env.TELEGRAM_TOKEN || '');

export const sendApartmentAlert = (apartment: Apartment) => bot.sendMessage(
  process.env.TELEGRAM_CHAT_ID || '',
  `New apartment found:
  ${apartment.title}
  ${apartment.subtitle}
  Price: ${apartment.price} eur
  Size: ${apartment.size} m2
  From: ${new Date(apartment.dates.from).toDateString()}
  To: ${apartment.dates.to ? new Date(apartment.dates.to).toDateString() : '--'}
  Posted by: ${apartment.postedBy}\n
  ${apartment.url}`,
);

export default sendApartmentAlert;
