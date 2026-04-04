export const THRESHOLD_CODE = `// 임계값 보안의 필요성
n ≥ 2t + 1
// n: 전체 참가자 수
// t: 최대 악의적 참가자 수 (corruption threshold)

// 이유:
// 1. Shamir 비밀 분산: t-out-of-n 다항식 사용
// 2. 분산 곱셈: 차수가 2t로 증가
// 3. 재구성: 2t+1개의 공유로 2t차 다항식 복원 가능

// 통계적 보안 파라미터
stat_sec_shamir = 40  // 통계적 거리 ≤ 2^(-40)
// 적대자가 마스킹된 값에서 원본을 구별할 확률이 무시할 수준`;
