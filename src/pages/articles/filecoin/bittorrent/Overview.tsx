import BitTorrentComponentsViz from "./viz/BitTorrentComponentsViz";
import PeerExchangeFlowViz from "./viz/PeerExchangeFlowViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        BitTorrent는 파일을 조각내 여러 피어가 함께 전달한다
      </h2>
      <div className="not-prose mb-8">
        <BitTorrentComponentsViz />
      </div>
      <div className="not-prose mb-8">
        <PeerExchangeFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          BitTorrent는 중앙 서버 한 곳에서 파일 전체를 내려받는 대신, 파일을
          여러 조각으로 나눠 피어들이 서로 교환하게 하는 P2P 프로토콜이다. 이
          구조를 먼저 이해하면 Filecoin의 저장 증명과 실제 데이터 전달 경로가
          왜 별도의 문제인지 구분하기 쉬워진다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">
          .torrent 파일과 파일 조각
        </h3>
        <p>
          파일은 piece로 분할되고 메타정보에는 각 piece를 검증할 해시가 담긴다. 클라이언트는 서로 다른 피어에게서 조각을 병렬로 받은 뒤 해시를 확인하므로 전송한 피어를 신뢰하지
          않아도 손상 여부를 알아낼 수 있다. piece 크기와 메타정보 형식은 torrent 포맷 버전에 따라 달라질 수 있다.
        </p>
      </div>
    </section>
  );
}
