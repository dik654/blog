import type { CodeRef } from "@/components/code/types";

export default function Architecture({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">업로드에서 retrieval까지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Storacha를 Storage·Indexing·CDN이라는 고정 3-node topology로 보면 실제 책임이 흐려진다. 사용자 관점에서는 space 권한과 content
          upload, location commitment, hot retrieval, Filecoin aggregation을 순서대로 추적하는 편이 정확하다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Write path</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>DID가 space capability를 앱에 위임</li>
              <li>client가 content를 CAR/shard 형태로 준비</li>
              <li>upload service가 shard location과 receipt를 기록</li>
              <li>hot storage가 CID 기반 retrieval을 제공</li>
              <li>aggregator가 다수 shard를 Filecoin piece/deal 경로로 묶음</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">
              Read &amp; verification path
            </h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>gateway 또는 IPFS client가 CID를 요청</li>
              <li>location record를 따라 available provider를 선택</li>
              <li>받은 bytes로 CID를 다시 계산해 content 검증</li>
              <li>장기 보존 경로는 PoDSI로 aggregate·piece 포함 관계 확인</li>
            </ol>
          </div>
        </div>

        <p className="leading-7">
          hot copy와 Filecoin copy는 동일한 latency·비용·failure model을 갖지
          않는다. 따라서 “upload 성공”, “즉시 retrieval 가능”, “Filecoin deal에
          포함됨”을 서로 다른 상태로 관찰해야 한다.
        </p>
      </div>
    </section>
  );
}
