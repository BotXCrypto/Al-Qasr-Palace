import { useState } from "react";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, isAfter, addDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AvailabilityCalendarProps {
  pricePerNight: number;
  onDateSelect?: (checkIn: Date, checkOut: Date) => void;
}

// Mock availability data
const generateAvailability = () => {
  const today = new Date();
  const availability: Record<string, { available: boolean; price?: number }> = {};
  
  for (let i = 0; i < 90; i++) {
    const date = addDays(today, i);
    const dateKey = format(date, "yyyy-MM-dd");
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const isBlocked = Math.random() < 0.15; // 15% chance of being booked
    
    availability[dateKey] = {
      available: !isBlocked,
      price: isWeekend ? 1.2 : 1, // 20% more on weekends
    };
  }
  
  return availability;
};

const availability = generateAvailability();

const AvailabilityCalendar = ({ pricePerNight, onDateSelect }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState<Date | null>(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the day of week the month starts on (0 = Sunday)
  const startDay = monthStart.getDay();
  const paddingDays = Array(startDay).fill(null);

  const goToPreviousMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayAvailability = availability[dateKey];
    
    if (!dayAvailability?.available || isBefore(date, new Date())) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (isAfter(date, selectedCheckIn)) {
      setSelectedCheckOut(date);
      onDateSelect?.(selectedCheckIn, date);
    } else {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    }
  };

  const isInRange = (date: Date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false;
    return isAfter(date, selectedCheckIn) && isBefore(date, selectedCheckOut);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl text-foreground">Availability</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            disabled={isSameMonth(currentMonth, new Date())}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="font-sans text-sm font-medium min-w-[140px] text-center">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const dateKey = format(day, "yyyy-MM-dd");
          const dayAvailability = availability[dateKey];
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const isAvailable = dayAvailability?.available && !isPast;
          const isSelected =
            (selectedCheckIn && format(selectedCheckIn, "yyyy-MM-dd") === dateKey) ||
            (selectedCheckOut && format(selectedCheckOut, "yyyy-MM-dd") === dateKey);
          const inRange = isInRange(day);
          const priceMultiplier = dayAvailability?.price || 1;
          const dayPrice = Math.round(pricePerNight * priceMultiplier);

          return (
            <button
              key={dateKey}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all",
                isPast && "text-muted-foreground/30 cursor-not-allowed",
                !isAvailable && !isPast && "text-muted-foreground/50 line-through cursor-not-allowed",
                isAvailable && "hover:bg-primary/10 cursor-pointer",
                isToday(day) && "ring-1 ring-primary",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary",
                inRange && "bg-primary/20"
              )}
            >
              <span className="font-medium">{format(day, "d")}</span>
              {isAvailable && (
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  ${dayPrice}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-border text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary" />
          <span className="text-muted-foreground">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20" />
          <span className="text-muted-foreground">Your Stay</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-border line-through" />
          <span className="text-muted-foreground">Unavailable</span>
        </div>
      </div>

      {selectedCheckIn && selectedCheckOut && (
        <div className="mt-4 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm text-foreground">
            <span className="font-medium">Selected:</span>{" "}
            {format(selectedCheckIn, "MMM d")} - {format(selectedCheckOut, "MMM d, yyyy")}
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
