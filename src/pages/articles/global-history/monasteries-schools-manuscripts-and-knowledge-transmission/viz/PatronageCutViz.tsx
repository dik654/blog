import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case 2문단·#mechanism 1문단 — 운영 자원 100의 가정 장부.
 * 45 + 20 + 15 + 15 + 5 = 100. 후원 70이면 숙식 45를 지킨 뒤 25가 남고 나머지 계획은 55.
 * 필사 15·여행 5를 없애면 계획 80, 여전히 10 초과. 건물 수리를 미뤄야(최소 10) 70 안에 든다.
 */
const PARTS = [
  { key: "live", name: "식사와 거처", value: 45, color: "#2563eb" },
  { key: "teach", name: "수업과 토론", value: 20, color: "#0f766e" },
  { key: "copy", name: "필사 재료와 작업", value: 15, color: "#7c3aed" },
  { key: "build", name: "건물·보관", value: 15, color: "#b45309" },
  { key: "travel", name: "여행자와 번역", value: 5, color: "#be185d" },
] as const;

type Key = (typeof PARTS)[number]["key"];

const SCENES = [
  { label: "평소 장부", summary: "45 + 20 + 15 + 15 + 5 = 100", budget: 100, cut: [] as readonly Key[], defer: false, note: "학습 공동체의 운영 자원 100을 다섯 칸에 나눈다고 가정합니다. 어느 기관의 실제 예산이 아니며, 어느 칸도 지식 내용 자체와 같지 않습니다." },
  { label: "후원이 70으로 줄어듭니다", summary: "70 − 45 = 25 · 나머지 계획 55", budget: 70, cut: [] as readonly Key[], defer: false, note: "후원이 30 줄었는데 숙식 45를 유지하면 남는 것은 25입니다. 수업·필사·건물·여행의 계획 55가 세로선 밖으로 30만큼 넘칩니다." },
  { label: "필사와 여행을 없앱니다", summary: "45 + 20 + 15 = 80 · 아직 10 초과", budget: 70, cut: ["copy", "travel"] as readonly Key[], defer: false, note: "필사 15와 여행 5를 없애도 계획은 80이라 10이 더 모자랍니다." },
  { label: "건물 수리까지 미룹니다", summary: "80 − 70 = 10 이상 미룸", budget: 70, cut: ["copy", "travel"] as readonly Key[], defer: true, note: "건물 수리까지 미루면 지역 안 수업은 잠시 유지할 수 있습니다. 70 안에 들려면 건물·보관에서 최소 10을 미뤄야 한다는 것은 계산이고, 실제로 얼마를 미루는지는 글에 없어 넘친 부분만 점선으로 표시했습니다." },
  { label: "지금과 다음 세대의 결과", summary: "수업은 이어지고, 사본은 줄 수 있음", budget: 70, cut: ["copy", "travel"] as readonly Key[], defer: true, note: "같은 30의 감소가 지금의 수업과 다음 세대의 전승을 다르게 흔듭니다. 수치는 실제 기관 예산이 아닙니다." },
] as const;

const W = 360;
const LEFT = 12;
const BAR_W = W - 2 * LEFT;
const BAR_Y = 30;
const BAR_H = 38;
const H = 100;
const ux = (units: number) => LEFT + (units / 100) * BAR_W;

const EFFECTS = [
  { when: "지금", text: "숙식 45·수업 20 유지 → 지역 안 수업은 잠시 이어짐" },
  { when: "다음 세대", text: "필사·여행 0 → 다음 세대에 남을 사본이 줄 수 있고, 새 문헌 유입과 사본 분산이 막힘" },
  { when: "위험", text: "수리 미룸 → 습기·화재로 자료 훼손 위험이 커짐" },
] as const;

