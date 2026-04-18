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
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">Switch 핵심 필드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">reactors map[string]Reactor</code> — reactor 이름 → Reactor</li>
              <li><code className="text-xs">reactorsByCh map[byte]Reactor</code> — channelID → Reactor (dispatch)</li>
              <li><code className="text-xs">peers *PeerSet</code> — 연결된 peer 목록</li>
              <li><code className="text-xs">dialing *cmap.CMap</code> — 다이얼 중 addrs</li>
              <li><code className="text-xs">addrBook AddrBook</code> — known addresses</li>
              <li><code className="text-xs">transport Transport</code> — MConnTransport</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">Peer 관련 필드</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">nodeInfo NodeInfo</code> — 노드 정보</li>
              <li><code className="text-xs">nodeKey *NodeKey</code> — 노드 키</li>
              <li><code className="text-xs">unconditionalPeerIDs map[ID]struct{}</code> — 강제 유지 peers</li>
              <li><code className="text-xs">persistentPeersAddrs []*NetAddress</code></li>
              <li><code className="text-xs">peerFilters []PeerFilterFunc</code> — peer 연결 필터</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">초기화 순서</div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li><code className="text-xs">NewSwitch(config, transport, ...options)</code></li>
              <li><code className="text-xs">SetNodeInfo(nodeInfo)</code></li>
              <li><code className="text-xs">SetNodeKey(nodeKey)</code></li>
              <li><code className="text-xs">SetAddrBook(addrBook)</code></li>
              <li><code className="text-xs">AddReactor(name, reactor)</code> for each reactor</li>
              <li><code className="text-xs">Start()</code> (service.BaseService)</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">AddReactor 동작</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>reactor의 <code className="text-xs">GetChannels()</code> 순회</p>
              <p>→ 중복 channelID 체크 (있으면 <code className="text-xs">panic</code>)</p>
              <p>→ <code className="text-xs">chDescs</code> 추가 + <code className="text-xs">reactorsByCh[chID]</code> 등록</p>
              <p>→ <code className="text-xs">reactor.SetSwitch(sw)</code> 역참조 설정</p>
            </div>
          </div>
        </div>
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
