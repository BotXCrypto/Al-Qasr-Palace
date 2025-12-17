import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, RefreshCw, Trash2, Search, X } from 'lucide-react';
import { format, isWithinInterval, parseISO } from 'date-fns';

interface Reservation {
  id: string;
  room_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string | null;
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

const AdminDashboard = () => {
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchReservations = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load reservations');
    } else {
      setReservations(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchReservations();

      // Subscribe to real-time updates
      const channel = supabase
        .channel('reservations-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'reservations'
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              setReservations(prev => [payload.new as Reservation, ...prev]);
              toast.info('New reservation received!');
            } else if (payload.eventType === 'UPDATE') {
              setReservations(prev => 
                prev.map(r => r.id === (payload.new as Reservation).id ? payload.new as Reservation : r)
              );
            } else if (payload.eventType === 'DELETE') {
              setReservations(prev => prev.filter(r => r.id !== (payload.old as Reservation).id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAdmin]);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      // Search filter (guest name or email)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          reservation.guest_name.toLowerCase().includes(query) ||
          reservation.guest_email.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && reservation.status !== statusFilter) {
        return false;
      }

      // Date range filter (check-in date)
      if (dateFrom || dateTo) {
        const checkInDate = parseISO(reservation.check_in);
        if (dateFrom && dateTo) {
          if (!isWithinInterval(checkInDate, { 
            start: parseISO(dateFrom), 
            end: parseISO(dateTo) 
          })) {
            return false;
          }
        } else if (dateFrom) {
          if (checkInDate < parseISO(dateFrom)) return false;
        } else if (dateTo) {
          if (checkInDate > parseISO(dateTo)) return false;
        }
      }

      return true;
    });
  }, [reservations, searchQuery, statusFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFrom || dateTo;

  const sendStatusNotification = async (reservation: Reservation, newStatus: string) => {
    if (newStatus !== 'confirmed' && newStatus !== 'cancelled') return;

    try {
      const { error } = await supabase.functions.invoke('send-status-notification', {
        body: {
          guestName: reservation.guest_name,
          guestEmail: reservation.guest_email,
          roomName: reservation.room_name,
          checkIn: format(new Date(reservation.check_in), 'MMMM d, yyyy'),
          checkOut: format(new Date(reservation.check_out), 'MMMM d, yyyy'),
          status: newStatus,
          reservationId: reservation.id,
        },
      });

      if (error) {
        console.error('Failed to send notification:', error);
      } else {
        toast.success(`Notification email sent to ${reservation.guest_email}`);
      }
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const reservation = reservations.find(r => r.id === id);
    const previousStatus = reservation?.status;

    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update status');
    } else {
      toast.success('Status updated');
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );

      // Send email notification for confirmed/cancelled status changes
      if (reservation && (status === 'confirmed' || status === 'cancelled') && previousStatus !== status) {
        sendStatusNotification(reservation, status);
      }
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete reservation');
    } else {
      toast.success('Reservation deleted');
      setReservations(prev => prev.filter(r => r.id !== id));
    }
  };

  if (authLoading || !isAdmin) {
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
            <h1 className="font-serif text-2xl text-gradient-gold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={fetchReservations}>
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl">All Reservations</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredReservations.length} of {reservations.length} reservations
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  placeholder="Search guest name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  placeholder="From"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-[140px]"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="date"
                  placeholder="To"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-[140px]"
                />
              </div>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                  <X size={14} />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {hasActiveFilters ? 'No reservations match your filters' : 'No reservations yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Guest</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{reservation.guest_name}</p>
                          <p className="text-sm text-muted-foreground">{reservation.guest_email}</p>
                          {reservation.guest_phone && (
                            <p className="text-sm text-muted-foreground">{reservation.guest_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{reservation.room_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(new Date(reservation.check_in), 'MMM d, yyyy')}</p>
                          <p className="text-muted-foreground">to {format(new Date(reservation.check_out), 'MMM d, yyyy')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reservation.adults} Adults{reservation.children > 0 && `, ${reservation.children} Children`}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={reservation.status}
                          onValueChange={(value) => updateStatus(reservation.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue>
                              <Badge className={statusColors[reservation.status] || ''}>
                                {reservation.status}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(reservation.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteReservation(reservation.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
