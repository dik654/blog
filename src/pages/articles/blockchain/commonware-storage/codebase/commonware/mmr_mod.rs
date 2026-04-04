// commonware/storage/src/merkle/mmr/mod.rs — MMR 핵심 정의

// MMR = 높이가 줄어드는 완전 이진 트리(산)의 연속.
// 각 리프 = 원소의 위치 해시, 내부 노드 = 자식의 위치 해시.
//
//    Height
//      3              14
//                   /    \
//      2        6            13
//             /   \        /    \
//      1     2     5      9     12     17
//           / \   / \    / \   /  \   /  \
//      0   0   1 3   4  7   8 10  11 15  16 18
// Location 0   1 2   3  4   5  6   7  8   9 10

pub mod batch;
pub mod iterator;
pub mod mem;      // 메모리 기반 MMR
pub mod proof;    // 증명 생성/검증
pub mod journaled; // 디스크 기반 MMR (journal 백엔드)

/// MMR 전용 Proof 타입.
pub type Proof<D> = merkle::proof::Proof<Family, D>;

/// 노드 인덱스 (post-order 순회).
pub type Position = merkle::Position<Family>;

/// 리프 인덱스 (삽입 순서).
pub type Location = merkle::Location<Family>;

/// MMR 패밀리 마커.
pub struct Family;

impl merkle::Family for Family {
    /// 최대 노드 수: 2^63 - 1 (리프 2^62개).
    const MAX_NODES: Position = Position::new(0x7FFFFFFFFFFFFFFF);
    const MAX_LEAVES: Location = Location::new(0x4000_0000_0000_0000);

    /// Location → Position 변환: 2*N - popcount(N).
    fn location_to_position(loc: Location) -> Position {
        let n = *loc;
        Position::new(n.checked_mul(2).unwrap() - n.count_ones() as u64)
    }

    /// 자식 위치: left = pos - 2^h, right = pos - 1.
    fn children(pos: Position, height: u32) -> (Position, Position) {
        (pos - (1 << height), pos - 1)
    }
}
