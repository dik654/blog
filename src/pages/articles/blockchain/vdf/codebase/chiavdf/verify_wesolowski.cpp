void VerifyWesolowskiProof(integer &D, form x, form y, form proof, uint64_t iters, bool &is_valid)
{
    PulmarkReducer reducer;
    integer L = root(-D, 4);
    integer B = GetB(D, x, y);
    integer r = FastPow(2, iters, B);
    form f1 = FastPowFormNucomp(proof, D, B, L, reducer);
    form f2 = FastPowFormNucomp(x, D, r, L, reducer);
    if (f1 * f2 == y)
    {
        is_valid = true;
    }
    else
    {
        is_valid = false;
    }
}
