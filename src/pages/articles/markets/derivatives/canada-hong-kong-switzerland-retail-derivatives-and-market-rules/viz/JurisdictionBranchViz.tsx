import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture(4절), #names(6절) — 같은 사실관계(예치금 20×5배=노출 100, 12% 하락 손실 12 > 한도 10)가
 * 캐나다는 당사자 지위, 홍콩은 복잡상품 판단과 권유 여부, 스위스는 서비스 종류에서 출발한다.
 * 갈래 이름과 결과는 본문 문장만 옮기며, 본문이 정하지 않은 결론(어느 쪽이 허용·금지인지)은 적지 않는다.
 */
const CASE_FACT = { deposit: 20, leverage: 5, dropPercent: 12, limit: 10 };
const EXPOSURE = CASE_FACT.deposit * CASE_FACT.leverage;
const LOSS = (EXPOSURE * CASE_FACT.dropPercent) / 100;
const OVER = LOSS - CASE_FACT.limit;

interface Branch {
  when: string;
  then: string;
}

interface Jurisdiction {
  name: string;
  short: string;
  start: string;
  branches: readonly Branch[];
}

const JURISDICTIONS: readonly Jurisdiction[] = [
  {
    name: "캐나다",
    short: "고객: 당사자 지위",
    start: "당사자 지위는?",
    branches: [
      { when: "비적격 당사자 · 보호를 포기하지 않은 일부 적격 당사자", then: "추가 의무: 필요·목표·재무상황·위험감내도 확인, 거래 적합성 확인" },
      { when: "그 밖의 당사자", then: "같은 추가 의무가 모두 적용되지는 않음 · 범위는 현재 통합본 확인" },
    ],
  },
  {
    name: "홍콩",
    short: "상품: 복잡상품·권유",
    start: "복잡상품인가? (장내 파생상품도 목록 확인)",
    branches: [
      { when: "권유·추천이 있음", then: "적합성 적용 여부를 거래 장소와 함께 가림" },
      { when: "권유 없는 장내 거래", then: "예외가 있어도 파생상품 지식·위험 설명 요건은 따로 봄" },
    ],
  },
  {
    name: "스위스",
    short: "서비스: 실행·자문·일임",
    start: "어떤 서비스인가?",
    branches: [
      { when: "단순 실행 · 개별 거래 자문 · 포트폴리오 고려 자문·일임", then: "검사 면제(사전 고지) · 적정성 · 적합성으로 갈림" },
      { when: "확인하는 고객 정보", then: "적정성은 지식·경험, 적합성은 재무상황·목표와 지식·경험" },
    ],
  },
];

const SCENES = [
  { label: "공통 사실관계", summary: `손실 ${LOSS} > 한도 ${CASE_FACT.limit} (${OVER} 초과)`, note: "세 관할 모두 같은 숫자에서 출발합니다. 예치금 20의 5배 노출 100이 12% 불리하게 움직이면 단순 손실 12가 고객 한도 10을 2 넘습니다. 이 숫자가 어떤 규칙을 여는지는 관할마다 다릅니다." },
  { label: "캐나다: 고객부터", summary: "당사자 지위 → 추가 의무 범위", note: "캐나다는 파생상품 당사자의 지위를 먼저 봅니다. 비적격 당사자와 보호를 포기하지 않은 일부 적격 당사자에게 추가 의무가 적용됩니다." },
  { label: "홍콩: 상품부터", summary: "복잡상품 판단 → 권유 여부", note: "홍콩은 장내 파생상품도 복잡상품 목록과 파생상품 지식 요건을 확인하고, 권유·추천과 거래 장소에 따라 적합성 적용을 가립니다." },
  { label: "스위스: 서비스부터", summary: "실행·자문·일임 → 다른 검사", note: "스위스는 제공하는 서비스에 따라 질문이 달라집니다. 주문의 단순 실행·전달은 두 검사가 면제되고, 개별 거래 자문은 적정성, 포트폴리오를 고려한 자문과 일임은 적합성을 봅니다." },
  { label: "세 출발점 나란히", summary: "고객 · 상품 · 서비스", note: "같은 손실 12라도 먼저 여는 칸이 고객 지위, 상품 복잡성, 서비스 종류로 다릅니다. 하나의 비교표로 합치면 예외를 놓치며, 2026년 이후 개정과 감독 지침은 거래 시점에 다시 확인해야 합니다." },
] as const;

export default function JurisdictionBranchViz() {
  return (
    <SceneShell
      eyebrow="세 관할의 출발 질문"
      title="같은 손실 12가 세 나라에서 다른 첫 질문을 엽니다"
      description="적합성은 상품·거래가 고객의 목표·재무상황 등에 맞는지 보는 검사이고, 적정성은 고객이 그 상품을 이해할 지식·경험이 있는지 보는 검사입니다. 갈래는 본문이 적은 조건만 옮겼으며 교육용 정리로, 특정 고객에 대한 법률 의견이 아닙니다."
      ariaLabel="캐나다, 홍콩, 스위스가 같은 파생상품 사례에서 각각 고객 지위, 복잡상품, 서비스 종류로 출발하는 갈래"
      scenes={SCENES}
      render={(active) => {
        const place = active >= 1 && active <= 3 ? JURISDICTIONS[active - 1] : null;
        return (
          <div className="min-w-0 space-y-3">
            <div className={`rounded-lg border px-3 py-2 text-xs leading-5 sm:text-sm ${active === 0 ? "border-primary" : "border-border opacity-60"}`}>
              <span className="font-bold">공통 사실</span>
              <span className="ml-2 font-mono">{`${CASE_FACT.deposit} × ${CASE_FACT.leverage}배 = 노출 ${EXPOSURE} → 12% 하락 손실 ${LOSS} · 한도 ${CASE_FACT.limit}보다 ${OVER} 큼`}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {JURISDICTIONS.map((item, index) => {
                const on = active === index + 1 || active === 4;
                return (
                  <div key={item.name} className={`min-w-0 rounded-lg border px-2 py-2 text-center ${on ? "border-primary" : "border-border opacity-50"}`}>
                    <span className="block text-sm font-bold">{item.name}</span>
                    <span className="block text-xs leading-5 text-muted-foreground">{item.short}</span>
                  </div>
                );
              })}
            </div>
            <div className="min-w-0 rounded-lg border border-border px-3 py-3">
              {place ? (
                <>
                  <p className="rounded-md border border-dashed border-primary px-2 py-1 text-xs leading-5 sm:text-sm">
                    <span className="font-bold">{place.name} 출발 질문</span> · {place.start}
                  </p>
                  <div className="mt-3 space-y-3">
                    {place.branches.map((branch) => (
                      <div key={branch.when} className="border-l border-primary/60 pl-3 text-xs leading-5 sm:text-sm">
                        <span className="block font-semibold">{branch.when}</span>
                        <span className="block text-muted-foreground">→ {branch.then}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : active === 0 ? (
                <p className="text-xs leading-6 text-muted-foreground sm:text-sm">세 관할 모두 고객과 상품을 확인합니다. 다만 위 숫자를 들고 가장 먼저 여는 칸이 다릅니다. 다음 장면부터 한 나라씩 출발 질문과 갈래를 엽니다.</p>
              ) : (
                <p className="text-xs leading-6 text-muted-foreground sm:text-sm">한 표로 합치지 않는 이유: 캐나다는 주별 규제와 전국 규칙의 적용, 홍콩은 거래 장소·권유와 상품 유형, 스위스는 고객 구분·서비스 종류와 국경 간 제공 방식이 결론을 바꿉니다. 회사의 면허와 계약 법인도 중요합니다.</p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
