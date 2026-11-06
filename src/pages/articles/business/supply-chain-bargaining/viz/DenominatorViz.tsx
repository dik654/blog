import SceneShell from "./SceneShell";
import { PriceBar } from "./PriceBar";
import { ASSEMBLY, LOGISTICS, PART, RETAIL } from "./colors";

/**
 * 본문 대응: #source — 같은 20달러도 분모에 따라 33.3%(20÷60)와 20%(20÷100)로 읽힙니다.
 * 물류 10달러와 판매 30달러는 그 회사가 사 쓴 중간 서비스 비용을 확인하기 전이라 점선으로 둡니다.
 */
const SCENES = [
  { label: "분모 60", summary: "20 ÷ 60 ≈ 33.3%", note: "조립국 수출 60달러 가운데 국내에서 더한 몫이 20달러입니다. 수출의 국내 몫 비율은 약 33.3%입니다." },
  { label: "분모 100", summary: "20 ÷ 100 = 20%", note: "같은 20달러를 최종 소비가격 100달러로 나누면 20%입니다. 33.3%가 줄어든 것이 아니라 다른 분모의 숫자입니다." },
  { label: "점선 칸의 성격", summary: "10달러, 30달러는 미확정", note: "물류 10달러와 판매 30달러도 그 회사가 사 쓴 중간 서비스 비용을 확인하기 전에는 전부 부가가치라고 부르지 않습니다." },
] as const;

export default function DenominatorViz() {
  return (
    <SceneShell
      eyebrow="(가정) 같은 20달러, 다른 분모"
      title="20달러가 33.3%도 되고 20%도 되는 이유"
      description="파란 칸은 두 줄 모두 같은 폭의 20달러입니다. 달라지는 것은 그 칸을 무엇으로 나누는지, 곧 막대 전체의 길이입니다."
      ariaLabel="20달러를 60달러로 나눈 33.3퍼센트와 100달러로 나눈 20퍼센트 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className={`mb-1 text-xs font-bold ${active === 0 ? "text-foreground" : "text-muted-foreground"}`}>조립국 수출 60달러</p>
          <div style={{ width: "60%" }}>
            <PriceBar scale={60} segs={[{ value: 40, color: PART, text: "외국 40" }, { value: 20, color: ASSEMBLY }]} />
          </div>
          <div className={active >= 1 ? "" : "invisible"} aria-hidden={active < 1}>
            <p className={`mb-1 mt-4 text-xs font-bold ${active === 1 ? "text-foreground" : "text-muted-foreground"}`}>최종 소비가격 100달러</p>
            <PriceBar
              segs={[
                { value: 40, color: PART, text: "외국 40" },
                { value: 20, color: ASSEMBLY },
                { value: 10, color: LOGISTICS, open: active === 2 },
                { value: 30, color: RETAIL, text: "판매 30", open: active === 2 },
              ]}
            />
          </div>
        </div>
      )}
    />
  );
}
