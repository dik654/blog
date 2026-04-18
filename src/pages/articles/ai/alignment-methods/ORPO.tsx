import { CitationBlock } from '@/components/ui/citation';
import ORPOViz from './viz/ORPOViz';
import ORPOLossDetailViz from './viz/ORPODetailViz';
import ORPOProsConsDetailViz from './viz/ORPOProsConsDetailViz';

export default function ORPO() {
  return (
    <section id="orpo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ORPO: Odds Ratio Preference Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 아이디어</strong> — SFT와 선호 정렬을 단일 단계로 통합<br />
          Odds Ratio 손실로 Reference 모델도 제거 → RLHF 3단계 → 1단계
        </p>
      </div>

      <ORPOViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Hong et al., 2024 — ORPO" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2403.07691">
          <p className="italic text-sm">
            "ORPO effectively penalizes the rejected responses with a minor cost to the
            preferred ones by contrasting their generation odds."
          </p>
          <p className="mt-2 text-xs">
            Odds Ratio: P/(1-P)로 계산된 비율을 비교하므로
            확률 자체가 아닌 "확률의 비" 수준에서 선호를 반영 → 더 안정적인 학습
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">실험 결과</h3>
        <p>
          Llama-3-8B 기준 — ORPO가 DPO와 동등 성능 (AlpacaEval 2.0)<br />
          학습 시간: DPO 대비 ~40% 절감 (SFT 단계 제거)<br />
          한계: 대형 모델(70B+)에서는 DPO 대비 성능 차이 존재
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ORPO 손실 함수 상세</h3>
        <div className="not-prose"><ORPOLossDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">ORPO 장단점</h3>
        <div className="not-prose"><ORPOProsConsDetailViz /></div>
        <p className="leading-7">
          요약 1: ORPO = <strong>SFT + Odds Ratio</strong> 단일 loss — 학습 40% 단축.<br />
          요약 2: <strong>Reference model 불필요</strong> — 메모리 절반.<br />
          요약 3: 중소형 모델에 적합, 70B+는 DPO가 여전히 우세.
        </p>
      </div>
    </section>
  );
}
