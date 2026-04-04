import type { CodeRef } from '@/components/code/types';

export const codeRefsExec: Record<string, CodeRef> = {
  'sol-turbine-shred': {
    path: 'ledger/src/shred.rs',
    code: `/// Turbine shred 생성 — ~1280B 패킷 분할
pub fn entries_to_shreds(
    entries: &[Entry],
    slot: Slot,
    parent_slot: Slot,
    is_last_in_slot: bool,
) -> Vec<Shred> {
    let data = bincode::serialize(&entries)?;
    let (data_shreds, coding_shreds) =
        Shredder::new(slot, parent_slot)
            .entries_to_shreds(&data, is_last_in_slot);
    [data_shreds, coding_shreds].concat()
}`,
    lang: 'rust',
    highlight: [1, 13],
    desc: '블록 → shred 분할 + Reed-Solomon erasure coding.',
    annotations: [
      { lines: [2, 7], color: 'sky', note: 'entries → shred 변환' },
      { lines: [9, 11], color: 'emerald', note: 'Reed-Solomon' },
    ],
  },
  'sol-gulf-forward': {
    path: 'core/src/banking_stage/forwarder.rs',
    code: `/// Gulf Stream — TX를 다음 리더에게 포워딩
pub fn forward_packets(
    &self,
    unprocessed: &UnprocessedPacketBatches,
) -> ForwardResult {
    let next_leader = self
        .leader_schedule_cache
        .slot_leader_at(current_slot + 1)?;
    self.connection_cache
        .send_data(&next_leader, &packets)?;
    Ok(())
}`,
    lang: 'rust',
    highlight: [1, 12],
    desc: 'Gulf Stream: 다음 리더 예측 → TX 직접 전달.',
    annotations: [
      { lines: [6, 8], color: 'sky', note: '리더 스케줄 예측' },
      { lines: [9, 10], color: 'emerald', note: 'UDP/QUIC 전달' },
    ],
  },
  'sol-sealevel-exec': {
    path: 'runtime/src/bank.rs',
    code: `/// Sealevel 병렬 실행
pub fn process_transactions(
    &self,
    txs: &[SanitizedTransaction],
) -> Vec<TransactionResult> {
    let lock_results = self.lock_accounts(txs);
    let results = self.execute_batch(
        &locked_transactions,
        MAX_PROCESSING_AGE,
    );
    self.unlock_accounts(txs);
    results
}`,
    lang: 'rust',
    highlight: [1, 13],
    desc: 'Sealevel: 계정 R/W 락 → 병렬 실행 → 락 해제.',
    annotations: [
      { lines: [6, 6], color: 'sky', note: '계정 락 획득' },
      { lines: [7, 10], color: 'emerald', note: '병렬 실행' },
      { lines: [11, 11], color: 'amber', note: '락 해제' },
    ],
  },
  'sol-tpu-pipeline': {
    path: 'core/src/tpu.rs',
    code: `/// TPU 4단계 파이프라인
pub fn new(/* ... */) -> Self {
    let fetch = FetchStage::new(sockets, exit.clone());
    let sigverify = SigVerifyStage::new(packet_rx);
    let banking = BankingStage::new(&bank_forks, &poh);
    let broadcast = BroadcastStage::new(cluster_info);
    Self { fetch, sigverify, banking, broadcast }
}`,
    lang: 'rust',
    highlight: [1, 9],
    desc: 'TPU: Fetch → SigVerify → Banking → Broadcast.',
    annotations: [
      { lines: [3, 3], color: 'sky', note: 'FetchStage' },
      { lines: [4, 4], color: 'emerald', note: 'SigVerifyStage' },
      { lines: [5, 5], color: 'amber', note: 'BankingStage' },
      { lines: [6, 6], color: 'violet', note: 'BroadcastStage' },
    ],
  },
};
