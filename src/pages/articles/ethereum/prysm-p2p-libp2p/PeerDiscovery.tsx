import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function PeerDiscovery({ onCodeRef }: Props) {
  return (
    <section id="peer-discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discv5 피어 탐색</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Discv5는 UDP 기반의 peer discovery protocol이며, 각 node는 공개키로 서명한 <strong>ENR(Ethereum Node Record)</strong>에 network endpoint와 capability hint를 담아 교환합니다. Discovery는 연결 후보를 찾는 단계이고 실제 consensus message는 연결 이후 libp2p와 GossipSub가 전달합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("discv5-init", codeRefs["discv5-init"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            initDiscoveryV5()
          </span>
        </div>

        {/* ── ENR 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          ENR — 노드 정보 서명된 레코드
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              ENR (Ethereum Node Record, EIP-778) — <code>secp256k1</code>{" "}
              서명된 key-value 레코드
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80 mb-3">
              <span>
                <code>Signature: []byte</code> — 전체 레코드 서명
              </span>
              <span>
                <code>Seq: uint64</code> — 시퀀스(증가 시 새 버전)
              </span>
              <span>
                <code>Pairs: map[string]bytes</code> — key-value 쌍
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">id</span> — <code>"v4"</code>{" "}
                (identity scheme)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">secp256k1</span> — 공개키(33B
                compressed)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">ip</span> — IPv4(4B) /{" "}
                <span className="font-bold">ip6</span> — IPv6(16B)
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">tcp</span> — TCP 포트 /{" "}
                <span className="font-bold">udp</span> — UDP 포트
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Ethereum 2.0 추가 필드
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">eth2</span> — fork digest + next
                fork version + next fork epoch를 담은 SSZ fork ID
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">attnets</span> (8B) — 64 attestation
                subnet bitfield. 구독 중인 서브넷 표시
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">syncnets</span> (1B) — 4 sync
                committee subnet bitfield
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-1">
                ENR 인코딩
              </p>
              <p className="text-sm text-foreground/80 font-mono">
                enr:-Ku4QHqVeJ8PPICcWk1vSn_XcSkjOk...
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                base64 URL-safe 인코딩, <code>"enr:"</code> prefix
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-1">
                검증 3단계
              </p>
              <p className="text-sm text-foreground/80">
                1. 서명 확인(<code>secp256k1</code>) → 2. <code>id=="v4"</code>{" "}
                확인 → 3. 서명자 = <code>secp256k1</code> 필드 일치. valid ENR만
                저장.
              </p>
            </div>
          </div>
        </div>
        <p>
          ENR은 sequence number가 있는 signed key-value record이므로 owner가 갱신한 endpoint와 capability를 검증할 수 있고 새 field도 확장할 수 있습니다. Consensus client는 <code>attnets</code>와 <code>syncnets</code> bitfield를 duty에 필요한 subnet peer를 찾는 hint로 사용하지만, record만으로 상대의 현재 연결 상태나 신뢰성을 보장하지는 않습니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">탐색 과정</h3>
        <ul>
          <li>
            <strong>부트노드 접속</strong> — 하드코딩된 부트노드 ENR로 초기 연결
          </li>
          <li>
            <strong>FINDNODE</strong> — 타겟 ID에 가까운 노드를 재귀 질의
          </li>
          <li>
            <strong>ENR 필터링</strong> — eth2 서브넷 비트필드로 원하는 서브넷
            피어 선별
          </li>
        </ul>

        {/* ── Kademlia 기반 탐색 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Kademlia Lookup — XOR 거리 기반
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              Discv5 — Kademlia DHT 기반
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">노드 ID</span> —{" "}
                <code>keccak256(pubkey)[:32]</code> = 256 bits
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">XOR 거리</span> —{" "}
                <code>distance(a,b) = a XOR b</code>. 공통 prefix 길수록 가까움
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                <span className="font-bold">k-bucket</span> — 256개 bucket x
                k(16) 노드. <code>bucket[i]</code> = 거리 [2^i, 2^(i+1))
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>Lookup(target NodeID)</code> — FINDNODE 반복 탐색
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  초기 후보: routing table에서 target에 가까운 후보 집합 선택
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  미조회 후보 중 가까운 노드에 <code>FINDNODE</code>를 제한된
                  동시성으로 발송
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  응답받은 노드들을 candidates에 추가
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  더 가까운 새 후보가 나오지 않고 조회 조건이 충족되면 종료
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              XOR 거리 순 후보
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              제한된 병렬 질의
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              응답·timeout 기반 종료
            </div>
          </div>
        </div>
        <p>
          Discv5 lookup은 target node ID와의 XOR distance가 가까운 후보를 제한된 concurrency로 질의하고, 응답으로 받은 ENR을 다시 candidate set에 넣는 iterative search입니다. 발견 latency와 확보하는 peer 수는 routing table의 품질, bootstrap node, network 상태와 implementation parameter에서 측정해야 합니다.
        </p>

        {/* ── 서브넷 필터링 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          서브넷 필터링 — attnets 기반 피어 선별
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              서브넷 필터링 배경
            </p>
            <p className="text-sm text-foreground/80">
              Ethereum 2.0 CL은 64개 attestation subnet 운영. validator는 자기
              committee subnet에만 attestation 전파 → 전체 subnet 피어 불필요,
              자기 subnet 피어만 있으면 됨.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>FindSubnetPeers(subnet, desiredCount)</code> — attnets 기반
              탐색
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  무작위 <code>randomNodeID()</code>로{" "}
                  <code>Discv5.Lookup()</code> 실행
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  각 피어의 <code>attnets</code> 비트필드 파싱 → 원하는 subnet
                  bit가 set인지 확인
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  <code>desiredCount</code>에 도달할 때까지 반복
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Attestation subnet 수요
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Sync committee 수요
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              전체 peer budget
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              duty 변경 시 재탐색
            </div>
          </div>
        </div>
        <p>
          Subnet bitfield는 필요한 duty message를 전달할 가능성이 높은 peer를 우선 찾게 해 불필요한 dial을 줄입니다. 그렇다고 자기 subnet peer만 유지하는 것은 아니며 consensus gossip과 network diversity를 위해 일반 peer도 필요합니다. Committee assignment가 바뀌면 client는 새 duty subnet의 peer를 미리 발견하고 subscription을 준비합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>Discv5와 GossipSub의 역할</strong> — Discv5는 연결 후보의
          ENR을 발견하고, subnet bitfield는 필요한 duty와 관련된 후보를 고르는 hint가 됩니다. 실제 topic subscription과 delivery mesh는 peer 연결 뒤 GossipSub layer가 관리합니다.
        </p>
      </div>
    </section>
  );
}
