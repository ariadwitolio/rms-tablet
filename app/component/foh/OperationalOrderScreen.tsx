import { useState, useEffect, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useNavigate } from 'react-router';
import { MainBtn } from '../ui/MainBtn';
import { QuantityStepper } from '../ui/QuantityStepper';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import { TextField } from '../ui/TextField';
import { TextAreaField } from '../ui/TextAreaField';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { CompModal } from './CompModal';
import { ItemModal } from './ItemModal';
import { SelectionIndicator } from '../labamu/SelectionIndicator';
import { useSnackbar } from '../labamu/Snackbar';
import { SelectableCard } from '../ui/SelectableCard';
import { Button } from '../ui/button';
import { StatusTag } from '../ui/StatusTag';
import searchSvgPaths from '../../../imports/svg-1iqr16jqtt';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  Search, 
  Save, 
  Plus, 
  Printer, 
  Trash2, 
  X, 
  Minus, 
  GripVertical, 
  FileText, 
  Check, 
  CreditCard,
  MoreVertical,
  Receipt,
  Users,
  ArrowRightLeft,
  AlertCircle,
  Flame,
  Gift,
  Circle,
  Settings,
  StickyNote,
  UserCog,
  Replace,
  Share2,
  DollarSign,
  Percent,
  Edit2,
  MessageSquare,
  ChevronDown,
  Loader2,
  WifiOff,
  CheckCircle2,
  XCircle,
  HandCoins,
  ShoppingBag,
} from 'lucide-react';
import ArrowLeft from '../../../imports/ArrowLeft';
import { EmptyState } from '../ui/EmptyState';
import { MENU_ITEMS, TABLES, getCategoryRoute } from '../../data/mockData';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import type { Item, Course, ItemStatus, Table } from '../../types';
import { DineInCheckHeader } from './DineInCheckHeader';
import svgPaths from '../../../imports/svg-0mbrad7amz';
import MergeTablesModal from './MergeTablesModal';
import SplitBillCompactSection from './SplitBillCompactSection';
import NoResultNotFound2 from '../../../imports/NoResultNotFound2';
import { useVirtualInputContext } from '../../context/VirtualInputContext';

// SearchBar Component Helpers
function SearchIconGroup() {
  return (
    <div className="absolute inset-[15.46%_15.25%_15.29%_15.5%]">
      <div className="absolute inset-[-3.61%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.8199 17.8201">
          <g>
            <path d={searchSvgPaths.pa03580} stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            <path d={searchSvgPaths.p268f5080} stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function CloseIconGroup() {
  return (
    <div className="absolute inset-[12.5%]">
      <div className="absolute inset-[-3.33%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2001 19.2001">
          <g>
            <path d={searchSvgPaths.p2e285500} stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
            <path d={searchSvgPaths.p151c31a0} stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
            <path d={searchSvgPaths.p3b8ccc17} stroke="var(--stroke-0, #A9A9A9)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    </div>
  );
}

interface InteractiveSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasCourse?: boolean;
}

function InteractiveSearchBar({ value, onChange, placeholder = "Search menu items...", hasCourse = false }: InteractiveSearchBarProps) {
  const handleClear = () => {
    onChange('');
  };
  const ctx = useVirtualInputContext();

  return (
    <div className={`bg-[#f4f4f4] h-[44px] relative rounded-[8px] ${hasCourse ? '' : 'flex-1'}`} style={{ width: hasCourse ? 'calc(100% - 220px)' : '100%' }}>
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] py-[2px] relative w-full h-full">
          <div className="content-stretch flex flex-1 gap-[8px] items-center min-h-px min-w-px relative">
            <div className="relative shrink-0 size-[24px]">
              <SearchIconGroup />
            </div>
            <input
              type="text"
              readOnly
              value={value}
              onPointerDown={(e) => { e.preventDefault(); ctx.openFor('text', value, onChange, e.currentTarget); }}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none font-['Lato:Regular',sans-serif] leading-[22px] not-italic text-[#282828] text-[16px] tracking-[0.11px] placeholder:text-[#a9a9a9]"
              style={{ cursor: 'pointer' }}
            />
          </div>
          {value && (
            <button 
              onClick={handleClear}
              className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-70 transition-opacity"
              aria-label="Clear search"
            >
              <CloseIconGroup />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Alias Item as DraftItem for compatibility
type DraftItem = Item;

// Combined item interface for grouping items with same configuration but different statuses
interface CombinedItem {
  id: string; // ID of the first item in the group
  menuItemId?: string;
  name: string;
  price: number;
  modifiers: string[];
  courseId?: string;
  isTakeaway: boolean;
  notes?: string;
  isComplimentary?: boolean;
  compReason?: string;
  isVoided?: boolean; // Track if any items are voided
  voidReason?: string;
  discountType?: 'PERCENTAGE' | 'FIXED';
  discountValue?: number;
  dineType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  packagingPrice?: number;
  
  // Status quantities
  isDraft: boolean; // True if this is a DRAFT-only group
  draftQty: number;
  sentQty: number;
  inPrepQty: number;
  readyQty: number;
  servedQty: number;
  voidedQty: number; // Track voided quantity
  
  // Item IDs by status for actions
  draftItemIds: string[];
  sentItemIds: string[];
  inPrepItemIds: string[];
  readyItemIds: string[];
  servedItemIds: string[];
  voidedItemIds: string[];
}

interface OperationalOrderScreenProps {
  checkId: string;
  onClose: () => void;
  onOpenPayment?: () => void;
  onOpenSplitBill?: () => void;
  autoPrintBill?: boolean;
}

const ItemTypes = {
  COURSE: 'course',
  ITEM: 'item',
};

// Helper function to calculate discounted price
function getItemPrice(item: any): number {
  if (item.isComplimentary) return 0;
  if (item.isVoided) return 0; // Voided items have no price
  if (!item.discountType || !item.discountValue) return item.price;
  
  if (item.discountType === 'PERCENTAGE') {
    return item.price * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, item.price - item.discountValue);
  }
}

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    SENT: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Sent' },
    IN_PREP: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'In Prep' },
    READY: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ready' },
    SERVED: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Served' },
    HELD: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Held' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SENT;

  return (
    <Badge 
      className={`${config.bg} ${config.text} px-2 py-0.5`}
      style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)', borderRadius: 'var(--radius-small)' }}
    >
      {config.label}
    </Badge>
  );
}

// Draggable Item Component - now supports combined items
function DraggableItemCard({ 
  item, 
  courseId,
  isFired,
  onEdit, 
  onRemove, 
  onIncrementQuantity, 
  onDecrementQuantity,
  onMove,
  onMarkServed,
}: { 
  item: CombinedItem; 
  courseId: string | null;
  isFired?: boolean;
  onEdit: () => void; 
  onRemove: () => void;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  onMove: (itemId: string, targetCourseId: string | null) => void;
  onMarkServed?: () => void;
}) {
  // An item can be dragged only if it hasn't been fired (no quantities in sent/inPrep/ready/served)
  const canDrag = item.sentQty === 0 && item.inPrepQty === 0 && item.readyQty === 0 && item.servedQty === 0;
  
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ITEM,
    item: { id: item.id, courseId },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Removed drop handler - all drops now handled at course section level

  // Determine if we should show the bar and what color
  // Green bar if ANY quantity is READY, blue bar if DRAFT only
  const showBar = item.isDraft || item.readyQty > 0;
  const barColor = item.readyQty > 0 ? 'bg-green-600' : 'bg-primary';

  // Build combined status text (e.g., "1x Served | 2x Ready | 1x In Prep | 3x Sent to Bar")
  const buildStatusText = () => {
    const parts: string[] = [];
    if (item.servedQty > 0) parts.push(`${item.servedQty}x Served`);
    if (item.readyQty > 0) parts.push(`${item.readyQty}x Ready`);
    if (item.inPrepQty > 0) parts.push(`${item.inPrepQty}x In Prep`);
    if (item.sentQty > 0) {
      // Determine station based on category
      const menuItem = item.menuItemId ? MENU_ITEMS.find(mi => mi.id === item.menuItemId) : null;
      const station = menuItem?.category === 'Beverages' ? 'Bar' : 'Kitchen';
      parts.push(`${item.sentQty}x Sent to ${station}`);
    }
    if (item.voidedQty > 0) parts.push(`${item.voidedQty}x Voided`);
    return parts.join(' | ');
  };

  const statusText = buildStatusText();
  const totalQty = item.draftQty + item.sentQty + item.inPrepQty + item.readyQty + item.servedQty;
  const totalPrice = item.isComplimentary ? 0 : item.price * totalQty;

  return (
    <div 
      ref={(node) => canDrag ? drag(node) : node}
      className={`bg-white relative cursor-pointer transition-colors ${isDragging ? 'opacity-50' : ''}`}
      style={{ 
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: showBar ? '12px 16px 12px 12px' : '12px 16px',
        overflow: 'hidden',
        minHeight: 70,
        display: 'flex',
        alignItems: 'stretch',
      }}
      onClick={onEdit}
    >
      {/* Vertical indicator bar - DRAFT (blue) or READY (green) */}
      {showBar && (
        <div 
          className={`absolute left-0 top-0 bottom-0 ${barColor}`}
          style={{ width: '6px', borderRadius: 'var(--radius-small)' }}
        />
      )}
      
      {/* Main 2-column layout */}
      <div className="flex gap-3 items-center" style={{ marginLeft: showBar ? '8px' : '0', width: '100%' }}>
        {/* LEFT COLUMN: name · modifier · notes · price */}
        <div className="flex-1 min-w-0 flex flex-col" style={{ gap: 2 }}>
          {/* Item name + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <p
              style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}
              className={`min-w-0 truncate${item.isVoided ? ' text-muted-foreground line-through' : ''}`}
            >
              {!item.isDraft && `${totalQty}x `}{item.name}
            </p>
            {item.dineType === 'TAKEAWAY' && (
              <span
                title="Takeaway"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20, borderRadius: 'var(--radius-small)',
                  backgroundColor: '#ff9100', flexShrink: 0,
                }}
              >
                <ShoppingBag style={{ width: 12, height: 12, color: '#ffffff' }} />
              </span>
            )}
            {item.isComplimentary && (
              <Badge style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)', backgroundColor: 'var(--chart-2)', color: 'white', padding: '2px 6px' }}>COMP</Badge>
            )}
            {item.isVoided && (
              <Badge style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)', backgroundColor: 'var(--status-red-primary)', color: 'white', padding: '2px 6px' }}>VOID</Badge>
            )}
            {item.dineType === 'DELIVERY' && (
              <Badge style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)', backgroundColor: 'var(--feature-brand-primary)', color: 'white', padding: '2px 6px' }}>DELIVERY</Badge>
            )}
          </div>

          {/* Modifier */}
          {item.isDraft ? (
            item.modifiers.length > 0 && (
              <p className="text-muted-foreground italic" style={{ fontSize: 'var(--text-p)' }}>
                {item.modifiers.join(', ')}
              </p>
            )
          ) : (
            item.modifiers.length > 0 && (
              <p className="text-muted-foreground italic" style={{ fontSize: 'var(--text-p)' }}>
                {item.modifiers.join(', ')}
              </p>
            )
          )}

          {/* Notes */}
          {item.notes && (
            <p className="text-muted-foreground italic" style={{ fontSize: 'var(--text-p)' }}>
              Notes: {item.notes}
            </p>
          )}

          {/* Comp reason */}
          {item.isComplimentary && item.compReason && (
            <p className="text-green-600" style={{ fontSize: 'var(--text-p)' }}>Comp: {item.compReason}</p>
          )}

          {/* Void reason */}
          {item.isVoided && item.voidReason && (
            <p className="text-red-600" style={{ fontSize: 'var(--text-p)' }}>Void: {item.voidReason}</p>
          )}

          {/* Price — below name/modifier/notes */}
          {item.discountType && item.discountValue ? (
            <div className="flex items-center gap-2" style={{ marginTop: 2 }}>
              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-secondary)' }}>
                {formatCurrency(
                  item.discountType === 'PERCENTAGE'
                    ? totalPrice * (1 - item.discountValue / 100)
                    : Math.max(0, totalPrice - (item.discountValue * totalQty))
                )}
              </p>
              <p className="line-through" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)' }}>
                {formatCurrency(totalPrice)}
              </p>
            </div>
          ) : (
            <p
              className={item.isComplimentary ? 'line-through' : ''}
              style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-normal)', color: 'var(--neutral-onsurface-secondary)', marginTop: 2 }}
            >
              {formatCurrency(totalPrice)}
            </p>
          )}

          {/* Served status (non-draft only) */}
          {!item.isDraft && item.servedQty > 0 && (
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
              {item.servedQty}x Served
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: qty controls (draft) or SERVE button */}
        <div className="flex items-center shrink-0">
          {item.isDraft && (
            <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2">
              {/* Trash when qty=1, Minus (blue) when qty>1 */}
              <button
                onClick={(e) => { e.stopPropagation(); item.draftQty === 1 ? onRemove() : onDecrementQuantity(); }}
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  backgroundColor: item.draftQty === 1 ? '#fee2e2' : 'var(--feature-brand-primary)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.draftQty === 1 ? '#ef4444' : '#ffffff',
                  flexShrink: 0,
                }}
              >
                {item.draftQty === 1
                  ? <Trash2 style={{ width: 18, height: 18 }} />
                  : <Minus style={{ width: 18, height: 18 }} />
                }
              </button>
              <span style={{
                fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)',
                minWidth: 28, textAlign: 'center',
                borderBottom: '1px solid #e5e7eb', paddingBottom: 2,
              }}>
                {item.draftQty}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onIncrementQuantity(); }}
                style={{
                  width: 44, height: 44, borderRadius: 10,
                  backgroundColor: 'var(--feature-brand-primary)', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', flexShrink: 0,
                }}
              >
                <Plus style={{ width: 18, height: 18 }} />
              </button>
            </div>
          )}
          {/* SERVE button — only when READY items exist */}
          {!item.isDraft && item.readyQty > 0 && onMarkServed && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkServed(); }}
              style={{
                height: 44, minWidth: 120, padding: '0 20px',
                borderRadius: 'var(--radius-button)',
                backgroundColor: 'var(--status-green-primary)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#ffffff', flexShrink: 0, transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>
                Serve ({item.readyQty})
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Draggable Course Header (for course reordering only)
function DraggableCourseHeader({ 
  course, 
  isActive, 
  itemCount,
  onSelect, 
  onDelete,
  onReorder,
  onCourseClick,
  allItemsInCourse,
  hasAnyFiredItems
}: { 
  course: Course; 
  isActive: boolean;
  itemCount: number;
  onSelect: () => void; 
  onDelete: () => void;
  onReorder: (courseId: string, newOrder: number) => void;
  onCourseClick: () => void;
  allItemsInCourse: any[];
  hasAnyFiredItems: boolean;
}) {
  // Calculate fired items (items that are SENT, READY, or SERVED)
  const firedItems = allItemsInCourse.filter(item => 
    item.status === 'SENT' || item.status === 'READY' || item.status === 'SERVED'
  );
  const firedCount = firedItems.length;
  const totalCount = allItemsInCourse.length;
  const hasFiredItems = firedCount > 0;
  
  const canDrag = !hasAnyFiredItems; // Disable drag if ANY course has fired items
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.COURSE,
    item: { id: course.id, order: course.order },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.COURSE,
    drop: (draggedItem: { id: string; order?: number; courseId?: string | null }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      
      if ('order' in draggedItem && draggedItem.id !== course.id) {
        // Course reordering - accept drop (drag source already validated with canDrag)
        console.log('Dropping course', draggedItem.id, 'onto course', course.id, 'with order', course.order);
        onReorder(draggedItem.id, course.order);
      }
    },
    canDrop: (draggedItem: { id: string; order?: number; courseId?: string | null }, monitor) => {
      // For course reordering, allow drop if this is a different course
      if ('order' in draggedItem) {
        return draggedItem.id !== course.id;
      }
      return false;
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const showDropHighlight = isOverCurrent && !isDragging;

  return (
    <div 
      ref={drop}
      className={`overflow-hidden flex items-center justify-between cursor-pointer transition-colors ${
        isDragging ? 'opacity-50' : ''
      } ${showDropHighlight ? 'outline outline-2 outline-primary/40' : ''}`}
      style={{ 
        backgroundColor: isActive ? '#c7dcff' : '#f3f7fe',
        borderTop: '1px solid var(--border)',
        minHeight: 56,
      }}
    >
      {/* Main clickable area - activates course */}
      <div 
        className="flex-1 flex items-center gap-2 px-4"
        style={{ minHeight: 56 }}
        onClick={onCourseClick}
      >
        {/* 6-dot grid icon - draggable only when no fired items */}
        {canDrag && (
          <div 
            ref={drag}
            className="cursor-move flex items-center justify-center w-8 h-8 shrink-0 hover:bg-white/50 rounded transition-colors" 
            onClick={(e) => e.stopPropagation()}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="5" r="1.5" fill="#7E7E7E"/>
              <circle cx="13" cy="5" r="1.5" fill="#7E7E7E"/>
              <circle cx="7" cy="10" r="1.5" fill="#7E7E7E"/>
              <circle cx="13" cy="10" r="1.5" fill="#7E7E7E"/>
              <circle cx="7" cy="15" r="1.5" fill="#7E7E7E"/>
              <circle cx="13" cy="15" r="1.5" fill="#7E7E7E"/>
            </svg>
          </div>
        )}
        
        {/* Course title */}
        <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: '#7e7e7e', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Course {course.number}
        </span>
        
        {/* FIRED badge - only show when there are fired items */}
        {hasFiredItems && (
          <div 
            className="bg-[#fff4e6] px-2 py-1 flex items-center gap-2 ml-1"
            style={{ borderRadius: 'var(--radius-small)' }}
          >
            <Flame className="w-3 h-3 text-[#e07f00]" />
            <span 
              className="text-[#e07f00]"
              style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}
            >
              {firedCount}/{totalCount} FIRED
            </span>
          </div>
        )}
      </div>
      
      {/* Settings icon - triggers course action modal */}
      {(allItemsInCourse.length === 0 || allItemsInCourse.some(item => item.status === 'DRAFT')) && (
        <button
          className="flex items-center justify-center shrink-0 self-stretch hover:opacity-80 transition-opacity"
          style={{ width: 56, backgroundColor: '#e6f0ff', borderColor: '#b3d9ff', borderWidth: '1.5px' }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          <Settings className="w-6 h-6" style={{ color: '#282828' }} />
        </button>
      )}
    </div>
  );
}

// Draggable Course Section - wraps entire course for item drops
function DraggableCourseSection({
  course,
  children,
  onItemDrop,
}: {
  course: Course;
  children: React.ReactNode;
  onItemDrop: (itemId: string, targetCourseId: string) => void;
}) {
  const [{ isOverCurrent }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (draggedItem: { id: string; courseId?: string | null }, monitor) => {
      // Always accept the drop at the course level - item will be placed at the bottom
      // Item drop on course section - allow unfired items to be dropped on any course
      if ('courseId' in draggedItem) {
        onItemDrop(draggedItem.id, course.id);
      }
    },
    canDrop: (draggedItem: { id: string; courseId?: string | null }, monitor) => {
      // Allow any unfired item to be dropped
      if ('courseId' in draggedItem) {
        return true;
      }
      return false;
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={drop}
      className={isOverCurrent ? 'bg-primary/10' : ''}
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {children}
    </div>
  );
}

// Sent Item Component (Read-only with status, clickable for actions)
function SentItemCard({ 
  item, 
  onMarkServed,
  onItemClick
}: { 
  item: any;
  onMarkServed?: () => void;
  onItemClick?: () => void;
}) {
  const canInteract = item.status === 'SENT' || item.status === 'IN_PREP';
  
  return (
    <div 
      className={`bg-card border border-border p-4 ${canInteract ? 'cursor-pointer hover:border-primary/50' : ''}`}
      style={{ borderRadius: 'var(--radius-card)' }}
      onClick={canInteract ? onItemClick : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }} className="min-w-0 truncate">
              {item.name}
            </p>
            <StatusBadge status={item.status} />
            {item.isComplimentary && (
              <Badge 
                className="bg-green-600 text-white px-2 py-0.5"
                style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)' }}
              >
                COMP
              </Badge>
            )}
            {item.discountType && item.discountValue && (
              <Badge 
                className="bg-blue-600 text-white px-2 py-0.5"
                style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', borderRadius: 'var(--radius-small)' }}
              >
                {item.discountType === 'PERCENTAGE' ? `${item.discountValue}% OFF` : 'DISCOUNTED'}
              </Badge>
            )}
          </div>
          {item.modifiers && item.modifiers.length > 0 && (
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-h4)' }}>
              {item.modifiers.join(', ')}
            </p>
          )}
          {item.notes && (
            <p className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-h4)' }}>
              Note: {item.notes}
            </p>
          )}
        </div>
        <div className="text-right">
          {item.discountType && item.discountValue ? (
            <div>
              <p className="text-muted-foreground line-through" style={{ fontSize: 'var(--text-h4)' }}>
                {formatCurrency(item.price)}
              </p>
              <p className="text-primary" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                {formatCurrency(getItemPrice(item))}
              </p>
            </div>
          ) : (
            <p className="text-primary" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
              {formatCurrency(item.price)}
            </p>
          )}
          {item.status === 'READY' && onMarkServed && (
            <MainBtn
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onMarkServed();
              }}
              className="mt-2"
              style={{ fontSize: 'var(--text-label)' }}
            >
              <Check className="w-4 h-4 mr-1" />
              Serve
            </MainBtn>
          )}
        </div>
      </div>
    </div>
  );
}

