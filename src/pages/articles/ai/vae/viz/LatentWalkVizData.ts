export const STEPS = [
  {
    label: '2D 잠재 공간 맵 (MNIST)',
    body: '숫자 클래스가 클러스터 형성.\n유사한 숫자(3-8, 4-9)는 인접 배치.\n원점 부근에 밀집 — prior N(0,I) 영향.\n경계 영역은 변형 형태.',
  },
  {
    label: 'Latent Walk (잠재 공간 산책)',
    body: 'z_start = [1.5, 0.5] (숫자 "3") → z_end = [-0.5, -1.5] (숫자 "7").\n10단계 선형 보간: z = (1-t)·z_start + t·z_end.\n결과: 3 → 3 → 2 → ... → 7 → 7 부드러운 변환.\n중간에도 유효한 숫자 형태 유지.',
  },
  {
    label: '실무 응용',
    body: '이상 탐지: reconstruction error 높은 샘플 = anomaly.\n압축: 고차원 → 저차원 (SD에서 8배).\n스타일 전환: 콘텐츠 latent + 스타일 latent.\n데이터 증강: latent perturbation → 유사 샘플.',
  },
];
