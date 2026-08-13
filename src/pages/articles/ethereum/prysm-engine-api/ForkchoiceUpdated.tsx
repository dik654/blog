import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function ForkchoiceUpdated({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="forkchoice-updated" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">forkchoiceUpdated는 세 pointer를 적용한 뒤에만 build를 시작한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>ForkchoiceState</code>는 <code>headBlockHash</code>, <code>safeBlockHash</code>, <code>finalizedBlockHash</code>를 전달합니다. 최신 head와 더 강한 consensus evidence를 가진 safe·finalized pointer는 같을 필요가 없지만, safe와 finalized는 선택한 head의 chain에 속해야 합니다. EL은 같은 순서로 받은 update를 처리하고 valid head/finalized 조건이 맞을 때 pointer를 atomic하게 갱신합니다.</p>
      </div>
      <div className="not-prose my-5 flex flex-wrap items-center gap-3"><CodeViewButton onClick={() => onCodeRef("engine-forkchoice", codeRefs["engine-forkchoice"])} /><span className="text-xs text-muted-foreground">Prysm의 fork-choice 전달 seam</span></div>
      <div className="not-prose my-7 grid gap-4 md:grid-cols-3 md:gap-6">
        {[['head','현재 실행 chain tip'],['safe','합의가 safe로 전달한 ancestor'],['finalized','더 강한 되돌림 제한을 가진 ancestor']].map(([name, body]) => <section key={name} className="min-w-0 border-t border-border pt-4"><code className="text-xs font-semibold text-primary">{name}BlockHash</code><p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p></section>)}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>작은 reorg를 pointer 세 개로 읽습니다</h3>
        <p>Execution tree가 A–B–C와 A–B–D–E를 알고 있고 새 consensus head가 E, safe가 D, finalized가 B라고 합시다. 이 update는 E를 canonical tip으로 바꾸지만 B보다 이전 history를 새로 확정한다는 뜻은 아닙니다. 만약 safe가 C라면 C는 E의 chain에 없으므로 inconsistent forkchoice state이며 build를 시작해서는 안 됩니다.</p>
        <h3>PayloadAttributes는 pointer update와 build request를 한 호출에 싣습니다</h3>
        <p>Attributes가 null이면 pointer만 갱신하고 <code>payloadId</code>는 null입니다. 값이 있고 timestamp·fork별 field가 유효하면 EL은 head 위에서 build를 시작하고 opaque 8-byte <code>payloadId</code>를 반환할 수 있습니다. Attributes validation이 실패해도 이미 성공한 fork-choice update를 되돌리지 않는 규격 경계를 기억해야 합니다.</p>
        <h3>Unknown head와 invalid head는 같은 실패가 아닙니다</h3>
        <p>필요한 data가 없는 unknown head는 SYNCING과 null payloadId로 응답할 수 있지만, INVALID head에는 latestValidHash를 이용한 branch reconciliation이 필요합니다. Client-specific reorg limit을 넘으면 too-deep-reorg error가 날 수 있으므로, 모든 실패를 동일한 exponential retry로 보내면 영구 오류가 폭주합니다.</p>
      </div>
    </section>
  );
}
