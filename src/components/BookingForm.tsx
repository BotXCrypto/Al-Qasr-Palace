import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";
import { CalendarIcon, Users, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { rooms, Room } from "@/data/rooms";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BookingFormProps {
  selectedRoom?: Room;
  onClose?: () => void;
}

const BookingForm = ({ selectedRoom, onClose }: BookingFormProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomId, setRoomId] = useState(selectedRoom?.id || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const room = rooms.find((r) => r.id === roomId);
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;
  const totalPrice = room ? room.pricePerNight * nights : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut || !roomId || !name || !email || !room) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save reservation to database
      const { data: reservation, error: dbError } = await supabase
        .from('reservations')
        .insert({
          room_id: roomId,
          room_name: room.title,
          guest_name: name,
          guest_email: email,
          guest_phone: phone || null,
          check_in: format(checkIn, 'yyyy-MM-dd'),
          check_out: format(checkOut, 'yyyy-MM-dd'),
          adults,
          children,
          special_requests: specialRequests || null,
          total_price: totalPrice,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-confirmation-email', {
        body: {
          guestName: name,
          guestEmail: email,
          roomName: room.title,
          checkIn: format(checkIn, 'MMMM d, yyyy'),
          checkOut: format(checkOut, 'MMMM d, yyyy'),
          adults,
          children,
          totalPrice,
          reservationId: reservation.id
        }
      });

      if (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the booking if email fails
      }

      toast({
        title: "Reservation Confirmed!",
        description: "A confirmation email has been sent to your inbox.",
      });
      
      onClose?.();
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Reservation Failed",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Selection */}
      <div className="space-y-2">
        <Label htmlFor="room">Select Room</Label>
        <Select value={roomId} onValueChange={setRoomId}>
          <SelectTrigger id="room" className="bg-background">
            <SelectValue placeholder="Choose your accommodation" />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.title} - {r.price}/night
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Check-in Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background",
                  !checkIn && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date);
                  if (date && (!checkOut || checkOut <= date)) {
                    setCheckOut(addDays(date, 1));
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Check-out Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background",
                  !checkOut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) => date <= (checkIn || new Date())}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Guest Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Adults</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setAdults(Math.max(1, adults - 1))}
              disabled={adults <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{adults}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setAdults(Math.min(room?.maxGuests || 6, adults + 1))}
              disabled={adults >= (room?.maxGuests || 6)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Children</Label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setChildren(Math.max(0, children - 1))}
              disabled={children <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{children}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setChildren(Math.min(4, children + 1))}
              disabled={children >= 4}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Guest Information */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="font-serif text-lg">Guest Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
            className="bg-background"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="bg-background"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="requests">Special Requests</Label>
          <Input
            id="requests"
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="Any special requirements or preferences"
            className="bg-background"
          />
        </div>
      </div>

      {/* Price Summary */}
      {room && nights > 0 && (
        <div className="bg-muted rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              {room.title} × {nights} night{nights > 1 ? "s" : ""}
            </span>
            <span>${room.pricePerNight * nights}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Taxes & fees</span>
            <span>Calculated at confirmation</span>
          </div>
          <div className="flex justify-between font-serif text-xl pt-2 border-t border-border">
            <span>Estimated Total</span>
            <span className="text-primary">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          "Processing..."
        ) : (
          <>
            <Check className="mr-2 h-5 w-5" />
            Request Reservation
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Our concierge team will confirm availability and final pricing within 24 hours
      </p>
    </form>
  );
};

export default BookingForm;
