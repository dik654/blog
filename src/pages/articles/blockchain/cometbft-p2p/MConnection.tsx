import MConnectionViz from "./viz/MConnectionViz";
import { codeRefs } from "./codeRefs";
import type { CodeRef } from "@/components/code/types";

export default function MConnection({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="mconnection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Legacy MConnection 다중화</h2>
      <p className="text-sm text-muted-foreground mb-4">
        번들된 legacy 코드에서는 단일 TCP 연결에 여러 논리 채널을 다중화하고
        send/receive routine이 I/O를 직렬화한다. 다만
        rate·queue·ping 값은 프로토콜 상수가 아니라 설정과 버전에 따른 운영
        값이며, 이 구현을 현재 libp2p 스택의 구조로 일반화하지 않는다.
      </p>
      <div className="not-prose">
        <MConnectionViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── MConnection 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">MConnection struct</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              MConnection 핵심 필드
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">conn net.Conn</code> — TCP 연결
              </li>
              <li>
                <code className="text-xs">bufConnReader/Writer</code> — buffered
                I/O
              </li>
              <li>
                <code className="text-xs">
                  sendMonitor/recvMonitor *flow.Monitor
                </code>{" "}
                — rate limiting
              </li>
              <li>
                <code className="text-xs">channels []*Channel</code> — channel
                목록
              </li>
              <li>
                <code className="text-xs">channelsIdx map[byte]*Channel</code>
              </li>
              <li>
                <code className="text-xs">onReceive receiveCbFunc</code> — 수신
                callback
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              MConnConfig 설정값
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">SendRate</code> — 500 KB/s default
              </li>
              <li>
                <code className="text-xs">RecvRate</code> — 500 KB/s
              </li>
              <li>
                <code className="text-xs">MaxPacketMsgPayloadSize</code> — 1024
                bytes
              </li>
              <li>
                <code className="text-xs">FlushThrottle</code> — 100ms
              </li>
              <li>
                <code className="text-xs">PingInterval</code> — 60s
              </li>
              <li>
                <code className="text-xs">PongTimeout</code> — 45s
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              Channel & Descriptor
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">sendQueue chan []byte</code> — pending
                메시지
              </li>
              <li>
                <code className="text-xs">recentlySent int64</code> — 우선순위
                선택용
              </li>
              <li>
                <code className="text-xs">ID byte</code> — 채널 식별자
              </li>
              <li>
                <code className="text-xs">Priority int</code> — 높을수록 우선
              </li>
              <li>
                <code className="text-xs">SendQueueCapacity</code> — 기본 10
              </li>
              <li>
                <code className="text-xs">RecvBufferCapacity</code> — 1 MB
              </li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          MConnection은{" "}
          <strong>
            TCP multiplexing·queueing·rate limiting·liveness check
          </strong>
          를 한 연결 경계에 모은다.
          channel priority는 점유를 스케줄링하는 가중치이지, 특정 채널의 모든
          메시지가 언제나 먼저 전송된다는 절대 보장은 아니다. 따라서
          구체적 수치는 번들된 snapshot의 config를 읽는 단서로만 사용한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 가중 치 스케줄링</strong> —{" "}
          <code>recentlySent / priority</code> 비교는 높은 우선순위 채널이 더
          자주 선택되게 하면서도 다른 채널의 전송 기회를 남기기 위한
          휴리스틱이다.
        </p>
      </div>
    </section>
  );
}
