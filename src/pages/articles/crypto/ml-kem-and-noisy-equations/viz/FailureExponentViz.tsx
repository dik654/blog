import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 복호 실패율 2⁻¹³⁸·⁸, 2⁻¹⁶⁴·⁸(약 2.5×10⁻⁵⁰), 2⁻¹⁷⁴·⁸.
 * 가로축은 지수이고, 지수 1은 확률을 반으로 줄이는 일 한 번, 눈금 하나는 30번입니다.
 * 164.8−138.8=26 → 2²⁶=67,108,864. 174.8−164.8=10 → 2¹⁰=1,024.
 */
const W = 360;
const H = 212;
const X0 = 16;
const LEN = 326;
const Y = 118;
const MAX = 180;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const FAINT = "#94a3b8";
const px = (halvings: number) => X0 + (halvings / MAX) * LEN;

const POINTS = [
  { name: "ML-KEM-512", value: 138.8, y: 70 },
  { name: "ML-KEM-768", value: 164.8, y: 44 },
  { name: "ML-KEM-1024", value: 174.8, y: 18 },
] as const;

const SCENES = [
  { label: "눈금 읽기", summary: "눈금 하나 = 30번", note: "이 축은 확률을 반으로 몇 번 줄였는지를 셉니다. 오른쪽으로 갈수록 실패가 드뭅니다. 왼쪽 끝 0은 확률 1입니다. 위 막대는 반으로 줄인다는 뜻만 보이는 그림이라 아래 눈금과 맞추지 않았습니다." },
  { label: "세 값", summary: "138.8 · 164.8 · 174.8번", note: "FIPS 203 표 1의 복호 실패율입니다. 정상적으로 만든 키와 캡슐인데도 복원한 비밀이 달라질 확률이고, ML-KEM-768은 약 2.5×10⁻⁵⁰입니다." },
  { label: "512와 768 사이", summary: "26번 → 2²⁶ ≈ 6.7×10⁷배", note: "지수 차이 26은 26번 더 반으로 줄인다는 뜻이고, 곱으로는 약 6,700만 배입니다. 눈금은 짧아 보여도 차이는 곱으로 큽니다." },
  { label: "768과 1024 사이", summary: "10번 → 2¹⁰ = 1,024배", note: "이름의 간격은 앞과 같은 256인데 지수 차이는 10이라 약 천 배입니다. 모든 값은 해시 함수와 XOF가 균등 무작위 함수처럼 동작한다는 가정 아래 계산한 것입니다." },
] as const;

function Scale({ active }: { active: number }) {
  const span = active === 2 ? [138.8, 164.8] : active === 3 ? [164.8, 174.8] : null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={X0} x2={X0 + LEN} y1={Y} y2={Y} stroke={GRAY} strokeWidth={1.25} />
      {[0, 30, 60, 90, 120, 150, 180].map((tick) => (
        <g key={tick}>
          <line x1={px(tick)} x2={px(tick)} y1={Y - 5} y2={Y + 5} stroke={FAINT} strokeWidth={1} />
          <text x={px(tick)} y={Y + 21} textAnchor="middle" fontSize={12} fill={GRAY}>{tick}</text>
        </g>
      ))}
      <text x={X0 + LEN / 2} y={Y + 72} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>반으로 줄인 횟수</text>

      {active === 0 && (
        <g>
          {[0, 1, 2, 3].map((step) => (
            <g key={step}>
              <text x={X0} y={15 + step * 19} fontSize={12} fill={GRAY}>{step}번</text>
              <rect x={X0 + 36} y={4 + step * 19} width={168 / 2 ** step} height={14} fill={`${BLUE}33`} stroke={BLUE} strokeWidth={1} />
            </g>
          ))}
          <text x={X0 + LEN} y={15 + 2 * 19} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>폭이 반씩 줄어듦</text>
          <line x1={X0} x2={X0 + LEN} y1={85} y2={85} stroke={FAINT} strokeWidth={1} strokeDasharray="3 3" />
        </g>
      )}

      {active >= 1 &&
        POINTS.map((point) => {
          const live = !span || span.includes(point.value);
          return (
            <g key={point.name} opacity={live ? 1 : 0.35}>
              <line x1={px(point.value)} x2={px(point.value)} y1={point.y + 6} y2={Y} stroke={BLUE} strokeWidth={1} />
              <circle cx={px(point.value)} cy={Y} r={4.5} fill={BLUE} />
              <text x={px(point.value) - 5} y={point.y + 10} textAnchor="end" fontSize={13} fontWeight={700} fill={BLUE}>{point.name} · {point.value}</text>
            </g>
          );
        })}
      {span && (
        <g>
          <line x1={px(span[0])} x2={px(span[1])} y1={Y + 32} y2={Y + 32} stroke={AMBER} strokeWidth={1.25} />
          <text x={px((span[0] + span[1]) / 2)} y={Y + 50} textAnchor="middle" fontSize={13} fontWeight={700} fill={AMBER}>{span[1] - span[0]}번</text>
        </g>
      )}
    </svg>
  );
}

export default function FailureExponentViz() {
  return (
    <SceneShell
      eyebrow="지수로 읽는 실패율"
      title="복호 실패율은 반으로 몇 번 줄였는지로 읽습니다"
      description="가로축이 2의 지수입니다. 2⁻¹⁶⁴·⁸은 1을 반으로 164.8번 줄인 값입니다. 작은 예제의 오류와는 다른 계산입니다."
      ariaLabel="ML-KEM 세 파라미터의 복호 실패율을 지수 축에 놓고 간격을 곱으로 읽는 과정"
      scenes={SCENES}
      render={(active) => <Scale active={active} />}
    />
  );
}
