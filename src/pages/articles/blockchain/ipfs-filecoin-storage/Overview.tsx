import CIDResolveViz from './viz/CIDResolveViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IPFS &amp; Filecoin 스토리지 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          IPFS — 콘텐츠 주소 기반 분산 파일 시스템. Filecoin — IPFS 위에 경제적 인센티브를 추가한 저장 네트워크.<br />
          CID(Content Identifier) = 파일 내용의 해시가 곧 주소. 어떤 노드에서든 동일 CID로 접근 가능
        </p>
      </div>
      <div className="not-prose"><CIDResolveViz /></div>
    </section>
  );
}
