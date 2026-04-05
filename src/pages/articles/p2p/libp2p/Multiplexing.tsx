import CodePanel from '@/components/ui/code-panel';
import YamuxStreamViz from './viz/YamuxStreamViz';
import {streamMuxerCode, streamMuxerAnnotations, yamuxFrameCode, comparisonData, } from './MultiplexingData';

export default function Multiplexing({ title }: { title?: string }) {
  return (
    <section id="multiplexing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '멀티플렉싱: Yamux & 스트림 관리'}</h2>
      <div className="not-prose mb-8"><YamuxStreamViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          멀티플렉서(Multiplexer)는 단일 연결 위에 다수의 <strong>논리적 스트림</strong>을 생성합니다.<br />
          각 스트림은 독립적인 프로토콜을 실행합니다.<br />
          Head-of-Line blocking(앞선 패킷 지연에 의한 후속 패킷 차단) 없이 동작합니다.
        </p>

        <h3>StreamMuxer 트레이트</h3>
        <CodePanel title="StreamMuxer 트레이트 정의" code={streamMuxerCode}
          annotations={streamMuxerAnnotations} />

        <h3>Yamux 프레임 구조 & 흐름 제어</h3>
        <p>
          // Yamux 프레임 구조 (12 바이트 헤더)<br />
          // Version Type Flags Stream ID Length<br />
          // 1 byte 1 b 2 byte 4 byte 4 byte<br />
          // Type: 0=Data, 1=WindowUpdate, 2=Ping, 3=GoAway<br />
          // Flags: SYN(1) | ACK(2) | FIN(4) | RST(8)<br />
          // 흐름 제어: WindowUpdate 프레임으로 수신 윈도우 조절<br />
          // - 초기 윈도우: 256 KB<br />
          // - WindowUpdate 수신 시 윈도우 증가<br />
          // - 윈도우 0이면 송신 측 대기 (백프레셔)
        </p>

        <h3>멀티플렉서 비교</h3>
      </div>
      <div className="overflow-x-auto mt-3">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-border">
              {['Muxer', '상태', '최대 스트림', '흐름 제어', '오버헤드'].map(h => (
                <th key={h} className="text-left py-2 px-3 font-mono text-foreground/50">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonData.map(d => (
              <tr key={d.name} className="border-b border-border/30">
                <td className="py-2 px-3 font-mono font-bold" style={{ color: d.color }}>{d.name}</td>
                <td className="py-2 px-3 text-foreground/70">{d.status}</td>
                <td className="py-2 px-3 font-mono text-foreground/60">{d.maxStreams}</td>
                <td className="py-2 px-3 text-foreground/70">{d.flowControl}</td>
                <td className="py-2 px-3 text-foreground/60">{d.overhead}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Multiplexing 개념</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Stream Multiplexing
//
// 문제:
//   TCP 연결 1개당 프로토콜 1개 실행
//   → 프로토콜 다수면 연결 다수 필요
//   → 자원 낭비
//
// 해결:
//   단일 연결에 multiple logical streams
//   각 stream = 독립 프로토콜
//   공유: bandwidth, connection state

// Stream 특성:
//   - Bidirectional
//   - Flow-controlled (backpressure)
//   - Ordered within stream
//   - Independent between streams
//   - Lightweight create/close

// Yamux (Yet another Multiplexer, 2016):
//   HashiCorp 개발
//   HTTP/2 inspired
//
//   Frame 구조:
//     Version(1) + Type(1) + Flags(2)
//     + StreamID(4) + Length(4)
//     = 12 bytes header
//
//   Types:
//     0 = Data
//     1 = WindowUpdate
//     2 = Ping
//     3 = GoAway
//
//   Flags:
//     SYN (1): 새 stream 요청
//     ACK (2): 승인
//     FIN (4): close
//     RST (8): 강제 close

// Flow Control:
//   Initial window: 256 KB per stream
//   Sender: 윈도우만큼만 전송
//   Receiver: WindowUpdate로 확대
//   Zero window: backpressure
//
// HTTP/2 inspired but:
//   - Less complex
//   - No HPACK compression
//   - No priority (flat)
//   - Binary frames only

// mplex vs Yamux vs HTTP/2:
//   ┌─────────┬─────────┬──────────┬────────┐
//   │         │  mplex  │  Yamux   │ HTTP/2 │
//   ├─────────┼─────────┼──────────┼────────┤
//   │ Flow ctl│ No      │ Yes      │ Yes    │
//   │ Priority│ No      │ No       │ Yes    │
//   │ Overhead│ 최소    │ 중간     │ 높음   │
//   │ Status  │deprecated│ 주류     │ 웹 표준│
//   └─────────┴─────────┴──────────┴────────┘

// QUIC multiplexing:
//   Transport layer에 내장
//   No need for separate muxer
//   libp2p-quic 사용 시 yamux 불필요`}
        </pre>
      </div>
    </section>
  );
}
