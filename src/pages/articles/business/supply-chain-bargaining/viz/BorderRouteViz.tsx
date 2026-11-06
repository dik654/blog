import SceneShell from "./SceneShell";
import { PriceBar, type Seg } from "./PriceBar";
import { ASSEMBLY, LOGISTICS, PART, RETAIL } from "./colors";

/**
 * 본문 대응: #picture — 국경 화살표에 적히는 값(40, 60)과 단계마다 새로 더한 몫(40, 20, 10, 30)을 따로 봅니다.
 * 70은 60 + 10으로 계산한 누적 몫이며 본문이 거래가격으로 제시한 값이 아닙니다.
 */
const SCENES = [
  { label: "부품이 국경을 넘습니다", summary: "화살표 40 · 새로 더한 몫 40", note: "부품 40달러가 조립국에 들어옵니다. 40달러는 전부 다른 나라에서 더한 가치라고 놓았으므로(가정) 이 칸은 화살표 값과 새로 더한 몫이 같습니다." },
  { label: "조립국이 더합니다", summary: "40 + 20 = 60", note: "조립국이 20달러만큼 더해 60달러가 됩니다. 조립에 이 부품 외의 별도 중간재 구매는 없다고 가정했습니다." },
  { label: "완제품이 국경을 넘습니다", summary: "화살표 60 · 새로 더한 몫 20", note: "두 번째 화살표에는 60달러가 적히지만 이 단계가 새로 더한 몫은 20달러입니다. 화살표 값 안에 앞 단계의 40달러가 들어 있습니다." },
  { label: "물류를 붙입니다", summary: "60 + 10 = 70", note: "운송과 통관의 몫 10달러를 붙이면 여기까지 쌓인 몫은 70달러입니다. 70달러는 계산한 누적값이며 국경 화살표 값이 아닙니다." },
  { label: "판매를 붙입니다", summary: "70 + 30 = 100", note: "판매·브랜드 몫 30달러까지 붙어야 손님이 낸 100달러가 됩니다. 이 사례의 국경 화살표에 적힌 값은 40과 60뿐이므로 최종가격과 비교 기준이 다릅니다. 물류 10달러와 판매 30달러는 그 회사가 사 쓴 서비스 비용을 확인하기 전이라 전부 새 가치라고 부르지 않습니다." },
] as const;

function Stage({ name, add, segs, on, now }: { name: string; add: number; segs: readonly Seg[]; on: boolean; now: boolean }) {
  return (
    <div className={`grid grid-cols-[minmax(0,1fr)_2.4rem] items-center gap-x-2 gap-y-1 sm:grid-cols-[6.5rem_minmax(0,1fr)_3rem] ${on ? "" : "invisible"}`} aria-hidden={!on}>
      <span className={`col-span-2 break-keep text-xs leading-4 sm:col-span-1 ${now ? "font-bold" : "text-muted-foreground"}`}>{name}</span>
      <PriceBar segs={segs} />
      <span className={`text-right font-mono text-sm ${now ? "font-bold" : "text-muted-foreground"}`}>+{add}</span>
    </div>
  );
}

function Border({ value, on, now }: { value: number; on: boolean; now: boolean }) {
  return (
    <div className={`relative my-2 flex items-center justify-center ${on ? "" : "invisible"}`} aria-hidden={!on}>
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-400" />
      <span className={`relative rounded-sm border bg-background px-2 py-0.5 text-xs ${now ? "border-primary font-bold text-foreground" : "border-border text-muted-foreground"}`}>
        국경 화살표 {value}달러 ↓
      </span>
    </div>
  );
}

const PARTS: Seg = { value: 40, color: PART, text: "40" };
const ASM: Seg = { value: 20, color: ASSEMBLY, text: "20" };
const LOG: Seg = { value: 10, color: LOGISTICS, text: "10" };
const RET: Seg = { value: 30, color: RETAIL, text: "30" };

export default function BorderRouteViz() {
  return (
    <SceneShell
      eyebrow="(가정) 같은 100달러 제품"
      title="국경 화살표의 값과 새로 더한 몫은 다른 숫자입니다"
      description="위에서 아래로 물건이 이동합니다. 점선이 국경이고, 막대는 그 단계까지 쌓인 몫, 오른쪽 숫자는 그 단계가 가격에 새로 더한 몫입니다."
      ariaLabel="부품 40이 국경을 넘고 조립 20이 더해져 60이 국경을 넘은 뒤 물류 10과 판매 30이 붙어 100이 되는 경로"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <Stage name="다른 나라 부품" add={40} segs={[PARTS]} on now={active === 0} />
          <Border value={40} on now={active === 0} />
          <Stage name="조립국" add={20} segs={[PARTS, ASM]} on={active >= 1} now={active === 1} />
          <Border value={60} on={active >= 2} now={active === 2} />
          <div className="space-y-2">
            <Stage name="물류·통관" add={10} segs={[PARTS, ASM, LOG]} on={active >= 3} now={active === 3} />
            <Stage name="판매·브랜드" add={30} segs={[PARTS, ASM, LOG, RET]} on={active >= 4} now={active === 4} />
          </div>
        </div>
      )}
    />
  );
}
