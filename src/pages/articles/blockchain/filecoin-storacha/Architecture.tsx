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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Storage Node</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>원본 data hold + PDP proof 생성</li>
              <li>high capacity HDD (1-100 TB)</li>
              <li>담보(collateral) 예치</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Indexing Node</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>CID → 물리적 위치 매핑</li>
              <li>IPNI integration</li>
              <li>high IOPS SSD, metadata DB</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Retrieval Node (CDN)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>edge caching + HTTP(S) serving</li>
              <li>지리적 POP 분산</li>
              <li>fast SSD + bandwidth</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Data Flow</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>User uploads → Storage Node</li>
              <li>CID 생성 (해시 기반)</li>
              <li>Indexing Node에 advertisement</li>
              <li>Retrieval Nodes가 on demand pull</li>
              <li>CDN이 popular content 캐시</li>
              <li>PDP proofs 지속 생성</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">장점 (vs AWS S3 + CloudFront)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>tier별 전문 하드웨어</li>
              <li>tier별 독립 스케일링</li>
              <li>비용 최적화</li>
              <li>탈중앙 3-tier + edge delivery</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          3-node: <strong>Storage (hold) + Indexing (route) + Retrieval (CDN)</strong>.<br />
          specialized hardware per tier.<br />
          AWS S3 + CloudFront 탈중앙 버전.
        </p>
      </div>
    </section>
  );
}
