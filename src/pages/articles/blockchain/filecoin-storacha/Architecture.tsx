import type { CodeRef } from '@/components/code/types';

export default function Architecture({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Storage, Indexing, Retrieval 노드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Storage 노드: 원본 데이터를 보관하고 PDP 증명을 생성. 장기 저장 담당.<br />
          Indexing 노드: CID → 물리적 위치 매핑. IPNI 활용.<br />
          Retrieval 노드: CDN 캐시 레이어. 각 노드가 전문화되어 하드웨어 요구사항이 다름
        </p>
      </div>
    </section>
  );
}
