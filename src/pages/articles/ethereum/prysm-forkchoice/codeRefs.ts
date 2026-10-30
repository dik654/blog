import type { CodeRef } from "@/components/code/types";
import ownersRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_owners_v7.go?raw";
import nodeVoteRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_node_vote_v7.go?raw";
import attestationRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_attestation_v7.go?raw";
import balanceRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_balance_v7.go?raw";
import boostGateRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_boost_gate_v7.go?raw";
import boostScoreRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_boost_score_v7.go?raw";
import newSlotRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_new_slot_v7.go?raw";
import weightRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_weight_v7.go?raw";
import bestRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_best_descendant_v7.go?raw";
import headRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_head_v7.go?raw";
import storeHeadRaw from "./codebase/prysm/beacon-chain/forkchoice/doubly-linked-tree/forkchoice_store_head_v7.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "forkchoice-owners": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/types.go:L14-L50 — ForkChoice·Store",
    lang: "go",
    code: ownersRaw,
    highlight: [1, 29],
    desc: "Prysm v7.3.1의 validator vote 배열과 fork-choice store 상태 소유권",
    annotations: [
      { lines: [2, 9], color: "violet", note: "ForkChoice는 Store와 validator별 vote·balance snapshot을 함께 소유합니다." },
      { lines: [12, 29], color: "emerald", note: "Store는 checkpoint·boost·tree index와 마지막 head를 보관합니다. 중간의 비관련 필드는 생략 표시했습니다." },
    ],
  },
  "forkchoice-node-vote": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/types.go:L52-L100 — Node·Vote",
    lang: "go",
    code: nodeVoteRaw,
    highlight: [1, 28],
    desc: "직접 balance·subtree weight·best descendant와 current·next vote의 실제 필드",
    annotations: [
      { lines: [3, 18], color: "sky", note: "Node.balance는 직접 지지이고 Node.weight는 자식까지 더한 합계입니다." },
      { lines: [21, 28], color: "amber", note: "Vote는 반영을 마친 current와 다음 Head가 처리할 next를 분리합니다." },
    ],
  },
  "forkchoice-attestation": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/forkchoice.go:L86-L123 — ProcessAttestation",
    lang: "go",
    code: attestationRaw,
    highlight: [8, 25],
    desc: "검증을 마친 validator별 latest message를 next vote에 기록",
    annotations: [
      { lines: [8, 12], color: "violet", note: "Validator index가 처음 보이면 vote cache를 늘립니다." },
      { lines: [14, 23], color: "emerald", note: "첫 vote 또는 더 새로운 target epoch만 nextRoot·nextSlot을 바꿉니다." },
    ],
  },
  "forkchoice-balance": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/forkchoice.go:L315-L403 — updateBalances",
    lang: "go",
    code: balanceRaw,
    highlight: [14, 62],
    desc: "Head 직전 old/new direct balance를 옮기고 next를 current로 회전",
    annotations: [
      { lines: [7, 12], color: "violet", note: "Slashed validator는 balance 이동에서 제외됩니다." },
      { lines: [14, 23], color: "sky", note: "이전에 반영한 balance와 현재 justified balance를 validator index로 읽습니다." },
      { lines: [24, 54], color: "emerald", note: "알려진 next root에는 새 balance를 더하고 current root에서는 이전 balance를 뺍니다. Underflow 경고 로그만 생략 표시했습니다." },
      { lines: [56, 62], color: "amber", note: "반영한 next를 current로 회전하므로 같은 vote가 다음 Head에서 다시 더해지지 않습니다." },
    ],
  },
  "forkchoice-boost-gate": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/store.go:L188-L220 — timely proposer boost gate",
    lang: "go",
    code: boostGateRaw,
    highlight: [1, 46],
    desc: "현재 slot의 첫 timely block과 dependent-root 일치를 확인해 boost root를 기록",
    annotations: [
      { lines: [2, 17], color: "violet", note: "현재 slot·attestation due 전·첫 block 조건을 확인합니다." },
      { lines: [18, 28], color: "emerald", note: "이전 epoch의 dependent root가 현재 head와 같을 때만 proposerBoostRoot를 씁니다. 오류 반환 분기는 생략 표시했습니다." },
    ],
  },
  "forkchoice-boost-score": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/proposer_boost.go:L8-L53 — score apply",
    lang: "go",
    code: boostScoreRaw,
    highlight: [3, 28],
    desc: "이전 score를 제거하고 committee-relative proposer score를 현재 root에 적용",
    annotations: [
      { lines: [3, 12], color: "violet", note: "매 Head에서 이전 boost를 먼저 제거하고 현재 적용 결과를 기록합니다." },
      { lines: [16, 27], color: "emerald", note: "committeeWeight × ProposerScoreBoost ÷ 100을 boost root의 직접 balance에 더합니다." },
    ],
  },
  "forkchoice-new-slot": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/on_tick.go:L32-L45 — NewSlot",
    lang: "go",
    code: newSlotRaw,
    highlight: [1, 15],
    desc: "새 slot에서 proposerBoostRoot를 비우고 epoch 경계에서 checkpoint·prune을 갱신",
    annotations: [
      { lines: [1, 7], color: "sky", note: "Slot이 바뀌면 boost root는 즉시 비워집니다." },
      { lines: [10, 15], color: "amber", note: "Checkpoint 갱신과 prune은 epoch 시작에서만 이어집니다." },
    ],
  },
  "forkchoice-weight": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/gloas.go:L74-L95 — applyWeightChangesConsensusNode",
    lang: "go",
    code: weightRaw,
    highlight: [3, 22],
    desc: "자식 payload path의 weight와 node 직접 balance를 더해 consensus-node subtree weight를 계산",
    annotations: [
      { lines: [4, 16], color: "violet", note: "자식 path를 먼저 재귀 계산해 childrenWeight를 만듭니다." },
      { lines: [17, 21], color: "emerald", note: "일반 node의 weight는 직접 balance와 childrenWeight의 합입니다." },
    ],
  },
  "forkchoice-best": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/gloas.go:L198-L235 — updateBestDescendantPayloadNode core",
    lang: "go",
    code: bestRaw,
    highlight: [1, 29],
    desc: "Viable child의 weight를 비교하고 동률이면 root byte ordering으로 best child를 결정",
    annotations: [
      { lines: [10, 23], color: "violet", note: "각 child의 내부 best descendant를 먼저 갱신하고 viable 여부를 확인합니다." },
      { lines: [24, 34], color: "emerald", note: "더 무거운 child를 택하며 같은 weight에서는 더 큰 root를 택합니다." },
      { lines: [36, 45], color: "sky", note: "선택한 child의 더 깊은 bestDescendant를 현재 payload node에 올립니다." },
    ],
  },
  "forkchoice-head-order": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/forkchoice.go:L54-L84 — Head",
    lang: "go",
    code: headRaw,
    highlight: [11, 30],
    desc: "Balance→boost→weight→best descendant→store.head의 실제 호출 순서",
    annotations: [
      { lines: [11, 22], color: "violet", note: "Direct balance와 임시 score를 적용한 뒤 subtree weight를 다시 계산합니다." },
      { lines: [24, 30], color: "emerald", note: "현재 checkpoint로 best descendant를 갱신한 다음 Store가 root를 반환합니다." },
    ],
  },
  "forkchoice-store-head": {
    path: "beacon-chain/forkchoice/doubly-linked-tree/store.go:L36-L77 — head",
    lang: "go",
    code: storeHeadRaw,
    highlight: [11, 40],
    desc: "Justified root의 cached best descendant를 검사하고 마지막 head root로 반환",
    annotations: [
      { lines: [11, 23], color: "violet", note: "Justified root를 찾은 뒤 bestDescendant가 없으면 root 자체를 후보로 둡니다." },
      { lines: [24, 29], color: "emerald", note: "현재 epoch에서 viable head가 아니면 오류를 반환합니다." },
      { lines: [30, 40], color: "amber", note: "검사를 통과한 node가 바뀌면 cached head와 metric을 갱신한 뒤 root를 반환합니다." },
    ],
  },
};
