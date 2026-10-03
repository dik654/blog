import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: two-cities·what-remains 절. 사고실험은 투키디데스 1권 10절 */
const SCENES = ["두 도시", "같은 재난", "남은 것", "추정의 방향"] as const;

const SPARTA = "#0ea5e9";
const ATHENS = "#f59e0b";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function TwoRuinsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const s = scenes.active;

  const NOTES = [
    `저자가 든 두 도시는 당대의 사정이 서로 다릅니다. 한쪽은 펠로폰네소스의 5분의 2를 차지하고 전체를 이끄는데 성읍이 촘촘히 지어지지 않았고 웅장한 신전이나 공공 건물도 없이 옛 방식대로 마을들이 모여 있습니다. 다른 쪽은 눈에 보이는 것이 큽니다.`,
    `이제 두 도시에 같은 일이 일어났다고 둡니다. 사람이 살지 않게 되고 신전과 공공 건물의 기초만 남는 경우입니다. 재난은 같고 도시의 생김새만 다릅니다.`,
    `남는 것이 한쪽으로 치우칩니다. 돌로 크게 지은 것은 기초가 남고, 흩어진 마을과 거기 살던 사람들의 수와 이끌던 동맹은 남지 않습니다. 그래서 남은 것만 보면 한쪽은 적게 보이고 다른 쪽은 많게 보입니다.`,
    `저자가 적은 결론은 방향까지 포함합니다. 앞 도시는 뒷사람이 그 명성을 힘의 참된 표현으로 받아들이기를 꺼릴 것이고, 뒤 도시는 눈에 보이는 것에서 미루어 그 힘을 실제의 두 배로 볼 것입니다. 오해가 생긴다는 말에 그치지 않고 어느 쪽으로 얼마만큼인지가 적혀 있습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="두 폐허"
      title="같은 재난을 겪어도 남는 것이 치우쳐 남아 반대 방향의 오해가 생깁니다"
      description="저자는 두 도시가 사람 없는 폐허가 된 경우를 가정하고, 한쪽은 힘이 과소평가되고 다른 쪽은 두 배로 보일 것이라고 적습니다."
      note="사고실험과 '두 배'라는 표현은 투키디데스 『펠로폰네소스 전쟁사』 1권 10절의 것입니다. Crawley 영역본으로 읽었습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 도시가 폐허가 되었을 때 남는 것이 달라 추정이 어긋나는 것을 보이는 그림"
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
              {[0, 1].map((k) => {
                const x = 20 + k * 230;
                const col = k === 0 ? SPARTA : ATHENS;
                return (
                  <g key={k}>
                    <rect x={x} y={18} width={210} height={120} rx={5} fill={col} opacity={0.07} stroke={col} strokeWidth={1.25} />
                    <text x={x + 105} y={34} fontSize={9} fontWeight={700} fill={col} textAnchor="middle">
                      {k === 0 ? "흩어져 사는 도시" : "크게 지은 도시"}
                    </text>

                    {/* 건물 */}
                    {k === 0
                      ? [0, 1, 2, 3, 4, 5].map((i) => (
                          <rect
                            key={i}
                            x={x + 18 + (i % 3) * 62}
                            y={46 + Math.floor(i / 3) * 24}
                            width={40}
                            height={16}
                            rx={2}
                            fill={s >= 2 ? MUTED : SPARTA}
                            opacity={s >= 2 ? 0.14 : 0.3}
                            stroke={s >= 2 ? MUTED : SPARTA}
                            strokeWidth={0.75}
                            strokeDasharray={s >= 2 ? "2 2" : undefined}
                          />
                        ))
                      : (
                        <g>
                          <rect x={x + 30} y={46} width={150} height={44} rx={3} fill={ATHENS} opacity={s >= 2 ? 0.3 : 0.3} stroke={ATHENS} strokeWidth={1.25} />
                          <rect x={x + 56} y={92} width={98} height={12} rx={2} fill={ATHENS} opacity={0.3} stroke={ATHENS} strokeWidth={0.75} />
                        </g>
                      )}

                    <text x={x + 105} y={118} fontSize={7.5} fill={INK} textAnchor="middle">
                      {k === 0
                        ? s >= 2
                          ? "기초가 거의 남지 않음"
                          : "옛 방식대로 마을이 모여 있음"
                        : s >= 2
                          ? "신전과 공공 건물의 기초가 남음"
                          : "눈에 보이는 것이 큼"}
                    </text>
                    <text x={x + 105} y={131} fontSize={7.5} fontWeight={700} fill={col} textAnchor="middle">
                      {k === 0
                        ? "실제로는 전체를 이끎"
                        : s >= 3
                          ? "실제보다 커 보임"
                          : "겉모습만으로 힘을 잴 수 없음"}
                    </text>
                  </g>
                );
              })}

              {s === 1 && (
                <g>
                  <rect x={20} y={146} width={440} height={26} rx={4} fill={MUTED} opacity={0.1} stroke={MUTED} strokeWidth={0.75} strokeDasharray="3 2" />
                  <text x={240} y={163} fontSize={8.5} fontWeight={700} fill={INK} textAnchor="middle">
                    둘 다 사람이 살지 않게 되고 신전과 공공 건물의 기초만 남습니다
                  </text>
                </g>
              )}

              {s === 3 && (
                <g>
                  <rect x={20} y={146} width={210} height={30} rx={4} fill={SPARTA} opacity={0.14} stroke={SPARTA} strokeWidth={1.25} />
                  <text x={125} y={165} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    명성을 힘의 증거로 받기를 꺼림
                  </text>
                  <rect x={250} y={146} width={210} height={30} rx={4} fill={ATHENS} opacity={0.14} stroke={ATHENS} strokeWidth={1.25} />
                  <text x={355} y={165} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                    힘을 실제의 두 배로 봄
                  </text>
                </g>
              )}

              <text x={20} y={192} fontSize={8} fontWeight={700} fill={INK}>
                {s === 0
                  ? "두 도시의 생김새가 다르고 힘은 생김새를 따르지 않습니다"
                  : s === 1
                    ? "재난은 같고 도시의 생김새만 다릅니다"
                    : s === 2
                      ? "남는 것이 돌로 크게 지은 쪽에 치우칩니다"
                      : "오해의 방향과 크기까지 저자가 적어 두었습니다"}
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
