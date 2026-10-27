export type RethTxpoolTrack = "concept" | "practice" | "reference";

export interface RethTxpoolAnchor {
  href: string;
  label: string;
}

export interface RethTxpoolNode {
  id: "reth-txpool" | "reth-txpool-validation";
  href: string;
  shortTitle: string;
  track: RethTxpoolTrack;
  mapLabel: string;
  question: string;
  parentHref: string;
  parentLabel: string;
  closure: string;
  anchors?: readonly RethTxpoolAnchor[];
  paired?: RethTxpoolAnchor;
}

export const RETH_TXPOOL_NODES = [
  {
    id: "reth-txpool",
    href: "/cs/blockchain/reth-txpool#overview",
    shortTitle: "TxPool",
    track: "concept",
    mapLabel: "검증·의존성·재분류",
    question: "아직 블록에 들어가지 않은 거래는 어떤 조건에서 보관되고 실행 후보가 될까요?",
    parentHref: "/cs/blockchain/reth#overview",
    parentLabel: "Reth 노드의 거래 수신·블록 생성 경로",
    closure:
      "Reth TxPool은 서명된 거래를 곧바로 블록 후보로 만들지 않습니다. Stateless·stateful 검증을 통과한 거래를 sender nonce, 잔액과 다음 블록의 base/blob fee 조건으로 네 서브풀에 분류합니다. Builder에는 sender별 현재 head만 우선순위에 따라 내보내고, canonical head나 reorg가 바뀌면 현재 state에서 다시 계산합니다.",
    paired: {
      href: "/cs/blockchain/reth-txpool-validation#overview",
      label: "TxPool 정책·복구 검증",
    },
  },
  {
    id: "reth-txpool-validation",
    href: "/cs/blockchain/reth-txpool-validation#overview",
    shortTitle: "TxPool 검증",
    track: "practice",
    mapLabel: "Flood·reprice·reorg 대조",
    question: "TxPool 정책 변경을 운영에 적용하려면 어떤 입력과 상태 전이를 재생해야 할까요?",
    parentHref: "/cs/blockchain/reth-txpool#return-map",
    parentLabel: "TxPool의 검증·서브풀·builder·reorg 메커니즘",
    closure:
      "TxPool 변경은 처리량이나 pool 크기 하나로 승인하지 않습니다. 같은 head 일정과 거래 corpus에서 admission 결과, subpool 이유, replacement, builder-visible 순서와 reorg 재주입 결과를 기준 구현에 대조합니다. 정확성·bounded memory·restart·rollback을 통과한 run에서만 비용을 비교하며, 측정 전 결정은 proposed로 남깁니다.",
    anchors: [
      { href: "/cs/blockchain/reth-txpool#validation", label: "Valid·Invalid·Error 검증 결과" },
      { href: "/cs/blockchain/reth-txpool#classification", label: "네 서브풀 분류 조건" },
      { href: "/cs/blockchain/reth-txpool#ordering", label: "Sender head ordering" },
      { href: "/cs/blockchain/reth-txpool#canonical-update", label: "Canonical update와 reorg 재주입" },
    ],
  },
] as const satisfies readonly RethTxpoolNode[];

export type RethTxpoolNodeId = (typeof RETH_TXPOOL_NODES)[number]["id"];

export function getRethTxpoolNode(id: RethTxpoolNodeId): RethTxpoolNode {
  const node = RETH_TXPOOL_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Unknown Reth txpool node: ${id}`);
  return node;
}

export function getRethTxpoolTrackNodes(track: RethTxpoolTrack) {
  return RETH_TXPOOL_NODES.filter((node) => node.track === track);
}
