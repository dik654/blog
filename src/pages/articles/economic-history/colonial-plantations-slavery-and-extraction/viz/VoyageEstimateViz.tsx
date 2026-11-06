import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 기록된 항해(건)와 보정한 추정치(명)는 단위부터 다릅니다.
 * 승선 약 1,252만, 하선 약 1,070만 → 1,252 − 1,070 = 182, 글은 약 180만으로 적습니다.
 * 182 ÷ 1,252 ≈ 14.5%. 막대는 사람 수에만 쓰고 항해 건수는 같은 축에 올리지 않습니다.
 */
const EMBARKED = 1252;
const LANDED = 1070;

const SCENES = [
  { label: "기록: 항해 건수", summary: "34,948건", note: "이 데이터베이스를 지원한 미국 국립인문재단(NEH)의 소개에 따르면 기록된 항해는 57개 기여자의 자료에서 모은 34,948건입니다. 단위가 사람이 아니라 항해여서 아래 막대와 같은 축에 올릴 수 없습니다." },
  { label: "보정: 빠진 기록", summary: "별도의 추정 자료", note: "기록이 없는 항해와 불완전한 위치는 별도의 추정 자료와 방법 문서로 다룹니다. 빠진 항해가 몇 건인지는 이 글에 없어 칸을 그리지 않았습니다." },
  { label: "추정: 떠난 사람과 내린 사람", summary: "약 1,252만 → 약 1,070만", note: "사이트의 추정 페이지는 아프리카를 떠나 아메리카로 끌려간 사람을 약 1,252만 명, 주로 아메리카에 내린 사람을 약 1,070만 명으로 봅니다. 생존자 수의 기간을 NEH 소개는 1526~1866년으로 적습니다." },
  { label: "두 추정치의 차이", summary: "1,252 − 1,070 = 182 ≈ 약 180만", note: "두 막대의 끝 차이가 대서양 횡단 항해에서 숨진 사람의 규모입니다. 글은 약 180만 명으로 적으며, 승선 추정의 약 14.5%입니다(182 ÷ 1,252)." },
  { label: "세지 못하는 것", summary: "다른 자료와 함께", note: "이 자료는 규모와 경로, 항해 중 사망을 세는 데 강하지만 각자의 삶을 모두 담지 못합니다. 항구 장부는 거래 주체의 기록입니다. 구술, 재판 기록, 편지, 발굴 자료를 함께 읽어야 합니다." },
] as const;

function PeopleBar({ label, value, color, on }: { label: string; value: number; color: string; on: boolean }) {
  return (
    <div className={`grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm ${on ? "" : "opacity-30"}`}>
      <span className="font-semibold">{label}</span>
      <div className="relative h-6 min-w-0 rounded-sm bg-muted/40">
        <div className="flex h-full items-center justify-end rounded-sm pr-2 font-mono text-xs font-bold text-white" style={{ width: `${(value / EMBARKED) * 100}%`, backgroundColor: color }}>
          약 {value.toLocaleString("en-US")}만
        </div>
      </div>
    </div>
  );
}

export default function VoyageEstimateViz() {
  return (
    <SceneShell
      eyebrow="기록값과 추정값"
      title="항해 34,948건에서 약 180만 명의 차이까지"
      description="여기 적은 기록값은 항해 건수이고 추정값은 사람 수입니다. 막대는 사람 수에만 쓰며 길이는 약 1,252만 명을 기준으로 맞췄습니다. 승선은 배에 태워진 사람, 하선은 배에서 내린 사람입니다."
      ariaLabel="기록된 항해 건수, 추정 자료, 승선과 하선 추정치의 차이를 차례로 보는 장면"
      scenes={SCENES}
      render={(active) => {
        const gapLeft = (LANDED / EMBARKED) * 100;
        return (
          <div className="min-w-0 space-y-4" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <div className="grid grid-cols-2 gap-2">
              <div className={`rounded-lg border px-3 py-2 text-sm leading-6 ${active === 0 ? "border-primary" : "border-border opacity-40"}`}>
                <span className="block text-xs text-muted-foreground">기록된 항해</span>
                <span className="font-mono font-bold">34,948건</span>
              </div>
              <div className={`rounded-lg border border-dashed px-3 py-2 text-sm leading-6 ${active === 1 ? "border-primary" : "border-border opacity-40"}`}>
                <span className="block text-xs text-muted-foreground">기록에 빠진 항해</span>
                <span className="font-bold">이 글에 건수 없음</span>
              </div>
            </div>
            <div className="space-y-2">
              <PeopleBar label="승선" value={EMBARKED} color="#475569" on={active === 2 || active === 3} />
              <PeopleBar label="하선" value={LANDED} color="#2563eb" on={active === 2 || active === 3} />
              <div className="grid grid-cols-[3rem_minmax(0,1fr)] gap-2">
                <span />
                <div className="relative h-7 min-w-0">
                  <div className={`absolute inset-y-0 right-0 rounded-sm border border-red-600 ${active === 3 ? "" : "opacity-0"}`} style={{ left: `${gapLeft}%`, backgroundColor: "#dc262622" }} />
                  <span className={`absolute right-[calc(14.5%+0.5rem)] top-1 whitespace-nowrap text-xs font-bold text-red-700 dark:text-red-400 ${active === 3 ? "" : "opacity-0"}`}>항해 중 사망 약 180만 명 →</span>
                </div>
              </div>
            </div>
            <div className={`rounded-lg border border-dashed px-3 py-2 text-sm leading-6 ${active === 4 ? "border-primary" : "border-border opacity-40"}`}>
              <span className="font-semibold">숫자에 담기지 않는 각자의 삶</span>
              <span className="block text-muted-foreground">구술 · 재판 기록 · 편지 · 발굴 자료</span>
            </div>
          </div>
        );
      }}
    />
  );
}
