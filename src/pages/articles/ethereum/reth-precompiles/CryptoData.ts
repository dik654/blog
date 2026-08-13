export interface CryptoItem {
  name: string;
  addr: string;
  gasFormula: string;
  inputFormat: string;
  outputFormat: string;
  detail: string;
  color: string;
}

export const CRYPTO_ITEMS: CryptoItem[] = [
  {
    name: "ecRecover",
    addr: "0x01",
    gasFormula: "3,000 고정",
    inputFormat: "hash(32B) + v,r,s(32B x 3) = 128B",
    outputFormat: "address(32B, 좌측 12B 제로패딩)",
    detail:
      "secp256k1 서명에서 공개키를 복구하고 keccak256(public key)의 하위 20바이트를 32바이트 결과에 정렬한다. 컨트랙트가 permit·typed-data 같은 서명자를 확인할 때 사용하며, 노드 내부의 transaction sender recovery와는 별도 호출 경계다.",
    color: "#6366f1",
  },
  {
    name: "SHA256",
    addr: "0x02",
    gasFormula: "60 + 12 * ceil(len/32)",
    inputFormat: "임의 길이 바이트",
    outputFormat: "hash(32B)",
    detail:
      "비트코인 호환을 위한 SHA-256 해시. EVM 기본 해시는 keccak256이므로 별도 프리컴파일로 제공한다. 브릿지 프로토콜에서 비트코인 헤더 검증에 사용된다.",
    color: "#8b5cf6",
  },
  {
    name: "bn128Add / bn128Mul",
    addr: "0x06 / 0x07",
    gasFormula: "150 / 6,000",
    inputFormat: "G1 point(64B) + G1 point(64B)",
    outputFormat: "G1 point(64B)",
    detail:
      "BN254 타원곡선 연산이다. Add는 두 점의 덧셈, Mul은 점과 scalar의 곱을 계산한다. 입력 encoding과 curve 유효성도 consensus contract의 일부다.",
    color: "#10b981",
  },
  {
    name: "bn128Pairing",
    addr: "0x08",
    gasFormula: "34,000 * k + 45,000",
    inputFormat: "(G1점 + G2점) x k쌍 = 192B * k",
    outputFormat: "bool(32B, 1이면 성공)",
    detail:
      "입력의 G1·G2 pair들에 대해 pairing product가 identity인지 검사한다. 많은 Groth16 verifier가 이 연산을 사용하지만 pair 수는 verifier 식에 따라 달라진다.",
    color: "#f59e0b",
  },
];
