import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 체결 → 경제조건 맞춤·법률 확인서 → 매일 평가·증거금·보고 →
 * 이자 기준일 지급액 계산·결제 지시 → 수정·부분해지 같은 후속 사건.
 * 원거래 상태와 후속 사건을 함께 남기는 장부와 최신 상태만 덮어쓰는 장부를 비교한다.
 * 후속 사건으로 부분해지를 고른 것은 가정이다.
 */
const EVENTS = [
  { when: "체결", what: "거래가 체결되고 원거래가 장부에 생깁니다", state: "체결됨" },
  { when: "확인", what: "핵심 경제조건을 맞추고 법률 확인서를 완성합니다", state: "확인됨" },
  { when: "매일", what: "평가·증거금·보고 대상에 들어갑니다", state: "평가·증거금·보고 중" },
  { when: "이자 기준일", what: "지급액을 계산해 결제 지시를 보냅니다", state: "결제 지시 보냄" },
  { when: "후속 사건", what: "부분해지(가정)를 원거래에 이어 붙입니다", state: "부분해지 뒤 조건" },
] as const;

const SCENES = EVENTS.map((event, index) => ({
  label: `${index + 1}. ${event.when}`,
  summary: event.state,
  note: [
    "체결은 끝이 아니라 출발점입니다. 이 순간의 조건이 뒤의 모든 계산에 들어가는 원본입니다.",
    "양쪽이 명목·금리·날짜 같은 경제조건을 맞추고 법률 확인서를 완성합니다. 앞 단계 결과가 이 단계의 입력입니다.",
    "확인된 거래가 매일 평가·증거금·보고 대상에 들어갑니다. 이 단계는 한 번이 아니라 만기까지 매일 반복됩니다.",
    "이자 기준일에는 지급액을 계산해 결제 지시를 보냅니다. 사건을 남기는 장부는 네 줄로 늘었지만 덮어쓰는 장부는 여전히 한 줄입니다.",
    "부분해지가 생기면 사건을 남기는 장부는 원거래와 후속 사건을 함께 두고, 덮어쓰는 장부는 최신 상태만 남깁니다. 덮어쓰는 장부만으로는 과거 어느 시점에 무엇이 합의됐는지 증명하기 어렵습니다.",
  ][index],
}));

export default function EventLogViz() {
  return (
    <SceneShell
      eyebrow="체결 뒤 운영 사건"
      title="한 거래는 체결 뒤 여러 사건을 지나고, 그 기록을 남기는 방식이 둘로 갈립니다"
      description="위는 사건의 순서, 아래는 같은 사건을 두 방식으로 저장한 장부입니다. 후속 사건으로 부분해지를 고른 것은 가정입니다."
      ariaLabel="체결, 확인, 매일 평가와 증거금, 이자 기준일 결제 지시, 부분해지 순서로 진행하며 사건 기록 장부와 덮어쓰기 장부를 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <ol className="grid grid-cols-5 gap-1">
            {EVENTS.map((event, index) => {
              const done = index < active;
              const now = index === active;
              return (
                <li key={event.when} className="min-w-0 text-center">
                  <div className="h-1.5 rounded-sm" style={{ backgroundColor: now ? "#2563eb" : done ? "#93c5fd" : "#e2e8f0" }} />
                  <span className={`mt-1 block break-keep text-[11px] leading-4 ${now ? "font-bold" : done ? "" : "text-muted-foreground/60"}`}>{event.when}</span>
                </li>
              );
            })}
          </ol>
          <p className="mt-2 min-h-[2.5rem] text-sm leading-5">{EVENTS[active].what}</p>
          <div className="mt-3 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-lg border border-border p-3">
              <p className="text-xs font-bold">원거래 + 후속 사건을 남기는 장부</p>
              <ol className="mt-2 space-y-1">
                {EVENTS.map((event, index) => (
                  <li key={event.when} className={`flex gap-2 rounded-sm px-1.5 py-0.5 text-[11px] ${index <= active ? "bg-muted/50" : "text-transparent"}`}>
                    <span className="font-mono text-muted-foreground">{index <= active ? `#${index + 1}` : "#"}</span>
                    <span className="truncate">{event.state}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="min-w-0 rounded-lg border border-dashed border-border p-3">
              <p className="text-xs font-bold">최신 상태만 덮어쓰는 장부</p>
              <div className="mt-2 rounded-sm bg-muted/50 px-1.5 py-0.5 text-[11px]">
                <span className="font-mono text-muted-foreground">현재 </span>
                {EVENTS[active].state}
              </div>
              <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
                {active === 0 ? "아직 덮어쓴 상태가 없습니다." : `이전 상태 ${active}개는 남지 않았습니다.`}
              </p>
            </div>
          </div>
        </div>
      )}
    />
  );
}
