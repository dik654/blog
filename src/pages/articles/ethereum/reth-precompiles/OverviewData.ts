export interface DesignChoice {
  id: string;
  title: string;
  problem: string;
  solution: string;
  color: string;
}

export const DESIGN_CHOICES: DesignChoice[] = [
  {
    id: 'gas-explosion',
    title: 'EVM 바이트코드의 한계',
    problem: 'bn128 페어링을 EVM 옵코드로 구현하면 ~10,000,000 gas가 소모된다. 블록 가스 한도(30M)의 1/3을 한 번의 zkSNARK 검증에 사용하게 된다.',
    solution: '주소 0x01~0x0a에 네이티브 함수를 매핑한다. CALL 명령의 to 주소가 이 범위이면 바이트코드 실행 없이 직접 호출한다. bn128Pair는 34,000*n+45,000 gas로 수백 배 저렴하다.',
    color: '#ef4444',
  },
  {
    id: 'hardfork',
    title: '하드포크별 레지스트리',
    problem: 'Byzantium(bn128), Istanbul(blake2f), Cancun(KZG) 등 하드포크마다 새 프리컴파일이 등장한다. 이전 하드포크의 목록을 상속하면서 새 항목만 추가해야 한다.',
    solution: 'PrecompileSpecId enum으로 하드포크를 구분하고, OnceLock으로 각 목록을 지연 초기화한다. Cancun은 Shanghai 목록을 복제 후 KZG만 추가하는 방식이다.',
    color: '#f59e0b',
  },
  {
    id: 'pure-rust',
    title: '순수 Rust vs CGo 바인딩',
    problem: 'Geth는 bn256 연산에 cloudflare C 라이브러리를 CGo로 호출한다. FFI 경계에서 입력/출력 메모리 복사가 발생하고, 크로스 컴파일이 어렵다.',
    solution: 'revm은 substrate-bn 크레이트로 순수 Rust 구현한다. FFI 없이 크로스 컴파일이 간단하고, unsafe 코드가 최소화된다.',
    color: '#10b981',
  },
];

export const PRECOMPILE_TABLE = [
  { addr: '0x01', name: 'ecRecover', fork: 'Frontier', gas: '3,000 고정', note: 'secp256k1 서명에서 주소 복구' },
  { addr: '0x02', name: 'SHA256', fork: 'Frontier', gas: '60 + 12/word', note: 'SHA-256 해시' },
  { addr: '0x03', name: 'RIPEMD160', fork: 'Frontier', gas: '600 + 120/word', note: 'RIPEMD-160 해시' },
  { addr: '0x04', name: 'identity', fork: 'Frontier', gas: '15 + 3/word', note: '입력을 그대로 반환 (메모리 복사)' },
  { addr: '0x05', name: 'modexp', fork: 'Byzantium', gas: '복잡 공식', note: '큰 정수 모듈러 지수 연산' },
  { addr: '0x06', name: 'bn128Add', fork: 'Byzantium', gas: '150', note: 'BN254 타원곡선 점 덧셈' },
  { addr: '0x07', name: 'bn128Mul', fork: 'Byzantium', gas: '6,000', note: 'BN254 타원곡선 스칼라 곱셈' },
  { addr: '0x08', name: 'bn128Pairing', fork: 'Byzantium', gas: '34k*n+45k', note: '페어링 검증 (zkSNARK 핵심)' },
  { addr: '0x09', name: 'blake2f', fork: 'Istanbul', gas: 'rounds * 1', note: 'BLAKE2b 압축 함수 (Zcash 호환)' },
  { addr: '0x0a', name: 'KZG Point Eval', fork: 'Cancun', gas: '50,000', note: 'Blob KZG 커밋먼트 검증' },
];
