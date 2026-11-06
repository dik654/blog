import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 손실 60 = 보험 40 + 소유자 20(가정), 다음 해의 금융 전달, 방재로 30.
 * 보험료·한도·대출 조건·공사비의 크기는 본문에 없으므로 축척 있는 막대로 그리지 않는다.
 */
const SCENES = [
  { label: "60을 나눕니다", summary: "60 = 보험 40 + 소유자 20", note: "보험이 40을 지급하고 소유자가 20을 부담한다고 놓습니다(가정). 막대를 나눠도 길이는 그대로입니다. 지급이 복구를 도울 수 있지만 보험금이 손상 자체를 없애지는 않으므로 총물리 손실은 여전히 60입니다." },
  { label: "다음 해의 보험 조건", summary: "보험료↑·한도↓라면 소유자 부담↑", note: "다음 해에 보험료가 오르거나 보장 한도가 줄면 소유자의 지출과 잔여 부담이 커집니다. 얼마나 커지는지는 이 사례에 정해져 있지 않아 점선으로만 표시했습니다." },
  { label: "대출자에게 닿는 길", summary: "다시 살필 수 있습니다", note: "대출자는 담보 복구 가능성과 보험 조건을 다시 살필 수 있습니다. 손실이 보험과 대출의 조건으로 건너가는 이 경로가 기후 손실의 금융 전달입니다." },
  { label: "방재로 비율을 낮추면", summary: "300 × 10% = 30", note: "방재로 손상 비율을 20%에서 10%로 줄이면 같은 자산 300의 직접 손실은 30입니다. 다만 공사비와 유지비를 내야 하므로 30 감소가 곧 그 사업의 순편익은 아닙니다. 공사비의 크기는 정하지 않았습니다." },
] as const;

const SCALE = 100 / 60;

function Seg({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <div className={`flex h-10 min-w-0 items-center justify-center overflow-hidden whitespace-nowrap border text-xs font-bold ${className}`} style={{ width: `${value * SCALE}%` }}>
      {label}
    </div>
  );
}

function Actor({ name, text, on, dashed = false }: { name: string; text: string; on: boolean; dashed?: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-1.5 ${dashed ? "border-dashed" : ""} ${on ? "border-primary bg-primary/10" : dashed ? "border-border" : "border-border/70"}`}>
      <span className={`block text-xs font-bold leading-5 ${on ? "" : "text-muted-foreground"}`}>{name}</span>
      <span className={`block text-xs leading-5 ${on ? "" : "text-muted-foreground"}`}>{text}</span>
    </div>
  );
}

export default function LossShareViz() {
  return (
    <SceneShell
      eyebrow="손실 뒤의 돈"
      title="보험은 부담을 나누고, 방재는 손실 자체를 줄입니다"
      description="막대 전체 길이가 원래 손실 60입니다(가정). 막대 안의 점선은 줄어든 몫이고, 아래 칸의 점선은 이 사례가 크기를 정하지 않은 항목입니다."
      ariaLabel="손실 60의 배분과 다음 해의 금융 전달, 방재 효과"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="mb-1 font-mono text-xs text-muted-foreground">지역 B의 직접 자산 손실</p>
          <div className="flex w-full min-w-0">
            {active === 3 ? (
              <>
                <Seg value={30} label="남는 손실 30" className="rounded-l-md border-slate-500 bg-slate-500/15 text-foreground" />
                <Seg value={30} label="줄어든 30" className="rounded-r-md border-dashed border-border text-muted-foreground" />
              </>
            ) : (
              <>
                <Seg value={40} label="보험 지급 40" className="rounded-l-md border-blue-600 bg-blue-600/15 text-blue-800 dark:text-blue-300" />
                <Seg value={20} label="소유자 20" className="rounded-r-md border-amber-600 bg-amber-600/15 text-amber-800 dark:text-amber-300" />
              </>
            )}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <Actor name="보험" on={active === 1} text={active === 0 ? "약속된 부분 지급" : active === 1 ? "보험료↑ 또는 한도↓라면" : active === 2 ? "조건이 바뀔 수 있음" : "손상 비율과 별개"} />
            <Actor name={active === 3 ? "방재 사업" : "소유자"} on={active === 1} text={active === 1 ? "지출·잔여 부담↑ (크기 미정)" : active === 3 ? "공사비·유지비 (크기 미정)" : active === 2 ? "앞 장면의 부담이 이어짐" : "남은 20 부담"} dashed={active === 1 || active === 3} />
            <Actor name="대출자" on={active === 2} text={active === 2 ? "담보 복구 가능성·보험 조건 재검토" : active === 3 ? "이 계산에 안 들어감" : "아직 움직임 없음"} />
          </div>
        </div>
      )}
    />
  );
}
