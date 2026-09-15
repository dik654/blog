import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: repeated-fix 절 — 같은 주장이 세 라운드에 걸쳐 세 번 고쳐진 기록 */
const SCENES = [
  "초판 · 두 값을 나란히 놓았습니다",
  "1라운드 뒤 · 기준을 맞췄습니다",
  "2라운드 뒤 · 임계값을 지웠습니다",
  "3라운드 뒤 · 순서도 내렸습니다",
] as const;

/** 같은 주장이 라운드마다 어떻게 바뀌었는지 */
const STEPS = [
  {
    claim: "소유 60% 가동 4.24와 임대 정가 4.60을 견주면 차이가 작다",
    flaw: "한쪽만 가동률로 나눔",
    kind: "비교의 단위",
    alive: false,
  },
  {
    claim: "임대를 상시와 탄력으로 갈라 같은 가동률로 다시 계산한다",
    flaw: "40퍼센트 아래면 임대가 늘 싸다는 임계값이 남음",
    kind: "한 사례를 보편 규칙으로",
    alive: false,
  },
  {
    claim: "임계값을 지우고 손익분기는 계약마다 다르다고 적는다",
    flaw: "소유에서 탄력 임대, 그다음 외부라는 순서가 남음",
    kind: "도출되지 않은 순서",
    alive: false,
  },
  {
    claim: "그 순서는 조건부 운영 정책이고 청구 증가액으로 비교한다",
    flaw: "지금까지는 남아 있음",
    kind: "—",
    alive: true,
  },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const X0 = 24;
const BOX_W = 300;

export default function ClaimTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const s = scenes.active;

  const NOTES = [
    "손익을 견주는 표 하나를 따라가 보겠습니다. 초판은 소유를 가동률로 나눈 값과 임대 정가를 나란히 놓았습니다. 한쪽만 나눈 비교라 차이가 실제보다 훨씬 작아 보였고, 첫 라운드에서 가장 먼저 지적됐습니다.",
    "임대를 유휴가 청구되는 쪽과 아닌 쪽으로 갈라 같은 가동률로 다시 계산했습니다. 표는 맞아졌는데 그 위에 얹힌 문장이 남았습니다. 어느 선 아래면 임대가 늘 싸다는 임계값입니다.",
    "두 번째 라운드에서 그 임계값이 계약마다 달라 보편 기준이 될 수 없다는 지적을 받고 지웠습니다. 그래도 하나가 더 남아 있었습니다. 자체 용량에서 탄력 임대, 그다음 외부로 넘긴다는 순서입니다.",
    "세 번째 라운드에서 그 순서도 비용 항목 분류에서 도출되지 않는다는 지적을 받고 조건부 운영 정책으로 내렸습니다. 같은 표 하나가 세 번 고쳐졌고, 매번 앞 수정이 만든 빈틈에서 다음 지적이 나왔습니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="같은 주장을 세 번 고쳤습니다"
      title="고칠 때마다 앞 수정이 만든 빈틈에서 다음 지적이 나왔습니다"
      description="표를 맞추자 그 위의 문장이 남았고, 문장을 지우자 그 아래 순서가 남았습니다."
      note="여러 지적 가운데 하나의 주장을 골라 라운드별로 이어 붙인 것입니다. 나머지 지적도 대체로 같은 모양으로 이어졌습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 주장이 세 라운드를 거친 기록"
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
              {STEPS.map((st, i) => {
                const y = 16 + i * 44;
                const past = i < s;
                const now = i === s;
                const color = st.alive ? OK : now ? WARN : ACCENT;
                const dim = i > s;
                return (
                  <g key={i} opacity={dim ? 0.22 : past ? 0.5 : 1}>
                    <rect
                      x={X0}
                      y={y}
                      width={BOX_W}
                      height={34}
                      fill={color}
                      fillOpacity={now ? 0.16 : 0.07}
                      stroke={color}
                      strokeWidth={1}
                      strokeOpacity={now ? 1 : 0.5}
                    />
                    <text x={X0 + 8} y={y + 14} fontSize={8} fontWeight={700} fill={color}>
                      {i === 0 ? "초판" : `${i}라운드 뒤`}
                    </text>
                    <text x={X0 + 8} y={y + 27} fontSize={7.5} fill={MUTED}>
                      {st.claim}
                    </text>

                    {now && (
                      <>
                        <text x={X0 + BOX_W + 14} y={y + 14} fontSize={8.5} fontWeight={700} fill={color}>
                          {st.alive ? "아직 남아 있습니다" : "여기가 지적됐습니다"}
                        </text>
                        <text x={X0 + BOX_W + 14} y={y + 27} fontSize={7.5} fill={MUTED}>
                          {st.alive ? st.flaw : st.kind}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              <line x1={X0} y1={188} x2={456} y2={188} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={X0} y={198} fontSize={9} fontWeight={700} fill={s === STEPS.length - 1 ? OK : MUTED}>
                {s === STEPS.length - 1
                  ? "표 하나가 세 번 고쳐졌고 매번 다른 종류의 지적이었습니다"
                  : `지적받은 것: ${STEPS[s].flaw}`}
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
