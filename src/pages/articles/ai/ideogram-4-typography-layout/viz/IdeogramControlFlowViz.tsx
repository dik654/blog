import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import {
  BadgeCheck,
  Braces,
  CircleAlert,
  FileCheck2,
  Layers3,
  MoveRight,
  ScanText,
  Workflow,
} from 'lucide-react';
import StepViz, { type StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: '납품 조건을 prompt보다 먼저 고정한다',
    body: '정확한 문구, 허용 box와 palette를 pass/fail 계약으로 분리한다. 모델이 예쁜 그림을 내도 이 계약을 어기면 실패다.',
  },
  {
    label: '자연어를 model이 학습한 JSON 구조로 바꾼다',
    body: 'Magic prompt는 편의 도구다. 실제 model input은 설명, style, background와 element가 분리된 structured caption이다.',
  },
  {
    label: '여러 깊이의 text feature와 image token을 합친다',
    body: 'Qwen3-VL의 13개 layer hidden state가 서로 다른 의미 깊이를 제공하고, image latent token과 joint sequence를 이룬다.',
  },
  {
    label: '34개 single-stream block이 flow 방향을 예측한다',
    body: 'Text와 image token이 같은 attention graph를 지나고, timestep modulation이 현재 noise 단계에 맞는 velocity를 만들게 한다.',
  },
  {
    label: 'Sampler와 VAE 뒤에서 납품·권리 gate를 다시 연다',
    body: 'Exact string, box, palette, latency와 replay를 검사한다. 공개 weight·Apache code·상업 사용 권리는 별도 증거다.',
  },
];

type Node = {
  label: string;
  sub: string;
  detail: string;
  icon: LucideIcon;
  color: string;
};

const nodes: Node[] = [
  {
    label: 'Brief',
    sub: '문구 · box · palette',
    detail: '“여름 한정”을 exact string으로, 배치 범위를 0–1000 box로, 색을 uppercase hex로 고정',
    icon: FileCheck2,
    color: '#2563eb',
  },
  {
    label: 'Structured JSON',
    sub: '설명 · style · elements',
    detail: 'Plain prompt를 그대로 넣지 않고 CaptionVerifier가 검사할 수 있는 schema와 key order로 직렬화',
    icon: Braces,
    color: '#0f766e',
  },
  {
    label: 'Joint tokens',
    sub: '13-layer text + image',
    detail: '얕은 token 정보와 깊은 composition 의미를 모아 image latent token과 한 sequence로 결합',
    icon: Layers3,
    color: '#7c3aed',
  },
  {
    label: 'Single-stream DiT',
    sub: '34 blocks · velocity',
    detail: 'QK-RMSNorm, 3D MRoPE와 timestep modulation을 거쳐 다음 latent 이동 방향을 예측',
    icon: Workflow,
    color: '#c2410c',
  },
  {
    label: 'Release evidence',
    sub: 'pixel · replay · license',
    detail: 'Euler/CFG와 VAE decode 뒤 exact text와 layout을 검사하고 사용 권리까지 별도 승인',
    icon: BadgeCheck,
    color: '#15803d',
  },
];

