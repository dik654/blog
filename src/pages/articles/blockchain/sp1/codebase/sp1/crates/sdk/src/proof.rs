// Selected excerpt from SP1 v6.10.0 crates/sdk/src/proof.rs and verifier proof types.

pub enum SP1Proof {
    Core(Vec<ShardProof<SP1GlobalContext, SP1PcsProofInner>>),
    Compressed(Box<SP1RecursionProof<SP1GlobalContext, SP1PcsProofInner>>),
    Plonk(PlonkBn254Proof),
    Groth16(Groth16Bn254Proof),
}

pub struct SP1ProofWithPublicValues {
    pub proof: SP1Proof,
    pub public_values: SP1PublicValues,
    pub sp1_version: String,
    pub tee_proof: Option<Vec<u8>>,
}

pub(crate) fn verify_mock_public_inputs(
    vkey: &SP1VerifyingKey,
    public_values: &SP1PublicValues,
    public_inputs: &[String; 5],
) -> Result<()> {
    let expected_vkey_hash = vkey.hash_bn254().to_string();
    if public_inputs[0] != expected_vkey_hash {
        anyhow::bail!("vkey hash mismatch");
    }

    let expected_pv_hash = public_values.hash_bn254().to_string();
    if public_inputs[1] != expected_pv_hash {
        anyhow::bail!("public values hash mismatch");
    }

    if !cfg!(feature = "experimental") && public_inputs[2] != "0" {
        anyhow::bail!("non-zero exit codes require the experimental feature");
    }
    Ok(())
}
