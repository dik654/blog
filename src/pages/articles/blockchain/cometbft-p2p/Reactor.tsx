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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/p2p/base_reactor.go
type Reactor interface {
    service.Service

    // Switch setting
    SetSwitch(*Switch)

    // GetChannels: 이 reactor가 사용할 channel 목록
    GetChannels() []*conn.ChannelDescriptor

    // InitPeer: peer 연결 직후 호출 (handshake 전)
    InitPeer(peer Peer) Peer

    // AddPeer: handshake 성공 후
    AddPeer(peer Peer)

    // RemovePeer: 연결 종료 시
    RemovePeer(peer Peer, reason interface{})

    // Receive: 메시지 수신 (핵심!)
    Receive(e Envelope)
}

// Envelope: reactor 간 메시지 전달
type Envelope struct {
    Src       Peer        // 송신 peer
    ChannelID byte        // channel ID
    Message   proto.Message
}

// 예시 Reactor (MempoolReactor):
type MempoolReactor struct {
    p2p.BaseReactor
    mempool mempool.Mempool
    ids     *mempoolIDs
}

func (r *MempoolReactor) GetChannels() []*p2p.ChannelDescriptor {
    return []*p2p.ChannelDescriptor{{
        ID: MempoolChannel,  // 0x30
        Priority: 5,
        SendQueueCapacity: 100,
        RecvBufferCapacity: 65536,
    }}
}

func (r *MempoolReactor) Receive(e p2p.Envelope) {
    switch msg := e.Message.(type) {
    case *protomem.Txs:
        for _, tx := range msg.Txs {
            r.mempool.CheckTx(tx, nil, mempool.TxInfo{SenderID: r.ids.GetForPeer(e.Src)})
        }
    default:
        r.Logger.Error("unknown msg", "type", fmt.Sprintf("%T", msg))
    }
}

// Receive 특성:
// - recvRoutine goroutine에서 동기 호출
// - 오래 걸리면 해당 peer 수신 block됨
// - 내부 channel로 비동기 처리 권장

// AddPeer 사용:
// - peer별 state 초기화
// - gossip goroutine 시작
// - subscribe to peer events`}
        </pre>
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
