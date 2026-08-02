import { ArrowDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { BeginnerBridge, ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

const stages = [
  { symbol: 'x', title: '입력', body: '관측 공간 · 8 features', tone: 'border-blue-600 bg-blue-500/[0.05] text-blue-700 dark:text-blue-300' },
  { symbol: 'z', title: '병목 code', body: 'latent 공간 · 2 features', tone: 'border-teal-600 bg-teal-500/[0.07] text-teal-700 dark:text-teal-300' },
  { symbol: 'x̂', title: '복원', body: '관측 공간 · 8 features', tone: 'border-violet-600 bg-violet-500/[0.05] text-violet-700 dark:text-violet-300' },
];

export default function ReconstructionObjective() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정답 label 없이 무엇을 학습할 수 있을까?</h2>
      <BeginnerBridge title="긴 메모를 짧게 줄였다가 원래 뜻을 되살리는 압축 놀이부터 시작합니다.">
        누군가 정답 이름을 붙여 주지 않아도 원본 메모는 이미 있다. 메모를 아주 짧은 표현으로 바꾼 뒤 다시 원본에 가깝게 복원하도록 연습하면, 짧은 표현에는 복원에 꼭 필요한 구조가 남아야 한다. Autoencoder는 입력 자체를 문제이자 정답으로 쓰는 이 학습을 신경망으로 만든다.
      </BeginnerBridge>
      <QuestionLead
        question="고양이·개 같은 label이 없는데 neural network의 target은 어디서 얻을까?"
        answer="입력 x 자체를 target으로 삼아 압축한 code z에서 x를 복원하게 한다. 이 reconstruction task를 잘하려면 encoder와 decoder가 데이터에서 반복되는 구조를 이용해야 한다."
      />
      <ConceptPrimer
        items={[
          { term: 'encoder', meaning: '입력을 더 유용하거나 작은 latent representation으로 바꾸는 함수다.', why: '복원에 필요한 정보를 code z로 모으는 학습 경로를 만든다.' },
          { term: 'decoder', meaning: 'latent code를 관측 공간의 reconstruction으로 바꾸는 함수다.', why: 'code가 입력 정보를 얼마나 보존했는지 출력 공간에서 검사하게 한다.' },
          { term: 'self-supervision', meaning: '데이터 일부나 데이터 자체에서 학습 target을 자동으로 만드는 방식이다.', why: '외부 label 없이도 대규모 데이터에서 prediction task를 구성한다.' },
        ]}
      />
      <Link
        to={articlePath('ai', 'foundation-training-step')}
        className="not-prose my-6 block rounded-md border border-border px-4 py-3 text-sm leading-relaxed transition-colors hover:bg-muted/20"
      >
        <strong>받아오는 계약:</strong> 앞 글에서 닫은 forward → loss → backward → update 순서는 그대로다.
        여기서는 외부 label <Math>{String.raw`y`}</Math> 대신 입력 <Math>{String.raw`x`}</Math> 자체를 target으로 바꾼다.
      </Link>

      <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
        <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5"><span className="text-sm font-bold">넓은 입력에서 좁은 code로, 다시 입력 공간으로</span><span className="font-mono text-[10px] font-bold text-teal-700 dark:text-teal-300">8 → 2 → 8</span></figcaption>
        <div className="grid items-center p-4 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,0.62fr)_2rem_minmax(0,1fr)] lg:p-6">
          {stages.map((stage, index) => (
            <div key={stage.title} className="contents">
              <div className={`min-w-0 rounded-md border border-l-4 p-4 text-center ${stage.tone}`}>
                <p className="font-mono text-2xl font-bold">{stage.symbol}</p>
                <p className="mt-2 text-sm font-bold text-foreground">{stage.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{stage.body}</p>
              </div>
              {index < stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}
            </div>
          ))}
        </div>
        <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2"><p className="bg-teal-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Encoder fφ</strong>가 복원에 필요한 정보를 z에 모은다.</p><p className="bg-violet-500/[0.035] px-4 py-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Decoder gψ</strong>가 z의 충분성을 x̂에서 검사한다.</p></div>
      </figure>

      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{z}_{\text{압축한 latent code}}=\underbrace{f_\phi(x)}_{\text{encoder가 필요한 표현을 추출}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`\underbrace{\hat x}_{\text{입력의 복원}}=\underbrace{g_\psi(z)}_{\text{decoder가 관측 공간으로 펼침}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3 sm:col-span-2"><Math display className="my-0 text-xs sm:text-base">{String.raw`\mathcal{L}_{AE}(\phi,\psi)=\underbrace{\mathbb{E}_{x\sim p_{data}}\!\left[\mathcal{L}_{rec}(x,\hat x)\right]}_{\text{데이터 전체에서 평균낸 복원 비용}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3 sm:col-span-2"><Math display className="my-0 text-sm sm:text-base">{String.raw`(\phi^*,\psi^*)=\underbrace{\arg\min_{\phi,\psi}\mathcal{L}_{AE}}_{\text{encoder와 decoder를 함께 학습}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="encoder 파라미터 φ와 decoder 파라미터 ψ를 함께 바꿔 데이터 평균 reconstruction loss를 줄인다. label y 대신 입력 x가 target이라는 점 외에는 forward, loss, backward, optimizer의 학습 루프가 그대로 적용된다."
        symbols={[
          [String.raw`x`, '데이터에서 뽑은 입력 샘플'],
          [String.raw`z`, 'encoder가 만든 latent representation'],
          [String.raw`\hat x`, 'decoder가 예측한 reconstruction'],
          [String.raw`\mathcal{L}_{rec}`, '입력과 reconstruction의 차이를 측정하는 목적 함수'],
        ]}
      />
    </section>
  );
}
