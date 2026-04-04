import type { CodeRef } from '@/components/code/types';
import OverviewViz from './viz/OverviewViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProofDB — 증명 기반 가상 DB</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Reth(풀노드)는 MDBX 디스크에서 상태를 읽는다.
          Helios(경량)는 ProofDB가 RPC에 Merkle 증명을 요청하고 검증 후 값을 반환한다.<br />
          핵심: EVM 코드는 동일하고 DB 레이어만 교체 — 무상태 실행을 가능하게 하는 구조.
        </p>
      </div>

      {/* Viz: 3 step — Reth 비교 / lazy loading / 빌더 패턴 */}
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
                <th className="text-left px-3 py-2 border-b border-border text-indigo-600">Helios (경량)</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">DB</td><td className="px-3 py-1.5 border-b border-border/30">MDBX (700GB+)</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">ProofDB (0 디스크)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">검증</td><td className="px-3 py-1.5 border-b border-border/30">로컬 상태 직접 읽기</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">MPT 증명 후 사용</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">디스크</td><td className="px-3 py-1.5 border-b border-border/30">700GB+</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">~0 (메모리 캐시만)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">신뢰</td><td className="px-3 py-1.5 border-b border-border/30">자체 검증 (신뢰 불필요)</td><td className="px-3 py-1.5 border-b border-border/30 text-indigo-600">RPC 불신 + Merkle 검증</td></tr>
              <tr><td className="px-3 py-1.5">EVM 코드</td><td className="px-3 py-1.5">revm + StateProvider</td><td className="px-3 py-1.5 text-indigo-600">revm + ProofDB (동일 trait)</td></tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} ProofDB의 비용</strong><br />
          Reth는 디스크 읽기로 마이크로초 단위. Helios는 RPC 왕복이 포함되어 수십~수백 밀리초 소요.<br />
          대신 디스크 0, 신뢰 대상 0 — 모바일·브라우저에서도 trustless 실행이 가능해진다.
        </p>
      </div>
    </section>
  );
}
