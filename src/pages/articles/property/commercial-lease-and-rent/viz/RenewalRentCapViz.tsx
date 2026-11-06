import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — 시행령 제4조의 100분의 5. 200만 × 1.05 = 210만, 3천만 × 1.05 = 3천150만.
 * 환산보증금이 기준을 넘는 서울 10억 사례(1억 + 900만 × 100)는 이 상한이 적용되지 않는다.
 * 각 줄의 회색 막대는 그 줄의 청구 당시 금액을 같은 길이로 맞춘 것입니다.
 */
const SCENES = [
  { label: "월세", summary: "200만 × 1.05 = 210만 원", note: "청구 당시 월세의 100분의 5인 10만 원이 한 번에 청구할 수 있는 증액 상한입니다." },
  { label: "보증금", summary: "3천만 × 1.05 = 3천150만 원", note: "같은 비율이라 보증금에서는 150만 원입니다. 막대에서 5%의 길이는 월세 줄과 똑같습니다." },
  { label: "기준을 넘을 때", summary: "10억 > 서울 9억 → 5% 미적용", note: "서울 보증금 1억 원, 월세 900만 원(가정)이면 환산보증금 10억 원으로 기준을 넘습니다. 갱신요구권은 있어도 이 5% 상한은 적용되지 않습니다. 증액을 어떻게 정할지는 계약과 함께, 이 경우에도 적용되는 제10조의2부터의 조문을 따로 확인합니다." },
] as const;

function Row({ label, from, to, on, open = false }: { label: string; from: string; to: string; on: boolean; open?: boolean }) {
  return (
    <div className={on ? "" : "opacity-40"}>
      <p className="m-0 mb-1 flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">{label}</span>
        <span className="font-mono">{from} → {to}</span>
      </p>
      <div className="flex h-6 items-stretch">
        <div className="w-[80%] rounded-l-sm border border-border bg-muted/70" />
        {open ? (
          <div className="flex w-[20%] items-center border-y border-r border-dashed border-red-600 pl-1 text-xs font-bold text-red-700 dark:text-red-400">미적용</div>
        ) : (
          <div className="flex w-[20%] items-stretch">
            <div className="w-[20%] border-y border-primary bg-primary/40" />
            <div className="ml-1 flex items-center text-xs font-bold text-primary">5%</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RenewalRentCapViz() {
  return (
    <SceneShell
      eyebrow="증액 상한"
      title="갱신할 때 얼마까지 올릴 수 있을까요"
      description="회색 막대가 청구 당시 금액이고 진한 끝부분이 올릴 수 있는 5%입니다. 줄마다 회색 길이를 같게 맞췄으며 금액을 서로 비교하는 축은 아닙니다."
      note="2026-10-09 확인한 한국의 현행 법·시행령 기준입니다. 금액은 이 글의 (가정)이고 개별 계약의 증액을 판정한 것이 아닙니다."
      ariaLabel="월세와 보증금의 5퍼센트 증액 상한과 환산보증금이 기준을 넘는 경우의 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[560px] space-y-3">
          <Row label="월세 (환산보증금 2억3천만, 기준 안)" from="200만" to="최대 210만" on={active === 0} />
          <Row label="보증금 (같은 계약)" from="3천만" to="최대 3천150만" on={active === 1} />
          <Row label="월세 (서울 환산보증금 10억, 기준 초과)" from="900만" to="5% 상한 미적용" on={active === 2} open />
        </div>
      )}
    />
  );
}
