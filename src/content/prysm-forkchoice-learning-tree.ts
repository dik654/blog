export const PRYSM_FORKCHOICE_NODE = {
  id: "blockchain/prysm-forkchoice",
  shortTitle: "Prysm 가지 선택",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "같은 checkpoint 아래 두 유효한 가지가 있을 때 Prysm은 왜 B353을 잠시 head로 골랐다가 다음 slot A353으로 바꿉니까?",
  region: "latest message, proposer boost와 best-descendant가 만나는 fork-choice store",
  closure:
    "Prysm v7.3.1은 validator별 latest vote의 current·next root와 justified balance를 비교해 각 node의 직접 balance를 옮기고, 자식 weight를 아래에서 위로 합산합니다. 제시간에 들어온 현재-slot block에는 committee-relative proposer boost를 잠시 더합니다. Viable branch만 남긴 뒤 justified root의 best-descendant를 head로 읽습니다. 다음 slot이 시작되면 boost root를 비우고 이전 score를 제거하므로 같은 vote에서도 head가 다시 바뀔 수 있습니다. 이 head는 현재 선택이며 finality가 아닙니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-block-proposal#overview",
    label: "Prysm 블록 제안",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-finality#overview",
    label: "Prysm 최종성",
  },
} as const;
