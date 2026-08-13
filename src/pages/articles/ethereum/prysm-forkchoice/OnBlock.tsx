import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

const HANDLERS = [
  ["on_tick", "현재 slot·epoch와 proposer-boost 수명을 갱신", "단조 시간·clock assumption"],
  ["on_block", "검증된 block과 post-state·checkpoint를 store에 연결", "known parent·future block·execution status"],
  ["on_attestation", "target state를 확인하고 validator별 latest message 갱신", "epoch/slot timing·known target·signature"],
  ["on_attester_slashing", "equivocating validator를 weight 계산에서 제외", "두 indexed attestation의 slashability"],
] as const;

export default function OnBlock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="on-block" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Handler는 검증된 event만 store transition으로 바꾼다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Fork choice는 network callback의 부수 효과가 아니라 명시적인 event-driven state machine으로 읽는 편이 안전합니다.
          Block, attestation, clock tick과 slashing evidence는 서로 다른 validation과 state dependency를 가지며, handler가
          실패하면 store를 부분 갱신하지 않아야 합니다. 이 원자성이 깨지면 같은 input replay에서 다른 head가 나올 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-6 grid min-w-0 gap-4 md:grid-cols-2">
        {HANDLERS.map(([name, action, gate]) => (
          <article key={name} className="min-w-0 rounded-lg border border-border p-4">
            <p className="font-mono text-xs font-bold text-primary">{name}</p>
            <p className="mt-2 text-sm leading-6">{action}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">gate · {gate}</p>
          </article>
        ))}
      </div>

      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("on-block", codeRefs["on-block"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 block handler 확인</span>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Block 한 개를 넣는 순서</h3>
        <ol>
          <li>Block root, parent root, slot과 source를 trace에 고정합니다.</li>
          <li>Known parent, 시간·slot, finalized ancestry와 consensus validation을 확인합니다.</li>
          <li>Parent state에서 transition한 post-state와 execution payload status를 연결합니다.</li>
          <li>Block node와 checkpoint evidence를 같은 commit 단위로 store에 반영합니다.</li>
          <li>Timely block이면 해당 slot에서만 proposer boost root를 설정하고 이후 tick에서 제거합니다.</li>
        </ol>
        <p>
          Proposer boost는 제시간에 전파된 block이 network latency 때문에 아직 attestation을 충분히 받지 못한 짧은 구간을
          보정하는 임시 weight입니다. 영구 stake나 proposer의 특권이 아니며 slot boundary와 timeliness 조건이 틀리면 다른
          node와 head가 갈릴 수 있습니다.
        </p>

        <h3>실패를 상태로 남겨야 하는 이유</h3>
        <p>
          Future block, unknown parent, finalized checkpoint 충돌, invalid execution payload와 duplicate input은 모두 같은
          “실패”가 아닙니다. 일부는 나중에 parent가 도착하면 retry할 수 있고 일부는 영구 reject이며 duplicate는 idempotent
          no-op일 수 있습니다. Receipt에 reason, retryability, store generation과 pre/post head를 남겨야 restart 후 안전하게
          재생할 수 있습니다.
        </p>
        <p>
          특히 execution client가 SYNCING인 상태와 INVALID를 합치면 안 됩니다. 전자는 optimistic path에서 재평가될 수 있지만
          후자는 해당 payload와 descendants의 eligibility를 제한합니다. Fork-choice event는 Engine response와 consensus root를
          같은 trace로 묶되 서로 다른 owner의 판단으로 유지합니다.
        </p>
      </div>
    </section>
  );
}
