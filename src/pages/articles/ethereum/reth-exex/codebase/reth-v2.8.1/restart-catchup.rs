// Source excerpt: Reth v2.8.1
// crates/exex/exex/src/notifications.rs

fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>)
    -> Poll<Option<eyre::Result<ExExNotification<N>>>>
{
    // 1. 저장해 둔 ExEx head가 아직 canonical인지 확인합니다.
    if self.pending_check_canonical {
        if let Some(inverse) = self.check_canonical()? {
            return Poll::Ready(Some(Ok(inverse)));
        }
        self.pending_check_canonical = false;
    }

    // 2. ExEx head가 node head보다 뒤면 빠진 범위를 backfill합니다.
    if self.pending_check_backfill {
        self.check_backfill()?;
        self.pending_check_backfill = false;
    }

    // 3. Backfill 중에도 live channel을 비우며 이후 구간과 reorg를 보관합니다.
    while let Poll::Ready(Some(notification)) = self.notifications.poll_recv(cx) {
        if notification.reverted_chain().is_some() ||
            notification.is_beyond_backfill_range()
        {
            self.pending_notifications.push_back(notification);
        }
    }

    // 4. Backfill을 끝낸 뒤 보관한 live notification을 순서대로 전달합니다.
    if let Some(notification) = self.pending_notifications.pop_front() {
        return Poll::Ready(Some(Ok(notification)));
    }

    self.poll_regular_notification(cx)
}
