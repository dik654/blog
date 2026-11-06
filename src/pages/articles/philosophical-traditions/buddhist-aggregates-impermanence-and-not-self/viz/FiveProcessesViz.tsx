import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 감각 접촉→느낌→지각(+과거 기억)→형성, 의식은 각 대상을 앎.
 * 그 위에 무상(관찰)·무아(검사)·붙잡음(요구)을 차례로 얹는다. 같은 칸을 유지하고 강조만 옮긴다.
 */
const CHAIN = [
  { name: "감각 접촉", sub: "몸" },
  { name: "느낌", sub: "접촉에서 생김" },
  { name: "지각", sub: "기억과 묶어 의미를 붙임" },
  { name: "의지적 형성", sub: "반격·회피 같은 경향" },
] as const;

const LAYERS = ["무상", "무아", "붙잡음"] as const;
const TAGS = ["", "", "변함", "주인?", "내 뜻대로!"] as const;

const SCENES = [
  { label: "네 고리", summary: "접촉 → 느낌 → 지각 → 형성", note: "접촉에서 느낌이 생기고, 지각이 그것을 과거 기억과 묶어 의미를 붙이며, 의지적 형성이 경향을 만듭니다. 고정된 부품이라기보다 조건에 따라 생기고 사라지는 과정입니다." },
  { label: "의식", summary: "각 대상을 알아차림", note: "의식은 고리의 맨 끝 칸 하나가 아니라 각 대상을 알아차리는 과정으로 그렸습니다. 다섯 집합이 이렇게 다 나왔습니다." },
  { label: "무상", summary: "계속 변한다는 관찰", note: "무상은 무엇이 있다거나 없다는 판정이 아니라 이 과정들이 계속 변한다는 관찰입니다." },
  { label: "무아", summary: "주인을 찾기 어렵다는 검사", note: "무아는 이 과정들 가운데 영원하고 완전히 통제되는 주인이라고 붙잡을 것을 찾기 어렵다는 검사입니다. 의식을 포함한 다섯 과정 모두에 그런 주인인지 묻습니다." },
  { label: "붙잡음", summary: "요구가 괴로움을 키움", note: "붙잡음은 변하는 것을 반드시 내 뜻대로 있어야 한다고 요구합니다. 그 요구가 괴로움을 키웁니다." },
] as const;

export default function FiveProcessesViz() {
  return (
    <SceneShell
      eyebrow="다섯 과정과 세 말"
      title="이어지는 네 고리와 각 대상을 아는 의식"
      description="위쪽은 모욕의 순간에 움직이는 과정이고, 아래쪽 세 칸은 그 과정을 두고 하는 말입니다. 순서는 설명을 위한 것이며 실제 경험은 겹칩니다."
      ariaLabel="감각 접촉, 느낌, 지각, 의지적 형성으로 이어지는 고리와 각 대상을 아는 의식, 그리고 무상, 무아, 붙잡음"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)_0.75rem_minmax(0,1fr)] items-stretch gap-y-1 text-center text-xs leading-5 sm:text-sm">
            <span className="col-start-5 text-[11px] leading-4 text-muted-foreground sm:text-xs">과거 기억 ↓</span>
            {CHAIN.map((node, index) => (
              <div key={node.name} className="contents">
                {index > 0 ? <span className="row-start-2 flex items-center justify-center text-muted-foreground" aria-hidden>→</span> : null}
                <div className={`row-start-2 min-w-0 rounded-lg border px-1 py-2 ${active === 0 ? "border-primary" : "border-border"}`}>
                  <span className="block font-bold">{node.name}</span>
                  <span className="block text-[11px] leading-4 text-muted-foreground sm:text-xs">{node.sub}</span>
                  <span className={`mt-1 block text-[11px] font-semibold leading-4 sm:text-xs ${TAGS[active] ? "" : "invisible"}`}>{TAGS[active] || "빈칸"}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={`mt-2 rounded-lg border px-2 py-2 text-center text-xs leading-5 sm:text-sm ${active === 1 ? "border-primary font-bold" : "border-border"}`}>
            ↑ ↑ 의식: 각 대상을 알아차림 ↑ ↑
            <span className={`block text-[11px] font-semibold leading-4 sm:text-xs ${TAGS[active] ? "" : "invisible"}`}>{TAGS[active] || "빈칸"}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm leading-6">
            {LAYERS.map((layer, index) => {
              const on = active === index + 2;
              return (
                <div key={layer} className={`rounded-lg border px-1 py-2 ${on ? "border-primary font-bold" : "border-border/50 text-muted-foreground/60"}`}>
                  {on ? "▶ " : ""}{layer}
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
