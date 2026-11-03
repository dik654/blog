import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import SyncCommitteeLifecycleViz from "./viz/SyncCommitteeLifecycleViz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        한 sync 서명은 finality가 아니라, light client용 압축 재료입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            위원회 구성원 한 명의 서명은 “이 block root를 보았다”는 표입니다.
          </strong>{" "}
          같은 slot의 표를 subnet 안에서 먼저 합치고, 다음 block proposer가 네
          subcommittee 결과를 <em>SyncAggregate</em> 하나로 줄입니다.
        </p>
        <p>
          Light client는 그 aggregate만 믿지 않습니다. 미리 신뢰한 block root에서
          위원회가 나온 경로, 참여자 bits, 서명, finality와 다음 위원회 Merkle
          branch를 함께 검사한 뒤에야 헤더를 전진시킵니다.
        </p>
        <p>
          Slot 100에서 validator <strong>V37</strong>이 head root{" "}
          <strong>R100</strong>을 보았다고 하겠습니다. V37의 signature 하나가
          곧 R100의 finality는 아닙니다. 이 글은 그 한 표가{" "}
          <strong>
            member signature → subnet contribution → block 101의 SyncAggregate →
            light-client update
          </strong>
          로 바뀌는 동안 무엇이 새로 증명되고 무엇은 아직 증명되지 않는지
          따라갑니다.
        </p>
      </div>
      <ContentBoundary article="prysm-sync-committee" />
      <SyncCommitteeLifecycleViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 세 가지를 다른 물건으로 봅니다</h3>
        <p>
          <strong>SyncCommitteeMessage</strong>는 한 validator가 한 slot의 head
          root에 남긴 서명입니다.
        </p>
        <p>
          <strong>SyncCommitteeContribution</strong>은 같은 subnet·slot·root의
          messages를 local bitvector와 aggregate signature로 줄인 것입니다.
          <strong> SyncAggregate</strong>는 proposer가 subcommittee별 결과를
          512-position bitvector와 한 서명으로 합쳐 다음 block에 넣은 것입니다.
        </p>
        <p>
          Mainnet preset에서는 위원회에 <strong>512 positions</strong>가 있고,
          같은 구성이 <strong>256 epochs</strong> 동안 current committee로
          사용됩니다. 512는 고유 validator 수가 아닙니다.
        </p>
        <p>
          추출은 replacement를 허용하므로 같은 validator public key가 여러
          position에 들어갈 수 있습니다. Position과 validator identity를 섞으면
          bitvector와 aggregate public key가 어긋납니다.
        </p>
        <p>
          서명과 bitvector의 일반 원리는 <Link to="/cs/blockchain/prysm-bls">BLS</Link>,
          state root에 committee와 finalized header를 연결하는 원리는{" "}
          <Link to="/cs/blockchain/prysm-ssz">SSZ Merkle proof</Link>, chain의
          finality 자체는 <Link to="/cs/blockchain/prysm-finality">finality</Link>{" "}
          글에서 이어집니다. 여기서는 세 원리가 Prysm의 한 요청 경로에서 만나는
          지점에 집중합니다.
        </p>
      </div>

      <div id="paper-consensus-sync-committee-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications v1.7.0-beta.4 @ aa16bb4c — Altair validator·beacon-chain·light-client rules"
          citeKey={1}
          href="https://github.com/ethereum/consensus-specs/tree/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/altair"
        >
          위원회 message와 contribution, block의 SyncAggregate, light-client
          bootstrap·update·optimistic/finalized 갱신 규칙의 protocol 기준입니다.
          512 positions와 256 epochs는 mainnet preset 값이며 다른 preset에 그대로
          일반화하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-sync-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs Prysm v7.3.1 @ 96d418cd — sync-committee implementation"
          citeKey={2}
          type="code"
          href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db"
        >
          Validator signing, committee sampling, contribution selection, proposer
          aggregation과 block state-transition 검증의 실제 owner를 이 snapshot에서
          확인했습니다. Moving master나 다른 fork·network 설정도 같다고 주장하지
          않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
