import { Apartment } from '../types/main';

const {
  MAX_PRICE: maxPrice,
  FROM: from,
  TO: to,
} = process.env;

const matchesFilters = (apartment: Apartment) => {
  if (maxPrice && apartment.price > parseInt(maxPrice, 10)) return false;
  if (from && apartment.dates.from > new Date(from)) return false;
  if (to && apartment.dates.to && apartment.dates.to < new Date(to)) return false;
  return true;
};

export default matchesFilters;
