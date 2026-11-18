import SceneShell from "./SceneShell";

/**
 * 본문 대응: #liquidation-peg-tools — PSM은 승인된 stablecoin과 DAI를 정해진 fee로 직접 바꿔
 * 시장 가격이 1달러에서 벗어날 때 차익 거래가 들어올 통로가 된다. 그래도 발행사 위험,
 * debt ceiling, pause, fee, 실제 liquidity가 남는다.
 * 시장가 1.01·0.99달러와 fee 0·2%는 가정. 0.98 × 1.01 = 0.9898.
 */
interface Step {
  where: string;
  what: string;
}

const FLOWS: readonly (readonly Step[])[] = [
  [
    { where: "PSM", what: "stablecoin 1개 → DAI 1개" },
    { where: "시장", what: "DAI 1개를 1.01달러에 팖" },
    { where: "손에 남은 것", what: "1.01 − 1 = 0.01달러" },
  ],
  [
    { where: "시장", what: "DAI 1개를 0.99달러에 삼" },
    { where: "PSM", what: "DAI 1개 → stablecoin 1개" },
    { where: "손에 남은 것", what: "1 − 0.99 = 0.01달러" },
  ],
  [
    { where: "PSM", what: "stablecoin 1개 → DAI 0.98개" },
    { where: "시장", what: "0.98 × 1.01 = 0.9898달러" },
    { where: "손에 남은 것", what: "0.9898 − 1 ≈ −0.01달러" },
  ],
];

const LIMITS = ["pause", "debt ceiling", "fee", "PSM에 실제로 있는 stablecoin", "stablecoin 발행사 위험"] as const;

const SCENES = [
  {
    label: "DAI가 1.01달러일 때",
    summary: "PSM에서 받고 시장에 팖",
    note: "(가정) 시장에서 DAI가 1.01달러, PSM fee가 0이면 승인된 stablecoin 1개를 PSM에 넣고 받은 DAI 1개를 시장에 팔아 0.01달러가 남습니다. 이 차이가 있는 동안 시장에 DAI를 파는 주문이 들어올 수 있습니다.",
  },
  {
    label: "DAI가 0.99달러일 때",
    summary: "시장에서 사서 PSM에 넣음",
    note: "(가정) 반대로 0.99달러면 시장에서 DAI를 사서 PSM에서 stablecoin 1개로 바꿉니다. 방향만 반대이고 같은 통로입니다.",
  },
  {
    label: "fee가 차이보다 크면",
    summary: "0.9898 < 1 · 아무도 안 들어옴",
    note: "(가정) fee가 2%면 stablecoin 1개로 DAI 0.98개만 받습니다. 1.01달러에 팔아도 0.9898달러라 손해이므로 통로가 열려 있어도 차익 거래가 들어오지 않습니다.",
  },
  {
    label: "PSM이 있어도 남는 것",
    summary: "DAI 전체가 reserve는 아님",
    note: "본문이 PSM이 있어도 남는다고 한 다섯 가지입니다. 통로가 멈추거나 한도·재고가 바닥나면 교환이 들어오지 못하고, fee와 stablecoin 발행사 위험은 통로가 열려 있어도 남습니다. PSM이 있다고 모든 DAI가 법정화폐 reserve로 바뀌는 것은 아닙니다.",
  },
] as const;

export default function PsmPathsViz() {
  return (
    <SceneShell
      eyebrow="PSM 교환 통로"
      title="DAI 가격이 1달러에서 벗어나면 PSM을 지나는 차익 거래가 생길 수 있습니다"
      description="PSM(Peg Stability Module)은 승인된 stablecoin과 DAI를 정해진 fee로 직접 바꿔 주는 module입니다. 각 장면은 번호 1→2→3 순서로 한 번의 거래를 따라갑니다."
      note="시장 가격 1.01·0.99달러, fee 0%·2%, 승인된 stablecoin 1개 = 1달러는 계산을 위한 가정이며 실제 fee와 한도는 배포 시점의 설정으로 읽습니다."
      ariaLabel="DAI 시장 가격이 1달러 위나 아래일 때 PSM을 지나는 차익 거래와 그것을 막는 조건"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LIMITS.map((limit) => (
                <div key={limit} className="flex min-h-[3rem] items-center justify-center rounded-md border border-dashed border-[#d97706] px-2 py-2 text-center text-xs font-bold leading-5 text-[#b45309]">
                  {limit}
                </div>
              ))}
            </div>
          );
        }
        const steps = FLOWS[active];
        const loss = active === 2;
        return (
          <ol className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
            {steps.map((step, index) => {
              const last = index === steps.length - 1;
              return (
                <li key={step.what} className="contents">
                  <div
                    className={`min-w-0 rounded-md border px-3 py-2 ${
                      last ? (loss ? "border-[#dc2626] bg-[#dc2626]/10" : "border-[#16a34a] bg-[#16a34a]/10") : "border-border bg-background"
                    }`}
                  >
                    <p className="text-[11px] font-bold text-muted-foreground">
                      {index + 1}. {step.where}
                    </p>
                    <p className={`mt-1 break-keep font-mono text-sm font-bold ${last ? (loss ? "text-[#dc2626]" : "text-[#16a34a]") : ""}`}>{step.what}</p>
                  </div>
                  {!last && (
                    <span aria-hidden="true" className="self-center text-center text-muted-foreground">
                      <span className="sm:hidden">↓</span>
                      <span className="hidden sm:inline">→</span>
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
