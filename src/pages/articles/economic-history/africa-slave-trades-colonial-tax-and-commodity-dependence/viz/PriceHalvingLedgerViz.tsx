import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 현금작물 매출 20에서 운송·중개 4와 현금세 10을 빼면 6.
 * 가격이 반이 되어 매출 10이면 같은 비용·세금으로 10 − 4 − 10 = −4.
 * 막대는 0에서 시작해 차례로 빠지는 폭포형이다. 축: −6 ~ 22.
 */
const MIN = -6;
const MAX = 22;
const COST = 4;
const TAX = 10;

const SCENES = [
  { label: "가격 그대로: 매출 20", summary: "20 − 4 − 10 = 6", sales: 20, ways: false, note: "설명용 사례입니다. 매출 20에서 항구까지의 운송·중개 4를 내고 현금세 10을 현금으로 내면 농가 손에 현금 6이 남습니다. 식량과 무급 노동의 가치는 이 장부 밖에 있습니다." },
  { label: "가격이 반으로: 매출 10", summary: "10 − 4 − 10 = −4", sales: 10, ways: false, note: "운송·중개 4와 세금 10은 그대로 둡니다. 매출 10으로는 둘을 합한 14를 낼 수 없어 4가 모자랍니다. 실제 식민지별 세율과 작물 가격이 아니라 가격 충격이 생활을 흔드는 구조를 보는 가정입니다." },
  { label: "모자란 4는 장부 밖에서", summary: "판매·임금·가축 중 가능한 길", sales: 10, ways: true, note: "1절은 농가가 작물 판매·임금 노동·가축 처분 가운데 가능한 방법을 찾아야 한다고 씁니다. 현금작물은 이미 다 팔았으므로 여기서 작물 판매는 '식량 여분 판매', 곧 2절이 저장·교환 몫일 수 있다고 한 식량 20의 일부를 내다 파는 길로 그렸습니다(가정). 어느 길로 얼마를 메웠는지는 글에 없어 크기로 그리지 않았습니다." },
] as const;

const pct = (value: number) => ((value - MIN) / (MAX - MIN)) * 100;

function Row({ label, from, to, value, color, dashed = false, strong = false }: { label: string; from: number; to: number; value: string; color: string; dashed?: boolean; strong?: boolean }) {
  const left = pct(Math.min(from, to));
  const width = pct(Math.max(from, to)) - left;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_3.5rem] sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-5 min-w-0 rounded-sm bg-muted/30">
        <div className="absolute inset-y-[-4px] w-px bg-foreground/50" style={{ left: `${pct(0)}%` }} />
        <div
          className="absolute inset-y-0 rounded-sm border transition-[left,width] duration-300 motion-reduce:transition-none"
          style={{ left: `${left}%`, width: `${width}%`, backgroundColor: dashed ? "transparent" : color, borderColor: color, borderStyle: dashed ? "dashed" : "solid" }}
        />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function PriceHalvingLedgerViz() {
  return (
    <SceneShell
      eyebrow="농가 현금 장부"
      title="가격이 반이 되면 같은 세금이 장부를 음수로 만듭니다"
      description="막대는 0에서 시작해 위에서 아래로 차례로 빠지는 금액입니다. 세로선이 0이고 그 왼쪽은 모자라는 돈입니다. 숫자는 모두 3절의 설명용 가정입니다."
      ariaLabel="현금작물 매출 20과 10에서 운송·중개 4와 현금세 10을 뺀 농가 잔여 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const afterCost = scene.sales - COST;
        const rest = afterCost - TAX;
        const short = rest < 0;
        return (
          <div className="min-w-0 space-y-2">
            <Row label="현금작물 매출" from={0} to={scene.sales} value={`${scene.sales}`} color="#64748b" />
            <Row label="운송·중개" from={scene.sales} to={afterCost} value={`−${COST}`} color="#d97706" />
            <Row label="현금세" from={afterCost} to={rest} value={`−${TAX}`} color="#7c3aed" />
            <Row label={short ? "농가 잔여(모자람)" : "농가 잔여"} from={0} to={rest} value={short ? `−${Math.abs(rest)}` : `${rest}`} color={short ? "#dc2626" : "#16a34a"} dashed={short} strong />
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_3.25rem] gap-2 pt-1 text-[11px] text-muted-foreground sm:grid-cols-[7rem_minmax(0,1fr)_3.5rem]">
              <span />
              <div className="relative h-4">
                {[-5, 0, 10, 20].map((tick) => (
                  <span key={tick} className="absolute -translate-x-1/2 font-mono" style={{ left: `${pct(tick)}%` }}>{tick}</span>
                ))}
              </div>
              <span />
            </div>
            <ul className={`grid grid-cols-3 gap-2 pt-2 text-center text-xs ${scene.ways ? "" : "invisible"}`} aria-hidden={!scene.ways}>
              {["식량 여분 판매", "임금 노동", "가축 처분"].map((way) => (
                <li key={way} className="rounded-lg border border-dashed border-red-600/70 px-1 py-2 leading-5">{way}</li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
