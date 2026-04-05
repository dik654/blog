import StepViz from '@/components/ui/step-viz';
import SkipPathViz from './viz/SkipPathViz';
import { skipSteps } from './SkipConnectionData';

export default function SkipConnection() {
  return (
    <section id="skip-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킵 커넥션 원리</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        y = F(x) + x — 입력을 변환 결과에 직접 더함.<br />
        dy/dx = dF/dx + 1 — "+1" 덕분에 기울기가 최소 1 이상 보장.
      </p>
      <div className="not-prose my-8">
        <StepViz steps={skipSteps}>
          {(step) => <SkipPathViz step={step} />}
        </StepViz>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skip Connection의 수학적 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Skip Connection (Identity Shortcut)
//
// 기본 수식:
//   y = F(x) + x
//
//   여기서:
//     x = 입력
//     F(x) = 학습할 함수 (2~3개 conv layer의 변환)
//     y = 출력
//
// 역전파 시 기울기:
//   dL/dx = dL/dy · (dF/dx + 1)
//         = dL/dy · dF/dx  +  dL/dy
//           └─────┬─────┘     └──┬──┘
//           변환 경로          직접 경로
//
// 핵심 통찰:
//   - "+1" 항(identity)이 직접 경로로 작용
//   - dF/dx가 0에 가깝더라도 dL/dx ≥ dL/dy 보장
//   - 기울기가 손실 없이 뒤쪽에서 앞쪽으로 전달
//
// 즉, 100층 쌓아도:
//   dL/dx_0 = dL/dy_100 × ∏(1 + dF_l/dx_l)
//
//   각 층에서 +1이 보장되므로 곱이 0으로 수렴하지 않음

// F(x) = 0 인 경우:
//   y = 0 + x = x  (항등 함수)
//   - 추가 층이 "의미 없으면" 그냥 통과
//   - 최소한 이전 층 성능 보장
//   - 학습이 쉬운 baseline 제공
//
// F(x) = 유의미한 변환인 경우:
//   y = F(x) + x  (잔차 추가)
//   - 기존 x에 "조정값" 더함
//   - 작은 개선이 누적되어 깊이의 이점 실현`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Residual Block 종류</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Basic Block (ResNet-18, ResNet-34)
//
//   x ──→ Conv 3×3 ──→ BN ──→ ReLU
//   │        ↓
//   │     Conv 3×3 ──→ BN
//   │        ↓
//   └──────→(+)──→ ReLU ──→ y
//
//   파라미터: 2개 conv layer
//
// Bottleneck Block (ResNet-50, 101, 152)
//
//   x ──→ Conv 1×1 (차원 축소) → BN → ReLU
//   │        ↓
//   │     Conv 3×3 ──→ BN ──→ ReLU
//   │        ↓
//   │     Conv 1×1 (차원 복원) → BN
//   │        ↓
//   └──────→(+)──→ ReLU ──→ y
//
//   파라미터: 3개 conv layer
//   장점: 1×1로 차원 줄인 뒤 3×3 적용 → 효율적
//
//   예: 256 channel 입력
//   Basic: 3×3×256×256 × 2 = 1.18M
//   Bottleneck: 1×1×256×64 + 3×3×64×64 + 1×1×64×256 = 70K
//   → 17배 효율

// Projection Shortcut (차원 변경 시)
//
//   채널 수나 해상도가 바뀔 때:
//   y = F(x) + W_s·x
//
//   W_s = 1×1 conv (차원 매칭용)
//
// Pre-activation Block (ResNet v2, 2016)
//
//   x ──→ BN ──→ ReLU ──→ Conv 3×3
//   │              ↓
//   │           BN ──→ ReLU ──→ Conv 3×3
//   │              ↓
//   └─────────────(+)──→ y
//
//   BN과 ReLU를 conv 앞으로 → 기울기 흐름 더 부드러움`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>y = F(x) + x</strong>가 skip connection의 전부 — "+1"이 기울기 고속도로.<br />
          요약 2: <strong>Bottleneck</strong> 블록은 1×1 conv로 차원 조절 — 효율·표현력 양립.<br />
          요약 3: F(x)=0이면 identity, 그 위에 잔차만 추가 학습 — <strong>쉬운 최적화</strong>.
        </p>
      </div>
    </section>
  );
}
