import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aggregation — ABACA에서 인접 pair를 세고, A 출발 행을 나눠 P(b|a)를 만든다.
 * pair = AB·BA·AC·CA (L−1 = 4). A 출발 = AB·AC → N_A• = 2, N_AB = 1.
 * α = 0: A→A 0/2, A→B 1/2, A→C 1/2. α = 1(가정), |V| = 3: (0+1)/5 = 0.2, (1+1)/5 = 0.4, 0.4.
 */
const SEQ: readonly string[] = ["A", "B", "A", "C", "A"];
const VOCAB: readonly string[] = ["A", "B", "C"];
const PAIRS = SEQ.slice(0, -1).map((from, j) => ({ j: j + 1, from, to: SEQ[j + 1] }));
const COUNTS = VOCAB.map((from) => VOCAB.map((to) => PAIRS.filter((p) => p.from === from && p.to === to).length));
const ROW_A = COUNTS[0];
const ROW_A_TOTAL = ROW_A.reduce<number>((sum, value) => sum + value, 0);

const ACCENT = "#059669";
const MUTED = "#94a3b8";
const SUB = "#64748b";

const SCENES = [
  {
    label: "바로 이웃한 pair를 셉니다",
    summary: "pair L−1 = 4개",
    alpha: null,
    note: "길이 L = 5인 ABACA에서 바로 이웃한 두 event를 한 칸씩 밀며 읽으면 AB·BA·AC·CA 네 쌍이 나옵니다. 각 쌍이 3×3 표의 해당 칸에 1을 더합니다.",
  },
  {
    label: "A에서 나간 전이만 봅니다",
    summary: "N_AB = 1 · N_A• = 2",
    alpha: null,
    note: "A가 앞에 선 쌍은 AB와 AC 두 개입니다. 표의 A 행을 합한 2가 분모 N_A•이고, 그중 A→B 칸의 1이 분자 N_AB입니다.",
  },
  {
    label: "α = 0이면 단순 빈도",
    summary: "P(B|A) = 1/2",
    alpha: 0,
    note: "α는 모든 칸에 미리 더하는 보정값(smoothing)이고, α = 0은 아무것도 더하지 않는다는 뜻입니다. A 행의 각 칸을 행 합 2로 나눕니다. A→B와 A→C는 1/2, 한 번도 안 나온 A→A는 0이 되어 '절대 일어나지 않는다'고 단정합니다.",
  },
  {
    label: "α = 1이면 관측 안 된 전이도 0이 아님",
    summary: "(1+1) / (2+1×3) = 0.4",
    alpha: 1,
    note: "모든 칸에 α = 1을 더하고 분모에는 vocabulary 크기 3만큼 α를 더합니다(α = 1은 보이려고 고른 값입니다, 가정). A→A는 0.2, A→B와 A→C는 0.4가 되고 세 값의 합은 여전히 1입니다.",
  },
] as const;

const W = 360;
const H = 214;
const CELL_X = (i: number) => 92 + i * 38;
const M_X = 34;
const M_Y = 104;
const M_W = 30;
const M_H = 26;
const P_X = 196;
const BAR = 108;

function prob(count: number, alpha: number) {
  return (count + alpha) / (ROW_A_TOTAL + alpha * VOCAB.length);
}

function fmt(value: number) {
  if (value === 0) return "0";
  if (value === 0.5) return "1/2";
  return value.toFixed(1);
}

