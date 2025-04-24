
export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  venue: Venue;
  price: number;
  category: string;
}

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  rows: number;
  seatsPerRow: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'booked';
  price: number;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  seats: Seat[];
  totalAmount: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CartItem {
  eventId: string;
  seats: Seat[];
}
