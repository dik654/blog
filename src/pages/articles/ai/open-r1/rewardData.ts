export const rewardRegistry = [
  { name: 'accuracy', desc: '수학 정답 검증 (math_verify)', weight: 0.7, color: '#6366f1' },
  { name: 'format', desc: '<think>/<answer> 형식 준수', weight: 0.2, color: '#10b981' },
  { name: 'tag_count', desc: '4개 태그 정확도 (각 0.25점)', weight: 0.1, color: '#f59e0b' },
  { name: 'reasoning_steps', desc: '단계별 추론 패턴 검출', weight: 0, color: '#8b5cf6' },
  { name: 'code', desc: '코드 실행 테스트 통과율', weight: 0, color: '#ef4444' },
  { name: 'len_reward', desc: '길이 기반 효율성 보상', weight: 0, color: '#06b6d4' },
];

export const rewardPipeline = [
  { label: '모델 응답', color: '#94a3b8' },
  { label: '답안 추출\n(LaTeX 파싱)', color: '#6366f1' },
  { label: '형식 검증\n(정규식 매칭)', color: '#10b981' },
  { label: '정확도 검증\n(math_verify)', color: '#f59e0b' },
  { label: '가중 합산\n(최종 보상)', color: '#ef4444' },
];

export const domainRewards = [
  { domain: '수학 문제', funcs: 'accuracy + format + tag_count' },
  { domain: '코딩 문제', funcs: 'code + code_format + reasoning_steps' },
  { domain: '일반 추론', funcs: 'format + reasoning_steps + repetition_penalty' },
];
