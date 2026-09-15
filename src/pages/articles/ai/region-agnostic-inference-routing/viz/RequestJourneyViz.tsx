import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: six-choices 절 — 여섯 단계가 후보를 좁히고, 시간은 마지막에 쓰인다 */
const SCENES = [
  "① 엣지 · 누구인지 확인합니다",
  "② 모델 선택 · 기능이 후보를 자릅니다",
  "③④ 리전과 클러스터 · 제약이 자릅니다",
  "⑤⑥ 파드와 엔진 · 시간은 여기서 씁니다",
] as const;

/** 각 단계가 무엇을 정하고, 얼마를 쓰고, 남은 (스냅샷, endpoint) 쌍이 몇 개인지 */
const STAGES = [
  { tag: "①", name: "엣지", decides: "테넌트와 정책", ms: 3, left: 24 },
  { tag: "②", name: "모델 선택", decides: "쓸 수 있는 스냅샷", ms: 6, left: 12 },
  { tag: "③", name: "리전 선택", decides: "상주 제약을 통과한 리전", ms: 3, left: 4 },
  { tag: "④", name: "리전 GW", decides: "리전 안의 클러스터", ms: 2, left: 1 },
  { tag: "⑤", name: "클러스터 GW", decides: "파드 하나", ms: 2, left: 1 },
] as const;

/** 엔진 안에서 쓰이는 시간 */
const QUEUE_MS = 40;
const PREFILL_MS = 180;

/** 장면마다 몇 단계까지 보여 줄지 */
const SHOW = [1, 2, 4, 5] as const;

const ROUTING_MS = STAGES.reduce((a, s) => a + s.ms, 0);
const ENGINE_MS = QUEUE_MS + PREFILL_MS;
const TTFT = ROUTING_MS + ENGINE_MS;
const ROUTING_SHARE = Math.round((ROUTING_MS / TTFT) * 1000) / 10;

const upTo = (n: number) =>
  STAGES.slice(0, n).reduce((a, s) => a + s.ms, 0);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const COL_X = 64;
const COL_W = 72;

