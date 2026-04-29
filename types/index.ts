// Data Models for Restaurant Management System

export type TableState = 'AVAILABLE' | 'OCCUPIED' | 'BILLED' | 'PAID';

export type ServiceType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY' | 'SCHEDULED_ORDER';

export type CheckStatus = 'OPEN' | 'PARTIALLY_PAID' | 'CLOSED';

export type ItemStatus = 'DRAFT' | 'HELD' | 'SENT' | 'IN_PREP' | 'READY' | 'SERVED' | 'VOIDED';

export type KOTStatus = 'NEW' | 'IN_PREP' | 'READY' | 'COMPLETED';

export type UserRole = 'FOH' | 'KITCHEN' | 'BAR';

export type PaymentMethod = 'CASH' | 'CARD' | 'DEBIT' | 'CREDIT' | 'QRIS' | 'EWALLET';

export type TicketType = 'KOT' | 'BOT';

export type RouteToStation = 'KITCHEN' | 'BAR';

export interface Floor {
  id: string;
  name: string;
  canvasWidth?: number;
  canvasHeight?: number;
}

export interface RoomArea {
  id: string;
  floorId: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;       // section accent colour (hex)
  rotation?: number;
  isBlocked?: boolean;  // entire area is closed / unavailable
}

export type TableShape = 'circle' | 'rectangle' | 'square' | 'round' | 'oval';
export type TableStaticStatus = 'Available' | 'Occupied' | 'Blocked';

export interface Table {
  id: string;
  areaId: string;       // maps to sectionId from outlet-data
  name: string;
  capacity: number;
  minimumPurchase: number;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: TableShape;
  rotation?: number;
  tableStatus?: TableStaticStatus; // Back-Office static status
}

export type LabelType =
  | 'entrance' | 'exit' | 'toilet' | 'kitchen' | 'bar'
  | 'storage' | 'cashier' | 'stairs' | 'elevator' | 'custom';

export interface FloorLabel {
  id: string;
  floorId: string;
  name: string;
  type: LabelType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  fontSize?: number;
  displayMode?: 'icon-text' | 'text-only' | 'icon-only';
}

export interface Wall {
  id: string;
  floorId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
}

export interface Door {
  id: string;
  floorId: string;
  x: number;
  y: number;
  width: number;
  orientation: 'horizontal' | 'vertical';
}

export interface Check {
  id: string;
  billNumber?: string; // Auto-generated bill number (e.g., "00001" or "Comb#0001" for merged tables)
  transactionId?: string; // Auto-generated when bill is fully paid, e.g. "TXN-20250305-A1B2C3"
  serviceType: ServiceType;
  tableId?: string;
  guestCount?: number;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string; // Customer email (optional)
  guestAddress?: string;
  scheduledAt?: Date;
  status: CheckStatus;
  billPrinted: boolean;
  billVersion: number; // v1, v2, v3 etc for reprints
  billModified: boolean; // true if items changed after bill was printed
  billSnapshotAt?: Date; // when the bill was last printed
  createdAt: Date;
  closedAt?: Date; // When check was closed (moved to history)
  totalAmount: number;
  paidAmount: number;
  seatedAt?: Date; // When customer was seated (for DINE_IN)
  maxSeatedMinutes?: number; // Max allowed seating time (default 90)
  minPurchaseAmount?: number; // Minimum purchase amount based on table
  checkNote?: string; // Customer note for the entire check
  pricelistId?: string; // Active pricelist (default, valentine, cny, etc)
  billDiscountType?: 'PERCENTAGE' | 'AMOUNT'; // Type of whole bill discount
  billDiscountValue?: number; // Percentage (0-100) or fixed amount
  billDiscountReason?: string; // Reason for bill discount
  billDiscountManagerPin?: string; // Manager PIN who approved bill discount
  tipAmount?: number; // Optional tip added to the bill
  voided?: boolean; // True if transaction has been voided
  voidedAt?: Date; // When the transaction was voided
  voidReason?: string; // Reason for voiding the transaction
  voidedBy?: string; // Manager PIN who voided the transaction
}

export interface Item {
  id: string;
  checkId: string;
  kotId?: string;
  batchId?: string; // Unique batch ID to track items sent together in the same "Send Item" action
  menuItemId?: string; // Reference to menu item
  name: string;
  price: number;
  quantity: number; // Number of this item
  modifiers: string[];
  course?: number; // Course number for KOT grouping
  courseId?: string; // Course ID reference for draft items
  status: ItemStatus;
  isTakeaway: boolean;
  dineType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'; // Per-item dine type override
  packagingPrice?: number; // Extra packaging fee for TAKEAWAY / DELIVERY items
  notes?: string;
  isComplimentary?: boolean;
  voidReason?: string;
  complimentaryReason?: string;
  compReason?: string; // Alias for complimentary reason
  discountType?: 'PERCENTAGE' | 'FIXED'; // Type of discount
  discountValue?: number; // Percentage (0-100) or fixed amount
  discountReason?: string; // Reason for discount
  discountManagerPin?: string; // Manager PIN who approved discount
  createdAt: Date;
}

export interface Course {
  id: string;
  checkId: string;
  name: string;
  number: number; // Display number (1, 2, 3...)
  state: 'DRAFT' | 'SENT';
  order: number; // Visual order position
}

export interface KOT {
  id: string;
  checkId: string;
  itemIds: string[];
  status: KOTStatus;
  course?: number;
  createdAt: Date;
  tableName?: string;
  serviceType: ServiceType;
  ticketType: TicketType; // KOT or BOT
  station: RouteToStation; // KITCHEN or BAR
}

export interface MenuCategory {
  id: string;
  name: string;
  routeTo: RouteToStation; // KITCHEN or BAR
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  availableModifiers: Array<string | { name: string; price: number }>;
}

export interface Payment {
  id: string;
  checkId: string;
  method: PaymentMethod;
  amount: number;
  createdAt: Date;
}

export interface SplitBill {
  id: string;
  checkId: string;
  splits: SplitGroup[];
  allocations: { [itemId: string]: { [splitId: string]: number } }; // percentage 0-100
  createdAt: Date;
}

export interface SplitGroup {
  id: string;
  name: string;
  paid: boolean;
  voided?: boolean;       // true when a paid split's payment has been voided
  voidedAmount?: number;  // the amount that was collected then voided
  paidAmount?: number;
  paidAt?: Date;
  billId?: string;        // Generated when this split is paid (e.g. "TXN-20250305-A1B2C3")
  paymentMethods?: Array<{ type: string; amount: number }>; // Payment methods used for this split
}

export interface MergedTableGroup {
  id: string;
  primaryTableId: string; // The main table that holds the merged check
  tableIds: string[]; // All tables in the merged group (including primary)
  checkId: string; // The combined check ID
  createdAt: Date;
}
console.log("Cek, kodenya jalan kok!");