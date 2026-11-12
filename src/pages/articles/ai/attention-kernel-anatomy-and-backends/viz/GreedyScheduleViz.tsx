import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scheduling (15절) — 동일 작업자 셋, 누적량이 가장 작은 작업자에게 배정.
 * 오름차순 1,2,3 → 각자 하나, 4는 누적 1인 작업자 뒤 → 종료 5.
 * 내림차순 4,3,2 → 각자 하나, 1은 누적 2인 작업자 뒤 → 종료 4.
 */
type Job = { worker: number; start: number; length: number };
type Scene = { label: string; summary: string; note: string; jobs: readonly Job[]; queue: readonly number[]; end: number | null };

const SCENES: readonly Scene[] = [
  {
    label: "오름차순 · 앞의 셋",
    summary: "1, 2, 3을 한 명씩",
    note: "길이 1, 2, 3을 차례로 배정하면 세 작업자가 하나씩 맡습니다. 누적량은 1, 2, 3이고 길이 4가 남았습니다.",
    jobs: [
      { worker: 0, start: 0, length: 1 },
      { worker: 1, start: 0, length: 2 },
      { worker: 2, start: 0, length: 3 },
    ],
    queue: [4],
    end: null,
  },
  {
    label: "오름차순 · 마지막 4",
    summary: "1 뒤에 4 → 종료 5",
    note: "누적량이 가장 작은 작업자는 1을 맡은 작업자입니다. 가장 긴 4가 마지막에 그 뒤로 붙어 모든 일이 시각 5에 끝납니다.",
    jobs: [
      { worker: 0, start: 0, length: 1 },
      { worker: 1, start: 0, length: 2 },
      { worker: 2, start: 0, length: 3 },
      { worker: 0, start: 1, length: 4 },
    ],
    queue: [],
    end: 5,
  },
  {
    label: "내림차순 · 앞의 셋",
    summary: "4, 3, 2를 한 명씩",
    note: "긴 일부터 주면 4, 3, 2를 세 작업자가 하나씩 맡습니다. 남은 것은 가장 짧은 1입니다.",
    jobs: [
      { worker: 0, start: 0, length: 4 },
      { worker: 1, start: 0, length: 3 },
      { worker: 2, start: 0, length: 2 },
    ],
    queue: [1],
    end: null,
  },
  {
    label: "내림차순 · 마지막 1",
    summary: "2 뒤에 1 → 종료 4",
    note: "누적량 2인 작업자 뒤에 1을 붙이면 3에 끝납니다. 가장 늦은 작업자는 4를 맡은 쪽이라 종료시각은 4입니다. 이상적인 배정 모형이며 실제 SM 번호를 고르는 과정이 아닙니다.",
    jobs: [
      { worker: 0, start: 0, length: 4 },
      { worker: 1, start: 0, length: 3 },
      { worker: 2, start: 0, length: 2 },
      { worker: 2, start: 2, length: 1 },
    ],
    queue: [],
    end: 4,
  },
];

const X0 = 64;
const UNIT = 40;
const ROW_Y = [22, 60, 98] as const;
const H = 28;

export default function GreedyScheduleViz() {
  return (
    <SceneShell
      eyebrow="긴 일감부터 놓기"
      title="같은 네 일감도 놓는 순서에 따라 종료시각이 5와 4로 갈립니다"
      description="가정한 동일 작업자 세 명입니다. 가로는 시간, 막대 안 숫자는 일의 길이입니다. 새 일은 지금까지 누적량이 가장 작은 작업자에게 갑니다."
      ariaLabel="오름차순과 내림차순 배정의 종료시각 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const last = scene.jobs.length === 4 ? 3 : -1;
        return (
          <svg viewBox="0 0 300 168" className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2, 3, 4, 5].map((t) => (
              <g key={t}>
                <line x1={X0 + t * UNIT} y1={16} x2={X0 + t * UNIT} y2={132} stroke="#94a3b8" strokeWidth={1} opacity={0.3} />
                <text x={X0 + t * UNIT} y={146} textAnchor="middle" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
            {ROW_Y.map((y, w) => (
              <text key={w} x={X0 - 8} y={y + 18} textAnchor="end" fontSize={11} fill="#64748b">작업자 {w + 1}</text>
            ))}
            {scene.jobs.map((job, i) => (
              <g key={i}>
                <rect
                  x={X0 + job.start * UNIT + 1}
                  y={ROW_Y[job.worker]}
                  width={job.length * UNIT - 2}
                  height={H}
                  rx={3}
                  fill={i === last ? "#fde68a" : "#bfdbfe"}
                  stroke={i === last ? "#d97706" : "#2563eb"}
                  strokeWidth={1}
                />
                <text x={X0 + (job.start + job.length / 2) * UNIT} y={ROW_Y[job.worker] + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1e293b">{job.length}</text>
              </g>
            ))}
            {scene.end !== null && (
              <>
                <line x1={X0 + scene.end * UNIT} y1={12} x2={X0 + scene.end * UNIT} y2={134} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="3 3" />
                <text x={X0 + scene.end * UNIT} y={162} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">종료 {scene.end}</text>
              </>
            )}
            {scene.queue.length > 0 && (
              <text x={X0} y={162} fontSize={11} fill="#64748b">남은 일: {scene.queue.join(", ")}</text>
            )}
          </svg>
        );
      }}
    />
  );
}
