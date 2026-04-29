import { useRestaurant } from '../../context/RestaurantContext';
import { getTimeSince } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';
import KotCardKitchen from '../kitchen/KotCardKitchen';
import { EmptyState } from '../ui/EmptyState';

export default function ActiveQueue() {
  const { kots, items, updateItem, updateKOT } = useRestaurant();
  const snackbar = useSnackbar();

  // Filter only BAR station tickets that are not completed
  const activeBOTs = kots.filter(kot => kot.station === 'BAR' && kot.status !== 'COMPLETED');

  const handleItemStatusChange = (itemId: string, newStatus: 'IN_PREP' | 'READY') => {
    console.log('[Bar ActiveQueue] handleItemStatusChange called:', { itemId, newStatus });
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
    
    // Allow completion if:
    // 1. All active items are ready (and there are active items), OR
    // 2. All items are voided (allow manual completion)
    const allItemsVoided = kotItems.length > 0 && kotItems.every(item => item.status === 'VOIDED');
    
    if ((allItemsReady && activeItems.length > 0) || allItemsVoided) {
      updateKOT(kotId, { status: 'COMPLETED' });
      snackbar.success('BOT completed');
    } else {
      snackbar.error('All items must be ready to serve before completing BOT');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {activeBOTs.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            title="No Active Orders Yet"
            subtitle="Orders will be shown here when sent from POS"
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activeBOTs.map(kot => {
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
        </div>
      )}
    </div>
  );
}