import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 연결 하나를 닫는 네 segment를 클라이언트(먼저 끊는 쪽)와 서버 두 열에 그린다.
 * 한 mechanism: 먼저 FIN을 보낸 쪽만 마지막 ACK 뒤 TIME_WAIT에 60초 머문다.
 */
const SCENES = ["연결 중", "클라이언트 FIN", "서버 ACK", "서버 FIN", "마지막 ACK", "FIN 재전송", "60초 뒤"] as const;

interface Scene {
  client: string;
  server: string;
  arrow: "none" | "right" | "left";
  segment: string;
  note: string;
  lost?: boolean;
}

const STATES: readonly Scene[] = [
  { client: "ESTABLISHED", server: "ESTABLISHED", arrow: "none", segment: "응답 수신 완료", note: "HTTP 응답을 다 받았습니다. 이 사례에서는 클라이언트 라이브러리가 먼저 close()를 부릅니다. (가정)" },
  { client: "FIN_WAIT_1", server: "CLOSE_WAIT", arrow: "right", segment: "FIN", note: "클라이언트가 FIN을 보내고 FIN_WAIT_1이 됩니다. 서버 커널은 FIN을 받고 CLOSE_WAIT가 되어 서버 프로그램이 close()를 부르기를 기다립니다." },
  { client: "FIN_WAIT_2", server: "CLOSE_WAIT", arrow: "left", segment: "ACK", note: "서버가 FIN을 확인합니다. 클라이언트는 FIN_WAIT_2에서 상대의 FIN을 기다립니다. tcp_fin_timeout이 정하는 것은 이 단계의 길이입니다." },
  { client: "FIN_WAIT_2", server: "LAST_ACK", arrow: "left", segment: "FIN", note: "서버 프로그램이 close()를 부르면 서버도 FIN을 보냅니다. 서버 프로그램이 close()를 빠뜨리면 이 단계가 오지 않고 CLOSE_WAIT가 쌓입니다." },
  { client: "TIME_WAIT", server: "CLOSED", arrow: "right", segment: "ACK", note: "클라이언트가 마지막 ACK를 보내고 TIME_WAIT에 들어갑니다. 서버는 ACK를 받자마자 CLOSED입니다. 4-tuple을 계속 붙잡는 쪽은 먼저 끊은 클라이언트뿐입니다." },
  { client: "TIME_WAIT", server: "LAST_ACK", arrow: "left", segment: "FIN 다시", lost: true, note: "마지막 ACK가 사라졌다면 서버는 FIN을 다시 보냅니다. TIME_WAIT 소켓이 남아 있어야 ACK를 다시 보내고 60초 타이머를 새로 겁니다. 소켓이 없었다면 RST가 갔을 것입니다." },
  { client: "CLOSED", server: "CLOSED", arrow: "none", segment: "타이머 만료", note: "60초 동안 같은 4-tuple의 옛 segment가 새 연결에 섞일 기회도 사라집니다. 그제야 출발 포트가 풀로 돌아갑니다." },
];

function StateBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className="whitespace-nowrap rounded-md border px-1 py-2 text-center font-mono text-[10px] font-bold sm:px-2 sm:text-xs"
      style={{
        borderColor: active ? "#2563eb" : undefined,
        color: active ? "#2563eb" : undefined,
      }}
    >
      {label}
    </div>
  );
}

export default function CloseHandshakeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const state = STATES[scene];
  const clientTw = state.client === "TIME_WAIT";

  return (
    <VizFrame
      eyebrow="Active close"
      title="FIN을 먼저 보낸 쪽만 TIME_WAIT를 지납니다"
      description="왼쪽이 먼저 끊는 클라이언트, 오른쪽이 서버입니다. 가운데 화살표가 이번 장면에 오가는 segment입니다."
      note="상태 이름은 ss -tan의 State 열과 같습니다. TIME_WAIT 60초는 Linux 상수 TCP_TIMEWAIT_LEN입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="TCP 연결 종료 handshake 상태 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_4.5rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="mb-1 text-[11px] text-muted-foreground">클라이언트 :41022</p>
              <StateBadge label={state.client} active={clientTw} />
            </div>
            <div className="flex flex-col items-center">
              <span
                className="mb-1 flex min-h-[2rem] items-end text-center font-mono text-[11px] font-bold leading-tight"
                style={{ color: state.lost ? "#dc2626" : undefined }}
              >
                {state.segment}
              </span>
              <svg viewBox="0 0 120 12" className="h-3 w-full" aria-hidden>
                {state.arrow !== "none" && (
                  <>
                    <line x1="4" y1="6" x2="116" y2="6" stroke="currentColor" strokeWidth="1" />
                    {state.arrow === "right" ? (
                      <polyline points="108,1 116,6 108,11" fill="none" stroke="currentColor" strokeWidth="1" />
                    ) : (
                      <polyline points="12,1 4,6 12,11" fill="none" stroke="currentColor" strokeWidth="1" />
                    )}
                  </>
                )}
              </svg>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-[11px] text-muted-foreground">서버 :8080</p>
              <StateBadge label={state.server} active={false} />
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-sm border border-border bg-muted/40" aria-hidden>
            <div
              className="h-full transition-[width] duration-500"
              style={{ width: clientTw ? "100%" : "0%", backgroundColor: "#2563eb" }}
            />
          </div>
          <p className="mt-1 font-mono text-[10px] text-muted-foreground">
            {clientTw ? "TIME_WAIT 타이머 60초 (다시 걸림 가능)" : "TIME_WAIT 타이머 없음"}
          </p>

          <p className="mt-4 min-h-[12rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[10.5rem] sm:min-h-[3.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
