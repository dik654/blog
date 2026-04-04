import type { CodeRef } from '@/components/code/types';
import evidenceGo from './codebase/cometbft/types/evidence.go?raw';
import txGo from './codebase/cometbft/types/tx.go?raw';

export const evidenceRefs: Record<string, CodeRef> = {
  'evidence-struct': {
    path: 'types/evidence.go', code: evidenceGo, lang: 'go', highlight: [10, 21],
    desc: 'DuplicateVoteEvidence — 이중 투표 증거',
    annotations: [
      { lines: [11, 12], color: 'sky', note: 'VoteA, VoteB: 같은 H/R에서 서로 다른 블록에 투표' },
      { lines: [15, 17], color: 'emerald', note: 'ABCI 정보: TotalVotingPower, ValidatorPower, Timestamp' },
    ],
  },
  'evidence-verify': {
    path: 'types/evidence.go', code: evidenceGo, lang: 'go', highlight: [37, 47],
    desc: 'Verify() — 같은 H/R/Type에서 다른 BlockID인지 확인',
    annotations: [
      { lines: [38, 41], color: 'sky', note: 'Height, Round, Type이 동일한지 확인' },
      { lines: [43, 45], color: 'emerald', note: 'BlockID가 다르면 유효한 비잔틴 증거' },
    ],
  },
  'tx-hash': {
    path: 'types/tx.go', code: txGo, lang: 'go', highlight: [11, 30],
    desc: 'Tx.Hash() + Txs.Hash() — SHA256 → Merkle root',
    annotations: [
      { lines: [12, 12], color: 'sky', note: 'Tx = []byte (앱이 해석 결정)' },
      { lines: [15, 17], color: 'emerald', note: 'Tx.Hash() = SHA256 해시' },
      { lines: [24, 28], color: 'amber', note: 'Txs.Hash() = 각 TX 해시 → Merkle root' },
    ],
  },
};
