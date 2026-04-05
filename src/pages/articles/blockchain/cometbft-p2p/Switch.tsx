import SwitchViz from './viz/SwitchViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Switch({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="switch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Switch & Peer 관리</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Switch — Reactor 등록, 피어 연결 수락/다이얼, 메시지 브로드캐스트를 총괄하는 허브.<br />
        각 step에서 AddReactor → OnStart → DialPeersAsync 순서로 초기화 과정을 추적한다.
      </p>
      <div className="not-prose"><SwitchViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        {/* ── Switch 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Switch struct & 초기화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/p2p/switch.go
type Switch struct {
    service.BaseService

    config       *config.P2PConfig
    reactors     map[string]Reactor      // reactor 이름 → Reactor
    chDescs      []*conn.ChannelDescriptor  // 모든 channel descriptors
    reactorsByCh map[byte]Reactor        // channelID → Reactor (dispatch)
    peers        *PeerSet                 // 연결된 peer 목록
    dialing      *cmap.CMap               // 다이얼 중 addrs
    reconnecting *cmap.CMap
    nodeInfo     NodeInfo
    nodeKey      *NodeKey
    addrBook     AddrBook                 // known addresses
    unconditionalPeerIDs map[ID]struct{}   // 강제 유지 peers
    persistentPeersAddrs []*NetAddress

    transport    Transport                // MConnTransport
    filterTimeout time.Duration
    peerFilters   []PeerFilterFunc         // peer 연결 필터

    rng          *cmtrand.Rand
    metrics      *Metrics
}

// 초기화 순서:
// 1. NewSwitch(config, transport, ...options)
// 2. SetNodeInfo(nodeInfo)
// 3. SetNodeKey(nodeKey)
// 4. SetAddrBook(addrBook)
// 5. AddReactor(name, reactor) for each reactor
// 6. Start() (service.BaseService)

// AddReactor 동작:
func (sw *Switch) AddReactor(name string, reactor Reactor) Reactor {
    for _, chDesc := range reactor.GetChannels() {
        chID := chDesc.ID

        // 중복 체크 (panic if duplicate)
        if sw.reactorsByCh[chID] != nil {
            panic(fmt.Sprintf("channel %X already registered", chID))
        }

        sw.chDescs = append(sw.chDescs, chDesc)
        sw.reactorsByCh[chID] = reactor
    }
    sw.reactors[name] = reactor
    reactor.SetSwitch(sw)
    return reactor
}`}
        </pre>
        <p className="leading-7">
          Switch가 <strong>P2P hub</strong> — reactor + peer 관리.<br />
          AddReactor로 channel 등록 + dispatch 테이블 구성.<br />
          channel 중복 등록 → panic (프로토콜 레벨 강제).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡</strong> AddReactor()에서 이미 등록된 channelID를 다시 등록하면 panic.<br />
          채널 ID 충돌을 프로토콜 레벨에서 강제하여 라우팅 오류를 원천 차단한다.
        </p>
      </div>
    </section>
  );
}
