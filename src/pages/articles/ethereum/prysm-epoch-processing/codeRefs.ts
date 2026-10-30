import type { CodeRef } from "@/components/code/types";
import transitionRaw from "./codebase/prysm/beacon-chain/core/transition/transition.go?raw";
import electraTransitionRaw from "./codebase/prysm/beacon-chain/core/electra/transition.go?raw";
import fuluTransitionRaw from "./codebase/prysm/beacon-chain/core/fulu/transition.go?raw";
import finalityRaw from "./codebase/prysm/beacon-chain/core/epoch/precompute/justification_finalization.go?raw";
import rewardsRaw from "./codebase/prysm/beacon-chain/core/altair/epoch_precompute.go?raw";
import depositsRaw from "./codebase/prysm/beacon-chain/core/electra/deposits.go?raw";
import rotationRaw from "./codebase/prysm/beacon-chain/core/altair/epoch_spec.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "process-epoch-dispatch": {
    path: "beacon-chain/core/transition/transition.go — ProcessEpoch() · v7.3.1",
    lang: "go",
    code: transitionRaw,
    highlight: [1, 31],
    desc: "State version으로 fork별 epoch transition 하나를 고릅니다.",
    annotations: [
      { lines: [6, 7], color: "sky", note: "Epoch 경계일 때만 fork dispatch 실행" },
      { lines: [8, 27], color: "emerald", note: "Gloas→Fulu→Electra→Altair 순으로 state version 검사" },
      { lines: [10, 25], color: "rose", note: "Fork별 오류는 nil state와 context를 붙여 반환" },
    ],
  },
  "process-epoch-fulu": {
    path: "beacon-chain/core/fulu/transition.go — ProcessEpoch() · v7.3.1",
    lang: "go",
    code: fuluTransitionRaw,
    highlight: [1, 36],
    desc: "Fulu는 Electra pipeline을 실행한 뒤 proposer lookahead를 갱신합니다.",
    annotations: [
      { lines: [5, 8], color: "sky", note: "Electra의 ordered epoch transition을 먼저 재사용" },
      { lines: [23, 24], color: "emerald", note: "가장 오래된 epoch의 proposer indices를 밀어냄" },
      { lines: [25, 34], color: "amber", note: "미래 epoch proposer를 계산해 lookahead 끝에 기록" },
    ],
  },
  "process-epoch-electra": {
    path: "beacon-chain/core/electra/transition.go — ProcessEpoch() · v7.3.1",
    lang: "go",
    code: electraTransitionRaw,
    highlight: [1, 68],
    desc: "Participation 집계부터 committee rotation까지 같은 state를 규격 순서로 바꿉니다.",
    annotations: [
      { lines: [8, 24], color: "sky", note: "Participation precompute→finality→inactivity→보상·패널티" },
      { lines: [25, 44], color: "amber", note: "Registry·slashing·pending queues·effective balance" },
      { lines: [45, 68], color: "emerald", note: "Ring reset→history→participation→sync committee" },
    ],
  },
  "process-justification": {
    path: "beacon-chain/core/epoch/precompute/justification_finalization.go · v7.3.1",
    lang: "go",
    code: finalityRaw,
    highlight: [1, 86],
    desc: "2/3 정수 비교로 bits를 갱신하고 checkpoint history pattern을 검사합니다.",
    annotations: [
      { lines: [16, 28], color: "sky", note: "기존 bits를 이동하고 이전·현재 target의 2/3 조건 기록" },
      { lines: [42, 58], color: "emerald", note: "새 bit가 가리키는 epoch root를 justified checkpoint로 선택" },
      { lines: [66, 84], color: "violet", note: "Bit mask와 old checkpoint epoch 간격이 함께 맞을 때 finalize" },
    ],
  },
  "process-rewards": {
    path: "beacon-chain/core/altair/epoch_precompute.go — rewards and penalties · v7.3.1",
    lang: "go",
    code: rewardsRaw,
    highlight: [1, 44],
    desc: "Precomputed delta를 validator별 실제 balance에 더하고 뺍니다.",
    annotations: [
      { lines: [6, 16], color: "rose", note: "Genesis skip과 validator·balance 길이 guard" },
      { lines: [18, 20], color: "sky", note: "Participation에서 validator별 delta 계산" },
      { lines: [23, 40], color: "emerald", note: "Reward 합을 더하고 penalty 합을 뺀 뒤 balances 저장" },
    ],
  },
  "process-pending-deposits": {
    path: "beacon-chain/core/electra/deposits.go — ProcessPendingDeposits() · v7.3.1",
    lang: "go",
    code: depositsRaw,
    highlight: [1, 102],
    desc: "Finalized position·개수·churn budget을 차례대로 확인하는 pending-deposit loop입니다.",
    annotations: [
      { lines: [18, 24], color: "sky", note: "기존 carry와 이번 epoch churn을 합쳐 처리 가능량 계산" },
      { lines: [45, 59], color: "violet", note: "Finalized position과 epoch당 최대 개수에서 멈춤" },
      { lines: [81, 95], color: "amber", note: "다음 deposit이 budget을 넘으면 queue 처리를 중단" },
    ],
  },
  "process-participation-rotation": {
    path: "beacon-chain/core/altair/epoch_spec.go — ProcessParticipationFlagUpdates() · v7.3.1",
    lang: "go",
    code: rotationRaw,
    highlight: [9, 21],
    desc: "Current participation을 previous로 옮기고 새 current vector를 0으로 만듭니다.",
    annotations: [
      { lines: [11, 15], color: "sky", note: "이번 epoch participation을 previous field로 이동" },
      { lines: [16, 18], color: "emerald", note: "Validator 수만큼 다음 epoch용 0 vector 생성" },
    ],
  },
  "process-proposer-lookahead": {
    path: "beacon-chain/core/fulu/transition.go — ProcessProposerLookahead() · v7.3.1",
    lang: "go",
    code: fuluTransitionRaw,
    highlight: [11, 36],
    desc: "오래된 epoch의 proposer를 밀어내고 lookahead의 마지막 epoch를 계산합니다.",
    annotations: [
      { lines: [23, 24], color: "sky", note: "한 epoch 분량을 앞쪽에서 제거" },
      { lines: [25, 35], color: "emerald", note: "미래 epoch proposer indices를 계산해 뒤쪽에 복사" },
    ],
  },
};
