impl AggCircuit for BatchCircuit {
    type AggregatedPublicInputs = VersionedChunkInfo;

    fn verify_commitments(commitment: &ProgramCommitment) {
        assert_eq!(
            commitment.vm,
            child_commitments::VM_COMMIT,
            "mismatch chunk-proof leaf commitment: expected={:?}, got={:?}",
            child_commitments::VM_COMMIT,
            commitment.vm,
        );
        assert_eq!(
            commitment.exe,
            child_commitments::EXE_COMMIT,
            "mismatch chunk-proof exe commitment: expected={:?}, got={:?}",
            child_commitments::EXE_COMMIT,
            commitment.exe,
        );
    }

    fn aggregated_public_inputs(witness: &Self::Witness) -> Vec<Self::AggregatedPublicInputs> {
        let version = Version::from(witness.version);
        witness
            .chunk_infos
            .iter()
            .cloned()
            .map(|chunk_info| (chunk_info, version))
            .collect()
    }

    fn aggregated_pi_hashes(proofs: &[AggregationInput]) -> Vec<B256> {
        proofs
            .iter()
            .map(|proof| {
                let transformed = proof
                    .public_values
                    .iter()
                    .map(|&val| u8::try_from(val).expect("0 < public value < 256"))
                    .collect::<Vec<u8>>();
                B256::from_slice(transformed.as_slice())
            })
            .collect()
    }
}
