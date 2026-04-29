# PRODUCT.md — Restaurant Management System (RMS)

## What This Is
A brand new, tablet-first Restaurant Management System for the **fine dining segment**.
Built from scratch. This file is the single source of truth for what we're building.

## Developer Context
- I am a PM, not a developer
- Explain tradeoffs simply when they exist
- Don't over-engineer — build exactly what's described here, nothing more
- Ask clarifying questions before building something ambiguous
- Build one module at a time unless told otherwise
- Do not refactor existing code unless explicitly asked

---

## Target Users
- **Front-of-house staff** — seating guests, managing orders, tracking tables
- **Kitchen / bar staff** — viewing and actioning incoming orders via KDS
- **Cashiers** — processing payments and managing transactions
- **Managers / Admins** — configuring operational rules via Backoffice

---

## Design Principles
- **Tablet-first** — all screens optimized for tablet, touch targets, layout, scrolling
- **Fine dining focus** — course management is a core detailed feature, not an afterthought
- **Speed and clarity** — staff must act fast; UI must be unambiguous
- **Configurable** — operational rules come from Backoffice, not hardcoded

---

## Module 1 — Access PIN Code
- Staff authenticate via PIN before accessing the system
- PIN roles: Staff, Cashier, Manager — each has different access levels
- Manager PIN required for void items, mark as complimentary, discount overrides

---

## Module 2 — Opening Balance
- Staff declare starting cash float before beginning a shift
- Logged for end-of-day reconciliation

---

## Module 3 — Table Layout View

### What It Does
Visual floor plan of all tables grouped by floor/area. Staff can monitor real-time table status and begin service.

### Table Icon Displays
- Table number
- Seat capacity
- Status color (see below)
- Running amount (if Minimum Purchase Tracking = enabled)
- Running dining duration (if Time Tracking = enabled)

### Table Status Colors
| Status | Color | Condition |
|---|---|---|
| Available | Green | No active order |
| Occupied — min purchase not reached | Orange | Active order, min purchase enabled, amount < minimum |
| Occupied — min purchase reached | Red | Active order, min purchase enabled, amount ≥ minimum |
| Occupied — min purchase disabled | Red | Active order, min purchase disabled |
| Paid | Blue | Payment completed |

### Backoffice Configuration Controls
| Config | Type | Behavior |
|---|---|---|
| Minimum Purchase Tracking | Boolean | Shows running amount on table; controls orange/red color logic |
| Time Tracking | Boolean | Shows running dining duration timer on table icon |
| Max Dine Time | Boolean | When dining duration ≥ max dine time, time indicator turns red on table and in Order Menu |

### Table Interactions
- **Tap available table** → popup: number of guests (required), customer name (optional), phone (optional) → "Start Order" creates Order ID and navigates to Order Menu
- **Tap occupied table** → opens Order Menu for that table
- **Release Table** → only shown when order is paid; changes status to Available (Green)

---

## Module 4 — Order Menu Screen

