import SceneShell from "./SceneShell";

/**
 * 본문 대응: #roundabout — 60을 내기 전과 낸 뒤에 같은 숫자의 역할이 달라진다.
 * 투자 전 20개: B 60+80=140, A 200. 60 지출 후 새 주문 5개: B 추가 20, A 50. 60을 다시 넣으면 80 대 50.
 */
const STEPS = ["설비 없음", "B에 60 지출", "새 주문 5개"] as const;

type Verdict = "pick" | "plain" | "wrong";

const SCENES: ReadonlyArray<{
  label: string;
  summary: string;
  note: string;
  at: number;
  spent: string;
  rows: ReadonlyArray<{ name: string; calc: string; verdict: Verdict }>;
  caption: string;
}> = [
  {
    label: "투자 전: 20개 주문",
    summary: "B 140 < A 200",
    at: 0,
    spent: "아직 없음",
    rows: [
      { name: "B 새로 선택", calc: "60 + 4 × 20 = 140", verdict: "pick" },
      { name: "A 새로 선택", calc: "10 × 20 = 200", verdict: "plain" },
    ],
    caption: "60도 앞으로 낼 돈이므로 비교에 들어갑니다.",
    note: "아무 설비도 없을 때는 B를 고르면 60을 먼저 쓰고 가공하며 80을 더 씁니다. 140을 회수할 수 있는지는 판매가격과 대금 지급일을 따로 알아야 합니다. 가장 싼 방법이 곧 이익을 내는 주문은 아닙니다.",
  },
  {
    label: "60을 쓴 뒤: 새 주문 5개",
    summary: "B 추가 20 < A 50",
    at: 2,
    spent: "B 설비 60 · 돌려받을 수 없음(가정)",
    rows: [
      { name: "B 계속 사용", calc: "4 × 5 = 20", verdict: "pick" },
      { name: "A 새로 선택", calc: "10 × 5 = 50", verdict: "plain" },
    ],
    caption: "이미 쓴 60은 어느 쪽을 골라도 돌아오지 않습니다.",
    note: "(가정) 60은 이미 썼고 돌려받을 수 없으며 새 주문 5개를 처리할 여력이 남았습니다. 이 주문 때문에 추가로 쓰는 돈은 B가 20, A가 50이므로 B를 계속 씁니다.",
  },
  {
    label: "60을 다시 넣으면",
    summary: "80 대 50 → 선택이 바뀜",
    at: 2,
    spent: "B 설비 60 · 돌려받을 수 없음(가정)",
    rows: [
      { name: "B 계속 사용", calc: "60 + 20 = 80", verdict: "wrong" },
      { name: "A 새로 선택", calc: "10 × 5 = 50", verdict: "plain" },
    ],
    caption: "이미 쓴 60을 이 주문의 추가 비용에 다시 더한 비교입니다.",
    note: "지출이 끝난 60을 새 주문의 비용에 다시 넣으면 B가 80, A가 50으로 보여 A를 고르게 됩니다. 실제로 이 주문 때문에 늘어나는 돈은 B 20, A 50이므로 이후 선택이 달라집니다.",
  },
  {
    label: "앞으로 달라지는 비용",
    summary: "되팔기·다른 주문·정비",
    at: 2,
    spent: "B 설비 60 · 지출 끝",
    rows: [
      { name: "B 계속 사용", calc: "20 + 아래 항목이 있으면 그 금액", verdict: "plain" },
      { name: "A 새로 선택", calc: "10 × 5 = 50", verdict: "plain" },
    ],
    caption: "되팔 수 있는 설비의 가치, 다른 주문에 쓸 기회, 정비나 가동 재개 비용이 있으면 앞으로 달라지는 비용에 넣습니다.",
    note: "이 계산은 과거의 투자가 성공했다는 판정이 아닙니다. 위 항목의 크기는 본문에 정해지지 않았으므로 숫자를 적지 않았습니다. 같은 60이라도 투자 전 비교와 지출 후 비교에서 역할이 다릅니다.",
  },
];

const VERDICT_TEXT: Record<Verdict, string> = { pick: "더 적음", plain: "", wrong: "잘못 더한 값" };

export default function SunkCostViz() {
  return (
    <SceneShell
      eyebrow="비교 시점"
      title="이미 쓴 60은 새 주문의 비교에서 빠진다"
      description="위 띠는 시간 순서입니다. 아래 두 칸은 그 시점에서 각 방법을 고를 때 앞으로 새로 쓰는 돈입니다. 이미 지출해 돌려받을 수 없는 돈은 '이미 쓴 돈' 상자에 따로 둡니다."
      note="(가정) 같은 화폐 단위의 설명용 숫자이며 B 설비에 새 주문을 처리할 여력이 남았다고 둡니다."
      ariaLabel="B 설비 60 지출 전후의 비용 비교"
      scenes={SCENES}
      render={(index) => {
        const s = SCENES[index];
        return (
          <div className="min-w-0 space-y-4">
            <ol className="grid grid-cols-3 gap-1 text-center text-[11px] sm:text-xs">
              {STEPS.map((step, k) => (
                <li
                  key={step}
                  className={`rounded-sm border px-1 py-1.5 ${k === s.at ? "border-primary font-bold text-primary" : k < s.at ? "border-border text-foreground" : "border-dashed border-border text-muted-foreground"}`}
                >
                  {k === s.at ? "지금 · " : ""}{step}
                </li>
              ))}
            </ol>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <div className="rounded-sm border border-dashed border-border px-3 py-2 text-xs leading-5 sm:text-sm">
                <p className="font-bold text-muted-foreground">이미 쓴 돈</p>
                <p className="mt-1">{s.spent}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold sm:text-sm">이 선택으로 새로 쓰는 돈</p>
                {s.rows.map((row) => (
                  <div
                    key={row.name}
                    className={`flex flex-wrap items-baseline justify-between gap-x-2 border-l-2 pl-2 text-xs leading-5 sm:text-sm ${row.verdict === "pick" ? "border-blue-600" : row.verdict === "wrong" ? "border-red-600" : "border-border"}`}
                  >
                    <span className="font-bold">{row.name}</span>
                    <span className="font-mono">{row.calc}</span>
                    {VERDICT_TEXT[row.verdict] ? (
                      <span className={`w-full text-[11px] font-bold ${row.verdict === "pick" ? "text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400"}`}>
                        {VERDICT_TEXT[row.verdict]}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">{s.caption}</p>
          </div>
        );
      }}
    />
  );
}
