export const THRESHOLD_CODE = `// 이 예제의 Shamir 곱셈 복원 조건
n ≥ 2t + 1
// n: 전체 참가자 수
// t: 입력 share 다항식의 차수

// 이유:
// 1. 입력 share: t차 다항식, t+1개 점으로 복원
// 2. 분산 곱셈: 차수가 2t로 증가
// 3. 재구성: 2t+1개의 공유로 2t차 다항식 복원 가능

// 주의: 모든 MPC·TSS의 보편 threshold가 아님
// 실제 corruption threshold와 signing threshold는 protocol 정의를 따른다.

// 통계적 보안 파라미터
stat_sec_shamir = 40  // 통계적 거리 ≤ 2^(-40)
// 적대자가 마스킹된 값에서 원본을 구별할 확률이 무시할 수준`;
