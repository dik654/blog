import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100문항 = 익숙한 80 + 새 조합 20. 정답 78 + 12 = 90, 오답 2 + 8 = 10.
 * 비율은 본문 숫자의 산술: 78/80 = 97.5%, 12/20 = 60%.
 */
const CELL = 15;
const STEP = 17;
const GROUP_GAP = 14;
const ROWS = 5;

const SCENES = [
  { label: "문제 100칸", summary: "익숙한 80 + 새 조합 20", mode: 0, note: "한 칸이 질문 하나입니다. 왼쪽은 규칙표에 익숙한 형태, 오른쪽은 새로운 조합입니다. 숫자는 논점을 드러내기 위한 가정입니다." },
  { label: "정답 90칸", summary: "78 + 12 = 90", mode: 1, note: "규칙실은 익숙한 질문 78개와 새 질문 12개를 맞힙니다. 점수표에는 90이라는 숫자 하나만 남습니다." },
  { label: "오답 10칸", summary: "2 + 8 = 10", mode: 2, note: "오답은 익숙한 쪽에 2개, 새 조합 쪽에 8개입니다. 정답률로는 97.5%와 60%입니다. 90이라는 숫자에는 이 실패의 모양이 보이지 않습니다." },
] as const;

function Group({ x0, count, right, mode }: { x0: number; count: number; right: number; mode: number }) {
  const cols = count / ROWS;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const correct = i < right;
        const col = Math.floor(i / ROWS);
        const row = i % ROWS;
        const fill = mode === 0 ? "#94a3b8" : correct ? "#2563eb" : "#dc2626";
        const opacity = mode === 0 ? 0.35 : mode === 1 ? (correct ? 0.75 : 0.08) : correct ? 0.12 : 0.85;
        return <rect key={i} x={x0 + col * STEP} y={26 + row * STEP} width={CELL} height={CELL} rx={2} fill={fill} fillOpacity={opacity} stroke={fill} strokeOpacity={0.4} strokeWidth={1} />;
      })}
      <text x={x0} y={18} fontSize={12} fontWeight={700} fill="#64748b">{count === 80 ? "익숙한 80" : "새 조합 20"}</text>
      {mode > 0 && (
        <text x={x0 + ((cols * STEP - 2) / 2)} y={26 + ROWS * STEP + 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={mode === 1 ? "#2563eb" : "#dc2626"}>
          {mode === 1 ? `정답 ${right}` : `오답 ${count - right}`}
        </text>
      )}
    </>
  );
}

export default function ScoreGridViz() {
  const groupB = 16 * STEP + GROUP_GAP;
  const width = groupB + 4 * STEP;
  return (
    <SceneShell
      eyebrow="100칸"
      title="같은 90점도 어느 칸을 틀렸는지는 점수에 나타나지 않습니다"
      description="규칙실이 받은 중국어 질문 100개입니다. 모두 가정한 숫자이며 실제 시험 결과가 아닙니다."
      ariaLabel="질문 100개의 정답과 오답 분포"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${width} ${26 + ROWS * STEP + 20}`} className="mx-auto h-auto w-full max-w-[580px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Group x0={0} count={80} right={78} mode={SCENES[active].mode} />
          <Group x0={groupB} count={20} right={12} mode={SCENES[active].mode} />
        </svg>
      )}
    />
  );
}
