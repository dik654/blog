import NarwhalVertexViz from './viz/NarwhalVertexViz';
import NarwhalWorkerViz from './viz/NarwhalWorkerViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Narwhal({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  return (
    <section id="narwhal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal: DAG 기반 멤풀</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Danezis et al. (Meta Research, 2021) — <strong>DAG-based reliable mempool</strong>.<br />
          모든 validator 동시 propose, reliable broadcast로 availability 보장.<br />
          throughput을 consensus에서 분리.
        </p>
      </div>
      <div className="not-prose mb-8"><NarwhalVertexViz onOpenCode={open} /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Primary-Worker 아키텍처</h3>
        <p className="leading-7">
          메타데이터(DAG)와 데이터 전파를 분리 — Worker 추가로 처리량 수평 확장.
        </p>
      </div>
      <div className="not-prose mb-6"><NarwhalWorkerViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Narwhal DAG 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal Vertex 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Narwhal Vertex (Header):
// struct Header {
//     author: ValidatorId,
//     round: u64,
//     payload: BTreeMap<BatchDigest, WorkerId>,
//     parents: BTreeSet<VertexId>,  // 2f+1 refs
//     signature: Signature,
// }
//
// struct VertexId {
//     author: ValidatorId,
//     round: u64,
//     digest: Hash,
// }

// Certificate (vertex + 2f+1 signatures):
// struct Certificate {
//     header: Header,
//     signatures: BTreeMap<ValidatorId, Signature>,
//     // 2f+1 validators signed
// }

// DAG 구성 규칙:
// 1. 각 validator는 매 round 1 header 생성
// 2. parents: 이전 round의 2f+1 certificates
// 3. 2f+1 signatures 모으면 certificate
// 4. next round: certificate를 parent로

// Round advance:
// - 현재 round에서 2f+1 certificates 받으면
// - round++ 이동 가능
// - 자신의 새 header 생성 + broadcast

// Reliable Broadcast:
// - 2f+1 signatures 요구 = reliable delivery
// - 모든 정직 validator가 vertex 최종 수신 보장
// - Byzantine authors는 quorum 못 형성

// 왜 parents 2f+1?
// - availability 증명
// - Byzantine author의 vertex도 included 가능
// - "2f+1 signed, so 1 honest has it"

// 예시 (n=4, f=1, 2f+1=3):
// Round 1: V1, V2, V3, V4 propose headers
// Round 1 certificates: 각 3+ signature 모음
// Round 2: V1 propose new header
//   parents: {cert_V1_r1, cert_V2_r1, cert_V3_r1}
//   → validates 3 Round 1 vertices`}
        </pre>
        <p className="leading-7">
          Narwhal Vertex: <strong>header + 2f+1 parents + signatures</strong>.<br />
          reliable broadcast으로 availability 보장.<br />
          validator별 round당 1 vertex → n parallel proposals.
        </p>

        {/* ── Primary-Worker 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Primary-Worker 아키텍처 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Primary-Worker 분리:
//
// 문제:
// - 1 validator가 모든 TX 처리 부담
// - network I/O + CPU 병목
// - throughput 한계
//
// 해결: validator 내부에서 parallel
//
// Primary:
// - DAG 구조 유지
// - Header 생성
// - parent 선택
// - signature 수집
// - consensus 참여
// - 소량 메타데이터만 처리
//
// Worker (N workers per validator):
// - TX mempool 유지
// - TX batch 생성
// - batch를 다른 worker에게 broadcast
// - batch availability 증명 수집
// - batch digest를 primary에 보고
//
// 통신:
// Worker ↔ Worker: TX batch broadcast
// Worker → Primary: batch digest
// Primary ↔ Primary: DAG headers/certs

// Scaling:
// 1 validator with 4 workers:
// - 4x parallel TX ingestion
// - 4x parallel batch creation
// - 4x network bandwidth
// - 4x throughput

// 실제 성능 (Narwhal paper):
// 1 worker per validator: 30K TPS
// 4 workers per validator: 120K TPS
// 10 workers per validator: 300K+ TPS (scaled up)

// 구현 세부:
// - Primary runs consensus (CPU-light)
// - Workers run mempool + networking (CPU-heavy)
// - separate processes or threads
// - shared memory or RPC

// Narwhal+Bullshark 성능:
// - 4 workers, 10 validators: 130K TPS
// - latency: 2s (WAN)
// - bandwidth: 8.5 Gbps aggregate`}
        </pre>
        <p className="leading-7">
          Primary = consensus, Worker = data.<br />
          <strong>Worker N배 증가 = throughput N배</strong>.<br />
          validator 내부 horizontal scaling.
        </p>

        {/* ── Narwhal 프로토콜 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Narwhal 프로토콜 (round r):
//
// 1. Worker gathers TXs:
//    - Mempool에서 TX 수집
//    - Batch 생성 (e.g., 500KB)
//    - batch_digest = hash(batch)
//
// 2. Worker broadcasts batch:
//    - Worker_i → all other workers
//    - 2f+1 ack 수집
//    - batch_digest → primary_i
//
// 3. Primary creates Header:
//    header = Header {
//        author: i,
//        round: r,
//        payload: {batch_digest1: worker_j, ...},
//        parents: 2f+1 round (r-1) certs,
//        signature: sk_i,
//    }
//    broadcast to all primaries
//
// 4. Primaries validate + sign:
//    - check header validity
//    - check parents correct
//    - check payload availability
//    - sign if valid
//    - send signature → primary_i
//
// 5. Primary_i collects 2f+1 signatures:
//    certificate = Certificate {
//        header: header,
//        signatures: {sig_j, ...},
//    }
//    broadcast certificate
//
// 6. Primaries update DAG:
//    - add certificate to local DAG
//    - when 2f+1 certs for round r:
//      advance to round r+1

// Round advancement:
// - 2f+1 certs for round r required
// - asynchronously (no round timeout)
// - honest validators eventually advance

// Byzantine author mitigation:
// - author가 여러 header 만들면
//   equivocation detection
//   only one cert possible
// - author가 propose 안 하면
//   그냥 제외 (2f+1이면 충분)

// Garbage collection:
// - committed rounds 이전 DAG 삭제
// - memory bound
// - state sync으로 느린 validator 도움`}
        </pre>
        <p className="leading-7">
          Narwhal round: <strong>batch → header → 2f+1 sig → certificate → DAG</strong>.<br />
          async round advance — no timeout 의존.<br />
          parallel + reliable + efficient.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Narwhal이 DAG-BFT 혁신인가</strong> — throughput 문제 해결.<br />
          기존 BFT: consensus + data dissemination 결합 → bandwidth 낭비.<br />
          Narwhal: data layer separation → 각 validator 풀 대역폭 활용.<br />
          100K+ TPS의 시대를 연 근본 innovation.
        </p>
      </div>
    </section>
  );
}
