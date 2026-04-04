export const INIT_CODE = `# 보안 파라미터 설정
corruption_threshold = t  # 최대 악의적 참가자
key_length = 2048         # N의 비트 길이 (공개키)
prime_threshold = ...     # 소수성 검사 상한
stat_sec_shamir = 40     # 통계적 보안 (2^-40)

# 두 가지 Shamir 스킴 초기화
shamir_scheme_t  = Shamir(prime, n, t)    # t-out-of-n
shamir_scheme_2t = Shamir(prime, n, 2*t)  # 2t-out-of-n (곱셈용)

# 참가자 인덱스 할당 (공정한 방식)
async def get_indices(pool):
    random_nums = {p: random.randint(0, 1_000_000) for p in pool}
    broadcast(random_nums)
    # 오름차순 정렬로 인덱스 결정
    session_id = sum(random_nums.values()) % 1_000_000
    return sorted_indices, session_id`;

export const PRIME_CODE = `// N = p × q를 분산 방식으로 생성
// (단일 참가자가 p, q를 모두 알면 안 됨)

async fn generate_safe_prime_shares():
    // 1. 각 참가자 독립적으로 소수 후보 생성
    let candidate = generate_prime_candidate(key_length / 2);

    // 2. 작은 소수 테스트 (빠른 필터링)
    if !passes_small_prime_test(candidate, prime_threshold) { retry }

    // 3. Miller-Rabin 소수성 검사
    if !miller_rabin(candidate, 40) { retry }

    // 4. 분산 소수성 검증 (Jacobi 기호)
    // 각 참가자가 부분 지수 연산 수행
    let partial_exp = pow(generator, candidate_share, N_candidate);
    broadcast(partial_exp);
    // 모든 부분을 결합해 최종 소수성 판정
    let is_prime = combine_jacobi_checks(all_partial_exps);`;

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

export const THRESHOLD_SIGN_CODE = `// DKG 이후: t+1명이 협력해야 서명 가능

// 개인키 d를 Shamir로 분산: [d]ᵢ
// 공개키 Q = d × G는 모두 알고 있음

// 임계값 ECDSA 서명 (간략화)
async fn threshold_sign(message: &[u8], shares: &[Share]) -> Signature {
    // 1. 각 참가자: 랜덤 k₁ 선택, k = k₁ + k₂ + ... (MPC)
    // 2. R = k × G, r = R.x mod n 계산 (공개)
    // 3. 각 참가자: 부분 서명 sᵢ = k⁻¹(hash(m) + r × dᵢ) 계산
    // 4. 라그랑주 계수로 결합: s = Σᵢ Lᵢ(0) × sᵢ
    // 최종: 서명 (r, s)
    combine_signature_shares(partial_sigs, threshold)
}`;
