import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·why-state — 사인 간 조정이 무너지는 세 지점 */
const SCENES = [
  "값을 주고받으면 끝나는 경우",
  "물릴 재산이 없으면",
  "누가 했는지 모르면",
  "값을 치르면 해도 되는 것이 되면",
] as const;

const NOTES = [
  "앞 세 글은 전부 이 모양이었습니다. 손해를 입힌 쪽을 특정하고, 그쪽에 재산이 있고, 값을 치르면 정리되는 경우입니다.",
  "물릴 재산이 없으면 이 사슬이 첫 칸에서 끊어집니다. 판결을 받아도 받을 것이 없고, 그러면 손해를 입힐 유인도 줄지 않습니다.",
  "누가 했는지 알 수 없으면 아예 시작되지 않습니다. 당한 쪽이 스스로 찾아내야 하는데, 찾는 비용이 받을 값보다 큰 경우가 대부분입니다.",
  "마지막이 가장 중요합니다. 값만 치르면 해도 되는 것으로 두면, 앞 글에서 동의를 요구하던 보호가 값을 치르면 뚫리는 보호로 바뀝니다. 동의를 받아야 한다는 규칙 자체가 무의미해집니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const CHAIN = [
  { label: "누가 했는지 안다", broken: 2 },
  { label: "그쪽에 재산이 있다", broken: 1 },
  { label: "값을 치르면 정리된다", broken: 3 },
] as const;

const BX = 42;
const BW = 122;
const GAP = 14;

export default function WhyStateProsecutesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="왜 국가가 나서는가"
      title="사인끼리 값을 주고받는 방식은 세 지점에서 무너집니다"
      description="앞 세 글의 장치가 전제하던 것들이 하나씩 빠지는 경우를 봅니다."
      note="세 조건으로 줄인 그림입니다. 실제로는 소송 비용과 시간처럼 이 사슬을 더 약하게 만드는 요인이 더 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사인 간 조정이 무너지는 지점"
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
              <text x={BX} y={34} fontSize={9} fontWeight={700} fill={MUTED}>
                사인끼리 정리되려면 이 셋이 모두 성립해야 합니다
              </text>

              {CHAIN.map((node, i) => {
                const broken = node.broken === step;
                const color = broken ? WARN : step === 0 ? OK : MUTED;
                const x = BX + i * (BW + GAP);
                return (
                  <g key={node.label}>
                    <rect
                      x={x}
                      y={50}
                      width={BW}
                      height={40}
                      rx={4}
                      fill={color}
                      fillOpacity={broken ? 0.14 : step === 0 ? 0.12 : 0.06}
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray={broken ? "3 3" : undefined}
                    />
                    <text x={x + BW / 2} y={74} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={color}>
                      {node.label}
                    </text>
                    {broken && (
                      <line x1={x + 10} y1={84} x2={x + BW - 10} y2={56} stroke={WARN} strokeWidth={1} />
                    )}
                    {i < CHAIN.length - 1 && (
                      <line x1={x + BW} y1={70} x2={x + BW + GAP} y2={70} stroke={MUTED} strokeWidth={1} />
                    )}
                  </g>
                );
              })}

              {step === 0 ? (
                <g>
                  <rect x={BX} y={110} width={3 * BW + 2 * GAP} height={28} rx={4} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                  <text x={BX + (3 * BW + 2 * GAP) / 2} y={128} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={OK}>
                    사인끼리 값을 주고받는 것으로 정리됩니다
                  </text>
                  <text x={BX} y={160} fontSize={9} fill={MUTED}>
                    앞 세 글이 다룬 것이 전부 이 경우였습니다
                  </text>
                </g>
              ) : (
                <g>
                  <rect x={BX} y={110} width={3 * BW + 2 * GAP} height={28} rx={4} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1} />
                  <text x={BX + (3 * BW + 2 * GAP) / 2} y={128} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={WARN}>
                    {step === 1
                      ? "판결을 받아도 받을 것이 없습니다"
                      : step === 2
                        ? "물을 상대를 특정할 수 없습니다"
                        : "동의를 요구하던 보호가 값으로 뚫립니다"}
                  </text>
                  <text x={BX} y={160} fontSize={9} fontWeight={700} fill={ACCENT}>
                    {step === 3
                      ? "그래서 값이 아니라 하지 못하게 하는 장치가 따로 필요해집니다"
                      : "그래서 당한 쪽이 아니라 국가가 나서게 됩니다"}
                  </text>
                  <text x={BX} y={180} fontSize={9} fill={MUTED}>
                    {step === 1
                      ? "손해를 입힐 유인도 그만큼 줄지 않습니다"
                      : step === 2
                        ? "찾는 비용이 받을 값보다 큰 경우가 대부분입니다"
                        : "값만 치르면 된다면 동의를 받아야 한다는 규칙이 무의미해집니다"}
                  </text>
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
