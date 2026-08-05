import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';

type Update = 'discriminator' | 'generator';

const updates: Record<Update, { label: string; stages: Array<[string, string]>; trainable: string; detached: string; target: string }> = {
  discriminator: { label: '1. Discriminator update', stages: [['x_real', 'target 1'], ['G(z).detach()', 'target 0'], ['BCE', 'real + fake'], ['step ψ', 'D만 갱신']], trainable: 'Dψ', detached: 'G output에서 gradient 차단', target: 'Real score ↑, fake score ↓' },
  generator: { label: '2. Generator update', stages: [['z', 'new noise'], ['Gθ(z)', 'fake'], ['Dψ(G(z))', 'target 1'], ['step θ', 'G만 갱신']], trainable: 'Gθ', detached: 'D weight는 freeze, input gradient는 유지', target: 'Fake score ↑' },
};

function UpdateExplorer() {
  const [update, setUpdate] = useState<Update>('discriminator');
  const selected = updates[update];
  const updateKeys = Object.keys(updates) as Update[];
  const { getTabProps, panelProps } = useArticleTabs({ keys: updateKeys, value: update, onChange: setUpdate });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20" role="tablist" aria-label="GAN 교대 업데이트 단계">
        {updateKeys.map((key, index) => <button key={key} type="button" {...getTabProps(key, index)} className={`min-h-12 border-b-2 px-2 text-xs font-bold sm:text-sm ${update === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{key === 'discriminator' ? 'D 업데이트' : 'G 업데이트'}</button>)}
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <p className="mb-4 text-sm font-bold">{selected.label}</p>
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_1.25rem_1fr_1.25rem_1fr_1.25rem_1fr]">
          {selected.stages.map(([symbol, note], index) => <div key={`${update}-${symbol}`} className="contents"><div className={`min-w-0 rounded-md border p-3 text-center ${index === 3 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="break-words font-mono text-xs font-bold sm:text-sm">{symbol}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p></div>{index < selected.stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
        </div>
        <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          {[['Trainable', selected.trainable], ['Gradient boundary', selected.detached], ['Update direction', selected.target]].map(([term, value]) => <div key={term} className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">{term}</dt><dd className="mt-2 text-xs font-medium leading-relaxed">{value}</dd></div>)}
        </dl>
      </div>
    </div>
  );
}

export default function AlternatingUpdates() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">두 optimizer는 같은 그래프에서 어디까지 움직일까?</h2>
      <QuestionLead
        question="왜 D loss와 G loss를 더해 한 번에 backward하지 않고 번갈아 update할까?"
        answer="두 모델은 서로 반대되는 target과 서로 다른 파라미터를 최적화한다. D step에서 G를 고정한 채 현재 fake를 분류하고, G step에서는 D의 판정 함수를 통과한 gradient로 G만 바꾼다."
      />
      <UpdateExplorer />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>균형은 accuracy 50% 하나로 판단하지 않는다</h3>
        <p>
          D accuracy가 50%인 이유는 완벽한 G 때문일 수도 있고, D가 전혀 학습하지 못했기 때문일 수도 있다. Real/fake logit
          histogram, 두 loss, gradient norm, generated sample의 diversity를 함께 봐야 한다. TTUR(Two Time-Scale Update Rule)은
          G와 D에 서로 다른 learning rate나 감소 속도를 주어 두 optimizer의 상대 dynamics를 조절한다. 보통 D가 더 빠른 시간척도에서
          현재 G에 반응하도록 두지만, “두 모델의 속도를 비슷하게 맞춘다”는 규칙은 아니다.
        </p>
      </div>
      <Misconception>
        G step에서 D의 parameter update를 막는다고 D forward를 no_grad로 감싸면 안 된다. D의 input에 대한 gradient가 끊겨 G까지 신호가 돌아오지 않는다.
      </Misconception>
    </section>
  );
}
