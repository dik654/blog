import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·three-layers·finality — 한 송금이 세 층을 지나 최종성에 닿는다 */
const SCENES = [
  "지시가 전달된다",
  "통장 숫자는 이미 바뀌었다",
  "기관끼리 주고받을 차액을 정한다",
  "중앙은행 장부에서 끝난다",
] as const;

const NOTES = [
  "보내는 사람의 의사가 은행에 접수됩니다. 아직 은행 사이에서는 아무 일도 일어나지 않았습니다.",
  "고객 통장은 즉시 반영되지만 이것은 지시가 처리됐다는 뜻이지 돈이 옮겨졌다는 뜻이 아닙니다.",
  "같은 주기의 지시들을 모아 서로 지우면 실제로 옮겨야 할 금액이 크게 줄어듭니다.",
  "확정된 차액이 중앙은행 계정에서 옮겨지는 순간부터 되돌릴 수 없습니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const MUTED = "#94a3b8";

const LAYERS = [
  { id: "payment", label: "지급", detail: "지시 전달", y: 42 },
  { id: "clearing", label: "청산", detail: "차액 확정", y: 92 },
  { id: "settlement", label: "결제", detail: "중앙은행 계정 이동", y: 142 },
];

export default function SettlementLayerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;
  const activeLayer = step <= 1 ? 0 : step === 2 ? 1 : 2;

  return (
    <VizFrame
      eyebrow="지급결제 구조"
      title="한 번의 송금이 세 층에서 따로 끝납니다"
      description="고객이 보는 완료와 기관 사이의 완료, 그리고 되돌릴 수 없는 완료가 서로 다른 시점입니다."
      note="실제 시스템에는 어음교환·지로·공동망 등 여러 소액지급시스템이 있으며 이 그림은 공통 구조만 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="지급·청산·결제의 세 층"
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
              {LAYERS.map((layer, index) => {
                const done = index < activeLayer;
                const current = index === activeLayer;
                const color = done ? OK : current ? ACCENT : MUTED;
                return (
                  <g key={layer.id}>
                    <rect
                      x={24}
                      y={layer.y}
                      width={140}
                      height={36}
                      fill={color}
                      fillOpacity={current ? 0.16 : done ? 0.08 : 0.04}
                      stroke={color}
                      strokeWidth={current ? 1.25 : 1}
                    />
                    <text x={94} y={layer.y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
                      {layer.label}
                    </text>
                    <text x={94} y={layer.y + 29} textAnchor="middle" fontSize={8} fill={MUTED}>
                      {layer.detail}
                    </text>
                    {index < LAYERS.length - 1 && (
                      <line x1={94} y1={layer.y + 36} x2={94} y2={layer.y + 50} stroke={MUTED} strokeWidth={1} />
                    )}
                  </g>
                );
              })}

              {step === 1 && (
                <g>
                  <rect x={196} y={36} width={150} height={44} fill={ACCENT} fillOpacity={0.1} stroke={ACCENT} strokeWidth={1} />
                  <text x={271} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill={ACCENT}>
                    고객 통장: 완료로 보임
                  </text>
                  <text x={271} y={70} textAnchor="middle" fontSize={8} fill={MUTED}>
                    은행 사이는 아직 미결제
                  </text>
                  <text x={196} y={100} fontSize={8} fill={MUTED}>
                    이 구간에 보내는 쪽 은행이 무너지면 받는 쪽이 떠안습니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <text x={196} y={92} fontSize={9} fontWeight={700} fill={ACCENT}>
                    A→B 100 · B→A 90
                  </text>
                  <text x={196} y={110} fontSize={10} fontWeight={700} fill={OK}>
                    실제로 옮길 금액 10
                  </text>
                  <text x={196} y={128} fontSize={8} fill={MUTED}>
                    금액은 확정됐지만 아직 옮기지 않았습니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <rect x={196} y={124} width={172} height={54} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                  <text x={282} y={143} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    중앙은행 계정 잔액 이동
                  </text>
                  <text x={282} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    최종성 확보
                  </text>
                  <text x={282} y={172} textAnchor="middle" fontSize={8} fill={MUTED}>
                    규칙이 정한 시점 이후 취소 불가
                  </text>
                </g>
              )}

              {step === 0 && (
                <text x={196} y={60} fontSize={9} fill={MUTED}>
                  보내는 사람의 지시가 접수된 상태입니다
                </text>
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
