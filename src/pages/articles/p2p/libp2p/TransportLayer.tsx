import CodePanel from '@/components/ui/code-panel';
import TransportUpgradeViz from './viz/TransportUpgradeViz';
import {
  transportTraitCode, transportTraitAnnotations,
  transportComparison, upgradeCode, upgradeAnnotations,
} from './TransportLayerData';

export default function TransportLayer({ title }: { title?: string }) {
  return (
    <section id="transport" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Transport 계층'}</h2>
      <div className="not-prose mb-8"><TransportUpgradeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Transport 트레이트는 libp2p의 <strong>네트워크 추상화 경계</strong>입니다.<br />
          TCP, QUIC, WebSocket, WebRTC를 동일한 인터페이스로 다룰 수 있습니다.
        </p>
        <h3>Transport 트레이트</h3>
        <CodePanel title="Transport 트레이트 정의" code={transportTraitCode}
          annotations={transportTraitAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3>Transport 비교</h3>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['Transport', 'Multiaddr', 'Security', 'Mux', 'Latency'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transportComparison.map(t => (
              <tr key={t.transport} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold" style={{ color: t.color }}>
                  {t.transport}
                </td>
                <td className="py-2 px-3 font-mono text-foreground/50">{t.proto}</td>
                <td className="py-2 px-3 text-foreground/70">{t.security}</td>
                <td className="py-2 px-3 text-foreground/70">{t.mux}</td>
                <td className="py-2 px-3 text-foreground/60">{t.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>연결 업그레이드 과정</h3>
        <CodePanel title="TCP 연결 업그레이드 상세" code={upgradeCode}
          annotations={upgradeAnnotations} />
      </div>
    </section>
  );
}
