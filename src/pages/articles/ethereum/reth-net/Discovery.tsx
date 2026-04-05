import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LOOKUP_STEPS, DISC_MESSAGES } from './DiscoveryData';

export default function Discovery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = LOOKUP_STEPS.find(s => s.step === activeStep);

  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discovery v4 (Kademlia)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-discovery', codeRefs['net-discovery'])} />
          <span className="text-[10px] text-muted-foreground self-center">Discv4 구조체</span>
        </div>
        <p className="leading-7">
          <strong>Discv4</strong>는 UDP 기반 노드 디스커버리 프로토콜이다.<br />
          Kademlia DHT(분산 해시 테이블)의 변형으로, 256개 k-bucket에 피어를 XOR 거리 기준으로 분류한다.
        </p>
        <p className="leading-7">
          XOR 거리란 두 노드 ID의 비트별 XOR 연산 결과다.<br />
          같은 접두사(prefix)를 공유하는 노드일수록 거리가 가까우며, bucket 번호가 낮다.<br />
          이 구조 덕분에 O(log N) 홉으로 네트워크의 아무 노드나 탐색할 수 있다.
        </p>

        {/* ── Kademlia 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Kademlia k-bucket 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 노드 ID: 512비트 (secp256k1 공개키)
// 실질적으로 사용: keccak256(pubkey) 256비트

// K-bucket table:
// 256개 bucket (각 비트 거리별)
// bucket[i] = XOR 거리가 [2^i, 2^(i+1)) 인 노드들
// 각 bucket 최대 16개 노드 저장 (k=16)

pub struct KBucketTable {
    buckets: [KBucket; 256],  // 거리별 bucket
    local_id: NodeId,         // 내 노드 ID
}

pub struct KBucket {
    nodes: VecDeque<Node>,  // 최대 16개
    replacement_cache: VecDeque<Node>,  // 대기 목록
}

// XOR 거리 계산:
fn distance(a: &NodeId, b: &NodeId) -> U256 {
    U256::from_be_bytes(a.0) ^ U256::from_be_bytes(b.0)
}

// bucket 인덱스 계산:
fn bucket_index(local: &NodeId, target: &NodeId) -> usize {
    let d = distance(local, target);
    d.leading_zeros() as usize  // 앞쪽 0 개수
    // 255 - leading_zeros = bucket 번호
}

// 예시:
// local=0xAAAA..., target=0xAAAB...
// XOR = 0x0001... → leading_zeros=15 → bucket[240] 근처`}
        </pre>
        <p className="leading-7">
          Kademlia의 핵심: <strong>XOR 거리로 가까운 노드 유지</strong>.<br />
          가까운 노드일수록 많은 bucket에 저장 → 정보 밀집.<br />
          먼 노드는 각 bucket에 16개만 → 전체적으로 분산된 view.
        </p>

        {/* ── lookup 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">lookup(target) — iterative 탐색</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 임의의 target NodeId에 가까운 K개 노드 찾기
async fn lookup(&self, target: NodeId) -> Vec<Node> {
    // 1. 초기 후보: 내 table에서 target과 가까운 α(3)개
    let mut candidates: BinaryHeap<_> = self.closest_k(target, ALPHA);
    let mut queried: HashSet<NodeId> = HashSet::new();
    let mut result: Vec<Node> = Vec::new();

    loop {
        // 2. 미조회 candidate 중 가장 가까운 α개에게 FindNode 병렬 발송
        let to_query: Vec<_> = candidates.iter()
            .filter(|n| !queried.contains(&n.id))
            .take(ALPHA)
            .cloned()
            .collect();

        if to_query.is_empty() { break; }

        // 3. 병렬 요청
        let responses = join_all(
            to_query.iter().map(|n| self.find_node(n, target))
        ).await;

        // 4. 응답(각 16개 neighbor)을 candidate에 추가
        for response in responses {
            queried.insert(response.sender_id);
            for neighbor in response.neighbors {
                candidates.push(neighbor);
            }
        }

        // 5. 진전 없으면 종료
        if !improved(&candidates, &result) { break; }
        result = candidates.iter().take(K).cloned().collect();
    }

    result  // target에 가까운 K(16)개 노드
}`}
        </pre>
        <p className="leading-7">
          lookup은 <strong>iterative 알고리즘</strong>.<br />
          매 라운드 α(3)개 노드에 병렬 쿼리 → 응답으로 더 가까운 노드 확보 → 수렴까지 반복.<br />
          네트워크 크기 N에 대해 O(log N) 라운드 — 10K 노드 기준 ~13 라운드.
        </p>

        {/* ── ENR ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ENR — Ethereum Node Record (EIP-778)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ENR: 노드 정보를 포함하는 서명된 레코드
pub struct EnrRecord {
    signature: Signature,       // secp256k1 서명
    seq: u64,                   // 시퀀스 번호 (증가 시 새 버전)
    id_scheme: String,          // "v4"
    secp256k1: PublicKey,       // 공개키
    ip: Option<Ipv4Addr>,       // IPv4
    ip6: Option<Ipv6Addr>,      // IPv6
    tcp: Option<u16>,           // eth TCP 포트
    tcp6: Option<u16>,          // IPv6 TCP
    udp: Option<u16>,           // discovery UDP
    udp6: Option<u16>,          // IPv6 UDP
    // eth2 추가 필드:
    eth2: Option<Eth2Data>,     // fork_digest + attestation subnets
}

// 장점:
// 1. 자체 서명 → 변조 방지
// 2. 확장 가능 → 새 필드 추가 시 기존 노드와 호환
// 3. 시퀀스 번호 → 노드 정보 변경 추적 (IP 변경 등)
// 4. IPv4/IPv6 이중 스택 지원

// URL 형식:
// enr:-Iu4QFZYgTuT... (base64 인코딩된 ENR)

// 부트노드 URL 예시:
// enr:-Iu4QFZYgTuT90pfWfZjyKpKXtJGiGU...@144.91.79.251:30303`}
        </pre>
        <p className="leading-7">
          <code>ENR</code>이 <strong>노드 identity의 정식 표현</strong>.<br />
          secp256k1 서명으로 "이 IP는 이 공개키의 노드"를 증명.<br />
          확장 가능 필드로 eth2 consensus layer 정보도 동일 레코드에 포함.
        </p>

        {/* ── Bootstrap ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bootstrap — 네트워크 진입</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 메인넷 기본 bootnode 목록 (하드코딩)
const MAINNET_BOOTNODES: &[&str] = &[
    "enr:-Iu4QFZYgTuT90pfWfZjyKpKXtJGiGU...@144.91.79.251:30303",
    "enr:-Ku4QDWoANKs8g6Xl0bkDLg9KTZHPfyd...@157.90.179.157:30303",
    // ... 10~20개 부트노드
];

// 부팅 과정:
async fn bootstrap(&self) -> Result<()> {
    // 1. 하드코딩된 부트노드에 PING 발송
    for bootnode in MAINNET_BOOTNODES {
        let enr = EnrRecord::parse(bootnode)?;
        self.send_ping(&enr).await?;
    }

    // 2. PONG 응답 수신 → 부트노드를 k-bucket에 추가
    //    이 시점에서 최소 10개 피어 확보

    // 3. 자기 자신에 대해 lookup 실행 → neighbor 수집
    self.lookup(self.local_id).await?;

    // 4. 랜덤 target lookup을 주기적으로 실행 (버킷 채우기)
    self.refresh_buckets().await?;

    Ok(())
}

// 결과:
// 수 분 내에 100~300개 피어와 연결
// 이 중 8~50개 TCP 연결 유지 (DevP2P 수준)

// Bootnode는 중심이 아니라 "소개소":
// - lookup 1회만 하면 신뢰 불필요
// - 악의적 부트노드도 일부 유효 피어만 제공하면 OK
// - 다양한 부트노드 운영자가 분산 보장`}
        </pre>
        <p className="leading-7">
          Bootnode는 <strong>초기 진입점 역할만</strong> — lookup 완료 후 일반 피어와 동일 취급.<br />
          하드코딩된 IP지만, 여러 운영자(EF, Lighthouse, Nethermind 등)가 각자 제공 → 탈중앙.<br />
          lookup 1회로 네트워크 수백 노드 파악 가능.
        </p>
      </div>

      {/* lookup() algorithm steps */}
      <h3 className="text-lg font-semibold mb-3">lookup() 알고리즘</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {LOOKUP_STEPS.map(s => (
          <button key={s.step}
            onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeStep === s.step ? s.color : 'var(--color-border)',
              background: activeStep === s.step ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>Step {s.step}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.step}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery messages */}
      <h3 className="text-lg font-semibold mb-3">UDP 메시지 타입</h3>
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">메시지</th>
            <th className="border border-border px-4 py-2 text-left">방향</th>
            <th className="border border-border px-4 py-2 text-left">용도</th>
          </tr></thead>
          <tbody>
            {DISC_MESSAGES.map(m => (
              <tr key={m.name}>
                <td className="border border-border px-4 py-2 font-mono text-xs">{m.name}</td>
                <td className="border border-border px-4 py-2">{m.direction}</td>
                <td className="border border-border px-4 py-2">{m.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>refresh_buckets()</strong> — 주기적으로 랜덤 target에 대해 lookup을 실행한다.<br />
          이를 통해 Kademlia 버킷이 골고루 채워져 네트워크 연결성을 유지한다.<br />
          부트노드(bootnode)는 초기 접속점으로만 사용되며, lookup 이후에는 일반 피어와 동일하게 취급.
        </p>
      </div>
    </section>
  );
}
