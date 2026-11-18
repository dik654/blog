import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 대칭 경로 두 쌍의 지급 5·0, 10·0(가정).
 * (가정) 첫 쌍의 원래 경로를 1절의 100·102·106·112로 두고 월별 변화 +2·+4·+6의 부호를 뒤집으면 100·98·94·88, 평균 95 → 지급 0.
 * 네 지급 평균 3.75, 표본표준편차 √(68.75÷3)≈4.787 → 표준오차 4.787÷√4≈2.39.
 * 쌍 평균 2.5·5, 표본표준편차 √(3.125÷1)≈1.768 → 표준오차 1.768÷√2=1.25.
 */
const UP = [100, 102, 106, 112] as const;
const DOWN = [100, 98, 94, 88] as const;
const UP_LIST: readonly number[] = UP;
const DOWN_LIST: readonly number[] = DOWN;

const MEAN = 3.75;
const SE_RAW = 2.39;
const SE_PAIR = 1.25;

const SCENES = [
  { label: "부호를 뒤집은 짝 경로", summary: "평균 105 → 지급 5 · 평균 95 → 지급 0", note: "(가정) 첫 무작위 경로를 1절의 100·102·106·112로 두고, 월별 변화 +2·+4·+6을 만든 무작위 수의 부호를 뒤집으면 짝 경로는 100·98·94·88입니다. 평균 95가 행사가격 100보다 낮아 지급은 0입니다." },
  { label: "네 지급을 따로 보면", summary: "평균 3.75 · 표준오차 약 2.39", note: "둘째 쌍의 지급 10과 0까지 네 점을 수직선에 올립니다. 막대는 평균 3.75에서 표준오차만큼 양쪽으로 그은 폭입니다. 표준오차는 평균값이 표본마다 얼마나 흔들릴지 표본에서 추정한 크기입니다." },
  { label: "쌍마다 먼저 평균내면", summary: "2.5와 5 · 표준오차 약 1.25", note: "5와 0의 평균 2.5, 10과 0의 평균 5를 한 점씩으로 봅니다. 쌍 안에서 큰 값과 작은 값이 서로 상쇄되어 두 점이 평균 가까이 모이고, 같은 평균 3.75에서 막대가 짧아집니다." },
  { label: "표본 네 개의 한계", summary: "2.39 → 1.25 · 성능 보장 아님", note: "점이 넷뿐인 설명용 표본이라 이 감소율을 실제 계산 성능으로 약속할 수 없습니다. 반대 방향 경로가 흔들림을 상쇄하는 원리만 보여 줍니다." },
] as const;

const W = 360;
const H = 260;
// 위쪽 경로 그림
const P_LEFT = 40;
const P_RIGHT = 84;
const P_TOP = 14;
const P_BOTTOM = 118;
const py = (value: number) => P_BOTTOM - ((value - 86) / (114 - 86)) * (P_BOTTOM - P_TOP);
const px = (month: number) => P_LEFT + 16 + month * ((W - P_LEFT - P_RIGHT - 32) / 3);
// 아래쪽 수직선
const N_LEFT = 24;
const N_RIGHT = 24;
const N_Y = 214;
const nx = (value: number) => N_LEFT + (value / 10) * (W - N_LEFT - N_RIGHT);
const N_TICKS = [0, 2.5, 5, 7.5, 10] as const;

function Dot({ value, row, color, label }: { value: number; row: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={nx(value)} cy={N_Y - 10 - row * 13} r={5} fill={color} />
      <text x={nx(value) + 8} y={N_Y - 6 - row * 13} fontSize={10} fill={color}>{label}</text>
    </g>
  );
}

