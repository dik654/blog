import BroadcasterViz from './viz/BroadcasterViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BroadcasterTrait({ onCodeRef }: Props) {
  return (
    <section id="broadcaster-trait" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Broadcaster Trait & Buffered Engine</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>Broadcaster</code> trait — 메시지 전파의 최소 인터페이스
          <br />
          세 연관 타입: <code>Recipients</code>(수신 대상) · <code>Message: Codec</code>(직렬화) · <code>Response</code>(결과)
          <br />
          broadcast() → <code>oneshot::Receiver&lt;Response&gt;</code>로 비동기 결과 수신
        </p>
        <p className="leading-7">
          <strong>buffered::Engine</strong> — 실제 네트워크 처리 엔진
          <br />
          <code>select_loop!</code>으로 mailbox + network + peer 변경 동시 처리
          <br />
          피어별 <code>VecDeque</code>(LRU) + 전역 <code>BTreeMap</code>(items) + refcount로 메모리 관리
        </p>
        <p className="leading-7">
          <strong>Mailbox</strong>가 <code>Broadcaster</code> trait을 구현 — 외부 소비자는 trait만 의존
        </p>
      </div>
      <div className="not-prose mb-8">
        <BroadcasterViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Broadcaster Trait 구현 상세</h3>

        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Core Interface — Broadcaster trait</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p><code>pub trait Broadcaster: Clone + Send + 'static</code></p>
              <p className="text-xs text-muted-foreground mt-2">
                <code>broadcast(&mut self, recipients, message) → oneshot::Receiver&lt;Response&gt;</code>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">최소 표면적</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">Async 친화</p>
                <p className="text-[11px] text-muted-foreground"><code>oneshot</code> 채널</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">타입 제네릭</p>
                <p className="text-[11px] text-muted-foreground">연관 타입</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">엔진 무관</p>
                <p className="text-[11px] text-muted-foreground">다중 구현 가능</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">연관 타입 (Associated Types)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Recipients</code></p>
                <p className="text-xs text-muted-foreground mt-1">"누가 수신?" — 단일 피어, 피어 집합, "전체" 등 다양한 타겟 전략</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Message: Codec</code></p>
                <p className="text-xs text-muted-foreground mt-1">직렬화 가능 페이로드 — <code>Proposal</code>, <code>Vote</code>, <code>Block</code> 등 커스텀 타입</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>Response</code></p>
                <p className="text-xs text-muted-foreground mt-1">"브로드캐스트 결과" — ack 수, 인증서, 에러 등. <code>oneshot</code>으로 반환</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">buffered::Engine 구조</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Engine 필드 — <code>Engine&lt;B: Blob, R: Receiver&gt;</code></p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">mailbox_rx</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>mailbox::Receiver&lt;Request&gt;</code></p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">network</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>NetworkInterface&lt;B&gt;</code></p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">peers</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>BTreeMap&lt;PeerId, PeerState&gt;</code></p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">items</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>BTreeMap&lt;ItemId, BufferedItem&gt;</code></p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">peer_queues</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>BTreeMap&lt;PeerId, VecDeque&lt;ItemId&gt;&gt;</code></p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">max_buffer_size</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>usize</code> — 버퍼 상한</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">select_loop! — 3개 이벤트 동시 처리</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs"><code>mailbox_rx.recv()</code></p>
                <p className="text-[11px] text-muted-foreground mt-1">→ handle_request</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs"><code>network.next_message()</code></p>
                <p className="text-[11px] text-muted-foreground mt-1">→ handle_incoming</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs"><code>network.peer_events()</code></p>
                <p className="text-[11px] text-muted-foreground mt-1">→ handle_peer_change</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">버퍼링 전략 & 백프레셔</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">버퍼링 전략</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">피어별 큐 <code>VecDeque</code></p>
                <p className="text-xs text-muted-foreground mt-1">LRU 정렬 · 피어당 미처리 메시지 상한 · 버퍼 초과 시 가장 오래된 항목 드롭</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">전역 아이템 맵 <code>BTreeMap</code></p>
                <p className="text-xs text-muted-foreground mt-1">중복 제거: 동일 메시지 → 1회 저장, 참조만 N회. 메모리 O(items) vs O(items × peers)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm">Refcount 해제</p>
                <p className="text-xs text-muted-foreground mt-1">모든 피어 큐에서 해제되면 아이템 삭제</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">백프레셔 — 느린 네트워크/피어 → 버퍼 무한 증가 문제</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">피어별 큐 상한</p>
                <p className="text-[11px] text-muted-foreground">예: 100개 메시지 최대</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">가장 오래된 항목 드롭</p>
                <p className="text-[11px] text-muted-foreground">FIFO 시맨틱 유지</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2">
                <p className="text-xs font-semibold">설계 선택</p>
                <p className="text-[11px] text-muted-foreground">드롭(메시지 손실) vs 블록(전역 지연) — Commonware는 가용성 우선 → 드롭 선택</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">네트워크 추상화 & Mailbox 패턴</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">NetworkInterface trait</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">send_to(peer_id, bytes)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">next_message() → (peer_id, bytes)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs font-mono">peer_events() → PeerEvent</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">엔진과 P2P 구현 분리 — QUIC, libp2p, 커스텀 TCP 모두 가능</p>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">Mailbox 패턴 — <code>Mailbox&lt;R&gt;</code>가 <code>Broadcaster</code> trait 구현</p>
            <div className="bg-background rounded-md border p-3 text-sm">
              <p><code>Mailbox</code> 내부: <code>mpsc::Sender&lt;Request&lt;R&gt;&gt;</code></p>
              <p className="text-xs text-muted-foreground mt-2">
                <code>broadcast()</code> 호출 → <code>oneshot::channel()</code> 생성 → <code>Request</code>를 엔진에 전송 → <code>resp_rx</code> 반환
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">엔진 독립 태스크</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">채널 통신</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">자연스러운 async</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-semibold">clone으로 다중 클라이언트</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">에러 처리 & 운영</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">에러 처리</p>
                <p className="text-[11px] text-muted-foreground mt-1"><code>oneshot::Receiver</code> await → <code>Ok(response)</code> 또는 <code>Err(Canceled)</code>(엔진 크래시). 재시도 정책은 엔진 범위 밖</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-xs">프로덕션 고려사항</p>
                <p className="text-[11px] text-muted-foreground mt-1">피어/전역 메모리 제한 · 메시지 크기 제한 · 피어 연결 제한 · 연결 상태 모니터링</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
