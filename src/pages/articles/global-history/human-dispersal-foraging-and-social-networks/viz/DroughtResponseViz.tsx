import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case·#mechanism — 스무 명이 먹을 식량 100단위의 가정 사례.
 * 평소 60 + 25 + 15 = 100. 가뭄으로 가까운 몫 60 → 30(합 70, 부족 30).
 * 먼 장소 +10 → 35(합 80, 부족 20), 이웃 교환 +5 → 20(합 85, 부족 15).
 */
const PARTS: readonly { name: string; color: string; values: readonly number[] }[] = [
  { name: "가까운 채집·사냥", color: "#2563eb", values: [60, 30, 30, 30, 30, 30] },
  { name: "먼 계절 장소", color: "#0f766e", values: [25, 25, 35, 35, 35, 35] },
  { name: "이웃 집단과의 교환", color: "#7c3aed", values: [15, 15, 15, 20, 20, 20] },
];

const NEED = 100;

const SCENES = [
  { label: "평소의 세 경로", summary: "60 + 25 + 15 = 100", note: "가까운 채집과 사냥 60, 먼 계절 장소 25, 이웃 집단과의 교환 15로 스무 명이 먹을 100단위를 채운다고 가정합니다. 특정 시대의 평균이나 실제 장부가 아닙니다." },
  { label: "가뭄이 가까운 몫을 줄입니다", summary: "30 + 25 + 15 = 70 · 부족 30", note: "가뭄으로 가까운 먹이가 60에서 30으로 줄면 다른 경로가 그대로일 때 합계는 70입니다. 점선 칸이 비어 있는 30입니다." },
  { label: "장소와 시기를 바꿉니다", summary: "30 + 35 + 15 = 80 · 부족 20", note: "채집 종과 장소를 바꾸고 이동 시기를 앞당겨 먼 장소에서 10을 더 얻습니다. 먼 계절 장소 몫이 25에서 35가 됩니다." },
  { label: "이웃에게 더 받습니다", summary: "30 + 35 + 20 = 85 · 부족 15", note: "이웃 교환에서 5를 더 받아 15가 20이 됩니다. 장소와 교환을 모두 늘려도 합계는 85이고 15가 남습니다." },
  { label: "남은 15를 메우는 조합", summary: "저장물 · 섭취량 · 추가 이동", note: "남은 부족은 저장물, 섭취량 조정, 추가 이동 가운데 가능한 조합으로 처리합니다. 세 방법이 각각 몇 단위를 맡는지는 글에서 정하지 않았으므로 점선 칸을 나누지 않았습니다." },
  { label: "광역 가뭄이라면", summary: "이웃도 함께 부족", note: "가뭄이 넓은 지역을 덮으면 이웃도 같은 충격을 받아 교환망의 완충력이 떨어집니다. 이때 교환 몫(점선 테두리)을 같은 크기로 기대하기 어렵지만 얼마나 줄지는 글에 없습니다. 사회망은 위험을 없애는 보험이 아니라 위험의 장소와 시기를 바꾸는 장치입니다." },
] as const;

const W = 360;
const LEFT = 12;
const BAR_W = W - 2 * LEFT;
const BAR_Y = 30;
const BAR_H = 40;
const H = 104;
const ux = (units: number) => LEFT + (units / NEED) * BAR_W;

export default function DroughtResponseViz() {
  return (
    <SceneShell
      eyebrow="식량 100단위 (가정)"
      title="가뭄 뒤 부족분이 30에서 15로 줄어드는 순서"
      description="막대 전체 폭이 스무 명에게 필요한 100단위입니다. 색 칸은 세 경로에서 얻은 양, 점선 칸은 아직 채우지 못한 양입니다. 숫자는 설명용 가정입니다."
      ariaLabel="식량 100단위가 가뭄 뒤 70, 80, 85로 회복되고 15가 남는 과정"
      scenes={SCENES}
      render={(active) => {
        const values = PARTS.map((part) => part.values[active]);
        const starts = values.map((_, index) => values.slice(0, index).reduce<number>((sum, value) => sum + value, 0));
        const total = values.reduce<number>((sum, value) => sum + value, 0);
        const gap = NEED - total;
        const regional = active === 5;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={LEFT} y={18} fontSize={11} fill="#64748b">0</text>
              <text x={W - LEFT} y={18} textAnchor="end" fontSize={11} fill="#64748b">필요 100</text>
              {PARTS.map((part, index) => {
                const x = ux(starts[index]);
                const w = ux(starts[index] + values[index]) - x;
                const fade = regional && index === 2;
                return (
                  <g key={part.name}>
                    <rect x={x + 0.5} y={BAR_Y} width={w - 1} height={BAR_H} rx={3} fill={part.color} fillOpacity={fade ? 0 : 0.22} stroke={part.color} strokeWidth={1} strokeDasharray={fade ? "4 3" : undefined} />
                    <text x={x + w / 2} y={BAR_Y + BAR_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">{fade ? "?" : values[index]}</text>
                  </g>
                );
              })}
              {gap > 0 && (
                <g>
                  <rect x={ux(total) + 0.5} y={BAR_Y} width={ux(NEED) - ux(total) - 1} height={BAR_H} rx={3} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                  <text x={(ux(total) + ux(NEED)) / 2} y={BAR_Y + BAR_H / 2 + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">{regional ? `≥${gap}` : `−${gap}`}</text>
                </g>
              )}
              <text x={ux(total)} y={BAR_Y + BAR_H + 18} textAnchor={total >= 90 ? "end" : "middle"} fontSize={11.5} fontWeight={600} fill="currentColor">
                {regional ? "교환 몫이 줄 수 있음" : `얻은 양 ${total}`}
              </text>
            </svg>
            <ul className="min-w-0 space-y-1 text-sm">
              <li className="grid grid-cols-[0.75rem_minmax(0,1fr)_2.5rem_2.5rem] items-center gap-2 text-xs text-muted-foreground">
                <span />
                <span>경로</span>
                <span className="text-right">평소</span>
                <span className="text-right">지금</span>
              </li>
              {PARTS.map((part, index) => (
                <li key={part.name} className="grid grid-cols-[0.75rem_minmax(0,1fr)_2.5rem_2.5rem] items-center gap-2">
                  <span className="h-3 w-3 rounded-sm border" style={{ borderColor: part.color, backgroundColor: `${part.color}38` }} />
                  <span className="leading-5">{part.name}</span>
                  <span className="text-right font-mono text-muted-foreground">{part.values[0]}</span>
                  <span className={`text-right font-mono font-bold ${part.values[active] !== part.values[0] ? "text-primary" : ""}`}>{regional && index === 2 ? "?" : part.values[active]}</span>
                </li>
              ))}
              <li className="grid grid-cols-[0.75rem_minmax(0,1fr)_2.5rem_2.5rem] items-center gap-2 border-t border-border/70 pt-1">
                <span className="h-3 w-3 rounded-sm border border-dashed border-red-600" />
                <span className="leading-5">채우지 못한 양</span>
                <span className="text-right font-mono text-muted-foreground">0</span>
                <span className="text-right font-mono font-bold text-red-700 dark:text-red-400">{regional ? "≥15" : gap}</span>
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
