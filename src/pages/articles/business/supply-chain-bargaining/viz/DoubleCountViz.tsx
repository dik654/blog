import type { ReactNode } from "react";
import SceneShell from "./SceneShell";
import { Legend, PriceBar } from "./PriceBar";
import { ASSEMBLY, LOGISTICS, MAKE, PART, RETAIL } from "./colors";

/**
 * 본문 대응: #mechanism — 40달러 부품과 60달러 완제품이 각각 국경을 넘을 때 두 수출액의 합 100은 새 가치의 합이 아닙니다.
 * 40 + 60 = 100, 그 안의 40이 두 번 들어가므로 새로 더한 값은 40 + 20 = 60입니다.
 */
const SCENES = [
  { label: "두 번의 수출", summary: "40달러, 60달러", note: "부품 40달러가 한 번, 완제품 60달러가 또 한 번 국경을 넘습니다. 각각 수출액으로 적힙니다." },
  { label: "그대로 더하면", summary: "40 + 60 = 100", note: "두 수출액을 더하면 100달러입니다. 손님이 낸 100달러와 숫자만 같을 뿐 더한 항목이 다릅니다. 손님 가격은 60 + 10 + 30이었습니다." },
  { label: "60달러를 엽니다", summary: "60 = 40 + 20", note: "완제품 60달러 안에 앞 줄의 부품 40달러가 그대로 들어 있습니다. 같은 40달러가 두 번 적힌 셈입니다." },
  { label: "새로 더한 값", summary: "40 + 20 = 60", note: "두 수출에서 새로 더한 값은 부품 40달러와 조립 20달러, 합해 60달러입니다. 그래서 수출액 합계 100달러를 전부 새로 만든 가치라 읽지 않습니다." },
] as const;

function Row({ label, children, on = true }: { label: string; children: ReactNode; on?: boolean }) {
  return (
    <div className={`mt-3 first:mt-0 ${on ? "" : "invisible"}`} aria-hidden={!on}>
      <p className="mb-1 text-xs font-bold text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

export default function DoubleCountViz() {
  return (
    <SceneShell
      eyebrow="(가정) 같은 100달러 제품"
      title="두 수출액을 더하면 같은 부품이 두 번 들어갑니다"
      description="막대의 폭이 금액이고 모든 줄의 비례가 같습니다. 옅은 회색 칸은 어느 줄에서나 같은 부품 40달러입니다."
      ariaLabel="부품 수출 40과 완제품 수출 60의 합 100 안에 부품 40이 두 번 들어가고 새로 더한 값은 60임을 보이는 막대"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <Row label="부품 수출">
            <div style={{ width: "40%" }}><PriceBar scale={40} segs={[{ value: 40, color: PART }]} /></div>
          </Row>
          <Row label="완제품 수출">
            <div style={{ width: "60%" }}>
              <PriceBar scale={60} segs={active >= 2 ? [{ value: 40, color: PART }, { value: 20, color: ASSEMBLY }] : [{ value: 60, color: MAKE }]} />
            </div>
          </Row>
          <div className="mt-3 grid">
            <div className={`col-start-1 row-start-1 ${active === 1 || active === 2 ? "" : "invisible"}`} aria-hidden={!(active === 1 || active === 2)}>
              <Row label="두 수출액의 합">
                <PriceBar segs={active >= 2 ? [{ value: 40, color: PART }, { value: 40, color: PART, text: "같은 40" }, { value: 20, color: ASSEMBLY }] : [{ value: 40, color: PART }, { value: 60, color: MAKE }]} />
              </Row>
            </div>
            <div className={`col-start-1 row-start-1 ${active === 3 ? "" : "invisible"}`} aria-hidden={active !== 3}>
              <Row label="새로 더한 값">
                <div style={{ width: "60%" }}><PriceBar scale={60} segs={[{ value: 40, color: PART }, { value: 20, color: ASSEMBLY }]} /></div>
              </Row>
            </div>
          </div>
          <div className={active === 1 ? "" : "invisible"} aria-hidden={active !== 1}>
            <p className="mb-1 mt-3 text-xs font-bold text-muted-foreground">비교: 손님 가격의 구성</p>
            <PriceBar segs={[{ value: 60, color: MAKE }, { value: 10, color: LOGISTICS }, { value: 30, color: RETAIL }]} />
          </div>
          <Legend items={active >= 2 ? [{ color: PART, text: "부품 40" }, { color: ASSEMBLY, text: "조립 20" }] : [{ color: PART, text: "부품 40" }, { color: MAKE, text: "완제품 60" }]} />
        </div>
      )}
    />
  );
}
