import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·validity-chain — 효력의 근거를 거슬러 올라가면 어디서 멈추는가 */
const SCENES = [
  "고지서 한 장에서 시작한다",
  "근거를 위로 계속 거슬러 간다",
  "사슬은 규범이 아닌 곳에서 멈춘다",
  "그 바닥이 바뀌면 전부 새로 선다",
] as const;

const NOTES = [
  "과태료 고지서 한 장을 받았습니다. 왜 이걸 따라야 하느냐고 물으면 답은 언제나 다른 문장을 가리킵니다. 그 문장에 대해 같은 질문을 또 할 수 있습니다.",
  "시행령은 법률이 위임했기 때문에, 법률은 헌법이 정한 절차를 밟았기 때문에 효력을 갖습니다. 한 칸 올라갈 때마다 같은 형태의 답이 나옵니다.",
  "헌법에 이르면 답할 상위 규범이 없습니다. 여기서 사슬을 멈추는 것은 더 높은 규범이 아니라 공직자들이 실제로 이 문서를 기준으로 삼고 있다는 사실입니다.",
  "그래서 제헌이나 혁명은 사슬 안의 사건이 아니라 바닥이 바뀌는 사건입니다. 기준으로 삼는 문서가 바뀌면 그 위에 걸려 있던 효력이 한꺼번에 다시 계산됩니다.",
] as const;

const ACCENT = "#6366f1";
const AMBER = "#f59e0b";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const CHAIN = [
  { label: "과태료 부과", detail: "개별 처분", color: AMBER },
  { label: "시행령", detail: "법률이 위임", color: ACCENT },
  { label: "법률", detail: "헌법이 정한 절차", color: ACCENT },
  { label: "헌법", detail: "상위 규범 없음", color: OK },
] as const;

const BX = 22;
const BW = 92;
const GAP = 14;
const BY = 62;

export default function NormChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const visible = step === 0 ? 1 : 4;

  return (
    <VizFrame
      eyebrow="효력의 사슬"
      title="왜 이걸 따라야 하느냐는 질문은 언제나 다른 문장을 가리킵니다"
      description="그 문장에 같은 질문을 다시 할 수 있고, 어디선가는 멈춰야 합니다."
      note="네 칸으로 줄인 그림입니다. 실제로는 처분과 법률 사이에 시행규칙·고시·조례가 더 들어갑니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="효력의 근거를 거슬러 올라가는 사슬"
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
              <text x={BX} y={38} fontSize={9} fontWeight={700} fill={MUTED}>
                무엇이 이것을 효력 있게 만드는가 →
              </text>

              {CHAIN.map((node, i) => {
                const shown = i < visible;
                const x = BX + i * (BW + GAP);
                return (
                  <g key={node.label}>
                    <rect
                      x={x}
                      y={BY}
                      width={BW}
                      height={42}
                      rx={4}
                      fill={node.color}
                      fillOpacity={shown ? 0.14 : 0.04}
                      stroke={shown ? node.color : MUTED}
                      strokeWidth={1}
                      strokeDasharray={shown ? undefined : "3 3"}
                    />
                    <text x={x + BW / 2} y={BY + 19} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={shown ? node.color : MUTED}>
                      {node.label}
                    </text>
                    <text x={x + BW / 2} y={BY + 33} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                      {node.detail}
                    </text>
                    {i < CHAIN.length - 1 && shown && i + 1 < visible && (
                      <line x1={x + BW} y1={BY + 21} x2={x + BW + GAP} y2={BY + 21} stroke={MUTED} strokeWidth={1} />
                    )}
                  </g>
                );
              })}

              {step >= 2 && (
                <g>
                  <line x1={BX + 3 * (BW + GAP) + BW} y1={BY + 21} x2={BX + 3 * (BW + GAP) + BW + GAP} y2={BY + 21} stroke={step === 3 ? WARN : MUTED} strokeWidth={1} />
                  <rect
                    x={BX + 3 * (BW + GAP) + BW + GAP}
                    y={BY}
                    width={16}
                    height={42}
                    rx={3}
                    fill={step === 3 ? WARN : MUTED}
                    fillOpacity={0.1}
                    stroke={step === 3 ? WARN : MUTED}
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <text x={BX + 3 * (BW + GAP) + BW + GAP + 8} y={BY + 26} textAnchor="middle" fontSize={10} fontWeight={700} fill={step === 3 ? WARN : MUTED}>
                    ?
                  </text>
                </g>
              )}

              {step === 0 && (
                <text x={BX} y={132} fontSize={9.5} fill={MUTED}>
                  왜 따라야 하는지 물으면 답은 이 종이 바깥을 가리킵니다
                </text>
              )}

              {step === 1 && (
                <text x={BX} y={132} fontSize={9.5} fill={MUTED}>
                  한 칸 올라갈 때마다 같은 형태의 답이 나오고, 같은 질문을 또 할 수 있습니다
                </text>
              )}

              {step === 2 && (
                <g>
                  <text x={BX} y={132} fontSize={9.5} fontWeight={700} fill={OK}>
                    헌법 위에는 답할 상위 규범이 없습니다
                  </text>
                  <text x={BX} y={150} fontSize={9.5} fill={MUTED}>
                    사슬을 멈추는 것은 더 높은 규범이 아니라 하나의 사실입니다
                  </text>
                  <text x={BX} y={168} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    공직자들이 실제로 이 문서를 기준으로 삼고 있다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={BX} y={132} fontSize={9.5} fontWeight={700} fill={WARN}>
                    바닥이 규범이 아니라 사실이므로 옳고 그름을 따질 대상이 아닙니다
                  </text>
                  <text x={BX} y={150} fontSize={9.5} fill={MUTED}>
                    바뀌었는지 아닌지를 관찰할 대상이고, 바뀌면 위에 걸린 효력이 한꺼번에
                  </text>
                  <text x={BX} y={168} fontSize={9.5} fill={MUTED}>
                    다시 계산됩니다. 제헌과 혁명이 사슬 안의 사건이 아닌 이유입니다.
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
