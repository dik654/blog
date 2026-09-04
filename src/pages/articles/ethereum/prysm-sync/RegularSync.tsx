import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function RegularSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="regular-sync" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Regular sync handoff는 range와 gossip이 같은 block을 처리해도 한 번만 commit하게 한다</h2>
      <div className="not-prose my-5 flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef("save-received-block", codeRefs["save-received-block"])} />
        <span className="self-center text-xs text-muted-foreground">분석한 snapshot의 수신 block 처리 확인</span>
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Initial sync가 target에 가까워지면 gossip subscriber를 켜고 range requests를 끝내는 전환 구간이 생깁니다. 이때 같은 block이
          range response와 gossip에서 동시에 들어올 수 있으므로 block root 기반 ingest attempt를 공유합니다. Validation result·post-
          state·store commit은 idempotent하게 합류시킵니다.
        </p>

        <h3>Handoff 조건</h3>
        <p>
          단순히 “head까지 N slot”만 보지는 않습니다. Local wall clock, peer head distribution, current finalized
          checkpoint를 확인하고 committed state cursor, pending gaps, execution payload status까지 함께 봅니다. Gossip을 너무
          일찍 authoritative하게 처리하면 unknown parent queue가 폭증합니다. 너무 늦게 켜면 head 도달 뒤 실시간 block을 놓칩니다. Candidate
          조건을 shadow 관찰한 뒤 range/gossip overlap window를 둡니다.
        </p>

        <h3>Reorg와 missing parent</h3>
        <p>
          Regular sync에서 valid block이 현재 head와 다른 branch를 연장할 수 있습니다. 이는 gap-fill failure가 아니라 fork-choice
          input이므로 parent/state를 확보한 뒤 정상 validation으로 넘깁니다. Unknown parent는 bounded pending graph와 request-
          by-root로 보완합니다. 다만 depth·bytes·deadline을 제한해 attacker가 임의 orphan을 쌓지 못하게 합니다.
        </p>

        <h3>Release gate</h3>
        <p>
          Empty slots, out-of-order·duplicate range, Byzantine peer의 wrong parent/signature, timeout·late
          response를 같은 fixture로 재생합니다. 여기에 checkpoint mismatch, commit crash, range/gossip race, reorg,
          execution SYNCING도 같은 fixture로 넣습니다. Committed block/state roots, cursor, fork-choice input order,
          duplicate side effects와 restart handoff parity가 먼저입니다. Time-to-head·bandwidth·CPU·DB writes 비교는 그
          뒤입니다.
        </p>
      </div>
    </section>
  );
}
