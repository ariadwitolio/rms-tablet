import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/formatters';
import svgPaths from '../../../imports/svg-h7uhgoykyl';
import type { ServiceType } from '../../types';

interface KotCardKitchenProps {
  kotId: string;
  createdAt: Date;
  serviceType: ServiceType;
  tableName?: string;
  customerName?: string;
  scheduledTime?: Date;
  items: Array<{
    id: string;
    name: string;
    price: number;
    status: 'SENT' | 'IN_PREP' | 'READY' | 'SERVED' | 'VOIDED';
    course?: number | null;
    modifiers: string[];
    notes?: string;
    voidReason?: string;
    dineType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  }>;
  onMarkReady: (itemId: string) => void;
  onRevert: (itemId: string) => void;
  onMarkCompleted: (kotId: string) => void;
  getElapsedTime: (date: Date) => string;
  /** When true, card renders in the Completed style: grey header, all items greyed/struck, Revert footer */
  completed?: boolean;
  /** Called when the Revert button is tapped in completed mode */
  onRevertKOT?: () => void;
}

// Clock icon component
function ClockIcon({ grey }: { grey?: boolean }) {
  const stroke = grey ? '#a9a9a9' : '#282828';
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_62_213)">
          <path d={svgPaths.p3dc49580} stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9 4.5V9H12" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </g>
        <defs>
          <clipPath id="clip0_62_213">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Course separator
function CourseSeparator({ courseNumber, grey }: { courseNumber: number; grey?: boolean }) {
  const lineColor  = grey ? '#d4d4d4' : '#e9e9e9';
  const textColor  = grey ? '#c4c4c4' : '#a9a9a9';
  return (
    <div className="flex gap-[12px] items-center w-full">
      <div className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
      <p
        style={{
          fontSize:   'var(--text-p)',
          fontWeight: 'var(--font-weight-semibold)',
          fontStyle:  'italic',
          color:       textColor,
          fontFamily: 'Lato, sans-serif',
        }}
      >
        COURSE {courseNumber}
      </p>
      <div className="flex-1 h-px" style={{ backgroundColor: lineColor }} />
    </div>
  );
}

// Get service type label
function getServiceTypeLabel(serviceType: ServiceType): string {
  switch (serviceType) {
    case 'DINE_IN':         return 'Dine-In';
    case 'TAKEAWAY':        return 'Takeaway';
    case 'DELIVERY':        return 'Delivery';
    case 'SCHEDULED_ORDER': return 'Scheduled';
    default:                return serviceType;
  }
}

// Get header title based on service type
function getHeaderTitle(
  serviceType: ServiceType,
  tableName?: string,
  customerName?: string,
  scheduledTime?: Date
): string {
  if (serviceType === 'DINE_IN' && tableName)            return tableName;
  if (serviceType === 'TAKEAWAY')                         return customerName || 'Takeaway Order';
  if (serviceType === 'DELIVERY')                         return customerName || 'Delivery Order';
  if (serviceType === 'SCHEDULED_ORDER' && scheduledTime) return `Scheduled ${formatTime(scheduledTime)}`;
  return 'Order';
}

