export const MATH_CODE = `// 소수체 F_p 위에서 동작 (p는 큰 소수)

// 1. 비밀 s를 다항식의 상수항으로 설정
f(x) = s + a₁x + a₂x² + ... + aₜxᵗ  (mod p)
// a₁, ..., aₜ: 랜덤 계수

// 2. 각 참가자 i에게 f(i)를 공유로 배포
share_i = f(i) for i = 1, ..., n

// 3. t+1개의 공유로 라그랑주 보간으로 s 복원
s = f(0) = Σᵢ shareᵢ × Lᵢ(0)  (mod p)

// 라그랑주 기저 다항식:
// Lᵢ(x) = ∏ⱼ≠ᵢ (x - j) / (i - j)  (mod p)
// Lᵢ(0) = ∏ⱼ≠ᵢ (-j) / (i - j)  (mod p)

// t개 이하 공유: 다항식의 자유도 = t
// → f(0) = s를 결정할 수 없음 (균등 분포)
// → s에 대한 정보 없음 (완전한 정보 보안)`;

export const PYTHON_CODE = `import sympy

def shamir_share(secret: int, n: int, t: int, p: int) -> list[tuple[int, int]]:
    """비밀을 n개의 공유로 분산, t+1개로 복원 가능"""
    # t차 랜덤 다항식 생성 (상수항 = secret)
    coeffs = [secret] + [int.from_bytes(os.urandom(32), 'big') % p for _ in range(t)]

    # 각 참가자에게 (i, f(i)) 배포
    return [(i, sum(c * pow(i, j, p) for j, c in enumerate(coeffs)) % p)
            for i in range(1, n + 1)]

def lagrange_interpolate(shares: list[tuple[int, int]], x: int, p: int) -> int:
    """라그랑주 보간으로 f(x) 계산"""
    result = 0
    for i, (xi, yi) in enumerate(shares):
        num = den = 1
        for j, (xj, _) in enumerate(shares):
            if i != j:
                num = num * (x - xj) % p
                den = den * (xi - xj) % p
        result = (result + yi * num * pow(den, p - 2, p)) % p
    return result

# 복원
secret = lagrange_interpolate(shares[:t+1], x=0, p=p)`;

export const INTEGER_CODE = `# 정수 위 Shamir: 계수를 큰 범위에서 샘플링
shamir_length = 2 * (prime_length + ceil(log2(num_players)))
shamir_prime = sympy.nextprime(2**shamir_length)

# 마스킹 범위 (통계적 보안 보장)
masking_range = 2^(prime_length + stat_sec_shamir)
# stat_sec_shamir = 40 → 통계적 거리 ≤ 2^(-40)

# 공유는 큰 정수 도메인에서 계산
# 복원 시에는 원래 소수체로 모듈러 감산`;
