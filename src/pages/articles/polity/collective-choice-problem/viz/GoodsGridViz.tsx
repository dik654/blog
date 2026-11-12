import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-kinds-of-choice·#coercion — 두 기준(빼놓을 수 있는가, 쓰면 남의 몫이 줄어드는가)이 만드는
 * 네 칸, 그리고 혼잡·배제 장치가 물건을 다른 칸으로 옮기는 방향.
 * 위 행 = 빼놓을 수 있음, 아래 행 = 빼놓을 수 없음. 왼쪽 열 = 경합적, 오른쪽 열 = 비경합적.
 */
type CellId = "private" | "club" | "common" | "public";

const CELLS: Record<CellId, { name: string; example: string; axes: string }> = {
  private: { name: "사적재", example: "빵, 옷, 영화표", axes: "막을 수 있음 · 줄어듦" },
  club: { name: "클럽재", example: "유료 방송, 회원제 시설", axes: "막을 수 있음 · 안 줄어듦" },
  common: { name: "공유자원", example: "어장, 지하수, 목초지", axes: "막을 수 없음 · 줄어듦" },
  public: { name: "공공재", example: "국방, 치안, 법질서", axes: "막을 수 없음 · 안 줄어듦" },
};

const SCENES = [
  { label: "두 질문이 칸을 나눕니다", summary: "2 × 2 = 네 칸", note: "세로는 안 낸 사람을 막을 수 있는가, 가로는 한 사람이 쓰면 남의 몫이 줄어드는가(경합적)입니다. 두 답을 짝지으면 네 칸입니다." },
  { label: "칸마다 이름이 붙습니다", summary: "오른쪽 아래가 공공재", note: "막을 수도 없고 나눠 써도 줄지 않는 오른쪽 아래 칸이 공공재입니다. 이 칸은 각자에게 맡기면 과소 공급됩니다." },
  { label: "혼잡해지면 칸을 옮깁니다", summary: "클럽재 → 경합적 쪽", note: "혼잡해지는 순간 한 사람의 이용이 남의 몫을 줄여 경합성이 생깁니다. 네 칸은 고정된 분류가 아니라 조건에 따라 옮겨 다닙니다." },
  { label: "배제 장치로 위 행으로 올립니다", summary: "어장 → 사적재처럼", note: "어장에 소유권을 설정하면 사적재처럼 다룰 수 있습니다. 다만 그 권리를 인정하고 침해를 막아 줄, 강제할 수 있는 주체가 전제됩니다." },
] as const;

const BLUE_TEXT = "text-blue-700 dark:text-blue-400";
const AMBER_TEXT = "text-amber-700 dark:text-amber-400";

function Cell({ id, active, tone }: { id: CellId; active: number; tone: "none" | "from" | "to" | "focus" }) {
  const cell = CELLS[id];
  const named = active >= 1;
  const border =
    tone === "from" ? "border-amber-600 border-dashed" : tone === "to" ? "border-blue-600" : tone === "focus" ? "border-primary" : "border-border";
  return (
    <div className={`flex min-h-[3.75rem] sm:min-h-[5.5rem] min-w-0 flex-col justify-center rounded-lg border bg-background px-1.5 py-1 text-center sm:px-2 sm:py-2 ${border}`}>
      <span className={`block text-sm font-bold ${named ? "" : "text-muted-foreground"}`}>{named ? cell.name : "?"}</span>
      <span className="mt-1 block text-[11px] leading-4 text-muted-foreground sm:text-xs">{named ? cell.example : cell.axes}</span>
    </div>
  );
}

function Arrow({ show, glyph, label, tone }: { show: boolean; glyph: string; label: string; tone: string }) {
  return (
    <div className={`flex min-h-[1.5rem] min-w-0 flex-col items-center justify-center text-center sm:min-h-[2.25rem] ${show ? tone : "invisible"}`} aria-hidden={!show}>
      <span className="text-[11px] font-semibold leading-4"><span className="text-base font-bold">{glyph}</span> {label}</span>
    </div>
  );
}

export default function GoodsGridViz() {
  return (
    <SceneShell
      eyebrow="두 기준, 네 칸"
      title="빼놓을 수 있는가와 쓰면 줄어드는가로 네 칸이 나뉩니다"
      description="세로 질문과 가로 질문을 함께 놓은 판입니다. 점선 칸은 출발한 칸, 파란 칸은 옮겨 간 칸입니다."
      note="완벽한 공공재는 드물고 대부분은 정도의 문제입니다. 칸의 예시는 아래 표에 든 예시 가운데 일부를 골랐습니다."
      ariaLabel="배제 가능성과 경합성으로 나눈 네 칸과 칸 사이의 이동"
      scenes={SCENES}
      render={(active) => {
        const tone = (id: CellId): "none" | "from" | "to" | "focus" => {
          if (active === 1 && id === "public") return "focus";
          if (active === 2) return id === "club" ? "from" : id === "private" ? "to" : "none";
          if (active === 3) return id === "common" ? "from" : id === "private" ? "to" : "none";
          return "none";
        };
        const axisStrong = active === 0 ? "font-bold text-foreground" : "text-muted-foreground";
        return (
          <div className="grid min-w-0 grid-cols-[3rem_minmax(0,1fr)_2.25rem_minmax(0,1fr)] gap-x-1 gap-y-1 sm:grid-cols-[5rem_minmax(0,1fr)_4rem_minmax(0,1fr)]">
            <div />
            <div className={`pb-1 text-center text-[11px] leading-4 sm:text-xs ${axisStrong}`}>쓰면 줄어듦<span className="hidden sm:inline"><br />(경합적)</span></div>
            <div />
            <div className={`pb-1 text-center text-[11px] leading-4 sm:text-xs ${axisStrong}`}>써도 안 줄어듦<span className="hidden sm:inline"><br />(비경합적)</span></div>

            <div className={`flex items-center text-[11px] leading-4 sm:text-xs ${axisStrong}`}>안 낸 사람을 막을 수 있음</div>
            <Cell id="private" active={active} tone={tone("private")} />
            <Arrow show={active === 2} glyph="←" label="혼잡" tone={AMBER_TEXT} />
            <Cell id="club" active={active} tone={tone("club")} />

            <div />
            <Arrow show={active === 3} glyph="↑" label="소유권 설정" tone={BLUE_TEXT} />
            <div />
            <div />

            <div className={`flex items-center text-[11px] leading-4 sm:text-xs ${axisStrong}`}>막을 수 없음</div>
            <Cell id="common" active={active} tone={tone("common")} />
            <div />
            <Cell id="public" active={active} tone={tone("public")} />
          </div>
        );
      }}
    />
  );
}
