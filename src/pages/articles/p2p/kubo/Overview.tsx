import ArchViz from './viz/ArchViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Kubo 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Kubo</strong>는 Go로 작성된 IPFS의 공식 참조 구현체입니다.<br />
          CID(콘텐츠 주소 지정) 방식으로 데이터를 저장하고 교환합니다.<br />
          libp2p 위에 <strong>Bitswap</strong>(블록 교환), <strong>Kademlia DHT</strong>(콘텐츠 라우팅),
          <strong>HTTP Gateway</strong>(웹 접근) 등 핵심 서브시스템을 통합합니다.
        </p>
        <h3>핵심 설계 원칙</h3>
        <ul>
          <li><strong>콘텐츠 주소 지정</strong> -- 데이터의 해시(CID)가 곧 주소, 위치 독립적 검색</li>
          <li><strong>Merkle DAG</strong> -- 모든 데이터를 IPLD 노드로 연결하는 비순환 그래프</li>
          <li><strong>분산 교환</strong> -- 중앙 서버 없이 피어 간 직접 블록 전송</li>
          <li><strong>플러그인 아키텍처</strong> -- Datastore, 라우팅, 게이트웨이 등 교체 가능</li>
        </ul>
        <h3>노드 초기화 과정</h3>
        <p>
          <code>ipfs init</code> 시 Ed25519 키 쌍 생성, 기본 config 파일 작성,
          Badger/Flatfs datastore 초기화, bootstrap 피어 목록 설정이 순서대로 진행됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('kubo-ipfsnode', codeRefs['kubo-ipfsnode'])} />
            <span className="text-[10px] text-muted-foreground self-center">IpfsNode 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-newnode', codeRefs['kubo-newnode'])} />
            <span className="text-[10px] text-muted-foreground self-center">NewNode (fx 조립)</span>
            <CodeViewButton onClick={() => onCodeRef('kubo-ipfs-fx', codeRefs['kubo-ipfs-fx'])} />
            <span className="text-[10px] text-muted-foreground self-center">IPFS() 의존성 그래프</span>
          </div>
        )}
      </div>
      <div className="mt-8"><ArchViz /></div>
    </section>
  );
}
