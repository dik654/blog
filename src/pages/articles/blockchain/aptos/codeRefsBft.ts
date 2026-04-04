import type { CodeRef } from '@/components/code/types';

export const codeRefsBft: Record<string, CodeRef> = {
  'apt-move-abilities': {
    path: 'aptos-move/framework/sources/coin.move',
    code: `/// Move Coin 구조체
struct Coin<phantom CoinType> has store {
    value: u64,
}
public fun transfer<CoinType>(
    from: &signer, to: address, amount: u64,
) acquires CoinStore {
    let coins = withdraw<CoinType>(from, amount);
    deposit<CoinType>(to, coins);
    // coins는 deposit에서 소비 — linear type
}`,
    lang: 'rust',
    highlight: [1, 11],
    desc: 'Move Coin: copy/drop 없음 → 복사/소멸 불가.',
    annotations: [
      { lines: [2, 3], color: 'sky', note: 'has store (copy/drop 없음)' },
      { lines: [5, 9], color: 'emerald', note: 'withdraw → deposit = 이동' },
    ],
  },
  'apt-diembft-pipeline': {
    path: 'consensus/src/round_manager.rs',
    code: `/// DiemBFT v4 — 3-chain 합의
pub async fn process_proposal(
    &mut self, proposal: Block,
) -> Result<()> {
    let vote = self.safety_rules
        .construct_and_sign_vote(&proposal)?;
    self.broadcast_vote(vote).await?;
    if let Some(commit) = self.commit_rule
        .check_commit(&proposal.quorum_cert())
    {
        self.commit_block(commit).await?;
    }
    Ok(())
}`,
    lang: 'rust',
    highlight: [1, 14],
    desc: 'DiemBFT: 3-chain commit rule + 투표.',
    annotations: [
      { lines: [5, 6], color: 'sky', note: 'SafetyRules: 투표 서명' },
      { lines: [7, 7], color: 'emerald', note: '2f+1 → QC' },
      { lines: [8, 11], color: 'amber', note: '3-chain → 커밋' },
    ],
  },
  'apt-leader-reputation': {
    path: 'consensus/src/liveness/leader_reputation.rs',
    code: `/// 리더 평판 기반 선출
pub fn get_valid_proposer(
    &self, round: Round,
) -> Author {
    let candidates: Vec<(Author, u64)> = self
        .validators.iter()
        .map(|v| {
            let score = self.compute_reputation(v);
            (v.author, score)
        })
        .collect();
    weighted_random(&candidates, round)
}`,
    lang: 'rust',
    highlight: [1, 13],
    desc: '리더 평판: 성능 기반 가중치로 장애 리더 교체.',
    annotations: [
      { lines: [5, 9], color: 'sky', note: 'score = 성능 함수' },
      { lines: [12, 12], color: 'emerald', note: '가중 랜덤 선출' },
    ],
  },
};
