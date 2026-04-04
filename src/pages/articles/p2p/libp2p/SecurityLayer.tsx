import CodePanel from '@/components/ui/code-panel';
import NoiseXXHandshakeViz from './viz/NoiseXXHandshakeViz';
import {
  noisePayloadCode, noisePayloadAnnotations,
  keyExchangeCode, keyExchangeAnnotations,
} from './SecurityLayerData';

export default function SecurityLayer({ title }: { title?: string }) {
  return (
    <section id="security-layer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '보안 계층: Noise 프로토콜'}</h2>
      <div className="not-prose mb-8"><NoiseXXHandshakeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p — <strong>Noise Framework</strong> XX 패턴으로 보안 채널 수립<br />
          X.509 인증서 없이 공개키 기반 신원 인증 +
          전방향 비밀(Forward Secrecy) 달성
        </p>

        <h3>신원 바인딩 Payload</h3>
        <p>
          Noise 핸드셰이크 중 libp2p Ed25519 키로
          DH 공개키 서명 — DH 키교환과 PeerId 인증을 동시 수행
        </p>
        <CodePanel title="Noise 핸드셰이크 Payload" code={noisePayloadCode}
          annotations={noisePayloadAnnotations} />

        <h3>X25519 키 교환 상세</h3>
        <p>
          XX 패턴 — 총 3번의 DH 연산(ee, es, se) 수행<br />
          양방향 인증 + 전방향 비밀 동시 달성
        </p>
        <CodePanel title="X25519 DH 키 교환" code={keyExchangeCode}
          annotations={keyExchangeAnnotations} />
      </div>
    </section>
  );
}
