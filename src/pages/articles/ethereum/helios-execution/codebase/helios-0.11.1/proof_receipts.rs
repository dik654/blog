// a16z/helios 0.11.1 · commit 204c998a927348e1c000a664f08d5b37b1b0d924
// Source excerpt: core/src/execution/proof.rs lines 202-218
/// Calculate the receipts root hash from given list of receipts
/// and verify it against the given block's receipts root.
pub fn verify_block_receipts<N: NetworkSpec>(
    receipts: &[N::ReceiptResponse],
    block: &N::BlockResponse,
) -> Result<()> {
    let receipts_encoded = receipts.iter().map(N::encode_receipt).collect::<Vec<_>>();
    let expected_receipt_root = ordered_trie_root_noop_encoder(&receipts_encoded);

    if expected_receipt_root != block.header().receipts_root() {
        return Err(
            ExecutionError::BlockReceiptsRootMismatch(block.header().number().into()).into(),
        );
    }

    Ok(())
}
