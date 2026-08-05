import { Link } from 'react-router-dom';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const checks = [
  ['입력 경계', '데이터 loader가 [B,d]를 만드는지 확인한다. 이미지라면 flatten 또는 encoder가 어디서 적용되는지 표시한다.'],
  ['Layer 경계', '각 Linear의 in_features가 이전 layer의 out_features와 같은지 확인한다.'],
  ['출력 경계', '출력 수가 target shape와 task 정의에 맞는지 확인한다.'],
  ['Loss 경계', 'loss가 logits를 받는지 확률을 받는지 API 문서를 확인한다.'],
];

export default function NetworkImplementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">코드로 옮길 때 무엇을 먼저 검산해야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          아래 모델은 d개 입력 특징을 h개 은닉 특징으로 바꾼 뒤 binary logit 하나를 만든다. 코드는 짧지만 실제 오류의
          대부분은 layer 이름보다 tensor 경계에서 생긴다. 첫 batch에서 shape를 출력하고, loss API가 기대하는 입력을
          확인하는 습관이 중요하다.
        </p>
      </div>

      <pre className="not-prose my-6 whitespace-pre-wrap break-words rounded-md border border-border bg-muted/20 p-4 text-xs leading-6 sm:text-sm"><code>{`model = nn.Sequential(
    nn.Linear(d, h),
    nn.ReLU(),
    nn.Linear(h, 1),
)

logits = model(x)          # [B, 1]
loss = binary_ce(logits, y)`}</code></pre>

      <Math display>{String.raw`P=(dh+h)+(h\cdot1+1)`}</Math>
      <FormulaNote
        meaning="첫 Linear의 가중치와 편향, 둘째 Linear의 가중치와 편향을 모두 더한 학습 가능 파라미터 수다. Batch 크기 B는 파라미터 수를 바꾸지 않는다. PyTorch는 첫 가중치를 [h,d]로 저장해도 xWᵀ+b로 계산하므로 원소 수는 d×h로 같다."
        symbols={[
          ['d×h', '첫 층 가중치 원소 수'],
          ['h', '첫 층 편향 원소 수'],
          ['h×1', 'binary 출력층 가중치 원소 수'],
          ['1', 'binary 출력층 편향 원소 수'],
          ['P', '모델이 학습할 전체 scalar parameter 수'],
        ]}
      />

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {checks.map(([title, detail], index) => (
          <div key={title} className="grid gap-2 py-4 sm:grid-cols-[2rem_9rem_1fr] sm:gap-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <h3 className="text-sm font-bold">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck
        items={[
          '뉴런 여러 개의 계산을 하나의 행렬곱으로 바꾼다.',
          '두 선형층 사이에 활성화가 없으면 하나의 선형층으로 합쳐짐을 전개한다.',
          '샘플과 batch 입력에서 Linear layer의 출력 shape를 계산한다.',
          '샘플 하나에서만 통과하는 전치 행렬 코드를 batch-safe 계산으로 고친다.',
          '두 층 MLP의 순전파 값을 손으로 추적한다.',
          'logit과 확률을 구분한다.',
          'task에 맞는 출력 수와 loss 조합을 고른다.',
          'layer별 가중치와 편향을 합해 파라미터 수를 계산한다.',
        ]}
      />

      <p className="not-prose mt-8 text-sm leading-relaxed text-muted-foreground">
        아래 둘은 선택지가 아니라 역전파 전에 차례로 채울 두 계약이다. 먼저 hidden layer가 값을 어떻게 바꾸고 미분되는지 본 뒤, 출력 logit을 loss 하나로 바꾸는 법을 잇는다.
      </p>
      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        <Link to={articlePath('ai', 'activation-functions')} className="rounded-md border border-border p-4 transition-colors hover:bg-muted/20"><p className="text-xs font-semibold text-muted-foreground">먼저 · 내부 변환</p><p className="mt-1 text-sm font-bold">활성화 함수가 표현과 gradient를 바꾸는 법</p></Link>
        <Link to={articlePath('ai', 'cross-entropy')} className="rounded-md border border-border p-4 transition-colors hover:bg-muted/20"><p className="text-xs font-semibold text-muted-foreground">그다음 · 학습 목표</p><p className="mt-1 text-sm font-bold">Logit을 학습 목표로 바꾸는 cross-entropy</p></Link>
      </div>

      <SourceNotes sources={[
        { label: 'Deep Learning Book, Chapter 6', href: 'https://www.deeplearningbook.org/contents/mlp.html', note: 'Feedforward network, composition, output unit의 체계적 설명.' },
        { label: 'PyTorch Linear', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html', note: '입력의 마지막 차원을 보존해 변환하는 y=xAᵀ+b와 weight [out,in] 계약.' },
        { label: 'PyTorch BCEWithLogitsLoss', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html', note: 'Binary·multi-label에서 input과 target의 같은 shape, sigmoid 결합 계약.' },
        { label: 'PyTorch CrossEntropyLoss', href: 'https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html', note: '다중 클래스 logits [B,C]와 class-index target [B]의 기본 계약.' },
      ]} />
    </section>
  );
}
