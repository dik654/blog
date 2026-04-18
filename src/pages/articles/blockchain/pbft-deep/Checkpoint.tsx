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
        <p className="leading-7">
          PBFT는 합의 과정에서 <strong>대량 메시지 로그 축적</strong>.<br />
          n=100, 초당 1000 TX → 분당 18M 메시지 (각 TX 당 O(n²)).<br />
          Checkpoint가 없으면 메모리 폭발.
        </p>

        <CodePanel title="체크포인트 & 워터마크" code={checkpointCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: '주기적 체크포인트 전송' },
            { lines: [7, 9], color: 'emerald', note: '2f+1 확인 → 안정' },
            { lines: [11, 14], color: 'amber', note: '워터마크로 처리 범위 제한' },
            { lines: [16, 19], color: 'violet', note: '오래된 로그 삭제' },
          ]} />

        {/* ── Checkpoint 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Checkpoint 생성 상세</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">생성 조건 & 메시지</p>
              <p className="text-sm">sequence number <code>n</code>이 K의 배수 (K=100 or 128) → K번째 request execute 후 생성</p>
              <p className="text-xs font-mono mt-2">⟨CHECKPOINT, <code>n</code>, <code>d</code>, <code>i</code>⟩<sub>σi</sub></p>
              <ul className="text-sm space-y-0.5 mt-1 list-disc list-inside">
                <li><code>n</code>: checkpoint sequence</li>
                <li><code>d</code>: state digest (up to n)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">Stable Checkpoint</p>
              <p className="text-sm"><code>2f+1</code> CHECKPOINT for same <code>(n, d)</code> 수집 = "stable checkpoint proof"</p>
              <ol className="text-sm space-y-0.5 mt-2 list-decimal list-inside">
                <li>sequence ≤ <code>n</code> log entries 삭제</li>
                <li>이전 view prepared 정보 삭제</li>
                <li>low watermark <code>h := n</code></li>
                <li>high watermark <code>H := h + L</code> (L=128)</li>
              </ol>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">메모리 절감</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>log entries: PRE-PREPARE, PREPARE, COMMIT</li>
                <li>각 entry O(n) signatures</li>
                <li>K request 후 삭제 → O(K*n) 메모리 회수</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Watermark 범위 (<code>h &lt; n ≤ H</code>)</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li><code>h</code>: 이미 stable, <code>H = h + L</code>: 최대값</li>
                <li>L 크면 메모리 낭비, 작으면 progress 제한</li>
                <li>새 replica 합류 시 stable checkpoint + 2f+1 증명 전송</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Checkpoint = <strong>주기적 state snapshot + log GC</strong>.<br />
          매 K=100 request마다 생성, 2f+1 동의로 stable.<br />
          log 삭제 + high watermark 전진으로 메모리 관리.
        </p>

        {/* ── State transfer ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State Transfer (느린 replica 동기화)</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">State Transfer 프로토콜</p>
            <ol className="text-sm space-y-2 list-decimal list-inside">
              <li><strong>Slow replica 감지</strong> — PRE-PREPARE의 <code>n &gt; H</code> 또는 stable checkpoint notification</li>
              <li><strong>FETCH 요청</strong> — ⟨FETCH, <code>h'</code>, <code>h</code>, <code>d_h</code>⟩<sub>σi</sub> (<code>h'</code>: 현재 watermark, <code>h</code>: 원하는 checkpoint)</li>
              <li><strong>다른 replica 응답</strong> — state 전송, Merkle tree로 부분 검증 가능</li>
              <li><strong>State 적용</strong> — 2f+1 CHECKPOINT proof 검증, log 비우기, <code>h := 새 checkpoint</code></li>
              <li><strong>따라잡기</strong> — PRE-PREPARE, PREPARE, COMMIT 재수신하여 현재 sequence까지 catchup</li>
            </ol>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">성능 고려</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>state 크면 partitioning 필수</li>
                <li>Hyperledger: Merkle patricia trie</li>
                <li>Tendermint: IAVL tree snapshot</li>
                <li>대역폭 상한 설정 (other replica 보호)</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">실무 숫자</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>Ethereum state: 150GB+</li>
                <li>전체 snapshot 전송 비현실적</li>
                <li>snap sync: partial download + proof</li>
                <li>state root 기준 Merkle proof</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          State transfer = <strong>느린 replica 동기화</strong>.<br />
          watermark 벗어난 replica는 checkpoint state 받아 catchup.<br />
          Merkle tree로 부분 전송 + 검증 가능.
        </p>

        {/* ── PBFT 한계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PBFT의 실무 한계와 후속 프로토콜</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-semibold text-sm mb-2">1. O(n²) 통신 (normal case)</p>
              <div className="overflow-x-auto">
                <table className="text-sm w-full">
                  <thead><tr className="border-b"><th className="text-left py-0.5 pr-2">n</th><th className="text-left py-0.5">메시지 수</th></tr></thead>
                  <tbody>
                    <tr><td className="py-0.5 pr-2">4</td><td className="py-0.5">36</td></tr>
                    <tr><td className="py-0.5 pr-2">10</td><td className="py-0.5">360</td></tr>
                    <tr><td className="py-0.5 pr-2">50</td><td className="py-0.5">9,800</td></tr>
                    <tr><td className="py-0.5 pr-2">100</td><td className="py-0.5">39,600</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-semibold text-sm mb-2">2. O(n³) view change</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>n=100: 3.96M message size</li>
                <li>지연 = 수 초~분</li>
                <li>primary 공격 시 치명적</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">3. Static membership</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>노드 리스트 고정</li>
                <li>동적 합류/탈퇴 복잡</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">4. Client-centric</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>client가 primary 추적 + f+1 reply 수집</li>
                <li>blockchain에 부적합 (client ≠ node)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">후속 프로토콜 개선</p>
            <div className="overflow-x-auto">
              <table className="text-sm w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1 pr-3">프로토콜</th>
                    <th className="text-left py-1 pr-3">연도</th>
                    <th className="text-left py-1">핵심 개선</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-dashed"><td className="py-1 pr-3">Zyzzyva</td><td className="py-1 pr-3">2007</td><td className="py-1">Speculative execution, 정상 case 1 round-trip</td></tr>
                  <tr className="border-b border-dashed"><td className="py-1 pr-3">Tendermint</td><td className="py-1 pr-3">2014</td><td className="py-1">Blockchain 맞춤, continuous consensus, 2/3+ weight</td></tr>
                  <tr className="border-b border-dashed"><td className="py-1 pr-3">HotStuff</td><td className="py-1 pr-3">2018</td><td className="py-1">O(n) 통신, chained voting, threshold signature</td></tr>
                  <tr className="border-b border-dashed"><td className="py-1 pr-3">Jolteon</td><td className="py-1 pr-3">2021</td><td className="py-1">HotStuff + 2-chain commit, async fallback (Aptos)</td></tr>
                  <tr><td className="py-1 pr-3">Mysticeti</td><td className="py-1 pr-3">2024</td><td className="py-1">DAG-based, uncertified blocks, 390ms latency</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">PBFT는 concepts의 보고 — 후속 프로토콜은 모두 PBFT를 개선한 것</p>
          </div>
        </div>
        <p className="leading-7">
          PBFT 한계: <strong>O(n²) normal, O(n³) view change, static membership</strong>.<br />
          HotStuff가 O(n) + threshold signature로 해결.<br />
          25년간 BFT 연구 = PBFT 개선사.
        </p>

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

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 PBFT의 유산</strong> — 3-phase pattern.<br />
          Pre-prepare(propose) → Prepare(vote) → Commit(finalize).<br />
          Tendermint의 Proposal → Prevote → Precommit도 동일 패턴.<br />
          HotStuff의 Prepare → Pre-commit → Commit → Decide도 확장.
        </p>
      </div>
    </section>
  );
}
