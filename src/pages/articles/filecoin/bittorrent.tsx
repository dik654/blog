import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import BitTorrentComponentsViz from "./bittorrent/viz/BitTorrentComponentsViz";
import PeerExchangeFlowViz from "./bittorrent/viz/PeerExchangeFlowViz";
import SwarmFlowViz from "./bittorrent/viz/SwarmFlowViz";

export default function BitTorrentArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 파일을 찾고, 검증 가능한 조각으로 나누어 받기
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            민수의 노트북이 900 MiB 배포 이미지를 받는다고 하자. BitTorrent의
            첫 질문은 “누가 파일을 갖고 있는가”이고, 다음 질문은 “서로 믿지
            않는 여러 피어에게서 받은 바이트가 맞는가”다. 메타정보는 파일을
            식별하고 piece 경계와 hash를 제공하며, tracker 또는 DHT는 같은
            torrent에 참여한 피어의 endpoint를 찾는 출발점이 된다.
          </p>
          <p>
            여기서 discovery, identity, transport를 섞지 않는 것이 중요하다.
            Tracker 응답이나 BEP 5 DHT의 <code>get_peers</code>는 후보 주소를
            돌려줄 뿐 상대가 원하는 파일을 끝까지 전송하거나 정직하다고
            보증하지 않는다. 후보와 연결한 뒤 BitTorrent handshake로
            info-hash를 맞추고, peer wire의 request/piece 메시지로 block을
            교환하며, 완성한 piece의 hash가 다르면 폐기하고 다른 피어에게
            다시 요청한다.
          </p>
          <p>
            이 글은 Final 상태 BEP 3의 v1 metainfo와 Accepted 상태 BEP 5를
            대상으로 한다. Session receipt에는 metainfo 원본 byte와 info-hash
            rule, BEP/profile, client version, enabled extension·transport와 각
            peer outcome을 남긴다. Private torrent, BEP 52 v2 또는 magnet
            extension을 쓴다면 같은 포맷이라고 가정하지 않고 별도 profile로
            검증한다.
          </p>
        </div>

        <div className="not-prose my-8">
          <BitTorrentComponentsViz />
        </div>

        <ExplainedFormula
          question="전체 길이 L을 piece 길이 P로 나누면 검증할 piece는 몇 개인가?"
          idea="앞쪽 piece는 같은 P byte로 자르고 마지막 remainder만 짧게 둔다. 따라서 나눗셈의 몫에 remainder가 있으면 한 piece를 더 세는 ceiling division이 필요하다."
          formula={String.raw`n_p=\left\lceil\frac{L}{P}\right\rceil`}
          annotatedFormula={String.raw`n_p=\underbrace{\left\lceil\frac{L}{P}\right\rceil}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\left\lceil\frac{L}{P}\right\rceil`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","앞쪽 piece는 같은 P byte로 자르고 마지막","remainder만 짧게 둔다."] },
          ]}
          terms={[
            { symbol: "L", name: "Payload length", description: "모든 파일을 이어 붙인 전체 payload 길이, 단위 byte" },
            { symbol: "P", name: "Piece length", description: "메타정보가 선언한 보통의 piece 길이, 단위 byte" },
            { symbol: "n_p", name: "Piece count", description: "Hash로 각각 검증해야 하는 piece 수, 무차원 개수" },
            { symbol: "\\lceil\\cdot\\rceil", name: "Ceiling", description: "나누어떨어지지 않는 마지막 구간을 한 개로 올려 세는 연산" },
          ]}
          assumptions={[
            "BEP 3의 v1 metainfo처럼 마지막 piece를 제외한 piece 길이가 P로 고정된 경우다.",
            "L과 P는 같은 byte 단위이며 P는 0보다 커야 한다.",
            "식은 piece 수만 세며 peer 수, 다운로드 시간, availability를 계산하지 않는다.",
          ]}
          interpretation="L=900 MiB, P=4 MiB이면 정확히 225개다. L=901 MiB이면 마지막 1 MiB piece가 생겨 226개다. 이 계산을 BEP 52 v2의 Merkle tree 검증 구조까지 같은 포맷이라고 확대하면 안 된다."
        />

        <div className="not-prose my-8">
          <PeerExchangeFlowViz />
        </div>

        <CitationBlock
          source="BEP 3 — The BitTorrent Protocol Specification"
          citeKey={1}
          href="https://www.bittorrent.org/beps/bep_0003.html"
        >
          <div id="paper-bep3" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> 큰 파일을 여러 downloader가 서로 업로드하며 배포해야 한다.</p>
            <p><strong>기여:</strong> v1 metainfo, tracker, peer handshake, piece hash와 choking 메시지를 정의한다.</p>
            <p><strong>전제:</strong> BEP 3 Final 문서의 v1 wire와 bencoding을 대상으로 한다.</p>
            <p><strong>근거 범위:</strong> 이 글의 metainfo와 기본 peer-wire 동작에만 사용한다.</p>
            <p><strong>비보장:</strong> 모든 구현의 scheduler, BEP 52 v2, 전송 성능이나 peer 정직성을 보장하지 않는다.</p>
          </div>
        </CitationBlock>

        <CitationBlock
          source="BEP 5 — DHT Protocol"
          citeKey={2}
          href="https://www.bittorrent.org/beps/bep_0005.html"
        >
          <div id="paper-bep5" className="space-y-1 text-sm leading-6">
            <p><strong>문제:</strong> Tracker가 없는 torrent에서도 peer contact를 찾아야 한다.</p>
            <p><strong>기여:</strong> UDP KRPC의 get_peers·announce_peer와 token 경계를 규정한다.</p>
            <p><strong>전제:</strong> Accepted 상태 BEP 5와 선택한 구현 revision을 함께 고정한다.</p>
            <p><strong>근거 범위:</strong> DHT node가 peer endpoint 위치를 찾는 discovery 역할에 한정한다.</p>
            <p><strong>비보장:</strong> DHT 응답이 실제 seeder, payload 무결성, 연결 성공을 증명하지 않는다.</p>
          </div>
        </CitationBlock>
      </section>

      <section id="architecture" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Swarm의 실행 경로: 연결, block 요청, 검증, 재시도
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            민수는 tracker와 DHT 결과를 합치고 endpoint 중복을 제거한다. TCP나
            지원하는 별도 transport로 연결한 뒤 68-byte 기본 handshake에서
            protocol string, reserved bits, info-hash, peer ID를 확인한다. Peer
            ID는 연결을 구분하는 표식이지 현실의 독립된 사람을 증명하는 강한
            identity가 아니다. Info-hash가 다르면 같은 swarm이 아니므로 그
            연결에서 piece를 요청하지 않는다.
          </p>
          <p>
            연결이 성립하면 bitfield/have로 상대가 가진 piece를 파악하고,
            interested·choke 상태가 허용하는 동안 request를 보낸다. Request는
            piece index, begin offset, length로 block을 지정하고 piece 메시지가
            그 block을 돌려준다. 현재 BEP 3은 request 길이의 규범적 상한과
            널리 수용되는 16 KiB 관행을 구분하므로 “모든 block은 반드시
            16 KiB”라고 말해서는 안 된다.
          </p>
        </div>

        <div className="not-prose my-8">
          <SwarmFlowViz />
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>고정 예시의 실패 장부</h3>
          <ol>
            <li><strong>Discovery 실패:</strong> tracker timeout과 DHT timeout을 따로 기록하고 다른 source를 시도한다.</li>
            <li><strong>Handshake 실패:</strong> info-hash mismatch, unsupported extension, transport error를 구분한다.</li>
            <li><strong>전송 실패:</strong> choke와 request timeout은 손상된 piece와 다른 결과다. In-flight block을 다른 피어에 재배치할 수 있다.</li>
            <li><strong>무결성 실패:</strong> piece가 완성된 뒤 hash가 다르면 그 piece 전체를 인정하지 않고 block provenance를 남겨 다시 받는다.</li>
          </ol>
          <p>
            Rare piece를 먼저 고르는 scheduler와 optimistic unchoke는 흔한 구현
            전략이지만 BEP 3이 모든 선택 세부를 하나로 고정하지는 않는다.
            운영 비교에서는 같은 torrent·peer set·transport에서 completion
            time, duplicate bytes, hash-failure bytes, timeout과 retry를 함께
            측정해야 한다. 피어를 찾는 Kademlia 자체가 필요하면{" "}
            <Link to="/p2p/kademlia">Kademlia routing</Link>과{" "}
            <Link to="/p2p/kad-lookup">반복 탐색</Link>을 이어 읽는다.
          </p>
          <p>
            Release gate에서는 후보 수만 세지 않는다. Dial·handshake reject
            reason, request timeout, duplicate bytes, hash-failure bytes, peak
            in-flight memory와 completion time을 같은 torrent·peer fixture에서
            base와 candidate에 기록한다. Correctness parity 뒤 canary를 열고
            retry·resource threshold를 넘으면 이전 scheduler로 rollback한다.
          </p>
        </div>
      </section>
    </>
  );
}
