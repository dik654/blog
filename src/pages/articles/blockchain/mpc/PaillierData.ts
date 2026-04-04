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

export const DISTRIBUTED_CODE = `// 비밀키 λ를 Shamir 분산으로 공유
// λ = Σᵢ λᵢ × Lᵢ(0)  (라그랑주 계수 조합)

// 참가자 i의 부분 복호화:
// cᵢ = c^(Δ × λᵢ) mod N²
// Δ = n! (팩토리얼, 정수 계수 보정)

fn partial_decrypt(c: &BigInt, lambda_i: &BigInt, delta: &BigInt, N: &BigInt) -> BigInt {
    pow(c, delta * lambda_i, N * N)
}

// 최종 복호화 (t+1개의 부분 복호화로)
// c^λ = ∏ᵢ cᵢ^(Lᵢ(0)/Δ) mod N²
// L(c^λ) × μ mod N = 원래 평문

// 어떤 단일 참가자도 λ를 알 필요 없음!
// → 분산된 Paillier 복호화 완성`;
