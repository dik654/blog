import LcUpdateViz from './viz/LcUpdateViz';
import CodePanel from '@/components/ui/code-panel';
import { updateCode, updateAnnotations } from './codeRefs';

export default function LcUpdate() {
  return (
    <section id="lc-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        LightClientUpdate 구조체
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth에는 이 타입이 없다.
          풀노드는 모든 블록을 실행하므로
          경량 업데이트가 불필요하다.<br />
          Helios는 LightClientUpdate로
          블록 실행 없이 체인 진행을 추적한다.
        </p>
        <p className="leading-7">
          7개 필드가 하나의 메시지를 구성한다:<br />
          attested_header — 위원회가 서명한 헤더.<br />
          next_sync_committee + branch — 다음 주기 위원회 증명.<br />
          finalized_header + branch — 최종성 증명.<br />
          sync_aggregate — BLS 서명.<br />
          signature_slot — 서명 시점.
        </p>
      </div>
      <div className="not-prose mb-6"><LcUpdateViz /></div>
      <CodePanel title="types.rs — LightClientUpdate"
        code={updateCode} annotations={updateAnnotations} />
    </section>
  );
}
