import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names 둘째 문단과 아래 듀파이어 수식 — 1년 풋 90·100·110 = 3.589·7.966·14.292(가정, 모두 흔들림 20%).
 * 양끝을 잇는 직선의 100 지점 = (3.589+14.292)/2 ≈ 8.94. 100 풋은 그보다 약 0.97 아래.
 * 나비 묶음 = 3.589 − 2×7.966 + 14.292 ≈ 1.95 (수식 상자 1.950), ÷10² = 0.0195.
 * 100 풋이 8.94보다 비싸면 나비 묶음이 음수가 되어 식이 값을 내지 못한다(수식 상자 해석).
 */
const W = 360;
const H = 210;
const X0 = 50;
const X1 = 330;
const Y_TOP = 18;
const Y_BOT = 172;
const P_MIN = 2;
const P_MAX = 16;
const x = (strike: number) => X0 + ((strike - 85) / 30) * (X1 - X0);
const y = (price: number) => Y_BOT - ((price - P_MIN) / (P_MAX - P_MIN)) * (Y_BOT - Y_TOP);

const P90 = 3.589;
const P100 = 7.966;
const P110 = 14.292;
const MID = (P90 + P110) / 2;
const SAG = MID - P100;
const BUTTERFLY = P90 - 2 * P100 + P110;

const PUTS = [
  { strike: 90, price: P90 },
  { strike: 100, price: P100 },
  { strike: 110, price: P110 },
] as const;

const SCENES = [
  { label: "세 풋 가격", summary: "3.589 · 7.966 · 14.292", note: "풋은 정해진 행사가에 팔 수 있는 권리입니다. 같은 1년 만기의 90·100·110 풋을 모두 흔들림 20%로 계산한 값이며(가정), 행사가가 높을수록 비쌉니다." },
  { label: "양끝을 잇는 직선", summary: `100 지점 ≈ ${MID.toFixed(2)}`, note: "90과 110 풋 가격을 직선으로 이으면 100 지점의 높이는 두 값의 평균 약 8.94입니다." },
  { label: "아래로 휜 만큼", summary: `3.589 + 14.292 − 2×7.966 ≈ ${BUTTERFLY.toFixed(2)}`, note: "100 풋은 직선보다 약 0.97 아래에 있습니다. 90 풋 하나와 110 풋 하나를 사고 100 풋 둘을 판 묶음(나비 묶음)의 값이 이 차이의 두 배, 약 1.95입니다. 행사가 간격 10의 제곱으로 나눈 0.0195가 수식의 '행사가 방향 휘어짐'이고, 여기에 100²을 곱한 195.0이 분모입니다." },
  { label: "직선 위로 올라가면", summary: "나비 묶음 < 0 → 값 없음", note: "100 풋이 8.94보다 비싸게 호가되면 점이 직선 위로 올라가 나비 묶음 값이 음수가 됩니다. 그러면 식이 값을 내지 못하므로, 보정 전에 그 호가부터 점검합니다." },
] as const;

const DOT = "#2563eb";
const CHORD = "#64748b";
const SAG_COLOR = "#d97706";
const BAD = "#dc2626";

export default function PutCurvatureViz() {
  return (
    <SceneShell
      eyebrow="행사가 방향 휘어짐"
      title="세 풋 가격이 아래로 휜 정도가 듀파이어 식의 분모에 들어갑니다"
      description="듀파이어 식은 바로 아래 문단과 수식 상자에서 소개하는, 오늘의 옵션가격에서 행사가·만기별 흔들림(지역변동성)을 거꾸로 읽는 식입니다. 가로축은 행사가, 세로축은 1년 만기 풋 가격이며, 주가 100, 금리·배당 0, 모든 풋을 흔들림 20%로 계산한 수식 상자의 가정 값을 씁니다."
      ariaLabel="행사가 90, 100, 110 풋 가격 3.589, 7.966, 14.292와 양끝 직선의 차이로 읽는 나비 묶음 값 1.95"
      scenes={SCENES}
      render={(active) => {
        const showChord = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 3 && <rect x={x(100) - 14} y={Y_TOP} width={28} height={y(MID) - Y_TOP} fill="#fee2e2" />}
            <line x1={X0} x2={X0} y1={Y_TOP} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={Y_BOT} y2={Y_BOT} stroke="#94a3b8" strokeWidth={1} />
            {PUTS.map((put) => (
              <text key={`k-${put.strike}`} x={x(put.strike)} y={Y_BOT + 18} textAnchor="middle" fontSize={12} fill="#64748b">{put.strike}</text>
            ))}
            <text x={X1} y={Y_BOT + 34} textAnchor="end" fontSize={12} fill="#64748b">행사가</text>
            {[5, 10, 15].map((tick) => (
              <g key={tick}>
                <line x1={X0 - 4} x2={X0} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} />
                <text x={X0 - 8} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}

            {showChord && <line x1={x(90)} y1={y(P90)} x2={x(110)} y2={y(P110)} stroke={CHORD} strokeWidth={1.25} strokeDasharray="5 3" />}
            {showChord && (
              <g>
                <circle cx={x(100)} cy={y(MID)} r={3.5} fill="#ffffff" stroke={CHORD} strokeWidth={1.25} />
                <text x={x(100) - 8} y={y(MID) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={CHORD}>직선 {MID.toFixed(2)}</text>
              </g>
            )}

            {active === 2 && (
              <g>
                <line x1={x(100) + 14} x2={x(100) + 14} y1={y(MID)} y2={y(P100)} stroke={SAG_COLOR} strokeWidth={1.25} />
                <line x1={x(100) + 10} x2={x(100) + 18} y1={y(MID)} y2={y(MID)} stroke={SAG_COLOR} strokeWidth={1} />
                <line x1={x(100) + 10} x2={x(100) + 18} y1={y(P100)} y2={y(P100)} stroke={SAG_COLOR} strokeWidth={1} />
                <text x={x(100) + 22} y={(y(MID) + y(P100)) / 2 + 4} fontSize={12} fontWeight={700} fill={SAG_COLOR}>≈{SAG.toFixed(2)}</text>
              </g>
            )}

            {active === 3 && (
              <g>
                <text x={x(100) - 20} y={Y_TOP + 16} textAnchor="end" fontSize={12} fontWeight={700} fill={BAD}>100 풋이 이 띠에 오면</text>
                <text x={x(100) - 20} y={Y_TOP + 32} textAnchor="end" fontSize={12} fontWeight={700} fill={BAD}>값 없음</text>
              </g>
            )}

            {PUTS.map((put) => (
              <g key={`p-${put.strike}`}>
                <circle cx={x(put.strike)} cy={y(put.price)} r={5} fill={DOT} />
                <text
                  x={x(put.strike) + (put.strike === 110 ? -8 : put.strike === 90 ? 9 : 0)}
                  y={y(put.price) + (put.strike === 110 ? -10 : put.strike === 90 ? 4 : 20)}
                  textAnchor={put.strike === 110 ? "end" : put.strike === 90 ? "start" : "middle"}
                  fontSize={12}
                  fontWeight={700}
                  fill={DOT}
                >
                  {put.price.toFixed(3)}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
