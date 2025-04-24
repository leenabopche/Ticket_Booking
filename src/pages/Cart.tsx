
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { getEventById, createBooking } from '@/services/mockData';

const Cart = () => {
  const { cart, removeFromCart, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleRemoveSeat = (eventId: string, seatId: string) => {
    removeFromCart(eventId, [seatId]);
  };
  
  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to complete your booking');
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process each cart item as a separate booking
      for (const cartItem of cart) {
        const event = getEventById(cartItem.eventId);
        if (!event) continue;
        
        const booking = createBooking({
          eventId: cartItem.eventId,
          userId: user.id,
          seats: cartItem.seats,
          totalAmount: cartItem.seats.reduce((sum, seat) => sum + seat.price, 0),
          status: 'confirmed'
        });
      }
      
      // Clear cart after successful booking
      clearCart();
      
      toast.success('Booking successful!');
      navigate('/bookings');
    } catch (error) {
      toast.error('An error occurred during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Looks like you haven't added any tickets to your cart yet.
              </p>
              <Button onClick={() => navigate('/')}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => {
              const event = getEventById(item.eventId);
              if (!event) return null;
              
              const eventTotal = item.seats.reduce((sum, seat) => sum + seat.price, 0);
              
              return (
                <Card key={item.eventId} className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-xl">{event.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">
                      {event.date} at {event.time} | {event.venue.name}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Selected Seats:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {item.seats
                            .sort((a, b) => {
                              if (a.row !== b.row) {
                                return a.row.localeCompare(b.row);
                              }
                              return a.number - b.number;
                            })
                            .map((seat) => (
                              <div
                                key={seat.id}
                                className="flex justify-between items-center p-2 bg-card border rounded-md"
                              >
                                <span>
                                  Seat {seat.row}{seat.number} - ${seat.price.toFixed(2)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveSeat(item.eventId, seat.id)}
                                  className="h-7 w-7 p-0"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"
                                    />
                                  </svg>
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="flex justify-end items-center pt-2">
                        <span className="font-semibold">
                          Subtotal: ${eventTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span>
                      {cart.reduce((sum, item) => sum + item.seats.length, 0)} tickets
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Order Total:</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => clearCart()}
                      className="flex-1"
                      disabled={isProcessing}
                    >
                      Clear Cart
                    </Button>
                    <Button 
                      onClick={handleCheckout}
                      className="flex-1 btn-hover-effect"
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
