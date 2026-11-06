import SceneShell from "./SceneShell";
import { Bracket, Legend, PriceBar } from "./PriceBar";
import { LOGISTICS, MAKE, RETAIL, TARIFF } from "./colors";

/**
 * 본문 대응: #comparison — 과세가격 60 또는 70에 10%를 매기는 경우와, 운임 제외 관세 6달러가 지나가는 두 경로입니다.
 * 60 + 10 + 6 + 24 = 100, 60 + 10 + 30 + 6 = 106. 세율과 과세가격은 본문의 가정이며 실제 국가·품목의 값이 아닙니다.
 */
const SCALE = 110;
const MAKE_SEG = { value: 60, color: MAKE, text: "제조 60" };
const LOG_SEG = { value: 10, color: LOGISTICS };

const SCENES = [
  { label: "관세 전", summary: "60 + 10 + 30 = 100", note: "지금까지의 사례입니다. 여기에 완제품을 들여오는 판매자가 10% 관세를 부담하는 경우를 추가로 가정합니다. 실제 국가·품목의 세율이 아닙니다." },
  { label: "운임을 빼는 나라", summary: "60 × 0.1 = 6달러", note: "과세가격은 관세를 매기는 기준 금액입니다. 운임을 빼는 나라라면 60달러가 기준이어서 관세는 6달러입니다." },
  { label: "운임을 넣는 나라", summary: "70 × 0.1 = 7달러", note: "WTO 관세평가협정은 운송비 등을 과세가격에 넣을지 회원국이 법으로 정하게 합니다. 물류 10달러를 넣는 나라라면 같은 10%가 7달러입니다. 다음 두 경로는 6달러로 계산합니다." },
  { label: "경로 1 · 가격 유지", summary: "60 + 10 + 6 + 24 = 100", note: "제조대금 60달러와 물류 10달러, 소비가격 100달러가 그대로라면 판매 단계에 남는 금액이 30달러에서 24달러가 됩니다." },
  { label: "경로 2 · 넘길 수 있다면", summary: "60 + 10 + 30 + 6 = 106", note: "판매 단계가 30달러를 유지하고 추가 비용 전부를 고객에게 넘길 수 있다면 소비가격이 106달러가 됩니다. 어느 경로가 실제로 가능한지는 계약과 경쟁, 고객의 반응에 달립니다." },
] as const;

function barOf(active: number) {
  if (active === 3) return [MAKE_SEG, LOG_SEG, { value: 6, color: TARIFF }, { value: 24, color: RETAIL, text: "판매 24" }];
  if (active === 4) return [MAKE_SEG, LOG_SEG, { value: 30, color: RETAIL, text: "판매 30" }, { value: 6, color: TARIFF }];
  return [MAKE_SEG, LOG_SEG, { value: 30, color: RETAIL, text: "판매 30" }];
}

export default function TariffRoutesViz() {
  return (
    <SceneShell
      eyebrow="(가정) 10% 관세"
      title="관세 6달러가 판매 몫을 줄이는 경로와 가격을 올리는 경로"
      description="막대의 폭이 금액입니다. 세로 눈금이 기존 소비가격 100달러입니다. 설명용 계산이며 실제 부담은 재고 소유와 가격 조정 조항, 경쟁과 대체 공급자에 달립니다."
      ariaLabel="과세가격 60과 70에 따른 관세 6과 7, 그리고 판매 몫 24 또는 소비가격 106으로 가는 두 경로"
      scenes={SCENES}
      render={(active) => {
        const base = active === 1 ? 60 : active === 2 ? 70 : 0;
        return (
          <div className="min-w-0">
            <div className={base ? "flex" : "invisible flex"} aria-hidden={!base}>
              <Bracket value={base || 60} scale={SCALE} text={`과세가격 ${base || 60}`} color={TARIFF} />
            </div>
            <div className="relative mt-1">
              <PriceBar scale={SCALE} segs={barOf(active)} />
              <div className="absolute -bottom-1.5 -top-1.5 w-0 border-l border-foreground" style={{ left: `${(100 / SCALE) * 100}%` }} />
            </div>
            <div className="relative mt-2 h-10 text-xs">
              <span className="absolute -translate-x-1/2 font-mono font-bold" style={{ left: `${(100 / SCALE) * 100}%` }}>100</span>
              {active === 4 && <span className="absolute top-5 font-mono font-bold" style={{ color: TARIFF, right: `${((SCALE - 106) / SCALE) * 100}%` }}>106</span>}
            </div>
            <div className={base ? "mt-1 flex items-center gap-2 text-sm" : "invisible mt-1 flex items-center gap-2 text-sm"} aria-hidden={!base}>
              <span className="font-mono">× 10% =</span>
              <span className="inline-flex h-7 items-center justify-center font-mono text-xs font-bold text-white" style={{ width: `${((base === 70 ? 7 : 6) / SCALE) * 100}%`, minWidth: "1.25rem", backgroundColor: TARIFF }}>{base === 70 ? 7 : 6}</span>
              <span className="text-xs text-muted-foreground">관세</span>
            </div>
            <Legend items={[{ color: MAKE, text: "제조대금" }, { color: LOGISTICS, text: "물류 10" }, { color: RETAIL, text: "판매 단계" }, { color: TARIFF, text: "관세" }]} />
          </div>
        );
      }}
    />
  );
}
