import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: differentiation 절 — 커지는 것은 공장이 아니라 산업이 쪼개지는 것이다 */
const SCENES = [
  "처음에는 한 곳이 전부 합니다",
  "시장이 커지면 그 한 곳이 커진다고 읽습니다",
  "실제로는 중간 단계가 떨어져 나옵니다",
  "떨어져 나온 곳은 더 큰 시장을 봅니다",
] as const;

/** Young이 든 인쇄업의 예 */
const PARTS = ["종이", "잉크", "활자", "활자금속", "인쇄기계"] as const;

const SHOP = "#6366f1";
const PART = "#0ea5e9";
const LINK = "#94a3b8";
const PICK = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#334155";

export default function DifferentiationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800);
  const s = scenes.active;

  const NOTES = [
    `초기의 인쇄소는 종이도 잉크도 활자도 스스로 마련했습니다. 쓸 만큼만 만들었으므로 어느 것도 돌아가는 방법을 쓸 만큼 수량이 나오지 않았습니다.`,
    `시장이 커지면 흔히 그 인쇄소가 커진다고 읽습니다. 그러면 단위당 값이 내려가는 것도 한 곳이 커진 결과가 됩니다. Young이 이 읽기가 놓치는 것이 있다고 적었습니다.`,
    `실제로 일어난 일은 중간 단계가 떨어져 나와 각각 별도의 산업이 된 것입니다. 인쇄업의 후예는 오늘의 인쇄소만이 아니라 종이·잉크·활자·활자금속·인쇄기계를 만드는 곳들입니다.`,
    `떨어져 나온 곳은 인쇄소 하나가 아니라 여러 곳에 팝니다. 그래서 그곳이 보는 시장은 인쇄소 하나가 쓰던 양보다 훨씬 큽니다. 그 큰 시장이 앞 그림의 다음 계단 — 더 돌아가는 방법 — 을 열어 줍니다.`,
  ] as const;

  const boxW = s === 1 ? 150 : 110;
  const boxH = s === 1 ? 108 : 86;
  const cx = 110;
  const cy = 92;

  return (
    <VizFrame
      eyebrow="쪼개짐"
      title="단위당 값을 내린 것은 한 곳이 커진 일이 아니라 중간 단계가 떨어져 나온 일입니다"
      description="떨어져 나온 곳은 여러 수요자에게 팔아 더 큰 수량을 보고, 그 수량이 더 돌아가는 방법을 열어 줍니다."
      note="Young이 든 인쇄업의 예를 다섯 조각으로 줄인 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 곳이 전부 하던 일이 여러 산업으로 쪼개지는 그림"
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
              {/* 한 곳이 전부 하는 그림 */}
              {s <= 1 && (
                <g>
                  <rect
                    x={cx - boxW / 2}
                    y={cy - boxH / 2}
                    width={boxW}
                    height={boxH}
                    rx={4}
                    fill={SHOP}
                    opacity={0.12}
                    stroke={SHOP}
                    strokeWidth={1.25}
                  />
                  <text x={cx} y={cy - boxH / 2 - 6} fontSize={8.5} fontWeight={700} fill={SHOP} textAnchor="middle">
                    인쇄소 한 곳
                  </text>
                  {PARTS.map((p, i) => (
                    <text
                      key={p}
                      x={cx}
                      y={cy - boxH / 2 + 18 + i * ((boxH - 26) / 4)}
                      fontSize={8}
                      fill={INK}
                      textAnchor="middle"
                    >
                      {p}
                    </text>
                  ))}
                </g>
              )}

              {s === 1 && (
                <text x={cx} y={cy + boxH / 2 + 16} fontSize={8} fontWeight={700} fill={MUTED} textAnchor="middle">
                  같은 상자가 커졌을 뿐입니다
                </text>
              )}

              {/* 쪼개진 그림 */}
              {s >= 2 && (
                <g>
                  <rect x={30} y={62} width={76} height={54} rx={4} fill={SHOP} opacity={0.12} stroke={SHOP} strokeWidth={1.25} />
                  <text x={68} y={56} fontSize={8.5} fontWeight={700} fill={SHOP} textAnchor="middle">
                    인쇄소
                  </text>
                  <text x={68} y={93} fontSize={8} fill={INK} textAnchor="middle">
                    찍는 일만
                  </text>

                  {PARTS.map((p, i) => {
                    const y = 34 + i * 27;
                    return (
                      <g key={p}>
                        <line x1={106} y1={89} x2={214} y2={y} stroke={LINK} strokeWidth={0.75} opacity={0.8} />
                        <rect x={214} y={y - 10} width={86} height={20} rx={3} fill={PART} opacity={0.16} stroke={PART} strokeWidth={1} />
                        <text x={257} y={y + 3} fontSize={8} fontWeight={700} fill={INK} textAnchor="middle">
                          {p}
                        </text>
                      </g>
                    );
                  })}
                  <text x={257} y={22} fontSize={8.5} fontWeight={700} fill={PART} textAnchor="middle">
                    각각 별도의 산업
                  </text>
                </g>
              )}

              {/* 떨어져 나온 곳이 보는 시장 */}
              {s === 3 && (
                <g>
                  {[0, 1, 2].map((i) => (
                    <g key={i}>
                      <line x1={300} y1={88} x2={372} y2={48 + i * 40} stroke={PICK} strokeWidth={1} opacity={0.85} />
                      <rect x={372} y={38 + i * 40} width={70} height={20} rx={3} fill={PICK} opacity={0.12} stroke={PICK} strokeWidth={1} />
                      <text x={407} y={51 + i * 40} fontSize={8} fill={INK} textAnchor="middle">
                        인쇄소 {i + 1}
                      </text>
                    </g>
                  ))}
                  <text x={407} y={28} fontSize={8} fontWeight={700} fill={PICK} textAnchor="middle">
                    사 가는 곳이 여럿
                  </text>
                </g>
              )}

              <text x={14} y={186} fontSize={8.5} fontWeight={700} fill={INK}>
                {s === 0
                  ? "어느 조각도 돌아가는 방법을 쓸 만큼 수량이 나오지 않습니다"
                  : s === 1
                    ? "이렇게 읽으면 싸진 이유가 한 곳의 크기가 됩니다"
                    : s === 2
                      ? "한 곳의 안쪽 일이 여러 곳의 바깥쪽 일로 바뀌었습니다"
                      : "한 조각이 보는 수량이 인쇄소 하나가 쓰던 양보다 큽니다"}
              </text>
              <text x={14} y={196} fontSize={7.5} fill={MUTED}>
                {s <= 1
                  ? "어느 조각도 따로 떼어 낼 만큼 수량이 나오지 않던 때입니다"
                  : "그 큰 수량이 앞 그림의 다음 계단을 열어 줍니다"}
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
