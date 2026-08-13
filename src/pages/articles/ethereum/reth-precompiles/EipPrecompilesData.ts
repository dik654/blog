export interface EipItem {
  name: string;
  eip: string;
  fork: string;
  gas: string;
  purpose: string;
  detail: string;
  color: string;
}

export const EIP_ITEMS: EipItem[] = [
  {
    name: "BLAKE2 F",
    eip: "EIP-152",
    fork: "Istanbul",
    gas: "round 수에 비례",
    purpose: "BLAKE2b compression function",
    detail:
      "213-byte input에서 round count, state vector, message block, offset와 final flag를 해석한다. gas를 확인한 뒤 F compression function의 64-byte state를 반환한다.",
    color: "#8b5cf6",
  },
  {
    name: "KZG Point Evaluation",
    eip: "EIP-4844",
    fork: "Cancun",
    gas: "50,000",
    purpose: "KZG opening proof verification",
    detail:
      "versioned hash, evaluation point와 value, commitment, proof로 구성된 192-byte input을 검증한다. 성공 시 EIP가 정한 field-elements-per-blob과 BLS modulus를 반환한다.",
    color: "#ef4444",
  },
  {
    name: "BLS12-381 operations",
    eip: "EIP-2537",
    fork: "Prague / Pectra",
    gas: "연산별 schedule",
    purpose: "BLS signature·proof building blocks",
    detail:
      "0x0b~0x11의 G1/G2 addition, MSM, pairing check와 field-to-curve mapping이다. Prague rules가 Pectra mainnet activation과 함께 적용됐으므로 더 이상 예정 기능이 아니다.",
    color: "#10b981",
  },
];

export const REGISTRY_DESIGN = [
  {
    question: "왜 current mainnet 목록 하나만 두지 않는가?",
    answer:
      "historical block 재실행과 다른 network의 fork schedule을 지원해야 한다. 실행할 block의 spec으로 registry를 선택해야 활성화 전 주소가 잘못 dispatch되지 않는다.",
  },
  {
    question: "registry 상속은 무엇을 보장하는가?",
    answer:
      "이전 fork의 entries를 기반으로 새 주소나 repricing만 반영해 변경 범위를 좁힌다. 실제 자료구조와 초기화 전략은 revm version에 따라 바뀔 수 있으므로 clone이나 HashMap 자체를 protocol invariant로 보지 않는다.",
  },
  {
    question: "암호 backend를 바꿔도 되는가?",
    answer:
      "가능하지만 EIP test vectors, input rejection, gas와 output semantics가 같아야 한다. native library 선택은 implementation detail이고 결과는 consensus surface다.",
  },
];
