import SceneShell from "../../reth-net/viz/SceneShell";

/**
 * 본문 대응: #failure — 종료 뒤 pending·active count, inflight request, queue bytes와 timer가
 * 기준선으로 돌아오지 않으면 cleanup 실패.
 * pending 1→0, active 0→1은 #baseline의 Session receipt 값이다.
 * 시작 전 0, 교환 중 inflight 1·queue bytes·timer "있음", 실패 run의 잔류값은 그림용 가정이다.
 */
const COUNTERS = ["pending", "active", "inflight", "queue bytes", "timer"] as const;
const MOMENTS = ["시작 전", "handshake", "Established", "교환 중", "종료 뒤"] as const;
const SHORT_MOMENTS = ["시작 전", "HS", "Est.", "교환 중", "종료 뒤"] as const;

const BASE: readonly (readonly string[])[] = [
  ["0", "0", "0", "0", "없음"],
  ["1", "0", "0", "0", "있음"],
  ["0", "1", "0", "0", "있음"],
  ["0", "1", "1", "> 0", "있음"],
  ["0", "0", "0", "0", "없음"],
];

const LEAK: readonly string[] = ["0", "1", "1", "0", "있음"];

const SCENES = [
  { label: "시작 전 기준선", summary: "모든 counter를 먼저 기록", note: "Run을 시작하기 전 값을 기준선으로 남깁니다. 이 그림은 연결이 하나도 없는 상태를 0으로 둔 가정입니다." },
  { label: "Handshake 중", summary: "pending 0 → 1", note: "연결이 identity·capability·Status를 확인하는 동안에는 pending slot 하나를 차지합니다. timer 칸의 있음·없음은 그림용 가정입니다." },
  { label: "Established", summary: "pending 1 → 0 · active 0 → 1", note: "정상 기준선의 Session receipt 값입니다. pending 자리가 비고 active session 하나가 생깁니다." },
  { label: "메시지 교환 중", summary: "inflight·queue가 잠시 늘어남", note: "Request를 보내고 응답을 기다리는 동안 inflight와 queue bytes가 0보다 커질 수 있습니다. 개수는 그림용 가정입니다." },
  { label: "종료 뒤 · 통과", summary: "다섯 counter 모두 기준선", note: "세션을 닫은 뒤 다섯 값이 모두 시작 전 값으로 돌아왔습니다. 정리는 통과입니다." },
  { label: "종료 뒤 · cleanup 실패", summary: "active·inflight·timer가 남음(가정)", note: "연결은 끝났는데 active 1, inflight 1과 timer가 남아 있습니다(가정). 기준선으로 돌아오지 않았으므로 cleanup 실패입니다." },
] as const;

export default function CleanupCountersViz() {
  return (
    <SceneShell
      eyebrow="종료 뒤 정리 판정"
      title="세션이 끝나면 모든 counter가 시작 전 값으로 돌아와야 합니다"
      description="열은 한 연결의 시점, 행은 자원 counter입니다. inflight는 응답을 기다리는 request 수, timer는 아직 살아 있는 timeout 예약입니다."
      ariaLabel="한 연결 동안 pending, active, inflight, queue bytes, timer 값이 변하고 종료 뒤 기준선으로 돌아오는지 비교"
      scenes={SCENES}
      render={(active) => {
        const shown = Math.min(active, MOMENTS.length - 1);
        const leak = active === SCENES.length - 1;
        return (
          <div className="grid min-w-0 grid-cols-[4.75rem_repeat(5,minmax(0,1fr))] gap-1 text-center text-[10px] sm:grid-cols-[6rem_repeat(5,minmax(0,1fr))] sm:gap-1.5 sm:text-xs">
            <span />
            {MOMENTS.map((moment, column) => (
              <span key={moment} className={`break-keep pb-1 font-bold ${column === shown ? "text-primary" : "text-muted-foreground"}`}>
                <span className="sm:hidden">{SHORT_MOMENTS[column]}</span>
                <span className="hidden sm:inline">{moment}</span>
              </span>
            ))}
            {COUNTERS.map((counter, row) => (
              <div key={counter} className="contents">
                <span className="self-center text-left font-mono font-bold">{counter}</span>
                {MOMENTS.map((moment, column) => {
                  const visible = column <= shown;
                  const value = leak && column === MOMENTS.length - 1 ? LEAK[row] : BASE[column][row];
                  const residual = leak && column === MOMENTS.length - 1 && value !== BASE[0][row];
                  const back = !leak && column === MOMENTS.length - 1 && visible;
                  return (
                    <div
                      key={moment}
                      className={`min-w-0 rounded border py-1.5 font-mono ${
                        !visible
                          ? "border-dashed border-border/50 text-transparent"
                          : residual
                            ? "border-[#dc2626] bg-[#dc2626]/10 font-bold text-red-700 dark:text-red-400"
                            : back
                              ? "border-[#16a34a] text-green-700 dark:text-green-400"
                              : column === shown
                                ? "border-primary"
                                : "border-border"
                      }`}
                    >
                      {visible ? value : "·"}
                    </div>
                  );
                })}
              </div>
            ))}
            <span />
            <span className="col-span-5 pt-1 text-left text-[10px] leading-4 text-muted-foreground sm:text-xs">
              <span className="mb-0.5 block sm:hidden">HS = handshake · Est. = Established</span>
              {active >= MOMENTS.length - 1 ? (leak ? "빨간 칸: 시작 전 값과 다름 → cleanup 실패" : "초록 칸: 시작 전 값과 같음") : "종료 뒤 열을 시작 전 열과 비교합니다"}
            </span>
          </div>
        );
      }}
    />
  );
}
