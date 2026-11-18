import SceneShell from "./TxpoolSceneShell";

/**
 * 본문 대응: #ordering — BestTransactions iterator는 sender별 independent head만 후보에 넣고, nonce N을 내보낸 뒤 N+1을 해제한다.
 * Payload builder가 sender의 head를 invalid로 표시하면 그 descendants도 건너뛴다.
 * 전제(가정): base fee가 내려가 T7이 Pending이 됨, effective tip은 T7 > T4.
 */
type ChipState = "candidate" | "locked" | "yielded" | "skipped" | "invalid" | "waiting";
interface Frame {
  t7: ChipState;
  t8: ChipState;
  t4: ChipState;
  out: readonly string[];
}

const FRAMES: readonly Frame[] = [
  { t7: "candidate", t8: "locked", t4: "candidate", out: [] },
  { t7: "yielded", t8: "locked", t4: "waiting", out: ["T7"] },
  { t7: "yielded", t8: "candidate", t4: "candidate", out: ["T7"] },
  { t7: "invalid", t8: "skipped", t4: "candidate", out: ["T7 ✗"] },
];

const SCENES = [
  {
    label: "sender별 head만 후보",
    summary: "후보 = Alice T7 · Bob T4",
    note: "후보 집합에는 sender마다 지금 실행 가능한 첫 거래만 들어갑니다. T8은 같은 sender의 nonce 8이라 T7 뒤에 잠겨 있습니다.",
  },
  {
    label: "priority가 높은 head를 내보냄",
    summary: "T7 tip > T4 tip (가정)",
    note: "기본 CoinbaseTipOrdering은 현재 base fee를 기준으로 계산한 effective tip(블록 생산자에게 돌아가는 거래당 몫)으로 비교합니다. 여기서는 T7이 더 높다고 가정해 T7을 먼저 내보냅니다.",
  },
  {
    label: "T8을 해제",
    summary: "후보 = Alice T8 · Bob T4",
    note: "nonce 7을 내보낸 뒤에야 같은 sender의 nonce 8인 T8이 후보에 들어오고, 다시 Bob T4와 priority로 비교합니다. ordering 값이 높아도 nonce 순서를 건너뛰지는 않습니다.",
  },
  {
    label: "분기: builder가 T7을 거절하면",
    summary: "T8도 건너뜀 · T4는 계속",
    note: "2번 장면 뒤 builder가 block gas·실행 결과·자기 정책을 적용하다 Alice의 head T7을 invalid로 표시했다면, 그 descendant인 T8도 건너뜁니다. iterator 순서는 후보 제공일 뿐 block 포함을 보장하지 않습니다.",
  },
] as const;

const STYLE: Record<ChipState, { box: string; tag: string }> = {
  candidate: { box: "border-primary bg-primary/10 text-foreground", tag: "후보" },
  locked: { box: "border-dashed border-border text-muted-foreground", tag: "잠김" },
  yielded: { box: "border-border text-muted-foreground", tag: "내보냄" },
  skipped: { box: "border-dashed border-red-500/70 text-muted-foreground line-through", tag: "건너뜀" },
  invalid: { box: "border-red-500/70 bg-red-500/10 text-foreground", tag: "invalid" },
  waiting: { box: "border-border text-foreground", tag: "후보 · 대기" },
};

function Chip({ name, nonce, state }: { name: string; nonce: string; state: ChipState }) {
  const style = STYLE[state];
  return (
    <div className={`min-w-0 rounded-md border px-2 py-2 text-center ${style.box}`}>
      <strong className="block font-mono text-sm">{name}</strong>
      <span className="block text-[11px]">{nonce}</span>
      <span className="block text-[11px] font-bold">{style.tag}</span>
    </div>
  );
}

function BestHeadsFigure({ active }: { active: number }) {
  const frame = FRAMES[active];
  return (
    <div className="grid min-w-0 gap-4 text-xs leading-5 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <div className="space-y-2">
        <p className="font-semibold text-muted-foreground">sender별 거래 줄</p>
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-semibold">Alice</span>
          <Chip name="T7" nonce="nonce 7" state={frame.t7} />
          <span className="text-center text-muted-foreground">→</span>
          <Chip name="T8" nonce="nonce 8" state={frame.t8} />
        </div>
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-2">
          <span className="font-semibold">Bob</span>
          <Chip name="T4" nonce="nonce 4" state={frame.t4} />
          <span />
          <span />
        </div>
      </div>
      <div className="space-y-2">
        <p className="font-semibold text-muted-foreground">builder가 받은 순서</p>
        <ol className="grid min-h-[4.5rem] grid-cols-3 gap-2 sm:grid-cols-1">
          {[0, 1, 2].map((slot) => {
            const item: string | undefined = frame.out[slot];
            const bad = item?.includes("✗") ?? false;
            return (
              <li key={slot} className={`rounded-md border px-2 py-1.5 text-center font-mono ${item ? (bad ? "border-red-500/70 text-foreground" : "border-primary text-foreground") : "border-dashed border-border text-muted-foreground"}`}>
                {item ? `${slot + 1}. ${item}` : `${slot + 1}. —`}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export default function BestHeadsViz() {
  return (
    <SceneShell
      eyebrow="BestTransactions iterator"
      title="priority는 sender별 맨 앞 거래끼리만 비교합니다"
      description="T7이 Pending으로 올라온 뒤라고 가정합니다(base fee 하락). T7과 T4의 tip 크기 순서도 설명용 가정입니다."
      ariaLabel="sender별 head만 후보로 두고 priority로 하나씩 내보내며 다음 nonce를 해제하는 과정과 head가 invalid일 때 descendants를 건너뛰는 분기"
      scenes={SCENES}
      render={(active) => <BestHeadsFigure active={active} />}
    />
  );
}
