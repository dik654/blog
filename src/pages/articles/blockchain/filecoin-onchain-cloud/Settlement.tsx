import type { CodeRef } from '@/components/code/types';

export default function Settlement({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="settlement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 정산 &amp; 사용량 과금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          FVM 스마트 컨트랙트로 사용량 기반 과금을 자동화.<br />
          클라이언트가 FIL을 예치 → SP가 서비스 → 주기적으로 자동 정산. 컨트랙트 코드가 곧 SLA
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">On-chain Settlement 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Onchain Settlement:

// Smart Contract Model:
// contract StorageDeal {
//     client: address
//     provider: address
//     price: uint256 per GiB per epoch
//     deposit: uint256
//     start_epoch: uint256
//     end_epoch: uint256
//     sla: SLATerms
//
//     function pullPayment(uint256 epoch) {
//         require(pdpProofSubmitted(epoch));
//         uint256 amount = calculatePayment(epoch);
//         provider.transfer(amount);
//     }
// }

// Payment Flow:
// 1. Client deposits FIL to contract
// 2. SP stores data + generates PDP proofs
// 3. Contract verifies proof validity
// 4. Auto-release payment per epoch
// 5. End of term: final settlement

// SLA Enforcement:
// - uptime: 99.9% guaranteed
// - response time: < 100ms p95
// - retrievability: 99.99%
// - PDP success rate: 100%

// Automatic Penalties:
// if (pdp_missed):
//     penalty = 10 × price_per_epoch
//     transfer(penalty, client)
// if (retrieval_slow):
//     reduce_payment(10%)
// if (unavailable):
//     terminate_contract()
//     refund(client)

// Metering:
// - storage: epochs × GiB
// - retrieval: GiB served
// - operations: API calls
// - on-chain tracked

// Batching:
// - multiple deals per SP
// - batched settlements
// - gas efficiency
// - periodic sweeps

// FVM Execution:
// - Solidity/WASM contracts
// - FVM runtime
// - EVM compatible
// - deterministic

// Dispute Resolution:
// - on-chain PDP proofs are final
// - SP proves storage
// - client can challenge
// - arbitration via governance

// Cost Components:
// - storage price (hot)
// - retrieval price (per GiB out)
// - operation fees
// - penalties / rewards

// Example economics:
// - store 1 TiB for 1 year
// - $6/TiB/month hot
// - $72/year total
// - escrowed upfront
// - released per epoch (30s)`}
        </pre>
        <p className="leading-7">
          Settlement: <strong>FVM smart contracts + automatic SLA enforcement</strong>.<br />
          PDP success → auto-release payment, miss → penalty.<br />
          "code is the SLA" — trustless execution.
        </p>
      </div>
    </section>
  );
}
