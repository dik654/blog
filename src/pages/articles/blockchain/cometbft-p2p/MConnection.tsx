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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">MConnection 핵심 필드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">conn net.Conn</code> — TCP 연결</li>
              <li><code className="text-xs">bufConnReader/Writer</code> — buffered I/O</li>
              <li><code className="text-xs">sendMonitor/recvMonitor *flow.Monitor</code> — rate limiting</li>
              <li><code className="text-xs">channels []*Channel</code> — channel 목록</li>
              <li><code className="text-xs">channelsIdx map[byte]*Channel</code></li>
              <li><code className="text-xs">onReceive receiveCbFunc</code> — 수신 callback</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">MConnConfig 설정값</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">SendRate</code> — 500 KB/s default</li>
              <li><code className="text-xs">RecvRate</code> — 500 KB/s</li>
              <li><code className="text-xs">MaxPacketMsgPayloadSize</code> — 1024 bytes</li>
              <li><code className="text-xs">FlushThrottle</code> — 100ms</li>
              <li><code className="text-xs">PingInterval</code> — 60s</li>
              <li><code className="text-xs">PongTimeout</code> — 45s</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">Channel & Descriptor</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">sendQueue chan []byte</code> — pending 메시지</li>
              <li><code className="text-xs">recentlySent int64</code> — 우선순위 선택용</li>
              <li><code className="text-xs">ID byte</code> — 채널 식별자</li>
              <li><code className="text-xs">Priority int</code> — 높을수록 우선</li>
              <li><code className="text-xs">SendQueueCapacity</code> — 기본 10</li>
              <li><code className="text-xs">RecvBufferCapacity</code> — 1 MB</li>
            </ul>
          </div>
        </div>
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
