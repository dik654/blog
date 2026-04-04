// ExEx 예제 — 블록 이벤트를 수신하여 커스텀 인덱싱

/// ExEx 엔트리포인트 — install_exex()로 노드에 등록
pub async fn my_indexer(mut ctx: ExExContext<impl FullNodeComponents>)
    -> eyre::Result<()>
{
    // 알림 스트림에서 이벤트 수신
    while let Some(notification) = ctx.notifications.recv().await {
        match &notification {
            ExExNotification::ChainCommitted { new } => {
                // 새 블록의 트랜잭션/로그를 인덱싱
                for block in new.blocks().values() {
                    for tx in &block.body.transactions {
                        index_transaction(tx).await?;
                    }
                    for log in block.receipts.iter().flat_map(|r| &r.logs) {
                        index_log(log).await?;
                    }
                }
            }
            ExExNotification::ChainReverted { old } => {
                // 리오그 시 인덱스에서 제거
                revert_blocks(old.blocks().keys()).await?;
            }
            _ => {}
        }
        // 처리 완료 시그널 → ExExManager가 프루닝 가능
        ctx.events.send(ExExEvent::FinishedHeight(
            notification.committed_chain().map(|c| c.tip().number)
                .unwrap_or_default()
        ))?;
    }
    Ok(())
}
