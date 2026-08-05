import { ArrowDown, ArrowRight, Calculator, GitBranch, RefreshCw } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, Misconception, QuestionLead } from '@/components/learning/ArticleLearning';

const passes = [
  {
    icon: Calculator,
    label: 'Forward',
    direction: '입력에서 손실로',
    keeps: 'activation과 중간 계산',
    output: 'scalar loss L',
    tone: 'border-blue-600 bg-blue-500/[0.05] text-blue-700 dark:text-blue-300',
  },
  {
    icon: GitBranch,
    label: 'Backward',
    direction: '손실에서 입력으로',
    keeps: '각 연산의 local derivative',
    output: '모든 parameter gradient',
    tone: 'border-cyan-600 bg-cyan-500/[0.05] text-cyan-700 dark:text-cyan-300',
  },
  {
    icon: RefreshCw,
    label: 'Update',
    direction: 'gradient를 parameter로',
    keeps: 'optimizer state',
    output: '새 parameter θ′',
    tone: 'border-emerald-600 bg-emerald-500/[0.05] text-emerald-700 dark:text-emerald-300',
  },
];

function TwoPassMap() {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="text-sm font-semibold">역전파의 입력과 출력 경계</span>
        <span className="font-mono text-[10px] font-bold text-cyan-700 dark:text-cyan-300">LOSS → GRADIENT</span>
      </figcaption>
      <div className="grid items-stretch p-4 sm:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] sm:p-5">
        {passes.map((pass, index) => {
          const Icon = pass.icon;
          return (
            <div key={pass.label} className="contents">
              <div className={`relative min-w-0 rounded-sm border border-t-2 p-4 ${pass.tone}`}>
                <div className="flex items-start justify-between gap-3"><span className="font-mono text-2xl font-extrabold leading-none opacity-75">0{index + 1}</span><Icon className="h-5 w-5 opacity-80" aria-hidden="true" /></div>
                <h3 className="mt-3 text-base font-bold text-foreground">{pass.label}</h3>
                <dl className="mt-3 space-y-2 text-xs leading-relaxed text-foreground">
                  <div><dt className="text-muted-foreground">방향</dt><dd className="font-medium">{pass.direction}</dd></div>
                  <div><dt className="text-muted-foreground">필요한 상태</dt><dd className="font-medium">{pass.keeps}</dd></div>
                  <div><dt className="text-muted-foreground">결과</dt><dd className="font-medium">{pass.output}</dd></div>
                </dl>
              </div>
              {index < passes.length - 1 && <div className="flex h-8 items-center justify-center text-muted-foreground sm:h-auto" aria-hidden="true"><ArrowDown className="h-4 w-4 sm:hidden" /><ArrowRight className="hidden h-4 w-4 sm:block" /></div>}
            </div>
          );
        })}
      </div>
      <p className="border-t border-border bg-cyan-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5"><strong className="text-foreground">역전파가 끝나는 곳은 gradient다.</strong> 파라미터 변경은 그 다음 optimizer 단계의 책임이다.</p>
    </figure>
  );
}

