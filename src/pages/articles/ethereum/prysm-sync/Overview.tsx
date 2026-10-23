import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmNetworkViz from "../prysm-network-viz";
import ConsensusClientLocator from "../shared/ConsensusClientLocator";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">빠진 블록을 받아도 왜 바로 현재 기록으로 삼지 않을까요?</h2>
      <p className="mb-5 text-lg leading-8">
        <Link to="/cs/blockchain/node-architecture#case">전체 지도의 A→B 10 ETH 후보</Link>보다 로컬 기록이 뒤처졌다고 하겠습니다. 후보 하나만 먼저 받아도 부모 상태가 이어지지 않으면 검증할 수 없으므로, 빠진 구간을 순서대로 채워야 합니다.
      </p>
      <ConsensusClientLocator current="sync" path={["sync", "transition", "consensus-store"]} question="빠진 자료를 받은 뒤 어떤 순서로 검증하고 저장해야 live head를 안전하게 따라잡을까요?" />
      <p className="mb-5 text-sm leading-7 text-muted-foreground">아래의 slot 112 head가 같은 후보이고, slot 101~111은 그 후보까지 이어지는 빠진 구간입니다. 숫자는 동기화 순서를 드러내기 위한 예시입니다.</p>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          새 beacon node는 local state가 network head보다 멀리 뒤에 있어 gossip block을 곧바로 처리할 수 없습니다. Genesis부터 검증하거나
          recent trusted checkpoint에서 시작해야 합니다. 그 뒤로는 peer에게 block range를 요청하고 parent·signature·state
          transition을 순서대로 검증해 contiguous prefix만 durable commit해야 합니다.
        </p>
        <p>
          이 글은 <strong>anchor→peer target→range request→out-of-order response→ordered validation→commit cursor→regular
          gossip handoff</strong> 순서로 내려갑니다. Checkpoint trust는 <Link to="/cs/blockchain/prysm-finality#weak-subjectivity">weak
          subjectivity</Link>, block transition은 <Link to="/cs/blockchain/prysm">Prysm 전체 lifecycle</Link>을 재사용합니다.
        </p>
      </div>
      <ContentBoundary article="prysm-sync" />
      <PrysmNetworkViz mode="sync" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례: slot 100 anchor에서 112 head까지</h3>
        <p>
          Local committed cursor가 slot 100이고 peer target이 112라고 합시다. Client는 101부터 bounded range를 여러 peer에
          요청하지만 empty slot 때문에 모든 slot에 block이 오지는 않습니다. Response는 slot/root로 정렬·dedupe한 뒤 parent가 이어지는 block만
          state transition합니다. 검증된 마지막 block/state root는 cursor와 같은 transaction에 기록합니다.
        </p>
        <p>
          Slot 106 block이 invalid이면 107 이후를 먼저 받아 두었더라도 committed cursor를 105 너머로 옮기지 않습니다. 다른 peer에서 106을 다시
          구했는데 같은 root가 계속 invalid라면 peer fault와 chain candidate fault를 구분합니다. 106이 empty slot인지도 range
          semantics와 descendant parent/slot로 확인합니다.
        </p>
      </div>
      <div id="paper-ethereum-sync-network-spec" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.p2p} citeKey={1}>
          Ethereum networking spec은 Status와 BeaconBlocksByRange/Root Req/Resp, response chunk와 minimum serving range를
          정의합니다. Sync scheduler·batch·parallelism은 client implementation이므로 spec과 Prysm source를 구분합니다.
        </CitationBlock>
      </div>
      <div id="paper-ethereum-sync-anchor-spec" className="scroll-mt-24">
        <CitationBlock source="Ethereum Consensus Specifications — Weak Subjectivity" href="https://github.com/ethereum/consensus-specs/blob/master/specs/phase0/weak-subjectivity.md" citeKey={2}>
          이 문서는 checkpoint sync의 trust anchor와 freshness 경계를 제공합니다. Endpoint가 반환한 snapshot 자체를 신뢰 근거로
          삼지 않고 checkpoint root·state root·network identity와 확인 시점을 외부에서 검증합니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-sync-source" className="scroll-mt-24">
        <CitationBlock {...OFFICIAL_SOURCES.prysm.repository} citeKey={3} type="code">
          Prysm source는 initial-sync scheduler, range handler와 regular sync handoff의 implementation 근거입니다. Batch size,
          peer selection과 package layout은 고정한 release·SHA 범위이며 본문의 recovery gate는 별도 운영 계약입니다.
        </CitationBlock>
      </div>
    </section>
  );
}
