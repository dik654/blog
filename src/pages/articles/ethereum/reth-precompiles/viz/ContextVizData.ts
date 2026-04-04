export const C = { evm: '#6366f1', gas: '#f59e0b', native: '#10b981', err: '#ef4444', crypto: '#8b5cf6' };

export const STEPS = [
  {
    label: 'EVM의 한계: 암호 연산',
    body: '타원곡선 페어링이나 KZG 검증 같은 무거운 암호 연산은 EVM opcode로 가스비가 수백만에 달합니다.',
  },
  {
    label: '문제: 가스비 폭발',
    body: 'Groth16 검증에 3회 페어링이 필요하여 블록 가스 한도의 1/3을 소모합니다.',
  },
  {
    label: '문제: 하드포크마다 추가',
    body: '하드포크마다 새 프리컴파일이 등장하여 레지스트리 관리와 가스 정확성이 핵심입니다.',
  },
  {
    label: '해결: 주소 0x01~0x0a 매핑',
    body: '특수 주소 호출 시 네이티브 함수를 직접 실행하여 수백~수천 배 저렴합니다.',
  },
  {
    label: '해결: revm 순수 Rust 구현',
    body: 'Geth의 CGo 바인딩 대신 순수 Rust로 구현하여 FFI 없이 크로스 컴파일이 가능합니다.',
  },
];
