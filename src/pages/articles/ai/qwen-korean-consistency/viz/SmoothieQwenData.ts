import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1. lm_head는 (vocab_size, hidden_dim) Linear 한 장',
    body: 'Qwen3-8B 기준 lm_head는 약 152K × 4096 행렬 W이다.\n각 row가 토큰 하나에 대응한다 — token id t의 row W[t, :] 가 그 토큰의 "의미 벡터" 역할을 한다.\nlogit z[t] = W[t, :] · h. 디코딩은 softmax(z) 위의 sampling.\n핵심: row 단위로 만져도 모델 다른 부분은 전혀 건드리지 않는다.',
  },
  {
    label: '2. CJK 한자 토큰 ID 수집 — vocab을 한 번 순회',
    body: 'tokenizer.get_vocab()을 돌면서 각 토큰 문자열을 디코딩한다.\n그 안에 U+4E00~9FFF 범위 문자가 포함되면 "한자 토큰"으로 분류해 ID 리스트에 모은다.\nQwen은 BBPE라 일부 토큰이 바이트 조각이지만, 디코딩 후 검사하므로 문제없다.\n결과: 약 2~3만 개 한자 토큰 ID 집합 → 전체 vocab의 15~20%.',
  },
  {
    label: '3. 스케일링 곡선 — min_scale과 smoothness로 부드럽게 깎기',
    body: '각 한자 토큰에 적용할 스케일 α를 결정한다.\n순수한 한자 비율이 높을수록 α가 작아진다 — 강한 다운스케일.\n곡선 형태: α = min_scale + (1 − min_scale) · sigmoid(−smoothness · (purity − 0.5)).\nmin_scale=0.5, smoothness=10.0 이 권장 기본값.\n부드러운 cutoff로 경계 토큰의 급격한 손상을 피한다.',
  },
  {
    label: '4. Weight row 스케일링 — 한 줄짜리 변환',
    body: '각 한자 토큰 t에 대해 W[t, :] ← α_t · W[t, :] 를 적용한다.\nlinear 연산이므로 logit이 z[t] = α_t · (W_old[t] · h) 로 정확히 비례 축소된다.\nα < 1 이면 z[t] 가 작아지고, softmax에서 그 토큰의 확률이 줄어든다.\n중요: 다른 토큰의 logit은 손대지 않는다. 한국어 토큰의 절대 logit은 그대로.',
  },
  {
    label: '5. 분포 효과 — 한국어 토큰이 상대적으로 부상',
    body: '한자 logit이 일괄적으로 낮아지면 softmax 분모가 작아진다.\n같은 z[한국어]도 softmax 후 확률이 커진다 — 상대적 부상.\n예: 가드 전 P(分析)=0.55 / P(분석)=0.30 → α=0.5 적용 후 P(分析)=0.32 / P(분석)=0.42.\n부호가 뒤집힌다. prompt가 0.1 logit 격차를 못 건드렸던 그 자리를 weight 한 번 건드려서 끝낸다.',
  },
  {
    label: '6. 성능 영향 — 일반 태스크 정확도는 거의 보존',
    body: '한자 토큰만 손대므로 한국어/영어/코드 reasoning은 영향이 거의 없다.\nMMLU·KMMLU·HumanEval 등에서 정확도 손실은 평균 2~3% 이내.\nmin_scale을 너무 낮추면 (예: 0.2) 의도치 않은 성능 저하가 발생한다.\nmin_scale=0.5, smoothness=10.0 조합이 95%+ 한자 leakage 제거 + 정확도 71% / 39.5% 유지 (저자 보고).',
  },
  {
    label: '7. 배포 — Hugging Face에 이미 변환된 모델',
    body: 'dnotitia가 변환을 직접 끝낸 모델을 HF에 올려뒀다.\ndnotitia/Smoothie-Qwen3-8B / 4B / 1.7B, 그리고 0.6B~235B 전 사이즈, Qwen2.5 0.5B~72B 모두 지원.\nApache 2.0 라이선스, 드롭인 교체 — 코드에서 모델 이름만 바꾸면 끝.\n자체 변환도 가능: smoothie-qwen 패키지의 한 번 호출.',
  },
];

// 스케일링 곡선용 데이터 (purity 0~1 → alpha)
export const SCALE_CURVE = (() => {
  const minScale = 0.5;
  const smoothness = 10.0;
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 50; i++) {
    const x = i / 50;
    const sig = 1 / (1 + Math.exp(smoothness * (x - 0.5)));
    const y = minScale + (1 - minScale) * sig;
    points.push({ x, y });
  }
  return points;
})();

export const PROB_BEFORE_AFTER = [
  { tok: '分析', before: 0.55, after: 0.32, kind: 'cn' },
  { tok: '분석', before: 0.30, after: 0.42, kind: 'kr' },
  { tok: '解析', before: 0.10, after: 0.06, kind: 'cn' },
  { tok: '해석', before: 0.05, after: 0.20, kind: 'kr' },
];

export const BENCHMARK = [
  { name: 'MMLU', before: 73.2, after: 71.0, drop: 2.2 },
  { name: 'KMMLU', before: 41.5, after: 39.5, drop: 2.0 },
  { name: 'HumanEval', before: 81.7, after: 80.4, drop: 1.3 },
  { name: '한자 leak %', before: 38, after: 1.5, drop: -36.5 },
];
