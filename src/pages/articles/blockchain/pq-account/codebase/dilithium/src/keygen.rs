pub fn keygen() -> (PublicKey, SecretKey) {
    // 1. 랜덤 시드 생성
    let seed = random_bytes(32);
    let rho = &seed[0..32];  // 행렬 A 생성용

    // 2. SHAKE-128로 4×4 다항식 행렬 A 생성
    //    각 계수 < q = 8380417
    let a_hat = expand_a(rho);  // NTT 도메인의 A

    // 3. 비밀 벡터 s1 샘플링 (계수 ∈ {-2,-1,0,1,2})
    let s1 = sample_short(eta: 2, l: 4);  // l=4 다항식

    // 4. 비밀 벡터 s2 샘플링
    let s2 = sample_short(eta: 2, k: 4);  // k=4 다항식

    // 5. 공개키 t = A·s1 + s2
    //    NTT 도메인에서 곱셈 후 역변환
    let t = ntt_inv(
        a_hat.mul_vec(&ntt(&s1))
    ).add(&s2);  // 4개 다항식, 각 256 계수

    let pk = PublicKey { rho: rho.to_vec(), t };
    let sk = SecretKey { rho: rho.to_vec(), s1, s2, t: t.clone() };
    (pk, sk)
}
