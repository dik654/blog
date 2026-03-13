import { CitationBlock } from '../../../../components/ui/citation';

export default function Narwhal() {
  return (
    <section id="narwhal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal: DAG 기반 멤풀</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Narwhal은 <strong>구조화된 DAG 멤풀</strong>로, 이더리움의 txpool +
          블록 전파를 결합한 것과 유사합니다. 하지만 이더리움의 단일 제안자와 달리
          <strong>모든 검증자가 동시에 데이터를 제안</strong>합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Vertex & Certificate</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Narwhal의 기본 단위:

Vertex (정점):
┌──────────────────────────────┐
│ author:  검증자 ID            │
│ round:   라운드 번호           │
│ payload: 트랜잭션 배치(batch)  │  ← 이더리움의 "블록 바디"에 해당
│ parents: 이전 라운드 인증서들   │  ← 이더리움의 "parentHash"와 유사
│ signature: 서명               │     하지만 여러 부모를 참조
└──────────────────────────────┘

Certificate (인증서):
┌──────────────────────────────┐
│ vertex:  원본 vertex          │
│ votes:   2f+1 검증자 서명     │  ← 이더리움의 "어테스테이션"과 유사
│                               │     해당 데이터가 가용함을 증명
└──────────────────────────────┘

이더리움 비교:
  이더리움: 1 proposer → 블록 → 모든 노드가 검증
  Narwhal:  n proposer → 각자 vertex → 상호 검증 → Certificate`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">라운드 진행 흐름</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Round r 진행:

1. 각 검증자가 자신의 vertex 브로드캐스트
   - payload: 새로운 트랜잭션 배치
   - parents: Round r-1의 인증서 2f+1개 이상

2. 다른 검증자들이 vertex를 수신하고 검증
   - 부모 인증서가 유효한가?
   - payload가 올바른가?

3. 유효하면 서명을 보내줌 (vote)

4. 원저자가 2f+1 서명을 모아 Certificate 생성
   → 이 Certificate가 "데이터 가용성 증명"

5. Certificate를 다음 라운드의 vertex에 포함
   → DAG가 점진적으로 구축됨

이더리움의 블록 파이프라인과 비교:
  Slot N: 제안 → 어테스테이션 → 다음 블록에 포함
  Narwhal: Vertex → Votes → Certificate → 다음 라운드 참조
  → 유사한 구조이지만 n개가 동시에 진행`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 가용성 보장</h3>
        <p>
          Certificate가 존재한다는 것은 2f+1 정직한 노드가 해당 데이터를 보유함을 의미합니다.
          이는 이더리움의 <strong>Data Availability Sampling(DAS)</strong>(EIP-4844 이후)과
          유사한 목표를 달성하지만, 방법이 다릅니다:
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">이더리움 DAS</p>
            <p className="text-sm text-muted-foreground">
              Erasure coding + 랜덤 샘플링으로 데이터 가용성 확인.
              데이터를 직접 보유하지 않아도 검증 가능.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">Narwhal Certificate</p>
            <p className="text-sm text-muted-foreground">
              2f+1 노드가 실제로 데이터를 수신했음을 서명으로 증명.
              더 단순하지만 모든 데이터를 전송해야 함.
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">Scale-out Worker 아키텍처</h3>
        <p>
          Narwhal의 핵심 설계: <strong>데이터 전파와 메타데이터(DAG)를 분리</strong>합니다.
          DAG vertex에는 트랜잭션 배치의 해시(digest)만 포함하고,
          실제 데이터는 <strong>Worker</strong> 프로세스가 별도로 전파합니다.
          Worker를 추가하면 처리량이 선형적으로 증가합니다.
        </p>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Narwhal Primary-Worker 분리:

┌─────────────────────────────────────────────┐
│ Primary (DAG 관리)                           │
│  - Certificate 생성 & 검증                   │
│  - DAG 구축 (vertex = batch digest 참조)     │
│  - 라운드 진행 관리                           │
│  → O(n) 통신 — digest만 교환                 │
├─────────────────────────────────────────────┤
│ Worker 1        Worker 2        Worker 3     │
│ (batch 수집)    (batch 수집)    (batch 수집)  │
│ (데이터 전파)    (데이터 전파)    (데이터 전파)  │
│  → 대역폭 집약적 작업을 분산                   │
└─────────────────────────────────────────────┘

이더리움 비교:
  이더리움: 단일 proposer가 전체 블록 바디를 전파 (병목)
  Narwhal:  n개 Primary × m개 Worker가 동시에 전파 (병렬)
  → 벤치마크: 50 검증자에서 ~125k-297k TPS`}</code>
        </pre>
        <CitationBlock source="Danezis et al., &quot;Narwhal and Tusk&quot;, EuroSys 2022" citeKey={1} type="paper" href="https://arxiv.org/abs/2105.11827">
          <p className="italic text-muted-foreground">"Narwhal can sustain up to 130,000 tx/s... We observe that separating data availability from consensus is a powerful paradigm"</p>
          <p className="mt-2 text-xs">Narwhal 논문의 핵심 주장 — 데이터 가용성과 합의를 분리하면 처리량이 극대화됩니다. 이더리움의 EL/CL 분리와 유사한 철학입니다.</p>
        </CitationBlock>
        <CitationBlock source="sui/narwhal/primary/src/proposer.rs" citeKey={2} type="code" href="https://github.com/MystenLabs/sui/blob/main/narwhal/primary/src/proposer.rs">
          <pre><code>{`// Vertex 생성 핵심 로직 (proposer.rs)
let header = Header::V2(HeaderV2 {
    author: self.authority_id,
    round,
    epoch: self.committee.epoch(),
    created_at: now,
    payload: self.payload.drain().collect(),
    parents: self.last_parents.clone(),  // 이전 라운드 Certificate 참조
});`}</code></pre>
          <p className="mt-2 text-xs">각 검증자가 매 라운드 vertex(Header)를 생성할 때, 이전 라운드의 Certificate들을 parents로 참조하여 DAG를 구축합니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}
