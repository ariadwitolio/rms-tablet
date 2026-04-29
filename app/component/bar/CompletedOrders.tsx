import { ScrollArea } from '../ui/scroll-area';
import { useRestaurant } from '../../context/RestaurantContext';
import { getTimeSince } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';
import KotCardKitchen from '../kitchen/KotCardKitchen';
import { EmptyState } from '../ui/EmptyState';

export default function CompletedOrders() {
  const { kots, items, updateItem, updateKOT } = useRestaurant();
  const snackbar = useSnackbar();

  // Filter only BAR station tickets that are completed
  const completedBOTs = kots.filter(kot => kot.station === 'BAR' && kot.status === 'COMPLETED');

  const handleItemStatusChange = (itemId: string, newStatus: 'IN_PREP' | 'READY') => {
    console.log('[Bar CompletedOrders] handleItemStatusChange called:', { itemId, newStatus });
    updateItem(itemId, { status: newStatus });
    
    if (newStatus === 'IN_PREP') {
      snackbar.success('Item marked as in preparation');
    } else {
      snackbar.success('Item ready for serving');
    }
  };

  const handleRevertItem = (itemId: string) => {
    updateItem(itemId, { status: 'SENT' });
    snackbar.success('Item reverted to new');
  };

  const handleKOTComplete = (kotId: string) => {
    const kot = kots.find(k => k.id === kotId);
    if (!kot) return;

    // Get current items for this BOT
    const kotItems = items.filter(item => kot.itemIds.includes(item.id));

    // Check if all items are ready to serve (excluding voided)
    const activeItems = kotItems.filter(item => item.status !== 'VOIDED');
    const allItemsReady = activeItems.every(item => item.status === 'READY');
    
    if (allItemsReady && activeItems.length > 0) {
      updateKOT(kotId, { status: 'COMPLETED' });
      snackbar.success('BOT completed');
    } else {
      snackbar.error('All items must be ready to serve before completing BOT');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {completedBOTs.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            title="No Completed Orders Yet"
            subtitle="Completed orders will be shown here"
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {completedBOTs.map(kot => {
                const kotItems = items.filter(item => kot.itemIds.includes(item.id));
                
                return (
                  <KotCardKitchen
                    key={kot.id}
                    kotId={kot.id}
                    createdAt={kot.createdAt}
                    serviceType={kot.serviceType}
                    tableName={kot.tableName}
                    items={kotItems.map(item => ({
                      id: item.id,
                      name: item.name,
                      price: item.price,
                      modifiers: item.modifiers,
                      status: item.status,
                      notes: item.notes,
                      voidReason: item.voidReason,
                      course: item.course,
                    }))}
                    onStartPrep={(itemId) => handleItemStatusChange(itemId, 'IN_PREP')}
                    onMarkReady={(itemId) => handleItemStatusChange(itemId, 'READY')}
                    onRevert={(itemId) => handleRevertItem(itemId)}
                    onMarkCompleted={(kotId) => handleKOTComplete(kotId)}
                    getElapsedTime={getTimeSince}
                  />
                );
              })}
            </div>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}