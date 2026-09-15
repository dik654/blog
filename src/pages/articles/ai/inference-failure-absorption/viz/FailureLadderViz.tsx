import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-axes 절 — 무엇이 죽었나와 요청이 어디까지 갔나가 함께 결과를 정한다 */
const SCENES = [
  "GPU 한 장이 죽으면",
  "클러스터 데이터 경로가 끊기면",
  "클러스터 컨트롤 플레인이 죽으면",
  "리전 하나가 사라지면",
] as const;

/** 죽는 것마다 누가 흡수하고, 얼마나 걸리고, 요청 상태별로 어떻게 되는지 */
const CASES = [
  {
    what: "GPU 한 장",
    detect: "DCGM → node-problem-detector → taint",
    absorb: "파드 재스케줄 · EPP가 즉시 제외",
    time: "초~분",
    states: ["영향 없음", "자동 재시도", "스트림 끊김"],
  },
  {
    what: "클러스터 데이터 경로",
    detect: "리전 게이트웨이 헬스체크",
    absorb: "인접 클러스터·리전·외부로 fallback",
    time: "초",
    states: ["TTFT 증가", "자동 재시도", "스트림 끊김"],
  },
  {
    what: "클러스터 컨트롤 플레인",
    detect: "hub·게이트웨이 헬스체크",
    absorb: "흡수할 것이 없음 · 데이터 경로는 살아 있음",
    time: "—",
    states: ["영향 없음", "영향 없음", "영향 없음"],
  },
  {
    what: "리전",
    detect: "Anycast 헬스 / GeoDNS",
    absorb: "엣지가 다른 리전으로",
    time: "초~분",
    states: ["다른 리전으로", "자동 재시도", "스트림 끊김"],
  },
] as const;

const STATE_LABELS = ["신규 요청", "출력 전 요청", "출력 중 요청"] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const tone = (v: string) =>
  v.includes("끊김") ? WARN : v.includes("없음") ? OK : ACCENT;

const COL_X = 152;
const COL_W = 104;

export default function FailureLadderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const s = scenes.active;
  const c = CASES[s];

  const NOTES = [
    "장애 감지가 노드에 표시를 남기면 파드가 다시 스케줄되고 파드를 고르는 쪽이 그 파드를 즉시 뺍니다. 새로 오는 요청은 영향이 없고 아직 출력 전인 요청은 다시 보내지지만, 이미 토큰이 나가던 요청의 생성 상태는 복원되지 않습니다.",
    "클러스터 하나로 가는 길이 끊기면 리전 게이트웨이가 인접 클러스터나 다른 리전으로 넘깁니다. 이때도 상주 제약은 그대로 적용되어 넘길 곳이 없으면 넘기지 않고 실패시킵니다. 출력 중이던 요청은 여기서도 끊깁니다.",
    "이 경우만 성격이 다릅니다. 데이터 경로는 살아 있어서 세 상태의 요청이 전부 정상입니다. 멈추는 것은 스케일과 재스케줄뿐입니다. 요청 경로에서 결정 경로를 빼 둔 설계가 실제로 값을 하는 자리가 여기입니다.",
    "리전 전체가 사라지면 엣지가 다른 리전으로 보냅니다. DNS로 넘기는 방식은 전파 시간만큼 늦는 대신 새 연결만 옮기므로 진행 중인 스트림에 오히려 안전합니다. 상주 제약이 걸린 요청은 넘어가지 못합니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="무엇이 죽었나 × 요청이 어디까지 갔나"
      title="같은 장애라도 요청이 어디까지 갔느냐에 따라 결과가 갈립니다"
      description="계층마다 흡수할 수 있는 장애와 걸리는 시간이 다르고, 이미 출력이 나간 요청은 어느 계층도 구하지 못합니다."
      note="네 가지만 추린 것입니다. 실제로는 스위치·랙·전원처럼 여러 노드를 한꺼번에 묶는 공통 장애점이 더 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="장애 흡수 계층과 요청 상태별 결과"
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
              <text x={14} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                죽는 것
              </text>
              <text x={14} y={40} fontSize={10} fontWeight={700} fill={ACCENT}>
                {c.what}
              </text>

              <text x={14} y={62} fontSize={8} fontWeight={700} fill={MUTED}>
                감지
              </text>
              <text x={14} y={75} fontSize={8} fill={MUTED}>
                {c.detect}
              </text>

              <text x={14} y={96} fontSize={8} fontWeight={700} fill={MUTED}>
                흡수
              </text>
              <text x={14} y={109} fontSize={8} fill={MUTED}>
                {c.absorb.slice(0, 22)}
              </text>
              {c.absorb.length > 22 && (
                <text x={14} y={120} fontSize={8} fill={MUTED}>
                  {c.absorb.slice(22)}
                </text>
              )}

              <text x={14} y={142} fontSize={8} fontWeight={700} fill={MUTED}>
                전환 시간
              </text>
              <text x={14} y={158} fontSize={11} fontWeight={700} fill={c.time === "—" ? OK : ACCENT}>
                {c.time}
              </text>

              <line x1={COL_X - 18} y1={16} x2={COL_X - 18} y2={186} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              {STATE_LABELS.map((label, i) => {
                const x = COL_X + i * COL_W;
                const v = c.states[i];
                const color = tone(v);
                return (
                  <g key={label}>
                    <text x={x} y={26} fontSize={8} fontWeight={700} fill={MUTED}>
                      {label}
                    </text>
                    <rect
                      x={x}
                      y={36}
                      width={COL_W - 14}
                      height={44}
                      fill={color}
                      fillOpacity={0.14}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text x={x + 8} y={62} fontSize={9.5} fontWeight={700} fill={color}>
                      {v}
                    </text>
                  </g>
                );
              })}

              <text x={COL_X} y={104} fontSize={8} fontWeight={700} fill={MUTED}>
                왜 갈리는가
              </text>
              <text x={COL_X} y={120} fontSize={8.5} fill={MUTED}>
                신규는 아직 아무 곳에도 매이지 않았고,
              </text>
              <text x={COL_X} y={133} fontSize={8.5} fill={MUTED}>
                출력 전은 200이 아직 커밋되지 않았으며,
              </text>
              <text x={COL_X} y={146} fontSize={8.5} fontWeight={700} fill={WARN}>
                출력 중은 이미 나간 글자를 되돌릴 수 없습니다.
              </text>

              <line x1={COL_X} y1={158} x2={452} y2={158} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={COL_X} y={176} fontSize={9} fontWeight={700} fill={c.states[2].includes("끊김") ? WARN : OK}>
                {c.states[2].includes("끊김")
                  ? "이 장애는 진행 중인 스트림을 살리지 못합니다"
                  : "이 장애는 세 상태 모두에 영향을 주지 않습니다"}
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
