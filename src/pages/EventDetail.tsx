
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { getEventById, getAvailableSeats } from '@/services/mockData';
import { Event, Seat } from '@/types';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const fetchedEvent = getEventById(id);
      
      if (fetchedEvent) {
        setEvent(fetchedEvent);
        const availableSeats = getAvailableSeats(id);
        setSeats(availableSeats);
      }
    }
  }, [id]);
  
  if (!event) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <p className="text-muted-foreground mt-4">The event you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')} className="mt-6">
            Back to Events
          </Button>
        </div>
      </Layout>
    );
  }
  
  const eventDate = new Date(event.date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(eventDate);
  
  // Group seats by row
  const seatsByRow = seats.reduce<Record<string, Seat[]>>((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});
  
  const rowNames = Object.keys(seatsByRow).sort();
  
  const toggleSeatSelection = (seat: Seat) => {
    if (seat.status === 'booked') return;
    
    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.some((s) => s.id === seat.id);
      
      if (isSelected) {
        return prevSelected.filter((s) => s.id !== seat.id);
      } else {
        return [...prevSelected, seat];
      }
    });
  };
  
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  
  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please log in to book tickets');
      navigate('/login');
      return;
    }
    
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    
    addToCart(event.id, selectedSeats);
    navigate('/cart');
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold">{event.title}</h1>
                <Badge variant="outline" className="bg-muted/30">
                  {event.category}
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.venue.name}, {event.venue.location}</span>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">About this event</h2>
                <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              <div>
                <h2 className="text-xl font-semibold mb-4">Venue Information</h2>
                <p className="text-muted-foreground mb-2">{event.venue.name}</p>
                <p className="text-muted-foreground mb-4">{event.venue.location}</p>
                <p className="text-muted-foreground">Capacity: {event.venue.capacity} seats</p>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Select Your Seats</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-center mb-8 py-2 bg-muted/20 rounded-md text-center">
                    <span className="text-sm text-muted-foreground">STAGE</span>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-primary/30 rounded-sm"></div>
                      <span className="text-xs">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-primary rounded-sm"></div>
                      <span className="text-xs">Selected</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-muted/50 rounded-sm"></div>
                      <span className="text-xs">Booked</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {rowNames.map((row) => (
                      <div key={row} className="flex flex-nowrap gap-1 justify-center overflow-x-auto py-1">
                        <span className="text-xs font-semibold w-6 flex items-center mr-1">{row}</span>
                        {seatsByRow[row]
                          .sort((a, b) => a.number - b.number)
                          .map((seat) => {
                            const isSelected = selectedSeats.some((s) => s.id === seat.id);
                            const isBooked = seat.status === 'booked';
                            
                            return (
                              <button
                                key={seat.id}
                                className={`w-6 h-6 rounded-sm text-xs flex items-center justify-center transition-colors ${
                                  isSelected
                                    ? 'bg-primary text-white'
                                    : isBooked
                                    ? 'bg-muted/50 cursor-not-allowed'
                                    : 'bg-primary/30 hover:bg-primary/50'
                                }`}
                                onClick={() => toggleSeatSelection(seat)}
                                disabled={isBooked}
                                title={`Seat ${row}${seat.number} - $${seat.price}`}
                              >
                                {seat.number}
                              </button>
                            );
                          })}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Selected Seats:</span>
                    <span>{selectedSeats.length}</span>
                  </div>
                  
                  {selectedSeats.length > 0 && (
                    <div className="text-sm">
                      {selectedSeats
                        .sort((a, b) => {
                          if (a.row !== b.row) {
                            return a.row.localeCompare(b.row);
                          }
                          return a.number - b.number;
                        })
                        .map((seat) => (
                          <div key={seat.id} className="flex justify-between items-center py-1">
                            <span>
                              Seat {seat.row}{seat.number}
                            </span>
                            <span>${seat.price.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    className="w-full btn-hover-effect"
                    disabled={selectedSeats.length === 0}
                    onClick={handleAddToCart}
                  >
                    {user ? 'Add to Cart' : 'Log in to Book'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
