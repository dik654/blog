import ExplainedFormula from "@/components/ui/explained-formula";
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
      <h2 className="mb-6 text-2xl font-bold">B41의 Header hash가 BlockID HB41이 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          B41은 Header·Data·Evidence·LastCommit으로 구성됩니다. DataHash가 달라지면 Header hash HB41도 달라집니다.
          LastCommitHash는 직전 높이의 결정 증거를, AppHash와 LastResultsHash는 직전 block의 application 실행 결과를
          가리킵니다. 아직 실행하지 않은 B41의 결과는 B41 Header에 미리 담을 수 없습니다.
        </p>
      </div>
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="실제 Block · Header 필드" onClick={() => onCodeRef("block-header-struct", codeRefs["block-header-struct"])} />
      </div>
      <ExplainedFormula
        question="B41의 여러 필드를 하나의 BlockID로 어떻게 묶을까요?"
        idea={<>각 field를 release가 정한 canonical encoding으로 바꾸고, field 순서를 보존한 Merkle commitment를 계산합니다. 같은 의미처럼 보여도 encoding·순서·version이 다르면 다른 identity입니다.</>}
        formula={String.raw`C_H=\operatorname{MerkleRoot}\!\left(E(f_{1:m})\right)`}
        annotatedFormula={String.raw`C_H=\underbrace{\operatorname{MerkleRoot}}_{\text{순서 보존 commitment}}\!\left(\underbrace{E(f_{1:m})}_{\text{field별 canonical encoding}}\right)`}
        operations={[
          { expression: String.raw`E(f_{1:m})`, annotation: ["header field m개를 release가 정한","canonical encoding으로 바꿉니다","version이 다르면 다른 bytes가 됩니다"] },
          { expression: String.raw`\operatorname{MerkleRoot}`, annotation: ["encoded field를 순서대로 Merkle tree에","넣어 짧은 block identity를 만듭니다","한 bit만 달라도 C_H가 바뀝니다"] },
        ]}
        terms={[
          { symbol: "f_i", name: "Header field", description: "Version·ChainID·Height와 각 commitment field입니다." },
          { symbol: "E", name: "Canonical encoding", description: "선택한 release schema의 field encoding입니다." },
          { symbol: "C_H", name: "Header commitment", description: "Header hash로 사용되는 Merkle commitment입니다." },
        ]}
        assumptions={["Field order와 encoding rule이 모든 verifier에서 동일합니다.", "Hash collision resistance와 Merkle construction의 domain separation을 가정합니다.", "Commitment는 payload 의미의 유효성이 아니라 같은 bytes에 묶였음을 증명합니다."]}
        interpretation="B41의 한 field가 달라지면 HB41도 달라집니다. 따라서 HB41에 한 precommit을 다른 payload의 결정 증거로 바꿔 끼우기 어렵습니다. 다만 AppHash가 application 규칙에 맞는지는 별도 실행·검증 대상입니다."
      />
      <div className="not-prose my-4 flex flex-wrap gap-3">
        <CodeViewButton label="실제 Header.Hash()" onClick={() => onCodeRef("header-hash", codeRefs["header-hash"])} />
        <CodeViewButton label="실제 Data.Hash()" onClick={() => onCodeRef("data-hash", codeRefs["data-hash"])} />
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
        <CodeViewButton label="실제 MakePartSet()" onClick={() => onCodeRef("make-partset", codeRefs["make-partset"])} />
      </div>
    </section>
  );
}
