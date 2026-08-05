import { useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { QuestionLead } from '@/components/learning/ArticleLearning';

type ModelKey = 'skipgram' | 'cbow';

const models: Record<ModelKey, { label: string; input: ReactNode; hidden: ReactNode; output: ReactNode; note: string }> = {
  skipgram: { label: 'Skip-gram', input: <>중심 단어 <Math>{String.raw`w_I`}</Math></>, hidden: <>입력 embedding <Math>{String.raw`v_{w_I}`}</Math></>, output: <>주변 단어 <Math>{String.raw`w_O`}</Math></>, note: '한 중심 단어에서 window 안의 여러 positive pair를 만든다.' },
  cbow: { label: 'CBOW', input: <>주변 단어 집합 <Math>{String.raw`C`}</Math></>, hidden: <>embedding 평균 <Math>{String.raw`h`}</Math></>, output: <>중심 단어 <Math>{String.raw`w_t`}</Math></>, note: '주변 정보를 합쳐 중심 하나를 예측하며 단어 순서는 사용하지 않는다.' },
};

function ObjectiveExplorer() {
  const [model, setModel] = useState<ModelKey>('skipgram');
  const selected = models[model];
  const stages = [
    { title: '01 · 입력', body: selected.input, tone: 'border-teal-600/35 bg-teal-500/[0.055] text-teal-800 dark:text-teal-300' },
    { title: '02 · 표현', body: selected.hidden, tone: 'border-violet-500/40 bg-violet-500/[0.065] text-violet-800 dark:text-violet-300' },
    { title: '03 · 예측 target', body: selected.output, tone: 'border-lime-600/40 bg-lime-500/[0.065] text-lime-800 dark:text-lime-300' },
  ];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="Word2Vec objective 선택">
        {(Object.keys(models) as ModelKey[]).map((key) => <button key={key} type="button" role="tab" aria-selected={model === key} onClick={() => setModel(key)} className={`min-h-11 border-b-2 px-3 text-sm font-bold ${model === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{models[key].label}</button>)}
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid items-center gap-3 lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)]">
          {stages.map((stage, index) => <div key={stage.title} className="contents"><div className={`flex min-h-24 min-w-0 flex-col justify-center rounded-md border p-4 text-center ${stage.tone}`}><p className="text-xs font-bold">{stage.title}</p><p className="mt-3 text-sm font-semibold text-foreground">{stage.body}</p></div>{index < stages.length - 1 && <div className="flex justify-center text-lime-700"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
        </div>
        <p className="mt-4 min-h-10 text-xs leading-relaxed text-muted-foreground">{selected.note}</p>
      </div>
    </div>
  );
}

export default function PredictionObjectives() {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CBOW와 Skip-gram은 무엇을 반대로 예측할까?</h2>
      <QuestionLead
        question="두 모델은 서로 다른 embedding을 정의하는가, 학습 example의 방향만 다른가?"
        answer="둘 다 input embedding과 output embedding의 dot product로 단어 관계를 학습한다. Skip-gram은 중심에서 주변을, CBOW는 주변의 평균에서 중심을 예측한다."
      />
      <ObjectiveExplorer />
      <div className="not-prose my-6 grid min-w-0 gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{h_{SG}}_{\text{Skip-gram 입력 표현}}=\underbrace{v_{w_I}}_{\text{중심 단어 vector}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border p-3"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{h_{CBOW}}_{\text{CBOW 입력 표현}}=\frac{1}{|C|}\sum_{c\in C}\underbrace{v_c}_{\text{주변 단어 vector}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-blue-500/40 bg-blue-500/5 p-3 sm:col-span-2"><Math display className="my-0 text-xs sm:text-base">{String.raw`\underbrace{s(w_O,w_I)}_{\text{두 역할의 pair score}}=\underbrace{u_{w_O}^{\top}v_{w_I}}_{\text{방향이 맞을수록 큰 내적}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="input matrix V에서 고른 vector v와 output matrix U에서 고른 vector u의 dot product가 pair score다. 함께 나타난 pair의 score는 올리고, noise pair의 score는 내리도록 두 행렬을 함께 학습한다."
        symbols={[
          [String.raw`v_w`, '중심 또는 입력 token을 표현하는 input embedding'],
          [String.raw`u_w`, '예측 target 역할의 output embedding'],
          [String.raw`C`, 'CBOW에 입력하는 context token 집합'],
          [String.raw`s`, '두 단어가 context pair일 가능성을 나타내는 정규화 전 점수'],
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 입력과 출력 행렬이 두 개일까?</h3>
        <p>
          “중심으로 등장하는 역할”과 “context target으로 등장하는 역할”은 objective 안에서 비대칭이다. 두 matrix를 분리하면
          각 역할에 맞는 vector를 학습할 수 있다. 학습 뒤에는 input vector를 쓰는 경우가 흔하지만, input·output vector를
          합치거나 평균하는 선택도 가능하므로 평가 기준과 구현을 함께 기록해야 한다.
        </p>
        <h3>Full softmax가 만드는 병목</h3>
        <p>
          어휘 크기가 V이면 한 target의 확률을 정규화하려고 모든 V개 output vector와 dot product를 계산해야 한다. Word2Vec의
          효율성은 얕은 network 자체보다 이 전체 정규화를 negative sampling이나 hierarchical softmax로 피한 데서 나온다.
        </p>
      </div>
    </section>
  );
}
