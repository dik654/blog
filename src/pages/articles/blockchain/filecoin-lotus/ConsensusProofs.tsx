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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">설계 원리</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Storage power 비례 leader election</li>
              <li>VRF (Verifiable Random Function) 기반</li>
              <li>DRAND randomness beacon 통합</li>
              <li>Tipset (여러 blocks) per epoch</li>
              <li>Probabilistic finality</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Leader Election (Sortition)</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code className="text-xs">VRF(secret_key, epoch, ticket)</code> → random value</li>
              <li><code className="text-xs">random_value / MAX &lt; storage_power / total_power</code> → 당선</li>
              <li>독립 결정 (coordination 불필요)</li>
              <li>epoch당 복수 winner 가능</li>
            </ol>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Poisson 분포 (E[winners]=5)</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div className="flex justify-between"><span>P(0 winners)</span><strong>0.67%</strong></div>
              <div className="flex justify-between"><span>P(5 winners)</span><strong>17.5%</strong></div>
              <div className="flex justify-between"><span>P(10 winners)</span><strong>1.8%</strong></div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Tipset</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>같은 epoch의 모든 winning blocks</li>
              <li>공통 parents (같은 이전 tipset)</li>
              <li>모두 valid면 tipset 형성</li>
              <li>여러 blocks → throughput 증가</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Chain Weight & Finality</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">w_epoch = log2(power) * (blocks * wR + wP)</code></li>
              <li>log scaling: large power 증가 억제</li>
              <li>Finality: 900 epochs (~7.5h)</li>
              <li>F3: fast finality (2024+)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          EC = <strong>Poisson Sortition + VRF + Tipset</strong>.<br />
          epoch당 ~5 winners, storage power 비례.<br />
          probabilistic finality 7.5h, F3로 가속 가능.
        </p>

        {/* ── PoRep & PoSt ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoRep &amp; PoSt 저장 증명</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PoRep (Proof of Replication)</h4>
            <p className="text-xs text-muted-foreground mb-2">목적: unique physical storage 보유 증명 (1회 생성)</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted p-2"><strong>PC1</strong> — Stacked DRG 11 layers, CPU, 2-4h (32 GiB → ~352 GiB)</div>
              <div className="rounded bg-muted p-2"><strong>PC2</strong> — Merkle tree + column commitments, GPU, ~30m</div>
              <div className="rounded bg-muted p-2"><strong>C1</strong> — VDF challenge + Merkle proofs, &lt;1m</div>
              <div className="rounded bg-muted p-2"><strong>C2</strong> — SNARK (Groth16 + GPU), 30-90m, ~10MB → ~200B</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">PoSt (Proof of Spacetime)</h4>
            <p className="text-xs text-muted-foreground mb-2">목적: 지속적 저장 증명 (정기 제출)</p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="rounded bg-muted p-2">
                <strong>WindowPoSt</strong> — 24h window (2880 epochs)<br />
                <span className="text-xs">random sectors challenge + Merkle proofs + SNARK, miss → penalty</span>
              </div>
              <div className="rounded bg-muted p-2">
                <strong>WinningPoSt</strong> — leader election 시 즉시 생성<br />
                <span className="text-xs">tight deadline ~40s, 1 sector sampled, quick proof</span>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
              <strong>경제:</strong> FIL+ = reward x10 (verified deals) / slashing (faulty) / initial pledge per sector
            </div>
          </div>
        </div>
        <p className="leading-7">
          PoRep: <strong>sealing 증명 (4-phase)</strong>, 1회 생성.<br />
          PoSt: <strong>지속 저장 증명</strong>, 정기 제출.<br />
          Groth16 SNARK로 compressed, GPU 가속.
        </p>

        {/* ── Chain Weight 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Chain Weight 계산 상세</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">Weight 수식</h4>
          <div className="text-sm text-muted-foreground space-y-1 mb-3">
            <p><code className="text-xs">w(chain) = Sum w_epoch</code></p>
            <p><code className="text-xs">wForce = floor(log2(network_power))</code></p>
            <p><code className="text-xs">w_epoch = 256 * wForce + wForce * num_blocks * W_RATIO_NUM * 256 / expectedLeaders / W_RATIO_DEN</code></p>
            <p className="text-xs">W_RATIO_NUM=1, W_RATIO_DEN=2, expectedLeaders=5</p>
          </div>
          <div className="rounded bg-muted p-3 text-sm text-muted-foreground">
            <p className="font-medium text-xs mb-1">예시: network_power = 2^60 bytes (1 ExaByte)</p>
            <p className="text-xs">wForce = 60 / base = 60 x 256 = 15,360 / per block = 1,536 / 5 blocks tipset = <strong>23,040</strong></p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">왜 log2(power)?</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>linear scaling → large chain 공격 가능</li>
              <li>log scaling → 모든 validator 참여 incentive</li>
              <li>storage power 의미 유지</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Fork Choice</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Heaviest chain wins</li>
              <li>Weight is deterministic</li>
              <li>Reorg: 더 무거운 체인 발견 시</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Bitcoin vs Filecoin</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Bitcoin: chain work (sum of difficulty)</li>
              <li>Filecoin: tipset weight (log scaled)</li>
              <li>Tipset: 1 epoch에 여러 blocks → throughput 증가</li>
            </ul>
          </div>
        </div>
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
