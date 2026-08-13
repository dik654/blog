import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmNetworkViz from "../prysm-network-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Prysm P2P는 발견한 주소를 곧바로 consensus peer로 믿지 않는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Beacon node는 중앙 서버 목록 없이 후보를 찾지만, signed ENR을 받았다는 사실만으로 그 node가 같은 Ethereum network에서
          유용한 block을 제공한다는 뜻은 아닙니다. 후보는 address와 network metadata를 거쳐 dial되고, libp2p transport·peer
          identity·stream protocol 협상 뒤 Ethereum Status compatibility와 resource policy까지 통과해야 active peer가 됩니다.
        </p>
        <p>
          이 글은 한 후보를 <strong>ENR→dial→authenticated PeerId→multiplexed connection→Status→score·gate→close</strong>
          순서로 추적합니다. TCP·Noise·Swarm의 일반 원리는 <Link to="/p2p/libp2p">libp2p 정본</Link>이 소유하고, 여기서는
          Ethereum consensus metadata와 Prysm peer lifecycle만 다룹니다.
        </p>
      </div>
      <ContentBoundary article="prysm-p2p-libp2p" />
      <PrysmNetworkViz mode="p2p" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례: ENR 후보 한 개가 active peer가 되기까지</h3>
        <p>
          Candidate receipt에는 discovery source, node ID, ENR sequence, IP/UDP/TCP 또는 QUIC address, fork digest와 subnet
          bitfield를 남깁니다. Dial attempt에는 transport, timeout과 expected PeerId를 연결하고, secure channel 뒤 실제 PeerId가
          다르면 즉시 닫습니다. 마지막으로 Status의 fork digest·finalized root/epoch·head root/slot을 local chain context와
          비교하고, 통과한 peer만 gossip과 Req/Resp resource budget을 얻습니다.
        </p>
        <p>
          각 단계는 서로 다른 보장입니다. ENR signature는 record origin을, Noise/TLS는 channel peer identity를, Status는 protocol
          compatibility를 확인하지만 peer honesty나 block validity를 보장하지 않습니다. 그래서 active 이후에도 message outcome,
          request usefulness와 resource abuse를 score·close reason으로 feedback합니다.
        </p>
      </div>
      <div id="paper-ethereum-p2p-spec" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.p2p} citeKey={1}>
          Ethereum consensus networking spec은 transport·identity·protocol negotiation과 gossip·Req/Resp·discovery domain,
          ENR metadata와 Status 경계를 정의합니다. Protocol 정본이지만 Prysm의 queue·score threshold·package layout을 정하지
          않으며 spec commit·fork·network preset을 함께 고정합니다.
        </CitationBlock>
      </div>
      <div id="paper-libp2p-connection-spec" className="scroll-mt-24">
        <CitationBlock source="libp2p Connection Establishment Specification" href="https://github.com/libp2p/specs/tree/master/connections" citeKey={2}>
          이 규격은 transport 이후 secure channel·multiplexer·protocol negotiation의 일반 연결 계약을 제공합니다. Ethereum
          fork compatibility나 Prysm peer score를 정의하지 않으므로 현재 글에서는 재사용되는 lower-layer 근거로만 씁니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-p2p-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={3} type="code">
          Prysm source는 discovery service·connection manager·peer status/scorer의 실제 implementation 근거입니다. Threshold와
          field 이름은 분석한 release·git SHA에 귀속하며 moving branch를 production 전체로 일반화하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
