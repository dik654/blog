import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import type { CodeRef } from "@/components/code/types";
import { CitationBlock } from "@/components/ui/citation";
import { CodeViewButton } from "@/components/code";
import HeliosContractViz from "../helios-contract-viz";
import { codeRefsReal } from "./codeRefsReal";

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

const HELIOS_SHA = "43a8c9f3cdda41a6f383c4db41d9a83f102638b1";
const SPEC_SHA = "2359a5e3444635ee2fc2acdea8a759e16391af90";

export default function Overview({ onCodeRef }: Props) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Helios 타입은 untrusted bytes를 검증된 실행 상태 view로 바꾸는 계약이다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          타입 이름을 외우기 전에 한 요청을 끝까지 따라가 보겠습니다. Slot 8,192의 light-client update가 도착하면 Helios는 fork에 맞는
          SSZ schema로 bytes를 읽고, sync committee signature와 Merkle branch를 검증한 뒤, beacon header에 결속된 execution payload
          header의 state root를 얻습니다. 그 root가 이후 account·storage proof를 확인할 실행 상태의 기준입니다.
        </p>
        <p>
          여기서 <code>BeaconBlockHeader.state_root</code>는 BeaconState root이며 EVM account trie root가 아닙니다. 실행 상태 root는
          fork별 <code>LightClientHeader.execution</code>에서 가져옵니다. 이 두 root를 같은 “state root”라고 뭉뚱그리면 합의 상태와 실행
          상태를 잘못 연결하게 됩니다.
        </p>
        <div className="not-prose my-4">
          <CodeViewButton
            label="BeaconBlockHeader · LightClientHeader"
            onClick={() => onCodeRef?.("helios-header-root", codeRefsReal["helios-header-root"])}
          />
        </div>
        <p>
          SSZ의 공통 원리는 <Link to="/blockchain/prysm-ssz">SSZ 정본</Link>, sync committee의 선발·서명 역할은
          <Link to="/blockchain/prysm-sync-committee"> Sync Committee 정본</Link>을 재사용합니다. 이 글은 그 규칙이 Helios의
          <strong> fork별 Rust type과 update→store transition</strong>에 어떻게 배치되는지만 소유합니다.
        </p>
      </div>
      <ContentBoundary article="helios-types" />
      <HeliosContractViz mode="type-boundary" />

      <div id="paper-helios-types-source" className="scroll-mt-24">
        <CitationBlock
          source="a16z/helios consensus types · pinned source"
          href={`https://github.com/a16z/helios/blob/${HELIOS_SHA}/ethereum/consensus-core/src/types/mod.rs`}
          citeKey={1}
          type="code"
        >
          문제: fork마다 달라지는 light-client wire type을 실제 Rust 구조와 연결합니다. 기여: Header·Update·Store·SyncAggregate의 field와
          Base/Electra·Bellatrix/Capella/Deneb/Electra variant를 보여 줍니다. 전제: commit {HELIOS_SHA.slice(0, 8)}와 build feature를
          고정합니다. 근거 범위: 이 snapshot의 type layout입니다. 비주장: moving master의 field·지원 fork나 runtime 검증 전체를 보장하지
          않습니다.
        </CitationBlock>
      </div>
      <div id="paper-ethereum-light-client-types" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus specs · light-client sync protocol"
          href={`https://github.com/ethereum/consensus-specs/blob/${SPEC_SHA}/specs/altair/light-client/sync-protocol.md`}
          citeKey={2}
        >
          문제: full BeaconState 없이 recent head·finality·committee를 검증합니다. 기여: LightClientHeader·Update·Store와 validation/apply
          절차를 규정합니다. 전제: commit {SPEC_SHA.slice(0, 8)}, active fork와 preset을 고정합니다. 근거 범위: protocol semantics입니다.
          비주장: Helios의 Rust memory layout·cache·성능을 규정하지 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-ethereum-ssz-types" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum consensus specs · Simple Serialize"
          href={`https://github.com/ethereum/consensus-specs/blob/${SPEC_SHA}/ssz/simple-serialize.md`}
          citeKey={3}
        >
          문제: consensus object를 canonical bytes와 Merkle root로 함께 표현합니다. 기여: fixed/variable layout, list limit,
          serialization·hash-tree-root 규칙을 제공합니다. 전제: 정확한 schema와 preset을 알고 있어야 합니다. 근거 범위: SSZ 형식과 root
          계산입니다. 비주장: BLS signature·light-client branch 자체의 유효성을 대신하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
