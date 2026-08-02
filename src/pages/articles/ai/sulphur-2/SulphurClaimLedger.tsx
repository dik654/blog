import { useState } from 'react';
import {
  BadgeCheck,
  CircleHelp,
  FlaskConical,
  GitBranch,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';

type ViewId = 'verified' | 'inherited' | 'unknown' | 'evidence';

type View = {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  owner: string;
  claims: Array<[string, string]>;
};

const views: View[] = [
  {
    id: 'verified',
    label: 'Card verified',
    icon: BadgeCheck,
    owner: 'Sulphur 2 official Hugging Face card',
    claims: [
      ['Base identity', 'Lightricks/LTX-2.3 기반이라고 명시한다.'],
      ['Task claim', 'T2V·I2V와 다른 LTX-2.3 format 지원을 주장한다.'],
      ['Package guidance', 'Dev BF16/FP8-mixed와 제공된 distill LoRA를 안내한다.'],
      ['Prompt enhancer', 'LM Studio용 GGUF·MMPROJ와 text/image 입력을 안내한다.'],
    ],
  },
  {
    id: 'inherited',
    label: 'LTX inherited',
    icon: GitBranch,
    owner: 'LTX-2.3 official repository and docs',
    claims: [
      ['Architecture', 'Audio-video latent와 dual-stream 개념은 upstream에서 상속한다.'],
      ['Runtime parts', 'Text encoder, VAE, upscaler, guider와 pipeline identity가 필요하다.'],
      ['Training modes', 'LoRA·IC-LoRA·full tune의 일반 기능은 upstream trainer 계약이다.'],
      ['Not a Sulphur claim', '상속 사실을 Sulphur가 새로 발명하거나 개선한 것으로 세지 않는다.'],
    ],
  },
  {
    id: 'unknown',
    label: 'Pending · unknown',
    icon: CircleHelp,
    owner: '공식 카드가 아직 제공하지 않는 범위',
    claims: [
      ['Official inference', '현재 카드에는 coming soon이라고 적혀 있다.'],
      ['Training recipe', 'Dataset, optimizer, loss와 trainable module이 공개되지 않았다.'],
      ['Full fine-tune meaning', '어떤 weight를 실제로 업데이트했는지 확정할 수 없다.'],
      ['Enhancer base model', 'GGUF·MMPROJ는 보이지만 기반 LLM 이름은 명시되지 않았다.'],
    ],
  },
  {
    id: 'evidence',
    label: 'Local evidence',
    icon: FlaskConical,
    owner: 'Versioned community workflow and local run receipts',
    claims: [
      ['Artifact manifest', 'Full-model path와 대안 LoRA path를 섞지 않고 file hash를 남긴다.'],
      ['Baseline', '같은 LTX-2.3 upstream workflow와 조건에서 비교한다.'],
      ['Attribution', 'Prompt enhancer on/off와 checkpoint delta를 분리한다.'],
      ['Quality', 'Motion, identity, I2V preservation과 cost를 paired output으로 측정한다.'],
    ],
  },
];

export default function SulphurClaimLedger() {
  const [viewId, setViewId] = useState<ViewId>('verified');
  const view = views.find((item) => item.id === viewId) ?? views[0];

  return (
    <div
      data-sulphur-claim-ledger
      data-view={viewId}
      className="not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <div className="flex min-w-0 gap-3 border-b border-amber-500/30 bg-amber-500/[0.05] px-4 py-4 text-amber-900 dark:text-amber-100 sm:px-5">
        <TriangleAlert className="mt-1 h-4 w-4 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase">현재 release gate</p>
          <p className="mt-1 break-words text-sm font-semibold leading-6">Official inference for the model is coming soon.</p>
        </div>
      </div>
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Derivative claim ledger</p>
        <h3 className="mt-1 text-base font-bold">공식 카드, upstream 상속과 local 실험을 섞지 않는다</h3>
      </header>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {views.map((item) => {
          const Icon = item.icon;
          const active = item.id === viewId;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setViewId(item.id)}
              className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left ${
                active ? 'bg-blue-500/[0.07]' : 'hover:bg-muted/35'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                <span className="break-words text-xs font-bold">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(16rem,0.8fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="divide-y divide-border border-y border-border">
            {view.claims.map(([claim, meaning]) => (
              <div key={claim} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-3">
                <strong className="text-sm">{claim}</strong>
                <span className="text-sm leading-6 text-muted-foreground">{meaning}</span>
              </div>
            ))}
          </div>
        </div>
        <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">Evidence owner</p>
          <p className="mt-2 break-words text-sm font-semibold leading-6">{view.owner}</p>
          <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            다른 owner의 문장을 가져오면 claim의 등급은 올라가지 않는다. 확인되지 않은 값은 빈칸으로 보존한다.
          </p>
        </aside>
      </div>
    </div>
  );
}
