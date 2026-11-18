import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 첫해 100−80−10=10, 둘째 해 수출가격 20% 하락(100×0.8=80)과 이자 10→18로 80−80−18=−18.
 * 장면 순서는 numericCase(가격 하락 → 이자 상승)를 따른다. 가격만 바뀐 중간값 80−80−10=−10은 그 순서의 산술이다.
 * 막대는 0에서 시작해 수출을 더하고 수입·이자를 차례로 빼는 폭포형이다. 축: −25 ~ 105.
 */
const MIN = -25;
const MAX = 105;
const IMPORTS = 80;

const SCENES = [
  { label: "첫해", summary: "100 − 80 − 10 = 10", exports: 100, interest: 10, note: "수출로 번 외화 100에서 수입 80과 외채 이자 10을 내면 10이 남습니다. 준비자산으로 쌓거나 설비 수입·부채 상환에 쓸 수 있는 돈입니다." },
  { label: "수출가격 20% 하락", summary: "100 × 0.8 = 80 → 잔액 −10", exports: 80, interest: 10, note: "수출 물량은 그대로라고 가정하면 가격이 20% 내려 수출액이 80이 됩니다. 수입 80을 내고 나면 이자 10을 낼 외화가 없어 잔액이 −10으로 내려갑니다." },
  { label: "이자도 10 → 18", summary: "80 − 80 − 18 = −18", exports: 80, interest: 18, note: "같은 해에 이자가 18로 오르면 모자라는 외화는 18입니다. 잔액 10에서 −18까지 28이 줄었고, 그중 20은 수출가격, 8은 이자에서 왔습니다. 물량·환율·원금 만기가 같다는 설명용 가정이며 실제 국가 통계가 아닙니다." },
] as const;

const pct = (value: number) => ((value - MIN) / (MAX - MIN)) * 100;

function Row({ label, from, to, value, color, dashed = false, strong = false }: { label: string; from: number; to: number; value: string; color: string; dashed?: boolean; strong?: boolean }) {
  const left = pct(Math.min(from, to));
  const width = pct(Math.max(from, to)) - left;
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] sm:text-sm">
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

export default function ForexLedgerShockViz() {
  return (
    <SceneShell
      eyebrow="외화 장부"
      title="가격과 이자가 함께 바뀌면 흑자 10이 적자 18이 됩니다"
      description="막대는 0에서 시작해 수출로 들어온 외화를 오른쪽으로 쌓고, 수입과 이자를 차례로 왼쪽으로 뺍니다. 세로선이 0이고 그 왼쪽은 모자라는 외화입니다. 숫자는 모두 3절의 설명용 가정입니다."
      ariaLabel="수출 100과 80, 이자 10과 18에서 수입 80을 뺀 외화 잔액 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const afterImports = scene.exports - IMPORTS;
        const rest = afterImports - scene.interest;
        const short = rest < 0;
        return (
          <div className="min-w-0 space-y-2">
            <Row label="수출" from={0} to={scene.exports} value={`${scene.exports}`} color="#64748b" />
            <Row label="수입" from={scene.exports} to={afterImports} value={`−${IMPORTS}`} color="#d97706" />
            <Row label="외채 이자" from={afterImports} to={rest} value={`−${scene.interest}`} color="#7c3aed" />
            <Row label={short ? "잔액(모자람)" : "잔액"} from={0} to={rest} value={short ? `−${Math.abs(rest)}` : `${rest}`} color={short ? "#dc2626" : "#16a34a"} dashed={short} strong />
            <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_3rem] gap-2 pt-1 text-[11px] text-muted-foreground sm:grid-cols-[6.5rem_minmax(0,1fr)_3.5rem]">
              <span />
              <div className="relative h-4">
                {[-20, 0, 50, 100].map((tick) => (
                  <span key={tick} className="absolute -translate-x-1/2 font-mono" style={{ left: `${pct(tick)}%` }}>{tick}</span>
                ))}
              </div>
              <span />
            </div>
          </div>
        );
      }}
    />
  );
}
