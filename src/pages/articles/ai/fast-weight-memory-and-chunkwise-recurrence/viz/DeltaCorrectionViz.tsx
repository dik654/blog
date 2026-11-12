import SceneShell from "./SceneShell";
import { MemoryGrid, type CellTone } from "./MemoryGrid";

/**
 * 본문 대응: #picture — 목표 (5,0)과 현재 읽기 (2,1.8)의 차이 (3,−1.8)을 k₁=(1,0) 방향, 즉 열1에만 더한다.
 * M=[[2,0],[1.8,2.4]] → [[5,0],[0,2.4]]. 이후 Mk₁=(5,0), Mk₂는 (1.2,3) → (3,1.92).
 */
type Line = { label: string; value: string; tone: "muted" | "accent" | "warn" | "ok" };
type Scene = {
  label: string;
  summary: string;
  note: string;
  cells: readonly (readonly string[])[];
  tones: readonly (readonly CellTone[])[];
  readCols: readonly number[];
  lines: readonly Line[];
};

const BEFORE: readonly (readonly string[])[] = [["2", "0"], ["1.8", "2.4"]];
const AFTER: readonly (readonly string[])[] = [["5", "0"], ["0", "2.4"]];
const AFTER_TONES: readonly (readonly CellTone[])[] = [["changed", "empty"], ["changed", "second"]];
const BEFORE_TONES: readonly (readonly CellTone[])[] = [["first", "empty"], ["second", "second"]];

const SCENES: readonly Scene[] = [
  {
    label: "현재 읽기와 목표의 차이",
    summary: "(5,0) − (2,1.8) = (3,−1.8)",
    note: "k₁로 읽은 현재 값은 열1인 (2,1.8)입니다. 새 목표 (5,0)에서 이것을 빼면 고쳐야 할 양, 오차 (3,−1.8)이 나옵니다.",
    cells: BEFORE,
    tones: BEFORE_TONES,
    readCols: [0],
    lines: [
      { label: "목표", value: "(5, 0)", tone: "accent" },
      { label: "현재 읽기", value: "(2, 1.8)", tone: "muted" },
      { label: "오차", value: "(3, −1.8)", tone: "warn" },
    ],
  },
  {
    label: "오차를 k₁ 방향에 쓰기",
    summary: "열1만 바뀜",
    note: "오차 (3,−1.8)과 주소 (1,0)을 곱하면 열1에만 숫자가 생깁니다. 2+3=5, 1.8−1.8=0이 되고 열2의 0과 2.4는 그대로입니다.",
    cells: AFTER,
    tones: AFTER_TONES,
    readCols: [0],
    lines: [
      { label: "열1 · 행1", value: "2 + 3 = 5", tone: "ok" },
      { label: "열1 · 행2", value: "1.8 − 1.8 = 0", tone: "ok" },
      { label: "열2", value: "그대로", tone: "muted" },
    ],
  },
  {
    label: "k₁로 다시 읽기",
    summary: "Mk₁ = (5, 0)",
    note: "고친 행렬을 주소 (1,0)으로 읽으면 열1 그대로 (5,0)이 나옵니다. 수정 요청에는 정확히 답합니다.",
    cells: AFTER,
    tones: AFTER_TONES,
    readCols: [0],
    lines: [
      { label: "k₁ 읽기", value: "(5, 0)", tone: "ok" },
      { label: "목표", value: "(5, 0)", tone: "accent" },
      { label: "", value: "", tone: "muted" },
    ],
  },
  {
    label: "k₂의 읽기도 바뀜",
    summary: "(1.2, 3) → (3, 1.92)",
    note: "k₂=(0.6,0.8)로 읽으면 행1은 5×0.6=3, 행2는 0×0.6+2.4×0.8=1.92입니다. 열1을 고친 영향이 겹침 0.6을 통해 두 번째 읽기에도 들어갔습니다.",
    cells: AFTER,
    tones: AFTER_TONES,
    readCols: [0, 1],
    lines: [
      { label: "수정 전", value: "(1.2, 3)", tone: "muted" },
      { label: "수정 후", value: "(3, 1.92)", tone: "warn" },
      { label: "", value: "", tone: "muted" },
    ],
  },
];

const LINE_FILL: Record<Line["tone"], string> = {
  muted: "#64748b",
  accent: "#2563eb",
  warn: "#d97706",
  ok: "#16a34a",
};

export default function DeltaCorrectionViz() {
  return (
    <SceneShell
      eyebrow="차이만 다시 쓰기"
      title="오차를 첫 주소 방향에 쓰면 열1만 바뀝니다"
      description="오른쪽은 3절의 기억 M(칸 = 값의 숫자 × 주소의 숫자)입니다. 왼쪽은 그 장면에서 계산한 값입니다. 숫자는 본문의 설명용 가정입니다."
      ariaLabel="목표와 현재 읽기의 차이를 첫 열에 더하고 두 주소로 다시 읽는 과정"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            {s.lines.map((line, i) => (
              <g key={i}>
                <text x={12} y={58 + i * 34} fontSize={12} fill="#64748b">{line.label}</text>
                <text x={12} y={74 + i * 34} fontSize={15} fontWeight={700} fill={LINE_FILL[line.tone]} fontFamily="ui-monospace, monospace">{line.value}</text>
              </g>
            ))}
            <text x={210} y={24} fontSize={12} fill="#64748b">기억 M</text>
            <MemoryGrid x={210} y={52} cells={s.cells} tones={s.tones} readCols={s.readCols} />
            <text x={210} y={160} fontSize={12} fill="#64748b">{s.readCols.length === 2 ? "0.6×열1+0.8×열2" : "k₁ 읽기 = 열1"}</text>
          </svg>
        );
      }}
    />
  );
}
