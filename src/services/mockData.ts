
import { Event, Venue, Booking } from '@/types';

// Venues 
export const venues: Venue[] = [
  {
    id: '1',
    name: 'Stellar Arena',
    location: 'New York, NY',
    capacity: 300,
    rows: 15,
    seatsPerRow: 20
  },
  {
    id: '2',
    name: 'Nebula Hall',
    location: 'Los Angeles, CA',
    capacity: 150,
    rows: 10,
    seatsPerRow: 15
  },
  {
    id: '3',
    name: 'Cosmic Center',
    location: 'Chicago, IL',
    capacity: 200,
    rows: 10,
    seatsPerRow: 20
  }
];

// Events
export const events: Event[] = [
  {
    id: '1',
    title: 'Interstellar Symphony',
    description: 'A captivating orchestral performance featuring cosmic-inspired compositions from renowned composers.',
    imageUrl: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    date: '2025-05-15',
    time: '19:00',
    venue: venues[0],
    price: 45,
    category: 'Concert'
  },
  {
    id: '2',
    title: 'Tech Beyond Tomorrow',
    description: 'A conference exploring cutting-edge technologies and their impact on our future.',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    date: '2025-06-22',
    time: '10:00',
    venue: venues[1],
    price: 75,
    category: 'Conference'
  },
  {
    id: '3',
    title: 'Quantum Comedy Night',
    description: 'Laugh until your sides hurt with our lineup of the funniest comedians in the galaxy.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    date: '2025-05-30',
    time: '20:30',
    venue: venues[2],
    price: 35,
    category: 'Comedy'
  },
  {
    id: '4',
    title: 'Digital Art Exhibition',
    description: 'Experience the future of art through immersive digital installations and interactive exhibits.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    date: '2025-07-10',
    time: '11:00',
    venue: venues[0],
    price: 25,
    category: 'Exhibition'
  },
  {
    id: '5',
    title: 'Astronaut Talk: Life in Space',
    description: 'Join retired astronaut Dr. Sarah Chen as she shares her experiences living aboard the ISS.',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    date: '2025-06-05',
    time: '18:00',
    venue: venues[1],
    price: 40,
    category: 'Talk'
  }
];

// Bookings
export const bookings: Booking[] = [];

// Helper function to get an event by ID
export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

// Helper function to generate available seats for an event
export const getAvailableSeats = (eventId: string) => {
  const event = getEventById(eventId);
  if (!event) return [];
  
  const venue = event.venue;
  const rows = Array.from({ length: venue.rows }, (_, i) => 
    String.fromCharCode(65 + i)
  );
  
  const allSeats = rows.flatMap(row => 
    Array.from({ length: venue.seatsPerRow }, (_, i) => ({
      id: `${eventId}-${row}-${i + 1}`,
      row,
      number: i + 1,
      status: 'available' as const,
      price: event.price + (row.charCodeAt(0) - 65 < 3 ? 20 : 0) // Premium pricing for rows A-C
    }))
  );
  
  // Mark some seats as booked (for demo purposes)
  const bookedSeats = new Set([
    `${eventId}-A-1`, `${eventId}-A-2`, 
    `${eventId}-C-5`, `${eventId}-C-6`, `${eventId}-C-7`,
    `${eventId}-F-10`, `${eventId}-F-11`, `${eventId}-F-12`,
    `${eventId}-J-3`, `${eventId}-J-4`
  ]);
  
  return allSeats.map(seat => ({
    ...seat,
    status: bookedSeats.has(seat.id) ? 'booked' as const : 'available' as const
  }));
};

// Helper function to create a booking
export const createBooking = (booking: Omit<Booking, 'id' | 'bookingDate'>) => {
  const newBooking: Booking = {
    ...booking,
    id: `booking-${bookings.length + 1}`,
    bookingDate: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

// Helper function to get all bookings for a user
export const getUserBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

// Helper function to get all bookings (admin only)
export const getAllBookings = (): Booking[] => {
  return [...bookings];
};

// Helper function to create new event (admin only)
export const createEvent = (event: Omit<Event, 'id'>): Event => {
  const newEvent: Event = {
    ...event,
    id: `event-${events.length + 1}`
  };
  
  events.push(newEvent);
  return newEvent;
};

// Helper function to update an event (admin only)
export const updateEvent = (id: string, updatedEvent: Partial<Event>): Event | undefined => {
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return undefined;
  
  events[index] = { ...events[index], ...updatedEvent };
  return events[index];
};

// Helper function to delete an event (admin only)
export const deleteEvent = (id: string): boolean => {
  const initialLength = events.length;
  const filteredEvents = events.filter(e => e.id !== id);
  
  if (filteredEvents.length < initialLength) {
    events.length = 0;
    events.push(...filteredEvents);
    return true;
  }
  
  return false;
};
