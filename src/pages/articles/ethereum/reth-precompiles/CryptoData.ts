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
    name: 'ecRecover',
    addr: '0x01',
    gasFormula: '3,000 고정',
    inputFormat: 'hash(32B) + v,r,s(32B x 3) = 128B',
    outputFormat: 'address(32B, 좌측 12B 제로패딩)',
    detail: 'secp256k1 서명에서 공개키를 복구하고, keccak256(pubkey)의 하위 20바이트로 주소를 도출한다. TX 서명 검증, ERC-2612 permit, EIP-712 서명 검증에 사용된다.',
    color: '#6366f1',
  },
  {
    name: 'SHA256',
    addr: '0x02',
    gasFormula: '60 + 12 * ceil(len/32)',
    inputFormat: '임의 길이 바이트',
    outputFormat: 'hash(32B)',
    detail: '비트코인 호환을 위한 SHA-256 해시. EVM 기본 해시는 keccak256이므로 별도 프리컴파일로 제공한다. 브릿지 프로토콜에서 비트코인 헤더 검증에 사용된다.',
    color: '#8b5cf6',
  },
  {
    name: 'bn128Add / bn128Mul',
    addr: '0x06 / 0x07',
    gasFormula: '150 / 6,000',
    inputFormat: 'G1 point(64B) + G1 point(64B)',
    outputFormat: 'G1 point(64B)',
    detail: 'BN254 타원곡선 연산. Add는 두 점의 덧셈, Mul은 스칼라 곱셈이다. Groth16 검증의 기본 연산이다. substrate-bn 크레이트가 순수 Rust로 구현한다.',
    color: '#10b981',
  },
  {
    name: 'bn128Pairing',
    addr: '0x08',
    gasFormula: '34,000 * k + 45,000',
    inputFormat: '(G1점 + G2점) x k쌍 = 192B * k',
    outputFormat: 'bool(32B, 1이면 성공)',
    detail: 'zkSNARK(Groth16) 온체인 검증의 핵심. 3회 페어링으로 증명을 검증한다. k = 입력 쌍 수에 비례해 가스가 증가한다. 결과가 1이면 검증 성공이다.',
    color: '#f59e0b',
  },
];

export interface ImplComparison {
  aspect: string;
  geth: string;
  reth: string;
}

export const IMPL_COMPARISONS: ImplComparison[] = [
  { aspect: 'bn256 구현', geth: 'cloudflare C 라이브러리 + CGo', reth: 'substrate-bn 순수 Rust 크레이트' },
  { aspect: 'FFI 오버헤드', geth: 'Go→C 호출마다 메모리 복사', reth: '없음 (같은 주소 공간)' },
  { aspect: '크로스 컴파일', geth: 'CGo 의존으로 복잡', reth: 'cargo build --target으로 간단' },
  { aspect: 'unsafe 코드', geth: 'C 라이브러리 전체가 unsafe', reth: '최소화 (substrate-bn 내부만)' },
];
