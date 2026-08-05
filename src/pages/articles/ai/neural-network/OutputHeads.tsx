import { Link } from 'react-router-dom';
import { articlePath } from '@/lib/paths';

const heads = [
  { task: '회귀', output: '실수 k개', logits: '[B,k]', target: '실수 [B,k]', prediction: '값 자체', loss: 'MSE · MAE · Huber' },
  { task: 'Binary 분류', output: 'logit 1개', logits: '[B,1]', target: '0/1 실수 [B,1]', prediction: 'sigmoid 확률', loss: 'BCE with logits' },
  { task: '다중 클래스', output: 'class logit C개', logits: '[B,C]', target: 'int64 class index [B]', prediction: 'softmax 분포', loss: 'Cross-entropy' },
  { task: 'Multi-label', output: 'label logit C개', logits: '[B,C]', target: '0/1 실수 [B,C]', prediction: 'label별 sigmoid', loss: 'label별 BCE with logits' },
];

export default function OutputHeads() {
  return (
    <section id="output-layer" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">출력층은 무엇을 기준으로 정해야 할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          은닉층은 표현을 만들지만 출력층은 정답의 자료형과 shape를 맞춰야 한다. 먼저 문제 하나가 몇 개의 숫자를
          예측해야 하는지 정하고, 그다음 그 숫자를 확률이나 실수로 해석하는 변환과 손실 함수를 함께 고른다.
        </p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {heads.map((head, index) => (
          <div key={head.task} className="grid gap-3 py-5 sm:grid-cols-[2rem_8rem_1fr] sm:gap-5">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
            <div><h3 className="text-sm font-bold">{head.task}</h3><p className="mt-1 text-xs text-muted-foreground">{head.output}</p></div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-4">
              <div><dt className="text-xs text-muted-foreground">모델 출력</dt><dd className="mt-1 font-mono font-semibold">{head.logits}</dd></div>
              <div><dt className="text-xs text-muted-foreground">정답 target</dt><dd className="mt-1 font-mono font-semibold">{head.target}</dd></div>
              <div><dt className="text-xs text-muted-foreground">해석</dt><dd className="mt-1 font-medium">{head.prediction}</dd></div>
              <div><dt className="text-xs text-muted-foreground">대표 loss</dt><dd className="mt-1 font-medium">{head.loss}</dd></div>
            </dl>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 logits를 그대로 loss에 넘기는 API가 많을까?</h3>
        <p>
          확률을 먼저 계산하고 log를 취하면 아주 작은 확률에서 수치 오차가 커질 수 있다. 그래서 프레임워크의
          cross-entropy 계열 함수는 logits에서 log-softmax 또는 log-sigmoid를 안정적으로 결합한다. 자세한 확률과
          loss 유도는 <Link to={articlePath('ai', 'cross-entropy')}>크로스 엔트로피 글</Link>에서 이어진다.
        </p>
        <p>
          특히 다중 클래스와 multi-label은 모델 출력 shape가 둘 다 <code>[B,C]</code>여도 target 계약이 다르다.
          다중 클래스의 기본 target은 샘플마다 정답 class 하나를 가리키는 <code>[B]</code> 정수 index다. Multi-label은
          한 샘플에서 여러 label이 동시에 참일 수 있으므로 출력과 같은 <code>[B,C]</code> 0/1 실수 행렬을 사용한다.
        </p>
      </div>
    </section>
  );
}
