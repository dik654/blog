import SceneShell from "./SceneShell";

/**
 * 본문 대응: #functional-vs-semantic — BERTScore 는 token 마다 상대 문장에서 가장 가까운 token 하나를 골라
 * 그 유사도를 평균한다. 정답 쪽 행에서 고르면 recall, 생성 쪽 열에서 고르면 precision 이다.
 * 유사도 값과 token 은 모두 설명용 가정이다.
 * 행 최댓값 0.92·0.88·0.66 → R = 2.46 / 3 = 0.82
 * 열 최댓값 0.92·0.30·0.88·0.66 → P = 2.76 / 4 = 0.69
 * F1 = 2 × 0.69 × 0.82 / (0.69 + 0.82) ≈ 0.75
 */
const REF: readonly string[] = ["고양이", "매트", "앉았다"];
const CAND: readonly string[] = ["고양이", "가", "매트에", "누웠다"];
const SIM: readonly (readonly number[])[] = [
  [0.92, 0.3, 0.25, 0.2],
  [0.28, 0.22, 0.88, 0.18],
  [0.2, 0.15, 0.24, 0.66],
];

const ROW_MAX = SIM.map((row) => Math.max(...row));
const COL_MAX = CAND.map((_, j) => Math.max(...SIM.map((row) => row[j])));
const RECALL = ROW_MAX.reduce<number>((sum, v) => sum + v, 0) / REF.length;
const PRECISION = COL_MAX.reduce<number>((sum, v) => sum + v, 0) / CAND.length;
const F1 = (2 * PRECISION * RECALL) / (PRECISION + RECALL);

const SCENES = [
  {
    label: "유사도 표",
    summary: "정답 3 token × 생성 4 token",
    note: "각 token 을 문맥까지 반영한 벡터(contextual embedding)로 바꾸고, 두 벡터가 같은 방향일수록 1 에 가까운 코사인 유사도를 칸마다 적었습니다. 칸의 숫자는 설명을 위해 정한 값입니다(가정).",
  },
  {
    label: "Recall: 행마다 최댓값",
    summary: `(0.92 + 0.88 + 0.66) ÷ 3 = ${RECALL.toFixed(2)}`,
    note: "정답 token 하나마다 생성 문장에서 가장 비슷한 token 하나만 고릅니다(greedy). 고른 값을 정답 token 수 3 으로 나눠 평균하면 recall 입니다. 정답 내용이 생성 문장에 얼마나 담겼는지를 봅니다.",
  },
  {
    label: "Precision: 열마다 최댓값",
    summary: `(0.92 + 0.30 + 0.88 + 0.66) ÷ 4 = ${PRECISION.toFixed(2)}`,
    note: "방향을 바꿔 생성 token 하나마다 정답 문장에서 가장 비슷한 token 을 고르고 생성 token 수 4 로 나눕니다. 정답에 짝이 없는 '가' 는 최댓값이 0.30 에 그쳐 precision 을 끌어내립니다.",
  },
  {
    label: "F1: 조화평균",
    summary: `2 × ${PRECISION.toFixed(2)} × ${RECALL.toFixed(2)} ÷ (${PRECISION.toFixed(2)} + ${RECALL.toFixed(2)}) ≈ ${F1.toFixed(2)}`,
    note: "조화평균은 두 값 중 작은 쪽에 더 끌립니다. 산술평균이면 0.755 지만 F1 은 약 0.749 로 조금 낮고, 한쪽만 높아서는 F1 이 크게 오르지 않습니다.",
  },
] as const;

function cellState(active: number, i: number, j: number) {
  const v = SIM[i][j];
  const rowPick = v === ROW_MAX[i];
  const colPick = v === COL_MAX[j];
  if (active === 1) return rowPick ? "row" : "dim";
  if (active === 2) return colPick ? "col" : "dim";
  if (active === 3) return rowPick && colPick ? "both" : rowPick ? "row" : colPick ? "col" : "dim";
  return "plain";
}

const CELL_CLASS: Record<string, string> = {
  plain: "border-border text-foreground",
  dim: "border-border/60 text-muted-foreground/60",
  row: "border-[#2563eb] bg-[#2563eb]/10 font-bold text-[#1d4ed8] dark:text-[#93c5fd]",
  col: "border-[#d97706] bg-[#d97706]/10 font-bold text-[#b45309] dark:text-[#fcd34d]",
  both: "border-[#7c3aed] bg-[#7c3aed]/10 font-bold text-[#6d28d9] dark:text-[#c4b5fd]",
};

function ScoreBar({ label, value, shown, color }: { label: string; value: number; shown: boolean; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className={shown ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: shown ? `${value * 100}%` : 0, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{shown ? value.toFixed(2) : "–"}</span>
    </div>
  );
}

export default function BertScoreMatchViz() {
  return (
    <SceneShell
      eyebrow="BERTScore greedy matching"
      title="BERTScore 는 행에서 한 번, 열에서 한 번 최댓값을 고릅니다"
      description="행은 정답(reference) token, 열은 생성(candidate) token 입니다. 파란 칸은 recall 이 고른 값, 주황 칸은 precision 이 고른 값, 보라 칸은 양쪽이 모두 고른 값입니다. token 과 유사도는 모두 가정입니다."
      ariaLabel="정답 3 token 과 생성 4 token 의 코사인 유사도 표에서 recall, precision, F1 을 차례로 계산"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[3.75rem_repeat(4,minmax(0,1fr))_3rem] gap-1 text-center text-xs sm:grid-cols-[5rem_repeat(4,minmax(0,1fr))_4rem] sm:text-sm">
            <span className="self-end text-left text-[10px] text-muted-foreground sm:text-xs">정답＼생성</span>
            {CAND.map((tok) => (
              <span key={tok} className="self-end truncate font-semibold">{tok}</span>
            ))}
            <span className="self-end text-[10px] text-muted-foreground sm:text-xs">행 최댓값</span>
            {REF.map((tok, i) => (
              <div key={tok} className="contents">
                <span className="self-center truncate text-left font-semibold">{tok}</span>
                {CAND.map((c, j) => (
                  <span key={c} className={`rounded-sm border py-1.5 font-mono ${CELL_CLASS[cellState(active, i, j)]}`}>
                    {SIM[i][j].toFixed(2)}
                  </span>
                ))}
                <span className={`self-center font-mono ${active === 1 || active === 3 ? "font-bold text-[#1d4ed8] dark:text-[#93c5fd]" : "text-muted-foreground/50"}`}>
                  {active === 1 || active === 3 ? ROW_MAX[i].toFixed(2) : "–"}
                </span>
              </div>
            ))}
            <span className="text-left text-[10px] text-muted-foreground sm:text-xs">열 최댓값</span>
            {CAND.map((c, j) => (
              <span key={c} className={`font-mono ${active >= 2 ? "font-bold text-[#b45309] dark:text-[#fcd34d]" : "text-muted-foreground/50"}`}>
                {active >= 2 ? COL_MAX[j].toFixed(2) : "–"}
              </span>
            ))}
            <span />
          </div>
          <div className="mt-4 space-y-2">
            <ScoreBar label="Recall R" value={RECALL} shown={active === 1 || active === 3} color="#2563eb" />
            <ScoreBar label="Precision P" value={PRECISION} shown={active >= 2} color="#d97706" />
            <ScoreBar label="F1" value={F1} shown={active === 3} color="#7c3aed" />
          </div>
        </div>
      )}
    />
  );
}
