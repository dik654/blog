import CodePanel from '@/components/ui/code-panel';
import { trainCode, trainAnnotations } from './TrainingData';
import TrainingViz from './viz/TrainingViz';

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transformer의 안정적 학습에 필수적인 3가지 기법:<br />
          <strong>Warmup LR 스케줄링</strong> + <strong>AdamW 옵티마이저</strong> + <strong>Mixed Precision Training</strong>(FP16/BF16 혼합 정밀도 학습)<br />
          이 기법들의 결합으로 수백억 파라미터의 대규모 모델도 안정적으로 학습 가능
        </p>
      </div>

      <TrainingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>학습 파이프라인</h3>
        <CodePanel title="Transformer 학습 핵심 기법" code={trainCode} lang="python" annotations={trainAnnotations} />
      </div>
    </section>
  );
}
