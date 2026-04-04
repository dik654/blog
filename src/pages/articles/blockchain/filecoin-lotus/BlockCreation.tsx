import CreateBlockViz from './viz/CreateBlockViz';
import SealingPipelineViz from './viz/SealingPipelineViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BlockCreation({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="block-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 생성 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          VRF Sortition 당선 후 CreateBlock()으로 블록 조립<br />
          Lookback 상태 → 워커 주소 조회 → BLS/Secpk 분류 → 서명 → FullBlock
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">CreateBlock() 코드 추적</h3>
      <CreateBlockViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">Sealing 파이프라인 상세</h3>
      <SealingPipelineViz />
    </section>
  );
}
