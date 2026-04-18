export const KL_DETAIL_STEPS = [
  {
    label: 'KL Divergence 정의',
    body: 'D_KL(P‖Q) = Σ P(x)·log(P(x)/Q(x)) = H(P,Q) - H(P)\nP=실제 분포, Q=근사(모델) 분포 — Q로 P를 인코딩할 때 추가로 드는 비트\n예: P=[0.7,0.2,0.1], Q=[0.5,0.3,0.2]\nD_KL = 0.7·ln(0.7/0.5)+0.2·ln(0.2/0.3)+0.1·ln(0.1/0.2) ≈ 0.087 nats\nGibbs 부등식: D_KL ≥ 0, 등호는 P=Q일 때만 — Jensen 부등식으로 증명',
  },
  {
    label: '비대칭성: Forward KL vs Reverse KL',
    body: 'D_KL(P‖Q) ≠ D_KL(Q‖P) — KL은 대칭이 아니므로 거리(metric)가 아님\nForward KL(P‖Q): P(x)>0인 곳에서 Q(x)도 커야 → mode-covering (분포가 퍼짐)\nReverse KL(Q‖P): Q(x)>0인 곳에서 P(x)도 커야 → mode-seeking (한 봉우리에 집중)\n예: P=bimodal → Forward KL은 두 봉우리 모두 커버, Reverse는 하나만 선택\nVI(변분추론)는 Reverse KL, MLE는 Forward KL을 최소화',
  },
  {
    label: 'Jensen-Shannon Divergence',
    body: 'JSD(P‖Q) = ½D_KL(P‖M) + ½D_KL(Q‖M), M=(P+Q)/2\nKL의 두 문제를 해결: ① 대칭 (JSD(P‖Q)=JSD(Q‖P)) ② 항상 유한\n범위: 0 ≤ JSD ≤ ln2 (nats), √JSD는 진정한 metric (삼각부등식 만족)\nGAN 원논문: Generator 목표 = JSD(P_data‖P_G) 최소화\n예: P=[0.7,0.3], Q=[0.3,0.7] → JSD≈0.16 nats',
  },
  {
    label: 'ML에서 KL 활용',
    body: '① VAE: D_KL(q(z|x)‖p(z)) — 인코더 분포를 N(0,1) 사전분포로 정규화\n  closed-form: ½Σ(1+logσ²-μ²-σ²) — 가우시안끼리는 해석적 계산 가능\n② PPO: D_KL(π_new‖π_old) < ε — 정책 업데이트를 제한하여 학습 안정화\n③ Knowledge Distillation: D_KL(P_teacher‖P_student) — soft label로 지식 전달\n④ 정보 이론: 최적 부호화 vs 차선 부호화의 비효율성 측정',
  },
  {
    label: 'PyTorch KL 계산',
    body: 'F.kl_div(input=log_q, target=p, reduction="batchmean")\ninput은 log Q(x)를 넣어야 함 — Q(x)를 넣으면 잘못된 결과\n인자 순서 주의: kl_div는 D_KL(P‖Q)를 계산하지만 첫 인자가 log_Q\nVAE에서는 closed-form 사용: -0.5*Σ(1+logσ²-μ²-σ²)\n수치 안정성: log_softmax로 log Q를 구하고, P는 확률 그대로 전달',
  },
];
