import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import type { CodeRef } from "@/components/code/types";
import ValidatorDutyTraceViz from "./viz/ValidatorDutyTraceViz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 break-keep text-2xl font-bold">
        Validator client는 정해진 시각에 안전한 한 표만 내보내는 실행기입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          <strong>
            Beacon node가 “무엇에 투표할지”를 준비하면, validator client는 “내가
            언제 어떤 key로 서명하고 내보낼지”를 책임집니다.
          </strong>{" "}
          Keymanager는 signature를 만들고, slashing-protection DB는 그 signature를
          network에 내보내도 되는지 판단할 근거를 기록합니다.
        </p>
        <p>
          Validator <strong>V37</strong>이 slot 100의 attester라고 하겠습니다.
          Slot이 시작됐다고 바로 서명하지는 않습니다. 현재 slot의 유효한 block을
          보거나 due time이 될 때까지 기다린 뒤, head root R100과 source·target
          checkpoint를 attestation data로 고정합니다. Attester domain까지 묶은
          signing root <strong>RA</strong>를 만듭니다.
        </p>
        <p>
          RA를 keymanager에 넘기면 BLS signature <strong>σA</strong>를
          돌려받습니다. 이 시점에는 아직 local slashing history를 통과하지
          않았습니다.
        </p>
        <p>
          여기서 중요한 반전이 있습니다. <strong>Prysm v7.3.1의 실제 attestation
          경로는 local slashing DB를 먼저 확인하고 서명하지 않습니다.</strong>{" "}
          먼저 σA를 만들고, 그 다음 DB가 같은 target epoch의 다른 vote나 surround
          vote인지 검사합니다. 안전하면 history를 저장한 뒤 beacon node로
          제출합니다.
        </p>
        <p>
          즉 이 local gate는 현재 구현에서 <em>pre-sign</em>이 아니라
          <em>post-sign, pre-submit</em> 경계입니다.
        </p>
      </div>

      <ContentBoundary article="prysm-validator-client" />
      <ValidatorDutyTraceViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>왜 역할을 네 조각으로 나눠 봐야 할까요?</h3>
        <p>
          <strong>Duty store</strong>는 V37이 slot 100에 어떤 역할을 맡았는지
          보관합니다. <strong>Runner</strong>는 slot clock과 deadline을 만들고 그
          역할을 실행합니다. <strong>Keymanager</strong>는 public key에 맞는
          secret을 찾아 signing root에 서명합니다. <strong>Slashing DB</strong>는
          과거 proposal·attestation history와 새 root를 비교하고 안전한 기록만
          남깁니다.
        </p>
        <p>
          네 역할을 “validator가 알아서 안전하게 서명한다”로 뭉치면 중요한 질문이
          사라집니다. 누가 data를 만들었는지, 어느 시점에 signature가 생겼는지,
          어느 DB가 같은 key의 전체 history를 알고 있는지 구분할 수 없기
          때문입니다.
        </p>
        <p>
          Attestation의 head·source·target 의미는{" "}
          <Link to="/cs/blockchain/prysm-attestation">attestation lifecycle</Link>,
          domain과 signing root는 <Link to="/cs/blockchain/prysm-bls">BLS</Link>,
          duty가 참조하는 head는 <Link to="/cs/blockchain/prysm-forkchoice">fork
          choice</Link> 글에서 더 깊게 이어집니다. 이 글은 그 결과가 한 validator
          process에서 서명·기록·제출되는 경계에 집중합니다.
        </p>
      </div>

      <div id="paper-ethereum-validator-spec" className="scroll-mt-24">
        <CitationBlock
          source="Ethereum Consensus Specifications v1.7.0-beta.4 @ aa16bb4c — Honest Validator"
          href="https://github.com/ethereum/consensus-specs/blob/aa16bb4c156184e9548a997d53efaf2a228a6304/specs/phase0/validator.md"
          citeKey={1}
        >
          Validator duty, attestation observation timing과 proposer·attester slashing을
          피하기 위한 기록 순서의 protocol 기준입니다. Client 내부 함수 배치나 DB
          backend까지 정하는 문서는 아닙니다.
        </CitationBlock>
      </div>
      <div id="paper-eip3076" className="scroll-mt-24">
        <CitationBlock
          source="EIP-3076 — Slashing Protection Interchange Format"
          href="https://eips.ethereum.org/EIPS/eip-3076"
          citeKey={2}
        >
          Validator key를 client 사이에 옮길 때 signed block과 attestation history를
          교환하는 공통 JSON 형식입니다. Import 성공이 이전 signer의 중지나
          active-active 차단까지 증명하지는 않습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-validator-source" className="scroll-mt-24">
        <CitationBlock
          source="OffchainLabs Prysm v7.3.1 @ 96d418cd — validator client, keymanager and slashing DB"
          href="https://github.com/OffchainLabs/prysm/tree/96d418cd964b083e37519a9df274030a1beac7db/validator"
          citeKey={3}
          type="code"
        >
          Slot runner, attestation signing, local·Web3Signer keymanager와 complete
          BoltDB slashing-protection 경로의 실제 호출 순서를 이 snapshot에서
          확인했습니다. Moving master나 다른 backend도 같은 순서라고 일반화하지
          않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
