import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison, #limits — 10억 원 채권, 가정 회수율 40%.
 * 칸 하나 = 1억 원. 채권 회수 4억 + CDS 6억 = 10억. 매도자가 못 내면 6억은 약정에만 남는다.
 */
type Cell = "held" | "recovered" | "loss" | "paid" | "promise";

interface Scene {
  label: string;
  summary: string;
  note: string;
  cells: readonly Cell[];
  gates: readonly [string, string];
  recovered: string;
  cds: string;
}

const fill = (held: Cell, rest: Cell): readonly Cell[] => [...Array<Cell>(4).fill(held), ...Array<Cell>(6).fill(rest)];

const SCENES: readonly Scene[] = [
  { label: "사건이 나기 전", summary: "채권 10억 원 + 보호 계약", cells: fill("held", "held"), gates: ["사건 없음", "아직"], recovered: "—", cds: "—", note: "CDS는 정해진 신용 사건 때 지급받는 대신 정기 대가를 내는 계약입니다. 보호 매도자는 그 지급을 약속한 쪽입니다. 정기 대가의 금액은 이 사례에 넣지 않았습니다." },
  { label: "신용 사건 뒤 채권에서", summary: "회수율 40% → 4억 원", cells: fill("recovered", "loss"), gates: ["확인 전", "아직"], recovered: "4억 원", cds: "—", note: "회수율은 신용 사건 뒤 채권에서 되찾는 비율이며 여기서는 40%라고 가정합니다. 채권에서 4억 원을 받으면 손실은 6억 원입니다." },
  { label: "조건이 충족되고 매도자가 지급", summary: "4억 + 6억 = 10억 원", cells: fill("recovered", "paid"), gates: ["충족", "지급"], recovered: "4억 원", cds: "6억 원", note: "현금결제(돈으로 정산하는 방식) 조건이 그 회수율을 사용한다면 CDS에서 6억 원을 받습니다. 정기 지급과 상대방 부도는 별도로 고려해야 합니다." },
  { label: "계약 조건이 충족되지 않으면", summary: "6억 원 보상이 실현되지 않음", cells: fill("recovered", "loss"), gates: ["미충족", "—"], recovered: "4억 원", cds: "—", note: "CDS는 손실 자체가 아니라 계약이 정한 사건과 결제 조건을 보고 지급합니다. 조건이 충족되어야 6억 원 보상이 실현됩니다." },
  { label: "매도자가 지급하지 못하면", summary: "6억 원은 약정에만 남음", cells: fill("recovered", "promise"), gates: ["충족", "못 함"], recovered: "4억 원", cds: "약정만", note: "채권 부도와 보호 매도자 부도가 함께 발생할 수도 있습니다. 담보가 있어도 처분 가격·지급 지연·상계의 법적 효력을 확인해야 하므로 담보 회수액은 그리지 않았습니다." },
];

const CELL_CLASS: Record<Cell, string> = {
  held: "border-border bg-[#64748b]/40",
  recovered: "border-[#2563eb] bg-[#2563eb]",
  loss: "border-[#dc2626] bg-[#dc2626]/20",
  paid: "border-[#16a34a] bg-[#16a34a]",
  promise: "border-dashed border-[#d97706] bg-transparent",
};

/** 칸 묶음을 색 없이도 읽도록 묶음마다 붙이는 글자입니다. */
const PART_TEXT: Record<Cell, string> = {
  held: "채권 10억 원",
  recovered: "회수 4억 원",
  loss: "손실 6억 원",
  paid: "CDS 6억 원",
  promise: "약정 6억 원",
};

const LEGEND: readonly { cell: Cell; text: string }[] = [
  { cell: "held", text: "채권 보유" },
  { cell: "recovered", text: "채권에서 회수" },
  { cell: "loss", text: "손실" },
  { cell: "paid", text: "CDS로 받음" },
  { cell: "promise", text: "약정에만 남음" },
];

function Gate({ title, value }: { title: string; value: string }) {
  const good = value === "충족" || value === "지급";
  const bad = value === "미충족" || value === "못 함";
  return (
    <div className={`rounded-sm border px-2 py-1.5 text-xs ${good ? "border-[#16a34a]" : bad ? "border-[#dc2626]" : "border-dashed border-border"} bg-background`}>
      <div className="text-[11px] leading-4 text-muted-foreground">{title}</div>
      <div className={`font-bold ${good ? "text-[#16a34a]" : bad ? "text-[#dc2626]" : "text-muted-foreground"}`}>{value}</div>
    </div>
  );
}

export default function CdsPayoutViz() {
  return (
    <SceneShell
      eyebrow="신용 보호의 지급"
      title="10억 원 채권의 손실 6억 원은 두 관문을 지나야 메워집니다"
      description="(가정) 칸 하나가 1억 원입니다. 채권 10억 원과 회수율 40%는 설명용 숫자입니다."
      ariaLabel="채권 회수 4억 원과 CDS 보상 6억 원이 조건에 따라 달라지는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-10 gap-0.5 sm:gap-1">
              {s.cells.map((cell, i) => (
                <div key={i} className={`h-9 rounded-sm border transition-colors duration-300 motion-reduce:transition-none ${CELL_CLASS[cell]}`} />
              ))}
            </div>
            <div className="mt-1 grid grid-cols-10 gap-0.5 text-center text-[11px] font-semibold leading-4 sm:gap-1">
              {s.cells[0] === "held" ? (
                <span className="col-span-10">{PART_TEXT.held}</span>
              ) : (
                <>
                  <span className="col-span-4">{PART_TEXT[s.cells[0]]}</span>
                  <span className="col-span-6">{PART_TEXT[s.cells[9]]}</span>
                </>
              )}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              {LEGEND.map((item) => (
                <li key={item.cell} className="flex items-center gap-1.5">
                  <span className={`inline-block h-2.5 w-2.5 rounded-sm border ${CELL_CLASS[item.cell]}`} />
                  {item.text}
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Gate title="관문 1 · 신용 사건과 결제 조건" value={s.gates[0]} />
              <Gate title="관문 2 · 보호 매도자의 지급" value={s.gates[1]} />
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-sm border border-border bg-background px-2 py-1.5">
                <dt className="text-[11px] text-muted-foreground">채권에서 받음</dt>
                <dd className="font-mono font-bold">{s.recovered}</dd>
              </div>
              <div className="rounded-sm border border-border bg-background px-2 py-1.5">
                <dt className="text-[11px] text-muted-foreground">CDS에서 받음</dt>
                <dd className="font-mono font-bold">{s.cds}</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
