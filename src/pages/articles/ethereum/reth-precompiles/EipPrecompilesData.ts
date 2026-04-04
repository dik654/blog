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
    name: 'blake2f',
    eip: 'EIP-152',
    fork: 'Istanbul',
    gas: 'rounds * 1',
    purpose: 'Zcash 호환',
    detail: 'BLAKE2b 압축 함수를 직접 실행한다. 입력에 라운드 수를 지정하므로 가스가 라운드에 비례한다. Zcash의 Equihash PoW 검증에 필요한 해시 함수다.',
    color: '#8b5cf6',
  },
  {
    name: 'KZG Point Evaluation',
    eip: 'EIP-4844',
    fork: 'Cancun',
    gas: '50,000 고정',
    purpose: 'Blob 데이터 무결성',
    detail: 'Blob 트랜잭션의 KZG 커밋먼트를 검증한다. L2 롤업이 Blob에 데이터를 게시할 때, 온체인에서 무결성을 확인한다. c-kzg-4844 바인딩을 사용한다.',
    color: '#ef4444',
  },
];

export interface RegistryDesign {
  question: string;
  answer: string;
}

export const REGISTRY_DESIGN: RegistryDesign[] = [
  {
    question: 'OnceLock 지연 초기화를 사용하는 이유는?',
    answer: '하드포크별 프리컴파일 목록은 프로그램 시작 시 한 번만 초기화하면 된다. OnceLock은 스레드 안전하게 한 번만 초기화하고, 이후에는 &\'static 참조를 반환한다. 힙 할당도 한 번뿐이다.',
  },
  {
    question: '하드포크 상속은 어떻게 동작하는가?',
    answer: 'Cancun은 Shanghai 목록을 clone()한 뒤 KZG(0x0a)만 push한다. 각 하드포크가 이전을 상속하므로 중복 코드가 없다. HashMap에 메모리 중복 저장도 없다.',
  },
  {
    question: 'Precompile enum의 Standard vs Env 분기?',
    answer: 'Standard는 순수 함수(fn(&[u8], u64) → Result)로 블록 환경을 참조하지 않는다. Env는 블록 환경(timestamp, block_number 등)이 필요한 프리컴파일이다. pattern matching으로 분기한다.',
  },
];
