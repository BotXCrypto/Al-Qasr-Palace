import { Room } from "@/data/rooms";

interface RoomFloorPlanProps {
  room: Room;
}

const RoomFloorPlan = ({ room }: RoomFloorPlanProps) => {
  const isVilla = room.id === "imperial-villa";

  return (
    <div className="bg-muted rounded-xl p-8">
      <h3 className="font-serif text-2xl text-foreground mb-6">Floor Plan</h3>
      
      {/* SVG Floor Plan */}
      <div className="relative w-full aspect-[16/10] bg-background rounded-lg border border-border overflow-hidden">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="800" height="500" fill="hsl(var(--background))" />
          
          {isVilla ? (
            // Imperial Villa Floor Plan
            <>
              {/* Main Living Area */}
              <rect x="50" y="50" width="300" height="200" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="200" y="150" textAnchor="middle" className="fill-foreground text-sm font-sans">Living Room</text>
              
              {/* Master Bedroom */}
              <rect x="50" y="270" width="200" height="180" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="150" y="360" textAnchor="middle" className="fill-foreground text-sm font-sans">Master Suite</text>
              {/* Bed Icon */}
              <rect x="80" y="320" width="80" height="60" stroke="hsl(var(--border))" strokeWidth="1" fill="none" rx="2" />
              
              {/* Second Bedroom */}
              <rect x="270" y="270" width="150" height="180" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="345" y="360" textAnchor="middle" className="fill-foreground text-sm font-sans">Bedroom 2</text>
              
              {/* Kitchen */}
              <rect x="370" y="50" width="180" height="150" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="460" y="125" textAnchor="middle" className="fill-foreground text-sm font-sans">Chef's Kitchen</text>
              
              {/* Dining */}
              <rect x="370" y="220" width="180" height="130" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="460" y="285" textAnchor="middle" className="fill-foreground text-sm font-sans">Dining</text>
              
              {/* Terrace */}
              <rect x="570" y="50" width="180" height="300" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--accent))" rx="4" strokeDasharray="8,4" />
              <text x="660" y="200" textAnchor="middle" className="fill-foreground text-sm font-sans">Private Terrace</text>
              
              {/* Pool */}
              <ellipse cx="660" cy="400" rx="80" ry="50" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(220 70% 60% / 0.3)" />
              <text x="660" y="405" textAnchor="middle" className="fill-foreground text-sm font-sans">Infinity Pool</text>
              
              {/* Bathroom 1 */}
              <rect x="440" y="370" width="80" height="80" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--muted))" rx="4" />
              <text x="480" y="415" textAnchor="middle" className="fill-muted-foreground text-xs font-sans">Bath</text>
            </>
          ) : (
            // Royal Suite Floor Plan
            <>
              {/* Living Area */}
              <rect x="50" y="50" width="250" height="180" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="175" y="140" textAnchor="middle" className="fill-foreground text-sm font-sans">Living Area</text>
              
              {/* Bedroom */}
              <rect x="320" y="50" width="220" height="220" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="430" y="160" textAnchor="middle" className="fill-foreground text-sm font-sans">Bedroom</text>
              {/* Bed Icon */}
              <rect x="360" y="100" width="120" height="80" stroke="hsl(var(--border))" strokeWidth="1" fill="none" rx="2" />
              
              {/* Bathroom */}
              <rect x="560" y="50" width="150" height="150" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="635" y="125" textAnchor="middle" className="fill-foreground text-sm font-sans">Bathroom</text>
              {/* Tub */}
              <ellipse cx="635" cy="100" rx="35" ry="20" stroke="hsl(var(--border))" strokeWidth="1" fill="none" />
              
              {/* Dining */}
              <rect x="50" y="250" width="150" height="120" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--muted))" rx="4" />
              <text x="125" y="310" textAnchor="middle" className="fill-foreground text-sm font-sans">Dining</text>
              
              {/* Walk-in Closet */}
              <rect x="560" y="220" width="150" height="100" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--muted))" rx="4" />
              <text x="635" y="275" textAnchor="middle" className="fill-muted-foreground text-xs font-sans">Wardrobe</text>
              
              {/* Terrace */}
              <rect x="220" y="290" width="320" height="160" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--accent))" rx="4" strokeDasharray="8,4" />
              <text x="380" y="370" textAnchor="middle" className="fill-foreground text-sm font-sans">Private Terrace</text>
              
              {/* Entry */}
              <rect x="50" y="390" width="150" height="60" stroke="hsl(var(--border))" strokeWidth="1" fill="hsl(var(--muted))" rx="4" />
              <text x="125" y="425" textAnchor="middle" className="fill-muted-foreground text-xs font-sans">Entry</text>
            </>
          )}
          
          {/* Scale */}
          <line x1="650" y1="470" x2="750" y2="470" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <line x1="650" y1="465" x2="650" y2="475" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <line x1="750" y1="465" x2="750" y2="475" stroke="hsl(var(--foreground))" strokeWidth="1" />
          <text x="700" y="462" textAnchor="middle" className="fill-muted-foreground text-xs font-sans">5m</text>
        </svg>
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-primary" />
          <span className="text-muted-foreground">Indoor Space</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent border border-primary border-dashed" />
          <span className="text-muted-foreground">Outdoor Terrace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{room.size}</span>
          <span className="text-muted-foreground">Total Area</span>
        </div>
      </div>
    </div>
  );
};

export default RoomFloorPlan;
