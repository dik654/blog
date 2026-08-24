import ExplainedFormula from "@/components/ui/explained-formula";
import CometBFTCoreViz from "../cometbft-core-viz";
import { CodeViewButton } from "@/components/code";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function BlockHeader({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="block-header" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Header는 현재 payload와 이전 실행 결과를 한 block identity에 묶는다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Block은 Header·Data·Evidence·LastCommit으로 구성됩니다. Data의 transaction bytes는 CometBFT가 의미를
          해석하지 않지만, DataHash가 달라지면 header hash도 달라집니다. LastCommit은 이전 높이의 결정 증거이고,
          AppHash와 LastResultsHash도 이전 block을 application에 적용한 결과를 가리킵니다. 즉 한 header는 현재
          제안 내용과 직전 상태 전이의 영수증을 함께 잇습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="Block struct" onClick={() => onCodeRef("block-struct", codeRefs["block-struct"])} />
        <CodeViewButton label="Header struct" onClick={() => onCodeRef("header-struct", codeRefs["header-struct"])} />
      </div>
      <CometBFTCoreViz mode="block" />
      <ExplainedFormula
        question="여러 하위 객체를 하나의 짧은 block identity에 어떻게 묶을까요?"
        idea={<>각 field를 release가 정한 canonical encoding으로 바꾸고, field 순서를 보존한 Merkle commitment를 계산합니다. 같은 의미처럼 보여도 encoding·순서·version이 다르면 다른 identity입니다.</>}
        formula={String.raw`C_H=\operatorname{MerkleRoot}\!\left(E(f_{1:m})\right)`}
        annotatedFormula={String.raw`C_H=\underbrace{\operatorname{MerkleRoot}\!\left(E(f_{1:m})\right)}_{\text{허용 경계 판정}}`}
        operations={[
          { expression: String.raw`\operatorname{MerkleRoot}\!\left(E(f_{1:m})\right)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","각 field를 release가 정한 canonical","encoding으로 바꾸고, field 순서를 보존한","Merkle commitment를 계산합니다."] },
        ]}
        terms={[
          { symbol: "f_i", name: "Header field", description: "Version·ChainID·Height와 각 commitment field입니다." },
          { symbol: "E", name: "Canonical encoding", description: "선택한 release schema의 field encoding입니다." },
          { symbol: "C_H", name: "Header commitment", description: "Header hash로 사용되는 Merkle commitment입니다." },
        ]}
        assumptions={["Field order와 encoding rule이 모든 verifier에서 동일합니다.", "Hash collision resistance와 Merkle construction의 domain separation을 가정합니다.", "Commitment는 payload 의미의 유효성이 아니라 같은 bytes에 묶였음을 증명합니다."]}
        interpretation="한 field의 한 bit만 달라도 C_H가 바뀌므로 vote의 BlockID와 다른 payload를 바꿔 끼우기 어렵습니다. 그러나 AppHash의 application 의미는 application proof와 별도로 검증해야 합니다."
      />
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="Header.Hash()" onClick={() => onCodeRef("header-hash", codeRefs["header-hash"])} />
        <CodeViewButton label="Data.Hash()" onClick={() => onCodeRef("data-hash", codeRefs["data-hash"])} />
        <CodeViewButton label="Tx.Hash() · Txs.Hash()" onClick={() => onCodeRef("tx-hash", codeRefs["tx-hash"])} />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 AppHash는 한 높이 늦게 보일까요?</h3>
        <p>
          Height <code>h</code>의 header는 proposal 전에 만들어져야 하므로 block <code>h</code> 실행 결과를 미리 담을
          수 없습니다. 따라서 header의 AppHash·LastResultsHash는 이전 block을 적용한 receipt이고, block
          <code>h</code>의 FinalizeBlock 결과는 다음 header에 연결됩니다. 장애 조사에서 “header h의 AppHash”를
          “block h 실행 뒤 state”로 읽으면 off-by-one 판단을 하게 됩니다.
        </p>
        <h3>검증 순서는 hash 재계산만으로 끝나지 않습니다</h3>
        <p>
          Verifier는 chain ID·height 증가·last BlockID, 당시 validator와 next-validator commitment, consensus
          parameters, block time, LastCommit, evidence를 local state와 대조합니다. Hash가 맞아도 잘못된 높이·chain의
          객체이거나 유효 기간이 지난 evidence라면 block은 유효하지 않습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="MakePartSet()" onClick={() => onCodeRef("make-partset", codeRefs["make-partset"])} />
      </div>
    </section>
  );
}
