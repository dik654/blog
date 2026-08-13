import VizFrame from "@/components/viz/VizFrame";

const FLOW = [
  ["01 · decode", "SSZ object", "Topic·fork digest와 bounded bytes를 typed consensus object로 바꿉니다."],
  ["02 · validate", "Signature·state rule", "Domain·signing root와 parent/pre-state 조건을 확인합니다."],
  ["03 · transition", "Beacon state", "Slot·epoch·block operation을 순서대로 적용해 post-state root를 만듭니다."],
  ["04 · choose", "Head·finality", "Fork choice head와 justified·finalized checkpoint를 별도 evidence로 갱신합니다."],
  ["05 · act", "Duty·Engine handoff", "Validator signing과 execution-payload status를 owner별 receipt로 남깁니다."],
] as const;

export default function PrysmArchitectureViz() {
  return (
    <VizFrame
      eyebrow="Prysm consensus-object lifecycle"
      title="Wire object는 검증·state·head·duty를 거치며 서로 다른 evidence가 됩니다"
      description="Gossip accept, state transition, head selection, finality와 validator signature를 하나의 성공 상태로 합치지 않습니다."
      note="Prysm은 consensus client입니다. EVM execution은 Engine API 너머 execution client가 소유하며 VALID·INVALID·SYNCING status를 별도로 조정합니다."
    >
      <ol className="grid min-w-0 gap-5 lg:grid-cols-5">
        {FLOW.map(([label, title, body]) => (
          <li key={label} className="min-w-0 border-t border-border pt-4">
            <p className="font-mono text-[11px] font-semibold text-primary">{label}</p>
            <p className="mt-2 text-sm font-bold leading-5">{title}</p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-7 grid gap-3 border-t border-border pt-5 md:grid-cols-3">
        <p className="text-xs leading-5"><strong>Object identity</strong><br /><span className="text-muted-foreground">fork · slot · root · parent · domain</span></p>
        <p className="text-xs leading-5"><strong>State identity</strong><br /><span className="text-muted-foreground">pre/post root · head · justified · finalized</span></p>
        <p className="text-xs leading-5"><strong>Authority receipt</strong><br /><span className="text-muted-foreground">duty · signing root · slashing check · execution status</span></p>
      </div>
    </VizFrame>
  );
}
