import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가용 예산 100의 다섯 칸(30·25·20·15·10)과 외부 자금 두 가지.
 * 칸 폭은 장면마다 그대로 둔다. 원조·차관이 칸을 얼마나 바꾸는지는 본문에 수치가 없다.
 */
const SLOTS = [
  { key: "life", name: "생활 역량", value: 30, detail: "식량·보건·교육", color: "#2563eb" },
  { key: "infra", name: "기반 시설", value: 25, detail: "도로·전력·항만", color: "#64748b" },
  { key: "security", name: "안보", value: 20, detail: "국방·국경 관리", color: "#94a3b8" },
  { key: "external", name: "대외 지급", value: 15, detail: "외채 상환·필수 수입", color: "#d97706" },
  { key: "reserve", name: "준비금", value: 10, detail: "흉작·유가 상승 대비", color: "#16a34a" },
] as const;

type SlotKey = (typeof SLOTS)[number]["key"];

const SCENES = [
  {
    label: "외부 자금이 오기 전",
    summary: "30 + 25 + 20 + 15 + 10 = 100",
    note: "막대 폭이 예산 몫입니다. 숫자는 실제 국가의 평균이 아니라 한 선택이 다른 선택을 줄이는 모습을 보이려는 가정입니다.",
    focus: [] as SlotKey[],
    money: "없음",
    change: "다섯 칸이 100을 나눠 씁니다",
    strings: "없음",
  },
  {
    label: "군사 원조 10을 받으면",
    summary: "안보 칸이 가벼워질 수 있음",
    note: "얼마나 가벼워지는지는 글에 수치가 없어 칸 폭을 그대로 두었습니다. 돈과 함께 올 수 있는 것은 아래 칸에 적었습니다.",
    focus: ["security"] as SlotKey[],
    money: "군사 원조 10",
    change: "국방 예산이 가벼워질 수 있음",
    strings: "특정 장비 구매·기지·외교 지지가 조건으로 붙을 수 있음",
  },
  {
    label: "개발 차관 20을 받으면",
    summary: "발전소는 앞당기고 상환이 남음",
    note: "기반 시설을 먼저 지을 수 있습니다. 차관 20은 막대 100에 더해지는 돈이라 칸 폭은 그대로 두었습니다. 대신 외화로 갚아야 한다면 그 상환은 수출 가격의 영향을 받게 됩니다.",
    focus: ["infra", "external"] as SlotKey[],
    money: "개발 차관 20",
    change: "발전소를 앞당겨 지음",
    strings: "외화로 갚아야 할 수 있음",
  },
  {
    label: "수출 가격이 떨어지면",
    summary: "교육·보건 몫이 줄 수 있음",
    note: "외화 상환이 걸린 상태에서 수출 가격이 떨어지는 경우입니다. 줄어드는 크기는 글에 수치가 없어 칸 폭을 그대로 두었습니다. 그래서 지원의 액수와 정책 선택권을 함께 봅니다.",
    focus: ["external", "life"] as SlotKey[],
    money: "개발 차관 20 (앞 장면과 같음)",
    change: "발전소는 지었지만 상환 부담이 남음",
    strings: "교육·보건 몫이 줄 수 있음",
  },
] as const;

function Row({ head, text, strong = false }: { head: string; text: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-3 border-t border-border/70 py-2 text-sm leading-6">
      <span className="text-xs leading-6 text-muted-foreground">{head}</span>
      <span className={strong ? "font-semibold" : ""}>{text}</span>
    </div>
  );
}

export default function BudgetStringsViz() {
  return (
    <SceneShell
      eyebrow="돈과 함께 오는 것"
      title="외부 자금은 예산 칸을 채우면서 조건도 가져올 수 있습니다"
      description="막대는 신생 국가 하나의 가용 예산 100입니다(가정). 굵은 테두리와 ▼ 표시가 이 장면에서 보는 칸입니다."
      ariaLabel="가용 예산 100의 다섯 칸과 군사 원조, 개발 차관에 따라올 수 있는 조건"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus = new Set<SlotKey>(scene.focus);
        return (
          <div className="min-w-0">
            <div className="flex h-5 text-center text-xs font-bold leading-5" aria-hidden>
              {SLOTS.map((slot) => (
                <span key={slot.key} style={{ width: `${slot.value}%` }}>{focus.has(slot.key) ? "▼" : ""}</span>
              ))}
            </div>
            <div className="flex h-11 w-full">
              {SLOTS.map((slot) => (
                <div
                  key={slot.key}
                  className={`flex items-center justify-center border text-sm font-bold text-white ${focus.has(slot.key) ? "border-foreground" : "border-background"}`}
                  style={{ width: `${slot.value}%`, backgroundColor: slot.color, opacity: scene.focus.length === 0 || focus.has(slot.key) ? 1 : 0.4 }}
                >
                  {slot.value}
                </div>
              ))}
            </div>
            <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1 text-xs leading-5 sm:grid-cols-2">
              {SLOTS.map((slot) => (
                <li key={slot.key} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: slot.color }} />
                  <span className={focus.has(slot.key) ? "font-bold" : "text-muted-foreground"}>
                    {slot.name} {slot.value} · {slot.detail}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Row head="들어오는 돈" text={scene.money} />
              <Row head="바뀔 수 있음" text={scene.change} />
              <Row head="따라올 수 있음" text={scene.strings} strong />
            </div>
          </div>
        );
      }}
    />
  );
}
