import { useState } from 'react';
import {
  BadgeCheck,
  Boxes,
  Gauge,
  GitCompareArrows,
  LockKeyhole,
  Route,
  type LucideIcon,
} from 'lucide-react';

type StageId = 'family' | 'path' | 'variant' | 'evidence';
type VariantId = 'base' | 'turbo';

type Stage = {
  id: StageId;
  index: string;
  label: string;
  icon: LucideIcon;
  question: string;
  proves: string;
  unproved: string;
};

const stages: Stage[] = [
  {
    id: 'family',
    index: '01',
    label: '계열 경계',
    icon: Boxes,
    question: '같은 이름 아래 어떤 산출물이 있는가?',
    proves: '공식 README가 설명하는 계열과 현재 checkpoint 공개 상태를 분리한다.',
    unproved: '소개된 변형이 모두 지금 다운로드 가능하다는 뜻은 아니다.',
  },
  {
    id: 'path',
    index: '02',
    label: 'T2I 실행',
    icon: Route,
    question: '현재 공개 코드에서 tensor는 어떻게 흐르는가?',
    proves: 'Caption feature와 noisy image latent가 refine·concat되어 transformer를 지난다.',
    unproved: 'Family 설명의 visual semantic token을 별도 T2I module로 구현했다고 단정할 수 없다.',
  },
  {
    id: 'variant',
    index: '03',
    label: 'Base·Turbo',
    icon: GitCompareArrows,
    question: '같은 prompt라도 왜 실행 계약이 달라지는가?',
    proves: 'Base는 50 NFE 품질·제어 경로, Turbo는 8 NFE 증류 경로로 공식 표가 구분한다.',
    unproved: 'Turbo가 모든 seed·style·hardware에서 Base보다 낫다는 뜻은 아니다.',
  },
  {
    id: 'evidence',
    index: '04',
    label: '재현 증거',
    icon: BadgeCheck,
    question: '결과 한 장을 어느 artifact와 비용에 귀속할 수 있는가?',
    proves: 'Checkpoint, revision, NFE, component, precision, device와 run log를 함께 고정한다.',
    unproved: 'Vendor benchmark나 gallery sample만으로 내 workflow의 latency·VRAM·품질은 증명되지 않는다.',
  },
];

const variants = {
  base: {
    label: 'Z-Image',
    status: '공개',
    nfe: '50 NFE',
    guidance: 'negative prompt·guidance 지원',
    use: '품질 탐색, 다양성, fine-tuning 출발점',
    tradeoff: '더 긴 denoising trajectory와 반복 비용',
  },
  turbo: {
    label: 'Z-Image-Turbo',
    status: '공개',
    nfe: '8 NFE',
    guidance: '공식 표에서 CFG·negative prompt 비활성',
    use: '빠른 preview와 반복 생성',
    tradeoff: '증류된 trajectory 안에서 제어와 다양성을 다시 검증',
  },
} as const;

const releases = [
  ['Z-Image', 'checkpoint 공개', true],
  ['Z-Image-Turbo', 'checkpoint 공개', true],
  ['Z-Image-Omni-Base', 'To be released', false],
  ['Z-Image-Edit', 'To be released', false],
] as const;

function TokenPath() {
  const nodes = [
    ['01', 'Caption feature', 'text encoder가 만든 조건 tensor'],
    ['02', 'Noise · context refiner', '두 입력을 각자의 표현 공간에서 정리'],
    ['03', 'Sequence concat', '공식 코드에서 관찰되는 unified 입력'],
    ['04', 'S3-DiT blocks', '같은 block 안에서 조건과 image latent를 혼합'],
    ['05', 'Latent prediction', 'solver가 다음 latent 상태를 계산할 방향'],
  ] as const;
  return (
    <ol className="divide-y divide-border border-y border-border">
      {nodes.map(([number, name, detail]) => (
        <li key={name} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[2.5rem_9rem_minmax(0,1fr)] sm:gap-3">
          <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
          <strong className="text-sm">{name}</strong>
          <span className="text-sm leading-6 text-muted-foreground">{detail}</span>
        </li>
      ))}
    </ol>
  );
}

