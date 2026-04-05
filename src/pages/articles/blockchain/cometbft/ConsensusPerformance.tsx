import CodePanel from '@/components/ui/code-panel';
import TimeoutStrategyViz from './viz/TimeoutStrategyViz';
import { TIMEOUT_CODE, TIMEOUT_ANNOTATIONS, PERF_TABLE, PARALLEL_CODE, PARALLEL_ANNOTATIONS } from './ConsensusPerformanceData';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function ConsensusPerformance({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 성능 최적화</h2>
      <div className="not-prose mb-8"><TimeoutStrategyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 합의 성능은 세 가지 요소에 크게 좌우됩니다.
          <br />
          <strong>타임아웃 설정</strong>, <strong>블록 크기</strong>, <strong>병렬 처리 전략</strong>입니다.
          <br />
          라운드 실패 시 타임아웃이 점진적으로 증가합니다.
          <br />
          네트워크 복구를 기다리면서도 불필요한 리소스 낭비를 방지합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">타임아웃 전략</h3>
        <CodePanel title="라운드별 타임아웃 동적 증가" code={TIMEOUT_CODE} annotations={TIMEOUT_ANNOTATIONS} />
        <h3 className="text-xl font-semibold mt-6 mb-3">성능 파라미터 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>파라미터</th>
                <th className={`${CELL} text-left`}>기본값</th>
                <th className={`${CELL} text-left`}>효과</th>
              </tr>
            </thead>
            <tbody>
              {PERF_TABLE.map(r => (
                <tr key={r.param}>
                  <td className={`${CELL} font-mono text-xs`}>{r.param}</td>
                  <td className={CELL}>{r.default_val}</td>
                  <td className={CELL}>{r.effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">병렬 처리 최적화</h3>
        <CodePanel title="PartSet 분할 + ABCI 동시 연결" code={PARALLEL_CODE} annotations={PARALLEL_ANNOTATIONS} />

        {/* ── 메인넷 성능 수치 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메인넷 성능 수치 — 실전 벤치마크</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주요 Cosmos chain 실측 성능 (2025):

// Cosmos Hub (ATOM):
// - Block time: 6~7초
// - TPS: ~20
// - Block size: ~100KB
// - Validators: 175
// - Finality: 즉시 (2/3+ Precommit)

// Osmosis:
// - Block time: 5초
// - TPS: ~150 (DEX TX 많음)
// - Block size: 평균 500KB
// - Validators: 150

// dYdX v4:
// - Block time: 1.3초 (매우 빠름)
// - TPS: ~2000 (orderbook)
// - Validators: 60
// - Vote Extensions 적극 활용

// Sei Network:
// - Block time: 500ms (가장 빠름)
// - TPS: ~12,000 (병렬 EVM)
// - Validators: 50
// - Optimistic block processing

// 성능 결정 요소:
// 1. validator 수: 적을수록 빠름 (정족수 확보 쉬움)
//    60 validators: ~1초 합의
//    175 validators: ~5초 합의
//
// 2. propose/prevote/precommit timeout:
//    - Cosmos Hub: 1s/1s/1s (느림)
//    - dYdX: 250ms/150ms/150ms (빠름)
//    - Sei: 더 공격적
//
// 3. block size 제한:
//    - max_bytes: 기본 1MB
//    - max_gas: app-specific
//    - 크면 TPS↑, 전파 느려짐
//
// 4. ABCI 앱 성능:
//    - EVM: ~100ms per block
//    - Cosmos SDK modules: ~50ms per block
//    - 병목 시 block time 증가

// Scalability 한계:
// - validator > 200: gossip 오버헤드 급증
// - block size > 5MB: 전파 timeout 빈번
// - network latency > 200ms: round 실패 증가`}
        </pre>
        <p className="leading-7">
          CometBFT 성능은 <strong>validator 수 + timeout + block size</strong>로 결정.<br />
          Cosmos Hub(느림) → dYdX(빠름) → Sei(최고속)로 trade-off.<br />
          validator 줄이고 timeout 줄이면 TPS 증가 (탈중앙성과 반비례).
        </p>
      </div>
    </section>
  );
}
