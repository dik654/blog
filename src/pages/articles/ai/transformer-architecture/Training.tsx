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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Warmup + Cosine Decay</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Learning Rate Schedule
//
// Warmup 단계 (0 → warmup_steps):
//   lr = peak_lr × (step / warmup_steps)
//   선형 증가
//
// Cosine Decay (warmup_steps → total_steps):
//   progress = (step - warmup_steps) / (total_steps - warmup_steps)
//   lr = min_lr + 0.5 × (peak_lr - min_lr) × (1 + cos(π · progress))
//
// 전형적 설정:
//   warmup_steps = 2000
//   total_steps = 100000
//   peak_lr = 1e-4
//   min_lr = 1e-5
//
// 왜 Warmup?
//   - 초기 큰 lr → attention 불안정
//   - Adam의 2nd moment 추정 불충분
//   - 초기 작은 lr로 안정화 필요

// AdamW Optimizer:
//   β_1 = 0.9, β_2 = 0.95 (LLM), 0.999 (small)
//   weight_decay = 0.1 (LLM), 0.01 (일반)
//   eps = 1e-8
//
//   weight decay 분리:
//     W ← W - lr × (grad + weight_decay × W)
//   (Adam의 weight decay 편향 보정)

// Mixed Precision (FP16 / BF16):
//   - FP32: 메모리 8GB per 2B params
//   - FP16: 메모리 4GB (2배 절감)
//   - BF16: FP16보다 넓은 지수 범위 (권장)
//
//   구현:
//     forward: FP16
//     gradient: FP16
//     optimizer state: FP32 (정밀도)
//     loss scaling: overflow 방지

// Gradient Accumulation:
//   - 큰 배치 시뮬레이션
//   - 작은 GPU에서 대형 모델 학습
//
//   for micro_batch in batch:
//     loss = model(micro_batch) / N
//     loss.backward()
//   optimizer.step()
//   optimizer.zero_grad()

// 기타 기법:
//   - Gradient Clipping (norm=1.0)
//   - Dropout 0.1
//   - Label smoothing 0.1
//   - Checkpointing (메모리 절감)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Warmup + Cosine decay</strong>가 학습 안정성의 핵심.<br />
          요약 2: <strong>AdamW</strong>가 Adam의 weight decay 편향 해결.<br />
          요약 3: <strong>Mixed Precision (BF16)</strong>로 메모리·속도 2배 개선.
        </p>
      </div>
    </section>
  );
}
