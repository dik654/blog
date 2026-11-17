import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — S = t_close − t_now − (T_q + T_PC1 + T_PC2 + T_C1 + T_C2 + T_submit + T_conf + R).
 * 칸 수는 모두 설명용 가정이다. 남은 window 16칸.
 * 장면 2: 1+4+2+1+2+1+2+2 = 15 → S = 16 − 15 = +1.
 * 장면 3: PC1만 7칸 → 1+7+2+1+2+1+2+2 = 18 → S = 16 − 18 = −2 → release 불가.
 * 구간은 겹치지 않는다고 두고 이었다(가정). 겹치는 부분은 critical-path wall time으로 계산한다.
 */
const WINDOW = 16;
const AXIS = 18;
const W = 400;
const H = 176;
const LEFT = 20;
const UNIT = (W - 2 * LEFT) / AXIS;
const BAR_Y = 70;
const BAR_H = 34;

const PARTS: readonly { key: string; name: string; color: string }[] = [
  { key: "q", name: "T_q 대기", color: "#94a3b8" },
  { key: "PC1", name: "T_PC1", color: "#1d4ed8" },
  { key: "PC2", name: "T_PC2", color: "#2563eb" },
  { key: "C1", name: "T_C1", color: "#0e7490" },
  { key: "C2", name: "T_C2", color: "#0d9488" },
  { key: "sub", name: "T_submit 제출", color: "#7c3aed" },
  { key: "conf", name: "T_conf 확인", color: "#6d28d9" },
  { key: "R", name: "R 예비", color: "#d97706" },
];

const SCENES = [
  {
    label: "남은 window",
    summary: "t_close − t_now = 16칸(가정)",
    sizes: null,
    note: "Completion slack S는 seal submission이 유효한 마감까지 남은 시간에서 끝내는 데 드는 시간을 뺀 여유입니다. admission 시점(t_now)부터 protocol close(t_close)까지를 16칸으로 둡니다(가정).",
  },
  {
    label: "네 phase와 제출 빼기",
    summary: "16 − 15 = +1",
    sizes: [1, 4, 2, 1, 2, 1, 2, 2],
    note: "대기 뒤 PC1→PC2→C1→C2가 차례로 이어지고, message 제출·confidence와 retry·reorg 예비(R)가 붙습니다. 합 15칸이라 close 앞에 1칸이 남습니다.",
  },
  {
    label: "PC1이 길어지면",
    summary: "16 − 18 = −2",
    sizes: [1, 7, 2, 1, 2, 1, 2, 2],
    note: "PC1만 7칸으로 늘면(가정) 뒤의 모든 phase가 밀려 합이 18칸이 되고 close를 2칸 넘습니다. S ≤ 0이면 proof 계산이 성공해도 release할 수 있는 seal job이 아닙니다.",
  },
] as const;

const x = (units: number) => LEFT + units * UNIT;

export default function SealSlackViz() {
  return (
    <SceneShell
      eyebrow="completion slack"
      title="네 phase가 앞에서부터 이어져 마감 안에 들어오는지가 여유를 정합니다"
      description="칸 수는 모두 설명용 가정이며 측정값이 아닙니다. 고정 PC1 시간은 주장하지 않고 현 profile에서 측정합니다. 구간은 겹치지 않는다고 두고 이었습니다(가정)."
      ariaLabel="protocol window에서 대기, PC1, PC2, C1, C2, 제출, 확인, 예비 시간을 빼 completion slack을 계산하는 과정"
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
                  <text x={x(starts[index] + size / 2)} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">
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
                  <text x={x(WINDOW) - 4} y={BAR_Y + BAR_H + 30} textAnchor="end" fontSize={13} fontWeight={700} fill="#dc2626">S = {slack} · release 불가</text>
                </g>
              )}
              {!shown && (
                <text x={x(WINDOW / 2)} y={BAR_Y + BAR_H / 2 + 4} textAnchor="middle" fontSize={12} fill="#64748b">남은 window 16칸(가정)</text>
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
