import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·rate-setting — 선택지를 제한해 가격을 좁은 구간에 가둔다 */
const SCENES = [
  "그냥 두면 금리는 수급에 따라 흔들린다",
  "맡기면 받는 이자로 바닥을 깐다",
  "언제든 빌려주어 천장을 씌운다",
  "그 사이에 목표를 두면 가격이 갇힌다",
] as const;

const NOTES = [
  "준비금이 남는 날과 모자라는 날마다 은행 간 하루짜리 금리가 크게 움직입니다.",
  "중앙은행에 맡기면 확실히 받는 이자가 있으므로, 그보다 싸게 빌려줄 이유가 사라집니다.",
  "담보만 있으면 언제든 빌릴 수 있으므로, 그보다 비싸게 빌릴 이유도 사라집니다.",
  "남은 구간 안에서 수급을 미세 조정하면 실제 시장금리가 목표 부근에 머뭅니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

/** y좌표는 금리. 값이 클수록 위로 오도록 화면 좌표를 뒤집어 쓴다. */
const FLOOR_Y = 128;
const CEIL_Y = 56;
const TARGET_Y = 92;

/** 개입이 없을 때 일별로 흔들리는 금리(설명용 예시 경로) */
const RAW = [44, 118, 70, 142, 60, 132, 86];
const DAY_X = (index: number) => 70 + index * 56;

export default function PolicyRateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const step = scenes.active;

  const clamped = RAW.map((y) =>
    step === 0
      ? y
      : step === 1
        ? Math.min(y, FLOOR_Y)
        : step === 2
          ? Math.min(Math.max(y, CEIL_Y), FLOOR_Y)
          : Math.min(Math.max(y, TARGET_Y - 8), TARGET_Y + 8),
  );

  return (
    <VizFrame
      eyebrow="정책금리 운영"
      title="중앙은행은 가격을 부르지 않고 선택지를 제한합니다"
      description="바닥과 천장을 만들면 은행 간 하루짜리 금리가 그 사이에 갇히고, 그 안에서 수급을 조절해 목표에 붙입니다."
      note="금리 경로는 구조를 보이기 위한 예시이며 특정 기간의 실제 시계열이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정책금리를 목표에 붙이는 구조"
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
              <line x1={56} y1={28} x2={56} y2={168} stroke={MUTED} strokeWidth={1} />
              <text x={20} y={32} fontSize={8} fill={MUTED}>
                금리 높음
              </text>
              <text x={20} y={166} fontSize={8} fill={MUTED}>
                금리 낮음
              </text>
              <line x1={56} y1={168} x2={452} y2={168} stroke={MUTED} strokeWidth={1} />
              <text x={452} y={182} textAnchor="end" fontSize={8} fill={MUTED}>
                영업일
              </text>

              {step >= 1 && (
                <g>
                  <line x1={56} y1={FLOOR_Y} x2={452} y2={FLOOR_Y} stroke={OK} strokeWidth={1.25} />
                  <text x={452} y={FLOOR_Y + 12} textAnchor="end" fontSize={8} fontWeight={700} fill={OK}>
                    하한 · 준비금 부리
                  </text>
                </g>
              )}

              {step >= 2 && (
                <g>
                  <line x1={56} y1={CEIL_Y} x2={452} y2={CEIL_Y} stroke={WARN} strokeWidth={1.25} />
                  <text x={452} y={CEIL_Y - 6} textAnchor="end" fontSize={8} fontWeight={700} fill={WARN}>
                    상한 · 대출창구
                  </text>
                </g>
              )}

              {step >= 3 && (
                <g>
                  <line
                    x1={56}
                    y1={TARGET_Y}
                    x2={452}
                    y2={TARGET_Y}
                    stroke={ACCENT}
                    strokeWidth={1}
                    strokeDasharray="5 3"
                  />
                  <text x={452} y={TARGET_Y - 6} textAnchor="end" fontSize={8} fontWeight={700} fill={ACCENT}>
                    목표 정책금리
                  </text>
                </g>
              )}

              <polyline
                points={clamped.map((y, index) => `${DAY_X(index)},${y}`).join(" ")}
                fill="none"
                stroke={step === 0 ? MUTED : ACCENT}
                strokeWidth={1.25}
              />
              {clamped.map((y, index) => (
                <circle
                  key={index}
                  cx={DAY_X(index)}
                  cy={y}
                  r={2.5}
                  fill={step === 0 ? MUTED : ACCENT}
                />
              ))}

              <text x={70} y={20} fontSize={9} fontWeight={700} fill={step === 0 ? MUTED : ACCENT}>
                은행 간 하루짜리 금리
              </text>
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
