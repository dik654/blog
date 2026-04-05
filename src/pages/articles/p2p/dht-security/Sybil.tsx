import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SybilAttackViz from './viz/SybilAttackViz';

export default function Sybil({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="sybil" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sybil 공격과 IP 쿼터 방어</h2>

      <SybilAttackViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>공격 시나리오</h3>
        <p>
          공격자가 한 대의 머신에서 수천 개의 가짜 노드 ID를 생성한다.
          <br />
          이 노드들을 대량으로 네트워크에 주입하면, 다른 노드의 라우팅 테이블을 오염시킬 수 있다.
          <br />
          핵심 문제: 노드 ID는 자유롭게 만들 수 있지만, 공인 IP 주소는 그렇지 않다.
        </p>

        <h3>go-ethereum의 방어: IP 쿼터</h3>
        <p>
          같은 <code>/24</code> 서브넷(예: <code>1.2.3.0~1.2.3.255</code>)에서 오는 노드 수를 제한한다.
          <br />
          <strong>버킷당 2개</strong> — 한 버킷에 같은 /24에서 최대 2개 노드.
          <br />
          <strong>테이블 전체 10개</strong> — 라우팅 테이블 전체에서 같은 /24에서 최대 10개 노드.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('add-ip', codeRefs['add-ip'])} />
            <span className="text-[10px] text-muted-foreground self-center">table.go — addIP()</span>
          </div>
        )}

        <h3>DistinctNetSet 구조</h3>
        <p>
          <code>netutil.DistinctNetSet</code>이 실제 서브넷 카운팅을 수행한다.
          <br />
          IP를 <code>/24</code> 프리픽스로 변환한 뒤, 해당 프리픽스의 카운터가 Limit 미만인지 확인한다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('distinct-net-set', codeRefs['distinct-net-set'])} />
            <span className="text-[10px] text-muted-foreground self-center">net.go — DistinctNetSet</span>
          </div>
        )}

        <h3>왜 /24인가</h3>
        <p>
          대부분의 가정용 ISP는 하나의 /24 블록(256개 IP) 안에서 주소를 할당한다.
          <br />
          공격자가 같은 데이터센터에서 IP를 확보해도, /24 단위로 묶이므로 테이블 장악이 어렵다.
          <br />
          수천 개의 Sybil 노드를 만들어도, 버킷당 2개 / 전체 10개의 벽을 넘을 수 없다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Sybil 공격과 방어 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sybil Attack (Douceur 2002)
//
// 정의:
//   "시스템에서 한 엔티티가 여러 ID를 가짐"
//   single entity, many identities
//
// P2P 네트워크에서 치명적:
//   - Voting systems (block 확인)
//   - Reputation systems (신뢰도)
//   - Routing (Eclipse 전제)
//   - DHT storage

// 공격 모델:
//
// Resource-constrained:
//   - 한 대 컴퓨터
//   - 제한된 IPs
//   - 하지만 수천 ID 생성 가능
//
// Cloud-scale:
//   - AWS, GCP 활용
//   - 수천 IP 확보
//   - 진짜 분산된 것처럼 보임

// 방어 전략:
//
// 1. Resource Proof
//    - PoW: 노드 생성에 비용
//    - Storage proof
//    - Bandwidth proof
//    → 확장 비용 부과
//
// 2. Identity Verification
//    - Social graph (Freenet)
//    - Trusted introducers
//    - Real-world identity (KYC)
//
// 3. Network Locality Limits
//    - IP diversity (/24, /16)
//    - ASN diversity
//    - Geographic diversity
//    → Ethereum의 접근법
//
// 4. Economic Stake
//    - PoS: 토큰 스테이킹
//    - Deposit/slashing
//    - 공격 비용 >> 공격 이익
//
// 5. Certification Authority
//    - 중앙 CA (비탈중앙화)
//    - PKI
//    → P2P 철학과 상충

// Ethereum discv의 IP 쿼터:
//
//   bucket-level: /24당 2개
//   table-level: /24당 10개
//
//   계산:
//     Attacker IP 수 N
//     N / 256 = /24 subnet 수 (x)
//     Max nodes: min(10·x, bucket·x)
//
//   예:
//     256 IPs (1 /24): 최대 10 nodes
//     2560 IPs (10 /24s): 최대 100 nodes
//     65536 IPs (256 /24s): 최대 2560 nodes
//
//   주의: 전체 테이블 ~1000 노드 수준이면
//         여전히 >50% 점유 가능

// 추가 보완:
//   - PeerID ≠ network ID
//   - Behavior-based filtering
//   - Peer scoring (GossipSub)
//   - Anchor peers

// Research:
//   S/Kademlia (2007): crypto puzzles
//   SybilGuard, SybilLimit: social graph
//   SumUp, Whānau: DHT with Sybil resistance`}
        </pre>
      </div>
    </section>
  );
}
