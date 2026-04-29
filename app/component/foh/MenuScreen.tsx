import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { ArrowLeft, Search, Save, Plus, Printer, Trash2, X, Minus, GripVertical, FileText, Check, CreditCard } from 'lucide-react';
import { MENU_ITEMS, getCategoryRoute } from '../../data/mockData';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';

interface DraftItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  modifiers: string[];
  course: number | null;
  isTakeaway: boolean;
  notes?: string;
  quantity: number;
  isComplimentary?: boolean;
  compReason?: string;
}

interface MenuScreenProps {
  checkId: string;
  onClose: () => void;
  onOpenPayment?: () => void;
}

const ItemTypes = {
  COURSE: 'course',
  ITEM: 'item',
};

interface DraggableCourseProps {
  course: number;
  index: number;
  moveCourse: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  courseRef?: (element: HTMLDivElement | null) => void;
}

function DraggableCourse({ 
  course, 
  index, 
  moveCourse, 
  isSelected, 
  onSelect, 
  onDelete,
  courseRef 
}: DraggableCourseProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COURSE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COURSE,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCourse(item.index, index);
        item.index = index;
      }
    },
  });

  const attachRef = (node: HTMLDivElement | null) => {
    drag(drop(node));
    if (courseRef) {
      courseRef(node);
    }
  };

  return (
    <div
      ref={attachRef}
      className={`flex items-center justify-between px-4 py-3 cursor-move transition-colors ${
        isSelected 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-foreground'
      }`}
      style={{ 
        borderRadius: 'var(--radius-card)',
        opacity: isDragging ? 0.5 : 1,
      }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <GripVertical className="w-5 h-5 cursor-grab" />
        <span 
          style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}
        >
          Course {course}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="hover:opacity-80"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

interface DraggableItemProps {
  item: DraftItem;
  index: number;
  courseIndex: number;
  moveItem: (dragIndex: number, hoverIndex: number, dragCourse: number, hoverCourse: number) => void;
  onIncrementQuantity: (itemId: string) => void;
  onDecrementQuantity: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onEditNotes: (itemId: string) => void;
  onEditModifiers: (itemId: string) => void;
}

function DraggableItem({ 
  item, 
  index, 
  courseIndex,
  moveItem, 
  onIncrementQuantity, 
  onDecrementQuantity, 
  onRemoveItem,
  onEditNotes,
  onEditModifiers
}: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { index, courseIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemTypes.ITEM,
    hover: (draggedItem: { index: number; courseIndex: number }) => {
      if (draggedItem.index !== index || draggedItem.courseIndex !== courseIndex) {
        moveItem(draggedItem.index, index, draggedItem.courseIndex, courseIndex);
        draggedItem.index = index;
        draggedItem.courseIndex = courseIndex;
      }
    },
  });

  const handleItemClick = () => {
    // Always allow editing - either modifiers+notes or just notes
    if (item.modifiers.length > 0) {
      onEditModifiers(item.id);
    } else {
      onEditNotes(item.id);
    }
  };

  return (
    <div 
      ref={(node) => drag(drop(node))}
      onClick={handleItemClick}
      className="bg-card border border-border p-4 cursor-pointer hover:border-primary/50"
      style={{ 
        borderRadius: 'var(--radius-card)',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab mt-1 shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                  {item.name}
                </p>
                {item.isComplimentary && (
                  <Badge 
                    className="bg-green-600 text-white px-2 py-0.5"
                    style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)' }}
                  >
                    COMP
                  </Badge>
                )}
              </div>
              {item.modifiers.length > 0 && (
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  {item.modifiers.join(', ')}
                </p>
              )}
              {item.notes && (
                <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-label)' }}>
                  Note: {item.notes}
                </p>
              )}
              {item.isComplimentary && item.compReason && (
                <p className="text-green-600 mt-1" style={{ fontSize: 'var(--text-label)' }}>
                  Comp Reason: {item.compReason}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveItem(item.id);
              }}
              className="text-destructive hover:opacity-80 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Stepper */}
            <div className="flex items-center gap-2 bg-muted px-2 py-1" style={{ borderRadius: 'var(--radius-small)' }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => onDecrementQuantity(item.id)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: 'var(--radius-small)' }}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span 
                className="w-8 text-center"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => onIncrementQuantity(item.id)}
                className="w-8 h-8 flex items-center justify-center hover:bg-background transition-colors"
                style={{ borderRadius: 'var(--radius-small)' }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <p className="text-primary" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmptyDropZoneProps {
  courseIndex: number;
  moveItem: (dragIndex: number, hoverIndex: number, dragCourse: number, hoverCourse: number) => void;
}

function EmptyDropZone({ courseIndex, moveItem }: EmptyDropZoneProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem: { index: number; courseIndex: number }) => {
      // Move item to this empty course at index 0
      moveItem(draggedItem.index, 0, draggedItem.courseIndex, courseIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={`ml-4 p-4 text-center transition-colors ${
        isOver ? 'bg-primary/10 border-primary' : 'bg-muted/50'
      }`} 
      style={{ 
        borderRadius: 'var(--radius-card)',
        border: isOver ? '2px dashed var(--primary)' : 'none',
      }}
    >
      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
        {isOver ? 'Drop item here' : 'No items in this course yet'}
      </p>
    </div>
  );
}

function MenuScreenContent({ checkId, onClose, onOpenPayment }: MenuScreenProps) {
  const { addItems, getCheckById, createKOT, items: allContextItems, getSplitBillByCheck } = useRestaurant();
  const snackbar = useSnackbar();
  const check = getCheckById(checkId);
  const splitBill = getSplitBillByCheck(checkId);
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftItems, setDraftItems] = useState<DraftItem[]>([]);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);
  const [courses, setCourses] = useState<number[]>([]);
  const [nextCourseNumber, setNextCourseNumber] = useState(1);
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [modifierNotes, setModifierNotes] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ courseNum: number; itemCount: number } | null>(null);
  const [orderNotes, setOrderNotes] = useState('');
  const [showOrderNotesDialog, setShowOrderNotesDialog] = useState(false);
  const [editingItemNotes, setEditingItemNotes] = useState<{ itemId: string; notes: string } | null>(null);
  const [editingItemModifiers, setEditingItemModifiers] = useState<{ itemId: string; menuItemId: string; currentModifiers: string[]; notes?: string } | null>(null);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  
  // Complimentary state for new items
  const [isNewItemComp, setIsNewItemComp] = useState(false);
  const [newItemCompReason, setNewItemCompReason] = useState('');
  const [newItemManagerPin, setNewItemManagerPin] = useState('');
  
  // Complimentary state for editing items
  const [isEditItemComp, setIsEditItemComp] = useState(false);
  const [editItemCompReason, setEditItemCompReason] = useState('');
  const [editItemManagerPin, setEditItemManagerPin] = useState('');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const courseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const categories = ['All', ...Array.from(new Set(MENU_ITEMS.map(item => item.category)))];

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Auto-scroll to active course when it changes
  useEffect(() => {
    const courseElement = courseRefs.current[activeCourse || 0];
    if (courseElement) {
      courseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeCourse]);

  const handleAddItem = (menuItem: typeof MENU_ITEMS[0]) => {
    // Always open the modifier dialog if the item has modifiers
    // OR if we want to allow notes/comp for items without modifiers
    setSelectedItemForModifiers(menuItem.id);
    setSelectedModifiers([]);
  };

  const handleConfirmModifiers = () => {
    const menuItem = MENU_ITEMS.find(item => item.id === selectedItemForModifiers);
    if (!menuItem) return;

    // Validate manager PIN if marking as comp
    if (isNewItemComp) {
      if (!newItemCompReason.trim()) {
        snackbar.error('Please provide a reason for complimentary item');
        return;
      }
      if (newItemManagerPin !== '1234') {
        snackbar.error('Invalid manager PIN');
        return;
      }
    }

    // Check if item with same modifiers and notes already exists in active course
    const modifiersString = selectedModifiers.sort().join(',');
    const existingItemIndex = draftItems.findIndex(
      item => item.menuItemId === menuItem.id && 
              item.course === activeCourse && 
              item.modifiers.sort().join(',') === modifiersString &&
              item.notes === (modifierNotes || undefined)
    );

    if (existingItemIndex !== -1) {
      // Increment quantity
      setDraftItems(prev => prev.map((item, index) => 
        index === existingItemIndex 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Add new item to active course (or no course if none selected)
      const newItem: DraftItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: isNewItemComp ? 0 : menuItem.price,
        modifiers: selectedModifiers,
        course: activeCourse,
        isTakeaway: false,
        notes: modifierNotes || undefined,
        quantity: 1,
        isComplimentary: isNewItemComp,
        compReason: isNewItemComp ? newItemCompReason : undefined,
      };
      setDraftItems(prev => [...prev, newItem]);
    }
    
    setSelectedItemForModifiers(null);
    setSelectedModifiers([]);
    setModifierNotes('');
    setIsNewItemComp(false);
    setNewItemCompReason('');
    setNewItemManagerPin('');
    
    if (activeCourse !== null) {
      snackbar.success(`${menuItem.name} added to Course ${activeCourse}`);
    } else {
      snackbar.success(`${menuItem.name} added`);
    }
  };

  const handleIncrementQuantity = (itemId: string) => {
    setDraftItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const handleDecrementQuantity = (itemId: string) => {
    setDraftItems(prev => prev.map(item => 
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setDraftItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleEditItemNotes = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    if (item) {
      setEditingItemNotes({ itemId, notes: item.notes || '' });
    }
  };

  const handleEditModifiers = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    if (item) {
      // Only allow editing if the item has available modifiers
      const menuItem = MENU_ITEMS.find(mi => mi.id === item.menuItemId);
      if (menuItem && menuItem.availableModifiers.length > 0) {
        setEditingItemModifiers({
          itemId: item.id,
          menuItemId: item.menuItemId,
          currentModifiers: item.modifiers,
        });
      }
    }
  };

  const handleSaveItemModifiers = () => {
    if (editingItemModifiers) {
      // Validate manager PIN if marking as comp
      if (isEditItemComp) {
        if (!editItemCompReason.trim()) {
          snackbar.error('Please provide a reason for complimentary item');
          return;
        }
        if (editItemManagerPin !== '1234') {
          snackbar.error('Invalid manager PIN');
          return;
        }
      }

      const modifiersString = editingItemModifiers.currentModifiers.sort().join(',');
      
      // Check if an item with the same modifiers already exists in the same course
      const editedItem = draftItems.find(i => i.id === editingItemModifiers.itemId);
      if (!editedItem) return;
      
      const existingItemIndex = draftItems.findIndex(
        item => item.id !== editingItemModifiers.itemId &&
                item.menuItemId === editingItemModifiers.menuItemId && 
                item.course === editedItem.course && 
                item.modifiers.sort().join(',') === modifiersString
      );

      if (existingItemIndex !== -1) {
        // Merge with existing item
        setDraftItems(prev => {
          const newItems = [...prev];
          newItems[existingItemIndex].quantity += editedItem.quantity;
          return newItems.filter(item => item.id !== editingItemModifiers.itemId);
        });
        snackbar.success('Item merged with existing item');
      } else {
        // Update modifiers and comp status
        setDraftItems(prev => prev.map(item => 
          item.id === editingItemModifiers.itemId
            ? { 
                ...item, 
                modifiers: editingItemModifiers.currentModifiers,
                isComplimentary: isEditItemComp,
                compReason: isEditItemComp ? editItemCompReason : undefined,
                price: isEditItemComp ? 0 : MENU_ITEMS.find(mi => mi.id === item.menuItemId)?.price || item.price
              }
            : item
        ));
        snackbar.success('Item updated');
      }
      
      setEditingItemModifiers(null);
      setIsEditItemComp(false);
      setEditItemCompReason('');
      setEditItemManagerPin('');
    }
  };

  const handleSaveItemNotes = () => {
    if (editingItemNotes) {
      // Validate manager PIN if marking as comp
      if (isEditItemComp) {
        if (!editItemCompReason.trim()) {
          snackbar.error('Please provide a reason for complimentary item');
          return;
        }
        if (editItemManagerPin !== '1234') {
          snackbar.error('Invalid manager PIN');
          return;
        }
      }

      setDraftItems(prev => prev.map(item => 
        item.id === editingItemNotes.itemId
          ? { 
              ...item, 
              notes: editingItemNotes.notes || undefined,
              isComplimentary: isEditItemComp,
              compReason: isEditItemComp ? editItemCompReason : undefined,
              price: isEditItemComp ? 0 : MENU_ITEMS.find(mi => mi.id === item.menuItemId)?.price || item.price
            }
          : item
      ));
      setEditingItemNotes(null);
      setIsEditItemComp(false);
      setEditItemCompReason('');
      setEditItemManagerPin('');
      snackbar.success('Item updated');
    }
  };

  const handleDeleteCourseClick = (courseNum: number) => {
    const itemsInCourse = draftItems.filter(item => item.course === courseNum);
    
    if (itemsInCourse.length === 0) {
      // Empty course - delete immediately
      deleteCourse(courseNum);
    } else {
      // Has items - show confirmation
      setDeleteConfirmation({ courseNum, itemCount: itemsInCourse.length });
    }
  };

  const deleteCourse = (courseNum: number) => {
    // Remove all items in this course
    setDraftItems(prev => prev.filter(item => item.course !== courseNum));
    
    // Remove course from list
    const newCourses = courses.filter(c => c !== courseNum);
    setCourses(newCourses);
    
    // Update active course if needed
    if (activeCourse === courseNum) {
      if (newCourses.length > 0) {
        // Select the last remaining course
        setActiveCourse(newCourses[newCourses.length - 1]);
      } else {
        // No courses left, set active course to null
        setActiveCourse(null);
      }
    }
    
    snackbar.success(`Course ${courseNum} deleted`);
  };

  const confirmDeleteCourse = () => {
    if (deleteConfirmation) {
      deleteCourse(deleteConfirmation.courseNum);
      setDeleteConfirmation(null);
    }
  };

  const handleAddCourse = () => {
    const newCourse = nextCourseNumber;
    
    // Add to end of courses list
    setCourses(prev => [...prev, newCourse]);
    
    // Make it the active course
    setActiveCourse(newCourse);
    
    // If there are items without a course, assign them to this new course
    if (itemsWithoutCourse.length > 0) {
      setDraftItems(prev => prev.map(item => 
        item.course === null ? { ...item, course: newCourse } : item
      ));
    }
    
    // Increment for next course
    setNextCourseNumber(prev => prev + 1);
  };

  const moveCourse = (dragIndex: number, hoverIndex: number) => {
    const newCourses = [...courses];
    const [draggedCourse] = newCourses.splice(dragIndex, 1);
    newCourses.splice(hoverIndex, 0, draggedCourse);
    setCourses(newCourses);
  };

  const moveItem = (dragIndex: number, hoverIndex: number, dragCourse: number, hoverCourse: number) => {
    setDraftItems(prev => {
      const newItems = [...prev];
      
      // Get items for each course
      const dragCourseItems = newItems.filter(item => item.course === courses[dragCourse]);
      const hoverCourseItems = newItems.filter(item => item.course === courses[hoverCourse]);
      
      // Get the dragged item
      const draggedItem = dragCourseItems[dragIndex];
      
      if (dragCourse === hoverCourse) {
        // Moving within the same course
        const itemsInCourse = newItems.filter(item => item.course === courses[dragCourse]);
        const otherItems = newItems.filter(item => item.course !== courses[dragCourse]);
        
        itemsInCourse.splice(dragIndex, 1);
        itemsInCourse.splice(hoverIndex, 0, draggedItem);
        
        return [...otherItems, ...itemsInCourse];
      } else {
        // Moving to a different course
        const updatedItem = { ...draggedItem, course: courses[hoverCourse] };
        
        // Remove from drag course
        const dragCourseUpdated = dragCourseItems.filter((_, i) => i !== dragIndex);
        
        // Add to hover course
        const hoverCourseUpdated = [...hoverCourseItems];
        hoverCourseUpdated.splice(hoverIndex, 0, updatedItem);
        
        // Get all items not in either course
        const otherItems = newItems.filter(
          item => item.course !== courses[dragCourse] && item.course !== courses[hoverCourse]
        );
        
        return [...otherItems, ...dragCourseUpdated, ...hoverCourseUpdated];
      }
    });
  };

  const handlePrintKOT = () => {
    if (draftItems.length === 0) {
      snackbar.error('No items to send');
      return;
    }

    // Generate a unique batch ID for this send action to track which items were sent together
    const batchId = `BATCH-${Date.now()}`;
    console.log('[MenuScreen] Generated batchId:', batchId, 'for', draftItems.length, 'items');

    // Expand items based on quantity
    const expandedItems: any[] = [];
    draftItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: 1, // Each expanded item is quantity 1
          modifiers: item.modifiers,
          course: item.course,
          status: 'SENT' as const,
          isTakeaway: item.isTakeaway,
          notes: item.notes,
          batchId: batchId, // Add batch ID to track which send action this belongs to
          isComplimentary: item.isComplimentary,
          compReason: item.compReason,
        });
      }
    });

    console.log('[MenuScreen] Expanded items:', expandedItems);

    // Add items to check and get their IDs
    const newItemIds = addItems(checkId, expandedItems);
    
    console.log('[MenuScreen] New item IDs from context:', newItemIds);
    
    // Create KOT/BOT with the newly added item IDs
    if (newItemIds.length > 0) {
      // Get courses if any items have course numbers
      const itemsWithCourse = draftItems.filter(item => item.course !== null);
      const course = itemsWithCourse.length > 0 ? itemsWithCourse[0].course : undefined;
      
      console.log('[MenuScreen] Creating KOT with', newItemIds.length, 'items, course:', course);
      createKOT(checkId, newItemIds, course);
      
      // Determine which stations the items are going to
      const stations = new Set<string>();
      draftItems.forEach(item => {
        const menuItem = MENU_ITEMS.find(mi => mi.id === item.menuItemId);
        if (menuItem) {
          const station = getCategoryRoute(menuItem.category);
          stations.add(station);
        }
      });
      
      // Show appropriate snackbar message
      if (stations.has('KITCHEN') && stations.has('BAR')) {
        snackbar.success('Order sent to kitchen and bar');
      } else if (stations.has('BAR')) {
        snackbar.success('Order sent to bar');
      } else {
        snackbar.success('Order sent to kitchen');
      }
    }
    
    onClose();
  };

  const handleSaveKOT = () => {
    if (draftItems.length === 0) {
      snackbar.error('No items to save');
      return;
    }

    // Expand items based on quantity
    const expandedItems: any[] = [];
    draftItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          quantity: 1, // Each expanded item is quantity 1
          modifiers: item.modifiers,
          course: item.course,
          status: 'HELD' as const,
          isTakeaway: item.isTakeaway,
          notes: item.notes,
          isComplimentary: item.isComplimentary,
          compReason: item.compReason,
        });
      }
    });

    addItems(checkId, expandedItems);
    snackbar.success('Order saved as held');
    onClose();
  };

  const handlePaymentClick = () => {
    // If there are unsent items, show confirmation
    if (draftItems.length > 0) {
      setShowPaymentConfirm(true);
    } else {
      // No unsent items, just close menu screen which will show the check screen with payment option
      onClose();
    }
  };

  const handleConfirmSendAndPay = () => {
    if (draftItems.length === 0) return;

    // Expand items based on quantity
    const expandedItems: any[] = [];
    draftItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        expandedItems.push({
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          modifiers: item.modifiers,
          course: item.course,
          status: 'SENT' as const,
          isTakeaway: item.isTakeaway,
          notes: item.notes,
        });
      }
    });

    // Add items to check and get their IDs
    const newItemIds = addItems(checkId, expandedItems);
    
    // Create KOT/BOT with the newly added item IDs
    if (newItemIds.length > 0) {
      // Get courses if any items have course numbers
      const itemsWithCourse = draftItems.filter(item => item.course !== null);
      const course = itemsWithCourse.length > 0 ? itemsWithCourse[0].course : undefined;
      
      createKOT(checkId, newItemIds, course);
      
      // Determine which stations the items are going to
      const stations = new Set<string>();
      draftItems.forEach(item => {
        const menuItem = MENU_ITEMS.find(mi => mi.id === item.menuItemId);
        if (menuItem) {
          const station = getCategoryRoute(menuItem.category);
          stations.add(station);
        }
      });
      
      // Show appropriate snackbar message
      if (stations.has('KITCHEN') && stations.has('BAR')) {
        snackbar.success('Order sent to kitchen and bar');
      } else if (stations.has('BAR')) {
        snackbar.success('Order sent to bar');
      } else {
        snackbar.success('Order sent to kitchen');
      }
    }
    
    setShowPaymentConfirm(false);
    onClose();
    if (onOpenPayment) {
      onOpenPayment();
    }
  };

  const selectedMenuItem = selectedItemForModifiers 
    ? MENU_ITEMS.find(item => item.id === selectedItemForModifiers)
    : null;

  const draftTotal = draftItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Get quantity of a menu item across all courses for display
  const getMenuItemQuantity = (menuItemId: string) => {
    return draftItems
      .filter(item => item.menuItemId === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get items without courses
  const itemsWithoutCourse = draftItems.filter(item => item.course === null);

  // Group items by course for display (show all courses, even empty ones)
  const itemsByCourse = courses.map((course, index) => ({
    course,
    courseIndex: index,
    items: draftItems.filter(item => item.course === course),
  }));

  const totalItemCount = draftItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Top Bar */}
        <div className="h-[72px] bg-card border-b border-border px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="lg" onClick={onClose} className="h-[48px]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>Menu</h2>
          </div>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[48px] pl-10"
                style={{ borderRadius: 'var(--radius-input)' }}
              />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left - Categories */}
          <div className="w-[160px] border-r border-border bg-muted shrink-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'}
                    className="w-full justify-start h-[48px] text-left"
                    onClick={() => setSelectedCategory(category)}
                    style={{ borderRadius: 'var(--radius-button)', fontSize: 'var(--text-p)' }}
                  >
                    <span className="truncate">{category}</span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Center - Menu Items OR Modifier Selection */}
          <div className="flex-1">
            {/* Menu Items Grid */}
            <ScrollArea className="h-full">
              <div className="p-6 grid grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredItems.map(item => {
                  const quantity = getMenuItemQuantity(item.id);
                  const isAdded = quantity > 0;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleAddItem(item)}
                      className={`relative bg-card border p-5 text-left hover:border-primary hover:shadow-[var(--elevation-sm)] transition-all cursor-pointer h-[140px] flex flex-col ${
                        isAdded ? 'border-primary bg-primary/5' : 'border-border'
                      }`}
                      style={{ borderRadius: 'var(--radius-card)' }}
                    >
                      {isAdded && (
                        <div 
                          className="absolute top-3 right-3 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}
                        >
                          {quantity}
                        </div>
                      )}
                      <h3 
                        style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }} 
                        className="mb-2 line-clamp-2"
                      >
                        {item.name}
                      </h3>
                      <div className="mt-auto">
                        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)' }} className="text-primary">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="w-[420px] border-l border-border bg-background shrink-0 flex flex-col">
            {/* Order Summary Header - Fixed */}
            <div className="p-6 border-b border-border shrink-0">
              <div className="flex items-center justify-between">
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Order Items ({totalItemCount})
                </h3>
                {check?.tableId && (
                  <Badge 
                    className="bg-primary text-primary-foreground px-4 py-2"
                    style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-button)' }}
                  >
                    Table {check.tableId.split('-')[1]}
                  </Badge>
                )}
              </div>
            </div>

            {/* Course Items - Scrollable */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full" ref={scrollAreaRef}>
                <div className="p-6 space-y-4">
                  {/* Items without Course - show when no courses exist */}
                  {courses.length === 0 && itemsWithoutCourse.length > 0 && (
                    <div className="space-y-2">
                      {itemsWithoutCourse.map((item, itemIndex) => (
                        <DraggableItem
                          key={item.id}
                          item={item}
                          index={itemIndex}
                          courseIndex={-1}
                          moveItem={() => {}}
                          onIncrementQuantity={handleIncrementQuantity}
                          onDecrementQuantity={handleDecrementQuantity}
                          onRemoveItem={handleRemoveItem}
                          onEditNotes={handleEditItemNotes}
                          onEditModifiers={handleEditModifiers}
                        />
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {courses.length === 0 && itemsWithoutCourse.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--text-p)' }}>
                        No items added yet
                      </p>
                    </div>
                  )}

                  {/* Course sections */}
                  {itemsByCourse.map(({ course, courseIndex, items }) => (
                    <div key={course} className="space-y-3">
                      {/* Course Header */}
                      <DraggableCourse
                        course={course}
                        index={courseIndex}
                        moveCourse={moveCourse}
                        isSelected={activeCourse === course}
                        onSelect={() => setActiveCourse(course)}
                        onDelete={() => handleDeleteCourseClick(course)}
                        courseRef={(el) => { courseRefs.current[course] = el; }}
                      />

                      {/* Course Items or Empty State */}
                      {items.length === 0 ? (
                        <EmptyDropZone courseIndex={courseIndex} moveItem={moveItem} />
                      ) : (
                        <div className="space-y-2 ml-4">
                          {items.map((item, itemIndex) => (
                            <DraggableItem
                              key={item.id}
                              item={item}
                              index={itemIndex}
                              courseIndex={courseIndex}
                              moveItem={moveItem}
                              onIncrementQuantity={handleIncrementQuantity}
                              onDecrementQuantity={handleDecrementQuantity}
                              onRemoveItem={handleRemoveItem}
                              onEditNotes={handleEditItemNotes}
                              onEditModifiers={handleEditModifiers}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Total and Actions - STICKY/FIXED */}
            <div className="border-t border-border bg-background p-6 space-y-4 shrink-0">
              {/* Split Bill Compact Section */}
              {splitBill && splitBill.splits.length > 0 && (
                <div className="p-4 rounded-lg border border-border bg-muted/30" style={{ borderRadius: 'var(--radius-card)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)' }} className="text-muted-foreground">
                      BILL SPLIT
                    </span>
                    <Badge 
                      variant="outline" 
                      className="bg-primary/10 text-primary border-primary"
                      style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)' }}
                    >
                      {splitBill.splits.length} {splitBill.splits.length === 1 ? 'Split' : 'Splits'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {splitBill.splits.map((split, index) => {
                      const splitTotal = Object.entries(splitBill.allocations).reduce((sum, [itemId, allocations]) => {
                        return sum + (allocations[split.id] || 0);
                      }, 0);
                      
                      return (
                        <div key={split.id} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-medium)' }}>
                              {split.name}
                            </span>
                            {split.paid && (
                              <Badge 
                                className="bg-green-100 text-green-700 border-green-300"
                                style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}
                              >
                                Paid
                              </Badge>
                            )}
                          </div>
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                            {formatCurrency(splitTotal)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Total */}
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Total
                </span>
                <span style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }} className="text-primary">
                  {formatCurrency(draftTotal)}
                </span>
              </div>

              <Separator />

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowOrderNotesDialog(true)}
                  className="h-[56px]"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <FileText className="w-5 h-5" />
                  Notes
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddCourse}
                  className="h-[56px]"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <Plus className="w-5 h-5" />
                  Add Course
                </Button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="space-y-3">
                {/* First Row: Save KOT */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSaveKOT}
                  disabled={draftItems.length === 0}
                  className="h-[56px] w-full"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save KOT
                </Button>
                
                {/* Second Row: Send Item & Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    size="lg"
                    onClick={handlePrintKOT}
                    disabled={draftItems.length === 0}
                    className="h-[56px] bg-primary hover:bg-primary/90"
                    style={{ borderRadius: 'var(--radius-button)' }}
                  >
                    <Printer className="w-5 h-5 mr-2" />
                    Send Item
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePaymentClick}
                    disabled={draftItems.length === 0}
                    className="h-[56px] bg-primary hover:bg-primary/90"
                    style={{ borderRadius: 'var(--radius-button)' }}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmation} onOpenChange={() => setDeleteConfirmation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Delete Course {deleteConfirmation?.courseNum}?
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              This course contains {deleteConfirmation?.itemCount} item{deleteConfirmation?.itemCount !== 1 ? 's' : ''}. 
              All items will be removed. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmation(null)}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCourse}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Notes Dialog */}
      <Dialog open={showOrderNotesDialog} onOpenChange={setShowOrderNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Order Notes
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Add notes for this entire order (attached to KOT)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter order notes..."
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="min-h-[120px]"
            style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrderNotesDialog(false)}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowOrderNotesDialog(false);
                snackbar.success('Order notes saved');
              }}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Notes Dialog */}
      <Dialog open={!!editingItemNotes} onOpenChange={() => {
        setEditingItemNotes(null);
        setIsEditItemComp(false);
        setEditItemCompReason('');
        setEditItemManagerPin('');
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Item Notes
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Add special instructions for this item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="e.g., No onions, extra spicy..."
              value={editingItemNotes?.notes || ''}
              onChange={(e) => setEditingItemNotes(prev => prev ? { ...prev, notes: e.target.value } : null)}
              className="min-h-[120px]"
              style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
            />
            
            {/* Complimentary Section */}
            <div className="space-y-3 pt-2 border-t border-border">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={isEditItemComp}
                  onCheckedChange={(checked) => setIsEditItemComp(checked as boolean)}
                />
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Mark as Complimentary
                </span>
              </label>
              
              {isEditItemComp && (
                <div className="space-y-3 pl-7">
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                      Reason for Complimentary *
                    </label>
                    <Input
                      placeholder="e.g., Birthday celebration, Service recovery..."
                      value={editItemCompReason}
                      onChange={(e) => setEditItemCompReason(e.target.value)}
                      className="h-[48px]"
                      style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                      Manager PIN *
                    </label>
                    <Input
                      type="password"
                      placeholder="Enter manager PIN"
                      value={editItemManagerPin}
                      onChange={(e) => setEditItemManagerPin(e.target.value)}
                      className="h-[48px]"
                      style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingItemNotes(null);
                setIsEditItemComp(false);
                setEditItemCompReason('');
                setEditItemManagerPin('');
              }}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItemNotes}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Modifiers Dialog */}
      <Dialog open={!!editingItemModifiers} onOpenChange={() => setEditingItemModifiers(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Edit Modifiers & Notes
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Modify the selected item's modifiers and notes
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4">
              {/* Modifiers Grid */}
              <div className="space-y-3">
                <h4 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Select Modifiers
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {editingItemModifiers && MENU_ITEMS.find(mi => mi.id === editingItemModifiers.menuItemId)?.availableModifiers.map(modifier => {
                    const modifierName = typeof modifier === 'string' ? modifier : modifier.name;
                    const modifierPrice = typeof modifier === 'string' ? null : modifier.price;
                    const isChecked = editingItemModifiers.currentModifiers.includes(modifierName);
                    
                    return (
                      <label
                        key={modifierName}
                        className={`relative flex flex-col p-5 bg-card cursor-pointer transition-all ${
                          isChecked ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                        style={{ 
                          borderRadius: 'var(--radius-card)',
                          border: isChecked ? '2px solid var(--primary)' : '1px solid var(--neutral-10)'
                        }}
                      >
                        {modifierPrice && (
                          <div 
                            className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1" 
                            style={{ 
                              fontSize: 'var(--text-label)', 
                              fontWeight: 'var(--font-weight-bold)',
                              borderBottomLeftRadius: 'var(--radius-small)'
                            }}
                          >
                            + {formatCurrency(modifierPrice)}
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setEditingItemModifiers(prev => prev ? { ...prev, currentModifiers: [...prev.currentModifiers, modifierName] } : null);
                              } else {
                                setEditingItemModifiers(prev => prev ? { ...prev, currentModifiers: prev.currentModifiers.filter(m => m !== modifierName) } : null);
                              }
                            }}
                          />
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }} className="flex-1 pr-2">
                            {modifierName}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h4 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Item Notes (Optional)
                </h4>
                <Textarea
                  placeholder="e.g., No onions, extra spicy..."
                  value={editingItemModifiers?.notes || ''}
                  onChange={(e) => setEditingItemModifiers(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="min-h-[100px]"
                  style={{ 
                    borderRadius: 'var(--radius-input)', 
                    fontSize: 'var(--text-p)',
                    border: '1px solid var(--neutral-10)'
                  }}
                />
              </div>

              {/* Complimentary Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={isEditItemComp}
                    onCheckedChange={(checked) => setIsEditItemComp(checked as boolean)}
                  />
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Mark as Complimentary
                  </span>
                </label>
                
                {isEditItemComp && (
                  <div className="space-y-3 pl-7">
                    <div className="space-y-2">
                      <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                        Reason for Complimentary *
                      </label>
                      <Input
                        placeholder="e.g., Birthday celebration, Service recovery..."
                        value={editItemCompReason}
                        onChange={(e) => setEditItemCompReason(e.target.value)}
                        className="h-[48px]"
                        style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                        Manager PIN *
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter manager PIN"
                        value={editItemManagerPin}
                        onChange={(e) => setEditItemManagerPin(e.target.value)}
                        className="h-[48px]"
                        style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditingItemModifiers(null);
                setIsEditItemComp(false);
                setEditItemCompReason('');
                setEditItemManagerPin('');
              }}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveItemModifiers}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modifier Selection Dialog (for adding new items) */}
      <Dialog open={!!selectedItemForModifiers} onOpenChange={(open) => !open && setSelectedItemForModifiers(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              {selectedMenuItem?.name}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Select modifiers and add notes for this item
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4 py-4">
              {/* Price */}
              {selectedMenuItem && (
                <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }} className="text-primary">
                  {formatCurrency(selectedMenuItem.price)}
                </p>
              )}

              {/* Modifiers Grid */}
              <div className="space-y-3">
                <h4 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Select Modifiers
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedMenuItem?.availableModifiers.map(modifier => {
                    const modifierName = typeof modifier === 'string' ? modifier : modifier.name;
                    const modifierPrice = typeof modifier === 'string' ? null : modifier.price;
                    const isChecked = selectedModifiers.includes(modifierName);
                    
                    return (
                      <label
                        key={modifierName}
                        className={`relative flex flex-col p-5 bg-card cursor-pointer transition-all ${
                          isChecked ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                        }`}
                        style={{ 
                          borderRadius: 'var(--radius-card)',
                          border: isChecked ? '2px solid var(--primary)' : '1px solid var(--neutral-10)'
                        }}
                      >
                        {modifierPrice && (
                          <div 
                            className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1" 
                            style={{ 
                              fontSize: 'var(--text-label)', 
                              fontWeight: 'var(--font-weight-bold)',
                              borderBottomLeftRadius: 'var(--radius-small)'
                            }}
                          >
                            + {formatCurrency(modifierPrice)}
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedModifiers(prev => [...prev, modifierName]);
                              } else {
                                setSelectedModifiers(prev => prev.filter(m => m !== modifierName));
                              }
                            }}
                          />
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }} className="flex-1 pr-2">
                            {modifierName}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <h4 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                  Item Notes (Optional)
                </h4>
                <Textarea
                  placeholder="e.g., No onions, extra spicy..."
                  value={modifierNotes}
                  onChange={(e) => setModifierNotes(e.target.value)}
                  className="min-h-[100px]"
                  style={{ 
                    borderRadius: 'var(--radius-input)', 
                    fontSize: 'var(--text-p)',
                    border: '1px solid var(--neutral-10)'
                  }}
                />
              </div>

              {/* Complimentary Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={isNewItemComp}
                    onCheckedChange={(checked) => setIsNewItemComp(checked as boolean)}
                  />
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Mark as Complimentary
                  </span>
                </label>
                
                {isNewItemComp && (
                  <div className="space-y-3 pl-7">
                    <div className="space-y-2">
                      <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                        Reason for Complimentary *
                      </label>
                      <Input
                        placeholder="e.g., Birthday celebration, Service recovery..."
                        value={newItemCompReason}
                        onChange={(e) => setNewItemCompReason(e.target.value)}
                        className="h-[48px]"
                        style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                        Manager PIN *
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter manager PIN"
                        value={newItemManagerPin}
                        onChange={(e) => setNewItemManagerPin(e.target.value)}
                        className="h-[48px]"
                        style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                        maxLength={4}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedItemForModifiers(null);
                setSelectedModifiers([]);
                setModifierNotes('');
                setIsNewItemComp(false);
                setNewItemCompReason('');
                setNewItemManagerPin('');
              }}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmModifiers}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              <Plus className="w-5 h-5" />
              {activeCourse !== null ? `Add to Course ${activeCourse}` : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentConfirm} onOpenChange={setShowPaymentConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Send and Pay
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              This will send the order to the kitchen and open the payment screen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPaymentConfirm(false)}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSendAndPay}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Send and Pay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MenuScreen(props: MenuScreenProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <MenuScreenContent {...props} />
    </DndProvider>
  );
}