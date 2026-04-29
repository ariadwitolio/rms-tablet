import type { Floor, RoomArea, Table, Check, Item, KOT, MenuItem, MenuCategory, Wall, Door, FloorLabel } from '../types';

// ─── Outlet: Labamu Downtown — 3 floors ──────────────────────────────────────

export const FLOORS: Floor[] = [
  { id: 'floor-1', name: 'Ground Floor', canvasWidth: 900, canvasHeight: 600 },
  { id: 'floor-2', name: 'Mezzanine',    canvasWidth: 900, canvasHeight: 600 },
  { id: 'floor-3', name: 'Rooftop',      canvasWidth: 900, canvasHeight: 600 },
];

// One section per floor; colour kept for data fidelity but NOT used for rendering
export const ROOM_AREAS: RoomArea[] = [
  { id: 'section-1', floorId: 'floor-1', name: 'Main Dining Area', color: '#006BFF',
    x: 60, y: 100, width: 480, height: 400 },
  { id: 'section-4', floorId: 'floor-1', name: 'Bar Area', color: '#EC4899',
    x: 560, y: 100, width: 280, height: 400 },
  { id: 'section-2', floorId: 'floor-2', name: 'VIP Lounge',       color: '#8B5CF6',
    x: 60, y: 100, width: 780, height: 330 },
  { id: 'section-3', floorId: 'floor-3', name: 'Outdoor Terrace',  color: '#6B7280',
    x: 60, y: 100, width: 780, height: 360, isBlocked: true },
];

// Facility labels distributed per floor
export const FLOOR_LABELS: FloorLabel[] = [
  // Ground Floor
  { id: 'lbl-1', floorId: 'floor-1', name: 'Main Entrance', type: 'entrance', color: '#006BFF',
    x: 60,  y: 30, width: 150, height: 40, fontSize: 13, displayMode: 'icon-text' },
  { id: 'lbl-5', floorId: 'floor-1', name: 'Cashier',       type: 'cashier',  color: '#10B981',
    x: 230, y: 30, width: 110, height: 40, fontSize: 13, displayMode: 'icon-text' },
  { id: 'lbl-3', floorId: 'floor-1', name: 'Kitchen',       type: 'kitchen',  color: '#F59E0B',
    x: 80,  y: 540, width: 110, height: 40, fontSize: 13, displayMode: 'icon-text' },
  // Mezzanine
  { id: 'lbl-4', floorId: 'floor-2', name: 'Bar Counter',   type: 'bar',      color: '#EC4899',
    x: 60,  y: 30, width: 130, height: 40, fontSize: 13, displayMode: 'icon-text' },
  { id: 'lbl-2', floorId: 'floor-2', name: 'Restroom',      type: 'toilet',   color: '#8B5CF6',
    x: 210, y: 30, width: 120, height: 40, fontSize: 13, displayMode: 'icon-text' },
  // Rooftop
  { id: 'lbl-6', floorId: 'floor-3', name: 'Emergency Exit', type: 'exit',    color: '#EF4444',
    x: 60,  y: 540, width: 150, height: 40, fontSize: 13, displayMode: 'icon-text' },
];

