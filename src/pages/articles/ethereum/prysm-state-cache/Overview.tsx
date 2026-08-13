import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import PrysmDataApiViz from "../prysm-data-api-viz";

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">State cache는 state를 빨리 찾는 장치이지, state의 정당성을 결정하는 장치가 아니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">Beacon node가 slot 105의 state를 요청받았는데 메모리에는 없다면, 단순히 “가장 가까운 값을 반환”할 수 없습니다. 같은 slot에도 fork A와 B가 있을 수 있고, 저장된 state가 slot 100이라면 빈 slot과 block transition을 정확한 순서로 다시 적용해야 하기 때문입니다. 이 글은 target root 하나를 <strong>identity 확인 → hot cache → stored anchor → ordered replay → output root 검증</strong> 순서로 추적합니다.</p>
        <p><Link to="/blockchain/prysm-beacon-state">BeaconState 글</Link>이 state value·Copy-on-Write·SSZ root를 소유하고, <Link to="/blockchain/prysm-block-processing">block processing 글</Link>이 한 block transition을 소유합니다. 여기서는 그 정본을 재사용해 여러 조회 사이에서 state를 어떻게 찾고 복사하고 재구성하며 보존할지를 다룹니다.</p>
      </div>
      <ContentBoundary article="prysm-state-cache" />
      <PrysmDataApiViz mode="state-cache" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Slot만으로는 cache key가 충분하지 않습니다</h3>
        <p>Slot 96에 branch A의 state root <code>0xaa</code>와 branch B의 <code>0xbb</code>가 동시에 존재할 수 있습니다. 따라서 조회 receipt에는 최소한 target root, slot, active fork/schema와 cache generation이 필요합니다. Generation은 reorg·fork upgrade·schema migration 뒤 예전 entry를 새 해석으로 재사용하지 않게 합니다.</p>
        <p>Root가 맞아도 그 state가 현재 head나 finalized라는 뜻은 아닙니다. Cache hit는 “이 key로 저장한 value를 찾았다”는 evidence일 뿐이며 canonical·finalized 판단은 fork choice와 Casper FFG가 따로 소유합니다.</p>
        <h3>Lookup은 네 갈래지만 결과 계약은 하나입니다</h3>
        <ol>
          <li>Target root·slot·fork/schema와 consistency requirement를 먼저 고정합니다.</li>
          <li>Hot cache에서 같은 generation entry를 찾고, 없으면 DB의 직접 저장 state를 확인합니다.</li>
          <li>직접 state가 없다면 summary로 predecessor anchor와 같은 branch의 block 구간을 찾습니다.</li>
          <li>빈 slot과 block transition을 순서대로 적용한 candidate의 slot·SSZ root를 target과 비교한 뒤에만 반환하거나 cache에 승격합니다.</li>
        </ol>
        <p>Cache hit·DB hit·replay success는 source만 다를 뿐 반환 계약은 같습니다. Caller는 독립적으로 사용할 수 있는 state view, resolved identity와 source·generation·anchor·transition count·output root receipt를 받아야 합니다.</p>
      </div>
      <div id="paper-prysm-stategen-source" className="scroll-mt-24">
        <CitationBlock source="OffchainLabs/prysm — beacon-chain/state/stategen" href="https://github.com/OffchainLabs/prysm/tree/develop/beacon-chain/state/stategen" citeKey={1} type="code">
          Sparse stored state에서 target state를 재구성하는 실제 lookup·summary·replay seam입니다. Moving develop의 함수명·cache size·latency를 모든 배포에 일반화하지 않으며, 배포 검증에서는 Prysm SHA·DB schema·fork·network preset을 함께 고정합니다.
        </CitationBlock>
      </div>
      <div id="paper-consensus-state-transition" className="scroll-mt-24">
        <CitationBlock source="Ethereum Consensus Specifications — state transition" href="https://ethereum.github.io/consensus-specs/" citeKey={2}>
          같은 pre-state와 slot/block input에서 같은 post-state와 root를 계산할 protocol 전제를 제공합니다. Prysm cache·DB layout·retention이나 어떤 branch가 canonical인지까지 정하지는 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
