export const CREATE_CODE = `// src/inner_product_proof.rs — 실제 구현

pub struct InnerProductProof {
    pub(crate) L_vec: Vec<CompressedRistretto>, // log2(n) 개
    pub(crate) R_vec: Vec<CompressedRistretto>, // log2(n) 개
    pub(crate) a: Scalar,  // 최종 스칼라
    pub(crate) b: Scalar,  // 최종 스칼라
}
// 증명 크기: 2*log2(n) 곡선 점 + 2 스칼라 = O(log n)

pub fn create(
    transcript: &mut Transcript,
    Q: &RistrettoPoint,          // ⟨a,b⟩ 커밋 보조 기저점
    G_factors: &[Scalar],        // G 스케일 인수
    H_factors: &[Scalar],        // H 스케일 인수
    mut G_vec: Vec<RistrettoPoint>,
    mut H_vec: Vec<RistrettoPoint>,
    mut a_vec: Vec<Scalar>,      // 비밀 벡터 a
    mut b_vec: Vec<Scalar>,      // 비밀 벡터 b
) -> InnerProductProof {
    let mut n = G_vec.len();     // 반드시 2의 거듭제곱
    transcript.innerproduct_domain_sep(n as u64);

    while n != 1 {
        n = n / 2;
        let (a_L, a_R) = a.split_at_mut(n);
        let (b_L, b_R) = b.split_at_mut(n);
        let (G_L, G_R) = G.split_at_mut(n);
        let (H_L, H_R) = H.split_at_mut(n);

        // 교차 내적
        let c_L = inner_product(&a_L, &b_R);  // ⟨a_L, b_R⟩
        let c_R = inner_product(&a_R, &b_L);  // ⟨a_R, b_L⟩

        // L = a_L * G_R + b_R * H_L + c_L * Q  (왼쪽 점)
        let L = RistrettoPoint::vartime_multiscalar_mul(
            a_L.iter().zip(&G_factors[n..]).map(|(a,g)| a*g)
            .chain(b_R.iter().zip(&H_factors[..n]).map(|(b,h)| b*h))
            .chain(iter::once(c_L)),
            G_R.iter().chain(H_L.iter()).chain(iter::once(Q)),
        ).compress();

        // R = a_R * G_L + b_L * H_R + c_R * Q  (오른쪽 점)
        let R = RistrettoPoint::vartime_multiscalar_mul(...).compress();

        L_vec.push(L);  R_vec.push(R);
        transcript.append_point(b"L", &L);
        transcript.append_point(b"R", &R);

        // 검증자 도전값 u (Fiat-Shamir)
        let u = transcript.challenge_scalar(b"u");
        let u_inv = u.invert();

        // 접기: a = a_L * u + a_R * u_inv, b = b_L * u_inv + b_R * u
        for i in 0..n {
            a_L[i] = a_L[i] * u    + u_inv * a_R[i];
            b_L[i] = b_L[i] * u_inv + u    * b_R[i];
            G_L[i] = RistrettoPoint::vartime_multiscalar_mul(
                &[u_inv * G_factors[i], u * G_factors[n+i]],
                &[G_L[i], G_R[i]]);
            H_L[i] = ...; // 유사하게
        }
        a = a_L;  b = b_L;  G = G_L;  H = H_L;
    }
    InnerProductProof { L_vec, R_vec, a: a[0], b: b[0] }
}`;

export const VERIFY_CODE = `// 검증: L_vec, R_vec, a, b → 다중스칼라 곱 한 번으로

// 각 라운드의 도전값 u_k 재현 (Fiat-Shamir)
// 스칼라 s_i = Π(u_k^{b(i,k)}) 계산 (비트 인코딩)
// 검증 조건:
//   a * <s, G> + b * <s_inv, H> + a*b * Q
//   == P + Σ(u_k^2 * L_k) + Σ(u_k^{-2} * R_k)
//
// 멀티스칼라 곱셈 한 번으로 O(n) 검증
// (Pippenger 알고리즘으로 O(n/log n) 가능)

impl InnerProductProof {
    pub fn verify_plain(
        &self, n: usize, transcript: &mut Transcript,
        G_factors: &[Scalar], H_factors: &[Scalar],
        P: &RistrettoPoint, Q: &RistrettoPoint,
        G: &[RistrettoPoint], H: &[RistrettoPoint],
    ) -> Result<(), ProofError> {
        // u_vec: 각 라운드 도전값 재현
        // s_vec: Σ(u_k^{bit_k}) 스칼라 계산 (n개)
        // 최종 등식 검증: vartime_multiscalar_mul(...)  == identity
    }
}`;