export default function TransitionCountViz() {
  return (
    <SceneShell
      eyebrow="Transition count"
      title="ABACA에서 P(B|A)가 만들어지는 순서"
      description="위 칸은 sequence, 왼쪽 표는 앞 event(행)에서 뒤 event(열)로 간 횟수, 오른쪽 막대는 A 행을 확률로 바꾼 값입니다. 본문의 ABACA 예시를 그대로 씁니다."
      ariaLabel="ABACA의 인접 pair를 세어 A에서 B로 가는 전이 확률을 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focusA = active >= 1;
        const alpha = scene.alpha;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {SEQ.map((event, i) => {
              const startsA = focusA && event === "A" && i < SEQ.length - 1;
              return (
                <g key={i}>
                  <rect x={CELL_X(i)} y={8} width={30} height={28} rx={4} fill={startsA ? ACCENT : "none"} fillOpacity={startsA ? 0.14 : 0} stroke={startsA ? ACCENT : MUTED} strokeWidth={1} />
                  <text x={CELL_X(i) + 15} y={27} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{event}</text>
                  <text x={CELL_X(i) + 15} y={48} textAnchor="middle" fontSize={10} fill={SUB}>j={i + 1}</text>
                </g>
              );
            })}
            {PAIRS.map((pair, k) => {
              const on = !focusA || pair.from === "A";
              const x1 = CELL_X(k) + 15;
              const x2 = CELL_X(k + 1) + 15;
              const y = 58 + (k % 2) * 10;
              return (
                <g key={pair.j} opacity={on ? 1 : 0.3}>
                  <path d={`M${x1} ${y - 4} V${y} H${x2} V${y - 4}`} fill="none" stroke={on && focusA ? ACCENT : SUB} strokeWidth={1} />
                  <text x={(x1 + x2) / 2} y={y + 11} textAnchor="middle" fontSize={10} fill={on && focusA ? ACCENT : SUB}>{pair.from}{pair.to}</text>
                </g>
              );
            })}

            <text x={M_X - 8} y={M_Y - 8} fontSize={10} fill={SUB}>앞＼뒤</text>
            {VOCAB.map((to, c) => (
              <text key={`h-${to}`} x={M_X + 24 + c * M_W + M_W / 2} y={M_Y - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{to}</text>
            ))}
            {VOCAB.map((from, r) => (
              <g key={`r-${from}`} opacity={focusA && r > 0 ? 0.35 : 1}>
                <text x={M_X + 8} y={M_Y + r * M_H + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">{from}</text>
                {COUNTS[r].map((count, c) => {
                  const hit = count > 0;
                  const rowA = focusA && r === 0;
                  return (
                    <g key={`${from}-${c}`}>
                      <rect x={M_X + 24 + c * M_W} y={M_Y + r * M_H} width={M_W} height={M_H} fill={hit ? ACCENT : "none"} fillOpacity={hit ? 0.12 : 0} stroke={rowA ? ACCENT : MUTED} strokeWidth={1} />
                      <text x={M_X + 24 + c * M_W + M_W / 2} y={M_Y + r * M_H + 17} textAnchor="middle" fontSize={11} fontWeight={hit ? 700 : 400} fill={hit ? "currentColor" : SUB}>{count}</text>
                    </g>
                  );
                })}
              </g>
            ))}
            <text x={M_X} y={M_Y + 3 * M_H + 16} fontSize={10} fill={focusA ? ACCENT : SUB}>
              {focusA ? `A 행 합 N_A• = ${ROW_A_TOTAL}` : "칸 합계 = pair 4개"}
            </text>

            <text x={P_X} y={M_Y - 8} fontSize={10} fill={SUB}>{alpha === null ? "A 행 → 확률 (다음 장면)" : `P(뒤 | A), α = ${alpha}`}</text>
            {VOCAB.map((to, c) => {
              const value = alpha === null ? null : prob(ROW_A[c], alpha);
              const y = M_Y + c * M_H;
              return (
                <g key={`p-${to}`}>
                  <text x={P_X} y={y + 17} fontSize={11} fill="currentColor">A→{to}</text>
                  <rect x={P_X + 30} y={y + 7} width={BAR} height={12} fill="none" stroke={MUTED} strokeWidth={1} />
                  {value !== null && value > 0 && <rect x={P_X + 30} y={y + 7} width={BAR * value} height={12} fill={ACCENT} fillOpacity={0.55} />}
                  <text x={P_X + 30 + BAR + 4} y={y + 17} fontSize={11} fontWeight={700} fill={value === 0 ? "#dc2626" : "currentColor"}>{value === null ? "" : fmt(value)}</text>
                </g>
              );
            })}
            <text x={P_X} y={M_Y + 3 * M_H + 16} fontSize={10} fill={SUB}>
              {alpha === null ? "" : alpha === 0 ? "분모 = N_A• = 2" : "분모 = 2 + 1×3 = 5"}
            </text>
          </svg>
        );
      }}
    />
  );
}
