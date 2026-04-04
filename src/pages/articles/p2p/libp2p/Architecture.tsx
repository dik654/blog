import CodePanel from '@/components/ui/code-panel';
import ModuleDependencyViz from './viz/ModuleDependencyViz';
import {moduleRoles, dataFlowCode, dataFlowAnnotations, depGraphCode, } from './ArchitectureData';

export default function Architecture({ title }: { title?: string }) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '전체 아키텍처 & 모듈 의존성'}</h2>
      <div className="not-prose mb-8"><ModuleDependencyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          rust-libp2p는 <strong>facade 크레이트</strong> 패턴을 사용합니다.<br />
          최상위 <code>libp2p</code> 크레이트가 하위 모듈을 re-export합니다.<br />
          각 모듈은 <code>libp2p-core</code>가 정의한 트레이트를 구현합니다.
        </p>

        <h3>모듈 역할</h3>
      </div>
      <div className="space-y-1.5 mt-4">
        {moduleRoles.map(m => (
          <div key={m.name} className="rounded-lg border p-3 flex items-start gap-3"
            style={{ borderColor: m.color + '30', background: m.color + '06' }}>
            <span className="text-xs font-mono font-bold flex-shrink-0 w-40"
              style={{ color: m.color }}>{m.name}</span>
            <span className="text-xs text-foreground/70">{m.role}</span>
          </div>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>데이터 흐름</h3>
        <CodePanel title="패킷 → 이벤트 데이터 흐름" code={dataFlowCode}
          annotations={dataFlowAnnotations} />

        <h3>크레이트 의존성 그래프</h3>
        <p>
          // 크레이트 의존성 그래프 (Cargo.toml)<br />
          // libp2p (facade)<br />
          // libp2p-core (Transport, PeerId, Multiaddr)<br />
          // libp2p-swarm (Swarm, NetworkBehaviour)<br />
          // libp2p-core<br />
          // libp2p-identity (Keypair, PeerId)<br />
          // libp2p-noise (Security)<br />
          // libp2p-core<br />
          // libp2p-yamux (StreamMuxer)<br />
          // libp2p-core<br />
          // libp2p-tcp (Transport impl)<br />
          // libp2p-core
        </p>
      </div>
    </section>
  );
}
