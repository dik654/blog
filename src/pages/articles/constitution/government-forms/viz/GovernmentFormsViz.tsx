import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·two-axes — 같은 권력분립에서 두 체계가 갈리는 두 축 */
const SCENES = [
  "같은 부품, 다른 조립",
  "축 하나. 생존이 걸려 있는가",
  "축 둘. 누가 뽑는가",
  "네 칸과 각 칸의 출구",
] as const;

const NOTES = [
  "입법과 행정이라는 같은 두 기관을 두고도 체계가 갈립니다. 갈리는 지점은 기관의 이름이 아니라 둘을 잇는 선의 종류입니다.",
  "첫째 축은 행정부가 의회의 신임 없이도 임기를 채우는가입니다. 이 하나가 뒤따르는 차이를 거의 다 만듭니다.",
  "둘째 축은 행정부 수반을 누가 뽑는가입니다. 두 축을 곱하면 흔히 둘로만 말하는 정부 형태가 네 칸이 됩니다.",
  "각 칸은 교착이 생겼을 때 남는 출구가 다릅니다. 체계를 고르는 일은 교착을 어떤 방식으로 풀지를 고르는 일입니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";
const AMBER = "#f59e0b";

/** 2×2. 가로 = 행정부 수반의 선출 기원, 세로 = 의회 신임 의존 여부 */
const CELLS = [
  { col: 0, row: 0, name: "대통령제", exit: "탄핵 · 다음 선거", color: ACCENT },
  { col: 1, row: 0, name: "회의제·의회선출 고정임기", exit: "임기 만료", color: MUTED },
  { col: 0, row: 1, name: "준대통령제", exit: "총리 교체 · 의회 해산", color: AMBER },
  { col: 1, row: 1, name: "의원내각제", exit: "불신임 · 해산 후 총선", color: OK },
] as const;

const GX = 150;
const GY = 46;
const CW = 138;
const CH = 46;

export default function GovernmentFormsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="정부 형태"
      title="갈림길은 두 개뿐이고, 나머지 차이는 거기서 따라 나옵니다"
      description="행정부가 의회 신임에 생존을 의존하는가와, 행정부 수반을 누가 뽑는가입니다."
      note="실제 헌법들은 두 축 위의 점에 가깝고 칸의 한가운데에 딱 놓이지 않습니다. 비교를 위한 좌표계입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정부 형태를 가르는 두 축"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              {step === 0 && (
                <g>
                  <rect x={70} y={60} width={120} height={40} rx={4} fill={ACCENT} fillOpacity={0.12} stroke={ACCENT} strokeWidth={1} />
                  <text x={130} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>
                    입법부
                  </text>
                  <rect x={290} y={60} width={120} height={40} rx={4} fill={AMBER} fillOpacity={0.12} stroke={AMBER} strokeWidth={1} />
                  <text x={350} y={84} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER}>
                    행정부
                  </text>
                  <line x1={190} y1={80} x2={290} y2={80} stroke={MUTED} strokeWidth={1} strokeDasharray="4 4" />
                  <text x={240} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>
                    ?
                  </text>
                  <text x={240} y={130} textAnchor="middle" fontSize={9} fill={MUTED}>
                    같은 두 기관인데 둘을 잇는 선이 정해지지 않았습니다
                  </text>
                  <text x={240} y={148} textAnchor="middle" fontSize={9} fill={MUTED}>
                    이 선을 어떻게 긋느냐가 체계를 가릅니다
                  </text>
                </g>
              )}

              {step === 1 && (
                <g>
                  <text x={240} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>
                    행정부는 의회의 신임 없이도 임기를 채우는가
                  </text>
                  <rect x={46} y={58} width={170} height={72} rx={4} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeWidth={1} />
                  <text x={131} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill={ACCENT}>
                    예 · 생존이 분리됨
                  </text>
                  <text x={131} y={100} textAnchor="middle" fontSize={9} fill={MUTED}>
                    임기가 고정되고 의회가
                  </text>
                  <text x={131} y={114} textAnchor="middle" fontSize={9} fill={MUTED}>
                    반대해도 자리는 남습니다
                  </text>
                  <rect x={264} y={58} width={170} height={72} rx={4} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                  <text x={349} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK}>
                    아니오 · 신임에 매임
                  </text>
                  <text x={349} y={100} textAnchor="middle" fontSize={9} fill={MUTED}>
                    과반이 등을 돌리는 순간
                  </text>
                  <text x={349} y={114} textAnchor="middle" fontSize={9} fill={MUTED}>
                    내각이 물러납니다
                  </text>
                  <text x={240} y={156} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    임기의 고정성·교착의 출구·연립의 필요가 전부 이 하나에서 갈립니다
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <text x={GX + CW} y={24} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                    행정부 수반을 누가 뽑는가
                  </text>
                  <text x={GX + CW / 2} y={40} textAnchor="middle" fontSize={9} fill={MUTED}>
                    국민이 직접
                  </text>
                  <text x={GX + CW + CW / 2} y={40} textAnchor="middle" fontSize={9} fill={MUTED}>
                    의회가
                  </text>
                  <text x={16} y={GY + CH / 2} fontSize={9} fill={MUTED}>
                    신임과 무관
                  </text>
                  <text x={16} y={GY + CH + CH / 2} fontSize={9} fill={MUTED}>
                    신임에 매임
                  </text>
                  <text x={16} y={GY - 10} fontSize={9} fontWeight={700} fill={MUTED}>
                    행정부의 생존
                  </text>

                  {CELLS.map((cell) => {
                    const x = GX + cell.col * CW;
                    const y = GY + cell.row * CH;
                    return (
                      <g key={cell.name}>
                        <rect
                          x={x}
                          y={y}
                          width={CW}
                          height={CH}
                          fill={cell.color}
                          fillOpacity={step === 3 ? 0.14 : 0.06}
                          stroke={cell.color}
                          strokeWidth={1}
                        />
                        <text x={x + CW / 2} y={y + (step === 3 ? 20 : 28)} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={cell.color}>
                          {cell.name}
                        </text>
                        {step === 3 && (
                          <text x={x + CW / 2} y={y + 36} textAnchor="middle" fontSize={8} fill={MUTED}>
                            출구 · {cell.exit}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {step === 2 && (
                    <text x={240} y={GY + 2 * CH + 24} textAnchor="middle" fontSize={9} fill={MUTED}>
                      둘로만 말하던 구분이 네 칸이 됩니다
                    </text>
                  )}
                  {step === 3 && (
                    <g>
                      <text x={240} y={GY + 2 * CH + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                        왼쪽 위 칸만 교착의 출구가 다음 선거까지 미뤄집니다
                      </text>
                      <text x={240} y={GY + 2 * CH + 38} textAnchor="middle" fontSize={9} fill={MUTED}>
                        이 글이 가장 길게 다루는 칸이 그래서 왼쪽 위입니다
                      </text>
                    </g>
                  )}
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
