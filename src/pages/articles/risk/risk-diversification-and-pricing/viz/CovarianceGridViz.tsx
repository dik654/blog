import StackedSceneShell from "./StackedSceneShell";

/**
 * 본문 대응: many-assets — N개로 넓힌 식의 항을 N×N 칸으로 센다.
 * 모든 자산 표준편차 30%(분산 900), 상관 0.3(공분산 270)으로 둔 가정.
 * 대각선 몫 = N × (1/N²) × 900 = 900/N, 나머지 몫 = N(N−1) × (1/N²) × 270 = 270(N−1)/N.
 * N=2: 450+135=585 → 24.2%, N=5: 180+216=396 → 19.9%, N=20: 45+256.5=301.5 → 17.4%, N→∞: 270 → 16.4%.
 */
const VAR = 900;
const COV = 0.3 * VAR;
const NS = [2, 5, 20];

const diagShare = (n: number) => VAR / n;
const offShare = (n: number) => (COV * (n - 1)) / n;
const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : v.toFixed(1));
const sdOf = (v: number) => Math.sqrt(v).toFixed(1);

const SCENES = [
  {
    label: "두 자산 · 칸 4개",
    summary: `${diagShare(2)} + ${offShare(2)} → ${sdOf(diagShare(2) + offShare(2))}%`,
    note: `두 자산이면 칸이 4개입니다. 대각선 2칸은 각자의 분산(${VAR}), 나머지 2칸은 쌍의 공분산(0.3×${VAR} = ${COV})이고 칸마다 비중 1/4이 곱해집니다. 대각선 몫 ${diagShare(2)}, 공분산 몫 ${offShare(2)}입니다.`,
  },
  {
    label: "다섯 자산 · 칸 25개",
    summary: `${diagShare(5)} + ${offShare(5)} → ${sdOf(diagShare(5) + offShare(5))}%`,
    note: `다섯이면 칸이 25개인데 대각선은 5칸뿐이고 공분산 칸이 20칸입니다. 대각선 몫은 ${VAR}÷5 = ${diagShare(5)}으로 줄고 공분산 몫은 ${offShare(5)}으로 늘어납니다.`,
  },
  {
    label: "스무 자산 · 칸 400개",
    summary: `${diagShare(20)} + ${fmt(offShare(20))} → ${sdOf(diagShare(20) + offShare(20))}%`,
    note: `스물이면 400칸 중 대각선은 20칸입니다. 대각선 몫 ${diagShare(20)}, 공분산 몫 ${fmt(offShare(20))}로 합이 ${fmt(diagShare(20) + offShare(20))}이고 표준편차는 약 ${sdOf(diagShare(20) + offShare(20))}%입니다. 본문 해석의 "약 17%"가 이 값입니다.`,
  },
  {
    label: "N을 끝없이 늘리면",
    summary: `0 + ${COV} → ${sdOf(COV)}%`,
    note: `N을 계속 늘리면 대각선 몫 ${VAR}/N은 0으로 가고 공분산 몫 ${COV}×(N−1)/N은 ${COV}에 다가갑니다. 바닥은 √${COV} ≈ ${sdOf(COV)}%이며, 평균 공분산이 양수인 한 이 아래로는 내려가지 않습니다.`,
  },
];

const DIAG = "#64748b";
const OFF = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const GRID = 140;
const GX = 8;
const GY = 26;
const BX = 172;
const BAR_W = 180;
const MAX = 600;

export default function CovarianceGridViz() {
  return (
    <StackedSceneShell
      eyebrow="N개로 넓힌 식의 칸"
      title="칸을 세면 무엇이 사라지고 무엇이 남는지 보입니다"
      description="N×N 칸 하나가 식의 항 하나입니다. 대각선은 각자의 분산, 나머지는 두 자산의 공분산이며, 균등하게 담으면 칸마다 비중 1/N²이 곱해집니다. 모든 자산의 표준편차를 30%, 상관을 0.3으로 두었습니다(가정)."
      note="막대는 분산(%의 제곱)이고, 맨 아래 줄의 표준편차는 두 몫을 더한 값의 제곱근입니다. 평균값 대신 모든 자산이 같다고 둔 단순화입니다."
      ariaLabel="자산 수에 따라 분산 칸과 공분산 칸의 개수와 몫이 바뀌는 모양"
      scenes={SCENES}
      render={(s) => {
        const limit = s === 3;
        const n = NS[Math.min(s, 2)];
        const cell = GRID / n;
        const d = limit ? 0 : diagShare(n);
        const o = limit ? COV : offShare(n);
        const sum = d + o;
        return (
          <svg viewBox="0 0 360 190" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[s].label}: ${SCENES[s].summary}`}>
            <text x={GX} y={16} fontSize={10.5} fontWeight={700} fill={MUTED}>
              {limit ? "N → ∞ (그림은 N = 20)" : `${n}×${n} = ${n * n}칸`}
            </text>
            {Array.from({ length: n * n }, (_, k) => {
              const r = Math.floor(k / n);
              const c = k % n;
              const isDiag = r === c;
              return (
                <rect
                  key={k}
                  x={GX + c * cell}
                  y={GY + r * cell}
                  width={cell}
                  height={cell}
                  fill={isDiag ? DIAG : OFF}
                  fillOpacity={isDiag ? (limit ? 0.15 : 0.55) : 0.22}
                  stroke="#ffffff"
                  strokeWidth={n > 10 ? 0.5 : 1}
                />
              );
            })}

            <rect x={BX} y={22} width={10} height={10} fill={DIAG} fillOpacity={0.55} />
            <text x={BX + 14} y={31} fontSize={10.5} fill={DIAG}>
              대각선 {limit ? "N" : n}칸 · 분산 {VAR}
            </text>
            <rect x={BX} y={40} width={10} height={10} fill={OFF} fillOpacity={0.3} />
            <text x={BX + 14} y={49} fontSize={10.5} fill={OFF}>
              나머지 {limit ? "N(N−1)" : n * (n - 1)}칸 · 공분산 {COV}
            </text>
            <text x={BX} y={67} fontSize={10.5} fill={MUTED}>
              칸마다 비중 1/{limit ? "N²" : n * n}
            </text>

            <text x={BX} y={92} fontSize={10.5} fontWeight={700} fill={DIAG}>대각선 몫 {fmt(d)}</text>
            <rect x={BX} y={97} width={(d / MAX) * BAR_W} height={12} fill={DIAG} fillOpacity={0.45} stroke={DIAG} strokeWidth={1} />
            <text x={BX} y={127} fontSize={10.5} fontWeight={700} fill={OFF}>공분산 몫 {fmt(o)}</text>
            <rect x={BX} y={132} width={(o / MAX) * BAR_W} height={12} fill={OFF} fillOpacity={0.25} stroke={OFF} strokeWidth={1} />

            <text x={BX} y={168} fontSize={11} fontWeight={700} fill={ACCENT}>
              합 {fmt(sum)} → 표준편차 {sdOf(sum)}%
            </text>
            <text x={GX} y={184} fontSize={10} fill={MUTED}>
              {limit ? "대각선 비중이 0으로 가도 나머지 칸은 남습니다" : `대각선은 ${n}칸, 나머지는 ${n * (n - 1)}칸`}
            </text>
          </svg>
        );
      }}
    />
  );
}
