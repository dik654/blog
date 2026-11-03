impl Circuit for ChunkCircuit {
    type Witness = ChunkWitness;
    type PublicInputs = VersionedChunkInfo;

    fn read_witness_bytes() -> Vec<u8> {
        read_witnesses()
    }

    fn deserialize_witness(witness_bytes: &[u8]) -> Self::Witness {
        let config = bincode::config::standard();
        let (witness, _): (Self::Witness, _) =
            bincode::serde::decode_from_slice(witness_bytes, config)
                .expect("ChunkCircuit: deserialisation of witness bytes failed");
        witness
    }

    fn validate(witness: Self::Witness) -> Self::PublicInputs {
        let version = Version::from(witness.version);
        assert_eq!(version.fork, witness.fork_name);

        let chunk_info = ChunkInfo::try_from(witness).expect("failed to execute chunk");
        (chunk_info, version)
    }
}
