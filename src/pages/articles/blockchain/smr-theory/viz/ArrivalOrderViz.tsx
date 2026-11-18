import SceneShell from "./SceneShell";

/**
 * 본문 대응: #total-order 첫 문단 + 개요의 deposit 3 / withdraw 1 예.
 * A=deposit 3, B=withdraw 1, 시작 잔액 10은 그림을 위한 가정입니다.
 * 도착 순서대로: replica 1 10→13→12, replica 2 10→9→12. 정해진 delivery A→B: 둘 다 10→13→12.
 */
const START = 10;
const DELTA = { A: 3, B: -1 } as const;
type Msg = keyof typeof DELTA;

const ORDERS: readonly (readonly [readonly Msg[], readonly Msg[]])[] = [
  [["A", "B"], ["B", "A"]],
  [["A", "B"], ["B", "A"]],
  [["A", "B"], ["A", "B"]],
];

const SCENES = [
  { label: "도착 순서가 다릅니다", summary: "replica 1: A,B · replica 2: B,A", note: "같은 두 message가 network를 거쳐 replica마다 다른 순서로 receive buffer에 들어왔습니다. 아직 아무것도 deliver되지 않았습니다." },
  { label: "도착한 순서대로 apply하면", summary: "중간 잔액 13 vs 9", note: "A의 결과로 replica 1은 13, replica 2는 12를 돌려줍니다. 마지막 잔액은 둘 다 12여도 중간 상태와 client reply가 갈립니다." },
  { label: "정해진 delivery 순서로 apply하면", summary: "두 replica 모두 10 → 13 → 12", note: "Protocol이 A 다음 B로 정했다고 둡니다(가정). 도착 순서와 상관없이 두 replica가 같은 순서로 deliver하므로 중간 상태와 reply도 같습니다." },
] as const;

function steps(order: readonly Msg[]) {
  return order.reduce<{ msg: Msg; after: number }[]>((acc, msg) => {
    const before = acc.length ? acc[acc.length - 1].after : START;
    return [...acc, { msg, after: before + DELTA[msg] }];
  }, []);
}

function label(msg: Msg) {
  return msg === "A" ? "A(+3)" : "B(−1)";
}

export default function ArrivalOrderViz() {
  return (
    <SceneShell
      eyebrow="도착 vs delivery"
      title="도착한 순서대로 실행하면 replica가 갈리고, 정해진 순서로 실행하면 맞습니다"
      description="A=deposit 3, B=withdraw 1, 시작 잔액 10은 그림을 위한 가정입니다. Deliver는 protocol이 순서를 확정해 state machine에 넘기는 일입니다."
      ariaLabel="두 replica의 message 도착 순서와 delivery 순서에 따른 잔액 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-4">
          {[0, 1].map((replica) => {
            const arrival = ORDERS[0][replica];
            const applied = ORDERS[active][replica];
            const trail = steps(applied);
            return (
              <div key={replica} className="rounded-lg border border-border bg-background p-3 sm:p-4">
                <p className="text-sm font-bold">replica {replica + 1}</p>
                <div className="mt-2 grid gap-3 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)]">
                  <div>
                    <p className="text-xs text-muted-foreground">receive buffer 도착 순서</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {arrival.map((msg, i) => (
                        <span key={msg} className="rounded-md border border-border px-2 py-0.5 font-mono text-xs">{i + 1}. {msg}</span>
                      ))}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{active === 0 ? "state machine 잔액" : active === 1 ? "도착 순서로 apply" : "delivery 순서로 apply"}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 font-mono text-sm">
                      <span className="rounded-md border border-border px-2 py-0.5">{START}</span>
                      {active === 0 ? (
                        <span className="text-xs text-muted-foreground">아직 apply 전</span>
                      ) : (
                        trail.map((step, i) => (
                          <span key={step.msg} className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground">→ {label(step.msg)} →</span>
                            <span className={`rounded-md border px-2 py-0.5 font-bold ${i === 0 ? (step.after === 13 ? "border-[#2563eb] text-[#2563eb]" : "border-[#d97706] text-[#d97706]") : "border-border"}`}>{step.after}</span>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
