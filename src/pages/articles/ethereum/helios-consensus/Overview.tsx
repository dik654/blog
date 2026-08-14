import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import HeliosTrustPathViz from "../helios-trust-path-viz";

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Overview({ onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Sync committee 검증은 “누가 어느 header에 동의했는가”를 작은 상태로 확인한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Helios는 모든 validator와 BeaconState를 들고 있지 않습니다. 대신 trusted state에 commitment된 sync committee public keys,
          update의 512-position participation bits와 한 aggregate signature를 사용해 attested header를 검증합니다. 여기서 512는 mainnet
          preset의 <em>position 수</em>이며 한 validator가 중복 선택될 수 있으므로 항상 512명의 서로 다른 사람을 뜻하지 않습니다.
        </p>
        <p>
          고정 사례로 committee position 512개 중 342개 bit가 켜진 update를 보겠습니다. 이 글은 bit→public key 결속, signing root와
          BLS, 2/3 supermajority, current/next committee handoff, store 적용을 순서대로 추적합니다. BLS pairing의 수학 정본은{" "}
          <Link to="/blockchain/prysm-bls">BLS</Link>, committee 선출과 duplicate position은{" "}
          <Link to="/blockchain/prysm-sync-committee">sync committee</Link> 글을 재사용합니다.
        </p>
      </div>
      <ContentBoundary article="helios-consensus" />
      <HeliosTrustPathViz mode="consensus" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Signature valid와 update adopted는 다른 판정입니다</h3>
        <p>
          Aggregate signature가 맞아도 signature slot이 미래이거나 committee period가 store와 연결되지 않거나 finality/next-committee
          Merkle branch가 틀리면 update를 적용할 수 없습니다. 반대로 valid update라도 participation과 relevance에 따라 optimistic header만
          전진하거나 best-valid 후보로 보관될 수 있습니다. “BLS 한 번 검증하면 block이 finalized된다”는 요약은 이 상태 기계를 지웁니다.
        </p>
      </div>
    </section>
  );
}
