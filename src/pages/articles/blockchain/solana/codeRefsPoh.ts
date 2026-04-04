import type { CodeRef } from '@/components/code/types';

export const codeRefsPoh: Record<string, CodeRef> = {
  'sol-poh-tick': {
    path: 'validator/src/poh_service.rs',
    code: `/// PoH 해시 체인 생성 — 연속 SHA-256
pub fn tick(&mut self) {
    // hash = SHA256(hash)  — "시간의 틱"
    self.hash = hashv(&[self.hash.as_ref()]);
    self.num_hashes += 1;
    self.tick_height += 1;
}`,
    lang: 'rust',
    highlight: [1, 7],
    desc: 'PoH 서비스의 tick 함수. SHA-256 반복 해싱으로 시간 증명 생성.',
    annotations: [
      { lines: [3, 4], color: 'sky', note: 'SHA-256 해시 체인 = 시계' },
      { lines: [5, 6], color: 'emerald', note: '틱 높이/해시 카운트 증가' },
    ],
  },
  'sol-poh-record': {
    path: 'validator/src/poh_recorder.rs',
    code: `/// TX를 PoH에 삽입 — 시간 순서 증명
pub fn record(
    &mut self,
    mixin: Hash, // SHA256(tx_data)
    transactions: Vec<Transaction>,
) -> Result<()> {
    // hash = SHA256(prev_hash || mixin)
    // → TX가 이 시점에 존재했음을 증명
    self.poh.record(mixin)?;
    self.sender.send(WorkingBankEntry {
        bank: self.working_bank.clone(),
        entries: vec![Entry { hash, transactions }],
    })
}`,
    lang: 'rust',
    highlight: [1, 14],
    desc: 'TX 데이터를 PoH 해시 체인에 삽입.',
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'mixin = SHA256(tx_data)' },
      { lines: [7, 9], color: 'emerald', note: '해시 체인에 TX 삽입' },
      { lines: [10, 13], color: 'amber', note: 'BankingStage로 전달' },
    ],
  },
  'sol-tower-vote': {
    path: 'programs/vote/src/vote_state.rs',
    code: `/// Tower BFT 투표 처리
pub fn process_vote(
    vote_state: &mut VoteState,
    vote: &Vote,
    slot_hashes: &[SlotHash],
) -> Result<()> {
    for lockout in &mut vote_state.votes {
        lockout.confirmation_count += 1;
    }
    vote_state.root_slot =
        pop_expired_votes(vote_state);
    vote_state.votes.push_back(Lockout {
        slot: vote.slot,
        confirmation_count: 1,
    });
    Ok(())
}`,
    lang: 'rust',
    highlight: [1, 17],
    desc: 'Tower BFT 투표. conf 증가 → 2^n 락아웃 → 32=rooted.',
    annotations: [
      { lines: [7, 8], color: 'sky', note: 'conf 증가 = 락아웃 2배' },
      { lines: [10, 11], color: 'emerald', note: 'MAX_LOCKOUT → rooted' },
      { lines: [12, 15], color: 'amber', note: '새 투표 추가' },
    ],
  },
};
