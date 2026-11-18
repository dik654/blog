import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison — Publication 550은 Section 1256 계약을 과세연도 말에 공정가치로
 * 판 것으로 보아 손익을 인식하고, 순손익은 일반적으로 60% 장기·40% 단기로 나눈다.
 * (가정) 연말에 아직 팔지 않은 적격 계약의 평가이익 10 → 장기 6 + 단기 4.
 */
const OPEN_X = 30;
const YEAR_END_X = 66;
const SALE_X = 90;

const LANES = [
  { key: "realize", title: "실현 때만 잡는 방식" },
  { key: "mark", title: "Section 1256 적격 계약" },
] as const;

const SCENES = [
  { label: "연말에도 열려 있는 계약", summary: "평가이익 +10 · 아직 안 팜", note: "올해 체결한 계약을 과세연도 말까지 팔지 않았고, 그 시점의 공정가치로 보면 이익이 10이라고 놓았습니다(가정). 매도는 다음 해에 한다고 가정합니다." },
  { label: "실현 때만 잡는다면", summary: "올해 장부 0 → 팔 때 인식", note: "실현할 때만 손익을 잡는 방식이라면 팔지 않은 계약의 이익은 올해 과세 장부에 들어가지 않고, 매도하는 해에 잡힙니다." },
  { label: "Section 1256: 판 것으로 봅니다", summary: "과세연도 말에 +10 인식", note: "적격 Section 1256 계약은 과세연도 말에 공정가치로 판 것으로 보아 손익을 인식합니다. 팔지 않았어도 올해 장부에 +10이 들어갑니다." },
  { label: "60·40으로 나눕니다", summary: "10 → 장기 6 + 단기 4", note: "순손익은 일반적으로 60%인 6을 장기, 40%인 4를 단기 자본손익으로 나눕니다. 이 규칙은 적격 계약의 법적 범위에만 적용되고, 화면에 ‘선물’이라고 적혔다는 이유만으로 적용하지 않습니다." },
] as const;

function Marker({ x, label, tone }: { x: number; label: string; tone: string }) {
  return (
    <>
      <div className="absolute top-0 h-full border-l" style={{ left: `${x}%`, borderColor: tone }} />
      <span className="absolute -top-0.5 -translate-x-1/2 whitespace-nowrap bg-background px-0.5 text-[10px] text-muted-foreground" style={{ left: `${x}%` }}>{label}</span>
    </>
  );
}

export default function YearEndMarkViz() {
  return (
    <SceneShell
      eyebrow="연말 평가와 60·40"
      title="팔지 않은 계약도 연말에 판 것으로 보면 올해 손익이 됩니다"
      description="가로축은 시간입니다. 체결·매도 시점과 평가이익 10은 설명용 가정이고, 연말 평가와 60·40 분류는 미국 국세청 Publication 550이 설명하는 적격 Section 1256 계약의 원칙입니다."
      ariaLabel="연말에 열려 있는 계약의 평가이익 10을 실현 기준과 Section 1256 연말 평가로 비교하고 장기 6과 단기 4로 나누는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="relative mx-1 h-16 rounded-md border border-border">
            <Marker x={OPEN_X} label="체결" tone="#94a3b8" />
            <Marker x={YEAR_END_X} label="과세연도 말" tone="#2563eb" />
            <Marker x={SALE_X} label="매도(가정)" tone="#94a3b8" />
            <div className="absolute top-8 h-1.5 rounded-sm" style={{ left: `${OPEN_X}%`, width: `${SALE_X - OPEN_X}%`, backgroundColor: "#cbd5e1" }} />
            <span className="absolute top-10 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold" style={{ left: `${YEAR_END_X}%`, color: "#15803d" }}>평가이익 +10</span>
            <span className="absolute bottom-0.5 left-1 text-[10px] text-muted-foreground">올해</span>
            <span className="absolute bottom-0.5 right-1 text-[10px] text-muted-foreground">다음 해</span>
          </div>
          <div className="mt-3 space-y-2">
            {LANES.map((lane, index) => {
              const shown = active === 0 ? false : index === 0 ? active >= 1 : active >= 2;
              const thisYear = index === 0 ? "0" : "+10";
              const when = index === 0 ? "매도하는 해에 인식" : "과세연도 말에 인식";
              return (
                <div key={lane.key} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                  <div className="min-w-0">
                    <span className="block font-semibold">{lane.title}</span>
                    <span className="block text-muted-foreground">{shown ? when : " "}</span>
                  </div>
                  <span className="text-right">
                    <span className="block text-[10px] text-muted-foreground">올해 장부</span>
                    <span className="block font-mono text-sm font-bold" style={{ color: shown && index === 1 ? "#15803d" : undefined }}>{shown ? thisYear : "?"}</span>
                  </span>
                </div>
              );
            })}
          </div>
          <div className={`mt-3 ${active === 3 ? "" : "opacity-25"}`}>
            <p className="mb-1 text-xs font-semibold">Section 1256 순손익 10의 성격</p>
            <div className="flex h-7 overflow-hidden rounded-md border border-border text-[11px] font-bold text-white">
              <div className="flex items-center justify-center" style={{ width: "60%", backgroundColor: active === 3 ? "#2563eb" : "#94a3b8" }}>장기 60% · 6</div>
              <div className="flex items-center justify-center" style={{ width: "40%", backgroundColor: active === 3 ? "#d97706" : "#cbd5e1" }}>단기 40% · 4</div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
