import { useState } from 'react';
import {
  Boxes,
  Cpu,
  Film,
  Gauge,
  Route,
  type LucideIcon,
} from 'lucide-react';

type StageId = 'task' | 'family' | 'mechanism' | 'budget';
type FamilyId = 'a14b' | 'ti2v';
type NoiseId = 'high' | 'low';

type Stage = {
  id: StageId;
  label: string;
  icon: LucideIcon;
  question: string;
};

const stages: Stage[] = [
  { id: 'task', label: 'Task', icon: Film, question: 'Text, image 또는 둘 중 무엇이 condition인가?' },
  { id: 'family', label: 'Family', icon: Boxes, question: 'Capacity routing과 접근성 중 어떤 경로를 고르는가?' },
  { id: 'mechanism', label: 'Mechanism', icon: Route, question: '이 경로가 한 denoising step의 비용을 어떻게 정하는가?' },
  { id: 'budget', label: 'Runtime', icon: Cpu, question: '공식 문서의 hardware 조건은 어떤 실행 옵션에 붙는가?' },
];

const families = {
  a14b: {
    label: 'A14B',
    task: 'T2V 또는 I2V 전용 checkpoint',
    total: '약 27B total',
    active: 'step당 약 14B active',
    mechanism: 'High-noise / low-noise expert 중 하나',
    hardware: '공식 single-GPU 경로: 최소 80GB VRAM',
    gain: '한 step 계산은 제한하면서 두 expert의 전체 capacity를 사용',
    cost: 'Checkpoint·expert 전환·고용량 runtime 관리',
  },
  ti2v: {
    label: 'TI2V-5B',
    task: 'Text 또는 image+text를 한 dense path에서 처리',
    total: '5B dense',
    active: 'step당 5B active',
    mechanism: '4×16×16 VAE + 1×2×2 patch',
    hardware: '공식 offload/dtype/T5-CPU 경로: 24GB 4090급',
    gain: '높은 latent 압축과 작은 dense model로 접근성 확보',
    cost: '압축 손실과 CPU offload latency를 함께 검증',
  },
} as const;

const tasks = [
  ['T2V-A14B', 'text', '전용 MoE'],
  ['I2V-A14B', 'image + text', '전용 MoE'],
  ['TI2V-5B', 'text 또는 image + text', '통합 dense'],
] as const;

