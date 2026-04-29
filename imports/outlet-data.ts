// TYPES

export type TableShape = "square" | "rectangle" | "round" | "oval";

export type TableStatus =
  | "Available"
  | "Occupied"
  | "Reserved"
  | "Blocked";

export interface Section {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  customShape?: { x: number; y: number }[];
}

export interface Label {
  id: string;
  name: string;
  type:
    | "entrance"
    | "exit"
    | "toilet"
    | "kitchen"
    | "bar"
    | "storage"
    | "cashier"
    | "stairs"
    | "elevator"
    | "custom";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  fontSize?: number;
  displayMode?: "icon-text" | "text-only" | "icon-only";
}

export interface Table {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  width: number;
  height: number;
  x: number;
  y: number;
  rotation: number;
  status: TableStatus;
  sectionId?: string;
  minimumSpend?: number;
  maxDineInTime?: number;

  // runtime
  guestCount?: number;
  orderId?: string;
  orderTotal?: number;
  occupiedSince?: number;
  reservedFor?: string;
  reservedAt?: string;
}

export interface Floor {
  id: string;
  name: string;
  order: number;
  canvasWidth: number;
  canvasHeight: number;
  sections: Section[];
  tables: Table[];
  labels: Label[];
}

export interface Outlet {
  id: string;
  name: string;
  floors: Floor[];
}

// DATA

export const MOCK_OUTLET: Outlet = {
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
        {
          id: "section-1",
          name: "Main Dining Area",
          color: "#006BFF",
          x: 80,
          y: 200,
          width: 450,
          height: 350,
          rotation: 0,
        },
        {
          id: "section-2",
          name: "VIP Lounge",
          color: "#8B5CF6",
          x: 600,
          y: 200,
          width: 350,
          height: 250,
          rotation: 0,
        },
        {
          id: "section-3",
          name: "Outdoor Terrace",
          color: "#10B981",
          x: 600,
          y: 500,
          width: 350,
          height: 220,
          rotation: 0,
        },
      ],

      tables: [
        {
          id: "t1",
          name: "T01",
          shape: "square",
          capacity: 4,
          width: 90,
          height: 90,
          x: 100,
          y: 220,
          rotation: 0,
          status: "Available",
          sectionId: "section-1",
        },
        {
          id: "t2",
          name: "T02",
          shape: "square",
          capacity: 4,
          width: 90,
          height: 90,
          x: 220,
          y: 220,
          rotation: 0,
          status: "Occupied",
          sectionId: "section-1",
          guestCount: 3,
          orderId: "ORD-0042",
          orderTotal: 187500,
          occupiedSince: Date.now() - 84 * 60 * 1000,
        },
        {
          id: "t3",
          name: "T03",
          shape: "square",
          capacity: 4,
          width: 90,
          height: 90,
          x: 340,
          y: 220,
          rotation: 0,
          status: "Available",
          sectionId: "section-1",
        },
        {
          id: "t4",
          name: "T04",
          shape: "round",
          capacity: 6,
          width: 110,
          height: 110,
          x: 100,
          y: 350,
          rotation: 0,
          status: "Reserved",
          sectionId: "section-1",
          reservedFor: "Andi Wijaya",
          reservedAt: "19:00",
        },
      ],

      labels: [
        {
          id: "lbl-1",
          name: "Main Entrance",
          type: "entrance",
          color: "#006BFF",
          x: 40,
          y: 80,
          width: 140,
          height: 40,
          rotation: 0,
          fontSize: 14,
          displayMode: "icon-text",
        },
        {
          id: "lbl-2",
          name: "Restroom",
          type: "toilet",
          color: "#8B5CF6",
          x: 1020,
          y: 80,
          width: 120,
          height: 40,
          rotation: 0,
          fontSize: 14,
          displayMode: "icon-text",
        },
      ],
    },
  ],
};
