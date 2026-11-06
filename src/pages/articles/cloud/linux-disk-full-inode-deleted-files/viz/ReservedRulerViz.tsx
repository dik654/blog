import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reserved — df의 Used·Avail·Use%가 같은 100GiB 막대의 어느 구간을 재는지.
 * rm 직후: U=95, bfree=5, r=5, bavail=0, Use%=9500÷95=100.
 * fd 닫은 뒤: U=65, bfree=35, r=5, bavail=30, Use%=6500÷95=68.4→69.
 * Use% 분모 U+bavail은 두 장면 모두 95다.
 */
const STATES = [
  { used: 95, bfree: 5, avail: 0, ratio: "100 × 95 ÷ (95 + 0)", pct: "100%", user: "예약을 빼면 남는 칸 0 → ENOSPC", root: "resuid·resgid 또는 CAP_SYS_RESOURCE → 예약 5GiB 사용" },
  { used: 65, bfree: 35, avail: 30, ratio: "100 × 65 ÷ (65 + 30)", pct: "68.4 → 올림 69%", user: "예약을 빼도 30GiB 남음 → 허락", root: "같은 검사로 허락" },
];

const RESERVED = 5;

const SCENES = [
  { label: "사례 A · rm 직후", summary: "95 + 0 ≠ 100 · Use% 100%", note: "빈 5GiB가 전부 예약이라 일반 사용자 빈칸은 0입니다. Use%의 분모는 100이 아니라 일반 사용자 기준 전체 95라서 100%가 됩니다. root 기준으로는 5GiB가 비어 있습니다." },
  { label: "fd를 닫은 뒤", summary: "65 + 30 ≠ 100 · Use% 69%", note: "예약 칸은 그대로이고 돌아온 30GiB가 일반 사용자 빈칸이 됩니다. Used와 Avail을 더하면 여전히 95라서 빠진 5GiB가 예약 몫으로 보입니다." },
];

function Span({ label, start, length, color, value }: { label: string; start: number; length: number; color: string; value: string }) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-[11px] sm:grid-cols-[7.5rem_minmax(0,1fr)_3.5rem]">
      <span className="leading-4 text-muted-foreground">{label}</span>
      <div className="relative h-3 rounded-sm bg-muted/40">
        {length > 0 ? <div className="absolute inset-y-0 rounded-sm" style={{ left: `${start}%`, width: `${length}%`, backgroundColor: color }} /> : null}
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

export default function ReservedRulerViz() {
  return (
    <SceneShell
      eyebrow="같은 막대, 다른 구간"
      title="Used·Avail·Use%는 100GiB 막대의 서로 다른 구간을 잽니다"
      description="맨 위 막대가 블록 전체이고 아래 줄이 각 값이 재는 구간입니다. statfs가 돌려주는 f_bfree는 예약을 포함한 root 기준 빈칸, f_bavail은 예약을 뺀 일반 사용자 기준 빈칸입니다."
      note="사례의 100GiB 가정을 GiB 단위로 바꿔 계산했고 ext4 내부 예약은 0으로 두었습니다."
      ariaLabel="df의 Used, f_bfree, 예약, f_bavail이 재는 막대 구간"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        const usableFree = state.avail;
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="flex h-6 overflow-hidden rounded-sm" role="presentation">
                <div style={{ width: `${state.used}%`, backgroundColor: "#2563eb" }} />
                <div style={{ width: `${usableFree}%`, backgroundColor: "#cbd5e1" }} />
                <div style={{ width: `${RESERVED}%`, backgroundColor: "#f59e0b" }} />
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[1px] align-[-1px]" style={{ backgroundColor: "#2563eb" }} />찬 블록</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[1px] align-[-1px]" style={{ backgroundColor: "#cbd5e1" }} />누구나 쓰는 빈칸</li>
                <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-[1px] align-[-1px]" style={{ backgroundColor: "#f59e0b" }} />예약 5%</li>
              </ul>
            </div>
            <div className="space-y-2">
              <Span label="df Used" start={0} length={state.used} color="#2563eb" value={`${state.used}G`} />
              <Span label="f_bfree" start={state.used} length={state.bfree} color="#64748b" value={`${state.bfree}G`} />
              <Span label="예약 r" start={100 - RESERVED} length={RESERVED} color="#f59e0b" value={`${RESERVED}G`} />
              <Span label="f_bavail · df Avail" start={state.used} length={state.avail} color="#16a34a" value={`${state.avail}G`} />
              <Span label="Use% 분모 U + Avail" start={0} length={state.used + state.avail} color="#7c3aed" value={`${state.used + state.avail}G`} />
            </div>
            <dl className="space-y-1.5 border-t border-border/60 pt-3 text-xs">
              <div className="flex flex-wrap justify-between gap-x-3"><dt className="font-bold">Use%</dt><dd className="font-mono">{state.ratio} = {state.pct}</dd></div>
              <div><dt className="inline font-bold">일반 사용자 쓰기 </dt><dd className="inline text-muted-foreground">{state.user}</dd></div>
              <div><dt className="inline font-bold">root 쓰기 </dt><dd className="inline text-muted-foreground">{state.root}</dd></div>
            </dl>
          </div>
        );
      }}
    />
  );
}
