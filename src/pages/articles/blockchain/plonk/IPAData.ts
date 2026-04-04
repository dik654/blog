export const IPA_CONCEPT_CODE = `Inner Product Argument (IPA):
  주장: <a, b> = c  (내적 관계 증명)

  KZG: 타원곡선 페어링 필요 (BN254, BLS12-381)
  IPA: 페어링 불필요 — 이산 로그 가정만 사용

  증명 크기: O(log n) — KZG의 O(1)보다 크지만
  Trusted Setup: 불필요! (투명 셋업)`;

export const FOLD_CODE = `재귀적 축소 (Recursive Halving):
  round 1: (a, b) 길이 n → 길이 n/2로 축소
    L = <a_lo, b_hi>·G + ...
    R = <a_hi, b_lo>·G + ...
    x ← challenge
    a' = a_lo + x·a_hi
    b' = b_hi + x⁻¹·b_lo

  round k: 반복 → 길이 1로 축소
  최종: 스칼라 1개와 점 2k개로 검증`;

export const COMPARISON_CODE = `KZG vs IPA 비교:
             KZG           IPA
  Setup     Trusted SRS    투명 (없음)
  증명 크기  O(1)           O(log n)
  검증 시간  O(1) 페어링    O(n) 스칼라곱
  곡선      페어링 곡선     임의 곡선

  Bulletproofs = IPA + Range Proof
  Halo/Halo2 = IPA 기반 재귀 증명`;

export const HALO_CODE = `Halo 트릭 — IPA 기반 재귀:
  IPA 검증의 O(n) 비용을 지연시킴
  → "accumulator"로 검증을 누적
  → 최종 1회만 O(n) 검증 수행

  재귀 합성(recursive composition):
  증명ₖ = verify(증명ₖ₋₁) + 새로운 연산
  → 체인처럼 쌓아서 최종 1회 검증`;
