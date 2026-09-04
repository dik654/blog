import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmNetworkViz from "../prysm-network-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">GossipSub는 받은 메시지를 복제하기 전에 topic·bytes·consensus validity를 단계별로 판정한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Pub/sub mesh는 한 peer가 보낸 block·attestation을 여러 peer로 빠르게 전달합니다. 잘못된 bytes까지 증폭하면 CPU와 bandwidth가
          공격자에게 넘어갑니다. Prysm은 topic의 fork·message identity, compressed/raw size, SSZ decode, duplicate,
          signature, state-dependent rule을 순서대로 확인한 뒤 accept·reject·ignore를 구분합니다.
        </p>
        <p>
          이 글은 beacon block 한 개를 <strong>topic→bounded Snappy→SSZ object→stateless/stateful validation→decision→mesh
          propagation·score</strong> 순서로 추적합니다. 일반 Gossipsub mesh·score는 <Link to="/p2p/libp2p">libp2p
          글</Link>, SSZ canonical decode는 <Link to="/blockchain/prysm-ssz">SSZ 글</Link>을 재사용합니다.
        </p>
      </div>
      <ContentBoundary article="prysm-gossipsub" />
      <PrysmNetworkViz mode="gossip" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례: beacon block gossip 하나</h3>
        <p>
          Receipt에는 source PeerId, exact topic, compressed byte length, declared/uncompressed length를 남깁니다.
          SSZ type·fork, block root·slot, dedupe key, signature/state validation result, final decision,
          propagation targets도 같은 receipt에서 연결합니다. Decode 전에는 allocation을 제한하고 stateful check 전에는 untrusted
          object가 fork-choice store나 database를 바꾸지 못하게 합니다.
        </p>
        <p>
          Accept는 local validation을 통과해 mesh로 전달 가능한 상태, Reject는 peer penalty 근거가 되는 명백한 invalid input,
          Ignore는 duplicate·local state 부족·시점 문제처럼 이 peer의 악의로 단정하지 않고 전달하지 않는 상태입니다. 실제
          enum과 score effect는 사용한 Prysm/libp2p version에 귀속합니다.
        </p>
      </div>
      <div id="paper-ethereum-gossip-spec" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.p2p} citeKey={1}>
          Ethereum networking spec은 fork-digest topic, message type, SSZ-snappy encoding, size limit과 gossip validation 조건을
          정의합니다. Active fork·preset·commit을 고정하며 Prysm queue·worker 수·score threshold까지 정하지는 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-gossipsub-v11" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.libp2p.gossipsub} citeKey={2}>
          Gossipsub v1.1은 mesh maintenance·peer score·gossip control의 일반 protocol을 설명합니다. Ethereum topic schema와
          consensus object validity는 별도 profile이므로 Gossipsub 연결만으로 block 신뢰를 주장하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-gossip-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={3} type="code">
          Prysm source는 subscriber·validator registration과 block validation의 implementation 근거입니다. Handler 이름과
          concurrency는 release·SHA에 귀속하고 hardening gate는 본문의 운영 계약으로 구분합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
