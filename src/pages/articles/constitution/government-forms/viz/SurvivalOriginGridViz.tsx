import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-axes — 행정부 수반 하나를 2×2 표의 한 점으로 찍으면 준대통령제의 핵심이 사라진다.
 * 가로 = 의회 신임과 생존의 관계, 세로 = 의회와 별도의 선거 기원. 체제가 아니라 직책을 점으로 찍는다.
 * 스위스는 본문이 생존 규칙을 칸으로 단정하지 않으므로 행 전체에 걸친 띠로만 표시한다.
 */
const SCENES = [
  { label: "두 질문", summary: "가로 생존 · 세로 선거 기원", note: "점 하나가 직책 하나입니다. 가로는 정부가 의회의 신임 없이 임기를 채우는가, 세로는 행정부가 의회 다수의 선택과 별도의 선거 기원을 갖는가입니다." },
  { label: "대통령제", summary: "대통령 = 왼쪽 위 한 점", note: "직접선거든 선거인단을 거치든 의회 다수와 별도로 정해지고, 의회 신임에 기대어 재직하지 않습니다. 다만 직선 여부만으로 대통령제 전체를 정의할 수는 없습니다." },
  { label: "의원내각제", summary: "정부 = 오른쪽 아래 한 점", note: "의회의 신임을 얻거나 적어도 불신임을 당하지 않아야 재직합니다. 그렇다고 정책 표결 패배가 곧 불신임이라는 뜻은 아니며, 요건은 헌법마다 다릅니다." },
  { label: "준대통령제", summary: "한 행정부에 점이 둘", note: "고정 임기의 대통령과 의회에 책임지는 총리·내각이 함께 있어 점 하나로 찍을 수 없습니다. 두 직책의 생존을 따로 적어야 잇는 선의 의미가 보입니다." },
  { label: "스위스 · 경계 사례", summary: "선출은 의회, 임기 4년", note: "연방평의회 7명은 연방의회가 뽑고 임기는 4년입니다. “의회가 뽑으면 곧 의원내각제”라는 도식을 깨는 경계 사례로만 표시했고, 보편적인 네 번째 칸이라는 뜻은 아닙니다." },
] as const;

function Chip({ label, sub, color, state }: { label: string; sub: string; color: string; state: "hidden" | "faded" | "on" }) {
  return (
    <div
      className={`relative z-10 rounded-md border bg-background px-2 py-1 text-center leading-4 transition-opacity duration-300 motion-reduce:transition-none ${
        state === "hidden" ? "invisible" : state === "faded" ? "opacity-45" : ""
      }`}
      style={{ borderColor: color }}
    >
      <span className="block text-xs font-bold" style={{ color }}>{label}</span>
      <span className="block text-[11px] text-muted-foreground">{sub}</span>
    </div>
  );
}

function chipState(active: number, shownAt: number, onUntil: number): "hidden" | "faded" | "on" {
  if (active < shownAt) return "hidden";
  return active <= onUntil ? "on" : "faded";
}

export default function SurvivalOriginGridViz() {
  return (
    <SceneShell
      eyebrow="생존과 선거 기원"
      title="두 질문으로 찍으면 준대통령제만 점이 둘입니다"
      description="칸이 비어 있어도 그런 체제가 없다는 뜻은 아닙니다. 이 글이 다루는 직책만 찍었습니다."
      ariaLabel="생존의 분리와 선거 기원의 분리로 만든 2×2 표에 대통령, 의원내각제 정부, 준대통령제의 대통령과 총리를 찍는 과정"
      scenes={SCENES}
      render={(active) => {
        const semi = chipState(active, 3, 3);
        return (
          <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-1.5 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)]">
            <div className="col-start-2 row-start-1 pb-1 text-center text-xs font-bold leading-5">생존 분리<span className="block font-normal text-muted-foreground">신임 없이 임기 유지</span></div>
            <div className="col-start-3 row-start-1 pb-1 text-center text-xs font-bold leading-5">생존 매임<span className="block font-normal text-muted-foreground">신임 잃으면 교체 경로</span></div>

            <div className="col-start-1 row-start-2 flex items-center text-xs font-bold leading-5">의회와 별도 선거</div>
            <div className="col-start-2 row-start-2 flex flex-col justify-between gap-2 rounded-lg border border-border bg-muted/20 p-1.5">
              <Chip label="대통령제" sub="대통령" color="#4f46e5" state={chipState(active, 1, 1)} />
              <Chip label="준대통령제" sub="대통령" color="#d97706" state={semi} />
            </div>
            <div className="col-start-3 row-start-2 rounded-lg border border-border bg-muted/20" />

            <div className="col-start-1 row-start-3 row-span-2 flex items-center text-xs font-bold leading-5">별도 선거 없음</div>
            <div className="col-start-2 row-start-3 rounded-lg border border-border bg-muted/20" />
            <div className="col-start-3 row-start-3 flex flex-col justify-between gap-2 rounded-lg border border-border bg-muted/20 p-1.5">
              <Chip label="준대통령제" sub="총리·내각" color="#d97706" state={semi} />
              <Chip label="의원내각제" sub="정부" color="#059669" state={chipState(active, 2, 2)} />
            </div>

            <div className="pointer-events-none relative col-start-2 col-end-4 row-start-2 row-end-4" aria-hidden="true">
              <svg className={`absolute inset-0 h-full w-full ${semi === "hidden" ? "invisible" : semi === "faded" ? "opacity-45" : ""}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="25" y1="42" x2="75" y2="58" stroke="#d97706" strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className={`col-start-2 col-end-4 row-start-4 rounded-md border border-dashed px-2 py-1 text-center text-xs leading-5 ${active === 4 ? "" : "invisible"}`} style={{ borderColor: "#64748b" }}>
              <span className="font-bold">스위스 연방평의회</span> · 의회가 선출 · 생존 규칙은 따로 읽음
            </div>
          </div>
        );
      }}
    />
  );
}
