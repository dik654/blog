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
        <div className="grid gap-3 not-prose mb-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Header</p>
              <ul className="text-sm space-y-1 list-disc pl-4">
                <li><code className="text-xs">author: ValidatorId</code></li>
                <li><code className="text-xs">round: u64</code></li>
                <li><code className="text-xs">payload: BTreeMap&lt;BatchDigest, WorkerId&gt;</code></li>
                <li><code className="text-xs">parents: BTreeSet&lt;VertexId&gt;</code> — <code className="text-xs">2f+1</code> refs</li>
                <li><code className="text-xs">signature: Signature</code></li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Certificate</p>
              <p className="text-sm mb-1"><code className="text-xs">header: Header</code> + <code className="text-xs">signatures: BTreeMap&lt;ValidatorId, Signature&gt;</code></p>
              <p className="text-sm text-muted-foreground"><code className="text-xs">2f+1</code> validators signed = reliable delivery. 모든 정직 validator 최종 수신 보장.</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">DAG 구성 규칙</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>각 validator는 매 round 1 header 생성</li>
              <li>parents: 이전 round의 <code className="text-xs">2f+1</code> certificates</li>
              <li><code className="text-xs">2f+1</code> signatures 모으면 certificate 형성</li>
              <li>next round: certificate를 parent로 참조</li>
            </ol>
            <p className="text-sm mt-2 text-muted-foreground">Round advance: <code className="text-xs">2f+1</code> certs 받으면 <code className="text-xs">round++</code>. parents <code className="text-xs">2f+1</code>인 이유 — availability 증명 + "2f+1 signed, so f+1 honest has it".</p>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">예시 (<code className="text-xs">n=4, f=1, 2f+1=3</code>)</p>
            <p className="text-sm">Round 1: V1-V4 propose headers, 각 3+ signature → certificates. Round 2: V1 새 header, parents = <code className="text-xs">{'{cert_V1_r1, cert_V2_r1, cert_V3_r1}'}</code> → 3개 Round 1 vertices 검증.</p>
          </div>
        </div>
        <p className="leading-7">
          Narwhal Vertex: <strong>header + 2f+1 parents + signatures</strong>.<br />
          reliable broadcast으로 availability 보장.<br />
          validator별 round당 1 vertex → n parallel proposals.
        </p>

        {/* ── Primary-Worker 분리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Primary-Worker 아키텍처 상세</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Primary (consensus, CPU-light)</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>DAG 구조 유지 + Header 생성</li>
              <li>parent 선택 + signature 수집</li>
              <li>consensus 참여</li>
              <li>소량 메타데이터만 처리</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Primary ↔ Primary: DAG headers/certs</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Worker (mempool, CPU-heavy) × N</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>TX mempool 유지 + TX batch 생성</li>
              <li>batch를 다른 worker에게 broadcast</li>
              <li>batch availability 증명 수집</li>
              <li>batch digest → primary 보고</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">Worker ↔ Worker: TX batch broadcast</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Scaling: Worker N배 = Throughput N배</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>1 worker/validator: 30K TPS</li>
              <li>4 workers/validator: 120K TPS</li>
              <li>10 workers/validator: 300K+ TPS</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">Narwhal+Bullshark 실측</p>
            <p className="text-sm">4 workers, 10 validators: <strong>130K TPS</strong>. Latency: 2s(WAN). Bandwidth: 8.5 Gbps aggregate.</p>
          </div>
        </div>
        <p className="leading-7">
          Primary = consensus, Worker = data.<br />
          <strong>Worker N배 증가 = throughput N배</strong>.<br />
          validator 내부 horizontal scaling.
        </p>

        {/* ── Narwhal 프로토콜 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal 프로토콜 상세</h3>
        <div className="grid gap-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Round r 프로토콜 흐름</p>
            <ol className="text-sm space-y-2 list-decimal pl-4">
              <li><strong>Worker TX 수집</strong> — Mempool에서 TX 수집 → Batch 생성(~500KB) → <code className="text-xs">batch_digest = hash(batch)</code></li>
              <li><strong>Worker batch broadcast</strong> — Worker_i → all workers. <code className="text-xs">2f+1</code> ack 수집 → <code className="text-xs">batch_digest</code> → primary_i</li>
              <li><strong>Primary Header 생성</strong> — <code className="text-xs">Header {'{ author: i, round: r, payload, parents: 2f+1 certs(r-1) }'}</code> → broadcast to all primaries</li>
              <li><strong>Primaries validate + sign</strong> — header validity + parents + payload availability 확인 → sign → signature → primary_i</li>
              <li><strong>Primary_i <code className="text-xs">2f+1</code> signatures 수집</strong> → <code className="text-xs">Certificate {'{ header, signatures }'}</code> 생성 → broadcast</li>
              <li><strong>DAG 업데이트</strong> — certificate → local DAG 추가. <code className="text-xs">2f+1</code> certs for round r 시 <code className="text-xs">round r+1</code> advance</li>
            </ol>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Round Advancement</p>
              <p className="text-sm"><code className="text-xs">2f+1</code> certs 필요. asynchronous(no timeout). honest validators eventually advance.</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Byzantine 방어</p>
              <p className="text-sm">여러 header → equivocation detection, 1 cert만 가능. propose 안 하면 제외(<code className="text-xs">2f+1</code>이면 충분).</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Garbage Collection</p>
              <p className="text-sm">committed rounds 이전 DAG 삭제. memory bound. state sync으로 느린 validator 도움.</p>
            </div>
          </div>
        </div>
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
