export interface MessagePair {
  id: string;
  request: string;
  response: string;
  purpose: string;
  details: string;
  color: string;
}

export const ETH_MESSAGES: readonly MessagePair[] = [
  {
    id: "headers",
    request: "GetBlockHeaders",
    response: "BlockHeaders",
    purpose: "chain 위치와 ancestry 확인",
    details:
      "origin, amount, skip와 direction으로 필요한 header range를 표현한다. 응답 크기와 serving budget은 구현 policy가 제한한다.",
    color: "#6366f1",
  },
  {
    id: "bodies",
    request: "GetBlockBodies",
    response: "BlockBodies",
    purpose: "선택한 block의 execution body 획득",
    details:
      "검증한 header hash를 기준으로 body를 요청한다. 요청 항목 수보다 message-size와 peer budget이 실제 batch를 제한할 수 있다.",
    color: "#0ea5e9",
  },
  {
    id: "pooled-tx",
    request: "GetPooledTransactions",
    response: "PooledTransactions",
    purpose: "모르는 pending transaction만 pull",
    details:
      "announcement의 hash를 local pool과 대조한 뒤 필요한 항목만 요청한다. blob data의 전달 방식은 protocol version별 규칙을 따른다.",
    color: "#10b981",
  },
  {
    id: "receipts",
    request: "GetReceipts",
    response: "Receipts",
    purpose: "실행 결과와 log 획득",
    details:
      "block hash에 대응하는 receipt list를 가져온다. 최신 version은 큰 response를 다루기 위한 추가 field를 가질 수 있다.",
    color: "#f59e0b",
  },
] as const;

export interface BroadcastType {
  name: string;
  desc: string;
}

export const BROADCAST_TYPES: readonly BroadcastType[] = [
  {
    name: "NewBlockHashes",
    desc: "새 canonical candidate의 존재를 가볍게 알린다. 필요한 피어는 header/body를 별도로 요청한다.",
  },
  {
    name: "NewBlock",
    desc: "일부 피어에 전체 block과 total difficulty 정보를 전달할 수 있다. 대상 선택은 client propagation policy다.",
  },
  {
    name: "Transactions",
    desc: "complete transaction object를 일부 피어에 직접 보낸다. 이미 안다고 추정되는 피어에는 되돌려 보내지 않는다.",
  },
  {
    name: "NewPooledTransactionHashes",
    desc: "transaction hash와 version별 metadata를 알린다. 수신자는 local 상태에 따라 필요한 본문만 요청한다.",
  },
] as const;
