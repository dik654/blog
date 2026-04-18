export const STEPS = [
  {
    label: '① 산업별 혁신: 의료 - 자율주행 - 금융 - 제조',
    body: '의료: AlphaFold2(2020) — 단백질 3D 구조 예측. CASP14에서 GDT 92.4 달성(20년 난제 사실상 해결).\n자율주행: Tesla FSD — 카메라 8대 + BEV(Bird\'s Eye View) 신경망. Waymo — LiDAR + 카메라 fusion.\n금융: 이상 거래 탐지 — LSTM/Transformer로 시계열 패턴 학습. 사기 탐지율 95%+, 오탐률 < 0.1%.\n제조: 반도체 웨이퍼 결함 검사 — CNN 기반 AOI(자동 광학 검사). 인간 검사원 대비 2~5배 빠른 처리.\n약물 발견: 분자 그래프 신경망(GNN) → 후보 물질 탐색 시간 수년 → 수주로 단축.\n공통 패턴: domain-specific 데이터 + 사전학습 모델 fine-tuning → 전문가 수준 성능.',
  },
  {
    label: '② Frontier 모델: Closed Source',
    body: 'GPT-4/4o (OpenAI, 2023-24): 추정 1.7T params, 8-expert MoE. 멀티모달(이미지+텍스트), tool use, MMLU 86.4%.\nClaude 3.5 Sonnet (Anthropic, 2024): 200K context window. 코딩(HumanEval 92%), 긴 문서 분석에 강점.\nGemini 1.5 Pro (Google, 2024): 1M+ tokens context. "Needle in a haystack" 99%+ 정확도.\no1/o3 (OpenAI, 2024): Chain-of-Thought 추론 특화. 수학 올림피아드(AIME) 83.3%, 코딩 대회 상위 수준.\n공통 트렌드: 긴 문맥(4K→128K→1M), 멀티모달 통합, agent 기능(코드 실행+API+브라우징).\n학습 비용 추정: GPT-4 $100M+, Gemini Ultra $200M+ — 소수 기업만 frontier 모델 학습 가능.',
  },
  {
    label: '③ Open Source 경쟁 가속',
    body: 'LLaMA-3 (Meta, 2024): 8B/70B/405B params. 15T 토큰 학습. 405B가 GPT-4 수준에 근접 — 오픈소스의 이정표.\nMistral/Mixtral (Mistral AI): Mixtral 8x22B — 8-expert MoE, 활성 파라미터 39B. 효율적 추론.\nDeepSeek-V2 (2024): MLA(Multi-head Latent Attention) + MoE 236B. 추론 비용 GPT-4 대비 1/10.\n특화 모델 — Codex/StarCoder(코드 생성), Whisper(음성→텍스트, 99개 언어), Stable Diffusion(텍스트→이미지).\nSora(OpenAI)/Kling(Kuaishou): 텍스트→비디오 생성. DiT(Diffusion Transformer) 아키텍처.\n오픈소스 생태계 가속 요인: 가중치 공개 → 커뮤니티 fine-tuning → LoRA/QLoRA로 소비자 GPU에서 적응 가능.',
  },
  {
    label: '④ 벤치마크와 트렌드',
    body: '주요 벤치마크 스코어 (2024 기준):\nMMLU(57과목 지식): GPT-4 86.4%, Claude 3.5 88.7%, Human expert 89.8%. 인간 수준에 근접.\nHumanEval(코딩 164문제): GPT-4 90.2%, Claude 3.5 92%, DeepSeek-Coder 90.2%. pass@1 기준.\nMATH(수학 5000문제): GPT-4 52.9% → o1 94.8%. CoT 추론이 수학 성능을 극적으로 향상.\nGSM8K(초등 수학): GPT-4 97%, Claude 3.5 96.4% — 사실상 포화(saturation) 상태.\n5대 트렌드: ① 긴 문맥(1M+ tokens) ② 멀티모달 통합 ③ Agent(planning+tool use+memory)\n④ 효율적 추론(양자화, speculative decoding) ⑤ 안전성/정렬(Constitutional AI, RLHF).',
  },
];

export const C = {
  industry: '#6366f1',
  closed: '#ef4444',
  open: '#10b981',
  trend: '#f59e0b',
  muted: 'var(--muted-foreground)',
  fg: 'var(--foreground)',
};
