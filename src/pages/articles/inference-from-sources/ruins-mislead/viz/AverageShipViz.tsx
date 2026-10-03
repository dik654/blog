import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: using-the-rule·conditions 절. 수치는 투키디데스 1권 10절, 곱셈은 이 글 */
const SCENES = ["두 수만 적힘", "최대와 최소", "평균", "결론의 방향"] as const;

const BIG = "#f59e0b";
const SMALL = "#0ea5e9";
const MID = "#10b981";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function AverageShipViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `저자가 쓸 수 있는 자료는 시인이 남긴 수뿐입니다. 배는 1,200척이고, 보이오티아 배는 한 척에 120명, 필록테테스의 배는 50명이라고 적혀 있습니다. 나머지 배의 인원은 목록 어디에도 없습니다.`,
    `저자는 이 두 수를 빠진 자료로 보지 않고 경계로 읽습니다. 다른 배의 인원을 적지 않은 것으로 보아 시인이 이 둘로 가장 많은 쪽과 가장 적은 쪽을 나타내려 했다고 본 것입니다. 적히지 않은 것을 적힌 것의 성격을 푸는 단서로 쓴 셈입니다.`,
    `그다음이 평균입니다. 가장 큰 배와 가장 작은 배의 평균을 잡으면 한 척에 85명이 되고, 저자는 그렇게 하면 건너간 사람의 수가 대단치 않게 보인다고 적습니다. 1,200척을 곱한 값은 책에 없습니다. 아래 수는 이 글이 해 본 곱셈입니다.`,
    `이 추론이 향한 방향을 눈여겨볼 만합니다. 앞 절에서 폐허만 보고 작게 보지 말라고 했던 저자가, 여기서는 전해지는 수를 그대로 받지 않고 작게 잡습니다. 규칙은 늘 크게 보라는 것이 아니라 남은 것의 치우침을 거슬러 보라는 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="평균 잡기"
      title="적히지 않았다는 사실을 단서로 삼아 적힌 두 수를 경계로 읽습니다"
      description="시인이 두 척의 인원만 적은 것을 최대와 최소의 표시로 보고 평균을 잡아, 건너간 사람의 수가 대단치 않았다는 결론을 끌어냅니다."
      note="1,200척·120명·50명과 '대단치 않다'는 결론은 투키디데스 1권 10절의 것입니다. 85명과 102,000이라는 곱은 이 글이 계산한 것이고 책에 적혀 있지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 척의 인원을 최대와 최소로 보고 평균을 잡는 추론을 보이는 그림"
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
              <text x={20} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                시인이 남긴 수
              </text>
              <rect x={20} y={30} width={130} height={26} rx={4} fill={MUTED} opacity={0.1} stroke={MUTED} strokeWidth={0.75} />
              <text x={85} y={47} fontSize={9} fontWeight={700} fill={INK} textAnchor="middle">
                배 1,200척
              </text>

              {/* 수직선 */}
              <line x1={200} y1={60} x2={200} y2={140} stroke={MUTED} strokeWidth={1.25} />
              <line x1={196} y1={60} x2={204} y2={60} stroke={BIG} strokeWidth={1.25} />
              <line x1={196} y1={140} x2={204} y2={140} stroke={SMALL} strokeWidth={1.25} />
              <text x={212} y={64} fontSize={8.5} fontWeight={700} fill={BIG}>
                보이오티아 배 120명
              </text>
              <text x={212} y={144} fontSize={8.5} fontWeight={700} fill={SMALL}>
                필록테테스 배 50명
              </text>

              {s === 0 && (
                <g>
                  <text x={212} y={100} fontSize={8} fill={MUTED}>
                    나머지 배의 인원은 목록에 없음
                  </text>
                  <text x={212} y={116} fontSize={8} fill={MUTED}>
                    빠진 자료로 보면 여기서 끝납니다
                  </text>
                </g>
              )}

              {s === 1 && (
                <g>
                  <rect x={212} y={78} width={248} height={44} rx={4} fill={MID} opacity={0.12} stroke={MID} strokeWidth={1.25} />
                  <text x={224} y={94} fontSize={8} fontWeight={700} fill={INK}>
                    다른 배를 적지 않았다는 사실 자체가 단서
                  </text>
                  <text x={224} y={110} fontSize={8} fill={INK}>
                    두 수를 가장 많은 쪽과 가장 적은 쪽으로 읽습니다
                  </text>
                </g>
              )}

              {s >= 2 && (
                <g>
                  <line x1={196} y1={100} x2={204} y2={100} stroke={MID} strokeWidth={1.25} />
                  <circle cx={200} cy={100} r={3.4} fill={MID} />
                  <text x={212} y={96} fontSize={9} fontWeight={700} fill={MID}>
                    평균 한 척 85명
                  </text>
                  <text x={212} y={110} fontSize={7.5} fill={MUTED}>
                    (120 + 50) ÷ 2
                  </text>
                </g>
              )}

              {s === 2 && (
                <g>
                  <rect x={330} y={30} width={130} height={56} rx={4} fill={MUTED} opacity={0.08} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={342} y={46} fontSize={7.5} fontWeight={700} fill={MUTED}>
                    이 글이 해 본 곱셈
                  </text>
                  <text x={342} y={62} fontSize={9.5} fontWeight={700} fill={INK}>
                    1,200 × 85 = 102,000
                  </text>
                  <text x={342} y={78} fontSize={7.5} fill={MUTED}>
                    책에는 이 곱이 없습니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={154} width={214} height={30} rx={4} fill={SMALL} opacity={0.13} stroke={SMALL} strokeWidth={1.25} />
                  <text x={127} y={166} fontSize={7.5} fontWeight={700} fill={INK} textAnchor="middle">
                    폐허만 보고 작게 보지 말 것
                  </text>
                  <text x={127} y={178} fontSize={7.5} fill={INK} textAnchor="middle">
                    남은 것이 적은 쪽을 올려 봄
                  </text>

                  <rect x={246} y={154} width={214} height={30} rx={4} fill={BIG} opacity={0.13} stroke={BIG} strokeWidth={1.25} />
                  <text x={353} y={166} fontSize={7.5} fontWeight={700} fill={INK} textAnchor="middle">
                    전해지는 수를 그대로 받지 말 것
                  </text>
                  <text x={353} y={178} fontSize={7.5} fill={INK} textAnchor="middle">
                    시인이 남긴 수를 내려 봄
                  </text>
                </g>
              )}

              {s < 3 && (
                <text x={20} y={178} fontSize={8} fontWeight={700} fill={INK}>
                  {s === 0
                    ? "자료는 두 수뿐이고 나머지는 적혀 있지 않습니다"
                    : s === 1
                      ? "적히지 않았다는 사실을 단서로 씁니다"
                      : "두 수의 평균을 잡아 전체를 가늠합니다"}
                </text>
              )}
              {s < 3 && (
                <text x={20} y={191} fontSize={7.5} fill={MUTED}>
                  저자는 결론을 수가 아니라 '대단치 않다'는 말로 적습니다
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
