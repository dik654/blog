import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crop, Images, Layers3, ScanLine } from 'lucide-react';
import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { articlePath } from '@/lib/paths';

type EditMode = 'latent' | 'mask' | 'instruction' | 'references';

const editModes = {
  latent: {
    label: 'Latent img2img',
    short: '전체 latent 재생성',
    icon: Layers3,
    appearance: true,
    semantics: false,
    mask: false,
    references: 1,
    changeScope: '전체 frame',
    changeWidth: 100,
    change: 58,
    identity: 76,
    background: 70,
    subjectState: '변형 위험',
    backgroundState: '변형 위험',
    reason: 'Source latent는 있지만 바꿀 영역을 따로 잠그지 않는다.',
  },
  mask: {
    label: 'Mask repair',
    short: '지정 영역만 교체',
    icon: Crop,
    appearance: true,
    semantics: false,
    mask: true,
    references: 1,
    changeScope: 'mask 안쪽',
    changeWidth: 38,
    change: 78,
    identity: 97,
    background: 98,
    subjectState: '잠금',
    backgroundState: '잠금',
    reason: '공간 mask가 denoiser의 자유도를 가장 직접적으로 줄인다.',
  },
  instruction: {
    label: 'Instruction edit',
    short: '의미와 외형을 함께 조건화',
    icon: ScanLine,
    appearance: true,
    semantics: true,
    mask: false,
    references: 1,
    changeScope: '지시 대상',
    changeWidth: 64,
    change: 88,
    identity: 86,
    background: 83,
    subjectState: '의미 보존',
    backgroundState: '검증 필요',
    reason: 'Vision semantics가 변경 의도를 읽고 source latent가 외형 기준을 제공한다.',
  },
  references: {
    label: 'Multi-reference',
    short: '제품·인물·style 기준 추가',
    icon: Images,
    appearance: true,
    semantics: true,
    mask: false,
    references: 3,
    changeScope: '참조 조합',
    changeWidth: 82,
    change: 91,
    identity: 94,
    background: 86,
    subjectState: 'reference 고정',
    backgroundState: '검증 필요',
    reason: '여러 reference가 identity와 style을 분리해 고정하지만 충돌 가능성도 늘린다.',
  },
} as const;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

