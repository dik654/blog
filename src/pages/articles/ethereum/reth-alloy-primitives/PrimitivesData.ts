export const TYPE_CARDS = [
  {
    title: 'Address — FixedBytes<20>',
    size: '20 bytes',
    color: 'indigo',
    desc: '이더리움 주소. Keccak256 해시의 마지막 20바이트다. FixedBytes<20>의 뉴타입 래퍼로, Copy + Eq + Hash trait을 구현한다.',
    codeKey: 'primitives-addr',
    versus: 'Geth: common.Address — [20]byte 타입 앨리어스',
  },
  {
    title: 'B256 — FixedBytes<32>',
    size: '32 bytes',
    color: 'emerald',
    desc: '32바이트 해시값. 블록 해시, 트랜잭션 해시, 상태 루트에 사용된다. Address와 동일한 FixedBytes<N> 기반이므로 공통 메서드를 코드 중복 없이 공유한다.',
    codeKey: 'primitives-addr',
    versus: 'Geth: common.Hash — [32]byte 타입 앨리어스',
  },
  {
    title: 'U256 — [u64; 4] limbs',
    size: '32 bytes',
    color: 'amber',
    desc: '256비트 부호 없는 정수. little-endian 순서의 4개 u64 limb로 구성된다. 잔액(wei), gas_price, storage value 등 EVM 스택 워드에 대응한다.',
    codeKey: 'primitives-u256',
    versus: 'Geth: big.Int — 임의 정밀도, 힙 슬라이스 할당',
  },
];

export const GETH_VS_ALLOY = [
  { attr: '메모리 할당', geth: '힙 (big.Int 슬라이스)', alloy: '스택 (고정 크기 배열)' },
  { attr: 'GC 압박', geth: '높음 — 블록당 수천 객체', alloy: '없음 — 스택 자동 해제' },
  { attr: '타입 안전성', geth: '바이트 앨리어스 — 혼용 가능', alloy: '뉴타입 패턴 — 컴파일 에러' },
  { attr: '코드 재사용', geth: '별도 타입 → 중복 구현', alloy: 'FixedBytes<N> 제네릭 공유' },
  { attr: 'Copy semantics', geth: 'big.Int는 포인터 공유', alloy: 'Copy trait — 값 복사' },
];
