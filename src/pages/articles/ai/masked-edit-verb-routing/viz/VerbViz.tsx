import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 여섯 동작이 모델에게 요구하는 것이 다름 */
const SCENES = ["속성만 바꾸기", "실체를 바꾸기", "없는 것을 다루기", "요구가 다릅니다"] as const;
const NOTES = [
  "있는 물건의 색이나 재질만 바꿉니다. 형태는 그대로 두어야 합니다.",
  "그 자리에 다른 물건을 세웁니다. 새 물건이 어디서 끝나는지도 정해야 합니다.",
  "없던 것을 만들어 내거나 있던 것을 없앱니다. 만들 수 없는 쪽이 하나 있습니다.",
  "한 모델로 전부 처리하면 어떤 요청은 무동작이 되고 어떤 요청은 영역이 망가집니다.",
] as const;

const KEEP = "#6366f1";
const SWAP = "#f59e0b";
const MAKE = "#10b981";
const NONE = "#ef4444";
const MUTED = "#94a3b8";

const VERBS = [
  { n: "색 변경", g: 0, ask: "속성만", c: KEEP },
  { n: "재질 변경", g: 0, ask: "속성만", c: KEEP },
  { n: "물건 교체", g: 1, ask: "실체 교체", c: SWAP },
  { n: "사실감", g: 1, ask: "실체 교체", c: SWAP },
  { n: "더하기", g: 2, ask: "없던 것 생성", c: MAKE },
  { n: "지우기", g: 2, ask: "있던 것 소거", c: NONE },
];

export default function VerbViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="마스크 안을 바꾸라는 말이 여섯 가지 다른 요구입니다"
      description="요구의 종류가 모델에게 무엇을 시키는지를 먼저 나눕니다."
      note="분류는 이 기록이 정리한 것이며 제품마다 동사 이름이 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="편집 동작의 분류"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={22} fontSize={9} fill={MUTED}>
              같은 마스크, 같은 호출 — 그런데 요구가 다릅니다
            </text>
            {VERBS.map((v, i) => {
              const on = step === 3 || v.g === step;
              const c = on ? v.c : MUTED;
              return (
                <g key={v.n}>
                  <rect x={24} y={34 + i * 26} width={96} height={21} fill={c} fillOpacity={on ? 0.14 : 0.04} stroke={c} strokeWidth={on ? 1.25 : 1} />
                  <text x={72} y={49 + i * 26} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {v.n}
                  </text>
                  <text x={132} y={49 + i * 26} fontSize={8} fill={c}>
                    {v.ask}
                  </text>
                  {step === 3 && (
                    <text x={220} y={49 + i * 26} fontSize={8} fill={c}>
                      {["형태 보존이 성공 조건", "형태 보존이 성공 조건", "끝나는 자리를 정해야 함", "인물이 유지되어야 함", "만들어 낼 수 있어야 함", "디노이저가 그릴 수 없는 대상"][i]}
                    </text>
                  )}
                </g>
              );
            })}
            {step === 0 && (
              <text x={24} y={200} fontSize={8} fill={KEEP}>
                매듭과 주름이 살아 있어야 성공입니다. 크게 바꾸는 모델이 오히려 불리합니다.
              </text>
            )}
            {step === 1 && (
              <text x={24} y={200} fontSize={8} fill={SWAP}>
                마스크가 옛 물건에 딱 붙어 있으면 새 물건의 끝을 볼 수 없습니다.
              </text>
            )}
            {step === 2 && (
              <text x={24} y={200} fontSize={8} fill={NONE}>
                지우기는 일곱 모델 전부 실패했습니다. 그 자리에 다른 물건을 그립니다.
              </text>
            )}
            {step === 3 && (
              <text x={24} y={200} fontSize={8} fontWeight={700} fill={MUTED}>
                그래서 선택은 모델 이름이 아니라 동작에서 시작합니다.
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
