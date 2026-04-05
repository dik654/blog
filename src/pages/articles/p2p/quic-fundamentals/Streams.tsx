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

        <h3 className="text-xl font-semibold mt-6 mb-3">QUIC Streams vs TCP</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// TCP의 Head-of-Line Blocking 문제
//
// TCP: 하나의 byte stream
//
//   Application data:
//     [Request 1][Request 2][Request 3]
//
//   TCP segments:
//     [Seg1][Seg2][Seg3][Seg4][Seg5]
//
//   If Seg2 lost:
//     Seg3, Seg4, Seg5 도착해도 대기
//     retransmit Seg2 완료 후 전달
//     → Request 2, 3 delayed
//
//   HTTP/2 (TCP) 여전히 이 문제 있음

// QUIC의 Independent Streams
//
// QUIC: 여러 독립 스트림
//
//   Stream 1: [S1.Seg1][S1.Seg2][S1.Seg3]
//   Stream 2: [S2.Seg1][S2.Seg2][S2.Seg3]
//   Stream 3: [S3.Seg1][S3.Seg2][S3.Seg3]
//
//   If S1.Seg2 lost:
//     Stream 1만 대기
//     Stream 2, 3은 계속 진행
//     → Full Head-of-Line blocking 해결

// Stream ID Structure:
//   62-bit variable length integer
//   Lower 2 bits encode type:
//     0x00: client-initiated bidirectional
//     0x01: server-initiated bidirectional
//     0x02: client-initiated unidirectional
//     0x03: server-initiated unidirectional
//
//   Upper bits: incremented per stream

// Flow Control:
//
//   3-level hierarchy:
//
//   1. Stream-level
//      MAX_STREAM_DATA frame
//      Per-stream receive buffer limit
//
//   2. Connection-level
//      MAX_DATA frame
//      Total data across all streams
//
//   3. Stream count
//      MAX_STREAMS frame
//      Max concurrent streams
//
// Stream States:
//   idle → open → half-closed → closed
//   (sending or receiving)

// 사용 예 (HTTP/3):
//   Single QUIC connection
//   Multiple concurrent HTTP requests
//   Each request = 1 bidirectional stream
//   → True parallelism
//   → No head-of-line blocking

// libp2p-quic 활용:
//   Native QUIC streams
//   No additional muxer needed
//   Each protocol = own stream
//   Kademlia, GossipSub, Identify 병렬`}
        </pre>
      </div>
    </section>
  );
}
