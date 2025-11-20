import { onMounted, onBeforeUnmount } from 'vue';
import { useEcho } from '@/services/echo'
import { useAuthStore } from '@/stores/authStore.ts'
import { useTransactionStore } from '@/stores/transactionStore.ts'

export function useMoneyTransferChannel() {
  const authStore = useAuthStore();
  const transactionStore = useTransactionStore();
  const echo = useEcho();

  onMounted(() => {
    const userId = authStore.getAuthUser?.id;
    if (!userId) {
      console.warn('No auth user, cannot subscribe to private channel');
      return;
    }

    // Echo.private('user.1') → Pusher channel "private-user.1"
    const channel = echo.private(`user.${userId}`);

    // Note the dot "." before the event name because of broadcastAs()
    channel.listen('.money.transfer.success', async (e: never) => {
      await authStore.fetchUserData()
      if (typeof transactionStore.getPagination?.page !== 'undefined') {
        await transactionStore.fetchTransactions(transactionStore.getPagination.page)
      } else {
        await transactionStore.fetchTransactions(1)
      }
    });
  });

  onBeforeUnmount(() => {
    const userId = authStore.getAuthUser?.id;
    if (!userId) return;

    // This unsubscribes from private-user.{id}
    echo.leave(`user.${userId}`);
  });
}
