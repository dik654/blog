import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — D=100분, queue 10 + execution p95 60 + verify 5 = 75분,
 * retry 15 + ops 5 = 20분 → 95분, slack 5분. Candidate p95 66분이면 101분 → slack −1분.
 */
const D = 100;
const MAX = 110;

const X0 = 16;
const SPAN = 328;
const px = (m: number) => X0 + (m / MAX) * SPAN;
const BAR_Y = 46;
const BAR_H = 34;

interface Part {
  key: string;
  label: string;
  min: number;
  color: string;
}

const base = (p95: number): readonly Part[] => [
  { key: "queue", label: "queue", min: 10, color: "#64748b" },
  { key: "exec", label: "실행 p95", min: p95, color: "#7c3aed" },
  { key: "verify", label: "검증", min: 5, color: "#0f766e" },
  { key: "retry", label: "retry", min: 15, color: "#d97706" },
  { key: "ops", label: "ops", min: 5, color: "#b45309" },
];

const SCENES = [
  { label: "대기·실행·검증", summary: "10 + 60 + 5 = 75분", parts: 3, p95: 60, note: "Queue는 자원을 기다린 시간의 p95,실행 p95는 I/O와 phase 조정까지 포함한 job 실행이 100번 중 95번 안에 끝나는 시간, 검증은 독립 verifier 시간입니다. 여기까지 75분입니다." },
  { label: "retry·운영 여유까지", summary: "75 + 15 + 5 = 95분 → slack 5분", parts: 5, p95: 60, note: "한 번 이상 fallback할 retry 여유 15분과 jitter 같은 운영 여유 5분을 더 쌓습니다. Deadline 100분까지 남는 5분이 slack이고, 양수라 통과입니다." },
  { label: "candidate p95가 66분이면", summary: "101분 → slack −1분", parts: 5, p95: 66, note: "실행 p95만 6분 늘어도 쌓은 막대가 deadline을 1분 넘습니다. kernel 평균이 좋아도 release하지 않습니다. 모든 숫자는 본문의 설명용 값이며 실제 network deadline이 아닙니다." },
] as const;

export default function DeadlineSlackViz() {
  return (
    <SceneShell
      eyebrow="Deadline slack"
      title="시간 예산을 쌓아 deadline 선 안에 남는지 봅니다"
      description="가로축은 분입니다. 왼쪽부터 대기·실행·검증과 retry·운영 여유를 쌓고, 세로 선 D = 100분과의 차이(slack)를 읽습니다. 본문의 설명용 숫자를 씁니다."
      ariaLabel="queue, 실행 p95, 검증, retry, 운영 여유를 쌓아 100분 deadline과 비교한 slack"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const parts = base(scene.p95).slice(0, scene.parts);
        const starts = parts.map((_, i) => parts.slice(0, i).reduce<number>((sum, p) => sum + p.min, 0));
        const total = parts.reduce<number>((sum, p) => sum + p.min, 0);
        const slack = D - total;
        const over = slack < 0;
        return (
          <svg viewBox="0 0 360 156" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {parts.map((p, i) => {
              const x = px(starts[i]);
              const w = px(starts[i] + p.min) - x;
              const narrow = w < 34;
              return (
                <g key={p.key}>
                  <rect x={x + 0.5} y={BAR_Y} width={w - 1} height={BAR_H} rx={3} fill={p.color} fillOpacity={0.82} />
                  <text x={x + w / 2} y={BAR_Y + 15} textAnchor="middle" fontSize={narrow ? 9 : 10.5} fontWeight={700} fill="#ffffff">{p.min}</text>
                  {!narrow && <text x={x + w / 2} y={BAR_Y + 27} textAnchor="middle" fontSize={9.5} fill="#ffffff">{p.label}</text>}
                  {narrow && <text x={x + w / 2} y={BAR_Y + BAR_H + 11} textAnchor="middle" fontSize={9} fill={p.color}>{p.label}</text>}
                </g>
              );
            })}
            {!over && slack > 0 && active > 0 && (
              <rect x={px(total) + 0.5} y={BAR_Y} width={px(D) - px(total) - 1} height={BAR_H} rx={2} fill="#16a34a" fillOpacity={0.18} stroke="#16a34a" strokeWidth={1} />
            )}
            {over && (
              <rect x={px(D)} y={BAR_Y - 4} width={px(total) - px(D)} height={BAR_H + 8} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            )}
            <line x1={px(D)} x2={px(D)} y1={BAR_Y - 22} y2={BAR_Y + BAR_H + 20} stroke="#334155" strokeWidth={1.25} />
            <text x={px(D)} y={BAR_Y - 26} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#334155">D = 100</text>
            {[0, 25, 50, 75, 100].map((t) => (
              <text key={t} x={px(t)} y={BAR_Y + BAR_H + 30} textAnchor={t === 0 ? "start" : "middle"} fontSize={9} fill="#64748b">{t}</text>
            ))}
            <text x={px(MAX)} y={BAR_Y + BAR_H + 30} textAnchor="end" fontSize={9} fill="#64748b">분</text>
            <text x={180} y={148} textAnchor="middle" fontSize={11} fontWeight={700} fill={over ? "#dc2626" : active === 0 ? "#64748b" : "#16a34a"}>
              {active === 0 && "쌓은 시간 75분 · 아직 여유를 넣지 않음"}
              {active === 1 && "slack = 100 − 95 = 5분 · 통과"}
              {active === 2 && "slack = 100 − 101 = −1분 · release 안 함"}
            </text>
          </svg>
        );
      }}
    />
  );
}
