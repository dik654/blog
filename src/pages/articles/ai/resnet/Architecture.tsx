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
    </section>
  );
}
