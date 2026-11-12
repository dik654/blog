import SceneShell from "./SceneShell";

/**
 * 본문 대응: what-moves-it 절 — 전력은 토큰당 원가의 5~15%, 가동률은 분모에 그대로 들어간다.
 * 60% 가동의 토큰당 원가를 100으로 둔 지수다.
 * 전기요금 절반: 5% 몫 → 97.5, 15% 몫 → 92.5. 가동률 60→40: 100 × 0.6/0.4 = 150.
 */
const POWER_COLOR = "#d97706";
const REST_COLOR = "#64748b";
const SCALE = 160;

const SHARES = [5, 15] as const;

const SCENES = [
  {
    label: "원가를 쪼개 보면",
    summary: "전력 5~15 · 나머지 85~95",
    power: 1,
    util: 1,
    note: "60퍼센트 가동의 토큰당 원가를 100으로 놓았습니다. 전력 몫은 본문 범위의 양 끝인 5와 15로 두 줄을 그렸고, 나머지에 하드웨어 상각 60~75와 상면·네트워크·운영이 들어갑니다.",
  },
  {
    label: "전기요금이 절반인 지역이면",
    summary: "100 → 97.5 ~ 92.5",
    power: 0.5,
    util: 1,
    note: "주황 몫만 반으로 줄어 2.5~7.5만 빠집니다. 전기요금이 두 배 차이 나는 두 지역을 비싼 쪽을 기준으로 견준 계산입니다(가정). 전체로는 한 자릿수 퍼센트입니다.",
  },
  {
    label: "가동률이 60에서 40으로 떨어지면",
    summary: "100 → 150",
    power: 1,
    util: 1.5,
    note: "가동률은 앞의 식에서 분모에 들어가므로 막대 전체가 1.5배로 늘어납니다. 고정비가 가동률과 무관하다는 앞 식의 가정을 그대로 썼습니다. 늘어난 50은 어떤 전기요금 차이보다 큽니다.",
  },
] as const;

export default function CostLeverViz() {
  return (
    <SceneShell
      eyebrow="같은 원가 막대에 두 손잡이"
      title="전기요금은 한 조각을, 가동률은 막대 전체를 움직입니다"
      description="막대 하나가 토큰당 원가이고 60퍼센트 가동일 때를 100으로 둔 지수입니다. 주황은 전력, 회색은 상각·상면·네트워크·운영입니다. 점선이 처음의 100입니다."
      ariaLabel="전력 몫과 가동률이 토큰당 원가 지수를 얼마나 움직이는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: POWER_COLOR }} />전력</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: REST_COLOR }} />상각·상면·네트워크·운영</span>
            </div>
            <div className="space-y-4">
              {SHARES.map((share) => {
                const power = share * scene.power * scene.util;
                const rest = (100 - share) * scene.util;
                const total = power + rest;
                return (
                  <div key={share}>
                    <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm">
                      <span className="text-muted-foreground">전력 몫 {share}%인 경우</span>
                      <span className="shrink-0 font-mono font-bold">{Number(total.toFixed(1))}</span>
                    </div>
                    <div className="relative mt-1 h-6 min-w-0 rounded-sm bg-muted/40">
                      <div className="flex h-full overflow-hidden rounded-sm">
                        <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(rest / SCALE) * 100}%`, backgroundColor: REST_COLOR }} />
                        <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(power / SCALE) * 100}%`, backgroundColor: POWER_COLOR }} />
                      </div>
                      <div className="absolute -top-1 -bottom-1 border-l border-dashed" style={{ left: `${(100 / SCALE) * 100}%`, borderColor: "#94a3b8" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="relative mt-2 h-4 font-mono text-[11px] text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute -translate-x-1/2" style={{ left: `${(100 / SCALE) * 100}%` }}>100</span>
              <span className="absolute right-0">160</span>
            </div>
          </div>
        );
      }}
    />
  );
}
