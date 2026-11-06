import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison(그리고 #names의 취약성 정의) — 사례의 숫자가 정의의 어디까지 담는가.
 * 칸 크기는 양과 무관하다. 점선 칸의 크기는 본문에 없으므로 숫자를 적지 않는다.
 */
const SCENES = [
  {
    label: "노출",
    summary: "자산 300은 일부",
    outer: "노출 (UNDRR 정의)",
    inHeading: "사례의 숫자에 있음",
    inside: ["B의 자산 300 (가정)"],
    outHeading: "따로 조사할 것",
    outside: ["거주 인구", "병원 접근", "생활 기반"],
    note: "UNDRR은 위험 지역에 있는 사람, 주택과 기반 시설 등을 노출에 포함합니다. 그래서 사례의 자산 300만으로 지역 B의 위험 전체를 대표할 수 없습니다.",
  },
  {
    label: "취약성",
    summary: "손상 비율은 민감성만",
    outer: "취약성 (IPCC 용어집)",
    inHeading: "사례의 숫자에 있음",
    inside: ["민감성 → 손상 비율 10%·20% (가정)"],
    outHeading: "이 숫자에 안 들어 있음",
    outside: ["대응·적응 능력(회복 능력 포함)", "복구 기간"],
    note: "3절에서 본 대로 사례의 비율은 민감성만 단순화한 가정입니다. UNDRR도 노출된 요소의 취약성과 역량을 노출과 결합해야 정량적 위험을 추정할 수 있다고 설명합니다.",
  },
  {
    label: "지역을 비교할 때",
    summary: "피해액 순위만으로는 가려집니다",
    outer: "부유한 해안 도시 대 자산가격이 낮은 농촌",
    inHeading: "피해액으로 보이는 것",
    inside: ["같은 통화가격의 손실"],
    outHeading: "가려지는 것과 함께 맞출 것",
    outside: ["인구·자산 대비 손실", "복구 기간", "생계 손실·회복 능력의 차이"],
    note: "두 지역을 피해액만으로 순위 매기면 생계 손실과 회복 능력의 차이가 가려집니다. 국가 비교에서는 같은 통화가격 외에 인구·자산 대비 손실과 복구 기간을 맞춥니다.",
  },
] as const;

export default function CoverageViz() {
  return (
    <SceneShell
      eyebrow="숫자가 담는 범위"
      title="사례의 숫자는 정의의 일부만 담습니다"
      description="바깥 틀이 살펴보는 대상, 실선 칸이 숫자에 담긴 것, 점선 칸이 담기지 않은 것입니다. 칸 크기는 양과 무관합니다."
      ariaLabel="사례의 숫자가 노출과 취약성 정의에서 차지하는 범위"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
            <div key={s.label} className="rounded-lg border border-border px-3 py-2.5">
              <p className="text-sm font-bold leading-6">{s.outer}</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{s.inHeading}</p>
              <div className="mt-1 grid gap-1.5">
                {s.inside.map((item) => (
                  <div key={item} className="rounded-lg border border-primary bg-primary/10 px-2.5 py-2 text-sm font-bold leading-5">{item}</div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{s.outHeading}</p>
              <div className={`mt-1 grid grid-cols-1 gap-1.5 ${s.outside.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
                {s.outside.map((item) => (
                  <div key={item} className="rounded-lg border border-dashed border-border px-2.5 py-2 text-sm leading-5">{item}</div>
                ))}
              </div>
            </div>
        );
      }}
    />
  );
}
