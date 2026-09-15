import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: three-levels 절 — 표준이라는 한 단어에 섞인 세 수준 */
const SCENES = [
  "세 수준이 한 단어에 섞여 있습니다",
  "아래층은 그대로 옮겨집니다",
  "가운데층도 공통입니다",
  "위층은 새로 짜야 합니다",
] as const;

/** 아래에서 위로 쌓이는 세 수준 */
const LEVELS = [
  {
    name: "API 객체",
    what: "같은 스냅샷을 띄운 파드 집합을 선언하는 자원",
    portable: true,
    note: "스펙과 적합성 시험이 있는 층",
  },
  {
    name: "요청 경로 구현체",
    what: "그 집합에서 파드를 고르는 컴포넌트",
    portable: true,
    note: "네 곳이 같은 구현체를 감싸 쓰고 있는 층",
  },
  {
    name: "운영 매니페스트",
    what: "무엇을 얼마나 띄울지 선언하는 제어 자원",
    portable: false,
    note: "공급자마다 이름도 모양도 다른 층",
  },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

/** 장면마다 몇 번째 층까지 판정을 보여 줄지 */
const SHOW = [0, 1, 2, 3] as const;

const BOX_X = 24;
const BOX_W = 250;

export default function StandardLevelsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const shown = SHOW[s];

  const NOTES = [
    "이 스택이 표준이라는 말에는 서로 다른 세 가지가 섞여 있습니다. 자원의 모양을 정하는 층, 요청마다 도는 구현체 층, 그리고 무엇을 얼마나 띄울지 선언하는 층입니다. 세 층의 이식성이 서로 다릅니다.",
    "아래층은 실제로 공통입니다. 같은 스냅샷을 띄운 파드 집합을 선언하는 자원이 표준 스펙으로 있고 적합성 시험까지 있어서, 공급자를 바꿔도 이 선언은 그대로 옮겨집니다.",
    "가운데층도 공통입니다. 파드를 고르는 구현체를 네 곳의 관리형 상품이 각자 감싸 쓰고 있어서, 무엇을 보고 고르는지는 어디서나 같습니다. 큐 깊이와 캐시 여유와 어댑터 위치입니다.",
    "위층은 다릅니다. 무엇을 얼마나 띄울지 선언하는 자원은 공급자마다 이름과 모양이 다르고 인증과 용량 확보도 다릅니다. 여기는 옮기는 것이 아니라 공급자마다 어댑터를 따로 쓰는 층입니다.",
  ] as const;

  return (
    <VizFrame
      eyebrow="표준이라는 말에 섞인 것"
      title="같은 프리미티브를 쓰지만 같은 매니페스트로 운영되지는 않습니다"
      description="세 수준 가운데 아래 둘은 공급자를 바꿔도 그대로 옮겨지고, 위층은 옮겨지지 않습니다."
      note="쿠버네티스 위의 추론 서빙 스택을 기준으로 한 구분입니다. 층의 이름은 이 글이 붙인 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="표준의 세 수준과 각각의 이식성"
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
              <text x={BOX_X} y={18} fontSize={8} fontWeight={700} fill={MUTED}>
                위로 갈수록 공급자에 묶입니다
              </text>

              {LEVELS.map((lv, i) => {
                /** 위층이 위에 오도록 뒤집어 그린다 */
                const row = LEVELS.length - 1 - i;
                const y = 28 + row * 50;
                const judged = i < shown;
                const color = !judged ? MUTED : lv.portable ? OK : WARN;
                return (
                  <g key={lv.name}>
                    <rect
                      x={BOX_X}
                      y={y}
                      width={BOX_W}
                      height={42}
                      fill={color}
                      fillOpacity={judged ? 0.16 : 0.07}
                      stroke={color}
                      strokeWidth={1}
                      strokeOpacity={judged ? 1 : 0.4}
                    />
                    <text x={BOX_X + 10} y={y + 17} fontSize={10} fontWeight={700} fill={color}>
                      {lv.name}
                    </text>
                    <text x={BOX_X + 10} y={y + 32} fontSize={7.5} fill={MUTED}>
                      {lv.what}
                    </text>

                    <text
                      x={BOX_X + BOX_W + 14}
                      y={y + 17}
                      fontSize={9.5}
                      fontWeight={700}
                      fill={color}
                      fillOpacity={judged ? 1 : 0.35}
                    >
                      {judged ? (lv.portable ? "그대로 옮겨집니다" : "새로 짜야 합니다") : "판정 전"}
                    </text>
                    {judged && (
                      <text x={BOX_X + BOX_W + 14} y={y + 32} fontSize={7.5} fill={MUTED}>
                        {lv.note}
                      </text>
                    )}
                  </g>
                );
              })}

              <line x1={BOX_X} y1={186} x2={456} y2={186} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={BOX_X} y={198} fontSize={9} fontWeight={700} fill={shown >= 3 ? ACCENT : MUTED}>
                {shown >= 3
                  ? "같은 프리미티브 위에 공급자별 어댑터를 둡니다"
                  : `판정한 층 ${shown}개 · 남은 층 ${LEVELS.length - shown}개`}
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
