### DATA STRUCTURES

```ts
type TableShape = "square" | "rectangle" | "round" | "oval";

// POS extends Back Office with live operational statuses
type TableStatus =
  | "Available"   // green — no active order
  | "Occupied"    // red   — has an open order
  | "Reserved"    // purple — booking for an upcoming time
  | "Blocked";    // grey  — manually closed in Back Office

interface Section {
  id: string;
  name: string;
  color: string;                          // exact hex, see seed below
  x: number; y: number;
  width: number; height: number;
  rotation: number;
  customShape?: { x: number; y: number }[]; // polygon points relative to section origin
}

interface Label {
  id: string;
  name: string;
  type: "entrance"|"exit"|"toilet"|"kitchen"|"bar"|"storage"
       |"cashier"|"stairs"|"elevator"|"custom";
  x: number; y: number;
  width: number; height: number;
  rotation: number;
  color: string;                          // exact hex, see label colour table below
  fontSize?: number;
  displayMode?: "icon-text" | "text-only" | "icon-only";
}

interface Table {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  width: number; height: number;
  x: number; y: number;
  rotation: number;
  status: TableStatus;
  sectionId?: string;
  minimumSpend?: number;
  maxDineInTime?: number;    // stored in minutes
  // POS-only runtime fields:
  guestCount?: number;
  orderId?: string;
  orderTotal?: number;
  occupiedSince?: number;    // Date.now() timestamp in ms
  reservedFor?: string;      // guest name
  reservedAt?: string;       // display time string e.g. "19:00"
}

interface Floor {
  id: string;
  name: string;
  order: number;
  canvasWidth: number;
  canvasHeight: number;
  sections: Section[];
  tables: Table[];
  labels: Label[];
}

interface Outlet {
  id: string;
  name: string;
  floors: Floor[];
}
COMPLETE SEED DATA
const MOCK_OUTLET: Outlet = {
  id: "outlet-1",
  name: "Labamu Downtown",
  floors: [
    {
      id: "floor-1",
      name: "Ground Floor",
      order: 1,
      canvasWidth: 1200,
      canvasHeight: 800,
      sections: [
        { id:"section-1", name:"Main Dining Area", color:"#006BFF",
          x:80,  y:200, width:450, height:350, rotation:0 },
        { id:"section-2", name:"VIP Lounge",       color:"#8B5CF6",
          x:600, y:200, width:350, height:250, rotation:0 },
        { id:"section-3", name:"Outdoor Terrace",  color:"#10B981",
          x:600, y:500, width:350, height:220, rotation:0 },
      ],
      tables: [
        // ── Main Dining Area ─────────────────────────────────────────────
        { id:"t1",  name:"T01", shape:"square",    capacity:4,
          width:90,  height:90,  x:100, y:220, rotation:0,
          status:"Available", sectionId:"section-1" },

        { id:"t2",  name:"T02", shape:"square",    capacity:4,
          width:90,  height:90,  x:220, y:220, rotation:0,
          status:"Occupied",  sectionId:"section-1",
          guestCount:3, orderId:"ORD-0042", orderTotal:187500,
          occupiedSince: Date.now() - 84 * 60 * 1000 },

        { id:"t3",  name:"T03", shape:"square",    capacity:4,
          width:90,  height:90,  x:340, y:220, rotation:0,
          status:"Available", sectionId:"section-1" },

        { id:"t4",  name:"T04", shape:"round",     capacity:6,
          width:110, height:110, x:100, y:350, rotation:0,
          status:"Reserved",  sectionId:"section-1",
          reservedFor:"Andi Wijaya", reservedAt:"19:00" },

        { id:"t5",  name:"T05", shape:"round",     capacity:6,
          width:110, height:110, x:240, y:350, rotation:0,
          status:"Available", sectionId:"section-1" },

        { id:"t6",  name:"T06", shape:"rectangle", capacity:2,
          width:70,  height:90,  x:380, y:360, rotation:0,
          status:"Blocked",   sectionId:"section-1" },

        // ── VIP Lounge ───────────────────────────────────────────────────
        { id:"t7",  name:"V01", shape:"oval",      capacity:8,
          width:140, height:100, x:620, y:230, rotation:0,
          status:"Occupied",  sectionId:"section-2",
          guestCount:6, orderId:"ORD-0041", orderTotal:950000,
          occupiedSince: Date.now() - 42 * 60 * 1000,
          minimumSpend:500000 },

        { id:"t8",  name:"V02", shape:"round",     capacity:6,
          width:110, height:110, x:790, y:230, rotation:0,
          status:"Available", sectionId:"section-2",
          minimumSpend:500000 },

        { id:"t9",  name:"V03", shape:"rectangle", capacity:4,
          width:100, height:80,  x:620, y:360, rotation:0,
          status:"Available", sectionId:"section-2",
          minimumSpend:500000 },

        { id:"t10", name:"V04", shape:"rectangle", capacity:4,
          width:100, height:80,  x:750, y:360, rotation:0,
          status:"Available", sectionId:"section-2",
          minimumSpend:500000 },

        // ── Outdoor Terrace ──────────────────────────────────────────────
        { id:"t11", name:"O01", shape:"square",    capacity:4,
          width:85,  height:85,  x:620, y:520, rotation:0,
          status:"Available", sectionId:"section-3" },

        { id:"t12", name:"O02", shape:"square",    capacity:4,
          width:85,  height:85,  x:730, y:520, rotation:0,
          status:"Available", sectionId:"section-3" },

        { id:"t13", name:"O03", shape:"round",     capacity:5,
          width:100, height:100, x:840, y:520, rotation:0,
          status:"Available", sectionId:"section-3" },

        { id:"t14", name:"O04", shape:"rectangle", capacity:6,
          width:120, height:80,  x:620, y:630, rotation:0,
          status:"Available", sectionId:"section-3" },

        { id:"t15", name:"O05", shape:"rectangle", capacity:6,
          width:120, height:80,  x:770, y:630, rotation:0,
          status:"Available", sectionId:"section-3" },
      ],
      labels: [
        { id:"lbl-1", name:"Main Entrance",  type:"entrance", color:"#006BFF",
          x:40,   y:80,  width:140, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
        { id:"lbl-2", name:"Restroom",       type:"toilet",   color:"#8B5CF6",
          x:1020, y:80,  width:120, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
        { id:"lbl-3", name:"Kitchen",        type:"kitchen",  color:"#F59E0B",
          x:100,  y:620, width:100, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
        { id:"lbl-4", name:"Bar Counter",    type:"bar",      color:"#EC4899",
          x:240,  y:620, width:120, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
        { id:"lbl-5", name:"Cashier",        type:"cashier",  color:"#10B981",
          x:40,   y:140, width:100, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
        { id:"lbl-6", name:"Emergency Exit", type:"exit",     color:"#EF4444",
          x:1000, y:730, width:140, height:40, rotation:0,
          fontSize:14, displayMode:"icon-text" },
      ],
    },
  ],
};
COLOUR SPECIFICATION BY STATE
Table Status — complete colour rules
AVAILABLE

Background fill:   rgba(16, 185, 129, 0.10)   ← --success-bg
Border:            #10B981                      ← --success (solid, 2px)
Table name text:   #282828                      ← --foreground
Capacity text:     #7E7E7E                      ← --muted-foreground
Border-radius:     8px (square/rect) | 50% (round/oval)
Cursor:            pointer
Hover:             scale(1.02), box-shadow 0px 4px 12px rgba(0,0,0,0.15)
Selected ring:     outline 2px solid #006BFF,  offset 2px
Status dot (sidebar legend): #10B981
OCCUPIED

Background fill:   rgba(208, 2, 27, 0.10)      ← --destructive at 10%
Border:            #D0021B                      ← --destructive (solid, 2px)
Table name text:   #282828                      ← --foreground
Capacity text:     #7E7E7E                      ← --muted-foreground
Elapsed time text: #D0021B                      ← --destructive  (e.g. "1h 24m")
Order ID sub-text: #7E7E7E                      ← --muted-foreground (optional, tiny)
Border-radius:     8px (square/rect) | 50% (round/oval)
Cursor:            pointer
Hover:             scale(1.02), box-shadow 0px 4px 12px rgba(0,0,0,0.15)
Selected ring:     outline 2px solid #006BFF,  offset 2px
Status dot (sidebar legend): #D0021B
RESERVED

Background fill:   rgba(139, 92, 246, 0.10)    ← #8B5CF6 at 10%
Border:            #8B5CF6                      (solid, 2px)
Table name text:   #282828                      ← --foreground
Capacity text:     #7E7E7E                      ← --muted-foreground
Guest name text:   #8B5CF6                      (e.g. "Andi Wijaya")
Reservation time:  #8B5CF6                      (e.g. "@ 19:00")
Border-radius:     8px (square/rect) | 50% (round/oval)
Cursor:            pointer
Hover:             scale(1.02), box-shadow 0px 4px 12px rgba(139,92,246,0.20)
Selected ring:     outline 2px solid #006BFF,  offset 2px
Status dot (sidebar legend): #8B5CF6
BLOCKED

Background fill:   rgba(107, 114, 128, 0.10)   ← --muted-bg
Border:            #6B7280                      ← --muted-border (solid, 2px)
Table name text:   #7E7E7E                      ← --muted-foreground
Capacity text:     #7E7E7E                      ← --muted-foreground
"Blocked" label:   #7E7E7E                      ← --muted-foreground
Border-radius:     8px (square/rect) | 50% (round/oval)
Cursor:            not-allowed
Hover:             no transform, no shadow (blocked = non-interactive)
Selected:          not selectable
Status dot (sidebar legend): #7E7E7E
DIMMED (zone filter active, table is in a non-selected zone)

opacity: 0.25 on the entire table div
pointer-events: none
MIN SPEND BADGE (top-right corner of table)

Background:    rgba(245, 158, 11, 0.15)         ← #F59E0B at 15%
Text:          #F59E0B
Border:        #F59E0B (1px solid)
Font:          Lato 9px bold
Padding:       2px 4px
Border-radius: 4px
Content:       "Min"
Section / Zone — complete colour rules
Sections are rendered as filled polygons (SVG if customShape exists, otherwise CSS rectangle) with a semi-transparent fill and coloured border.

General formula for any section with colour HEX:

Background fill:  HEX at 10% opacity
Border:           HEX at 60% opacity, 2px solid
Border-radius:    8px (rectangle mode only)
Section name tag (inside, bottom-left corner):
  Background:     HEX at 15% opacity
  Text colour:    HEX (solid)
  Font:           Lato 12px bold
  Padding:        2px 8px
  Border-radius:  4px
Main Dining Area (#006BFF)

Fill:        rgba(0, 107, 255, 0.10)    = #006BFF1A
Border:      rgba(0, 107, 255, 0.60)    = #006BFF99,  2px solid
Name tag bg: rgba(0, 107, 255, 0.15)    = #006BFF26
Name tag text: #006BFF
VIP Lounge (#8B5CF6)

Fill:        rgba(139, 92, 246, 0.10)   = #8B5CF61A
Border:      rgba(139, 92, 246, 0.60)   = #8B5CF699, 2px solid
Name tag bg: rgba(139, 92, 246, 0.15)   = #8B5CF626
Name tag text: #8B5CF6
Outdoor Terrace (#10B981)

Fill:        rgba(16, 185, 129, 0.10)   = #10B9811A  ← --success-bg
Border:      rgba(16, 185, 129, 0.60)   = #10B98199, 2px solid
Name tag bg: rgba(16, 185, 129, 0.15)   = #10B98126
Name tag text: #10B981
Dimmed zone (zone filter active, this zone NOT selected)

opacity: 0.25 on the entire section div
pointer-events: none
Selected zone (zone filter pill active, this zone IS selected)

Same fill/border as normal — but all OTHER zones dimmed to 25% opacity
Labels — complete colour rules per type
Labels are non-interactive UI overlays. Each has a coloured border, matching tinted background, and icon + text in the same colour.

General formula:

Background:   label.color at 10% opacity
Border:       label.color solid 2px
Border-radius: 6px
Padding:      8px
Icon colour:  label.color
Text colour:  #282828 (--foreground)
Font:         Lato 13px, normal
Specific values per type:

Entrance (#006BFF)

bg:     rgba(0, 107, 255, 0.10)   = #006BFF1A
border: #006BFF
icon:   DoorOpen (lucide-react),  colour #006BFF,  20×20px
Exit (#EF4444)

bg:     rgba(239, 68, 68, 0.10)   = #EF44441A
border: #EF4444
icon:   DoorClosed (lucide-react), colour #EF4444, 20×20px
NOTE: Exit red #EF4444 is intentionally different from
      destructive #D0021B — use the exact hex #EF4444 here.
Toilet / Restroom (#8B5CF6)

bg:     rgba(139, 92, 246, 0.10)  = #8B5CF61A
border: #8B5CF6
icon:   Bath (lucide-react),      colour #8B5CF6,  20×20px
Kitchen (#F59E0B)

bg:     rgba(245, 158, 11, 0.10)  = #F59E0B1A
border: #F59E0B
icon:   ChefHat (lucide-react),   colour #F59E0B,  20×20px
Bar (#EC4899)

bg:     rgba(236, 72, 153, 0.10)  = #EC48991A
border: #EC4899
icon:   Wine (lucide-react),      colour #EC4899,  20×20px
Storage (#6B7280)

bg:     rgba(107, 114, 128, 0.10) = --muted-bg
border: #6B7280                     = --muted-border
icon:   Package (lucide-react),   colour #6B7280,  20×20px
Cashier (#10B981)

bg:     rgba(16, 185, 129, 0.10)  = --success-bg
border: #10B981                     = --success
icon:   Banknote (lucide-react),  colour #10B981,  20×20px
Stairs (#14B8A6)

bg:     rgba(20, 184, 166, 0.10)  = #14B8A61A
border: #14B8A6
icon:   Layers (lucide-react),    colour #14B8A6,  20×20px
Elevator (#F97316)

bg:     rgba(249, 115, 22, 0.10)  = #F973161A
border: #F97316
icon:   MoveVertical (lucide-react), colour #F97316, 20×20px
Custom (#6B7280)

bg:     rgba(107, 114, 128, 0.10) = --muted-bg
border: #6B7280 dashed 2px
icon:   20×20px div with dashed border and border-radius 4px, colour #6B7280
APPLICATION CHROME COLOURS
Canvas Area
Page background (outside canvas):  #F9FAFB  (custom, slightly grey)
Canvas element background:          #FFFFFF  ← --card
Canvas element border:              #E9E9E9  ← --border, 1px solid
Canvas element border-radius:       8px
Canvas element shadow:              0px 1px 3px rgba(0,0,0,0.10)
Grid lines (when visible):
  background-image: linear-gradient(to right,  #E9E9E9 1px, transparent 1px),
                    linear-gradient(to bottom, #E9E9E9 1px, transparent 1px)
  background-size: 20px 20px
Header Bar (48px tall)
Background:       #FFFFFF  ← --card
Border-bottom:    #E9E9E9  ← --border, 1px solid
Outlet name:      #282828  ← --foreground,  16px Lato bold
Separator dot:    #7E7E7E  ← --muted-foreground
Floor name:       #7E7E7E  ← --muted-foreground, 14px
Summary pill text:#282828  ← --foreground, 12px
Summary dot sizes: 8×8px circles
Divider (vertical): #E9E9E9 ← --border, 1px, h-20px

Service-hours warning badge (outside 10:00–22:00):
  Background:     rgba(245, 158, 11, 0.10)  = #F59E0B1A
  Text:           #F59E0B
  Font:           Lato 11px, normal
  Padding:        2px 8px
  Border-radius:  4px