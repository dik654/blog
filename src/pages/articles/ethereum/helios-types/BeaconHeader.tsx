import BeaconHeaderViz from './viz/BeaconHeaderViz';
import CodePanel from '@/components/ui/code-panel';
import { headerCode, headerAnnotations } from './codeRefs';

export default function BeaconHeader() {
  return (
    <section id="beacon-header" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        BeaconBlockHeader 필드 상세
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth Header: 15개 필드 (parentHash, stateRoot,
          transactionsRoot, receiptsRoot, logsBloom 등).
          트랜잭션 실행의 모든 결과를 담는다.<br />
          Helios BeaconBlockHeader: 5개 필드만 사용한다.
          slot, proposer_index, parent_root, state_root, body_root.
        </p>
        <p className="leading-7">
          state_root가 가장 중요한 필드이다.
          이 해시 하나로 비콘 체인의 전체 상태 트리를 가리킨다.<br />
          Helios는 이 state_root에서
          execution_payload.state_root를 추출하여
          EL 상태를 검증한다.
        </p>
      </div>
      <div className="not-prose mb-6"><BeaconHeaderViz /></div>
      <CodePanel title="types.rs — BeaconBlockHeader"
        code={headerCode} annotations={headerAnnotations} />
    </section>
  );
}
