export const STEPS = [
  {
    label: '① 태동기 (1943-1969): 뉴런 모델에서 좌절까지',
    body: '1943 McCulloch-Pitts: 최초의 수학적 뉴런. y = θ(Σ wᵢxᵢ - t). 이진 입출력, 학습 불가 — 가중치를 수동 설정.\n1958 Rosenblatt 퍼셉트론: 학습 규칙 w ← w + η(y-y\')x. 단층으로 AND, OR 분류 가능.\n1960 ADALINE(Widrow-Hoff): MSE 기반 학습. delta rule: Δw = η(target - output)·x.\n1969 Minsky & Papert "Perceptrons": XOR 문제 — 단층 퍼셉트론은 비선형 분리 불가능 수학적 증명.\nXOR 진리표: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. 하나의 직선으로 0과 1을 분리할 수 없음.\n결과: 연구비 대폭 삭감 → First AI Winter(1974~1980). 다층 네트워크가 해결책이라는 인식 부재.',
  },
  {
    label: '② 부활 (1986-1997): 역전파와 CNN, LSTM',
    body: '1986 Rumelhart, Hinton, Williams: 역전파 학습법 공식화. dL/dw = dL/dy · dy/dz · dz/dw (chain rule).\n다층 네트워크 학습이 가능해짐 → XOR 문제 해결. 은닉층 1개(2뉴런)만으로 XOR 학습.\n1989 LeCun LeNet-1: 최초의 CNN. 합성곱(5×5 필터) + 풀링 → 우편번호 손글씨 인식 실용화.\n1989 Cybenko/Hornik 만능 근사 정리: 1 은닉층 + sigmoid → 임의의 연속함수 ε-근사 가능.\n1997 Hochreiter & Schmidhuber LSTM: cell state + 3 게이트(forget, input, output)로 장기 의존성 학습.\nVanishing gradient 문제: 층 k를 거치면 기울기 ∝ (σ\'·w)^k → σ\'_max=0.25이므로 급격히 소실. LSTM의 cell state가 "기울기 고속도로" 역할.',
  },
  {
    label: '③ 혁명 (2006-2017): GPU + 빅데이터 + 알고리즘',
    body: '2006 Hinton DBN: 층별 비지도 사전학습 → fine-tuning. 깊은 네트워크 학습의 돌파구.\n2012 AlexNet(Krizhevsky): ImageNet top-5 에러 26.2%→16.4%. 2개 GTX 580 GPU로 5일 학습. ReLU + Dropout 도입.\n2014 GAN(Goodfellow): Generator vs Discriminator 적대적 학습. min_G max_D E[log D(x)] + E[log(1-D(G(z)))].\n2015 ResNet(He): skip connection y = F(x) + x. 152층에서도 기울기 전달 — top-5 에러 3.6% (인간 5.1% 돌파).\n2017 Transformer(Vaswani): Attention(Q,K,V) = softmax(QKᵀ/√d_k)V. 병렬화 가능, RNN 대체.\n세 가지 동시 충족: GPU FLOPS 100배 증가(2006~2017), ImageNet 1.4M장/Wikipedia 3B 토큰, ReLU/BN/Dropout.',
  },
  {
    label: '④ AI Winters: 왜 오래 걸렸나',
    body: 'First AI Winter (1974-1980): Minsky의 퍼셉트론 비판 → DARPA 연구비 90% 삭감. Lighthill 보고서(1973, 영국).\n다층 네트워크 아이디어는 있었으나 학습법(역전파) 미보급 + 컴퓨팅 파워 부족.\nSecond AI Winter (1987-1993): 전문가 시스템 실패 — 규칙 수천 개 수동 작성 한계. Lisp 머신 시장 붕괴.\n필요했던 3가지 조건과 충족 시점:\n① 컴퓨팅: CPU 1 GFLOPS(2000) → GPU 100+ TFLOPS(2020). NVIDIA CUDA(2007)가 GPU 범용화 견인.\n② 데이터: ImageNet 1.4M(2009), Wikipedia 3B tokens, Common Crawl 수조 토큰.\n③ 알고리즘: ReLU(2010, 기울기소실 해결), Dropout(2012, 과적합 억제), BatchNorm(2015, 학습 안정화).',
  },
  {
    label: '⑤ LLM 시대 (2018-현재): 스케일링과 정렬',
    body: '2018 BERT(110M/340M): 양방향 Transformer + MLM 사전학습. GLUE 벤치마크 80.5 → NLU 혁명.\n2018 GPT-1(117M) → 2019 GPT-2(1.5B) → 2020 GPT-3(175B): 스케일링 법칙 확인. Loss ∝ N^{-0.076}.\n2022 ChatGPT: GPT-3.5 + RLHF(Reinforcement Learning from Human Feedback). 2달 만에 1억 사용자.\n2023-24: GPT-4(추정 1.7T MoE), Claude 3.5(200K context), Gemini 1.5(1M context).\n스케일링 법칙(Kaplan 2020): 모델 크기 N, 데이터 D, 컴퓨트 C 중 어느 것을 늘려도 loss가 power law로 감소.\n최근 방향: 멀티모달(이미지+텍스트+오디오), tool use(코드 실행, API 호출), reasoning(CoT, o1), 오픈소스(LLaMA-3 405B) 경쟁.',
  },
];

export const C = {
  dawn: '#8b5cf6',
  revival: '#3b82f6',
  revolution: '#10b981',
  winter: '#ef4444',
  llm: '#f59e0b',
  muted: 'var(--muted-foreground)',
  fg: 'var(--foreground)',
};
