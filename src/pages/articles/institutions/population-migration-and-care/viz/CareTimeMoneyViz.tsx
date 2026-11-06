import SceneShell from "./SceneShell";

/**
 * 본문 대응: mechanism 절(가정) — 하루 8시간, 돌봄 4시간 중 2시간을 시간당 1.5만원 서비스에 맡기고
 * 비워진 2시간에 시간당 2만원 유급 일을 할 수 있다고 놓는다. 수입 +4만원, 지출 −3만원, 차액 +1만원.
 * 시간을 소득으로 못 바꾸면 추가 수입 0. 요금을 그대로 낸다면 0 − 3 = −3만원(계산).
 */
const SCENES = [
  { label: "맡기기 전", summary: "돌봄 4시간 + 일할 수 있는 4시간", note: "성인의 하루 8시간에서 가족 돌봄 4시간을 빼면 밖에서 일할 수 있는 시간은 4시간입니다. 통근과 휴식은 생략했고 모든 가구에 같은 시간표를 적용할 수는 없습니다." },
  { label: "2시간 맡기기", summary: "돌봄 2시간 + 일할 수 있는 6시간", note: "돌봄 2시간이 외부 서비스로 옮겨 갑니다. 돌봄이 사라진 것이 아니라 맡는 사람이 바뀌었고, 가구의 시간표에 2시간이 비었습니다." },
  { label: "시간이 소득이 되면", summary: "+4만원 − 3만원 = +1만원", note: "비워진 2시간에 시간당 2만원을 벌면 수입이 4만원 늘고, 시간당 1.5만원인 요금으로 지출이 3만원 늡니다. 세금과 통근비는 생략했습니다." },
  { label: "시간이 소득이 안 되면", summary: "추가 수입 0만원", note: "서비스가 너무 멀거나 고용주가 근무시간을 늘려주지 않으면 4만원이 생기지 않습니다. 그래도 요금 3만원을 낸다면 차액은 −3만원입니다(계산). 시간을 비우는 일과 소득으로 바꾸는 일을 따로 확인해야 합니다." },
] as const;

function Hour({ tone, label }: { tone: "family" | "work" | "service" | "blank"; label: string }) {
  const look = {
    family: "border-[#b45309] bg-[#b45309]/20",
    work: "border-primary bg-primary/25",
    service: "border-[#64748b] bg-[#64748b]/25",
    blank: "border-dashed border-border/40 bg-transparent",
  }[tone];
  return <span className={`flex h-10 items-center justify-center rounded-sm border text-[11px] font-semibold leading-3 ${look}`}>{label}</span>;
}

function Money({ label, value, color, max = 4 }: { label: string; value: number; color: string; max?: number }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs">
      <span className="font-semibold">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(Math.abs(value) / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{value > 0 ? "+" : value < 0 ? "−" : ""}{Math.abs(value)}만원</span>
    </div>
  );
}

export default function CareTimeMoneyViz() {
  return (
    <SceneShell
      eyebrow="시간과 돈"
      title="시간을 비우는 일과 그 시간을 소득으로 바꾸는 일은 따로입니다"
      description="칸 하나가 1시간입니다. 윗줄은 가구 성인의 하루 8시간, 아랫줄은 그 시간표 밖에서 외부 서비스가 맡은 돌봄입니다. 숫자는 모두 가정입니다."
      ariaLabel="돌봄 2시간을 외부에 맡겼을 때 시간표와 가계 수입 지출의 변화"
      scenes={SCENES}
      render={(active) => {
        const moved = active >= 1;
        const earns = active === 2;
        const showMoney = active >= 2;
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold">가구 성인의 하루 8시간</p>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, hour) => {
                const family = hour < (moved ? 2 : 4);
                return <Hour key={hour} tone={family ? "family" : "work"} label={family ? "돌봄" : "일 가능"} />;
              })}
            </div>
            <p className={`mb-1 mt-3 text-xs font-bold ${moved ? "" : "invisible"}`}>외부 서비스가 맡은 돌봄</p>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: 8 }, (_, hour) => (
                <Hour key={hour} tone={moved && hour >= 2 && hour < 4 ? "service" : "blank"} label={moved && hour >= 2 && hour < 4 ? "서비스" : ""} />
              ))}
            </div>
            <div className={`mt-4 space-y-2 ${showMoney ? "" : "invisible"}`}>
              <Money label="늘어난 수입" value={earns ? 4 : 0} color="#2563eb" />
              <Money label="늘어난 지출" value={-3} color="#b45309" />
              <Money label="차액" value={earns ? 1 : -3} color="#475569" />
            </div>
          </div>
        );
      }}
    />
  );
}
