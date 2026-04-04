import CodePanel from '@/components/ui/code-panel';
import P2PActorViz from './viz/P2PActorViz';
import { PEER_SERVICE_CODE, PEER_DISCOVERY_CODE, HEALTH_CHECK_CODE, GOSSIP_CODE } from './P2PData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function IrysP2P({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="p2p" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'P2P 네트워킹 & 동기화'}</h2>
      <div className="not-prose mb-8"><P2PActorViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys P2P 네트워크는 <strong>PeerNetworkService</strong>, <strong>GossipService</strong>,
          <strong>ChainSyncService</strong> 세 컴포넌트로 구성됩니다.<br />
          액터 모델(Actix 기반)로 비동기 메시지 통신합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-peer-service', codeRefs['irys-peer-service'])} />
            <span className="text-[10px] text-muted-foreground self-center">peer_network_service.rs</span>
          </div>
        )}

        <h3>PeerNetworkService</h3>
        <CodePanel title="피어 네트워크 서비스 구조체" code={PEER_SERVICE_CODE} annotations={[
          { lines: [1, 10], color: 'sky', note: '서비스 필드 정의' },
        ]} />

        <h3>피어 발견</h3>
        <CodePanel title="부트스트랩 + 동적 피어 확장" code={PEER_DISCOVERY_CODE} annotations={[
          { lines: [2, 7], color: 'sky', note: '부트스트랩 핸드셰이크' },
          { lines: [10, 17], color: 'emerald', note: '동적 피어 확장' },
        ]} />

        <h3>핸드셰이크 & 헬스 체크</h3>
        <CodePanel title="VersionRequest 핸드셰이크" code={HEALTH_CHECK_CODE} annotations={[
          { lines: [2, 6], color: 'sky', note: '핸드셰이크 메시지 구조' },
          { lines: [9, 15], color: 'emerald', note: '비활성 피어 헬스 체크' },
        ]} />

        <h3>GossipService (블록 전파)</h3>
        <CodePanel title="블록 브로드캐스트 & 체인 동기화" code={GOSSIP_CODE} annotations={[
          { lines: [3, 9], color: 'sky', note: '랜덤 피어 선택 브로드캐스트' },
          { lines: [12, 19], color: 'emerald', note: '블록 동기화 루프' },
        ]} />
      </div>
    </section>
  );
}