export default function KotCardKitchen({
  kotId,
  createdAt,
  serviceType,
  tableName,
  customerName,
  scheduledTime,
  items,
  onMarkReady,
  onRevert,
  onMarkCompleted,
  getElapsedTime,
  completed = false,
  onRevertKOT,
}: KotCardKitchenProps) {
  // Group items by course
  const coursesMap: { [course: number]: typeof items } = {};
  items.forEach(item => {
    const course = item.course || 0;
    if (!coursesMap[course]) coursesMap[course] = [];
    coursesMap[course].push(item);
  });

  const courses    = Object.keys(coursesMap).map(Number).sort((a, b) => a - b);
  const hasCourses = courses.length > 1 || (courses.length === 1 && courses[0] !== 0);

  const headerTitle      = getHeaderTitle(serviceType, tableName, customerName, scheduledTime);
  const elapsedTime      = getElapsedTime(createdAt);
  const serviceTypeLabel = getServiceTypeLabel(serviceType);

  // Active (non-voided) items
  const activeItems    = items.filter(i => i.status !== 'VOIDED');
  const allItemsReady  = activeItems.length > 0 && activeItems.every(i => i.status === 'READY');
  const allItemsVoided = items.length > 0 && items.every(i => i.status === 'VOIDED');

  // Auto-complete KOT when all active items are struck through (READY) or all voided.
  // Skip this when already in completed mode.
  useEffect(() => {
    if (completed) return;
    if (allItemsReady || allItemsVoided) {
      const timer = setTimeout(() => onMarkCompleted(kotId), 600);
      return () => clearTimeout(timer);
    }
  }, [allItemsReady, allItemsVoided, kotId, onMarkCompleted, completed]);

  // Handle tap on an item — toggle SENT/IN_PREP → READY, or READY → SENT (revert)
  const handleItemTap = (item: typeof items[number]) => {
    if (item.status === 'VOIDED' || completed) return;
    if (item.status === 'READY') {
      onRevert(item.id);
    } else {
      onMarkReady(item.id);
    }
  };

  // ── Colour tokens ────────────────────────────────────────────────────────
  // Header background: blue in active, grey in completed
  const headerBg      = completed ? '#e9e9e9' : '#e6f0ff';
  const headerBorder  = completed ? '#d4d4d4' : '#e6f0ff';
  // Badge bg inside header (clock / service-type pill)
  const badgeBg       = completed ? '#f4f4f4' : '#ffffff';
  const kotIdColor    = completed ? '#a9a9a9' : '#282828';
  const subTitleColor = '#7e7e7e';
  const badgeTextColor = completed ? '#a9a9a9' : '#282828';

  return (
    <div
      className="flex flex-col overflow-clip border"
      style={{
        borderRadius:    'var(--radius-card)',
        backgroundColor: '#ffffff',
        borderColor:     completed ? '#d4d4d4' : 'var(--neutral-10)',
        opacity:          completed ? 0.85 : 1,
      }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: headerBg }}>
        <div className="flex items-center justify-between px-[20px] py-[18px] gap-[12px]">
          {/* Left: KOT ID + badges row below */}
          <div className="flex flex-col gap-[8px] min-w-0">
            <p
              style={{
                fontSize:   'var(--text-h2)',
                fontWeight: 'var(--font-weight-bold)',
                color:       kotIdColor,
                fontFamily: 'Lato, sans-serif',
                lineHeight:  1.3,
              }}
            >
              KOT{kotId.slice(-4).toUpperCase()} - {headerTitle}
            </p>
            {/* Time & Service Type badges */}
            <div className="flex gap-[6px] items-center flex-wrap">
              <div
                className="flex gap-[6px] items-center px-[10px] py-[5px] rounded-full"
                style={{ backgroundColor: badgeBg }}
              >
                <ClockIcon grey={completed} />
                <p
                  style={{
                    fontSize:   'var(--text-p)',
                    fontWeight: 'var(--font-weight-bold)',
                    color:       badgeTextColor,
                    fontFamily: 'Lato, sans-serif',
                  }}
                >
                  {elapsedTime}
                </p>
              </div>
              <div
                className="flex items-center px-[10px] py-[5px] rounded-full"
                style={{ backgroundColor: badgeBg }}
              >
                <p
                  style={{
                    fontSize:   'var(--text-p)',
                    fontWeight: 'var(--font-weight-bold)',
                    color:       badgeTextColor,
                    fontFamily: 'Lato, sans-serif',
                  }}
                >
                  {serviceTypeLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Right: DONE button */}
          {!completed && (
            <button
              onClick={() => {
                items
                  .filter(i => i.status !== 'VOIDED' && i.status !== 'READY')
                  .forEach(i => onMarkReady(i.id));
                onMarkCompleted(kotId);
              }}
              className="shrink-0 flex items-center justify-center px-[16px] rounded-[8px]"
              style={{
                height:          '48px',
                minWidth:        '72px',
                backgroundColor: 'var(--feature-brand-primary, #1a56db)',
                color:           '#ffffff',
                fontFamily:      'Lato, sans-serif',
                fontSize:        'var(--text-p)',
                fontWeight:      'var(--font-weight-bold)',
                border:          'none',
                cursor:          'pointer',
              }}
            >
              DONE
            </button>
          )}
        </div>
      </div>

      {/* ── Items ───────────────────────────────────────────────────────── */}
      <div className="border-t" style={{ borderColor: headerBorder }}>
        <div className="flex flex-col gap-[24px] p-[20px]">
          {courses.map((courseNum) => {
            const courseItems = coursesMap[courseNum];
            return (
              <div key={courseNum} className="flex flex-col gap-[24px]">
                {hasCourses && courseNum !== 0 && (
                  <CourseSeparator courseNumber={courseNum} grey={completed} />
                )}

                <div className="flex flex-col gap-[20px]">
                  {courseItems.map((item) => {
                    const isVoided = item.status === 'VOIDED';
                    // In completed mode every non-voided item is forced to "done" appearance
                    const isDone = completed ? !isVoided : (item.status === 'READY' || isVoided);

                    return (
                      <div key={item.id} className="flex flex-col gap-[6px]">
                        {/* Tappable item row */}
                        <button
                          onClick={() => handleItemTap(item)}
                          disabled={isVoided || completed}
                          className="flex items-center gap-[10px] w-full text-left transition-opacity active:opacity-60"
                          style={{
                            background: 'none',
                            border:     'none',
                            padding:    0,
                            cursor:     (isVoided || completed) ? 'default' : 'pointer',
                            minHeight:  48,
                          }}
                        >
                          {/* Item name */}
                          <p
                            style={{
                              fontSize:       'var(--text-h3)',
                              fontWeight:     'var(--font-weight-bold)',
                              color:          isDone ? '#a9a9a9' : '#282828',
                              fontFamily:     'Lato, sans-serif',
                              textDecoration: isDone ? 'line-through' : 'none',
                              transition:     'all 0.2s ease',
                              flex:           1,
                            }}
                          >
                            1x {item.name}
                          </p>

                          {/* Tags */}
                          <div className="flex gap-[6px] items-center shrink-0">
                            {isVoided && (
                              <span
                                className="bg-red-600 text-white px-[8px] py-[3px]"
                                style={{
                                  fontSize:     'var(--text-h4)',
                                  fontWeight:   'var(--font-weight-bold)',
                                  borderRadius: 'var(--radius-small)',
                                  lineHeight:   '1.4',
                                  fontFamily:   'Lato, sans-serif',
                                }}
                              >
                                VOID
                              </span>
                            )}
                            {!isVoided && item.dineType === 'TAKEAWAY' && (
                              <span
                                className="text-white px-[8px] py-[3px]"
                                style={{
                                  fontSize:        'var(--text-h4)',
                                  fontWeight:      'var(--font-weight-bold)',
                                  borderRadius:    'var(--radius-small)',
                                  lineHeight:      '1.4',
                                  backgroundColor: completed ? '#c9a07a' : '#ff9100',
                                  fontFamily:      'Lato, sans-serif',
                                  opacity:         completed ? 0.7 : 1,
                                }}
                              >
                                TAKEAWAY
                              </span>
                            )}
                            {!isVoided && item.dineType === 'DELIVERY' && (
                              <span
                                className="text-white px-[8px] py-[3px]"
                                style={{
                                  fontSize:        'var(--text-h4)',
                                  fontWeight:      'var(--font-weight-bold)',
                                  borderRadius:    'var(--radius-small)',
                                  lineHeight:      '1.4',
                                  backgroundColor: completed ? '#a0a0a0' : 'var(--feature-brand-primary, #006bff)',
                                  fontFamily:      'Lato, sans-serif',
                                  opacity:         completed ? 0.7 : 1,
                                }}
                              >
                                DELIVERY
                              </span>
                            )}
                          </div>
                        </button>

                        {/* Modifiers + Notes grouped tightly */}
                        {(item.modifiers.length > 0 || (item.notes && !isVoided)) && (
                          <div className="flex flex-col gap-[2px]">
                            {/* Modifiers */}
                            {item.modifiers.length > 0 && (
                              <p
                                style={{
                                  fontSize:       'var(--text-p)',
                                  color:          isDone ? '#c4c4c4' : '#7e7e7e',
                                  fontFamily:     'Lato, sans-serif',
                                  textDecoration: isDone ? 'line-through' : 'none',
                                  paddingLeft:    0,
                                }}
                              >
                                {item.modifiers.join(', ')}
                              </p>
                            )}

                            {/* Chef notes */}
                            {item.notes && !isVoided && (
                              <p
                                style={{
                                  fontSize:       'var(--text-p)',
                                  color:          isDone ? '#c4c4c4' : 'var(--neutral-onsurface-tertiary)',
                                  fontFamily:     'Lato, sans-serif',
                                  fontStyle:      'italic',
                                  textDecoration: (completed || item.status === 'READY') ? 'line-through' : 'none',
                                }}
                              >
                                *{item.notes}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Void reason */}
                        {isVoided && item.voidReason && (
                          <p
                            className="text-red-600"
                            style={{
                              fontSize:   'var(--text-p)',
                              fontWeight: 'var(--font-weight-semibold)',
                              fontFamily: 'Lato, sans-serif',
                              opacity:    completed ? 0.6 : 1,
                            }}
                          >
                            Void: {item.voidReason}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Completed footer: Revert button ─────────────────────────────── */}
      {completed && onRevertKOT && (
        <div
          className="px-[20px] py-[14px] border-t"
          style={{ borderColor: '#d4d4d4', backgroundColor: '#fafafa' }}
        >
          <button
            onClick={onRevertKOT}
            className="w-full flex items-center justify-center gap-[8px] transition-colors active:opacity-70"
            style={{
              minHeight:       '48px',
              borderRadius:    'var(--radius-button)',
              border:          '1.5px solid #c4c4c4',
              backgroundColor: '#ffffff',
              cursor:          'pointer',
              padding:         '0 16px',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f4f4f4')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <RotateCcw
              size={16}
              style={{ color: '#7e7e7e', flexShrink: 0 }}
            />
            <p
              style={{
                fontSize:   'var(--text-p)',
                fontWeight: 'var(--font-weight-bold)',
                color:      '#7e7e7e',
                fontFamily: 'Lato, sans-serif',
              }}
            >
              Revert to Active Queue
            </p>
          </button>
        </div>
      )}
    </div>
  );
}