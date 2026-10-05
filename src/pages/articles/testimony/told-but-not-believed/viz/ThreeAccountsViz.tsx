import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: three-accounts 절. 세 이야기와 꼬리표는 헤로도토스 7권 148~152절 */
const SCENES = [
  "하나의 질문",
  "세 이야기",
  "세 꼬리표",
  "셋을 다 남김",
] as const;

const A = "#0ea5e9";
const B = "#f59e0b";
const C = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

const ROWS = [
  {
    color: A,
    tag: "아르고스인이 말한다",
    body: "신탁이 창을 거두라 했고, 스파르타가 지휘권을 안 줘 거절했다",
  },
  {
    color: B,
    tag: "헬라스에 다른 이야기가 돈다",
    body: "크세르크세스가 혈연을 들어 사절을 보냈고, 지휘권 요구는 핑계였다",
  },
  {
    color: C,
    tag: "이런 말도 전해진다",
    body: "아르고스인이 페르시아를 불러들인 당사자였다",
  },
] as const;

export default function ThreeAccountsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `아르고스는 그리스 연합이 보낸 사절을 돌려보내고 전쟁에 참여하지 않았습니다. 왜 그랬는지가 이 대목의 질문이고, 저자는 하나의 답을 고르지 않습니다.`,
    `세 이야기가 나란히 적혀 있습니다. 아르고스인 자신의 설명, 헬라스에 돌던 다른 이야기, 그리고 그들이 페르시아를 불러들였다는 더 심한 이야기입니다. 셋은 같은 일을 설명하면서 아르고스의 책임을 전혀 다르게 만듭니다.`,
    `셋을 가르는 것은 내용이 아니라 각 이야기에 붙은 꼬리표입니다. "아르고스인은 말한다", "헬라스에 다른 이야기가 전해진다", "이런 말도 전해진다"가 문장마다 붙어 있어, 어느 것이 누구의 주장인지가 본문 안에서 구분됩니다.`,
    `저자는 셋 중 하나를 지우지 않고 다 남깁니다. 지우면 판정이 되지만 그 판정의 근거는 남지 않고, 남기면 판정은 미뤄지지만 뒷사람이 같은 자료로 다시 따질 수 있습니다. 꼬리표는 그 미룸을 기록 안에 적어 두는 장치입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="세 이야기"
      title="같은 일에 대한 세 설명이 각각 누구의 말인지 적힌 채로 남아 있습니다"
      description="아르고스가 왜 참여하지 않았는가에 대한 세 설명이 서로 다른 책임을 가리키지만, 저자는 하나를 고르는 대신 각각의 출처를 붙여 셋을 모두 남깁니다."
      note="세 이야기와 각 꼬리표는 헤로도토스 『역사』 7권 148~152절의 것입니다. Macaulay 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="같은 일에 대한 세 설명이 출처 꼬리표와 함께 남아 있음을 보이는 그림"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100svh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
              <rect x={20} y={14} width={440} height={26} rx={4} fill={MUTED} opacity={0.1} stroke={MUTED} strokeWidth={1.25} />
              <text x={240} y={31} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle">
                아르고스는 왜 전쟁에 참여하지 않았는가
              </text>

              {ROWS.map((row, i) => {
                const y = 50 + i * 36;
                const lit = s >= 1;
                return (
                  <g key={row.tag}>
                    <rect
                      x={20}
                      y={y}
                      width={440}
                      height={30}
                      rx={4}
                      fill={row.color}
                      opacity={lit ? 0.13 : 0.05}
                      stroke={row.color}
                      strokeWidth={lit ? 1.25 : 0.75}
                    />
                    {s >= 2 && (
                      <rect x={26} y={y + 6} width={118} height={18} rx={3} fill={row.color} opacity={0.3} stroke={row.color} strokeWidth={0.75} />
                    )}
                    <text
                      x={s >= 2 ? 85 : 30}
                      y={y + 19}
                      fontSize={7.5}
                      fontWeight={700}
                      fill={s >= 2 ? INK : row.color}
                      textAnchor={s >= 2 ? "middle" : "start"}
                    >
                      {s >= 2 ? row.tag : `이야기 ${i + 1}`}
                    </text>
                    <text x={s >= 2 ? 152 : 92} y={y + 19} fontSize={7.5} fill={INK}>
                      {s >= 1 ? row.body : "같은 일에 대한 다른 설명"}
                    </text>
                  </g>
                );
              })}

              {s === 3 && (
                <g>
                  <rect x={20} y={158} width={212} height={26} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={126} y={174} fontSize={8} fill={MUTED} textAnchor="middle">
                    하나만 남기면 근거가 사라짐
                  </text>
                  <rect x={248} y={158} width={212} height={26} rx={4} fill={A} opacity={0.14} stroke={A} strokeWidth={1.25} />
                  <text x={354} y={174} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    셋을 남기면 뒷사람이 다시 따짐
                  </text>
                </g>
              )}

              <text x={20} y={196} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "이 질문에 대한 답이 책에 하나만 적혀 있지 않습니다"
                  : s === 1
                    ? "세 설명이 가리키는 아르고스의 책임이 서로 다릅니다"
                    : s === 2
                      ? "셋을 가르는 것은 문장에 붙은 출처 꼬리표입니다"
                      : "판정을 미루는 대신 다시 따질 수 있게 남겨 둡니다"}
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
