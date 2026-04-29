import { Clock, Check, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { formatCurrency } from '../../utils/formatters';

interface KotCardProps {
  kotId: string;
  createdAt: Date;
  items: Array<{
    id: string;
    name: string;
    price: number;
    status: 'SENT' | 'IN_PREP' | 'READY' | 'SERVED' | 'VOIDED';
    course?: number | null;
    modifiers: string[];
    notes?: string;
    isComplimentary?: boolean;
    voidReason?: string;
    complimentaryReason?: string;
    dineType?: 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
  }>;
  onItemClick: (itemId: string) => void;
  onMarkServed: (itemId: string) => void;
  onCancelItem: (itemId: string) => void;
  getElapsedTime: (date: Date) => string;
  billPrinted?: boolean;
}

// Course separator
function CourseSeparator({ courseNumber }: { courseNumber: number }) {
  return (
    <div className="flex gap-[12px] items-center w-full">
      <div className="bg-[#e9e9e9] flex-1 h-px" />
      <p 
        className="text-[#a9a9a9] italic shrink-0"
        style={{ 
          fontSize: 'var(--text-label)',
          fontWeight: 'var(--font-weight-semibold)',
          fontStyle: 'italic'
        }}
      >
        COURSE {courseNumber}
      </p>
      <div className="bg-[#e9e9e9] flex-1 h-px" />
    </div>
  );
}

export default function KotCard({ 
  kotId, 
  createdAt, 
  items, 
  onItemClick, 
  onMarkServed,
  onCancelItem,
  getElapsedTime,
  billPrinted = false
}: KotCardProps) {
  // Group items by course
  const coursesMap: { [course: number]: typeof items } = {};
  items.forEach(item => {
    const course = item.course || 0;
    if (!coursesMap[course]) {
      coursesMap[course] = [];
    }
    coursesMap[course].push(item);
  });

  const courses = Object.keys(coursesMap).map(Number).sort((a, b) => a - b);
  const hasCourses = courses.length > 1 || (courses.length === 1 && courses[0] !== 0);

  return (
    <div 
      className="bg-white flex flex-col overflow-clip border border-[var(--neutral-10)]"
      style={{ borderRadius: 'var(--radius-card)' }}
    >
      {/* Header */}
      <div className="bg-[#e6f0ff] w-full">
        <div className="flex items-center justify-between p-[16px]">
          <p 
            className="text-[#282828]"
            style={{ 
              fontSize: 'var(--text-p)',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            ORD #{kotId.slice(-4).toUpperCase()}
          </p>
          <div className="flex gap-[4px] items-center">
            <Clock className="w-5 h-5 text-[#7e7e7e]" strokeWidth={1.8} />
            <p 
              className="text-[#7e7e7e]"
              style={{ 
                fontSize: 'var(--text-label)',
                fontWeight: 'var(--font-weight-bold)'
              }}
            >
              {getElapsedTime(createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="border-t border-[#e6f0ff]">
        <div className="flex flex-col gap-[20px] p-[16px]">
          {courses.map((courseNum, courseIndex) => {
            const courseItems = coursesMap[courseNum];
            
            return (
              <div key={courseNum} className="flex flex-col gap-[20px]">
                {/* Course separator - only show if there are courses and it's not the first item OR course is not 0 */}
                {hasCourses && courseNum !== 0 && (
                  <CourseSeparator courseNumber={courseNum} />
                )}

                {/* Items in this course */}
                <div className="flex flex-col gap-[24px]">
                  {courseItems.map((item) => {
                    const isServed = item.status === 'SERVED';
                    const isVoided = item.status === 'VOIDED';
                    const isReady = item.status === 'READY';
                    const isSent = item.status === 'SENT';
                    const isInPrep = item.status === 'IN_PREP';

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          // When bill is printed, all non-voided/non-served items are tappable
                          // Otherwise, only IN_PREP items are tappable
                          if (billPrinted && !isVoided && !isServed) {
                            onItemClick(item.id);
                          } else if (!billPrinted && !isVoided && !isReady && !isSent) {
                            onItemClick(item.id);
                          }
                        }}
                        className={`flex gap-[12px] items-center w-full ${
                          (billPrinted && !isVoided && !isServed) || (!billPrinted && isInPrep) 
                            ? 'cursor-pointer hover:opacity-80' 
                            : 'cursor-default'
                        } transition-opacity`}
                      >
                        {/* Status Dot */}
                        <div className="shrink-0">
                          {/* Blue dot for SENT (not yet processed) */}
                          {isSent && <div className="bg-[#006bff] rounded-[100px] shrink-0 size-[8px]" />}
                          {/* Orange dot for IN_PREP */}
                          {isInPrep && <div className="bg-[#ff9100] rounded-[100px] shrink-0 size-[8px]" />}
                          {/* Green dot for READY */}
                          {isReady && <div className="bg-[#54a73f] rounded-[100px] shrink-0 size-[8px]" />}
                          {/* Gray dot for SERVED/VOIDED */}
                          {(isServed || isVoided) && <div className="bg-[#a9a9a9] rounded-[100px] shrink-0 size-[8px]" />}
                        </div>

                        {/* Item Details */}
                        <div 
                          className={`flex-1 flex flex-col gap-[4px] ${ isServed || isVoided ? 'opacity-40' : ''
                          }`}
                        >
                          <div className="flex items-center gap-[8px]">
                            <p 
                              className={`text-[#282828] ${isServed || isVoided ? 'line-through' : ''}`}
                              style={{ 
                                fontSize: 'var(--text-label)',
                                fontWeight: 'var(--font-weight-bold)'
                              }}
                            >
                              {item.name}
                            </p>
                            {/* Complimentary Tag */}
                            {item.isComplimentary && (
                              <span
                                className="text-white px-[8px] py-[2px] shrink-0"
                                style={{
                                  fontSize: 'var(--text-label)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  borderRadius: 'var(--radius-small)',
                                  lineHeight: '1.4',
                                  backgroundColor: 'var(--chart-2)'
                                }}
                              >
                                COMPLIMENTARY
                              </span>
                            )}
                            {/* Dine-type Tag: TAKEAWAY or DELIVERY */}
                            {item.dineType === 'TAKEAWAY' && (
                              <span
                                className="text-white px-[8px] py-[2px] shrink-0"
                                style={{
                                  fontSize: 'var(--text-label)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  borderRadius: 'var(--radius-small)',
                                  lineHeight: '1.4',
                                  backgroundColor: 'var(--status-orange-primary, #ff9100)',
                                }}
                              >
                                TAKEAWAY
                              </span>
                            )}
                            {item.dineType === 'DELIVERY' && (
                              <span
                                className="text-white px-[8px] py-[2px] shrink-0"
                                style={{
                                  fontSize: 'var(--text-label)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  borderRadius: 'var(--radius-small)',
                                  lineHeight: '1.4',
                                  backgroundColor: 'var(--feature-brand-primary, #006bff)',
                                }}
                              >
                                DELIVERY
                              </span>
                            )}
                          </div>
                          <p 
                            className={`text-[#7e7e7e] ${isServed || isVoided ? 'line-through' : ''}`}
                            style={{ fontSize: 'var(--text-label)' }}
                          >
                            {formatCurrency(item.price)}
                          </p>
                        </div>

                        {/* Mark Served Button - only show for READY items */}
                        {isReady && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkServed(item.id);
                            }}
                            className="bg-[#006bff] text-white h-[32px] px-[12px] py-[16px] hover:bg-[#005de0]"
                            style={{ 
                              fontSize: 'var(--text-label)',
                              borderRadius: 'var(--radius-button)'
                            }}
                          >
                            Mark Served
                          </Button>
                        )}

                        {/* Cancel Item Button - only show for SENT items and when bill is NOT printed */}
                        {isSent && !billPrinted && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancelItem(item.id);
                            }}
                            className="bg-[#d0021b] text-white h-[32px] w-[32px] p-0 hover:bg-[#c40014] flex items-center justify-center"
                            style={{ 
                              borderRadius: 'var(--radius-button)'
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
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
    </div>
  );
}