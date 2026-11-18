import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rotation — participation rotation과 Fulu proposer lookahead 전진.
 * current → previous, 새 current는 validator 수(V0·V1·V2 = 3)만큼 0.
 * Lookahead: 가장 오래된 epoch의 32개 proposer를 밀어내고 10 + MIN_SEED_LOOKAHEAD + 1을 끝에 채움(state.slot 351 → epoch 10).
 */
const VALIDATORS = ["V0", "V1", "V2"] as const;

const SCENES = [
  { label: "rotation 전", summary: "previous = epoch 9 · current = epoch 10", note: "Finality와 보상·패널티가 이 두 participation vector를 쓰는 동안에는 바꾸지 않습니다. 칸 하나가 validator 한 명의 participation 기록입니다." },
  { label: "rotation 후", summary: "current → previous · current = 0", note: "current 기록을 previous로 옮기고 새 current를 validator 수인 3칸만큼 0으로 만듭니다. 원래 previous에 있던 epoch 9 기록은 덮입니다. 이 단계가 보상·패널티보다 먼저 오면 방금 정산해야 할 participation evidence를 잃습니다." },
  { label: "lookahead 전", summary: "가장 오래된 epoch … 마지막 epoch", note: "Proposer lookahead는 미래 slot의 proposer index를 epoch 단위(32개씩)로 미리 적어 둔 목록입니다. 맨 앞이 가장 오래된 epoch입니다." },
  { label: "lookahead 후", summary: "앞 32개 밀어냄 · 끝에 epoch 10+k+1", note: "가장 오래된 epoch의 32개를 밀어내고 나머지를 앞으로 당긴 뒤, 끝에 epoch 10 + MIN_SEED_LOOKAHEAD + 1의 proposer를 계산해 채웁니다. 여기서 10은 state.slot 351의 epoch입니다." },
] as const;

function Cell({ text, tone }: { text: string; tone: "old" | "new" | "zero" | "gone" }) {
  const cls = {
    old: "border-border text-foreground",
    new: "border-primary text-primary",
    zero: "border-dashed border-border text-muted-foreground",
    gone: "border-dashed border-amber-600 text-amber-700 line-through dark:text-amber-400",
  }[tone];
  return <div className={`min-w-0 rounded border bg-background px-1 py-1.5 text-center font-mono text-[11px] ${cls}`}>{text}</div>;
}

function Participation({ after }: { after: boolean }) {
  return (
    <div className="grid gap-2">
      {[
        { name: "previous", cells: after ? VALIDATORS.map((v) => `${v}·e10`) : VALIDATORS.map((v) => `${v}·e9`), tone: after ? ("new" as const) : ("old" as const) },
        { name: "current", cells: after ? VALIDATORS.map(() => "0") : VALIDATORS.map((v) => `${v}·e10`), tone: after ? ("zero" as const) : ("old" as const) },
      ].map((row) => (
        <div key={row.name} className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center gap-1.5">
          <span className="font-mono text-[11px] text-muted-foreground">{row.name}</span>
          {row.cells.map((cell, index) => <Cell key={index} text={cell} tone={row.tone} />)}
        </div>
      ))}
      <p className="min-h-5 text-[11px] text-muted-foreground">{after ? "e9 기록은 덮임 · e10 기록이 previous로 이동" : "e9 = epoch 9 기록 · e10 = epoch 10 기록"}</p>
    </div>
  );
}

function Lookahead({ after }: { after: boolean }) {
  const before = [
    { text: "가장 오래된", tone: "old" as const },
    { text: "…", tone: "old" as const },
    { text: "마지막", tone: "old" as const },
  ];
  const shifted = [
    { text: "…", tone: "old" as const },
    { text: "이전 마지막", tone: "old" as const },
    { text: "10+k+1", tone: "new" as const },
  ];
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center gap-1.5">
        <span className="font-mono text-[11px] text-muted-foreground">밀려남</span>
        <Cell text={after ? "가장 오래된" : "—"} tone={after ? "gone" : "zero"} />
        <span className="col-span-2" />
      </div>
      <div className="grid grid-cols-[4.5rem_repeat(3,minmax(0,1fr))] items-center gap-1.5">
        <span className="font-mono text-[11px] text-muted-foreground">lookahead</span>
        {(after ? shifted : before).map((cell, index) => <Cell key={index} text={cell.text} tone={cell.tone} />)}
      </div>
      <p className="min-h-5 text-[11px] text-muted-foreground">칸 하나 = 한 epoch의 proposer 32개 · k = MIN_SEED_LOOKAHEAD</p>
    </div>
  );
}

export default function RotationLookaheadViz() {
  return (
    <SceneShell
      eyebrow="다음 epoch 준비"
      title="기록을 한 칸 밀고, 비운 자리를 새로 채웁니다"
      description="앞의 두 장면은 participation vector(validator마다 이번 epoch 참여 flag를 적는 칸)를, 뒤의 두 장면은 Fulu proposer lookahead를 보여 줍니다. Validator는 입력 사례의 V0·V1·V2입니다."
      ariaLabel="participation rotation과 proposer lookahead가 오래된 기록을 밀어내고 새 칸을 채우는 네 장면"
      scenes={SCENES}
      render={(active) => (active < 2 ? <Participation after={active === 1} /> : <Lookahead after={active === 3} />)}
    />
  );
}
