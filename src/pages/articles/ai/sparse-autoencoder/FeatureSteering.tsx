import { CitationBlock } from '@/components/ui/citation';
import FeatureSteerViz from './viz/FeatureSteerViz';

export default function FeatureSteering() {
  return (
    <section id="feature-steering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">특징 조작: 모델 행동 제어</h2>
      <div className="not-prose mb-8"><FeatureSteerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>GemmaScope</strong> — Google DeepMind가 Gemma 2B에 400+개 SAE를 적용한 프로젝트<br />
          추출한 특징의 강도를 인위적으로 조절 → 모델 행동이 변화<br />
          예: "의문/불확실성" 특징을 100으로 고정 → 매우 회의적인 모델
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">과도한 조절의 위험</h3>
        <p>
          값을 너무 높이면(500) → 모델 붕괴, 의미 없는 출력 생성<br />
          적절한 범위 내에서만 유효한 제어가 가능<br />
          "다이얼을 돌리는" 비유 — 너무 세게 돌리면 라디오가 깨짐
        </p>

        <CitationBlock
          source="Templeton et al., Anthropic 2024 — Scaling Monosemanticity"
          citeKey={5} type="paper"
          href="https://transformer-circuits.pub/2024/scaling-monosemanticity"
        >
          <p className="italic">
            "We find features corresponding to cities, people, code syntax,
            and even abstract concepts like deception. Clamping features to
            specific values steers model behavior in predictable ways."
          </p>
          <p className="mt-2 text-xs">
            도시, 인물, 코드 문법, 기만 같은 추상 개념까지 — 특징 고정으로 행동 제어 가능
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">멀티모달 특징</h3>
        <p>
          <strong>Claude 3 Sonnet</strong>의 Golden Gate Bridge 특징 — 텍스트와 이미지 모두에서 반응<br />
          Anthropic: Claude 3 Sonnet에서 <strong>1300만 개</strong> 특징 추출<br />
          OpenAI: GPT-4에서 <strong>1600만 개</strong> 특징 추출<br />
          특징의 수가 곧 모델 해석의 해상도
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Feature Steering 실제 예시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Anthropic's "Golden Gate Claude" (2024)
//
// 실험:
//   Claude 3 Sonnet에서 "Golden Gate Bridge" feature 발견
//   이 feature를 높게 clamp (값 고정)
//
// 결과:
//   어떤 주제든 Golden Gate Bridge로 연결
//
// 대화 예시:
//   User: "How do I bake cookies?"
//   Claude: "To bake cookies that rival the beauty of the
//           Golden Gate Bridge, you'll need flour, sugar, and
//           the same determination as the engineers who
//           built that iconic San Francisco landmark..."
//
//   User: "What's 2+2?"
//   Claude: "2+2 equals 4, which happens to be the number of
//           cables supporting each tower of the magnificent
//           Golden Gate Bridge..."
//
// 의의:
//   - Feature가 실제 인과적 역할 증명
//   - 모델 행동 직접 제어
//   - Alignment 도구로 가능성

// Feature Steering 응용:
//
// 1. Safety Interventions
//    - 위험 feature 억제
//    - 기만 탐지 & 차단
//    - Harmful output 방지
//
// 2. Personality Shaping
//    - 특정 톤/스타일 강화
//    - Domain expertise 강조
//    - Creativity vs precision 조절
//
// 3. Bias Mitigation
//    - 편향 feature 찾아 억제
//    - Fairness 개선
//    - Representation balance
//
// 4. Debugging
//    - 왜 이런 응답? → feature 추적
//    - Failure mode 이해
//    - Root cause 분석

// GemmaScope (Google DeepMind 2024):
//   - Gemma 2 9B + 400 SAEs
//   - Every layer, every resolution
//   - 공개 데이터셋
//   - 연구자 활용 가능

// 과제:
//   - Feature 전체 카탈로그 (수천만)
//   - 자동 labeling
//   - Robustness (adversarial features)
//   - Real-time steering`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Feature Steering</strong>은 SAE feature를 조작해 행동 제어.<br />
          요약 2: <strong>Golden Gate Claude</strong>가 유명한 시연 사례.<br />
          요약 3: Safety·Bias·Debugging 등 <strong>실무 응용 가능성</strong> 큼.
        </p>
      </div>
    </section>
  );
}
