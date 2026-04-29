import { useRestaurant } from '../../context/RestaurantContext';
import { getTimeSince } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';
import KotCardKitchen from './KotCardKitchen';
import { EmptyState } from '../ui/EmptyState';

export default function ActiveQueue() {
  const { kots, items, updateItem, updateKOT } = useRestaurant();
  const snackbar = useSnackbar();

  // Filter only KITCHEN station tickets that are not completed
  const activeKOTs = kots.filter(kot => kot.station === 'KITCHEN' && kot.status !== 'COMPLETED');

  console.log('[Kitchen ActiveQueue] Total KOTs:', kots.length);
  console.log('[Kitchen ActiveQueue] Active KOTs:', activeKOTs.length);
  console.log('[Kitchen ActiveQueue] Total Items:', items.length);
  
  // Log details of active KOTs
  activeKOTs.forEach(kot => {
    const kotItems = items.filter(item => kot.itemIds.includes(item.id));
    console.log(`[Kitchen ActiveQueue] KOT ${kot.id}:`, {
      station: kot.station,
      status: kot.status,
      itemIds: kot.itemIds,
      kotItemsFound: kotItems.length,
      items: kotItems.map(item => ({
        id: item.id,
        name: item.name,
        status: item.status,
        voidReason: item.voidReason
      }))
    });
  });
  
  const handleItemStatusChange = (itemId: string) => {
    updateItem(itemId, { status: 'READY' });
    snackbar.success('Item ready for serving');
  };

  const handleRevertItem = (itemId: string) => {
    updateItem(itemId, { status: 'SENT' });
    snackbar.success('Item reverted to new');
  };

  const handleKOTComplete = (kotId: string) => {
    const kot = kots.find(k => k.id === kotId);
    if (!kot) return;

    const kotItems = items.filter(item => kot.itemIds.includes(item.id));
    const activeItems = kotItems.filter(item => item.status !== 'VOIDED');
    const allItemsReady = activeItems.every(item => item.status === 'READY');
    const allItemsVoided = kotItems.length > 0 && kotItems.every(item => item.status === 'VOIDED');

    if ((allItemsReady && activeItems.length > 0) || allItemsVoided) {
      updateKOT(kotId, { status: 'COMPLETED' });
      snackbar.success('KOT completed');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {activeKOTs.length === 0 ? (
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
              {activeKOTs.map(kot => {
                const kotItems = items.filter(item => kot.itemIds.includes(item.id));
                
                console.log('[Kitchen ActiveQueue] Displaying KOT:', kot.id, 'with itemIds:', kot.itemIds, 'found items:', kotItems.length);
                console.log('[Kitchen ActiveQueue] Items details:', kotItems.map(item => ({ id: item.id, name: item.name, batchId: item.batchId, quantity: item.quantity })));
                
                return (
                  <KotCardKitchen
                    key={kot.id}
                    kotId={kot.id}
                    createdAt={kot.createdAt}
                    serviceType={kot.serviceType}
                    tableName={kot.tableName}
                    customerName={kot.customerName}
                    scheduledTime={kot.scheduledTime}
                    items={kotItems}
                    onMarkReady={(itemId) => handleItemStatusChange(itemId)}
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