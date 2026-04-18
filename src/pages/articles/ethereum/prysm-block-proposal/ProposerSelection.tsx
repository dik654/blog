import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProposerSelection({ onCodeRef }: Props) {
  return (
    <section id="proposer-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proposer 선정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('compute-proposer', codeRefs['compute-proposer'])} />
          <span className="text-[10px] text-muted-foreground self-center">ComputeProposerIndex()</span>
        </div>

        {/* ── Proposer selection 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ComputeProposerIndex — effective_balance 가중</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">선정 알고리즘 (매 slot)</div>
            <ol className="text-sm space-y-1 mt-1 list-decimal list-inside">
              <li><code>computeShuffledIndex(i % total, total, seed)</code>로 후보 index 계산</li>
              <li>seed + <code>(i/32)</code> 해시의 <code>(i%32)</code> 바이트에서 랜덤 byte 추출</li>
              <li>가중 선택: <code>effectiveBalance * MAX_RANDOM_BYTE &gt;= MAX_EFFECTIVE_BALANCE * randomByte</code> 통과 시 당첨</li>
              <li>미통과 시 <code>i++</code> → 다음 후보 재시도</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">확률 분석</div>
            <div className="text-sm grid grid-cols-3 gap-2 mt-1">
              <div className="text-center">
                <div className="font-mono font-bold">32 ETH</div>
                <div className="text-muted-foreground">100% 통과</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-bold">16 ETH</div>
                <div className="text-muted-foreground">50% 통과</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-bold">0.5 ETH</div>
                <div className="text-muted-foreground">~1.56% 통과</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">설계 근거 & Seed</div>
            <ul className="text-sm space-y-1 mt-1">
              <li>큰 stake validator 우선 → 경제적 보안 / 낮은 balance → 재추첨 → 공정성</li>
              <li>결정적 알고리즘 → 모든 노드 동일 결과</li>
              <li>seed = <code>hash(RANDAO_mix(epoch-1) + domain + slot)</code> → 예측 불가</li>
              <li>epoch N의 RANDAO mix 고정 → epoch N+1 proposer 미리 계산 가능 (1 epoch 사전 준비)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Proposer는 <strong>effective_balance 가중 무작위 선정</strong>.<br />
          32 ETH = 100% 선정 확률, 낮은 balance = 재추첨.<br />
          결정적 알고리즘 → 모든 노드 동일 proposer 계산.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 잔액 비례 확률</strong> — effectiveBalance * maxRandom ≥ MaxEffectiveBalance * randomByte.<br />
          32 ETH 유효 잔액이면 항상 통과, 잔액이 낮으면 재추첨.<br />
          한 에폭 전에 다음 에폭의 제안자를 미리 알 수 있어 사전 준비 가능.
        </p>
      </div>
    </section>
  );
}
