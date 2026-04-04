import CodePanel from '@/components/ui/code-panel';
import ChainSyncFlowViz from './viz/ChainSyncFlowViz';
import {
  SYNC_STATE_CODE, SYNC_STATE_ANNOTATIONS,
  BATCH_SYNC_CODE, BATCH_SYNC_ANNOTATIONS,
  NODE_MODE_CODE, NODE_MODE_ANNOTATIONS,
} from './ChainSyncData';

export default function ChainSync({ title }: { title?: string }) {
  return (
    <section id="chain-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '체인 동기화 메커니즘'}</h2>
      <div className="not-prose mb-8"><ChainSyncFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys 체인 동기화는 <strong>블록 인덱스 기반 배치 동기화</strong>로 구현됩니다.<br />
          초기 동기화, 지속적 블록 전파, 포크 해결, 고아 블록 처리를 지원합니다.
        </p>

        <h3>동기화 상태 관리</h3>
        <CodePanel title="ChainSyncState 구조체" code={SYNC_STATE_CODE}
          annotations={SYNC_STATE_ANNOTATIONS} />

        <h3>배치 동기화 프로세스</h3>
        <CodePanel title="블록 인덱스 기반 배치 동기화" code={BATCH_SYNC_CODE}
          annotations={BATCH_SYNC_ANNOTATIONS} />

        <h3>동기화 모드</h3>
        <CodePanel title="Genesis / PeerSync / TrustedPeerSync" code={NODE_MODE_CODE}
          annotations={NODE_MODE_ANNOTATIONS} />
      </div>
    </section>
  );
}
