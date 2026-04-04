import CodePanel from '@/components/ui/code-panel';
import ConvKernelViz from './viz/ConvKernelViz';
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
    </section>
  );
}
