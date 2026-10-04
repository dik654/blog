export const SHAPE_TERMS = [
  {symbol: "T_{KV}", name: "저장 위치 수", description: "현재 새 K/V까지 붙인 기록의 길이입니다. 사례에서는 3에서 4로 늘어납니다."},
  {
    symbol: "T_q",
    name: "현재 계산 위치 수",
    description:
      "이번 실행이 계산하는 위치 개수입니다. 본문의 한 위치 decode에서는 1입니다.",
  },
  {
    symbol: "H_Q",
    name: "Query head 수",
    description:
      "현재 token이 서로 다른 관점으로 과거를 조회하는 head 수입니다.",
  },
  {
    symbol: "H_{KV}",
    name: "Key/value head 수",
    description: "과거 token마다 cache에 실제로 남기는 K/V head 수입니다.",
  },
  {
    symbol: "D_{head}",
    name: "Head dimension",
    description: "Head 하나가 token 하나를 표현하는 scalar 원소 수입니다.",
  },
] as const;

export const BYTE_TERMS = [
  {
    symbol: "E_{KV}",
    name: "Layer당 KV 원소 수",
    description:
      "KV head 수와 head dimension을 곱한 token·tensor 하나의 폭입니다.",
  },
  {
    symbol: "A_{store}",
    name: "저장 byte 계수",
    description:
      "K/V tensor 수와 원소당 byte를 곱해 KV 원소 폭을 실제 byte로 바꾸는 계수입니다.",
  },
  {
    symbol: "B_{token}",
    name: "토큰당 KV cache byte",
    description:
      "과거 token 하나를 모든 KV layer에 보존할 때 필요한 memory입니다.",
  },
  {
    symbol: "L_{KV}",
    name: "KV를 저장하는 layer 수",
    description:
      "일반 attention model에서는 대체로 text transformer layer 수와 같습니다.",
  },
  {
    symbol: "H_{KV}",
    name: "KV head 수",
    description: "Q head 수가 아닙니다. GQA·MQA가 직접 줄이는 축입니다.",
  },
  {
    symbol: "D_{head}",
    name: "head dimension",
    description: "K 또는 V head 하나가 token마다 저장하는 원소 수입니다.",
  },
  {
    symbol: "N_{tensor}",
    name: "저장 tensor 수",
    description:
      "K와 V를 따로 저장하면 2입니다. 표현이 다르면 해당 저장 구조의 원소 수를 다시 셉니다.",
  },
  {
    symbol: "b_{dtype}",
    name: "원소당 byte",
    description:
      "BF16·FP16은 2 byte, FP8은 보통 1 byte이며 scale·alignment 비용은 별도입니다.",
  },
] as const;
