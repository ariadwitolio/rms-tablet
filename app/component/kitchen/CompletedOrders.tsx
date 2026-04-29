import { ScrollArea } from '../ui/scroll-area';
import { useRestaurant } from '../../context/RestaurantContext';
import { getTimeSince } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';
import KotCardKitchen from './KotCardKitchen';
import { EmptyState } from '../ui/EmptyState';

export default function CompletedOrders() {
  const { kots, items, updateItem, updateKOT } = useRestaurant();
  const snackbar = useSnackbar();

  // Filter only KITCHEN station tickets that are completed
  const completedKOTs = kots.filter(
    kot => kot.station === 'KITCHEN' && kot.status === 'COMPLETED'
  );

  // Revert a completed KOT back to the active queue:
  // - Reset KOT status → PENDING
  // - Reset every non-voided item → SENT
  const handleRevertKOT = (kotId: string) => {
    const kot = kots.find(k => k.id === kotId);
    if (!kot) return;

    const kotItems = items.filter(item => kot.itemIds.includes(item.id));
    kotItems.forEach(item => {
      if (item.status !== 'VOIDED') {
        updateItem(item.id, { status: 'SENT' });
      }
    });

    updateKOT(kotId, { status: 'PENDING' });
    snackbar.success('KOT moved back to Active Queue');
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {completedKOTs.length === 0 ? (
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
              {completedKOTs.map(kot => {
                const kotItems = items.filter(item => kot.itemIds.includes(item.id));

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
                    completed
                    onRevertKOT={() => handleRevertKOT(kot.id)}
                    // These are no-ops in completed mode but required by the interface
                    onMarkReady={() => {}}
                    onRevert={() => {}}
                    onMarkCompleted={() => {}}
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
