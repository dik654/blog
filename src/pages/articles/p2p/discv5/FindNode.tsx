import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function FindNode({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="findnode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FINDNODE: 거리 기반 노드 탐색</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          discv4는 대상 공개키를 보내고 가장 가까운 노드를 요청했다.
          discv5는 <strong>log-distance 배열</strong>을 보낸다. 공격자가 라우팅 테이블을 역추적하기 어렵다.
        </p>

        <h3>메시지 구조</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            { name: 'FINDNODE', fields: 'ReqID, Distances []uint', desc: '요청할 log-distance 목록. 0은 자기 자신의 ENR 요청.' },
            { name: 'NODES', fields: 'ReqID, RespCount, Nodes', desc: 'RespCount로 전체 응답 개수를 알려주고 분할 전송.' },
          ].map(m => (
            <div key={m.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-mono font-bold text-sm text-emerald-400">{m.name}</p>
              <p className="text-xs text-foreground/60 mt-0.5 font-mono">{m.fields}</p>
              <p className="text-sm mt-2">{m.desc}</p>
            </div>
          ))}
        </div>

        <h3>lookupDistances: 인접 거리 계산</h3>
        <p>
          lookup 시 대상 노드에 대해 인접한 거리 3개를 계산한다.<br />
          예: <code>logdist(target, dest) = 255</code>이면 <code>[255, 256, 254]</code>를 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('lookup-distances', codeRefs['lookup-distances'])} />
          <span className="text-[10px] text-muted-foreground self-center">lookupDistances() — 인접 거리 생성</span>
        </div>

        <h3>응답 수집: waitForNodes</h3>
        <p>
          NODES 응답은 패킷 크기(1280B) 제한으로 분할 전송된다.<br />
          첫 응답의 <code>RespCount</code>로 총 패킷 수를 파악하고, 모두 도착하면 반환한다.
          <code>totalNodesResponseLimit = 5</code>로 최대 분할 수를 제한한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('wait-for-nodes', codeRefs['wait-for-nodes'])} />
          <span className="text-[10px] text-muted-foreground self-center">waitForNodes() — 분할 응답 수집</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">discv5 vs discv4 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// discv4 vs discv5 비교
//
// ┌─────────────────┬──────────┬──────────┐
// │     기능        │  discv4  │  discv5  │
// ├─────────────────┼──────────┼──────────┤
// │ 노드 레코드     │ (IP,ID)  │   ENR    │
// │ 세션 암호화     │  없음    │  AES-GCM │
// │ FINDNODE        │ pubkey   │ distances│
// │ Topic discovery │  없음    │ TALKREQ  │
// │ Extension proto │  없음    │ 지원     │
// │ 핸드셰이크      │ Ping/Pong│ WHOAREYOU│
// │ 공격 방어       │ 약함     │ 강함     │
// └─────────────────┴──────────┴──────────┘

// ENR (Ethereum Node Record, EIP-778):
//   Signed record with:
//     - id: scheme (v4)
//     - secp256k1: public key
//     - ip, udp, tcp: endpoints
//     - eth2: fork info
//     - attnets, syncnets: subnets
//     - signature (Ed25519 or secp256k1)
//
//   장점:
//   - Signed (변조 불가)
//   - Versioned (seq number)
//   - Extensible (custom fields)
//   - DNS-friendly (base64 encoded)

// Distance calculation:
//   node_id_A = keccak256(pubkey_A)
//   node_id_B = keccak256(pubkey_B)
//   distance = A XOR B
//   log_distance = ceil(log2(distance + 1))
//   range: 0 to 256

// FINDNODE 개선 (privacy):
//   discv4: "Find nodes near pubkey X"
//     → 공격자가 대상 알 수 있음
//
//   discv5: "Give nodes at distance [253, 254, 255]"
//     → 대상 공개 안 됨
//     → 공격자가 구조 파악 어려움

// Response 분할:
//   Single UDP packet: max 1280 bytes
//   Multiple ENRs 전송 시 분할
//   RespCount로 전체 개수 알림
//   totalNodesResponseLimit = 5

// Bucket refresh:
//   매 주기(30s)마다 lookup
//   ENR 유효성 확인 (Ping/Pong)
//   죽은 노드 제거`}
        </pre>
      </div>
    </section>
  );
}
