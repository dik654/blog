import StreamMuxViz from './viz/StreamMuxViz';
import CodePanel from '@/components/ui/code-panel';

const streamCode = `// QUIC 스트림 타입 (RFC 9000 Section 2)
// Stream ID의 하위 2비트로 타입 결정:
//   0x0: 클라이언트 시작, 양방향 (Client-Initiated Bidirectional)
//   0x1: 서버 시작, 양방향 (Server-Initiated Bidirectional)
//   0x2: 클라이언트 시작, 단방향 (Client-Initiated Unidirectional)
//   0x3: 서버 시작, 단방향 (Server-Initiated Unidirectional)

// 흐름 제어 (Flow Control)
// 1) 스트림 레벨: MAX_STREAM_DATA 프레임
//    → 개별 스트림의 수신 버퍼 크기 제어
// 2) 연결 레벨: MAX_DATA 프레임
//    → 전체 연결의 총 데이터량 제어
// 3) 스트림 수: MAX_STREAMS 프레임
//    → 동시 열린 스트림 개수 제한`;

const streamAnnotations: { lines: [number, number]; color: 'sky' | 'emerald'; note: string }[] = [
  { lines: [1, 6], color: 'sky', note: '4가지 스트림 타입 — ID 하위 2비트로 구분' },
  { lines: [8, 15], color: 'emerald', note: '3단계 흐름 제어 — 스트림, 연결, 스트림 수' },
];

export default function Streams() {
  return (
    <section id="streams" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스트림: 멀티플렉싱 & 흐름 제어</h2>
      <div className="not-prose mb-8"><StreamMuxViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          QUIC 연결 하나에 수천 개의 독립 스트림을 열 수 있습니다.<br />
          각 스트림은 독립적으로 순서가 보장되며, 다른 스트림의 패킷 손실에 영향받지 않습니다.<br />
          이것이 TCP 대비 QUIC의 가장 큰 장점입니다.
        </p>
        <h3>스트림 타입과 흐름 제어</h3>
        <CodePanel title="QUIC 스트림 구조" code={streamCode}
          annotations={streamAnnotations} />
        <p className="leading-7">
          libp2p에서는 Yamux 멀티플렉서로 TCP 위 스트림을 구현하지만,
          QUIC 전송 사용 시 별도 멀티플렉서 없이 네이티브 스트림을 활용합니다.
        </p>
      </div>
    </section>
  );
}
