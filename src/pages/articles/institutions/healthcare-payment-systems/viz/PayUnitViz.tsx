import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 같은 두 번의 진료, 지급 단위만 다를 때.
 * 건별: 2 × 10 = 20 = 환자 4 + 공동 16. 묶음: 10 그대로.
 * 비용을 진료마다 0절의 7만 원으로 두면(가정) 건별 20 − 14 = +6, 묶음 10 − 14 = −4, 한 번일 때는 둘 다 +3.
 */
const SCALE = 20;
const PATIENT = "#d97706";
const POOL = "#2563eb";
const BUNDLE = "#64748b";
const COST = "#dc2626";
const COST_TWO = 14;

const SCENES = [
  { label: "진료 한 번", summary: "건별 10 · 묶음 10", visits: 1, note: "건별 지급은 진료 한 건마다, 묶음 지급은 치료 과정 전체에 총액을 정해 주는 방식입니다. 진료가 한 번이면 두 수입은 같습니다." },
  { label: "진료 두 번 · 건별", summary: "20 = 환자 4 + 공동 16", visits: 2, note: "같은 조건의 진료를 두 번 하면 건별 수입은 20만 원입니다. 환자 몫은 2 + 2 = 4만 원, 공동 재원 지급은 8 + 8 = 16만 원입니다(가정)." },
  { label: "진료 두 번 · 묶음", summary: "10 그대로", visits: 2, note: "치료 과정 전체에 총 10만 원을 주기로 정했으므로 두 번 진료해도 수입이 20만 원으로 늘지 않습니다(가정). 묶음 안의 환자·공동 분담은 글에 없어 한 색으로 그렸습니다." },
  { label: "비용을 대 보면", summary: "건별 +6 · 묶음 −4", visits: 2, note: "진료마다 0절의 비용 7만 원이 든다고 두면(가정) 두 번의 비용은 점선 위치인 14만 원입니다. 건별은 6만 원이 남고 묶음은 4만 원 모자랍니다. 한 번일 때는 둘 다 3만 원이었습니다." },
  { label: "그래서 생기는 유인", summary: "늘릴 유인 ↔ 아낄 유인", visits: 2, note: "건별 지급은 필요한 진료를 늘릴 수 있지만 과잉 진료 유인도 있습니다. 정액 성격의 지급은 비용을 아끼게 하고, 그 과정에서 필요한 진료를 줄이거나 위험한 환자를 피할 유인이 생길 수 있습니다." },
  { label: "인두제는 세는 단위가 또 다릅니다", summary: "정해진 사람 × 돌보는 기간", visits: 2, note: "인두제는 진료 건수가 아니라 정해진 사람을 돌보는 기간에 따라 금액을 줍니다. 글에 금액이 없어 채운 막대 대신 빈 점선 칸만 두었습니다." },
] as const;

function Row({ name, unit, parts, amount, costLabel }: { name: string; unit: string; parts: readonly { value: number; color: string; label: string; dashed?: boolean }[]; amount: string; costLabel?: string | boolean }) {
  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-baseline justify-between gap-x-3 text-xs">
        <span className="min-w-0"><b>{name}</b> <span className="text-muted-foreground">단위: {unit}</span></span>
        <span className="shrink-0 font-bold tabular-nums">{amount}</span>
      </div>
      <div className="relative flex h-8 gap-0.5 rounded-sm bg-muted/40">
        {parts.map((part) => (
          <div key={part.label} className={`flex min-w-0 items-center justify-center rounded-sm border text-xs font-bold ${part.dashed ? "border-dashed" : ""}`} style={{ width: `${(part.value / SCALE) * 100}%`, borderColor: part.color, backgroundColor: part.dashed ? "transparent" : `${part.color}2e` }}>
            {part.label}
          </div>
        ))}
        {costLabel && <div className="absolute -inset-y-1 w-0 border-l border-dashed" style={{ left: `${(COST_TWO / SCALE) * 100}%`, borderColor: COST }} />}
        {typeof costLabel === "string" && <span className="absolute right-[31%] top-1.5 text-xs font-bold" style={{ color: COST }}>{costLabel}</span>}
      </div>
    </div>
  );
}

export default function PayUnitViz() {
  return (
    <SceneShell
      eyebrow="지급 단위"
      title="같은 두 번의 진료가 지급 단위에 따라 다른 수입이 됩니다"
      description="막대 전체 폭이 20만 원이고 모든 줄의 눈금이 같습니다. 금액은 사례의 가정입니다."
      ariaLabel="건별 지급과 묶음 지급에서 진료 횟수에 따른 병원 수입 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const two = scene.visits === 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className={`flex items-center gap-2 text-xs font-semibold ${active === 5 ? "hidden" : ""}`}>
              <span>진료 횟수</span>
              {[1, 2].map((visit) => (
                <span key={visit} className={`rounded-md border px-2 py-1 ${visit <= scene.visits ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground/50"}`}>{visit}번째</span>
              ))}
            </div>
            <Row
              name="건별 지급"
              unit="진료 건"
              amount={active === 3 ? "20 − 14 = +6만" : active === 4 ? "늘리면 수입도 늘어남" : `${two ? 20 : 10}만 원`}
              costLabel={active === 3}
              parts={two ? [{ value: 4, color: PATIENT, label: "환자 4" }, { value: 16, color: POOL, label: active === 3 ? "공동 16" : "공동 재원 16" }] : [{ value: 2, color: PATIENT, label: "2" }, { value: 8, color: POOL, label: "공동 8" }]}
            />
            <Row
              name="묶음 지급"
              unit="치료 과정"
              amount={active === 3 ? "10 − 14 = −4만" : active === 4 ? "늘려도 수입 그대로" : "10만 원"}
              costLabel={active === 3 ? "비용 14" : false}
              parts={[{ value: 10, color: BUNDLE, label: "총 10" }]}
            />
            {active === 5 && (
              <Row name="인두제" unit="정해진 사람·기간" amount="" parts={[{ value: 20, color: BUNDLE, label: "글에 금액 없음", dashed: true }]} />
            )}
          </div>
        );
      }}
    />
  );
}
