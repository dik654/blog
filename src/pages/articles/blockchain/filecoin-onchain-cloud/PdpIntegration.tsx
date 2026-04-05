import type { CodeRef } from '@/components/code/types';

export default function PdpIntegration({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="pdp-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PDP 기반 검증 가능 스토리지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SP가 핫 데이터를 PDP로 주기적으로 증명. 봉인 없이 원본 그대로 저장.<br />
          증명 실패 시 자동 패널티 → SP 담보에서 클라이언트에게 보상 지급
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Integration Flow</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PDP Integration (Onchain Cloud):

// Client Journey:
// 1. Upload data to SP
// 2. SP registers Merkle root on-chain
// 3. Client funds escrow contract
// 4. Ongoing: PDP proofs every epoch
// 5. Auto-payment based on proofs
// 6. Client retrieves data anytime

// SP Journey:
// 1. Receive data from client
// 2. Calculate Merkle tree
// 3. Register with PDP contract
// 4. Stake collateral
// 5. Generate periodic PDP proofs
// 6. Submit proofs on-chain
// 7. Earn FIL per epoch

// Verification Flow:
// 1. DRAND beacon → random challenge
// 2. SP reads 160 bytes at offset
// 3. Generates Merkle proof
// 4. Submits to on-chain actor
// 5. Contract verifies (SHA256 x ~20)
// 6. If valid: release epoch payment
// 7. If invalid: slash collateral

// Economic Model:
// SP rewards per epoch:
//   reward = price × data_size × duration
//   condition: valid PDP proof
//
// SP penalties:
//   penalty = N × reward
//   condition: missed/invalid proof
//
// Client refunds:
//   if SP fails:
//     refund = unused_escrow + penalty_transfer
//     contract returns funds

// Benefits:
// - trustless verification
// - automated payment
// - no intermediary
// - transparent pricing
// - SLA in code

// vs. centralized (S3):
// - trust Amazon to keep data
// - no cryptographic proof
// - centralized billing
// - terms subject to change
// - censorship possible

// vs. decentralized + no proofs:
// - Saturn (2022-2023)
// - can't verify SP behavior
// - no economic accountability
// - abuse potential

// PDP = sweet spot:
// - decentralized + verifiable
// - lightweight proofs
// - production-ready
// - enterprise-grade`}
        </pre>
        <p className="leading-7">
          PDP Integration: <strong>upload → proofs → auto-payment → retrieval</strong>.<br />
          trustless verification + automated SLA enforcement.<br />
          "decentralized + verifiable" sweet spot.
        </p>
      </div>
    </section>
  );
}
