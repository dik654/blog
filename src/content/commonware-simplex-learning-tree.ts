export const COMMONWARE_SIMPLEX_NODE = {
  id: "blockchain/commonware-simplex",
  shortTitle: "Simplex finalization",
  track: "concept",
  form: "explanation",
  medium: "article",
  parentHref: "/cs/blockchain/commonware-deep-dive#finalization",
  parentLabel: "Commonware 전체 구조 · Finalization",
  question:
    "Commonware bridge에서 Simplex가 받은 같은 digest는 언제 단순 지지를 넘어 finalization certificate가 됩니까?",
  region:
    "Simplex가 digest의 notarization을 만든 뒤 각 validator의 Application certification과 durable journal을 거쳐 finalization을 만드는 부분",
  closure:
    "n=4, f=1이면 서로 다른 세 validator의 notarize vote가 notarization을 만듭니다. 그 뒤 각 validator가 같은 digest를 local Application으로 certify하고 결과를 journal에 먼저 기록해야 finalize vote를 보낼 수 있습니다. 서로 다른 세 finalize vote가 모여야 finalization certificate가 됩니다. false 또는 timeout은 nullify 경로로 가지만 certification channel 오류는 false로 바뀌지 않고 재요청·replay 대상이 됩니다.",
  curriculumPrevious: {
    href: "/cs/blockchain/commonware-deep-dive#finalization",
    label: "Commonware 전체 구조",
  },
  curriculumNext: {
    href: "/cs/blockchain/commonware-storage#overview",
    label: "Commonware 저장 구조",
  },
} as const;
