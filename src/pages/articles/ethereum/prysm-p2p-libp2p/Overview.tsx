import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import P2PPeerLifecycleViz from "./viz/P2PPeerLifecycleViz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        발견한 주소는 피어 후보일 뿐이며, 신원과 체인 상태를 통과해야 합의
        피어가 됩니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            Prysm은 Discv5에서 주소를 찾았다는 이유만으로 그 노드를 믿지
            않습니다.
          </strong>{" "}
          주소가 쓸 만한지 먼저 거르고, libp2p 연결에서 상대 신원을 확인한 뒤,
          Ethereum <em>Status</em> 메시지로 같은 fork와 chain을 따르는지
          확인해야 비로소 <em>Connected</em> 상태로 올립니다. 그 뒤에 받은
          block과 attestation도 다시 검증합니다.
        </p>
        <p>
          전화번호를 받았다고 회사 직원에게 바로 결재 권한을 주지 않는 것과
          같습니다. 번호가 유효한지, 통화한 사람이 명함의 당사자인지, 같은
          업무를 말하는지 차례로 확인합니다. 이 글에서는 새 후보{" "}
          <strong>N42</strong> 한 개가
          <strong>
            {" "}
            발견 → 후보 필터 → 연결 → 신원 확인 → Status 검사 → 활성 피어 → 지속
            평가
          </strong>
          를 지나는 동안 무엇이 새로 확정되는지 따라갑니다.
        </p>
      </div>
      <ContentBoundary article="prysm-p2p-libp2p" />
      <P2PPeerLifecycleViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 세 경계를 구분합니다</h3>
        <p>
          <strong>Discv5</strong>는 주변 노드의 서명된 안내문을 찾는
          발견망입니다. 안내문인 <strong>ENR</strong>에는 node ID, 주소, fork와
          subnet 정보가 들어갑니다. <strong>multiaddr</strong>는 TCP나 QUIC로
          실제 전화를 걸 주소이고,
          <strong>PeerId</strong>는 libp2p 보안 연결에서 확인할 상대의 공개키
          기반 신원입니다.
        </p>
        <p>
          여기까지는 “누구와 암호화된 통로가 열렸다”는 뜻입니다. 같은 Ethereum
          합의망을 보는지는 별도입니다. 그래서
          <strong> Status RPC</strong>로 fork digest, finalized checkpoint와
          head를 교환합니다. Status까지 통과한
          <strong> active peer</strong>도 정직하다고 보증된 것은 아닙니다. 단지
          gossip과 요청·응답을 시작할 수 있는 상대가 됐을 뿐입니다.
        </p>
        <p>
          TCP·QUIC, Noise와 stream multiplexing의 일반 원리는{" "}
          <Link to="/cs/p2p/libp2p">libp2p 글</Link>이 다룹니다. 여기서는 그
          연결 위에 Prysm이 후보를 올리고 Ethereum chain 호환성을 확인하는
          경계에 집중합니다.
        </p>
      </div>
      <div id="paper-ethereum-p2p-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications v1.7.0-beta.4 @ aa16bb4c — P2P interface"
          href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/p2p-interface.md"
          citeKey={1}
        >
          Ethereum 합의 규격은 ENR의 eth2 field와 Status·Goodbye·Req/Resp의 wire
          contract를 정의합니다. Prysm의 함수 배치나 피어 점수 가중치는 정하지
          않으므로 protocol 근거로만 사용합니다.
        </CitationBlock>
      </div>
      <div id="paper-libp2p-connection-spec" className="scroll-mt-24">
        <CitationBlock
          source="libp2p Specifications @ c750236 — connection establishment"
          href="https://github.com/libp2p/specs/tree/c750236de43cd8b246a824b377dfdb26bae686db/connections"
          citeKey={2}
        >
          이 규격은 transport 연결 뒤 secure channel, PeerId와 stream
          multiplexer가 맡는 일반 연결 계약을 제공합니다. Ethereum fork 호환성과
          Prysm peer policy를 정의하지는 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-p2p-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs Prysm v7.3.1 @ 96d418cd — p2p·sync source"
          href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/beacon-chain"
          citeKey={3}
          type="code"
        >
          고정한 source에서 filterPeer, connectWithPeer, AddConnectionHandler,
          validateStatusMessage와 네 하위 scorer의 실제 경계를 확인했습니다.
          이후 release나 다른 설정의 수치까지 같다고 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
