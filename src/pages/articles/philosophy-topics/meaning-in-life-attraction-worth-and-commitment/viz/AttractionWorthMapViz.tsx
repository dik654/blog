import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison(5·6절의 두 빈틈을 함께 씀) — 주관적 끌림 × 객관적 가치 네 칸에
 * 주관주의·객관주의·결합설이 각각 어느 칸을 의미 있다고 세는지, 어느 칸에서 반례가 생기는지.
 * 칸 = [끌림O·가치O, 끌림O·가치X, 끌림X·가치O, 끌림X·가치X].
 */
type Cell = { key: string; title: string; body: string };
type Mark = "count" | "problem" | "off";

const CELLS: readonly Cell[] = [
  { key: "both", title: "끌림 있음 · 가치 있음", body: "과학을 가르치는 관심이 실제 도움과 관계로 이어짐" },
  { key: "liked", title: "끌림 있음 · 가치 없음", body: "좋아하지만 해로운 일 (잔인한 목표, 조작된 욕구)" },
  { key: "valued", title: "끌림 없음 · 가치 있음", body: "가치 있지만 무관심한 일 (관심도 선택도 없이 남의 기준대로)" },
  { key: "neither", title: "끌림 없음 · 가치 없음", body: "이 글에서 따로 다루지 않음" },
];

const SCENES: readonly { label: string; summary: string; marks: readonly [Mark, Mark, Mark, Mark]; note: string }[] = [
  {
    label: "두 축으로 네 칸을 만듭니다",
    summary: "끌림 × 가치",
    marks: ["off", "off", "off", "off"],
    note: "주관적 끌림은 어떤 일을 자기 것으로 여기고 관심과 만족을 느끼는 조건이고, 객관적 가치는 지금의 선호와 별개로 추구할 이유가 있다고 평가되는 좋음입니다. 있음·없음 두 칸으로 자른 것은 설명을 위한 단순화(가정)입니다.",
  },
  {
    label: "주관주의: 끌림 줄을 셉니다",
    summary: "윗줄 두 칸",
    marks: ["count", "problem", "off", "off"],
    note: "원하는 목표와의 연결을 강조해 소외된 삶을 피합니다. 대신 강하게 원하기만 하면 의미가 된다면, 잔인한 목표나 조작된 욕구도 의미를 줄 수 있다는 문제가 생깁니다.",
  },
  {
    label: "객관주의: 가치 칸을 셉니다",
    summary: "왼쪽 열 두 칸",
    marks: ["count", "off", "problem", "off"],
    note: "가치가 욕구에만 달리지 않는다고 보아 해롭거나 하찮은 목표의 문제를 다룹니다. 대신 정해진 가치만으로 의미가 정해진다면, 관심도 선택도 없이 남의 기준에 따라 산 사람도 완전히 의미 있다고 해야 할 수 있습니다.",
  },
  {
    label: "결합설: 두 축이 만나는 칸",
    summary: "왼쪽 위 한 칸",
    marks: ["count", "off", "off", "off"],
    note: "가치 있는 대상에 긍정적으로 관여할 때 의미가 커진다고 봅니다. 다만 무엇이 객관적으로 가치 있는지, 얼마만큼의 끌림이 필요한지는 여전히 논쟁이라 칸의 경계가 저절로 정해지지는 않습니다.",
  },
];

const STYLE: Record<Mark, { border: string; bg: string; tag: string; color: string }> = {
  count: { border: "#2563eb", bg: "#2563eb1a", tag: "의미로 셈", color: "#2563eb" },
  problem: { border: "#dc2626", bg: "#dc26260f", tag: "의미로 세지만 반례가 됨", color: "#dc2626" },
  off: { border: "#94a3b8", bg: "transparent", tag: "", color: "#94a3b8" },
};

export default function AttractionWorthMapViz() {
  return (
    <SceneShell
      eyebrow="세 입장 비교"
      title="끌림과 가치의 네 칸에서 세 입장이 고르는 곳"
      description="가로는 객관적 가치, 세로는 주관적 끌림입니다. 파란 칸은 그 입장이 의미 있다고 세는 곳, 빨간 점선 칸은 그 입장이 의미로 세지만 5절이 반례로 든 곳입니다."
      ariaLabel="주관적 끌림과 객관적 가치의 네 조합에서 주관주의, 객관주의, 결합설이 의미 있다고 보는 칸과 반례 칸"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-2 text-sm">
              <span />
              <span className="text-center text-xs font-semibold text-muted-foreground">가치 있음</span>
              <span className="text-center text-xs font-semibold text-muted-foreground">가치 없음</span>
              {[0, 1].map((row) => (
                <div key={row} className="contents">
                  <span className="flex items-center justify-center text-xs font-semibold text-muted-foreground [writing-mode:vertical-rl]">
                    {row === 0 ? "끌림 있음" : "끌림 없음"}
                  </span>
                  {[0, 1].map((col) => {
                    const index = row === 0 ? (col === 0 ? 0 : 1) : col === 0 ? 2 : 3;
                    const cell = CELLS[index];
                    const mark: Mark = (scene.marks as readonly Mark[])[index];
                    const style = STYLE[mark];
                    return (
                      <div
                        key={cell.key}
                        className="min-h-[7.5rem] min-w-0 rounded-lg border px-2.5 py-2"
                        style={{ borderColor: style.border, backgroundColor: style.bg, borderStyle: mark === "problem" ? "dashed" : "solid" }}
                      >
                        <span className="block text-[11px] text-muted-foreground">{cell.title}</span>
                        <span className={`mt-1 block leading-6 ${mark === "off" ? "text-muted-foreground" : "font-semibold"}`}>{cell.body}</span>
                        <span className="mt-1 block text-xs font-bold" style={{ color: style.color }}>{style.tag}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
