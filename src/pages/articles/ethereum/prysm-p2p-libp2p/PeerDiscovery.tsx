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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">ENR (Ethereum Node Record, EIP-778) — <code>secp256k1</code> 서명된 key-value 레코드</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80 mb-3">
              <span><code>Signature: []byte</code> — 전체 레코드 서명</span>
              <span><code>Seq: uint64</code> — 시퀀스(증가 시 새 버전)</span>
              <span><code>Pairs: map[string]bytes</code> — key-value 쌍</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">id</span> — <code>"v4"</code> (identity scheme)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">secp256k1</span> — 공개키(33B compressed)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">ip</span> — IPv4(4B) / <span className="font-bold">ip6</span> — IPv6(16B)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">tcp</span> — TCP 포트 / <span className="font-bold">udp</span> — UDP 포트</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Ethereum 2.0 추가 필드</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">eth2</span> (128B) — <code>fork_digest</code>(4B) + <code>next_fork_version</code>(4B) + <code>next_fork_epoch</code>(8B)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">attnets</span> (8B) — 64 attestation subnet bitfield. 구독 중인 서브넷 표시</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">syncnets</span> (1B) — 4 sync committee subnet bitfield</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-1">ENR 인코딩</p>
              <p className="text-sm text-foreground/80 font-mono">enr:-Ku4QHqVeJ8PPICcWk1vSn_XcSkjOk...</p>
              <p className="text-xs text-foreground/60 mt-1">base64 URL-safe 인코딩, <code>"enr:"</code> prefix</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-1">검증 3단계</p>
              <p className="text-sm text-foreground/80">1. 서명 확인(<code>secp256k1</code>) → 2. <code>id=="v4"</code> 확인 → 3. 서명자 = <code>secp256k1</code> 필드 일치. valid ENR만 저장.</p>
            </div>
          </div>
        </div>
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
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Discv5 — Kademlia DHT 기반</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">노드 ID</span> — <code>keccak256(pubkey)[:32]</code> = 256 bits</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">XOR 거리</span> — <code>distance(a,b) = a XOR b</code>. 공통 prefix 길수록 가까움</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">k-bucket</span> — 256개 bucket x k(16) 노드. <code>bucket[i]</code> = 거리 [2^i, 2^(i+1))</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>Lookup(target NodeID)</code> — FINDNODE 반복 탐색</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">초기 후보: routing table에서 target에 가까운 alpha(3)개 선택</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">미조회 후보 중 가장 가까운 alpha개에게 <code>FINDNODE</code> 병렬 발송(UDP)</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">응답받은 노드들을 candidates에 추가</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80">closest K(16)개가 안정화되면 종료</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">O(log N) round</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">각 round alpha=3 병렬</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">~30K 노드 → ~15 round → 수 초</div>
          </div>
        </div>
        <p className="leading-7">
          Discv5의 lookup은 <strong>iterative Kademlia</strong>.<br />
          매 라운드 α=3개 병렬 쿼리 → O(log N) 라운드에 수렴.<br />
          30K 노드 네트워크에서 수 초 내에 100 피어 발견.
        </p>

        {/* ── 서브넷 필터링 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">서브넷 필터링 — attnets 기반 피어 선별</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">서브넷 필터링 배경</p>
            <p className="text-sm text-foreground/80">Ethereum 2.0 CL은 64개 attestation subnet 운영. validator는 자기 committee subnet에만 attestation 전파 → 전체 subnet 피어 불필요, 자기 subnet 피어만 있으면 됨.</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>FindSubnetPeers(subnet, desiredCount)</code> — attnets 기반 탐색</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">무작위 <code>randomNodeID()</code>로 <code>Discv5.Lookup()</code> 실행</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">각 피어의 <code>attnets</code> 비트필드 파싱 → 원하는 subnet bit가 set인지 확인</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><code>desiredCount</code>에 도달할 때까지 반복</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">Attestation subnet: 3~10 피어</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Sync committee: 10 피어</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">총: ~100~200 피어</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">매 epoch 재배정 → 새 탐색</div>
          </div>
        </div>
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
