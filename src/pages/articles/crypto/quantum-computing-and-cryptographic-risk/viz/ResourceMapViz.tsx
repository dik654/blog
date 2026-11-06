import SceneShell from "./SceneShell";
import { Arrow } from "./SvgBits";

/**
 * 본문 대응: #comparison — 2019 추정 2천만·8시간, Gidney 2025 100만 미만·1주 미만, Babbush 2026 50만 미만·분 단위.
 * 두 축 모두 로그 눈금입니다. 2천만÷100만=20, 1주=168시간, 168÷8=21.
 * 마지막 장면의 점은 2025의 큐비트와 2019의 시간을 합친 조합입니다. 두 RSA 추정은 장치 가정이 같고(arXiv 2505.15917 초록) 회로가 다르므로,
 * 장치 차이가 아니라 회로의 맞바꿈이 이 조합을 막는 이유입니다.
 */
const W = 360;
const H = 276;
const LEFT = 52;
const RIGHT = 14;
const TOP = 16;
const BOTTOM = 40;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const FAINT = "#94a3b8";

const LOG_X = [Math.log10(2e5), Math.log10(5e7)];
const LOG_Y = [Math.log10(1 / 60 / 2), Math.log10(168 * 2.5)];
const px = (qubits: number) => LEFT + ((Math.log10(qubits) - LOG_X[0]) / (LOG_X[1] - LOG_X[0])) * (W - LEFT - RIGHT);
const py = (hours: number) => TOP + ((LOG_Y[1] - Math.log10(hours)) / (LOG_Y[1] - LOG_Y[0])) * (H - TOP - BOTTOM);

const SCENES = [
  { label: "2019 추정", summary: "2천만 개 · 8시간", note: "같은 저자가 공저한 2019년 RSA-2048 추정입니다. 왼쪽일수록 큐비트가 적고, 아래일수록 시간이 짧습니다. 눈금은 로그입니다." },
  { label: "2025 추정", summary: "약 1/20 큐비트 · 8시간 → 1주", note: "Gidney 2025는 100만 개 미만·1주 미만입니다. 큐비트는 약 20분의 1로 줄고, 시간은 8시간에서 1주(168시간) 쪽으로 늘어납니다." },
  { label: "다른 문제", summary: "secp256k1 · 50만 미만 · 분 단위", note: "Babbush 2026은 RSA가 아니라 secp256k1 이산로그입니다. 회로 구성과 시간 계산이 따로이므로 선으로 잇지 않습니다. 같은 기계로 두 문제를 푸는 비교가 아닙니다." },
  { label: "골라 합치면", summary: "어느 추정에도 없는 조합", note: "두 RSA 추정은 장치 가정이 같고 알고리즘이 다릅니다. 큐비트를 줄인 회로가 시간을 늘렸으므로 100만 개로 8시간을 내는 회로는 어느 쪽에도 없습니다. 소자나 게이트 속도까지 다른 논문을 섞으면 더 성립하지 않습니다. 어느 점도 장치가 이미 있다는 보고가 아닙니다." },
] as const;

function Chart({ active }: { active: number }) {
  const y2019 = py(8);
  const x2019 = px(2e7);
  const x2025 = px(1e6);
  const y2025 = py(168);
  const xEc = px(5e5);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      {[
        { h: 1 / 60, t: "1분" },
        { h: 1, t: "1시간" },
        { h: 8, t: "8시간" },
        { h: 168, t: "1주" },
      ].map((tick) => (
        <g key={tick.t}>
          <line x1={LEFT} x2={W - RIGHT} y1={py(tick.h)} y2={py(tick.h)} stroke={FAINT} strokeWidth={0.5} strokeDasharray="2 3" />
          <text x={LEFT - 6} y={py(tick.h) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{tick.t}</text>
        </g>
      ))}
      {[
        { q: 5e5, t: "50만" },
        { q: 1e6, t: "100만" },
        { q: 2e7, t: "2천만" },
      ].map((tick) => (
        <g key={tick.t}>
          <line x1={px(tick.q)} x2={px(tick.q)} y1={TOP} y2={H - BOTTOM} stroke={FAINT} strokeWidth={0.5} strokeDasharray="2 3" />
          <text x={px(tick.q) + (tick.q === 5e5 ? -6 : tick.q === 1e6 ? 8 : 0)} y={H - BOTTOM + 16} textAnchor="middle" fontSize={12} fill={GRAY}>{tick.t}</text>
        </g>
      ))}
      <line x1={LEFT} x2={W - RIGHT} y1={H - BOTTOM} y2={H - BOTTOM} stroke={FAINT} strokeWidth={1} />
      <line x1={LEFT} x2={LEFT} y1={TOP} y2={H - BOTTOM} stroke={FAINT} strokeWidth={1} />
      <text x={(LEFT + W - RIGHT) / 2} y={H - 6} textAnchor="middle" fontSize={12} fill={GRAY}>물리 큐비트 수 (로그 눈금)</text>

      <rect x={x2019 - 6} y={y2019 - 6} width={12} height={12} fill={BLUE} />
      <text x={x2019 - 2} y={y2019 + 24} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>RSA 2019</text>

      {active >= 1 && (
        <g>
          {active === 1 && <Arrow x1={x2019 - 9} y1={y2019 - 5} x2={x2025 + 10} y2={y2025 + 6} color={BLUE} />}
          <rect x={x2025 - 6} y={y2025 - 6} width={12} height={12} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={x2025 + 12} y={y2025 - 6} fontSize={13} fontWeight={700} fill={BLUE}>RSA 2025 · 둘 다 미만</text>
        </g>
      )}

      {active >= 2 && (
        <g>
          <rect x={xEc - 7} y={py(1)} width={14} height={py(1 / 60) - py(1)} rx={3} fill={`${AMBER}33`} stroke={AMBER} strokeWidth={1} />
          <text x={xEc + 13} y={py(1 / 8)} fontSize={13} fontWeight={700} fill={AMBER}>secp256k1 2026</text>
          <text x={xEc + 13} y={py(1 / 8) + 16} fontSize={12} fill={AMBER}>분 단위 · 다른 문제</text>
        </g>
      )}

      {active === 3 && (
        <g>
          <line x1={x2025} x2={x2025} y1={y2025 + 8} y2={y2019 - 10} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={x2019 - 8} x2={x2025 + 10} y1={y2019} y2={y2019} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
          <path d={`M${x2025 - 7} ${y2019 - 7} L${x2025 + 7} ${y2019 + 7} M${x2025 + 7} ${y2019 - 7} L${x2025 - 7} ${y2019 + 7}`} stroke={RED} strokeWidth={1.25} fill="none" />
          <text x={x2025 + 12} y={y2019 + 20} fontSize={13} fontWeight={700} fill={RED}>없는 조합</text>
        </g>
      )}
    </svg>
  );
}

export default function ResourceMapViz() {
  return (
    <SceneShell
      eyebrow="같은 축에 놓은 추정"
      title="RSA 추정은 큐비트를 줄이는 대신 시간을 늘렸고, 골라 합칠 수는 없습니다"
      description="모두 실행 결과가 아니라 각 논문의 장치 가정 안에서 낸 추정입니다."
      ariaLabel="RSA-2048 추정 2019와 2025, secp256k1 추정 2026을 큐비트와 시간 축에 놓고 없는 조합을 표시"
      scenes={SCENES}
      render={(active) => <Chart active={active} />}
    />
  );
}
