import SceneShell from "./SceneShell";

/**
 * 본문 대응: #position — "A 다음 B"와 "B 다음 A"가 다른 state trajectory를 만든다.
 * 장난감 가정: kA=(1,0), kB=(0,1), vA=4, vB=2, S0=(0,0), α=.5, β=.25 (00절 예의 α·β).
 * S=αS+β(v−S·k)k → A→B: (1,0) → (.5,.5) / B→A: (0,.5) → (1,.25). A key로 읽으면 .5 대 1.
 */
const ORDERS = [
  { name: "A 다음 B", steps: [{ token: "A", state: [1, 0] }, { token: "B", state: [0.5, 0.5] }] },
  { name: "B 다음 A", steps: [{ token: "B", state: [0, 0.5] }, { token: "A", state: [1, 0.25] }] },
] as const;

/** 어느 장면에서 어느 칸을 강조하는지: [순서 index, step index] */
const FOCUS: readonly (readonly [number, number])[] = [[0, 0], [0, 1], [1, 1], [-1, -1]];

const SCENES = [
  { label: "A 먼저 쓰기", summary: "S = (1, 0)", note: "처음 state는 0이라 A를 읽은 예측은 0이고 오차는 4입니다. β=.25만큼인 1이 A 칸에 들어갑니다." },
  { label: "그다음 B", summary: "S = (.5, .5)", note: "B를 쓸 때 α=.5가 먼저 곱해져 A 칸의 1이 .5로 줄어듭니다. B 칸에는 오차 2의 .25배인 .5가 들어갑니다." },
  { label: "순서 뒤집기", summary: "(0, .5) → (1, .25)", note: "B를 먼저 쓰면 이번에는 B 칸이 한 번 더 α를 맞아 .25가 되고, 나중에 쓴 A 칸은 1로 남습니다." },
  { label: "A key로 읽기", summary: ".5 대 1", note: "같은 두 token, 같은 식인데 A key로 읽은 값이 .5와 1로 다릅니다. 위치 embedding 없이도 순서가 state에 남지만, 정확한 거리 추정까지 보장하지는 않습니다." },
] as const;

const MAX = 1;

function Slot({ name, value, focused }: { name: string; value: number; focused: boolean }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_1.75rem] items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">{name}</span>
      <div className="h-3 min-w-0 rounded-sm bg-muted/50">
        <div className="h-full rounded-sm" style={{ width: `${(value / MAX) * 100}%`, backgroundColor: focused ? "#2563eb" : "#94a3b8" }} />
      </div>
      <span className="text-right font-mono">{value === 0 ? "0" : String(value).replace(/^0/, "")}</span>
    </div>
  );
}

export default function UpdateOrderViz() {
  return (
    <SceneShell
      eyebrow="NoPE에서도 남는 순서 · 장난감 예(가정)"
      title="같은 두 token도 쓰는 순서가 바뀌면 state가 달라집니다"
      description="A·B 두 token만 쓰는 장난감 예입니다(가정). key는 A=(1,0)·B=(0,1)로 겹치지 않고, value는 A=4·B=2, 처음 state는 0, α=.5·β=.25는 00절 예의 값입니다. A칸·B칸은 각 key가 가리키는 state 자리이고 막대는 그 자리의 값입니다."
      ariaLabel="A 다음 B와 B 다음 A의 순서로 같은 KDA 갱신식을 적용했을 때 state 비교"
      scenes={SCENES}
      render={(active) => {
        const focus = FOCUS[active];
        const reading = active === SCENES.length - 1;
        return (
          <div className="grid min-w-0 gap-3">
            {ORDERS.map((order, orderIndex) => (
              <div key={order.name} className="min-w-0">
                <p className="mb-1.5 text-xs font-bold">{order.name}</p>
                <div className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_4.25rem]">
                  {order.steps.map((step, stepIndex) => {
                    const focused = (focus[0] === orderIndex && focus[1] === stepIndex) || (active === 2 && orderIndex === 1);
                    const visible = orderIndex === 0 ? stepIndex <= active || active >= 2 : active >= 2;
                    return (
                      <div
                        key={step.token}
                        className={`min-w-0 rounded-lg border px-2 py-2 transition-opacity duration-300 ${focused ? "border-[#2563eb]" : "border-border"} ${visible ? "opacity-100" : "opacity-25"}`}
                      >
                        <p className="mb-1 text-xs font-semibold">{stepIndex + 1}번째: {step.token} 쓰기</p>
                        <Slot name="A칸" value={step.state[0]} focused={focused} />
                        <div className="mt-1"><Slot name="B칸" value={step.state[1]} focused={focused} /></div>
                      </div>
                    );
                  })}
                  <div className={`col-span-2 flex min-w-0 flex-row items-center justify-center gap-2 rounded-lg border px-1 py-1 text-center sm:col-span-1 sm:flex-col sm:gap-0 sm:py-2 ${reading ? "border-[#7c3aed]" : "border-dashed border-border opacity-40"}`}>
                    <span className="text-[11px] leading-4 text-muted-foreground">A key로 읽기</span>
                    <span className="font-mono text-base font-bold" style={{ color: reading ? "#7c3aed" : undefined }}>
                      {reading ? (orderIndex === 0 ? ".5" : "1") : "?"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
}
