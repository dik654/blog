import { useState } from 'react';
import { Braces, Image as ImageIcon, Layers3, LockKeyhole, ScanSearch, UnlockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { handleTabKey } from './tabKeyboard';

const encodingStrategies = [
  {
    id: 'single-vq',
    label: '단일 VQ 표현',
    understand: '복원 가능한 local code를 이해 입력에도 사용',
    generate: '같은 code를 image output vocabulary로 사용',
    tradeoff: '세부 복원에는 유리하지만 high-level semantic reasoning에 맞춘 feature를 따로 고를 수 없다.',
  },
  {
    id: 'single-semantic',
    label: '단일 Semantic 표현',
    understand: '객체·속성과 text 정렬에 맞춘 feature 사용',
    generate: '같은 feature에 pixel detail 복원 책임도 요구',
    tradeoff: '이해에는 자연스럽지만 색·texture·공간 detail을 decoder가 되살릴 정보가 부족할 수 있다.',
  },
  {
    id: 'decoupled',
    label: 'Janus · 분리',
    understand: 'SigLIP semantic feature → understanding adaptor',
    generate: 'VQ code embedding → generation adaptor',
    tradeoff: '입력 표현은 분리하지만 autoregressive transformer의 sequence reasoning은 공유한다.',
  },
] as const;

export function JanusEncodingDecisionLab() {
  const [selected, setSelected] = useState(2);
  const reduceMotion = useReducedMotion();
  const current = encodingStrategies[selected];

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-janus-encoding-decision-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-cyan-700 dark:text-cyan-300">PAPER CLAIM LAB · 공유할 것과 분리할 것</p>
        <h3 className="mt-2 text-lg font-bold">Janus의 핵심은 두 모델을 붙인 것이 아니라 visual encoding 경계를 옮긴 것이다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">세 전략을 바꾸며 이해와 생성이 같은 image에서 서로 다른 정보 해상도를 요구한다는 논문의 문제 설정을 확인한다.</p>
      </figcaption>

      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Visual encoding 전략 선택">
        {encodingStrategies.map((strategy, index) => (
          <button
            key={strategy.id}
            type="button"
            role="tab"
            id={`janus-encoding-tab-${strategy.id}`}
            aria-controls={`janus-encoding-panel-${strategy.id}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleTabKey(event, index, encodingStrategies.length, setSelected)}
            className={`min-h-14 min-w-0 bg-background px-2 py-2 text-[12px] font-bold sm:px-3 ${
              selected === index ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {strategy.label}
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        id={`janus-encoding-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`janus-encoding-tab-${current.id}`}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
      >
        <div className="grid gap-px border-y border-border bg-border sm:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)]">
          <Lane icon={ScanSearch} label="UNDERSTANDING" value={current.understand} tone="bg-cyan-500/[0.07]" />
          <div className="hidden items-center justify-center bg-background sm:flex"><Layers3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" /></div>
          <Lane icon={ImageIcon} label="GENERATION" value={current.generate} tone="bg-orange-500/[0.08]" />
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold"><Braces className="h-4 w-4 text-muted-foreground" aria-hidden="true" />결정의 대가</div>
          <p className="text-sm font-semibold leading-relaxed text-muted-foreground">{current.tradeoff}</p>
        </div>
      </motion.div>
    </figure>
  );
}

function Lane({ icon: Icon, label, value, tone }: { icon: typeof ScanSearch; label: string; value: string; tone: string }) {
  return (
    <div className={`min-w-0 p-4 sm:p-5 ${tone}`}>
      <p className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</p>
      <p className="mt-3 text-sm font-bold leading-relaxed">{value}</p>
    </div>
  );
}

const trainingStages = [
  {
    id: 'stage-1',
    order: '01',
    name: 'Adaptor · Image head 정렬',
    steps: '10,000 steps',
    ratio: '이해 1 : Text 0 : 생성 1',
    train: ['Understanding adaptor', 'Generation adaptor', 'Image prediction head'],
    freeze: ['두 visual encoder', 'LLM'],
    goal: 'Frozen visual space와 language input space를 연결하고 image code 예측의 첫 경로를 연다.',
  },
  {
    id: 'stage-2',
    order: '02',
    name: 'Unified pretraining',
    steps: '180,000 steps',
    ratio: '이해 2 : Text 3 : 생성 5',
    train: ['LLM', 'Adaptors', 'Image prediction head'],
    freeze: ['Pretrained visual encoder 경계'],
    goal: 'Pure text, multimodal understanding과 visual generation을 한 training mixture에서 공동 학습한다.',
  },
  {
    id: 'stage-3',
    order: '03',
    name: 'Supervised fine-tuning',
    steps: '24,000 steps',
    ratio: '이해 7 : Text 3 : 생성 10',
    train: ['LLM', 'Understanding path', 'Generation adaptor · head'],
    freeze: ['Generation encoder'],
    goal: '세 task의 instruction following을 함께 다듬되 생성 tokenizer의 code 공간은 고정한다.',
  },
] as const;

export function JanusTrainingStageLab() {
  const [selected, setSelected] = useState(0);
  const reduceMotion = useReducedMotion();
  const current = trainingStages[selected];

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-janus-training-stage-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-300">TRAINING RECEIPT · 무엇을 언제 움직이는가</p>
        <h3 className="mt-2 text-lg font-bold">세 단계는 같은 data를 세 번 돌리는 것이 아니라 trainable boundary를 바꾼다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">단계를 선택하면 논문 Table 1의 step·data ratio와 본문이 명시한 update·freeze 경계를 함께 읽는다.</p>
      </figcaption>

      <div className="grid grid-cols-3 gap-px bg-border" role="tablist" aria-label="Janus 학습 단계 선택">
        {trainingStages.map((stage, index) => (
          <button
            key={stage.id}
            type="button"
            role="tab"
            id={`janus-training-tab-${stage.id}`}
            aria-controls={`janus-training-panel-${stage.id}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleTabKey(event, index, trainingStages.length, setSelected)}
            className={`min-h-16 min-w-0 bg-background px-2 py-3 text-left sm:px-4 ${
              selected === index ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            <span className="font-mono text-[12px] font-bold">{stage.order}</span>
            <span className="mt-1 block text-xs font-bold leading-snug text-foreground">{stage.name}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        id={`janus-training-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`janus-training-tab-${current.id}`}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="grid lg:grid-cols-[minmax(0,1fr)_17rem]"
      >
        <div className="min-w-0 border-b border-border p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[12px] font-bold text-muted-foreground">STAGE {current.order}</p>
          <h4 className="mt-2 text-lg font-bold">{current.name}</h4>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.goal}</p>

          <div className="mt-6 grid gap-px border border-border bg-border sm:grid-cols-2">
            <ModuleList icon={UnlockKeyhole} label="UPDATE" items={current.train} tone="text-emerald-700 dark:text-emerald-300" />
            <ModuleList icon={LockKeyhole} label="FREEZE" items={current.freeze} tone="text-blue-700 dark:text-blue-300" />
          </div>
        </div>
        <dl className="min-w-0 divide-y divide-border bg-muted/15 p-4 sm:p-6">
          <TrainingMetric label="Optimization" value={current.steps} />
          <TrainingMetric label="Data mixture" value={current.ratio} />
          <TrainingMetric label="읽을 때 주의" value="Data ratio는 표본 mixture이고 loss weight와 같은 숫자가 아니다." />
        </dl>
      </motion.div>
    </figure>
  );
}

function ModuleList({ icon: Icon, label, items, tone }: { icon: typeof LockKeyhole; label: string; items: readonly string[]; tone: string }) {
  return (
    <div className="min-w-0 bg-background p-4">
      <p className={`flex items-center gap-2 text-[12px] font-bold ${tone}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</p>
      <ul className="mt-3 space-y-2 text-xs font-semibold leading-relaxed text-muted-foreground">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function TrainingMetric({ label, value }: { label: string; value: string }) {
  return <div className="py-4 first:pt-0 last:pb-0"><dt className="text-[12px] font-bold text-muted-foreground">{label}</dt><dd className="mt-2 text-sm font-bold leading-relaxed">{value}</dd></div>;
}
