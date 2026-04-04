import CodePanel from '@/components/ui/code-panel';
import { scalingCode, scalingAnnotations } from './ScalingLawsData';
import ScalingLawsViz from './viz/ScalingLawsViz';

export default function ScalingLaws() {
  return (
    <section id="scaling-laws" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스케일링 법칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transformer의 성능 — <strong>파라미터 수(N)</strong>, <strong>데이터양(D)</strong>, <strong>연산량(C)</strong>의 멱법칙(Power Law, 변수 간 거듭제곱 관계)을 따라 예측 가능하게 향상<br />
          Chinchilla 논문 — 고정 연산 예산에서 <strong>N:D=1:20</strong>이 최적임을 입증<br />
          LLM 학습 패러다임을 근본적으로 변화시킴
        </p>
      </div>

      <ScalingLawsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>스케일링 법칙 & Chinchilla</h3>
        <CodePanel title="스케일링 법칙 & 실전 적용" code={scalingCode} annotations={scalingAnnotations} />
      </div>
    </section>
  );
}
