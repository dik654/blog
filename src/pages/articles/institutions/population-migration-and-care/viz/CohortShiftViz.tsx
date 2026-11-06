import SceneShell from "./SceneShell";

/**
 * 본문 대응: source 절 — 코호트 요인법. 나이 칸을 한 해씩 옮기고 출생과 이동을 더한다.
 * 이 글에는 상세 나이가 없으므로 칸에 인원을 적지 않고 칸 크기도 같게 둔다.
 * 전입 3·전출 2·출생 2는 A 마을(가정), 순이동 3 − 2 = +1.
 */
const SCENES = [
  { label: "나이 칸", summary: "총수가 아니라 나이별 인구에서 출발", note: "총인구에 일정한 증가율을 계속 곱하는 데서 끝나지 않고, 나이를 나눈 현재 인구를 놓고 시작합니다. 원문은 성별도 나눕니다." },
  { label: "한 칸 옆으로", summary: "살아남은 10세 → 11세", note: "현재 10세인 집단 가운데 다음 해까지 살아남은 사람이 11세 집단으로 옮깁니다. 다른 나이도 같은 방식으로 한 칸씩 움직입니다." },
  { label: "출생", summary: "새로 태어난 2명 → 새 나이 집단", note: "A 마을에서 새로 태어난 2명은 새 나이 집단에 들어갑니다." },
  { label: "마을의 이동", summary: "전입 3명 · 전출 2명 → 각자의 나이", note: "전입과 전출은 각자의 나이 위치에 반영됩니다. 이 글에는 그 상세 나이가 없어 어느 칸인지 표시하지 않았고, 다음 해 학생 수도 지어내지 않습니다." },
  { label: "UN의 이동", summary: "순이동 3 − 2 = +1명만 나눠 넣는 셈", note: "UN은 나라 사이의 이동을 전입과 전출로 따로 세지 않고 순국제이동으로 추정합니다. 앞 장면의 전입·전출 구분은 마을 사례를 설명하기 위한 것입니다." },
] as const;

const W = 360;
const LABELS = ["새 집단", "…", "10세", "11세", "12세", "…"];
const CELL_W = 52;
const GAP = 7;
const LEFT = (W - LABELS.length * CELL_W - (LABELS.length - 1) * GAP) / 2;
const cx = (i: number) => LEFT + i * (CELL_W + GAP) + CELL_W / 2;
const CELL_TOP = 60;
const CELL_H = 42;
/** 특정 칸을 가리키지 않도록 이동 화살표를 나이 칸 전체에 고르게 둡니다. */
const SPAN = [1, 2, 3, 4, 5];

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 5;
  const a = `${x2 - size * Math.cos(angle - 0.5)},${y2 - size * Math.sin(angle - 0.5)}`;
  const b = `${x2 - size * Math.cos(angle + 0.5)},${y2 - size * Math.sin(angle + 0.5)}`;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "3 3" : undefined} />
      <polygon points={`${x2},${y2} ${a} ${b}`} fill={color} />
    </g>
  );
}

export default function CohortShiftViz() {
  return (
    <SceneShell
      eyebrow="나이 집단을 앞으로"
      title="나이 칸을 한 해씩 옮기고 출생과 이동을 더합니다"
      description="칸 하나가 같은 나이의 집단입니다. 칸 크기는 인원을 나타내지 않습니다. 이 글에는 상세 나이가 없어 칸에 인원을 적지 않았습니다."
      note="출생 2명, 전입 3명, 전출 2명은 A 마을의 가정입니다. 실제 방법론은 UN WPP2024 기준이며 이 그림은 출발점만 옮겼습니다."
      ariaLabel="나이 집단이 한 해씩 이동하고 출생과 이동이 더해지는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 160`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {LABELS.map((label, i) => {
            const highlight = (active === 1 && (i === 2 || i === 3)) || (active === 2 && i === 0);
            const gap = label === "…";
            return (
              <g key={i}>
                <rect
                  x={cx(i) - CELL_W / 2}
                  y={CELL_TOP}
                  width={CELL_W}
                  height={CELL_H}
                  rx={4}
                  fill={highlight ? "#2563eb" : "#94a3b8"}
                  opacity={highlight ? 0.25 : gap ? 0 : 0.15}
                  stroke="none"
                />
                {!gap && <rect x={cx(i) - CELL_W / 2} y={CELL_TOP} width={CELL_W} height={CELL_H} rx={4} fill="none" stroke={highlight ? "#2563eb" : "#94a3b8"} strokeWidth={1} />}
                <text x={cx(i)} y={CELL_TOP + 26} textAnchor="middle" fontSize={12} fontWeight={700} fill={highlight ? "#2563eb" : "#64748b"}>{label}</text>
              </g>
            );
          })}
          {active === 1 && (
            <>
              <path d={`M ${cx(2)} ${CELL_TOP} Q ${(cx(2) + cx(3)) / 2} ${CELL_TOP - 30} ${cx(3)} ${CELL_TOP - 3}`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <polygon points={`${cx(3)},${CELL_TOP - 1} ${cx(3) - 6},${CELL_TOP - 8} ${cx(3) + 2},${CELL_TOP - 9}`} fill="#2563eb" />
              <text x={(cx(2) + cx(3)) / 2} y={CELL_TOP - 24} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">살아남은 사람</text>
              <Arrow x1={cx(2)} y1={CELL_TOP + CELL_H + 2} x2={cx(2)} y2={CELL_TOP + CELL_H + 30} color="#b45309" dashed />
              <text x={cx(2)} y={CELL_TOP + CELL_H + 44} textAnchor="middle" fontSize={11} fill="#b45309">사망</text>
            </>
          )}
          {active === 2 && (
            <>
              <Arrow x1={cx(0)} y1={16} x2={cx(0)} y2={CELL_TOP - 3} color="#2563eb" />
              <text x={cx(0) + 8} y={22} fontSize={11} fontWeight={700} fill="#2563eb">출생 2명</text>
            </>
          )}
          {active === 3 && (
            <>
              <rect x={cx(1) - CELL_W / 2} y={18} width={cx(5) - cx(1) + CELL_W} height={20} rx={3} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
              <text x={(cx(1) + cx(5)) / 2} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">전입 3명: 어느 나이인지 이 글에 없음</text>
              {SPAN.map((i) => <Arrow key={i} x1={cx(i)} y1={39} x2={cx(i)} y2={CELL_TOP - 3} color="#2563eb" dashed />)}
              {SPAN.map((i) => <Arrow key={i} x1={cx(i)} y1={CELL_TOP + CELL_H + 3} x2={cx(i)} y2={CELL_TOP + CELL_H + 24} color="#b45309" dashed />)}
              <rect x={cx(1) - CELL_W / 2} y={CELL_TOP + CELL_H + 25} width={cx(5) - cx(1) + CELL_W} height={20} rx={3} fill="none" stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
              <text x={(cx(1) + cx(5)) / 2} y={CELL_TOP + CELL_H + 39} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">전출 2명: 어느 나이인지 이 글에 없음</text>
            </>
          )}
          {active === 4 && (
            <>
              <rect x={cx(1) - CELL_W / 2} y={18} width={cx(5) - cx(1) + CELL_W} height={20} rx={3} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
              <text x={(cx(1) + cx(5)) / 2} y={32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">순이동 +1명을 나이별로 나누어 넣음</text>
              {SPAN.map((i) => <Arrow key={i} x1={cx(i)} y1={39} x2={cx(i)} y2={CELL_TOP - 3} color="#2563eb" dashed />)}
            </>
          )}
        </svg>
      )}
    />
  );
}
