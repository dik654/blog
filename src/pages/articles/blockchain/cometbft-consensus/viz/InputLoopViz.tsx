import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receive-routine — peer queue, internal queue, timeout ticker에서 입력 하나를 골라
 * handleMsg 또는 handleTimeout으로 보낸다. 내 Proposal·Vote는 처리 전 WAL 동기 기록, 늦은 timer는 앞부분에서 버림.
 */
type Source = "peer" | "internal" | "timeout" | "all";
type Handler = "handleMsg" | "handleTimeout" | "both";

interface Scene {
  label: string;
  summary: string;
  note: string;
  source: Source;
  input: string;
  wal: string;
  handler: Handler;
  result: string;
  rejected?: boolean;
}

const SCENES: readonly Scene[] = [
  { label: "입구 셋, 길 하나", summary: "입력을 하나씩 고름", source: "all", input: "입력 대기", wal: "WAL: 디스크에 남기는 기록", handler: "both", result: "RoundState: 지금 합의 상태", note: "여러 goroutine(Go의 동시 실행 단위)이 곧바로 상태를 바꾸면 결과가 처리 순서에 좌우될 수 있어 경로를 한곳에 모읍니다." },
  { label: "peer의 block part", summary: "peer queue → handleMsg", source: "peer", input: "늦은 block part", wal: "WAL 기록", handler: "handleMsg", result: "RoundState 갱신", note: "Peer message도 WAL에 기록되지만 기록 방식과 실패 처리는 message 종류마다 다릅니다." },
  { label: "내가 만든 Vote", summary: "처리 전에 동기 기록", source: "internal", input: "내 Vote · Proposal", wal: "WAL 동기 기록 먼저", handler: "handleMsg", result: "RoundState 갱신", note: "재시작 뒤 같은 key가 다른 내용에 서명되는 일을 막으려고 처리 전에 디스크에 남깁니다." },
  { label: "제때 온 timeout", summary: "h41/r0/Propose = 현재 좌표", source: "timeout", input: "timer · h41/r0/Propose", wal: "WAL 기록", handler: "handleTimeout", result: "좌표가 같음 → 처리", note: "Timer에 든 H/R/S(높이·round·step)를 처리 시점의 H/R/S와 다시 비교합니다." },
  { label: "늦게 온 timer", summary: "r0 timer · 현재 r1", source: "timeout", input: "timer · h41/r0", wal: "WAL 기록", handler: "handleTimeout", result: "이미 r1 → 앞부분에서 버림", rejected: true, note: "Round 1로 간 node가 round 0의 timer를 받아도 앞부분에서 버리므로 상태가 뒤로 가지 않습니다." },
  { label: "도착한 Vote", summary: "도착 ≠ power 증가", source: "peer", input: "peer의 Vote", wal: "WAL 기록", handler: "handleMsg", result: "검증 후 VoteSet에 추가돼야 power 증가", note: "height·round·type·validator와 signature를 확인하고 VoteSet에 실제로 추가돼야 power가 늘어납니다." },
];

const SOURCES: readonly { key: Source; name: string; detail: string }[] = [
  { key: "peer", name: "peer queue", detail: "다른 node" },
  { key: "internal", name: "internal queue", detail: "내 node" },
  { key: "timeout", name: "timeout ticker", detail: "timer" },
];

function Arrow({ text }: { text?: string }) {
  return <p className="py-0.5 text-center text-xs text-muted-foreground">↓{text ? ` ${text}` : ""}</p>;
}

export default function InputLoopViz() {
  return (
    <SceneShell
      eyebrow="입력 하나가 상태를 바꾸는 경로"
      title="세 입구의 입력을 한 loop가 처리합니다"
      description="입력 하나가 위에서 아래로 지나갑니다."
      ariaLabel="세 입력원이 receiveRoutine, WAL, handler를 거쳐 RoundState에 닿는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 text-center">
            <div className="grid grid-cols-3 gap-1.5">
              {SOURCES.map((source) => {
                const on = scene.source === "all" || scene.source === source.key;
                return (
                  <div key={source.key} className={`min-w-0 rounded-lg border px-1 py-1.5 ${on ? "border-primary bg-background" : "border-dashed border-border text-muted-foreground"}`}>
                    <strong className="block font-mono text-[10px] leading-4 sm:text-xs">{source.name}</strong>
                    <span className="block text-[11px] leading-4 text-muted-foreground">{source.detail}</span>
                  </div>
                );
              })}
            </div>
            <Arrow text={scene.input} />
            <div className="rounded-lg border border-primary bg-background px-2 py-1.5 text-xs">
              <strong className="font-mono text-sm">receiveRoutine</strong>
              <span className="ml-2 text-muted-foreground">한 번에 하나</span>
            </div>
            <Arrow />
            <div className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold">{scene.wal}</div>
            <Arrow />
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {(["handleMsg", "handleTimeout"] as const).map((name) => {
                const on = scene.handler === "both" || scene.handler === name;
                return (
                  <div key={name} className={`rounded-lg border px-1 py-1.5 ${on ? "border-primary bg-background font-bold" : "border-dashed border-border text-muted-foreground"}`}>{name}</div>
                );
              })}
            </div>
            <Arrow />
            <div className={`rounded-lg border px-2 py-1.5 text-xs font-bold sm:text-sm ${scene.rejected ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-amber-600 text-amber-700 dark:text-amber-400"}`}>{scene.result}</div>
          </div>
        );
      }}
    />
  );
}
