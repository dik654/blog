import CodePanel from '@/components/ui/code-panel';
import NoiseUpgradeViz from './viz/NoiseUpgradeViz';
import {
  upgradeChainCode, upgradeAnnotations,
  noiseXXCode, noiseAnnotations,
  yamuxCode, yamuxAnnotations,
  quicCode, quicAnnotations,
} from './SecurityData';

export default function Security({ title }: { title?: string }) {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Transport & 보안 계층'}</h2>
      <div className="not-prose mb-8"><NoiseUpgradeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p의 연결은 항상 <strong>Transport → Security → Mux</strong> 순서로 업그레이드됩니다.<br />
          각 단계는 <code>multistream-select</code> 프로토콜로 협상합니다.
        </p>

        <h3>연결 업그레이드 체인</h3>
        <CodePanel title="TCP 연결 업그레이드 과정" code={upgradeChainCode} annotations={upgradeAnnotations} />

        <h3>Noise XX 핸드셰이크</h3>
        <CodePanel title="Noise XX 구현체" code={noiseXXCode} annotations={noiseAnnotations} />

        <h3>Yamux 멀티플렉싱</h3>
        <CodePanel title="Yamux 설정 & 프레임 구조" code={yamuxCode} annotations={yamuxAnnotations} />

        <h3>QUIC Transport</h3>
        <p>
          QUIC은 TLS 1.3과 멀티플렉싱을 내장하고 있어
          Security와 Mux 계층이 불필요합니다.<br />
          libp2p-quic은 quinn 라이브러리 위에 구현됩니다.
        </p>
        <CodePanel title="QUIC Transport" code={quicCode} annotations={quicAnnotations} />
      </div>
    </section>
  );
}
