// commonware/storage/src/merkle/mmr/proof.rs — 증명 생성 & 검증

/// range_proof — 연속 리프 범위의 포함 증명 생성.
pub async fn range_proof<D, H, S>(
    hasher: &H,
    mmr: &S,
    range: Range<Location>,
) -> Result<Proof<D>, Error> {
    let leaves = Location::try_from(mmr.size().await)?;
    // Blueprint = fold_prefix(이전 peak들) + fetch_nodes(형제)
    let bp = Blueprint::new(leaves, range)?;

    let mut digests: Vec<D> = Vec::new();
    // 1) fold_prefix: 범위 이전 peak들 → 하나로 접기
    if !bp.fold_prefix.is_empty() {
        let futs = bp.fold_prefix.iter().map(|&pos| mmr.get_node(pos));
        let results = try_join_all(futs).await?;
        let mut acc = results[0].ok_or(Error::ElementPruned(bp.fold_prefix[0]))?;
        for (i, &r) in results.iter().enumerate().skip(1) {
            let d = r.ok_or(Error::ElementPruned(bp.fold_prefix[i]))?;
            acc = hasher.fold(&acc, &d); // peak 접기
        }
        digests.push(acc);
    }
    // 2) fetch_nodes: 경로 형제 노드들
    let futs = bp.fetch_nodes.iter().map(|&pos| mmr.get_node(pos));
    let results = try_join_all(futs).await?;
    for (i, result) in results.into_iter().enumerate() {
        digests.push(result.ok_or(Error::ElementPruned(bp.fetch_nodes[i]))?);
    }
    Ok(Proof { leaves, digests })
}

/// verify_range_inclusion — 증명 검증.
/// 루트를 재구성하여 기대 루트와 비교.
pub fn verify_range_inclusion_and_extract_digests<H, E>(
    &self, hasher: &H, elements: &[E],
    start_loc: Location, root: &D,
) -> Result<Vec<(Position, D)>, Error> {
    let mut collected = Vec::new();
    let reconstructed = self.reconstruct_root_collecting(
        hasher, elements, start_loc, Some(&mut collected),
    )?;
    if reconstructed != *root {
        return Err(Error::RootMismatch);
    }
    Ok(collected)
}
