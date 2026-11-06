import SceneShell from "./SceneShell";
import { Bracket, Legend, PriceBar } from "./PriceBar";
import { ASSEMBLY, LOGISTICS, MAKE, PART, RETAIL } from "./colors";

/**
 * 본문 대응: #case — 100달러를 60·10·30으로 나누고, 제조 60달러를 다시 40·20으로 엽니다.
 * 금액은 전부 본문의 (가정)이며 같은 폭 비례를 씁니다.
 */
const SCENES = [
  { label: "손님이 낸 돈", summary: "100달러", note: "손님이 낸 최종 소비가격 100달러를 한 덩어리로 놓습니다. 세금 등은 생략한 (가정)입니다." },
  { label: "세 단계로 나눕니다", summary: "60 + 10 + 30 = 100", note: "제조단계 60달러, 이후 국제 물류 10달러, 판매·브랜드 단계 30달러입니다. 합이 100달러로 맞습니다." },
  { label: "제조 60달러를 엽니다", summary: "40 + 20 = 60", note: "제조 60달러 안에는 다른 나라에서 들여온 부품 40달러와 조립국이 더한 20달러가 있습니다. 20달러는 회사의 순이익만이 아니라 노동과 자본 등에 돌아갈 몫을 포함합니다." },
  { label: "수출액으로 쓰는 값", summary: "60달러, 100달러 아님", note: "조립국에서 나갈 때의 거래가격은 이 사례에서 60달러이고, 이를 수출 통계 가격과 같게 둡니다. 현실의 거래가격·세관 평가액·부가가치 통계가 항상 이렇게 일치하는 것은 아닙니다." },
] as const;

export default function PriceSplitViz() {
  return (
    <SceneShell
      eyebrow="(가정) 100달러 제품"
      title="100달러를 나눈 뒤, 60달러 칸을 다시 엽니다"
      description="막대의 폭이 금액입니다. 모든 줄이 같은 비례를 쓰므로 윗줄의 60달러 칸과 아랫줄 전체의 폭이 같습니다."
      ariaLabel="최종 소비가격 100달러를 제조 60, 물류 10, 판매 30으로 나누고 제조 60을 부품 40과 조립 20으로 나누는 그림"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className={`flex ${active === 3 ? "" : "invisible"}`} aria-hidden={active !== 3}>
            <Bracket value={60} text="조립국 출하 = 수출 통계값 60" color={ASSEMBLY} />
          </div>
          <p className="mb-1 mt-2 text-xs font-bold text-muted-foreground">손님이 낸 돈</p>
          <PriceBar
            segs={
              active === 0
                ? [{ value: 100, color: MAKE, text: "100달러" }]
                : [
                    { value: 60, color: MAKE, text: "제조 60" },
                    { value: 10, color: LOGISTICS },
                    { value: 30, color: RETAIL, text: "판매 30" },
                  ]
            }
          />
          <Legend items={active === 0 ? [{ color: MAKE, text: "최종 소비가격 100" }] : [{ color: MAKE, text: "제조단계 60" }, { color: LOGISTICS, text: "국제 물류 10" }, { color: RETAIL, text: "판매·브랜드 30" }]} />
          <div className={active >= 2 ? "" : "invisible"} aria-hidden={active < 2}>
            <div className="mt-2 h-3 border-x border-b border-dashed border-slate-400" style={{ width: "60%" }} />
            <p className="mb-1 mt-2 text-xs font-bold text-muted-foreground">제조 60달러의 안쪽</p>
            <div style={{ width: "60%" }}>
              <PriceBar scale={60} segs={[{ value: 40, color: PART, text: "부품 40" }, { value: 20, color: ASSEMBLY, text: "20" }]} />
            </div>
            <Legend items={[{ color: PART, text: "다른 나라 부품 40" }, { color: ASSEMBLY, text: "조립국이 더한 20" }]} />
          </div>
        </div>
      )}
    />
  );
}
