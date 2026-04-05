import { codeRefs } from './codeRefs';
import NonceViz from './viz/NonceViz';
import type { CodeRef } from '@/components/code/types';

export default function NonceManagement({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="nonce-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nonce 관리</h2>
      <div className="not-prose mb-8">
        <NonceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} 마이너의 Nonce 부담</strong> — WindowPoSt, PreCommit 등 대량 메시지 발송
          <br />
          MpoolPushMessage가 자동 nonce 할당으로 갭 방지
        </p>

        {/* ── Nonce Management ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Nonce Management 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Nonce Management (chain/messagepool):

// Nonce concept:
// - 각 address는 nonce 카운터 소유
// - 0부터 시작, message 추가 시 +1
// - on-chain state의 일부
// - replay attack 방어

// Nonce rules:
// 1. Strict ordering:
//    nonce 0, 1, 2, 3... 순서
//    gap 불가 (nonce 3 전에 2 필요)
//
// 2. No duplicates:
//    같은 nonce 중복 제출 불가
//    (same nonce + different content → replacement)
//
// 3. Replacement:
//    25% higher GasPremium 필요
//    또는 25% higher GasFeeCap

// MpoolPushMessage:
// - auto-nonce 할당
// - 현재 nonce 조회 → pool + chain
// - next available nonce 사용
// - 동시 push 지원

// Miner use case (massive messages):
// - WindowPoSt: 매 24h, 수십 partitions
// - PreCommit: 매 sector (batch)
// - ProveCommit: 매 sector (batch)
// - TerminateSectors: fault handling
// - 초당 수십 messages 가능

// Batching optimization:
// - PreCommitBatch: multiple sectors one msg
// - ProveCommitAggregate: SNARK aggregation
// - WindowPoSt: per-partition batching
// - gas 효율 대폭 향상

// Nonce gap issue:
// - message lost in transit?
// - nonce 3 보냈는데 4 먼저 on-chain?
// - 4는 pending, 3는 어디에?
//
// Solution:
// - resend nonce 3
// - or explicitly send nonce N with higher premium
// - auto-retry in pool

// Replacement transaction:
// MpoolPush with same nonce:
// - if new_premium >= old_premium * 1.25:
//     replace old with new
// - else reject

// Pool cleanup:
// - chain tipset가 바뀔 때
// - included messages removed
// - expired messages removed (old sender nonce)
// - orphaned (nonce gap) moved to stash

// Stash:
// - messages with future nonce
// - held until gap filled
// - auto-promote when possible
// - time-based expiration`}
        </pre>
        <p className="leading-7">
          Nonce: <strong>strict ordering + no gaps + replacement 25% fee bump</strong>.<br />
          miner batching (PreCommitBatch, ProveCommitAggregate) gas 절약.<br />
          MpoolPushMessage가 auto-nonce + retry 관리.
        </p>
      </div>
    </section>
  );
}
