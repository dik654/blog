import { CitationBlock } from '@/components/ui/citation';
import MotivationViz from './viz/MotivationViz';
import InterpDetailViz from './viz/InterpDetailViz';
import SAERoleDetailViz from './viz/SAERoleDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 LLM 내부를 봐야 하는가</h2>
      <div className="not-prose mb-8"><MotivationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM에게 "이 단어를 잊어라"라고 지시 → 잊었다고 답하지만 내부에는 여전히 해당 정보가 존재<br />
          모델을 "더 솔직하게" 훈련하는 것만으로는 부족 → <strong>내부 구조를 직접 이해</strong>해야 함
        </p>

        <CitationBlock
          source="Anthropic, 2023 — Towards Monosemanticity"
          citeKey={1} type="paper"
          href="https://transformer-circuits.pub/2023/monosemantic-features"
        >
          <p className="italic">
            "We use sparse autoencoders to extract interpretable features from a
            one-layer transformer. These features correspond to understandable
            concepts — far more so than individual neurons."
          </p>
          <p className="mt-2 text-xs">
            희소 오토인코더로 개별 뉴런보다 훨씬 해석 가능한 특징을 추출
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">기계적 해석 가능성</h3>
        <p>
          <strong>Mechanistic Interpretability</strong> — 모델 내부의 특징(feature)을 추출하고 해석하는 연구 분야<br />
          추출한 특징의 강도를 조절하면 모델 행동을 직접 제어 가능<br />
          예: "내적 갈등" 특징 강화 → 단어를 잊지 못하고 갈등하는 모델
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Interpretability의 중요성</h3>
        <div className="not-prose"><InterpDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">SAE의 역할</h3>
        <div className="not-prose"><SAERoleDetailViz /></div>
        <p className="leading-7">
          요약 1: LLM 해석성은 <strong>안전성·신뢰성·규제·과학</strong> 4가지 이유로 필수.<br />
          요약 2: SAE는 <strong>mechanistic interpretability</strong>의 주요 도구.<br />
          요약 3: <strong>Polysemanticity를 Monosemanticity로</strong> 분리하는 것이 목표.
        </p>
      </div>
    </section>
  );
}
