
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { getUserBookings, getEventById } from '@/services/mockData';
import { Booking } from '@/types';

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchBookings = () => {
      const userBookings = getUserBookings(user.id);
      setBookings(userBookings);
    };
    
    fetchBookings();
  }, [user, navigate]);
  
  if (!user) return null;
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't made any bookings yet. Browse our events to find something you like!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse Events
              </button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const event = getEventById(booking.eventId);
              if (!event) return null;
              
              const bookingDate = new Date(booking.bookingDate);
              const formattedBookingDate = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(bookingDate);
              
              const eventDate = new Date(event.date);
              const formattedEventDate = new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              }).format(eventDate);
              
              return (
                <Card key={booking.id} className="animate-fade-in">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>
                          {formattedEventDate} at {event.time} | {event.venue.name}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={booking.status === 'confirmed' ? 'default' : 'outline'}
                        className={
                          booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-500'
                            : booking.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tickets:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {booking.seats
                            .sort((a, b) => {
                              if (a.row !== b.row) return a.row.localeCompare(b.row);
                              return a.number - b.number;
                            })
                            .map((seat) => (
                              <div
                                key={seat.id}
                                className="p-2 bg-muted/10 border rounded-md text-center"
                              >
                                Seat {seat.row}{seat.number}
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Booking Date:</span>
                          <p>{formattedBookingDate}</p>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Booking ID:</span>
                          <p>{booking.id}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end items-center pt-2">
                        <span className="font-semibold">
                          Total: ${booking.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyBookings;
