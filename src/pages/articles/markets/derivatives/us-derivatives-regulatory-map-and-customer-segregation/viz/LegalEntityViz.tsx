import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 한 금융그룹이 FCM·스왑딜러·증권기반스왑딜러·증권회사를 서로 다른 법인으로 운영할 수 있다.
 * 앱과 영업 담당자가 같아 보여도 고객 돈이 놓이는 계정과 파산 절차는 달라질 수 있다.
 * 계약별로 어느 법인이 맡는지는 본문의 예(선물 계좌·금리스왑·한 회사 신용스왑)에 맞춘 가정이다.
 * 확인서에 남길 칸: 법인명·상품 분류·청산 여부·담보 계정.
 */
const ENTITIES = [
  { name: "FCM", contract: "선물 계좌" },
  { name: "스왑딜러", contract: "금리스왑" },
  { name: "증권기반스왑딜러", contract: "한 회사 신용스왑" },
  { name: "증권회사", contract: "" },
] as const;

const RECORD = ["법인명", "상품 분류", "청산 여부", "담보 계정"] as const;

const SCENES = [
  { label: "밖에서 보이는 것", summary: "브랜드 하나 · 같은 앱 · 같은 담당자", stage: 0, note: "고객 눈에는 한 금융그룹의 이름과 앱, 영업 담당자만 보입니다." },
  { label: "안쪽의 법인들", summary: "역할마다 다른 법인일 수 있음", stage: 1, note: "같은 그룹이 FCM, 스왑딜러, 증권기반스왑딜러와 증권회사를 서로 다른 법인으로 운영할 수 있습니다. 브랜드는 하나여도 계약서의 법적 상대는 하나가 아닐 수 있습니다." },
  { label: "계약마다 다른 상대", summary: "계정·파산 절차도 달라질 수 있음", stage: 2, note: "선물 계좌는 FCM, 금리스왑은 스왑딜러, 한 회사 신용스왑은 증권기반스왑딜러와 맺는다고 두면(가정) 고객 돈이 놓이는 계정과 파산 절차가 계약마다 달라질 수 있습니다." },
  { label: "확인서에 남길 네 칸", summary: "법인명 · 상품 분류 · 청산 여부 · 담보 계정", stage: 3, note: "계약 확인서에 이 네 칸을 남겨 둡니다. 민원이나 부도 뒤 브랜드 이름만으로 보호 규칙을 찾으면 잘못된 제도를 적용할 수 있습니다." },
] as const;

export default function LegalEntityViz() {
  return (
    <SceneShell
      eyebrow="브랜드와 법인"
      title="같은 은행 이름 아래 계약마다 다른 법인이 서 있을 수 있습니다"
      description="바깥 틀은 고객이 보는 브랜드, 안쪽 칸은 등록 역할이 다른 법인입니다. 스왑딜러는 스왑을, 증권기반스왑딜러는 증권기반스왑을 거래상대로서 다루는 등록 역할입니다. 그룹 구성은 5절의 가능성을 그린 예입니다(가정)."
      ariaLabel="한 금융그룹 브랜드 아래 FCM, 스왑딜러, 증권기반스왑딜러, 증권회사가 다른 법인으로 있고 계약마다 법적 상대와 계정이 달라지는 그림"
      scenes={SCENES}
      render={(active) => {
        const stage = SCENES[active].stage;
        return (
          <div className="min-w-0 space-y-3">
            <div className="min-w-0 rounded-lg border border-border px-2 py-2 sm:px-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                <span className="font-bold">금융그룹 브랜드</span>
                <span className="text-muted-foreground">앱 하나 · 담당자 한 명</span>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-2">
                {ENTITIES.map((entity) => {
                  const linked = stage >= 2 && entity.contract !== "";
                  return (
                    <li key={entity.name} className={`min-w-0 rounded-lg border px-2 py-1.5 text-xs leading-5 ${stage === 0 ? "border-dashed border-border/40 text-transparent" : linked ? "border-blue-600 bg-background" : "border-border bg-background"}`}>
                      <span className="block font-semibold">{entity.name}</span>
                      <span className={`block text-[11px] ${stage === 0 ? "" : "text-muted-foreground"}`}>별도 법인</span>
                      <span className={`mt-1 block border-t border-border/60 pt-1 text-[11px] ${linked ? "font-semibold text-blue-700 dark:text-blue-300" : "text-transparent"}`} aria-hidden={!linked}>
                        {entity.contract || "—"}
                      </span>
                      <span className={`block text-[11px] ${linked ? "text-muted-foreground" : "text-transparent"}`} aria-hidden={!linked}>계정·파산 절차</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className={`min-w-0 rounded-lg border px-3 py-2 ${stage === 3 ? "border-amber-600" : "border-dashed border-border/50 opacity-30"}`}>
              <p className="text-xs font-bold">계약 확인서</p>
              <ul className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {RECORD.map((item) => (
                  <li key={item} className="rounded border border-border px-1.5 py-1 text-center text-[11px] leading-5">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
