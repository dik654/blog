import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — A만 집을 비우거나 B도 다른 절약 장치를 달면
 * 뺄셈 −2 − (−1) = −1은 그대로이고, 뺄셈의 각 칸이 뜻하는 것만 바뀐다. 칸 하나 = 1kWh.
 * 섞인 몫의 크기는 본문에 없으므로 칸 전체에 ‘섞임’만 표시하고 나누지 않는다.
 */
const SCENES = [
  { label: "조건이 맞을 때", summary: "−2 − (−1) = −1", note: "A의 2칸에서 B와 겹치는 1칸을 지우면 1칸이 남습니다. 평행 추세 가정이 맞을 때만 이 칸을 장치 효과로 읽습니다." },
  { label: "A만 집을 비울 때", summary: "−2 − (−1) = −1 그대로", note: "A만 집을 비우는 시간이 늘면 남은 칸에 그 변화가 섞입니다. 얼마나 섞였는지는 재실시간을 관측해야 합니다. 뺄셈은 맞고 해석이 흔들립니다." },
  { label: "B도 달라질 때", summary: "−2 − (−1) = −1 그대로", note: "두 집단 사이에 장치 사용법이 퍼지거나 B도 다른 절약 장치를 달았다면, 빼는 1칸이 ‘장치가 없을 때의 변화’가 아니게 됩니다. 비교 조건이 바뀐 것입니다." },
  { label: "계산과 해석", summary: "계산은 재현, 해석은 공개", note: "세 경우 모두 숫자는 −1입니다. 숫자만으로는 어느 경우인지 구별되지 않으므로 누가 어떤 개입을 받았는지 기록하고 원인 해석의 가정을 공개합니다." },
] as const;

const W = 340;
const H = 176;
const LABEL_W = 62;
const UNIT = 96;
const CELL_H = 40;
const ROWS = [8, 62, 122];
const cellX = (index: number) => LABEL_W + index * UNIT;

const A_COLOR = "#2563eb";
const B_COLOR = "#64748b";
const MIX = "#d97706";

function Cell({ index, top, color, label, mixed = false }: { index: number; top: number; color: string; label: string; mixed?: boolean }) {
  const stroke = mixed ? MIX : color;
  return (
    <g>
      <rect x={cellX(index) + 1} y={top} width={UNIT - 3} height={CELL_H} rx={6} fill={stroke} fillOpacity={mixed ? 0.14 : 0.08} stroke={stroke} strokeWidth={mixed ? 1.25 : 1} strokeDasharray={mixed ? "4 3" : undefined} />
      <text x={cellX(index) + UNIT / 2} y={top + 25} textAnchor="middle" fontSize={15} fontWeight={700} fill={stroke}>{label}</text>
    </g>
  );
}

export default function SameOneViz() {
  return (
    <SceneShell
      eyebrow="같은 −1, 다른 뜻"
      title="뺄셈은 그대로인데 칸의 뜻이 바뀝니다"
      description="칸 하나가 1kWh/가구·일입니다. 위 줄에서 가운데 줄을 지우면 아래 줄이 남습니다. 값은 설명용 (가정)입니다."
      ariaLabel="이중차분의 뺄셈 결과가 그대로인 채 각 칸의 의미가 달라지는 경우를 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const aMixed = active === 1 || active === 3;
        const bMixed = active === 2 || active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {["A 변화", "B 변화", "차이"].map((name, row) => (
              <text key={name} x={4} y={ROWS[row] + 25} fontSize={15} fontWeight={700} fill={row === 0 ? A_COLOR : row === 1 ? B_COLOR : "#64748b"}>{name}</text>
            ))}
            {["−2", "−1", "−1"].map((value, row) => (
              <text key={row} x={W - 4} y={ROWS[row] + 26} textAnchor="end" fontSize={15} fontWeight={700} fill="#64748b">{value}</text>
            ))}
            <Cell index={0} top={ROWS[0]} color={A_COLOR} label="B와 겹침" />
            <Cell index={1} top={ROWS[0]} color={A_COLOR} label={aMixed ? "재실시간?" : "추가"} mixed={aMixed} />
            <Cell index={0} top={ROWS[1]} color={B_COLOR} label={bMixed ? "다른 장치?" : "장치 없음"} mixed={bMixed} />
            <line x1={LABEL_W} x2={W - 30} y1={ROWS[2] - 10} y2={ROWS[2] - 10} stroke="#64748b" strokeWidth={1} />
            <Cell index={1} top={ROWS[2]} color={A_COLOR} label={active === 0 ? "장치 효과" : "무엇의 1?"} mixed={active !== 0} />
          </svg>
        );
      }}
    />
  );
}
