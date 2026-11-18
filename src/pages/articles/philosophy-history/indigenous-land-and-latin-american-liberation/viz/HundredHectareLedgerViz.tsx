import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 같은 100헥타르를 국가 지도(미이용 100)와 공동체 계절 지도(60·20·20)로 겹쳐 읽는다.
 * 60 + 20 + 20 = 100(1·3절). 칸의 위치는 설명용 배치이고 실제 지형이 아니다.
 * 마지막 장면: 이 합계만으로 소유권·개발 허가를 정하지 않는다(3절 둘째 문단).
 */
const ZONES: readonly { key: string; label: string; ha: number; cell: string; dot: string; detail: string }[] = [
  { key: "farm", label: "순환 경작·채집", ha: 60, cell: "bg-emerald-600/80", dot: "bg-emerald-600", detail: "계절에 따라 순환 이용" },
  { key: "water", label: "물길·의례 장소", ha: 20, cell: "bg-sky-600/80", dot: "bg-sky-600", detail: "생계와 기억의 관계" },
  { key: "rest", label: "회복 구역", ha: 20, cell: "bg-amber-500/80", dot: "bg-amber-500", detail: "다시 자라게 두는 곳" },
];

const TOTAL = ZONES.reduce<number>((sum, zone) => sum + zone.ha, 0);

const CELLS = ZONES.flatMap((zone) => Array.from({ length: zone.ha }, (_, index) => ({ id: `${zone.key}-${index}`, cell: zone.cell })));

const SCENES = [
  {
    label: "국가 지도: 100칸 모두 ‘미이용’",
    summary: "미이용 100ha",
    view: "state",
    note: "개발 계획서의 지도는 건물과 고정 경작만 이용으로 셉니다. 그 기준으로는 100칸 어디에도 셀 것이 없어 전부 ‘미이용지’로 표시됩니다.",
  },
  {
    label: "공동체 계절 지도를 겹칩니다",
    summary: `60 + 20 + 20 = ${TOTAL}ha`,
    view: "community",
    note: "같은 100칸에 공동체의 계절 지도를 겹치면 순환 경작·채집 60, 물길·의례 20, 회복 20이 나옵니다. 더하면 관계를 맺는 범위가 100헥타르 전부입니다.",
  },
  {
    label: "같은 칸, 두 기준의 판정",
    summary: "건물 0 ≠ 미이용",
    view: "compare",
    note: "같은 장소를 계절마다 다르게 쓰므로, 어느 날 건물이 없다는 관찰만으로 미이용을 판정할 수 없습니다. 회복 구역 20도 쓰지 않는 땅이 아니라 다시 자라게 두는 곳입니다.",
  },
  {
    label: "합계가 정하지 않는 것",
    summary: "반례 1개 ≠ 권리 결론",
    view: "limits",
    note: "이 설명용 장부 하나가 실제 소유권과 개발 허가를 정하지는 않습니다. 숫자는 국가 지도의 숨은 분류를 여는 첫 반례이고, 결론에는 목록에 적은 네 가지가 따로 필요합니다.",
  },
] as const;

type View = (typeof SCENES)[number]["view"];

const LIMITS: readonly string[] = ["공동체의 법적 지위", "국가 조약과 헌법", "구성원 내부의 동의", "생태 조사"];

function Grid({ colored, dim = false }: { colored: boolean; dim?: boolean }) {
  return (
    <div className={`min-w-0 ${dim ? "opacity-35" : ""}`}>
      <div className="grid grid-cols-10 gap-0.5" aria-hidden>
        {CELLS.map((item) => (
          <span key={item.id} className={`h-4 rounded-sm sm:h-5 ${colored ? item.cell : "border border-dashed border-border bg-muted/40"}`} />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">한 칸 = 1ha · 칸 위치는 설명용 배치(가정)이며 실제 지형이 아닙니다</p>
    </div>
  );
}

function Legend({ view }: { view: View }) {
  if (view === "state") {
    return (
      <ul className="space-y-2 text-sm">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-3 w-3 shrink-0 rounded-sm border border-dashed border-border bg-muted/40" />
          <span>
            <span className="font-semibold">미이용 100칸</span>
            <span className="block text-xs text-muted-foreground">이 지도가 센 것: 건물·고정 경작</span>
          </span>
        </li>
      </ul>
    );
  }
  if (view === "limits") {
    return (
      <ul className="space-y-1.5 text-sm">
        {LIMITS.map((item) => (
          <li key={item} className="rounded-md border border-dashed border-border px-2 py-1">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  if (view === "compare") {
    return (
      <div className="space-y-2 text-sm">
        <div className="rounded-md border border-border px-2 py-1.5">
          <span className="block text-xs text-muted-foreground">국가 지도 기준</span>
          <span className="font-semibold">어느 날 건물 없음 → 미이용</span>
        </div>
        <div className="rounded-md border border-primary/60 px-2 py-1.5">
          <span className="block text-xs text-muted-foreground">공동체 계절 지도 기준</span>
          <span className="font-semibold">계절마다 다르게 이용 → 관계 100ha</span>
        </div>
      </div>
    );
  }
  return (
    <ul className="space-y-2 text-sm">
      {ZONES.map((zone) => (
        <li key={zone.key} className="flex items-start gap-2">
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-sm ${zone.dot}`} />
          <span>
            <span className="font-semibold">{`${zone.label} ${zone.ha}ha`}</span>
            <span className="block text-xs text-muted-foreground">{zone.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function HundredHectareLedgerViz() {
  return (
    <SceneShell
      eyebrow="같은 땅, 두 장부"
      title="‘미이용 100ha’ 위에 공동체의 60·20·20을 겹치기"
      description="10×10 칸이 계획서가 표시한 100헥타르입니다. 장면마다 어느 기준으로 칸을 칠하는지가 바뀝니다."
      ariaLabel="국가 지도의 미이용 100헥타르와 공동체 계절 지도의 순환 경작 60, 물길과 의례 20, 회복 20헥타르를 겹쳐 비교하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const view = SCENES[active].view;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] sm:items-start">
            <Grid colored={view !== "state"} dim={view === "limits"} />
            <Legend view={view} />
          </div>
        );
      }}
    />
  );
}
