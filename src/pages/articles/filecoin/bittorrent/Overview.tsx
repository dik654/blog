import BitTorrentComponentsViz from './viz/BitTorrentComponentsViz';
import PeerExchangeFlowViz from './viz/PeerExchangeFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BitTorrent 개요</h2>
      <div className="not-prose mb-8"><BitTorrentComponentsViz /></div>
      <div className="not-prose mb-8"><PeerExchangeFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BitTorrent — P2P 파일 공유 프로토콜<br />
          Filecoin의 데이터 배포 메커니즘을 이해하기 위한 기초 개념<br />
          중앙 서버 없이 피어 간 직접 파일을 주고받는 분산 구조
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">.torrent 파일과 파일 조각</h3>
        <p>
          파일은 동일 크기의 조각(피스, 256KB~1MB)으로 분할<br />
          .torrent 파일에 각 조각의 SHA1 해시값 저장 → 다운로드한 조각의 무결성 검증 가능
        </p>
      </div>
    </section>
  );
}
