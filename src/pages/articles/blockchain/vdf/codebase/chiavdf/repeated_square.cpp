// Chia-Network/chiavdf 1.1.14 · src/vdf.h 발췌
// 원문 함수의 반복 제곱 경로를 줄이지 않고 옮겼습니다.
void repeated_square_original(
    vdf_original &vdfo,
    form& f,
    const integer& D,
    const integer& L,
    uint64 base,
    uint64 iterations,
    INUDUPLListener *nuduplListener
) {
    vdf_original::form f_in, *f_res;
    f_in.a[0] = f.a.impl[0];
    f_in.b[0] = f.b.impl[0];
    f_in.c[0] = f.c.impl[0];
    f_res = &f_in;

    for (uint64_t i = 0; i < iterations; i++) {
        f_res = vdfo.square(*f_res);

        if (nuduplListener != NULL)
            nuduplListener->OnIteration(NL_FORM, f_res, base + i);
    }

    mpz_set(f.a.impl, f_res->a);
    mpz_set(f.b.impl, f_res->b);
    mpz_set(f.c.impl, f_res->c);
}
