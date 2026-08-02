export const MATH_CODE = `// 키 생성
let p, q = random_safe_primes(key_length / 2);
let N = p * q;               // RSA 모듈러스
let λ = lcm(p-1, q-1);      // 카마이클 함수
let g = N + 1;               // 생성자 (일반적 선택)
let μ = mod_inverse(L(pow(g, λ, N²)), N); // μ = (L(g^λ mod N²))^(-1) mod N

// 공개키: (N, g)    비밀키: λ
// L(x) = (x - 1) / N  (정수 나눗셈)

// 암호화: 평문 m ∈ Z_N
fn encrypt(m: BigInt, N: &BigInt) -> BigInt {
    let r = random_in_ZN_star(N); // 랜덤성
    // E(m, r) = g^m × r^N mod N²
    //         = (N+1)^m × r^N mod N²
    //         = (1 + mN) × r^N mod N²  (이항 전개)
    (pow(N + 1, m, N*N) * pow(r, N, N*N)) % (N * N)
}

// 복호화
fn decrypt(c: BigInt, λ: &BigInt, μ: &BigInt, N: &BigInt) -> BigInt {
    let x = pow(c, λ, N*N);  // c^λ mod N²
    L(x) * μ % N             // L(c^λ) × μ mod N
}`;

export const HOMOMORPHIC_CODE = `// 1. 덧셈 동형성
// E(m₁) × E(m₂) mod N² = E(m₁ + m₂)
//
// 증명:
// E(m₁) × E(m₂) = g^m₁ × r₁^N × g^m₂ × r₂^N mod N²
//               = g^(m₁+m₂) × (r₁r₂)^N mod N²
//               = E(m₁+m₂, r₁r₂)

fn add_encrypted(c1: BigInt, c2: BigInt, N: &BigInt) -> BigInt {
    (c1 * c2) % (N * N)
}

// 2. 스칼라 곱셈
// E(m)^k mod N² = E(k × m)
//
// k번 E(m)을 곱하는 것 = m을 k번 더하는 것
fn scalar_mul(c: BigInt, k: BigInt, N: &BigInt) -> BigInt {
    pow(c, k, N * N)
}

// 응용: 내적 계산 (가중합)
// Σᵢ wᵢ × mᵢ = decrypt(∏ᵢ E(mᵢ)^wᵢ)
fn weighted_sum(encrypted: &[BigInt], weights: &[BigInt], N: &BigInt) -> BigInt {
    encrypted.iter().zip(weights.iter())
        .fold(encrypt(0, N), |acc, (c, w)| {
            (acc * scalar_mul(*c, *w, N)) % (N * N)
        })
}`;

export const DISTRIBUTED_CODE = `// 개념 API: 지수와 결합 계수는 선택한 threshold-Paillier 규격을 따른다.
// 서로 다른 규격의 Δ, share domain, proof 식을 섞으면 안 된다.

fn partial_decrypt(
    ciphertext: &Ciphertext,
    secret_share: &PaillierShare,
    transcript: &Session,
) -> (PartialDecryption, Proof) {
    // 자신의 share로 partial result와 정당성 proof 생성
    threshold_paillier::partial(ciphertext, secret_share, transcript)
}

fn combine(partials: &[(PartialDecryption, Proof)], public: &PublicParams) -> Plaintext {
    // threshold 이상 proof를 검증한 뒤 protocol-defined 계수로 결합
    assert!(partials.iter().all(|part| verify_partial(part, public)));
    threshold_paillier::combine(partials, public)
}

// 원본 Paillier secret을 한 process에 복원하지 않는다.`;
