export default function PBFT() {
  return (
    <section id="pbft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PBFT (Practical Byzantine Fault Tolerance)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBFT(1999, Castro & Liskov)는 비동기 네트워크에서 safety를 보장하고,
          부분 동기(partial synchrony) 하에서 liveness를 보장하는 최초의
          실용적 BFT 프로토콜입니다. f개의 비잔틴 노드를 허용하려면
          최소 3f+1개 노드가 필요합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 프로토콜</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PBFT 메시지 흐름 (n=4, f=1):

Client    Replica 0    Replica 1    Replica 2    Replica 3
  │       (Primary)
  │──Request──→│
  │            │──Pre-Prepare──→│──────────────→│──────────→│
  │            │                │               │           │
  │            │←──Prepare──────│←──────────────│←──────────│
  │            │──Prepare──────→│──────────────→│──────────→│
  │            │                │               │           │
  │            │  (2f+1 Prepare 수집 = "prepared" 상태)     │
  │            │                │               │           │
  │            │←──Commit───────│←──────────────│←──────────│
  │            │──Commit───────→│──────────────→│──────────→│
  │            │                │               │           │
  │            │  (2f+1 Commit 수집 = "committed" 상태)     │
  │            │                │               │           │
  │←──Reply────│←──Reply────────│←──Reply───────│←──Reply───│

통신 복잡도: O(n²) — 모든 노드가 모든 노드에게 메시지 전송
메시지 지연: 5 (Request → Pre-Prepare → Prepare → Commit → Reply)

이더리움과 비교:
  PBFT: 5 message delays, 즉시 최종성
  이더리움: ~12초(1 slot) 제안 + 2 에폭(~12.8분) 최종화
  → PBFT는 빠르지만 O(n²)로 확장성 제한`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change (리더 교체)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`PBFT View Change (이더리움의 missed slot과 비교):

PBFT:
  타임아웃 발생 → ViewChange 메시지 브로드캐스트
  → 2f+1 ViewChange 수집 → 새 Primary가 NewView 전송
  → 통신 복잡도: O(n³) ← 병목!

이더리움:
  슬롯 내 제안자 미스 → 다음 슬롯 제안자가 자동 진행
  → 포크 선택 규칙(LMD-GHOST)이 자동으로 최선 체인 선택
  → View Change 없이 liveness 유지

Tendermint (CometBFT):
  타임아웃 → 자동으로 다음 라운드(Round+1)로 진행
  → PBFT보다 단순한 view change
  → 통신 복잡도: O(n²)`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">O(n²) 통신 복잡도</p>
            <p className="text-sm text-muted-foreground">
              검증자 수가 늘어나면 메시지 수가 기하급수적으로 증가.
              이더리움처럼 수십만 검증자는 불가능.
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="font-semibold text-sm mb-1">O(n³) View Change</p>
            <p className="text-sm text-muted-foreground">
              리더 장애 시 복구 비용이 매우 높음.
              HotStuff가 이를 O(n)으로 개선.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
