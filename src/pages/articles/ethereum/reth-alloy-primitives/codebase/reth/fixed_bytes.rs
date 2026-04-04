// alloy-primitives — FixedBytes<N> 내부 구현

/// const 제네릭으로 N이 컴파일 타임에 결정되는 고정 크기 바이트 배열
#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct FixedBytes<const N: usize>(pub [u8; N]);

/// 슬라이스 메서드 자동 위임 — &FixedBytes<N> → &[u8; N]
impl<const N: usize> Deref for FixedBytes<N> {
    type Target = [u8; N];
    fn deref(&self) -> &[u8; N] { &self.0 }
}

impl<const N: usize> AsRef<[u8]> for FixedBytes<N> {
    fn as_ref(&self) -> &[u8] { &self.0 }
}

/// 뉴타입 래퍼 — Address는 FixedBytes<20>의 단일 필드 구조체
#[repr(transparent)]
pub struct Address(pub FixedBytes<20>);

/// B256도 동일한 패턴 — FixedBytes<32>의 뉴타입 래퍼
#[repr(transparent)]
pub struct B256(pub FixedBytes<32>);

impl Address {
    pub const ZERO: Self = Self(FixedBytes([0u8; 20]));
    pub fn as_slice(&self) -> &[u8] { self.0.as_ref() }
}