export default function PatronageCutViz() {
  return (
    <SceneShell
      eyebrow="운영 자원 100 (가정)"
      title="후원이 30 줄 때 어느 칸부터 비는가"
      description="막대 전체 폭이 원래 장부 100입니다. 세로선은 들어오는 후원, 선 밖으로 나간 부분은 돈이 모자란 계획입니다. 숫자는 설명용 가정입니다."
      ariaLabel="운영 자원 100이 70으로 줄 때 숙식을 지키고 필사·여행을 없앤 뒤 건물 수리를 미루는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const kept = PARTS.filter((part) => !scene.cut.includes(part.key));
        const starts = kept.map((_, index) => kept.slice(0, index).reduce<number>((sum, part) => sum + part.value, 0));
        const planned = kept.reduce<number>((sum, part) => sum + part.value, 0);
        const over = planned - scene.budget;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={16} fontSize={11} fill="#64748b">0</text>
              <text x={ux(100)} y={16} textAnchor="end" fontSize={11} fill="#64748b">100</text>
              {kept.map((part, index) => {
                const x = ux(starts[index]);
                const w = ux(starts[index] + part.value) - x;
                const deferred = scene.defer && part.key === "build";
                const solidW = deferred ? ux(scene.budget) - x : w;
                return (
                  <g key={part.key}>
                    <rect x={x + 0.5} y={BAR_Y} width={solidW - 1} height={BAR_H} rx={3} fill={part.color} fillOpacity={0.22} stroke={part.color} strokeWidth={1} />
                    {deferred && (
                      <>
                        <rect x={ux(scene.budget) + 0.5} y={BAR_Y} width={ux(planned) - ux(scene.budget) - 1} height={BAR_H} rx={3} fill="none" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                        <text x={(ux(scene.budget) + ux(planned)) / 2} y={BAR_Y + BAR_H / 2 + 5} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#dc2626">미룸</text>
                      </>
                    )}
                    {!deferred && (
                      <text x={x + w / 2} y={BAR_Y + BAR_H / 2 + 5} textAnchor="middle" fontSize={12.5} fontWeight={700} fill="currentColor">{part.value}</text>
                    )}
                  </g>
                );
              })}
              {scene.cut.length > 0 && (
                <text x={ux(planned) + 6} y={BAR_Y + BAR_H / 2 + 5} fontSize={11} fill="#7c3aed">필사·여행 0</text>
              )}
              <line x1={ux(scene.budget)} x2={ux(scene.budget)} y1={BAR_Y - 8} y2={BAR_Y + BAR_H + 8} stroke="currentColor" strokeWidth={1.25} />
              <text x={ux(scene.budget)} y={BAR_Y + BAR_H + 22} textAnchor={scene.budget === 100 ? "end" : "middle"} fontSize={11.5} fontWeight={700} fill="currentColor">후원 {scene.budget}</text>
              {over > 0 && !scene.defer && (
                <text x={ux(100)} y={BAR_Y + BAR_H + 22} textAnchor="end" fontSize={11.5} fontWeight={700} fill="#dc2626">{over} 초과</text>
              )}
            </svg>
            <StableBody active={active} />
          </div>
        );
      }}
    />
  );
}

function StableBody({ active }: { active: number }) {
  const scene = SCENES[active];
  if (active === SCENES.length - 1) {
    return (
      <ul className="min-w-0 space-y-1.5 text-sm">
        {EFFECTS.map((effect) => (
          <li key={effect.text} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-2 leading-5">
            <span className={`font-bold ${effect.when === "지금" ? "text-primary" : effect.when === "위험" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"}`}>{effect.when}</span>
            <span>{effect.text}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="min-w-0 space-y-1 text-sm">
      {PARTS.map((part) => {
        const cut = scene.cut.includes(part.key);
        const deferred = scene.defer && part.key === "build";
        return (
          <li key={part.key} className="grid grid-cols-[0.75rem_minmax(0,1fr)_4.75rem] items-center gap-2">
            <span className="h-3 w-3 rounded-sm border" style={{ borderColor: part.color, backgroundColor: `${part.color}38` }} />
            <span className={`leading-5 ${cut ? "text-muted-foreground line-through" : ""}`}>{part.name}</span>
            <span className={`text-right font-mono font-bold ${cut || deferred ? "text-red-700 dark:text-red-400" : ""}`}>{cut ? "0" : deferred ? "≥10 미룸" : part.value}</span>
          </li>
        );
      })}
    </ul>
  );
}
