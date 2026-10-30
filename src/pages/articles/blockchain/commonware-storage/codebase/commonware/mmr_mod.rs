// commonware/storage/src/merkle/mmr/mod.rs · v2026.9.0

// 11개 element를 append하면 19개 node와 세 peak가 생깁니다.
//
// Height
//   3              14
//   2        6            13
//   1     2     5      9     12     17
//   0   0   1 3   4  7   8 10  11 15  16 18
//
// Location 0   1 2   3  4   5  6   7  8   9 10

/// MMR node의 post-order index입니다.
pub type Position = merkle::Position<Family>;

/// Leaf의 0-based 삽입 순서입니다.
pub type Location = merkle::Location<Family>;

/// MMR layout 규칙을 선택하는 marker입니다.
pub struct Family;

impl merkle::Family for Family {
    /// 최대 2^63−1 nodes와 2^62 leaves를 허용합니다.
    const MAX_NODES: Position = Position::new(0x7FFF_FFFF_FFFF_FFFF);
    const MAX_LEAVES: Location = Location::new(0x4000_0000_0000_0000);

    /// Leaf location N을 전체 node position으로 바꿉니다.
    fn location_to_position(loc: Location) -> Position {
        let n = *loc;
        Position::new(
            n.checked_mul(2)
                .expect("should not overflow for valid leaf index")
                - n.count_ones() as u64,
        )
    }

    /// Peak 아래 두 child의 position을 계산합니다.
    fn children(pos: Position, height: u32) -> (Position, Position) {
        (pos - (1 << height), pos - 1)
    }
}
