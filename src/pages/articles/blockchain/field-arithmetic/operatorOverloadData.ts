export const dispatchCode = `a + b  →  <Fp as Add<Fp>>::add(a, b)
a - b  →  <Fp as Sub<Fp>>::sub(a, b)
a * b  →  <Fp as Mul<Fp>>::mul(a, b)
-a     →  <Fp as Neg>::neg(a)`;

export const addImplCode = `impl Add for Fp {
    type Output = Fp;
    fn add(self, rhs: Fp) -> Fp { Fp::add(&self, &rhs) }
}

// 참조 버전: a + &b 지원
impl Add<&Fp> for Fp {
    type Output = Fp;
    fn add(self, rhs: &Fp) -> Fp { Fp::add(&self, rhs) }
}`;

export const mulImplCode = `impl Mul for Fp {
    type Output = Fp;
    fn mul(self, rhs: Fp) -> Fp { self.mont_mul(&rhs) }
    // 유한체 곱셈의 실체는 Montgomery 곱셈
}`;

export const displayCode = `impl fmt::Display for Fp {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let r = self.to_repr();  // Montgomery → normal 변환
        write!(f, "Fp(0x{:016x}{:016x}{:016x}{:016x})",
            r[3], r[2], r[1], r[0])  // big-endian 순서 출력
    }
}`;

export const axiomTestCode = `// 항등원
assert_eq!(a + Fp::ZERO, a);
assert_eq!(a * Fp::ONE, a);

// 교환법칙
assert_eq!(a + b, b + a);
assert_eq!(a * b, b * a);

// 결합법칙
assert_eq!((a + b) + c, a + (b + c));
assert_eq!((a * b) * c, a * (b * c));

// 분배법칙
assert_eq!(a * (b + c), a * b + a * c);`;
