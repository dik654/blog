import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: commit-point 절 — 첫 의미 있는 출력 청크가 되돌릴 수 없는 선을 긋는다 */
const SCENES = [
  "연결이 안 되면 프록시가 다시 보냅니다",
  "응답 전 500이면 게이트웨이가 바꿉니다",
  "heartbeat만 나갔으면 아직 바꿉니다",
  "첫 출력 청크 뒤에는 못 바꿉니다",
] as const;

/** 스트림에서 실제로 나가는 것들과, 그 시점에 백엔드를 바꿀 수 있는지 */
const EVENTS = [
  { at: 0, label: "요청 도착", kind: "req" },
  { at: 1, label: "백엔드 연결", kind: "conn" },
  { at: 2, label: "200 헤더", kind: "head" },
  { at: 3, label: ": ping", kind: "ping" },
  { at: 4, label: "첫 출력 청크", kind: "chunk" },
  { at: 5, label: "이후 청크들", kind: "chunk" },
] as const;

/** 장면마다 실패가 생기는 지점과, 그때 누가 처리하는지 */
const CASES = [
  { failAt: 1, handler: "HTTP 계층 (Envoy)", how: "다른 백엔드로 재시도", safe: true },
  { failAt: 2, handler: "게이트웨이", how: "다른 백엔드로 재시도", safe: true },
  { failAt: 3, handler: "게이트웨이", how: "다른 백엔드로 재시도", safe: true },
  { failAt: 5, handler: "되돌릴 수 없음", how: "스트림 안 error 이벤트로 알림", safe: false },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 74;
const STEP = 62;
const px = (at: number) => X0 + at * STEP;
/** 되돌릴 수 없어지는 지점 = 첫 출력 청크 */
const COMMIT_AT = 4;

export default function RetryBoundaryViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const s = scenes.active;
  const c = CASES[s];

  const NOTES = [
    "백엔드에 연결조차 되지 않았으면 프록시가 그대로 다른 백엔드로 보냅니다. 아직 클라이언트에게 아무것도 나가지 않았기 때문에 가장 안전한 구간입니다.",
    "연결은 됐는데 응답이 시작되기 전에 500이 오면 프록시도 다시 보낼 수 있습니다. 프록시가 다룰 수 있는 것은 여기까지입니다. 스트림 안의 내용은 프록시가 이해하지 못합니다.",
    "200 헤더가 나가고 ping 주석만 흘렀다면 아직 의미 있는 출력이 아닙니다. 스트림을 소유한 게이트웨이는 이 구간까지 백엔드를 바꿀 수 있습니다.",
    "첫 출력 청크가 나가면 200이 이미 커밋되어 상태 코드로 실패를 알릴 수 없습니다. 이 뒤로는 스트림 안의 error 이벤트로 알립니다. 헤더에 서빙 위치를 적으면 안 되는 이유도 같습니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="어디까지 다시 보낼 수 있는가"
      title="첫 출력 청크가 되돌릴 수 없는 선을 긋습니다"
      description="그 선 앞에서는 백엔드를 바꿀 수 있고, 뒤에서는 스트림 안에서만 알릴 수 있습니다."
      note="SSE 스트리밍 응답을 기준으로 한 구분입니다. 어떤 이벤트를 의미 있는 출력으로 볼지는 서비스마다 명시적으로 정해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="재시도가 가능한 구간과 불가능한 구간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <rect
                x={px(0) - 16}
                y={34}
                width={px(COMMIT_AT) - px(0)}
                height={26}
                fill={OK}
                fillOpacity={0.12}
                stroke={OK}
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              <rect
                x={px(COMMIT_AT) - 16}
                y={34}
                width={px(5) - px(COMMIT_AT) + 44}
                height={26}
                fill={WARN}
                fillOpacity={0.1}
                stroke={WARN}
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              <text x={px(0) - 14} y={30} fontSize={8} fontWeight={700} fill={OK}>
                백엔드를 바꿀 수 있는 구간
              </text>
              <text x={px(COMMIT_AT) - 14} y={30} fontSize={8} fontWeight={700} fill={WARN}>
                되돌릴 수 없는 구간
              </text>

              <line x1={px(0) - 20} y1={78} x2={px(5) + 30} y2={78} stroke={MUTED} strokeWidth={0.75} />

              {EVENTS.map((e) => {
                const isCommit = e.at === COMMIT_AT;
                const past = e.at <= c.failAt;
                const color = isCommit ? WARN : past ? ACCENT : MUTED;
                return (
                  <g key={e.label} opacity={past || isCommit ? 1 : 0.35}>
                    <circle cx={px(e.at)} cy={78} r={isCommit ? 4 : 3} fill={color} />
                    <text
                      x={px(e.at)}
                      y={e.at % 2 === 0 ? 70 : 96}
                      textAnchor="middle"
                      fontSize={8}
                      fontWeight={isCommit ? 700 : 400}
                      fill={color}
                    >
                      {e.label}
                    </text>
                  </g>
                );
              })}

              <line
                x1={px(COMMIT_AT)}
                y1={34}
                x2={px(COMMIT_AT)}
                y2={104}
                stroke={WARN}
                strokeWidth={1.25}
              />

              <line
                x1={px(c.failAt)}
                y1={110}
                x2={px(c.failAt)}
                y2={126}
                stroke={c.safe ? OK : WARN}
                strokeWidth={1.25}
              />
              <text
                x={px(c.failAt)}
                y={138}
                textAnchor="middle"
                fontSize={9}
                fontWeight={700}
                fill={c.safe ? OK : WARN}
              >
                여기서 실패
              </text>

              <line x1={px(0) - 20} y1={150} x2={px(5) + 30} y2={150} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.5} />
              <text x={px(0) - 20} y={168} fontSize={8.5} fontWeight={700} fill={MUTED}>
                누가 처리하나
              </text>
              <text x={px(1) + 6} y={168} fontSize={9.5} fontWeight={700} fill={c.safe ? OK : WARN}>
                {c.handler}
              </text>
              <text x={px(0) - 20} y={186} fontSize={8.5} fontWeight={700} fill={MUTED}>
                어떻게
              </text>
              <text x={px(1) + 6} y={186} fontSize={9.5} fill={MUTED}>
                {c.how}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
