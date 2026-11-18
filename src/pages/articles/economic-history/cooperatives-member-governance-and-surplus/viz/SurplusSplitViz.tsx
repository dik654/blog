import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 140 − 110 = 30, 30 = 12 + 3 + 15, A의 이용 12 ÷ 전체 120 = 10%, 15 × 10% = 1.5.
 * 나머지 조합원 몫: 이용 120 − 12 = 108, 배당 15 − 1.5 = 13.5. 표: 조합원 100명, 1인 1표.
 * 장면마다 막대 축이 다르다(140, 30, 120, 15). 같은 장면 안에서만 길이를 비교한다.
 */
const SALES = 140;
const COSTS = 110;
const SURPLUS = SALES - COSTS;
const SPLIT = [
  { name: "공동 적립금", value: 12, color: "#2563eb" },
  { name: "교육", value: 3, color: "#7c3aed" },
  { name: "이용고 배당", value: 15, color: "#16a34a" },
] as const;
const TOTAL_USE = 120;
const A_USE = 12;
const A_PERCENT = (A_USE * 100) / TOTAL_USE;
const DIVIDEND = 15;
const A_DIVIDEND = (DIVIDEND * A_USE) / TOTAL_USE;
const MEMBERS = 100;

const SCENES = [
  { label: "매출에서 비용을 뺍니다", summary: "140 − 110 = 30", note: "설명용 매출 140에서 임금·상품·임대료 같은 비용 110을 빼면 잉여 30이 남습니다. 잉여는 협동조합이 한 해 사업에서 남긴 돈입니다." },
  { label: "총회가 잉여를 셋으로 나눕니다", summary: "12 + 3 + 15 = 30", note: "총회가 적립금 12, 교육 3, 조합원 배당 15를 승인했다고 가정합니다. 세 몫을 더하면 다시 30입니다. 막대 축이 앞 장면의 140이 아니라 30으로 바뀌었습니다." },
  { label: "A가 쓴 몫을 셉니다", summary: "12 ÷ 120 = 10%", note: "조합원 A의 연간 이용액 12는 전체 조합원 이용액 120의 10%입니다. 출자금이 아니라 조합과 거래한 양을 셉니다." },
  { label: "배당도 같은 비율로 나눕니다", summary: "15 × 10% = 1.5", note: "이용고 배당은 이용한 양에 따라 잉여 일부를 돌려주는 방식입니다. A는 배당 15의 10%인 1.5를 받고, 나머지 13.5는 다른 조합원에게 돌아갑니다. 두 막대의 A 칸 비율이 같습니다." },
  { label: "표는 출자액을 따르지 않습니다", summary: "A도 100표 중 1표", note: "A가 더 많은 출자금을 냈더라도 표가 자동으로 늘지 않습니다. 1차 협동조합에서는 보통 1인 1표입니다. 실제 배분과 표결은 정관과 국가 법률을 따라야 합니다." },
] as const;

function Row({ label, parts, axis }: { label: string; parts: readonly { name: string; value: number; color: string }[]; axis: number }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-semibold leading-4">{label}</span>
      <div className="flex h-8 min-w-0 overflow-hidden rounded-sm bg-[#94a3b8]/15">
        {parts.map((part) => (
          <div
            key={part.name}
            className="flex h-full items-center justify-center border-r border-background font-mono text-[11px] font-bold text-white"
            style={{ width: `${(part.value / axis) * 100}%`, backgroundColor: part.color }}
          >
            {part.value}
          </div>
        ))}
      </div>
    </div>
  );
}

function Legend({ items }: { items: readonly { name: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.name}
        </li>
      ))}
    </ul>
  );
}

export default function SurplusSplitViz() {
  return (
    <SceneShell
      eyebrow="협동조합 한 해 장부"
      title="잉여 30이 적립·교육·배당으로 나뉘고 A에게 1.5가 갑니다"
      description="3절의 설명용 숫자입니다. 막대 길이는 같은 장면 안에서만 금액에 비례합니다."
      ariaLabel="매출 140과 비용 110, 잉여 30의 세 몫, 조합원 A의 이용 비율과 배당, 1인 1표"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="min-w-0 space-y-3">
              <Row label="매출" parts={[{ name: "매출", value: SALES, color: "#64748b" }]} axis={SALES} />
              <Row label="비용 + 잉여" parts={[{ name: "비용", value: COSTS, color: "#94a3b8" }, { name: "잉여", value: SURPLUS, color: "#d97706" }]} axis={SALES} />
              <Legend items={[{ name: "비용 110", color: "#94a3b8" }, { name: "잉여 30", color: "#d97706" }]} />
            </div>
          );
        }
        if (active === 1) {
          return (
            <div className="min-w-0 space-y-3">
              <Row label="잉여 30" parts={SPLIT} axis={SURPLUS} />
              <Legend items={SPLIT} />
            </div>
          );
        }
        if (active === 2 || active === 3) {
          return (
            <div className="min-w-0 space-y-3">
              <Row label="전체 이용 120" parts={[{ name: "A", value: A_USE, color: "#2563eb" }, { name: "나머지", value: TOTAL_USE - A_USE, color: "#94a3b8" }]} axis={TOTAL_USE} />
              <div className={active === 3 ? "" : "opacity-25"}>
                <Row label="배당 15" parts={[{ name: "A", value: A_DIVIDEND, color: "#2563eb" }, { name: "나머지", value: DIVIDEND - A_DIVIDEND, color: "#94a3b8" }]} axis={DIVIDEND} />
              </div>
              <Legend items={[{ name: `A의 몫 (${A_PERCENT}%)`, color: "#2563eb" }, { name: "다른 조합원", color: "#94a3b8" }]} />
            </div>
          );
        }
        return (
          <div className="min-w-0 space-y-3">
            <div className="mx-auto grid max-w-[22rem] grid-cols-[repeat(20,minmax(0,1fr))] gap-1" role="img" aria-label="조합원 100명이 한 표씩, A도 한 표">
              {Array.from({ length: MEMBERS }, (_, index) => (
                <span key={index} className={`aspect-square rounded-full ${index === 0 ? "bg-[#2563eb]" : "bg-[#94a3b8]/50"}`} />
              ))}
            </div>
            <Legend items={[{ name: "A의 한 표", color: "#2563eb" }, { name: "다른 조합원 99명의 표", color: "#94a3b8" }]} />
          </div>
        );
      }}
    />
  );
}
