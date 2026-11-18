import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #client-init "socket과 sync는 순차 단계가 아니라 겹쳐 진행됩니다".
 * 세 줄 = JSON-RPC task, consensus sync task, [A] 배포 플랫폼의 traffic 판정.
 * 네 칸 = 순서만 나타내는 단계이며 시간 길이는 대상 환경에서 재지 않았습니다([M]).
 */
type Tone = "off" | "run" | "warn" | "ok";
type Cell = { text: string; tone: Tone };

const PHASES = ["① build", "② 열림·sync 중", "③ synced", "④ [A] 판정"] as const;

/** 각 장면에서 칸 내용: [lane][phase]. 아직 오지 않은 단계는 빈칸으로 둡니다. */
const LANES = ["JSON-RPC", "Sync", "[A] Traffic"] as const;

const EMPTY: Cell = { text: "", tone: "off" };

const GRID: readonly (readonly (readonly Cell[])[])[] = [
  [
    [{ text: "spawn", tone: "run" }, EMPTY, EMPTY, EMPTY],
    [{ text: "시작", tone: "run" }, EMPTY, EMPTY, EMPTY],
    [{ text: "없음", tone: "off" }, EMPTY, EMPTY, EMPTY],
  ],
  [
    [{ text: "spawn", tone: "run" }, { text: "listening", tone: "run" }, EMPTY, EMPTY],
    [{ text: "시작", tone: "run" }, { text: "Syncing", tone: "warn" }, EMPTY, EMPTY],
    [{ text: "없음", tone: "off" }, { text: "대기", tone: "off" }, EMPTY, EMPTY],
  ],
  [
    [{ text: "spawn", tone: "run" }, { text: "listening", tone: "run" }, { text: "listening", tone: "run" }, EMPTY],
    [{ text: "시작", tone: "run" }, { text: "Syncing", tone: "warn" }, { text: "Synced + block", tone: "ok" }, EMPTY],
    [{ text: "없음", tone: "off" }, { text: "대기", tone: "off" }, { text: "대기", tone: "off" }, EMPTY],
  ],
  [
    [{ text: "spawn", tone: "run" }, { text: "listening", tone: "run" }, { text: "listening", tone: "run" }, { text: "listening", tone: "run" }],
    [{ text: "시작", tone: "run" }, { text: "Syncing", tone: "warn" }, { text: "Synced + block", tone: "ok" }, { text: "Synced", tone: "ok" }],
    [{ text: "없음", tone: "off" }, { text: "대기", tone: "off" }, { text: "대기", tone: "off" }, { text: "probe 통과 → 편입", tone: "ok" }],
  ],
];

const SCENES = [
  {
    label: "Build에서 두 task가 함께 시작",
    summary: "RPC task ∥ sync task",
    note: "rpc_address가 있으면 HeliosClient::new()가 JSON-RPC server task를 바로 spawn하고, consensus sync task도 ConsensusClient::new()에서 시작됩니다. 두 줄이 같은 칸에서 출발하는 이유입니다.",
  },
  {
    label: "Port가 먼저 열릴 수 있음",
    summary: "listening ≠ synced",
    note: "Socket은 연결을 받지만 sync는 아직 진행 중일 수 있습니다. “RPC port가 열렸으니 ready”라고 판단하면 이 칸에서 sync 중인 replica에 요청이 들어갈 수 있습니다.",
  },
  {
    label: "wait_synced가 기다리는 것",
    summary: "Synced + latest·finalized block",
    note: "wait_synced()는 consensus status가 Synced가 될 때까지 기다리고 initial latest block과 available한 finalized block이 node cache에 들어왔는지도 확인합니다. 하지만 CLI 기본 실행 경로는 이 메서드를 호출하지 않습니다.",
  },
  {
    label: "[A] 배포 플랫폼의 readiness",
    summary: "같은 generation에서 네 조건",
    note: "[A] eth_syncing=false, 예상 chain ID, 최신 block age, 대표 proof-backed read를 같은 generation에서 확인한 뒤에만 Service endpoint에 넣습니다. 하나라도 실패하면 Pod가 살아 있어도 endpoint에서 뺍니다.",
  },
] as const;

const TONE: Record<Tone, string> = {
  off: "border-border/60 text-muted-foreground",
  run: "border-primary/60 bg-primary/[0.05]",
  warn: "border-amber-600 bg-amber-500/[0.08] text-amber-800 dark:text-amber-300",
  ok: "border-emerald-600 bg-emerald-600/[0.07] text-emerald-800 dark:text-emerald-300",
};

export default function SocketSyncOverlapViz() {
  return (
    <HeliosSceneShell
      eyebrow="Socket ∥ sync"
      title="JSON-RPC가 열리는 시점과 sync가 끝나는 시점은 따로 움직입니다"
      description="가로 칸은 시작 단계의 순서이고, 세 줄은 동시에 진행되는 JSON-RPC task, consensus sync task, 배포 플랫폼의 traffic 판정입니다. [A]는 이 글의 운영 제안입니다."
      note="칸 너비는 순서만 나타냅니다. 각 단계에 걸리는 시간은 대상 환경에서 아직 재지 않았습니다([M] 미측정)."
      ariaLabel="JSON-RPC task와 sync task가 겹쳐 진행되고 readiness 판정이 따로 이뤄지는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const grid = GRID[active] ?? GRID[0];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3.75rem_repeat(4,minmax(0,1fr))] gap-1 sm:grid-cols-[6rem_repeat(4,minmax(0,1fr))] sm:gap-1.5">
              <span />
              {PHASES.map((phase, i) => (
                <span
                  key={phase}
                  className={`break-keep text-center font-mono text-[10px] leading-4 sm:text-xs ${i === active ? "font-bold text-primary" : "text-muted-foreground"}`}
                >
                  {phase}
                </span>
              ))}
              {LANES.map((lane, li) => (
                <div key={lane} className="contents">
                  <span className="flex items-center break-keep font-mono text-[10px] font-bold leading-4 sm:text-xs">{lane}</span>
                  {(grid[li] ?? []).map((cell, pi) => (
                    <span
                      key={pi}
                      className={`flex min-h-[2.75rem] min-w-0 items-center justify-center rounded-md border px-0.5 text-center text-[10px] leading-4 break-keep sm:text-xs ${
                        cell.text === "" ? "border-dashed border-border/40" : TONE[cell.tone]
                      }`}
                    >
                      {cell.text}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-3 break-keep text-xs leading-5 text-muted-foreground sm:text-sm">
              {active === 1
                ? "[A] 판정 없이 port만 보고 ②에서 편입하면, Syncing 중인 replica가 요청을 받을 수 있습니다."
                : active === 2
                  ? "CLI 기본 경로는 wait_synced()를 호출하지 않고 프로세스를 유지합니다."
                  : active === 3
                    ? "Helios가 sync 상태를 쓰고, 배포 플랫폼이 traffic 편입을 씁니다."
                    : "Native target에서 rpc_address가 설정된 경로입니다."}
            </p>
          </div>
        );
      }}
    />
  );
}
