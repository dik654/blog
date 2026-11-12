import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stream-credit — stream 1의 최대 창 M = 256 KiB.
 * 256 = 읽은 양 + 아직 안 읽은 buffer B + 남은 창 R. 후보 U = (M − R) − B, 보내는 조건 U ≥ M/2 = 128.
 * 200 도착 → R 56, B 200 / 72 읽음 → U 72 / 64 더 → U 136 → update 후 R = 56 + 136 = 192. 자동 확대는 제외.
 */
const M = 256;
const HALF = M / 2;

const STATES = [
  { read: 0, buffered: 0, remain: 256 },
  { read: 0, buffered: 200, remain: 56 },
  { read: 72, buffered: 128, remain: 56 },
  { read: 136, buffered: 64, remain: 56 },
  { read: 0, buffered: 64, remain: 192 },
] as const;

const SCENES = [
  { label: "처음", summary: "남은 창 256 KiB", note: "각 stream은 처음 256 KiB의 receive window(상대가 더 보내도 되는 byte 한도)를 갖습니다. 아직 아무것도 오지 않았습니다." },
  { label: "200 KiB 도착", summary: "남은 창 56 · 후보 0", note: "200 KiB가 도착하면 남은 창은 56 KiB입니다. 200 KiB가 모두 application buffer에 남아 있으므로 소비된 양은 0이고 돌려줄 credit도 0입니다." },
  { label: "72 KiB 읽음", summary: "후보 72 < 문턱 128", note: "Application이 72 KiB를 읽어 buffer에 128 KiB가 남습니다. 후보 (256 − 56) − 128 = 72 KiB가 최대 창의 절반 128 KiB보다 작아 아직 WINDOW_UPDATE를 보내지 않습니다." },
  { label: "64 KiB 더 읽음", summary: "후보 136 ≥ 128 → UPDATE", note: "누적 136 KiB를 읽어 buffer에 64 KiB가 남습니다. 후보 (256 − 56) − 64 = 136 KiB가 문턱을 넘어 Bob은 WINDOW_UPDATE 136 KiB를 보냅니다." },
  { label: "update 뒤", summary: "56 + 136 = 192 KiB", note: "Alice가 보낼 수 있는 한도는 56 + 136 = 192 KiB로 늘어납니다. 아직 읽지 않은 64 KiB는 읽기 전까지 credit로 돌아오지 않습니다." },
] as const;

const COLORS = { read: "#16a34a", buffered: "#d97706", remain: "#2563eb" };

function Segment({ value, color, label }: { value: number; color: string; label: string }) {
  if (value === 0) return null;
  return (
    <div
      className="flex h-full min-w-0 items-center justify-center overflow-hidden border-r border-background font-mono text-[11px] font-bold text-white"
      style={{ width: `${(value / M) * 100}%`, backgroundColor: color }}
      title={label}
    >
      {value}
    </div>
  );
}

function Ledger({ active }: { active: number }) {
  const state = STATES[active];
  const candidate = M - state.remain - state.buffered;
  const sends = active === 3;
  const shownCandidate = active === 4 ? 0 : candidate;
  return (
    <div className="min-w-0 text-sm">
      <p className="text-xs font-bold text-muted-foreground">stream 1의 최대 창 256 KiB를 셋으로 나눈 장부</p>
      <div className="mt-2 flex h-9 w-full overflow-hidden rounded-sm border border-border bg-muted/30">
        <Segment value={state.read} color={COLORS.read} label="읽음" />
        <Segment value={state.buffered} color={COLORS.buffered} label="buffer" />
        <Segment value={state.remain} color={COLORS.remain} label="남은 창" />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        <span><span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.read }} />읽었지만 credit 미반환</span>
        <span><span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.buffered }} />도착했으나 안 읽음 (B)</span>
        <span><span className="mr-1 inline-block size-2.5 rounded-sm align-middle" style={{ backgroundColor: COLORS.remain }} />남은 창 (R)</span>
      </div>

      <p className="mt-5 text-xs font-bold text-muted-foreground">돌려줄 후보 U = (256 − R) − B 와 절반 문턱</p>
      <div className="relative mt-2 h-7 w-full rounded-sm border border-border bg-muted/30">
        <div className="h-full rounded-sm" style={{ width: `${(shownCandidate / M) * 100}%`, backgroundColor: sends ? COLORS.read : "#94a3b8" }} />
        <div className="absolute inset-y-[-4px] w-px" style={{ left: `${(HALF / M) * 100}%`, backgroundColor: "#dc2626" }} />
      </div>
      <div className="relative mt-1 h-4 font-mono text-[11px]">
        <span className="absolute left-0">0</span>
        <span className="absolute -translate-x-1/2" style={{ left: `${(HALF / M) * 100}%`, color: "#dc2626" }}>128</span>
        <span className="absolute right-0">256</span>
      </div>
      <p className="mt-2 font-mono text-xs">
        {active === 4 ? "UPDATE를 보낸 뒤 장부를 새로 셉니다" : `U = (256 − ${state.remain}) − ${state.buffered} = ${candidate} KiB → ${sends ? "WINDOW_UPDATE 보냄" : "보내지 않음"}`}
      </p>
    </div>
  );
}

export default function WindowLedgerViz() {
  return (
    <SceneShell
      eyebrow="stream 1 credit 장부"
      title="도착한 양이 아니라 읽은 양이 문턱을 넘어야 credit가 돌아갑니다"
      description="위 막대는 stream 1의 256 KiB 최대 창, 아래 막대는 지금 돌려줄 수 있는 credit 후보입니다. 숫자 단위는 KiB이고 RTT 기반 자동 확대는 제외했습니다."
      ariaLabel="stream 1 receive window의 읽음, buffer, 남은 창과 WINDOW_UPDATE 문턱"
      scenes={SCENES}
      render={(active) => <Ledger active={active} />}
    />
  );
}
