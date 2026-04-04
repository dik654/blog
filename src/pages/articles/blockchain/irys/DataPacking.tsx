import CodePanel from '@/components/ui/code-panel';
import ChunkPackViz from './viz/ChunkPackViz';
import { CHUNK_CODE, MERKLE_CODE, PACKING_CODE, PARTITION_CODE } from './DataPackingData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function DataPacking({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="data-packing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '데이터 청킹 & 매트릭스 패킹'}</h2>
      <div className="not-prose mb-8"><ChunkPackViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys의 저장 증명은 데이터를 고정 크기 청크로 분할하고
          <strong>매트릭스 패킹</strong> 알고리즘을 적용해 효율적인 샘플링 검증을 지원합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-unpack', codeRefs['irys-unpack'])} />
            <span className="text-[10px] text-muted-foreground self-center">packing/src/lib.rs</span>
            <CodeViewButton onClick={() => onCodeRef('irys-xor-pack', codeRefs['irys-xor-pack'])} />
            <span className="text-[10px] text-muted-foreground self-center">XOR 유틸</span>
          </div>
        )}

        <h3>청크 구조</h3>
        <CodePanel title="청크 타입 정의" code={CHUNK_CODE} annotations={[
          { lines: [2, 5], color: 'sky', note: '청크 포맷 열거형' },
          { lines: [17, 21], color: 'emerald', note: '패킹 메타데이터' },
        ]} />

        <h3>Merkle 트리 기반 검증</h3>
        <CodePanel title="Merkle 검증 흐름" code={MERKLE_CODE} annotations={[
          { lines: [12, 16], color: 'sky', note: '청크 검증 함수' },
        ]} />

        <h3>매트릭스 패킹</h3>
        <p>
          노드 주소·파티션 해시·오프셋을 종자로 2단계 엔트로피를 생성한 후
          청크 데이터와 XOR하여, 특정 노드만이 특정 청크를 언패킹할 수 있게 합니다.
        </p>
        <CodePanel title="2-Phase 엔트로피 + XOR 패킹" code={PACKING_CODE} annotations={[
          { lines: [6, 7], color: 'sky', note: '시드 해시 생성' },
          { lines: [14, 19], color: 'emerald', note: '2D 해시 패킹' },
          { lines: [23, 25], color: 'amber', note: 'XOR 적용/해제' },
        ]} />

        <h3>파티션 시스템</h3>
        <CodePanel title="파티션 구조" code={PARTITION_CODE} annotations={[
          { lines: [2, 4], color: 'sky', note: '파티션 식별' },
        ]} />
      </div>
    </section>
  );
}
