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
    </section>
  );
}
