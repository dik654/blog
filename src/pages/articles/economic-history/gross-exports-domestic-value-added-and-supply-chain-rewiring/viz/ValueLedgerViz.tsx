import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview·#case — 총수출 100 = 외국 부품 40 + 국내 조립 20 + 국내 부품·서비스 40.
 * 국내 부가가치 20+40=60(60%), 외국 40%. 앞선 수출국의 수출 40 + 이 나라 수출 100 = 통관 합 140, 새로 더한 가치 40+60=100.
 * 국내화 10: 외국 30 + 조립 20 + 국내 공급 50 = 100 → 국내 70%. 모든 줄은 같은 축척(0~140)입니다.
 */
const SCALE = 140;

type Part = "gross" | "foreign" | "assembly" | "supply";

const PART_STYLE: Record<Part, { name: string; color: string }> = {
  gross: { name: "통관가격", color: "#64748b" },
  foreign: { name: "외국 부가가치", color: "#d97706" },
  assembly: { name: "국내 조립", color: "#2563eb" },
  supply: { name: "국내 부품·물류·설계", color: "#0f766e" },
};

interface Row {
  name: string;
  total: string;
  segments: readonly { part: Part; value: number }[];
}

const EMPTY: Row = { name: "", total: "", segments: [] };

const SCENES: readonly { label: string; summary: string; rows: readonly [Row, Row, Row]; note: string }[] = [
  {
    label: "세관은 100을 한 번 적습니다",
    summary: "총수출 100",
    rows: [{ name: "이 나라의 통관 수출", total: "100", segments: [{ part: "gross", value: 100 }] }, EMPTY, EMPTY],
    note: "총수출은 국경을 넘을 때 완제품의 전체 가격을 기록합니다. 통관 장부에는 누가 어느 단계에서 얼마를 만들었는지가 나타나지 않습니다. 숫자는 이 글의 설명용 가정입니다.",
  },
  {
    label: "가치 장부로 나눕니다",
    summary: "국내 60 · 외국 40",
    rows: [
      { name: "이 나라의 통관 수출", total: "100", segments: [{ part: "gross", value: 100 }] },
      { name: "누가 더한 가치인가", total: "40+20+40", segments: [{ part: "foreign", value: 40 }, { part: "assembly", value: 20 }, { part: "supply", value: 40 }] },
      EMPTY,
    ],
    note: "부가가치는 각 단계가 새로 더한 가치입니다. 외국 부품 40, 국내 조립 20, 국내 부품·서비스 40을 더하면 100입니다. 국내 부가가치는 20+40=60, 외국 부가가치 비중은 40%입니다.",
  },
  {
    label: "외국 40은 두 번 잡힙니다",
    summary: "통관 합 140 · 새 가치 100",
    rows: [
      { name: "앞선 수출국의 수출(부품)", total: "40", segments: [{ part: "foreign", value: 40 }] },
      { name: "이 나라의 수출(완제품)", total: "100", segments: [{ part: "foreign", value: 40 }, { part: "assembly", value: 20 }, { part: "supply", value: 40 }] },
      { name: "두 통관 기록의 합", total: "140", segments: [{ part: "foreign", value: 40 }, { part: "foreign", value: 40 }, { part: "assembly", value: 20 }, { part: "supply", value: 40 }] },
    ],
    note: "부품 40은 앞선 나라가 수출할 때 한 번, 완제품 안에 들어가 이 나라가 수출할 때 또 한 번 기록됩니다. 두 기록을 더하면 140이지만 두 나라가 새로 더한 가치는 40+60=100입니다(앞선 나라의 40이 모두 그 나라가 더한 가치라고 가정).",
  },
  {
    label: "수입 부품 10을 국내가 대신하면",
    summary: "국내 70 · 외국 30",
    rows: [
      { name: "이 나라의 통관 수출", total: "100", segments: [{ part: "gross", value: 100 }] },
      { name: "누가 더한 가치인가", total: "30+20+50", segments: [{ part: "foreign", value: 30 }, { part: "assembly", value: 20 }, { part: "supply", value: 50 }] },
      EMPTY,
    ],
    note: "통관 숫자 100은 그대로인데 가치 장부는 외국 30, 국내 조립 20, 국내 공급 50으로 바뀌어 국내 몫이 70%가 됩니다. 국내 공급 비용이 높아 판매가·수출량이 바뀌면 이 단순 비교를 그대로 쓸 수 없습니다.",
  },
];

function StackRow({ row }: { row: Row }) {
  const empty = row.segments.length === 0;
  return (
    <div className={`space-y-1 ${empty ? "invisible" : ""}`} aria-hidden={empty}>
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-semibold">{row.name || "빈 줄"}</span>
        <span className="font-mono font-bold">{row.total || "0"}</span>
      </div>
      <div className="flex h-7 min-w-0 rounded-sm bg-muted/30">
        {row.segments.map((segment, index) => {
          const style = PART_STYLE[segment.part];
          return (
            <div
              key={index}
              className="flex h-full items-center justify-center overflow-hidden border-r border-background text-xs font-bold last:border-r-0"
              style={{ width: `${(segment.value / SCALE) * 100}%`, backgroundColor: `${style.color}38`, outline: `1px solid ${style.color}`, outlineOffset: "-1px" }}
            >
              {segment.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ValueLedgerViz() {
  return (
    <SceneShell
      eyebrow="통관 장부와 가치 장부"
      title="총수출 100을 누가 더한 가치로 나눕니다"
      description="모든 막대는 같은 눈금입니다. 색은 아래 표시와 같고, 숫자는 계산 구조를 위한 가정입니다."
      ariaLabel="총수출 100을 외국 40, 국내 조립 20, 국내 공급 40으로 나누고 외국 40의 중복 계산과 국내화 10의 효과를 보는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          {SCENES[active].rows.map((row, index) => (
            <StackRow key={index} row={row} />
          ))}
          <ul className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
            {(Object.keys(PART_STYLE) as Part[]).map((part) => (
              <li key={part} className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-4 rounded-sm border" style={{ borderColor: PART_STYLE[part].color, backgroundColor: `${PART_STYLE[part].color}38` }} />
                {PART_STYLE[part].name}
              </li>
            ))}
          </ul>
        </div>
      )}
    />
  );
}
