import { useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { Misconception, QuestionLead } from '@/components/learning/ArticleLearning';
import { useArticleTabs } from '@/components/learning/useArticleTabs';

type Mode = 'train' | 'generate' | 'evaluate';

const modes: Record<Mode, { label: string; stages: Array<[string, string]>; check: string }> = {
  train: { label: '학습', stages: [['x', 'data batch'], ['qφ', 'μ, logvar'], ['z', 'reparameterize'], ['pθ', 'reconstruct x']], check: 'Reconstruction와 KL을 함께 backward해 encoder와 decoder를 동시에 갱신한다.' },
  generate: { label: '생성', stages: [['p(z)', 'prior'], ['z', 'random sample'], ['pθ', 'decoder'], ['x̃', 'new sample']], check: 'Encoder와 입력 x는 필요 없다. Prior가 학습된 latent 영역과 맞아야 한다.' },
  evaluate: { label: '평가', stages: [['x', 'held-out data'], ['qφ', 'posterior'], ['metrics', 'ELBO·reconstruction'], ['samples', 'quality·coverage']], check: 'Reconstruction와 unconditional sample은 서로 다른 능력이므로 따로 측정한다.' },
};

function ModeExplorer() {
  const [mode, setMode] = useState<Mode>('train');
  const selected = modes[mode];
  const modeKeys = Object.keys(modes) as Mode[];
  const { getTabProps, panelProps } = useArticleTabs({ keys: modeKeys, value: mode, onChange: setMode });
  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-3 border-b border-border bg-muted/20" role="tablist" aria-label="VAE 실행 모드">
        {modeKeys.map((key, index) => <button key={key} type="button" {...getTabProps(key, index)} className={`min-h-12 border-b-2 px-2 text-sm font-bold ${mode === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{modes[key].label}</button>)}
      </div>
      <div {...panelProps} className="p-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:p-6">
        <div className="grid items-center gap-2 lg:grid-cols-[1fr_1.25rem_1fr_1.25rem_1fr_1.25rem_1fr]">
          {selected.stages.map(([symbol, description], index) => <div key={`${mode}-${symbol}-${index}`} className="contents"><div className={`min-w-0 rounded-md border p-3 text-center ${index === 2 ? 'border-blue-500/40 bg-blue-500/5' : 'border-border'}`}><p className="break-words font-mono text-sm font-bold">{symbol}</p><p className="mt-2 text-xs text-muted-foreground">{description}</p></div>{index < selected.stages.length - 1 && <div className="flex justify-center text-muted-foreground"><ArrowDown className="size-4 lg:hidden" aria-hidden="true" /><ArrowRight className="hidden size-4 lg:block" aria-hidden="true" /></div>}</div>)}
        </div>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">{selected.check}</p>
      </div>
    </div>
  );
}

export default function TrainingAndGeneration() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습, 복원, 생성은 서로 다른 데이터 흐름이다</h2>
      <QuestionLead
        question="학습 때 쓰던 encoder는 새 샘플을 생성할 때도 필요한가?"
        answer="아니다. 학습과 reconstruction은 x에서 posterior를 얻기 위해 encoder를 쓰지만, unconditional generation은 prior에서 z를 뽑아 decoder만 실행한다. 그래서 posterior와 prior가 맞지 않으면 복원은 좋아도 생성은 실패한다."
      />
      <ModeExplorer />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>구현에서 한 batch가 흐르는 순서</h3>
        <ol>
          <li>Encoder가 <code>mu, logvar</code>를 출력한다.</li>
          <li><code>std = exp(0.5 * logvar)</code>와 <code>eps = randn_like(std)</code>로 z를 만든다.</li>
          <li>Decoder가 reconstruction distribution의 파라미터를 출력한다.</li>
          <li>Sample별 reconstruction term과 latent 차원별 KL을 합친 뒤 batch 평균을 낸다.</li>
          <li>Validation에서는 ELBO뿐 아니라 reconstruction, prior sample, interpolation을 따로 기록한다.</li>
        </ol>
      </div>
      <Misconception>
        Training loss가 낮다는 사실만으로 prior sample 품질을 보장할 수 없다. Reconstruction term이 압도하거나 posterior가 prior와 다른 aggregate shape를 만들면 생성 경로에서 분포 차이가 드러난다.
      </Misconception>
    </section>
  );
}
