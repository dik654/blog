// Source excerpt: Reth v2.8.1
// crates/exex/exex/src/context.rs + manager.rs

// Context contract:
// Once an ExExNotification is sent over the channel,
// it is considered delivered by the node.
pub notifications: ExExNotifications<Node::Provider, Node::Evm>,

// Manager의 기본 내부 notification buffer입니다.
pub const DEFAULT_EXEX_MANAGER_CAPACITY: usize = 1024;

pub fn new(/* ... */) -> (Self, /* ... */) {
    // 각 ExEx로 가는 channel은 한 notification만 담습니다.
    let (notification_tx, notification_rx) = mpsc::channel(1);
    // ...
}

fn send(&mut self, cx: &mut Context<'_>, item: &NotificationItem)
    -> Poll<Result<(), PollSendError<ExExNotification<N>>>>
{
    // 이미 끝낸 단순 commit은 건너뛸 수 있습니다.
    // Reorg와 revert는 finished height 아래여도 항상 보냅니다.
    if self.can_skip_finished_commit(item) {
        self.next_notification_id = item.id + 1;
        return Poll::Ready(Ok(()));
    }

    ready!(self.sender.poll_reserve(cx))?;
    self.sender.send_item(item.notification.clone())?;
    self.next_notification_id = item.id + 1;
    Poll::Ready(Ok(()))
}

// Manager buffer에서는 모든 ExEx에 보낸 항목만 제거합니다.
self.buffer.retain(|&(id, _)| id >= min_next_notification_id);
self.update_capacity();
