// Selected excerpt from SP1 v6.10.0 crates/prover/src/verify.rs.

let mut prev_timestamp =
    [SP1Field::zero(), SP1Field::zero(), SP1Field::zero(), SP1Field::one()];

for shard_proof in proof.0.iter() {
    let public_values: &PublicValues<[_; 4], [_; 3], [_; 4], _> =
        shard_proof.public_values.as_slice().borrow();

    if public_values.initial_timestamp != prev_timestamp {
        return Err(MachineVerifierError::InvalidPublicValues("invalid initial timestamp"));
    }
    prev_timestamp = public_values.last_timestamp;
}

let mut prev_next_pc = vk.pc_start;
let halt_pc = [
    SP1Field::from_canonical_u64(sp1_core_executor::HALT_PC),
    SP1Field::zero(),
    SP1Field::zero(),
];
for (i, shard_proof) in proof.0.iter().enumerate() {
    let public_values: &PublicValues<[_; 4], [_; 3], [_; 4], _> =
        shard_proof.public_values.as_slice().borrow();
    if public_values.pc_start != prev_next_pc {
        if i == 0 {
            return Err(MachineVerifierError::InvalidPublicValues(
                "pc_start != vk.pc_start: program counter should start at vk.pc_start",
            ));
        } else {
            return Err(MachineVerifierError::InvalidPublicValues(
                "pc_start != prev_next_pc: pc_start should equal prev_next_pc for all shards",
            ));
        }
    }
    prev_next_pc = public_values.next_pc;
}
if prev_next_pc != halt_pc {
    return Err(MachineVerifierError::InvalidPublicValues(
        "next_pc != HALT_PC: execution should have halted",
    ));
}
