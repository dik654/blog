import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layout-and-order — pdfplumber가 선(또는 단어 정렬로 암시된 선)의 교차점을 셀 경계로 잡는 과정.
 * 가로선 3 × 세로선 4 = 교차점 12, 칸은 2행 × 3열 = 6. 표 내용은 글의 예에서 가져온 설명용 값이다(가정).
 */
const ACCENT = "#6366f1";
const MUTED = "#64748b";

const XS: readonly number[] = [20, 100, 190, 280];
const YS: readonly number[] = [20, 70, 120];

const WORDS: readonly { x: number; y: number; text: string }[] = [
  { x: 60, y: 49, text: "지표" },
  { x: 145, y: 49, text: "Q1" },
  { x: 235, y: 49, text: "Q2" },
  { x: 60, y: 99, text: "매출" },
  { x: 145, y: 99, text: "120" },
  { x: 235, y: 99, text: "150" },
];

const SCENES = [
  {
    label: "글자와 선의 좌표",
    summary: "단어 6 · 가로선 3 · 세로선 4",
    note: "PDF parsing이 읽어 내는 것은 문자·선·이미지의 좌표입니다. 이 선과 단어가 하나의 표를 이룬다는 판단은 그다음 단계의 일입니다.",
  },
  {
    label: "교차점을 찾는다",
    summary: "3 × 4 = 교차점 12개",
    note: "pdfplumber는 그래픽 선을 찾아 서로 만나는 지점을 표시합니다. 이 교차점이 셀 경계의 후보가 됩니다.",
  },
  {
    label: "교차점 넷이 한 칸",
    summary: "2행 × 3열 = 6칸",
    note: "네 교차점으로 둘러싸인 사각형이 셀 하나입니다. 숫자 120은 이제 2행 2열 칸 안의 값으로 잡힙니다.",
  },
  {
    label: "선이 없는 표",
    summary: "단어 정렬 → 암시된 선",
    note: "그래픽 선이 없어도 단어가 줄과 열로 정렬돼 있으면 선을 암시한다고 보고 같은 교차점 계산을 할 수 있습니다. 점선은 실제로 그려진 선이 아니라 정렬에서 추정한 선입니다.",
  },
] as const;

function Lines({ active }: { active: number }) {
  const inferred = active === 3;
  const stroke = inferred ? ACCENT : MUTED;
  const dash = inferred ? "4 3" : undefined;
  const showDots = active >= 1;
  return (
    <svg viewBox="0 0 300 140" role="img" aria-label="두 행 세 열 표의 선과 교차점" className="h-auto w-full max-w-md">
      {active === 2 && <rect x={XS[1]} y={YS[1]} width={XS[2] - XS[1]} height={YS[2] - YS[1]} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1.25} />}
      {YS.map((y) => (
        <line key={`h${y}`} x1={XS[0]} x2={XS[3]} y1={y} y2={y} stroke={stroke} strokeWidth={1} strokeDasharray={dash} />
      ))}
      {XS.map((x) => (
        <line key={`v${x}`} x1={x} x2={x} y1={YS[0]} y2={YS[2]} stroke={stroke} strokeWidth={1} strokeDasharray={dash} />
      ))}
      {WORDS.map((w) => (
        <text key={w.text} x={w.x} y={w.y} textAnchor="middle" fontSize={12} fontWeight={600} fill={MUTED}>
          {w.text}
        </text>
      ))}
      {showDots &&
        YS.flatMap((y) =>
          XS.map((x) => {
            const corner = active === 2 && (x === XS[1] || x === XS[2]) && (y === YS[1] || y === YS[2]);
            return <circle key={`${x}-${y}`} cx={x} cy={y} r={corner ? 4 : 3} fill={ACCENT} fillOpacity={active === 2 && !corner ? 0.35 : 1} />;
          }),
        )}
    </svg>
  );
}

export default function TableLinesViz() {
  return (
    <SceneShell
      eyebrow="PDF 표 영역 감지"
      title="표의 칸은 선이 만나는 점에서 나옵니다"
      description="2행 3열로 줄인 표입니다(표 내용은 예시, 가정). pdfplumber는 PDF 안의 표 영역을 감지하는 도구이며, PDF에 그려진 것과 이 도구가 계산해 얻는 것을 구분해 보세요."
      ariaLabel="선의 교차점으로 표 셀 경계를 잡는 과정"
      scenes={SCENES}
      render={(active) => <Lines active={active} />}
    />
  );
}
