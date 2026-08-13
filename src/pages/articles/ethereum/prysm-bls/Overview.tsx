import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import PrysmFoundationViz from "../prysm-foundation-viz";

export default function Overview({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        BLS 집계의 출발점은 압축이 아니라 누가 어떤 consensus object에
        서명했는지 고정하는 일이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum에서는 많은 validator가 같은 attestation data에 투표합니다.
          서명을 단순히 이어 붙이면 참여자 수만큼 byte가 늘지만 BLS signature는
          curve point 덧셈으로 여러 서명을 하나의 96-byte point에 모을 수
          있습니다. 다만 aggregate 하나만 보아서는 어떤 public key와 message가
          참여했는지 알 수 없으므로 그 입력 목록과 protocol domain이 검증 계약의
          일부입니다.
        </p>
        <p>
          이 글은 elliptic curve를 미리 안다고 가정하지 않고{" "}
          <strong>
            secret scalar→public point→signing root→signature point→pairing
            check→aggregation
          </strong>{" "}
          순서로 설명합니다. <Link to="/blockchain/prysm-ssz">SSZ 글</Link>이
          object root를 소유하고, 여기서는 그 root를 validator authorization으로
          바꾸는 경계만 소유합니다.
        </p>
      </div>

      <ContentBoundary article="prysm-bls" />
      <PrysmFoundationViz mode="bls" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>숫자에서 point까지</h3>
        <p>
          BLS12-381은 유한체 위에 정의된 두 elliptic-curve subgroup G1·G2와
          target group GT를 사용합니다. Secret key는 정해진 범위의 scalar이고
          public key는 G1의 generator에 그 scalar를 곱한 point입니다. Ethereum이
          사용하는 minimal-pubkey-size variant에서 compressed public key는 48
          bytes, G2 signature는 96 bytes입니다. 이 크기는 참여자 수와 무관하지만
          public-key 목록과 aggregation bits의 비용은 사라지지 않습니다.
        </p>
        <p>
          Pairing은 G1 point와 G2 point의 비밀 scalar 관계를 GT에서 비교할 수
          있게 하는 함수입니다. Verifier가 secret key를 몰라도 public key,
          hash-to-curve한 message, signature 사이 관계를 확인할 수 있습니다.
          “수학식이 맞는다” 전에 compressed point가 canonical이고 curve와 올바른
          subgroup에 있으며 identity point가 아닌지 검사해야 합니다.
        </p>
        <h3>두 종류의 domain separation을 구분합니다</h3>
        <p>
          Consensus domain은 object root에 domain type·fork version·genesis
          validators root를 묶어 “어느 chain의 어떤 duty”인지 정합니다. BLS
          ciphersuite의 domain separation tag(DST)는 hash-to-curve 입력을 다른
          ciphersuite와 섞지 않게 합니다. 이름은 비슷하지만 하나는 Ethereum
          protocol object를, 다른 하나는 cryptographic encoding suite를
          분리합니다.
        </p>
      </div>

      <div id="paper-bls-draft" className="scroll-mt-24">
        <CitationBlock
          source="CFRG Internet-Draft — BLS Signatures, draft-06"
          href="https://datatracker.ietf.org/doc/draft-irtf-cfrg-bls-signature/06/"
          citeKey={1}
        >
          Draft는 CoreVerify·AggregateVerify·Proof-of-Possession과 key
          validation 전제를 정리합니다. 2025-11 공개된 Internet-Draft로 RFC가
          아니며 2026-05 만료 상태이므로 문서 revision을 고정하고 Ethereum
          ciphersuite 선택과 구분해 읽습니다.
        </CitationBlock>
      </div>
      <div id="paper-prysm-bls-source" className="scroll-mt-24">
        <CitationBlock
          {...OFFICIAL_SOURCES.prysm.repository}
          citeKey={2}
          type="code"
        >
          Prysm source와 고정된 BLST dependency는 Go wrapper·native
          validation·error propagation의 implementation 근거입니다. 특정 CPU의
          SIMD speedup이나 moving branch layout을 모든 deployment에 일반화하지
          않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
