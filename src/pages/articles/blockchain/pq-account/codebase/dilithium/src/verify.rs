pub fn verify(pk: &PublicKey, msg: &[u8], sig: &Signature) -> bool {
    let mu = h(pk.tr, msg);
    let a_hat = expand_a(&pk.rho);
    let c = sample_in_ball(sig.c_tilde, tau: 39);

    // 1. w1' 복원: 힌트(h)를 사용하여 상위 비트 복원
    //    A·z - c·t 계산 → UseHint로 상위 비트 추출
    let az_minus_ct = ntt_inv(
        a_hat.mul_vec(&ntt(&sig.z))
    ).sub(&c.mul(&pk.t));

    let w1_prime = use_hint(&sig.h, &az_minus_ct, 2 * GAMMA2);

    // 대수적 증명 (왜 이것이 작동하는가):
    // A·z - c·t
    //   = A·(y + c·s1) - c·(A·s1 + s2)
    //   = A·y + A·c·s1 - c·A·s1 - c·s2
    //   = A·y - c·s2
    // HighBits(A·y - c·s2) ≈ HighBits(A·y) = w1 (c·s2가 작으므로)

    // 2. 도전 해시 재계산
    let c_tilde_prime = h(&mu, &w1_prime.pack());

    // 3. 일치 확인
    c_tilde_prime == sig.c_tilde
}