export default function ZImageContractLab() {
  const [stageId, setStageId] = useState<StageId>('family');
  const [variantId, setVariantId] = useState<VariantId>('base');
  const stage = stages.find((item) => item.id === stageId) ?? stages[0];
  const variant = variants[variantId];
  const StageIcon = stage.icon;

  return (
    <div
      data-z-image-contract-lab
      data-stage={stageId}
      data-variant={variantId}
      className="not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Source-to-runtime lab</p>
        <h3 className="mt-1 text-base font-bold">이름보다 artifact와 증거를 먼저 고른다</h3>
      </header>

      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {stages.map((item) => {
          const Icon = item.icon;
          const active = item.id === stageId;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setStageId(item.id)}
              className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left transition-colors ${
                active ? 'bg-blue-500/[0.07]' : 'hover:bg-muted/35'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black text-muted-foreground">{item.index}</span>
                  <span className="block break-words text-xs font-bold leading-4">{item.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(17rem,0.8fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <StageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{stage.question}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                선택한 단계가 답할 수 있는 범위만 화면에 남긴다.
              </p>
            </div>
          </div>

          <div className="mt-5">
            {stageId === 'family' && (
              <div className="divide-y divide-border border-y border-border">
                {releases.map(([name, status, available]) => (
                  <div key={name} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center">
                    <span className="break-words text-sm font-semibold [overflow-wrap:anywhere]">{name}</span>
                    <span className={`inline-flex min-h-7 items-center gap-2 text-xs font-semibold ${
                      available ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      {available ? <BadgeCheck className="h-4 w-4" /> : <LockKeyhole className="h-4 w-4" />}
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {stageId === 'path' && <TokenPath />}

            {stageId === 'variant' && (
              <>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
                  {(Object.keys(variants) as VariantId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={id === variantId}
                      onClick={() => setVariantId(id)}
                      className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left text-sm font-bold ${
                        id === variantId ? 'bg-emerald-500/[0.07]' : 'hover:bg-muted/35'
                      }`}
                    >
                      {variants[id].label}
                    </button>
                  ))}
                </div>
                <dl className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                  {[
                    ['공개 상태', variant.status],
                    ['Denoiser 평가', variant.nfe],
                    ['조건 제어', variant.guidance],
                    ['적합한 목표', variant.use],
                    ['대가', variant.tradeoff],
                  ].map(([label, value], index) => (
                    <div key={label} className={`min-w-0 bg-background px-4 py-3 ${index === 4 ? 'sm:col-span-2' : ''}`}>
                      <dt className="text-[10px] font-bold uppercase text-muted-foreground">{label}</dt>
                      <dd className="mt-1 break-words text-sm leading-6 [overflow-wrap:anywhere]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {stageId === 'evidence' && (
              <ol className="divide-y divide-border border-y border-border">
                {[
                  ['Artifact', 'checkpoint name · revision · file hash'],
                  ['Path', 'Base/Turbo · NFE · solver · guidance'],
                  ['Components', 'text encoder · VAE · precision · offload'],
                  ['Machine', 'GPU · VRAM · RAM · software revision'],
                  ['Receipt', 'seed · peak memory · latency · output manifest'],
                ].map(([label, detail], index) => (
                  <li key={label} className="grid gap-2 py-3 sm:grid-cols-[2.5rem_7rem_minmax(0,1fr)] sm:gap-3">
                    <span className="font-mono text-xs font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                    <strong className="text-sm">{label}</strong>
                    <code className="min-w-0 break-words text-xs leading-6 text-muted-foreground [overflow-wrap:anywhere]">{detail}</code>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <div className="border-l-2 border-emerald-500/60 pl-3">
            <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">이 단계가 증명</p>
            <p className="mt-1 text-sm leading-6">{stage.proves}</p>
          </div>
          <div className="mt-5 border-l-2 border-amber-500/60 pl-3">
            <p className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">아직 증명하지 않음</p>
            <p className="mt-1 text-sm leading-6">{stage.unproved}</p>
          </div>
          <div className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            <Gauge className="mt-1 h-4 w-4 shrink-0" />
            <p>속도와 VRAM은 모델 이름의 속성이 아니라 이 artifact·component·machine 조합의 측정값이다.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
