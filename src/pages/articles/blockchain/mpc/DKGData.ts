export const INIT_CODE = `# 이 분산 modulus 예제의 파라미터
sharing_degree = t       # 복원에는 t+1개 share 필요
key_length = 2048         # N의 비트 길이 (공개키)
prime_threshold = ...     # 소수성 검사 상한
stat_sec_shamir = 40     # 통계적 보안 (2^-40)

# 두 가지 다항식 차수
shamir_degree_t  = Shamir(prime, n, degree=t)    # t+1개로 복원
shamir_degree_2t = Shamir(prime, n, degree=2*t)  # 2t+1개로 복원

# 참가자 인덱스 할당 (공정한 방식)
async def get_indices(pool):
    random_nums = {p: random.randint(0, 1_000_000) for p in pool}
    broadcast(random_nums)
    # 오름차순 정렬로 인덱스 결정
    session_id = sum(random_nums.values()) % 1_000_000
    return sorted_indices, session_id`;

export const PRIME_CODE = `// 개념 흐름: 실제 distributed RSA/Paillier keygen은 protocol spec을 따른다.
// 단일 참가자가 p 또는 q 전체를 로컬에서 만들거나 시험하면 안 된다.

async fn generate_distributed_modulus():
    loop {
        // 1. 각 party의 비밀 contribution으로 후보를 share 상태에서 구성
        let p_shares = jointly_sample_candidate_shares();
        let q_shares = jointly_sample_candidate_shares();

        // 2. Secure multiplication 뒤 공개해도 되는 N = p*q만 open
        let N = open(secure_multiply(p_shares, q_shares));

        // 3. p, q를 열지 않는 distributed biprimality test
        //    Jacobi-symbol round와 proof/complaint는 protocol-specific
        if distributed_biprimality_test(N, p_shares, q_shares) {
            return N;
        }
    }`;

export const MODULUS_CODE = `// p와 q의 Shamir 공유를 곱해 N = p×q 계산
async fn compute_modulus(p_shares, q_shares):
    // 1. Shamir 비밀 분산으로 p, q 공유
    //    각 참가자 i가 [p]ᵢ, [q]ᵢ 보유

    // 2. 분산 곱셈 ([p]×[q] = [N])
    //    [p×q]ᵢ = [p]ᵢ × [q]ᵢ + 랜덤 마스킹
    //    단, 결과 다항식의 차수가 2t로 증가
    let n_shares_2t = multiply_shares(p_shares, q_shares);

    // 3. 2t-out-of-n Shamir로 N 재구성
    //    → 2t+1개의 공유 필요
    let N = lagrange_reconstruct(n_shares_2t, 2*t + 1);
    return N;

// 이 과정에서 어떤 참가자도 p나 q를 알 수 없음
// N만 공개됨 → RSA 가정에 의해 p, q 인수분해 불가`;

export const THRESHOLD_SIGN_CODE = `// 개념 흐름: 실제 round와 threshold 표기는 protocol마다 다름

// 개인키 x는 share 상태로 유지: [x]ᵢ
// 공개키 Q = x × G만 공개됨

// 임계값 ECDSA 서명 (비실행 pseudocode)
async fn threshold_sign(message: &[u8], shares: &[Share]) -> Signature {
    // 1. nonce share와 commitment를 만들고 transcript에 묶음
    let nonce_state = distributed_presign(shares);

    // 2. MtA/OT/ZK 등 protocol-specific MPC로
    //    k⁻¹ · (H(message) + r · x)를 share 상태에서 계산
    let signature_state = mpc_ecdsa(message, shares, nonce_state);

    // 3. 허용된 출력만 결합하고 표준 ECDSA verifier로 확인
    let signature = finalize(signature_state);
    assert!(verify(Q, message, signature));
    signature
}`;
