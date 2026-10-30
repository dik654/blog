export const PRYSM_BLOCK_PROPOSAL_NODE = {
  id: "blockchain/prysm-block-proposal",
  shortTitle: "Prysm 블록 제안",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/prysm#overview",
  parentLabel: "Prysm 전체 구조",
  question: "Slot 353의 제안자는 어떻게 블록 하나를 조립하고 한 번만 서명해 전파합니까?",
  region: "validator client와 beacon node 사이의 block proposal 경계",
  closure:
    "Fulu state는 현재·다음 epoch의 proposer lookahead를 보유하므로 slot 353의 제안자는 lookahead[1]에서 결정됩니다. Validator client는 해당 key로 RANDAO reveal을 서명해 block production을 요청하고, beacon node는 최신 proposer head와 state를 정한 뒤 consensus operation 수집과 execution payload 선택을 병렬로 진행합니다. 조립한 block으로 state transition을 실행해 state_root를 채우면 validator client가 proposer domain으로 block을 서명하고 slashing-protection 기록을 확인한 뒤 같은 signed bytes와 sidecar를 제출합니다. 제출 성공은 block이 네트워크에 전파되었다는 뜻이며 head나 finality 확정은 아닙니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/prysm-block-processing#overview",
    label: "Prysm 블록 처리",
  },
  curriculumNext: {
    href: "/cs/blockchain/prysm-forkchoice#overview",
    label: "Prysm Fork Choice",
  },
} as const;
