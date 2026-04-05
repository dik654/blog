import MConnectionViz from './viz/MConnectionViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function MConnection({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="mconnection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MConnection 다중화 (채널 프로토콜)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        단일 TCP 위에 N개 채널을 다중화. sendRoutine/recvRoutine 고루틴이 I/O를 전담한다.<br />
        sendRate/recvRate 제한(500KB/s)으로 악의적 피어의 대역폭 독점 공격을 방지한다.
      </p>
      <div className="not-prose"><MConnectionViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        {/* ── MConnection 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">MConnection struct</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/p2p/conn/connection.go
type MConnection struct {
    conn          net.Conn
    bufConnReader *bufio.Reader
    bufConnWriter *bufio.Writer
    sendMonitor   *flow.Monitor   // rate limiting
    recvMonitor   *flow.Monitor

    send          chan struct{}    // send signal
    pong          chan struct{}    // pong signal
    channels      []*Channel       // channel 목록
    channelsIdx   map[byte]*Channel

    onReceive     receiveCbFunc    // callback
    onError       errorCbFunc

    // 통계
    created       time.Time
    stopped       atomic.Int32

    // ping-pong
    pingTimer     *time.Timer
    pongTimeoutCh chan bool

    config        MConnConfig
}

// MConnConfig:
type MConnConfig struct {
    SendRate int64           // 500 KB/s default
    RecvRate int64           // 500 KB/s
    MaxPacketMsgPayloadSize int  // 1024 bytes
    FlushThrottle time.Duration  // 100ms
    PingInterval time.Duration   // 60s
    PongTimeout time.Duration    // 45s
}

// 각 Channel:
type Channel struct {
    conn          *MConnection
    desc          ChannelDescriptor
    sendQueue     chan []byte       // pending messages
    sendQueueSize atomic.Int32
    recving       []byte
    sending       []byte
    recentlySent  int64

    maxPacketMsgPayloadSize int
}

// ChannelDescriptor:
type ChannelDescriptor struct {
    ID                  byte
    Priority            int             // 높을수록 우선
    SendQueueCapacity   int             // 기본 10
    RecvBufferCapacity  int             // 1 MB
    RecvMessageCapacity int
    MessageType proto.Message
}`}
        </pre>
        <p className="leading-7">
          MConnection은 <strong>TCP multiplexing + rate limiting</strong>.<br />
          channel별 priority로 우선순위 보장 (consensus &gt; mempool).<br />
          ping-pong으로 연결 건강 체크 (60s interval, 45s timeout).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡</strong> selectChannelToGossipOn()의 recentlySent/priority 비율 기반 선택은 합의 채널(pri=10)이 멤풀(pri=5)보다 항상 우선 전송되도록 보장한다.
        </p>
      </div>
    </section>
  );
}
