use ff::Field;
use group::Curve;
use std::iter;

use super::{
    vanishing, ChallengeBeta, ChallengeGamma, ChallengeTheta, ChallengeX, ChallengeY, Error,
    VerifyingKey,
};
use crate::arithmetic::CurveAffine;
use crate::poly::{
    commitment::{Blind, Guard, Params, MSM},
    multiopen::{self, VerifierQuery},
};
use crate::transcript::{read_n_points, read_n_scalars, EncodedChallenge, TranscriptRead};

#[cfg(feature = "batch")]
mod batch;
#[cfg(feature = "batch")]
pub use batch::BatchVerifier;

/// Trait representing a strategy for verifying Halo 2 proofs.
pub trait VerificationStrategy<'params, C: CurveAffine> {
    /// The output type of this verification strategy after processing a proof.
    type Output;

    /// Obtains an MSM from the verifier strategy and yields back the strategy's
    /// output.
    fn process<E: EncodedChallenge<C>>(
        self,
        f: impl FnOnce(MSM<'params, C>) -> Result<Guard<'params, C, E>, Error>,
    ) -> Result<Self::Output, Error>;
}

/// A verifier that checks a single proof at a time.
#[derive(Debug)]
pub struct SingleVerifier<'params, C: CurveAffine> {
    msm: MSM<'params, C>,
}

impl<'params, C: CurveAffine> SingleVerifier<'params, C> {
    /// Constructs a new single proof verifier.
    pub fn new(params: &'params Params<C>) -> Self {
        SingleVerifier {
            msm: MSM::new(params),
        }
    }
}

impl<'params, C: CurveAffine> VerificationStrategy<'params, C> for SingleVerifier<'params, C> {
    type Output = ();

    fn process<E: EncodedChallenge<C>>(
        self,
        f: impl FnOnce(MSM<'params, C>) -> Result<Guard<'params, C, E>, Error>,
    ) -> Result<Self::Output, Error> {
        let guard = f(self.msm)?;
        let msm = guard.use_challenges();
        if msm.eval() {
            Ok(())
        } else {
            Err(Error::ConstraintSystemFailure)
        }
    }
}

/// Returns a boolean indicating whether or not the proof is valid
pub fn verify_proof<
    'params,
    C: CurveAffine,
    E: EncodedChallenge<C>,
    T: TranscriptRead<C, E>,
    V: VerificationStrategy<'params, C>,
>(
    params: &'params Params<C>,
    vk: &VerifyingKey<C>,
    strategy: V,
    instances: &[&[&[C::Scalar]]],
    transcript: &mut T,
) -> Result<V::Output, Error> {
    // Check that instances matches the expected number of instance columns
    for instances in instances.iter() {
        if instances.len() != vk.cs.num_instance_columns {
            return Err(Error::InvalidInstances);
        }
    }

    let instance_commitments = instances
        .iter()
        .map(|instance| {
            instance
                .iter()
                .map(|instance| {
                    if instance.len() > params.n as usize - (vk.cs.blinding_factors() + 1) {
                        return Err(Error::InstanceTooLarge);
                    }
                    let mut poly = instance.to_vec();
                    poly.resize(params.n as usize, C::Scalar::ZERO);
                    let poly = vk.domain.lagrange_from_vec(poly);

                    Ok(params.commit_lagrange(&poly, Blind::default()).to_affine())
                })
                .collect::<Result<Vec<_>, _>>()
        })
        .collect::<Result<Vec<_>, _>>()?;

    let num_proofs = instance_commitments.len();

    // Hash verification key into transcript
    vk.hash_into(transcript)?;

    // Sample theta challenge for keeping lookup columns linearly independent
    let theta: ChallengeTheta<_> = transcript.squeeze_challenge_scalar();

    // Sample beta challenge
    let beta: ChallengeBeta<_> = transcript.squeeze_challenge_scalar();

    // Sample gamma challenge
    let gamma: ChallengeGamma<_> = transcript.squeeze_challenge_scalar();

    // Sample y challenge, which keeps the gates linearly independent.
    let y: ChallengeY<_> = transcript.squeeze_challenge_scalar();

    // Sample x challenge, which is used to ensure the circuit is
    // satisfied with high probability.
    let x: ChallengeX<_> = transcript.squeeze_challenge_scalar();

    let vanishing = {
        let xn = x.pow(&[params.n, 0, 0, 0]);

        let blinding_factors = vk.cs.blinding_factors();
        let l_evals = vk.domain.l_i_range(*x, xn, (-((blinding_factors + 1) as i32))..=0);
        let l_last = l_evals[0];
        let l_blind: C::Scalar = l_evals[1..(1 + blinding_factors)]
            .iter()
            .fold(C::Scalar::ZERO, |acc, eval| acc + eval);
        let l_0 = l_evals[1 + blinding_factors];

        // Compute the expected value of h(x)
        let expressions = advice_evals.iter()
            .zip(instance_evals.iter())
            .zip(permutations_evaluated.iter())
            .zip(lookups_evaluated.iter())
            .flat_map(|(((advice_evals, instance_evals), permutation), lookups)| {
                let fixed_evals = &fixed_evals;
                std::iter::empty()
                    .chain(vk.cs.gates.iter().flat_map(move |gate| {
                        gate.polynomials().iter().map(move |poly| {
                            poly.evaluate(
                                &|scalar| scalar,
                                &|_| panic!("virtual selectors are removed during optimization"),
                                &|query| fixed_evals[query.index],
                                &|query| advice_evals[query.index],
                                &|query| instance_evals[query.index],
                                &|a| -a,
                                &|a, b| a + &b,
                                &|a, b| a * &b,
                                &|a, scalar| a * &scalar,
                            )
                        })
                    }))
                    .chain(permutation.expressions(
                        vk, &vk.cs.permutation, &permutations_common,
                        advice_evals, fixed_evals, instance_evals,
                        l_0, l_last, l_blind, beta, gamma, x,
                    ))
            });

        vanishing.verify(params, expressions, y, xn)
    };

    // We are now convinced the circuit is satisfied so long as the
    // polynomial commitments open to the correct values.
    strategy.process(|msm| {
        multiopen::verify_proof(params, transcript, queries, msm).map_err(|_| Error::Opening)
    })
}
