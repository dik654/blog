import { CitationBlock } from '@/components/ui/citation';
import MotivationViz from './viz/MotivationViz';

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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 왜 LLM 내부 이해가 필요한가?
//
// 1. AI Safety (안전성)
//    - 위험한 행동 사전 탐지
//    - Deception 감지
//    - Alignment 검증
//
// 2. Reliability (신뢰성)
//    - 예측 불가능한 failure mode
//    - 편향 원인 파악
//    - 디버깅 가능성
//
// 3. Regulatory Compliance
//    - EU AI Act (설명 가능성)
//    - GDPR "설명 권리"
//    - 의료/금융 규제
//
// 4. Scientific Understanding
//    - 지능의 본질 탐구
//    - 표현 학습 원리
//    - 새로운 모델 설계 지침

// Interpretability 접근법 3가지:
//
// A. Behavioral Interpretability
//    - 입출력 관계 분석
//    - Probing, eliciting
//    - Black-box treatment
//
// B. Representation Analysis
//    - 임베딩 공간 탐색
//    - Linear probing
//    - Attention visualization
//
// C. Mechanistic Interpretability ← SAE의 영역
//    - 뉴런·회로 수준
//    - 인과 관계 추적
//    - 가장 야심찬 접근

// Anthropic Interpretability Team의 철학:
//   "LLM을 생물학처럼 연구"
//   - 마이크로스코프 = SAE
//   - 세포 = features
//   - 기관 = circuits
//   - 생명 = behaviors`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SAE의 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sparse Autoencoder가 풀려는 문제:
//
// 문제: Polysemanticity (다의성)
//   한 뉴런이 여러 개념에 동시 반응
//   → 해석 불가
//
// 가설: Superposition (중첩)
//   모델이 뉴런 수보다 많은 개념을 인코딩
//   → 각 개념이 거의 직교하는 방향에 저장
//
// SAE 해법:
//   "펼쳐서 분리" (lift and separate)
//   - 작은 dense → 큰 sparse 공간으로 투영
//   - L1 페널티로 희소성 강제
//   - 각 dimension이 하나의 개념
//
// 결과물:
//   - Monosemantic features (단일 의미 특성)
//   - Interpretable directions in activation space
//   - 인과적 개입 가능

// 역사적 발전:
//   2014 Word2Vec: analogy 발견
//   2017 Transformer attention visualization
//   2021 Elhage et al.: Transformer circuits framework
//   2022 Elhage et al.: Toy models of superposition
//   2023 Anthropic: Towards Monosemanticity (첫 실질적 SAE)
//   2024 Templeton: Scaling to Claude Sonnet (13M features)
//   2024 OpenAI: Extracting concepts from GPT-4

// 영향:
//   - 새로운 AI 안전 패러다임
//   - "Feature Steering" 상용화
//   - Alignment tax 감소
//   - Post-hoc interpretability tools`}
        </pre>
        <p className="leading-7">
          요약 1: LLM 해석성은 <strong>안전성·신뢰성·규제·과학</strong> 4가지 이유로 필수.<br />
          요약 2: SAE는 <strong>mechanistic interpretability</strong>의 주요 도구.<br />
          요약 3: <strong>Polysemanticity를 Monosemanticity로</strong> 분리하는 것이 목표.
        </p>
      </div>
    </section>
  );
}
