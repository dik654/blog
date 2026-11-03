import type { CodeRef } from "@/components/code/types";

import aggregateFixtureRs from "./codebase/current/aggregate_fixture.rs?raw";
import aggregateRelationRs from "./codebase/current/aggregate_relation.rs?raw";
import commitmentTraitRs from "./codebase/current/commitment_trait.rs?raw";
import proofShapeRs from "./codebase/current/proof_shape.rs?raw";
import proverSumcheckOpeningRs from "./codebase/current/prover_sumcheck_opening.rs?raw";
import proverTranscriptRs from "./codebase/current/prover_transcript.rs?raw";
import verifiableQueryResultRs from "./codebase/current/verifiable_query_result.rs?raw";
import verifierChecksRs from "./codebase/current/verifier_checks.rs?raw";
import verifierTranscriptRs from "./codebase/current/verifier_transcript.rs?raw";

const commit = "f28544df71c1afd04e4675ee4e798fa2a5f82551";

export const codeRefs: Record<string, CodeRef> = {
  "posql-aggregate-fixture": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof_plans/aggregate_exec_test.rs · lines 19–52",
    code: aggregateFixtureRs,
    lang: "rust",
    highlight: [4, 8],
    desc: `공식 ${commit.slice(0, 8)} 집계 test의 다섯 행과 기대 결과입니다. b=99인 네 행의 c 합은 410이고 COUNT(*)는 4입니다.`,
    annotations: [
      { lines: [4, 8], color: "sky", note: "a·b·c의 5행 fixture" },
      { lines: [12, 26], color: "amber", note: "b=99 filter와 SUM(c)·COUNT(*) proof plan" },
      { lines: [27, 34], color: "emerald", note: "proof 생성·검증 뒤 410과 4를 확인" },
    ],
  },
  "posql-result-api": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/verifiable_query_result.rs · lines 65–121",
    code: verifiableQueryResultRs,
    lang: "rust",
    highlight: [5, 11],
    desc: "외부 API가 반환 결과와 QueryProof를 한 객체로 묶고, 검증 때 같은 proof plan·commitment accessor·setup·params를 다시 요구하는 경계입니다.",
    annotations: [
      { lines: [5, 11], color: "sky", note: "반환 table과 proof는 서로 다른 필드" },
      { lines: [18, 31], color: "emerald", note: "new가 query 실행과 proof 생성을 함께 수행" },
      { lines: [40, 57], color: "amber", note: "verify는 외부 expr·commitments·setup을 다시 받음" },
    ],
  },
  "posql-proof-shape": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/query_proof.rs · lines 70–112",
    code: proofShapeRs,
    lang: "rust",
    highlight: [23, 31],
    desc: "QueryProof의 실제 필드입니다. 두 round message, sumcheck proof, 세 종류의 MLE 평가값, 선택된 commitment scheme의 evaluation proof가 들어갑니다.",
    annotations: [
      { lines: [1, 15], color: "sky", note: "final round metadata와 first/column/final 평가값" },
      { lines: [23, 31], color: "emerald", note: "QueryProof의 직렬화 필드" },
      { lines: [31, 31], color: "amber", note: "evaluation_proof는 Dory 고정이 아니라 generic CP" },
    ],
  },
  "posql-prover-transcript": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/query_proof.rs · lines 145–230",
    code: proverTranscriptRs,
    lang: "rust",
    highlight: [7, 37],
    desc: "Prover transcript가 setup hash, 직렬화된 proof plan, 반환 결과, 표 길이, 참조 열 commitment, 시작 행, round message를 순서대로 흡수하는 원문입니다.",
    annotations: [
      { lines: [7, 15], color: "sky", note: "setup·plan·result를 먼저 흡수" },
      { lines: [17, 37], color: "emerald", note: "표 길이와 참조 열 commitment·min row를 흡수" },
      { lines: [39, 56], color: "amber", note: "first round message 뒤 post-result challenge 생성" },
      { lines: [68, 86], color: "violet", note: "final round message를 고정한 뒤 sumcheck random scalars 생성" },
    ],
  },
  "posql-prover-sumcheck": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/query_proof.rs · lines 231–323",
    code: proverSumcheckOpeningRs,
    lang: "rust",
    highlight: [2, 12],
    desc: "Sumcheck가 임의점 하나를 만들고, 그 점에서 필요한 MLE 평가를 계산한 뒤 모두 한 random linear combination으로 접어 generic evaluation proof를 만드는 경로입니다.",
    annotations: [
      { lines: [2, 12], color: "sky", note: "sumcheck state에서 임의 evaluation point 생성" },
      { lines: [14, 40], color: "emerald", note: "first/column/final MLE를 같은 점에서 평가" },
      { lines: [42, 57], color: "amber", note: "평가값을 transcript에 넣고 folding 계수 추출" },
      { lines: [68, 84], color: "violet", note: "모든 MLE를 하나로 접어 CP::new 호출" },
    ],
  },
  "posql-verifier-transcript": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/query_proof.rs · lines 329–424",
    code: verifierTranscriptRs,
    lang: "rust",
    highlight: [27, 56],
    desc: "Verifier가 자신이 받은 proof plan·result·commitments를 같은 순서로 transcript에 넣고 sumcheck의 임의점을 다시 만드는 경로입니다.",
    annotations: [
      { lines: [10, 23], color: "amber", note: "bit distribution을 challenge 생성 전에 검증" },
      { lines: [27, 56], color: "sky", note: "prover와 같은 setup·plan·result·length·commitment 순서" },
      { lines: [58, 82], color: "emerald", note: "round message에서 같은 random scalars 재생" },
      { lines: [84, 96], color: "violet", note: "sumcheck를 evaluation 직전까지 확인" },
    ],
  },
  "posql-verifier-checks": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof/query_proof.rs · lines 437–550",
    code: verifierChecksRs,
    lang: "rust",
    highlight: [62, 101],
    desc: "Proof plan을 임의점에서 다시 평가해 반환 result와 sumcheck claim을 대조하고, 마지막으로 commitment evaluation proof를 확인하는 실제 검증 순서입니다.",
    annotations: [
      { lines: [1, 43], color: "sky", note: "표 길이 chi와 verification builder 재구성" },
      { lines: [62, 73], color: "emerald", note: "proof plan 평가와 반환 result 평가가 일치해야 함" },
      { lines: [75, 80], color: "amber", note: "재구성한 sumcheck evaluation 대조" },
      { lines: [91, 108], color: "violet", note: "모든 commitment evaluation을 한 batch proof로 확인" },
    ],
  },
  "posql-aggregate-relation": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/sql/proof_plans/aggregate_exec.rs · lines 473–509",
    code: aggregateRelationRs,
    lang: "rust",
    highlight: [19, 37],
    desc: "실제 aggregate 구현은 설명용 Σsᵢcᵢ를 그대로 한 줄 쓰지 않고, 입력·출력 aggregate 열을 beta로 접어 ZeroSum 관계 하나로 등록합니다.",
    annotations: [
      { lines: [1, 15], color: "sky", note: "SUM 결과와 COUNT 결과를 반환 table로 구성" },
      { lines: [17, 19], color: "amber", note: "출력 aggregate 열을 beta로 folding" },
      { lines: [21, 37], color: "emerald", note: "입력 쪽과 출력 쪽 차이가 전체 합 0이 되도록 등록" },
    ],
  },
  "posql-commitment-trait": {
    path: "sxt-proof-of-sql/crates/proof-of-sql/src/base/commitment/commitment_evaluation_proof.rs · lines 1–73",
    code: commitmentTraitRs,
    lang: "rust",
    highlight: [5, 20],
    desc: "현재 QueryProof가 특정 Dory 구조에 고정되지 않고 commitment·prover/verifier setup·evaluation proof를 associated type으로 받는 추상화입니다.",
    annotations: [
      { lines: [5, 20], color: "sky", note: "scalar·commitment·setup을 구현체가 선택" },
      { lines: [27, 34], color: "emerald", note: "임의점 평가 proof 생성 계약" },
      { lines: [42, 58], color: "amber", note: "단일 opening도 batch 검증으로 위임" },
      { lines: [61, 73], color: "violet", note: "여러 commitments와 evaluations를 한 번에 확인" },
    ],
  },
};
