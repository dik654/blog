import { Link } from 'react-router-dom';
import { CapabilityCheck, SourceNotes } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

export default function PerceptronHandoff() {
  return (
    <section id="handoff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">퍼셉트론에서 신경망으로 무엇이 바뀔까?</h2>
      <div className="not-prose my-8 divide-y divide-border border-y border-border">
        {[
          ['출력', '0 또는 1의 hard decision', '다음 층이 사용할 연속적인 activation'],
          ['표현력', 'hyperplane 하나', '여러 경계와 비선형 특징의 합성'],
          ['학습 신호', '맞음/틀림에 따른 이산 업데이트', '미분 가능한 loss의 gradient'],
          ['계산', '뉴런 하나의 내적', 'layer 단위 matrix multiplication과 batch'],
        ].map(([axis, one, network], index) => (
          <div key={axis} className="grid gap-2 py-4 sm:grid-cols-[2rem_7rem_1fr_1fr] sm:gap-4">
            <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span><h3 className="text-sm font-bold">{axis}</h3><p className="text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">퍼셉트론:</strong> {one}</p><p className="text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">신경망:</strong> {network}</p>
          </div>
        ))}
      </div>

      <CapabilityCheck items={[
        '입력, weight, bias로 퍼셉트론 score와 예측을 계산한다.',
        'Weight와 bias가 2차원 결정 경계에 미치는 영향을 설명한다.',
        '같은 오분류에서 두 번의 perceptron update를 계산하고 매번 결정 경계를 다시 그린다.',
        '선형 분리 가능한 데이터에서만 수렴 보장이 있음을 설명한다.',
        'XOR을 단일 hyperplane으로 분리할 수 없는 이유를 그린다.',
        '은닉층이 새로운 특징 공간을 만드는 이유를 설명한다.',
      ]} />

      <Link to={articlePath('ai', 'neural-network')} className="not-prose mt-4 inline-flex rounded-md bg-foreground px-3 py-2 text-sm font-semibold text-background hover:opacity-90">다층 신경망으로 이어서 보기</Link>

      <SourceNotes sources={[
        { label: 'The Perceptron', href: 'https://doi.org/10.1037/h0042519', note: 'Rosenblatt가 1958년에 발표한 perceptron 원 논문.' },
        { label: 'Perceptron convergence proof', href: 'https://www.cs.cornell.edu/courses/cs4780/2018fa/lectures/lecturenote03.html', note: '선형 분리 가능성과 수렴 조건을 전개한 Cornell 강의 노트.' },
      ]} />
    </section>
  );
}
