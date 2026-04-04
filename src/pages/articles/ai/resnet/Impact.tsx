import StepViz from '@/components/ui/step-viz';
import ImageNetTrendViz from './viz/ImageNetTrendViz';
import { impactSteps } from './ImpactData';

export default function Impact() {
  return (
    <section id="impact" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ResNet의 영향</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ILSVRC 2015 우승 — top-5 에러 <strong>3.57%</strong> (인간 5.1% 돌파)<br />
          152층이라는 압도적 깊이로 깊은 네트워크의 시대를 열음
        </p>
        <h3>후속 발전</h3>
        <p>
          <strong>DenseNet</strong>(2017): 모든 층을 연결 → 특성 재사용 극대화<br />
          <strong>ResNeXt</strong>(2017): 그룹 합성곱으로 너비 확장<br />
          <strong>EfficientNet</strong>(2019): 깊이·너비·해상도 동시 스케일링
        </p>
        <p>
          <strong>Transformer</strong>의 스킵 커넥션 = ResNet에서 유래<br />
          Self-Attention + FFN 각 서브레이어에 잔차 연결 적용<br />
          GPT, BERT 등 현대 LLM의 필수 구조가 된 스킵 커넥션
        </p>
        <h3>손실 평면 매끄러움 효과</h3>
        <p>
          스킵 커넥션이 손실 함수의 지형(landscape)을 매끄럽게 만듦<br />
          → 옵티마이저가 더 안정적으로 최적점을 찾을 수 있음
        </p>
      </div>
      <div className="not-prose my-8">
        <StepViz steps={impactSteps}>
          {(step) => <ImageNetTrendViz step={step} />}
        </StepViz>
      </div>
    </section>
  );
}
