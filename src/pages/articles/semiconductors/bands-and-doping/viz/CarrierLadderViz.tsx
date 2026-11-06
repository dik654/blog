import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1 cm³ 안의 개수를 같은 로그 눈금에 찍어 10⁴·10¹⁰·10¹⁶·5×10²²의 차이를 본다.
 * 조각 A: 전자·빈자리 각 10¹⁰. 조각 B(가정): 전자 10¹⁶, 빈자리 10⁴. 실리콘 원자 5×10²².
 * 10¹⁶ ÷ 10¹⁰ = 10⁶, 10¹⁰ ÷ 10⁴ = 10⁶, 5×10²² ÷ 10¹⁶ = 5×10⁶.
 */
const W = 360;
const H = 196;
const LEFT = 20;
const RIGHT = 340;
const MIN_EXP = 3;
const MAX_EXP = 23.5;
const AXIS_Y = 168;
const ATOM_EXP = 22 + Math.log10(5);

const x = (exponent: number) => LEFT + ((exponent - MIN_EXP) / (MAX_EXP - MIN_EXP)) * (RIGHT - LEFT);

const TICKS: readonly { exp: number; label: string }[] = [
  { exp: 4, label: "10⁴" },
  { exp: 10, label: "10¹⁰" },
  { exp: 16, label: "10¹⁶" },
  { exp: 22, label: "10²²" },
];

const SCENES = [
  { label: "기준 조각 A", summary: "전자 약 10¹⁰ · 빈자리 약 10¹⁰", note: "300 K 순수 실리콘입니다. 전자와 빈자리가 같은 자리에 찍힙니다. 이 10¹⁰은 강의안의 교육용 기준값이고 모든 온도에 적용되는 재료 상수는 아닙니다." },
  { label: "조각 B", summary: "전자 ×백만 · 빈자리 약 10⁴", note: "전자를 내놓기 쉬운 원자 10¹⁶개를 넣고 거의 모두 작동한다고 가정한 계산입니다. 전자는 A보다 백만 배 많아지고 빈자리는 약 10⁴개가 됩니다." },
  { label: "실리콘 원자 전체와 비교", summary: "넣은 원자는 약 500만 개 중 1개", note: "실리콘 원자 밀도 약 5×10²²개를 10¹⁶으로 나누면 약 5×10⁶입니다. 원자로 보면 아주 적게 바꿨는데 움직이는 전자 수는 백만 배가 됐습니다." },
] as const;

function Electron({ exp, y }: { exp: number; y: number }) {
  return <circle cx={x(exp)} cy={y} r={6} fill="#2563eb" />;
}

function Hole({ exp, y }: { exp: number; y: number }) {
  return <circle cx={x(exp)} cy={y} r={6} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="2 2" />;
}

function Span({ from, to, y, label }: { from: number; to: number; y: number; label: string }) {
  const a = x(from);
  const b = x(to);
  const direction = b > a ? 1 : -1;
  return (
    <g>
      <line x1={a + 9 * direction} x2={b - 9 * direction} y1={y} y2={y} stroke="#64748b" strokeWidth={1} />
      <polyline points={`${b - 15 * direction},${y - 4} ${b - 9 * direction},${y} ${b - 15 * direction},${y + 4}`} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={(a + b) / 2} y={y - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{label}</text>
    </g>
  );
}

export default function CarrierLadderViz() {
  return (
    <SceneShell
      eyebrow="1 cm³ 안의 개수"
      title="10⁴와 10¹⁶, 5×10²²를 한 눈금에 놓습니다"
      description="가로축은 로그 눈금이라 같은 간격이 같은 배수이고, 큰 눈금 한 칸은 백만 배(10⁶)입니다. 채운 점은 움직이는 전자, 점선 점은 빈자리입니다."
      note="10¹⁰과 5×10²²는 MIT 6.012 강의안의 값입니다. 빈자리 10⁴의 계산은 9절에서 합니다."
      ariaLabel="조각 A와 조각 B의 이동 전하 수와 실리콘 원자 밀도를 로그 눈금으로 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {TICKS.map((tick) => (
            <g key={tick.exp}>
              <line x1={x(tick.exp)} x2={x(tick.exp)} y1={14} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
              <text x={x(tick.exp)} y={AXIS_Y + 18} textAnchor="middle" fontSize={12} fill="currentColor">{tick.label}</text>
            </g>
          ))}
          <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />

          <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="currentColor" opacity={active === 0 ? 1 : 0.55}>조각 A</text>
          <g opacity={active === 0 ? 1 : 0.55}>
            <Hole exp={10} y={32} />
            <Electron exp={10} y={32} />
            <circle cx={x(10)} cy={32} r={9} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="2 2" />
            <text x={x(10) + 14} y={36} fontSize={11} fill="#64748b">전자 = 빈자리</text>
          </g>

          {active >= 1 && (
            <g opacity={active === 1 ? 1 : 0.55}>
              <text x={LEFT} y={66} fontSize={11} fontWeight={700} fill="currentColor">조각 B (가정)</text>
              <Hole exp={4} y={88} />
              <Electron exp={16} y={88} />
              {active === 1 && <Span from={10} to={16} y={88} label="×백만" />}
              <text x={x(16) + 11} y={92} fontSize={11} fill="#64748b">전자</text>
              <text x={x(4) + 11} y={92} fontSize={11} fill="#64748b">빈자리</text>
              {active === 1 && <circle cx={x(10)} cy={88} r={2.5} fill="#64748b" />}
            </g>
          )}

          {active === 2 && (
            <g>
              <text x={LEFT} y={122} fontSize={11} fontWeight={700} fill="currentColor">넣은 원자 → 실리콘 원자</text>
              <rect x={x(ATOM_EXP) - 6} y={136} width={12} height={12} fill="#64748b" />
              <text x={x(ATOM_EXP) + 7} y={160} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">5×10²²</text>
              <rect x={x(16) - 5} y={137} width={10} height={10} fill="none" stroke="#64748b" strokeWidth={1.25} />
              <Span from={16} to={ATOM_EXP} y={142} label="약 500만 배" />
            </g>
          )}
        </svg>
      )}
    />
  );
}
