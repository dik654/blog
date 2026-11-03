import type { CodeRef } from "@/components/code/types";

import fibAirRs from "./codebase/current/fib_air.rs?raw";
import fibConfigRs from "./codebase/current/fib_config.rs?raw";
import fibPublicMismatchRs from "./codebase/current/fib_public_mismatch.rs?raw";
import fibSuccessRs from "./codebase/current/fib_success.rs?raw";
import proofShapeRs from "./codebase/current/proof_shape.rs?raw";
import provePipelineRs from "./codebase/current/prove_pipeline.rs?raw";
import starkConfigRs from "./codebase/current/stark_config.rs?raw";
import verifyAirRs from "./codebase/current/verify_air.rs?raw";
import verifyTranscriptRs from "./codebase/current/verify_transcript.rs?raw";

const commit = "0d803737b681774186cd283b1fd2d8e493655c82";

export const codeRefs: Record<string, CodeRef> = {
  "p3-fib-air": {
    path: "Plonky3/uni-stark/tests/fib_air.rs · lines 26–93",
    code: fibAirRs,
    lang: "rust",
    highlight: [20, 48],
    desc: `공식 ${commit.slice(0, 8)} test의 Fibonacci AIR과 8행 trace 생성기입니다. 첫 행·인접 행·마지막 행을 서로 다른 selector로 묶습니다.`,
    annotations: [
      { lines: [3, 18], color: "sky", note: "폭 2, 공개값 3개, 최대 제약 차수 2" },
      { lines: [20, 48], color: "emerald", note: "첫 행·전이·마지막 행의 실제 AIR 제약" },
      { lines: [50, 68], color: "amber", note: "(0,1)에서 시작해 n행 recurrence trace 생성" },
    ],
  },
  "p3-fib-config": {
    path: "Plonky3/uni-stark/tests/fib_air.rs · lines 119–156",
    code: fibConfigRs,
    lang: "rust",
    highlight: [1, 12],
    desc: "BabyBear·Poseidon2·Merkle MMCS·4차 확장·challenger·DFT·FRI PCS가 한 MyConfig로 연결되는 공식 test profile입니다.",
    annotations: [
      { lines: [1, 12], color: "sky", note: "type alias가 field부터 PCS까지 한 조합을 고정" },
      { lines: [18, 25], color: "emerald", note: "같은 permutation에서 hash·compression·MMCS 구성" },
      { lines: [26, 38], color: "amber", note: "테스트용 FRI parameter와 최종 StarkConfig 생성" },
    ],
  },
  "p3-generic-config": {
    path: "Plonky3/uni-stark/src/config.rs · lines 35–63",
    code: starkConfigRs,
    lang: "rust",
    highlight: [1, 18],
    desc: "uni-stark가 요구하는 실제 generic config 경계입니다. PCS·extension challenge·challenger가 서로의 associated type을 공유합니다.",
    annotations: [
      { lines: [1, 11], color: "sky", note: "PCS가 domain과 base field를 결정" },
      { lines: [13, 18], color: "emerald", note: "challenge field와 transcript가 PCS commitment를 관찰" },
      { lines: [20, 29], color: "amber", note: "prover와 verifier가 동일 PCS·challenger를 꺼냄" },
    ],
  },
  "p3-prove-pipeline": {
    path: "Plonky3/uni-stark/src/prover.rs · lines 238–318",
    code: provePipelineRs,
    lang: "rust",
    highlight: [1, 6],
    desc: "trace를 PCS에 commit하고 AIR shape·공개값으로 transcript challenge α를 만든 뒤 quotient를 계산하는 실제 prover 경로입니다.",
    annotations: [
      { lines: [1, 6], color: "sky", note: "확장 trace를 PCS에 commit" },
      { lines: [13, 28], color: "emerald", note: "proof가 아니라 config와 AIR에서 transcript shape 구성" },
      { lines: [46, 50], color: "amber", note: "trace commitment와 공개값을 흡수해 α 추출" },
      { lines: [70, 81], color: "violet", note: "AIR 제약을 α로 합친 quotient 평가값 계산" },
    ],
  },
  "p3-proof-shape": {
    path: "Plonky3/uni-stark/src/proof.rs · lines 14–82",
    code: proofShapeRs,
    lang: "rust",
    highlight: [1, 13],
    desc: "직렬화되는 Proof의 실제 필드입니다. AIR 코드·공개값·config 식별자는 이 구조체에 들어 있지 않습니다.",
    annotations: [
      { lines: [1, 13], color: "sky", note: "commitments·opened values·PCS proof·degree·PoW witness" },
      { lines: [15, 39], color: "amber", note: "security 계산도 외부 StarkSecurityParams를 받음" },
      { lines: [41, 46], color: "emerald", note: "trace·quotient·선택적 ZK random commitment" },
      { lines: [52, 69], color: "violet", note: "ζ와 다음 점에서 연 trace와 quotient chunks" },
    ],
  },
  "p3-verify-transcript": {
    path: "Plonky3/uni-stark/src/verifier.rs · lines 766–835",
    code: verifyTranscriptRs,
    lang: "rust",
    highlight: [1, 27],
    desc: "verifier가 자신이 받은 config·AIR·공개값으로 transcript를 다시 만들고 PCS opening을 확인하는 경로입니다.",
    annotations: [
      { lines: [1, 17], color: "sky", note: "config와 AIR에서 verifier transcript shape 재구성" },
      { lines: [19, 27], color: "emerald", note: "commitment와 공개값에서 같은 α 재생" },
      { lines: [29, 38], color: "amber", note: "quotient commitment와 PoW에서 ζ 재생" },
      { lines: [58, 67], color: "violet", note: "PCS opening argument 검증" },
    ],
  },
  "p3-verify-air": {
    path: "Plonky3/uni-stark/src/verifier.rs · lines 839–878",
    code: verifyAirRs,
    lang: "rust",
    highlight: [23, 37],
    desc: "열린 quotient를 재조립한 뒤, verifier가 들고 있는 AIR을 열린 current·next row와 공개값에 적용하는 마지막 단계입니다.",
    annotations: [
      { lines: [1, 5], color: "sky", note: "quotient chunks를 ζ의 한 값으로 재조립" },
      { lines: [7, 21], color: "amber", note: "AIR이 요구한 next-row opening 준비" },
      { lines: [23, 37], color: "emerald", note: "AIR constraints와 quotient identity가 맞아야 성공" },
    ],
  },
  "p3-fib-success": {
    path: "Plonky3/uni-stark/tests/fib_air.rs · lines 418–426",
    code: fibSuccessRs,
    lang: "rust",
    highlight: [2, 9],
    desc: "같은 config·AIR·공개값으로 prove한 결과를 verify하는 공식 정상 경로입니다.",
    annotations: [
      { lines: [2, 5], color: "sky", note: "trace·config·public values를 별도로 준비" },
      { lines: [7, 8], color: "emerald", note: "proof 생성과 검증에 같은 외부 문맥 전달" },
    ],
  },
  "p3-public-mismatch": {
    path: "Plonky3/uni-stark/tests/fib_air.rs · lines 480–503",
    code: fibPublicMismatchRs,
    lang: "rust",
    highlight: [10, 23],
    desc: "공개값 3개가 필요한 AIR에 2개만 주면 구조화된 PublicValuesLengthMismatch로 거절되는 공식 negative test입니다.",
    annotations: [
      { lines: [1, 3], color: "sky", note: "8행·끝값 21의 정상 fixture" },
      { lines: [10, 14], color: "amber", note: "정상 proof에 짧은 공개값 배열을 대입" },
      { lines: [15, 23], color: "emerald", note: "expected 3, got 2 오류를 정확히 확인" },
    ],
  },
};
