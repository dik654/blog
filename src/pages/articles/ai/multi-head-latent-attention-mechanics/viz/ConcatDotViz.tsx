import SceneShell from "./SceneShell";

/**
 * 본문 대응: #content-position — [q^C; q^R]·[k^C; k^R] = q^C·k^C + q^R·k^R.
 * 띠의 폭은 차원 128과 64에 비례한다. 숫자 예시는 칸을 세 개로 줄인 가정이다: 1·4+2·5+3·6=32, 14+18=32.
 */
const SCENES = [
  { label: "이어 붙인 벡터", summary: "128 + 64 = 192칸", note: "query와 key는 각각 content 부분과 위치 부분을 이어 붙인 벡터입니다. 같은 순서로 붙였으니 앞쪽끼리, 뒤쪽끼리 칸이 맞습니다." },
  { label: "통째로 내적", summary: "4 + 10 + 18 = 32", note: "칸을 세 개로 줄인 예입니다(가정). 내적은 같은 칸끼리 곱해 모두 더하는 계산이라 어느 칸이 어느 부분인지 따지지 않아도 답이 나옵니다." },
  { label: "부분끼리 따로 내적", summary: "14 + 18 = 32", note: "앞 두 칸의 내적 14와 뒤 한 칸의 내적 18을 더해도 32입니다. 덧셈을 묶는 위치만 바꾼 것이므로 어떤 값을 넣어도 항상 같습니다." },
  { label: "score의 두 항", summary: "q^C·k^C + q^R·k^R", note: "그래서 attention 점수는 content 내적과 위치 내적의 합으로 저절로 갈라집니다. 두 항은 서로 다른 weight와 차원에서 독립적으로 계산되고 마지막에 더해질 뿐입니다." },
] as const;

const SCALE = 1.4;
const LEFT = 42;
const CW = 128 * SCALE;
const PW = 64 * SCALE;
const Q = [1, 2, 3] as const;
const K = [4, 5, 6] as const;
const CELL = 44;
const CELL_X = [86, 134, 218] as const;

function Strip({ y, name, c, r }: { y: number; name: string; c: string; r: string }) {
  return (
    <>
      <text x={LEFT - 8} y={y + 17} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">{name}</text>
      <rect x={LEFT} y={y} width={CW} height={24} fill="#2563eb" opacity={0.16} stroke="#2563eb" strokeWidth={1} />
      <rect x={LEFT + CW} y={y} width={PW} height={24} fill="#d97706" opacity={0.16} stroke="#d97706" strokeWidth={1} />
      <text x={LEFT + CW / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{c}</text>
      <text x={LEFT + CW + PW / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={700} fill="#d97706">{r}</text>
    </>
  );
}

export default function ConcatDotViz() {
  return (
    <SceneShell
      eyebrow="이어 붙인 내적"
      title="이어 붙인 벡터의 내적은 부분끼리의 내적을 더한 값과 같습니다"
      description="파란 부분은 위치와 무관한 content, 주황 부분은 회전이 걸린 위치 전용입니다. 위 띠의 폭은 차원 128과 64에 비례합니다."
      ariaLabel="이어 붙인 query와 key의 내적이 두 항의 합으로 갈라지는 계산"
      scenes={SCENES}
      render={(active) => {
        const numeric = active === 1 || active === 2;
        return (
          <svg viewBox="0 0 360 186" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {!numeric && (
              <>
                <Strip y={18} name="q" c="q_t^C · 128" r="q_t^R · 64" />
                <Strip y={60} name="k" c="k_t^C · 128" r="k_t^R · 64" />
                {active === 3 && (
                  <>
                    <path d={`M ${LEFT} 92 V 100 H ${LEFT + CW - 2} V 92`} fill="none" stroke="#2563eb" strokeWidth={1} />
                    <path d={`M ${LEFT + CW + 2} 92 V 100 H ${LEFT + CW + PW} V 92`} fill="none" stroke="#d97706" strokeWidth={1} />
                    <text x={LEFT + CW / 2} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">q^C·k^C</text>
                    <text x={LEFT + CW} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">+</text>
                    <text x={LEFT + CW + PW / 2} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">q^R·k^R</text>
                    <text x={LEFT + (CW + PW) / 2} y={148} textAnchor="middle" fontSize={12} fill="#64748b">= score</text>
                  </>
                )}
              </>
            )}
            {numeric && (
              <>
                <text x={58} y={40} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">q</text>
                <text x={58} y={94} textAnchor="end" fontSize={13} fontWeight={700} fill="#475569">k</text>
                {CELL_X.map((x, index) => {
                  const color = index < 2 ? "#2563eb" : "#d97706";
                  const product = Q[index] * K[index];
                  return (
                    <g key={x}>
                      <rect x={x} y={18} width={CELL} height={32} fill={color} opacity={0.16} stroke={color} strokeWidth={1} />
                      <rect x={x} y={72} width={CELL} height={32} fill={color} opacity={0.16} stroke={color} strokeWidth={1} />
                      <text x={x + CELL / 2} y={39} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>{Q[index]}</text>
                      <text x={x + CELL / 2} y={93} textAnchor="middle" fontSize={14} fontWeight={700} fill={color}>{K[index]}</text>
                      <line x1={x + CELL / 2} x2={x + CELL / 2} y1={50} y2={72} stroke="#94a3b8" strokeWidth={1} />
                      <text x={x + CELL / 2} y={128} textAnchor="middle" fontSize={13} fontWeight={700} fill={color}>{product}</text>
                    </g>
                  );
                })}
                {active === 2 ? (
                  <>
                    <path d={`M ${CELL_X[0]} 136 V 142 H ${CELL_X[1] + CELL} V 136`} fill="none" stroke="#2563eb" strokeWidth={1} />
                    <line x1={CELL_X[2]} x2={CELL_X[2] + CELL} y1={142} y2={142} stroke="#d97706" strokeWidth={1} />
                    <text x={(CELL_X[0] + CELL_X[1] + CELL) / 2} y={162} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">4 + 10 = 14</text>
                    <text x={CELL_X[2] + CELL / 2} y={162} textAnchor="middle" fontSize={13} fontWeight={700} fill="#d97706">18</text>
                    <text x={CELL_X[2] + CELL + 10} y={162} fontSize={13} fontWeight={700} fill="#475569">→ 32</text>
                  </>
                ) : (
                  <text x={(CELL_X[0] + CELL_X[2] + CELL) / 2} y={162} textAnchor="middle" fontSize={13} fontWeight={700} fill="#475569">합 32</text>
                )}
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
