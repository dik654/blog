export const scalingCode = `# Kaplan et al. (2020) 스케일링 법칙
L(N) = (N_c / N)^0.076  # 파라미터 스케일링
L(D) = (D_c / D)^0.095  # 데이터 스케일링
L(C) = (C_c / C)^0.050  # 연산량 스케일링

# Chinchilla (Hoffmann et al., 2022)
# 고정 FLOP에서 최적 N:D 비율
#   GPT-3:     175B 파라미터, 300B 토큰 (N:D = 1:1.7)
#   Chinchilla:  70B 파라미터, 1.4T 토큰 (N:D = 1:20)
#   → 같은 연산량, 더 나은 성능!

# 실전 적용 예
모델          파라미터    토큰       N:D 비율
GPT-3         175B      300B      1:1.7 (과대 파라미터)
Chinchilla     70B      1.4T      1:20  (최적)
LLaMA-2        70B      2T        1:29  (데이터 풍부)
LLaMA-3         8B      15T       1:1875 (극단적 오버트레이닝)`;

export const scalingAnnotations = [
  { lines: [2, 4] as [number, number], color: 'sky' as const, note: '멱법칙 스케일링 공식' },
  { lines: [6, 10] as [number, number], color: 'emerald' as const, note: 'Chinchilla: N:D=1:20 최적' },
  { lines: [12, 17] as [number, number], color: 'amber' as const, note: '실전 모델의 N:D 비율 변화' },
];
