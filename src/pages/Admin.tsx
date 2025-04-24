
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { events, venues, getAllBookings, createEvent, updateEvent, deleteEvent } from '@/services/mockData';
import { Event, Booking } from '@/types';

const AdminEventsTab = () => {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  
  useEffect(() => {
    setEventsList([...events]);
  }, []);
  
  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };
  
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const success = deleteEvent(id);
      if (success) {
        setEventsList(prev => prev.filter(event => event.id !== id));
        toast.success('Event deleted successfully');
      } else {
        toast.error('Failed to delete event');
      }
    }
  };
  
  const handleAddNew = () => {
    setCurrentEvent({
      id: '',
      title: '',
      description: '',
      imageUrl: '',
      date: '',
      time: '',
      venue: venues[0],
      price: 0,
      category: ''
    });
    setIsEditing(true);
  };
  
  const handleSaveEvent = (event: Event) => {
    if (!event.title || !event.date || !event.venue || !event.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      if (!event.id) {
        // Create new event
        const newEvent = createEvent(event);
        setEventsList(prev => [...prev, newEvent]);
        toast.success('Event created successfully');
      } else {
        // Update existing event
        const updatedEvent = updateEvent(event.id, event);
        if (updatedEvent) {
          setEventsList(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
          toast.success('Event updated successfully');
        }
      }
      
      setCurrentEvent(null);
      setIsEditing(false);
    } catch (error) {
      toast.error('An error occurred while saving the event');
    }
  };
  
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {currentEvent?.id ? 'Edit Event' : 'Create New Event'}
          </h3>
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        
        {currentEvent && (
          <Card>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={currentEvent.title}
                      onChange={(e) => setCurrentEvent({...currentEvent, title: e.target.value})}
                      placeholder="Enter event title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={currentEvent.category}
                      onChange={(e) => setCurrentEvent({...currentEvent, category: e.target.value})}
                      placeholder="e.g., Concert, Conference, Comedy"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={currentEvent.description}
                    onChange={(e) => setCurrentEvent({...currentEvent, description: e.target.value})}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL *</Label>
                  <Input
                    id="imageUrl"
                    value={currentEvent.imageUrl}
                    onChange={(e) => setCurrentEvent({...currentEvent, imageUrl: e.target.value})}
                    placeholder="Enter image URL"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={currentEvent.date}
                      onChange={(e) => setCurrentEvent({...currentEvent, date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={currentEvent.time}
                      onChange={(e) => setCurrentEvent({...currentEvent, time: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentEvent.price}
                      onChange={(e) => setCurrentEvent({...currentEvent, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Select
                    value={currentEvent.venue.id}
                    onValueChange={(value) => {
                      const venue = venues.find(v => v.id === value);
                      if (venue) {
                        setCurrentEvent({...currentEvent, venue});
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.id}>
                          {venue.name}, {venue.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => handleSaveEvent(currentEvent)}
                  >
                    {currentEvent.id ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Manage Events</h3>
        <Button onClick={handleAddNew}>Add New Event</Button>
      </div>
      
      <div className="space-y-4">
        {eventsList.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No events found</p>
        ) : (
          eventsList.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle>{event.title}</CardTitle>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  {event.date} at {event.time} | {event.venue.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Category: {event.category}</span>
                  <span className="font-medium">Price: ${event.price.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const AdminBookingsTab = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    const fetchBookings = () => {
      const allBookings = getAllBookings();
      setBookings(allBookings);
    };
    
    fetchBookings();
  }, []);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">All Bookings</h3>
      
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No bookings have been made yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => {
            const event = getEventById(booking.eventId);
            if (!event) return null;
            
            const bookingDate = new Date(booking.bookingDate);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }).format(bookingDate);
            
            return (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription>
                        Booking ID: {booking.id}<br />
                        User ID: {booking.userId}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium
                        ${booking.status === 'confirmed' ? 'bg-green-500/20 text-green-500' : 
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-red-500/20 text-red-500'}`
                      }>
                        {booking.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-muted-foreground mt-1">
                        {formattedDate}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Event Date:</span>{' '}
                      {event.date} at {event.time}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Venue:</span>{' '}
                      {event.venue.name}, {event.venue.location}
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Seats:</span>{' '}
                      {booking.seats.map(seat => `${seat.row}${seat.number}`).join(', ')}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <span className="font-medium">Total: ${booking.totalAmount.toFixed(2)}</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">Update Status</Button>
                    <Button variant="outline" size="sm">Send Receipt</Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if not admin
    if (!user?.isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user?.isAdmin) return null;
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events">
            <AdminEventsTab />
          </TabsContent>
          
          <TabsContent value="bookings">
            <AdminBookingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
