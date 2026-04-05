import { CitationBlock } from '@/components/ui/citation';
import PolysemantViz from './viz/PolysemantViz';

export default function Polysemanticity() {
  return (
    <section id="polysemanticity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다의성과 중첩 가설</h2>
      <div className="not-prose mb-8"><PolysemantViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 뉴런이 "의심", "약어", "법률 용어" 등 여러 개념에 반응<br />
          = 다의성(Polysemanticity). 단일 뉴런으로 해석 불가.
        </p>

        <CitationBlock
          source="Elhage et al., Anthropic 2022 — Toy Models of Superposition"
          citeKey={3} type="paper"
          href="https://transformer-circuits.pub/2022/toy_model"
        >
          <p className="italic">
            "Neural networks represent more features than they have neurons
            by encoding features in superposition — as almost-orthogonal
            directions in activation space."
          </p>
          <p className="mt-2 text-xs">
            중첩 가설 — 뉴런 수보다 많은 개념을 거의 직교하는 방향으로 인코딩
          </p>
        </CitationBlock>

        <p>
          <strong>중첩 가설</strong> — 뉴런 수보다 많은 개념을 거의 직교 방향으로 인코딩.<br />
          이를 분리하기 위해 SAE(Sparse Autoencoder) 등장.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Superposition Hypothesis 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Superposition (중첩) 가설 (Elhage 2022)
//
// 관찰:
//   LLM 뉴런이 명확한 의미를 가지지 않음
//   한 뉴런이 여러 관련 없는 개념에 반응
//   "gypsum board", "Oscar Wilde", "stock prices" 동시 반응
//
// 가설:
//   뉴런 수 N < 학습된 개념 수 M
//   → 거의 직교하는 방향에 M개 개념 인코딩
//   → 뉴런 기준이 아닌 direction 기준으로 해석
//
// 수학적 직관:
//
//   d차원 공간에서:
//   - 정확히 직교하는 vectors: d개
//   - 거의 직교(각도 < ε): 지수적 많이 가능!
//   - Johnson-Lindenstrauss lemma
//
// Toy Model 실험:
//   10차원 공간에 20개 feature 인코딩
//   → 가능 (near-orthogonal)
//   → 하나의 dimension에 2개 feature 중첩

// Sparsity와 Superposition:
//
//   각 입력이 소수의 feature만 활성화
//   → 충돌 확률 낮음
//   → 안전한 중첩 가능
//
//   Privileged vs Non-privileged basis:
//   - Privileged: ReLU, attention heads
//     (해당 뉴런에 "특별한" 의미 가능)
//   - Non-privileged: residual stream
//     (회전해도 등가, arbitrary direction)

// Feature Visualization 예시:
//
// Before SAE (뉴런 1234):
//   활성화 top-5 텍스트:
//   - "The Golden Gate Bridge..."
//   - "quarterly earnings of Apple..."
//   - "genetic mutations in..."
//   - "medieval architecture..."
//   - "Mozart's symphony..."
//   → 의미 불명
//
// After SAE (feature 5678):
//   활성화 top-5:
//   - "The Golden Gate Bridge spans..."
//   - "crossing the Golden Gate..."
//   - "San Francisco's iconic red bridge"
//   - "Bay Area landmark"
//   - "suspension bridge in California"
//   → "Golden Gate Bridge" 개념!

// 중첩의 이점:
//   - 제한된 파라미터로 많은 개념 표현
//   - 효율적 학습
//   - Generalization 촉진
//
// 중첩의 비용:
//   - 해석 어려움 (SAE로 해결)
//   - Interference (충돌)
//   - Feature 간 간섭`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Superposition 가설</strong> — 뉴런 수보다 많은 개념을 거의 직교 방향에 저장.<br />
          요약 2: <strong>Sparsity 덕분에 안전</strong> — 대부분 입력에서 소수 feature만 활성.<br />
          요약 3: SAE는 이 <strong>중첩을 역공학적으로 풀어내는</strong> 도구.
        </p>
      </div>
    </section>
  );
}
