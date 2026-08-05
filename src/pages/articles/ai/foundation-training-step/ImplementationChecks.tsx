import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CapabilityCheck, Misconception, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const executionOrder = [
  ['01', 'Gradient 초기화', '이전 step의 gradient가 누적되지 않게 비운다.'],
  ['02', 'Raw logits 계산', '모델의 마지막 sigmoid를 따로 적용하지 않고 z를 만든다.'],
  ['03', 'Fused BCE 계산', 'BCEWithLogitsLoss가 sigmoid와 log-loss를 안정적으로 결합한다.'],
  ['04', 'Backward', 'Scalar loss에서 시작해 parameter.grad를 채운다.'],
  ['05', 'Optimizer step', '현재 gradient와 learning rate로 새 parameter snapshot을 만든다.'],
  ['06', '별도 재평가', '새 parameter로 forward를 다시 실행해 같은 기준의 loss를 비교한다.'],
];

export default function ImplementationChecks() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Framework 코드에서는 어떤 순서를 지켜야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          수학 원장의 여섯 단계는 학습 코드의 실행 순서와 일치해야 한다. 함수 이름을 외우는 대신 각 호출이 어느 값을
          읽고 어느 state를 바꾸는지 확인한다.
        </p>
      </div>

      <ol className="not-prose my-8 divide-y divide-border border-y border-border">
        {executionOrder.map(([number, title, note]) => (
          <li key={number} className="grid min-w-0 gap-2 py-4 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4">
            <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">{number}</span>
            <span className="text-sm font-bold">{title}</span>
            <span className="text-sm leading-relaxed text-muted-foreground">{note}</span>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>가장 흔한 계약 오류</h3>
        <ul>
          <li><strong>Sigmoid 중복:</strong> probability를 fused logits loss에 넣으면 loss가 다시 sigmoid를 적용한다.</li>
          <li><strong>Gradient 누적:</strong> gradient를 비우지 않으면 이번 sample의 책임과 이전 step의 책임이 합쳐진다.</li>
          <li><strong>비교 기준 변경:</strong> update 전후에 서로 다른 sample이나 augmentation을 쓰면 local 검산이 아니다.</li>
          <li><strong>과도한 결론:</strong> 한 sample의 loss 감소는 validation loss, calibration, 배포 성능 향상을 보장하지 않는다.</li>
        </ul>
      </div>

      <Misconception>
        이 예제에서 학습률 0.10이 loss를 줄였다고 해서 모든 모델의 좋은 기본값은 아니다. 곡률, batch gradient noise,
        normalization, optimizer state가 달라지면 같은 학습률도 너무 작거나 발산을 일으킬 수 있다.
      </Misconception>

      <CapabilityCheck
        title="본문만으로 풀 수 있어야 하는 전이 질문"
        items={[
          'x, w, b만 보고 update 전 logit과 probability를 계산할 수 있다.',
          '왜 fused BCE에는 sigmoid probability가 아니라 raw logits를 넣어야 하는지 설명할 수 있다.',
          'p-y에서 두 weight gradient가 서로 다른 크기가 되는 이유를 input 값으로 설명할 수 있다.',
          '한 sample의 update 후 loss 감소만으로 validation 성능 향상을 결론 내리면 안 되는 이유를 설명할 수 있다.',
          '같은 parameter에 새 입력 x=[-1, 0.5]와 label y=0을 넣었을 때 gradient의 부호가 어떻게 바뀌는지 계산 전에 예측할 수 있다.',
          'Update 뒤 loss를 검산할 때 어떤 값은 유지하고 어떤 값은 반드시 다시 계산해야 하는지 구분할 수 있다.',
        ]}
      />

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        <Link to={articlePath('ai', 'optimizers')} className="group rounded-md border border-border p-4 transition-colors hover:bg-muted/20">
          <p className="text-xs font-semibold text-muted-foreground">이전 · update 규칙 비교</p>
          <p className="mt-1 text-sm font-bold">SGD, Momentum, Adam, AdamW의 state 차이</p>
        </Link>
        <Link to={articlePath('ai', 'autoencoder')} className="group rounded-md border border-border p-4 transition-colors hover:bg-muted/20">
          <p className="text-xs font-semibold text-muted-foreground">다음 · target을 바꾸는 실험</p>
          <p className="mt-1 flex items-center gap-2 text-sm font-bold">
            Label y 대신 input x를 복원하는 Autoencoder
            <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </p>
        </Link>
      </div>

      <SourceNotes
        sources={[
          { label: 'PyTorch · BCEWithLogitsLoss', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html', note: 'Sigmoid와 BCE를 결합해 raw logits에서 수치적으로 안정된 binary loss를 계산하는 공식 계약.' },
          { label: 'PyTorch · SGD', href: 'https://docs.pytorch.org/docs/stable/generated/torch.optim.SGD.html', note: 'Learning rate, gradient와 parameter update의 공식 실행 규칙.' },
          { label: 'Deep Learning · Feedforward Networks', href: 'https://www.deeplearningbook.org/contents/mlp.html', note: 'Feedforward computation, objective와 back-propagation을 한 계산 그래프로 연결하는 공개 교재.' },
          { label: 'Automatic Differentiation in Machine Learning', href: 'https://www.jmlr.org/papers/v18/17-468.html', note: 'Scalar output에서 많은 input gradient를 계산하는 reverse-mode automatic differentiation의 기준.' },
        ]}
      />
    </section>
  );
}
