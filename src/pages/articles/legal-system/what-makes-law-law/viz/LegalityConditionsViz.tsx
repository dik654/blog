import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: form-conditions — 조건 하나를 빼면 규범이 행동을 이끌지 못한다 */
const SCENES = [
  "여덟 조건이 다 갖춰진 상태",
  "공포하지 않으면",
  "이미 한 행동에 소급하면",
  "조문과 실제 집행이 다르면",
] as const;

const NOTES = [
  "여덟 가지가 다 갖춰지면 사람은 자기 행동을 규범에 맞출 수 있습니다. 이 조건들은 법이 좋은 법이기 위한 요건이 아니라, 규범이 행동을 이끄는 장치로 작동하기 위한 요건입니다.",
  "내용이 아무리 명확해도 알려지지 않으면 맞출 수가 없습니다. 이때 규범은 사람을 이끄는 것이 아니라 사후에 벌할 근거로만 쓰입니다.",
  "행위 시점에 없던 규칙으로 그 행위를 판정하면, 그때 아무리 조심했어도 소용이 없습니다. 조심한다는 행위 자체가 의미를 잃습니다.",
  "조문을 읽고 맞춘 행동이 실제 집행과 어긋나면 사람들은 조문 대신 집행의 관행을 읽게 됩니다. 그러면 공포된 규범이 아니라 관행이 진짜 규칙이 됩니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";
const ACCENT = "#6366f1";

/** 각 장면에서 깨뜨리는 조건의 index. 0은 아무것도 깨지 않은 상태 */
const BROKEN = [-1, 1, 3, 7] as const;

const CONDITIONS = [
  { label: "일반성", detail: "개별 지목이 아니라 규칙" },
  { label: "공포", detail: "미리 알려져 있을 것" },
  { label: "명확성", detail: "읽어서 뜻이 정해질 것" },
  { label: "소급 금지", detail: "행위 시점의 규칙으로 판정" },
  { label: "무모순", detail: "서로 어긋나지 않을 것" },
  { label: "이행 가능", detail: "지킬 수 있는 요구일 것" },
  { label: "안정성", detail: "너무 자주 바뀌지 않을 것" },
  { label: "집행 일치", detail: "적힌 대로 집행될 것" },
] as const;

const CONSEQUENCE = [
  "사람이 자기 행동을 규범에 맞출 수 있습니다",
  "알 수 없으니 맞출 수 없고, 사후에 벌할 근거로만 남습니다",
  "조심해도 소용이 없어 조심한다는 행위가 의미를 잃습니다",
  "사람들이 조문 대신 집행 관행을 읽게 됩니다",
] as const;

const CX = 30;
const CW = 106;
const CH = 38;

export default function LegalityConditionsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const broken: number = BROKEN[step];
  const brokenLabel = broken >= 0 ? CONDITIONS[broken]?.label : null;

  return (
    <VizFrame
      eyebrow="형식 조건"
      title="여덟 가지 가운데 하나만 빠져도 규범이 행동을 이끌지 못합니다"
      description="좋은 법의 요건이 아니라, 규범이 장치로 작동하기 위한 요건입니다."
      note="여덟 항목은 서로 독립이 아니라 한쪽을 강하게 요구하면 다른 쪽이 어려워지기도 합니다. 명확성을 끝까지 밀면 안정성이 흔들리는 식입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="형식 조건을 하나씩 깨뜨렸을 때"
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
              {CONDITIONS.map((cond, i) => {
                const col = i % 4;
                const row = Math.floor(i / 4);
                const x = CX + col * (CW + 6);
                const y = 28 + row * (CH + 8);
                const isBroken = i === broken;
                const color = isBroken ? WARN : OK;
                return (
                  <g key={cond.label}>
                    <rect
                      x={x}
                      y={y}
                      width={CW}
                      height={CH}
                      rx={4}
                      fill={color}
                      fillOpacity={isBroken ? 0.12 : 0.1}
                      stroke={color}
                      strokeWidth={1}
                      strokeDasharray={isBroken ? "3 3" : undefined}
                    />
                    <text x={x + CW / 2} y={y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
                      {cond.label}
                    </text>
                    <text x={x + CW / 2} y={y + 29} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                      {cond.detail}
                    </text>
                    {isBroken && (
                      <line x1={x + 8} y1={y + CH - 6} x2={x + CW - 8} y2={y + 6} stroke={WARN} strokeWidth={1} />
                    )}
                  </g>
                );
              })}

              <line x1={CX} y1={128} x2={CX + 4 * CW + 18} y2={128} stroke={MUTED} strokeWidth={1} />
              <text x={CX} y={148} fontSize={9} fontWeight={700} fill={step === 0 ? OK : WARN}>
                {CONSEQUENCE[step]}
              </text>
              {step === 0 ? (
                <text x={CX} y={168} fontSize={9} fill={MUTED}>
                  규범이 사후 판정 도구가 아니라 사전 안내로 쓰일 수 있는 상태입니다
                </text>
              ) : (
                <text x={CX} y={168} fontSize={9} fill={MUTED}>
                  내용이 옳은지와 무관하게, 장치로서 작동하지 않습니다
                </text>
              )}
              <text x={CX} y={188} fontSize={8.5} fontWeight={700} fill={ACCENT}>
                {step === 0
                  ? "여덟 조건 전부 충족"
                  : `깨진 조건 · ${brokenLabel}`}
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
