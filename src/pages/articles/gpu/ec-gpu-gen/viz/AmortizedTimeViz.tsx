import SceneShell from "./SceneShell";

/**
 * 본문 대응: #artifact-lifecycle — T_amort 예시.
 * 60s/600 runs=100ms, 2s/100 runs=20ms, steady 30ms, 합계 150ms.
 */
const PARTS = [
  { name: "Build 분담", formula: "60s ÷ 600 runs", ms: 100, meaning: "source 생성·compile" },
  { name: "Startup 분담", formula: "2s ÷ 100 runs", ms: 20, meaning: "device 탐색·program load" },
  { name: "Steady", formula: "warm 상태 그대로", ms: 30, meaning: "transfer·kernel·sync" },
] as const;

const TOTAL = PARTS.reduce<number>((sum, part) => sum + part.ms, 0);

const SCENES = [
  { label: "Build 비용 나누기", summary: "60s ÷ 600 = 100ms", note: "같은 artifact로 600번 실행한다면, 한 번 든 build 60초를 600번에 나눠 실행 한 번당 100ms로 셉니다." },
  { label: "Startup 비용 나누기", summary: "2s ÷ 100 = 20ms", note: "process 하나가 100번 실행한다면, 시작할 때 든 2초를 100번에 나눠 실행 한 번당 20ms로 셉니다." },
  { label: "Warm 실행 더하기", summary: "+ 30ms", note: "이미 준비된 상태에서 실행 한 번마다 드는 시간은 나눌 것 없이 30ms를 그대로 더합니다." },
  { label: "실행 한 번의 값", summary: `합계 ${TOTAL}ms`, note: "30ms만 보면 120ms가 빠집니다. 600과 100은 글의 예시 값이고, 실제로는 배포 주기에서 관찰한 값을 넣어야 startup을 큰 수로 숨기지 못합니다." },
] as const;

const W = 360;
const H = 58;
const BAR_L = 10;
const BAR_W = 340;
const px = (ms: number) => (ms / TOTAL) * BAR_W;

export default function AmortizedTimeViz() {
  return (
    <SceneShell
      eyebrow="실행 한 번의 시간"
      title="30ms처럼 보이는 실행이 run당 150ms가 되는 과정"
      description="한 번만 드는 비용을 그 비용을 함께 쓰는 실행 수로 나눠 실행 한 번에 배분합니다. 막대 전체가 150ms이고, 진한 칸이 지금 더하는 몫입니다. 숫자는 이 글의 예시입니다."
      ariaLabel="build, startup, warm 실행 시간이 실행 한 번의 150밀리초로 합쳐지는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = PARTS.slice(0, active + 1);
        const offsets = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + part.ms, 0));
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-2">
              {PARTS.map((part, index) => {
                const on = index <= active;
                return (
                  <div key={part.name} className={`grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-2 rounded-lg border px-3 py-2 ${on ? (index === active ? "border-primary bg-background" : "border-border bg-background") : "border-dashed border-border/50 text-muted-foreground/60"}`}>
                    <div className="min-w-0 text-xs leading-5 sm:text-sm">
                      <span className="font-semibold">{part.name}</span>
                      <span className={on ? " text-muted-foreground" : ""}> · {part.meaning}</span>
                      <span className="block font-mono">{part.formula}</span>
                    </div>
                    <span className="text-right font-mono text-sm font-bold">{part.ms}ms</span>
                  </div>
                );
              })}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`누적 ${shown.reduce<number>((sum, part) => sum + part.ms, 0)}밀리초 / 전체 ${TOTAL}밀리초`}>
              <rect x={BAR_L} y={6} width={BAR_W} height={24} rx={3} fill="#94a3b8" opacity={0.15} />
              {shown.map((part, index) => (
                <g key={part.name}>
                  <rect x={BAR_L + px(offsets[index])} y={6} width={px(part.ms)} height={24} strokeWidth={1} className={`stroke-background ${index === active || active === PARTS.length ? "fill-primary" : "fill-muted-foreground"}`} />
                  <text x={BAR_L + px(offsets[index]) + px(part.ms) / 2} y={23} textAnchor="middle" fontSize={12} fontWeight={700} className={index === active || active === PARTS.length ? "fill-primary-foreground" : "fill-background"}>{part.ms}</text>
                </g>
              ))}
              <text x={BAR_L} y={48} fontSize={12} fill="#64748b">0</text>
              <text x={BAR_L + BAR_W} y={48} textAnchor="end" fontSize={12} fill="#64748b">{TOTAL}ms</text>
            </svg>
          </div>
        );
      }}
    />
  );
}
