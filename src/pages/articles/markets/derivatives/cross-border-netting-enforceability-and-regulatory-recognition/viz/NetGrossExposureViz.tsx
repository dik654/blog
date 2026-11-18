import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 회사 기준 현재가치 +12·−7·−2(설명용 단위), 담보 4.
 * 상계 인정: 12−7−2=3, max(3−4,0)=0. 상계 불확실: 받을 돈 12를 먼저 봄, max(12−4,0)=8. 차이 12−3=9.
 */
const SCALE = 12;

type Row = { label: string; value: number | null; color: string; hint?: string; strong?: boolean };

const SCENES = [
  { label: "세 거래를 따로 봅니다", summary: "받을 12 · 줄 7 · 줄 2", note: "같은 기본계약 아래 세 거래의 회사 기준 현재가치입니다. 오른쪽은 회사가 받을 돈, 왼쪽은 줄 돈입니다. 받을 돈 12와 줄 돈 9가 함께 남아 있습니다." },
  { label: "상계가 인정되면", summary: "12 − 7 − 2 = 3", note: "부도 때 세 거래를 종료해 한 금액으로 합치면 순수취 3만 남습니다. 이 3을 상대방 노출의 출발점으로 볼 수 있습니다." },
  { label: "상계가 불확실하면", summary: "받을 돈 12를 먼저 봄", note: "받을 거래 +12와 지급 거래 −9가 따로 집행될 수 있어 신용 노출 계산에서 +12를 먼저 볼 수 있습니다. 순액과의 차이는 12−3=9입니다." },
  { label: "담보 4를 빼면", summary: "순액 0 · 총액 8", note: "단순 설명에서 순액 기준 미담보 노출은 max(3−4,0)=0이지만 총액 기준 받을 돈은 max(12−4,0)=8입니다. 법률 판단 하나가 담보와 자본 수요를 크게 바꿉니다." },
] as const;

function rowsFor(active: number): Row[] {
  const dim = active === 0 ? 1 : 0.35;
  const trades: Row[] = [
    { label: "거래 A", value: 12, color: dim === 1 ? "#16a34a" : "#86efac" },
    { label: "거래 B", value: -7, color: dim === 1 ? "#d97706" : "#fcd34d" },
    { label: "거래 C", value: -2, color: dim === 1 ? "#d97706" : "#fcd34d" },
  ];
  const net: Row = active === 1 || active === 3
    ? { label: active === 3 ? "순액 − 담보" : "순액", value: active === 3 ? Math.max(3 - 4, 0) : 3, color: "#2563eb", hint: active === 3 ? "max(3−4,0)" : "12−7−2", strong: active === 1 || active === 3 }
    : { label: "순액", value: null, color: "#2563eb" };
  const gross: Row = active === 2 || active === 3
    ? { label: active === 3 ? "총액 − 담보" : "총액(받을 돈)", value: active === 3 ? Math.max(12 - 4, 0) : 12, color: "#dc2626", hint: active === 3 ? "max(12−4,0)" : "지급 −9는 따로", strong: true }
    : { label: "총액(받을 돈)", value: null, color: "#dc2626" };
  return [...trades, net, gross];
}

function SignedBar({ row }: { row: Row }) {
  const width = row.value === null ? 0 : (Math.abs(row.value) / SCALE) * 50;
  const left = row.value !== null && row.value < 0 ? 50 - width : 50;
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:grid-cols-[6.5rem_minmax(0,1fr)_3rem] sm:text-sm">
      <span className={row.strong ? "font-bold" : "text-muted-foreground"}>
        {row.label}
        <span className="block font-mono text-[10px] font-normal text-muted-foreground sm:text-[11px]">{row.hint ?? "\u00a0"}</span>
      </span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="absolute inset-y-0 left-1/2 w-px bg-border" />
        <div
          className="absolute inset-y-0 rounded-sm transition-all duration-300 motion-reduce:transition-none"
          style={{ left: `${left}%`, width: `${width}%`, backgroundColor: row.color }}
        />
      </div>
      <span className={`text-right font-mono ${row.strong ? "font-bold" : ""}`}>
        {row.value === null ? "·" :`${row.value > 0 ? "+" : row.value < 0 ? "−" : ""}${Math.abs(row.value)}`}
      </span>
    </div>
  );
}

export default function NetGrossExposureViz() {
  return (
    <SceneShell
      eyebrow="순액과 총액"
      title="상계가 인정되느냐에 따라 노출이 3이 되기도, 12가 되기도 합니다"
      description="막대는 회사 기준 금액(설명용 단위)입니다. 가운데 선 오른쪽이 받을 돈, 왼쪽이 줄 돈입니다. 담보 4는 3절의 단순 설명값입니다."
      ariaLabel="세 거래 +12, −7, −2의 순액 3과 총액 12, 담보 4를 뺀 뒤 0과 8"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2.5">
          {rowsFor(active).map((row, index) => (
            <div key={index} className={index === 3 ? "border-t border-border pt-2.5" : undefined}>
              <SignedBar row={row} />
            </div>
          ))}
        </div>
      )}
    />
  );
}