function EditContractLab() {
  const [mode, setMode] = useState<EditMode>('instruction');
  const [strength, setStrength] = useState(55);
  const active = editModes[mode];
  const evidence = useMemo(() => {
    const delta = strength - 50;
    const change = clamp(active.change + delta * 0.55);
    const identityPenalty = mode === 'mask' ? Math.max(0, delta) * 0.04 : Math.max(0, delta) * 0.24;
    const backgroundPenalty = mode === 'mask' ? Math.max(0, delta) * 0.03 : Math.max(0, delta) * 0.3;
    const identity = clamp(active.identity - identityPenalty);
    const background = clamp(active.background - backgroundPenalty);
    return {
      change,
      identity,
      background,
      spill: clamp(100 - Math.min(identity, background)),
    };
  }, [active, mode, strength]);

  const metrics = [
    ['요청 변경', evidence.change, 'target label'],
    ['identity 보존', evidence.identity, 'subject fixture'],
    ['배경 보존', evidence.background, 'non-target fixture'],
    ['편집 누출', evidence.spill, '낮을수록 안전'],
  ] as const;
  const identitySafe = evidence.identity >= 82;
  const backgroundSafe = evidence.background >= 82;

  return (
    <figure
      aria-label="ComfyUI instruction image editing 실행 흐름"
      className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background"
      data-comfy-runtime-viz
      data-edit-contract-lab
      data-mode={mode}
      data-change={evidence.change}
      data-identity={evidence.identity}
      data-background={evidence.background}
      data-spill={evidence.spill}
    >
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-300">EDIT CONTRACT LAB</span>
        <h3 className="mt-1 text-base font-bold">바꿀 조건 하나와 보존 증거 세 개를 같은 화면에서 비교한다</h3>
      </figcaption>

      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-4" role="group" aria-label="편집 방식">
        {(Object.keys(editModes) as EditMode[]).map((key) => {
          const item = editModes[key];
          const Icon = item.icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={mode === key}
              onClick={() => setMode(key)}
              className={`min-h-20 min-w-0 bg-background p-3 text-left transition-colors hover:bg-muted/25 lg:min-h-16 ${mode === key ? 'shadow-[inset_0_-3px_0_0_theme(colors.blue.600)]' : 'text-muted-foreground'}`}
            >
              <span className="flex items-center gap-2 text-xs font-bold"><Icon className="h-4 w-4 shrink-0" />{item.label}</span>
              <span className="mt-1 block text-xs leading-relaxed">{item.short}</span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 border-b border-border p-4 sm:p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex min-h-20 items-center gap-3 rounded-md border border-border bg-muted/15 px-3 sm:min-h-14">
            <span className="shrink-0 font-mono text-xs font-bold text-muted-foreground">ROUTE</span>
            <p className="min-w-0 text-xs leading-relaxed">{active.reason}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="활성 condition 경로">
            {[
              ['source latent', active.appearance ? 'active' : 'off'],
              ['vision semantics', active.semantics ? 'active' : 'off'],
              ['spatial mask', active.mask ? 'active' : 'off'],
              ['references', `${active.references}`],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-md border border-border p-2.5">
                <span className="block text-xs text-muted-foreground">{label}</span>
                <strong className={`mt-1 block font-mono text-xs ${value === 'off' ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{value}</strong>
              </div>
            ))}
          </div>

          <div className="mt-4 grid min-h-40 grid-cols-3 overflow-hidden rounded-md border border-border bg-muted/10" aria-label="편집 허용 영역">
            <div className="flex min-w-0 flex-col justify-between border-r border-border p-3">
              <span className="text-xs font-bold text-muted-foreground">제품</span>
              <div className="-space-x-2 mx-auto my-3 flex min-h-12 max-w-full items-center justify-center overflow-hidden px-1" aria-label={`reference ${active.references}개`}>
                {Array.from({ length: active.references }, (_, index) => (
                  <span
                    key={index}
                    className="h-8 w-8 shrink-0 rounded-full border-2 border-emerald-600/50 bg-emerald-500/10 shadow-[0_0_0_2px_hsl(var(--background))] sm:h-10 sm:w-10"
                  />
                ))}
              </div>
              <strong className={`break-words text-center text-xs ${
                identitySafe
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {identitySafe ? 'identity 보존 통과' : 'identity 보존 주의'}
              </strong>
            </div>
            <div className="flex min-w-0 flex-col justify-between border-r border-border bg-blue-500/[0.06] p-3">
              <span className="text-xs font-bold text-blue-700 dark:text-blue-300">변경 영역</span>
              <div className="my-4 flex min-h-11 items-center rounded-sm border border-blue-600/25 bg-background/80 p-1">
                <div
                  data-edit-scope
                  className="relative flex min-h-9 min-w-14 items-center justify-center overflow-hidden rounded-sm border-y-2 border-blue-600/60 bg-background px-1 text-center font-mono text-xs font-black leading-tight [overflow-wrap:anywhere]"
                  style={{ width: `${active.changeWidth}%`, maxWidth: '100%' }}
                >
                  <span
                    aria-hidden="true"
                    data-edit-change-fill
                    className="absolute inset-y-0 left-0 bg-blue-500/20 transition-[width]"
                    style={{ width: `${evidence.change}%` }}
                  />
                  <span className="relative">{active.changeScope}</span>
                </div>
              </div>
              <strong className="text-center text-xs text-blue-700 dark:text-blue-300">
                {active.mask ? '공간 제한' : '의미·강도 제한'}
              </strong>
            </div>
            <div className="flex min-w-0 flex-col justify-between p-3">
              <span className="text-xs font-bold text-muted-foreground">배경</span>
              <div className="my-3 grid grid-cols-3 gap-1">
                {Array.from({ length: 9 }, (_, index) => <span key={index} className="aspect-square rounded-sm border border-border bg-background" />)}
              </div>
              <strong className={`break-words text-center text-xs ${
                backgroundSafe
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-amber-700 dark:text-amber-300'
              }`}>
                {backgroundSafe ? '배경 보존 통과' : '배경 보존 주의'}
              </strong>
            </div>
          </div>
        </div>

        <aside className="min-w-0 p-4 sm:p-5">
          <label className="block min-w-0 text-xs font-bold">
            Edit strength
            <output className="float-right font-mono">{strength}%</output>
            <span className="mt-1 flex min-h-11 items-center">
              <input aria-label="edit strength" type="range" min="10" max="90" step="5" value={strength} onChange={(event) => setStrength(Number(event.target.value))} className="h-11 w-full cursor-pointer accent-blue-600" />
            </span>
          </label>
          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-1" aria-label="편집 증거">
            {metrics.map(([label, value, note]) => {
              const inverse = label === '편집 누출';
              const safe = inverse ? value <= 18 : value >= 82;
              return (
                <div key={label}>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-xs font-bold">{label}</span>
                    <span className={`font-mono text-xs font-black ${safe ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>{value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><span className={`block h-full ${safe ? 'bg-emerald-600' : 'bg-amber-500'}`} style={{ width: `${value}%` }} /></div>
                  <span className="mt-1 block text-xs text-muted-foreground">{note}</span>
                </div>
              );
            })}
          </div>
        </aside>
      </div>

      <p className="border-t border-border bg-muted/15 px-4 py-3 text-xs font-semibold leading-relaxed text-muted-foreground sm:px-5">
        점수는 condition ownership을 비교하기 위한 상대 교육값이다. 실제 채택은 같은 input·seed·revision의 OCR, identity와 non-target pixel fixture로 판정한다.
      </p>
    </figure>
  );
}

const modes = [
  ['Text-to-image', 'Prompt만으로 장면을 처음 만든다.', '원본 보존 조건이 없다.'],
  ['Img2img', '입력 image를 latent로 바꾸고 다시 denoise한다.', 'Denoise strength가 원본과 새 결과의 거리를 크게 좌우한다.'],
  ['Mask inpaint', 'Mask 안쪽만 교체하고 바깥을 고정한다.', '영역 경계가 분명한 작은 수리에 가장 예측 가능하다.'],
  ['Instruction edit', 'Image와 자연어 지시를 함께 해석한다.', '객체·문구·스타일처럼 의미를 이해해야 하는 변경에 맞다.'],
] as const;

const choices = [
  {
    title: 'FLUX.2',
    signal: '통합 생성·편집 + 다중 reference',
    use: '여러 제품·인물·style reference를 한 장면에 일관되게 결합하거나 최대 4MP 편집이 필요할 때',
    caveat: 'Variant별 API/open-weight·license·VRAM이 다르므로 [pro]/[flex]/[dev]/[klein]을 구분한다.',
  },
  {
    title: 'FLUX.1 Kontext',
    signal: '한 이미지의 맥락을 유지하는 반복 편집',
    use: '기존 Kontext workflow를 재현하거나 single-reference instruction edit의 원리를 배울 때',
    caveat: 'BFL은 새 프로젝트에 FLUX.2를 권장한다. 현재 최상위 기본값이 아니라 이전 세대 기준선이다.',
  },
  {
    title: 'Qwen-Image-Edit-2511',
    signal: 'Semantic + appearance + multi-image control',
    use: '객체 회전·추가·삭제, 다중 인물·제품 consistency와 text 편집을 같은 pinned workflow에서 다룰 때',
    caveat: '2511 artifact를 pin한다. 중국어·영어 text editing 근거를 한국어 정확도 보장으로 확장하지 않는다.',
  },
  {
    title: 'Mask inpaint',
    signal: '명시적 영역 고정',
    use: '손, 작은 결함, 단일 문구처럼 바꿀 위치를 사람이 정확히 지정할 수 있을 때',
    caveat: '장면 전체의 의미 변화나 보이지 않는 뒷면 생성에는 instruction model이 더 적합할 수 있다.',
  },
] as const;

const qwenVersionBoundary = [
  {
    version: 'Qwen-Image-2.0',
    status: '2026-02 발표·온라인 방향',
    role: '생성·편집 통합과 2K·긴 지시 방향을 보여준다. 공개 local artifact가 확인되기 전 2511 workflow를 대체하지 않는다.',
  },
  {
    version: 'Edit-2511',
    status: '현재 pinned 구현',
    role: '공개 weight와 ComfyUI native workflow가 함께 있어 drift·character·multi-person fixture를 재현할 수 있다.',
  },
  {
    version: 'Edit-2509',
    status: '기능 확장 기준선',
    role: 'Multi-image, identity·product·text consistency와 native ControlNet 조건을 추가했다.',
  },
  {
    version: 'Edit 2025-08',
    status: '개념의 최소 바닥',
    role: 'Qwen2.5-VL semantic path와 VAE appearance path를 동시에 쓰는 핵심 구조를 공개했다.',
  },
] as const;

const failures = [
  ['원본 identity가 바뀐다', 'Instruction 범위가 넓거나 reference condition이 약하다.', '유지 조건을 명시하고 mask/crop/reference를 추가한 뒤 변화량을 줄인다.'],
  ['원하지 않은 영역도 다시 그린다', '모델은 “수정”을 전체 재생성으로 해석할 수 있다.', 'Mask inpaint로 전환하거나 변경 영역을 작은 pass로 나눈다.'],
  ['문구가 비슷하지만 틀린다', 'Text rendering과 semantic edit는 별도 난이도다.', '문구 영역을 크게 crop하고 정확 문자열을 따옴표로 지정하며 OCR로 검증한다.'],
  ['Loader에 model이 보이지 않는다', 'AIO checkpoint와 분리형 diffusion model·text encoder·VAE의 loader가 다르다.', 'Model card의 파일 역할과 ComfyUI 공식 workflow의 loader 종류를 먼저 맞춘다.'],
  ['반복할수록 디테일이 녹는다', '매 pass마다 encode·denoise·decode 손실이 누적된다.', '원본과 중간본을 분리하고 각 수정은 가능한 한 원본의 국소 영역에서 시작한다.'],
  ['비교했는데 모델 차이를 모르겠다', 'Prompt·seed·resolution·reference preprocessing이 동시에 바뀌었다.', '한 번에 한 변수만 바꾸고 workflow JSON과 결과를 한 묶음으로 저장한다.'],
] as const;

export default function ComfyUIEditModelsFluxQwenArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Edit 모델은 txt2img가 아니다</h2>
        <QuestionLead
          question="같은 이미지를 넣었는데 왜 어떤 workflow는 얼굴까지 바꾸고, 어떤 workflow는 글자만 바꿀까?"
          answer="모델 이름보다 입력 image가 latent(압축된 image 표현)·vision condition·mask·reference 중 어느 경로로 들어가는지가 다르기 때문이다. 편집은 ‘무엇을 만들까’보다 ‘무엇을 바꾸고 무엇을 보존할까’를 먼저 정의하는 조건부 생성 문제다."
        />
        <ConceptPrimer items={[
          { term: 'Latent · VAE', meaning: 'Latent는 pixel image를 압축한 표현이고, VAE encoder·decoder는 image와 latent 사이를 왕복한다.', why: 'Img2img와 edit sampler가 실제로 갱신하는 대상이 pixel이 아니라 latent인 경우가 많다.' },
          { term: 'Appearance condition', meaning: '색·texture·구도처럼 입력의 보이는 형태를 전달하는 신호다.', why: '원본이 얼마나 유지되는지 추적한다.' },
          { term: 'Semantic condition', meaning: '이미지 속 객체·관계·문구의 의미를 vision encoder가 읽은 신호다.', why: '“컵을 돌려라” 같은 지시를 단순 pixel 변화와 구분한다.' },
          { term: 'Mask', meaning: '수정을 허용할 공간 영역을 지정하는 binary 또는 soft map이다.', why: '모델의 자유도를 가장 직접적으로 줄인다.' },
          { term: 'Reference', meaning: 'Identity·제품·style을 가져올 추가 입력 이미지다.', why: 'Prompt만으로 설명하기 어려운 시각 조건을 고정한다.' },
          { term: 'Sampling controls', meaning: 'Denoise strength는 원본 latent를 얼마나 다시 만들지, guidance는 조건을 얼마나 강하게 따를지, steps는 반복 갱신 횟수를 조절한다.', why: '모델이 같아도 보존·변경 균형과 실행 비용을 크게 바꾼다.' },
          { term: 'AIO checkpoint', meaning: 'Denoiser·text encoder·VAE 같은 여러 부품을 한 파일이나 loader 흐름으로 묶은 all-in-one 배포물이다.', why: '부품을 따로 받는 공식 workflow와 loader 계약이 다를 수 있다.' },
          { term: 'Quantized variant', meaning: 'Weight를 더 적은 bit로 표현해 memory를 줄인 변형이다.', why: '원본 weight와 file format·loader·kernel 지원이 달라질 수 있어 이름만으로 교체하면 안 된다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            네 방식은 같은 “이미지 만들기”처럼 보여도 계약이 다르다. Text-to-image에는 보존할 원본이 없고, img2img는 latent에서
            원본과 거리를 조절한다. Inpaint는 위치를 고정하고, instruction edit는 이미지 의미를 읽어 자연어 변경을 수행한다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {modes.map(([name, definition, boundary], index) => (
            <div key={name} className="grid gap-2 py-4 sm:grid-cols-[3rem_9rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xs font-bold text-muted-foreground">0{index + 1}</span>
              <strong className="text-sm">{name}</strong>
              <div className="min-w-0 text-sm leading-relaxed"><span>{definition}</span><span className="ml-2 text-muted-foreground">{boundary}</span></div>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일반 img2img에서 <code>denoise strength</code>는 source latent를 얼마나 남기고 noise를 얼마나 섞어
            다시 시작할지 정한다. 아래 식은 특정 모델의 비공개 구현이 아니라 이 trade-off를 읽기 위한 교육용
            시작 상태다.
          </p>
          <M display>{String.raw`\begin{aligned}
\underbrace{z_{\mathrm{start}}}_{\text{다시 만들기 시작할 latent}}
&=\underbrace{\alpha(s)z_{\mathrm{source}}}_{\text{남긴 원본 외형}}\\
&\quad+\underbrace{\sigma(s)\epsilon}_{\text{새 변화를 여는 noise}}\\
\epsilon&\sim\underbrace{\mathcal N(0,I)}_{\text{seed로 고정할 분포}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="편집 강도 s가 커지면 보통 source latent의 영향은 줄고 noise가 허용하는 새 변화가 커진다. 따라서 변경 성공과 identity·background 보존을 같은 축에서 함께 측정해야 한다."
            symbols={[
              [String.raw`z_{\mathrm{source}}`, '입력 image를 VAE로 압축한 source latent'],
              [String.raw`\alpha(s)`, '편집 강도에서 원본을 남기는 상대 계수'],
              [String.raw`\sigma(s)`, '새 변화를 허용하도록 noise를 섞는 상대 계수'],
              [String.raw`\epsilon`, 'seed가 고정하는 Gaussian noise'],
            ]}
          />
        </div>
        <EditContractLab />
      </section>

      <section id="flux-kontext" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FLUX.2와 Kontext의 현재 위치</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            FLUX.1 Kontext는 text와 image context를 함께 받아 한 장면을 단계적으로 고치는 instruction editing 기준선을 만들었다.
            그러나 BFL 공식 문서는 현재 새 프로젝트에 FLUX.2를 권장한다. FLUX.2는 생성과 편집을 한 architecture에 통합하고,
            여러 reference image를 함께 쓰며 최대 4MP 편집을 지원하는 현재 계열이다.
          </p>
          <p>
            Local workflow에서는 이름만 보고 연결하지 않는다. <code>[dev]</code>는 32B open-weight 계열이고,
            <code>[klein]</code>은 4B·9B로 나뉘며, 그중 4B는 Apache 2.0과 약 13GB VRAM을 내세운 접근 가능한 계열이다. 반면 API용 <code>[pro]</code>,
            <code>[flex]</code>는 local checkpoint loader가 아니라 API node 계약으로 읽어야 한다.
          </p>
          <CitationBlock source="Black Forest Labs · FLUX.2" citeKey={1} href="https://bfl.ai/blog/flux-2">
            <p>FLUX.2의 통합 생성·편집, 최대 10개 reference, 4MP와 [dev] open-weight 구성을 설명한다.</p>
          </CitationBlock>
          <CitationBlock source="Black Forest Labs · FLUX.2 model overview" citeKey={2} href="https://docs.bfl.ai/flux_2/flux2_overview">
            <p>[klein] 4B·9B variant, 4B의 Apache 2.0 배포와 약 13GB VRAM 조건을 확인하는 전용 근거다. 이 수치는 해당 공개 구성의 저자 측 안내이며 모든 precision·resolution의 peak memory 보장이 아니다.</p>
          </CitationBlock>
          <CitationBlock source="Black Forest Labs · Kontext overview" citeKey={3} href="https://docs.bfl.ai/kontext/kontext_overview">
            <p>공식 문서는 FLUX.1 Kontext를 previous-generation으로 두고 새 프로젝트에 FLUX.2를 권장한다.</p>
          </CitationBlock>
        </div>
        <Misconception>
          “FLUX node”가 모두 같은 tensor contract를 갖는 것은 아니다. FLUX.1 Kontext, FLUX.2 [dev]/[klein], 관리형 API node는 필요한 encoder·reference 수·license·memory가 다르다.
        </Misconception>
      </section>

      <section id="qwen-image-edit" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Qwen-Image-Edit-2511</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            2025년 8월 Qwen-Image-Edit가 공개한 중요한 구조적 단서는 입력 이미지를 Qwen2.5-VL과 VAE Encoder 양쪽에 넣는다는 점이다.
            전자는 장면의 의미를, 후자는 보이는 외형을 제어한다. 그래서 object rotation·style transfer 같은 semantic edit와,
            특정 요소 추가·삭제·문구 변경 같은 appearance edit를 같은 모델이 다룬다.
          </p>
          <p>
            이 개념을 현재 실행 artifact와 혼동하면 안 된다. 2026년 7월 현재 재현 가능한 open implementation 기준은
            upstream weight와 ComfyUI 전용 문서가 함께 있는 <strong>Qwen-Image-Edit-2511</strong>이다.
            ComfyUI graph에서 image가 어떤 conditioning node와 VAE로 들어가는지 확인하고, text encoder,
            optional 4-step acceleration LoRA, diffusion model과 VAE artifact를 정확한 revision으로 pin한다.
          </p>
          <p>
            Qwen-Image-2.0은 2026년 2월 생성·편집 통합, native 2K와 더 가벼운 구조 방향으로 발표됐지만,
            이 글의 pinned 2511 local workflow와 같은 artifact라고 가정하지 않는다. 온라인 최신 방향과
            로컬에서 hash·loader를 고정할 수 있는 checkpoint를 분리해서 읽는다.
          </p>
          <CitationBlock source="Qwen-Image upstream repository" citeKey={4} href="https://github.com/QwenLM/Qwen-Image">
            <p>2511 weight 공개 시점, 2511 quick start와 Qwen-Image-2.0 발표 상태를 함께 확인하는 현재 owner 근거다.</p>
          </CitationBlock>
          <CitationBlock source="Qwen Team · Qwen-Image-Edit" citeKey={5} href="https://qwenlm.github.io/blog/qwen-image-edit/">
            <p>20B 기반의 semantic/appearance dual input과 중국어·영어 text editing이라는 개념의 최소 바닥이다.</p>
          </CitationBlock>
          <CitationBlock source="ComfyUI · Qwen-Image-Edit-2511 native workflow" citeKey={6} href="https://docs.comfy.org/tutorials/image/qwen/qwen-image-edit-2511">
            <p>2511용 text encoder, acceleration LoRA, diffusion model, VAE와 native template를 고정하는 실행 근거다.</p>
          </CitationBlock>
        </div>
        <div className="not-prose mt-6 divide-y divide-border border-y border-border">
          {qwenVersionBoundary.map((item, index) => (
            <div key={item.version} className="grid gap-2 py-4 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-xs font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0">
                <strong className="block text-sm">{item.version}</strong>
                <span className="mt-1 block text-[10px] font-bold text-blue-700 dark:text-blue-300">{item.status}</span>
              </div>
              <p className="min-w-0 text-xs leading-relaxed text-muted-foreground">{item.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow-wiring" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">ComfyUI 연결 패턴</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Graph는 오른쪽에서 왼쪽으로 역추적하면 빠르다. 최종 Preview/Save Image에서 VAE Decode를 찾고, 그 latent를 만든 sampler와 model을 찾는다.
            그다음 sampler의 positive condition이 어느 text encoder에서 왔는지, 입력 image가 VAE와 vision encoder 중 어디로 들어갔는지 확인한다.
          </p>
          <ol>
            <li><strong>Output contract:</strong> 최종 image만 나오는지 다음 edit에 쓸 latent·reference도 보존하는지 본다.</li>
            <li><strong>Denoiser contract:</strong> Model family, precision, required VAE와 sampling schedule을 맞춘다.</li>
            <li><strong>Image contract:</strong> Resize·crop·aspect ratio가 reference의 구성과 글자 해상도를 훼손하지 않는지 본다.</li>
            <li><strong>Condition contract:</strong> Instruction text, mask, vision embedding, 다중 reference가 실제 어느 socket으로 들어가는지 본다.</li>
            <li><strong>Reproducibility:</strong> Workflow JSON, model hash, seed, resolution, steps, guidance와 input image를 한 묶음으로 저장한다.</li>
          </ol>
          <p>
            위치가 분명한 수정은 semantic model에 모든 자유를 주기보다 mask로 source와 edit 영역을 다시 합친다.
            이 합성식에서 mask 밖은 source latent가 직접 소유하므로, “그대로 두라”는 prompt보다 강한 보존 계약이 된다.
          </p>
          <M display>{String.raw`\begin{aligned}
\underbrace{z_{\mathrm{out}}}_{\text{decode에 넘길 latent}}
&=\underbrace{m\odot z_{\mathrm{edit}}}_{\text{mask 안은 변경}}\\
&\quad+\underbrace{(1-m)\odot z_{\mathrm{source}}}_{\text{mask 밖은 원본 보존}}
\end{aligned}`}</M>
          <FormulaNote
            meaning="Binary 또는 soft mask m은 어느 위치를 edit latent가 소유하고 어느 위치를 source latent가 소유할지 직접 정한다. 작은 국소 수정에서 mask가 instruction-only 편집보다 예측 가능한 이유다."
            symbols={[
              [String.raw`m`, '편집을 허용하는 위치가 1에 가까운 spatial mask'],
              [String.raw`z_{\mathrm{edit}}`, 'denoiser가 새로 만든 편집 latent'],
              [String.raw`z_{\mathrm{source}}`, '보존하려는 원본 latent'],
              [String.raw`\odot`, '위치별로 값을 고르는 element-wise 곱'],
            ]}
          />
        </div>
      </section>

      <section id="model-choice" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">언제 어떤 모델을 쓰는가</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {choices.map((choice, index) => (
            <article key={choice.title} className="grid gap-3 py-5 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-5">
              <span className="font-mono text-sm font-bold text-muted-foreground">0{index + 1}</span>
              <div><h3 className="font-bold">{choice.title}</h3><p className="mt-1 text-xs font-medium text-foreground">{choice.signal}</p></div>
              <div className="text-sm leading-relaxed"><p><strong>맞는 작업:</strong> <span className="text-muted-foreground">{choice.use}</span></p><p className="mt-2"><strong>확인할 경계:</strong> <span className="text-muted-foreground">{choice.caveat}</span></p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="failure-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">실패 모드</h2>
        <div className="not-prose grid gap-3 md:grid-cols-2">
          {failures.map(([title, cause, response]) => (
            <article key={title} className="min-w-0 rounded-md border border-border p-4">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">원인 가설:</strong> {cause}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">다음 실험:</strong> {response}</p>
            </article>
          ))}
        </div>
        <CapabilityCheck items={[
          'Text-to-image, img2img, mask inpaint, instruction edit의 입력 계약을 구분할 수 있다.',
          'ComfyUI graph에서 image가 latent와 semantic condition으로 들어가는 경로를 역추적할 수 있다.',
          'FLUX.1 Kontext를 현재 FLUX.2 계열과 같은 기본값으로 오해하지 않는다.',
          'Qwen의 dual-condition 개념, 2511 pinned artifact와 2.0 발표 상태를 서로 구분할 수 있다.',
          '모델 실패와 resize·loader·VAE·sampling 설정 실패를 한 변수 실험으로 분리할 수 있다.',
        ]} />
        <p className="not-prose my-6 text-sm leading-relaxed text-muted-foreground">
          편집 단계의 출력은 최종본이 아니라 change/preserve 검사 결과를 포함한 stage artifact다. 다음 <Link className="font-medium text-foreground underline decoration-border underline-offset-4" to={articlePath('ai', 'comfyui-upscale-postprocess')}>후처리 책임 추적</Link>에서 base edit와 detailer 결과를 분리한다.
        </p>
        <div className="not-prose grid gap-3 sm:grid-cols-3">
          <Link to={articlePath('ai', 'open-image-video-models')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">현재 지도</span><strong className="mt-2 block text-sm">Ideogram·Krea·FLUX의 역할</strong></Link>
          <Link to={articlePath('ai', 'image-model-runtime')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">실행 기반</span><strong className="mt-2 block text-sm">Prompt에서 VAE decode까지</strong></Link>
          <Link to={articlePath('ai', 'stable-diffusion-open-models')} className="rounded-md border p-4 hover:bg-muted/30"><span className="text-[11px] font-bold text-muted-foreground">더 아래 구현</span><strong className="mt-2 block text-sm">Latent·denoiser·condition</strong></Link>
        </div>
        <SourceNotes sources={[
          { label: 'BFL · FLUX.2', href: 'https://bfl.ai/blog/flux-2', note: '현재 통합 생성·편집 계열과 variant별 배포 범위.' },
          { label: 'BFL · FLUX.2 model overview', href: 'https://docs.bfl.ai/flux_2/flux2_overview', note: '[klein] 4B·9B, 4B license와 저자 측 약 13GB VRAM 안내의 직접 근거.' },
          { label: 'BFL · Kontext overview', href: 'https://docs.bfl.ai/kontext/kontext_overview', note: 'Kontext의 역할과 FLUX.2로의 현재 handoff.' },
          { label: 'Qwen-Image upstream repository', href: 'https://github.com/QwenLM/Qwen-Image', note: '2511 공개 artifact와 2.0 발표 상태를 분리하는 현재 owner 근거.' },
          { label: 'Qwen-Image-Edit concept release', href: 'https://qwenlm.github.io/blog/qwen-image-edit/', note: 'Semantic/appearance dual editing과 중국어·영어 text editing 범위.' },
          { label: 'ComfyUI Qwen-Image-Edit-2511 workflow', href: 'https://docs.comfy.org/tutorials/image/qwen/qwen-image-edit-2511', note: '2511 native node와 artifact 연결 기준.' },
        ]} />
      </section>
    </div>
  );
}
