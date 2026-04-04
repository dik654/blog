pub fn sign(sk: &SecretKey, msg: &[u8]) -> Signature {
    let mu = h(sk.tr, msg);  // 메시지 해시
    let a_hat = expand_a(&sk.rho);

    loop {  // 거부 샘플링 루프 (평균 4-7회)
        // 1. 마스킹 벡터 y 생성
        let y = sample_mask(gamma1: 1 << 17);

        // 2. w = A·y → 상위 비트만 추출
        let w = ntt_inv(a_hat.mul_vec(&ntt(&y)));
        let w1 = high_bits(&w, 2 * GAMMA2);

        // 3. 도전 해시 c 생성
        let c_tilde = h(&mu, &w1.pack());
        let c = sample_in_ball(c_tilde, tau: 39);
        // c: 256개 계수 중 39개만 ±1, 나머지 0

        // 4. 서명 벡터 z = y + c·s1
        let z = y.add(&c.mul(&sk.s1));

        // 5. 거부 조건 검사
        //    ||z||∞ >= γ1 - β 이면 재시도 (서명이 s1 정보를 노출)
        if z.infinity_norm() >= GAMMA1 - BETA {
            continue;  // RESTART
        }

        // 힌트 생성: 검증자가 w1을 복원하도록
        let (h, valid) = make_hint(
            &w.sub(&c.mul(&sk.s2)),
            &c.mul(&sk.t),
        );
        if !valid { continue; }

        return Signature { c_tilde, z, h };
    }
}
