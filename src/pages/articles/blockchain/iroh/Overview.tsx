import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ArchViz from './viz/ArchViz';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 핵심 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>iroh</strong>는 Rust로 구현된 P2P QUIC 연결 라이브러리입니다.<br />
          두 노드가 NAT·방화벽을 넘어 직접 암호화된 연결을 맺을 수 있도록
          hole-punching, relay, 분산 노드 발견을 하나의 API로 제공합니다.<br />
          Tailscale의 <code>magicsock</code>에서 영감을 받았으며,{' '}
          <code>iroh-blobs</code>(콘텐츠 주소 전송), <code>iroh-gossip</code>,{' '}
          <code>iroh-docs</code> 같은 상위 프로토콜의 토대가 됩니다.
        </p>
        <h3>핵심 설계 목표</h3>
        <ul>
          <li><strong>직접 연결 우선</strong> — relay는 최후 수단, 가능하면 항상 UDP 직접 연결</li>
          <li><strong>공개키 = 주소</strong> — IP 없이 NodeId(Ed25519 공개키)만으로 연결</li>
          <li><strong>투명한 failover</strong> — 직접 경로 장애 시 relay로 무중단 전환</li>
          <li><strong>프로토콜 확장성</strong> — ALPN 기반 멀티플렉싱으로 커스텀 프로토콜 빌드</li>
        </ul>
        <h3>Endpoint — 핵심 진입점</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('endpoint-struct', codeRefs['endpoint-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Endpoint struct</span>
          <CodeViewButton onClick={() => onCodeRef('endpoint-connect', codeRefs['endpoint-connect'])} />
          <span className="text-[10px] text-muted-foreground self-center">connect()</span>
          <CodeViewButton onClick={() => onCodeRef('connection-struct', codeRefs['connection-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Connection&lt;State&gt;</span>
        </div>
        <p>
          <code>Endpoint</code>는 <code>Arc&lt;EndpointInner&gt;</code>를 감싸는 핸들로,
          내부에 QUIC 엔드포인트(noq), MagicSock, TLS 설정을 모두 보유합니다.
          <code>connect()</code>로 원격 피어에 연결하고, <code>accept()</code>로
          수신 연결을 처리합니다.
        </p>
      </div>
      <div className="mt-8">
        <ArchViz />
      </div>
    </section>
  );
}
