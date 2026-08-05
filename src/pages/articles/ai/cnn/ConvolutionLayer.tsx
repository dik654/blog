import CodePanel from '@/components/ui/code-panel';
import ConvKernelViz from './viz/ConvKernelViz';
import ConvDetailViz from './viz/ConvDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
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
        <M display>{"\\begin{aligned} \\underbrace{H'}_{\\text{출력 크기}} &= \\lfloor\\frac{\\overbrace{H}^{\\text{입력}}-\\overbrace{k}^{\\text{커널}}+\\overbrace{2p}^{\\text{padding}}}{\\underbrace{s}_{\\text{stride}}}\\rfloor+1 \\\\ \\underbrace{N_{\\mathrm{param}}}_{\\text{학습 파라미터}} &= \\underbrace{k^2C_{in}C_{out}}_{\\text{커널 가중치}} + \\underbrace{C_{out}}_{\\text{편향}} \\end{aligned}"}</M>
        <FormulaNote
          meaning="왼쪽 식은 커널이 세로 방향으로 몇 번 놓일 수 있는지를, 오른쪽 식은 그 합성곱층이 학습하는 파라미터 수를 계산한다. 나눗셈이 딱 떨어지지 않으면 실제 프레임워크는 보통 바닥 함수로 내림한다. 이 식은 dilation=1, groups=1인 표준 Conv2d 기준이다."
          symbols={[
            ['H,H\'', '입력과 출력의 세로 크기. 가로 크기도 같은 방식으로 계산한다'],
            ['k', '정사각형 커널 한 변의 크기'],
            ['p', '입력 양쪽에 덧대는 padding 크기'],
            ['s', '커널을 한 번에 이동하는 stride'],
            ['C_{in},C_{out}', '입력 채널 수와 출력 필터 수'],
          ]}
        />
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
