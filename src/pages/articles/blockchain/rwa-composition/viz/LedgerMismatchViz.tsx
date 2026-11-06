import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 두 장부가 같은 시각을 가리켜야 한다.
 * 입금 10.20·발행 10(가정): 112.20/100=1.122 → 112.20/110=1.02.
 * 소각 10·상환 10.20(가정): 102/90≈1.133 → 91.80/90=1.02.
 */
const BASE = 1.02;
const SCENES = [
  { label: "맞춘 상태", summary: "102 ÷ 100 = 1.02", net: 102, units: 100, stale: null, note: "같은 시각의 자산 장부와 권리 장부를 나누면 개당 1.02입니다." },
  { label: "입금만 반영", summary: "112.20 ÷ 100 = 1.122", net: 112.2, units: 100, stale: "units", note: "새 입금 10.20이 자산 장부에 들어왔는데 줄 지분 10개가 권리 장부에 없습니다. 수익이 난 것이 아닌데 개당 가치가 일시적으로 부풀어 보입니다." },
  { label: "발행까지 반영", summary: "112.20 ÷ 110 = 1.02", net: 112.2, units: 110, stale: null, note: "발행할 지분 10개까지 적으면 개당 1.02로 돌아옵니다. 부풀었던 값은 두 장부의 시각 차이에서 나온 것입니다." },
  { label: "소각만 반영", summary: "102 ÷ 90 ≈ 1.133", net: 102, units: 90, stale: "net", note: "이번에는 처음의 102, 100개로 돌아가 10개를 없앱니다. 상환할 현금 10.20을 자산 장부에서 빼지 않아 이번에도 개당 가치가 부풀어 보입니다." },
  { label: "상환 현금까지 반영", summary: "91.80 ÷ 90 = 1.02", net: 91.8, units: 90, stale: null, note: "상환할 현금을 빼면 개당 1.02로 돌아옵니다. 어느 등록부를 언제 갱신하는지가 함께 연결되어야 하는 이유입니다." },
] as const;

const MAX = 120;
const pct = (value: number) => `${(value / MAX) * 100}%`;

function Ledger({ title, value, unit, stale, color }: { title: string; value: number; unit: string; stale: boolean; color: string }) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)_4.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{title}</span>
      <div className="h-6 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: pct(value), backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{value % 1 === 0 ? value : value.toFixed(2)}{unit}</span>
      {stale && <span className="col-span-3 text-xs font-semibold text-red-700 dark:text-red-400">↑ 아직 갱신되지 않음</span>}
      {!stale && <span aria-hidden="true" className="col-span-3 text-xs">&nbsp;</span>}
    </div>
  );
}

export default function LedgerMismatchViz() {
  return (
    <SceneShell
      eyebrow="두 장부의 시각"
      title="한쪽 장부만 바뀌면 개당 가치가 일시적으로 부풀어 보입니다"
      description="3절의 순자산 102, 발행 100개에서 시작합니다. 입금과 소각은 10개, 1개당 1.02로 맞춘 설명용 값입니다(가정). 막대 길이는 금액과 개수를 같은 숫자 눈금으로 그렸습니다."
      ariaLabel="자산 장부와 권리 장부의 갱신 시점이 어긋날 때의 개당 가치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const value = scene.net / scene.units;
        const inflated = value > BASE + 0.001;
        return (
          <div className="min-w-0">
            <div className="space-y-1">
              <Ledger title="자산 장부" value={scene.net} unit="" stale={scene.stale === "net"} color="#2563eb" />
              <Ledger title="권리 장부" value={scene.units} unit="개" stale={scene.stale === "units"} color="#64748b" />
            </div>
            <div className={`mt-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 rounded-lg border px-3 py-2 ${inflated ? "border-red-600 bg-red-600/10" : "border-border bg-background"}`}>
              <span className="text-sm font-semibold">개당 가치</span>
              <span className="font-mono text-base font-bold">{value.toFixed(3).replace(/0$/, "")}{inflated ? " (부풀어 보임)" : " (맞음)"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
