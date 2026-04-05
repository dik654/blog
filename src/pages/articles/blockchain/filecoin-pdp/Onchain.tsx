import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Onchain({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="onchain" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 검증 &amp; 스케줄링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PDP Actor가 DRAND 비콘으로 챌린지 에폭을 결정. SP가 SubmitProof 메시지로 제출.<br />
          SHA256 재계산 → 머클 루트 복원 → 등록 루트와 대조. 가스 비용이 낮음
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">VerifyOnChain()</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Actor 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PDP Actor (FVM smart contract):

// State:
// - datasets: dataset_id → Merkle root
// - proving_obligations: SP → datasets
// - penalty_accumulators
// - challenge schedules

// Methods:
// 1. RegisterDataset(root, sla)
//    - SP commits to prove data
//    - stake collateral
// 2. SubmitProof(dataset_id, proof)
//    - verify on-chain
//    - reward or slash
// 3. Challenge(dataset_id)
//    - force SP to prove
// 4. Terminate(dataset_id)
//    - end obligation
//    - return remaining stake

// Verification (Solidity/FVM):
// function verifyProof(proof) {
//     bytes32 leafHash = sha256(proof.leafData);
//     require(leafHash == proof.leafHash);
//
//     bytes32 computed = proof.leafHash;
//     for (uint i = 0; i < proof.path.length; i++) {
//         if (bit_i(offset) == 0)
//             computed = sha256(computed, proof.path[i]);
//         else
//             computed = sha256(proof.path[i], computed);
//     }
//     require(computed == datasets[id].root);
// }

// Economic:
// - SP stake: N FIL per TiB
// - reward: price × time
// - slash on failure
// - incentive aligned

// Batching:
// - multiple proofs in one tx
// - gas amortization
// - SP efficiency

// Integration:
// - Storacha: first user
// - Onchain Cloud: platform
// - 2024 launch`}
        </pre>
        <p className="leading-7">
          PDP Actor: <strong>FVM smart contract + reward/slash</strong>.<br />
          on-chain verify (Solidity/FVM), DRAND challenges.<br />
          Storacha first adopter, Onchain Cloud integrated.
        </p>
      </div>
    </section>
  );
}
