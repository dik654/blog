import ArchOverviewViz from './viz/ArchOverviewViz';
import EthVsFilViz from './viz/EthVsFilViz';
import SealingPipelineViz from './viz/SealingPipelineViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin Lotus 아키텍처 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          Lotus — Filecoin 프로토콜의 Go 참조 구현체<br />
          "분산 스토리지 + 검증 가능한 저장 증명" 플랫폼의 핵심 노드
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">Lotus 레이어 구조</h3>
      <ArchOverviewViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">이더리움 vs Filecoin 아키텍처</h3>
      <EthVsFilViz />

      <h3 className="text-lg font-semibold mt-8 mb-3">섹터 봉인 파이프라인</h3>
      <SealingPipelineViz />
    </section>
  );
}
