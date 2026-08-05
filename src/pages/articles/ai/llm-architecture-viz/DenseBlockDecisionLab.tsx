import { useMemo, useState, type ReactNode } from 'react';
import { Activity, Database, Gauge, GitCompareArrows } from 'lucide-react';

type DensePreset = {
  id: string;
  title: string;
  year: string;
  milestone: string;
  inherited: string;
  decision: string;
  consequence: string;
  boundary: string;
  hidden: number;
  queryHeads: number;
  kvHeads: number;
  headDimension: number;
  intermediate: number;
  layers: number;
  vocab: number;
  gated: boolean;
  tied: boolean;
  attention: string;
  position: string;
  norm: string;
  mlp: string;
  schedule: string;
  qkNorm: boolean;
};

const presets: DensePreset[] = [
  {
    id: 'gpt2',
    title: 'GPT-2 XL',
    year: '2019',
    milestone: '최소 기준점',
    inherited: 'decoder-only + causal mask',
    decision: 'absolute position · MHA · GELU FFN',
    consequence: '모든 head가 자기 K/V를 보관하고 모든 layer가 full attention을 수행한다.',
    boundary: '구조 기준선이지 현재 모델의 품질 기준선은 아니다.',
    hidden: 1600,
    queryHeads: 25,
    kvHeads: 25,
    headDimension: 64,
    intermediate: 6400,
    layers: 48,
    vocab: 50257,
    gated: false,
    tied: true,
    attention: 'causal MHA',
    position: 'learned absolute',
    norm: 'pre-LayerNorm',
    mlp: 'GELU · 2 projections',
    schedule: '48 full-attention layers',
    qkNorm: false,
  },
  {
    id: 'llama3',
    title: 'Llama 3 8B',
    year: '2024',
    milestone: '현대 표준형',
    inherited: 'pre-norm dense decoder',
    decision: 'RMSNorm · RoPE · GQA · SwiGLU',
    consequence: '32개 query head가 8개 K/V head를 공유해 cache와 K/V projection을 줄인다.',
    boundary: 'RoPE를 썼다는 사실만으로 훈련 길이 밖의 회상 품질이 보장되지는 않는다.',
    hidden: 4096,
    queryHeads: 32,
    kvHeads: 8,
    headDimension: 128,
    intermediate: 14336,
    layers: 32,
    vocab: 128256,
    gated: true,
    tied: false,
    attention: 'GQA · 4 Q per KV',
    position: 'RoPE',
    norm: 'pre-RMSNorm',
    mlp: 'SwiGLU · 3 projections',
    schedule: '32 full-attention layers',
    qkNorm: false,
  },
  {
    id: 'qwen3',
    title: 'Qwen3 8B',
    year: '2025',
    milestone: 'score 안정화',
    inherited: 'RoPE · GQA · SwiGLU',
    decision: 'Q/K bias 제거 · QK-Norm · untied output',
    consequence: 'Q와 K의 크기가 attention logit을 폭주시킬 수 있는 경로를 normalization으로 제한한다.',
    boundary: 'QK-Norm은 score scale을 안정화하지만 정답 token을 자동으로 고르는 장치는 아니다.',
    hidden: 4096,
    queryHeads: 32,
    kvHeads: 8,
    headDimension: 128,
    intermediate: 12288,
    layers: 36,
    vocab: 151936,
    gated: true,
    tied: false,
    attention: 'GQA + QK-Norm',
    position: 'RoPE',
    norm: 'pre-RMSNorm + QK-Norm',
    mlp: 'SwiGLU · 3 projections',
    schedule: '36 full-attention layers',
    qkNorm: true,
  },
  {
    id: 'gemma3',
    title: 'Gemma 3 27B',
    year: '2025',
    milestone: 'layer 역할 분리',
    inherited: 'dense GQA + gated FFN',
    decision: '5 local : 1 global · window 1,024',
    consequence: '대부분의 layer는 가까운 문맥만 읽고 주기적인 global layer가 먼 문맥을 다시 섞는다.',
    boundary: '128K 지원은 62개 layer 모두가 128K full attention을 한다는 뜻이 아니다.',
    hidden: 5376,
    queryHeads: 32,
    kvHeads: 16,
    headDimension: 128,
    intermediate: 21504,
    layers: 62,
    vocab: 262144,
    gated: true,
    tied: true,
    attention: 'GQA + QK-Norm',
    position: 'local/global RoPE',
    norm: 'pre/post RMSNorm',
    mlp: 'GeGLU · 3 projections',
    schedule: '52 local + 10 global',
    qkNorm: true,
  },
  {
    id: 'olmo3',
    title: 'OLMo 3 7B',
    year: '2025',
    milestone: '검산 가능한 공개형',
    inherited: 'dense MHA + QK-Norm',
    decision: 'output-normalized residual · 3 SWA : 1 full',
    consequence: 'sublayer 출력을 normalize해 residual에 더하고, 네 층마다 full attention으로 전역 정보를 섞는다.',
    boundary: '7B는 MHA를 유지하므로 같은 head 폭의 GQA 모델보다 KV cache가 크다.',
    hidden: 4096,
    queryHeads: 32,
    kvHeads: 32,
    headDimension: 128,
    intermediate: 11008,
    layers: 32,
    vocab: 100278,
    gated: true,
    tied: false,
    attention: 'MHA + QK-Norm',
    position: 'RoPE · YaRN on full',
    norm: 'normalize sublayer outputs',
    mlp: 'SwiGLU · 3 projections',
    schedule: '24 sliding + 8 full',
    qkNorm: true,
  },
];

