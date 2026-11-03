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
