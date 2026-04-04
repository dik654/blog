export const WHY_ALLOY = [
  {
    title: 'Go 기본 타입의 한계',
    desc: 'Geth는 common.Address([20]byte), common.Hash([32]byte), big.Int를 사용한다. big.Int는 임의 정밀도 정수라 내부에 힙 슬라이스를 할당한다. 블록 실행 중 수천 번 생성되면 GC 압박이 누적된다.',
  },
  {
    title: 'Rust의 제로 코스트 추상화',
    desc: 'alloy-primitives는 FixedBytes<N> 하나의 const 제네릭 구조체로 Address(N=20), B256(N=32)를 모두 표현한다. Copy trait을 구현하므로 참조 카운팅 없이 값 복사가 가능하다.',
  },
  {
    title: 'U256: 스택 위의 256비트 정수',
    desc: '4개의 u64 limb로 256비트를 표현한다. Geth의 big.Int와 달리 고정 32바이트이므로 힙 할당이 발생하지 않는다. 잔액, gas_price, storage value 등 EVM의 핵심 데이터 타입이다.',
  },
  {
    title: 'RLP derive 매크로',
    desc: '#[derive(RlpEncodable)]을 붙이면 컴파일 타임에 인코더 코드가 생성된다. Geth의 rlp 패키지는 리플렉션 기반이라 런타임 오버헤드가 있고 LLVM 인라인이 불가능하다.',
  },
];
