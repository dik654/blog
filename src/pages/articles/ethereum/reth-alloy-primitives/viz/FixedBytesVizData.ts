export const C = {
  fixed: '#8b5cf6', addr: '#6366f1', b256: '#10b981',
  deref: '#f59e0b', copy: '#0ea5e9', dim: '#94a3b8',
};

export const STEPS = [
  {
    label: 'FixedBytes<N> — const 제네릭 구조체',
    body: 'N이 컴파일 타임에 결정되는 [u8; N] 래퍼\n#[repr(transparent)] — 메모리 레이아웃이 내부 배열과 동일',
  },
  {
    label: 'Deref<Target=[u8;N]> → AsRef<[u8]> 체인',
    body: '&FixedBytes<N>에서 &[u8;N]으로 자동 역참조\n슬라이스의 len(), iter(), contains() 등을 직접 호출 가능',
  },
  {
    label: 'Address = FixedBytes<20> 뉴타입 래퍼',
    body: 'Address(FixedBytes<20>) — 단일 필드 구조체\n타입 안전성: B256과 혼용 불가 (컴파일 에러)',
  },
  {
    label: 'B256 = FixedBytes<32> 뉴타입 래퍼',
    body: 'B256(FixedBytes<32>) — 해시값 전용 타입\nAddress와 동일한 FixedBytes<N> 메서드 공유',
  },
  {
    label: 'Copy + Eq + Hash + Ord 자동 구현',
    body: '#[derive] 매크로가 모든 trait을 자동 생성\nCopy: 스택 복사, Hash: HashMap 키 사용 가능',
  },
];

export const STEP_REFS: Record<number, string> = {
  0: 'fixed-bytes-struct', 1: 'fixed-bytes-deref',
  2: 'fixed-bytes-addr', 3: 'fixed-bytes-addr',
  4: 'fixed-bytes-struct',
};
