export const ECDSA_CODE = `// halo2-ecc/src/ecc/ecdsa.rs
pub fn ecdsa_verify_no_pubkey_check<F, CF, SF, GA>(
    chip: &EccChip<F, FpChip<F, CF>>,
    ctx: &mut Context<F>,
    pubkey: EcPoint<F, ...>,        // 공개키 (곡선 위의 점)
    r: ProperCrtUint<F>,            // 서명 값 r
    s: ProperCrtUint<F>,            // 서명 값 s
    msghash: ProperCrtUint<F>,      // 메시지 해시
) -> AssignedValue<F>               // 검증 결과 (1=성공, 0=실패)

// 검증 단계:
// 1. 스칼라 필드 FpChip 생성, 곡선 위수 n 할당
// 2. r, s 유효성 검사 (is_soft_nonzero)
// 3. u1 = msghash * s^(-1) mod n
// 4. u2 = r * s^(-1) mod n
// 5. u1 * G 계산 (고정 기저 스칼라 곱셈)
// 6. u2 * pubkey 계산 (가변 기저 스칼라 곱셈)
// 7. 두 점이 서로 음수가 아닌지 확인
// 8. 점 덧셈 & x 좌표 검증 (x1 == r mod n)
// 9. u1, u2 범위 검사 (< n)
// 10. 모든 조건을 AND 게이트로 결합`;

export const PAIRING_CODE = `// halo2-ecc/src/bn254/pairing.rs
pub fn miller_loop_BN<F: BigPrimeField>(
    ecc_chip: &EccChip<F, Fp2Chip<F>>,
    ctx: &mut Context<F>,
    Q: &EcPoint<F, FqPoint<F>>,  // G2 점 (Fp2 좌표)
    P: &EcPoint<F, FpPoint<F>>,  // G1 점 (Fp 좌표)
    pseudo_binary_encoding: &[i8],
) -> FqPoint<F>                  // Fp12 원소

// Miller Loop 알고리즘:
// 1. R = Q (또는 -Q), f = 1
// 2. for each bit in NAF encoding:
//    f = f^2 * line_{R,R}(P)        // 점 배가 + line function
//    R = 2R
//    if bit != 0:
//      f = f * line_{R, ±Q}(P)      // 점 덧셈 + line function
//      R = R + (±Q)
// 3. Frobenius 보정: Q_1, -Q_2 추가

// Final Exponentiation: f^((p^12 - 1) / r)
// easy_part: f^(p^6 - 1) * f^(p^2 + 1)
// hard_part_BN: BN 곡선 특화 최적화`;
