import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 항로가 막힌 뒤 번지는 길과 두 대응의 맞교환.
 * 1) 운송 시간·보험료↑ → 부품 도착 지연 → 조립라인이 멈출 수 있음
 * 2) 판매자: 가격↑ 또는 마진·임금·주문↓  3) 소비자: 다른 상품 또는 구매 미룸
 * 4) 우회·항공: 시간↓ 가능, 연료·배출↑ 가능  5) 공급처 분산·재고↑: 회복력↑ 가능, 평소 비용·자본 묶임↑ → 중단 손실과 비교
 * 화살표는 순서만 뜻하고 크기·확률은 뜻하지 않는다.
 */
const SCENES = [
  { label: "항로가 막힙니다", summary: "시간·보험료 → 부품 지연", row: 0, note: "항로가 막히면 운송 시간과 보험료가 오르고 부품 도착이 늦어 조립라인이 멈출 수 있습니다. 3절의 운송·보험 8→16이 이 단계의 숫자 예입니다." },
  { label: "판매자가 고릅니다", summary: "가격을 올리거나 · 다른 몫을 줄이거나", row: 1, note: "판매자는 가격을 올리거나 마진·임금·주문을 줄입니다. 3절의 두 갈래, 곧 판매가 108과 판매가 100을 지키며 누군가의 몫을 줄이는 길로 이어집니다. 마진은 판매가에서 비용을 뺀 남는 몫입니다." },
  { label: "소비자가 반응합니다", summary: "옮기거나 · 미루거나", row: 2, note: "소비자는 다른 상품으로 옮기거나 구매를 미룹니다. 어느 쪽이 얼마나 많을지는 글에 수치가 없습니다." },
  { label: "대응 1: 우회·항공", summary: "시간 ↓ · 연료·배출 ↑", row: 3, note: "우회 항로와 항공 운송은 시간을 줄일 수 있지만 연료와 배출을 늘릴 수 있습니다. 2절의 탄소 흐름이 커질 수 있는 쪽입니다." },
  { label: "대응 2: 공급처 분산·재고", summary: "회복력 ↑ · 평소 비용 ↑", row: 4, note: "공급처를 여러 곳에 두고 재고를 늘리면 회복력은 커질 수 있으나 평소 비용과 자본 묶임도 커집니다. 그래서 서비스가 멈췄을 때의 손실과 함께 비교해야 합니다. 자본 묶임은 쌓아 둔 재고에 돈이 들어가 다른 데 쓰지 못하는 상태입니다." },
] as const;

function Cell({ title, plus, minus, on }: { title: string; plus?: string; minus?: string; on: boolean }) {
  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 text-xs leading-5 transition-opacity motion-reduce:transition-none ${on ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border/70 opacity-40"}`}>
      <p className="font-bold">{title}</p>
      {plus && <p className="text-[#16a34a] dark:text-[#4ade80]">+ {plus}</p>}
      {minus && <p className="text-[#dc2626] dark:text-[#f87171]">− {minus}</p>}
    </div>
  );
}

function Down({ on }: { on: boolean }) {
  return (
    <div className={`flex justify-center ${on ? "" : "opacity-30"}`} aria-hidden>
      <svg width="12" height="14" viewBox="0 0 12 14">
        <line x1="6" y1="0" x2="6" y2="9" stroke="#94a3b8" strokeWidth={1} />
        <polygon points="6,14 2,8 10,8" fill="#94a3b8" />
      </svg>
    </div>
  );
}

export default function ShockChainViz() {
  return (
    <SceneShell
      eyebrow="운송 충격이 번지는 길"
      title="막힌 항로 하나가 가격·주문·재고·배출로 갈라집니다"
      description="위에서 아래로 순서를 따라갑니다. 갈래는 글이 든 선택지이고, 칸 크기는 영향의 크기나 확률을 뜻하지 않습니다."
      ariaLabel="항로 차질이 판매자, 소비자 반응과 두 가지 대응으로 갈라지는 단계"
      scenes={SCENES}
      render={(active) => {
        const row = SCENES[active].row;
        return (
          <div className="mx-auto min-w-0 max-w-[560px] space-y-1">
            <Cell title="항로 막힘 → 운송 시간·보험료 상승 → 부품 도착 지연" minus="조립라인이 멈출 수 있음" on={row === 0} />
            <Down on={row >= 1} />
            <p className={`text-xs font-bold ${row === 1 ? "" : "opacity-40"}`}>판매자</p>
            <div className="grid grid-cols-2 gap-2">
              <Cell title="가격을 올림" on={row === 1} />
              <Cell title="마진·임금·주문을 줄임" on={row === 1} />
            </div>
            <Down on={row >= 2} />
            <p className={`text-xs font-bold ${row === 2 ? "" : "opacity-40"}`}>소비자</p>
            <div className="grid grid-cols-2 gap-2">
              <Cell title="다른 상품으로 옮김" on={row === 2} />
              <Cell title="구매를 미룸" on={row === 2} />
            </div>
            <Down on={row >= 3} />
            <p className={`text-xs font-bold ${row >= 3 ? "" : "opacity-40"}`}>대응과 맞교환 (둘 다 “할 수 있음”)</p>
            <div className="grid grid-cols-2 gap-2">
              <Cell title="우회 항로·항공 운송" plus="시간 단축" minus="연료·배출 증가" on={row === 3} />
              <Cell title="공급처 분산·재고 확대" plus="회복력" minus="평소 비용·자본 묶임" on={row === 4} />
            </div>
            <p className={`pt-1 text-right text-xs font-bold ${row === 4 ? "text-[#2563eb]" : "opacity-0"}`}>비교 대상: 서비스 중단 손실</p>
          </div>
        );
      }}
    />
  );
}
