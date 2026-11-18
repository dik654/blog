import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 민감도 +80에 임시 헤지 −60을 더하면 +20.
 * 금리가 5bp 불리하게 움직이면 단순 선형 손익은 20×5=100만큼 나빠질 수 있다.
 * 비교선 80×5=400은 헤지가 없었을 때를 본문 숫자로 곱한 값입니다.
 */
const EXPOSURE = 80;
const HEDGE = -60;
const RESIDUAL = EXPOSURE + HEDGE;
const SHOCK_BP = 5;

const SCENES = [
  { label: "부도 포트폴리오 +80", summary: "1bp에 손익 80", note: "민감도는 금리가 1bp 움직일 때 포트폴리오 손익이 얼마나 변하는지입니다. 부도 회원이 남긴 포트폴리오는 +80이며, 단위는 교육용 내부 위험 단위(가정)입니다." },
  { label: "반대 거래 −60을 더합니다", summary: "+80 − 60 = +20", note: "청산소의 임시 헤지는 경매 전 급한 민감도를 줄이는 반대 거래입니다. 두 막대를 더하면 경매 자료에 남는 민감도는 +20입니다." },
  { label: "5bp 불리하게 움직이면", summary: "20 × 5 = 100", note: "단순 선형으로 보면 잔여 +20은 5bp 불리한 움직임에서 100만큼 더 나빠질 수 있습니다. 파란 점선은 헤지하지 않았을 때의 80 × 5 = 400입니다. 실제 포트폴리오에는 곡선 구간·통화·변동성·상관과 비선형 위험이 따로 있습니다." },
] as const;

const W = 360;
const H = 210;

function Bars({ active }: { active: number }) {
  const zeroY = 110;
  const unit = 1;
  const items = [
    { label: "부도 포트폴리오", value: EXPOSURE, color: "#2563eb", show: true },
    { label: "임시 헤지", value: HEDGE, color: "#d97706", show: active >= 1 },
    { label: "잔여", value: RESIDUAL, color: "#16a34a", show: active >= 1 },
  ];
  return (
    <g>
      <line x1={20} x2={W - 20} y1={zeroY} y2={zeroY} stroke="#94a3b8" strokeWidth={1} />
      <text x={W - 20} y={zeroY - 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
      {items.map((item, index) => {
        const x = 50 + index * 100;
        const h = Math.abs(item.value) * unit;
        const top = item.value >= 0 ? zeroY - h : zeroY;
        return (
          <g key={item.label} opacity={item.show ? 1 : 0.15}>
            <rect x={x} y={top} width={60} height={h} rx={2} fill={item.show ? item.color : "#94a3b8"} opacity={0.8} />
            {item.show && (
              <text x={x + 30} y={item.value >= 0 ? top - 6 : top + h + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={item.color}>
                {item.value > 0 ? `+${item.value}` : `−${Math.abs(item.value)}`}
              </text>
            )}
            <text x={x + 30} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">{item.label}</text>
          </g>
        );
      })}
    </g>
  );
}

function LossLines() {
  const left = 46;
  const right = W - 24;
  const top = 18;
  const bottom = 170;
  const maxLoss = 400;
  const px = (bp: number) => left + (bp / SHOCK_BP) * (right - left);
  const py = (loss: number) => top + (loss / maxLoss) * (bottom - top);
  const ticks = Array.from({ length: SHOCK_BP + 1 }, (_, bp) => bp);
  return (
    <g>
      <line x1={left} x2={right} y1={top} y2={top} stroke="#94a3b8" strokeWidth={1} />
      <line x1={left} x2={left} y1={top} y2={bottom} stroke="#94a3b8" strokeWidth={1} />
      <text x={left - 6} y={top + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
      <text x={left - 6} y={py(RESIDUAL * SHOCK_BP) + 4} textAnchor="end" fontSize={10} fill="#16a34a">−{RESIDUAL * SHOCK_BP}</text>
      <text x={left - 6} y={py(EXPOSURE * SHOCK_BP) + 4} textAnchor="end" fontSize={10} fill="#2563eb">−{EXPOSURE * SHOCK_BP}</text>
      {ticks.map((bp) => (
        <text key={bp} x={px(bp)} y={top - 5} textAnchor="middle" fontSize={10} fill="#64748b">{bp}bp</text>
      ))}
      <line x1={px(0)} y1={py(0)} x2={px(SHOCK_BP)} y2={py(EXPOSURE * SHOCK_BP)} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
      <line x1={px(0)} y1={py(0)} x2={px(SHOCK_BP)} y2={py(RESIDUAL * SHOCK_BP)} stroke="#16a34a" strokeWidth={1.25} />
      <circle cx={px(SHOCK_BP)} cy={py(RESIDUAL * SHOCK_BP)} r={4} fill="#16a34a" />
      <text x={px(SHOCK_BP) - 6} y={py(RESIDUAL * SHOCK_BP) + 18} textAnchor="end" fontSize={11} fontWeight={700} fill="#16a34a">잔여 +20: 20×5</text>
      <text x={left + 14} y={150} fontSize={11} fill="#2563eb">헤지 없었다면: 80×5</text>
      <text x={left} y={H - 4} fontSize={10} fill="#64748b">아래로 갈수록 손실 · 가로는 불리한 금리 변화</text>
    </g>
  );
}

export default function ResidualSensitivityViz() {
  return (
    <SceneShell
      eyebrow="임시 헤지"
      title="+80에 −60을 더하면 경매 전 남는 위험은 +20입니다"
      description="앞 두 장면의 막대는 1bp당 손익 민감도, 마지막 장면의 선은 불리한 금리 변화가 커질 때의 단순 선형 손실입니다. 숫자는 3절의 교육용 수치입니다."
      ariaLabel="민감도 +80에 임시 헤지 -60을 더해 잔여 +20이 되고, 5bp 불리한 변화에서 잔여 손실 100과 헤지가 없었을 때 400을 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 2 ? <Bars active={active} /> : <LossLines />}
        </svg>
      )}
    />
  );
}
