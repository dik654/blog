import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  BitTorrentPieceLedgerViz,
  BitTorrentTrustFlowViz,
} from "./bittorrent/viz/ModernBitTorrentViz";

export default function BitTorrentArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">
            BEP 3 Final · v1 torrent를 기준으로 한 입문
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            BitTorrent는 작은 block을 나눠 받되, 완성한 piece 단위로 믿습니다
          </h2>
        </header>
        <p className="text-lg leading-8">
          한 문장으로 답하면, BitTorrent는 파일 묶음을 hash가 붙은 piece로 나누고,
          각 piece의 작은 block을 여러 peer에게 받은 뒤, 기대한 piece hash와 같을 때만
          그 조각을 보유한 것으로 인정하는 배포 방식입니다.
        </p>
        <p>
          700 KiB짜리 배포 묶음 하나를 받는다고 하겠습니다. <code>.torrent</code>에는
          256 KiB마다 끊은 piece 세 개의 기대 hash가 있습니다. 첫 piece는 16 KiB
          block 16개로 나눠 peer A·B·C에게 요청하지만, 마지막 block 하나가 왔다고 곧바로
          믿지는 않습니다. 16개를 올바른 offset에 조립해 전체 256 KiB의 SHA-1을
          대조한 뒤에야 저장소와 다른 peer에게 공개합니다.
        </p>
        <p>
          여기서 바로 꼬리 질문이 생깁니다. Peer 주소는 어디서 얻고, 그 주소를 왜 믿을
          수 있을까요? Tracker와 DHT는 주소 후보만 돌려줍니다. 같은 swarm인지 확인하는
          handshake와 실제 byte를 승인하는 piece hash는 그 뒤의 별도 단계입니다.
        </p>
        <BitTorrentTrustFlowViz />
        <div id="paper-bep3">
          <CitationBlock
            source="BEP 3 — The BitTorrent Protocol Specification · 0e08ddf"
            citeKey={1}
            href="https://www.bittorrent.org/beps/bep_0003.html"
          >
            <p><strong>문제:</strong> 같은 파일 묶음을 받는 downloader가 서로 업로드해 원본 서버 부하를 나눕니다.</p>
            <p><strong>기여:</strong> v1 metainfo·tracker announce·68-byte handshake·piece hash·peer wire message를 정의합니다.</p>
            <p><strong>전제:</strong> 이 글은 2017-02-04에 마지막으로 고친 Final 문서의 v1 형식을 기준으로 합니다.</p>
            <p><strong>근거 범위:</strong> Info-hash, SHA-1 piece 검증, request/piece와 choke 상태의 의미입니다.</p>
            <p><strong>말하지 않는 것:</strong> Peer의 실세계 신원, 악성 파일 여부, 모든 client의 scheduler 성능을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="peer-discovery" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 주소 후보에서 같은 swarm까지</p>
          <h2 className="mt-2 text-2xl font-bold">
            Tracker·DHT 응답은 연락처이고, handshake는 torrent 확인입니다
          </h2>
        </header>
        <p>
          v1의 <code>info_hash</code>는 metainfo 안 <code>info</code> dictionary가 원래
          bencode된 byte의 SHA-1입니다. 파일 내용만 hash한 값이 아닙니다. 파일 이름·길이·
          piece length·piece hash 목록 같은 정보까지 들어간 정확한 encoding을 묶습니다.
          Magnet이나 tracker, DHT는 이 값을 “어느 swarm의 peer를 찾는가”라는 열쇠로 씁니다.
        </p>
        <p>
          Tracker announce나 BEP 5 <code>get_peers</code>가 돌려준 것은 IP:port 후보입니다.
          주소가 많아도 연결 가능성, 완성본 보유, 서로 다른 운영자라는 사실은 알 수 없습니다.
        </p>
        <p>
          TCP 또는 합의한 transport로 연결한 뒤 기본 handshake의 protocol string, reserved
          bits, 20-byte info_hash, 20-byte peer ID를 읽습니다. Info-hash가 다르면 그 연결에
          block을 요청하지 않습니다. Peer ID도 로그인 계정이나 법적 신원이 아니라 protocol
          수준의 식별 표식입니다.
        </p>
        <p>
          DHT의 token도 payload 신뢰 표가 아닙니다. 최근 <code>get_peers</code>를 한 IP가
          다른 주소를 임의로 등록하기 어렵게 <code>announce_peer</code> 쓰기를 제한하는
          값입니다. 이후 peer가 보내는 byte의 무결성은 여전히 piece hash로 검사해야 합니다.
        </p>
        <div id="paper-bep5">
          <CitationBlock
            source="BEP 5 — DHT Protocol · aa944d9"
            citeKey={2}
            href="https://www.bittorrent.org/beps/bep_0005.html"
          >
            <p><strong>문제:</strong> 중앙 tracker 없이도 특정 info-hash의 peer contact를 찾습니다.</p>
            <p><strong>기여:</strong> UDP KRPC의 get_peers·announce_peer와 IP에 묶인 write token을 정의합니다.</p>
            <p><strong>전제:</strong> Accepted 상태 문서의 2020-01-21 revision을 기준으로 합니다.</p>
            <p><strong>근거 범위:</strong> DHT node와 payload peer의 역할, endpoint discovery, token 경계입니다.</p>
            <p><strong>말하지 않는 것:</strong> 반환된 peer의 접속 성공·보유 piece·정직성·payload 무결성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="piece-verify" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · block과 piece를 나누는 이유</p>
          <h2 className="mt-2 text-2xl font-bold">
            작게 요청해야 병렬화할 수 있고, 크게 검사해야 metainfo hash를 쓸 수 있습니다
          </h2>
        </header>
        <p>
          <strong>Piece</strong>는 metainfo에 기대 hash가 하나씩 있는 검증 단위입니다.
          <strong>Block</strong>은 peer wire의 <code>request(index, begin, length)</code>로
          청하는 더 작은 전송 구간입니다. 큰 piece 하나를 통째로 한 peer에게 맡기지 않고
          여러 request를 pipeline할 수 있지만, v1 metainfo는 block별 hash를 주지 않으므로
          piece가 완성되기 전에는 최종 승인을 못 합니다.
        </p>
        <p>
          BEP 3은 16 KiB를 de-facto request 크기로 기록합니다. 이것은 v1 piece hash의
          고정 단위가 아니라 interoperable client들이 널리 받아 온 요청 크기입니다. 마지막
          block은 더 짧을 수 있습니다. 아래 계산에서는 이해를 위해 16 KiB로 고정합니다.
        </p>
        <ExplainedFormula
          question="전체 byte를 piece로 자르면 검증할 조각은 몇 개인가?"
          idea="P byte씩 채우고 남은 byte가 하나라도 있으면 마지막 piece 하나를 더 만듭니다. 그래서 내림이 아니라 올림 나눗셈입니다."
          formula={String.raw`N_{piece}=\left\lceil\frac{L}{P}\right\rceil`}
          annotatedFormula={String.raw`\underbrace{N_{piece}}_{\text{검증할 piece 수}}=\underbrace{\left\lceil\frac{\underbrace{L}_{\text{전체 payload byte}}}{\underbrace{P}_{\text{piece당 byte}}}\right\rceil}_{\text{남은 byte도 한 piece로 셈}}`}
          operations={[
            {
              expression: String.raw`\left\lceil L/P\right\rceil`,
              annotation: ["전체 payload를 같은 길이 P로 나눕니다.", "나머지가 있으면 마지막 짧은 piece를 하나 더 셉니다.", "700/256=2.734375이므로 3개입니다."],
            },
          ]}
          terms={[
            { symbol: "L", name: "전체 payload 길이", description: "v1 multi-file torrent라면 파일들을 선언된 순서로 이어 본 총 byte 수입니다." },
            { symbol: "P", name: "piece length", description: "마지막을 제외한 각 검증 조각의 byte 수입니다." },
            { symbol: "N_{piece}", name: "piece count", description: "metainfo의 hash와 각각 비교할 조각 수입니다." },
          ]}
          assumptions={[
            "BEP 3 v1의 고정 piece length를 사용합니다.",
            "L과 P를 같은 KiB 또는 byte 단위로 넣고 P>0이어야 합니다.",
            "BEP 52 v2의 파일별 Merkle tree와 piece alignment에는 이 장부를 그대로 확대하지 않습니다.",
          ]}
          interpretation="700 KiB를 256 KiB로 나누면 256 KiB 두 개와 188 KiB 하나, 모두 세 piece입니다."
        />
        <CalculationWalkthrough
          title="piece와 request block을 손으로 나누는 장부"
          question="700 KiB payload는 몇 piece와 몇 block이 될까요?"
          scope="BEP 3 v1, piece length 256 KiB, 이 예시의 request block 16 KiB입니다. 속도·peer 수·재요청은 아직 넣지 않습니다."
          steps={[
            {
              label: "완전히 채워지는 piece 수를 셉니다",
              expression: "700 ÷ 256 = 2, 나머지 188",
              result: "완전한 piece 2개",
              reason: "256 KiB를 두 번 쓰면 512 KiB이고 아직 188 KiB가 남습니다.",
            },
            {
              label: "남은 byte를 마지막 piece로 셉니다",
              expression: "256 + 256 + 188 = 700 KiB",
              result: "총 3 pieces",
              reason: "188 KiB도 기대 hash 하나를 가진 독립 검증 단위입니다.",
            },
            {
              label: "첫 256 KiB piece의 request 수를 셉니다",
              expression: "256 ÷ 16 = 16",
              result: "16 blocks",
              reason: "각 request가 서로 다른 begin offset의 16 KiB를 맡습니다.",
            },
            {
              label: "마지막 188 KiB piece의 request 수를 셉니다",
              expression: "188 = 11×16 + 12",
              result: "12 blocks",
              reason: "16 KiB block 11개 뒤에 12 KiB짜리 마지막 block이 하나 더 필요합니다.",
            },
          ]}
          conclusion="세 piece를 모두 받는다면 이 고정 정책에서는 16 + 16 + 12 = 44개 request가 필요합니다. Hash 판정은 request 44번이 아니라 piece 세 번입니다."
          caveats={[
            "재전송·중복 endgame request가 생기면 실제 request 수와 traffic은 늘어납니다.",
            "v1 multi-file torrent의 piece는 파일 경계를 넘어갈 수 있으므로 piece와 파일을 같은 것으로 보면 안 됩니다.",
          ]}
        />
        <BitTorrentPieceLedgerViz />
      </section>

      <section id="release" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 한 piece의 승인과 재시도</p>
          <h2 className="mt-2 text-2xl font-bold">
            Timeout은 block을 다시 맡기고, hash mismatch는 piece 승인을 취소합니다
          </h2>
        </header>
        <p>
          Bitfield와 HAVE는 상대가 어느 piece를 보유한다고 알리는 메시지입니다. 내가
          interested 상태이고 상대가 unchoke했다면 scheduler가 아직 비어 있는 offset을
          요청합니다. Choke나 timeout은 “byte가 틀렸다”는 뜻이 아닙니다. 미완료 request를
          다른 peer에게 다시 맡길 전송 실패입니다. 반대로 모든 block을 조립한 뒤 hash가
          다르면 그 piece를 보유한 것으로 인정할 수 없습니다.
        </p>
        <AlgorithmBlock
          title="piece 0 하나를 받는 admission 절차"
          input={[
            "expected_hash = metainfo.pieces[0]",
            "piece_length = 256 KiB, block_length = 16 KiB",
            "peer bitfields + choke state + request timeout",
          ]}
          steps={[
            {
              code: "choose peer that advertises piece 0 and is unchoked",
              note: "광고는 후보 조건일 뿐 byte가 맞다는 증거가 아닙니다.",
            },
            {
              code: "request(index=0, begin=next_offset, length≤16 KiB)",
              note: "Offset이 겹치거나 범위를 벗어나지 않게 in-flight 장부를 만듭니다.",
            },
            {
              code: "on timeout or disconnect: release offset and retry another peer",
              note: "전송 실패와 무결성 실패를 분리합니다.",
            },
            {
              code: "place received block at piece_buffer[begin..begin+length]",
              note: "Peer와 offset provenance를 남기고 모든 byte가 채워질 때까지 승인하지 않습니다.",
            },
            {
              code: "actual_hash = SHA1(piece_buffer)",
              note: "v1 metainfo가 준 hash와 같은 전체 piece 경계를 정확히 사용합니다.",
            },
            {
              code: "if actual_hash != expected_hash: discard piece and reschedule",
              note: "어느 block이 틀렸는지 hash 하나만으로 알 수 없으므로 piece 전체를 다시 구성합니다.",
            },
            {
              code: "mark piece 0 complete; persist bytes; announce HAVE",
              note: "이 시점부터만 읽기·업로드 가능한 검증 완료 조각으로 공개합니다.",
            },
          ]}
          output="검증된 piece 0 또는 원인별 timeout·transport·hash-mismatch 기록"
          repeatUntil="필요한 모든 piece가 검증되거나 retry·resource 한계에 도달할 때까지 반복합니다."
        />
        <p>
          Rarest-first, request pipeline, endgame duplicate request, optimistic unchoke는 이 기본
          경로 위에 얹는 scheduler 정책입니다. 후보가 희귀하다는 사실은 무결성 판정을
          바꾸지 않습니다.
        </p>
        <p>
          운영에서는 completion time만 보지 말고 timeout, duplicate bytes,
          hash-failure bytes, peak in-flight memory와 peer별 provenance를 함께 기록해야 합니다.
        </p>
        <p>
          여기까지 확정되는 것은 metainfo가 지정한 byte와 같다는 사실입니다. Publisher
          서명, malware 검사, 라이선스, durable receipt는 application의 별도 책임입니다.
        </p>
        <p>
          DHT가 peer 주소를 좁히는 원리가 더 궁금하면 <Link to="/cs/p2p/kademlia">Kademlia</Link>와{" "}
          <Link to="/cs/p2p/kad-lookup">반복 lookup</Link>을 이어 읽습니다. BEP 52 v2는
          SHA-256 Merkle tree와 파일별 alignment를 쓰므로 v1의 “연결된 파일 byte 위 SHA-1
          piece 목록”을 그대로 적용하지 않습니다.
        </p>
      </section>
    </article>
  );
}
