import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PeerConnViz from './viz/PeerConnViz';

export default function PeerConnection({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="peer-connection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">피어 연결</h2>
      <p className="leading-7 mb-4">
        피어 연결은 queued → connected → live → dead/not_needed 생명주기를 따릅니다.<br />
        peer_binary_protocol 크레이트가 BitTorrent 메시지 직렬화를 담당합니다.<br />
        librqbit이 피어 태스크 관리와 Choke/Unchoke(전송 제한/해제) 알고리즘을 구현합니다.
      </p>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('message-enum', codeRefs['message-enum'])} />
          <CodeViewButton onClick={() => onCodeRef('handshake', codeRefs['handshake'])} />
          <CodeViewButton onClick={() => onCodeRef('peer-connection', codeRefs['peer-connection'])} />
        </div>
      )}

      <PeerConnViz />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">피어 발견 소스</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>HTTP 트래커</strong>: Announce 요청으로 피어 목록 수신</li>
            <li><strong>UDP 트래커</strong>: connect → announce 2단계 프로토콜</li>
            <li><strong>DHT get_peers</strong>: Info Hash로 분산 검색</li>
            <li><strong>LSD</strong>: BEP-14 멀티캐스트 로컬 검색</li>
            <li><strong>PEX (ut_pex)</strong>: 연결된 피어에서 추가 피어 교환</li>
          </ul>
        </div>
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">프로토콜 메시지</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>Handshake</strong>: 프로토콜 문자열 + Info Hash + Peer ID</li>
            <li><strong>Bitfield</strong>: 보유 피스 비트맵</li>
            <li><strong>Request</strong>: index + begin + length</li>
            <li><strong>Piece</strong>: index + begin + block data</li>
            <li><strong>Have</strong>: 새로 완성된 피스 알림</li>
          </ul>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BitTorrent Wire Protocol</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BitTorrent Peer Wire Protocol (BEP-3)
//
// Handshake (68 bytes):
//   1 byte: pstrlen = 19
//   19 bytes: "BitTorrent protocol"
//   8 bytes: reserved (extension flags)
//   20 bytes: info_hash
//   20 bytes: peer_id
//
// After handshake: length-prefixed messages
//
//   [4 bytes: length][1 byte: type][payload]

// Message Types:
//
//   0: choke        "나는 너에게 block 안 보냄"
//   1: unchoke      "이제 보낼게"
//   2: interested   "네 블록 원함"
//   3: not interested
//   4: have         "블록 X 가짐"
//   5: bitfield     "보유 블록 bitmap"
//   6: request      "블록 X 보내줘"
//   7: piece        "여기 블록 X"
//   8: cancel       "X 취소"
//   9: port         "DHT port 알림"
//   20: extended    "extension protocol"

// State Machine:
//
//   am_choking: 1 (block 안 보냄)
//   am_interested: 0
//   peer_choking: 1
//   peer_interested: 0
//
// Initial state: choked, not interested
// Goal: unchoke + interested on both sides

// Choke/Unchoke Algorithm:
//
//   Every 10s: "regular unchoke"
//     Rank peers by upload speed (leecher)
//     or download speed (seeder)
//     Unchoke top 4
//
//   Every 30s: "optimistic unchoke"
//     Random peer unchoked
//     Explore new peers
//
//   → Tit-for-tat fairness
//   → Reciprocity encouraged

// Piece Selection:
//
//   Rarest First:
//     Prefer rare pieces
//     Maximize swarm health
//
//   Random First Piece:
//     First piece: random
//     Get something to share quickly
//
//   End Game Mode:
//     Few pieces left
//     Request from multiple peers
//     Cancel on first response

// rqbit 구현:
//   Tokio async streams per peer
//   Per-peer task with state
//   Channel-based coordination
//   Backpressure via bounded channels`}
        </pre>
      </div>
    </section>
  );
}
