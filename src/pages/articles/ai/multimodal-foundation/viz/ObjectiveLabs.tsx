import { useMemo, useState } from 'react';
import { Braces, FileText, Image as ImageIcon, Shuffle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { handleTabKey } from './tabKeyboard';

type Strategy = {
  id: string;
  name: string;
  date: string;
  representationKind: 'discrete' | 'continuous';
  updateKind: 'sequential' | 'joint';
  imageRepresentation: string;
  textLoss: string;
  imageLoss: string;
  schedule: string;
  decoder: string;
  boundary: string;
};

const strategies: Strategy[] = [
  {
    id: 'emu3',
    name: 'Emu3',
    date: '2024 · Nature 2026',
    representationKind: 'discrete',
    updateKind: 'sequential',
    imageRepresentation: 'VQ visual code · discrete ID',
    textLoss: 'Next-token',
    imageLoss: 'Next-token',
    schedule: 'Text·image·video token을 한 autoregressive sequence로 예측',
    decoder: 'Visual tokenizer decoder',
    boundary: '같은 next-token objective를 쓰려면 먼저 image를 discrete code로 압축해야 한다.',
  },
  {
    id: 'janus',
    name: 'Janus-Pro',
    date: '2025-01',
    representationKind: 'discrete',
    updateKind: 'sequential',
    imageRepresentation: '생성용 VQ code · 이해용 semantic feature는 별도',
    textLoss: 'Next-token',
    imageLoss: 'Visual code next-token',
    schedule: '공유 transformer가 text 또는 image code를 한 칸씩 생성',
    decoder: 'VQ decoder',
    boundary: 'Transformer는 공유하지만 이해 encoder와 생성 tokenizer·head는 분리한다.',
  },
  {
    id: 'transfusion',
    name: 'Transfusion',
    date: '2024-08',
    representationKind: 'continuous',
    updateKind: 'joint',
    imageRepresentation: 'Continuous image patch',
    textLoss: 'Next-token',
    imageLoss: 'Image-level diffusion',
    schedule: 'Mixed sequence에서 text token별 LM loss와 image span 전체 diffusion loss를 결합',
    decoder: 'Modality-specific image decoder',
    boundary: '한 backbone과 한 loss는 다른 주장이다. 공식 runtime 구현은 공개되지 않았다.',
  },
  {
    id: 'janusflow',
    name: 'JanusFlow',
    date: '2024-11',
    representationKind: 'continuous',
    updateKind: 'joint',
    imageRepresentation: 'Continuous latent',
    textLoss: 'Autoregressive',
    imageLoss: 'Rectified flow regression',
    schedule: 'Language reasoning과 image flow path를 하나의 framework에서 결합',
    decoder: 'Latent image decoder',
    boundary: 'Flow는 visual code ID를 다음 token으로 고르는 과정이 아니라 연속 vector field를 따른다.',
  },
];

export function ObjectiveBranchLab() {
  const [selected, setSelected] = useState(0);
  const [representationNeed, setRepresentationNeed] = useState<'discrete' | 'continuous'>('discrete');
  const [updateNeed, setUpdateNeed] = useState<'sequential' | 'joint'>('sequential');
  const reduceMotion = useReducedMotion();
  const current = strategies[selected];
  const matches = strategies.filter((strategy) => (
    strategy.representationKind === representationNeed && strategy.updateKind === updateNeed
  ));

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-objective-branch-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-orange-700 dark:text-orange-300">OBJECTIVE LAB · backbone과 loss를 분리</p>
        <h3 className="mt-2 text-lg font-bold">같은 transformer 안에서도 image 위치가 배우는 신호는 다를 수 있다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">전략을 바꾸며 representation, loss, 생성 순서와 decoder가 함께 어떻게 바뀌는지 본다.</p>
      </figcaption>

      <div className="grid gap-px border-b border-border bg-border lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid gap-5 bg-muted/15 p-4 sm:grid-cols-2 sm:p-6">
          <DecisionGroup
            label="1 · Image 표현을 무엇으로 유지할까?"
            options={[
              { id: 'discrete', label: 'Discrete ID' },
              { id: 'continuous', label: 'Continuous latent' },
            ]}
            value={representationNeed}
            onChange={(value) => setRepresentationNeed(value as 'discrete' | 'continuous')}
          />
          <DecisionGroup
            label="2 · Image 위치를 어떻게 갱신할까?"
            options={[
              { id: 'sequential', label: '한 code씩' },
              { id: 'joint', label: 'Span을 함께' },
            ]}
            value={updateNeed}
            onChange={(value) => setUpdateNeed(value as 'sequential' | 'joint')}
          />
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-6" data-objective-match aria-live="polite">
          <p className="text-[12px] font-bold text-muted-foreground">이 글의 사례에서 맞는 branch</p>
          {matches.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {matches.map((match) => (
                <button
                  key={match.id}
                  type="button"
                  onClick={() => setSelected(strategies.indexOf(match))}
                  className="min-h-11 border border-orange-700 bg-orange-500/[0.07] px-3 text-xs font-bold hover:bg-orange-500/[0.13]"
                >
                  {match.name} 구조 보기
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">이 네 사례에는 직접 일치하는 설계가 없다. Representation과 update schedule 중 어느 제약을 바꿀지 먼저 정해야 한다.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4" role="tablist" aria-label="통합 멀티모달 생성 전략">
        {strategies.map((strategy, index) => (
          <button
            key={strategy.id}
            type="button"
            role="tab"
            id={`objective-tab-${strategy.id}`}
            aria-controls={`objective-panel-${strategy.id}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={(event) => handleTabKey(event, index, strategies.length, setSelected)}
            className={`min-h-16 bg-background px-3 py-3 text-left ${selected === index ? 'shadow-[inset_0_-3px_0_0_hsl(var(--foreground))]' : 'text-muted-foreground hover:bg-muted/30'}`}
          >
            <span className="block text-[12px] font-bold">{strategy.date}</span>
            <span className="mt-1 block text-sm font-bold text-foreground">{strategy.name}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        id={`objective-panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`objective-tab-${current.id}`}
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        className="min-w-0"
      >
        <div className="grid gap-px border-y border-border bg-border sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)]">
          <Branch icon={FileText} label="TEXT POSITION" value={current.textLoss} tone="bg-teal-500/[0.07]" />
          <div className="hidden items-center justify-center bg-background sm:flex"><Shuffle className="h-4 w-4 text-muted-foreground" aria-hidden="true" /></div>
          <Branch icon={ImageIcon} label="IMAGE OBJECTIVE" value={current.imageLoss} tone="bg-orange-500/[0.08]" />
        </div>
        <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Detail label="Image 표현" value={current.imageRepresentation} />
          <Detail label="생성 schedule" value={current.schedule} />
          <Detail label="Output decoder" value={current.decoder} />
        </div>
        <p className="border-t border-border bg-muted/20 px-4 py-5 text-sm font-semibold leading-relaxed sm:px-6">{current.boundary}</p>
      </motion.div>
    </figure>
  );
}

function DecisionGroup({ label, options, value, onChange }: { label: string; options: Array<{ id: string; label: string }>; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="text-xs font-bold">{label}</p>
      <div className="mt-2 grid grid-cols-2 gap-1">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={value === option.id}
            onClick={() => onChange(option.id)}
            className={`min-h-11 border px-2 text-xs font-bold ${value === option.id ? 'border-orange-700 bg-orange-700 text-white' : 'border-border bg-background hover:bg-muted/30'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Branch({ icon: Icon, label, value, tone }: { icon: typeof FileText; label: string; value: string; tone: string }) {
  return <div className={`min-w-0 p-4 sm:p-5 ${tone}`}><div className="flex items-center gap-2 text-[12px] font-bold text-muted-foreground"><Icon className="h-4 w-4" aria-hidden="true" />{label}</div><p className="mt-3 text-lg font-bold">{value}</p></div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 px-4 py-5 sm:px-5"><p className="text-[12px] font-bold text-muted-foreground">{label}</p><p className="mt-2 text-sm font-semibold leading-relaxed">{value}</p></div>;
}

export function MixedSequenceMaskLab() {
  const [mode, setMode] = useState<'discrete' | 'continuous'>('discrete');
  const reduceMotion = useReducedMotion();
  const isDiscrete = mode === 'discrete';

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-mixed-sequence-mask-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">RESPONSIBILITY MASK · 같은 sequence, 다른 loss 단위</p>
        <h3 className="mt-2 text-lg font-bold">Mask는 “보이는 위치”가 아니라 “정답을 책임질 위치”를 고른다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">Prompt, image 영역, text 답이 섞인 교육용 sequence에서 image 표현만 바꿔 본다. Context로 읽는 범위와 loss를 계산하는 범위는 같지 않다.</p>
      </figcaption>

      <div className="border-b border-border bg-muted/15 p-4 sm:p-6">
        <div className="grid max-w-xl grid-cols-2 gap-1" role="tablist" aria-label="Mixed sequence image objective">
          <button
            type="button"
            role="tab"
            aria-selected={isDiscrete}
            tabIndex={isDiscrete ? 0 : -1}
            onClick={() => setMode('discrete')}
            onKeyDown={(event) => handleTabKey(event, 0, 2, (index) => setMode(index === 0 ? 'discrete' : 'continuous'))}
            className={`min-h-11 border px-3 text-xs font-bold ${isDiscrete ? 'border-blue-700 bg-blue-700 text-white' : 'border-border bg-background'}`}
          >
            Discrete visual AR
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isDiscrete}
            tabIndex={!isDiscrete ? 0 : -1}
            onClick={() => setMode('continuous')}
            onKeyDown={(event) => handleTabKey(event, 1, 2, (index) => setMode(index === 0 ? 'discrete' : 'continuous'))}
            className={`min-h-11 border px-3 text-xs font-bold ${!isDiscrete ? 'border-blue-700 bg-blue-700 text-white' : 'border-border bg-background'}`}
          >
            Continuous image span
          </button>
        </div>
      </div>

      <motion.div
        key={mode}
        initial={reduceMotion ? false : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.18 }}
        className="grid gap-px bg-border sm:grid-cols-[0.8fr_1.4fr_0.9fr]"
        role="tabpanel"
      >
        <MaskBlock label="TEXT PROMPT" value="질문·조건" responsibility="Context로 읽음 · loss 0" tone="bg-muted/20" />
        <MaskBlock
          label="IMAGE REGION"
          value={isDiscrete ? '[v₁][v₂][v₃] …' : 'continuous latent span'}
          responsibility={isDiscrete ? '각 code 위치 M=1 · token별 CE' : 'span 전체가 image loss 1개 · diffusion/flow'}
          tone={isDiscrete ? 'bg-orange-500/[0.09]' : 'bg-violet-500/[0.09]'}
          accent
        />
        <MaskBlock label="TEXT ANSWER" value="[a₁][a₂] …" responsibility="각 answer 위치 M=1 · token별 CE" tone="bg-teal-500/[0.08]" />
      </motion.div>
      <p className="border-t border-border px-4 py-5 text-sm leading-relaxed text-muted-foreground sm:px-6">Discrete AR은 image code마다 정답 ID를 하나씩 둔다. Continuous 방식은 같은 2D 영역을 여러 token 정답으로 쪼개지 않고 image span 전체에 noise·velocity 회귀를 건다. 어떤 위치를 context로 읽는지와 어떤 loss가 그 위치를 책임지는지를 따로 기록해야 한다.</p>
    </figure>
  );
}

function MaskBlock({ label, value, responsibility, tone, accent = false }: { label: string; value: string; responsibility: string; tone: string; accent?: boolean }) {
  return (
    <div className={`min-w-0 p-4 sm:p-5 ${tone}`}>
      <p className="text-[12px] font-bold text-muted-foreground">{label}</p>
      <p className="mt-3 break-words font-mono text-sm font-bold">{value}</p>
      <p className={`mt-3 text-xs font-semibold leading-relaxed ${accent ? 'text-foreground' : 'text-muted-foreground'}`}>{responsibility}</p>
    </div>
  );
}

export function GradientBudgetLab() {
  const [textShare, setTextShare] = useState(60);
  const [imageWeight, setImageWeight] = useState(1);
  const reduceMotion = useReducedMotion();
  const metrics = useMemo(() => {
    const textSignal = textShare;
    const imageSignal = (100 - textShare) * imageWeight;
    const total = textSignal + imageSignal;
    return {
      text: (textSignal / total) * 100,
      image: (imageSignal / total) * 100,
    };
  }, [imageWeight, textShare]);

  return (
    <figure className="not-prose my-9 overflow-hidden rounded-md border border-border bg-background" data-gradient-budget-lab data-viz-canvas>
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <p className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">SIGNAL MIXER · 개념 장부</p>
        <h3 className="mt-2 text-lg font-bold">Loss weight만이 아니라 batch에 들어온 modality 비율도 update를 바꾼다</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">아래 수치는 실제 gradient norm이 아니라, sampling 비율과 loss weight가 함께 작용한다는 점을 보여 주는 정규화된 교육용 신호 장부다.</p>
      </figcaption>
      <div className="grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <div className="space-y-6 border-b border-border bg-muted/15 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <label className="text-xs font-bold"><span className="flex justify-between gap-3"><span>Text sample 비율</span><span className="font-mono">{textShare}%</span></span><input aria-label="Text sample share" className="mt-2 min-h-11 w-full accent-teal-700" type="range" min="10" max="90" step="5" value={textShare} onChange={(event) => setTextShare(Number(event.target.value))} /></label>
          <label className="text-xs font-bold"><span className="flex justify-between gap-3"><span>Image loss weight</span><span className="font-mono">{imageWeight.toFixed(1)}×</span></span><input aria-label="Image loss weight" className="mt-2 min-h-11 w-full accent-orange-700" type="range" min="0.5" max="3" step="0.5" value={imageWeight} onChange={(event) => setImageWeight(Number(event.target.value))} /></label>
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <div className="grid grid-cols-2 gap-px border border-border bg-border" aria-live="polite" aria-atomic="true">
            <div className="min-w-0 bg-background p-4">
              <p className="text-[12px] font-bold text-muted-foreground">TEXT SIGNAL</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums">{metrics.text.toFixed(1)}%</p>
            </div>
            <div className="min-w-0 bg-background p-4">
              <p className="text-[12px] font-bold text-muted-foreground">IMAGE SIGNAL</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums">{metrics.image.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-4 flex h-4 overflow-hidden rounded-sm bg-muted" aria-hidden="true">
            <motion.div
              data-gradient-text-segment
              className="h-full bg-teal-600"
              animate={{ width: `${metrics.text}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
            <motion.div
              data-gradient-image-segment
              className="h-full bg-orange-600"
              animate={{ width: `${metrics.image}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground"><Braces className="mr-2 inline h-4 w-4" aria-hidden="true" />Shared parameter는 두 gradient의 합을 받는다. 한 branch의 signal scale이 계속 크면 다른 modality의 feature가 밀릴 수 있어 per-modality validation과 gradient norm을 따로 본다.</p>
        </div>
      </div>
    </figure>
  );
}
