export const PROOF_STEPS = [
  { label: '데이터 준비', body: '쿼리 참조 테이블들의 행 범위를 계산하고 필요한 컬럼만 메모리에 로드합니다.' },
  { label: '첫 번째 라운드', body: 'FirstRoundBuilder로 쿼리를 실행하고 중간 MLE들에 대한 commitment을 생성합니다.' },
  { label: 'Transcript 구성', body: 'Keccak256 해시 체인으로 Fiat-Shamir 변환용 transcript를 구축합니다.' },
  { label: 'Sumcheck 증명', body: '다항식의 합이 기대값과 일치하는지 증명하는 핵심 단계입니다.' },
  { label: 'Inner Product 증명', body: 'MLE 평가값들의 내적을 증명하여 commitment 일관성을 확인합니다.' },
];

export const PROOF_ACTORS = ['사용자', 'SQL 파서', '증명 계획기', '실행 엔진', '증명 생성기'];

export const PROOF_MSGS = [
  { from: 0, to: 1, label: 'SQL 쿼리 입력', step: 0 },
  { from: 1, to: 2, label: 'AST 전달', step: 0 },
  { from: 2, to: 3, label: '실행 계획 전달', step: 1 },
  { from: 3, to: 4, label: '데이터 & Commitment', step: 2 },
  { from: 4, to: 4, label: 'Sumcheck 생성', step: 3 },
  { from: 4, to: 0, label: '검증 가능한 증명', step: 4 },
];

export const QUERY_CODE = `// SQL 연산의 다항식 변환 예시
// WHERE a = 2 처리
let mask = vec![false, true, false, true]; // a = 2인 행들
// 마스크를 다항식으로 변환
let polynomial = mask.iter()
  .map(|&b| if b { Scalar::one() } else { Scalar::zero() })
  .collect();
// Sumcheck 프로토콜 적용
let sum_proof = sumcheck_prove(polynomial, expected_sum);`;

export const QUERY_ANNOTATIONS = [
  { lines: [2, 2] as [number, number], color: 'sky' as const, note: 'Boolean 마스크 생성' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: '스칼라 다항식 변환' },
  { lines: [8, 8] as [number, number], color: 'amber' as const, note: 'Sumcheck으로 합 증명' },
];
