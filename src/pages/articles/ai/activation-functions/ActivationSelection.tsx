import { Link } from 'react-router-dom';
import { CapabilityCheck, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const choices = [
  ['일반 MLP/CNN hidden', '검증된 architecture 기본값', 'ReLU 또는 해당 모델이 채택한 GELU/SiLU부터 시작'],
  ['Transformer hidden', '저장된 가중치와 모델 구조의 호환', 'GELU, SiLU, gated MLP 등 원 구조를 유지'],
  ['Binary output', 'logit 기반 loss 사용 여부', '훈련 loss에는 logits, 해석 시 sigmoid'],
  ['Multi-class output', '서로 배타적인 class인지', '훈련 loss에는 logits, 해석 시 softmax'],
  ['Gate / bounded state', '0~1 또는 -1~1 범위가 필요한지', 'sigmoid 또는 tanh를 목적에 맞게 사용'],
];

export default function ActivationSelection() {
  return (
    <section id="selection" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">실전에서는 어떤 순서로 선택하고 진단할까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          새로운 함수를 무작정 비교하기 전에 architecture의 검증된 기본값을 기준선으로 둔다. 그다음 activation 분포,
          gradient norm, dead unit 비율, train/validation loss를 관찰하고 실제 실패 근거가 있을 때 바꾼다. 함수 변경은
          initialization과 저장된 모델 가중치·구조의 호환성까지 바꿀 수 있는 모델 설계 변경이다.
        </p>
      </div>

      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {choices.map(([position, question, start], index) => (
          <div key={position} className="grid gap-2 py-4 sm:grid-cols-[2rem_10rem_1fr] sm:gap-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span><h3 className="text-sm font-bold">{position}</h3><div className="text-sm leading-relaxed"><p>{question}</p><p className="mt-1 text-muted-foreground">시작점: {start}</p></div>
          </div>
        ))}
      </div>

      <CapabilityCheck items={[
        '선형층만 합성하면 하나의 선형 변환으로 축약됨을 설명한다.',
        '함수값과 도함수를 forward/backward 역할로 구분한다.',
        'Sigmoid와 tanh의 포화 영역을 직접 찾는다.',
        'ReLU의 양수 gradient와 dying unit 한계를 함께 설명한다.',
        'Hidden activation과 output activation을 구분한다.',
        '함수 변경 전에 activation 분포와 gradient를 관찰한다.',
      ]} />

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-2">
        <Link to={articlePath('ai', 'cross-entropy')} className="rounded-md border border-border p-4 transition-colors hover:bg-muted/20"><p className="text-xs font-semibold text-muted-foreground">다음</p><p className="mt-1 text-sm font-bold">출력 logits을 학습 목표로 만드는 cross-entropy</p></Link>
        <Link to={articlePath('ai', 'backprop-optimization')} className="rounded-md border border-border p-4 transition-colors hover:bg-muted/20"><p className="text-xs font-semibold text-muted-foreground">연결</p><p className="mt-1 text-sm font-bold">활성화 도함수가 계산 그래프를 거꾸로 흐르는 법</p></Link>
      </div>

      <SourceNotes sources={[
        { label: 'Understanding the difficulty of training deep feedforward neural networks', href: 'https://proceedings.mlr.press/v9/glorot10a.html', note: '포화 activation과 initialization이 signal propagation에 미치는 영향.' },
        { label: 'Rectified Linear Units Improve Restricted Boltzmann Machines', href: 'https://proceedings.mlr.press/v15/glorot11a.html', note: 'ReLU 계열의 초기 분석과 sparse activation.' },
        { label: 'Gaussian Error Linear Units', href: 'https://arxiv.org/abs/1606.08415', note: 'GELU 함수의 정의와 동기.' },
        { label: 'Searching for Activation Functions', href: 'https://arxiv.org/abs/1710.05941', note: 'Swish/SiLU 계열을 탐색한 연구.' },
      ]} />
    </section>
  );
}
