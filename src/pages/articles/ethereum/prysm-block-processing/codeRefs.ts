import type { CodeRef } from "@/components/code/types";
import receiveBlockRaw from "./codebase/prysm/beacon-chain/blockchain/receive_block_v7.go?raw";
import executionEngineRaw from "./codebase/prysm/beacon-chain/blockchain/execution_engine_v7.go?raw";
import candidateAdmissionRaw from "./codebase/prysm/beacon-chain/blockchain/candidate_admission_v7.go?raw";
import engineJsonRpcRaw from "./codebase/prysm/beacon-chain/execution/engine_jsonrpc_v7.go?raw";
import transitionRaw from "./codebase/prysm/beacon-chain/core/transition/transition_no_verify_sig_v7.go?raw";
import electraRaw from "./codebase/prysm/beacon-chain/core/transition/electra_v7.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "parallel-validation": {
    path: "beacon-chain/blockchain/receive_block.go — validateExecutionAndConsensus()",
    lang: "go",
    code: receiveBlockRaw,
    highlight: [4, 52],
    desc: "Prysm v7.3.1 · consensus transition과 Engine 판정을 동시에 실행하고 합류",
    annotations: [
      { lines: [19, 24], color: "sky", note: "pre-state의 fork version과 execution header를 먼저 고정합니다." },
      { lines: [25, 36], color: "emerald", note: "첫 goroutine은 consensus state transition을 검증합니다." },
      { lines: [38, 46], color: "amber", note: "둘째 goroutine은 같은 block의 execution payload를 EL에 알립니다." },
      { lines: [48, 52], color: "violet", note: "두 경로 중 하나라도 오류면 후보 등록 단계로 가지 않습니다." },
    ],
  },
  "transition-root": {
    path: "beacon-chain/core/transition/transition_no_verify_sig.go — ExecuteStateTransitionNoVerifyAnySig()",
    lang: "go",
    code: transitionRaw,
    highlight: [4, 39],
    desc: "Prysm v7.3.1 · slot 전진, block mutation, post-state root 비교",
    annotations: [
      { lines: [15, 19], color: "sky", note: "Block slot까지 빈 slot을 포함해 state를 먼저 전진시킵니다." },
      { lines: [21, 25], color: "emerald", note: "서명 검증을 미룬 채 fork별 block handler와 signature batch 수집을 수행합니다." },
      { lines: [28, 36], color: "rose", note: "계산한 full state root가 block의 commitment와 다르면 transition을 거절합니다." },
    ],
  },
  "ordered-handlers": {
    path: "beacon-chain/core/transition/transition_no_verify_sig.go — ProcessBlockForStateRoot()",
    lang: "go",
    code: transitionRaw,
    highlight: [41, 112],
    desc: "Prysm v7.3.1 · Fulu에서 사용하는 pre-Gloas block handler 순서",
    annotations: [
      { lines: [54, 61], color: "sky", note: "Header는 slot·proposer·parent와 body root를 state에 묶습니다." },
      { lines: [63, 80], color: "emerald", note: "Withdrawals와 local payload context를 먼저 적용합니다." },
      { lines: [82, 93], color: "amber", note: "RANDAO와 Eth1 data를 같은 working state에 반영합니다." },
      { lines: [95, 112], color: "violet", note: "Fork별 operations 뒤 sync aggregate를 처리합니다." },
    ],
  },
  "electra-operations": {
    path: "beacon-chain/core/transition/electra.go — electraOperations()",
    lang: "go",
    code: electraRaw,
    highlight: [4, 60],
    desc: "Prysm v7.3.1 · Fulu가 재사용하는 Electra operation mutation 순서",
    annotations: [
      { lines: [18, 36], color: "sky", note: "Slashings, attestations, deposits, exits를 차례대로 적용합니다." },
      { lines: [37, 40], color: "emerald", note: "BLS-to-execution credential 변경을 처리합니다." },
      { lines: [42, 59], color: "amber", note: "Execution requests는 deposit, withdrawal, consolidation 순서입니다." },
    ],
  },
  "engine-status": {
    path: "beacon-chain/blockchain/execution_engine.go — notifyNewPayload()",
    lang: "go",
    code: executionEngineRaw,
    highlight: [4, 72],
    desc: "Prysm v7.3.1 · Fulu payload의 engine_newPayloadV4 입력과 status 분기",
    annotations: [
      { lines: [30, 47], color: "sky", note: "Deneb 이후 versioned hashes와 parent root, Electra 이후 execution requests를 함께 준비합니다." },
      { lines: [53, 58], color: "emerald", note: "Engine 호출이 성공하면 payload를 VALID로 취급합니다." },
      { lines: [59, 62], color: "amber", note: "SYNCING/ACCEPTED는 block을 optimistic 후보로 남깁니다." },
      { lines: [63, 69], color: "rose", note: "INVALID이면 latestValidHash와 함께 invalid block 경로로 보냅니다." },
    ],
  },
  "engine-method-status": {
    path: "beacon-chain/execution/engine_jsonrpc.go — NewPayload()",
    lang: "go",
    code: engineJsonRpcRaw,
    highlight: [4, 43],
    desc: "Prysm v7.3.1 · execution payload type에서 Engine API method와 status 의미를 선택",
    annotations: [
      { lines: [13, 29], color: "sky", note: "Deneb payload에 execution requests가 있으면 engine_newPayloadV4를 호출합니다." },
      { lines: [32, 34], color: "amber", note: "ACCEPTED와 SYNCING은 아직 execution validity가 확정되지 않았습니다." },
      { lines: [35, 38], color: "rose", note: "INVALID는 latestValidHash를 돌려주고, VALID만 확정 성공입니다." },
    ],
  },
  "candidate-admission": {
    path: "beacon-chain/blockchain/process_block.go · execution_engine.go — 후보 등록과 INVALID 제거",
    lang: "go",
    code: candidateAdmissionRaw,
    highlight: [4, 56],
    desc: "Prysm v7.3.1 · optimistic 후보 등록, head 재계산, invalid suffix 제거",
    annotations: [
      { lines: [8, 13], color: "sky", note: "검증된 post-state와 block을 fork-choice store에 후보로 넣습니다. 실패하면 저장 흔적을 되돌립니다." },
      { lines: [19, 24], color: "emerald", note: "EL이 이미 VALID라고 확인한 경우에만 optimistic 표시를 해제합니다." },
      { lines: [26, 33], color: "amber", note: "후보를 넣은 뒤 Head를 다시 계산합니다. 등록된 block이 곧 head라는 뜻은 아닙니다." },
      { lines: [45, 54], color: "rose", note: "나중에 INVALID가 확인되면 latestValidHash를 기준으로 관련 root와 저장된 state를 제거합니다." },
    ],
  },
};
