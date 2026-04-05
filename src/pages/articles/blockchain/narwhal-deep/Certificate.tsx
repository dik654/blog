import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const certCode = `Narwhal 증명서(Certificate) 구조 (Rust 의사코드):

struct Header {
    round: u64,
    author: ValidatorId,
    payload: Vec<BatchDigest>,
    parents: Vec<CertificateDigest>,  // r-1 라운드
}

struct Certificate {
    header: Header,
    signatures: Vec<(ValidatorId, Signature)>,
    // len(signatures) >= 2f+1
}

증명서 생성 과정:
  1. author가 Header 생성 후 브로드캐스트
  2. 수신자가 Header 검증 후 서명 반환
  3. 2f+1 서명 수집 → Certificate 완성
  4. Certificate를 DAG에 삽입

핵심 보장:
  - 증명서가 존재하면 2f+1 노드가 해당 데이터를 가짐
  - 이 중 최소 f+1은 정직 → 데이터 복구 가능`;

export default function Certificate() {
  return (
    <section id="certificate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명서(Certificate) 메커니즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al. — Narwhal §3.2" citeKey={2} type="paper">
          <p className="italic">
            "A certificate for a header is a collection of 2f+1 signatures on that header, proving that the data referenced by the header is available."
          </p>
        </CitationBlock>

        <CodePanel title="증명서 구조 (Rust 의사코드)" code={certCode}
          annotations={[
            { lines: [3, 8], color: 'sky', note: 'Header: 메타데이터 + 부모 참조' },
            { lines: [10, 14], color: 'emerald', note: 'Certificate: 2f+1 서명' },
            { lines: [16, 20], color: 'amber', note: '생성 과정' },
            { lines: [22, 24], color: 'violet', note: '가용성 보장 원리' },
          ]} />

        {/* ── Certificate Verification ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Certificate 검증 절차</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Certificate 수신 시 검증 단계:

// Step 1: Structural validation
// - header.round >= 0
// - header.author is valid validator
// - header.parents는 (r-1) round의 certificate digests
// - header.payload: valid batch digests
// - signatures: 2f+1 valid signatures

// Step 2: Signature verification
// for (validator_id, signature) in cert.signatures:
//     pk = get_public_key(validator_id)
//     msg = header.digest()
//     assert verify(pk, msg, signature)
//
// BLS aggregation 사용 시:
// - 1 pairing operation per cert
// - O(1) verification cost

// Step 3: Parent validation
// for parent_digest in header.parents:
//     parent = lookup_cert(parent_digest)
//     assert parent is not None  // already received
//     assert parent.round == header.round - 1
//     assert parent.author != header.author  // distinct

// Step 4: Payload availability check
// for batch_digest in header.payload:
//     if not worker.has_batch(batch_digest):
//         request batch from validator
//         wait for batch arrival

// Step 5: Causal history check (optional)
// - DFS from header through parents
// - ensure all ancestors available
// - can be done lazily

// 검증 성공 → sign header
// 검증 실패 → drop (or challenge)

// Byzantine 감지:
// - author가 동일 round에 2 headers (equivocation)
//   → slashing evidence
// - invalid parent reference
//   → header invalid
// - fake signature
//   → integrity failure

// 성능:
// - verification cost: O(batch_digests + parents)
// - typically 5-10 parents, 5-10 batches
// - ~50 signature verifications total
// - ~1ms per cert (BLS aggregation)`}
        </pre>
        <p className="leading-7">
          Certificate 검증: <strong>structural + signature + parents + payload</strong>.<br />
          BLS aggregation으로 O(1) signature verification.<br />
          ~1ms per cert, throughput bottleneck 아님.
        </p>

        {/* ── Signature 수집 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Signature 수집 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Author의 관점 (signature 수집):

// 1. Header 생성 후 broadcast
// broadcast(header) → all validators

// 2. Validators validate + sign
// for each validator j:
//     if valid(header):
//         sig_j = sign(sk_j, hash(header))
//         send(sig_j) → author

// 3. Author collects signatures
// collected = {sig_j | valid signature from j}
// if len(collected) >= 2f+1:
//     cert = Certificate(header, collected)
//     broadcast(cert) → all validators
//     add_to_dag(cert)

// Timing:
// - broadcast header: ~50ms (WAN)
// - validation: ~1ms per validator
// - return signature: ~50ms
// - aggregate: ~1ms
// - broadcast cert: ~50ms
// Total: ~200ms per round (asynchronous lower bound)

// Byzantine sender behavior:
// - header 여러 번 보냄?
//   → 수신자가 rate limit
// - invalid header?
//   → 수신자가 sign 안 함
// - no header?
//   → 해당 validator 제외

// 2f+1 signatures 의미:
// n = 4, f = 1, 2f+1 = 3
// - 2f+1 validators signed
// - at least f+1 = 2 honest
// - 2 honest가 data 확인
// - reliability 보장

// BLS Aggregation:
// cert.sig_agg = Σ sig_j (group multiplication)
// cert.signers = bitmap of validators
// verify: e(sig_agg, g) == e(hash(header), pk_agg)
// - single pairing operation
// - O(1) cert size (in signature)

// 병목 완화:
// - async signature collection
// - multiple headers in flight
// - pipelined rounds
// - Worker-Primary parallelism`}
        </pre>
        <p className="leading-7">
          Signature 수집: <strong>broadcast → validate → sign → collect → aggregate</strong>.<br />
          ~200ms per round (WAN).<br />
          BLS aggregation → O(1) cert size.
        </p>

        {/* ── Certificate 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Certificate의 3가지 역할</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Certificate의 3가지 역할:

// Role 1: Availability Proof
// - 2f+1 validators가 header 수신 + validate
// - at least f+1 honest nodes have data
// - "data is reliably stored"
// - future retrieval 보장

// Role 2: DAG Vertex
// - certificate = DAG의 한 node
// - parents = incoming edges
// - children = outgoing edges (future certs)
// - causal history 구성

// Role 3: Consensus Input
// - Bullshark가 cert를 ordering input으로 사용
// - anchor commit → entire causal history
// - ordering은 cert 단위로 수행
// - data already available (no re-transmission)

// Role 간 상호작용:
//
// Consensus layer (Bullshark) perspective:
// - cert만 보고 ordering 결정
// - payload 내용 볼 필요 없음
// - lightweight ordering
//
// Data layer (Narwhal) perspective:
// - cert로 availability 보장
// - ordering은 모름 (outside scope)
// - just maintain DAG

// Separation benefits:
// 1. Modularity:
//    - Narwhal + any BFT consensus
//    - Bullshark, Tusk, custom consensus
//
// 2. Performance:
//    - data dissemination parallel
//    - ordering sequential (but fast)
//
// 3. Evolution:
//    - consensus 교체 가능
//    - data layer 고정
//    - incremental upgrade

// 실제 사용:
// - Narwhal + Bullshark: Sui (2022-2024)
// - Narwhal + Tusk: async version
// - Quorum Store (Aptos): Narwhal 변형
// - Mysticeti: Narwhal 아이디어 확장`}
        </pre>
        <p className="leading-7">
          Certificate 3가지 역할: <strong>Availability + DAG vertex + Consensus input</strong>.<br />
          separation of concerns: data (Narwhal) + order (consensus).<br />
          modular + performant + evolvable.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "2f+1 signatures = availability proof"인가</strong> — quorum intersection.<br />
          2f+1 중 최소 f+1 honest validators signed (= data 보유).<br />
          f+1 honest는 decentralized storage 역할.<br />
          누구든 f+1 honest 중 1명에게 요청 → data 복구 가능 (probabilistic).
        </p>
      </div>
    </section>
  );
}
