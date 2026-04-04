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
      </div>
    </section>
  );
}
