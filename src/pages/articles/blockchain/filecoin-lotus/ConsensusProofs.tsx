import ValidateBlockViz from './viz/ValidateBlockViz';
import WeightViz from './viz/WeightViz';
import ConsensusProofFlowViz from './viz/ConsensusProofFlowViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ConsensusProofs({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="consensus-proofs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 &amp; 저장 증명</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          Lotus 합의 흐름: <strong>VRF 선출 → ValidateBlock → 체인 확정</strong>.<br />
          Expected Consensus (EC) + 저장 증명 (PoRep/PoSt)의 통합.<br />
          storage power 비례 block 생성 확률.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">합의 + 증명 흐름</h3>
      <ConsensusProofFlowViz />

      <h3 className="text-lg font-semibold mt-8 mb-3">ValidateBlock() — 블록 검증 6단계</h3>
      <ValidateBlockViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">Weight() — 체인 가중치 계산</h3>
      <WeightViz onOpenCode={openCode} />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Expected Consensus ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Expected Consensus (EC) 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Expected Consensus (EC):
//
// 설계 원리:
// - storage power 비례 leader election
// - VRF (Verifiable Random Function) 기반
// - DRAND randomness beacon 통합
// - tipset (여러 blocks) per epoch
// - probabilistic finality

// Epoch 구조:
// - 30초 per epoch
// - each epoch: expected 5 winners (~)
// - winning miners produce blocks
// - blocks grouped into tipset

// Leader Election (Sortition):
// 1. miner computes VRF output:
//    VRF(secret_key, epoch, ticket) → random value
// 2. check threshold:
//    if random_value / MAX < miner.storage_power / total_power:
//        → this miner wins!
// 3. independent decision (no coordination)
// 4. multiple winners possible per epoch

// Poisson distribution:
// E[winners] = 5 per epoch (tunable)
// P(n winners) = e^(-λ) * λ^n / n!
// - P(0) = 0.67%
// - P(5) = 17.5%
// - P(10) = 1.8%

// Tipset:
// - 같은 epoch의 모든 winning blocks
// - 공통 parents (같은 이전 tipset)
// - 모두 valid면 tipset formed
// - 여러 blocks per epoch → throughput up

// Chain Weight:
// chain_weight(T) = parent_weight + w_epoch
// w_epoch = log2(network_power) * (#blocks in T * wR + wP)
// where:
// - wR: reward weight
// - wP: producer weight
// - log scaling: large power increases less

// Finality:
// - 900 epochs = ~7.5h
// - probabilistic (like Bitcoin)
// - F3 adds fast finality (2024+)`}
        </pre>
        <p className="leading-7">
          EC = <strong>Poisson Sortition + VRF + Tipset</strong>.<br />
          epoch당 ~5 winners, storage power 비례.<br />
          probabilistic finality 7.5h, F3로 가속 가능.
        </p>

        {/* ── PoRep & PoSt ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep &amp; PoSt 저장 증명</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2가지 저장 증명:

// PoRep (Proof of Replication):
// - 목적: "unique physical storage 보유 증명"
// - sealing 과정에서 생성
// - 4-phase: PC1 → PC2 → C1 → C2
// - 한 번만 생성 (sector 초기화)
// - Stacked DRG (Depth-Robust Graph)
// - SNARK로 압축 (Groth16)

// PC1 (PreCommit Phase 1):
// - Original data → Stacked DRG
// - 11 layers of computation
// - ~2-4 hours (CPU intensive)
// - per sector: 32 GiB data → ~352 GiB intermediate

// PC2 (PreCommit Phase 2):
// - Merkle tree 생성
// - column commitments
// - ~30 min (GPU acceleration)
// - tree C generation

// C1 (Commit Phase 1):
// - VDF challenge
// - random leaf selection
// - Merkle proof generation
// - <1 min

// C2 (Commit Phase 2):
// - SNARK proof generation (Groth16)
// - GPU acceleration (CUDA/OpenCL)
// - ~30-90 min
// - ~10 MB proof → ~200 bytes after SNARK

// PoSt (Proof of Spacetime):
// - 목적: "지속적 저장 증명"
// - sealed sectors 대상
// - 정기 제출 (24h마다 WindowPoSt)
// - Leader election time (WinningPoSt)

// WindowPoSt:
// - 24 hour window
// - 2880 epochs
// - each window: challenge random sectors
// - Merkle proofs + SNARK
// - miss → penalty

// WinningPoSt:
// - leader election 시 즉시 생성
// - tight deadline (~40s)
// - 1 sector sampled
// - quick proof

// 경제:
// - FIL+: reward × 10 for verified deals
// - slashing: faulty sectors
// - initial pledge: stake per sector`}
        </pre>
        <p className="leading-7">
          PoRep: <strong>sealing 증명 (4-phase)</strong>, 1회 생성.<br />
          PoSt: <strong>지속 저장 증명</strong>, 정기 제출.<br />
          Groth16 SNARK로 compressed, GPU 가속.
        </p>

        {/* ── Chain Weight 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Chain Weight 계산 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Chain Weight Function:
//
// w(chain) = Σ w_epoch for all epochs in chain
//
// w_epoch = w_function(
//     network_power_at_epoch,
//     num_winning_blocks_in_tipset,
//     W_RATIO_NUM / W_RATIO_DEN
// )
//
// where:
// W_RATIO_NUM = 1
// W_RATIO_DEN = 2
// wForce = floor(log2(network_power))
// wFunction = 256 * wForce
//            + wForce * num_blocks * W_RATIO_NUM * 256 / expectedLeadersPerEpoch / W_RATIO_DEN

// 예시:
// network_power = 2^60 bytes (1 ExaByte)
// wForce = 60
// base = 60 * 256 = 15360
// per block: 60 * 1 * 256 / 5 / 2 = 1536
// 1 tipset with 5 blocks: 15360 + 5 * 1536 = 23040

// Why log2(network_power)?
// - linear scaling 부적합 (large chains 공격)
// - log scaling → 모든 validator 참여 incentive
// - storage power 의미 유지

// Fork Choice:
// - heaviest chain wins
// - weight is deterministic
// - reorg: 더 무거운 체인 발견 시

// Bitcoin 비교:
// Bitcoin: chain work (sum of difficulty)
// Filecoin: tipset weight (log scaled)
// 둘 다 heaviest wins

// Tipset advantage:
// - 1 epoch에 여러 blocks 가능
// - 각 block이 다른 TXs
// - TX throughput 증가
// - single leader bottleneck 회피`}
        </pre>
        <p className="leading-7">
          Chain Weight: <strong>log2(network_power) × blocks</strong>.<br />
          log scaling으로 fork 공격 방지.<br />
          heaviest chain wins (Bitcoin과 유사).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 tipset 구조인가</strong> — throughput + fairness.<br />
          single leader → bottleneck + censorship 가능.<br />
          multiple leaders per epoch → throughput + 다양성.<br />
          Poisson sortition으로 각 epoch 5+ 승자 → 공정 분배.
        </p>
      </div>
    </section>
  );
}
