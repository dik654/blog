// Copyright 2026 RISC Zero, Inc.
//
// Licensed under the Apache License, Version 2.0, <LICENSE-APACHE or
// http://apache.org/licenses/LICENSE-2.0> or the MIT license <LICENSE-MIT or
// http://opensource.org/licenses/MIT>, at your option. This file may not be
// copied, modified, or distributed except according to those terms.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0 OR MIT

pub mod zkr;

use std::{
    collections::{BTreeMap, VecDeque},
    fmt::Debug,
    sync::Mutex,
};

use anyhow::{Context, Result, anyhow, bail, ensure};
use risc0_binfmt::read_sha_halfs;
use risc0_circuit_recursion::{
    CircuitImpl,
    control_id::BN254_IDENTITY_CONTROL_ID,
    prove::{DigestKind, RecursionReceipt},
};
use risc0_zkp::{
    adapter::{CircuitInfo, PROOF_SYSTEM_INFO},
    core::{
        digest::{DIGEST_SHORTS, Digest},
        hash::{hash_suite_from_name, poseidon2::Poseidon2HashSuite},
    },
    field::baby_bear::BabyBearElem,
};

use crate::{
    Assumptions, MaybePruned, Output, ProverOpts, ReceiptClaim, WorkClaim,
    claim::{
        Unknown,
        merge::Merge,
        receipt::{Assumption, UnionClaim},
    },
    receipt::{
        SegmentReceipt, SuccinctReceipt, SuccinctReceiptVerifierParameters,
        merkle::{MerkleGroup, MerkleProof},
    },
    sha::Digestible,
};

use risc0_circuit_recursion::prove::Program;

/// Number of rows to use for the recursion circuit witness as a power of 2.
pub const RECURSION_PO2: usize = 18;

pub(crate) type ZkrRegistryEntry = Box<dyn Fn() -> Result<Program> + Send + 'static>;

pub(crate) type ZkrRegistry = BTreeMap<Digest, ZkrRegistryEntry>;

/// A registry to look up programs by control ID.
pub(crate) static ZKR_REGISTRY: Mutex<ZkrRegistry> = Mutex::new(BTreeMap::new());

