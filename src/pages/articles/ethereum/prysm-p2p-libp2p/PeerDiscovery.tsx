import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function PeerDiscovery({ onCodeRef }: Props) {
  return (
    <section id="peer-discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discv5 피어 탐색</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Discv5는 UDP 위에서 동작하는 피어 탐색 프로토콜이다.<br />
          각 노드는 <strong>ENR(Ethereum Node Record)</strong>에 자신의 정보를 담아 교환한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('discv5-init', codeRefs['discv5-init'])} />
          <span className="text-[10px] text-muted-foreground self-center">initDiscoveryV5()</span>
        </div>

        {/* ── ENR 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ENR — 노드 정보 서명된 레코드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ENR (Ethereum Node Record, EIP-778)
// secp256k1 서명된 key-value 레코드

type ENR struct {
    Signature []byte           // 전체 레코드에 대한 서명
    Seq       uint64           // 시퀀스 번호 (증가 시 새 버전)
    Pairs     map[string]bytes // key-value 쌍
}

// 필수 필드:
// "id": "v4" (identity scheme)
// "secp256k1": 공개키 (33 bytes compressed)

// IP 필드:
// "ip": IPv4 주소 (4 bytes)
// "ip6": IPv6 주소 (16 bytes)
// "tcp": TCP 포트 (big-endian)
// "udp": UDP 포트 (Discv5용)

// Ethereum 2.0 추가 필드:
// "eth2": Eth2Data (128 bytes)
//   - fork_digest (4 bytes): 현재 포크 식별자
//   - next_fork_version (4 bytes): 다음 포크 버전
//   - next_fork_epoch (8 bytes): 다음 포크 epoch
// "attnets": attestation subnet bitfield (8 bytes)
//   - 64 subnets → 64 bits
//   - 자신이 구독 중인 서브넷 표시
// "syncnets": sync committee subnet bitfield (1 byte)
//   - 4 subnets → 4 bits

// ENR 인코딩:
// enr:-Ku4QHqVeJ8PPICcWk1vSn_XcSkjOk...
// base64 URL-safe 인코딩, "enr:" prefix

// 검증:
// 1. 서명 확인 (secp256k1)
// 2. id=="v4" 확인
// 3. 서명자가 "secp256k1" 필드와 일치 확인
// → valid한 ENR만 저장`}
        </pre>
        <p className="leading-7">
          <code>ENR</code>이 <strong>노드의 정체성 카드</strong>.<br />
          서명된 key-value → 변조 방지 + 확장 가능.<br />
          attnets/syncnets 비트필드로 서브넷 피어 필터링.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">탐색 과정</h3>
        <ul>
          <li><strong>부트노드 접속</strong> — 하드코딩된 부트노드 ENR로 초기 연결</li>
          <li><strong>FINDNODE</strong> — 타겟 ID에 가까운 노드를 재귀 질의</li>
          <li><strong>ENR 필터링</strong> — eth2 서브넷 비트필드로 원하는 서브넷 피어 선별</li>
        </ul>

        {/* ── Kademlia 기반 탐색 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Kademlia Lookup — XOR 거리 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Discv5는 Kademlia DHT 기반
// 노드 ID: keccak256(public_key)[:32] = 256 bits

// XOR 거리:
// distance(a, b) = a XOR b (256-bit integer)
// 공통 prefix가 길수록 거리 가까움

// k-bucket 구조:
// 256개 bucket × k(16) 노드
// bucket[i] = 자신과 거리 [2^i, 2^(i+1)) 인 노드

// FINDNODE lookup:
async func Lookup(target NodeID) []ENR {
    // 1. 초기 후보: 자신의 bucket에서 target에 가까운 α(3)개
    candidates := findClosestK(routingTable, target, ALPHA)

    queried := set{}
    result := []ENR{}

    for {
        // 2. 미조회 후보 중 가장 가까운 α개에게 FINDNODE 병렬 발송
        toQuery := selectUnqueried(candidates, queried, ALPHA)
        if len(toQuery) == 0 { break }

        responses := parallelMap(toQuery, func(node) {
            return sendFindNode(node, target)  // UDP 요청/응답
        })

        // 3. 응답받은 노드들을 candidates에 추가
        for _, enrs := range responses {
            for _, enr := range enrs {
                candidates.add(enr)
            }
        }
        queried.addAll(toQuery)

        // 4. closest K (16)개가 안정화되면 종료
        result = candidates.sortByDistance(target)[:K]
        if !improved(result) { break }
    }

    return result
}

// 복잡도:
// 네트워크 크기 N에 대해 O(log N) round
// 각 round에서 α=3개 노드 병렬 쿼리
// 메인넷(~30K 노드) → ~15 round → 수 초`}
        </pre>
        <p className="leading-7">
          Discv5의 lookup은 <strong>iterative Kademlia</strong>.<br />
          매 라운드 α=3개 병렬 쿼리 → O(log N) 라운드에 수렴.<br />
          30K 노드 네트워크에서 수 초 내에 100 피어 발견.
        </p>

        {/* ── 서브넷 필터링 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">서브넷 필터링 — attnets 기반 피어 선별</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ethereum 2.0 CL은 64개 attestation subnet 운영
// validator는 자기 committee의 subnet에만 attestation 전파
// → 전체 subnet 피어 불필요, 자기 subnet 피어만 있으면 됨

// Prysm의 subnet 피어 발견:
func FindSubnetPeers(subnet uint64, desiredCount int) []ENR {
    candidates := []ENR{}

    // 무작위 lookup 실행 중 attnets 체크
    for len(candidates) < desiredCount {
        random_target := randomNodeID()
        peers := Discv5.Lookup(random_target)

        for _, peer := range peers {
            // attnets 비트필드 파싱
            attnets_bits, ok := peer.Get("attnets")
            if !ok { continue }

            // subnet의 bit가 set되어 있는지 확인
            if getBit(attnets_bits, subnet) {
                candidates = append(candidates, peer)
            }
        }
    }

    return candidates
}

// 서브넷별 target 피어 수:
// - Attestation subnet 각: 3~10 피어
// - Sync committee subnet 각: 10 피어
// - 총 필요 피어: ~100~200

// subnet 전환 시나리오:
// 매 epoch(32 slots)마다 validator 커미티 재배정
// → 다른 subnet 구독 필요 → 새 피어 탐색

// 효율:
// 무작위 lookup + 필터링으로 충분 (DHT 보장 없음)
// 다행히 메인넷 피어가 많아 빠르게 찾음`}
        </pre>
        <p className="leading-7">
          <strong>Subnet 필터링</strong>으로 불필요 피어 연결 방지.<br />
          attnets bit 체크 → 자기 subnet 피어만 선택.<br />
          매 epoch committee 재배정 → 새 subnet 피어 발견 필요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Discv5 vs Kademlia</strong> — Discv5는 Kademlia와 유사하지만 TOPIC 광고 기능이 추가되어 특정 서브넷 피어를 효율적으로 탐색.<br />
          CL의 64개 서브넷 구독 요구사항에 최적화된 설계.
        </p>
      </div>
    </section>
  );
}
