import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 부트스트랩이 필요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          이더리움에서 "현재 상태를 아는 방법"은 두 가지.<br />
          Reth(풀 노드)는 제네시스부터 수억 블록을 실행 — 수일 소요, 700GB+ 디스크.<br />
          Helios(경량)는 체크포인트 하나로 시작 — 수 초, 디스크 거의 0.<br />
          같은 목표(현재 상태 접근), 다른 비용.
        </p>
      </div>

      {/* Viz: 6 step — 각 개념을 시각적으로 */}
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
                <th className="text-left px-3 py-2 border-b border-border text-blue-600">Helios (경량)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">신뢰 대상</td><td className="px-3 py-1.5 border-b border-border/30">제네시스 블록만</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600">체크포인트 블록 루트</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">시작 시간</td><td className="px-3 py-1.5 border-b border-border/30">수일 (전체 동기화)</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600">수 초 (체크포인트)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">디스크</td><td className="px-3 py-1.5 border-b border-border/30">700GB+</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600">~0 (32바이트)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">검증 범위</td><td className="px-3 py-1.5 border-b border-border/30">모든 TX 실행</td><td className="px-3 py-1.5 border-b border-border/30 text-blue-600">BLS 서명 + Merkle 증명</td></tr>
              <tr><td className="px-3 py-1.5">보안 가정</td><td className="px-3 py-1.5">없음 (자체 검증)</td><td className="px-3 py-1.5 text-blue-600">체크포인트 신뢰 + 2주 이내</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Reth에는 Weak Subjectivity가 없다</strong><br />
          제네시스부터 모든 블록을 직접 검증하므로 체크포인트 유효기간 제약 불필요.<br />
          대신 초기 동기화에 며칠 소요 — 풀 노드의 대가.
        </p>
      </div>
    </section>
  );
}
