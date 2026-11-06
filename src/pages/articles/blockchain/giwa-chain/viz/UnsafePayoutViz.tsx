import SceneShell from "./SceneShell";

/**
 * 본문 대응: #application-boundary 반례 — unsafe deposit T를 보고 다른 지급망에서 출금해 준 뒤
 * L1 reorg로 T가 사라졌다고 가정한다. GIWA balance는 되돌아가도 외부 지급은 자동으로 돌아오지 않는다.
 * 금액은 본문에 없어 그리지 않는다.
 */
const SCENES = [
  { label: "T가 unsafe에서 보입니다", summary: "반례(가정) · 입금 T는 unsafe", tx: "보임 · unsafe", balance: "입금 반영", external: "아직 없음", externalState: "none", note: "화면 표시처럼 되돌릴 수 있는 일이라면 여기서 써도 됩니다. 앱이 무엇을 더 하느냐가 문제입니다." },
  { label: "앱이 바로 지급합니다", summary: "외부 효과 실행", tx: "보임 · unsafe", balance: "입금 반영", external: "다른 지급망에서 출금", externalState: "paid", note: "App이 unsafe deposit T를 본 즉시 다른 지급망에서 출금해 줍니다. 이제 GIWA 밖에 결과가 생겼습니다." },
  { label: "L1 reorg로 T가 사라집니다", summary: "(가정) · 한쪽만 되돌아감", tx: "사라짐", balance: "되돌아감", external: "그대로 나가 있음", externalState: "stuck", note: "GIWA 안의 balance는 되돌아가도 이미 나간 외부 지급은 자동으로 돌아오지 않습니다." },
  { label: "그래서 필요한 장치", summary: "head policy · effect ID · 보상 절차", tx: "보임 · unsafe", balance: "입금 반영", external: "지급 보류", externalState: "held", note: "앱 정책이 safe나 finalized를 요구하면 T가 unsafe에 머무는 동안 지급은 보류됩니다. Effect ID는 같은 효과의 중복 실행을 막고, 이미 나간 지급에는 보상 절차가 따로 필요합니다." },
] as const;

const EXTERNAL_STYLE = {
  none: "border-border/60 text-muted-foreground",
  paid: "border-amber-600 font-bold text-amber-700 dark:text-amber-400",
  stuck: "border-red-600 font-bold text-red-700 dark:text-red-400",
  held: "border-primary font-bold text-primary",
} as const;

function Cell({ title, value, className }: { title: string; value: string; className: string }) {
  return (
    <div className={`min-w-0 rounded border bg-background p-2 ${className}`}>
      <span className="block text-xs font-normal text-muted-foreground">{title}</span>
      <span className="mt-1 block break-keep text-sm">{value}</span>
    </div>
  );
}

export default function UnsafePayoutViz() {
  return (
    <SceneShell
      eyebrow="반례 · 되돌아가지 않는 쪽"
      title="GIWA 안은 되돌아가도 밖으로 나간 지급은 자동으로 돌아오지 않습니다"
      description="세로줄 왼쪽은 GIWA 안, 오른쪽은 GIWA 밖입니다. 외부 효과는 chain 밖에 남는 결과이고, effect ID는 그 효과에 붙인 식별자입니다."
      ariaLabel="unsafe 입금을 보고 외부 지급한 뒤 reorg가 일어날 때 GIWA 안과 밖의 상태"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_minmax(0,1.1fr)] items-stretch gap-1.5 sm:gap-2">
            <Cell title="거래 T" value={scene.tx} className={scene.externalState === "stuck" ? "border-red-600" : "border-border/70"} />
            <Cell title="GIWA balance" value={scene.balance} className="border-border/70" />
            <span aria-hidden="true" className="self-center text-muted-foreground">|</span>
            <Cell title="외부 지급" value={scene.external} className={EXTERNAL_STYLE[scene.externalState]} />
          </div>
        );
      }}
    />
  );
}
