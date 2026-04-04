import { CitationBlock } from '@/components/ui/citation';
import LimitationsViz from './viz/LimitationsViz';

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한계와 전망</h2>
      <div className="not-prose mb-8"><LimitationsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Chris Olah의 비유: <strong>"해석 가능성의 암흑 물질"</strong><br />
          추출한 특징은 전체 내부 표현의 극히 일부(1% 미만)<br />
          모델이 실제로 사용하는 대다수의 내부 구조는 아직 파악 불가
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">단일 레이어의 한계</h3>
        <p>
          SAE는 특정 레이어의 잔차 흐름에만 적용<br />
          여러 레이어에 걸친 복잡한 구조(회로, circuit) 파악이 어려움<br />
          모델의 "사고 과정" 전체를 추적하려면 레이어 간 관계가 필수
        </p>

        <CitationBlock
          source="Lindsey et al., Anthropic 2024 — Sparse Crosscoders"
          citeKey={6} type="paper"
          href="https://transformer-circuits.pub/2024/crosscoders"
        >
          <p className="italic">
            "Crosscoders learn features that span multiple layers, capturing
            computational structure that single-layer SAEs miss."
          </p>
          <p className="mt-2 text-xs">
            Sparse Crosscoder — 단일 레이어 SAE가 놓치는 다중 레이어 구조를 포착
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">확장성 문제와 전망</h3>
        <p>
          특징이 많아질수록 해석이 어려워지는 확장성 문제 존재<br />
          1300만 개의 특징을 사람이 전부 검토하는 것은 불가능<br />
          자동화된 해석 파이프라인 연구가 병행 중
        </p>
        <p>
          그럼에도 SAE는 LLM 블랙박스를 여는 <strong>가장 유망한 도구</strong><br />
          모델 안전성 검증, 편향 탐지, 행동 제어의 기반 기술로 발전 중
        </p>
      </div>
    </section>
  );
}
