import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProposerSelection({ onCodeRef }: Props) {
  return (
    <section id="proposer-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Proposer 선정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("compute-proposer", codeRefs["compute-proposer"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ComputeProposerIndex()
          </span>
        </div>

        {/* ── Proposer selection 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ComputeProposerIndex — effective_balance 가중
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              선정 알고리즘 (매 slot)
            </div>
            <ol className="text-sm space-y-1 mt-1 list-decimal list-inside">
              <li>
                <code>computeShuffledIndex(i % total, total, seed)</code>로 후보
                index 계산
              </li>
              <li>
                현재 fork의 <code>compute_proposer_index</code>가 정한 폭으로
                seed에서 무작위 값 추출
              </li>
              <li>
                가중 선택:{" "}
                <code>
                  effectiveBalance * MAX_RANDOM_VALUE &gt;=
                  MAX_EFFECTIVE_BALANCE * randomValue
                </code>{" "}
                통과 시 당첨
              </li>
              <li>
                미통과 시 <code>i++</code> → 다음 후보 재시도
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              확률을 결정하는 값
            </div>
            <div className="text-sm grid grid-cols-3 gap-2 mt-1">
              <div className="text-center">
                <div className="font-mono font-bold">effective balance</div>
                <div className="text-muted-foreground">후보의 가중치</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-bold">fork maximum</div>
                <div className="text-muted-foreground">정규화 기준</div>
              </div>
              <div className="text-center">
                <div className="font-mono font-bold">active set</div>
                <div className="text-muted-foreground">전체 후보 분포</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              설계 근거 & Seed
            </div>
            <ul className="text-sm space-y-1 mt-1">
              <li>
                큰 stake validator 우선 → 경제적 보안 / 낮은 balance → 재추첨 →
                공정성
              </li>
              <li>결정적 알고리즘 → 모든 노드 동일 결과</li>
              <li>
                seed = <code>hash(RANDAO_mix(epoch-1) + domain + slot)</code> →
                예측 불가
              </li>
              <li>
                duties는 seed lookahead와 현재 state에서 계산하지만 reorg·fork
                경계에 맞춰 dependent root와 함께 확인
              </li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Proposer는 seed로 만든 결정적 shuffle 후보를
          <strong>effective balance에 비례한 확률</strong>로 받아들이는 방식으로
          선택한다.
          acceptance 확률은 effective balance와 현재 fork의 maximum effective
          balance 비율로 정해지며, 같은 state와 slot을 가진 모든 노드는 같은
          proposer를 계산한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 잔액 비례 확률</strong> — effectiveBalance × maxRandom ≥
          maxEffectiveBalance × randomValue 조건을 사용한다.
          Electra처럼 최대 effective balance와 무작위 값 폭이 바뀌는 fork에서는
          해당 버전의 함수를 사용하며,
          duty cache도 state dependent root와 fork version을 함께 보관해야 한다.
        </p>
      </div>
    </section>
  );
}
