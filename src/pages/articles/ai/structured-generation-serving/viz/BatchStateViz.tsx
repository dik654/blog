import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sequence-state — compiled grammar는 읽기 전용 공유, matcher state와 mask buffer는 sequence별 lifetime,
 * continuous batching에서 끝나거나 취소된 sequence의 state 회수, engine은 매 step sequence별 state로 그 sequence 전용 mask를 logits에 적용.
 * A(tool name 생성 중)·B(amount value 생성 중)는 본문 예. A₂와 C, A₂의 진행 위치는 가정입니다.
 * G₁ = weather/search, G₂ = payment/refund (본문의 A·B union).
 */
type Slot = { seq: string; grammar: "G₁" | "G₂"; state: string } | null;

const SLOTS_BY_SCENE: readonly (readonly Slot[])[] = [
  [
    { seq: "A", grammar: "G₁", state: "tool name 생성 중" },
    { seq: "A₂", grammar: "G₁", state: "city 값 생성 중 (가정)" },
    { seq: "B", grammar: "G₂", state: "amount value 생성 중" },
  ],
  [
    { seq: "A", grammar: "G₁", state: "tool name 생성 중" },
    { seq: "A₂", grammar: "G₁", state: "city 값 생성 중 (가정)" },
    { seq: "B", grammar: "G₂", state: "amount value 생성 중" },
  ],
  [
    { seq: "A", grammar: "G₁", state: "tool name 생성 중" },
    { seq: "A₂", grammar: "G₁", state: "city 값 생성 중 (가정)" },
    { seq: "B", grammar: "G₂", state: "amount value 생성 중" },
  ],
  [
    { seq: "A", grammar: "G₁", state: "tool name 생성 중" },
    { seq: "A₂", grammar: "G₁", state: "city 값 생성 중 (가정)" },
    null,
  ],
  [
    { seq: "A", grammar: "G₁", state: "tool name 생성 중" },
    { seq: "A₂", grammar: "G₁", state: "city 값 생성 중 (가정)" },
    { seq: "C", grammar: "G₁", state: "시작 상태" },
  ],
];

const SCENES = [
  {
    label: "artifact는 공유",
    summary: "G₁ 하나를 A·A₂가 읽기 전용으로",
    note: "같은 batch에 weather/search 요청 A·A₂와 payment/refund 요청 B가 있습니다(A₂는 가정). Compiled grammar G₁은 A와 A₂가 읽기만 하므로 하나를 함께 씁니다. B는 다른 grammar G₂를 씁니다.",
  },
  {
    label: "state는 sequence마다",
    summary: "prefix가 다르면 허용 집합도 다름",
    note: "Matcher state는 그 sequence가 지금까지 만든 prefix에서 어디까지 왔는지입니다. A는 tool name을, B는 amount value를 생성 중이고 A₂는 city 값을 쓰는 중이라고 가정했습니다. 같은 G₁을 써도 A와 A₂의 다음 허용 token은 다릅니다.",
  },
  {
    label: "한 decoding step",
    summary: "각 state → 자기 mask → 자기 logits",
    note: "Engine은 매 step 각 sequence의 matcher state를 조회해 그 sequence 전용 mask를 만들고 그 sequence의 logits에만 적용합니다. A의 mask를 B에 적용하면 B의 허용 집합이 틀립니다.",
  },
  {
    label: "B가 끝나거나 취소되면",
    summary: "B의 state·mask buffer 회수",
    note: "Continuous batching에서는 sequence가 끝나거나 취소되면 그 sequence의 matcher state와 mask buffer를 회수합니다. 회수 대상은 B 몫이며 A·A₂의 state는 그대로 진행합니다.",
  },
  {
    label: "새 sequence C 합류",
    summary: "cache hit여도 state는 새로 시작",
    note: "빈자리에 weather/search 요청 C가 들어왔다고 가정합니다. G₁ artifact는 재사용할 수 있지만 C의 matcher state는 처음 상태에서 새로 시작합니다.",
  },
] as const;

export default function BatchStateViz() {
  return (
    <SceneShell
      eyebrow="matcher state lifetime"
      title="한 batch 안에서 공유하는 것과 따로 가는 것"
      description="위 칸은 compiled grammar(G₁ weather/search, G₂ payment/refund), 아래 줄은 batch의 sequence 자리 세 개입니다. A₂와 C는 가정한 요청입니다."
      ariaLabel="compiled grammar는 공유하고 matcher state와 mask는 sequence별로 유지·회수하는 continuous batch"
      scenes={SCENES}
      render={(active) => {
        const slots = SLOTS_BY_SCENE[active];
        const g2Used = slots.some((slot) => slot?.grammar === "G₂");
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 text-center text-[11px] leading-4 sm:text-xs">
              {(["G₁", "G₂"] as const).map((g) => {
                const users = slots.filter((slot) => slot?.grammar === g).map((slot) => slot?.seq ?? "");
                return (
                  <div key={g} className={`min-w-0 rounded-md border px-2 py-1.5 ${g === "G₂" && !g2Used ? "border-dashed border-border" : "border-primary/60"}`}>
                    <p className="font-semibold">{g} · {g === "G₁" ? "weather/search" : "payment/refund"}</p>
                    <p className="text-muted-foreground">읽기 전용 · 사용: {users.length > 0 ? users.join(", ") : "없음"}</p>
                  </div>
                );
              })}
            </div>
            <p className="my-1 text-center text-xs text-muted-foreground" aria-hidden>↓ 읽기만</p>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`min-w-0 rounded-md border px-2 py-1.5 text-[11px] leading-4 sm:text-xs ${
                    slot === null ? "border-dashed border-red-600/70" : active === 4 && slot.seq === "C" ? "border-emerald-600" : "border-border"
                  }`}
                >
                  {slot === null ? (
                    <>
                      <p className="font-semibold text-red-700 dark:text-red-400">B 종료·취소</p>
                      <p className="mt-1 text-muted-foreground">state 회수</p>
                      <p className="text-muted-foreground">mask buffer 회수</p>
                      <p className="mt-1 text-muted-foreground">빈자리</p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">
                        {slot.seq} <span className="font-normal text-muted-foreground">· {slot.grammar}</span>
                      </p>
                      <p className={`mt-1 break-keep ${active >= 1 ? "" : "text-muted-foreground/60"}`}>state: {active >= 1 ? slot.state : "·"}</p>
                      <p className={active >= 2 ? "font-semibold text-primary" : "text-muted-foreground/60"}>mask: {active >= 2 ? `${slot.seq} 전용` : "·"}</p>
                      <p className={`mt-1 font-mono ${active >= 2 ? "" : "text-muted-foreground/60"}`}>{active >= 2 ? `→ ${slot.seq} logits` : "·"}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