export default function AntitheticPairViz() {
  return (
    <SceneShell
      eyebrow="대칭표본"
      title="반대 방향 경로를 짝지으면 평균이 덜 흔들립니다"
      description="위는 첫 쌍의 두 경로(가정, 회색 점선은 행사가격 100), 아래는 지급을 놓은 수직선입니다. 할인율은 0으로 둔 3절의 설명용 숫자입니다."
      ariaLabel="대칭 경로 두 쌍의 지급 5, 0, 10, 0과 쌍 평균 2.5, 5의 표준오차 비교"
      scenes={SCENES}
      render={(active) => {
        const pairMode = active >= 2;
        const se = pairMode ? SE_PAIR : SE_RAW;
        const showBar = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <g opacity={active === 0 ? 1 : 0.45}>
              <line x1={P_LEFT} x2={W - P_RIGHT + 6} y1={py(100)} y2={py(100)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
              <text x={P_LEFT - 6} y={py(100) + 4} textAnchor="end" fontSize={10} fill="#64748b">100</text>
              <polyline points={UP_LIST.map((v, m) => `${px(m)},${py(v)}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <polyline points={DOWN_LIST.map((v, m) => `${px(m)},${py(v)}`).join(" ")} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
              {UP_LIST.map((v, m) => (
                <g key={`u${m}`}>
                  <circle cx={px(m)} cy={py(v)} r={3.5} fill="#2563eb" />
                  {m > 0 && <text x={px(m)} y={py(v) - 7} textAnchor="middle" fontSize={10} fill="#2563eb">{v}</text>}
                </g>
              ))}
              {DOWN_LIST.map((v, m) => (
                <g key={`d${m}`}>
                  <circle cx={px(m)} cy={py(v)} r={3.5} fill="#d97706" />
                  {m > 0 && <text x={px(m)} y={py(v) + 15} textAnchor="middle" fontSize={10} fill="#d97706">{v}</text>}
                </g>
              ))}
              <text x={W - P_RIGHT + 10} y={py(108)} fontSize={11} fontWeight={700} fill="#2563eb">평균 105</text>
              <text x={W - P_RIGHT + 10} y={py(108) + 14} fontSize={11} fill="#2563eb">지급 5</text>
              <text x={W - P_RIGHT + 10} y={py(92)} fontSize={11} fontWeight={700} fill="#d97706">평균 95</text>
              <text x={W - P_RIGHT + 10} y={py(92) + 14} fontSize={11} fill="#d97706">지급 0</text>
            </g>

            <line x1={N_LEFT} x2={W - N_RIGHT} y1={N_Y} y2={N_Y} stroke="#94a3b8" strokeWidth={1} />
            {N_TICKS.map((tick) => (
              <g key={tick}>
                <line x1={nx(tick)} x2={nx(tick)} y1={N_Y} y2={N_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={nx(tick)} y={N_Y + 17} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            {active === 0 && (
              <>
                <Dot value={5} row={0} color="#2563eb" label="5" />
                <Dot value={0} row={0} color="#d97706" label="0" />
              </>
            )}
            {active === 1 && (
              <>
                <Dot value={5} row={0} color="#2563eb" label="5" />
                <Dot value={0} row={0} color="#d97706" label="0" />
                <Dot value={10} row={0} color="#2563eb" label="" />
                <Dot value={0} row={1} color="#d97706" label="0" />
                <text x={nx(10) - 8} y={N_Y - 6} textAnchor="end" fontSize={10} fill="#2563eb">10</text>
              </>
            )}
            {pairMode && (
              <>
                <circle cx={nx(5)} cy={N_Y - 10} r={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <circle cx={nx(0)} cy={N_Y - 10} r={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <circle cx={nx(10)} cy={N_Y - 10} r={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <circle cx={nx(0)} cy={N_Y - 23} r={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
                <Dot value={2.5} row={2} color="#16a34a" label="2.5" />
                <Dot value={5} row={2} color="#16a34a" label="5" />
              </>
            )}
            {showBar && (
              <g>
                <line x1={nx(MEAN - se)} x2={nx(MEAN + se)} y1={N_Y - 52} y2={N_Y - 52} stroke="#334155" strokeWidth={1.25} />
                <line x1={nx(MEAN - se)} x2={nx(MEAN - se)} y1={N_Y - 57} y2={N_Y - 47} stroke="#334155" strokeWidth={1} />
                <line x1={nx(MEAN + se)} x2={nx(MEAN + se)} y1={N_Y - 57} y2={N_Y - 47} stroke="#334155" strokeWidth={1} />
                <line x1={nx(MEAN)} x2={nx(MEAN)} y1={N_Y - 60} y2={N_Y} stroke="#334155" strokeWidth={1} strokeDasharray="2 2" />
                <text x={nx(MEAN)} y={N_Y - 64} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">평균 3.75 ± {se.toFixed(2)}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
