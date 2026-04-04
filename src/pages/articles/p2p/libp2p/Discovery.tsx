import CodePanel from '@/components/ui/code-panel';
import DiscoveryMechanismViz from './viz/DiscoveryMechanismViz';
import {
  mechanisms, mdnsCode, mdnsAnnotations,
  kadDiscoveryCode, kadDiscoveryAnnotations,
} from './DiscoveryData';

export default function Discovery({ title }: { title?: string }) {
  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '피어 발견: mDNS, Kademlia, Rendezvous'}</h2>
      <div className="not-prose mb-8"><DiscoveryMechanismViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          피어 발견은 네트워크 참여의 첫 단계입니다.<br />
          libp2p는 <strong>LAN 자동 발견</strong>(mDNS), <strong>분산 조회</strong>(Kademlia),
          <strong>중앙 등록</strong>(Rendezvous), <strong>부트스트랩</strong>을 조합하여 사용합니다.
        </p>
      </div>

      <div className="space-y-1.5 mt-4">
        {mechanisms.map(m => (
          <div key={m.name} className="rounded-lg border p-3"
            style={{ borderColor: m.color + '30', background: m.color + '06' }}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold w-28" style={{ color: m.color }}>{m.name}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded border"
                style={{ borderColor: m.color + '40', color: m.color }}>{m.scope}</span>
              <span className="text-[10px] font-mono text-foreground/40 ml-auto">{m.latency}</span>
            </div>
            <p className="text-xs text-foreground/65 mt-1.5">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>mDNS 구현</h3>
        <CodePanel title="mDNS 피어 발견" code={mdnsCode} annotations={mdnsAnnotations} />

        <h3>Kademlia DHT 발견</h3>
        <CodePanel title="Kademlia 피어 발견" code={kadDiscoveryCode}
          annotations={kadDiscoveryAnnotations} />
      </div>
    </section>
  );
}
