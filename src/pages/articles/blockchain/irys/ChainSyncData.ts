export const SYNC_STATE_CODE = `pub struct ChainSyncState {
    is_syncing: Arc<AtomicBool>,            // 동기화 중 여부
    syncing_from: Arc<AtomicUsize>,         // 시작 높이
    sync_target_height: Arc<AtomicUsize>,   // 대상 높이
    highest_processed_block: Arc<AtomicUsize>, // 처리 완료 높이
    is_trusted_sync: Arc<AtomicBool>,       // 신뢰 피어 동기화 여부
    gossip_reception_enabled: Arc<AtomicBool>, // 가십 수신 활성화
    gossip_broadcast_enabled: Arc<AtomicBool>, // 가십 전파 활성화
}`;

export const SYNC_STATE_ANNOTATIONS = [
  { lines: [2, 5] as [number, number], color: 'sky' as const, note: '동기화 진행 상태 추적' },
  { lines: [6, 8] as [number, number], color: 'emerald' as const, note: '가십 제어 플래그' },
];

export const BATCH_SYNC_CODE = `const BLOCK_BATCH_SIZE: usize = 10;

async fn sync_chain(sync_state: ChainSyncState, api_client: impl ApiClient,
    peer_list: &PeerList, mut start_height: usize) {
    // 1. 블록 인덱스 가져오기 (피어에서 해시 목록 수신)
    let block_index = get_block_index(
        peer_list, &api_client,
        sync_state.sync_target_height(), BLOCK_BATCH_SIZE, 5,
        fetch_index_from_trusted_peer,
    ).await?;

    let mut block_queue = VecDeque::new();
    block_queue.extend(block_index);

    // 2. 블록 큐 순차 처리
    while let Some(block) = block_queue.pop_front() {
        if sync_state.is_queue_full() {
            sync_state.wait_for_an_empty_queue_slot().await?;
        }
        // 비동기 블록 요청 + 처리
        data_handler.pull_and_process_block(block.block_hash,
            sync_state.is_syncing_from_a_trusted_peer()).await;
    }

    sync_state.wait_for_processed_block_to_reach_target().await;
    sync_state.finish_sync();
}`;

export const BATCH_SYNC_ANNOTATIONS = [
  { lines: [6, 10] as [number, number], color: 'sky' as const, note: '피어에서 블록 인덱스 수신' },
  { lines: [16, 22] as [number, number], color: 'emerald' as const, note: '큐 기반 순차 블록 처리' },
  { lines: [25, 26] as [number, number], color: 'amber' as const, note: '동기화 완료 대기' },
];

export const NODE_MODE_CODE = `// 노드 동기화 모드
// Genesis: 새 네트워크 시작 (블록 없으면 즉시 완료)
// PeerSync: 일반 피어에서 동기화
// TrustedPeerSync: 신뢰 피어에서만 동기화

if matches!(node_mode, NodeMode::Genesis) && sync_target <= 1 {
    sync_state.finish_sync(); // 즉시 완료
}
if matches!(node_mode, NodeMode::TrustedPeerSync) {
    sync_state.set_trusted_sync(true);
    let trusted = peer_list.trusted_peers();
    if trusted.is_empty() {
        return Err(ChainSyncError::Network("No trusted peers"));
    }
}`;

export const NODE_MODE_ANNOTATIONS = [
  { lines: [6, 8] as [number, number], color: 'sky' as const, note: 'Genesis 모드: 즉시 완료' },
  { lines: [9, 14] as [number, number], color: 'emerald' as const, note: 'TrustedPeerSync: 신뢰 피어 전용' },
];