export default function RequestJourneyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const shown = SHOW[s];
  const done = s === SCENES.length - 1;

  const NOTES = [
    `가장 가까운 PoP에서 TLS를 끝내고 키를 확인해 테넌트 정책을 요청에 붙입니다. 아직 GPU와는 아무 상관이 없고, 고를 수 있는 (스냅샷, endpoint) 쌍은 ${STAGES[0].left}개 그대로입니다.`,
    `슬러그는 모델 이름이 아니라 계약입니다. 이 요청이 쓰는 도구 호출을 지원하지 않는 스냅샷이 여기서 빠져 쌍이 ${STAGES[0].left}개에서 ${STAGES[1].left}개로 줄어듭니다. 아직 ${upTo(2)}밀리초입니다.`,
    `한국 밖으로 나갈 수 없는 테넌트면 서울만 후보라 쌍이 ${STAGES[2].left}개로 잘리고, 리전 안에서 클러스터를 고르면 ${STAGES[3].left}개가 됩니다. 후보가 없으면 넘기지 않고 실패시킵니다.`,
    `EPP가 큐 깊이와 KV 여유와 캐시 적중을 보고 파드를 고릅니다. 고르는 데 쓴 시간은 합쳐 ${ROUTING_MS}밀리초이고 엔진이 ${ENGINE_MS}밀리초를 씁니다. 여섯 번의 선택이 ${ROUTING_SHARE}퍼센트입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="리전도 모델 버전도 고르지 않는 API"
      title="여섯 번 고르지만 시간은 마지막 한 번에서 씁니다"
      description="앞의 다섯 단계는 후보를 자르는 일이고, 첫 토큰까지의 시간은 대부분 엔진 안에서 흐릅니다."
      note="한 요청의 예시 값입니다. 라우팅 계층 합은 측정 범위를 정하기 전의 가정이고, 큐 대기는 부하에 따라 0에서 수 초까지 움직입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="여섯 단계의 후보 축소와 시간 배분"
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
              <text x={COL_X - 10} y={26} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                단계
              </text>
              <text x={COL_X - 10} y={62} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                무엇을 정하나
              </text>
              <text x={COL_X - 10} y={92} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                남은 후보 쌍
              </text>
              <text x={COL_X - 10} y={118} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                쓴 시간
              </text>

              {STAGES.map((st, i) => {
                const x = COL_X + i * COL_W;
                const active = i < shown;
                const isLast = i === shown - 1;
                const color = active ? (isLast ? ACCENT : MUTED) : MUTED;
                return (
                  <g key={st.tag} opacity={active ? 1 : 0.28}>
                    <rect
                      x={x}
                      y={14}
                      width={COL_W - 8}
                      height={18}
                      fill={color}
                      fillOpacity={isLast ? 0.28 : 0.12}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text x={x + 5} y={27} fontSize={9} fontWeight={700} fill={color}>
                      {st.tag} {st.name}
                    </text>
                    <text x={x + 5} y={52} fontSize={7.5} fill={MUTED}>
                      {st.decides.slice(0, 11)}
                    </text>
                    {st.decides.length > 11 && (
                      <text x={x + 5} y={62} fontSize={7.5} fill={MUTED}>
                        {st.decides.slice(11)}
                      </text>
                    )}
                    <text
                      x={x + 5}
                      y={92}
                      fontSize={12}
                      fontWeight={700}
                      fill={i > 0 && st.left < STAGES[i - 1].left ? OK : color}
                    >
                      {st.left}
                    </text>
                    <text x={x + 5} y={118} fontSize={9} fontWeight={700} fill={color}>
                      +{st.ms}ms
                    </text>
                  </g>
                );
              })}

              <line x1={COL_X - 46} y1={132} x2={452} y2={132} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.5} />

              <text x={COL_X - 10} y={152} textAnchor="end" fontSize={8} fontWeight={700} fill={MUTED}>
                첫 토큰까지
              </text>
              <rect
                x={COL_X}
                y={142}
                width={(upTo(shown) / TTFT) * 340}
                height={13}
                fill={ACCENT}
                fillOpacity={0.5}
                stroke={ACCENT}
                strokeWidth={1}
              />
              {done && (
                <>
                  <rect
                    x={COL_X + (ROUTING_MS / TTFT) * 340}
                    y={142}
                    width={(QUEUE_MS / TTFT) * 340}
                    height={13}
                    fill={WARN}
                    fillOpacity={0.35}
                    stroke={WARN}
                    strokeWidth={1}
                  />
                  <rect
                    x={COL_X + ((ROUTING_MS + QUEUE_MS) / TTFT) * 340}
                    y={142}
                    width={(PREFILL_MS / TTFT) * 340}
                    height={13}
                    fill={OK}
                    fillOpacity={0.3}
                    stroke={OK}
                    strokeWidth={1}
                  />
                </>
              )}
              <text x={COL_X + 346} y={152} fontSize={9} fontWeight={700} fill={MUTED}>
                {done ? `${TTFT}ms` : `${upTo(shown)}ms`}
              </text>

              {done ? (
                <>
                  <text x={COL_X} y={176} fontSize={9} fontWeight={700} fill={ACCENT}>
                    고르는 데 {ROUTING_MS}ms
                  </text>
                  <text x={COL_X + 108} y={176} fontSize={9} fontWeight={700} fill={WARN}>
                    큐 {QUEUE_MS}ms
                  </text>
                  <text x={COL_X + 178} y={176} fontSize={9} fontWeight={700} fill={OK}>
                    prefill {PREFILL_MS}ms
                  </text>
                  <text x={COL_X} y={192} fontSize={9.5} fontWeight={700} fill={MUTED}>
                    여섯 번의 선택이 첫 토큰까지의 {ROUTING_SHARE}퍼센트입니다
                  </text>
                </>
              ) : (
                <text x={COL_X} y={176} fontSize={9.5} fontWeight={700} fill={MUTED}>
                  여기까지 후보 {STAGES[shown - 1].left}쌍 · 쓴 시간 {upTo(shown)}ms
                </text>
              )}
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
