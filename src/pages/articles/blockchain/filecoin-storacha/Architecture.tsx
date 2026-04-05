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

        <h3 className="text-xl font-semibold mt-6 mb-3">3-Node Architecture 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Storacha 3-Node Architecture:

// Storage Node:
// - 원본 data hold
// - PDP proof generation
// - high capacity HDD
// - stake collateral
// - 1-100 TB HDDs

// Indexing Node:
// - CID → location mapping
// - IPNI integration
// - metadata database
// - high IOPS SSD

// Retrieval Node (CDN):
// - edge caching
// - HTTP(S) serving
// - geographic POPs
// - fast SSD + bandwidth

// Data flow:
// 1. User uploads → Storage Node
// 2. CID generated (hash)
// 3. Indexing Node advertisement
// 4. Retrieval Nodes pull on demand
// 5. CDN caches popular content
// 6. PDP proofs continuous

// Benefits:
// - specialized hardware
// - scaling per tier
// - cost optimization

// 비교: AWS S3 + CloudFront
// Storacha = 탈중앙 버전
// 3-tier architecture
// edge delivery`}
        </pre>
        <p className="leading-7">
          3-node: <strong>Storage (hold) + Indexing (route) + Retrieval (CDN)</strong>.<br />
          specialized hardware per tier.<br />
          AWS S3 + CloudFront 탈중앙 버전.
        </p>
      </div>
    </section>
  );
}
