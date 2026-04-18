import ReactorViz from './viz/ReactorViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Reactor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="reactor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Reactor 패턴 (메시지 디스패치)</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Reactor — Receive(Envelope)로 메시지 수신, AddPeer()/RemovePeer()로 피어 이벤트 처리.<br />
        아래 step에서 Send/TrySend 전송 경로와 recvRoutine 콜백 실행 모델을 추적한다.
      </p>
      <div className="not-prose"><ReactorViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        {/* ── Reactor interface ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Reactor interface</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Reactor interface (6 메서드)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">SetSwitch(*Switch)</code> — Switch 역참조</li>
              <li><code className="text-xs">GetChannels() []*ChannelDescriptor</code> — 사용할 channel 목록</li>
              <li><code className="text-xs">InitPeer(peer Peer) Peer</code> — 연결 직후 (handshake 전)</li>
              <li><code className="text-xs">AddPeer(peer Peer)</code> — handshake 성공 후</li>
              <li><code className="text-xs">RemovePeer(peer Peer, reason interface{})</code> — 연결 종료</li>
              <li><code className="text-xs">Receive(e Envelope)</code> — 메시지 수신 (핵심)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Envelope 구조</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">Src Peer</code> — 송신 peer</li>
              <li><code className="text-xs">ChannelID byte</code> — channel ID</li>
              <li><code className="text-xs">Message proto.Message</code> — protobuf 메시지</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">예시: MempoolReactor</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">GetChannels()</code> → channel <code className="text-xs">0x30</code>, priority 5, queue 100</p>
              <p><code className="text-xs">Receive(e)</code> → <code className="text-xs">*protomem.Txs</code> 타입 매칭</p>
              <p>→ 각 TX에 <code className="text-xs">mempool.CheckTx(tx, ...)</code> 호출</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">Receive 특성 & AddPeer 사용</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">recvRoutine</code> goroutine에서 동기 호출</li>
              <li>오래 걸리면 해당 peer 수신 block</li>
              <li>내부 channel로 비동기 처리 권장</li>
              <li>AddPeer: peer별 state 초기화 + gossip goroutine 시작</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Reactor는 <strong>6개 메서드 interface</strong>.<br />
          GetChannels/Receive/AddPeer/RemovePeer 핵심.<br />
          Receive는 recvRoutine 안에서 동기 호출 → 내부 channel로 비동기화 권장.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡</strong> onReceive 콜백이 recvRoutine 고루틴 안에서 동기 실행.<br />
          Receive()가 오래 걸리면 해당 피어 수신이 블로킹되므로, 실제 ConsensusReactor는 내부 채널에 넣고 즉시 반환한다.
        </p>
      </div>
    </section>
  );
}
