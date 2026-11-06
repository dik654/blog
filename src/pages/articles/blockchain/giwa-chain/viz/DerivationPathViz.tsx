import SceneShell from "./SceneShell";

/**
 * 본문 대응: #derivation-heads — sequencer가 먼저 보인 block 120을 op-node가 L1에서 다시 만들고,
 * op-reth가 parent 119 위에서 실행해 payload·receipt·state root를 기준 node와 비교한다. 다르면 safe head를 전진시키지 않는다.
 */
const ROWS = [
  { who: "Sequencer", input: "거래 T", output: "block 120 먼저 배포" },
  { who: "op-node", input: "L1 data · batch frame · rollup 규칙", output: "payload P120" },
  { who: "op-reth", input: "parent state S119 · P120", output: "receipt, state root" },
  { who: "기준 node 비교", input: "같은 L1 view의 payload · receipt · state root", output: "같으면 safe 전진" },
] as const;

const SCENES = [
  { label: "빠른 길: 먼저 보입니다", summary: "unsafe · 교체될 수 있음", note: "사용자는 빠르게 결과를 보지만 이 branch는 아직 교체될 수 있습니다. 이 위치가 unsafe head입니다." },
  { label: "느린 길: L1에서 다시 만듭니다", summary: "순서와 규칙을 해석", note: "op-node는 L1 block·receipt·beacon data와 batch frame(L2 거래 조각)을 rollup 규칙대로 읽어 payload를 정합니다." },
  { label: "EVM으로 실행합니다", summary: "S119 + P120 → S120", note: "op-reth는 payload를 parent state 위에서 EVM으로 실행합니다. Receipt는 실행 결과 기록, state root는 실행 뒤 상태의 해시입니다." },
  { label: "결과가 같을 때만 전진합니다", summary: "다르면 safe 전진 금지", note: "Safe head는 L1 batch에서 재구성된 head입니다. 세 값 중 하나라도 기준 node와 다르면 전진시키면 안 됩니다." },
] as const;

export default function DerivationPathViz() {
  return (
    <SceneShell
      eyebrow="같은 block으로 가는 두 길"
      title="먼저 보인 block 120을 L1 입력에서 다시 만들어 맞춰 봅니다"
      description="칸 하나가 한 단계입니다. 굵은 이름이 처리 주체, 화살표 뒤가 결과, 아랫줄이 입력입니다."
      ariaLabel="Sequencer, op-node, op-reth, 기준 node 비교로 이어지는 block 120 재현 단계"
      scenes={SCENES}
      render={(active) => (
        <div className="space-y-1.5">
          {ROWS.map((row, index) => {
            const lit = index === active;
            const done = index < active;
            return (
              <div key={row.who}>
                {index === 1 && <p className="mb-1 text-xs text-muted-foreground">┄ L1 입력에서 다시 만드는 길</p>}
                <div className={`rounded border px-2 py-1 text-sm leading-5 ${lit ? "border-primary bg-background" : "border-border/50"} ${lit || done ? "" : "opacity-40"}`}>
                  <p className="flex flex-wrap items-baseline gap-x-2">
                    <strong className={lit ? "text-primary" : ""}>{row.who}</strong>
                    <span aria-hidden="true" className="text-muted-foreground">→</span>
                    <span className="font-semibold">{row.output}</span>
                  </p>
                  <p className="mt-0.5 break-keep text-xs text-muted-foreground">입력: {row.input}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