function formatMillions(value: number) {
  return `${(value / 1_000_000).toFixed(2)}M`;
}

export default function DenseBlockDecisionLab() {
  const [activeId, setActiveId] = useState('qwen3');
  const [queryScale, setQueryScale] = useState(1);
  const model = presets.find((preset) => preset.id === activeId) ?? presets[0];

  const metrics = useMemo(() => {
    const queryWidth = model.queryHeads * model.headDimension;
    const kvWidth = model.kvHeads * model.headDimension;
    const attentionParameters = model.hidden * queryWidth
      + 2 * model.hidden * kvWidth
      + queryWidth * model.hidden;
    const ffnParameters = (model.gated ? 3 : 2) * model.hidden * model.intermediate;
    const embeddingParameters = model.hidden * model.vocab * (model.tied ? 1 : 2);
    const maxProjection = Math.max(attentionParameters, ffnParameters);

    const rawScore = (24 * queryScale) / Math.sqrt(2);
    // Per-head RMSNorm with gamma=1 and epsilon=0: both normalized vectors have dot product 1.92.
    const normalizedScore = 1.92 / Math.sqrt(2);

    return {
      queryWidth,
      kvWidth,
      attentionParameters,
      ffnParameters,
      embeddingParameters,
      attentionShare: (attentionParameters / maxProjection) * 100,
      ffnShare: (ffnParameters / maxProjection) * 100,
      rawScore,
      normalizedScore,
    };
  }, [model, queryScale]);

  return (
    <figure
      className="not-prose my-10 overflow-hidden rounded-md border border-border bg-background"
      data-dense-decision-lab
      data-viz-canvas
    >
      <figcaption className="border-b border-border px-4 py-5 sm:px-6">
        <div className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">DENSE BLOCK DECISION LAB</div>
        <h3 className="mt-2 text-lg font-bold leading-7">이름 대신 projection과 residual 경로를 읽는다</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          모델을 바꾸면 같은 dense decoder 안에서 무엇이 계승되고 무엇이 달라지는지, 그 변화가 weight와 score에 어디서 나타나는지 함께 갱신된다.
        </p>
      </figcaption>

      <div className="border-b border-border bg-muted/15 p-3 sm:p-4" role="tablist" aria-label="Dense model preset">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
          {presets.map((preset, index) => (
            <button
              key={preset.id}
              type="button"
              role="tab"
              aria-selected={model.id === preset.id}
              aria-controls="dense-decision-panel"
              onClick={() => setActiveId(preset.id)}
              className={`min-h-12 border px-3 py-2 text-left text-xs font-bold leading-5 transition-colors motion-reduce:transition-none ${model.id === preset.id ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-muted'}`}
            >
              <span className="font-mono opacity-70">{String(index + 1).padStart(2, '0')}</span>
              <span className="ml-2">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="dense-decision-panel" role="tabpanel" className="min-w-0">
        <div className="grid border-b border-border lg:grid-cols-[13rem_minmax(0,1fr)]">
          <div className="border-b border-border bg-sky-50/70 p-5 dark:bg-sky-950/20 lg:border-b-0 lg:border-r">
            <div className="font-mono text-3xl font-bold tabular-nums text-sky-800 dark:text-sky-200">{model.year}</div>
            <div className="mt-2 text-sm font-bold">{model.milestone}</div>
            <div className="mt-4 text-xs leading-5 text-muted-foreground">{model.title} · {model.layers} layers</div>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <DecisionStep label="계승한 계약" value={model.inherited} tone="bg-background" />
            <DecisionStep label="새 설계 결정" value={model.decision} tone="bg-amber-50/70 dark:bg-amber-950/15" />
            <DecisionStep label="실행 결과" value={model.consequence} tone="bg-emerald-50/60 dark:bg-emerald-950/15" />
          </div>
        </div>

        <div className="grid gap-px border-b border-border bg-border sm:grid-cols-2 lg:grid-cols-5" data-dense-signature>
          <Signature icon={<GitCompareArrows />} label="Attention" value={model.attention} />
          <Signature icon={<Activity />} label="Position" value={model.position} />
          <Signature icon={<Gauge />} label="Norm" value={model.norm} />
          <Signature icon={<Database />} label="Feature mixer" value={model.mlp} />
          <Signature icon={<GitCompareArrows />} label="Layer schedule" value={model.schedule} />
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,0.95fr)]">
          <div className="min-w-0 border-b border-border p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-muted-foreground">한 block의 projection weight</div>
                <div className="mt-1 text-sm font-semibold">bias·norm·embedding 제외</div>
              </div>
              <div className="text-right font-mono text-xs leading-5 text-muted-foreground">
                d={model.hidden.toLocaleString()} · q={metrics.queryWidth.toLocaleString()} · kv={metrics.kvWidth.toLocaleString()} · m={model.intermediate.toLocaleString()}
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <ProjectionBar
                label="Attention Q·K·V·O"
                value={formatMillions(metrics.attentionParameters)}
                width={metrics.attentionShare}
                color="bg-sky-600"
                dataName="data-dense-attention-parameters"
              />
              <ProjectionBar
                label={`${model.gated ? 'Gated' : 'GELU'} FFN`}
                value={formatMillions(metrics.ffnParameters)}
                width={metrics.ffnShare}
                color="bg-amber-500"
                dataName="data-dense-ffn-parameters"
              />
            </div>

            <div className="mt-6 grid gap-3 border-y border-border py-4 sm:grid-cols-3">
              <SmallMetric label="Q : KV head" value={`${model.queryHeads} : ${model.kvHeads}`} />
              <SmallMetric label="Embedding 행" value={model.vocab.toLocaleString()} />
              <SmallMetric label="입·출력 matrix" value={model.tied ? '1개 공유' : '2개 분리'} />
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              Attention은 <strong className="text-foreground">d·q + 2d·kv + q·d</strong>, FFN은 {model.gated ? '세' : '두'} projection을 센 값이다.
              Embedding까지 포함하면 이 preset은 약 <strong className="text-foreground">{formatMillions(metrics.embeddingParameters)}</strong>이지만, block 비용과 vocab 비용은 분리해서 읽어야 한다.
            </p>
          </div>

          <div className="min-w-0 p-5 sm:p-6" data-qk-scale-lab>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-muted-foreground">QK-Norm 크기 실험</div>
                <div className="mt-1 text-sm font-semibold">q=(3,4), k=(4,3), dₕ=2 · γ=1, ε=0</div>
              </div>
              <span className={`border px-2 py-1 text-xs font-bold ${model.qkNorm ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200' : 'border-border text-muted-foreground'}`}>
                {model.qkNorm ? '이 모델에 적용' : '비교 실험'}
              </span>
            </div>

            <label className="mt-6 block">
              <span className="flex items-baseline justify-between gap-3 text-xs font-bold text-muted-foreground">
                Query 크기 배율 α
                <strong className="text-base tabular-nums text-foreground">{queryScale.toFixed(1)}×</strong>
              </span>
              <input
                className="mt-3 w-full accent-blue-600"
                aria-label="QK query scale"
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={queryScale}
                onChange={(event) => setQueryScale(Number(event.target.value))}
              />
            </label>

            <div className="mt-5 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2">
              <ScoreMetric
                label="Raw scaled dot logit"
                value={metrics.rawScore.toFixed(3)}
                detail="α가 커지면 같은 방향이어도 함께 증가"
                tone="bg-rose-50/70 dark:bg-rose-950/15"
                dataName="data-dense-raw-score"
              />
              <ScoreMetric
                label="QK-normalized logit"
                value={metrics.normalizedScore.toFixed(3)}
                detail="양의 α는 RMS에서 상쇄"
                tone="bg-emerald-50/70 dark:bg-emerald-950/15"
                dataName="data-dense-normalized-score"
              />
            </div>
            <p className="mt-4 text-xs leading-6 text-muted-foreground">
              실제 Qwen3는 head별 RMSNorm과 학습 가능한 scale γ를 쓴다. 이 toy 계산은 γ=1, ε=0으로 두어 양의 크기 배율이 상쇄되는 핵심만 분리했다. 어느 token이 정답인지는 데이터와 학습이 결정한다.
            </p>
          </div>
        </div>

        <div className="border-t border-border bg-muted/15 px-5 py-4 text-sm leading-6 text-muted-foreground" data-dense-boundary>
          <strong className="text-foreground">증거 경계.</strong> {model.boundary}
        </div>
      </div>
    </figure>
  );
}

function DecisionStep({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`${tone} min-w-0 p-5`}>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div className="mt-2 text-sm font-semibold leading-6">{value}</div>
    </div>
  );
}

