import { useState } from 'react';
import {
  AudioLines,
  Boxes,
  GitBranch,
  Route,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';

type ViewId = 'version' | 'streams' | 'pipeline' | 'mode';
type ModeId = 't2v' | 'a2v' | 'v2a';

type View = {
  id: ViewId;
  label: string;
  icon: LucideIcon;
  question: string;
};

const views: View[] = [
  { id: 'version', label: 'Version', icon: GitBranch, question: '논문 수치와 현재 artifact 중 어느 층의 사실인가?' },
  { id: 'streams', label: 'Dual stream', icon: AudioLines, question: 'Video와 audio가 따로 계산하면서 언제 정보를 교환하는가?' },
  { id: 'pipeline', label: 'Two stage', icon: Route, question: '현재 권장 path에서 spatial upscaler가 왜 가운데 필요한가?' },
  { id: 'mode', label: 'Train mode', icon: Boxes, question: '어느 modality를 생성하고 어느 modality를 condition으로 고정하는가?' },
];

const modes = {
  t2v: {
    label: 'T2V',
    video: 'generated · noise와 loss 있음',
    audio: 'generated · noise와 loss 있음',
    meaning: 'Text에서 video와 audio를 함께 생성한다.',
  },
  a2v: {
    label: 'A2V',
    video: 'generated · noise와 loss 있음',
    audio: 'frozen · sigma=0, clean condition',
    meaning: '주어진 audio에 맞는 video만 학습한다.',
  },
  v2a: {
    label: 'V2A',
    video: 'frozen · sigma=0, clean condition',
    audio: 'generated · noise와 loss 있음',
    meaning: '주어진 video에 맞는 audio만 학습한다.',
  },
} as const;

export default function LtxVersionPipelineLab() {
  const [viewId, setViewId] = useState<ViewId>('version');
  const [modeId, setModeId] = useState<ModeId>('t2v');
  const view = views.find((item) => item.id === viewId) ?? views[0];
  const mode = modes[modeId];
  const ViewIcon = view.icon;

  return (
    <div
      data-ltx-version-pipeline-lab
      data-view={viewId}
      data-mode={modeId}
      className="not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Paper-to-runtime lab</p>
        <h3 className="mt-1 text-base font-bold">LTX-2의 구조와 LTX-2.3 artifact를 같은 숫자로 묶지 않는다</h3>
      </header>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {views.map((item, index) => {
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
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="block break-words text-xs font-bold">{item.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.4fr)_minmax(15rem,0.6fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <ViewIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{view.question}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Version, artifact와 pipeline owner를 붙여야 같은 결과를 다시 만들 수 있다.</p>
            </div>
          </div>

          <div className="mt-5">
            {viewId === 'version' && (
              <div className="divide-y divide-border border-y border-border">
                {[
                  ['LTX-2 논문', '14B video + 5B audio', '비대칭 dual-stream 아이디어의 공개 수치'],
                  ['LTX-2.3 artifact', '22B checkpoint label', '현재 repository가 배포하는 runtime 산출물'],
                  ['2.3 정확한 stream split', '공개 문서에서 미확인', '14B/5B를 그대로 옮겨 적지 않는다'],
                ].map(([owner, value, note]) => (
                  <div key={owner} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[9rem_9rem_minmax(0,1fr)] sm:gap-3">
                    <strong className="text-sm">{owner}</strong>
                    <code className="break-words text-xs leading-6 [overflow-wrap:anywhere]">{value}</code>
                    <span className="text-sm leading-6 text-muted-foreground">{note}</span>
                  </div>
                ))}
              </div>
            )}

            {viewId === 'streams' && (
              <ol className="divide-y divide-border border-y border-border">
                {[
                  ['01', 'Modality VAE', 'Video는 시공간 latent, audio는 별도 audio latent로 압축'],
                  ['02', 'Self-attention', '각 stream 안에서 고유 위치 관계를 먼저 계산'],
                  ['03', 'Text + cross-modal exchange', '문장과 상대 modality의 현재 hidden state를 읽음'],
                  ['04', 'AdaLN + FFN', '교환한 조건을 다음 denoising state에 반영'],
                ].map(([number, label, detail]) => (
                  <li key={label} className="grid gap-2 py-3 sm:grid-cols-[2.5rem_10rem_minmax(0,1fr)]">
                    <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
                    <strong className="text-sm">{label}</strong>
                    <span className="text-sm leading-6 text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ol>
            )}

            {viewId === 'pipeline' && (
              <ol className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
                {[
                  ['01', 'Stage 1', '낮은 spatial resolution에서 전체 장면과 motion 생성'],
                  ['02', 'Latent upsample', '필수 spatial upscaler가 latent grid를 확대'],
                  ['03', 'Stage 2', 'Distilled LoRA·짧은 sigma path로 고해상도 refinement'],
                ].map(([number, label, detail]) => (
                  <li key={label} className="min-w-0 bg-background px-4 py-4">
                    <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
                    <p className="mt-2 text-sm font-bold">{label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{detail}</p>
                  </li>
                ))}
              </ol>
            )}

            {viewId === 'mode' && (
              <>
                <div className="grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
                  {(Object.keys(modes) as ModeId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={id === modeId}
                      onClick={() => setModeId(id)}
                      className={`min-h-11 min-w-0 bg-background px-3 py-3 text-sm font-bold ${
                        id === modeId ? 'bg-emerald-500/[0.07]' : 'hover:bg-muted/35'
                      }`}
                    >
                      {modes[id].label}
                    </button>
                  ))}
                </div>
                <dl className="mt-4 divide-y divide-border border-y border-border">
                  <div className="grid gap-2 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"><dt className="text-sm font-bold">Video</dt><dd className="text-sm leading-6 text-muted-foreground">{mode.video}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"><dt className="text-sm font-bold">Audio</dt><dd className="text-sm leading-6 text-muted-foreground">{mode.audio}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[7rem_minmax(0,1fr)]"><dt className="text-sm font-bold">목표</dt><dd className="text-sm leading-6 text-muted-foreground">{mode.meaning}</dd></div>
                </dl>
              </>
            )}
          </div>
        </div>

        <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <div className="flex gap-2 text-amber-800 dark:text-amber-200">
            <TriangleAlert className="mt-1 h-4 w-4 shrink-0" />
            <p className="text-sm font-semibold leading-6">19B 논문 수치를 22B LTX-2.3 checkpoint의 정확한 내부 분할로 사용하지 않는다.</p>
          </div>
          <p className="mt-5 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            현재 결과의 최소 identity는 checkpoint, text encoder, VAE, spatial upscaler, distilled artifact,
            guider, sigma schedule, pipeline class와 repository revision이다.
          </p>
        </aside>
      </div>
    </div>
  );
}
