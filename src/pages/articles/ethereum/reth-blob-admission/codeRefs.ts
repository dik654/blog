import type { CodeRef } from "@/components/code/types";
import validationPath from "./codebase/reth-v2.8.1/validation-path.rs?raw";
import stateless from "./codebase/reth-v2.8.1/stateless.rs?raw";
import blobValidation from "./codebase/reth-v2.8.1/blob-validation.rs?raw";
import outcomes from "./codebase/reth-v2.8.1/outcomes.rs?raw";
import poolInsertion from "./codebase/reth-v2.8.1/pool-insertion.rs?raw";

export const codeRefs: Record<string, CodeRef> = {
  "validation-path": {
    path: "reth-v2.8.1/transaction-pool/validate/eth.rs · L401–435, L661–730",
    code: validationPath,
    lang: "rust",
    highlight: [14, 104],
    desc: "문제: 값싼 입력 오류, 현재 account 규칙, 비싼 Blob 검증을 한 단계처럼 실행하면 실패 원인과 비용이 섞입니다.\n\n해결: validate_one_with_provider가 stateless를 먼저 끝내고, 통과한 경우에만 state provider를 얻어 stateful path로 내려갑니다.",
    annotations: [
      { lines: [14, 18], color: "sky", note: "State 조회 전 stateless 검사" },
      { lines: [20, 35], color: "amber", note: "Provider 실패는 Invalid가 아니라 Error" },
      { lines: [61, 88], color: "emerald", note: "Account · nonce · balance를 같은 state에서 확인" },
      { lines: [90, 104], color: "violet", note: "Blob 검증 뒤 Valid outcome 구성" },
    ],
  },
  stateless: {
    path: "reth-v2.8.1/transaction-pool/validate/eth.rs · L452–658",
    code: stateless,
    lang: "rust",
    highlight: [8, 70],
    desc: "문제: 활성 fork, 크기, gas·fee, chain id, intrinsic gas와 Blob 개수가 틀린 요청에 account 조회와 KZG 비용을 쓰면 안 됩니다.\n\n해결: transaction 자체와 설정만으로 판단할 수 있는 조건을 먼저 검사하고 정확한 Invalid reason을 반환합니다.",
    annotations: [
      { lines: [8, 18], color: "sky", note: "활성화되지 않은 transaction type 차단" },
      { lines: [20, 32], color: "emerald", note: "Blob 원문이 아닌 transaction 동적 영역의 크기 제한" },
      { lines: [34, 35], color: "amber", note: "원본의 gas·fee·chain id·intrinsic gas 검사 구간" },
      { lines: [38, 67], color: "violet", note: "Cancun과 fork별 Blob 개수 검사" },
    ],
  },
  "blob-validation": {
    path: "reth-v2.8.1/transaction-pool/validate/eth.rs · L806–880",
    code: blobValidation,
    lang: "rust",
    highlight: [8, 43],
    desc: "문제: 새 제출의 sidecar, reorg로 sidecar가 빠진 transaction, 내부적으로 불가능한 상태를 같은 실패로 다루면 복구 경계가 사라집니다.\n\n해결: None·Missing·Present를 분리하고 Present만 version과 transaction binding·KZG proof를 검증합니다.",
    annotations: [
      { lines: [10, 17], color: "sky", note: "None은 지원할 수 없는 내부 상태" },
      { lines: [18, 29], color: "amber", note: "Missing은 BlobStore에 기존 검증 결과가 있어야 통과" },
      { lines: [30, 42], color: "emerald", note: "Present는 fork별 version과 Blob 검증을 실행" },
    ],
  },
  outcomes: {
    path: "reth-v2.8.1/transaction-pool/validate/mod.rs · L27–55, L99–132",
    code: outcomes,
    lang: "rust",
    highlight: [4, 39],
    desc: "문제: 입력 위반과 state provider 장애, 검증 성공을 bool 하나로 줄이면 retry와 peer 처리 정책을 구분할 수 없습니다.\n\n해결: TransactionValidationOutcome을 Valid·Invalid·Error로 나누고 새 Blob 제출의 Valid에는 sidecar를 함께 실어 보냅니다.",
    annotations: [
      { lines: [6, 14], color: "emerald", note: "현재 head에서 유효한 후보와 필요한 state metadata" },
      { lines: [15, 18], color: "amber", note: "입력 위반 Invalid와 의존성 실패 Error의 분리" },
      { lines: [21, 39], color: "violet", note: "새 Blob 제출만 ValidWithSidecar로 전달" },
    ],
  },
  "pool-insertion": {
    path: "reth-v2.8.1/transaction-pool/pool/mod.rs · L585–753",
    code: poolInsertion,
    lang: "rust",
    highlight: [5, 60],
    desc: "문제: Validator의 Valid를 최종 pool 수용과 혼동하면 replacement·capacity eviction과 sidecar 저장 시점을 설명할 수 없습니다.\n\n해결: Valid 뒤 pool.add_transaction을 별도로 실행합니다. Batch capacity를 판정하고 write lock을 놓은 뒤 새 삽입 metadata의 sidecar를 저장하며, 탈락한 후보의 Blob은 이어서 정리합니다.",
    annotations: [
      { lines: [15, 24], color: "sky", note: "Validated transaction과 sidecar를 insertion 전에 분리" },
      { lines: [26, 34], color: "emerald", note: "Pool 규칙이 별도로 insertion 성공을 결정" },
      { lines: [46, 53], color: "amber", note: "Batch 뒤 capacity를 넘으면 discard_worst 실행" },
      { lines: [55, 62], color: "violet", note: "Lock 해제 뒤 sidecar 저장과 알림" },
    ],
  },
};
