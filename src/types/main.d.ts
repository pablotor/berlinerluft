export interface Apartment {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  dates: {
    from: Date;
    to?: Date;
  };
  size: number;
  postedBy: string;
  url: string;
  img?: string;
}
