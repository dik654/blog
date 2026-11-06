import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 증거금 10, 손실 정산 4 → 잔액 6, 유지 기준 7 아래 → 10까지 복원.
 * 추가액 = 10−6 = 4. 유지 기준까지의 차이 7−6 = 1은 답이 아니다. 모두 비교 가정.
 */
const BASE_Y = 158;
const UNIT = 13;
const y = (value: number) => BASE_Y - value * UNIT;
const BAR_W = 58;
const COLUMNS = [
  { x: 72, label: "처음" },
  { x: 170, label: "정산 후" },
  { x: 268, label: "복원 후" },
] as const;

const SCENES = [
  { label: "처음 10억 원을 맡김", summary: "잔액 10", note: "증거금은 계약 이행을 위해 미리 맡긴 돈입니다. 이 사례에서는 처음 요구액이 10억 원입니다." },
  { label: "손실 정산 4억 원이 나감", summary: "10 − 4 = 6", note: "가격 변화의 정산액은 잔액에서 바로 빠집니다. 잔액 6억 원은 유지 기준 7억 원 아래입니다." },
  { label: "처음 요구액까지 복원", summary: "10 − 6 = 4억 원 추가", note: "선 아래로 떨어지면 7억 원이 아니라 10억 원까지 채워야 하는 조건입니다. 그래서 추가액은 7 − 6 = 1억 원이 아니라 4억 원입니다." },
] as const;

export default function FuturesRestoreViz() {
  return (
    <SceneShell
      eyebrow="선물 증거금"
      title="기준선은 7억 원인데 채울 곳은 10억 원입니다"
      description="유지 기준은 잔액이 이 아래로 내려가면 돈을 더 넣어야 하는 선입니다. 단위는 억 원입니다."
      note="금액은 모두 비교 가정이며 CME의 실제 특정 상품 요율이 아닙니다."
      ariaLabel="선물 증거금 잔액이 유지 기준 아래로 내려간 뒤 처음 요구액까지 복원되는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={0} x2={360} y1={y(10)} y2={y(10)} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
          <text x={0} y={y(10) - 5} fontSize={11} fontWeight={700} fill="#2563eb">처음 요구액 10</text>
          <line x1={0} x2={360} y1={y(7)} y2={y(7)} stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
          <text x={0} y={y(7) - 5} fontSize={11} fontWeight={700} fill="#b45309">유지 기준 7</text>
          <line x1={0} x2={360} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          {COLUMNS.map((column, index) => (
            <text key={column.label} x={column.x + BAR_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fontWeight={index === active ? 700 : 400} fill="#64748b">{column.label}</text>
          ))}
          <rect x={COLUMNS[0].x} y={y(10)} width={BAR_W} height={10 * UNIT} fill="#475569" />
          <text x={COLUMNS[0].x + BAR_W / 2} y={y(5)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">10</text>
          {active >= 1 && (
            <g>
              <rect x={COLUMNS[1].x} y={y(6)} width={BAR_W} height={6 * UNIT} fill="#475569" />
              <rect x={COLUMNS[1].x} y={y(10)} width={BAR_W} height={4 * UNIT} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
              <text x={COLUMNS[1].x + BAR_W / 2} y={y(8) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">−4</text>
              <text x={COLUMNS[1].x + BAR_W / 2} y={y(3)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">6</text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <rect x={COLUMNS[2].x} y={y(6)} width={BAR_W} height={6 * UNIT} fill="#475569" />
              <rect x={COLUMNS[2].x} y={y(10)} width={BAR_W} height={4 * UNIT} fill="#15803d" />
              <text x={COLUMNS[2].x + BAR_W / 2} y={y(8) + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">+4</text>
              <text x={COLUMNS[2].x + BAR_W / 2} y={y(3)} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">6</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
