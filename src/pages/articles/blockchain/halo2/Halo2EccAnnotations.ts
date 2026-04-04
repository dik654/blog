import type { Annotation } from '@/components/ui/code-panel';

export const eccModuleAnnotations: Annotation[] = [
  { lines: [2, 2], color: 'sky', note: 'bigint: limb 기반 큰 정수, CRT 표현' },
  { lines: [4, 4], color: 'emerald', note: 'fields: 소수체 Fp 연산, 확장체 Fp2/Fp12도 지원' },
  { lines: [6, 6], color: 'amber', note: 'ecc: Short Weierstrass 곡선의 점 연산' },
  { lines: [8, 8], color: 'violet', note: '곡선별 특화: ECDSA 서명 검증, pairing 최적화' },
  { lines: [12, 12], color: 'rose', note: 'carry 없는 중간 계산 → carry_mod로 최종 정규화' },
];

export const ecpointAnnotations: Annotation[] = [
  { lines: [3, 3], color: 'sky', note: '제네릭: 다양한 필드 표현과 곡선에 대해 작동' },
  { lines: [8, 8], color: 'emerald', note: 'StrictEcPoint: x 좌표 [0, p) 범위 보장 → 동등성 검사 효율적' },
  { lines: [14, 14], color: 'amber', note: 'Strict/NonStrict 선택으로 불필요한 축약 비용 회피' },
  { lines: [19, 19], color: 'violet', note: '암호학적 곡선에서 (0,0)이 곡선 위에 없음을 가정' },
];
