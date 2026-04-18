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
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">5단계 검증</p>
          <ol className="text-sm space-y-2 list-decimal pl-4">
            <li><strong>Structural validation</strong> — <code className="text-xs">header.round &gt;= 0</code>, valid author, parents는 <code className="text-xs">(r-1)</code> round certs, valid batch digests, <code className="text-xs">2f+1</code> signatures</li>
            <li><strong>Signature verification</strong> — 각 <code className="text-xs">(validator_id, signature)</code>에 대해 <code className="text-xs">verify(pk, header.digest(), sig)</code>. BLS aggregation 시 1 pairing = <code className="text-xs">O(1)</code></li>
            <li><strong>Parent validation</strong> — 각 parent: 존재 확인 + <code className="text-xs">parent.round == header.round - 1</code> + distinct authors</li>
            <li><strong>Payload availability</strong> — batch 없으면 validator에 request → 수신 대기</li>
            <li><strong>Causal history</strong> (optional) — DFS through parents → 모든 ancestors available 확인</li>
          </ol>
          <p className="text-sm mt-2 text-muted-foreground">성공 → sign header. 실패 → drop. 성능: typically 5-10 parents/batches, ~1ms/cert(BLS aggregation).</p>
        </div>

        <div className="rounded-lg border border-destructive/30 p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Byzantine 감지</p>
          <ul className="text-sm space-y-1 list-disc pl-4">
            <li><strong>Equivocation</strong> — 동일 round 2 headers → slashing evidence</li>
            <li><strong>Invalid parents</strong> → header invalid</li>
            <li><strong>Fake signature</strong> → integrity failure</li>
          </ul>
        </div>
        <p className="leading-7">
          Certificate 검증: <strong>structural + signature + parents + payload</strong>.<br />
          BLS aggregation으로 O(1) signature verification.<br />
          ~1ms per cert, throughput bottleneck 아님.
        </p>

        {/* ── Signature 수집 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Signature 수집 메커니즘</h3>
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Author 관점 흐름</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Header 생성 후 broadcast → all validators</li>
            <li>각 validator j가 valid 시 <code className="text-xs">sig_j = sign(sk_j, hash(header))</code> → author</li>
            <li><code className="text-xs">len(collected) &gt;= 2f+1</code> → <code className="text-xs">Certificate(header, collected)</code> 생성 → broadcast + DAG 추가</li>
          </ol>
          <p className="text-sm mt-2 text-muted-foreground">Timing: header broadcast ~50ms + validation ~1ms + sig return ~50ms + aggregate ~1ms + cert broadcast ~50ms = <strong>~200ms/round</strong> (WAN lower bound).</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code className="text-xs">2f+1</code> Signatures 의미 + BLS</p>
            <p className="text-sm mb-1"><code className="text-xs">n=4, f=1, 2f+1=3</code>: 3 validators signed → <code className="text-xs">f+1=2</code> honest → data 확인 → reliability.</p>
            <p className="text-sm text-muted-foreground">BLS: <code className="text-xs">sig_agg = sum(sig_j)</code> + <code className="text-xs">signers bitmap</code>. single pairing verify. <code className="text-xs">O(1)</code> cert size.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Byzantine 방어 + 병목 완화</p>
            <p className="text-sm mb-1">header 중복 → rate limit. invalid → sign 거부. no header → 제외.</p>
            <p className="text-sm text-muted-foreground">병목 완화: async collection + multiple headers in flight + pipelined rounds + Worker-Primary parallelism.</p>
          </div>
        </div>
        <p className="leading-7">
          Signature 수집: <strong>broadcast → validate → sign → collect → aggregate</strong>.<br />
          ~200ms per round (WAN).<br />
          BLS aggregation → O(1) cert size.
        </p>

        {/* ── Certificate 역할 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Certificate의 3가지 역할</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Role 1: Availability Proof</p>
            <p className="text-sm"><code className="text-xs">2f+1</code> validators 수신 + validate → <code className="text-xs">f+1</code> honest hold data → future retrieval 보장.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Role 2: DAG Vertex</p>
            <p className="text-sm">certificate = DAG node. parents = incoming edges. children = outgoing edges. causal history 구성.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Role 3: Consensus Input</p>
            <p className="text-sm">Bullshark가 cert ordering. anchor commit → entire causal history. data already available(no re-transmission).</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Separation Benefits</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li><strong>Modularity</strong> — Narwhal + any BFT(Bullshark, Tusk, custom)</li>
              <li><strong>Performance</strong> — data parallel + ordering sequential(fast)</li>
              <li><strong>Evolution</strong> — consensus 교체 가능, data layer 고정</li>
            </ol>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">실제 사용</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Narwhal + Bullshark — Sui (2022-2024)</li>
              <li>Narwhal + Tusk — async version</li>
              <li>Quorum Store (Aptos) — Narwhal 변형</li>
              <li>Mysticeti — Narwhal 아이디어 확장</li>
            </ul>
          </div>
        </div>
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