export default function WanFamilyDecisionLab() {
  const [stageId, setStageId] = useState<StageId>('task');
  const [familyId, setFamilyId] = useState<FamilyId>('a14b');
  const [noiseId, setNoiseId] = useState<NoiseId>('high');
  const stage = stages.find((item) => item.id === stageId) ?? stages[0];
  const family = families[familyId];
  const StageIcon = stage.icon;

  return (
    <div
      data-wan-family-lab
      data-stage={stageId}
      data-family={familyId}
      data-noise={noiseId}
      className="not-prose my-8 min-w-0 scroll-mt-28 overflow-hidden rounded-md border border-border bg-background"
    >
      <header className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-[10px] font-bold uppercase text-muted-foreground">Checkpoint decision lab</p>
        <h3 className="mt-1 text-base font-bold">Wan2.2를 하나의 모델로 뭉개지 않는다</h3>
      </header>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {stages.map((item, index) => {
          const Icon = item.icon;
          const active = item.id === stageId;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-pressed={active}
              onClick={() => setStageId(item.id)}
              className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left ${
                active ? 'bg-blue-500/[0.07]' : 'hover:bg-muted/35'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] font-black text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="block text-xs font-bold">{item.label}</span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid min-w-0 lg:grid-cols-[minmax(0,1.18fr)_minmax(17rem,0.82fr)]">
        <div className="min-w-0 px-4 py-5 sm:px-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-blue-500/25 bg-blue-500/[0.06]">
              <StageIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold">{stage.question}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Task와 family를 고른 뒤에야 parameter와 VRAM 숫자에 의미가 생긴다.</p>
            </div>
          </div>

          <div className="mt-5">
            {stageId === 'task' && (
              <div className="divide-y divide-border border-y border-border">
                {tasks.map(([name, condition, path]) => (
                  <div key={name} className="grid min-w-0 gap-2 py-3 sm:grid-cols-[8rem_minmax(0,1fr)_7rem] sm:gap-3">
                    <strong className="break-words text-sm [overflow-wrap:anywhere]">{name}</strong>
                    <span className="text-sm leading-6 text-muted-foreground">{condition}</span>
                    <span className="text-xs font-semibold text-foreground">{path}</span>
                  </div>
                ))}
              </div>
            )}

            {stageId === 'family' && (
              <>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
                  {(Object.keys(families) as FamilyId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={id === familyId}
                      onClick={() => setFamilyId(id)}
                      className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left text-sm font-bold ${
                        id === familyId ? 'bg-emerald-500/[0.07]' : 'hover:bg-muted/35'
                      }`}
                    >
                      {families[id].label}
                    </button>
                  ))}
                </div>
                <dl className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
                  {[
                    ['조건 입력', family.task],
                    ['전체 용량', family.total],
                    ['활성 계산', family.active],
                    ['핵심 장치', family.mechanism],
                  ].map(([label, value]) => (
                    <div key={label} className="min-w-0 bg-background px-4 py-3">
                      <dt className="text-[10px] font-bold uppercase text-muted-foreground">{label}</dt>
                      <dd className="mt-1 break-words text-sm leading-6 [overflow-wrap:anywhere]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            )}

            {stageId === 'mechanism' && familyId === 'a14b' && (
              <>
                <div className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
                  {(['high', 'low'] as NoiseId[]).map((id) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={id === noiseId}
                      onClick={() => setNoiseId(id)}
                      className={`min-h-11 min-w-0 bg-background px-3 py-3 text-left text-sm font-bold ${
                        id === noiseId ? 'bg-emerald-500/[0.07]' : 'hover:bg-muted/35'
                      }`}
                    >
                      {id === 'high' ? 'High-noise expert' : 'Low-noise expert'}
                    </button>
                  ))}
                </div>
                <div className="mt-4 border-y border-border py-4">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">현재 step에서 활성</p>
                  <p className="mt-1 text-base font-bold">{noiseId === 'high' ? '큰 구도·움직임을 잡는 구간' : '질감·경계·작은 움직임을 정리하는 구간'}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">다른 expert는 이 step의 active parameter에 포함되지 않는다.</p>
                </div>
              </>
            )}

            {stageId === 'mechanism' && familyId === 'ti2v' && (
              <ol className="divide-y divide-border border-y border-border">
                {[
                  ['01', 'RGB video', 'T × H × W'],
                  ['02', 'Wan2.2 VAE', 'Tz=floor((T-1)/4)+1 · H/16 · W/16'],
                  ['03', 'Patchify', 'Tz · H/32 · W/32'],
                  ['04', 'Dense 5B DiT', '압축된 시공간 token을 모두 처리'],
                ].map(([number, label, value]) => (
                  <li key={label} className="grid gap-2 py-3 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)]">
                    <span className="font-mono text-xs font-black text-muted-foreground">{number}</span>
                    <strong className="text-sm">{label}</strong>
                    <code className="break-words text-xs leading-6 text-muted-foreground [overflow-wrap:anywhere]">{value}</code>
                  </li>
                ))}
              </ol>
            )}

            {stageId === 'budget' && (
              <div className="divide-y divide-border border-y border-border">
                {(Object.keys(families) as FamilyId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={id === familyId}
                    onClick={() => setFamilyId(id)}
                    className={`grid min-h-11 w-full min-w-0 gap-2 py-4 text-left sm:grid-cols-[7rem_minmax(0,1fr)] ${
                      id === familyId ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    <strong className="text-sm">{families[id].label}</strong>
                    <span className="text-sm leading-6">{families[id].hardware}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="min-w-0 border-t border-border bg-muted/[0.12] px-4 py-5 lg:border-l lg:border-t-0">
          <p className="text-[10px] font-bold uppercase text-muted-foreground">현재 선택 · {family.label}</p>
          <p className="mt-2 text-sm font-bold leading-6">{family.gain}</p>
          <p className="mt-4 border-t border-border pt-4 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">대가:</strong> {family.cost}</p>
          <div className="mt-5 flex items-start gap-2 border-t border-border pt-4 text-sm leading-6 text-muted-foreground">
            <Gauge className="mt-1 h-4 w-4 shrink-0" />
            <p>Hardware 숫자는 checkpoint만의 사양이 아니라 README에 적힌 offload·dtype·T5 위치를 포함한 command 계약이다.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
