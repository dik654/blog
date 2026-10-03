import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: where-it-slips·what-we-can-say 절. 어긋날 자리의 분류는 이 글이 정리한 것 */
const SCENES = [
  "빽빽함의 정도",
  "담은 한 번만 쌓음",
  "마지막 채움",
  "말할 수 있는 범위",
] as const;

const SLIP = "#ef4444";
const KEEP = "#0ea5e9";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function WhereItCanSlipViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const s = scenes.active;

  const NOTES = [
    `첫째로 흔들리는 것은 빽빽함입니다. 사료는 할 수 있는 만큼 빽빽하게 세웠다고 적지만 그 정도를 숫자로 적지 않았습니다. 뒤에 들어간 무리가 조금 느슨하게 서면 같은 담이 1만보다 적은 사람을 담고, 그 차이가 채움마다 같은 방향으로 쌓입니다.`,
    `둘째는 담을 한 번만 쌓았다는 점입니다. 눈금은 첫 1만 명의 몸집과 장비로 정해졌습니다. 몸집이 다르거나 방패와 창을 다르게 든 부대가 들어가면 같은 공간이 다른 수를 담습니다. 눈금이 고정되어 있다는 것은 편해지는 대신 그 차이를 흡수하지 못한다는 뜻입니다.`,
    `셋째는 마지막 채움입니다. 사람 수가 1만의 배수일 이유가 없으므로 마지막에는 담이 덜 찬 상태로 남습니다. 그 덜 찬 정도를 어떻게 처리했는지는 적혀 있지 않습니다. 170만이라는 수가 끝자리까지 0인 것은 이 절차에서 나올 수 있는 가장 자연스러운 모양입니다.`,
    `세 자리의 어긋남을 합쳐 보면 쓸 수 있는 결론이 정해집니다. 이 수는 사람 하나 단위로는 아무 말도 하지 않고, 1만 단위로는 170번이라는 관찰을 전합니다. 그래서 이 수로 할 수 있는 일은 규모의 자릿수를 읽는 것이고, 할 수 없는 일은 다른 기록의 수와 끝자리를 맞춰 보는 것입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="어긋날 자리"
      title="눈금으로 센 수는 눈금보다 작은 차이를 담지 못합니다"
      description="빽빽함의 정도, 담을 한 번만 쌓았다는 점, 마지막 채움의 처리가 각각 어긋남을 만들고, 그 어긋남은 모두 1만이라는 눈금 안에 묻힙니다."
      note="절차와 170만은 헤로도토스 7권 60절의 것입니다. 어긋날 자리를 셋으로 가른 것은 이 글이 정리한 것이고 사료에 그 꼴로 적혀 있지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="눈금으로 센 수가 어디서 어긋나는지와 그래서 말할 수 있는 범위를 보이는 그림"
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
              {s < 3 ? (
                <g>
                  {/* 두 가지 채움 비교 */}
                  {[0, 1].map((k) => {
                    const cx = 108 + k * 150;
                    // 36 = 꽉 찬 눈금. 오른쪽 원은 장면마다 다른 이유로 덜 찹니다.
                    const n = k === 0 ? 36 : s === 0 ? 24 : s === 1 ? 25 : 12;
                    const step = s === 0 && k === 1 ? 10.5 : 8.5;
                    const cols = 6;
                    const rows = Math.ceil(n / cols);
                    return (
                      <g key={k}>
                        <circle cx={cx} cy={78} r={46} fill={KEEP} opacity={0.07} stroke={k === 0 ? KEEP : SLIP} strokeWidth={1.25} />
                        {Array.from({ length: n }, (_, i) => (
                          <circle
                            key={i}
                            cx={cx + ((i % cols) - (cols - 1) / 2) * step}
                            cy={78 + (Math.floor(i / cols) - (rows - 1) / 2) * 9}
                            r={2.2}
                            fill={k === 0 ? KEEP : SLIP}
                            opacity={0.75}
                          />
                        ))}
                        <text x={cx} y={136} fontSize={8} fontWeight={700} fill={k === 0 ? KEEP : SLIP} textAnchor="middle">
                          {k === 0
                            ? "눈금을 만든 1만"
                            : s === 0
                              ? "조금 느슨하게 선 무리"
                              : s === 1
                                ? "몸집·장비가 다른 부대"
                                : "마지막에 남은 무리"}
                        </text>
                        <text x={cx} y={150} fontSize={7.5} fill={INK} textAnchor="middle">
                          {k === 0
                            ? "담이 꼭 찬 상태"
                            : s === 2
                              ? "담이 덜 찬 상태"
                              : "같은 담에 더 적게 들어감"}
                        </text>
                      </g>
                    );
                  })}

                  <rect x={310} y={40} width={156} height={74} rx={4} fill={SLIP} opacity={0.08} stroke={SLIP} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={322} y={56} fontSize={8} fontWeight={700} fill={SLIP}>
                    어긋나는 방향
                  </text>
                  <text x={322} y={72} fontSize={7.5} fill={INK}>
                    {s === 0 ? "채움마다 같은 쪽으로 쌓임" : s === 1 ? "부대 구성에 따라 달라짐" : "덜 찬 몫의 처리가 적혀 있지 않음"}
                  </text>
                  <text x={322} y={88} fontSize={7.5} fill={INK}>
                    {s === 0 ? "많은 쪽으로 기울 수 있음" : s === 1 ? "눈금이 차이를 흡수하지 못함" : "끝자리가 0인 모양이 자연스러움"}
                  </text>
                  <text x={322} y={105} fontSize={7.5} fill={MUTED}>
                    차이는 1만보다 작아 묻힙니다
                  </text>
                </g>
              ) : (
                <g>
                  <rect x={20} y={24} width={214} height={64} rx={5} fill={KEEP} opacity={0.13} stroke={KEEP} strokeWidth={1.25} />
                  <text x={32} y={42} fontSize={8.5} fontWeight={700} fill={KEEP}>
                    이 수로 할 수 있는 일
                  </text>
                  <text x={32} y={58} fontSize={7.5} fill={INK}>
                    규모의 자릿수를 읽는다
                  </text>
                  <text x={32} y={72} fontSize={7.5} fill={INK}>
                    채움이 170번이었다는 관찰을 받는다
                  </text>
                  <text x={32} y={84} fontSize={7.5} fill={MUTED}>
                    1만 단위에서의 진술입니다
                  </text>

                  <rect x={246} y={24} width={214} height={64} rx={5} fill={SLIP} opacity={0.1} stroke={SLIP} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={258} y={42} fontSize={8.5} fontWeight={700} fill={SLIP}>
                    할 수 없는 일
                  </text>
                  <text x={258} y={58} fontSize={7.5} fill={INK}>
                    사람 하나 단위로 말한다
                  </text>
                  <text x={258} y={72} fontSize={7.5} fill={INK}>
                    다른 기록의 수와 끝자리를 맞춘다
                  </text>
                  <text x={258} y={84} fontSize={7.5} fill={MUTED}>
                    눈금보다 작은 차이는 없는 정보입니다
                  </text>

                  <rect x={20} y={100} width={440} height={42} rx={4} fill={INK} opacity={0.06} stroke={INK} strokeWidth={0.75} />
                  <text x={32} y={116} fontSize={8} fontWeight={700} fill={INK}>
                    적힌 절차가 수의 해상도를 알려 줍니다
                  </text>
                  <text x={32} y={132} fontSize={7.5} fill={INK}>
                    절차가 적혀 있지 않은 수는 해상도를 알 수 없고, 그 사실 자체를 적어 두어야 합니다
                  </text>
                </g>
              )}

              <text x={20} y={192} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "빽빽함의 정도가 숫자로 적혀 있지 않습니다"
                  : s === 1
                    ? "눈금은 첫 1만 명의 몸집과 장비로 정해졌습니다"
                    : s === 2
                      ? "사람 수가 1만의 배수일 이유가 없습니다"
                      : "이 수는 1만 단위의 진술로만 쓸 수 있습니다"}
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
