import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Calendar, Users, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface Reservation {
  id: string;
  room_name: string;
  check_in: string;
  check_out: string;
  adults: number;
  children: number;
  total_price: number | null;
  status: string;
  special_requests: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
};

const MyReservations = () => {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load reservations');
      } else {
        setReservations(data || []);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const cancelReservation = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    const { error } = await supabase
      .from('reservations')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) {
      toast.error('Failed to cancel reservation');
    } else {
      toast.success('Reservation cancelled');
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r)
      );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
            </Button>
            <h1 className="font-serif text-2xl text-gradient-gold">My Reservations</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">You haven't made any reservations yet.</p>
            <Button variant="hero" onClick={() => navigate('/')}>
              Explore Rooms
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex items-start justify-between">
                    <CardTitle className="font-serif text-lg">{reservation.room_name}</CardTitle>
                    <Badge className={statusColors[reservation.status] || ''}>
                      {reservation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-primary" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(reservation.check_in), 'MMM d, yyyy')}
                      </p>
                      <p className="text-muted-foreground">
                        to {format(new Date(reservation.check_out), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Users size={16} className="text-primary" />
                    <span>
                      {reservation.adults} Adults
                      {reservation.children > 0 && `, ${reservation.children} Children`}
                    </span>
                  </div>

                  {reservation.total_price && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin size={16} className="text-primary" />
                      <span className="font-medium">${reservation.total_price.toLocaleString()}</span>
                    </div>
                  )}

                  {reservation.special_requests && (
                    <p className="text-sm text-muted-foreground border-t pt-4">
                      "{reservation.special_requests}"
                    </p>
                  )}

                  {reservation.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => cancelReservation(reservation.id)}
                      className="w-full mt-4 text-destructive hover:text-destructive"
                    >
                      Cancel Reservation
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReservations;
