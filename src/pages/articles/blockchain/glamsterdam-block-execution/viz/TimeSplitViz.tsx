import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 둘째 문단 — 제안 검증자에게 몰린 일과, 만들기·공개 책임을 분리할 때.
 * 본문에 시간 값이 없으므로 칸 폭은 같게 두었습니다. 분리 뒤의 합의 투표 위치도 단정하지 않습니다.
 */
const SPLIT = [
  { who: "내용 제작자", what: "거래 내용을 만듦" },
  { who: "제안자", what: "내용이 아닌 약속을 블록에 담음" },
  { who: "내용 제작자", what: "실제 내용을 공개", risk: true },
  { who: "검증", what: "도착 확인과 실행 검사를 나눠 수행" },
];

const SCENES = [
  { label: "한 사람에게 몰릴 때", summary: "합의 투표 전 시간이 짧아짐", note: "블록을 제안하는 검증자가 무거운 거래 내용까지 모두 받아 즉시 실행해야 하면, 합의 투표 전 시간이 짧아집니다." },
  { label: "책임을 나누면", summary: "시간 배분을 바꿀 수 있음", note: "거래 내용을 만들고 공개하는 책임을 분리하면 시간 배분을 바꿀 수 있습니다. 실제 구간 길이와 분리 뒤 합의 투표의 자리는 이 글에 없어 그리지 않았습니다." },
  { label: "새로 생기는 경우", summary: "숨기거나 늦게 보내면?", note: "자료를 숨기거나 늦게 보내는 경우까지 규칙으로 다뤄야 합니다. 7절과 10절에서 이어집니다." },
] as const;

export default function TimeSplitViz() {
  return (
    <SceneShell
      eyebrow="시간 배분"
      title="무거운 내용을 제안 순간에서 떼어 내면 일의 자리가 바뀝니다"
      description="칸은 일의 순서이고, 칸 크기는 시간이 아닙니다."
      ariaLabel="제안자에게 몰린 작업과 책임을 나눈 작업 순서 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] sm:items-stretch">
              <div className="min-w-0 rounded-lg border p-3" style={{ borderColor: "#dc2626", backgroundColor: "#dc262614" }}>
                <p className="text-xs font-bold">제안자(블록을 제안하는 검증자) 한 곳</p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs font-medium leading-5 sm:text-sm">
                  {["제안", "무거운 거래 내용 받기", "즉시 실행"].map((item) => <span key={item} className="rounded-md border border-border bg-background px-1 py-2">{item}</span>)}
                </div>
              </div>
              <div className="flex items-center justify-center rounded-lg border border-border bg-background px-2 py-3 text-center text-sm font-semibold">합의 투표</div>
            </div>
          );
        }
        return (
          <ol className="grid min-w-0 gap-2 sm:grid-cols-4">
            {SPLIT.map((step) => {
              const risk = active === 2 && step.risk;
              return (
                <li key={step.what} className={`min-w-0 rounded-lg border px-3 py-2 ${risk ? "border-dashed" : "border-border bg-background"}`} style={risk ? { borderColor: "#dc2626", backgroundColor: "#dc262614" } : undefined}>
                  <span className="block text-xs text-muted-foreground">{step.who}</span>
                  <span className="block text-sm font-semibold leading-5">{step.what}</span>
                  {step.risk && <span className={`mt-1 block text-xs font-semibold ${active === 2 ? "" : "invisible"}`} style={{ color: "#dc2626" }}>숨김·지연이 생길 수 있는 자리</span>}
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
