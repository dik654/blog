import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 첫 부품을 지나는 양이 늘면 거기서 쓰는 차이가 커져 갈림길에 남는 차이가 줄어든다.
 * 처음: 6 mA, 6 + 6 = 12, 3·3 mA. 오른쪽 1 kΩ: 7.2 mA, 7.2 + 4.8 = 12, 2.4·4.8 mA (7절 값).
 */
const SCENES = [
  { label: "처음 회로", summary: "12 = 6 + 6", note: "오른쪽이 아직 2 kΩ입니다. 12의 차이를 첫 부품과 뒤쪽 갈래가 6씩 나눠 씁니다." },
  { label: "오른쪽을 1 kΩ으로", summary: "첫 길 6 → 7.2 mA", note: "오른쪽 길을 더 쉽게 통하게 바꾸면 입구의 흐름이 7.2 mA가 됩니다. 계산은 7절에 있습니다. 두 갈래의 회색 막대는 아직 읽지 않은 처음 값입니다." },
  { label: "12를 나누는 몫이 바뀝니다", summary: "12 = 7.2 + 4.8", note: "첫 부품을 지나는 양이 늘면 거기서 쓰는 차이도 커집니다. 합은 12로 그대로라서 갈림길에 남는 차이는 6에서 4.8로 줄어듭니다." },
  { label: "왼쪽까지 줄어듭니다", summary: "왼쪽 3 → 2.4 mA", note: "왼쪽 부품은 그대로인데 양끝 차이가 4.8로 줄어 흐름이 2.4 mA가 됩니다. 2.4와 오른쪽 4.8의 합은 입구의 7.2와 맞습니다." },
];

function Row({ label, before, after, max, strong, pending = false }: { label: string; before: number; after: number | null; max: number; strong: boolean; pending?: boolean }) {
  return (
    <div className={`grid grid-cols-[4.75rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:grid-cols-[5.5rem_minmax(0,1fr)_5rem] sm:text-sm ${strong ? "font-bold" : ""}`}>
      <span className={strong ? "" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${((after ?? before) / max) * 100}%`, backgroundColor: after === null ? "#94a3b8" : "#2563eb" }} />
        {after !== null && <div className="absolute inset-y-0 w-0.5 bg-slate-900 dark:bg-slate-100" style={{ left: `${(before / max) * 100}%` }} />}
      </div>
      <span className="text-right font-mono">{after !== null ? `${before} → ${after}` : pending ? `처음 ${before}` : before}</span>
    </div>
  );
}

function Split({ name, first, rest, strong }: { name: string; first: number; rest: number; strong: boolean }) {
  return (
    <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{name}</span>
      <div className="flex min-w-0 font-mono">
        <div className={`rounded-l-sm border border-blue-600 bg-blue-600/15 px-1 py-1.5 text-center ${strong ? "font-bold" : ""}`} style={{ width: `${(first / 12) * 100}%` }}>첫 부품 {first}</div>
        <div className={`rounded-r-sm border border-amber-600 bg-amber-600/15 px-1 py-1.5 text-center ${strong ? "font-bold" : ""}`} style={{ width: `${(rest / 12) * 100}%` }}>남음 {rest}</div>
      </div>
    </div>
  );
}

export default function SharedDropViz() {
  return (
    <SceneShell
      eyebrow="왼쪽이 바뀌는 이유"
      title="손대지 않은 왼쪽 흐름이 줄어드는 길"
      description="파란 막대는 오른쪽을 1 kΩ으로 바꾼 뒤의 값이고, 검은 눈금과 회색 막대는 처음 값입니다. 숫자는 가정이며 7절에서 계산합니다. 세 값은 차례로 바뀌지 않고 함께 정해지며, 장면 순서는 까닭을 읽는 순서입니다."
      ariaLabel="오른쪽 저항을 줄이면 첫 길 전류가 늘고 갈림길에 남는 차이가 줄어 왼쪽 전류가 줄어드는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">전원의 차이 12를 나눈 몫</p>
            <Split name="처음" first={6} rest={6} strong={false} />
            {active >= 2 ? <Split name="바꾼 뒤" first={7.2} rest={4.8} strong={active === 2} /> : <div className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-2 text-xs sm:text-sm"><span className="text-muted-foreground">바꾼 뒤</span><div className="rounded-sm border border-dashed border-border px-1 py-1.5 text-center text-muted-foreground">아직 읽지 않음</div></div>}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">흐름 (mA)</p>
            <Row label="첫 길" before={6} after={active >= 1 ? 7.2 : null} max={8} strong={active === 1} />
            <Row label="왼쪽 2 kΩ" before={3} after={active >= 3 ? 2.4 : null} max={8} strong={active === 3} pending={active >= 1} />
            <Row label={active >= 1 ? "오른쪽 1 kΩ" : "오른쪽 2 kΩ"} before={3} after={active >= 3 ? 4.8 : null} max={8} strong={active === 3} pending={active >= 1} />
          </div>
        </div>
      )}
    />
  );
}