function PipelineNode({ node, active, index }: { node: Node; active: boolean; index: number }) {
  const Icon = node.icon;
  return (
    <div
      data-ideogram-stage={index}
      data-active={active ? 'true' : 'false'}
      className={`min-w-0 border px-3 py-3 transition-all duration-300 ${
        active
          ? 'border-foreground/20 bg-background shadow-sm'
          : 'border-border/60 bg-muted/15 opacity-75'
      }`}
      style={{ borderRadius: 6 }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center border bg-background"
          style={{ borderColor: `${node.color}55`, color: node.color, borderRadius: 6 }}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black leading-tight">{node.label}</p>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{node.sub}</p>
        </div>
      </div>
      <div
        className="mt-3 h-1 w-full overflow-hidden bg-border/55"
        style={{ borderRadius: 999 }}
        aria-hidden="true"
      >
        <div
          className="h-full transition-all duration-300"
          style={{ width: active ? '100%' : '18%', backgroundColor: node.color }}
        />
      </div>
    </div>
  );
}

function ActiveDetail({ step }: { step: number }) {
  const node = nodes[step];
  const Icon = node.icon;
  return (
    <div className="grid min-w-0 gap-4 border-t border-border/60 pt-4 sm:grid-cols-[minmax(0,1.4fr)_minmax(12rem,0.8fr)]">
      <div className="flex min-w-0 gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center border bg-background"
          style={{ borderColor: `${node.color}66`, color: node.color, borderRadius: 6 }}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-black">{node.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{node.detail}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          ['입력', step < 2 ? 'brief' : step === 2 ? 'features' : 'latent'],
          ['변환', step === 0 ? 'freeze' : step === 1 ? 'schema' : step === 2 ? 'concat' : step === 3 ? 'predict' : 'verify'],
          ['증거', step === 4 ? 'gate' : 'trace'],
        ].map(([label, value]) => (
          <div key={label} className="min-w-0 border border-border/60 bg-muted/15 px-2 py-2" style={{ borderRadius: 5 }}>
            <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
            <p className="mt-1 break-words font-mono text-xs font-bold [overflow-wrap:anywhere]">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

type BriefFormat = 'natural' | 'json';
type GuidanceBranch = 'conditional' | 'unconditional';
type BoxPreset = 'valid' | 'reversed';

const boxValues: Record<BoxPreset, [number, number, number, number]> = {
  valid: [180, 120, 460, 880],
  reversed: [180, 880, 460, 120],
};

function IdeogramContractLab({
  format,
  setFormat,
  copy,
  setCopy,
  style,
  setStyle,
  color,
  setColor,
  boxPreset,
  setBoxPreset,
  guidance,
  setGuidance,
}: {
  format: BriefFormat;
  setFormat: (value: BriefFormat) => void;
  copy: string;
  setCopy: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  color: string;
  setColor: (value: string) => void;
  boxPreset: BoxPreset;
  setBoxPreset: (value: BoxPreset) => void;
  guidance: GuidanceBranch;
  setGuidance: (value: GuidanceBranch) => void;
}) {
  const box = boxValues[boxPreset];
  const boxValid = box[0] < box[2] && box[1] < box[3] && box.every((value) => value >= 0 && value <= 1000);
  const colorValid = /^#[0-9A-F]{6}$/.test(color);
  const exactReady = format === 'json' && copy.trim().length > 0 && boxValid && colorValid;
  const conceptualTextTokens = copy.trim()
    ? copy.trim().split(/\s+/).map((token) => `<text:${token}>`)
    : [];
  const activeTokens = guidance === 'conditional'
    ? [...conceptualTextTokens, '<image:0>', '<image:1>', '…']
    : ['<image:0>', '<image:1>', '…'];
  const status = exactReady
    ? '납품 계약 통과'
    : format === 'natural'
      ? '탐색용 입력: exact box를 강제할 field가 없습니다'
      : !copy.trim()
        ? '문구가 비어 있습니다'
        : !boxValid
          ? 'y-first box에서 시작 좌표가 끝 좌표보다 큽니다'
          : '색은 #RRGGBB 대문자 형식이어야 합니다';

  const segmentClass = (active: boolean) => (
    `min-h-11 border px-3 text-xs font-bold transition-colors ${
      active
        ? 'border-indigo-700/45 bg-indigo-500/[0.09] text-indigo-950 dark:text-indigo-100'
        : 'border-border bg-background text-muted-foreground hover:border-indigo-700/30 hover:text-foreground'
    }`
  );

  return (
    <section
      data-ideogram-contract-lab
      className="mt-6 min-w-0 border-y border-border/70 py-4"
      aria-labelledby="ideogram-contract-lab-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase text-muted-foreground">Brief contract lab</p>
          <h3 id="ideogram-contract-lab-title" className="mt-1 text-sm font-black">예쁜 이미지가 아니라 exact brief가 살아남는지 검사</h3>
        </div>
        <div
          data-contract-status={exactReady ? 'pass' : 'check'}
          className={`inline-flex min-h-9 items-center gap-2 border px-3 text-xs font-black ${
            exactReady
              ? 'border-emerald-700/35 bg-emerald-500/[0.08] text-emerald-800 dark:text-emerald-300'
              : 'border-amber-700/35 bg-amber-500/[0.08] text-amber-800 dark:text-amber-300'
          }`}
          style={{ borderRadius: 5 }}
          role="status"
          aria-live="polite"
        >
          {exactReady ? <BadgeCheck className="h-4 w-4" aria-hidden="true" /> : <CircleAlert className="h-4 w-4" aria-hidden="true" />}
          {status}
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="min-w-0 space-y-4">
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">입력 형식</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={segmentClass(format === 'natural')} aria-pressed={format === 'natural'} onClick={() => setFormat('natural')}>
                자연어
              </button>
              <button type="button" className={segmentClass(format === 'json')} aria-pressed={format === 'json'} onClick={() => setFormat('json')}>
                Structured JSON
              </button>
            </div>
          </fieldset>
          <label className="block min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Exact 문구</span>
            <input
              value={copy}
              onChange={(event) => setCopy(event.target.value)}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Ideogram exact 문구"
            />
          </label>
          <label className="block min-w-0">
            <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Style field</span>
            <select
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              className="min-h-11 w-full min-w-0 border border-border bg-background px-3 text-sm outline-none focus:border-foreground"
              style={{ borderRadius: 5 }}
              aria-label="Ideogram style"
            >
              <option value="editorial poster">Editorial poster</option>
              <option value="product label">Product label</option>
              <option value="wayfinding sign">Wayfinding sign</option>
            </select>
          </label>
        </div>

        <div className="min-w-0 space-y-4">
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">Bounding box · [y0, x0, y1, x1]</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={segmentClass(boxPreset === 'valid')} aria-pressed={boxPreset === 'valid'} onClick={() => setBoxPreset('valid')}>
                정상 순서
              </button>
              <button type="button" className={segmentClass(boxPreset === 'reversed')} aria-pressed={boxPreset === 'reversed'} onClick={() => setBoxPreset('reversed')}>
                x축 역전
              </button>
            </div>
          </fieldset>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_5rem] gap-3">
            <label className="min-w-0">
              <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Palette · #RRGGBB</span>
              <input
                value={color}
                onChange={(event) => setColor(event.target.value.toUpperCase())}
                className="min-h-11 w-full min-w-0 border border-border bg-background px-3 font-mono text-sm uppercase outline-none focus:border-foreground"
                style={{ borderRadius: 5 }}
                aria-label="Ideogram palette hex"
              />
            </label>
            <label>
              <span className="mb-2 block text-[11px] font-bold text-muted-foreground">Swatch</span>
              <input
                type="color"
                value={colorValid ? color : '#2563EB'}
                onChange={(event) => setColor(event.target.value.toUpperCase())}
                className="h-11 w-full cursor-pointer border border-border bg-background p-1"
                style={{ borderRadius: 5 }}
                aria-label="Ideogram palette swatch"
              />
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-muted-foreground">Guidance branch</legend>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className={segmentClass(guidance === 'conditional')} aria-pressed={guidance === 'conditional'} onClick={() => setGuidance('conditional')}>
                조건부 · text 유지
              </button>
              <button type="button" className={segmentClass(guidance === 'unconditional')} aria-pressed={guidance === 'unconditional'} onClick={() => setGuidance('unconditional')}>
                무조건부 · text 제거
              </button>
            </div>
          </fieldset>
        </div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 border-l-2 border-foreground/20 pl-3 text-xs sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
        <code className="min-w-0 whitespace-pre-wrap break-words text-[11px] leading-relaxed [overflow-wrap:anywhere]">
          {format === 'json'
            ? `{"text":"${copy}","style":"${style}","bounding_box":[${box.join(',')}],"color":"${color}"}`
            : `${copy} · ${style} · ${color}`}
        </code>
        <span className="font-bold text-muted-foreground">
          {guidance === 'conditional' ? 'text token 포함' : 'unconditional pass에서 text token 제거'}
        </span>
      </div>
      <div
        data-guidance-token-lane={guidance}
        className="mt-3 min-w-0 border border-border/60 bg-muted/15 px-3 py-3"
        style={{ borderRadius: 5 }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] font-black uppercase text-muted-foreground">Joint sequence · 개념 배열</p>
          <p className="text-[10px] font-bold text-muted-foreground">
            text lane {guidance === 'conditional' ? `${conceptualTextTokens.length}개 표시` : '0개'}
          </p>
        </div>
        <div className="mt-2 flex min-w-0 flex-wrap gap-1.5" aria-live="polite">
          {activeTokens.map((token, index) => (
            <code
              key={`${token}-${index}`}
              className={`max-w-full break-all border px-2 py-1 text-[10px] ${
                token.startsWith('<text:')
                  ? 'border-sky-700/30 bg-sky-500/[0.08] text-sky-800 dark:text-sky-300'
                  : 'border-border bg-background text-muted-foreground'
              }`}
              style={{ borderRadius: 4 }}
            >
              {token}
            </code>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
          실제 subword token 수는 tokenizer 결과에 따라 달라진다. 여기서는 branch를 바꾸면 text token 묶음 전체가
          sequence에서 사라지고 image token만 남는 구조 변화를 보여 준다.
        </p>
      </div>
    </section>
  );
}

export default function IdeogramControlFlowViz() {
  const [format, setFormat] = useState<BriefFormat>('natural');
  const [copy, setCopy] = useState('여름 한정');
  const [style, setStyle] = useState('editorial poster');
  const [color, setColor] = useState('#2563EB');
  const [boxPreset, setBoxPreset] = useState<BoxPreset>('valid');
  const [guidance, setGuidance] = useState<GuidanceBranch>('conditional');

  return (
    <div
      data-ideogram-control-flow
      className="scroll-mt-28
        [&_.step-viz]:my-8"
    >
      <StepViz
        steps={steps}
        headerClassName="!min-h-[200px] sm:!min-h-[135px]"
        stageClassName="!min-h-[368px] sm:!min-h-[360px]"
      >
        {(step) => (
          <div className="w-full min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">Production control trace</p>
                <p className="mt-1 text-sm font-black">Brief가 pixel과 사용 권리까지 살아남는가</p>
              </div>
              <ScanText className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </div>

            <div className="hidden min-w-0 grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-1 min-[900px]:grid">
              {nodes.map((node, index) => (
                <div key={node.label} className="contents">
                  <PipelineNode node={node} active={index === step} index={index} />
                  {index < nodes.length - 1 && (
                    <MoveRight className={`h-4 w-4 justify-self-center ${index < step ? 'text-foreground' : 'text-border'}`} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            <div className="min-[900px]:hidden">
              <PipelineNode node={nodes[step]} active index={step} />
              <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
                {step + 1} / {nodes.length} · {nodes[step].sub}
              </p>
            </div>

            <div className="mt-5">
              <ActiveDetail step={step} />
            </div>

          </div>
        )}
      </StepViz>
      <IdeogramContractLab
        format={format}
        setFormat={setFormat}
        copy={copy}
        setCopy={setCopy}
        style={style}
        setStyle={setStyle}
        color={color}
        setColor={setColor}
        boxPreset={boxPreset}
        setBoxPreset={setBoxPreset}
        guidance={guidance}
        setGuidance={setGuidance}
      />
    </div>
  );
}
