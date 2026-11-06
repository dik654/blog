import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 추가 비용이 1,550만 원을 넘으면 적자가 되지만 매출 연동 150만 원은 자동으로 없어지지 않는다.
 * 추가 비용 1,000과 2,000은 경계 양쪽을 보이려는 가정. 1,550 − 1,000 = 550, 1,550 − 2,000 = −450.
 * 막대 전체 폭 = 2,200만 원. 150은 1,550을 계산할 때 이미 뺐다.
 */
const LEFT = 1550;
const ROYALTY = 150;
const SCALE = 2200;

const SCENES = [
  { label: "추가 비용 1,000만 원(가정)", summary: "1,550 − 1,000 = +550만 원", cost: 1000, note: "매출 3천만 원은 그대로 두고 직원 급여·광고·공과금 등 추가 비용만 바꿉니다. 150만 원은 1,550만 원을 계산할 때 이미 뺐으므로 다시 빼지 않습니다." },
  { label: "추가 비용 1,550만 원", summary: "1,550 − 1,550 = 0원", cost: 1550, note: "점선이 경계입니다. 추가 비용이 이 선까지 오면 이 계산에서 점포에 남는 돈이 없습니다. 본부 지급액 계산에 쓰인 매출은 바뀌지 않았습니다." },
  { label: "추가 비용 2,000만 원(가정)", summary: "1,550 − 2,000 = −450만 원", cost: 2000, note: "이 계산은 적자가 되지만 매출 연동 약정의 150만 원은 자동으로 없어지지 않습니다. 실제 면제·유예 여부는 계약으로 확인합니다." },
] as const;

function Row({ label, width, color, value, strong = false, marker = false }: { label: string; width: number; color: string; value: string; strong?: boolean; marker?: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_5rem] sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(width / SCALE) * 100}%`, backgroundColor: color }} />
        {marker && <span className="absolute inset-y-0 border-l border-dashed" style={{ left: `${(LEFT / SCALE) * 100}%`, borderColor: "#dc2626" }} />}
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function LossThresholdViz() {
  return (
    <SceneShell
      eyebrow="적자의 경계"
      title="점포가 적자로 넘어가도 본부 지급액 줄은 그대로입니다"
      description="단위는 만 원이고 네 줄이 같은 축척이며 세로 점선이 1,550입니다. 3절의 사례(가정)에 추가 비용만 바꿔 넣었습니다. 본부 지급액 150은 1,550에서 이미 뺐으므로 결과에서 다시 빼지 않습니다."
      ariaLabel="추가 비용에 따라 달라지는 점포 계산 결과와 그대로인 본부 지급액"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const result = LEFT - scene.cost;
        return (
          <div className="min-w-0 space-y-3">
            <Row label="추가 비용 전" width={LEFT} color="#16a34a" value="1,550" marker />
            <Row label="추가 비용" width={scene.cost} color="#d97706" value={scene.cost.toLocaleString("en-US")} marker />
            <Row label={result < 0 ? "점포 결과: 적자" : "점포 결과"} width={Math.abs(result)} color={result < 0 ? "#dc2626" : "#2563eb"} value={result === 0 ? "0" : `${result > 0 ? "+" : "−"}${Math.abs(result)}`} strong />
            <Row label="본부 지급액" width={ROYALTY} color="#64748b" value="150" strong />
          </div>
        );
      }}
    />
  );
}
