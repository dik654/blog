export type KohakuProviderTrack = "concept" | "practice" | "reference";

export type KohakuProviderNodeId = "kohaku-provider" | "kohaku-provider-validation";

export interface KohakuProviderNode {
  id: KohakuProviderNodeId;
  shortTitle: string;
  track: KohakuProviderTrack;
  href: string;
  question: string;
  parentHref: string;
  parentLabel: string;
  closure: string;
  anchors?: readonly { href: string; label: string }[];
  paired?: { href: string; label: string };
  curriculumPrevious?: { href: string; label: string };
  curriculumNext?: { href: string; label: string };
}

export const KOHAKU_PROVIDER_NODES = [
  {
    id: "kohaku-provider",
    shortTitle: "Provider 경계",
    track: "concept",
    href: "/cs/blockchain/kohaku-provider#overview",
    question: "같은 getLogs 호출이 backend에 따라 어떤 검증 경로를 지나며, 공통 타입은 무엇을 보장하지 못할까요?",
    parentHref: "/cs/blockchain/helios#boundary",
    parentLabel: "Helios 전체 지도 · 검증된 조회와 외부 RPC 경계",
    closure: "Kohaku Provider는 여러 backend를 EthereumProvider의 공통 메서드와 타입으로 감쌉니다. 그러나 Helios의 일반 getLogs와 execution RPC 우회는 같은 TxLog[]를 돌려줘도 검증 경로가 다릅니다. Provider 읽기와 TxSigner 권한도 별도 계약이므로 공통 API만으로 동일한 신뢰나 서명 권한을 추론할 수 없습니다.",
    paired: {
      href: "/cs/blockchain/kohaku-provider-validation#overview",
      label: "Kohaku Provider 변경 검증",
    },
    curriculumPrevious: {
      href: "/cs/blockchain/helios-config#return-map",
      label: "Helios 설정과 운영 경계",
    },
    curriculumNext: {
      href: "/cs/blockchain/kohaku-provider-validation#overview",
      label: "Kohaku Provider 변경 검증",
    },
  },
  {
    id: "kohaku-provider-validation",
    shortTitle: "Provider 검증",
    track: "practice",
    href: "/cs/blockchain/kohaku-provider-validation#overview",
    question: "고정한 provider bundle을 운영 후보로 올리기 전에 어떤 값·오류·신뢰 경로·대기 동작을 검증해야 할까요?",
    parentHref: "/cs/blockchain/kohaku-provider#return-map",
    parentLabel: "Kohaku Provider의 공통 API와 method별 신뢰 경계",
    closure: "Provider 변경은 같은 값이 한 번 나왔다는 이유로 승인하지 않습니다. 같은 chain·block fixture에서 값과 오류를 비교하고, 실제 adapter·backend·bypass 경로를 함께 기록해야 합니다. Receipt 대기는 포함 여부만 뜻하며 성공·confirmations·finality를 보장하지 않습니다. 대상 환경 측정이 없으면 상태는 proposed로 남고, 이전 bundle과 signer wiring으로 되돌릴 수 있어야 합니다.",
    anchors: [
      { href: "/cs/blockchain/kohaku-provider#provider-interface", label: "EthereumProvider와 TxSigner 경계" },
      { href: "/cs/blockchain/kohaku-provider#getlogs-route", label: "getLogs의 두 실행 경로" },
      { href: "/cs/blockchain/kohaku-provider#normalization", label: "타입 정규화와 provenance" },
      { href: "/cs/blockchain/kohaku-provider#failure-boundary", label: "설계된 실패 동작" },
    ],
    curriculumPrevious: {
      href: "/cs/blockchain/kohaku-provider#return-map",
      label: "Kohaku Provider 경계",
    },
    curriculumNext: {
      href: "/cs/blockchain/webcat-frontend-integrity#overview",
      label: "WEBCAT frontend 무결성",
    },
  },
] as const satisfies readonly KohakuProviderNode[];

export function getKohakuProviderNode(id: KohakuProviderNodeId): KohakuProviderNode {
  const node = KOHAKU_PROVIDER_NODES.find((candidate) => candidate.id === id);
  if (!node) throw new Error(`Kohaku Provider 학습 노드를 찾을 수 없습니다: ${id}`);
  return node;
}