export const TABLES: Table[] = [
  // ── Ground Floor · Main Dining Area (section-1) ───────────────────────────
  //   Section: x:60–540, y:100–500  |  24px padding → x:84–516, y:124–476
  //   Available space: 432px wide × 352px tall
  
  // Row 1: Square tables (90×90)
  { id: 't1', areaId: 'section-1', name: 'T01', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 84,  y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  { id: 't2', areaId: 'section-1', name: 'T02', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 198, y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  { id: 't3', areaId: 'section-1', name: 'T03', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 312, y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  { id: 't16', areaId: 'section-1', name: 'T04', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 426, y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  
  // Row 2: Round tables (110×110)
  { id: 't4', areaId: 'section-1', name: 'T05', shape: 'round',     capacity: 6,
    minimumPurchase: 0, x: 84,  y: 238, width: 110, height: 110, tableStatus: 'Available' },
  { id: 't5', areaId: 'section-1', name: 'T06', shape: 'round',     capacity: 6,
    minimumPurchase: 0, x: 218, y: 238, width: 110, height: 110, tableStatus: 'Available' },
  { id: 't17', areaId: 'section-1', name: 'T07', shape: 'round',     capacity: 6,
    minimumPurchase: 0, x: 352, y: 238, width: 110, height: 110, tableStatus: 'Available' },
  
  // Row 3: Mixed tables
  { id: 't6', areaId: 'section-1', name: 'T08', shape: 'rectangle', capacity: 2,
    minimumPurchase: 0, x: 84,  y: 372, width: 70,  height: 90,  tableStatus: 'Available' },
  { id: 't18', areaId: 'section-1', name: 'T09', shape: 'rectangle', capacity: 2,
    minimumPurchase: 0, x: 178, y: 372, width: 70,  height: 90,  tableStatus: 'Available' },
  { id: 't19', areaId: 'section-1', name: 'T10', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 272, y: 372, width: 90,  height: 90,  tableStatus: 'Available' },
  { id: 't20', areaId: 'section-1', name: 'T11', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 386, y: 372, width: 90,  height: 90,  tableStatus: 'Available' },

  // ── Ground Floor · Bar Area (section-4) ───────────────────────────────────
  //   Section: x:560–840, y:100–500  |  24px padding → x:584–816, y:124–476
  //   Available space: 232px wide × 352px tall
  
  // Row 1: Square tables (90×90)
  { id: 't33', areaId: 'section-4', name: 'B01', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 584,  y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  { id: 't34', areaId: 'section-4', name: 'B02', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 702, y: 124, width: 90,  height: 90,  tableStatus: 'Available' },
  
  // Row 2: Round tables (100×100)
  { id: 't35', areaId: 'section-4', name: 'B03', shape: 'round',     capacity: 6,
    minimumPurchase: 0, x: 584,  y: 238, width: 100, height: 100, tableStatus: 'Available' },
  { id: 't36', areaId: 'section-4', name: 'B04', shape: 'round',     capacity: 6,
    minimumPurchase: 0, x: 712, y: 238, width: 100, height: 100, tableStatus: 'Available' },
  
  // Row 3: Rectangle tables (70×90)
  { id: 't37', areaId: 'section-4', name: 'B05', shape: 'rectangle', capacity: 2,
    minimumPurchase: 0, x: 584, y: 362, width: 70,  height: 90,  tableStatus: 'Available' },
  { id: 't38', areaId: 'section-4', name: 'B06', shape: 'rectangle', capacity: 2,
    minimumPurchase: 0, x: 678, y: 362, width: 70,  height: 90,  tableStatus: 'Available' },

  // ── Mezzanine · VIP Lounge (section-2) ───────────────────────────────────
  //   Section: x:60–840, y:100–430  |  32px padding → min x:92, min y:132
  { id: 't7',  areaId: 'section-2', name: 'V01', shape: 'oval',      capacity: 8,
    minimumPurchase: 500000, x: 92,  y: 132, width: 140, height: 100, tableStatus: 'Available' },
  { id: 't8',  areaId: 'section-2', name: 'V02', shape: 'round',     capacity: 6,
    minimumPurchase: 500000, x: 272, y: 132, width: 110, height: 110, tableStatus: 'Available' },
  { id: 't21', areaId: 'section-2', name: 'V03', shape: 'round',     capacity: 6,
    minimumPurchase: 500000, x: 412, y: 132, width: 110, height: 110, tableStatus: 'Available' },
  { id: 't29', areaId: 'section-2', name: 'V07', shape: 'round',     capacity: 6,
    minimumPurchase: 500000, x: 552, y: 132, width: 110, height: 110, tableStatus: 'Available' },
  { id: 't30', areaId: 'section-2', name: 'V08', shape: 'round',     capacity: 6,
    minimumPurchase: 500000, x: 692, y: 132, width: 110, height: 110, tableStatus: 'Available' },
  
  { id: 't9',  areaId: 'section-2', name: 'V04', shape: 'rectangle', capacity: 4,
    minimumPurchase: 500000, x: 92,  y: 275, width: 100, height: 80,  tableStatus: 'Available' },
  { id: 't10', areaId: 'section-2', name: 'V05', shape: 'rectangle', capacity: 4,
    minimumPurchase: 500000, x: 232, y: 275, width: 100, height: 80,  tableStatus: 'Available' },
  { id: 't22', areaId: 'section-2', name: 'V06', shape: 'rectangle', capacity: 4,
    minimumPurchase: 500000, x: 372, y: 275, width: 100, height: 80,  tableStatus: 'Available' },
  { id: 't31', areaId: 'section-2', name: 'V09', shape: 'rectangle', capacity: 4,
    minimumPurchase: 500000, x: 512, y: 275, width: 100, height: 80,  tableStatus: 'Available' },
  { id: 't32', areaId: 'section-2', name: 'V10', shape: 'rectangle', capacity: 4,
    minimumPurchase: 500000, x: 652, y: 275, width: 100, height: 80,  tableStatus: 'Available' },

  // ── Rooftop · Outdoor Terrace (section-3) ────────────────────────────────
  //   Section: x:60–840, y:100–460  |  32px padding → min x:92, min y:132
  { id: 't11', areaId: 'section-3', name: 'O01', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 92,  y: 132, width: 85,  height: 85,  tableStatus: 'Blocked' },
  { id: 't12', areaId: 'section-3', name: 'O02', shape: 'square',    capacity: 4,
    minimumPurchase: 0, x: 207, y: 132, width: 85,  height: 85,  tableStatus: 'Blocked' },
  { id: 't13', areaId: 'section-3', name: 'O03', shape: 'round',     capacity: 5,
    minimumPurchase: 0, x: 327, y: 132, width: 100, height: 100, tableStatus: 'Blocked' },
  { id: 't14', areaId: 'section-3', name: 'O04', shape: 'rectangle', capacity: 6,
    minimumPurchase: 0, x: 92,  y: 272, width: 120, height: 80,  tableStatus: 'Blocked' },
  { id: 't15', areaId: 'section-3', name: 'O05', shape: 'rectangle', capacity: 6,
    minimumPurchase: 0, x: 252, y: 272, width: 120, height: 80,  tableStatus: 'Blocked' },
];

// Kept for backward-compatibility with files that import them (now empty)
export const WALLS: Wall[] = [];
export const DOORS: Door[] = [];

export const MENU_ITEMS: MenuItem[] = [
  // Appetizers
  { id: 'item1', name: 'Caesar Salad', price: 75000, category: 'Appetizers', availableModifiers: [{ name: 'Extra Dressing', price: 5000 }, 'No Croutons', { name: 'Add Chicken', price: 25000 }], description: 'Fresh romaine lettuce with parmesan', image: 'https://images.unsplash.com/photo-1746211108786-ca20c8f80ecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item2', name: 'Bruschetta', price: 65000, category: 'Appetizers', availableModifiers: [], description: 'Toasted bread with tomatoes', image: 'https://images.unsplash.com/photo-1581035609165-2f9a18ac34ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item3', name: 'Soup of the Day', price: 55000, category: 'Appetizers', availableModifiers: [], description: 'Chef\'s special soup', image: 'https://images.unsplash.com/photo-1554054204-b2f70b09d031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item4', name: 'Calamari', price: 95000, category: 'Appetizers', availableModifiers: ['Spicy', 'Lemon', { name: 'Extra Tartar Sauce', price: 8000 }], description: 'Crispy fried squid', image: 'https://images.unsplash.com/photo-1734771219838-61863137b117?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  
  // Main Course
  { id: 'item5', name: 'Wagyu Steak', price: 450000, category: 'Main Course', availableModifiers: ['Rare', 'Medium', 'Well Done', { name: 'Extra Sauce', price: 15000 }, { name: 'Add Foie Gras', price: 120000 }], description: 'Premium wagyu beef', image: 'https://images.unsplash.com/photo-1570481060336-9c82d078588e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item6', name: 'Grilled Salmon', price: 280000, category: 'Main Course', availableModifiers: ['Lemon Butter', 'Herb Crusted', { name: 'Extra Vegetables', price: 20000 }], description: 'Fresh Atlantic salmon', image: 'https://images.unsplash.com/photo-1704007573697-6a516da421ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item7', name: 'Pan-fried Chicken Cordon Bleu with Tartar Sauce', price: 185000, category: 'Main Course', availableModifiers: [{ name: 'Extra Cheese', price: 15000 }, 'No Ham'], description: 'Stuffed chicken breast', image: 'https://images.unsplash.com/photo-1636005100120-dd69afa5ebe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item8', name: 'Pasta Carbonara', price: 125000, category: 'Main Course', availableModifiers: [], description: 'Creamy pasta with bacon', image: 'https://images.unsplash.com/photo-1633337474564-1d9478ca4e2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item9', name: 'Lobster Thermidor', price: 550000, category: 'Main Course', availableModifiers: [{ name: 'Extra Cheese', price: 15000 }], description: 'Baked lobster in cream sauce', image: 'https://images.unsplash.com/photo-1586735464727-c2d3e4e9a63b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item10', name: 'Lamb Rack', price: 320000, category: 'Main Course', availableModifiers: ['Mint Sauce', 'Rosemary', { name: 'Extra Lamb Chop', price: 80000 }], description: 'Grilled lamb chops', image: 'https://images.unsplash.com/photo-1766589152455-22eb3ab8849e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  
  // Desserts
  { id: 'item11', name: 'Tiramisu', price: 75000, category: 'Desserts', availableModifiers: [], description: 'Classic Italian dessert', image: 'https://images.unsplash.com/photo-1593545024944-b3c74435b9f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item12', name: 'Crème Brûlée', price: 85000, category: 'Desserts', availableModifiers: ['Vanilla', 'Chocolate'], description: 'Caramelized custard', image: 'https://images.unsplash.com/photo-1637194502327-c99c94943680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item13', name: 'Chocolate Lava Cake', price: 95000, category: 'Desserts', availableModifiers: [{ name: 'Ice Cream', price: 15000 }, { name: 'Whipped Cream', price: 10000 }], description: 'Warm chocolate cake', image: 'https://images.unsplash.com/photo-1645805740318-31bb7604ffd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item14', name: 'Panna Cotta', price: 70000, category: 'Desserts', availableModifiers: [], description: 'Italian cream pudding', image: 'https://images.unsplash.com/photo-1601654847092-712aff26313c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  
  // Beverages
  { id: 'item15', name: 'Espresso', price: 35000, category: 'Beverages', availableModifiers: [], description: 'Strong coffee', image: 'https://images.unsplash.com/photo-1620300538985-77a2168e90bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item16', name: 'Cappuccino', price: 45000, category: 'Beverages', availableModifiers: [{ name: 'Extra Foam', price: 5000 }, { name: 'Extra Shot', price: 10000 }, 'Chocolate'], description: 'Coffee with milk foam', image: 'https://images.unsplash.com/photo-1643909618082-d916d591c2a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item17', name: 'Fresh Orange Juice', price: 45000, category: 'Beverages', availableModifiers: [], description: 'Freshly squeezed', image: 'https://images.unsplash.com/photo-1641659735894-45046caad624?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item18', name: 'Mineral Water', price: 25000, category: 'Beverages', availableModifiers: [], description: 'Premium water', image: 'https://images.unsplash.com/photo-1591719482505-fcde0bdd0ed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item19', name: 'Wine (Glass)', price: 120000, category: 'Beverages', availableModifiers: ['Red', 'White'], description: 'House wine', image: 'https://images.unsplash.com/photo-1745053787007-1c09226aeff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { id: 'item20', name: 'Signature Mocktail', price: 65000, category: 'Beverages', availableModifiers: [], description: 'Non-alcoholic cocktail', image: 'https://images.unsplash.com/photo-1762631178352-f7ae732b42c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
];

// Menu Categories with routing configuration
export const MENU_CATEGORIES: MenuCategory[] = [
  { id: 'cat1', name: 'Appetizers', routeTo: 'KITCHEN' },
  { id: 'cat2', name: 'Main Course', routeTo: 'KITCHEN' },
  { id: 'cat3', name: 'Desserts', routeTo: 'KITCHEN' },
  { id: 'cat4', name: 'Beverages', routeTo: 'BAR' },
];

// Helper function to get category routing
export function getCategoryRoute(categoryName: string): 'KITCHEN' | 'BAR' {
  const category = MENU_CATEGORIES.find(cat => cat.name === categoryName);
  return category?.routeTo || 'KITCHEN'; // Default to KITCHEN if not found
}

// Initial state
export const initialChecks: Check[] = [];
export const initialItems: Item[] = [];
export const initialKOTs: KOT[] = [];