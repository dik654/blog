export const STEPS = [
  {
    label: '① Classic ML: 수작업 특징 설계',
    body: 'SVM, Random Forest 등 전통 ML 파이프라인: Raw 이미지 → 수작업 특징 추출 → 분류기.\nSIFT(Scale-Invariant Feature Transform): 128차원 키포인트 디스크립터. 회전/스케일 불변이지만 수동 설계.\nHOG(Histogram of Oriented Gradients): 8×8 셀의 기울기 방향 히스토그램 → 보행자 검출에 사용.\n문제: 새 도메인마다 전문가가 특징을 재설계해야 함 — 얼굴, 의료영상, 위성사진 각각 다른 특징 필요.\nImageNet(2010~2011): 수작업 특징 + SVM으로 top-5 정확도 약 72~74%. 인간 수준(94.9%)에 한참 미달.\n특징 설계가 병목 — 더 좋은 분류기보다 더 좋은 특징이 성능을 결정하는 시대.',
  },
  {
    label: '② Deep Learning: 특징 자동 학습',
    body: 'End-to-end learning: Raw 픽셀 → 신경망 → 바로 분류. 사람의 특징 설계가 불필요.\nCNN 계층별 학습 특징 (Zeiler & Fergus 2013 시각화):\nLayer 1: 엣지, 색상 패치 (Gabor 필터와 유사). Layer 2: 코너, 텍스처 패턴.\nLayer 3: 격자, 반복 패턴 조합. Layer 4: 개 얼굴, 자동차 바퀴 등 물체 부분.\nLayer 5: 전체 물체 — 개, 새, 키보드 등 의미 수준의 표현.\n핵심 통찰: 각 층의 필터가 역전파를 통해 자동으로 학습 — 데이터에서 최적의 특징을 스스로 발견.',
  },
  {
    label: '③ 깊이 분리 정리: 수학적 증거',
    body: '만능 근사 정리(Universal Approximation, 1989): 1 은닉층으로 어떤 연속함수든 근사 가능 — 단, 뉴런 수가 지수적.\n깊이 분리 정리가 "왜 깊어야 하는가"를 증명:\nEldan-Shamir(2016): ∃ 함수 f, 3층 NN이 poly(d) 뉴런으로 표현 가능하지만, 2층에서는 exp(d) 뉴런 필요.\nTelgarsky(2016): k층 O(k) 뉴런 네트워크 vs (k-1)층 → 동등 표현에 2^k 뉴런 필요.\n직관적 설명: 깊이 1 추가 = 함수 합성 1회 추가. f(g(x))는 f와 g 각각보다 훨씬 복잡한 함수 표현 가능.\n실무적 의미: 넓고 얕은 것보다 좁고 깊은 네트워크가 파라미터 효율적. ResNet-152가 VGG-19보다 적은 파라미터로 높은 정확도.',
  },
  {
    label: '④ 실전 검증: ImageNet 정확도 추이',
    body: 'ImageNet 1000-class top-5 accuracy (1M 학습 이미지, 50K 검증):\n2012 AlexNet(8층, 60M params): 84.7% — 수작업 특징 대비 10%p 도약. GPU 학습의 시작.\n2014 VGGNet(19층, 138M params): 92.7% — 3×3 필터만 사용. 깊이가 곧 성능이라는 경험 법칙.\n2015 ResNet(152층, 60M params): 96.4% — skip connection으로 기울기 소실 해결. 인간 수준(94.9%) 돌파.\n2019 EfficientNet-B7(66M params): 97.9% — depth/width/resolution 동시 스케일링. compound scaling.\n핵심: 깊이 증가만으로는 한계 — ResNet의 skip connection, EfficientNet의 compound scaling 같은 구조적 혁신이 동반해야 성능 향상.',
  },
];

export const C = {
  ml: '#6366f1',
  dl: '#10b981',
  math: '#f59e0b',
  perf: '#ef4444',
  muted: 'var(--muted-foreground)',
  fg: 'var(--foreground)',
};
