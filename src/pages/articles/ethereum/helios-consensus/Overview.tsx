import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 BLS 검증인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Reth(풀 노드)는 블록의 모든 TX를 실행해서 state_root를 재계산한다 — 완벽하지만 비용이 크다.<br />
          Helios(경량)는 블록을 실행하지 않는다. 512명 Sync Committee의 BLS 집계 서명만 검증.<br />
          같은 목표(블록 헤더 신뢰), 다른 경로.
        </p>
      </div>

      {/* Viz: 풀 노드 vs 경량, verify 5단계 파이프라인, 512명 위원회 */}
      <div className="not-prose my-8">
        <OverviewViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">Reth와 비교</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">Reth (풀 노드)</th>
                <th className="text-left px-3 py-2 border-b border-border text-indigo-600 dark:text-indigo-400">Helios (경량)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">블록 검증</td>
                <td className="px-3 py-1.5 border-b border-border/30">TX 전체 실행</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-indigo-600 dark:text-indigo-400">BLS 서명 1회 검증</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">검증 대상</td>
                <td className="px-3 py-1.5 border-b border-border/30">모든 검증자</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-indigo-600 dark:text-indigo-400">512명 위원회</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">비용</td>
                <td className="px-3 py-1.5 border-b border-border/30">높음 (CPU + 디스크)</td>
                <td className="px-3 py-1.5 border-b border-border/30 text-indigo-600 dark:text-indigo-400">낮음 (~3ms 수학 연산)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">보안 가정</td>
                <td className="px-3 py-1.5">없음 (자체 검증)</td>
                <td className="px-3 py-1.5 text-indigo-600 dark:text-indigo-400">위원회 정직 다수</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'}</strong> 512명은 전체 검증자의 0.05%에 불과하지만,
          RANDAO 무작위 선출 + 32ETH 스테이킹 + 슬래싱이 결합되어
          위원회 과반 조작의 경제적 비용이 극도로 높다.
        </p>
      </div>
    </section>
  );
}
