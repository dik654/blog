import SceneShell from "./SceneShell";

/**
 * 본문 대응: #huffman — 가로 = 빈도, 세로 = 경로 길이. 칸 하나가 이진 선택 한 번입니다.
 * Huffman 길이 [1,2,3,4,4] → 8+8+6+4+4 = 30, 30/16 = 1.875.
 * 균형 비교 길이 [2,2,2,3,3] → 16+8+4+3+3 = 34, 34/16 = 2.125.
 * 차이 34 − 30 = 4 = 8 − 2 − 1 − 1.
 */
const WORDS = ["문장 끝", "red", "cat", "saw", "dog"];
const FREQ = [8, 4, 2, 1, 1];
const HUFFMAN = [1, 2, 3, 4, 4];
const BALANCED = [2, 2, 2, 3, 3];
const CELL_W = 20;
const CELL_H = 13;
const X0 = 20;

const SCENES = [
  { label: "Huffman 나무", summary: "30칸 ÷ 16 = 1.875", note: "칸 하나가 이진 선택 한 번입니다. 이 비용 모형에서 문장 끝은 8번 요청되고 길이가 1이라 8칸, dog는 1번에 길이 4라 4칸입니다. 전체 30칸을 정답 횟수 16으로 나누면 한 번당 1.875번입니다." },
  { label: "균형 비교 나무", summary: "34칸 ÷ 16 = 2.125", note: "높은 세 빈도에 길이 2, 낮은 두 빈도에 길이 3을 배정한 나무입니다. 길이의 차이는 작아 보여도 넓은 문장 끝 기둥이 두 칸 높이가 되면서 전체 칸이 34개로 늘어납니다." },
  { label: "어느 칸이 다른가", summary: "−8 +2 +1 +1 → 4칸 절약", note: "주황 칸이 상대 나무보다 더 쓰는 칸입니다. Huffman은 cat, saw, dog에서 2+1+1칸을 더 쓰고 문장 끝에서 8칸을 아껴 4칸이 줄어듭니다. 평균은 줄지만 드문 saw와 dog의 길이는 3에서 4로 늘었습니다." },
] as const;

function Plot({ title, lengths, other, top, on, diff, total }: { title: string; lengths: number[]; other: number[]; top: number; on: boolean; diff: boolean; total: number }) {
  const base = top + 16 + 4 * CELL_H;
  return (
    <g opacity={on ? 1 : 0.3}>
      <text x={X0} y={top + 10} fontSize={12} fontWeight={700} fill="#64748b">{title}</text>
      <text x={X0 + 16 * CELL_W} y={top + 10} fontSize={12} fontWeight={700} textAnchor="end" fill="#2563eb">{total}칸</text>
      {FREQ.map((freq, w) => {
        const start = FREQ.slice(0, w).reduce((sum, value) => sum + value, 0);
        const cells = [];
        for (let c = 0; c < freq; c++) {
          for (let h = 0; h < lengths[w]; h++) {
            const extra = diff && h >= other[w];
            cells.push(
              <rect key={`${c}-${h}`} x={X0 + (start + c) * CELL_W + 0.5} y={base - (h + 1) * CELL_H + 0.5} width={CELL_W - 1} height={CELL_H - 1} fill={extra ? "#d97706" : w % 2 === 0 ? "#64748b" : "#94a3b8"} />,
            );
          }
        }
        return (
          <g key={WORDS[w]}>
            {cells}
            <text x={X0 + (start + freq / 2) * CELL_W} y={base + (w === 4 ? 25 : 13)} textAnchor="middle" fontSize={11} fill="#64748b">{WORDS[w]}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function PathCostAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 세는 계산량"
      title="자주 맞히는 단어의 길을 줄이면 전체 칸 수가 줄어듭니다"
      description="가로 칸 수가 정답 횟수(가정한 빈도), 세로 칸 수가 경로 길이입니다. 그래서 칸 하나가 이진 선택 한 번이고 전체 칸 수가 총 선택 수입니다."
      note="이 빈도 비율로 정답을 요청하고 내부 선택 비용을 같게 센 비용 모형입니다. 실제 C는 문장 끝을 중심 정답으로 학습하지 않으므로 8을 실제 문장 끝 예측 횟수로 읽지 않습니다."
      ariaLabel="Huffman 나무와 균형 비교 나무의 총 선택 수를 칸으로 비교하는 장면"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 216" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Plot title="Huffman 길이 [1,2,3,4,4]" lengths={HUFFMAN} other={BALANCED} top={0} on={active !== 1} diff={active === 2} total={30} />
          <Plot title="균형 길이 [2,2,2,3,3]" lengths={BALANCED} other={HUFFMAN} top={110} on={active !== 0} diff={active === 2} total={34} />
        </svg>
      )}
    />
  );
}
