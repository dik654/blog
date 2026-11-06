import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 경매·공매 배당 재원이 순서대로 채워질 때 3천만 원 전액 회수가 왜 보장되지 않는가.
 * 본문에 재원·선순위 금액이 없으므로 막대 길이는 설명용이고 숫자를 적지 않습니다.
 * 요건 미비 장면은 먼저 받을 권리가 없다는 점만 그리고 실제 배당 결과는 그리지 않습니다.
 */
const CLAIMS = [
  { name: "선순위 권리", start: 0, size: 40 },
  { name: "점주 보증금 3천만 원", start: 40, size: 30 },
  { name: "후순위 권리자·다른 채권자", start: 70, size: 30 },
] as const;

const SCENES = [
  { label: "받는 차례", summary: "앞줄이 먼저 채워집니다", note: "우선변제권은 경매·공매에서 후순위 권리자나 다른 채권자보다 먼저 받을 권리입니다. 그래도 점주 앞에 선순위 권리가 있을 수 있습니다." },
  { label: "재원이 넉넉할 때", summary: "점주 칸이 다 찹니다", note: "앞줄을 채우고도 점주 칸까지 재원이 닿으면 3천만 원을 다 받습니다." },
  { label: "재원이 모자랄 때", summary: "점주 칸이 일부만 찹니다", note: "요건을 모두 갖췄어도 재원이 먼저 바닥나면 칸이 다 차지 않습니다. 전액 회수 여부는 선순위 권리와 실제 배당 재원에 달려 있습니다." },
  { label: "제5조 요건이 없을 때", summary: "이 자리를 보장받지 못합니다", note: "대항력이 있다는 사실만으로 제5조가 적용되지는 않습니다. 확정일자 등 요건과 적용 범위를 갖추지 못하면 이 그림의 2번 자리를 보장받지 못합니다." },
] as const;

const POOL = [null, 82, 55, 55] as const;

export default function DividendOrderViz() {
  return (
    <SceneShell
      eyebrow="배당 순서"
      title="우선변제권이 있어도 왜 전액 회수가 확정되지 않을까요"
      description="맨 위 막대가 경매·공매로 나눌 돈(배당 재원)입니다. 아래 칸이 왼쪽부터 차례로 찹니다. 막대 길이는 설명용이며 금액이 아닙니다."
      note="한국 상가건물 임대차보호법 제5조 범위의 그림이며 3천만 원은 (가정)입니다. 개별 점포의 배당액을 계산한 것이 아닙니다."
      ariaLabel="배당 재원이 선순위 권리, 점주 보증금, 후순위 권리자 순으로 채워지는 그림"
      scenes={SCENES}
      render={(active) => {
        const pool = POOL[active];
        const noRight = active === 3;
        return (
          <div className="mx-auto w-full max-w-[600px] text-xs sm:text-sm">
            <p className="m-0 mb-1 font-semibold">{pool === null ? "배당 재원 (아직 모름)" : "배당 재원"}</p>
            <div className="relative h-6 rounded-sm border border-border">
              {pool !== null && <div className="h-full rounded-sm bg-emerald-600/30 transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${pool}%` }} />}
            </div>
            <div className="relative mt-3 space-y-3">
              {pool !== null && !noRight && <span className="absolute -top-3 bottom-0 z-10 border-l border-dashed border-emerald-700" style={{ left: `${pool}%` }} aria-hidden />}
              {CLAIMS.map((claim, index) => {
                const isTenant = index === 1;
                const blocked = noRight && index > 0;
                const filled = pool === null || blocked ? 0 : Math.max(0, Math.min(claim.size, pool - claim.start));
                return (
                  <div key={claim.name}>
                    <p className={`m-0 mb-1 ${isTenant ? "font-bold text-primary" : "text-muted-foreground"}`}>
                      <span className="font-mono">{index + 1}</span> {claim.name}
                      {blocked && isTenant ? " · 자리 보장 없음" : ""}
                    </p>
                    <div className="relative h-6">
                      <div className={`absolute inset-y-0 rounded-sm border ${blocked && isTenant ? "border-dashed border-red-600" : blocked ? "border-dashed border-muted-foreground/50" : isTenant ? "border-primary" : "border-muted-foreground/50"}`} style={{ left: `${claim.start}%`, width: `${claim.size}%` }}>
                        <div className={`h-full transition-[width] duration-300 motion-reduce:transition-none ${isTenant ? "bg-primary/40" : "bg-muted-foreground/30"}`} style={{ width: `${(filled / claim.size) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