function Signature({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0 bg-background px-4 py-4">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
        <span className="[&>svg]:h-3.5 [&>svg]:w-3.5" aria-hidden="true">{icon}</span>
        {label}
      </div>
      <div className="mt-2 break-words text-sm font-semibold leading-5">{value}</div>
    </div>
  );
}

function ProjectionBar({ label, value, width, color, dataName }: { label: string; value: string; width: number; color: string; dataName: string }) {
  return (
    <div {...{ [dataName]: value }}>
      <div className="flex items-center justify-between gap-4 text-sm">
        <span className="font-medium">{label}</span>
        <strong className="font-mono tabular-nums">{value}</strong>
      </div>
      <div className="mt-2 h-2 overflow-hidden bg-muted">
        <div className={`h-full ${color} transition-[width] duration-300 motion-reduce:transition-none`} style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function SmallMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-bold tabular-nums">{value}</div>
    </div>
  );
}

function ScoreMetric({ label, value, detail, tone, dataName }: { label: string; value: string; detail: string; tone: string; dataName: string }) {
  return (
    <div className={`${tone} min-w-0 p-4`}>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div className="mt-2 font-mono text-2xl font-bold tabular-nums" {...{ [dataName]: value }}>{value}</div>
      <div className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</div>
    </div>
  );
}
