import StepViz from '@/components/ui/step-viz';
import ResBlockViz from './viz/ResBlockViz';
import { blockSteps, variants } from './ArchitectureData';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ResNet 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Residual Block = Conv + BN + ReLU + Conv + BN + <strong>(+x)</strong> + ReLU<br />
          이 블록을 반복 적층하여 깊은 네트워크 구성
        </p>
        <h3>Batch Normalization (BN)</h3>
        <p>
          각 층의 출력을 정규화 → 학습 안정화 + 빠른 수렴<br />
          ResNet에서 BN은 Conv 직후, ReLU 직전에 배치
        </p>
      </div>
      <div className="not-prose my-8">
        <StepViz steps={blockSteps}>
          {(step) => <ResBlockViz step={step} />}
        </StepViz>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>변형 비교</h3>
      </div>
      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full max-w-2xl text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['모델', '블록 수', '블록 타입', '파라미터', '층 수'].map(h => (
                <th key={h} className="py-2 px-3 text-left text-xs font-medium
                  text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {variants.map(v => (
              <tr key={v.name} className="border-b border-border/50">
                <td className="py-2 px-3 font-medium text-xs">{v.name}</td>
                <td className="py-2 px-3 text-xs">{v.blocks}</td>
                <td className="py-2 px-3 text-xs">{v.type}</td>
                <td className="py-2 px-3 text-xs">{v.params}</td>
                <td className="py-2 px-3 text-xs">{v.layers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ResNet-50 전체 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ResNet-50 단계별 구조 (224×224 입력)
//
// Stage 0 - Stem:
//   Conv 7×7, 64 filters, stride=2  → 112×112×64
//   MaxPool 3×3, stride=2            → 56×56×64
//
// Stage 1 (conv2_x):
//   Bottleneck 블록 × 3 (64 → 256 channels)
//   출력: 56×56×256
//
// Stage 2 (conv3_x):
//   첫 블록: stride=2 (해상도 절반)
//   Bottleneck 블록 × 4 (128 → 512 channels)
//   출력: 28×28×512
//
// Stage 3 (conv4_x):
//   첫 블록: stride=2
//   Bottleneck 블록 × 6 (256 → 1024 channels)
//   출력: 14×14×1024
//
// Stage 4 (conv5_x):
//   첫 블록: stride=2
//   Bottleneck 블록 × 3 (512 → 2048 channels)
//   출력: 7×7×2048
//
// Classifier:
//   GlobalAvgPool    → 1×1×2048
//   Flatten          → 2048
//   Linear → 1000 (ImageNet classes)
//
// 블록 수: 3+4+6+3 = 16 blocks × 3 convs/block = 48 conv layers
// Stem 1 + FC 1 = 총 50 layers
//
// 파라미터: 약 25.5M
// FLOPs: 약 4.1 GFLOPs (224×224 입력)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">BatchNorm + ReLU 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BatchNorm (2015)
//
// 목적: 내부 공변량 이동(Internal Covariate Shift) 완화
//
// 수식:
//   μ_B = (1/m) Σ x_i                  # 배치 평균
//   σ²_B = (1/m) Σ (x_i - μ_B)²        # 배치 분산
//   x̂_i = (x_i - μ_B) / √(σ²_B + ε)    # 정규화
//   y_i = γ · x̂_i + β                  # 스케일/시프트 (학습)
//
// 효과:
//   - 학습 안정화 (낮은 학습률 불필요)
//   - 초기화 민감도 감소
//   - regularization 효과 (noise)
//   - 학습 속도 2~4배 향상
//
// Conv-BN-ReLU 순서 (ResNet v1):
//   Conv → BN → ReLU → Conv → BN → (+x) → ReLU
//
// Pre-activation (ResNet v2):
//   BN → ReLU → Conv → BN → ReLU → Conv → (+x)
//
//   v2 장점: 정규화가 shortcut 경로 바깥에 있어 기울기 더 깨끗
//
// 추론 시 BN:
//   - 이동평균(moving average) μ, σ 사용
//   - 배치 독립적 계산

// 대안:
//   - LayerNorm (Transformer 주류)
//   - GroupNorm (small batch에서 유리)
//   - InstanceNorm (스타일 전환)`}
        </pre>
        <p className="leading-7">
          요약 1: ResNet-50은 <strong>Stem → 4 Stages (3+4+6+3 blocks) → GAP → FC</strong> 구조.<br />
          요약 2: <strong>BatchNorm</strong>은 학습 안정화의 핵심 — ResNet v2에서 pre-activation으로 진화.<br />
          요약 3: Bottleneck + BN + Skip의 조합이 <strong>현대 CNN 표준 빌딩 블록</strong>.
        </p>
      </div>
    </section>
  );
}
