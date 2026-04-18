import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  gbm: '#22c55e',
  dl: '#6366f1',
  data: '#f59e0b',
  warn: '#ef4444',
  neutral: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: 'GBM vs DL — 테이블 데이터 벤치마크 결과',
    body: 'Grinsztajn et al. (2022) 벤치마크: 45개 중간 규모 데이터셋 기준, GBM이 DL보다 높은 승률. 특히 10K~50K 샘플 범위에서 XGBoost/LightGBM이 압도적 우위.',
  },
  {
    label: '왜 GBM이 유리한가 — 테이블 데이터의 특성',
    body: '불규칙 피처(irregular features): 피처 간 공간적·시간적 관계 없음. 이질적 타입(수치+범주 혼합). 피처 수 대비 샘플 수가 적은 경우가 많음 — DL이 과적합하기 쉬운 구조.',
  },
  {
    label: 'DL이 접근하는 조건 3가지',
    body: '① 대규모 데이터 (100K+ 샘플) — DL의 용량이 빛을 발함\n② 멀티모달 입력 (텍스트+이미지+테이블 결합)\n③ 고카디널리티 범주형 — 엔티티 임베딩으로 GBM 대비 표현력 확보',
  },
  {
    label: '테이블 DL 모델의 진화',
    body: 'Wide&Deep(2016) → DeepFM(2017) → TabNet(2019) → FT-Transformer(2021) → TabPFN(2022)\n핵심 전략: 피처 선택 자동화(TabNet) + 피처를 토큰으로 취급(FT-Transformer)',
  },
];
