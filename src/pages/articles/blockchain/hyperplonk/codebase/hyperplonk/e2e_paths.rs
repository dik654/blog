// generate pk and vks
let (pk, vk) =
    <PolyIOP<E::ScalarField> as HyperPlonkSNARK<E, MultilinearKzgPCS<E>>>::preprocess(
        &index, &pcs_srs,
    )?;

// w1 := [0, 1, 2, 3]
let w1 = WitnessColumn(vec![
    E::ScalarField::zero(),
    E::ScalarField::one(),
    E::ScalarField::from(2u128),
    E::ScalarField::from(3u128),
]);
// w2 := [0^5, 1^5, 2^5, 3^5]
let w2 = WitnessColumn(vec![
    E::ScalarField::zero(),
    E::ScalarField::one(),
    E::ScalarField::from(32u128),
    E::ScalarField::from(243u128),
]);
// public input = w1
let pi = w1.clone();

// generate a proof and verify
let proof = <PolyIOP<E::ScalarField> as HyperPlonkSNARK<E, MultilinearKzgPCS<E>>>::prove(
    &pk,
    &pi.0,
    &[w1.clone(), w2.clone()],
)?;

let _verify =
    <PolyIOP<E::ScalarField> as HyperPlonkSNARK<E, MultilinearKzgPCS<E>>>::verify(
        &vk, &pi.0, &proof,
    )?;

// bad path 1: wrong permutation
let rand_perm: Vec<E::ScalarField> = random_permutation(nv, num_witnesses, &mut rng);
let mut bad_index = index;
bad_index.permutation = rand_perm;
// generate pk and vks
let (_, bad_vk) =
    <PolyIOP<E::ScalarField> as HyperPlonkSNARK<E, MultilinearKzgPCS<E>>>::preprocess(
        &bad_index, &pcs_srs,
    )?;
assert!(!<PolyIOP<E::ScalarField> as HyperPlonkSNARK<
    E,
    MultilinearKzgPCS<E>,
>>::verify(&bad_vk, &pi.0, &proof,)?);

// bad path 2: wrong witness
let mut w1_bad = w1;
w1_bad.0[0] = E::ScalarField::one();
assert!(
    <PolyIOP<E::ScalarField> as HyperPlonkSNARK<E, MultilinearKzgPCS<E>>>::prove(
        &pk,
        &pi.0,
        &[w1_bad, w2],
    )
    .is_err()
);
