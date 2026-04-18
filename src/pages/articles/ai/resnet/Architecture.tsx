import StepViz from '@/components/ui/step-viz';
import ResBlockViz from './viz/ResBlockViz';
import { blockSteps, variants } from './ArchitectureData';
import ArchDetailViz from './viz/ArchDetailViz';
import M from '@/components/ui/math';

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
        <h3 className="text-xl font-semibold mt-6 mb-3">ResNet-50 구조 & BatchNorm</h3>
        <M display>{'\\hat{x}_i = \\frac{\\overbrace{x_i - \\mu_B}^{\\text{평균 빼기}}}{\\underbrace{\\sqrt{\\sigma_B^2 + \\epsilon}}_{\\text{분산으로 나누기}}} \\qquad y_i = \\underbrace{\\gamma}_{\\text{스케일}} \\cdot \\hat{x}_i + \\underbrace{\\beta}_{\\text{시프트}}'}</M>
        <div className="not-prose grid grid-cols-2 gap-2 mt-3 text-sm">
          {[
            { sym: 'x − μ_B', name: '평균 빼기', defs: 'μ_B = 미니배치 평균 (배치 내 같은 채널 값의 평균)', why: '층마다 출력 분포가 달라지면 다음 층이 계속 적응해야 함 → 학습 불안정. 평균을 0으로 맞춰 분포 중심을 고정', color: 'text-blue-500' },
            { sym: '÷ √(σ²+ε)', name: '분산으로 나누기', defs: 'σ²_B = 미니배치 분산, ε = 0 나누기 방지 상수 (1e-5)', why: '어떤 채널은 값이 수천, 어떤 채널은 0.01 → 스케일 차이가 기울기를 왜곡. 분산 1로 통일하여 모든 채널이 동등한 학습 속도 확보', color: 'text-blue-500' },
            { sym: 'γ · x̂', name: '스케일 복원', defs: 'γ = 학습 가능한 스케일 파라미터 (초기값 1)', why: '정규화가 항상 최적은 아님 — 네트워크가 γ를 학습하여 필요한 만큼 분산을 키우거나 줄임', color: 'text-purple-500' },
            { sym: '+ β', name: '시프트 복원', defs: 'β = 학습 가능한 시프트 파라미터 (초기값 0)', why: '평균 0이 항상 좋지 않음 — ReLU 직전이면 음수가 절반이 죽음. β로 평균을 이동하여 활성화 함수에 최적 입력 제공', color: 'text-purple-500' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className={`font-mono font-bold ${p.color}`}>{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground/70 mt-0.5">{p.defs}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.why}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose my-6">
        <ArchDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: ResNet-50은 <strong>Stem → 4 Stages (3+4+6+3 blocks) → GAP → FC</strong> 구조.<br />
          요약 2: <strong>BatchNorm</strong>은 학습 안정화의 핵심 — ResNet v2에서 pre-activation으로 진화.<br />
          요약 3: Bottleneck + BN + Skip의 조합이 <strong>현대 CNN 표준 빌딩 블록</strong>.
        </p>
      </div>
    </section>
  );
}
