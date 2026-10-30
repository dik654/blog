import type { CodeRef } from "@/components/code/types";
import finalityRaw from "./codebase/prysm/beacon-chain/core/epoch/precompute/justification_finalization_v7.go?raw";
import forkchoiceRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_finality_v7.go?raw";
import weakSubjectivityRaw from "./codebase/prysm/beacon-chain/blockchain/weak_subjectivity_checks_v7.go?raw";

export const finalityCodeRefs: Record<string, CodeRef> = {
  "finality-bits": {
    path: "beacon-chain/core/epoch/precompute/justification_finalization.go — processJustificationBits() · v7.3.1 excerpt",
    lang: "go",
    code: finalityRaw,
    highlight: [15, 27],
    desc: "최근 justification bits를 옮기고 이전·현재 target balance의 정수 2/3 결과를 기록합니다.",
    annotations: [
      { lines: [16, 17], color: "violet", note: "기존 four-bit history를 한 칸 옮깁니다." },
      { lines: [18, 20], color: "sky", note: "이전 epoch target balance가 3W≥2T이면 bit 1을 켭니다." },
      { lines: [22, 24], color: "emerald", note: "현재 epoch target balance가 경계를 넘으면 bit 0을 켭니다." },
    ],
  },
  "finality-checkpoints": {
    path: "beacon-chain/core/epoch/precompute/justification_finalization.go — computeCheckpoints() · v7.3.1 excerpt",
    lang: "go",
    code: finalityRaw,
    highlight: [53, 99],
    desc: "새 justified checkpoint와 update 이전 checkpoint·bit pattern으로 finalized checkpoint를 계산합니다.",
    annotations: [
      { lines: [54, 60], color: "violet", note: "판정 전에 old previous/current checkpoint를 보존합니다." },
      { lines: [62, 76], color: "emerald", note: "새 bit가 가리키는 epoch 경계 root를 current justified로 올립니다." },
      { lines: [83, 97], color: "amber", note: "네 bit pattern과 old checkpoint의 epoch 간격을 함께 검사합니다." },
    ],
  },
  "finality-state-write": {
    path: "beacon-chain/core/epoch/precompute/justification_finalization.go — weighJustificationAndFinalization() · v7.3.1 excerpt",
    lang: "go",
    code: finalityRaw,
    highlight: [29, 51],
    desc: "계산한 previous/current justified, bits와 finalized checkpoint를 BeaconState에 기록합니다.",
    annotations: [
      { lines: [30, 33], color: "sky", note: "먼저 결과 checkpoint 두 개를 계산합니다." },
      { lines: [35, 49], color: "emerald", note: "Previous→current→bits→finalized 순서로 state setter를 호출합니다." },
    ],
  },
  "forkchoice-finality-prune": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/{forkchoice.go::updateCheckpoints, store.go::prune} · v7.3.1 focused excerpt",
    lang: "go",
    code: forkchoiceRaw,
    highlight: [1, 83],
    desc: "더 높은 finalized checkpoint를 fork-choice store에 반영하고 충돌하는 후보를 정리합니다.",
    annotations: [
      { lines: [10, 17], color: "emerald", note: "Finalized epoch가 전진했을 때만 store를 갱신하고 prune을 호출합니다." },
      { lines: [24, 32], color: "violet", note: "Finalized root가 store에 없으면 오류를 내고, 이미 root면 그대로 끝냅니다." },
      { lines: [39, 45], color: "sky", note: "기존 root에서 finalized node까지 정리한 뒤 그 node를 새 tree root로 만듭니다." },
      { lines: [56, 81], color: "amber", note: "Checkpoint slot 이하에서 finalized root와 양립하지 않는 child도 제거합니다." },
    ],
  },
  "weak-subjectivity-verifier": {
    path: "beacon-chain/blockchain/weak_subjectivity_checks.go — VerifyWeakSubjectivity() · v7.3.1 excerpt",
    lang: "go",
    code: weakSubjectivityRaw,
    highlight: [22, 49],
    desc: "신뢰 checkpoint root가 local finalized chain의 지정 epoch에 있는지 확인합니다.",
    annotations: [
      { lines: [23, 28], color: "violet", note: "검증이 끝났거나 아직 checkpoint epoch까지 finalize하지 않았다면 기다립니다." },
      { lines: [31, 36], color: "amber", note: "Block이 없거나 local canonical finalized block이 아니면 실패합니다." },
      { lines: [37, 48], color: "emerald", note: "해당 epoch의 slot 범위에서 같은 root를 찾은 뒤에만 verified를 기록합니다." },
    ],
  },
};
