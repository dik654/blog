export const groth16StepBreakdown = [
  { step: 'Witness', device: 'CPU', pct: '~5%', reason: '제약 조건 순차 풀이' },
  { step: 'NTT x3', device: 'GPU', pct: '~15%', reason: 'A,B,C 다항식 평가' },
  { step: 'Pointwise + INTT', device: 'GPU', pct: '~10%', reason: 'H(x) 몫 다항식' },
  { step: 'MSM x3', device: 'GPU', pct: '~65%', reason: '증명 원소 계산' },
  { step: 'D2H + 조합', device: 'CPU', pct: '~5%', reason: '결과 전송' },
];
