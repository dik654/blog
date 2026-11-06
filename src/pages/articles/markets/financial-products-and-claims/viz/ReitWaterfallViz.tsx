import SceneShell from "./SceneShell";
import { Arrow } from "./SvgParts";

/**
 * 본문 대응: #limits — 임대료 100 − 운영비 30 − 이자 20 − 수선 지출 25 = 단순 현금 잔여 25. 가정입니다.
 * 잔여를 넘는 지급을 차입이나 자산 매각으로 보충했는지 확인한다는 본문의 조건을 마지막 장면에 둡니다.
 */
const STEPS = [
  { name: "임대료", value: 100, from: 0, tone: "#64748b" },
  { name: "운영비", value: -30, from: 100, tone: "#d97706" },
  { name: "이자", value: -20, from: 70, tone: "#d97706" },
  { name: "수선", value: -25, from: 50, tone: "#d97706" },
  { name: "잔여", value: 25, from: 0, tone: "#2563eb" },
];

const SCENES = [
  { label: "임대료를 받습니다", summary: "100", note: "리츠가 임대료 100을 받았습니다. 이 숫자가 곧 주주의 몫은 아닙니다.", shown: 1 },
  { label: "운영비", summary: "100 − 30 = 70", note: "먼저 운영비 30이 나갑니다.", shown: 2 },
  { label: "이자", summary: "70 − 20 = 50", note: "부채의 이자 20이 나갑니다.", shown: 3 },
  { label: "수선 지출", summary: "50 − 25 = 25", note: "수선 지출 25까지 빼면 단순 현금 잔여는 25입니다. 법적 배당 기준과 세무상 이익은 이 현금 계산과 다를 수 있습니다.", shown: 5 },
  { label: "25를 넘게 지급하면", summary: "차입·자산 매각 여부 확인", note: "배당을 차입이나 자산 매각으로 보충했다면 같은 지급률이 계속될지 확인해야 합니다. 초과분의 크기는 본문에 정해 두지 않아 높이 대신 위로 열린 화살표로 그렸습니다.", shown: 5 },
] as const;

const BASE = 142;
const UNIT = 1.15;
const BAR = 46;
const STEP = 66;
const Y = (value: number) => BASE - value * UNIT;
const LEFT = 8;
const RED = "#dc2626";
const GRAY = "#64748b";

export default function ReitWaterfallViz() {
  return (
    <SceneShell
      eyebrow="배당의 재원"
      title="임대료 100에서 현금이 얼마나 남는지 차례로 뺍니다"
      description="막대 높이가 금액입니다. 주황은 빠지는 돈이고, 파랑이 마지막에 남은 현금입니다."
      note="비교를 위한 가정 수치입니다."
      ariaLabel="리츠의 임대료에서 운영비, 이자, 수선 지출을 뺀 현금 잔여"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        return (
          <svg viewBox="0 0 340 168" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={0} x2={340} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {STEPS.map((step, index) => {
              const x = LEFT + index * STEP;
              const on = index < shown;
              const top = step.value > 0 ? Y(step.from + step.value) : Y(step.from);
              const height = Math.abs(step.value) * UNIT;
              return (
                <g key={step.name}>
                  <text x={x + BAR / 2} y={BASE + 18} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fill={on ? "currentColor" : GRAY}>{step.name}</text>
                  {on && (
                    <g>
                      <rect x={x} y={top} width={BAR} height={height} rx={2} fill={step.tone} opacity={0.85} />
                      <text x={x + BAR / 2} y={top - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={step.tone}>{step.value > 0 ? step.value : `−${Math.abs(step.value)}`}</text>
                      {index < 3 && <line x1={x + BAR} x2={x + STEP} y1={Y(step.from + step.value)} y2={Y(step.from + step.value)} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="2 3" />}
                    </g>
                  )}
                </g>
              );
            })}
            {active === 4 && (
              <g>
                <Arrow x1={LEFT + 4 * STEP + BAR - 6} y1={Y(25)} x2={LEFT + 4 * STEP + BAR - 6} y2={Y(25) - 48} tone={RED} dashed />
                <text x={LEFT + 4 * STEP + BAR - 6} y={Y(25) - 54} textAnchor="middle" fontSize={15} fontWeight={700} fill={RED}>?</text>
                <text x={340} y={Y(25) - 74} textAnchor="end" fontSize={12} fontWeight={700} fill={RED}>차입·자산 매각?</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