function OperationalOrderScreenContent({ checkId, onClose, onOpenPayment, onOpenSplitBill, autoPrintBill }: OperationalOrderScreenProps) {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const ctx = useVirtualInputContext();
  const { 
    addItems, 
    getCheckById, 
    createKOT, 
    items: allContextItems, 
    updateItem, 
    deleteItem,
    getCoursesByCheck,
    createCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
    getSplitBillByCheck,
    getTableState,
    getCheckByTable,
    updateCheck,
    createCheck,
    getItemsByCheck,
    updateMultipleItems,
    getMergedTableGroup,
    closeCheck,
    deleteCheck,
    posProfile,
  } = useRestaurant();
  const check = getCheckById(checkId);
  const splitBill = getSplitBillByCheck(checkId);
  
  // Get table data if this is a DINE_IN order
  const table = check?.tableId ? TABLES.find(t => t.id === check.tableId) : undefined;
  
  // Check if this is a merged table
  const mergedTableGroup = check?.tableId ? getMergedTableGroup(check.tableId) : undefined;
  const mergedTableNames = mergedTableGroup 
    ? mergedTableGroup.tableIds
        .map(tableId => TABLES.find(t => t.id === tableId)?.name)
        .filter(Boolean)
        .join(', ')
    : '';
  
  // Load ALL items for this check from context (regardless of status)
  const draftItems = allContextItems.filter(item => item.checkId === checkId) as DraftItem[];
  const courses = getCoursesByCheck(checkId);
  
  // Check if there are any billable items (non-DRAFT, non-HELD, non-VOIDED)
  const hasBillableItems = draftItems.some(item => 
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );
  
  // Check if there are any transferable courses/items (for Transfer Item/Course button)
  // Transferable: DRAFT, SENT (In Kitchen), IN_PREP
  const hasTransferableCourses = courses.some(course => {
    // Check if course itself is DRAFT or SENT
    if (course.state === 'DRAFT') return true;
    
    // Check if course has items that are transferable
    const courseItems = getItemsByCheck(checkId).filter(item => item.courseId === course.id);
    return courseItems.some(item => 
      item.status === 'DRAFT' || item.status === 'SENT' || item.status === 'IN_PREP'
    );
  }) || getItemsByCheck(checkId).some(item => 
    !item.courseId && (item.status === 'DRAFT' || item.status === 'SENT' || item.status === 'IN_PREP')
  );
  
  // Group items function - combines items with same config but different statuses
  // DRAFT items are NEVER combined with other statuses
  const groupItems = (items: DraftItem[]): CombinedItem[] => {
    const groups: { [key: string]: CombinedItem } = {};
    
    items.forEach(item => {
      // Create unique key for grouping: menuItemId + modifiers + price + courseId + notes + isTakeaway + isComplimentary + discount + batchId
      // Including batchId ensures items from different "Send Item" actions stay separate
      const modifiersKey = item.modifiers.sort().join('||');
      const discountKey = item.discountType && item.discountValue ? `${item.discountType}_${item.discountValue}` : 'none';
      const key = `${item.menuItemId || item.name}_${modifiersKey}_${item.price}_${item.courseId || 'null'}_${item.notes || ''}_${item.isTakeaway}_${item.isComplimentary}_${discountKey}_${item.batchId || 'noBatch'}_${item.dineType || 'DINE_IN'}_${item.packagingPrice || 0}`;
      
      if (!groups[key]) {
        // Create new group
        groups[key] = {
          id: item.id,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          modifiers: item.modifiers,
          courseId: item.courseId,
          isTakeaway: item.isTakeaway,
          notes: item.notes,
          isComplimentary: item.isComplimentary,
          compReason: item.compReason || item.complimentaryReason,
          isVoided: item.status === 'VOIDED',
          voidReason: item.voidReason,
          discountType: item.discountType,
          discountValue: item.discountValue,
          dineType: item.dineType,
          packagingPrice: item.packagingPrice,
          isDraft: item.status === 'DRAFT',
          draftQty: 0,
          sentQty: 0,
          inPrepQty: 0,
          readyQty: 0,
          servedQty: 0,
          voidedQty: 0,
          draftItemIds: [],
          sentItemIds: [],
          inPrepItemIds: [],
          readyItemIds: [],
          servedItemIds: [],
          voidedItemIds: [],
        };
      }
      
      // Add quantities based on status
      // IMPORTANT: DRAFT items stay separate, so if we see a DRAFT item in a non-draft group, create new group
      if (item.status === 'DRAFT' && !groups[key].isDraft) {
        // Create new DRAFT-only group with modified key
        const draftKey = `${key}_DRAFT`;
        groups[draftKey] = {
          id: item.id,
          menuItemId: item.menuItemId,
          name: item.name,
          price: item.price,
          modifiers: item.modifiers,
          courseId: item.courseId,
          isTakeaway: item.isTakeaway,
          notes: item.notes,
          isComplimentary: item.isComplimentary,
          compReason: item.compReason || item.complimentaryReason,
          isVoided: false,
          voidReason: undefined,
          discountType: item.discountType,
          discountValue: item.discountValue,
          dineType: item.dineType,
          packagingPrice: item.packagingPrice,
          isDraft: true,
          draftQty: item.quantity,
          sentQty: 0,
          inPrepQty: 0,
          readyQty: 0,
          servedQty: 0,
          voidedQty: 0,
          draftItemIds: [item.id],
          sentItemIds: [],
          inPrepItemIds: [],
          readyItemIds: [],
          servedItemIds: [],
          voidedItemIds: [],
        };
      } else if (item.status !== 'DRAFT' && groups[key].isDraft) {
        // Create new non-draft group with modified key
        const nonDraftKey = `${key}_NONDRAFT`;
        if (!groups[nonDraftKey]) {
          groups[nonDraftKey] = {
            id: item.id,
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            modifiers: item.modifiers,
            courseId: item.courseId,
            isTakeaway: item.isTakeaway,
            notes: item.notes,
            isComplimentary: item.isComplimentary,
            compReason: item.compReason || item.complimentaryReason,
            isVoided: item.status === 'VOIDED',
            voidReason: item.voidReason,
            isDraft: false,
            draftQty: 0,
            sentQty: 0,
            inPrepQty: 0,
            readyQty: 0,
            servedQty: 0,
            voidedQty: 0,
            draftItemIds: [],
            sentItemIds: [],
            inPrepItemIds: [],
            readyItemIds: [],
            servedItemIds: [],
            voidedItemIds: [],
          };
        }
        
        const group = groups[nonDraftKey];
        switch (item.status) {
          case 'SENT':
            group.sentQty += item.quantity;
            group.sentItemIds.push(item.id);
            break;
          case 'IN_PREP':
            group.inPrepQty += item.quantity;
            group.inPrepItemIds.push(item.id);
            break;
          case 'READY':
            group.readyQty += item.quantity;
            group.readyItemIds.push(item.id);
            break;
          case 'SERVED':
            group.servedQty += item.quantity;
            group.servedItemIds.push(item.id);
            break;
          case 'VOIDED':
            group.voidedQty += item.quantity;
            group.voidedItemIds.push(item.id);
            group.isVoided = true;
            if (item.voidReason) group.voidReason = item.voidReason;
            break;
        }
      } else {
        // Same type (both draft or both non-draft), add to existing group
        const group = groups[key];
        switch (item.status) {
          case 'DRAFT':
            group.draftQty += item.quantity;
            group.draftItemIds.push(item.id);
            break;
          case 'SENT':
            group.sentQty += item.quantity;
            group.sentItemIds.push(item.id);
            break;
          case 'IN_PREP':
            group.inPrepQty += item.quantity;
            group.inPrepItemIds.push(item.id);
            break;
          case 'READY':
            group.readyQty += item.quantity;
            group.readyItemIds.push(item.id);
            break;
          case 'SERVED':
            group.servedQty += item.quantity;
            group.servedItemIds.push(item.id);
            break;
          case 'VOIDED':
            group.voidedQty += item.quantity;
            group.voidedItemIds.push(item.id);
            group.isVoided = true;
            if (item.voidReason) group.voidReason = item.voidReason;
            break;
        }
      }
    });
    
    return Object.values(groups);
  };
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [selectedItemForModifiers, setSelectedItemForModifiers] = useState<string | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [modifierNotes, setModifierNotes] = useState('');
  
  // Track if we're editing an existing item (for modifier updates)
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  
  // Complimentary state for new items
  const [isNewItemComp, setIsNewItemComp] = useState(false);
  const [newItemCompReason, setNewItemCompReason] = useState('');
  const [newItemManagerPin, setNewItemManagerPin] = useState('');
  const [isMoreOptionsModalOpen, setIsMoreOptionsModalOpen] = useState(false);
  
  // Discount state for new items
  const [newItemDiscountType, setNewItemDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [newItemDiscountValue, setNewItemDiscountValue] = useState('');
  const [newItemDiscountReason, setNewItemDiscountReason] = useState('');
  const [newItemDiscountManagerPin, setNewItemDiscountManagerPin] = useState('');
  
  // Customer Note modal state
  const [showCustomerNoteModal, setShowCustomerNoteModal] = useState(false);
  const [customerNote, setCustomerNote] = useState('');
  
  // Guest/Pax modal state
  const [showGuestPaxModal, setShowGuestPaxModal] = useState(false);
  const [guestCount, setGuestCount] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [manualInputMode, setManualInputMode] = useState(false);
  
  // Transfer Table modal state
  const [showTransferTableModal, setShowTransferTableModal] = useState(false);
  const [showTransferConfirmModal, setShowTransferConfirmModal] = useState(false);
  const [selectedTransferTable, setSelectedTransferTable] = useState<string | null>(null);
  const [showDiscountWarningModal, setShowDiscountWarningModal] = useState(false);
  const [pendingTransferTable, setPendingTransferTable] = useState<string | null>(null);
  
  // Merge Table modal state
  const [showMergeTableModal, setShowMergeTableModal] = useState(false);
  const [showMergeDiscountWarningModal, setShowMergeDiscountWarningModal] = useState(false);
  const [pendingMergeAction, setPendingMergeAction] = useState(false);
  
  // Transfer Course modal state
  const [showTransferCourseSelectModal, setShowTransferCourseSelectModal] = useState(false);
  const [showTransferCourseTableModal, setShowTransferCourseTableModal] = useState(false);
  const [showTransferCourseConfirmModal, setShowTransferCourseConfirmModal] = useState(false);
  const [selectedItemsForTransfer, setSelectedItemsForTransfer] = useState<string[]>([]); // Now storing item IDs
  const [selectedCourseTransferTable, setSelectedCourseTransferTable] = useState<string | null>(null);
  
  // Pricelist modal state
  const [showPricelistModal, setShowPricelistModal] = useState(false);
  const [showPricelistConfirmModal, setShowPricelistConfirmModal] = useState(false);
  const [selectedPricelist, setSelectedPricelist] = useState<string>('default');
  
  // Release Table confirmation modal state
  const [showReleaseTableModal, setShowReleaseTableModal] = useState(false);
  
  // Minimum Purchase Warning modal state
  const [showMinPurchaseWarningModal, setShowMinPurchaseWarningModal] = useState(false);

  // Print simulation state
  const [isPrinting, setIsPrinting] = useState(false);
  const [pendingPrintAction, setPendingPrintAction] = useState<'SEND_ITEM' | 'PRINT_BILL' | 'PAYMENT' | 'PRINT_TICKET' | null>(null);
  const [showPartialPrintDialog, setShowPartialPrintDialog] = useState(false);
  const [showPrintFailedDialog, setShowPrintFailedDialog] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [isNoPrinterConfigured, setIsNoPrinterConfigured] = useState(false);
  // Items that printed on Kitchen KOT Printer (Condition 2 – partial success)
  const [partialSuccessItems, setPartialSuccessItems] = useState<{ name: string; qty: number }[]>([]);
  // Items that failed on Bar Printer (Condition 2 – partial success)
  const [partialFailedItems, setPartialFailedItems] = useState<{ name: string; qty: number }[]>([]);
  // Which action triggered the print-failed dialog (drives "Continue Anyway" visibility)
  const [failedPrintAction, setFailedPrintAction] = useState<'SEND_ITEM' | 'PRINT_BILL' | 'PAYMENT' | 'PRINT_TICKET' | null>(null);
  // useRef avoids stale-closure issues when storing a callback across async setTimeout
  const pendingPostPrintCallbackRef = useRef<(() => void) | null>(null);
  
  // Elapsed time tracking for DINE_IN header
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Item action dialog state
  const [selectedItemForAction, setSelectedItemForAction] = useState<any | null>(null);
  const [showItemActionDialog, setShowItemActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'CANCEL' | 'COMP' | 'DISCOUNT' | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionManagerPin, setActionManagerPin] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [actionModifiers, setActionModifiers] = useState<string[]>([]);
  
  // Discount state
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [discountReason, setDiscountReason] = useState('');
  const [discountManagerPin, setDiscountManagerPin] = useState('');

  // Draft items warning modal state
  const [showDraftWarningModal, setShowDraftWarningModal] = useState(false);
  const [draftWarningAction, setDraftWarningAction] = useState<'PAYMENT' | 'PRINT_BILL' | null>(null);

  // Item Comp/UnComp/UnVoid modal state
  const [showItemCompModal, setShowItemCompModal] = useState(false);
  const [selectedItemForComp, setSelectedItemForComp] = useState<CombinedItem | null>(null);
  const [compQty, setCompQty] = useState(1);
  const [compModalAction, setCompModalAction] = useState<'COMP' | 'UNCOMP' | 'UNVOID'>('COMP');
  const [compReason, setCompReason] = useState('');
  const [compManagerPin, setCompManagerPin] = useState('');
  const [compManagerPinError, setCompManagerPinError] = useState('');
  const [compNote, setCompNote] = useState('');
  const [isCompCardExpanded, setIsCompCardExpanded] = useState(false);

  // UnVoid state
  const [unvoidReason, setUnvoidReason] = useState('');
  const [unvoidManagerPin, setUnvoidManagerPin] = useState('');
  const [unvoidManagerPinError, setUnvoidManagerPinError] = useState('');

  // Void Item modal state
  const [showVoidItemModal, setShowVoidItemModal] = useState(false);
  const [selectedItemForVoid, setSelectedItemForVoid] = useState<CombinedItem | null>(null);
  const [voidItemQty, setVoidItemQty] = useState(1);
  const [voidItemReason, setVoidItemReason] = useState('');
  const [voidItemManagerPin, setVoidItemManagerPin] = useState('');
  const [voidItemManagerPinError, setVoidItemManagerPinError] = useState('');

  // Modify Sent Item modal state (for SENT items - VOID or COMP actions)
  const [showModifySentItemModal, setShowModifySentItemModal] = useState(false);
  const [selectedSentItemForModify, setSelectedSentItemForModify] = useState<CombinedItem | null>(null);

  // Course actions modal state
  const [selectedCourseForAction, setSelectedCourseForAction] = useState<string | null>(null);
  const [showCourseActionModal, setShowCourseActionModal] = useState(false);

  // Course selection modal state
  const [showCourseSelectionModal, setShowCourseSelectionModal] = useState(false);

  // Modify Draft Item modal state
  const [showModifyDraftItemModal, setShowModifyDraftItemModal] = useState(false);
  const [selectedDraftItemForModify, setSelectedDraftItemForModify] = useState<CombinedItem | null>(null);
  const [modifyItemNotes, setModifyItemNotes] = useState('');
  const [modifyItemCompReason, setModifyItemCompReason] = useState('');
  const [modifyItemManagerPin, setModifyItemManagerPin] = useState('');
  const [isInCompMode, setIsInCompMode] = useState(false);
  const [modifyItemSelectedModifiers, setModifyItemSelectedModifiers] = useState<string[]>([]);
  const [modifyItemDiscountType, setModifyItemDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [modifyItemDiscountValue, setModifyItemDiscountValue] = useState('');

  // ItemModal state for editing SENT/READY items
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CombinedItem | null>(null);
  const [editingItemStatus, setEditingItemStatus] = useState<'DRAFT' | 'SENT' | 'PREPARING' | 'FIRED' | 'COMPLETED'>('DRAFT');
  const [itemModalNotes, setItemModalNotes] = useState('');
  const [itemModalModifiers, setItemModalModifiers] = useState<string[]>([]);
  const [itemModalDiscountType, setItemModalDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [itemModalDiscountValue, setItemModalDiscountValue] = useState('');
  const [itemModalCompReason, setItemModalCompReason] = useState('');
  const [itemModalManagerPin, setItemModalManagerPin] = useState('');
  const [itemModalIsComp, setItemModalIsComp] = useState(false);
  const [itemModalDineType, setItemModalDineType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [itemModalPackagingPrice, setItemModalPackagingPrice] = useState('');

  // State for new-item add modal (modifier selection modal)
  const [newItemDineType, setNewItemDineType] = useState<'DINE_IN' | 'TAKEAWAY' | 'DELIVERY'>('DINE_IN');
  const [newItemPackagingPrice, setNewItemPackagingPrice] = useState('');

  // Unified CompModal state
  const [showCompModal, setShowCompModal] = useState(false);
  const [compModalItem, setCompModalItem] = useState<CombinedItem | null>(null);

  // Bill Discount modal state
  const [showBillDiscountModal, setShowBillDiscountModal] = useState(false);
  const [billDiscountType, setBillDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [billDiscountValue, setBillDiscountValue] = useState('');
  const [billDiscountReason, setBillDiscountReason] = useState('');
  const [billDiscountManagerPin, setBillDiscountManagerPin] = useState('');

  // Tip modal state
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipInput, setTipInput] = useState('');

  const categories = ['All', ...Array.from(new Set(MENU_ITEMS.map(item => item.category)))];

  // Category colour palette — matches the Figma design system
  // 10 pastel colors for up to 10 non-"All" categories, in order of appearance
  const CATEGORY_PALETTE = [
    '#F9EB9E', '#D1C0F6', '#A5EEE6', '#F5BCBC', '#F6D3B8',
    '#CDE7C9', '#BFD4F2', '#F9C0DD', '#E0C9A6', '#B6BEEE',
  ];
  const nonAllCategories = Array.from(new Set(MENU_ITEMS.map(i => i.category)));
  const getCategoryColor = (cat: string): { bg: string; selectedBg: string; text: string } => {
    if (cat === 'All') return { bg: '#3B82F6', selectedBg: '#1D4ED8', text: '#ffffff' };
    const idx = nonAllCategories.indexOf(cat);
    const bg = idx >= 0 && idx < CATEGORY_PALETTE.length ? CATEGORY_PALETTE[idx] : '#E5E7EB';
    return { bg, selectedBg: bg, text: '#282828' };
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate totals - all items are now in draftItems with different statuses
  const draftOnlyItems = draftItems.filter(item => item.status === 'DRAFT');
  const sentOrLaterItems = draftItems.filter(item => 
    item.status !== 'DRAFT' && item.status !== 'VOIDED' && item.status !== 'HELD'
  );
  
  const draftTotal = draftOnlyItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const sentTotal = sentOrLaterItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  const subtotal = draftTotal + sentTotal;
  
  // Calculate total item discounts (amount saved from per-item discounts)
  const itemDiscountAmount = draftItems
    .filter(item => item.status !== 'VOIDED' && item.status !== 'HELD')
    .reduce((sum, item) => {
      if (!item.discountType || !item.discountValue) return sum;
      
      const originalPrice = item.price * item.quantity;
      const discountedPrice = getItemPrice(item) * item.quantity;
      return sum + (originalPrice - discountedPrice);
    }, 0);
  
  // Calculate bill discount
  let billDiscountAmount = 0;
  if (check?.billDiscountType && check?.billDiscountValue) {
    if (check.billDiscountType === 'PERCENTAGE') {
      billDiscountAmount = subtotal * (check.billDiscountValue / 100);
    } else {
      billDiscountAmount = Math.min(check.billDiscountValue, subtotal);
    }
  }
  
  const subtotalAfterDiscount = subtotal - billDiscountAmount;
  const serviceCharge = subtotalAfterDiscount * 0.1; // 10%
  const tax = subtotalAfterDiscount * 0.05; // 5%
  const tipAmount = check?.tipAmount || 0;
  const grandTotal = subtotalAfterDiscount + serviceCharge + tax + tipAmount;
  const paidAmount = check?.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  const outstanding = grandTotal - paidAmount;

  // Only count DRAFT status items
  const hasDraftItems = draftOnlyItems.length > 0;
  const totalItemCount = draftOnlyItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate split bill progress
  const splitBillData = splitBill ? (() => {
    const totalSplits = splitBill.splits.length;
    const paidSplits = splitBill.splits.filter(s => s.paid).length;
    const unpaidSplits = totalSplits - paidSplits;
    
    // Calculate outstanding from split bills
    const totalPaidFromSplits = splitBill.splits
      .filter(s => s.paid && s.paidAmount)
      .reduce((sum, s) => sum + (s.paidAmount || 0), 0);
    const splitOutstanding = grandTotal - totalPaidFromSplits;
    
    return {
      totalSplits,
      paidSplits,
      unpaidSplits,
      outstanding: splitOutstanding
    };
  })() : null;

  // Clean up orphaned courseIds when courses are deleted
  useEffect(() => {
    const validCourseIds = courses.map(c => c.id);
    const orphanedItems = draftItems.filter(item => item.courseId !== null && !validCourseIds.includes(item.courseId));
    
    if (orphanedItems.length > 0) {
      orphanedItems.forEach(item => {
        updateItem(item.id, { courseId: null });
      });
    }
  }, [courses]);

  // Automatically restore active course when navigating back
  useEffect(() => {
    // Only set active course if:
    // 1. No active course is currently selected
    // 2. There are courses available
    if (activeCourseId === null && courses.length > 0) {
      // Find the first DRAFT course
      const firstDraftCourse = courses.find(c => c.state === 'DRAFT');
      if (firstDraftCourse) {
        setActiveCourseId(firstDraftCourse.id);
      }
    }
    
    // If the active course no longer exists, clear it
    if (activeCourseId !== null && !courses.find(c => c.id === activeCourseId)) {
      setActiveCourseId(null);
    }
  }, [courses, activeCourseId]);

  // Calculate elapsed time in real-time for DINE_IN header
  useEffect(() => {
    if (!check?.seatedAt) return;

    const updateElapsedTime = () => {
      const now = new Date();
      const seatedTime = new Date(check.seatedAt!);
      const diffMs = now.getTime() - seatedTime.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      setElapsedMinutes(diffMins);
    };

    // Update immediately
    updateElapsedTime();

    // Update every minute
    const interval = setInterval(updateElapsedTime, 60000);

    return () => clearInterval(interval);
  }, [check?.seatedAt]);

  // Get smallest missing positive integer for course numbering
  const getNextCourseNumber = () => {
    const existingNumbers = courses.map(c => c.number).sort((a, b) => a - b);
    let nextNumber = 1;
    for (const num of existingNumbers) {
      if (num === nextNumber) {
        nextNumber++;
      } else if (num > nextNumber) {
        break;
      }
    }
    return nextNumber;
  };

  const handleAddCourse = () => {
    const newCourseNumber = getNextCourseNumber();
    const courseName = `Course ${newCourseNumber}`;
    
    // Create course using context
    const newCourseId = createCourse(checkId, courseName, newCourseNumber, courses.length);

    // Auto-move existing uncoursed items ONLY if this is the first course and items are DRAFT
    if (courses.length === 0 && draftItems.some(item => item.courseId === null && item.status === 'DRAFT')) {
      // Update all uncoursed draft items to this course
      const uncoursedDraftItems = draftItems.filter(item => item.courseId === null && item.status === 'DRAFT');
      uncoursedDraftItems.forEach(item => {
        updateItem(item.id, { courseId: newCourseId });
      });
    }

    setActiveCourseId(newCourseId);

    // Scroll to new course (optional)
    setTimeout(() => {
      const courseElement = document.getElementById(`course-${newCourseId}`);
      if (courseElement) {
        courseElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  };

  const handleDeleteCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    if (course.state === 'SENT') {
      snackbar.error('Cannot delete a fired course');
      return;
    }

    // Check for any items (both fired and unfired) in this course
    const itemsInCourse = draftItems.filter(item => item.courseId === courseId);
    
    if (itemsInCourse.length > 0) {
      snackbar.error('Cannot delete course with items. Please remove or move items first.');
      return;
    }

    deleteCourse(courseId);
    
    // If active course was deleted, set active to previous course
    if (activeCourseId === courseId) {
      const currentIndex = courses.findIndex(c => c.id === courseId);
      const previousCourse = currentIndex > 0 ? courses[currentIndex - 1] : null;
      setActiveCourseId(previousCourse ? previousCourse.id : null);
    }

    snackbar.success(`Course ${course.number} deleted`);
  };

  const handleSelectCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    // Only allow setting DRAFT courses as active
    if (course.state === 'SENT') {
      return;
    }
    
    setActiveCourseId(courseId);
  };

  const handleReorderCourse = (courseId: string, newOrder: number) => {
    console.log('handleReorderCourse called:', { courseId, newOrder, courses });
    const course = courses.find(c => c.id === courseId);
    if (!course) {
      console.log('Course not found');
      return;
    }
    
    // Only allow reordering DRAFT courses
    if (course.state === 'SENT') {
      snackbar.error('Cannot reorder fired courses');
      return;
    }
    
    const fromIndex = courses.findIndex(c => c.id === courseId);
    const toIndex = courses.findIndex(c => c.order === newOrder);
    
    console.log('Found indexes:', { fromIndex, toIndex });
    
    if (fromIndex === -1 || toIndex === -1) {
      console.log('Invalid indexes');
      return;
    }

    // Don't allow swapping with a SENT course
    if (courses[toIndex].state === 'SENT') {
      console.log('Target course is SENT, cannot swap');
      return;
    }

    // Prepare reorder updates
    const courseOrders = [
      { id: courseId, order: newOrder },
      { id: courses[toIndex].id, order: course.order }
    ];

    console.log('Reordering courses:', courseOrders);
    reorderCourses(checkId, courseOrders);
    snackbar.success('Course order updated');
  };

  const handleMoveItem = (itemId: string, targetCourseId: string | null) => {
    // Allow moving unfired items to any course (including fired courses)
    updateItem(itemId, { courseId: targetCourseId });

    // Optionally set target course as active
    if (targetCourseId) {
      setActiveCourseId(targetCourseId);
    }
  };

  const handleCourseClick = (courseId: string) => {
    // Activate the course for adding items
    setActiveCourseId(courseId);
  };
  
  const handleCourseSettings = (courseId: string) => {
    setSelectedCourseForAction(courseId);
    setShowCourseActionModal(true);
  };

  const handleDeleteCourseFromModal = () => {
    if (!selectedCourseForAction) return;

    const course = courses.find(c => c.id === selectedCourseForAction);
    if (!course) return;

    // Check if course has any fired items
    const itemsInCourse = draftItems.filter(item => item.courseId === selectedCourseForAction);
    const hasFiredItems = itemsInCourse.some(item => item.status !== 'DRAFT');

    if (hasFiredItems) {
      snackbar.error('Cannot delete course with fired items');
      return;
    }

    // Delete all items in the course first
    itemsInCourse.forEach(item => {
      deleteItem(item.id);
    });

    // Delete the course
    deleteCourse(selectedCourseForAction);

    // If active course was deleted, clear active
    if (activeCourseId === selectedCourseForAction) {
      setActiveCourseId(null);
    }

    setShowCourseActionModal(false);
    setSelectedCourseForAction(null);
    snackbar.success(`Course ${course.number} and all items deleted`);
  };

  const handlePrintCourseKOT = () => {
    if (!selectedCourseForAction) return;

    const course = courses.find(c => c.id === selectedCourseForAction);
    if (!course) return;

    // Get only DRAFT items for this course
    const draftItemsInCourse = draftItems.filter(
      item => item.courseId === selectedCourseForAction && item.status === 'DRAFT'
    );

    if (draftItemsInCourse.length === 0) {
      snackbar.error('No draft items in this course to send');
      return;
    }

    // Update all draft items in this course to SENT
    draftItemsInCourse.forEach(item => {
      updateItem(item.id, {
        status: 'SENT',
        course: course.number
      });
    });

    // Create KOT for this course
    const itemIds = draftItemsInCourse.map(item => item.id);
    createKOT(checkId, itemIds, course.number);

    // Update course state to SENT
    updateCourse(selectedCourseForAction, { state: 'SENT' });

    setShowCourseActionModal(false);
    setSelectedCourseForAction(null);
    snackbar.success(`KOT for Course ${course.number} sent to kitchen`);
  };

  const handleAddItem = (menuItem: typeof MENU_ITEMS[0]) => {
    // Check if item has modifiers
    const hasModifiers = menuItem.availableModifiers && menuItem.availableModifiers.length > 0;
    
    if (!hasModifiers) {
      // Auto-add item without showing modal
      let targetCourseId = activeCourseId;
      
      // If no active course but courses exist, use the last course
      if (!targetCourseId && courses.length > 0) {
        const lastCourse = [...courses].sort((a, b) => b.order - a.order)[0];
        targetCourseId = lastCourse.id;
        setActiveCourseId(lastCourse.id);
      }

      // Check if the same item already exists as DRAFT in the target course
      const existingDraftItem = draftItems.find(item => 
        item.name === menuItem.name && 
        item.courseId === targetCourseId && 
        item.status === 'DRAFT' &&
        item.modifiers.length === 0 &&
        !item.notes &&
        !item.isComplimentary
      );

      if (existingDraftItem) {
        // Increment quantity of existing item
        updateItem(existingDraftItem.id, {
          quantity: existingDraftItem.quantity + 1
        });
        return;
      }

      // Add item directly to context
      addItems(checkId, [{
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        modifiers: [],
        courseId: targetCourseId,
        isTakeaway: false,
        quantity: 1,
        isComplimentary: false,
        status: 'DRAFT',
      }]);
      
      return;
    }
    
    // Has modifiers - show modal
    setSelectedItemForModifiers(menuItem.id);
    setSelectedModifiers([]);
    setModifierNotes('');
    setIsNewItemComp(false);
    setNewItemCompReason('');
    setNewItemManagerPin('');
    setNewItemDineType('DINE_IN');
    setNewItemPackagingPrice('');
    setNewItemDiscountType('PERCENTAGE');
    setNewItemDiscountValue('');
    setNewItemDiscountReason('');
    setNewItemDiscountManagerPin('');
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

    // Validate discount if provided (skip if marking as comp since comp makes price 0 anyway)
    if (!isNewItemComp && newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) {
      if (newItemDiscountType === 'PERCENTAGE' && parseFloat(newItemDiscountValue) > 100) {
        snackbar.error('Percentage discount cannot exceed 100%');
        return;
      }
    }

    // Check if we're editing an existing item or adding new
    if (editingItemId) {
      // Update existing item
      updateItem(editingItemId, {
        modifiers: selectedModifiers,
        notes: modifierNotes || undefined,
        isComplimentary: isNewItemComp,
        compReason: isNewItemComp ? newItemCompReason : undefined,
        complimentaryReason: isNewItemComp ? newItemCompReason : undefined,
        price: isNewItemComp ? 0 : menuItem.price,
        discountType: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountType : undefined,
        discountValue: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? parseFloat(newItemDiscountValue) : undefined,
        discountReason: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountReason : undefined,
        discountManagerPin: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountManagerPin : undefined,
      });
      snackbar.success(`${menuItem.name} updated`);
    } else {
      // Determine which course to add to
      let targetCourseId = activeCourseId;
      
      // If no active course but courses exist, use the last course
      if (!targetCourseId && courses.length > 0) {
        const lastCourse = [...courses].sort((a, b) => b.order - a.order)[0];
        targetCourseId = lastCourse.id;
        setActiveCourseId(lastCourse.id);
      }

      // Check if the same item with same modifiers already exists as DRAFT in the target course
      const normalizedNotes = modifierNotes?.trim() || '';
      const existingDraftItem = draftItems.find(item => {
        const itemNotes = item.notes?.trim() || '';
        const modifiersMatch = item.modifiers.length === selectedModifiers.length &&
          item.modifiers.every((mod, idx) => mod === selectedModifiers[idx]);
        
        return item.name === menuItem.name && 
          item.courseId === targetCourseId && 
          item.status === 'DRAFT' &&
          modifiersMatch &&
          itemNotes === normalizedNotes &&
          item.isComplimentary === isNewItemComp &&
          item.discountType === ((newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountType : undefined) &&
          item.discountValue === ((newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? parseFloat(newItemDiscountValue) : undefined);
      });

      if (existingDraftItem) {
        // Increment quantity of existing item
        updateItem(existingDraftItem.id, {
          quantity: existingDraftItem.quantity + 1
        });
      } else {
        // Add item to context
        addItems(checkId, [{
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: isNewItemComp ? 0 : menuItem.price,
          modifiers: selectedModifiers,
          courseId: targetCourseId, // Use active course ID or last course
          isTakeaway: newItemDineType === 'TAKEAWAY',
          dineType: newItemDineType,
          packagingPrice: (newItemDineType !== 'DINE_IN' && newItemPackagingPrice && parseFloat(newItemPackagingPrice) > 0) ? parseFloat(newItemPackagingPrice) : undefined,
          notes: modifierNotes || undefined,
          quantity: 1,
          isComplimentary: isNewItemComp,
          compReason: isNewItemComp ? newItemCompReason : undefined,
          discountType: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountType : undefined,
          discountValue: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? parseFloat(newItemDiscountValue) : undefined,
          discountReason: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountReason : undefined,
          discountManagerPin: (newItemDiscountValue && parseFloat(newItemDiscountValue) > 0) ? newItemDiscountManagerPin : undefined,
          status: 'DRAFT',
        }]);
      }
    }
    
    setSelectedItemForModifiers(null);
    setSelectedModifiers([]);
    setModifierNotes('');
    setEditingItemId(null);
    setIsNewItemComp(false);
    setNewItemCompReason('');
    setNewItemManagerPin('');
    setNewItemDineType('DINE_IN');
    setNewItemPackagingPrice('');
    setNewItemDiscountType('PERCENTAGE');
    setNewItemDiscountValue('');
    setNewItemDiscountReason('');
    setNewItemDiscountManagerPin('');
  };

  const handleIncrementQuantity = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    if (item && item.status === 'DRAFT') {
      updateItem(itemId, { quantity: item.quantity + 1 });
    }
  };

  const handleDecrementQuantity = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    if (item && item.quantity > 1 && item.status === 'DRAFT') {
      updateItem(itemId, { quantity: item.quantity - 1 });
    }
  };

  // New handlers for combined items
  const handleCombinedItemClick = (combinedItem: CombinedItem) => {
    // DRAFT items - open ItemModal in EDIT mode with DRAFT status
    if (combinedItem.isDraft && combinedItem.draftItemIds.length > 0) {
      setEditingItem(combinedItem);
      setEditingItemStatus('DRAFT');
      setItemModalNotes(combinedItem.notes || '');
      setItemModalModifiers(combinedItem.modifiers || []);
      setItemModalDiscountType(combinedItem.discountType || 'PERCENTAGE');
      setItemModalDiscountValue(combinedItem.discountValue?.toString() || '');
      setItemModalCompReason(combinedItem.compReason || '');
      setItemModalManagerPin('');
      setItemModalIsComp(combinedItem.isComplimentary || false);
      setItemModalDineType(combinedItem.dineType || 'DINE_IN');
      setItemModalPackagingPrice(combinedItem.packagingPrice?.toString() || '');
      setShowItemModal(true);
      return;
    }
    
    // Check if item is already VOID - allow unVoid
    if (combinedItem.isVoided) {
      // Check payment status
      if (check && (check.status === 'PARTIALLY_PAID' || check.paidAmount > 0)) {
        snackbar.error('Cannot unvoid items after payment has been made');
        return;
      }
      setSelectedItemForComp(combinedItem);
      setCompModalAction('UNVOID');
      setCompManagerPin('');
      setCompManagerPinError('');
      setCompReason('');
      setCompNote('');
      setUnvoidReason('');
      setUnvoidManagerPin('');
      setUnvoidManagerPinError('');
      setShowItemCompModal(true);
      return;
    }
    
    // Check if item is already COMP - allow unComp
    if (combinedItem.isComplimentary) {
      // Check payment status
      if (check && (check.status === 'PARTIALLY_PAID' || check.paidAmount > 0)) {
        snackbar.error('Cannot uncomp items after payment has been made');
        return;
      }
      setSelectedItemForComp(combinedItem);
      setCompModalAction('UNCOMP');
      setCompManagerPin('');
      setCompManagerPinError('');
      setCompReason('');
      setCompNote('');
      setShowItemCompModal(true);
      return;
    }
    
    // Check for SENT items only - show ItemModal in EDIT mode with SENT status (can VOID)
    if (combinedItem.sentQty > 0) {
      setEditingItem(combinedItem);
      setEditingItemStatus('SENT');
      setItemModalNotes(combinedItem.notes || '');
      setItemModalModifiers(combinedItem.modifiers || []);
      setItemModalDiscountType(combinedItem.discountType || 'PERCENTAGE');
      setItemModalDiscountValue(combinedItem.discountValue?.toString() || '');
      setItemModalCompReason(combinedItem.compReason || '');
      setItemModalManagerPin('');
      setItemModalIsComp(combinedItem.isComplimentary || false);
      setShowItemModal(true);
      return;
    }
    
    // IN_PREP items - show ItemModal in view-only mode
    if (combinedItem.inPrepQty > 0) {
      setEditingItem(combinedItem);
      setEditingItemStatus('PREPARING');
      setItemModalNotes(combinedItem.notes || '');
      setItemModalModifiers(combinedItem.modifiers || []);
      setItemModalDiscountType(combinedItem.discountType || 'PERCENTAGE');
      setItemModalDiscountValue(combinedItem.discountValue?.toString() || '');
      setItemModalCompReason(combinedItem.compReason || '');
      setItemModalManagerPin('');
      setItemModalIsComp(combinedItem.isComplimentary || false);
      setShowItemModal(true);
      return;
    }

    // READY/SERVED items - show ItemModal in view-only mode
    const totalReadyServedQty = combinedItem.readyQty + combinedItem.servedQty;
    if (totalReadyServedQty > 0) {
      setEditingItem(combinedItem);
      setEditingItemStatus(combinedItem.readyQty > 0 ? 'FIRED' : 'COMPLETED');
      setItemModalNotes(combinedItem.notes || '');
      setItemModalModifiers(combinedItem.modifiers || []);
      setItemModalDiscountType(combinedItem.discountType || 'PERCENTAGE');
      setItemModalDiscountValue(combinedItem.discountValue?.toString() || '');
      setItemModalCompReason(combinedItem.compReason || '');
      setItemModalManagerPin('');
      setItemModalIsComp(combinedItem.isComplimentary || false);
      setShowItemModal(true);
      return;
    }
  };

  const handleIncrementCombinedQuantity = (combinedItem: CombinedItem) => {
    // Only increment if it's a DRAFT group
    if (combinedItem.isDraft && combinedItem.draftItemIds.length > 0) {
      const firstItemId = combinedItem.draftItemIds[0];
      handleIncrementQuantity(firstItemId);
    }
  };

  const handleDecrementCombinedQuantity = (combinedItem: CombinedItem) => {
    // Only decrement if it's a DRAFT group
    if (combinedItem.isDraft && combinedItem.draftItemIds.length > 0) {
      const firstItemId = combinedItem.draftItemIds[0];
      handleDecrementQuantity(firstItemId);
    }
  };

  const handleRemoveCombinedItem = (combinedItem: CombinedItem) => {
    // Only remove if it's a DRAFT group
    if (combinedItem.isDraft) {
      combinedItem.draftItemIds.forEach(itemId => {
        deleteItem(itemId);
      });
    }
  };

  const handleMarkCombinedServed = (combinedItem: CombinedItem) => {
    // Mark ALL ready items as served
    if (combinedItem.readyQty > 0) {
      combinedItem.readyItemIds.forEach(itemId => {
        updateItem(itemId, { status: 'SERVED' });
      });
      snackbar.success(`${combinedItem.readyQty} item(s) marked as served`);
    }
  };

  // Handlers for Modify Draft Item Modal
  const handleSaveItemNotes = () => {
    if (!selectedDraftItemForModify) return;
    
    // Validate discount if provided (skip if in comp mode since comp makes price 0 anyway)
    if (!isInCompMode && modifyItemDiscountValue && parseFloat(modifyItemDiscountValue) > 0) {
      const discountVal = parseFloat(modifyItemDiscountValue);
      if (modifyItemDiscountType === 'PERCENTAGE' && discountVal > 100) {
        snackbar.error('Percentage discount cannot exceed 100%');
        return;
      }
    }
    
    // Update notes, modifiers, and discount for all draft items in this group
    selectedDraftItemForModify.draftItemIds.forEach(itemId => {
      updateItem(itemId, { 
        notes: modifyItemNotes,
        modifiers: modifyItemSelectedModifiers,
        discountType: (modifyItemDiscountValue && parseFloat(modifyItemDiscountValue) > 0) ? modifyItemDiscountType : undefined,
        discountValue: (modifyItemDiscountValue && parseFloat(modifyItemDiscountValue) > 0) ? parseFloat(modifyItemDiscountValue) : undefined
      });
    });
    
    snackbar.success('Item updated');
    setShowModifyDraftItemModal(false);
  };

  const handleMarkDraftAsComp = () => {
    if (!selectedDraftItemForModify) return;
    
    if (!modifyItemCompReason.trim()) {
      snackbar.error('Please provide a reason for complimentary');
      return;
    }
    
    if (modifyItemManagerPin !== '1234') {
      snackbar.error('Invalid manager PIN');
      return;
    }
    
    // Mark all draft items in this group as complimentary
    selectedDraftItemForModify.draftItemIds.forEach(itemId => {
      updateItem(itemId, { 
        isComplimentary: true, 
        compReason: modifyItemCompReason,
        complimentaryReason: modifyItemCompReason
      });
    });
    
    snackbar.success(`${selectedDraftItemForModify.name} marked as complimentary`);
    setShowModifyDraftItemModal(false);
    setIsInCompMode(false);
  };

  // Unified CompModal handler
  const handleCompModalConfirm = (data: { quantity: number; reason: string; managerPin: string }) => {
    if (!compModalItem) return;

    // Validate Manager PIN
    if (data.managerPin !== '1234') {
      snackbar.error('Invalid manager PIN');
      return;
    }

    // Get all items to comp
    const allItems = getItemsByCheck(checkId);
    const thisItemInstances = allItems.filter(item => 
      item.name === compModalItem.name && 
      item.modifiers?.sort().join(',') === compModalItem.modifiers.sort().join(',') &&
      !item.isVoided &&
      !item.isComplimentary
    );

    // Comp the specified quantity
    const itemsToComp = thisItemInstances.slice(0, data.quantity);
    itemsToComp.forEach(item => {
      updateItem(item.id, {
        isComplimentary: true,
        compReason: data.reason,
        complimentaryReason: data.reason
      });
    });

    snackbar.success(`${data.quantity} item(s) marked as complimentary`);
    setShowCompModal(false);
    setCompModalItem(null);
  };

  const handleDeleteDraftItem = () => {
    if (!selectedDraftItemForModify) return;
    
    // Delete all draft items in this group
    selectedDraftItemForModify.draftItemIds.forEach(itemId => {
      deleteItem(itemId);
    });
    
    snackbar.success(`${selectedDraftItemForModify.name} removed`);
    setShowModifyDraftItemModal(false);
    setIsInCompMode(false);
  };

  const handleSendDraftItem = () => {
    if (!selectedDraftItemForModify) return;
    
    // Get the first draft item to find the menu item and determine station
    const firstItemId = selectedDraftItemForModify.draftItemIds[0];
    const firstItem = draftItems.find(i => i.id === firstItemId);
    const menuItem = firstItem?.menuItemId ? MENU_ITEMS.find(m => m.id === firstItem.menuItemId) : null;
    
    // Track item IDs for KOT creation
    const itemIds: string[] = [];
    
    // Send all draft items in this group
    selectedDraftItemForModify.draftItemIds.forEach(itemId => {
      const item = draftItems.find(i => i.id === itemId);
      if (!item) return;
      
      const course = courses.find(c => c.id === item.courseId);
      
      // Update to SENT status
      updateItem(itemId, { 
        status: 'SENT',
        course: course ? course.number : undefined,
        notes: modifyItemNotes,
        modifiers: modifyItemSelectedModifiers
      });
      
      itemIds.push(itemId);
    });
    
    // Create KOT/BOT
    if (itemIds.length > 0) {
      const course = firstItem?.courseId ? courses.find(c => c.id === firstItem.courseId) : null;
      createKOT(checkId, itemIds, course ? course.number : undefined);
      
      // Determine station and show appropriate toast
      const station = menuItem ? getCategoryRoute(menuItem.category) : 'KITCHEN';
      const stationName = station === 'BAR' ? 'bar' : 'kitchen';
      
      snackbar.success(`${selectedDraftItemForModify.name} sent to ${stationName}`);
    }
    
    setShowModifyDraftItemModal(false);
    setIsInCompMode(false);
  };

  const handleOldItemCompModalConfirm = () => {
    if (!selectedItemForComp) return;

    // Handle COMP action
    if (compModalAction === 'COMP') {
      // Validate inputs
      if (!compReason.trim()) {
        snackbar.error('Please provide a reason for complimentary');
        return;
      }
      if (compManagerPin !== '1234') {
        setCompManagerPinError('Invalid manager PIN');
        return;
      }

      // Clear error if validation passes
      setCompManagerPinError('');

      const totalFiredQty = selectedItemForComp.sentQty + selectedItemForComp.inPrepQty + 
                           selectedItemForComp.readyQty + selectedItemForComp.servedQty;
      
      if (compQty > totalFiredQty) {
        snackbar.error('Quantity exceeds available items');
        return;
      }

      // Collect item IDs to comp (up to compQty)
      const itemIds = [
        ...selectedItemForComp.sentItemIds,
        ...selectedItemForComp.inPrepItemIds,
        ...selectedItemForComp.readyItemIds,
        ...selectedItemForComp.servedItemIds
      ].slice(0, compQty);

      // Mark items as complimentary
      itemIds.forEach(itemId => {
        updateItem(itemId, {
          isComplimentary: true,
          compReason: compReason,
          complimentaryReason: compReason,
          price: 0
        });
      });

      snackbar.success(`${compQty} item(s) marked as complimentary`);
    }
    
    // Handle UNCOMP action
    else if (compModalAction === 'UNCOMP') {
      // Get all item IDs (comp items can be draft or fired)
      const allItemIds = [
        ...selectedItemForComp.draftItemIds,
        ...selectedItemForComp.sentItemIds,
        ...selectedItemForComp.inPrepItemIds,
        ...selectedItemForComp.readyItemIds,
        ...selectedItemForComp.servedItemIds
      ];

      // Restore original price
      allItemIds.forEach(itemId => {
        updateItem(itemId, {
          isComplimentary: false,
          compReason: undefined,
          complimentaryReason: undefined,
          price: selectedItemForComp.price
        });
      });

      snackbar.success(`${selectedItemForComp.name} uncomped`);
    }
    
    // Handle UNVOID action
    else if (compModalAction === 'UNVOID') {
      // Validate inputs
      if (!unvoidReason.trim()) {
        snackbar.error('Please provide a reason for restoring');
        return;
      }
      if (unvoidManagerPin !== '1234') {
        setUnvoidManagerPinError('Invalid manager PIN');
        return;
      }

      // Clear error if validation passes
      setUnvoidManagerPinError('');

      // Get all voided item IDs
      const voidedIds = selectedItemForComp.voidedItemIds;

      // Restore items to their previous status (we'll use SENT as default)
      voidedIds.forEach(itemId => {
        updateItem(itemId, {
          status: 'SENT',
          voidReason: undefined
        });
      });

      snackbar.success(`${selectedItemForComp.name} unvoided`);
    }

    // Close modal and reset
    setShowItemCompModal(false);
    setSelectedItemForComp(null);
    setCompQty(1);
    setCompManagerPin('');
    setCompManagerPinError('');
    setCompReason('');
    setCompNote('');
    setUnvoidReason('');
    setUnvoidManagerPin('');
    setUnvoidManagerPinError('');
  };

  const handleVoidItemConfirm = () => {
    if (!selectedItemForVoid) return;

    // Validate inputs
    if (!voidItemReason.trim()) {
      snackbar.error('Please provide a reason for voiding');
      return;
    }
    if (voidItemManagerPin !== '1234') {
      setVoidItemManagerPinError('Invalid manager PIN');
      return;
    }

    // Clear error if validation passes
    setVoidItemManagerPinError('');

    // Calculate voidable quantity (SENT only, not IN_PREP or later)
    const voidableQty = selectedItemForVoid.sentQty;
    
    if (voidItemQty > voidableQty) {
      snackbar.error('Quantity exceeds available items to void');
      return;
    }

    // Collect item IDs to void (SENT items only)
    const itemIds = selectedItemForVoid.sentItemIds.slice(0, voidItemQty);

    // Mark items as VOIDED
    itemIds.forEach(itemId => {
      updateItem(itemId, {
        status: 'VOIDED',
        voidReason: voidItemReason
      });
    });

    snackbar.success(`${voidItemQty} item(s) voided`);

    // Close modal and reset
    setShowVoidItemModal(false);
    setSelectedItemForVoid(null);
    setVoidItemQty(1);
    setVoidItemReason('');
    setVoidItemManagerPin('');
    setVoidItemManagerPinError('');
  };

  // Handler for voiding from ItemModal
  const handleItemModalVoid = (data: { reason: string; managerPin: string }) => {
    if (!editingItem) return;

    // Validate manager PIN
    if (data.managerPin !== '1234') {
      snackbar.error('Invalid manager PIN');
      return;
    }

    // Get all SENT item IDs
    const itemIds = editingItem.sentItemIds || [];
    
    // Mark all SENT items as VOIDED
    itemIds.forEach(itemId => {
      updateItem(itemId, {
        status: 'VOIDED',
        voidReason: data.reason
      });
    });

    snackbar.success(`${editingItem.name} voided`);

    // Close modal and reset
    setShowItemModal(false);
    setEditingItem(null);
  };

  // Handler for deleting from ItemModal (DRAFT items only)
  const handleItemModalDelete = () => {
    if (!editingItem) return;

    // Get all DRAFT item IDs
    const itemIds = editingItem.draftItemIds || [];
    
    // Delete all DRAFT items
    itemIds.forEach(itemId => {
      deleteItem(itemId);
    });

    snackbar.success(`${editingItem.name} deleted`);

    // Close modal and reset
    setShowItemModal(false);
    setEditingItem(null);
  };

  // Handler for sending item from ItemModal (DRAFT items only)
  const handleItemModalSend = () => {
    if (!editingItem) return;

    // Get all DRAFT item IDs
    const itemIds = editingItem.draftItemIds || [];
    
    // First update the items with any changes from the modal
    itemIds.forEach(itemId => {
      updateItem(itemId, {
        modifiers: itemModalModifiers,
        notes: itemModalNotes,
        discountType: itemModalDiscountValue && parseFloat(itemModalDiscountValue) > 0 ? itemModalDiscountType : undefined,
        discountValue: itemModalDiscountValue && parseFloat(itemModalDiscountValue) > 0 ? parseFloat(itemModalDiscountValue) : undefined,
        isComplimentary: itemModalIsComp,
        compReason: itemModalIsComp ? itemModalCompReason : undefined,
        dineType: itemModalDineType,
        isTakeaway: itemModalDineType === 'TAKEAWAY',
        packagingPrice: (itemModalDineType !== 'DINE_IN' && itemModalPackagingPrice && parseFloat(itemModalPackagingPrice) > 0) ? parseFloat(itemModalPackagingPrice) : undefined,
        status: 'SENT'
      });
    });

    // Create KOT for these items
    const course = editingItem.courseId ? courses.find(c => c.id === editingItem.courseId) : null;
    createKOT(checkId, itemIds, course?.number);

    // Mark course as SENT if it exists
    if (course && course.state === 'DRAFT') {
      updateCourse(course.id, { state: 'SENT' });
    }

    snackbar.success(`${editingItem.name} sent to kitchen`);

    // Close modal and reset
    setShowItemModal(false);
    setEditingItem(null);
  };

  // Handler for updating DRAFT item without sending
  const handleItemModalUpdate = () => {
    if (!editingItem) return;

    // Get all DRAFT item IDs
    const itemIds = editingItem.draftItemIds || [];
    
    // Update all DRAFT items with changes from the modal
    itemIds.forEach(itemId => {
      updateItem(itemId, {
        modifiers: itemModalModifiers,
        notes: itemModalNotes,
        discountType: itemModalDiscountValue && parseFloat(itemModalDiscountValue) > 0 ? itemModalDiscountType : undefined,
        discountValue: itemModalDiscountValue && parseFloat(itemModalDiscountValue) > 0 ? parseFloat(itemModalDiscountValue) : undefined,
        isComplimentary: itemModalIsComp,
        compReason: itemModalIsComp ? itemModalCompReason : undefined,
        dineType: itemModalDineType,
        isTakeaway: itemModalDineType === 'TAKEAWAY',
        packagingPrice: (itemModalDineType !== 'DINE_IN' && itemModalPackagingPrice && parseFloat(itemModalPackagingPrice) > 0) ? parseFloat(itemModalPackagingPrice) : undefined,
      });
    });

    snackbar.success(`${editingItem.name} updated`);

    // Close modal and reset
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleRemoveDraftItem = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    // Only allow removing DRAFT items
    if (item && item.status === 'DRAFT') {
      deleteItem(itemId);
    }
  };

  const handleEditDraftItem = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    // Only allow editing DRAFT items
    if (item && item.status === 'DRAFT') {
      // Open modifier dialog for editing
      setSelectedItemForModifiers(item.menuItemId);
      setSelectedModifiers(item.modifiers);
      setModifierNotes(item.notes || '');
      setIsNewItemComp(item.isComplimentary || false);
      setNewItemCompReason(item.compReason || '');
      // Restore dine-type so the toggle shows the item's current state
      setNewItemDineType(item.dineType || 'DINE_IN');
      setNewItemPackagingPrice(item.packagingPrice?.toString() || '');
      // Remove the item temporarily
      setDraftItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  // ─── Print Simulation Helpers ────────────────────────────────────────────
  // Determine which mock printer outcome applies based on items in this check.
  // Condition 2: Wine (Glass) + Signature Mocktail → partial success
  // Condition 3: Cappuccino + Fresh Orange Juice   → total failure
  const getPrintCondition = (): 'SUCCESS' | 'PARTIAL' | 'FAILED' | 'NO_PRINTER' => {
    const names = draftItems.map(i => i.name.toLowerCase());
    // Check for Mineral Water → no printer configured
    if (names.some(n => n.includes('mineral water'))) {
      return 'NO_PRINTER';
    }
    if (
      names.some(n => n.includes('cappuccino')) &&
      names.some(n => n.includes('fresh orange juice'))
    ) return 'FAILED';
    if (
      names.some(n => n.includes('wine')) &&
      names.some(n => n.includes('signature mocktail'))
    ) return 'PARTIAL';
    return 'SUCCESS';
  };

  // Run a 1.5 s mock print job, then resolve to one of three outcomes.
  const simulatePrint = (
    action: 'SEND_ITEM' | 'PRINT_BILL' | 'PAYMENT' | 'PRINT_TICKET',
    onSuccess: () => void
  ) => {
    setIsPrinting(true);
    setPendingPrintAction(action);
    setTimeout(() => {
      setIsPrinting(false);
      setPendingPrintAction(null);
      const condition = getPrintCondition();
      if (condition === 'SUCCESS') {
        onSuccess();
      } else if (condition === 'NO_PRINTER') {
        // No printer configured - show special dialog
        setIsNoPrinterConfigured(true);
        setShowPrintFailedDialog(true);
      } else if (condition === 'PARTIAL') {
        onSuccess(); // action still completes; dialog is informational
        // Helper: is this item a Bar Printer item?
        const isBarItem = (name: string) =>
          name.toLowerCase().includes('wine') ||
          name.toLowerCase().includes('signature mocktail');

        const aggregate = (items: typeof draftItems) =>
          items.reduce<{ name: string; qty: number }[]>((acc, item) => {
            const existing = acc.find(a => a.name === item.name);
            if (existing) existing.qty += item.quantity;
            else acc.push({ name: item.name, qty: item.quantity });
            return acc;
          }, []);

        // Bar Printer items → failed
        setPartialFailedItems(aggregate(draftItems.filter(i => isBarItem(i.name))));
        // Kitchen KOT items → succeeded
        setPartialSuccessItems(aggregate(draftItems.filter(i => !isBarItem(i.name))));
        setShowPartialPrintDialog(true);
      } else {
        // action does NOT auto-complete; user can retry or continue anyway
        pendingPostPrintCallbackRef.current = onSuccess;
        setFailedPrintAction(action);
        setShowPrintFailedDialog(true);
      }
    }, 1500);
  };
  // ────���────────────────────────────────────────────────────────────────────

  // Reprint all sent-item tickets for this check (the "Reprint Ticket" action bar button)
  const handleReprintAllTickets = () => {
    const hasSentItems = draftItems.some(i =>
      ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(i.status)
    );
    if (!hasSentItems) {
      snackbar.error('No sent items to reprint');
      return;
    }
    simulatePrint('PRINT_TICKET', () =>
      snackbar.success('Successfully reprint ticket on station')
    );
  };

  // Reprint ticket for the item currently open in ItemModal
  const handleReprintItemTicket = () => {
    setShowItemModal(false);
    simulatePrint('PRINT_TICKET', () =>
      snackbar.success('Successfully reprint ticket on station')
    );
  };

  // Reprint ticket for the course currently open in Course Action modal
  const handleReprintCourseTicket = () => {
    setShowCourseActionModal(false);
    simulatePrint('PRINT_TICKET', () =>
      snackbar.success('Successfully reprint ticket on station')
    );
  };

  const handlePrintKOT = () => {
    // Filter only DRAFT items
    const draftItemsToSend = draftItems.filter(item => item.status === 'DRAFT');
    
    if (draftItemsToSend.length === 0) {
      snackbar.error('No items to send');
      return;
    }

    simulatePrint('SEND_ITEM', () => {
    // Generate a unique batch ID for this send action to track which items were sent together
    const batchId = `BATCH-${Date.now()}`;
    console.log('[OperationalOrderScreen] Generated batchId:', batchId);
    
    // Collect all items to be created and track which course they belong to
    const allNewItems: any[] = [];
    const itemsByCourse: Map<string | null, any[]> = new Map();
    const itemsToDelete: string[] = [];
    const courseIds = Array.from(new Set(draftItemsToSend.map(item => item.courseId).filter(id => id !== null)));
    
    // For each draft item, expand it into individual 1x items if quantity > 1
    draftItemsToSend.forEach(item => {
      const course = courses.find(c => c.id === item.courseId);
      const courseKey = item.courseId;
      
      console.log('[OperationalOrderScreen] Processing item:', item.name, 'Quantity:', item.quantity);
      
      if (!itemsByCourse.has(courseKey)) {
        itemsByCourse.set(courseKey, []);
      }
      
      if (item.quantity > 1) {
        console.log('[OperationalOrderScreen] Splitting item into', item.quantity, 'individual items');
        // Split into multiple 1x items
        for (let i = 0; i < item.quantity; i++) {
          const newItem = {
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: 1,
            modifiers: item.modifiers,
            courseId: item.courseId,
            course: course ? course.number : undefined,
            status: 'SENT' as const,
            isTakeaway: item.isTakeaway,
            notes: item.notes,
            isComplimentary: item.isComplimentary,
            compReason: item.compReason || item.complimentaryReason,
            batchId: batchId,
          };
          allNewItems.push(newItem);
          itemsByCourse.get(courseKey)!.push(newItem);
        }
        
        // Mark original item for deletion
        itemsToDelete.push(item.id);
      } else {
        // Single item - will just update status
        // Add placeholder to track this item
        itemsByCourse.get(courseKey)!.push({ existingItemId: item.id });
      }
    });
    
    console.log('[OperationalOrderScreen] Will create', allNewItems.length, 'new items');
    console.log('[OperationalOrderScreen] Will update', draftItemsToSend.length - itemsToDelete.length, 'existing items');
    
    // Create all new items in ONE call
    const newItemIds = allNewItems.length > 0 ? addItems(checkId, allNewItems) : [];
    console.log('[OperationalOrderScreen] Created item IDs:', newItemIds);
    
    // Track next index for newItemIds array
    let nextItemIdIndex = 0;
    const itemIdsByCourse: Map<string | null, string[]> = new Map();
    
    // Now map the created item IDs back to courses
    draftItemsToSend.forEach(item => {
      const courseKey = item.courseId;
      
      if (!itemIdsByCourse.has(courseKey)) {
        itemIdsByCourse.set(courseKey, []);
      }
      
      if (item.quantity > 1) {
        // This item was split - grab the next N item IDs
        for (let i = 0; i < item.quantity; i++) {
          itemIdsByCourse.get(courseKey)!.push(newItemIds[nextItemIdIndex]);
          nextItemIdIndex++;
        }
      } else {
        // Single item - just update status and add to course
        updateItem(item.id, { 
          status: 'SENT',
          course: courses.find(c => c.id === item.courseId)?.number,
          batchId: batchId,
        });
        itemIdsByCourse.get(courseKey)!.push(item.id);
      }
    });
    
    // Delete items that were split
    itemsToDelete.forEach(id => deleteItem(id));
    
    console.log('[OperationalOrderScreen] Item IDs by course:', itemIdsByCourse);
    
    // Create KOTs
    if (courseIds.length > 0) {
      // Create KOT for each course
      courseIds.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        const itemIdsForCourse = itemIdsByCourse.get(courseId) || [];
        
        if (itemIdsForCourse.length > 0) {
          createKOT(checkId, itemIdsForCourse, course.number);
        }
      });
      
      // Mark courses that have items as 'SENT'
      courseIds.forEach(courseId => {
        updateCourse(courseId, { state: 'SENT' });
      });
    }
    
    // Always check for uncoursed items (can exist alongside coursed items)
    const uncoursedItemIds = itemIdsByCourse.get(null) || [];
    if (uncoursedItemIds.length > 0) {
      createKOT(checkId, uncoursedItemIds);
    }
    
    snackbar.success('KOT sent to kitchen');
    }); // end simulatePrint
  };

  const handlePayment = () => {
    if (hasDraftItems) {
      // Show warning modal - "Send Draft and Pay" will trigger simulatePrint
      setDraftWarningAction('PAYMENT');
      setShowDraftWarningModal(true);
      return;
    }
    const minPurchase = check?.minPurchaseAmount || 0;
    if (minPurchase > 0 && grandTotal < minPurchase) {
      setShowMinPurchaseWarningModal(true);
      return;
    }
    // No draft items → open payment directly
    if (onOpenPayment) onOpenPayment();
  };

  const handlePrintBill = () => {
    if (hasDraftItems) {
      // Show warning modal - "Send Draft" will trigger simulatePrint
      setDraftWarningAction('PRINT_BILL');
      setShowDraftWarningModal(true);
      return;
    }
    // No draft items → run print simulation directly
    simulatePrint('PRINT_BILL', () => snackbar.success('Bill printed successfully'));
  };

  // Auto-trigger print bill when navigated from table preview
  useEffect(() => {
    if (autoPrintBill && hasBillableItems) {
      handlePrintBill();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPrintBill]);

  const handleConfirmDraftWarning = () => {
    setShowDraftWarningModal(false);
    if (draftWarningAction === 'PAYMENT') {
      simulatePrint('PAYMENT', () => { if (onOpenPayment) onOpenPayment(); });
    } else if (draftWarningAction === 'PRINT_BILL') {
      simulatePrint('PRINT_BILL', () => snackbar.success('Bill printed successfully'));
    }
    setDraftWarningAction(null);
  };

  const handleIncludeDraftsAndProceed = () => {
    // First, send all draft items to the kitchen
    const draftItemsToSend = draftItems.filter(item => item.status === 'DRAFT');
    
    if (draftItemsToSend.length === 0) {
      setShowDraftWarningModal(false);
      setDraftWarningAction(null);
      return;
    }

    // Split items by quantity and collect item IDs for KOT
    const itemIdsByCourse: Map<string | null, string[]> = new Map();
    const courseIds = Array.from(new Set(draftItemsToSend.map(item => item.courseId).filter(id => id !== null)));
    
    // Generate a unique batch ID for this send action to track which items were sent together
    const batchId = `BATCH-${Date.now()}`;
    
    // For each draft item, split it into individual 1x items if quantity > 1
    draftItemsToSend.forEach(item => {
      const course = courses.find(c => c.id === item.courseId);
      const courseKey = item.courseId;
      
      if (!itemIdsByCourse.has(courseKey)) {
        itemIdsByCourse.set(courseKey, []);
      }
      
      if (item.quantity > 1) {
        // Split into multiple 1x items
        for (let i = 0; i < item.quantity; i++) {
          // Create a new 1x item with SENT status
          const newItemIds = addItems(checkId, [{
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: 1,
            modifiers: item.modifiers,
            courseId: item.courseId,
            course: course ? course.number : undefined,
            status: 'SENT',
            isTakeaway: item.isTakeaway,
            notes: item.notes,
            isComplimentary: item.isComplimentary,
            compReason: item.compReason || item.complimentaryReason,
            discountType: item.discountType,
            discountValue: item.discountValue,
            discountReason: item.discountReason,
            kotId: batchId, // Add batch ID to track which send action this belongs to
          }]);
          
          itemIdsByCourse.get(courseKey)!.push(...newItemIds);
        }
        
        // Delete the original item
        deleteItem(item.id);
      } else {
        // Just update the status to SENT and add kotId
        updateItem(item.id, { 
          status: 'SENT',
          course: course ? course.number : undefined,
          kotId: batchId, // Add batch ID to track which send action this belongs to
        });
        itemIdsByCourse.get(courseKey)!.push(item.id);
      }
    });
    
    // Create KOTs
    if (courseIds.length > 0) {
      // Create KOT for each course
      courseIds.forEach(courseId => {
        const course = courses.find(c => c.id === courseId);
        if (!course) return;
        
        const itemIdsForCourse = itemIdsByCourse.get(courseId) || [];
        
        if (itemIdsForCourse.length > 0) {
          createKOT(checkId, itemIdsForCourse, course.number);
        }
      });
      
      // Mark courses that have items as 'SENT'
      courseIds.forEach(courseId => {
        updateCourse(courseId, { state: 'SENT' });
      });
    }
    
    // Always check for uncoursed items (can exist alongside coursed items)
    const uncoursedItemIds = itemIdsByCourse.get(null) || [];
    if (uncoursedItemIds.length > 0) {
      createKOT(checkId, uncoursedItemIds);
    }
    
    snackbar.success('Draft items sent to kitchen');

    // Close modal
    setShowDraftWarningModal(false);

    // Capture action before clearing it
    const action = draftWarningAction;
    setDraftWarningAction(null);

    // Proceed with original action
    if (action === 'PAYMENT') {
      if (onOpenPayment) onOpenPayment();
    } else if (action === 'PRINT_BILL') {
      simulatePrint('PRINT_BILL', () => snackbar.success('Bill printed successfully'));
    }
  };

  const handleDiscardDraftsAndProceed = () => {
    // Delete all draft items
    const draftItemsToDelete = draftItems.filter(item => item.status === 'DRAFT');
    
    draftItemsToDelete.forEach(item => {
      deleteItem(item.id);
    });

    snackbar.success(`${draftItemsToDelete.length} draft item${draftItemsToDelete.length !== 1 ? 's' : ''} discarded`);

    // Close modal
    setShowDraftWarningModal(false);
    
    // Proceed with original action
    if (draftWarningAction === 'PAYMENT') {
      if (onOpenPayment) {
        onOpenPayment();
      }
    } else if (draftWarningAction === 'PRINT_BILL') {
      simulatePrint('PRINT_BILL', () => snackbar.success('Bill printed successfully'));
    }
    
    setDraftWarningAction(null);
  };

  const handleMarkServed = (itemId: string) => {
    const item = allContextItems.find(i => i.id === itemId);
    if (!item) return;

    if (item.quantity > 1) {
      // Decrement quantity and create a new SERVED item
      updateItem(itemId, { quantity: item.quantity - 1 });
      
      // Create a new SERVED item with quantity 1
      addItems(checkId, [{
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers: item.modifiers,
        courseId: item.courseId,
        status: 'SERVED',
        isTakeaway: item.isTakeaway,
        notes: item.notes,
        isComplimentary: item.isComplimentary,
        compReason: item.compReason || item.complimentaryReason,
      }]);
      
      snackbar.success('1 item marked as served');
    } else {
      // Mark the single item as served
      updateItem(itemId, { status: 'SERVED' });
      snackbar.success('Item marked as served');
    }
  };
  
  const handleMarkDraftItemServed = (itemId: string) => {
    const item = draftItems.find(i => i.id === itemId);
    if (!item || item.status !== 'READY') return;

    if (item.quantity > 1) {
      // Decrement quantity and create a new SERVED item
      updateItem(itemId, { quantity: item.quantity - 1 });
      
      // Create a new SERVED item with quantity 1
      addItems(checkId, [{
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: 1,
        modifiers: item.modifiers,
        courseId: item.courseId,
        status: 'SERVED',
        isTakeaway: item.isTakeaway,
        notes: item.notes,
        isComplimentary: item.isComplimentary,
        compReason: item.compReason || item.complimentaryReason,
      }]);
      
      snackbar.success('1 item marked as served');
    } else {
      // Mark the single item as served
      updateItem(itemId, { status: 'SERVED' });
      snackbar.success('Item marked as served');
    }
  };

  const handleItemClick = (item: any) => {
    // Only allow modifier selection for DRAFT items
    // If DRAFT item with modifiers and menuItemId, open modifier selection dialog
    if (item.status === 'DRAFT' && item.menuItemId && item.modifiers && item.modifiers.length > 0) {
      // Open modifier dialog for editing
      setSelectedItemForModifiers(item.menuItemId);
      setSelectedModifiers(item.modifiers);
      setModifierNotes(item.notes || '');
      setIsNewItemComp(item.isComplimentary || false);
      setNewItemCompReason(item.compReason || item.complimentaryReason || '');
      setEditingItemId(item.id); // Track that we're editing
      return;
    }
    
    // For fired items (SENT, READY, SERVED), skip modifier selection and go straight to action dialog
    // For DRAFT items without modifiers, also go to action dialog
    // Otherwise, open the action dialog (for Cancel/Comp/Notes)
    setSelectedItemForAction(item);
    setShowItemActionDialog(true);
    setActionType(null);
    setActionReason('');
    setActionManagerPin('');
    setActionNotes(item.notes || '');
    setActionModifiers(item.modifiers || []);
    
    // Load discount information if item has a discount
    if (item.discountType && item.discountValue) {
      setDiscountType(item.discountType);
      setDiscountValue(item.discountValue.toString());
      setDiscountReason(item.discountReason || '');
      setDiscountManagerPin('');
    } else {
      setDiscountType('PERCENTAGE');
      setDiscountValue('');
      setDiscountReason('');
      setDiscountManagerPin('');
    }
  };

  const handleConfirmItemAction = () => {
    if (actionType === 'DISCOUNT') {
      // Validate discount inputs
      if (!discountValue || parseFloat(discountValue) <= 0) {
        snackbar.error('Please enter a valid discount amount');
        return;
      }
      if (discountType === 'PERCENTAGE' && parseFloat(discountValue) > 100) {
        snackbar.error('Percentage discount cannot exceed 100%');
        return;
      }

      // Apply discount
      updateItem(selectedItemForAction.id, {
        discountType,
        discountValue: parseFloat(discountValue),
        discountReason,
        discountManagerPin,
        notes: actionNotes,
        modifiers: actionModifiers
      });
      snackbar.success('Discount applied successfully');
      
      // Reset discount state
      setDiscountType('PERCENTAGE');
      setDiscountValue('');
      setDiscountReason('');
      setDiscountManagerPin('');
    } else if (actionType && !actionReason.trim()) {
      snackbar.error('Please provide a reason for this action');
      return;
    } else if (actionType && actionManagerPin !== '1234') {
      snackbar.error('Invalid manager PIN');
      return;
    } else if (!selectedItemForAction) {
      return;
    } else if (actionType === 'CANCEL') {
      // Remove item from draft
      if (selectedItemForAction.status === 'DRAFT') {
        deleteItem(selectedItemForAction.id);
        snackbar.success('Item cancelled');
      }
    } else if (actionType === 'COMP') {
      // Mark as complimentary
      updateItem(selectedItemForAction.id, {
        isComplimentary: true,
        compReason: actionReason,
        complimentaryReason: actionReason,
        price: 0,
        notes: actionNotes,
        modifiers: actionModifiers
      });
      snackbar.success('Item marked as complimentary');
    } else {
      // Just update notes and modifiers without action
      if (selectedItemForAction.status === 'DRAFT') {
        updateItem(selectedItemForAction.id, {
          notes: actionNotes,
          modifiers: actionModifiers
        });
        snackbar.success('Item updated');
      }
    }

    // Reset
    setShowItemActionDialog(false);
    setSelectedItemForAction(null);
    setActionType(null);
    setActionReason('');
    setActionManagerPin('');
    setActionNotes('');
    setActionModifiers([]);
    setDiscountType('PERCENTAGE');
    setDiscountValue('');
    setDiscountReason('');
    setDiscountManagerPin('');
  };

  const handlePrintSingleItemKOT = () => {
    if (!selectedItemForAction || selectedItemForAction.status !== 'DRAFT') return;

    const item = selectedItemForAction;
    const course = courses.find(c => c.id === item.courseId);

    // Update item status to SENT
    updateItem(item.id, { 
      status: 'SENT',
      course: course ? course.number : undefined
    });

    // Create KOT for this single item
    createKOT(checkId, [item.id], course?.number);

    // Mark course as SENT if it exists
    if (course && course.state === 'DRAFT') {
      updateCourse(course.id, { state: 'SENT' });
    }

    snackbar.success('Item sent to kitchen');

    // Close dialog
    setShowItemActionDialog(false);
    setSelectedItemForAction(null);
    setActionType(null);
    setActionReason('');
    setActionManagerPin('');
    setActionNotes('');
    setActionModifiers([]);
  };

  const selectedMenuItem = selectedItemForModifiers 
    ? MENU_ITEMS.find(item => item.id === selectedItemForModifiers)
    : null;

  // Get quantity of a menu item across draft items
  const getMenuItemQuantity = (menuItemId: string) => {
    return draftItems
      .filter(item => item.menuItemId === menuItemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  // Sort courses by order
  const sortedCourses = [...courses].sort((a, b) => a.order - b.order);

  // Group items by status and course - now returns CombinedItems
  const getCombinedItemsForCourse = (courseId: string) => {
    const courseItems = draftItems.filter(item => item.courseId === courseId);
    return groupItems(courseItems);
  };
  
  const getUncoursedCombinedItems = () => {
    const uncoursedItems = draftItems.filter(item => item.courseId === null);
    return groupItems(uncoursedItems);
  };
  
  const uncoursedCombinedItems = getUncoursedCombinedItems();

  // Payment status logic for DINE_IN header
  type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  
  const getPaymentStatus = (): PaymentStatus => {
    // check.paidAmount already includes split payments, so we don't need to add them again
    const totalPaid = check?.paidAmount || 0;

    if (totalPaid === 0) return 'UNPAID';
    if (totalPaid >= grandTotal) return 'FULLY_PAID';
    return 'PARTIALLY_PAID';
  };

  const paymentStatus = getPaymentStatus();
  const maxSeatedMinutes = check?.maxSeatedMinutes || 90;
  const isTimeExceeded = elapsedMinutes > maxSeatedMinutes;
  const isPurchaseBelowMinimum = grandTotal < (check?.minPurchaseAmount || 0);

  // Check if there's only 1 item in Order List and it's VOID
  const hasOnlyOneVoidedItem = (() => {
    const allItems = getItemsByCheck(checkId);
    return allItems.length === 1 && allItems[0].status === 'VOIDED';
  })();

  // Show Release Table button when:
  // 1. No items added to the check yet, OR
  // 2. Table is fully paid
  const showReleaseTableButton = getItemsByCheck(checkId).length === 0 || paymentStatus === 'FULLY_PAID';

  // Check if all items are served and paid (for Release Table button)
  const allItemsServedAndPaid = (() => {
    const allItems = getItemsByCheck(checkId);
    
    // Must be fully paid
    if (paymentStatus !== 'FULLY_PAID') return false;
    
    // Must have no draft items
    if (draftItems.length > 0) return false;
    
    // If there are items, they must all be served (status === 'SERVED') or have servedQty covering all quantities
    const allServed = allItems.every(item => {
      if (item.status === 'VOIDED') return true; // voided items don't count
      return item.status === 'SERVED';
    });
    
    return allServed;
  })();

  // Get payment badge config
  const getPaymentBadgeConfig = () => {
    switch (paymentStatus) {
      case 'UNPAID':
        return {
          text: 'Unpaid',
          bgColor: '#F4F4F4',
          textColor: '#7E7E7E',
          borderColor: '#E9E9E9'
        };
      case 'PARTIALLY_PAID':
        return {
          text: 'Partially Paid',
          bgColor: '#FEF9C2',
          textColor: '#A65F00',
          borderColor: '#FFDF20'
        };
      case 'FULLY_PAID':
        return {
          text: 'Fully Paid',
          bgColor: '#E8F5E5',
          textColor: '#54A73F',
          borderColor: '#54A73F'
        };
    }
  };

  const badgeConfig = getPaymentBadgeConfig();

  // Format currency
  const formatCurrencyDisplay = (amount: number) => {
    return amount.toLocaleString('id-ID');
  };

  return (
    <>
      <div className="h-full flex flex-col bg-background">
        {/* Top Bar — only for non-DINE_IN; DINE_IN table info lives inside the right panel */}
        {check?.serviceType !== 'DINE_IN' && (
          <div className="h-[72px] bg-card border-b border-border px-6 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center cursor-pointer"
                aria-label="Go back"
              >
                <ArrowLeft />
              </button>
              <div>
                <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>
                  {mergedTableGroup ? 'Merged Table' : (check?.tableId ? `Table ${check.tableId.split('-')[1]}` : 'Order')}
                </h2>
                {mergedTableGroup ? (
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-h4)' }}>
                    {mergedTableNames}
                  </p>
                ) : (
                  <p className="text-muted-foreground" style={{ fontSize: 'var(--text-h4)' }}>
                    {check?.serviceType || 'DINE_IN'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT PANEL - Menu Section (60%) */}
          <div className="w-[60%] flex flex-col">
            {/* ── EMPTY MENU STATE (POS_EMPTY_MENU profile) ─────────────────── */}
            {posProfile === 'POS_EMPTY_MENU' ? (
              <div className="flex-1 flex flex-col items-center justify-center bg-background">
                <EmptyState
                  title="No Product Yet"
                  subtitle="Added menu will be shown here"
                />
              </div>
            ) : (
            <>
            {/* Menu Header */}
            <div className="bg-card border-b border-border p-2 flex items-stretch shrink-0 gap-2">
              <div className="flex-1 min-w-0 flex">
                <InteractiveSearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search menu items..."
                  hasCourse={false}
                />
              </div>
              
              {/* Active Course Indicator */}
              {activeCourseId !== null && (
                <div className="flex items-center gap-2 shrink-0"><span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: 'var(--text-label)' }}>Course:</span><Badge variant="outline" className="bg-white border-border px-3 py-1 cursor-pointer hover:bg-muted/50 transition-colors flex items-center gap-2" style={{ fontSize: '14px', fontWeight: 'normal', height: '36px' }} onClick={() => setShowCourseSelectionModal(true)}>Course {courses.find(c => c.id === activeCourseId)?.number}<ChevronDown className="w-4 h-4" /></Badge></div>
              )}
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Categories Sidebar */}
              <div className="w-[160px] border-r border-border shrink-0" style={{ backgroundColor: '#FFFFFF' }}>
                <ScrollArea className="h-full">
                  <div className="flex flex-col">
                    {categories.map(category => {
                      const isSelected = selectedCategory === category;
                      const colors = getCategoryColor(category);
                      
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="relative shrink-0 w-full cursor-pointer transition-colors"
                          style={{
                            backgroundColor: isSelected ? colors.selectedBg : colors.bg,
                            height: isSelected ? '66px' : 'auto',
                            borderBottom: '1px solid #d4d4d4',
                            borderColor: '#d4d4d4',
                          }}
                        >
                          <div className="flex flex-row items-center size-full">
                            <div 
                              className="content-stretch flex items-center relative w-full"
                              style={{
                                paddingTop: '20px',
                                paddingRight: '16px',
                                paddingBottom: '20px',
                                paddingLeft: '24px',
                              }}
                            >
                              <div 
                                className="flex flex-col justify-center leading-[0] not-italic relative shrink-0 whitespace-nowrap"
                                style={{
                                  fontFamily: 'Lato, sans-serif',
                                  fontWeight: 'var(--font-weight-bold)',
                                  fontSize: 'var(--text-h3)',
                                  color: colors.text,
                                  letterSpacing: '0.1238px',
                                  lineHeight: '26px',
                                }}
                              >
                                {category}
                              </div>
                              {isSelected && (
                                <div style={{
                                  position:        'absolute',
                                  left:            '4px',
                                  top:             '6px',
                                  bottom:          '6px',
                                  width:           '4px',
                                  backgroundColor: '#ffffff',
                                  borderRadius:    '0 3px 3px 0',
                                }} />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* Menu Items Grid */}
              <div className="flex-1 overflow-hidden">
                {filteredItems.length === 0 ? (
                  // Empty State
                  <div className="h-full flex flex-col items-center justify-center px-8">
                    <div className="w-[240px] h-[240px] mb-6">
                      <NoResultNotFound2 />
                    </div>
                    <h3 
                      style={{ 
                        fontSize: 'var(--text-h3)', 
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--neutral-onsurface-primary)'
                      }}
                      className="mb-2"
                    >
                      No matching results
                    </h3>
                    <p 
                      style={{ 
                        fontSize: 'var(--text-body)', 
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--neutral-onsurface-tertiary)'
                      }}
                      className="text-center"
                    >
                      Please check your filter settings or search query
                    </p>
                  </div>
                ) : posProfile === 'POS_IMAGE' ? (
                  /* ── IMAGE CARD GRID (POS_IMAGE profile) ── */
                  <ScrollArea className="h-full">
                    <div
                      className="grid grid-cols-2 xl:grid-cols-3 gap-[8px] p-[8px] pb-[200px]"
                      style={{ backgroundColor: '#F4F4F4', boxShadow: 'inset 1px 0 0 0 #D4D4D4' }}
                    >
                      {filteredItems.map(item => {
                        const quantity = getMenuItemQuantity(item.id);
                        const isAdded = quantity > 0;
                        const catColor = getCategoryColor(item.category).bg;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAddItem(item)}
                            className="relative text-left cursor-pointer flex flex-col overflow-hidden transition-transform duration-150"
                            style={{
                              borderRadius: 'var(--radius-card)',
                              backgroundColor: 'var(--neutral-surface-primary)',
                              border: isAdded
                                ? '2.5px solid var(--feature-brand-primary)'
                                : '1.5px solid var(--neutral-line-outline)',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
                              (e.currentTarget as HTMLElement).style.boxShadow = '0px 6px 16px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                              (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                            }}
                          >
                            {/* ── Photo area ── */}
                            <div
                              className="relative w-full shrink-0"
                              style={{ height: 100, backgroundColor: catColor, overflow: 'hidden' }}
                            >
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                  }}
                                  loading="lazy"
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontFamily: 'Lato, sans-serif',
                                    fontSize: 'var(--text-h2)',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    opacity: 0.6,
                                  }}
                                >
                                  {item.name.charAt(0)}
                                </div>
                              )}

                              {/* Quantity badge */}
                              {isAdded && (
                                <div
                                  className="absolute top-[6px] right-[6px] w-8 h-8 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: 'var(--feature-brand-primary)',
                                    color: 'var(--primary-foreground)',
                                    fontSize: 'var(--text-p)',
                                    fontWeight: 'var(--font-weight-bold)',
                                    fontFamily: 'Lato, sans-serif',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                                  }}
                                >
                                  {quantity}
                                </div>
                              )}
                            </div>

                            {/* ── Name strip — category colour bg, white text ── */}
                            <div
                              className="flex items-center"
                              style={{
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 8,
                                paddingBottom: 8,
                                minHeight: 56,
                                backgroundColor: catColor,
                              }}
                            >
                              <p
                                className="line-clamp-2"
                                style={{
                                  fontFamily: 'Lato, sans-serif',
                                  fontSize: 'var(--text-p)',
                                  fontWeight: 'var(--font-weight-semibold)',
                                  color: '#ffffff',
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.name}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                ) : (
                  /* ── STANDARD COLOUR CARD GRID (POS_CASHIER profile) ── */
                  <ScrollArea className="h-full">
                    <div className="grid grid-cols-2 xl:grid-cols-3 gap-[8px] p-[8px] pb-[200px]" style={{ backgroundColor: '#F4F4F4', boxShadow: 'inset 1px 0 0 0 #D4D4D4' }}>
                      {filteredItems.map(item => {
                        const quantity = getMenuItemQuantity(item.id);
                        const isAdded = quantity > 0;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleAddItem(item)}
                            className="relative text-left cursor-pointer h-[96px] flex flex-col justify-center p-[20px] transition-transform duration-150"
                            style={{
                              borderRadius: 'var(--radius-card)',
                              backgroundColor: getCategoryColor(item.category).bg,
                              border: isAdded ? '2px solid var(--color-primary)' : '1px solid var(--border)',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1.04)';
                              (e.currentTarget as HTMLElement).style.boxShadow = '0px 4px 12px rgba(0,0,0,0.15)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                          >
                            {isAdded && (
                              <div 
                                className="absolute top-[4px] right-[4px] w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}
                              >
                                {quantity}
                              </div>
                            )}
                            <h3
                              style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: getCategoryColor(item.category).text }}
                              className="truncate"
                            >
                              {item.name}
                            </h3>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
            </>
            )} {/* end posProfile conditional */}
          </div>

          {/* RIGHT PANEL - Order Operational View (40%) */}
          <div className="w-[40%] border-l border-border bg-background flex flex-col">

            {/* ── DINE_IN Table Info — pinned at top of right panel ─────────── */}
            {check?.serviceType === 'DINE_IN' && (
              <div className="border-b border-[#E9E9E9] bg-white px-4 py-3 shrink-0">
                {/* Row 1: Table name + Payment badge + Release Table button */}
                <div className="flex items-center justify-between gap-2">
                  {/* Left: table name + merged names + payment badge */}
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--text-h3)', color: '#282828', lineHeight: '24px' }}>
                      {mergedTableGroup ? 'Merged Table' : `Table ${table?.name || ''}`}
                    </p>
                    {mergedTableGroup && (
                      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-h4)', color: '#7E7E7E' }}>
                        {mergedTableNames}
                      </p>
                    )}
                    {(() => {
                      const allSplitsPaid = !!splitBill && splitBill.splits.length > 0 && splitBill.splits.every(s => s.paid);
                      const cfg = allSplitsPaid
                        ? { text: 'Fully Paid', bgColor: '#E8F5E5', textColor: '#54A73F', borderColor: '#54A73F' }
                        : (badgeConfig ?? { text: 'Unpaid', bgColor: '#F4F4F4', textColor: '#7E7E7E', borderColor: '#E9E9E9' });
                      return (
                        <div
                          className="flex items-center justify-center px-2.5 rounded-lg border"
                          style={{ height: 26, backgroundColor: cfg.bgColor, borderColor: cfg.borderColor }}
                        >
                          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-h4)', color: cfg.textColor, whiteSpace: 'nowrap' }}>
                            {cfg.text}
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                  {/* Right: Release Table button — shown when no items yet or fully paid */}
                  {showReleaseTableButton && (
                    <MainBtn
                      variant="destructive"
                      size="md"
                      onClick={() => {
                        const minPurchase = check?.minPurchaseAmount || 0;
                        const totalPurchase = check?.totalAmount || 0;
                        if (minPurchase > 0 && totalPurchase < minPurchase) {
                          setShowReleaseTableModal(true);
                        } else {
                          const allItems = getItemsByCheck(checkId);
                          if (allItems.length === 0) {
                            deleteCheck(checkId);
                            snackbar.success('Empty bill deleted and table released');
                          } else {
                            closeCheck(checkId);
                            snackbar.success('Table released successfully');
                          }
                          onClose();
                        }
                      }}
                      style={{
                        fontSize: 'var(--text-label)',
                        fontWeight: 'var(--font-weight-semibold)',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}
                    >
                      Release Table
                    </MainBtn>
                  )}
                </div>
                {/* Row 2: Pax | Time Seated | Purchase */}
                <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                  {/* Pax */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#282828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-h4)', color: '#282828' }}>
                      {check?.guestCount || 0} pax
                    </p>
                  </div>
                  <div className="h-3.5 w-px bg-[#E9E9E9] shrink-0" />
                  {/* Time Seated */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-h4)', color: '#7E7E7E' }}>Time Seated</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-h4)', color: isTimeExceeded ? '#D0021B' : '#282828' }}>
                      {elapsedMinutes}m / {maxSeatedMinutes}m
                    </p>
                  </div>
                  <div className="h-3.5 w-px bg-[#E9E9E9] shrink-0" />
                  {/* Purchase */}
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="#7E7E7E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23" />
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-h4)', color: '#7E7E7E' }}>Purchase</p>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--text-h4)', color: isPurchaseBelowMinimum ? '#D0021B' : '#282828' }}>
                      {formatCurrencyDisplay(grandTotal)} / {formatCurrencyDisplay(check?.minPurchaseAmount || 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
              <div>
                {/* UNIFIED SECTION: All Items (Draft + Sent) */}
                <div>
                  {/* Uncoursed Items - Shows combined items */}
                  {uncoursedCombinedItems.length > 0 && (
                    <div>
                      {uncoursedCombinedItems.map((combinedItem) => (
                        <DraggableItemCard
                          key={combinedItem.id}
                          item={combinedItem}
                          courseId={null}
                          onEdit={() => handleCombinedItemClick(combinedItem)}
                          onRemove={() => handleRemoveCombinedItem(combinedItem)}
                          onIncrementQuantity={() => handleIncrementCombinedQuantity(combinedItem)}
                          onDecrementQuantity={() => handleDecrementCombinedQuantity(combinedItem)}
                          onMove={handleMoveItem}
                          onMarkServed={() => handleMarkCombinedServed(combinedItem)}
                        />
                      ))}
                    </div>
                  )}

                  {/* ALL Courses - Shows both DRAFT and SENT courses, including empty ones */}
                  <div>
                    {(() => {
                      // Check if ANY course has fired items (globally)
                      const hasAnyFiredItems = sortedCourses.some(course => {
                        const itemsInCourse = draftItems.filter(item => item.courseId === course.id);
                        return itemsInCourse.some(item => 
                          item.status === 'SENT' || item.status === 'READY' || item.status === 'SERVED'
                        );
                      });

                      return sortedCourses.map((course) => {
                        // Get combined items for this course
                        const combinedItemsInCourse = getCombinedItemsForCourse(course.id);
                        const rawItemsInCourse = draftItems.filter(item => item.courseId === course.id);
                        
                        return (
                          <DraggableCourseSection
                            key={course.id}
                            course={course}
                            onItemDrop={handleMoveItem}
                          >
                            <div id={`course-${course.id}`}>
                              <DraggableCourseHeader
                                course={course}
                                isActive={activeCourseId === course.id}
                                itemCount={rawItemsInCourse.length}
                                onSelect={() => handleCourseSettings(course.id)}
                                onDelete={() => handleDeleteCourse(course.id)}
                                onReorder={handleReorderCourse}
                                onCourseClick={() => handleCourseClick(course.id)}
                                allItemsInCourse={rawItemsInCourse}
                                hasAnyFiredItems={hasAnyFiredItems}
                              />
                            {combinedItemsInCourse.length > 0 && (
                              <div>
                                {combinedItemsInCourse.map((combinedItem) => (
                                  <DraggableItemCard
                                    key={combinedItem.id}
                                    item={combinedItem}
                                    courseId={course.id}
                                    onEdit={() => handleCombinedItemClick(combinedItem)}
                                    onRemove={() => handleRemoveCombinedItem(combinedItem)}
                                    onIncrementQuantity={() => handleIncrementCombinedQuantity(combinedItem)}
                                    onDecrementQuantity={() => handleDecrementCombinedQuantity(combinedItem)}
                                    onMove={handleMoveItem}
                                    onMarkServed={() => handleMarkCombinedServed(combinedItem)}
                                  />
                                ))}
                              </div>
                            )}
                            </div>
                          </DraggableCourseSection>
                        );
                    });})()}
                  </div>
                </div>


              </div>
            </div>

            {/* Split Bill Progress Section - Sticky above footer */}
            {splitBill && (
              <SplitBillCompactSection 
                splitBill={splitBill} 
                onManage={onOpenSplitBill}
              />
            )}

            {/* PINNED FOOTER: Totals & Sticky Action Bar */}
            <div
              className="border-t border-border bg-background shrink-0 px-[16px] pt-[16px]"
              style={{ paddingBottom: 'calc(16px + 175px)' }}
            >
              {/* Totals */}
              <div className="space-y-2">
                {/* Tax */}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                    Tax (5%)
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                    {formatCurrency(tax)}
                  </span>
                </div>
                
                {/* Service Charge */}
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                    Service Charge (10%)
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                    {formatCurrency(serviceCharge)}
                  </span>
                </div>
                
                {/* Item Discount - only show when applied */}
                {itemDiscountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }} className="text-green-600">
                      Discount (Items)
                    </span>
                    <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }} className="text-green-600">
                      -{formatCurrency(itemDiscountAmount)}
                    </span>
                  </div>
                )}
                
                {/* Bill Discount - only show when applied */}
                {billDiscountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }} className="text-green-600">
                      Discount (Bill) {check?.billDiscountType === 'PERCENTAGE' ? `(${check?.billDiscountValue}%)` : ''}
                    </span>
                    <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }} className="text-green-600">
                      -{formatCurrency(billDiscountAmount)}
                    </span>
                  </div>
                )}
                
                {/* Tip - only show when applied */}
                {tipAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                      Tip
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                      {formatCurrency(tipAmount)}
                    </span>
                  </div>
                )}

                {/* Grand Total */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                    Grand Total
                  </span>
                  <span style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }} className="text-primary">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
                
                {paidAmount > 0 && (
                  <>
                    <div className="flex items-center justify-between text-green-600">
                      <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Paid</span>
                      <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {formatCurrency(paidAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-orange-600">
                      <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>Outstanding</span>
                      <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                        {formatCurrency(outstanding)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* ── Action Buttons — position:fixed full-width bar at screen bottom ── */}
              <div
                style={{
                  position:        'fixed',
                  bottom:          0,
                  left:            0,
                  right:           0,
                  zIndex:          40,
                  backgroundColor: 'var(--neutral-surface-primary)',
                  borderTop:       '2px solid var(--neutral-line-outline)',
                  padding:         '20px',
                  display:         'flex',
                  flexDirection:   'column',
                  gap:             12,
                }}
              >
                {/* Row 1 — Figma: Trx Note | Guest/Pax | Discount | Reprint KOT | Send Item | Add Course */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <MainBtn className="whitespace-nowrap"
                    size="lg" variant="primary"
                    style={{ flex: '1 1 0', minWidth: 0, backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none', fontWeight: 600 }}
                    onClick={() => { setCustomerNote(check?.checkNote || ''); setShowCustomerNoteModal(true); }}
                  >
                    <StickyNote className="w-4 h-4 mr-1.5 shrink-0" />
                    Trx Note
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg" variant="primary"
                    style={{ flex: '1 1 0', minWidth: 0, backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none', fontWeight: 600 }}
                    onClick={() => {
                      setGuestCount(check?.guestCount?.toString() || '');
                      setGuestName(check?.guestName || '');
                      setGuestPhone(check?.guestPhone || '');
                      setShowGuestPaxModal(true);
                    }}
                  >
                    <UserCog className="w-4 h-4 mr-1.5 shrink-0" />
                    Guest/Pax
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...((hasBillableItems || hasDraftItems) ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      if (!hasBillableItems && !hasDraftItems) { snackbar.error('No items in order list'); return; }
                      if (check?.billDiscountType && check?.billDiscountValue) {
                        setBillDiscountType(check.billDiscountType);
                        setBillDiscountValue(check.billDiscountValue.toString());
                        setBillDiscountReason(check.billDiscountReason || '');
                      } else {
                        setBillDiscountType('PERCENTAGE');
                        setBillDiscountValue('');
                        setBillDiscountReason('');
                      }
                      setBillDiscountManagerPin('');
                      setShowBillDiscountModal(true);
                    }}
                    disabled={!hasBillableItems && !hasDraftItems}
                    variant={(hasBillableItems || hasDraftItems) ? 'primary' : 'disabled'}
                  >
                    <Percent className="w-4 h-4 mr-1.5 shrink-0" />
                    Discount
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(hasBillableItems ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={handleReprintAllTickets}
                    disabled={!hasBillableItems || (isPrinting && pendingPrintAction === 'PRINT_TICKET')}
                    variant={hasBillableItems ? 'primary' : 'disabled'}
                  >
                    {isPrinting && pendingPrintAction === 'PRINT_TICKET'
                      ? <Loader2 className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
                      : <Printer className="w-4 h-4 mr-1.5 shrink-0" />
                    }
                    {isPrinting && pendingPrintAction === 'PRINT_TICKET' ? 'Reprinting…' : 'Reprint KOT'}
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(hasDraftItems ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={handlePrintKOT}
                    disabled={!hasDraftItems || (isPrinting && pendingPrintAction === 'SEND_ITEM')}
                    variant={hasDraftItems ? 'primary' : 'disabled'}
                  >
                    {isPrinting && pendingPrintAction === 'SEND_ITEM'
                      ? <Loader2 className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
                      : <Printer className="w-4 h-4 mr-1.5 shrink-0" />
                    }
                    {isPrinting && pendingPrintAction === 'SEND_ITEM'
                      ? 'Sending…'
                      : <>Send Item{totalItemCount > 0 ? ` (${totalItemCount})` : ''}</>
                    }
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg" onClick={handleAddCourse} variant="primary"
                    style={{ flex: '1 1 0', minWidth: 0, backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none', fontWeight: 600 }}
                  >
                    <Plus className="w-4 h-4 mr-1.5 shrink-0" />
                    Add Course
                  </MainBtn>
                </div>

                {/* Row 2 — Figma: Transfer Table | Merge Table | Transfer Item/Course | Tip | Print Bill | Payment */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(check?.serviceType === 'DINE_IN' ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    variant={check?.serviceType === 'DINE_IN' ? 'primary' : 'disabled'}
                    disabled={check?.serviceType !== 'DINE_IN'}
                    onClick={() => setShowTransferTableModal(true)}
                  >
                    <ArrowRightLeft className="w-4 h-4 mr-1.5 shrink-0" />
                    Transfer Table
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(check?.serviceType === 'DINE_IN' ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    variant={check?.serviceType === 'DINE_IN' ? 'primary' : 'disabled'}
                    disabled={check?.serviceType !== 'DINE_IN'}
                    onClick={() => setShowMergeTableModal(true)}
                  >
                    <Users className="w-4 h-4 mr-1.5 shrink-0" />
                    Merge Table
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(hasTransferableCourses ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={() => {
                      if (!hasTransferableCourses) { snackbar.error('No transferable items or courses available'); return; }
                      setShowTransferCourseSelectModal(true);
                    }}
                    disabled={!hasTransferableCourses}
                    variant={hasTransferableCourses ? 'primary' : 'disabled'}
                  >
                    <Share2 className="w-4 h-4 mr-1.5 shrink-0" />
                    Transfer Item/Course
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg" variant="primary"
                    style={{ flex: '1 1 0', minWidth: 0, backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none', fontWeight: 600 }}
                    onClick={() => {
                      setTipInput(check?.tipAmount ? check.tipAmount.toString() : '');
                      setShowTipModal(true);
                    }}
                  >
                    <HandCoins className="w-4 h-4 mr-1.5 shrink-0" />
                    Tip
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(hasBillableItems ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={handlePrintBill}
                    disabled={!hasBillableItems || (isPrinting && pendingPrintAction === 'PRINT_BILL')}
                    variant={hasBillableItems ? 'primary' : 'disabled'}
                  >
                    {isPrinting && pendingPrintAction === 'PRINT_BILL'
                      ? <Loader2 className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
                      : <Printer className="w-4 h-4 mr-1.5 shrink-0" />
                    }
                    {isPrinting && pendingPrintAction === 'PRINT_BILL' ? 'Printing…' : 'Print Bill'}
                  </MainBtn>

                  <MainBtn className="whitespace-nowrap"
                    size="lg"
                    style={{
                      flex: '1 1 0',
                      minWidth: 0,
                      ...(!(draftItems.length === 0 || paymentStatus === 'FULLY_PAID') ? { backgroundColor: 'var(--feature-brand-primary)', color: '#ffffff', border: 'none' } : {}),
                      fontWeight: 600,
                    }}
                    onClick={handlePayment}
                    disabled={draftItems.length === 0 || paymentStatus === 'FULLY_PAID' || (isPrinting && pendingPrintAction === 'PAYMENT')}
                    variant={draftItems.length === 0 || paymentStatus === 'FULLY_PAID' ? 'disabled' : 'primary'}
                  >
                    {isPrinting && pendingPrintAction === 'PAYMENT'
                      ? <Loader2 className="w-4 h-4 mr-1.5 shrink-0 animate-spin" />
                      : <CreditCard className="w-4 h-4 mr-1.5 shrink-0" />
                    }
                    {isPrinting && pendingPrintAction === 'PAYMENT' ? 'Processing…' : 'Payment'}
                  </MainBtn>
                </div>

              </div>
              {/* More Options Dialog removed — all actions are in the fixed bottom bar above */}
              {false && <Dialog open={false} onOpenChange={() => {}}>
                    <DialogContent className="sm:max-w-[900px]">
                      <DialogHeader>
                        <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                          More Options
                        </DialogTitle>
                        <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
                          Select an action for this check
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-3 gap-3 py-4">
                        {/* Row 1 */}
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            setCustomerNote(check?.checkNote || '');
                            setShowCustomerNoteModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <StickyNote className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Customer Note
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            setGuestCount(check?.guestCount?.toString() || '');
                            setGuestName(check?.guestName || '');
                            setGuestPhone(check?.guestPhone || '');
                            setShowGuestPaxModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <UserCog className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Guest / Pax
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (!hasBillableItems) {
                              snackbar.error('No items in order list');
                              return;
                            }
                            setIsMoreOptionsModalOpen(false);
                            onOpenSplitBill?.();
                          }}
                          disabled={!hasBillableItems}
                          className={`h-[120px] border flex flex-col items-center justify-center transition-all duration-200 ${
                            hasBillableItems 
                              ? 'bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)] cursor-pointer'
                              : 'bg-[var(--neutral-surface-disabled)] border-[var(--neutral-line-outline)] opacity-50 cursor-not-allowed'
                          }`}
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <Receipt className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Split Bill
                          </span>
                        </button>
                        
                        {/* Row 2 - DINE_IN only */}
                        {check?.serviceType === 'DINE_IN' && (<>
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            setShowTransferTableModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <ArrowRightLeft className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Transfer Table
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            setShowMergeTableModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Merge Table
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (!hasTransferableCourses) {
                              snackbar.error('No transferable items or courses available');
                              return;
                            }
                            setIsMoreOptionsModalOpen(false);
                            setShowTransferCourseSelectModal(true);
                          }}
                          disabled={!hasTransferableCourses}
                          className={`h-[120px] border flex flex-col items-center justify-center transition-all duration-200 ${
                            hasTransferableCourses 
                              ? 'bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)] cursor-pointer'
                              : 'bg-[var(--neutral-surface-disabled)] border-[var(--neutral-line-outline)] opacity-50 cursor-not-allowed'
                          }`}
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <Share2 className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Transfer Item/Course
                          </span>
                        </button>
                        </>)}
                        
                        {/* Row 3 */}
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            const canChangePricelist = check && check.status === 'OPEN' && check.paidAmount === 0;
                            if (!canChangePricelist) {
                              snackbar.error('Cannot change pricelist after payment');
                              return;
                            }
                            setShowPricelistModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <DollarSign className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Pricelist
                          </span>
                        </button>
                        
                        <button
                          onClick={() => {
                            if (!hasBillableItems) {
                              snackbar.error('No items in order list');
                              return;
                            }
                            setIsMoreOptionsModalOpen(false);
                            // Load existing bill discount if any
                            if (check?.billDiscountType && check?.billDiscountValue) {
                              setBillDiscountType(check.billDiscountType);
                              setBillDiscountValue(check.billDiscountValue.toString());
                              setBillDiscountReason(check.billDiscountReason || '');
                            } else {
                              setBillDiscountType('PERCENTAGE');
                              setBillDiscountValue('');
                              setBillDiscountReason('');
                            }
                            setBillDiscountManagerPin('');
                            setShowBillDiscountModal(true);
                          }}
                          disabled={!hasBillableItems}
                          className={`h-[120px] border flex flex-col items-center justify-center transition-all duration-200 ${
                            hasBillableItems 
                              ? 'bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)] cursor-pointer'
                              : 'bg-[var(--neutral-surface-disabled)] border-[var(--neutral-line-outline)] opacity-50 cursor-not-allowed'
                          }`}
                          style={{ 
                            borderRadius: 'var(--radius-card)', 
                            gap: 'var(--spacing-md)'
                          }}
                        >
                          <Percent className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Discount
                          </span>
                        </button>
                        
                        {/* Tip */}
                        <button
                          onClick={() => {
                            setIsMoreOptionsModalOpen(false);
                            setTipInput(check?.tipAmount ? check.tipAmount.toString() : '');
                            setShowTipModal(true);
                          }}
                          className="h-[120px] border flex flex-col items-center justify-center transition-all duration-200 bg-[#F3F7FE] border-[var(--neutral-line-outline)] hover:bg-[var(--neutral-surface-greylighter)] hover:border-[var(--neutral-line-outline)]"
                          style={{ borderRadius: 'var(--radius-card)', gap: 'var(--spacing-md)' }}
                        >
                          <HandCoins className="w-5 h-5 text-muted-foreground" />
                          <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Tip
                          </span>
                        </button>


                      </div>
                    </DialogContent>
                  </Dialog>}


            </div>
          </div>
        </div>
      </div>

      {/* Modifier Selection Dialog */}
      <ItemModal
        open={!!selectedItemForModifiers}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItemForModifiers(null);
            setSelectedModifiers([]);
            setModifierNotes('');
            setEditingItemId(null);
            setIsNewItemComp(false);
            setNewItemCompReason('');
            setNewItemManagerPin('');
            setNewItemDineType('DINE_IN');
            setNewItemPackagingPrice('');
            setNewItemDiscountValue('');
          }
        }}
        menuItem={selectedMenuItem || null}
        selectedModifiers={selectedModifiers}
        onModifiersChange={setSelectedModifiers}
        modifierNotes={modifierNotes}
        onNotesChange={setModifierNotes}
        discountType={newItemDiscountType}
        onDiscountTypeChange={setNewItemDiscountType}
        discountValue={newItemDiscountValue}
        onDiscountValueChange={setNewItemDiscountValue}
        isComplimentary={isNewItemComp}
        onComplimentaryChange={setIsNewItemComp}
        compReason={newItemCompReason}
        onCompReasonChange={setNewItemCompReason}
        compManagerPin={newItemManagerPin}
        onCompManagerPinChange={setNewItemManagerPin}
        dineType={newItemDineType}
        onDineTypeChange={setNewItemDineType}
        packagingPrice={newItemPackagingPrice}
        onPackagingPriceChange={setNewItemPackagingPrice}
        onConfirm={handleConfirmModifiers}
        checkStatus={paymentStatus}
      />

      {/* Item Action Dialog - Modify Item */}
      <Dialog open={showItemActionDialog} onOpenChange={setShowItemActionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Modify Item
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              {selectedItemForAction?.name}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 py-4 pr-4">
              {/* Current Discount - Show if item has discount applied */}
              {selectedItemForAction?.discountType && selectedItemForAction?.discountValue && (
                <div className="p-4 bg-blue-50 border border-blue-200 space-y-2" style={{ borderRadius: 'var(--radius-card)' }}>
                  <h4 style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }} className="text-blue-900">
                    Current Discount Applied
                  </h4>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 'var(--text-p)' }}>
                      {selectedItemForAction.discountType === 'PERCENTAGE' 
                        ? `${selectedItemForAction.discountValue}% off` 
                        : `${formatCurrency(selectedItemForAction.discountValue)} off`}
                    </span>
                    <div className="flex flex-col items-end">
                      <span className="text-muted-foreground line-through" style={{ fontSize: 'var(--text-label)' }}>
                        {formatCurrency(selectedItemForAction.price)}
                      </span>
                      <span className="text-primary" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                        {formatCurrency(
                          selectedItemForAction.discountType === 'PERCENTAGE'
                            ? selectedItemForAction.price * (1 - selectedItemForAction.discountValue / 100)
                            : Math.max(0, selectedItemForAction.price - selectedItemForAction.discountValue)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Selection - Only show for DRAFT items */}
              {selectedItemForAction?.status === 'DRAFT' && (
                <div className="space-y-3">
                  <h4 style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                    Select Action (Optional)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <MainBtn
                      variant={actionType === 'CANCEL' ? 'primary' : 'secondary'}
                      onClick={() => setActionType(actionType === 'CANCEL' ? null : 'CANCEL')}
                      size="lg"
                    >
                      <Trash2 className="w-5 h-5 mr-2" />
                      Cancel Item
                    </MainBtn>
                    <MainBtn
                      variant={actionType === 'COMP' ? 'primary' : 'secondary'}
                      onClick={() => setActionType(actionType === 'COMP' ? null : 'COMP')}
                      size="lg"
                    >
                      <Gift className="w-5 h-5 mr-2" />
                      Comp
                    </MainBtn>
                    <MainBtn
                      variant={actionType === 'DISCOUNT' ? 'primary' : 'secondary'}
                      onClick={() => setActionType(actionType === 'DISCOUNT' ? null : 'DISCOUNT')}
                      size="lg"
                      className="col-span-2"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Apply Discount
                    </MainBtn>
                  </div>
                </div>
              )}

              {/* Action Selection - Only COMP for Fired items */}
              {selectedItemForAction?.status !== 'DRAFT' && (
                <div className="space-y-3">
                  <h4 style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                    Select Action (Optional)
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Allow comp for unpaid items only */}
                    {check && check.paidAmount === 0 && (
                      <MainBtn
                        variant={actionType === 'COMP' ? 'primary' : 'secondary'}
                        onClick={() => setActionType(actionType === 'COMP' ? null : 'COMP')}
                        size="lg"
                      >
                        <Gift className="w-5 h-5 mr-2" />
                        Comp
                      </MainBtn>
                    )}
                    {/* Allow discount for unpaid items */}
                    {check && check.paidAmount === 0 && (
                      <MainBtn
                        variant={actionType === 'DISCOUNT' ? 'primary' : 'secondary'}
                        onClick={() => setActionType(actionType === 'DISCOUNT' ? null : 'DISCOUNT')}
                        size="lg"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Apply Discount
                      </MainBtn>
                    )}
                  </div>
                </div>
              )}

              {/* Discount Configuration - Only show if DISCOUNT action is selected */}
              {actionType === 'DISCOUNT' && (
                <div className="space-y-3">
                  <h4 style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                    Configure Discount
                  </h4>

                  {/* Discount Field Container */}
                  <div className="flex gap-[10px] items-center">
                    {/* Toggle Container */}
                    <div className="flex items-center p-[4px] relative rounded-[10px] shrink-0 border border-primary">
                      <button
                        type="button"
                        onClick={() => setDiscountType('FIXED')}
                        className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                          discountType === 'FIXED' 
                            ? 'bg-primary text-white' 
                            : 'bg-transparent text-primary'
                        }`}
                      >
                        <span style={{ fontSize: 'var(--text-label)' }}>IDR</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('PERCENTAGE')}
                        className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                          discountType === 'PERCENTAGE' 
                            ? 'bg-primary text-white' 
                            : 'bg-transparent text-primary'
                        }`}
                      >
                        <span style={{ fontSize: 'var(--text-label)' }}>%</span>
                      </button>
                    </div>

                    {/* Input Field */}
                    <div className="flex-1 relative bg-white rounded-[10px] border border-[#e9e9e9]">
                      <input
                        type="text"
                        readOnly
                        placeholder="0"
                        value={discountValue}
                        onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', discountValue, (val) => {
                          if (discountType === 'PERCENTAGE' && parseFloat(val) > 100) setDiscountValue('100');
                          else setDiscountValue(val);
                        }, e.currentTarget); }}
                        className="w-full px-[16px] py-[12px] rounded-[10px] text-right bg-transparent outline-none"
                        style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                      />
                      <div className="absolute right-[16px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ fontSize: 'var(--text-p)' }}>
                        {discountType === 'PERCENTAGE' ? '%' : 'IDR'}
                      </div>
                    </div>
                  </div>

                  {/* Price Preview */}
                  {selectedItemForAction && discountValue && (
                    <p className="text-blue-700" style={{ fontSize: 'var(--text-label)' }}>
                      Original Price: {formatCurrency(selectedItemForAction.price)} →{' '}
                      Discounted Price:{' '}
                      {formatCurrency(
                        discountType === 'PERCENTAGE'
                          ? selectedItemForAction.price * (1 - parseFloat(discountValue) / 100)
                          : Math.max(0, selectedItemForAction.price - parseFloat(discountValue))
                      )}
                    </p>
                  )}
                </div>
              )}

              {/* Notes Input */}
              <div className="space-y-2">
                <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                  Notes
                </label>
                <Textarea
                  placeholder="Add special instructions or notes..."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="min-h-[80px]"
                  style={{ 
                    borderRadius: 'var(--radius-input)', 
                    fontSize: 'var(--text-p)'
                  }}
                />
              </div>

              {/* Modifier Selection - Show if item has available modifiers */}
              {(() => {
                const menuItem = MENU_ITEMS.find(mi => mi.id === selectedItemForAction?.menuItemId);
                if (menuItem && menuItem.availableModifiers && menuItem.availableModifiers.length > 0) {
                  return (
                    <div className="space-y-2">
                      <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                        Modifiers
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {menuItem.availableModifiers.map((mod, idx) => {
                          const modName = typeof mod === 'string' ? mod : mod.name;
                          const isSelected = actionModifiers.includes(modName);
                          return (
                            <MainBtn
                              key={idx}
                              variant={isSelected ? 'primary' : 'secondary'}
                              onClick={() => {
                                if (isSelected) {
                                  setActionModifiers(actionModifiers.filter(m => m !== modName));
                                } else {
                                  setActionModifiers([...actionModifiers, modName]);
                                }
                              }}
                              size="md"
                              className="justify-start"
                            >
                              {modName}
                            </MainBtn>
                          );
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {/* Reason - Only show if action is selected */}
              {actionType && (
                <div className="space-y-2">
                  <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                    Reason *
                  </label>
                  <Textarea
                    placeholder="Enter reason for this action..."
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    className="min-h-[80px]"
                    style={{ 
                      borderRadius: 'var(--radius-input)', 
                      fontSize: 'var(--text-p)'
                    }}
                  />
                </div>
              )}

              {/* Manager PIN - Only show if action is selected */}
              {actionType && (
                <div className="space-y-2">
                  <label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="block">
                    Manager PIN *
                  </label>
                  <Input
                    type="password"
                    placeholder="Enter manager PIN"
                    value={actionManagerPin}
                    onChange={(e) => setActionManagerPin(e.target.value)}
                    className="h-[48px]"
                    style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                    maxLength={4}
                  />
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {/* Send Item button - Only for DRAFT items */}
            {selectedItemForAction?.status === 'DRAFT' && (
              <MainBtn
                variant="primary"
                onClick={handlePrintSingleItemKOT}
                className="sm:mr-auto"
                size="lg"
              >
                <Printer className="w-4 h-4 mr-2" />
                Send Item
              </MainBtn>
            )}
            <div className="flex gap-2 sm:ml-auto">
              <MainBtn
                variant="secondary"
                onClick={() => {
                  setShowItemActionDialog(false);
                  setSelectedItemForAction(null);
                  setActionType(null);
                  setActionReason('');
                  setActionManagerPin('');
                  setActionNotes('');
                  setActionModifiers([]);
                  setDiscountType('PERCENTAGE');
                  setDiscountValue('');
                  setDiscountReason('');
                  setDiscountManagerPin('');
                }}
                size="lg"
              >
                Cancel
              </MainBtn>
              <MainBtn
                onClick={handleConfirmItemAction}
                size="lg"
              >
                Confirm
              </MainBtn>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Draft Items Warning Modal */}
      <Dialog open={showDraftWarningModal} onOpenChange={setShowDraftWarningModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              {draftWarningAction === 'PRINT_BILL' ? 'Print Bill �� Unfired Draft Items' : 'Unfired Draft Items'}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              {draftWarningAction === 'PRINT_BILL'
                ? `You have ${totalItemCount} item${totalItemCount !== 1 ? 's' : ''} that haven't been sent to the kitchen yet. They won't appear on the printed bill unless sent first.`
                : `You have ${totalItemCount} item${totalItemCount !== 1 ? 's' : ''} that haven't been sent to the kitchen`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                Draft Items:
              </p>
              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                {draftItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-muted-foreground px-[0px] py-[4px]">
                    <span style={{ fontSize: 'var(--text-h4)' }}>
                      {item.quantity}x {item.name}
                    </span>
                    <span style={{ fontSize: 'var(--text-h4)' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <MainBtn
              variant="destructive"
              onClick={handleDiscardDraftsAndProceed}
              size="lg"
              className="flex-1"
              disabled={isPrinting}
            >
              {draftWarningAction === 'PRINT_BILL' ? 'Print Without Draft' : 'Discard Draft'}
            </MainBtn>
            <MainBtn
              variant="primary"
              onClick={handleIncludeDraftsAndProceed}
              size="lg"
              className="flex-1 whitespace-nowrap"
              disabled={isPrinting}
            >
              {isPrinting
                ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                : <Printer className="w-5 h-5 mr-2" />
              }
              {isPrinting ? 'Printing…' : (draftWarningAction === 'PRINT_BILL' ? 'Send Draft & Print' : 'Send Draft and Pay')}
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Minimum Purchase Warning Modal */}
      <Dialog open={showMinPurchaseWarningModal} onOpenChange={setShowMinPurchaseWarningModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Minimum Purchase Not Met
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Customer hasn't reached minimum purchase order yet
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 space-y-2" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Current Total:
                </span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--status-red-primary)' }}>
                  {formatCurrency(grandTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Minimum Required:
                </span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                  {formatCurrency(check?.minPurchaseAmount || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-orange-300">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Shortage:
                </span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--status-red-primary)' }}>
                  {formatCurrency((check?.minPurchaseAmount || 0) - grandTotal)}
                </span>
              </div>
            </div>
            
            
          </div>

          <DialogFooter className="flex gap-2">
            <MainBtn
              variant="secondary"
              onClick={() => setShowMinPurchaseWarningModal(false)}
              size="lg"
              className="flex-1"
            >
              Cancel
            </MainBtn>
            <MainBtn
              variant="primary"
              onClick={() => {
                setShowMinPurchaseWarningModal(false);
                if (onOpenPayment) {
                  onOpenPayment();
                }
              }}
              size="lg"
              className="flex-1"
            >
              Proceed Payment
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Action Modal */}
      <Dialog open={showCourseActionModal} onOpenChange={setShowCourseActionModal}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Course {selectedCourseForAction ? courses.find(c => c.id === selectedCourseForAction)?.number : ''} Actions
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Select an action for this course
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex-row gap-3 mt-6">
            {/* Delete Course Button - Only show if no fired items */}
            {selectedCourseForAction && (() => {
              const itemsInCourse = draftItems.filter(item => item.courseId === selectedCourseForAction);
              const hasFiredItems = itemsInCourse.some(item => item.status !== 'DRAFT');
              
              if (!hasFiredItems) {
                return (
                  <MainBtn
                    variant="destructive"
                    onClick={handleDeleteCourseFromModal}
                    size="lg"
                    className="flex-1 whitespace-nowrap"
                    style={{ fontWeight: 'var(--font-weight-regular)' }}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Course
                  </MainBtn>
                );
              }
              return null;
            })()}
            
            {/* Send Course Button - only for courses that still have DRAFT items */}
            {selectedCourseForAction && (() => {
              const itemsInCourse = draftItems.filter(item => item.courseId === selectedCourseForAction);
              const hasDraftInCourse = itemsInCourse.some(i => i.status === 'DRAFT');
              if (!hasDraftInCourse) return null;
              return (
                <MainBtn
                  variant="default"
                  onClick={handlePrintCourseKOT}
                  size="lg"
                  className="flex-1 whitespace-nowrap"
                  style={{ fontWeight: 'var(--font-weight-regular)' }}
                >
                  <Printer className="w-5 h-5 mr-2" />
                  Send Course
                </MainBtn>
              );
            })()}

            {/* Reprint Ticket Button - only for courses with already-sent items */}
            {selectedCourseForAction && (() => {
              const itemsInCourse = draftItems.filter(item => item.courseId === selectedCourseForAction);
              const hasSentInCourse = itemsInCourse.some(i =>
                ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(i.status)
              );
              if (!hasSentInCourse) return null;
              return (
                <MainBtn
                  variant="secondary"
                  onClick={handleReprintCourseTicket}
                  size="lg"
                  className="flex-1 whitespace-nowrap"
                  style={{ fontWeight: 'var(--font-weight-regular)' }}
                  disabled={isPrinting && pendingPrintAction === 'PRINT_TICKET'}
                >
                  {isPrinting && pendingPrintAction === 'PRINT_TICKET'
                    ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    : <Printer className="w-5 h-5 mr-2" />
                  }
                  {isPrinting && pendingPrintAction === 'PRINT_TICKET' ? 'Reprinting…' : 'Reprint Ticket'}
                </MainBtn>
              );
            })()}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Partial Print Success Dialog (Condition 2: Wine + Mocktail) ── */}
      <Dialog open={showPartialPrintDialog} onOpenChange={setShowPartialPrintDialog}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader className="text-center">
            <div className="flex flex-col items-center gap-3 mb-1">
              <DialogTitle style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-text-title)' }}>
                Printed on Some Printers
              </DialogTitle>
            </div>
            <DialogDescription className="text-center" style={{ fontSize: 'var(--text-h3)', color: 'var(--neutral-text-body)' }}>
              The job was sent but not all printers responded. Review the status below.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-2">
            {/* Success row – only shown when Kitchen KOT Printer actually received items */}
            {partialSuccessItems.length > 0 && (
              <div className="flex items-center gap-3 px-4 py-3"
                style={{
                  borderRadius: 'var(--radius-card)',
                  background: 'var(--status-green-surface, #F0FDF4)',
                  border: '1px solid var(--status-green-line, #BBF7D0)',
                }}>
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--status-green-primary, #16A34A)' }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-title)' }}>
                    Kitchen KOT Printer
                  </p>
                  <p style={{ fontSize: 'var(--text-p)', color: 'var(--status-green-primary, #16A34A)' }}>
                    Printed successfully
                  </p>
                </div>
              </div>
            )}

            {/* Failed row – Bar Printer */}
            <div style={{
              borderRadius: 'var(--radius-card)',
              background: 'var(--status-red-surface, #FEF2F2)',
              border: '1px solid var(--status-red-line, #FECACA)',
              overflow: 'hidden',
            }}>
              {/* Printer header */}
              <div className="flex items-center gap-3 px-4 py-3">
                <XCircle className="w-5 h-5 shrink-0" style={{ color: 'var(--status-red-primary, #DC2626)' }} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-title)' }}>
                    Bar Printer
                  </p>
                  <p style={{ fontSize: 'var(--text-p)', color: 'var(--status-red-primary, #DC2626)' }}>
                    Failed to receive job
                  </p>
                </div>
              </div>
              {/* Items that failed */}
              {partialFailedItems.length > 0 && (
                <div className="px-4 pb-3 space-y-1"
                  style={{ borderTop: '1px solid var(--status-red-line, #FECACA)' }}>
                  <p className="pt-2" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-secondary)' }}>
                    Items not printed:
                  </p>
                  {partialFailedItems.map((fi, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-text-body)' }}>
                        {fi.name}
                      </span>
                      <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-body)' }}>
                        ×{fi.qty}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            
          </div>

          <DialogFooter>
            <MainBtn
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setShowPartialPrintDialog(false)}
              style={{ fontWeight: 'var(--font-weight-semibold)' }}
            >
              Okay
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Print Failed Dialog (Condition 3: Cappuccino + Fresh OJ) ── */}
      <Dialog open={showPrintFailedDialog} onOpenChange={(open) => {
        if (!open && !isReconnecting) {
          setShowPrintFailedDialog(false);
          setFailedPrintAction(null);
          setIsNoPrinterConfigured(false);
        }
      }}>
        <DialogContent className="sm:max-w-[440px]">
          {isNoPrinterConfigured ? (
            // NO PRINTER CONFIGURED STATE (for Mineral Water)
            <>
              <DialogHeader className="text-center">
                <div className="flex flex-col items-center gap-3 mb-1">
                  <div className="flex items-center justify-center w-[140px] h-[140px] rounded-full shrink-0"
                    style={{ background: 'var(--status-red-surface, #FEF2F2)', borderRadius: 'var(--radius-full, 9999px)' }}>
                    <WifiOff className="w-20 h-20" style={{ color: 'var(--status-red-primary, #DC2626)' }} />
                  </div>
                  <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-text-title)' }}>
                    Print Failed
                  </DialogTitle>
                </div>
                <DialogDescription className="text-center" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-text-body)' }}>
                  No printer is added yet.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="flex-row gap-3">
                <MainBtn
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    setShowPrintFailedDialog(false);
                    setIsNoPrinterConfigured(false);
                    navigate('/printer-settings');
                  }}
                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                >
                  Add New Printer
                </MainBtn>
              </DialogFooter>
            </>
          ) : (
            // PRINTER CONNECTION FAILED STATE (original)
            <>
              <DialogHeader className="text-center">
                <div className="flex flex-col items-center gap-3 mb-1">
                  <div className="flex items-center justify-center w-[140px] h-[140px] rounded-full shrink-0"
                    style={{ background: 'var(--status-red-surface, #FEF2F2)', borderRadius: 'var(--radius-full, 9999px)' }}>
                    <WifiOff className="w-20 h-20" style={{ color: 'var(--status-red-primary, #DC2626)' }} />
                  </div>
                  <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-text-title)' }}>
                    Print Failed
                  </DialogTitle>
                </div>
                <DialogDescription className="text-center" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-text-body)' }}>
                  Could not connect to the printer(s). Check cables, power, and network, then try again.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-2">
                {/* Disconnected – Kitchen Printer */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{
                    borderRadius: 'var(--radius-card)',
                    background: 'var(--status-red-surface, #FEF2F2)',
                    border: '1px solid var(--status-red-line, #FECACA)',
                  }}>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-title)' }}>
                      Kitchen KOT Printer
                    </p>
                  </div>
                </div>

                {/* Disconnected – Receipt Printer */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{
                    borderRadius: 'var(--radius-card)',
                    background: 'var(--status-red-surface, #FEF2F2)',
                    border: '1px solid var(--status-red-line, #FECACA)',
                  }}>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-text-title)' }}>
                      Receipt Printer
                    </p>
                  </div>
                </div>

                {isReconnecting && (
                  <div className="flex items-center gap-2 pt-1"
                    style={{ color: 'var(--primary-main, #0052CC)' }}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }}>
                      Attempting to reconnect…
                    </span>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-row gap-3">
                {/* Try Reconnect — always visible */}
                <MainBtn
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  disabled={isReconnecting}
                  onClick={() => {
                    setIsReconnecting(true);
                    setTimeout(() => {
                      setIsReconnecting(false);
                      snackbar.error('Reconnect failed. Please check printer connection and try again.');
                    }, 2000);
                  }}
                  style={{ fontWeight: 'var(--font-weight-semibold)' }}
                >
                  {isReconnecting
                    ? <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    : <WifiOff className="w-5 h-5 mr-2" />
                  }
                  {isReconnecting ? 'Reconnecting…' : 'Try Reconnect'}
                </MainBtn>

                {/* Continue Anyway — only shown for Payment action */}
                {failedPrintAction === 'PAYMENT' && (
                  <MainBtn
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    disabled={isReconnecting}
                    onClick={() => {
                      setShowPrintFailedDialog(false);
                      setFailedPrintAction(null);
                      const cb = pendingPostPrintCallbackRef.current;
                      pendingPostPrintCallbackRef.current = null;
                      if (cb) cb();
                    }}
                    style={{ fontWeight: 'var(--font-weight-semibold)' }}
                  >
                    Continue Anyway
                  </MainBtn>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Course Selection Modal */}
      <Dialog open={showCourseSelectionModal} onOpenChange={setShowCourseSelectionModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Select Active Course
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Choose which course to add menu items to
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-3">
              {courses.map((course) => {
                const itemsInCourse = draftItems.filter(item => item.courseId === course.id);
                const itemCount = itemsInCourse.reduce((sum, item) => sum + item.quantity, 0);
                const isActive = activeCourseId === course.id;
                
                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setActiveCourseId(course.id);
                      setShowCourseSelectionModal(false);
                      snackbar.success(`Course ${course.number} activated`);
                    }}
                    className={`w-full p-4 border-2 cursor-pointer transition-colors ${
                      isActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border bg-background hover:bg-accent hover:border-primary'
                    }`}
                    style={{ 
                      borderRadius: 'var(--radius-card)',
                      height: '80px'
                    }}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                            Course {course.number}
                          </span>
                          {isActive && (
                            <Badge 
                              variant="default"
                              className="bg-primary text-primary-foreground"
                              style={{ fontSize: 'var(--text-label)' }}
                            >
                              Active
                            </Badge>
                          )}
                        </div>
                        {itemCount > 0 && (
                          <span className="text-muted-foreground mt-1" style={{ fontSize: 'var(--text-label)' }}>
                            {itemCount} {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        )}
                      </div>
                      {isActive && <Check className="w-5 h-5 text-primary" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modify Draft Item Modal */}
      <Dialog open={showModifyDraftItemModal} onOpenChange={(open) => {
        setShowModifyDraftItemModal(open);
        if (!open) {
          setIsInCompMode(false);
          setModifyItemDiscountType('PERCENTAGE');
          setModifyItemDiscountValue('');
        }
      }}>
        <DialogContent className="sm:max-w-[600px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              {selectedDraftItemForModify?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[500px] pr-4">
            <div className="space-y-4 px-[0px] pt-[0px] pb-[16px]">
              {/* Current Discount - Show if item has discount applied */}
              {selectedDraftItemForModify?.discountType && selectedDraftItemForModify?.discountValue && (
                null
              )}

              {/* Price */}
              {selectedDraftItemForModify && (
                <div className="flex items-center gap-3">
                  {modifyItemDiscountValue && parseFloat(modifyItemDiscountValue) > 0 ? (
                    <>
                      <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }} className="line-through">
                        {formatCurrency(selectedDraftItemForModify.price)}
                      </p>
                      <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }}>
                        {formatCurrency(
                          modifyItemDiscountType === 'PERCENTAGE'
                            ? selectedDraftItemForModify.price * (1 - parseFloat(modifyItemDiscountValue) / 100)
                            : Math.max(0, selectedDraftItemForModify.price - parseFloat(modifyItemDiscountValue))
                        )}
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: '16px', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-secondary)' }}>
                      {formatCurrency(selectedDraftItemForModify.price)}
                    </p>
                  )}
                </div>
              )}

              {/* Modifiers Grid */}
              {(() => {
                // Get the first draft item to find the menu item
                if (!selectedDraftItemForModify || selectedDraftItemForModify.draftItemIds.length === 0) return null;
                
                const firstItemId = selectedDraftItemForModify.draftItemIds[0];
                const firstItem = draftItems.find(i => i.id === firstItemId);
                const menuItem = firstItem?.menuItemId ? MENU_ITEMS.find(m => m.id === firstItem.menuItemId) : null;
                
                if (!menuItem || !menuItem.availableModifiers || menuItem.availableModifiers.length === 0) return null;
                
                return (
                  <div className="space-y-3">
                    <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                      Select Modifiers
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {menuItem.availableModifiers.map(modifier => {
                        const modifierName = typeof modifier === 'string' ? modifier : modifier.name;
                        const modifierPrice = typeof modifier === 'string' ? null : modifier.price;
                        const isChecked = modifyItemSelectedModifiers.includes(modifierName);
                        
                        return (
                          <label
                            key={modifierName}
                            className={`relative flex flex-col p-5 bg-card cursor-pointer transition-all overflow-hidden ${
                              isChecked ? 'border-primary bg-primary/5' : 'hover:border-primary/50 hover:bg-[var(--neutral-surface-greylighter)]'
                            }`}
                            style={{ 
                              borderRadius: 'var(--radius-card)',
                              border: isChecked ? '1px solid var(--primary)' : '1px solid var(--neutral-10)',
                              height: '68px'
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
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setModifyItemSelectedModifiers(prev => [...prev, modifierName]);
                                  } else {
                                    setModifyItemSelectedModifiers(prev => prev.filter(m => m !== modifierName));
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
                );
              })()}

              {/* Notes */}
              <div className="space-y-2">
                <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                  Item Notes (Optional)
                </Label>
                <Textarea
                  placeholder="e.g., No onions, extra spicy..."
                  value={modifyItemNotes}
                  onChange={(e) => setModifyItemNotes(e.target.value)}
                  className="min-h-[100px]"
                  style={{ 
                    borderRadius: 'var(--radius-input)', 
                    fontSize: 'var(--text-p)',
                    border: '1px solid var(--neutral-10)'
                  }}
                />
              </div>

              {/* Discount Section */}
              {check?.status === 'OPEN' && (
                <div className="space-y-3 pt-2">
                  <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
                    Discount
                  </Label>
                  
                  <div>
                    {/* Discount Field Container */}
                    <div className="flex gap-[10px] items-center">
                      {/* Toggle Container */}
                      <div className="flex items-center p-[4px] relative rounded-[10px] shrink-0 border border-primary">
                        <button
                          type="button"
                          onClick={() => setModifyItemDiscountType('FIXED')}
                          className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                            modifyItemDiscountType === 'FIXED' 
                              ? 'bg-primary text-white' 
                              : 'bg-transparent text-primary'
                          }`}
                        >
                          <span style={{ fontSize: 'var(--text-label)' }}>IDR</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setModifyItemDiscountType('PERCENTAGE')}
                          className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                            modifyItemDiscountType === 'PERCENTAGE' 
                              ? 'bg-primary text-white' 
                              : 'bg-transparent text-primary'
                          }`}
                        >
                          <span style={{ fontSize: 'var(--text-label)' }}>%</span>
                        </button>
                      </div>

                      {/* Input Field */}
                      <div className="flex-1 relative bg-white rounded-[10px] border border-[#e9e9e9]">
                        <input
                          type="text"
                          readOnly
                          placeholder="0"
                          value={modifyItemDiscountValue}
                          onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', modifyItemDiscountValue, (val) => {
                            if (val === '' || val === '0') { setModifyItemDiscountValue(val); return; }
                            const numValue = parseFloat(val);
                            if (isNaN(numValue) || numValue < 0) { setModifyItemDiscountValue('0'); return; }
                            if (modifyItemDiscountType === 'PERCENTAGE') {
                              setModifyItemDiscountValue(numValue > 100 ? '100' : val);
                            } else {
                              const itemPrice = selectedDraftItemForModify?.price || 0;
                              setModifyItemDiscountValue(numValue > itemPrice ? itemPrice.toString() : val);
                            }
                          }, e.currentTarget); }}
                          className={`w-full py-[12px] rounded-[10px] bg-transparent outline-none text-left ${
                            modifyItemDiscountType === 'FIXED' 
                              ? 'pl-[60px] pr-[16px]' 
                              : 'pl-[16px] pr-[60px]'
                          }`}
                          style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                        />
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                            modifyItemDiscountType === 'FIXED' ? 'left-[16px]' : 'right-[16px]'
                          }`} 
                          style={{ fontSize: 'var(--text-p)' }}
                        >
                          {modifyItemDiscountType === 'PERCENTAGE' ? '%' : 'IDR'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            {/* Left: Delete as text button */}
            <MainBtn
              variant="destructive"
              size="md"
              onClick={handleDeleteDraftItem}
              className="whitespace-nowrap"
            >
              <Trash2 className="w-4 h-4" />
            </MainBtn>

            {/* Right: Action buttons */}
            <div className="flex gap-2">
              <MainBtn
                variant="secondary"
                size="md"
                onClick={() => {
                  if (selectedDraftItemForModify?.isComplimentary) {
                    // Remove comp status and revert to original price
                    if (!selectedDraftItemForModify) return;
                    
                    // Update each draft item to remove comp-related fields
                    selectedDraftItemForModify.draftItemIds.forEach(itemId => {
                      const item = draftItems.find(i => i.id === itemId);
                      if (item) {
                        updateItem(itemId, {
                          isComplimentary: undefined,
                          compReason: undefined,
                          complimentaryReason: undefined
                        });
                      }
                    });
                    
                    setShowModifyDraftItemModal(false);
                    setSelectedDraftItemForModify(null);
                    snackbar.success('Complimentary mark removed');
                  } else {
                    // Open unified CompModal
                    setCompModalItem(selectedDraftItemForModify);
                    setShowCompModal(true);
                    setShowModifyDraftItemModal(false);
                  }
                }}
                className="whitespace-nowrap"
              >
                <Gift className="w-4 h-4" style={{ marginRight: '4px' }} />
                {selectedDraftItemForModify?.isComplimentary ? 'Remove Comp Mark' : 'Mark as Comp'}
              </MainBtn>
              <MainBtn
                onClick={handleSendDraftItem}
                variant="secondary"
                size="md"
                className="whitespace-nowrap"
              >
                <Flame className="w-4 h-4" style={{ marginRight: '4px' }} />
                Send Item
              </MainBtn>
              <MainBtn
                variant="primary"
                size="md"
                onClick={handleSaveItemNotes}
                className="whitespace-nowrap"
              >
                Save
              </MainBtn>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Customer Note Modal */}
      <Dialog open={showCustomerNoteModal} onOpenChange={setShowCustomerNoteModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Customer Note
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Add a note for this check
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <TextAreaField
              value={customerNote}
              onChange={(e) => setCustomerNote(e.target.value)}
              placeholder="Enter customer note..."
            />
          </div>
          <DialogFooter className="flex-row gap-[8px] sm:flex-row">
            <MainBtn
              variant="secondary"
              onClick={() => setShowCustomerNoteModal(false)}
              size="md"
              className="w-full"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={() => {
                updateCheck(checkId, { checkNote: customerNote });
                setShowCustomerNoteModal(false);
                snackbar.success('Customer note saved');
              }}
              size="md"
              className="w-full"
            >
              Save Note
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bill Discount Modal */}
      <Dialog open={showBillDiscountModal} onOpenChange={setShowBillDiscountModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Bill Discount
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Configure discount for the entire bill
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 pt-2">
            <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
              Discount
            </Label>
            
            <div>
              {/* Discount Field Container */}
              <div className="flex gap-[10px] items-center">
                {/* Toggle Container */}
                <div className="flex items-center p-[4px] relative rounded-[10px] shrink-0 border border-primary">
                  <button
                    type="button"
                    onClick={() => setBillDiscountType('FIXED')}
                    className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                      billDiscountType === 'FIXED' 
                        ? 'bg-primary text-white' 
                        : 'bg-transparent text-primary'
                    }`}
                  >
                    <span style={{ fontSize: 'var(--text-label)' }}>IDR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillDiscountType('PERCENTAGE')}
                    className={`flex items-center justify-center px-[10px] py-[9px] rounded-[8px] w-[56px] h-[40px] transition-colors ${
                      billDiscountType === 'PERCENTAGE' 
                        ? 'bg-primary text-white' 
                        : 'bg-transparent text-primary'
                    }`}
                  >
                    <span style={{ fontSize: 'var(--text-label)' }}>%</span>
                  </button>
                </div>

                {/* Input Field */}
                <div className="flex-1 relative bg-white rounded-[10px] border border-[#e9e9e9]">
                  <input
                    type="text"
                    readOnly
                    placeholder="0"
                    value={billDiscountValue}
                    onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', billDiscountValue, (val) => {
                      if (val === '' || val === '0') { setBillDiscountValue(val); return; }
                      const numValue = parseFloat(val);
                      if (isNaN(numValue) || numValue < 0) { setBillDiscountValue('0'); return; }
                      if (billDiscountType === 'PERCENTAGE') {
                        setBillDiscountValue(numValue > 100 ? '100' : val);
                      } else {
                        setBillDiscountValue(numValue > subtotal ? subtotal.toString() : val);
                      }
                    }, e.currentTarget); }}
                    className={`w-full py-[12px] rounded-[10px] bg-transparent outline-none text-left ${
                      billDiscountType === 'FIXED' 
                        ? 'pl-[60px] pr-[16px]' 
                        : 'pl-[16px] pr-[60px]'
                    }`}
                    style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                  />
                  <div 
                    className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${
                      billDiscountType === 'FIXED' ? 'left-[16px]' : 'right-[16px]'
                    }`} 
                    style={{ fontSize: 'var(--text-p)' }}
                  >
                    {billDiscountType === 'PERCENTAGE' ? '%' : 'IDR'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            {/* Remove Discount button - only show if discount exists */}
            {check?.billDiscountValue && (
              <MainBtn
                variant="destructive"
                onClick={() => {
                  updateCheck(checkId, {
                    billDiscountType: undefined,
                    billDiscountValue: undefined,
                  });
                  setShowBillDiscountModal(false);
                  setIsMoreOptionsModalOpen(true);
                  snackbar.success('Bill discount removed');
                }}
                size="md"
                className="w-full"
              >
                Remove Discount
              </MainBtn>
            )}
            <div className="flex gap-3 w-full">
              <MainBtn
                variant="secondary"
                onClick={() => {
                  setShowBillDiscountModal(false);
                  setIsMoreOptionsModalOpen(true);
                }}
                size="md"
                className="flex-1"
              >
                Back
              </MainBtn>
              <MainBtn
                onClick={() => {
                  if (!billDiscountValue || parseFloat(billDiscountValue) <= 0) {
                    snackbar.error('Please enter a valid discount amount');
                    return;
                  }

                  updateCheck(checkId, {
                    billDiscountType,
                    billDiscountValue: parseFloat(billDiscountValue),
                  });
                  
                  setShowBillDiscountModal(false);
                  snackbar.success(`Bill discount of ${billDiscountType === 'PERCENTAGE' ? `${billDiscountValue}%` : formatCurrency(parseFloat(billDiscountValue))} applied`);
                }}
                size="md"
                className="flex-1"
              >
                Apply Discount
              </MainBtn>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tip Modal */}
      <Dialog open={showTipModal} onOpenChange={setShowTipModal}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Tip
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Add a tip for your server
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Tip input field */}
            <div>
              <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }} className="mb-2 block">
                Tip Amount
              </Label>
              <div className="flex-1 relative bg-white rounded-[10px] border border-[#e9e9e9]">
                <div
                  className="absolute top-1/2 -translate-y-1/2 left-[16px] pointer-events-none"
                  style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)' }}
                >
                  IDR
                </div>
                <input
                  type="text"
                  readOnly
                  placeholder="0"
                  value={tipInput}
                  onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', tipInput, (val) => {
                    if (val === '' || val === '0') { setTipInput(val); return; }
                    const num = parseFloat(val);
                    if (isNaN(num) || num < 0) { setTipInput('0'); return; }
                    setTipInput(val);
                  }, e.currentTarget); }}
                  className="w-full py-[12px] pl-[60px] pr-[16px] rounded-[10px] bg-transparent outline-none"
                  style={{ fontSize: 'var(--text-p)', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Quick-select tip cards */}
            <div className="grid grid-cols-3 gap-2">
              {[10000, 20000, 50000].map((amount) => {
                const isSelected = tipInput === amount.toString();
                return (
                  <SelectableCard
                    key={amount}
                    selected={isSelected}
                    onClick={() => setTipInput(isSelected ? '' : amount.toString())}
                    className="h-12 border"
                    style={{ fontSize: 'var(--text-p)', fontWeight: isSelected ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', borderRadius: '12px' }}
                  >
                    Rp {amount.toLocaleString('id-ID')}
                  </SelectableCard>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-3 w-full">
                <MainBtn
                  variant="secondary"
                  onClick={() => {
                    setShowTipModal(false);
                    setIsMoreOptionsModalOpen(true);
                  }}
                  size="md"
                  className="flex-1"
                >
                  Back
                </MainBtn>
                <MainBtn
                  onClick={() => {
                    const num = parseFloat(tipInput);
                    if (!tipInput || isNaN(num) || num <= 0) {
                      snackbar.error('Please enter a valid tip amount');
                      return;
                    }
                    updateCheck(checkId, { tipAmount: num });
                    setShowTipModal(false);
                    snackbar.success(`Tip of ${formatCurrency(num)} applied`);
                  }}
                  size="md"
                  className="flex-1"
                >
                  Apply Tip
                </MainBtn>
              </div>
              {/* Remove Tip - Text CTA, only shown if tip already applied */}
              {(check?.tipAmount ?? 0) > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    updateCheck(checkId, { tipAmount: undefined });
                    setShowTipModal(false);
                    snackbar.success('Tip removed');
                  }}
                  className="w-full py-2 text-center"
                  style={{
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--status-red-primary)',
                    background: 'transparent',
                    border: 'none',
                  }}
                >
                  Remove Tip
                </button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guest/Pax Modal */}
      <Dialog open={showGuestPaxModal} onOpenChange={setShowGuestPaxModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>
              {table ? `Table ${table.name}` : 'Guest Information'}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }} className="text-muted-foreground">
              Select guest count and enter details to update check information.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Guest Count */}
            <div className="space-y-3">
              <Label style={{ fontSize: '14px', fontWeight: 'var(--font-weight-normal)' }}>
                <span style={{ color: 'var(--status-red-primary)' }}>* </span>Guest Count
              </Label>
              
              {!manualInputMode ? (
                <>
                  {/* Number Cards Grid (5 columns x 2 rows) */}
                  <div className="grid grid-cols-5 gap-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectableCard
                        key={num}
                        onClick={() => setGuestCount(num.toString())}
                        selected={guestCount === num.toString()}
                        className="h-[56px] border"
                        style={{ 
                          borderRadius: 'var(--radius-button)',
                          fontSize: 'var(--text-h3)',
                          fontWeight: 'var(--font-weight-bold)'
                        }}
                      >
                        {num}
                      </SelectableCard>
                    ))}
                  </div>
                  
                  {/* Input Manually Button */}
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setManualInputMode(true)}
                    className="w-full h-[48px]"
                    style={{ borderRadius: 'var(--radius-button)' }}
                  >
                    Input Manually
                  </Button>
                </>
              ) : (
                <>
                  {/* Manual Input Field */}
                  <TextField
                    type="number"
                    placeholder="Enter number of guests"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="h-[56px]"
                    autoFocus
                  />
                  
                  {/* Cancel Manual Input Button */}
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => {
                      setManualInputMode(false);
                      setGuestCount(check?.guestCount?.toString() || '');
                    }}
                    className="w-full h-[48px]"
                    style={{ borderRadius: 'var(--radius-button)' }}
                  >
                    Cancel Manual Input
                  </Button>
                </>
              )}
            </div>

            {/* Guest Name */}
            <div className="space-y-2">
              <Label htmlFor="guestName" style={{ fontSize: '14px', fontWeight: 'var(--font-weight-normal)' }}>
                Guest Name (Optional)
              </Label>
              <TextField
                id="guestName"
                placeholder="Enter guest name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="h-[56px]"
              />
            </div>

            {/* Guest Phone */}
            <div className="space-y-2">
              <Label htmlFor="guestPhone" style={{ fontSize: '14px', fontWeight: 'var(--font-weight-normal)' }}>
                Phone Number (Optional)
              </Label>
              <TextField
                id="guestPhone"
                placeholder="Enter phone number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="h-[56px]"
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <MainBtn 
                variant="secondary"
                size="lg" 
                onClick={() => {
                  setShowGuestPaxModal(false);
                  setIsMoreOptionsModalOpen(true);
                }}
                className="flex-1"
                style={{ fontWeight: 'var(--font-weight-normal)' }}
              >
                Back
              </MainBtn>
              <MainBtn 
                variant={!guestCount ? 'disabled' : 'primary'}
                size="lg" 
                onClick={() => {
                  if (!guestCount) {
                    snackbar.error('Please enter guest count');
                    return;
                  }
                  updateCheck(checkId, {
                    guestCount: parseInt(guestCount),
                    guestName: guestName || undefined,
                    guestPhone: guestPhone || undefined
                  });
                  setShowGuestPaxModal(false);
                  setManualInputMode(false);
                  snackbar.success('Guest information updated');
                }}
                disabled={!guestCount}
                className="flex-1"
                style={{ fontWeight: 'var(--font-weight-normal)' }}
              >
                Confirm
              </MainBtn>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Table Modal */}
      <Dialog open={showTransferTableModal} onOpenChange={setShowTransferTableModal}>
        <DialogContent className="sm:max-w-[800px] flex flex-col" style={{ maxHeight: '700px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Transfer to Table
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Select a table to transfer this check to
            </DialogDescription>
          </DialogHeader>
          
          {/* Fixed height scrollable area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="grid grid-cols-4 gap-3 pt-4 pr-4 pb-24">
                {TABLES.filter(t => t.id !== check?.tableId).map((table) => {
                  const tableState = getTableState(table.id);
                  const tableCheck = getCheckByTable(table.id);
                  const isAvailable = tableState === 'AVAILABLE';
                  
                  return (
                    <SelectableCard
                      key={table.id}
                      onClick={() => {
                        // Check if current table has bill discount applied
                        if (check?.billDiscountType && check?.billDiscountValue) {
                          // Show discount warning modal first
                          setPendingTransferTable(table.id);
                          setShowTransferTableModal(false);
                          setShowDiscountWarningModal(true);
                        } else {
                          // No discount, proceed normally
                          setSelectedTransferTable(table.id);
                          setShowTransferTableModal(false);
                          setShowTransferConfirmModal(true);
                        }
                      }}
                      selected={false}
                      className="h-[100px] border flex-col justify-center"
                      style={{ 
                        borderRadius: 'var(--radius-card)', 
                        gap: '8px',
                        opacity: isAvailable ? 1 : 0.7
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)' }}>
                        {table.name}
                      </span>
                      <Badge 
                        variant={isAvailable ? 'default' : 'secondary'}
                        style={{ fontSize: 'var(--text-label)' }}
                      >
                        {isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </SelectableCard>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          
          {/* Sticky footer with back button */}
          <div className="border-t border-border pt-6 pb-2 bg-background flex-shrink-0">
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => {
                setShowTransferTableModal(false);
                setIsMoreOptionsModalOpen(true);
              }}
              className="w-full"
            >
              Back
            </MainBtn>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Table Confirmation Modal */}
      <Dialog open={showTransferConfirmModal} onOpenChange={setShowTransferConfirmModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Confirm Transfer
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Transfer all items and information to {TABLES.find(t => t.id === selectedTransferTable)?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4" style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
            <p>This will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Transfer all courses and items</li>
              <li>Transfer guest information</li>
              <li>Make the current table available</li>
            </ul>
          </div>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowTransferConfirmModal(false);
                setSelectedTransferTable(null);
              }}
              size="lg"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={() => {
                if (check && selectedTransferTable) {
                  updateCheck(checkId, { tableId: selectedTransferTable });
                  setShowTransferConfirmModal(false);
                  setSelectedTransferTable(null);
                  snackbar.success('Table transferred successfully');
                  onClose();
                }
              }}
              size="lg"
            >
              Confirm Transfer
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Table - Discount Warning Modal */}
      <Dialog open={showDiscountWarningModal} onOpenChange={setShowDiscountWarningModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Discount Will Be Discarded
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-normal)' }}>
              The discount that has been set for this table will be discarded. Please adjust them later accordingly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowDiscountWarningModal(false);
                setPendingTransferTable(null);
              }}
              size="lg"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={() => {
                // Clear the bill discount and proceed with transfer
                if (check && pendingTransferTable) {
                  // Clear bill discount from check
                  updateCheck(checkId, { 
                    billDiscountType: undefined, 
                    billDiscountValue: undefined 
                  });
                  
                  // Now proceed to show transfer confirmation
                  setSelectedTransferTable(pendingTransferTable);
                  setShowDiscountWarningModal(false);
                  setPendingTransferTable(null);
                  setShowTransferConfirmModal(true);
                }
              }}
              size="lg"
            >
              Yes, Proceed
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Tables Modal */}
      {check?.tableId && (
        <MergeTablesModal
          open={showMergeTableModal}
          onClose={() => setShowMergeTableModal(false)}
          currentTableId={check.tableId}
          hasBillDiscount={!!(check?.billDiscountType && check?.billDiscountValue)}
          onDiscountWarningConfirm={() => {
            // Clear bill discount when user confirms
            updateCheck(checkId, { 
              billDiscountType: undefined, 
              billDiscountValue: undefined 
            });
          }}
          onMergeComplete={() => {
            snackbar.success('Tables merged successfully');
            // Refresh or navigate as needed
          }}
          onBackToMoreOptions={() => {
            setShowMergeTableModal(false);
            setIsMoreOptionsModalOpen(true);
          }}
        />
      )}

      {/* Transfer Course - Select Courses Modal */}
      <Dialog open={showTransferCourseSelectModal} onOpenChange={setShowTransferCourseSelectModal}>
        <DialogContent className="sm:max-w-[800px] flex flex-col" style={{ maxHeight: '700px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Select Items/Courses to Transfer
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Choose which items or courses to transfer to another table
            </DialogDescription>
          </DialogHeader>
          
          {/* Fixed height scrollable area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="flex flex-col gap-3 pt-4 pr-4 pb-24">
            {/* Uncoursed Items Section */}
            {(() => {
              const uncoursedItems = getItemsByCheck(checkId).filter(item => 
                !item.courseId && 
                (item.status === 'DRAFT' || item.status === 'SENT' || item.status === 'IN_PREP')
              );
              if (uncoursedItems.length === 0) return null;
              
              const allUncoursedSelected = uncoursedItems.every(item => selectedItemsForTransfer.includes(item.id));
              const someUncoursedSelected = uncoursedItems.some(item => selectedItemsForTransfer.includes(item.id));
              
              return (
                <div key="uncoursed-section" className="border" style={{ borderRadius: 'var(--radius-card)' }}>
                  {/* Uncoursed Header - Quick Select All */}
                  <div
                    onClick={() => {
                      const uncoursedIds = uncoursedItems.map(item => item.id);
                      if (allUncoursedSelected) {
                        // Deselect all uncoursed items
                        setSelectedItemsForTransfer(prev => prev.filter(id => !uncoursedIds.includes(id)));
                      } else {
                        // Select all uncoursed items
                        setSelectedItemsForTransfer(prev => {
                          const newIds = uncoursedIds.filter(id => !prev.includes(id));
                          return [...prev, ...newIds];
                        });
                      }
                    }}
                    className="w-full p-4 flex items-center gap-3 bg-[var(--neutral-surface-greylighter)] hover:bg-[var(--neutral-surface-greylight)] transition-colors cursor-pointer"
                    style={{ borderRadius: 'var(--radius-card) var(--radius-card) 0 0' }}
                  >
                    <Checkbox checked={allUncoursedSelected} className={someUncoursedSelected && !allUncoursedSelected ? 'opacity-50' : ''} />
                    <div className="flex-1 text-left">
                      <div style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                        Uncoursed Items
                      </div>
                      <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                        {uncoursedItems.length} {uncoursedItems.length === 1 ? 'item' : 'items'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Individual Uncoursed Items */}
                  <div className="flex flex-col">
                    {uncoursedItems.map((item, index) => {
                      const isSelected = selectedItemsForTransfer.includes(item.id);
                      const isLast = index === uncoursedItems.length - 1;
                      
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedItemsForTransfer(prev => prev.filter(id => id !== item.id));
                            } else {
                              setSelectedItemsForTransfer(prev => [...prev, item.id]);
                            }
                          }}
                          className={`w-full p-3 pl-12 flex items-center gap-3 hover:bg-[var(--neutral-surface-greylighter)] transition-colors cursor-pointer ${!isLast ? 'border-b border-[var(--neutral-line-outline)]' : ''}`}
                          style={isLast ? { borderRadius: '0 0 var(--radius-card) var(--radius-card)' } : {}}
                        >
                          <Checkbox checked={isSelected} />
                          <div className="flex-1 text-left">
                            <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-medium)' }}>
                              {item.quantity}x {item.name}
                            </div>
                            {item.modifiers && item.modifiers.length > 0 && (
                              <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                {item.modifiers.join(', ')}
                              </div>
                            )}
                          </div>
                          <Badge variant={item.status === 'DRAFT' ? 'secondary' : 'default'} style={{ fontSize: 'var(--text-label)' }}>
                            {item.status === 'DRAFT' ? 'Draft' : item.status === 'SENT' ? 'In Kitchen' : 'In Prep'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            
            {/* Courses Sections */}
            {courses
              .filter(course => {
                // Show course if it's DRAFT or if it has transferable items
                if (course.state === 'DRAFT') return true;
                const courseItems = getItemsByCheck(checkId).filter(item => item.courseId === course.id);
                return courseItems.some(item => 
                  item.status === 'DRAFT' || item.status === 'SENT' || item.status === 'IN_PREP'
                );
              })
              .map((course) => {
                const courseItems = getItemsByCheck(checkId).filter(item => 
                  item.courseId === course.id &&
                  (item.status === 'DRAFT' || item.status === 'SENT' || item.status === 'IN_PREP')
                );
                
                const allCourseItemsSelected = courseItems.every(item => selectedItemsForTransfer.includes(item.id));
                const someCourseItemsSelected = courseItems.some(item => selectedItemsForTransfer.includes(item.id));
                
                return (
                  <div key={course.id} className="border" style={{ borderRadius: 'var(--radius-card)' }}>
                    {/* Course Header - Quick Select All */}
                    <div
                      onClick={() => {
                        const courseItemIds = courseItems.map(item => item.id);
                        if (allCourseItemsSelected) {
                          // Deselect all items in this course
                          setSelectedItemsForTransfer(prev => prev.filter(id => !courseItemIds.includes(id)));
                        } else {
                          // Select all items in this course
                          setSelectedItemsForTransfer(prev => {
                            const newIds = courseItemIds.filter(id => !prev.includes(id));
                            return [...prev, ...newIds];
                          });
                        }
                      }}
                      className="w-full p-4 flex items-center gap-3 transition-colors cursor-pointer"
                      style={{ 
                        borderRadius: 'var(--radius-card) var(--radius-card) 0 0',
                        backgroundColor: '#E3F2FD'
                      }}
                    >
                      <Checkbox checked={allCourseItemsSelected} className={someCourseItemsSelected && !allCourseItemsSelected ? 'opacity-50' : ''} />
                      <div className="flex-1 text-left">
                        <div style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                          Course {course.number}
                        </div>
                        <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                          {courseItems.length} {courseItems.length === 1 ? 'item' : 'items'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Individual Course Items */}
                    <div className="flex flex-col">
                      {courseItems.map((item, index) => {
                        const isSelected = selectedItemsForTransfer.includes(item.id);
                        const isLast = index === courseItems.length - 1;
                        
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedItemsForTransfer(prev => prev.filter(id => id !== item.id));
                              } else {
                                setSelectedItemsForTransfer(prev => [...prev, item.id]);
                              }
                            }}
                            className={`w-full p-3 pl-12 flex items-center gap-3 hover:bg-[var(--neutral-surface-greylighter)] transition-colors cursor-pointer ${!isLast ? 'border-b border-[var(--neutral-line-outline)]' : ''}`}
                            style={isLast ? { borderRadius: '0 0 var(--radius-card) var(--radius-card)' } : {}}
                          >
                            <Checkbox checked={isSelected} />
                            <div className="flex-1 text-left">
                              <div style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-medium)' }}>
                                {item.quantity}x {item.name}
                              </div>
                              {item.modifiers && item.modifiers.length > 0 && (
                                <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                  {item.modifiers.join(', ')}
                                </div>
                              )}
                            </div>
                            <Badge variant={item.status === 'DRAFT' ? 'secondary' : 'default'} style={{ fontSize: 'var(--text-label)' }}>
                              {item.status === 'DRAFT' ? 'Draft' : item.status === 'SENT' ? 'In Kitchen' : 'In Prep'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              </div>
            </ScrollArea>
          </div>
          
          {/* Sticky footer with buttons */}
          <div className="border-t border-border pt-6 pb-2 bg-background flex-shrink-0">
            <div className="flex gap-3">
              <MainBtn
                variant="secondary"
                onClick={() => {
                  setShowTransferCourseSelectModal(false);
                  setSelectedItemsForTransfer([]);
                  setIsMoreOptionsModalOpen(true);
                }}
                size="lg"
                className="flex-1"
              >
                Cancel
              </MainBtn>
              <MainBtn
                onClick={() => {
                  if (selectedItemsForTransfer.length === 0) {
                    snackbar.error('Please select at least one item');
                    return;
                  }
                  setShowTransferCourseSelectModal(false);
                  setShowTransferCourseTableModal(true);
                }}
                size="lg"
                className="flex-1"
                disabled={selectedItemsForTransfer.length === 0}
              >
                Next
              </MainBtn>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Course - Select Table Modal */}
      <Dialog open={showTransferCourseTableModal} onOpenChange={setShowTransferCourseTableModal}>
        <DialogContent className="sm:max-w-[800px] flex flex-col" style={{ maxHeight: '700px' }}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Select Destination Table
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Choose which table to transfer the selected items/courses to
            </DialogDescription>
          </DialogHeader>
          
          {/* Fixed height scrollable area */}
          <div className="flex-1 overflow-hidden min-h-0">
            <ScrollArea className="h-full w-full">
              <div className="grid grid-cols-4 gap-3 pt-4 pr-4 pb-24">
                {TABLES.filter(t => t.id !== check?.tableId).map((table) => {
                  const tableState = getTableState(table.id);
                  const isAvailable = tableState === 'AVAILABLE';
                  
                  return (
                    <SelectableCard
                      key={table.id}
                      onClick={() => {
                        setSelectedCourseTransferTable(table.id);
                        setShowTransferCourseTableModal(false);
                        setShowTransferCourseConfirmModal(true);
                      }}
                      selected={false}
                      className="h-[100px] border flex-col justify-center"
                      style={{ 
                        borderRadius: 'var(--radius-card)', 
                        gap: '8px',
                        opacity: isAvailable ? 1 : 0.7
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)' }}>
                        {table.name}
                      </span>
                      <Badge 
                        variant={isAvailable ? 'default' : 'secondary'}
                        style={{ 
                          fontSize: 'var(--text-label)',
                          backgroundColor: isAvailable ? '#4CAF50' : '#2196F3',
                          color: 'white'
                        }}
                      >
                        {isAvailable ? 'Available' : 'Occupied'}
                      </Badge>
                    </SelectableCard>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
          
          {/* Sticky footer with back button */}
          <div className="border-t border-border pt-6 pb-2 bg-background flex-shrink-0">
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => {
                setShowTransferCourseTableModal(false);
                setShowTransferCourseSelectModal(true);
              }}
              className="w-full"
            >
              Back
            </MainBtn>
          </div>
        </DialogContent>
      </Dialog>

      {/* Transfer Course Confirmation Modal */}
      <Dialog open={showTransferCourseConfirmModal} onOpenChange={setShowTransferCourseConfirmModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Confirm Item/Course Transfer
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Transfer {selectedItemsForTransfer.length} {selectedItemsForTransfer.length === 1 ? 'item' : 'items'} to {TABLES.find(t => t.id === selectedCourseTransferTable)?.name}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4" style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
            <p className="mb-2">Transferring:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              {selectedItemsForTransfer.map(itemId => {
                const item = getItemsByCheck(checkId).find(i => i.id === itemId);
                if (!item) return null;
                return (
                  <li key={itemId}>
                    {item.quantity}x {item.name}
                    {item.modifiers && item.modifiers.length > 0 && ` (${item.modifiers.join(', ')})`}
                  </li>
                );
              })}
            </ul>
          </div>
          <DialogFooter className="flex gap-3">
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowTransferCourseConfirmModal(false);
                setShowTransferCourseTableModal(true);
              }}
              size="lg"
              className="flex-1"
            >
              Back
            </MainBtn>
            <MainBtn
              onClick={() => {
                if (check && selectedCourseTransferTable) {
                  let targetCheck = getCheckByTable(selectedCourseTransferTable);
                  
                  // Create new check if table is available
                  if (!targetCheck) {
                    const table = TABLES.find(t => t.id === selectedCourseTransferTable);
                    const minPurchaseAmount = table?.minimumPurchase || 0;
                    const newCheckId = createCheck({
                      serviceType: 'DINE_IN',
                      tableId: selectedCourseTransferTable,
                      status: 'OPEN',
                      billPrinted: false,
                      seatedAt: new Date(),
                      maxSeatedMinutes: 90,
                      minPurchaseAmount,
                    });
                    targetCheck = getCheckById(newCheckId);
                  }
                  
                  if (targetCheck) {
                    // Transfer selected items to target check
                    selectedItemsForTransfer.forEach(itemId => {
                      updateItem(itemId, { checkId: targetCheck!.id });
                    });
                    
                    // Check if any courses are now empty and need to be transferred/cleaned up
                    const transferredItems = getItemsByCheck(checkId).filter(item => 
                      selectedItemsForTransfer.includes(item.id)
                    );
                    
                    const uniqueCourseIds = new Set(
                      transferredItems
                        .filter(item => item.courseId)
                        .map(item => item.courseId!)
                    );
                    
                    // Transfer courses that have all their items transferred
                    uniqueCourseIds.forEach(courseId => {
                      const courseItems = getItemsByCheck(checkId).filter(item => item.courseId === courseId);
                      const allItemsTransferred = courseItems.every(item => selectedItemsForTransfer.includes(item.id));
                      
                      if (allItemsTransferred) {
                        // Transfer the entire course
                        updateCourse(courseId, { checkId: targetCheck!.id });
                      }
                    });
                    
                    const destinationTableName = TABLES.find(t => t.id === selectedCourseTransferTable)?.name;
                    snackbar.success(`${selectedItemsForTransfer.length} ${selectedItemsForTransfer.length === 1 ? 'item' : 'items'} transferred to ${destinationTableName}`);
                  }
                  
                  setShowTransferCourseConfirmModal(false);
                  setSelectedCourseTransferTable(null);
                  setSelectedItemsForTransfer([]);
                  onClose();
                }
              }}
              size="lg"
              className="flex-1"
            >
              Confirm Transfer
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricelist Selection Modal */}
      <Dialog open={showPricelistModal} onOpenChange={setShowPricelistModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Select Pricelist
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Choose a pricelist for this check
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {[
              { id: 'default', name: 'Default Pricelist', priceAdjustment: 0 },
              { id: 'valentine', name: 'Valentine Special', priceAdjustment: 10000 },
              { id: 'cny', name: 'Chinese New Year', priceAdjustment: 20000 }
            ].map((pricelist) => {
              const isActive = (check?.pricelistId || 'default') === pricelist.id;
              
              return (
                <SelectableCard
                  key={pricelist.id}
                  onClick={() => {
                    setSelectedPricelist(pricelist.id);
                    setShowPricelistModal(false);
                    setShowPricelistConfirmModal(true);
                  }}
                  selected={isActive}
                  className="p-6 border text-left"
                  style={{ borderRadius: 'var(--radius-card)' }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 text-left" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)' }}>
                      {pricelist.name}
                    </div>
                    {isActive && (
                      <Badge variant="default" style={{ fontSize: 'var(--text-label)' }}>
                        Active
                      </Badge>
                    )}
                  </div>
                </SelectableCard>
              );
            })}
          </div>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => {
                setShowPricelistModal(false);
                setIsMoreOptionsModalOpen(true);
              }}
              className="w-full"
              style={{ fontWeight: 'var(--font-weight-normal)' }}
            >
              Back
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricelist Confirmation Modal */}
      <Dialog open={showPricelistConfirmModal} onOpenChange={setShowPricelistConfirmModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Confirm Pricelist Change
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              This will recalculate all item prices in this check
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowPricelistConfirmModal(false);
                setShowPricelistModal(true);
                setSelectedPricelist(check?.pricelistId || 'default');
              }}
              size="lg"
              className="w-full"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={() => {
                if (check) {
                  const priceAdjustments: { [key: string]: number } = {
                    default: 0,
                    valentine: 10000,
                    cny: 20000
                  };
                  
                  const adjustment = priceAdjustments[selectedPricelist] || 0;
                  
                  // Update all item prices
                  const allItems = getItemsByCheck(checkId);
                  allItems.forEach(item => {
                    if (item.menuItemId) {
                      const menuItem = MENU_ITEMS.find(m => m.id === item.menuItemId);
                      if (menuItem) {
                        const newPrice = menuItem.price + adjustment;
                        updateItem(item.id, { price: newPrice });
                      }
                    }
                  });
                  
                  // Update check pricelist
                  updateCheck(checkId, { pricelistId: selectedPricelist });
                  
                  setShowPricelistConfirmModal(false);
                  snackbar.success('Pricelist updated successfully');
                }
              }}
              size="lg"
              className="w-full"
            >
              Confirm Change
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Table Confirmation Modal */}
      <Dialog open={showReleaseTableModal} onOpenChange={setShowReleaseTableModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Minimum purchase is not fulfilled yet
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Want to proceed release table?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowReleaseTableModal(false);
              }}
              size="lg"
              style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={() => {
                const allItems = getItemsByCheck(checkId);
                const hasNoItems = allItems.length === 0;
                
                if (hasNoItems) {
                  deleteCheck(checkId);
                  snackbar.success('Empty bill deleted and table released');
                } else {
                  closeCheck(checkId);
                  snackbar.success('Table released successfully');
                }
                setShowReleaseTableModal(false);
                onClose();
              }}
              size="lg"
              style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}
            >
              Proceed
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Item Comp/UnComp/UnVoid Modal */}
      <Dialog open={showItemCompModal} onOpenChange={setShowItemCompModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              {selectedItemForComp?.name}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              {selectedItemForComp && (() => {
                // Calculate comped vs non-comped items
                const allItems = getItemsByCheck(checkId);
                const thisItemInstances = allItems.filter(item => 
                  item.name === selectedItemForComp.name && 
                  item.modifiers?.sort().join(',') === selectedItemForComp.modifiers.sort().join(',') &&
                  !item.isVoided
                );
                const compedCount = thisItemInstances.filter(item => item.isComplimentary).length;
                const nonCompedCount = thisItemInstances.length - compedCount;
                
                const parts = [];
                if (nonCompedCount > 0) {
                  parts.push(`${nonCompedCount}x ${formatCurrency(selectedItemForComp.price)}`);
                }
                if (compedCount > 0) {
                  parts.push(`${compedCount}x Rp 0 [Comped]`);
                }
                return parts.join(' | ');
              })()}
            </DialogDescription>
          </DialogHeader>

          {/* Status Container */}
          {selectedItemForComp && (
            <div className="bg-muted px-4 py-3 -mx-6 -mt-2" style={{ fontSize: 'var(--text-label)' }}>
              <p className="text-muted-foreground">
                {[
                  selectedItemForComp.sentQty > 0 && `${selectedItemForComp.sentQty}x Sent to Kitchen`,
                  selectedItemForComp.inPrepQty > 0 && `${selectedItemForComp.inPrepQty}x In Prep`,
                  selectedItemForComp.readyQty > 0 && `${selectedItemForComp.readyQty}x Ready to Serve`,
                  selectedItemForComp.servedQty > 0 && `${selectedItemForComp.servedQty}x Served`
                ].filter(Boolean).join(' | ')}
              </p>
            </div>
          )}

          <div className="space-y-4 py-4">

            {/* Notes - Only show when item is draft */}
            {selectedItemForComp?.isDraft && (
              <div className="space-y-2">
                <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Notes
                </Label>
                <Textarea
                  placeholder="Add notes for this item..."
                  value={compNote}
                  onChange={(e) => setCompNote(e.target.value)}
                  className="min-h-[80px]"
                  style={{ fontSize: 'var(--text-p)' }}
                />
              </div>
            )}

            {/* Comp Fields - Show when Mark as Comp is clicked */}
            {compModalAction === 'COMP' && isCompCardExpanded && selectedItemForComp && (
              <div className="space-y-4">
                {/* Quantity Selector - Only show if multiple items */}
                {(() => {
                  const totalFiredQty = selectedItemForComp.sentQty + selectedItemForComp.inPrepQty + 
                                       selectedItemForComp.readyQty + selectedItemForComp.servedQty;
                  if (totalFiredQty > 1) {
                    return (
                      <div className="space-y-2">
                        <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                          Quantity to Comp
                        </Label>
                        <div className="flex items-center gap-3">
                          <MainBtn
                            variant="secondary"
                            size="md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompQty(Math.max(1, compQty - 1));
                            }}
                            disabled={compQty <= 1}
                            className="w-[48px]"
                          >
                            <Minus className="w-4 h-4" />
                          </MainBtn>
                          <Input
                            type="number"
                            value={compQty}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (val >= 1 && val <= totalFiredQty) {
                                setCompQty(val);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="h-[48px] w-24 text-center"
                            style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}
                            min={1}
                            max={totalFiredQty}
                          />
                          <MainBtn
                            variant="secondary"
                            size="md"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCompQty(Math.min(totalFiredQty, compQty + 1));
                            }}
                            disabled={compQty >= totalFiredQty}
                            className="w-[48px]"
                          >
                            <Plus className="w-4 h-4" />
                          </MainBtn>
                          <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                            of {totalFiredQty}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* Reason */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Reason *
                  </Label>
                  <Input
                    placeholder="e.g., Staff Meal, VIP Guest, Service Recovery..."
                    value={compReason}
                    onChange={(e) => setCompReason(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[48px]"
                    style={{ fontSize: 'var(--text-p)' }}
                  />
                </div>

                {/* Manager PIN */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Manager PIN *
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter manager PIN"
                    value={compManagerPin}
                    onChange={(e) => {
                      setCompManagerPin(e.target.value);
                      setCompManagerPinError('');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[48px]"
                    style={{ fontSize: 'var(--text-p)' }}
                    maxLength={4}
                  />
                  {compManagerPinError && (
                    <p className="text-red-500" style={{ fontSize: 'var(--text-label)' }}>
                      {compManagerPinError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* For UNCOMP - keep simple */}
            {compModalAction === 'UNCOMP' && (
              <div className="p-4 border-2 border-orange-500 bg-orange-500/5 rounded-lg" style={{ borderRadius: 'var(--radius-card)' }}>
                <p style={{ fontSize: 'var(--text-p)' }}>
                  Remove complimentary status from this item
                </p>
              </div>
            )}

            {/* UNVOID action - needs reason and manager pin */}
            {compModalAction === 'UNVOID' && (
              <div className="space-y-4">
                {/* Reason */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Reason *
                  </Label>
                  <Input
                    placeholder="e.g., Customer request, Kitchen error..."
                    value={unvoidReason}
                    onChange={(e) => setUnvoidReason(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[48px]"
                    style={{ fontSize: 'var(--text-p)' }}
                  />
                </div>

                {/* Manager PIN */}
                <div className="space-y-2">
                  <Label style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Manager PIN *
                  </Label>
                  <Input
                    type="password"
                    placeholder="Enter manager PIN"
                    value={unvoidManagerPin}
                    onChange={(e) => {
                      setUnvoidManagerPin(e.target.value);
                      setUnvoidManagerPinError('');
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="h-[48px]"
                    style={{ fontSize: 'var(--text-p)' }}
                    maxLength={4}
                  />
                  {unvoidManagerPinError && (
                    <p className="text-red-500" style={{ fontSize: 'var(--text-label)' }}>
                      {unvoidManagerPinError}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex-col gap-2">
            {/* Show Serve button if there are Ready to Serve items */}
            {selectedItemForComp && selectedItemForComp.readyQty > 0 && (
              <MainBtn
                variant="secondary"
                onClick={() => {
                  handleMarkCombinedServed(selectedItemForComp);
                  setShowItemCompModal(false);
                  setSelectedItemForComp(null);
                  setCompQty(1);
                  setCompManagerPin('');
                  setCompManagerPinError('');
                  setCompReason('');
                  setCompNote('');
                  setUnvoidReason('');
                  setUnvoidManagerPin('');
                  setUnvoidManagerPinError('');
                  setIsCompCardExpanded(false);
                }}
                size="lg"
                className="w-full"
              >
                Serve
              </MainBtn>
            )}
            {/* Show Mark as Comp button only for COMP action */}
            {compModalAction === 'COMP' && (
              <MainBtn
                variant="secondary"
                onClick={() => {
                  setIsCompCardExpanded(true);
                }}
                size="lg"
                className="w-full"
              >
                Mark as Comp
              </MainBtn>
            )}
            {/* Button row for UNVOID: Restore button on left, Save on right */}
            {compModalAction === 'UNVOID' ? (
              <div className="flex gap-2 w-full">
                <MainBtn
                  variant="secondary"
                  onClick={handleOldItemCompModalConfirm}
                  size="lg"
                  className="flex-1"
                >
                  Restore
                </MainBtn>
                <MainBtn
                  onClick={() => {
                    setShowItemCompModal(false);
                    setSelectedItemForComp(null);
                    setCompQty(1);
                    setCompManagerPin('');
                    setCompManagerPinError('');
                    setCompReason('');
                    setCompNote('');
                    setUnvoidReason('');
                    setUnvoidManagerPin('');
                    setUnvoidManagerPinError('');
                    setIsCompCardExpanded(false);
                  }}
                  size="lg"
                  className="flex-1"
                >
                  Save
                </MainBtn>
              </div>
            ) : compModalAction !== 'COMP' ? (
              <MainBtn
                onClick={() => {
                  setShowItemCompModal(false);
                  setSelectedItemForComp(null);
                  setCompQty(1);
                  setCompManagerPin('');
                  setCompManagerPinError('');
                  setCompReason('');
                  setCompNote('');
                  setUnvoidReason('');
                  setUnvoidManagerPin('');
                  setUnvoidManagerPinError('');
                  setIsCompCardExpanded(false);
                }}
                size="lg"
                className="w-full"
              >
                Save
              </MainBtn>
            ) : null}
            {/* For COMP action, show Save button after Mark as Comp */}
            {compModalAction === 'COMP' && (
              <MainBtn
                onClick={() => {
                  setShowItemCompModal(false);
                  setSelectedItemForComp(null);
                  setCompQty(1);
                  setCompManagerPin('');
                  setCompManagerPinError('');
                  setCompReason('');
                  setCompNote('');
                  setUnvoidReason('');
                  setUnvoidManagerPin('');
                  setUnvoidManagerPinError('');
                  setIsCompCardExpanded(false);
                }}
                size="lg"
                className="w-full"
              >
                Save
              </MainBtn>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Sent Item Modal - for SENT items (VOID or COMP actions) */}
      <Dialog open={showModifySentItemModal} onOpenChange={setShowModifySentItemModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              {selectedSentItemForModify?.name}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              Choose an action
            </DialogDescription>
          </DialogHeader>

          {selectedSentItemForModify && (
            <div className="space-y-4 py-4">
              {/* Item info card */}
              <div className="bg-muted p-4 space-y-2" style={{ borderRadius: 'var(--radius-card)' }}>
                
                {selectedSentItemForModify.modifiers.length > 0 && (
                  <p className="text-muted-foreground italic" style={{ fontSize: 'var(--text-label)' }}>
                    {selectedSentItemForModify.modifiers.join(', ')}
                  </p>
                )}
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  {[
                    selectedSentItemForModify.sentQty > 0 && `${selectedSentItemForModify.sentQty}x Sent to Kitchen`,
                    selectedSentItemForModify.inPrepQty > 0 && `${selectedSentItemForModify.inPrepQty}x In Prep`,
                    selectedSentItemForModify.readyQty > 0 && `${selectedSentItemForModify.readyQty}x Ready to Serve`,
                    selectedSentItemForModify.servedQty > 0 && `${selectedSentItemForModify.servedQty}x Served`
                  ].filter(Boolean).join(' | ')}
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-3 justify-between items-center">
            <MainBtn
              variant="destructive"
              size="lg"
              onClick={() => {
                if (selectedSentItemForModify) {
                  setShowModifySentItemModal(false);
                  setSelectedItemForVoid(selectedSentItemForModify);
                  setVoidItemQty(1);
                  setVoidItemReason('');
                  setVoidItemManagerPin('');
                  setVoidItemManagerPinError('');
                  setShowVoidItemModal(true);
                }
              }}
            >
              VOID Item
            </MainBtn>
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => {
                if (selectedSentItemForModify) {
                  setShowModifySentItemModal(false);
                  setSelectedItemForComp(selectedSentItemForModify);
                  setCompModalAction('COMP');
                  setCompQty(1);
                  setCompManagerPin('');
                  setCompManagerPinError('');
                  setCompReason('');
                  setCompNote('');
                  setShowItemCompModal(true);
                }
              }}
              className="flex-1"
            >
              <Gift className="w-5 h-5 mr-2" />
              Mark as Comp
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Void Item Modal */}
      <Dialog open={showVoidItemModal} onOpenChange={setShowVoidItemModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Void Item
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
              {selectedItemForVoid && (
                <>Mark {selectedItemForVoid.name} as voided. Only items sent to kitchen (not in prep yet) can be voided.</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedItemForVoid && (
            <div className="space-y-4 py-4">
              {/* Item info card */}
              <div className="bg-muted p-4 space-y-2" style={{ borderRadius: 'var(--radius-card)' }}>
                <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {selectedItemForVoid.name}
                </p>
                {selectedItemForVoid.modifiers.length > 0 && (
                  <p className="text-muted-foreground italic" style={{ fontSize: 'var(--text-label)' }}>
                    {selectedItemForVoid.modifiers.join(', ')}
                  </p>
                )}
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  Available to void: {selectedItemForVoid.sentQty} sent to kitchen
                </p>
                <p className="text-orange-600" style={{ fontSize: 'var(--text-label)' }}>
                  Note: Only items sent to kitchen (not in prep yet) can be voided
                </p>
              </div>

              {/* Quantity selector - only show if more than 1 voidable */}
              {selectedItemForVoid.sentQty > 1 && (
                <div className="space-y-2">
                  <label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Quantity to Void
                  </label>
                  <div className="flex items-center gap-3">
                    <MainBtn
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => setVoidItemQty(Math.max(1, voidItemQty - 1))}
                      className="w-[48px]"
                    >
                      <Minus className="w-4 h-4" />
                    </MainBtn>
                    <Input
                      type="number"
                      value={voidItemQty}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const maxQty = selectedItemForVoid.sentQty;
                        setVoidItemQty(Math.min(Math.max(1, val), maxQty));
                      }}
                      className="h-[48px] text-center"
                      style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}
                      min={1}
                      max={selectedItemForVoid.sentQty}
                    />
                    <MainBtn
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => setVoidItemQty(Math.min(selectedItemForVoid.sentQty, voidItemQty + 1))}
                      className="w-[48px]"
                    >
                      <Plus className="w-4 h-4" />
                    </MainBtn>
                  </div>
                </div>
              )}

              {/* Void Reason */}
              <div className="space-y-2">
                <label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Void Reason *
                </label>
                <Textarea
                  value={voidItemReason}
                  onChange={(e) => setVoidItemReason(e.target.value)}
                  placeholder="Enter reason for voiding this item"
                  className="min-h-[80px]"
                  style={{ fontSize: 'var(--text-p)' }}
                />
              </div>

              {/* Manager PIN */}
              <div className="space-y-2">
                <label style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Manager PIN *
                </label>
                <Input
                  type="password"
                  value={voidItemManagerPin}
                  onChange={(e) => {
                    setVoidItemManagerPin(e.target.value);
                    setVoidItemManagerPinError('');
                  }}
                  placeholder="Enter manager PIN"
                  className="h-[48px]"
                  style={{ fontSize: 'var(--text-p)' }}
                />
                {voidItemManagerPinError && (
                  <p className="text-red-500" style={{ fontSize: 'var(--text-label)' }}>
                    {voidItemManagerPinError}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <MainBtn
              variant="secondary"
              onClick={() => {
                setShowVoidItemModal(false);
                setSelectedItemForVoid(null);
                setVoidItemQty(1);
                setVoidItemReason('');
                setVoidItemManagerPin('');
                setVoidItemManagerPinError('');
              }}
              size="lg"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={handleVoidItemConfirm}
              variant="destructive"
              size="lg"
            >
              Void Item
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified CompModal */}
      <CompModal
        open={showCompModal}
        onOpenChange={setShowCompModal}
        itemName={compModalItem?.name || ''}
        itemPrice={compModalItem?.price || 0}
        totalQuantity={(() => {
          if (!compModalItem) return 0;
          const allItems = getItemsByCheck(checkId);
          const compModifiers = (compModalItem.modifiers || []).sort().join(',');
          
          // Sum quantities instead of counting items
          const total = allItems
            .filter(item => 
              item.name === compModalItem.name && 
              (item.modifiers || []).sort().join(',') === compModifiers &&
              !item.isVoided
            )
            .reduce((sum, item) => sum + item.quantity, 0);
          
          console.log('=== totalQuantity Debug ===');
          console.log('compModalItem:', compModalItem.name);
          console.log('totalQuantity (summed):', total);
          
          return total;
        })()}
        compedQuantity={(() => {
          if (!compModalItem) return 0;
          const allItems = getItemsByCheck(checkId);
          const compModifiers = (compModalItem.modifiers || []).sort().join(',');
          
          // Sum quantities instead of counting items
          const comped = allItems
            .filter(item => 
              item.name === compModalItem.name && 
              (item.modifiers || []).sort().join(',') === compModifiers &&
              !item.isVoided &&
              item.isComplimentary
            )
            .reduce((sum, item) => sum + item.quantity, 0);
          
          console.log('compedQuantity (summed):', comped);
          
          return comped;
        })()}
        nonCompedQuantity={(() => {
          if (!compModalItem) return 0;
          const allItems = getItemsByCheck(checkId);
          const compModifiers = (compModalItem.modifiers || []).sort().join(',');
          
          // Sum quantities instead of counting items
          const nonComped = allItems
            .filter(item => 
              item.name === compModalItem.name && 
              (item.modifiers || []).sort().join(',') === compModifiers &&
              !item.isVoided &&
              !item.isComplimentary
            )
            .reduce((sum, item) => sum + item.quantity, 0);
          
          console.log('nonCompedQuantity (summed):', nonComped);
          
          return nonComped;
        })()}
        statusBreakdown={compModalItem ? [
          compModalItem.sentQty > 0 && `${compModalItem.sentQty}x Sent to Kitchen`,
          compModalItem.inPrepQty > 0 && `${compModalItem.inPrepQty}x In Prep`,
          compModalItem.readyQty > 0 && `${compModalItem.readyQty}x Ready to Serve`,
          compModalItem.servedQty > 0 && `${compModalItem.servedQty}x Served`
        ].filter(Boolean).join(' | ') : undefined}
        onConfirm={handleCompModalConfirm}
        onCancel={() => {
          setShowCompModal(false);
          setCompModalItem(null);
        }}
      />

      {/* ItemModal for editing items */}
      {editingItem && (
        <ItemModal
          open={showItemModal}
          onOpenChange={(open) => {
            setShowItemModal(open);
            if (!open) {
              setEditingItem(null);
              setItemModalDineType('DINE_IN');
              setItemModalPackagingPrice('');
            }
          }}
          mode="EDIT"
          itemId={editingItem.id}
          itemStatus={editingItemStatus}
          menuItem={{
            id: editingItem.menuItemId || editingItem.id,
            name: editingItem.name,
            price: editingItem.price,
            availableModifiers: (() => {
              // For DRAFT items, get available modifiers from menu
              if (editingItemStatus === 'DRAFT' && editingItem.menuItemId) {
                const menuItem = MENU_ITEMS.find(item => item.id === editingItem.menuItemId);
                return menuItem?.availableModifiers || [];
              }
              // For non-draft items, modifiers are already selected and not editable
              return [];
            })()
          }}
          selectedModifiers={itemModalModifiers}
          onModifiersChange={setItemModalModifiers}
          modifierNotes={itemModalNotes}
          onNotesChange={setItemModalNotes}
          discountType={itemModalDiscountType}
          onDiscountTypeChange={setItemModalDiscountType}
          discountValue={itemModalDiscountValue}
          onDiscountValueChange={setItemModalDiscountValue}
          isComplimentary={itemModalIsComp}
          onComplimentaryChange={setItemModalIsComp}
          compReason={itemModalCompReason}
          onCompReasonChange={setItemModalCompReason}
          compManagerPin={itemModalManagerPin}
          onCompManagerPinChange={setItemModalManagerPin}
          dineType={itemModalDineType}
          onDineTypeChange={setItemModalDineType}
          packagingPrice={itemModalPackagingPrice}
          onPackagingPriceChange={setItemModalPackagingPrice}
          onConfirm={editingItemStatus === 'DRAFT' ? handleItemModalUpdate : () => {
            // No confirmation needed for view-only mode
            setShowItemModal(false);
            setEditingItem(null);
          }}
          onDelete={editingItemStatus === 'DRAFT' ? handleItemModalDelete : undefined}
          onSend={editingItemStatus === 'DRAFT' ? handleItemModalSend : undefined}
          onVoid={editingItemStatus === 'SENT' ? handleItemModalVoid : undefined}
          onReprint={editingItemStatus !== 'DRAFT' ? handleReprintItemTicket : undefined}
          isReprinting={isPrinting && pendingPrintAction === 'PRINT_TICKET'}
          checkStatus={paymentStatus}
          onComp={editingItemStatus !== 'DRAFT' && editingItem ? (data) => {
            // Immediately persist comp for fired (SENT / IN_PREP / READY / SERVED) items.
            // The ItemModal has no "Save" button for these statuses, so we apply the
            // change directly here instead of staging it through itemModalIsComp state.
            const itemIds = [
              ...(editingItem.sentItemIds || []),
              ...(editingItem.inPrepItemIds || []),
              ...(editingItem.readyItemIds || []),
              ...(editingItem.servedItemIds || []),
            ];
            itemIds.forEach(itemId => {
              updateItem(itemId, {
                isComplimentary: true,
                compReason: data.reason,
                complimentaryReason: data.reason,
                price: 0,
              });
            });
            snackbar.success(`${editingItem.name} marked as complimentary`);
            setShowItemModal(false);
            setEditingItem(null);
          } : undefined}
        />
      )}
    </>
  );
}

export default function OperationalOrderScreen(props: OperationalOrderScreenProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <OperationalOrderScreenContent {...props} />
    </DndProvider>
  );
}
