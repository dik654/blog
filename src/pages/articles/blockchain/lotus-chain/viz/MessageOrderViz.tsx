import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #state-replay 증명 아이디어의 반례 — m1이 balance를 쓰고 m2가 그 balance를 읽으면
 * 순서를 바꿨을 때 receipt와 post-state가 달라질 수 있다.
 * 잔액 10, m1이 7 사용, m2가 읽은 값을 state에 기록하는 동작은 모두 설명용 가정입니다.
 */
const START = 10;
const SPEND = 7;

const ORDERS = [
  {
    title: "순서 [m1, m2]",
    steps: [
      { msg: "m1", text: `balance ${START} → ${START - SPEND} (${SPEND} 사용)` },
      { msg: "m2", text: `balance를 읽음 → ${START - SPEND}` },
    ],
    seen: START - SPEND,
  },
  {
    title: "순서 [m2, m1]",
    steps: [
      { msg: "m2", text: `balance를 읽음 → ${START}` },
      { msg: "m1", text: `balance ${START} → ${START - SPEND} (${SPEND} 사용)` },
    ],
    seen: START,
  },
] as const;

export default function MessageOrderViz() {
  return (
    <VizFrame
      eyebrow="같은 parent state, 다른 message 순서"
      title="두 message가 같은 balance를 만지면 순서만 바꿔도 결과가 갈라질 수 있습니다"
      description="양쪽 모두 parent state S100에서 balance 10으로 시작합니다. m1은 7을 쓰고, m2는 그때의 balance를 읽어 결과로 남긴다고 가정했습니다(숫자와 m2의 동작은 가정)."
      note="m2가 읽은 값을 state에도 기록한다면(가정) post-state root까지 달라집니다. 그래서 replay는 같은 canonical message order를 입력으로 고정합니다."
      documentFlow
    >
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {ORDERS.map((order) => (
          <div key={order.title} className="min-w-0 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-bold">{order.title}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">S100 · balance {START}</p>
            <ol className="mt-3 space-y-2">
              {order.steps.map((step, index) => (
                <li key={step.msg} className="flex items-baseline gap-2 text-xs leading-5">
                  <span className="shrink-0 font-mono text-muted-foreground">{index + 1}.</span>
                  <span className="shrink-0 rounded border border-primary/50 px-1.5 font-mono font-bold text-primary">{step.msg}</span>
                  <span className="min-w-0 break-keep">{step.text}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 border-t border-border pt-3 text-xs leading-6">
              <p><span className="text-muted-foreground">끝 balance </span><span className="font-mono font-bold">{START - SPEND}</span></p>
              <p><span className="text-muted-foreground">m2 receipt에 남는 값 </span><span className="font-mono font-bold text-primary">{order.seen}</span></p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 break-keep text-center text-xs leading-6 text-muted-foreground">
        끝 balance는 둘 다 {START - SPEND}이지만 m2의 receipt가 {START - SPEND}과 {START}로 달라 receipt root R101이 같지 않습니다.
      </p>
    </VizFrame>
  );
}
