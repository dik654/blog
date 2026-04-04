export const RLP_RULES = [
  {
    title: '단일 바이트 (0x00~0x7f)',
    desc: '값 자체가 인코딩 결과다. 접두사가 없다. 예: 0x42 → 0x42. 대부분의 ASCII 문자와 작은 정수가 여기에 해당한다.',
    codeKey: 'rlp-header',
  },
  {
    title: '짧은 문자열 (<=55B)',
    desc: '0x80 + 길이를 접두사로 붙인다. 예: "cat"(3바이트) → 0x83 + "cat". Address(20B)와 B256(32B)가 이 범주에 속한다.',
    codeKey: 'rlp-header',
  },
  {
    title: '리스트 인코딩',
    desc: '0xc0 + 전체 페이로드 길이를 접두사로 붙인다. 트랜잭션은 [nonce, gasPrice, to, value, ...] 리스트로 인코딩된다. 중첩 리스트도 재귀적으로 처리한다.',
    codeKey: 'rlp-header',
  },
  {
    title: 'derive 매크로: 컴파일 타임 코드 생성',
    desc: '#[derive(RlpEncodable)]이 각 필드의 encode()를 순서대로 호출하는 코드를 생성한다. 런타임 리플렉션이 없으므로 LLVM이 함수를 인라인할 수 있다.',
    codeKey: 'rlp-derive',
  },
  {
    title: 'encode_fixed_size: 스택 인코딩',
    desc: 'ArrayVec<u8, MAX_LEN>을 사용해 힙 할당 없이 스택에서 인코딩한다. Address(21B), B256(33B) 등 고정 크기 타입에 최적화된 경로다.',
    codeKey: 'rlp-fixed',
  },
];
