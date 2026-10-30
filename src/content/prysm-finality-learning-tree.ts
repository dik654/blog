export const PRYSM_FINALITY_NODE = {
  id: "blockchain/prysm-finality",
  shortTitle: "Prysm 최종성",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question:
    "전체 active balance 96 중 64가 epoch 11 경계를 지지했을 때 Prysm은 왜 epoch 11이 아니라 epoch 10 checkpoint를 finalized로 기록합니까?",
  region:
    "epoch participation을 justification bits와 finalized checkpoint로 바꾸는 Finality 경로",
  closure:
    "Prysm v7.3.1은 검증된 target participation을 validator별로 한 번씩 합산하고 3W≥2T를 정수로 판정합니다. 그 결과를 최근 네 epoch의 justification bits에 넣은 뒤, 갱신 전 justified checkpoint의 epoch와 bit pattern을 함께 검사해 더 오래된 checkpoint를 finalized로 올립니다. Fork-choice는 이 checkpoint와 충돌하는 후보만 제거하며, 오래 offline이던 node는 별도로 받은 recent checkpoint가 실제 finalized chain의 같은 epoch에 있는지 확인합니다. 현재 head, finalized checkpoint, archive 보존과 bootstrap trust는 서로 다른 상태입니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-forkchoice#overview",
    label: "Prysm 가지 선택",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-sync#overview",
    label: "Prysm 동기화",
  },
} as const;
