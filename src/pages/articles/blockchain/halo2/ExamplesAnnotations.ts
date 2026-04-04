import type { Annotation } from '@/components/ui/code-panel';

export const ecdsaAnnotations: Annotation[] = [
  { lines: [5, 5], color: 'sky', note: 'EcPoint: 곡선 위의 점 (x, y 모두 회로 내 값)' },
  { lines: [9, 9], color: 'emerald', note: '결과는 0 또는 1의 AssignedValue' },
  { lines: [13, 13], color: 'amber', note: 'is_soft_nonzero: 0이 아님을 소프트하게 검사' },
  { lines: [15, 15], color: 'violet', note: 'divide_unsafe로 역원 곱셈 (s!=0 이미 검증)' },
  { lines: [17, 17], color: 'rose', note: '고정 기저 G: 미리 계산된 테이블로 효율적 스칼라 곱셈' },
  { lines: [22, 22], color: 'sky', note: '10개 조건 모두 참일 때만 최종 결과 1' },
];

export const pairingAnnotations: Annotation[] = [
  { lines: [5, 5], color: 'sky', note: 'G2 점은 Fp2(확장 필드) 좌표' },
  { lines: [6, 6], color: 'emerald', note: 'G1 점은 Fp(기저 필드) 좌표' },
  { lines: [13, 13], color: 'amber', note: 'line function: sparse Fp12 원소 생성 (6-12개 Fp2 곱셈)' },
  { lines: [14, 14], color: 'violet', note: '일반 Fp12 곱셈(36 Fp2 곱셈) 대비 약 3배 빠름' },
  { lines: [20, 20], color: 'rose', note: 'BN 곡선 특화: Frobenius 사상으로 최종 보정' },
  { lines: [24, 24], color: 'sky', note: 'hard_part: BN 파라미터 활용 최적화' },
];
