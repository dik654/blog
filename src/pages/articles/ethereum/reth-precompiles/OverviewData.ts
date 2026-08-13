export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: "native-boundary",
    title: "결정적 네이티브 경계",
    problem:
      "서명 복구, hashing, elliptic-curve 연산을 일반 EVM bytecode로만 표현하면 protocol이 의도한 비용 모델과 실행 한계를 맞추기 어렵다.",
    solution:
      "protocol이 예약한 주소를 native implementation에 연결하되 입력 ABI, gas schedule, 오류 결과까지 EIP의 consensus rules로 고정한다.",
    color: "#ef4444",
  },
  {
    id: "fork-registry",
    title: "포크별 레지스트리",
    problem:
      "새 precompile 추가와 기존 gas repricing은 활성 fork 전후에 서로 다른 결과를 내야 한다.",
    solution:
      "block spec에 대응하는 registry를 선택하고 그 버전이 활성화한 주소와 gas function만 dispatch한다.",
    color: "#f59e0b",
  },
  {
    id: "implementation",
    title: "구현과 규칙의 분리",
    problem:
      "암호 라이브러리와 최적화 방식은 바뀔 수 있지만 client끼리 입력 허용 범위와 결과가 달라지면 consensus가 깨진다.",
    solution:
      "Reth가 사용하는 EVM layer는 EIP-level contract를 유지하고, backend library는 test vectors를 만족하는 범위에서 교체할 수 있게 둔다.",
    color: "#10b981",
  },
];

export const PRECOMPILE_TABLE = [
  {
    addr: "0x01",
    name: "ecRecover",
    fork: "Frontier",
    gas: "3,000",
    note: "secp256k1 signature recovery",
  },
  {
    addr: "0x02",
    name: "SHA-256",
    fork: "Frontier",
    gas: "60 + 12/word",
    note: "SHA-256 hash",
  },
  {
    addr: "0x03",
    name: "RIPEMD-160",
    fork: "Frontier",
    gas: "600 + 120/word",
    note: "RIPEMD-160 hash",
  },
  {
    addr: "0x04",
    name: "identity",
    fork: "Frontier",
    gas: "15 + 3/word",
    note: "입력을 그대로 반환",
  },
  {
    addr: "0x05",
    name: "modexp",
    fork: "Byzantium",
    gas: "fork별 공식",
    note: "large-integer modular exponentiation",
  },
  {
    addr: "0x06",
    name: "BN254 add",
    fork: "Byzantium",
    gas: "150",
    note: "Istanbul에서 repriced",
  },
  {
    addr: "0x07",
    name: "BN254 mul",
    fork: "Byzantium",
    gas: "6,000",
    note: "Istanbul에서 repriced",
  },
  {
    addr: "0x08",
    name: "BN254 pairing",
    fork: "Byzantium",
    gas: "45,000 + 34,000·k",
    note: "Istanbul에서 repriced",
  },
  {
    addr: "0x09",
    name: "BLAKE2 F",
    fork: "Istanbul",
    gas: "rounds",
    note: "BLAKE2b compression function",
  },
  {
    addr: "0x0a",
    name: "KZG point evaluation",
    fork: "Cancun",
    gas: "50,000",
    note: "EIP-4844 proof verification",
  },
  {
    addr: "0x0b",
    name: "BLS12 G1 add",
    fork: "Prague",
    gas: "375",
    note: "Pectra에서 활성화",
  },
  {
    addr: "0x0c",
    name: "BLS12 G1 MSM",
    fork: "Prague",
    gas: "k·12,000·discount(k)",
    note: "multi-scalar multiplication",
  },
  {
    addr: "0x0d",
    name: "BLS12 G2 add",
    fork: "Prague",
    gas: "600",
    note: "Pectra에서 활성화",
  },
  {
    addr: "0x0e",
    name: "BLS12 G2 MSM",
    fork: "Prague",
    gas: "k·22,500·discount(k)",
    note: "multi-scalar multiplication",
  },
  {
    addr: "0x0f",
    name: "BLS12 pairing check",
    fork: "Prague",
    gas: "37,700 + 32,600·k",
    note: "pairing product check",
  },
  {
    addr: "0x10",
    name: "BLS12 map Fp→G1",
    fork: "Prague",
    gas: "5,500",
    note: "field-to-curve mapping",
  },
  {
    addr: "0x11",
    name: "BLS12 map Fp2→G2",
    fork: "Prague",
    gas: "23,800",
    note: "extension-field mapping",
  },
];
