export interface ChainSpecField {
  id: string;
  label: string;
  type: string;
  role: string;
  detail: string;
  color: string;
}

export const CHAINSPEC_FIELDS: readonly ChainSpecField[] = [
  {
    id: "identity",
    label: "chain",
    type: "Chain",
    role: "서명·네트워크 identity",
    detail:
      "EIP-155 chain ID와 named/custom chain metadata를 제공한다. peer compatibility는 genesis와 fork ID도 함께 확인한다.",
    color: "#6366f1",
  },
  {
    id: "genesis",
    label: "genesis",
    type: "Genesis + SealedHeader",
    role: "block 0과 초기 state",
    detail:
      "alloc과 header fields로 state root와 genesis hash를 고정한다. custom chain도 같은 생성·검증 경로를 사용한다.",
    color: "#10b981",
  },
  {
    id: "hardforks",
    label: "hardforks",
    type: "ChainHardforks",
    role: "ordered activation schedule",
    detail:
      "fork name을 activation condition과 묶는다. 실행 시점에는 현재 Head context로 활성 여부를 질의한다.",
    color: "#f59e0b",
  },
  {
    id: "parameters",
    label: "protocol params",
    type: "BaseFee / Blob / EVM limits",
    role: "fork-aware 계산 입력",
    detail:
      "fee와 blob schedule 같은 값은 chain·fork별로 달라질 수 있으므로 소비자가 상수로 복제하지 않는다.",
    color: "#8b5cf6",
  },
] as const;
