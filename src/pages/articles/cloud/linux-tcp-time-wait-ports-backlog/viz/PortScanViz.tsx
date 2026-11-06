import SceneShell from "./SceneShell";

/**
 * 본문 대응: #port-search — 짝수 후보 14,116개와 홀수 후보 14,116개를 두 줄로 그린다.
 * 초당 600개가 찬다면 짝수 소진 14,116 ÷ 600 ≈ 23.5초, 47초 28,200 → 홀수 32개 남음, 48번째 초에 0.
 * 칸은 포트 여럿을 묶은 그림이고 시작 위치(칸 6)는 그림용 가정이다.
 */
const CELLS = 24;
const OFFSET = 6;
const HALF = 14116;

interface ScanState {
  evenLeft: number;
  oddLeft: number;
  checked: string;
  active: "even" | "odd" | "none";
}

const STATES: readonly ScanState[] = [
  { evenLeft: HALF, oddLeft: HALF, checked: "첫 후보에서 통과", active: "even" },
  { evenLeft: HALF - 6000, oddLeft: HALF, checked: "짝수 줄 안에서 찾음", active: "even" },
  { evenLeft: 0, oddLeft: HALF, checked: "짝수 14,116개 뒤 홀수", active: "odd" },
  { evenLeft: 0, oddLeft: 32, checked: "짝수 14,116개 뒤 홀수", active: "odd" },
  { evenLeft: 0, oddLeft: 0, checked: "28,232개 → 실패", active: "none" },
];

const SCENES = [
  { label: "첫 connect", summary: "hash로 시작 위치를 정함", note: "출발 IP·목적 IP·목적 포트의 hash로 범위 안의 시작 위치를 정해 짝수로 내립니다. 모두 비어 있으면 첫 후보에서 끝납니다." },
  { label: "10초", summary: "6,000개 · 짝수 줄부터 찹니다", note: "시작 위치가 훑은 거리만큼 밀리므로 다음 연결은 조금 뒤에서 찾기 시작합니다. 범위 끝을 넘으면 처음으로 돌아옵니다." },
  { label: "약 23.5초", summary: "14,116 ÷ 600 ≈ 23.5초에 짝수 소진", note: "이제 connect()마다 짝수 14,116개를 모두 확인한 뒤에야 홀수에 닿습니다. 후보마다 lock을 잡으므로 비용은 거의 찼을 때가 아니라 이때부터 커집니다." },
  { label: "47초", summary: "28,200개 · 남은 칸 32개", note: "짝수를 한 바퀴 돈 뒤 홀수를 돕니다. 짝수에서 못 찾았을 때만 홀수로 넘어갑니다." },
  { label: "48번째 초", summary: "32개 뒤 → -EADDRNOTAVAIL", note: "후보마다 같은 4-tuple의 TIME_WAIT가 있고 tcp_tw_reuse 기본 2는 loopback만 허용해 넘겨받지 못합니다. 모두 돈 뒤 오류를 돌려줍니다." },
] as const;

function Cells({ label, left, isActive }: { label: string; left: number; isActive: boolean }) {
  const free = (left / HALF) * CELLS;
  const filledCount = CELLS - Math.ceil(free);
  return (
    <div className="min-w-0">
      <p className="mb-1 flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
        <span className={`font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
        <span className="font-mono text-muted-foreground">남은 포트 {left.toLocaleString("en-US")}</span>
      </p>
      <div className="grid grid-cols-24 gap-0.5" aria-hidden>
        {Array.from({ length: CELLS }, (_, index) => {
          const distance = (index - OFFSET + CELLS) % CELLS;
          const taken = distance < filledCount;
          return (
            <div
              key={index}
              className="h-5 rounded-[2px] border"
              style={{ backgroundColor: taken ? "#2563eb" : "transparent", borderColor: taken ? "#2563eb" : "#94a3b8" }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PortScanViz() {
  return (
    <SceneShell
      eyebrow="출발 포트 찾기"
      title="짝수 포트가 다 찬 뒤에는 connect()마다 14,116개를 먼저 훑습니다"
      description="포트 범위 28,232개를 짝수와 홀수로 나눈 두 줄입니다. 채운 칸(한 칸에 약 590개)은 TIME_WAIT로 묶인 포트이고, 3절 사례대로 초당 600개를 엽니다."
      note="칸 배치와 시작 위치는 그림용이고 bind()·listen() 소켓과 예약 포트는 없다고 둡니다(가정). 비용은 측정값이 아닙니다."
      ariaLabel="짝수 후보를 먼저 훑고 홀수 후보로 넘어가는 출발 포트 탐색"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <div className="min-w-0 space-y-3">
            <Cells label="① 짝수 후보 14,116개" left={state.evenLeft} isActive={state.active === "even"} />
            <Cells label="② 홀수 후보 14,116개" left={state.oddLeft} isActive={state.active === "odd"} />
            <div className="rounded-lg border border-border px-3 py-2 text-xs">
              <span className="text-muted-foreground">이번 connect() 후보: </span>
              <span className="font-mono font-bold" style={{ color: state.active === "none" ? "#dc2626" : undefined }}>{state.checked}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
