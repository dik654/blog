// Chia-Network/chiavdf 1.1.14 · src/proof_common.h, src/verifier.h 발췌
integer GetB(const integer& D, form &x, form& y) {
    int d_bits = D.num_bits();
    std::vector<unsigned char> serialization = SerializeForm(x, d_bits);
    std::vector<unsigned char> serialization_y = SerializeForm(y, d_bits);
    serialization.insert(
        serialization.end(),
        serialization_y.begin(),
        serialization_y.end()
    );
    return HashPrime(serialization, B_bits, {B_bits - 1});
}

void VerifyWesolowskiProof(
    integer &D,
    form x,
    form y,
    form proof,
    uint64_t iters,
    bool &is_valid
) {
    PulmarkReducer reducer;
    integer L = root(-D, 4);
    integer B = GetB(D, x, y);
    integer r = FastPow(2, iters, B);
    form f1 = FastPowFormNucomp(proof, D, B, L, reducer);
    form f2 = FastPowFormNucomp(x, D, r, L, reducer);
    if (f1 * f2 == y) {
        is_valid = true;
    } else {
        is_valid = false;
    }
}
