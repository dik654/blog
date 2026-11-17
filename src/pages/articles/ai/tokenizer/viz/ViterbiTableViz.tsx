import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sentencepiece "안녕" 예 + Viterbi AlgorithmBlock.
 * X = ▁ 안 녕 (n=3). 예시 vocabulary: ▁안 −4.61, 녕 −3.91, ▁안녕 −6.21 (이 셋만 있다고 가정).
 * best[0]=0, best[1]=−∞, best[2]=−4.61(back 0), best[3]=max(0−6.21, −4.61−3.91=−8.52)=−6.21(back 0).
 */
const X = [70, 153, 236, 320] as const;
const CHARS = ["▁", "안", "녕"] as const;

type Piece = { id: string; text: string; from: number; to: number; logp: number; row: number };
const PIECES: readonly Piece[] = [
  { id: "whole", text: "▁안녕", from: 0, to: 3, logp: -6.21, row: 0 },
  { id: "first", text: "▁안", from: 0, to: 2, logp: -4.61, row: 1 },
  { id: "second", text: "녕", from: 2, to: 3, logp: -3.91, row: 1 },
];

const BEST = ["0", "−∞", "−4.61", "−6.21"] as const;
const BACK = ["–", "없음", "0", "0"] as const;

const SCENES = [
  { label: "준비: best[0] = 0", summary: "빈 prefix의 점수 0", filled: 1, hot: [] as string[], lose: [] as string[], note: "위치 0~3은 글자 사이의 경계입니다. 막대 하나가 vocabulary piece 하나이고 막대 안 숫자는 log p입니다. 예시 vocabulary에는 이 세 piece만 있다고 가정합니다. 아직 아무것도 읽지 않은 위치 0의 점수는 0입니다." },
  { label: "j = 1", summary: "위치 1에서 끝나는 piece 없음 → −∞", filled: 2, hot: [], lose: [], note: "위치 1에서 끝나는 piece는 '▁' 하나뿐인데 예시 vocabulary에 없습니다. 그래서 위치 1까지를 빈틈없이 덮는 경로가 없고 best[1]은 −∞로 남습니다." },
  { label: "j = 2", summary: "0 + (−4.61) = −4.61", filled: 3, hot: ["first"], lose: [], note: "위치 2에서 끝나는 piece는 위치 0에서 시작하는 '▁안'입니다. best[0] + log p(▁안) = −4.61을 best[2]에 적고, 시작점 0을 back[2]에 기록합니다." },
  { label: "j = 3: 두 후보 비교", summary: "max(−6.21, −8.52) = −6.21", filled: 4, hot: ["whole"], lose: ["first", "second"], note: "위치 3에서 끝나는 후보는 둘입니다. 위치 0에서 '▁안녕' 한 조각이면 0 + (−6.21) = −6.21, 위치 2에서 '녕'을 붙이면 −4.61 + (−3.91) = −8.52입니다. 0에 가까운 −6.21이 크므로 best[3] = −6.21, back[3] = 0입니다. 점선 막대가 진 경로입니다." },
  { label: "거꾸로 따라가기", summary: "back[3] = 0 → [▁안녕]", filled: 4, hot: ["whole"], lose: [], note: "back[3]이 0이므로 위치 3에서 바로 위치 0으로 돌아갑니다. 거쳐 간 piece는 '▁안녕' 하나이고, 이것이 본문에서 계산한 한 조각 경로입니다." },
] as const;

export default function ViterbiTableViz() {
  return (
    <SceneShell
      eyebrow="Viterbi 표 채우기"
      title="'▁안녕'을 왼쪽부터 한 칸씩 읽으며 최고 점수만 남깁니다"
      description="best[j]는 위치 j까지를 덮는 경로 중 가장 큰 log-probability 합, back[j]는 그 경로의 마지막 piece가 시작한 위치입니다. 수치는 본문의 예시 값입니다."
      ariaLabel="Viterbi 알고리즘이 ▁안녕의 best와 back 표를 채우고 한 조각 경로를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hot: readonly string[] = scene.hot;
        const lose: readonly string[] = scene.lose;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {CHARS.map((c, i) => (
              <g key={c}>
                <rect x={X[i] + 2} y={10} width={X[i + 1] - X[i] - 4} height={24} rx={4} fill="#f1f5f9" stroke="#94a3b8" strokeWidth={1} />
                <text x={(X[i] + X[i + 1]) / 2} y={27} textAnchor="middle" fontSize={13} fill="#0f172a">{c}</text>
              </g>
            ))}
            {X.map((x, j) => (
              <g key={x}>
                <line x1={x} x2={x} y1={36} y2={132} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
                <text x={x} y={48} textAnchor="middle" fontSize={11} fill={j === scene.filled - 1 && active < 4 ? "#2563eb" : "#64748b"} fontWeight={700}>{j}</text>
              </g>
            ))}
            {PIECES.map((p) => {
              const isHot = hot.includes(p.id);
              const isLose = lose.includes(p.id);
              const stroke = isHot ? "#2563eb" : isLose ? "#b45309" : "#94a3b8";
              const y = 58 + p.row * 36;
              return (
                <g key={p.id}>
                  <rect x={X[p.from] + 3} y={y} width={X[p.to] - X[p.from] - 6} height={26} rx={4} fill={isHot ? "#dbeafe" : "#ffffff"} stroke={stroke} strokeWidth={isHot ? 1.25 : 1} strokeDasharray={isLose ? "4 3" : undefined} />
                  <text x={(X[p.from] + X[p.to]) / 2} y={y + 17} textAnchor="middle" fontSize={12} fill="#0f172a">
                    {p.text} <tspan fill="#64748b" fontFamily="ui-monospace, monospace">{p.logp.toFixed(2).replace("-", "−")}</tspan>
                  </text>
                </g>
              );
            })}
            <text x={6} y={160} fontSize={11} fill="#334155" fontWeight={700}>best</text>
            <text x={6} y={186} fontSize={11} fill="#334155" fontWeight={700}>back</text>
            {X.map((x, j) => {
              const shown = j < scene.filled;
              return (
                <g key={`cell-${x}`}>
                  <rect x={x - 34} y={144} width={68} height={24} rx={3} fill={shown ? "#ffffff" : "#f8fafc"} stroke="#cbd5e1" strokeWidth={1} />
                  <text x={x} y={160} textAnchor="middle" fontSize={12} fontFamily="ui-monospace, monospace" fill={shown ? "#0f172a" : "#cbd5e1"}>{shown ? BEST[j] : "?"}</text>
                  <text x={x} y={186} textAnchor="middle" fontSize={11} fontFamily="ui-monospace, monospace" fill={shown ? "#0f172a" : "#cbd5e1"}>{shown ? BACK[j] : "?"}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
