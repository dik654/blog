import CodePanel from '@/components/ui/code-panel';
import ConvKernelViz from './viz/ConvKernelViz';
import ConvDetailViz from './viz/ConvDetailViz';
import M from '@/components/ui/math';
import ConvMeaningViz from './viz/ConvMeaningViz';
import HierarchicalFeatureViz from './viz/HierarchicalFeatureViz';
import { convCode, convAnnotations, poolCode, poolAnnotations } from './ConvolutionLayerData';

export default function ConvolutionLayer() {
  return (
    <section id="convolution-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합성곱 연산의 구성요소</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        작은 필터(3×3)를 이미지 위에서 슬라이딩 → 원소별 곱의 합 계산.<br />
        커널과 유사한 패턴일수록 높은 출력값 → 패턴 감지기 역할.
      </p>
      <ConvKernelViz />

      <h3 className="text-lg font-semibold mt-10 mb-4">합성곱의 의미: 패턴 감지기</h3>
      <ConvMeaningViz />

      <h3 className="text-lg font-semibold mt-10 mb-4">계층적 피처 학습</h3>
      <HierarchicalFeatureViz />

      <div className="mt-8 space-y-4">
        <CodePanel title="PyTorch Conv2d" code={convCode}
          annotations={convAnnotations} />
        <CodePanel title="Pooling & ReLU" code={poolCode}
          annotations={poolAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">합성곱 연산 수식과 커널</h3>
        <M display>{"H' = \\frac{H - k + 2p}{s} + 1 \\qquad \\underbrace{k^2 \\cdot C_{in} \\cdot C_{out} + C_{out}}_{\\text{파라미터 수}}"}</M>
      </div>
      <div className="not-prose my-6">
        <ConvDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: <strong>Y = X * K</strong> 합성곱은 커널 크기·stride·padding으로 출력 크기 결정.<br />
          요약 2: CNN의 본질은 <strong>수작업 필터를 학습으로 대체</strong> — 자동 특성 추출.<br />
          요약 3: <strong>Max/Avg/GAP</strong> pooling이 다운샘플링의 표준 — 용도별로 선택.
        </p>
      </div>
    </section>
  );
}
