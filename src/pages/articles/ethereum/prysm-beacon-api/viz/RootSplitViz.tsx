import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metadata — data.root(Sₐ)는 HeadBlock A의 state_root에서 오고,
 * finalized 판정 key(Bₐ)는 HeadState 안의 latest block header를 hash해서 만든다.
 * BlockRootFromState는 header의 state_root가 비어 있으면 현재 state의 HashTreeRoot로 채운 뒤 hash한다.
 */
const SCENES = [
  {
    label: "첫 조회: data.root",
    summary: "HeadBlock A의 state_root = Sₐ",
    note: "첫 조회 StateRoot(head)는 head block A의 header에 적힌 state_root를 읽습니다. 이 값 Sₐ가 응답의 data.root가 됩니다. 이 단계에서는 BeaconState object를 아직 읽지 않습니다.",
  },
  {
    label: "둘째 조회: state 안의 header",
    summary: "State(head) → HeadState",
    note: "finalized를 계산하려고 handler는 State(head)로 BeaconState를 다시 읽습니다. 이 state 안에는 latest block header, 곧 이 state를 만든 block의 header가 field로 들어 있습니다.",
  },
  {
    label: "빈 state_root 채우기",
    summary: "비어 있으면 HashTreeRoot(state)",
    note: "BlockRootFromState는 이 header의 state_root가 비어 있으면 현재 state의 HashTreeRoot로 채운 뒤 hash합니다. 값이 이미 있으면 채우지 않고 그대로 hash합니다.",
  },
  {
    label: "Block root로 finality",
    summary: "hash(header) = Bₐ → IsFinalized(Bₐ)",
    note: "Header를 hash한 값이 block root Bₐ이고, finalized는 이 Bₐ로 묻습니다. 응답의 data.root Sₐ와 finality key Bₐ는 둘 다 32-byte root지만 같은 root가 아닙니다.",
  },
] as const;

function Box({ label, value, active, muted }: { label: string; value: string; active: boolean; muted?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-2 text-center ${
        active ? "border-primary bg-primary/5" : "border-border bg-background"
      } ${muted ? "opacity-40" : ""}`}
    >
      <span className="block break-keep text-[10px] font-bold leading-4 text-muted-foreground">{label}</span>
      <strong className={`mt-1 block break-keep font-mono text-[10.5px] leading-5 sm:text-xs ${active ? "text-primary" : ""}`}>{value}</strong>
    </div>
  );
}

function Arrow({ muted }: { muted?: boolean }) {
  return (
    <span className={`flex items-center justify-center text-sm text-primary ${muted ? "opacity-30" : ""}`} aria-hidden>
      →
    </span>
  );
}

export default function RootSplitViz() {
  return (
    <SceneShell
      eyebrow="두 root의 출처"
      title="data.root와 finality key는 다른 곳에서 나옵니다"
      description="위 줄은 첫 조회, 아래 줄은 둘째 조회입니다. A·Sₐ·Bₐ는 이 글의 설명용 이름입니다."
      ariaLabel="data.root는 head block의 state_root에서, finalized 판정 key는 state 안 header의 hash에서 나오는 과정"
      scenes={SCENES}
      render={(active) => {
        const stateRead = active >= 1;
        const filled = active >= 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0">
              <p className="mb-1.5 text-[11px] font-bold text-muted-foreground">첫 조회 · StateRoot(head)</p>
              <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-1.5">
                <Box label="HeadBlock A의 header" value="state_root = Sₐ" active={active === 0} />
                <Arrow />
                <Box label="응답 data.root" value="Sₐ" active={active === 0 || active === 3} />
              </div>
            </div>

            <div className="min-w-0">
              <p className="mb-1.5 text-[11px] font-bold text-muted-foreground">둘째 조회 · State(head)</p>
              <div className={`rounded-md border p-2 ${active === 1 ? "border-primary" : "border-border"} ${stateRead ? "" : "opacity-40"}`}>
                <span className="block text-[10px] font-bold leading-4 text-muted-foreground">BeaconState (HeadState)</span>
                <div className="mt-1.5 grid gap-1.5 sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
                  <div className="rounded-md border border-dashed border-border px-2 py-2 text-center text-[11px] leading-5 text-muted-foreground">그 밖의 state field</div>
                  <div className={`rounded-md border px-2 py-1.5 ${active === 2 ? "border-primary bg-primary/5" : "border-border bg-background"}`}>
                    <span className="block text-[10px] font-bold leading-4 text-muted-foreground">latest block header</span>
                    <div className="mt-1 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1.5 text-[11px] leading-5">
                      <span className={`rounded-sm border px-1.5 py-0.5 font-mono ${filled ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                        state_root: {filled ? "비었다면 채움" : "빈 값일 수 있음"}
                      </span>
                      <span className="rounded-sm border border-dashed border-border px-1.5 py-0.5 text-muted-foreground">그 밖의 header field</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-1.5 grid grid-cols-2 gap-1.5" aria-label="state_root가 비어 있는지에 따른 갈림">
                <Box label="비어 있으면 채움" value="HashTreeRoot(state)" active={active === 2} muted={active < 2} />
                <Box label="이미 있으면" value="그대로 둠" active={false} muted={active < 2} />
              </div>

              <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] gap-1.5">
                <Box label="header를 hash" value="block root Bₐ" active={active === 3} muted={active < 3} />
                <Arrow muted={active < 3} />
                <Box label="finalized 판정" value="IsFinalized(Bₐ)" active={active === 3} muted={active < 3} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
