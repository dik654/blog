pub fn verify_evm_proof(
    &self,
    evm_proof: &OpenVmEvmProof,
    vk: &[u8],
) -> eyre::Result<u64> {
    let prog_commit = serialize_vk::deserialize(vk);

    let evm_exe_commit: [openvm_sdk::F; 8] = evm_proof.app_commit.app_exe_commit.into();
    let evm_exe_commit_u32: [u32; 8] =
        evm_exe_commit.map(|f| f.as_canonical_u32());

    let evm_vm_commit: [openvm_sdk::F; 8] = evm_proof.app_commit.app_vm_commit.into();
    let evm_vm_commit_u32: [u32; 8] =
        evm_vm_commit.map(|f| f.as_canonical_u32());

    if evm_exe_commit_u32 != prog_commit.exe {
        eyre::bail!("evm: mismatch EXE commitment");
    }
    if evm_vm_commit_u32 != prog_commit.vm {
        eyre::bail!("evm: mismatch VM commitment");
    }

    let gas = crate::evm::verify_evm_proof(&self.evm_verifier, evm_proof)
        .map_err(|e| eyre::eyre!("evm execution failed: {e}"))?;

    Ok(gas)
}