### Header
- Table code (e.g. T01)
- Order ID (or Comb#001 if merged)
- Merged table indicator if applicable
- Payment state (Unpaid / Paid)
- Pax count
- Time seated / max dine time indicator
- Running amount / minimum purchase amount

### Menu Catalog
- Search by item name
- Filter by category
- Item cards show: name, price, availability
- Tap item → if has modifier: show modifier popup (modifier selection, notes, discount, mark as complimentary toggle); if no modifier: add directly to order list

### Order List
- Items grouped by course (Course 1, Course 2, etc.)
- New draft items assigned to active course
- Course label auto-generated
- Drag and drop reorder allowed for draft items only; fired items are locked
- Item statuses: Draft → Sent to Kitchen → In_Prep → Ready

### Course Management
- Add Course button creates a new course section
- Items can be dragged between courses (draft only)
- Course grouping shown in KOT

### Send to Kitchen
- **Send single item** — changes that item Draft → Sent, generates KOT ID for that item only
- **Send All Draft Items** — sends all draft items at once, routes by station (Kitchen or Bar), generates KOT IDs per course + station combination

### Void Item
- Requires manager PIN and void reason
- Can void items in any status: Sent, In_Prep, Ready, Served
- Item card updated as VOID

### Merge Table
- Combines items from two or more tables into one master order
- Order title updates (e.g. T01 + T02), order ID becomes Comb#001
- Bill recalculated; discounts released
- Seating timer continues from earliest opened table
- Can select occupied or available tables

### Transfer Table
- Moves entire order from Table A to Table B
- Table A → Available; Table B → Occupied
- Seating timer continues; Order ID unchanged
- Discounts follow destination table

### Transfer Course
- Moves a course to another table
- Allowed when course status is: Draft, In_Kitchen, In_Prep
- Disabled when status is: Mark as Ready
- Draft items remain Draft under new table
- Sent items stay linked to original KOT
- Order totals updated on both tables

### Discount
- **Item discount** — applied via item popup; shown as "Discount (Items)" in summary
- **Bill discount** — percentage or fixed IDR; shown as "Discount (Bill) (x%)" in summary
- Discount value cannot exceed order subtotal
- Manager approval required if configured

### Print Bill
- Enabled only when at least one item has been sent to kitchen

### Release Table
- Only shown when order is paid and no items are selected
- Changes table status to Available

---

## Module 5 — Kitchen Display System (KDS)

### Context
Real-time display for kitchen and bar staff. Separate KDS per station (Kitchen KDS / Bar KDS). Staff with Kitchen role see only KDS — no POS access.

### KOT Status Lifecycle
| Tab | Status | Description |
|---|---|---|
| Active Queue | in_kitchen | Item received, prep not started |
| Active Queue | in_prep | Chef started preparation |
| Active Queue | mark as ready | Item ready to serve |
| — | revert | Reverts status back to in_prep |
| Completed | mark as complete | Item completed, moved to Completed tab |

### KOT Card Shows
- KOT ID
- Table number
- Duration timer (elapsed since KOT created; persists through page refresh)
- Order type tag (Dine-In / Takeaway / Delivery)
- Course label
- Item list
- Item-level actions: Start Prep, Mark Ready, Revert
- KOT action: clicking KOT card shows Start Prep popup; when all items ready → show Mark Completed button

### KOT Generation Rules
- New KOT ID generated every time items are fired; IDs never reused
- Items grouped by **course + station** → 1 KOT per course per station
- Same course fired at different times = different KOT IDs, same course label
- Kitchen items → Kitchen KDS; Bar items → Bar KDS

### Example
| Item | Course | Station | → KOT |
|---|---|---|---|
| Calamari | 1 | Kitchen | KOT-001 |
| Mojito | 1 | Bar | KOT-002 |
| Steak | 2 | Kitchen | KOT-003 |

### Completed Tab
Shows completed KOT cards with: table number, KOT ID, last completed timestamp, item history.

---

## Module 6 — Payment Flow

### Pre-Payment Validations (in order)
1. **Unfired Draft Items** — modal prompts: "Send Draft and Pay" or "Discard" (returns to Order Menu)
2. **Minimum Purchase Not Met** (if enabled) — modal shows current total, minimum required, shortage; options: "Proceed Payment" or "Cancel"
3. If minimum purchase disabled → skip to payment screen directly

### Payment Screen (Popup)
- Table reference + Bill ID (e.g. Bill #0001)
- Combine Bill button (Full Payment mode only)
- Tabs: Full Payment / Split Bill
- Payment summary: items, subtotal, tax, service charge, total
- Payment methods: Cash, Debit Card, Credit Card, QRIS, E-Wallet

### Full Payment
- Single method → 100% auto-allocated
- Multiple methods → auto-split evenly; manual adjustment allowed
- "Fill Rest" button absorbs remaining balance into selected method
- Confirm Payment button: disabled if total allocated ≠ total bill; enabled when remaining = 0

### Split Bill
- Split methods: By Item / By Category / By Value
- Default: 2 split groups (Split 1, Split 2); "+ Add Split" creates more
- Each split group paid independently with own payment method(s)
- **Combine Bill is disabled in Split Bill mode**

### Combine Bill
- Only available in Full Payment mode
- Merges bills from multiple active tables into one combined bill reference

### Post-Payment
- Bill marked as Paid
- Transaction record created (TRX ID, methods, cashier, timestamp)
- Receipt generated (print/reprint optional)
- Table status → Available
- Order locked from further edits (except manager overrides)

### Transaction Page
- Lists all completed (fully paid) transactions
- Unpaid bills are not shown
- Transaction detail: bill info, items, split groups, payment breakdown
- Void Transaction: requires authorization and reason

---

## Module 7 — Device Management (Printer Setup)

### Printer Settings Page
- Lists all configured printers: name, connection type, IP/Bluetooth address, status (Online/Offline)
- Status polls every 30 seconds
- Max 10 printers
- Each printer assigned a role: Receipt, Kitchen, or Both
- Actions: Edit (name/IP), Remove, Set as Default

### Add Printer Flow
1. Select connection type: LAN/Wi-Fi or Bluetooth
2. **LAN/Wi-Fi**: auto-discovers printers on network (within 10 seconds); manual IP entry supported (IPv4 + port 1–65535); Rescan option
3. **Bluetooth**: requests permission; shows discovered devices; graceful fallback if denied
4. Connection test runs → success saves printer; failure shows error with retry

### No Printer Validation
- If no printer available: persistent warning banner on checkout screen; print action blocked with modal
- Options: "Set Up Printer" (redirects to Add Printer) or "Skip Printing" (logs event and continues)
- Banner auto-dismisses when printer reconnects
- Offline configured printer treated same as no printer

### Already Printed Validation
- Each print event logged: transaction ID, printer ID, timestamp, user ID
- Reprint attempt → confirmation modal showing order number and previous print time
- Confirmed reprint → logged as duplicate print event; "Reprint" badge shown on transaction
- Manager can export duplicate print report filtered by date range

---

## What's Built So Far
- Nothing yet — this is a greenfield project