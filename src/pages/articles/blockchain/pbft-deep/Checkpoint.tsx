import CodePanel from '@/components/ui/code-panel';

const checkpointCode = `PBFT 체크포인트 & 가비지 컬렉션:

1. 주기적 체크포인트 (매 100 요청마다)
   CHECKPOINT = ⟨CHECKPOINT, n, d, i⟩_σi
   n = 시퀀스 번호, d = 상태 다이제스트

2. 안정 체크포인트 (Stable Checkpoint)
   2f+1 노드가 같은 (n, d)에 서명 → 안정
   → 이전 로그를 안전하게 삭제 가능

3. 워터마크 (Water Mark)
   low-watermark h = 마지막 안정 체크포인트의 n
   high-watermark H = h + L (L은 버퍼 크기)
   h < n <= H 범위의 요청만 처리

4. 메모리 관리
   안정 체크포인트 이전의 Pre-prepare, Prepare,
   Commit 메시지 로그를 전부 삭제
   → 무한 로그 증가 방지`;

export default function Checkpoint() {
  return (
    <section id="checkpoint" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 & 로그 정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          PBFT는 합의 과정에서 대량의 메시지 로그가 축적됨.<br />
          체크포인트 메커니즘으로 주기적으로 상태를 확정하고,<br />
          이전 로그를 안전하게 삭제하여 메모리를 관리
        </p>

        <CodePanel title="체크포인트 & 워터마크" code={checkpointCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '주기적 체크포인트 전송' },
            { lines: [7, 9], color: 'emerald', note: '2f+1 확인 → 안정' },
            { lines: [11, 14], color: 'amber', note: '워터마크로 처리 범위 제한' },
            { lines: [16, 19], color: 'violet', note: '오래된 로그 삭제' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT 한계 정리</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">정상 경로: O(n²)</p>
            <p className="text-sm">
              Prepare + Commit 모두 All-to-All 통신.<br />
              검증자 100명이면 라운드당 약 20,000 메시지
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">View Change: O(n³)</p>
            <p className="text-sm">
              리더 장애 복구에 막대한 비용.<br />
              HotStuff가 O(n), Tendermint가 O(n²)으로 개선
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