/// Run the lift program to transform an rv32im segment receipt into a recursion receipt.
///
/// The lift program verifies the rv32im circuit STARK proof inside the recursion circuit,
/// resulting in a recursion circuit STARK proof. This recursion proof has a single
/// constant-time verification procedure, with respect to the original segment length, and is then
/// used as the input to all other recursion programs (e.g. join, resolve, and identity_p254).
pub fn lift(segment_receipt: &SegmentReceipt) -> Result<SuccinctReceipt<ReceiptClaim>> {
    tracing::debug!("Proving lift: claim = {:#?}", segment_receipt.claim);
    let mut prover = Prover::new_lift(segment_receipt, ProverOpts::succinct())?;

    let receipt = prover.prover.run().context("lift recursion proof")?;
    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving lift finished: decoded claim = {claim_decoded:#?}");

    let claim = claim_decoded.merge(&segment_receipt.claim)?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the lift program to create a succinct work claim receipt from a segment receipt.
///
/// Similar to [`lift`], but additionally tracks verifiable work by computing the work value
/// from the segment proof and embedding it in the resulting work claim.
pub fn lift_povw(
    segment_receipt: &SegmentReceipt,
) -> Result<SuccinctReceipt<WorkClaim<ReceiptClaim>>> {
    tracing::debug!("Proving lift_povw: claim = {:#?}", segment_receipt.claim);
    let mut prover = Prover::new_lift_povw(segment_receipt, ProverOpts::succinct())?;

    let receipt = prover.prover.run()?;
    let mut out_stream = receipt.out_stream();
    tracing::debug!("Proving lift_povw finished: out = {out_stream:?}");
    let claim_decoded = WorkClaim::<ReceiptClaim>::decode_from_seal(&mut out_stream)?;
    tracing::debug!("Proving lift_povw finished: decoded claim = {claim_decoded:#?}");

    // Merge the full claim from the segment receipt into the decoded work claim.
    let mut claim = claim_decoded;
    claim
        .claim
        .merge_with(&segment_receipt.claim.clone().into())
        .context("failed to merge segment receipt claim into decode claim")?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the join program to compress two receipts of the same session into one.
///
/// By repeated application of the join program, any number of receipts for execution spans within
/// the same session can be compressed into a single receipt for the entire session.
pub fn join(
    a: &SuccinctReceipt<ReceiptClaim>,
    b: &SuccinctReceipt<ReceiptClaim>,
) -> Result<SuccinctReceipt<ReceiptClaim>> {
    tracing::debug!("Proving join: a.claim = {:#?}", a.claim);
    tracing::debug!("Proving join: b.claim = {:#?}", b.claim);

    let mut prover = Prover::new_join(a, b, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;

    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving join finished: decoded claim = {claim_decoded:#?}");

    // Compute the expected claim and merge it with the decoded claim, checking that they match.
    let claim = claim_decoded.merge(&a.claim.join(&b.claim)?.value()?)?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the join program to compress two work claim receipts of the same session into one.
///
/// Similar to [`join`], but operates on work claim receipts and combines their work values
/// while ensuring the consumed nonce ranges are disjoint.
pub fn join_povw(
    a: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
    b: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
) -> Result<SuccinctReceipt<WorkClaim<ReceiptClaim>>> {
    tracing::debug!("Proving join_povw: a.claim = {:#?}", a.claim);
    tracing::debug!("Proving join_povw: b.claim = {:#?}", b.claim);

    let mut prover = Prover::new_join_povw(a, b, false, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;

    let claim_decoded = WorkClaim::<ReceiptClaim>::decode_from_seal(&mut receipt.out_stream())?;
    tracing::debug!("Proving join_povw finished: decoded claim = {claim_decoded:#?}");

    // Compute the expected claim and merge it with the decoded claim, checking that they match.
    let claim = claim_decoded.merge(&a.claim.join(&b.claim)?.value()?)?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the join_unwrap program to compress two work claim receipts into a regular receipt.
///
/// This combines the functionality of [`join_povw`] and [`unwrap_povw`] in a single recursion
/// step, with reduced latency relative to running a separate unwrap.
pub fn join_unwrap_povw(
    a: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
    b: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
) -> Result<SuccinctReceipt<ReceiptClaim>> {
    tracing::debug!("Proving join_unwrap_povw: a.claim = {:#?}", a.claim);
    tracing::debug!("Proving join_unwrap_povw: b.claim = {:#?}", b.claim);

    let mut prover = Prover::new_join_povw(a, b, true, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;

    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving join_unwrap_povw finished: decoded claim = {claim_decoded:#?}");

    // Compute the expected claim and merge it with the decoded claim, checking that they match.
    let claim = claim_decoded.merge(&a.claim.join(&b.claim)?.value()?.claim.value()?)?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the union program to compress two succinct receipts into one.
///
/// By repeated application of the union program, any number of succinct
/// receipts can be compressed into a single receipt.
pub fn union(
    a: &SuccinctReceipt<Unknown>,
    b: &SuccinctReceipt<Unknown>,
) -> Result<SuccinctReceipt<UnionClaim>> {
    // NOTE: This will run into issues if the assumption is made with a control root of zero. Right
    // now, this is only used for keccak so this issue has not been hit.
    let a_assumption = a.to_assumption(false)?.digest();
    let b_assumption = b.to_assumption(false)?.digest();

    let ((left_assumption, left_receipt), (right_assumption, right_receipt)) =
        if a_assumption <= b_assumption {
            ((a_assumption, a), (b_assumption, b))
        } else {
            ((b_assumption, b), (a_assumption, a))
        };

    tracing::debug!("Proving union: left assumption = {:#?}", left_assumption);
    tracing::debug!("Proving union: right assumption = {:#?}", right_assumption);

    let mut prover = Prover::new_union(left_receipt, right_receipt, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;

    let claim = UnionClaim {
        left: left_assumption,
        right: right_assumption,
    };

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the resolve program to remove an assumption from a conditional receipt upon verifying a
/// receipt proving the validity of the assumption.
///
/// By applying the resolve program, a conditional receipt (i.e. a receipt for an execution using
/// the `env::verify` API to logically verify a receipt) can be made into an unconditional receipt.
pub fn resolve<Claim>(
    conditional: &SuccinctReceipt<ReceiptClaim>,
    assumption: &SuccinctReceipt<Claim>,
) -> Result<SuccinctReceipt<ReceiptClaim>>
where
    Claim: risc0_binfmt::Digestible + Debug,
{
    tracing::debug!(
        "Proving resolve: conditional.claim = {:#?}",
        conditional.claim,
    );
    tracing::debug!(
        "Proving resolve: assumption.claim = {:#?}",
        assumption.claim,
    );

    let mut prover = Prover::new_resolve(conditional, assumption, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;
    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving resolve finished: decoded claim = {claim_decoded:#?}");

    let claim = conditional
        .claim
        .as_value()
        .context("conditional receipt claim is pruned")?
        .resolve(&assumption.claim)
        .context("failed to compute resolved claim")?
        .merge(&claim_decoded)
        .context("failed to merge resolved and decoded claims")?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the resolve program to remove an assumption from a conditional work claim receipt.
///
/// Similar to [`resolve`], but operates on work claim receipts while preserving the work value
/// from the conditional receipt.
pub fn resolve_povw<Claim>(
    conditional: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
    assumption: &SuccinctReceipt<Claim>,
) -> Result<SuccinctReceipt<WorkClaim<ReceiptClaim>>>
where
    Claim: risc0_binfmt::Digestible + Debug,
{
    tracing::debug!(
        "Proving resolve_povw: conditional.claim = {:#?}",
        conditional.claim,
    );
    tracing::debug!(
        "Proving resolve_povw: assumption.claim = {:#?}",
        assumption.claim,
    );

    let mut prover =
        Prover::new_resolve_povw(conditional, assumption, false, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;
    let claim_decoded = WorkClaim::<ReceiptClaim>::decode_from_seal(&mut receipt.out_stream())?;
    tracing::debug!("Proving resolve_povw finished: decoded claim = {claim_decoded:#?}");

    let claim = conditional
        .claim
        .as_value()
        .context("conditional receipt povw claim is pruned")?
        .resolve(&assumption.claim)
        .context("failed to compute resolved claim")?
        .merge(&claim_decoded)
        .context("failed to merge resolved and decoded claims")?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the resolve_unwrap program to remove an assumption from a conditional work claim receipt.
///
/// This combines the functionality of [`resolve_povw`] and [`unwrap_povw`] in a single recursion
/// step, with reduced latency relative to running a separate unwrap.
pub fn resolve_unwrap_povw<Claim>(
    conditional: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
    assumption: &SuccinctReceipt<Claim>,
) -> Result<SuccinctReceipt<ReceiptClaim>>
where
    Claim: risc0_binfmt::Digestible + Debug,
{
    tracing::debug!(
        "Proving resolve_unwrap_povw: conditional.claim = {:#?}",
        conditional.claim,
    );
    tracing::debug!(
        "Proving resolve_unwrap_povw: assumption.claim = {:#?}",
        assumption.claim,
    );

    let mut prover =
        Prover::new_resolve_povw(conditional, assumption, true, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;
    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving resolve_unwrap_povw finished: decoded claim = {claim_decoded:#?}");

    let claim = conditional
        .claim
        .as_value()
        .context("conditional receipt povw claim is pruned")?
        .claim
        .as_value()
        .context("conditional receipt claim is pruned")?
        .resolve(&assumption.claim)
        .context("failed to compute resolved claim")?
        .merge(&claim_decoded)
        .context("failed to merge resolved and decoded claims")?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Run the unwrap program to convert a work claim receipt to a regular receipt claim.
///
/// This removes the work tracking wrapper from a receipt, producing a standard receipt
/// that can be sent to verifiers of the underlying claim.
pub fn unwrap_povw(
    a: &SuccinctReceipt<WorkClaim<ReceiptClaim>>,
) -> Result<SuccinctReceipt<ReceiptClaim>> {
    tracing::debug!("Proving unwrap_povw: a.claim = {:#?}", a.claim);

    let mut prover = Prover::new_unwrap_povw(a, ProverOpts::succinct())?;
    let receipt = prover.prover.run()?;

    let claim_decoded = ReceiptClaim::decode(&mut receipt.out_stream())?;
    tracing::debug!("Proving unwrap_povw finished: decoded claim = {claim_decoded:#?}");

    // Compute the expected claim and merge it with the decoded claim, checking that they match.
    let claim = MaybePruned::Value(claim_decoded).merge(&a.claim.as_value()?.claim)?;

    make_succinct_receipt(prover, receipt, claim)
}

/// Prove the verification of a recursion receipt using the Poseidon254 hash function for FRI.
///
/// The identity_p254 program is used as the last step in the prover pipeline before running the
/// Groth16 prover. In Groth16 over BN254, it is much more efficient to verify a STARK that was
/// produced with Poseidon over the BN254 base field compared to using Poseidon over BabyBear.
pub fn identity_p254(
    inner: &SuccinctReceipt<ReceiptClaim>,
) -> Result<SuccinctReceipt<ReceiptClaim>> {
    tracing::debug!("identity_p254");

    let opts = ProverOpts::succinct()
        .with_hashfn("poseidon_254".to_string())
        .with_control_ids(vec![BN254_IDENTITY_CONTROL_ID]);
    let mut prover = Prover::new_identity(inner, opts)?;
    let receipt = prover.prover.run()?;
    let claim =
        MaybePruned::Value(ReceiptClaim::decode(&mut receipt.out_stream())?).merge(&inner.claim)?;

    // Include an inclusion proof for control_id to allow verification against a root.
    let hashfn = prover.opts.hash_suite()?.hashfn;
    let control_inclusion_proof = prover.control_inclusion_proof()?;
    let control_root = control_inclusion_proof.root(&prover.control_id, hashfn.as_ref());
    let params = SuccinctReceiptVerifierParameters {
        control_root,
        inner_control_root: Some(inner.control_root()?),
        proof_system_info: PROOF_SYSTEM_INFO,
        circuit_info: CircuitImpl::CIRCUIT_INFO,
    };

    Ok(SuccinctReceipt {
        seal: receipt.seal,
        hashfn: prover.opts.hashfn.clone(),
        control_id: prover.control_id,
        control_inclusion_proof,
        claim,
        verifier_parameters: params.digest(),
    })
}

/// Prove the specified program identified by the `control_id` using the specified `input`.
pub fn prove_zkr(
    program: Program,
    control_id: &Digest,
    allowed_control_ids: Vec<Digest>,
    input: &[u8],
) -> Result<SuccinctReceipt<Unknown>> {
    let opts = ProverOpts::succinct().with_control_ids(allowed_control_ids);
    let mut prover = Prover::new(program, *control_id, opts.clone());
    prover.add_input(bytemuck::cast_slice(input));

    tracing::debug!("Running prover");
    let receipt = prover.run()?;

    tracing::trace!("zkr receipt: {receipt:?}");

    // Read the claim digest from the second of the global output slots.
    let claim_digest: Digest = read_sha_halfs(&mut VecDeque::from_iter(
        receipt.seal[DIGEST_SHORTS..2 * DIGEST_SHORTS]
            .iter()
            .map(|x| BabyBearElem::new_raw(*x).as_u32()),
    ))?;

    let hashfn = opts.hash_suite()?.hashfn;
    let control_group = MerkleGroup::new(opts.control_ids.clone())?;
    let control_root = control_group.calc_root(hashfn.as_ref());
    let control_inclusion_proof = control_group.get_proof(control_id, hashfn.as_ref())?;

    let verifier_parameters = SuccinctReceiptVerifierParameters {
        control_root,
        inner_control_root: None,
        proof_system_info: PROOF_SYSTEM_INFO,
        circuit_info: CircuitImpl::CIRCUIT_INFO,
    }
    .digest();

    Ok(SuccinctReceipt {
        seal: receipt.seal,
        hashfn: opts.hashfn,
        control_id: *control_id,
        control_inclusion_proof,
        claim: MaybePruned::<Unknown>::Pruned(claim_digest),
        verifier_parameters,
    })
}

/// Prove the specified program identified by the `control_id` using the specified `input`.
pub fn prove_registered_zkr(
    control_id: &Digest,
    allowed_control_ids: Vec<Digest>,
    input: &[u8],
) -> Result<SuccinctReceipt<Unknown>> {
    let zkr = get_registered_zkr(control_id)?;
    prove_zkr(zkr, control_id, allowed_control_ids, input)
}

/// Registers a function to retrieve a recursion program (zkr) based on a control id.
pub fn register_zkr(
    control_id: &Digest,
    get_program_fn: impl Fn() -> Result<Program> + Send + 'static,
) -> Option<ZkrRegistryEntry> {
    let mut registry = ZKR_REGISTRY.lock().unwrap();
    registry.insert(*control_id, Box::new(get_program_fn))
}

/// Returns a registered ZKR program, or an error if not found.
pub fn get_registered_zkr(control_id: &Digest) -> Result<Program> {
    let registry = ZKR_REGISTRY.lock().unwrap();
    registry
        .get(control_id)
        .map(|f| f())
        .unwrap_or_else(|| bail!("Control id {control_id} unregistered"))
}

/// Private utility to make a SuccinctReceipt from a RecursionReceipt, the Prover and the Claim.
fn make_succinct_receipt<Claim>(
    prover: Prover,
    receipt: RecursionReceipt,
    claim: impl Into<MaybePruned<Claim>>,
) -> Result<SuccinctReceipt<Claim>> {
    Ok(SuccinctReceipt {
        seal: receipt.seal,
        hashfn: prover.opts.hashfn.clone(),
        control_id: prover.control_id,
        control_inclusion_proof: prover.control_inclusion_proof()?,
        claim: claim.into(),
        // TODO(victor): This should be derived from the ProverOpts instead of being default.
        verifier_parameters: SuccinctReceiptVerifierParameters::default().digest(),
    })
}

/// Prover for zkVM use of the recursion circuit.
pub struct Prover {
    prover: risc0_circuit_recursion::prove::Prover,
    control_id: Digest,
    opts: ProverOpts,
}

/// Utility macro to compress repeated checks that a receipt uses the poseidon2 hash.
macro_rules! ensure_poseidon2 {
    ($receipt:expr) => {
        ensure!(
            $receipt.hashfn == "poseidon2",
            "recursion programs only supports poseidon2 hashfn; received {}",
            $receipt.hashfn
        );
    };
}

impl Prover {
    pub(crate) fn new(program: Program, control_id: Digest, opts: ProverOpts) -> Self {
        #[cfg(all(test, gpu_accel))]
        gpu_guard::assert_gpu_semaphore_held();

        Self {
            prover: risc0_circuit_recursion::prove::Prover::new(program, &opts.hashfn),
            control_id,
            opts,
        }
    }

    /// Returns the control id of the recursion VM program being proven.
    pub fn control_id(&self) -> &Digest {
        &self.control_id
    }

    /// Returns a Merkle inclusion proof of this prover's control ID in the set of allowed IDs.
    pub fn control_inclusion_proof(&self) -> Result<MerkleProof> {
        let hashfn = self
            .opts
            .hash_suite()
            .context("ProverOpts contains invalid hashfn")?
            .hashfn;
        MerkleGroup::new(self.opts.control_ids.clone())?
            .get_proof(&self.control_id, hashfn.as_ref())
    }

    /// Initialize a recursion prover with the lift program to transform an rv32im segment receipt
    /// into a recursion receipt.
    pub fn new_lift(segment: &SegmentReceipt, opts: ProverOpts) -> Result<Self> {
        Self::new_lift_inner(segment, opts, false)
    }

    /// Create a prover job for the lift program that produces a work claim receipt.
    pub fn new_lift_povw(segment: &SegmentReceipt, opts: ProverOpts) -> Result<Self> {
        Self::new_lift_inner(segment, opts, true)
    }

    /// Instantiate a lift program, with the option of PoVW or not.
    fn new_lift_inner(segment: &SegmentReceipt, opts: ProverOpts, povw: bool) -> Result<Self> {
        ensure_poseidon2!(segment);

        let inner_hash_suite = hash_suite_from_name(&segment.hashfn)
            .ok_or_else(|| anyhow!("unsupported hash function: {}", segment.hashfn))?;
        let allowed_ids = MerkleGroup::new(opts.control_ids.clone())?;
        let merkle_root = allowed_ids.calc_root(inner_hash_suite.hashfn.as_ref());

        let claim = risc0_circuit_rv32im::Claim::decode(&segment.seal)?;

        // Instantiate the prover with the lift recursion program and its control ID.
        let (program, control_id) = zkr::lift(claim.po2 as usize, povw)?;
        let mut prover = Prover::new(program, control_id, opts);

        prover.add_input_digest(&merkle_root, DigestKind::Poseidon2);
        prover.add_input(&segment.seal[2..]);

        Ok(prover)
    }

    /// Initialize a recursion prover with the join program to compress two receipts of the same
    /// session into one.
    pub fn new_join(
        a: &SuccinctReceipt<ReceiptClaim>,
        b: &SuccinctReceipt<ReceiptClaim>,
        opts: ProverOpts,
    ) -> Result<Self> {
        ensure_poseidon2!(a);
        ensure_poseidon2!(b);

        let (program, control_id) = zkr::join(&opts.hashfn)?;
        let mut prover = Prover::new(program, control_id, opts);

        let merkle_root = a.control_root()?;
        ensure!(
            merkle_root == b.control_root()?,
            "merkle roots for a and b do not match: {} != {}",
            merkle_root,
            b.control_root()?
        );

        prover.add_input_digest(&merkle_root, DigestKind::Poseidon2);
        prover.add_succinct_rv32im_receipt(a)?;
        prover.add_succinct_rv32im_receipt(b)?;
        Ok(prover)
    }

    /// Run the prover, producing a receipt of execution for the recursion circuit over the loaded
    /// program and input.
    pub fn run(&mut self) -> Result<RecursionReceipt> {
        self.prover.run()
    }
}

fn check_resolve_assumption<Claim>(
    cond: &MaybePruned<ReceiptClaim>,
    assum: &MaybePruned<Claim>,
) -> Result<(Assumption, Assumptions, Output)>
where
    Claim: risc0_binfmt::Digestible + Debug,
{
    let output = cond
        .as_value()
        .context("cannot resolve conditional receipt with pruned claim")?
        .output
        .as_value()
        .context("cannot resolve conditional receipt with pruned output")?
        .as_ref()
        .ok_or_else(|| anyhow!("cannot resolve conditional receipt with no output"))?
        .clone();

    let assumptions = output
        .assumptions
        .clone()
        .value()
        .context("cannot resolve conditional receipt with pruned assumptions")?;
    let head: Assumption = assumptions
        .0
        .first()
        .ok_or_else(|| anyhow!("cannot resolve conditional receipt with no assumptions"))?
        .as_value()
        .context("cannot resolve conditional receipt with pruned head assumption")?
        .clone();

    ensure!(
        head.claim == assum.digest(),
        "assumption receipt claim does not match head of assumptions list"
    );

    let mut assumptions_tail = assumptions;
    assumptions_tail.resolve(&head.digest())?;

    Ok((head, assumptions_tail, output))
}
