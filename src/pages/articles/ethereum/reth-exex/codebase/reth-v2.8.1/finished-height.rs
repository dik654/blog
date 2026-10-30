// Source excerpt: Reth v2.8.1
// crates/exex/exex/src/event.rs + manager.rs

pub enum ExExEvent {
    // ExEx가 처리했고 앞으로 더 이른 블록이 필요하지 않은 위치입니다.
    // Reorg에서는 이 높이가 내려갈 수도 있습니다.
    FinishedHeight(BlockNumHash),
}

// 모든 ExEx가 보낸 number 가운데 가장 낮은 값을 공개합니다.
let finished_height = self.exex_handles.iter_mut().try_fold(
    u64::MAX,
    |current, exex| {
        exex.finished_height
            .map_or(Err(()), |height| Ok(height.number.min(current)))
    },
);

// WAL 정리는 number만 보지 않습니다.
// 각 FinishedHeight hash가 canonical인지 먼저 확인합니다.
if exex_finished_heights.iter().all(|(_, _, canonical)| *canonical) {
    // 모든 ExEx 위치와 consensus finalized header 가운데 가장 낮은 위치입니다.
    let boundary = exex_finished_heights
        .iter()
        .filter_map(|(_, height, _)| *height)
        .chain([finalized_header.num_hash()])
        .min_by_key(|height| height.number)
        .unwrap();

    self.wal.finalize(boundary)?;
}