export default function CoreOverview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">역전파는 정확히 무엇을 계산할까?</h2>
      <BeginnerBridge title="조립품의 최종 오차를 보고 어느 나사를 얼마나 돌릴지 거꾸로 찾는 장면부터 시작합니다.">
        완성품 길이가 목표보다 4.5mm 길다는 사실만으로는 수많은 나사 중 무엇을 고칠지 알 수 없다. 각 부품을 조금 움직였을 때 최종 길이가 얼마나 변하는지 거꾸로 추적해야 한다. 신경망에서는 최종 오차가 손실이고, 각 나사를 조금 바꿀 때의 영향이 기울기다.
      </BeginnerBridge>
      <QuestionLead
        question="손실이 4.5라는 사실만으로 수백만 개의 가중치를 어떻게 따로 고칠 수 있을까?"
        answer="손실 숫자 하나를 각 파라미터의 변화율로 분해한다. 역전파는 계산 그래프를 거꾸로 방문하며 local derivative를 연결해 모든 파라미터의 gradient를 구하는 알고리즘이다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          순전파는 현재 파라미터로 예측과 손실을 만든다. 하지만 손실 하나만 보아서는 어느 가중치가 얼마나 책임이 있는지
          알 수 없다. 파라미터 하나를 아주 조금 바꿨을 때 손실이 얼마나 변하는지를 모두 계산해야 한다. 그 변화율을 모은
          것이 gradient다.
        </p>
        <p>
          함수를 처음부터 파라미터별로 다시 미분하면 중복 계산이 너무 많다. 역전파는 순전파의 중간값과 각 연산의 작은
          미분 규칙을 저장해 두고, 손실에서 시작한 하나의 신호를 그래프의 역순으로 재사용한다. 이것이 reverse-mode
          automatic differentiation을 신경망에 적용한 형태다.
        </p>
      </div>

      <TwoPassMap />

      <div data-formula-pair>
        <Math display>{String.raw`
\underbrace{g}_{\text{역전파의 출력}}
=
\underbrace{\nabla_{\theta}\mathcal{L}}_{\text{모든 파라미터의 gradient}}
`}</Math>
        <Math display>{String.raw`
\underbrace{g_i}_{\text{i번째 원소}}
=
\underbrace{\frac{\partial\mathcal{L}}{\partial\theta_i}}_{\text{파라미터를 키울 때 loss 변화율}}
`}</Math>
        <FormulaNote
          meaning="역전파의 출력 g는 파라미터와 같은 구조를 가진 gradient다. 각 원소는 해당 파라미터를 조금 키울 때 손실이 어느 방향으로 얼마나 변하는지 나타낸다."
          symbols={[
            [String.raw`\mathcal{L}`, '순전파가 만든 scalar loss'],
            [String.raw`\theta`, '모델의 모든 학습 가능한 파라미터'],
            [String.raw`\partial\mathcal{L}/\partial\theta_i`, 'i번째 파라미터에 대한 손실의 local sensitivity'],
            [String.raw`\nabla_\theta\mathcal{L}`, '모든 파라미터 미분을 모은 gradient'],
          ]}
        />
      </div>

      <ConceptPrimer
        items={[
          { term: '계산 그래프', meaning: '값을 node로, 값을 만드는 연산을 edge 관계로 기록한 그래프다.', why: '복잡한 식을 작은 local operation의 연결로 바꾼다.' },
          { term: 'Local derivative', meaning: '한 연산의 출력 변화가 바로 앞 입력 변화에 얼마나 민감한지 나타낸다.', why: '각 연산은 자기 규칙만 알면 되고 전체 식을 알 필요가 없다.' },
          { term: 'Upstream gradient', meaning: '현재 node의 출력이 최종 손실에 미친 영향이다.', why: 'local derivative와 곱해 앞 node로 보낼 gradient를 만든다.' },
          { term: 'Graph gradient accumulation', meaning: '한 번의 backward 안에서 여러 경로가 같은 node로 보낸 gradient를 더하는 chain-rule 규칙이다.', why: 'Residual connection과 parameter sharing이 있는 계산 그래프에서 필수다.' },
          { term: 'Framework .grad accumulation', meaning: 'PyTorch 같은 framework가 여러 backward 호출의 결과를 parameter의 .grad에 자동으로 계속 더하는 저장 규칙이다.', why: '의도한 여러 microbatch 누적이 아니라면 optimizer step마다 zero_grad로 이전 값을 비워야 한다.' },
        ]}
      />

      <Misconception>
        역전파는 파라미터를 업데이트하지 않는다. 역전파는 gradient를 계산하고, SGD나 AdamW 같은 optimizer가 그 값을 읽어 실제 파라미터를 바꾼다.
      </Misconception>
    </section>
  );
}
