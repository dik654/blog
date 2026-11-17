import SceneShell from "./SceneShell";

/**
 * 본문 대응: #submission-state — S = t_close − t_now − (T_q + T_gen + T_submit + T_conf + R).
 * 칸 수는 모두 설명용 가정이다. 남은 시간 12칸.
 * 장면 2: 1 + 4 + 1 + 2 + 2 = 10 → S = 12 − 10 = +2.
 * 장면 3: 생성만 7칸 → 1 + 7 + 1 + 2 + 2 = 13 → S = 12 − 13 = −1 → release 불가.
 * 구간은 겹치지 않는다고 두고 이었다(가정). 겹치는 단계는 critical path로 보정해야 한다.
 */
const WINDOW = 12;
const AXIS = 14;
const W = 400;
const H = 176;
const LEFT = 20;
const UNIT = (W - 2 * LEFT) / AXIS;
const BAR_Y = 70;
const BAR_H = 34;

const PARTS: readonly { key: string; name: string; color: string }[] = [
  { key: "q", name: "T_q 대기", color: "#94a3b8" },
  { key: "gen", name: "T_gen 생성", color: "#2563eb" },
  { key: "sub", name: "T_submit 제출", color: "#0d9488" },
  { key: "conf", name: "T_conf 확인", color: "#7c3aed" },
  { key: "R", name: "R 예비", color: "#d97706" },
];

const SCENES = [
  {
    label: "남은 시간",
    summary: "t_close − t_now = 12칸(가정)",
    sizes: null,
    note: "Deadline slack S는 마감까지 남은 시간에서 끝내는 데 드는 시간을 뺀 여유입니다. 먼저 admission 시점(t_now)부터 deadline close(t_close)까지를 12칸으로 둡니다(가정).",
  },
  {
    label: "다섯 구간 빼기",
    summary: "12 − (1+4+1+2+2) = +2",
    sizes: [1, 4, 1, 2, 2],
    note: "대기, proof 생성, message 제출, confidence 확인, retry·reorg 예비(R)를 이어 붙이면 10칸이고 close 앞에 2칸이 남습니다. S > 0이라 시간 조건은 통과하지만 verifier 성공과 inclusion은 따로 확인합니다.",
  },
  {
    label: "생성이 길어지면",
    summary: "12 − (1+7+1+2+2) = −1",
    sizes: [1, 7, 1, 2, 2],
    note: "생성만 7칸으로 늘면(가정) 합이 13칸이 되어 close를 1칸 넘습니다. S ≤ 0이면 proof가 valid해도 이 deadline job은 release할 수 없습니다.",
  },
] as const;

const x = (units: number) => LEFT + units * UNIT;

export default function DeadlineSlackViz() {
  return (
    <SceneShell
      eyebrow="deadline slack"
      title="남은 시간에서 끝내는 데 드는 시간을 빼면 여유가 남는지 보입니다"
      description="칸 수는 모두 설명용 가정이며 측정값이 아닙니다. 구간은 겹치지 않는다고 두고 이었습니다(가정). 실제로 겹치는 단계는 단순 합 대신 critical-path wall time으로 보정합니다."
      ariaLabel="deadline까지 남은 시간에서 대기, 생성, 제출, 확인, 예비 시간을 빼 slack을 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sizes: readonly number[] = scene.sizes ?? [];
        const starts = sizes.reduce<number[]>((acc, size, index) => [...acc, (acc[index] ?? 0) + size], [0]);
        const total = starts[starts.length - 1] ?? 0;
        const slack = WINDOW - total;
        const shown = sizes.length > 0;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <rect x={x(0)} y={BAR_Y} width={WINDOW * UNIT} height={BAR_H} rx={4} fill="none" stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: AXIS + 1 }, (_, tick) => (
                <line key={tick} x1={x(tick)} x2={x(tick)} y1={BAR_Y + BAR_H + 4} y2={BAR_Y + BAR_H + 9} stroke="#94a3b8" strokeWidth={1} />
              ))}
              <line x1={x(0)} x2={x(0)} y1={BAR_Y - 22} y2={BAR_Y + BAR_H + 12} stroke="#475569" strokeWidth={1} />
              <text x={x(0)} y={BAR_Y - 28} fontSize={12} fontWeight={700} fill="#475569">t_now</text>
              <line x1={x(WINDOW)} x2={x(WINDOW)} y1={BAR_Y - 22} y2={BAR_Y + BAR_H + 12} stroke="#dc2626" strokeWidth={1.25} />
              <text x={x(WINDOW)} y={BAR_Y - 28} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">t_close</text>
              {sizes.map((size, index) => (
                <g key={PARTS[index].key}>
                  <rect x={x(starts[index]) + 1} y={BAR_Y + 3} width={size * UNIT - 2} height={BAR_H - 6} rx={3} fill={PARTS[index].color} />
                  <text x={x(starts[index] + size / 2)} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">
                    {PARTS[index].key}
                  </text>
                </g>
              ))}
              {shown && slack > 0 && (
                <g>
                  <rect x={x(total) + 1} y={BAR_Y + 3} width={slack * UNIT - 2} height={BAR_H - 6} rx={3} fill="none" stroke="#16a34a" strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={x(total + slack / 2)} y={BAR_Y + BAR_H + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill="#16a34a">S = +{slack}</text>
                </g>
              )}
              {shown && slack <= 0 && (
                <g>
                  <rect x={x(WINDOW) + 1} y={BAR_Y + 1} width={-slack * UNIT - 2} height={BAR_H - 2} rx={3} fill="none" stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                  <text x={W - 4} y={BAR_Y + BAR_H + 30} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">S = {slack} · release 불가</text>
                </g>
              )}
              {!shown && (
                <text x={x(WINDOW / 2)} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle" fontSize={12} fill="#64748b">남은 시간 12칸(가정)</text>
              )}
              <text x={x(0)} y={H - 10} fontSize={11} fill="#64748b">눈금 한 칸 = 같은 시간 단위(가정)</text>
            </svg>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {PARTS.map((part, index) => (
                <li key={part.key} className="flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: part.color }} aria-hidden="true" />
                  <span>
                    <b className="font-mono text-foreground">{part.key}</b> {part.name}
                    {` ${shown ? sizes[index] : "?"}칸`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
