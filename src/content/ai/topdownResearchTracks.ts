export type ResearchLink = {
  title: string;
  description: string;
  source: string;
  published: string;
  url?: string;
  articleSlug?: string;
  articleAnchor?: string;
  category?: string;
};

export type ResearchDependency = {
  articleSlug: string;
  category?: string;
  label: string;
  reason: string;
  addedByCurrent?: boolean;
};

export type TopDownResearchTrack = {
  id: string;
  category: string;
  subcategories: string[];
  title: string;
  goal: string;
  asOf: string;
  current: ResearchLink;
  canonical: ResearchLink;
  supportingEvidence?: ResearchLink[];
  concepts: ResearchDependency[];
  conceptsEyebrow?: string;
  conceptsTitle?: string;
  foundations: ResearchDependency[];
  implementation: ResearchDependency[];
  stopReason: string;
  promotionRule: string;
};

export const topDownResearchTracks: TopDownResearchTrack[] = [
  {
    id: 'knowledge-systems',
    category: 'ai',
    subcategories: ['ai-knowledge-systems'],
    title: '분해 조건부터 근거 추적까지 닫는 Knowledge System',
    goal: '문서·영상·코드의 구조와 수정 이력을 보존하고, 질문마다 올바른 retrieval route와 context package를 선택해 claim을 원문까지 추적한다.',
    asOf: '2026-07-31',
    current: {
      title: 'Lost in Decomposition · CoDaR',
      description: '문서 내부 dependency가 강하면 decomposition이 관계를 끊을 수 있으므로 full-context와 retrieval workflow를 문서별로 route해야 한다는 현재 경계다.',
      source: 'Guo et al. · ACL Findings', published: '2026-07',
      articleSlug: 'research-codar-2026',
      url: 'https://aclanthology.org/2026.findings-acl.2097/',
    },
    canonical: {
      title: 'Retrieval-Augmented Generation',
      description: '모델 파라미터 밖의 문서를 검색해 생성 시점의 근거로 결합한다는 최소 구조를 고정한다.',
      source: 'Lewis et al.', published: '2020',
      articleSlug: 'paper-rag-2020',
      url: 'https://arxiv.org/abs/2005.11401',
    },
    concepts: [
      { articleSlug: 'knowledge-compiler', label: 'Knowledge Compiler', reason: 'Source·structure·meaning·retrieval·maintenance의 다섯 ownership을 먼저 구분한다.' },
      { articleSlug: 'knowledge-source-ingestion', label: 'Source Ingestion', reason: 'Reading order, table·formula·caption과 page·time·commit 주소를 복구한다.' },
      { articleSlug: 'knowledge-ir-evidence-lineage', label: 'Knowledge IR', reason: 'Claim·scope·evidence와 revision impact를 build-time lineage로 고정한다.' },
      { articleSlug: 'rag-pipeline', label: 'Retrieval & Packing', reason: 'Dependency-aware routing, hybrid retrieval와 evidence coverage 기반 context package를 만든다.' },
    ],
    foundations: [
      { articleSlug: 'probability-information-theory', label: '확률과 정보 이론', reason: '검색 점수와 생성 확률을 같은 숫자로 오해하지 않기 위해 필요하다.' },
      { articleSlug: 'statistics-generalization', label: '통계와 평가', reason: '한 질문의 성공과 시스템 전체 신뢰도를 분리해 측정한다.' },
    ],
    implementation: [
      { articleSlug: 'knowledge-research-watcher', label: 'Research Watcher 운영', reason: '새 source를 versioned queue로 모으고 current 교체·foundation delta·정정 무효화를 검증 가능한 결정으로 닫는다.' },
    ],
    stopReason: '현재 상단은 CoDaR 2026이지만 필수 역사 하향은 RAG 2020에서 멈춘다. BM25·embedding의 전체 역사는 실제 검색 mechanism 선택을 바꿀 때만 연다.',
    promotionRule: '새 연구가 decomposition routing, source structure, evidence lineage, context packing 또는 release evidence의 계약을 바꿀 때만 최상단을 교체한다.',
  },
  {
    id: 'robot-ai',
    category: 'ai',
    subcategories: ['ai-robotics'],
    title: '명령을 물리 행동으로 닫는 Robot AI',
    goal: '언어·영상 입력이 정책, planning, control, actuator를 거쳐 실제 성공과 안전으로 닫히는 전체 고리를 읽는다.',
    asOf: '2026-07-27',
    current: {
      title: 'π0.7: Generalist Robot Policy',
      description: 'Camera history, semantic subtask, visual subgoal, mixed-quality metadata와 action chunking으로 서로 다른 robot 경험을 하나의 closed-loop policy에 묶는 현재 기준이다.',
      source: 'Physical Intelligence', published: '2026-04-16',
      articleSlug: 'research-pi07-2026',
      url: 'https://www.pi.website/download/pi07.pdf',
    },
    canonical: {
      title: 'OpenVLA: Open-source Vision-Language-Action Model',
      description: '시각·언어 표현을 연속적인 robot action token으로 바꾸는 공개 VLA의 재현 가능한 기준점이다.',
      source: 'Kim et al.', published: '2024',
      articleSlug: 'paper-openvla-2024',
      url: 'https://arxiv.org/abs/2406.09246',
    },
    concepts: [
      { articleSlug: 'robot-ai-top-down', label: 'Robot AI 실행 경로', reason: '관측, policy, controller와 actuator의 책임을 먼저 분리한다.' },
      { articleSlug: 'rl-imitation-offline-learning', label: '모방 학습과 Offline RL', reason: 'demonstration을 action policy로 바꾸고 rollout 분포 이동을 진단한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'linear-algebra-tensors', label: '벡터·좌표·Tensor', reason: 'camera, pose, joint와 action의 frame과 shape를 검산한다.' },
      { articleSlug: 'probability-information-theory', label: '확률', reason: '불완전한 관측과 stochastic policy를 읽는다.' },
      { articleSlug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'sampling, 지연, feedback loop가 실제 안정성에 미치는 영향을 읽는다.' },
    ],
    implementation: [
      { articleSlug: 'robot-system-verification-validation-qualification', label: 'System V&V', reason: '인식·계획·제어·구동 계약을 요구사항과 release evidence로 닫는다.' },
    ],
    stopReason: '현재 원문은 π0.7에서 시작하고 필수 역사 하향은 공개 재현 기준인 OpenVLA 2024에서 멈춘다. π0.5·π*0.6·MEM·BAGEL은 π0.7 본문 lineage로 읽고, POMDP·motion planning·feedback control·모터·PCB의 전체 역사는 실제 배포 계약이 요구할 때만 연다.',
    promotionRule: '새 VLA가 observation·context·action representation, mixed-quality data 계약, memory 또는 closed-loop evaluation을 실질적으로 바꿀 때만 상단과 기반 델타를 갱신한다.',
  },
  {
    id: 'llm-architecture',
    category: 'ai',
    subcategories: [
      'ai-llm-architectures', 'ai-llm-architectures-overview', 'ai-llm-architectures-dense',
      'ai-llm-architectures-kv-context', 'ai-llm-architectures-moe', 'ai-llm-architectures-hybrid',
      'ai-llm-architectures-case-study',
    ],
    title: '현재 LLM을 block과 memory traffic으로 읽기',
    goal: '모델 이름이 아니라 attention, FFN/MoE, KV cache, active parameter와 통신 비용으로 새 구조를 해석한다.',
    asOf: '2026-07-20',
    current: {
      title: '2026 구조 변화: V4 · Attention Residuals · Gemma 4',
      description: '토큰 방향 접근, 깊이 방향 혼합, 멀티모달 입력 경계가 각각 어디서 달라졌는지 공개 근거를 같은 좌표계에서 비교한다.',
      source: 'DeepSeek · Moonshot AI · Google DeepMind', published: '2026-04–06', articleSlug: 'llm-architecture-gallery',
      url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf',
    },
    canonical: {
      title: 'Attention Is All You Need',
      description: 'Q·K·V, multi-head attention, residual, normalization과 FFN이라는 변하지 않는 계산 뼈대를 만든다.',
      source: 'Vaswani et al.', published: '2017', articleSlug: 'paper-transformer-2017',
      url: 'https://research.google/pubs/attention-is-all-you-need/',
    },
    concepts: [
      { articleSlug: 'transformer-architecture', label: 'Transformer 실행 흐름', reason: 'token에서 attention block과 다음 token까지 shape를 따라간다.' },
      { articleSlug: 'llm-architecture-dense-transformers', label: 'Dense Transformer 기준점', reason: 'GPT-2 계열의 attention·FFN·residual 계산과 parameter·KV 장부를 고정해, 뒤 구조가 무엇을 바꾸는지 비교할 기준을 만든다.' },
      { articleSlug: 'llm-architecture-kv-long-context', label: 'KV와 Long Context', reason: 'context 길이가 memory와 latency로 바뀌는 지점을 계산한다.', addedByCurrent: true },
      { articleSlug: 'llm-architecture-sparse-moe', label: 'Sparse MoE', reason: '총 파라미터와 토큰당 활성 계산을 분리한다.' },
      { articleSlug: 'llm-architecture-hybrid-linear', label: 'Hybrid·Linear Attention', reason: 'attention을 줄이는 구조가 무엇을 보존하고 잃는지 비교한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'linear-algebra-tensors', label: '행렬과 Tensor shape', reason: 'projection과 batch·head·sequence 축을 읽는다.' },
      { articleSlug: 'probability-information-theory', label: '확률과 정보', reason: 'softmax, cross entropy와 token likelihood를 읽는다.' },
      { articleSlug: 'calculus-computational-graphs', label: '미분과 계산 그래프', reason: 'block이 학습될 때 gradient가 지나가는 경로를 확인한다.' },
      { articleSlug: 'signals-systems-convolution', label: '신호와 상태 시스템', reason: 'Hybrid branch의 recurrence, state transition, impulse response와 고정 크기 memory가 막힐 때만 내려간다.', addedByCurrent: true },
      { articleSlug: 'differential-equations-phase-plane-numerical-integration', label: '연속 상태와 이산화', reason: 'SSM의 continuous dynamics가 token step의 discrete update로 바뀌는 조건을 읽어야 할 때만 내려간다.', addedByCurrent: true },
    ],
    implementation: [
      { articleSlug: 'research-deepseek-v3-2-2025', label: 'DeepSeek-V3.2 보고서 검산', reason: 'KV·sparse routing·RL runtime·agent synthesis를 한 보고서에서 다시 분리해 읽는다.' },
      { articleSlug: 'training-pipeline', label: 'Training Pipeline', reason: '구조 계약을 batch, optimizer, checkpoint와 evaluation을 가진 학습 실행으로 연결한다.' },
    ],
    stopReason: 'RNN 이전의 언어 모델 계보는 Transformer 계산을 설명하는 데 더 필요하지 않으면 인용에서 멈춘다.',
    promotionRule: '새 모델이 공개 기술 근거와 함께 attention, routing, state 또는 memory traffic의 계약을 바꿀 때 최상단을 교체한다.',
  },
  {
    id: 'multimodal-foundation-models',
    category: 'ai',
    subcategories: ['ai-multimodal'],
    title: '입력 modality에서 이해·생성 code path까지',
    goal: '모델 이름이 아니라 input·output modality, visual representation, context budget, objective와 공개 evidence로 통합 멀티모달 모델을 판독한다.',
    asOf: '2026-07-27',
    current: {
      title: 'Gemma 4와 현재 통합 멀티모달 계약',
      description: 'Encoder-free direct projection, early fusion, spatiotemporal VLM, decoupled understanding·generation과 mixed objective를 같은 입력·출력 좌표계에서 구분한다.',
      source: 'Google DeepMind · Meta · Qwen · DeepSeek', published: '2026-07',
      articleSlug: 'multimodal-foundation-models-current',
      url: 'https://arxiv.org/abs/2607.02770',
    },
    canonical: {
      title: 'Janus: Decoupling Visual Encoding for Unified Multimodal Understanding and Generation',
      description: '이해용 semantic feature와 생성용 reconstructable code의 충돌을 visual encoding 분리로 해결하고 autoregressive transformer를 공유한 최소 기준점이다.',
      source: 'Wu et al.', published: '2024',
      articleSlug: 'paper-janus-2024',
      url: 'https://arxiv.org/abs/2410.13848',
    },
    concepts: [
      { articleSlug: 'multimodal-fusion-interleaved-context', label: 'Fusion · Context', reason: 'Encoder·projector·resampler와 image·video·audio token 장부를 계산한다.', addedByCurrent: true },
      { articleSlug: 'video-long-context-memory', label: 'Long Video Memory', reason: '시간 token 증가를 active KV byte로 바꾸고 full·window·압축·retrieval과 streaming 정보 경계를 이해·생성 branch별로 검증한다.', addedByCurrent: true },
      { articleSlug: 'multimodal-visual-tokenization', label: 'Visual Tokenization', reason: 'Semantic feature, continuous latent와 reconstructable VQ code를 분리한다.' },
      { articleSlug: 'multimodal-unified-generation-objectives', label: 'Unified Generation Objectives', reason: 'Visual AR, diffusion과 flow loss가 representation·schedule을 어떻게 바꾸는지 비교한다.', addedByCurrent: true },
      { articleSlug: 'dit-flow-matching-evaluation', label: 'DiT · Flow Matching', reason: '생성 branch의 backbone, probability path, velocity target와 ODE solver를 서로 다른 계약으로 판독한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'transformer-architecture', label: 'Transformer', reason: 'Interleaved token을 처리하는 shared residual·attention backbone을 읽는다.' },
      { articleSlug: 'vision-transformer', label: 'Vision Transformer', reason: '2D image를 patch sequence로 바꾸고 visual token 수를 계산한다.' },
      { articleSlug: 'clip-vision-language-model', label: 'CLIP', reason: 'Image·text semantic alignment과 reconstructable representation의 차이를 읽는다.' },
      { articleSlug: 'vae', label: 'VAE · VQ 기반', reason: 'Continuous latent, discrete code와 decoder reconstruction의 최소 기반을 가져온다.' },
      { articleSlug: 'diffusion-models', label: 'Diffusion', reason: 'Continuous image 위치에 적용하는 denoising objective와 sampling을 읽는다.' },
    ],
    implementation: [
      { articleSlug: 'janus-pro-multimodal-runtime', label: 'Janus-Pro 공식 Code', reason: 'Processor, understanding embedding, visual code loop, CFG와 decoder tensor를 official repository에서 검산한다.' },
    ],
    stopReason: 'Transformer, ViT, CLIP, VAE·VQ와 Diffusion에서 멈춘다. CNN·RNN 이전의 전체 계보는 현재 model의 tensor·loss를 설명하는 데 실제로 필요할 때만 연다.',
    promotionRule: '새 연구가 input/output modality, fusion, visual representation, shared objective 또는 공개 runtime 계약을 바꾸고 primary source를 제공할 때 상단과 필요한 foundation delta만 갱신한다.',
  },
  {
    id: 'llm-post-training',
    category: 'ai',
    subcategories: [
      'ai-llm-post-training', 'ai-llm-post-training-current', 'ai-llm-post-training-foundation',
      'ai-llm-post-training-implementation',
    ],
    title: 'Pre-training 이후의 reasoning과 행동 만들기',
    goal: 'RL을 오래 돌리면 좋아진다는 문장을 넘어서 reward, exploration, search compute와 monitorability의 병목을 분리한다.',
    asOf: '2026-07-31',
    current: {
      title: 'Reasoning post-training 2026: reward가 맞아도 남는 병목',
      description: 'Controlled reasoning depth, sparse credit, entropy collapse, overthinking과 chain-of-thought monitorability를 한 실행 지도에서 분리한다.',
      source: 'Wang et al. · ScaleLogic', published: '2026-05', articleSlug: 'reasoning-post-training-frontier',
      url: 'https://arxiv.org/abs/2605.06638',
    },
    canonical: {
      title: 'Training language models to follow instructions with human feedback',
      description: 'SFT, reward model, PPO라는 고전적인 RLHF pipeline을 하나의 시스템으로 고정한다.',
      source: 'Ouyang et al.', published: '2022',
      url: 'https://arxiv.org/abs/2203.02155',
      articleSlug: 'rlhf',
    },
    concepts: [
      { articleSlug: 'post-training-rlvr', label: 'Post-training 신호 선택', reason: 'RAG·CPT·SFT·선호 학습·RLVR이 받는 증거와 바꾸는 대상을 분리한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'rl-ppo-continuous-control', label: 'Policy optimization', reason: 'Policy ratio, advantage와 clipping이 한 update의 이동을 어떻게 제한하는지 계산한다.' },
      { articleSlug: 'probability-information-theory', label: '확률·log likelihood·KL', reason: 'policy와 reference model의 차이를 수치로 읽는다.' },
      { articleSlug: 'statistics-generalization', label: '평가와 일반화', reason: 'benchmark reward와 실제 능력을 구분한다.' },
    ],
    implementation: [
      { articleSlug: 'open-r1', label: 'Open-R1 구현', reason: 'SFT data, rollout, verifier, GRPO와 held-out evaluation을 실제 code path로 닫는다.', addedByCurrent: true },
    ],
    stopReason: 'RL 알고리즘의 역사는 PPO와 현재 사용 중인 변형의 차이를 설명하는 데 필요한 지점에서 멈춘다. 모든 policy-gradient 논문을 선행 과제로 만들지 않는다.',
    promotionRule: '새 post-training 연구가 reward 생성, exploration, verifier 또는 policy update 계약을 바꾸고 재현 근거를 공개할 때 올린다.',
  },
  {
    id: 'llm-interpretability',
    category: 'ai',
    subcategories: [
      'ai-llm-interpretability', 'ai-llm-interpretability-current', 'ai-llm-interpretability-readouts',
      'ai-llm-interpretability-features', 'ai-llm-interpretability-circuits',
    ],
    title: '읽을 수 있는 내부 신호에서 검증된 causal circuit까지',
    goal: 'Attention, lens, sparse feature와 attribution을 곧바로 설명으로 부르지 않고 intervention과 control로 주장 강도를 올린다.',
    asOf: '2026-07-29',
    current: {
      title: 'Interpretability 2026: Jacobian Lens와 sparse J-space',
      description: '평균 downstream Jacobian으로 읽은 token direction이 verbal report·중간 추론·flexible computation에 실제로 쓰이는지 swap, decomposition, clamping과 layer control로 검증하고 single-token·faithfulness 경계를 함께 읽는다.',
      source: 'Google DeepMind · Anthropic', published: '2025-2026', articleSlug: 'llm-interpretability-frontier',
      url: 'https://transformer-circuits.pub/2026/workspace/index.html',
    },
    canonical: {
      title: 'A Mathematical Framework for Transformer Circuits',
      description: 'Residual stream과 QK·OV factorization으로 component가 읽고 쓰는 계산 경로를 분해하는 기준점이다. Readout, SAE와 causal validation까지 이 한 편에서 파생시키지 않는다.',
      source: 'Elhage et al.', published: '2021',
      url: 'https://transformer-circuits.pub/2021/framework/index.html',
      articleSlug: 'paper-transformer-circuits-2021',
    },
    supportingEvidence: [
      {
        title: 'Towards Monosemanticity: Decomposing Language Models With Dictionary Learning',
        description: 'Dense activation을 sparse learned feature로 근사할 때 reconstruction, sparsity와 feature label을 별도 검증하는 SAE 계열의 독립 원문 앵커다.',
        source: 'Bricken et al. · Anthropic',
        published: '2023',
        url: 'https://transformer-circuits.pub/2023/monosemantic-features/index.html',
      },
      {
        title: 'Circuit Tracing: Revealing Computational Graphs in Language Models',
        description: 'Replacement-model attribution을 original-model intervention, error node와 faithfulness 검사로 닫는 causal circuit 계열의 독립 원문 앵커다.',
        source: 'Anthropic',
        published: '2025',
        url: 'https://transformer-circuits.pub/2025/attribution-graphs/methods.html',
      },
    ],
    concepts: [
      { articleSlug: 'statistics-generalization', label: '인과 검증 문해력', reason: '필요성·충분성, 대조군, 교란과 holdout을 구분한다. Backup·self-repair는 아래 causal 구현에서 별도 false-negative 경계로 확인한다.', addedByCurrent: true },
      { articleSlug: 'llm-interpretability-readouts', label: 'Layer Readout', reason: 'Attention, activation, logit과 vocabulary projection의 관찰 계약을 고정한다.', addedByCurrent: true },
      { articleSlug: 'sparse-autoencoder', label: 'Sparse Feature Dictionary', reason: 'Dense activation을 learned direction으로 분해하고 reconstruction과 labeling 한계를 측정한다.' },
    ],
    foundations: [
      { articleSlug: 'transformer-architecture', label: 'Transformer residual stream', reason: '어느 layer와 component의 activation을 읽고 바꾸는지 tensor 경로를 확인한다.' },
      { articleSlug: 'probability-information-theory', label: '확률·Softmax·Entropy', reason: 'Logit을 token distribution으로 바꾸고 readout 불확실성을 읽는다.' },
      { articleSlug: 'linear-algebra-tensors', label: 'Vector direction과 projection', reason: 'Feature, probe와 unembedding을 direction, projection과 tensor contraction의 같은 언어로 읽는다.' },
    ],
    implementation: [
      { articleSlug: 'llm-circuit-analysis', label: 'Causal Circuit 검증', reason: 'Attribution 후보를 patching, ablation과 control로 원 모델에서 검증하고, backup path와 downstream self-repair가 단일 ablation의 false negative를 만들 수 있는 범위를 기록한다.', addedByCurrent: true },
    ],
    stopReason: 'CNN feature visualization 이전의 전체 설명가능 AI 계보는 현재 LLM 내부 계산을 검증하는 데 직접 필요하지 않으면 인용에서 멈춘다.',
    promotionRule: '새 연구가 readout, decomposition, attribution 또는 intervention 계약을 바꾸고 원 모델의 fidelity, causal control과 실패 범위를 공개할 때만 최상단을 갱신한다.',
  },
  {
    id: 'generative-models',
    category: 'ai',
    subcategories: ['ai-generative'],
    title: '분포에서 현재 Diffusion 연구까지',
    goal: '생성 모델을 이미지 효과가 아니라 학습 신호, sampling 경로, 실패 조건과 계산 비용으로 비교한다.',
    asOf: '2026-07-20',
    current: {
      title: 'DiT·Flow Matching·few-step를 다섯 계약으로 비교하기',
      description: 'Representation, backbone, path·target, solver와 평가 계약을 분리해 구조 변경과 demo budget을 한 모델 점수로 섞지 않는다.',
      source: 'Peebles & Xie · Lipman et al. · current model reports', published: '2022–2026',
      articleSlug: 'dit-flow-matching-evaluation',
    },
    canonical: {
      title: 'Denoising Diffusion Probabilistic Models',
      description: '고정된 forward noising과 학습되는 reverse denoising이라는 최소 생성 계약을 세운다.',
      source: 'Ho et al.', published: '2020',
      url: 'https://arxiv.org/abs/2006.11239',
      articleSlug: 'diffusion-models',
    },
    concepts: [
      { articleSlug: 'vae', label: 'VAE', reason: 'latent space와 likelihood lower bound를 통해 diffusion의 압축 공간을 이해한다.' },
      { articleSlug: 'gan', label: 'GAN', reason: 'adversarial signal과 mode collapse를 diffusion의 학습 신호와 비교한다.' },
    ],
    foundations: [
      { articleSlug: 'probability-information-theory', label: '확률분포와 score', reason: 'noise distribution, conditional density와 score를 읽는다.' },
      { articleSlug: 'differential-equations-phase-plane-numerical-integration', label: '미분방정식과 적분', reason: '여러 denoise step이 연속 dynamics와 어떤 관계인지 이해한다.', addedByCurrent: true },
      { articleSlug: 'calculus-computational-graphs', label: '미분', reason: 'noise prediction objective가 denoiser를 어떻게 학습시키는지 추적한다.' },
    ],
    implementation: [
      { articleSlug: 'image-model-runtime', label: 'Image Model Runtime', reason: 'Text encoder, denoiser, sampler와 VAE의 tensor·memory 경계를 실제 graph로 검증한다.' },
    ],
    stopReason: '확률 과정의 일반 이론 전체로 내려가지 않는다. forward corruption, reverse score, 수치 적분을 직접 설명할 수 있는 지점이 최소 바닥이다.',
    promotionRule: '새 연구가 prediction target, latent representation, sampler dynamics 또는 데이터 일반화 설명을 바꿀 때 최상단과 기반 델타를 갱신한다.',
  },
  {
    id: 'open-image-video',
    category: 'ai',
    subcategories: [
      'ai-open-models', 'ai-open-models-overview', 'ai-open-models-comfyui', 'ai-open-models-sd',
      'ai-open-models-krea', 'ai-open-models-z-image', 'ai-open-models-ideogram',
      'ai-open-models-illustrious', 'ai-open-models-ltx', 'ai-open-models-wan',
      'ai-open-models-animation',
    ],
    title: '오픈 미디어를 제작 계약으로 읽기',
    goal: '현재 결과물의 폐기 조건에서 Image 또는 Video branch를 고르고, 실행 graph·재현 manifest·parameter budget·adaptation과 최소 기반을 연결한다.',
    asOf: '2026-07-28',
    current: {
      title: 'Open media production contract · 2026-07',
      description: 'Ideogram 4.0, Krea 2, FLUX.2, Qwen-Image-2.0, LTX-2.3과 Wan2.2를 순위가 아니라 typography·reference·runtime·license·temporal contract의 공식 근거로 읽는다.',
      source: 'Official model releases', published: '2026',
      articleSlug: 'open-image-video-models',
    },
    canonical: {
      title: 'High-Resolution Image Synthesis with Latent Diffusion Models',
      description: 'pixel 대신 압축 latent에서 diffusion을 실행하고 cross-attention으로 조건을 넣는 현대 workflow의 기준점이다.',
      source: 'Rombach et al.', published: '2021',
      url: 'https://arxiv.org/abs/2112.10752',
      articleSlug: 'diffusion-models',
    },
    concepts: [
      { articleSlug: 'image-model-runtime', label: 'Image branch', reason: 'Condition, latent, prediction, solver와 VAE의 책임을 추적한다.' },
      { articleSlug: 'krea-2-foundation-model', label: 'Krea 2 선택 사례', reason: '넓은 style distribution, training curriculum과 RAW→Turbo artifact handoff를 검증한다.', addedByCurrent: true },
      { articleSlug: 'ideogram-4-typography-layout', label: 'Ideogram 4 선택 사례', reason: 'Exact typography, bbox·palette condition과 공개 weight·상업 권리 경계를 검증한다.', addedByCurrent: true },
      { articleSlug: 'video-model-runtime', label: 'Video branch', reason: '같은 뼈대에 시간축, motion·audio와 memory contract를 추가한다.', addedByCurrent: true },
      { articleSlug: 'open-model-workflow-parameters', label: 'Parameter budget', reason: 'UI 수치를 model-call·token·quality hypothesis로 바꾼다.', addedByCurrent: true },
      { articleSlug: 'open-model-finetuning-theory', label: 'Adaptation decision', reason: 'Control에서 full fine-tuning까지 가장 작은 충분한 개입을 고른다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'dit-flow-matching-evaluation', label: 'DiT · Flow Matching · Solver', reason: 'Prediction target, probability path와 NFE가 막힐 때만 생성 runtime의 공통 계약으로 내려간다.', addedByCurrent: true },
      { articleSlug: 'linear-algebra-tensors', label: 'Tensor shape', reason: '해상도·frame·batch가 memory를 얼마나 늘리는지 계산한다.' },
      { articleSlug: 'signals-systems-convolution', label: '시간 신호', reason: 'frame 사이 일관성과 temporal filtering을 이해한다.', addedByCurrent: true },
    ],
    implementation: [
      { articleSlug: 'open-model-community-workflows', label: 'Workflow manifest', reason: 'ComfyUI·Diffusers graph, artifact, environment, preprocessing과 sampling trace를 재현 가능한 run으로 묶는다.' },
      { articleSlug: 'animation-production-workflow', label: '2D Animation production', reason: '현재 video runtime을 shot 계약, cadence, 최소 adaptation과 hard release gate로 적용한다.', addedByCurrent: true },
    ],
    stopReason: '모든 checkpoint와 오래된 생성 계보를 필수 경로에 넣지 않는다. Latent Diffusion(2021)이 solver·VAE·conditioning을 설명하는 최소 역사 바닥이며, 더 오래된 연구는 해당 글 안의 선택 근거로만 남긴다.',
    promotionRule: '공개 weight·문서·실행 graph가 있고, 기존 runtime과 다른 모듈 또는 비용 구조를 보일 때 최상단 모델을 교체한다.',
  },
  {
    id: 'computer-vision',
    category: 'ai',
    subcategories: ['ai-vision', 'ai-vision-overview', 'ai-vision-promptable', 'ai-vision-detection', 'ai-vision-foundations'],
    title: '제품 출력에서 Promptable·Detection 시스템까지',
    goal: '분류·box·mask·identity 중 필요한 출력을 먼저 고르고, fixed/open vocabulary와 video memory를 분기한 뒤 좌표·품질·runtime을 독립 gate로 검증한다.',
    asOf: '2026-07-31',
    current: {
      title: 'Vision 작업 계약과 세 현재 선택 축',
      description: 'SAM 3.1 promptable tracking, OV-DEIM·WeDetect open-vocabulary detection, PE·SigLIP 2·DINOv3 representation을 하나의 순위가 아니라 출력 schema·latency·feature 위치가 다른 분기로 선택한다.',
      source: 'Meta AI · OV-DEIM · WeDetect · Meta AI · Google DeepMind', published: '2025-2026',
      articleSlug: 'vision-system-contracts',
    },
    canonical: {
      title: 'DETR: End-to-End Object Detection with Transformers',
      description: '가변 object를 query 집합으로 맞추는 detection의 최소 기준점이다. Promptable 분기는 concepts의 SAM 3.1 글에서 SAM 1까지 별도 cutoff를 둔다.',
      source: 'Carion et al.', published: '2020',
      url: 'https://arxiv.org/abs/2005.12872',
      articleSlug: 'deformable-detr',
    },
    supportingEvidence: [
      {
        title: 'OV-DEIM: Real-time DETR-style Open-vocabulary Detection',
        description: 'DETR-style open-vocabulary detector, query supplement와 GridSynthetic을 공개 code·pretrained model과 함께 제시한 2026 관찰 후보다. 동일 device 재현 전에는 D-FINE 기준선을 대체하지 않는다.',
        source: 'Wang et al.', published: '2026-03',
        url: 'https://arxiv.org/abs/2603.07022',
        articleSlug: 'object-detection-systems',
        articleAnchor: 'open-vocabulary',
      },
      {
        title: 'WeDetect: Open-vocabulary Detection as Retrieval',
        description: 'Dual-tower retrieval로 detection, proposal, historical object retrieval와 referring expression 분기를 묶은 관찰 후보다. 공개 artifact와 target-device latency를 별도 확인한다.',
        source: 'Fu et al.', published: '2025-12',
        url: 'https://arxiv.org/abs/2512.12309',
        articleSlug: 'object-detection-systems',
        articleAnchor: 'open-vocabulary',
      },
      {
        title: 'PE · SigLIP 2 · DINOv3 representation checkpoint',
        description: 'Intermediate aligned feature, multilingual image-text embedding과 self-supervised dense feature를 서로 다른 output contract로 고르는 현재 표현 분기다.',
        source: 'Meta AI · Google DeepMind', published: '2025',
        url: 'https://arxiv.org/abs/2504.13181',
        articleSlug: 'vision-representation-encoders-current',
      },
    ],
    concepts: [
      { articleSlug: 'vision-promptable-segmentation-tracking', label: 'Promptable·Tracking', reason: 'Text·exemplar prompt, streaming memory, object identity와 multi-object runtime을 이해한다.' },
      { articleSlug: 'object-detection-systems', label: '현재 Detection 선택', reason: 'Fixed vocabulary real-time과 open-vocabulary grounding을 입력·출력·평가 계약으로 나눈다.' },
      { articleSlug: 'vision-representation-encoders-current', label: '현재 Representation 선택', reason: 'Global·multilingual·dense·self-supervised output에 맞춰 PE·SigLIP 2·DINOv3 중 비교 시작점을 고른다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'clip-vision-language-model', label: '필요할 때 · Vision-Language 정렬', reason: 'Text concept와 global image feature의 cosine·contrastive 계산이 막힐 때만 연다.' },
      { articleSlug: 'vision-transformer', label: '필요할 때 · Patch attention', reason: '선택한 checkpoint가 ViT 계열일 때 patch sequence와 attention 비용을 읽는다.' },
      { articleSlug: 'signals-systems-convolution', label: 'Convolution과 sampling', reason: 'filter, stride와 aliasing을 픽셀 연산으로 읽는다.' },
      { articleSlug: 'cnn', label: 'CNN feature map', reason: 'Local filter, stride와 multi-scale feature가 spatial evidence를 보존하는 방식을 읽는다.' },
      { articleSlug: 'resnet', label: '필요할 때 · Residual backbone', reason: '선택한 checkpoint가 convolutional residual 계열일 때 identity·projection 경로를 읽는다.' },
      { articleSlug: 'linear-algebra-tensors', label: '행렬과 Tensor', reason: 'image·patch·mask·object 축의 shape를 검산한다.' },
      { articleSlug: 'statistics-generalization', label: '평가와 일반화', reason: 'benchmark score와 unseen concept 성능을 분리한다.' },
    ],
    implementation: [
      { articleSlug: 'image-classification-pipeline', label: 'Vision Release Evidence', reason: '독립 entity split, shortcut 반증, target shift와 slice gate를 사용해 선택한 vision 분기의 품질 주장을 재현 가능한 release evidence로 닫는다.', addedByCurrent: true },
    ],
    stopReason: '비전 역사를 무한히 내려가지 않는다. Promptable 경로는 SAM 1, detection은 DETR·Deformable DETR, vision-language 표현은 CLIP에서 필수 논문 계보를 멈춘다. ViT와 ResNet은 서로의 선수가 아니며 선택한 backbone 계산이 막힐 때만 연다.',
    promotionRule: '새 vision system이 출력 schema, vocabulary·prompt 방식, video memory, coordinate handoff 또는 target-device 비용 계약을 바꿀 때 해당 분기의 최상단에 추가한다.',
  },
  {
    id: 'document-ai',
    category: 'ai',
    subcategories: ['ai-ocr', 'ai-ocr-overview', 'ai-ocr-models', 'ai-ocr-structure', 'ai-ocr-practice'],
    title: '페이지 인식에서 근거 있는 장문 Document AI까지',
    goal: '페이지를 읽는 문제와 페이지 사이 논리 구조를 조립하는 문제, deterministic 검산과 검색 릴리스를 분리해 연결한다.',
    asOf: '2026-07-22',
    current: {
      title: 'Page Parser + Document Assembler',
      description: 'PaddleOCR-VL-1.6 같은 page parser의 typed output을 MinerU-Popo 같은 post-processor가 cross-page 문단·표·제목·캡션 관계로 조립하는 현재 기준점이다.',
      source: 'PaddleOCR · OpenDataLab', published: '2026-05', articleSlug: 'document-structure-assembly',
      url: 'https://arxiv.org/abs/2605.24973',
    },
    canonical: {
      title: 'Donut: OCR-free Document Understanding Transformer',
      description: '분리된 OCR 오류가 downstream으로 전파되는 대신 document image를 구조화된 sequence로 직접 바꾸는 기준점이다.',
      source: 'Kim et al.', published: '2021',
      articleSlug: 'paper-donut-2021',
      url: 'https://arxiv.org/abs/2111.15664',
    },
    concepts: [
      { articleSlug: 'ocr-document-ai-map', label: 'Document AI 지도', reason: 'text recognition, layout, reading order와 structured output을 분리한다.' },
      { articleSlug: 'paddleocr-vl', label: 'PaddleOCR-VL', reason: 'layout detector와 VLM recognition의 2단계 runtime을 읽는다.' },
      { articleSlug: 'olmocr-2', label: 'olmOCR 2', reason: 'unit test로 검증 가능한 reward와 문서 출력을 연결한다.', addedByCurrent: true },
      { articleSlug: 'html-table-structure-reconstruction', label: '표 구조 복원', reason: 'rowspan·colspan HTML을 점유 격자로 펼쳐 cell merge와 누락을 deterministic하게 검산한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'clip-vision-language-model', label: 'Vision-Language 표현', reason: 'image region과 language token이 만나는 방식을 이해한다.' },
      { articleSlug: 'post-training-rlvr', label: '검증 가능한 Post-training', reason: 'unit test와 RL reward가 문서 품질을 어떻게 바꾸는지 읽는다.', addedByCurrent: true },
      { articleSlug: 'statistics-generalization', label: '문서 평가', reason: 'text·formula·table·reading-order 지표를 분리한다.' },
    ],
    implementation: [
      { articleSlug: 'ocr-runtime-evaluation', label: '평가와 운영', reason: 'PDF 전처리, schema, 수식·표 검산과 RAG 전달을 runtime test로 확인한다.' },
    ],
    stopReason: '활자 인식 알고리즘의 전체 역사는 저해상도·왜곡 오류를 진단할 때만 연다. 기본 경로는 page block, cross-page relation, document tree, deterministic verifier에서 멈춘다.',
    promotionRule: '새 연구가 page output schema, cross-page assembly, provenance 또는 실제 RAG release 계약을 바꿀 때 현재 단계를 교체한다.',
  },
  {
    id: 'nlp-attention',
    category: 'ai',
    subcategories: ['ai-nlp'],
    title: '문맥 예측에서 Transformer까지의 최소 언어 경로',
    goal: 'token, embedding, sequence memory와 attention을 거쳐 현대 LLM의 입력·출력 계산을 읽는다.',
    asOf: '2026-07-20',
    current: {
      title: '2026 LLM의 문맥·입력 경계',
      description: '기초 NLP의 token과 attention이 compressed context, depth mixing, encoder-free multimodal input에서 어떻게 확장되는지 확인한다.',
      source: 'DeepSeek · Moonshot AI · Google DeepMind', published: '2026-04–06', articleSlug: 'llm-architecture-gallery',
      url: 'https://huggingface.co/deepseek-ai/DeepSeek-V4-Flash/blob/main/DeepSeek_V4.pdf',
    },
    canonical: {
      title: 'Attention Is All You Need',
      description: '순환 없이 token 사이 관계를 직접 계산하는 현대 NLP의 공통 뼈대다.',
      source: 'Vaswani et al.', published: '2017', articleSlug: 'paper-transformer-2017',
      url: 'https://research.google/pubs/attention-is-all-you-need/',
    },
    concepts: [
      { articleSlug: 'tokenizer', label: 'Tokenizer', reason: '문자열이 어떤 token ID와 sequence length로 바뀌는지 먼저 고정한다.' },
      { articleSlug: 'word2vec', label: '문맥과 embedding', reason: 'token의 의미가 주변 예측에서 좌표로 생기는 출발점이다.' },
      { articleSlug: 'lstm', label: 'LSTM', reason: 'sequence state를 저장하는 방식과 병목을 체감한다.' },
      { articleSlug: 'attention-theory', label: 'Attention', reason: 'query와 memory를 score로 비교해 필요한 정보를 모은다.' },
      { articleSlug: 'transformer-architecture', label: 'Transformer', reason: 'attention, residual, normalization, FFN의 전체 block을 연결한다.' },
    ],
    foundations: [
      { articleSlug: 'linear-algebra-tensors', label: '벡터와 행렬', reason: 'embedding, projection과 attention shape를 읽는다.' },
      { articleSlug: 'probability-information-theory', label: '확률과 cross entropy', reason: '다음 token 예측의 학습 목표를 이해한다.' },
    ],
    implementation: [
      { articleSlug: 'training-pipeline', label: 'Language Model Training', reason: 'Tokenizer·batch·causal target·loss·checkpoint를 실제 학습 loop로 닫는다.' },
    ],
    stopReason: '형태소 분석과 통계적 NLP 전체를 먼저 배우지 않는다. tokenization, embedding, sequence state, attention을 계산하면 현대 모델로 올라간다.',
    promotionRule: '최신 모델이 tokenization, context mixing 또는 output contract를 바꿀 때만 NLP 바닥에 델타를 추가한다.',
  },
  {
    id: 'reinforcement-learning',
    category: 'ai',
    subcategories: ['ai-reinforcement-learning'],
    title: '현재 행동 시스템에서 필요한 RL 분기 하나 고르기',
    goal: '현재 제품의 action, data access와 실패 비용에서 시작해 policy control, offline data, world model, state·safety 또는 LLM reasoning 중 필요한 한 경로만 선택한다.',
    asOf: '2026-07-31',
    current: {
      title: 'Gemini Robotics-ER 1.6의 embodied system boundary',
      description: '현재 물리 행동 시스템은 RL 하나가 아니라 high-level reasoner, VLA·tool call과 layered safety를 결합한다. RL을 어느 계층에 쓸지 먼저 분리하는 기준 사례이며, 이 release 자체를 RL 알고리즘 논문으로 읽지 않는다.',
      source: 'Google DeepMind', published: '2026-04', articleSlug: 'rl-decision-system-contracts',
      url: 'https://deepmind.google/blog/gemini-robotics-er-1-6/',
    },
    canonical: {
      title: 'Proximal Policy Optimization Algorithms',
      description: '현재 policy에서 모은 rollout을 여러 번 학습하되 update 폭을 surrogate objective로 제한하는 대표 기준점이다.',
      source: 'Schulman et al.', published: '2017', articleSlug: 'paper-ppo-2017',
      url: 'https://arxiv.org/abs/1707.06347',
    },
    supportingEvidence: [
      {
        title: 'RISE: Self-Improving Robot Policy with Compositional World Model',
        description: 'World model이 imagined transition과 progress value를 나눠 advantage를 만들고 policy를 개선한다. High-level embodied reasoner와 실제 RL training environment의 역할을 구분하는 현재 비교점이다.',
        source: 'Yang et al.', published: '2026-02', articleSlug: 'rl-decision-system-contracts', articleAnchor: 'data-access',
        url: 'https://arxiv.org/abs/2602.11075',
      },
      {
        title: 'ContactRL: Safe RL Motion Planning',
        description: 'Reward에 contact force를 넣어도 deployment에는 별도 control-barrier shield가 필요하다는 training/runtime safety 경계를 보여 준다.',
        source: 'Mulkana et al.', published: '2025-12', articleSlug: 'rl-decision-system-contracts', articleAnchor: 'release',
        url: 'https://arxiv.org/abs/2512.03707',
      },
    ],
    concepts: [
      { articleSlug: 'rl-ppo-continuous-control', label: 'Policy · 제어', reason: '새 rollout과 continuous action을 다룰 수 있을 때 여는 분기다.' },
      { articleSlug: 'rl-imitation-offline-learning', label: 'Demonstration · Offline', reason: 'Static log와 expert query가 주어진 경우의 coverage·support 경계를 검산한다.' },
      { articleSlug: 'rl-model-based-world-models', label: 'World Model · Planning', reason: 'Learned dynamics의 상상과 real-return gap을 검산한다.' },
      { articleSlug: 'rl-pomdp-state-estimation', label: 'State 추정', reason: 'Sensor observation과 latent state를 분리하고 belief·filter·memory의 책임을 검산한다.' },
      { articleSlug: 'rl-safe-constrained-learning', label: 'Safety · 제약', reason: 'Expected constraint와 runtime action 차단을 별도 보장 층으로 둔다.' },
      { articleSlug: 'reasoning-post-training-frontier', label: 'LLM Reasoning · Verifiable RL', reason: '자동 검증 reward, sparse credit, entropy collapse와 test-time search가 병목일 때 여는 언어 추론 분기다.', addedByCurrent: true },
    ],
    conceptsEyebrow: '03 · CHOOSE ONE BRANCH',
    conceptsTitle: '현재 목표에 맞는 RL 분기 하나 선택',
    foundations: [
      { articleSlug: 'rl-mdp-bellman', label: 'MDP와 Bellman', reason: '선택한 분기에서 state, return과 recursive value가 막힐 때만 연다.' },
      { articleSlug: 'probability-information-theory', label: '확률과 기대값', reason: 'stochastic policy와 expected return을 읽는다.' },
      { articleSlug: 'calculus-computational-graphs', label: '미분', reason: 'log-probability gradient가 parameter update로 이어진다.' },
      { articleSlug: 'statistics-generalization', label: '분산과 평가', reason: 'rollout noise와 benchmark 과적합을 진단한다.' },
    ],
    implementation: [
      { articleSlug: 'open-r1', label: '한 분기의 구현 예 · Open-R1', reason: 'LLM reasoning 분기를 SFT data, rollout, verifier, GRPO와 held-out evaluation으로 닫는 구체적 실행 예다. 다른 분기를 골랐다면 같은 증거 역할을 해당 branch 구현으로 교체한다.', addedByCurrent: true },
    ],
    stopReason: '여섯 목표 분기를 모두 선수 과목으로 읽지 않는다. 적용 계약 뒤 현재 목표 한 분기만 열고, MDP·Bellman은 그 글의 계산이 막힐 때 내려가는 최소 바닥이다. 21편 원문은 각 분기 안에서 기본 숨김이다.',
    promotionRule: '새 연구가 action interface, feedback, data access, state uncertainty, safety 또는 release evidence를 바꿀 때만 해당 분기에 델타를 추가한다.',
  },
  {
    id: 'time-series',
    category: 'ai',
    subcategories: ['ai-timeseries-forecast'],
    title: '현재 pretrained forecasting을 누출 없는 backtest로 검증하기',
    goal: '현재 공개 모델의 interface에서 시작해 forecast origin·정보 가용성·rolling evaluation으로 내려가 실제 운영 개선인지 판정한다.',
    asOf: '2026-07-31',
    current: {
      title: 'TimesFM 2.5 · Chronos-2 · Moirai 2.0의 interface 변화',
      description: '긴 context, multivariate·covariate 입력, quantile output과 경량 decoder가 갈라진 현재 후보를 하나의 leaderboard가 아니라 task contract에 맞춰 고른다.',
      source: 'Google Research · Amazon Science · Salesforce Research', published: '2025', articleSlug: 'time-series-forecasting-evaluation',
      url: 'https://github.com/google-research/timesfm',
    },
    canonical: {
      title: 'DeepAR: Probabilistic Forecasting with Autoregressive Recurrent Networks',
      description: '여러 관련 시계열을 하나의 autoregressive probabilistic model로 학습하는 현대 forecasting 기준점이다.',
      source: 'Salinas et al.', published: '2017', articleSlug: 'paper-deepar-2017',
      url: 'https://arxiv.org/abs/1704.04110',
    },
    concepts: [
      { articleSlug: 'time-features', label: 'Point-in-time replay', reason: 'Lag·rolling·covariate가 각 forecast origin에 실제 도착해 있었는지 재생한다.', addedByCurrent: true },
      { articleSlug: 'arima', label: 'ARIMA', reason: '차분, 자기회귀와 moving average로 lag 구조를 먼저 분해한다.' },
      { articleSlug: 'transformer-architecture', label: 'Transformer', reason: '숫자 sequence tokenization이 현재 foundation model과 만나는 지점이다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'sampling, filtering, frequency와 convolution을 읽는다.' },
      { articleSlug: 'statistics-generalization', label: '통계', reason: 'stationarity, uncertainty와 backtest를 해석한다.' },
      { articleSlug: 'probability-information-theory', label: '확률분포', reason: 'point forecast와 predictive distribution을 구분한다.' },
    ],
    implementation: [
      { articleSlug: 'lstm-timeseries', label: 'LSTM Forecasting Pipeline', reason: 'Window, target, recurrent state, validation split과 forecast output을 학습 파이프라인으로 닫는다.' },
    ],
    stopReason: '시계열 통계의 모든 검정과 모형을 선행 과제로 만들지 않는다. lag, sampling, uncertainty, backtest를 설명하면 pretrained model로 올라간다.',
    promotionRule: '새 모델이 tokenization, covariate, probabilistic output 또는 zero-shot evaluation 계약을 바꿀 때 최상단과 델타를 갱신한다.',
  },
  {
    id: 'time-series-anomaly',
    category: 'ai',
    subcategories: ['ai-timeseries-anomaly'],
    title: '운영 알람을 점수가 아니라 사건으로 검증하기',
    goal: 'Point anomaly score에서 시작하지 않고 incident 경계, 허용 탐지 지연과 false-alert budget을 먼저 고정한 뒤 replay 가능한 residual·distribution 기준선으로 내려간다.',
    asOf: '2026-07-31',
    current: {
      title: 'Alert contract · Residual replay · Event gate',
      description: 'Threshold를 넘은 점을 즉시 사고로 세지 않고 gap, minimum duration, one-to-one incident matching과 target latency를 함께 검증한다.',
      source: '운영 계약 종합', published: '2026-07 검토', articleSlug: 'time-series-anomaly-detection',
    },
    canonical: {
      title: 'Precision and Recall for Time Series',
      description: 'Point label을 그대로 세는 대신 anomaly range의 존재, 위치, 겹침과 cardinality를 평가하는 최소 event-metric 기준점이다.',
      source: 'Tatbul et al.', published: '2018',
      url: 'https://proceedings.neurips.cc/paper/2018/hash/8f468c873a32bb0619eaeb2050ba45d1-Abstract.html',
    },
    supportingEvidence: [
      {
        title: 'ECOD: Unsupervised Outlier Detection Using Empirical CDFs',
        description: '시간축을 제거한 row-wise tail ranking이 유용한 최소 tabular baseline이지만 temporal incident 자체를 모델링하지 않는 경계를 제공한다.',
        source: 'Li et al.', published: '2022', articleSlug: 'ecod',
        url: 'https://arxiv.org/abs/2201.00382',
      },
    ],
    concepts: [
      { articleSlug: 'time-features', label: 'Point-in-time replay', reason: '알람 시점에 도착해 있던 lag·rolling·calendar만 재생해 미래 누출을 막는다.', addedByCurrent: true },
      { articleSlug: 'ecod', label: 'ECOD tail baseline', reason: '시간 순서를 제거한 한 행의 꼬리 점수와 지속되는 temporal incident를 구분한다.' },
    ],
    foundations: [
      { articleSlug: 'signals-systems-convolution', label: '필요할 때 · Sampling과 filter', reason: '센서 noise, filter delay와 실제 상태 변화를 구분할 때만 연다.' },
      { articleSlug: 'statistics-generalization', label: '필요할 때 · Event uncertainty', reason: 'incident 수, one-to-one matching과 false-alert rate의 분모를 검산할 때 연다.' },
    ],
    implementation: [
      { articleSlug: 'time-series-anomaly-detection', label: 'Residual → incident pipeline', reason: '과거 residual 중심·scale, threshold, minimum duration, gap과 release gate를 replay 가능한 state machine으로 닫는다.' },
    ],
    stopReason: '모든 anomaly algorithm을 직렬로 읽지 않는다. Residual baseline과 ECOD의 시간축 경계를 설명하고 incident-level replay를 통과하면 현재 배포 판단에 필요한 최소 바닥에 도달했다.',
    promotionRule: '새 연구가 alert unit, temporal context, delayed label, event matching 또는 target-device streaming cost 계약을 바꿀 때만 이 분기의 최상단을 갱신한다.',
  },
  {
    id: 'llm-data-engine',
    category: 'ai',
    subcategories: ['ai-llm-data', 'ai-llm-data-scaling', 'ai-llm-data-pipeline', 'ai-llm-data-training'],
    title: 'LLM이 처음 배우는 과정에서 실제 학습 run까지',
    goal: 'LLM이 다음 글 조각을 맞히며 배우는 사전학습을 먼저 이해한다. 그런 뒤 model 크기, 연습량, 서비스에서 생성할 답의 양과 고유 data 한계를 한 예산에서 비교해 model·data 계획을 결정한다.',
    asOf: '2026-07-22',
    current: {
      title: 'Test-Time Scaling Makes Overtraining Compute-Optimal',
      description: 'Pre-training과 반복 sampling 비용을 한 예산에서 최적화하면 작은 모델을 더 오래 학습하는 지점이 다시 달라질 수 있음을 보인 현재 연구다.',
      source: 'Roberts et al.', published: '2026-04', articleSlug: 'llm-pretraining-scaling',
      url: 'https://arxiv.org/abs/2604.01411',
    },
    canonical: {
      title: 'Training Compute-Optimal Large Language Models',
      description: '고정 training compute에서 model size와 token 수를 함께 늘려야 한다는 IsoFLOP 기준을 세우고 Chinchilla로 검증했다.',
      source: 'Hoffmann et al.', published: '2022', articleSlug: 'paper-chinchilla-2022',
      url: 'https://arxiv.org/abs/2203.15556',
    },
    concepts: [
      { articleSlug: 'llm-data-engine', label: 'LLM 데이터 엔진', reason: 'extract, filter, dedup, mixture, synthesis, contamination audit를 하나의 실행 계약으로 묶는다.', addedByCurrent: true },
      { articleSlug: 'tokenizer', label: 'Tokenizer', reason: '문서 수가 아니라 실제 학습 token과 언어별 분절 비용을 계산한다.' },
    ],
    foundations: [
      { articleSlug: 'probability-information-theory', label: '확률과 정보량', reason: 'token likelihood와 희귀 데이터의 신호를 구분한다.' },
      { articleSlug: 'statistics-generalization', label: '통계와 실험 설계', reason: 'dataset ablation, contamination과 holdout 성능을 검산한다.' },
    ],
    implementation: [
      { articleSlug: 'llm-pretraining-run', label: 'LLM Pre-training Run', reason: 'Dataset version을 유효 token batch, 분산 state, checkpoint·resume와 clean evaluation에 연결해 재현 가능한 학습 run으로 닫는다.' },
    ],
    stopReason: '모든 scaling 논문과 인터넷 전체 corpus의 역사를 읽지 않는다. N·D·C, inference demand, 고유 token, provenance·dedup·mixture와 clean evaluation을 설명하면 Chinchilla 2022 아래로 내려가지 않는다.',
    promotionRule: '새 연구가 train-to-test 예산, 반복 데이터의 유효성, data selection 또는 contamination 계약 중 하나를 실제로 바꿀 때만 최상단과 필요한 기반 델타를 갱신한다.',
  },
  {
    id: 'efficient-inference-on-device',
    category: 'ai',
    subcategories: ['ai-llm-efficiency', 'ai-llm-efficiency-runtime', 'ai-llm-efficiency-budget'],
    title: 'Device release에서 내려가는 On-device LLM Runtime',
    goal: 'checkpoint가 실행된다는 demo를 넘어 target별 graph, delegation, fallback, resident memory와 sustained thermal trace로 실제 배포 가능성을 판단한다.',
    asOf: '2026-07-23',
    current: {
      title: 'ExecuTorch 1.3 · Exporting LLMs',
      description: 'Model config, KV cache, quantization, backend lowering과 debug artifact를 하나의 export_llm 계약으로 묶은 현재 공식 device runtime 경로다.',
      source: 'PyTorch', published: '2026 · live docs', articleSlug: 'on-device-llm-runtime',
      articleAnchor: 'export-contract',
      url: 'https://docs.pytorch.org/executorch/stable/llm/export-llm.html',
    },
    canonical: {
      title: 'Exporting custom LLMs · Backend delegation',
      description: 'Exported graph를 target partitioner로 나누고 지원하지 않는 영역은 portable kernel로 실행하는 최소 backend 경계를 정의한다.',
      source: 'PyTorch', published: 'ExecuTorch 1.3', articleSlug: 'on-device-llm-runtime',
      articleAnchor: 'partition-delegate',
      url: 'https://docs.pytorch.org/executorch/stable/llm/export-custom-llm.html',
    },
    concepts: [
      { articleSlug: 'efficient-inference-on-device', label: 'Memory·속도 예산', reason: 'Model file, resident memory, KV cache, prefill와 decode latency를 한 budget으로 묶는다.', addedByCurrent: true },
      { articleSlug: 'quantization', label: '양자화', reason: 'PTQ, QAT, scale과 outlier가 정확도에 미치는 영향을 읽는다.' },
    ],
    foundations: [
      { articleSlug: 'linear-algebra-tensors', label: '행렬과 dtype', reason: 'shape, element 수와 element당 byte를 곱해 실제 memory를 계산한다.' },
      { articleSlug: 'statistics-generalization', label: 'Benchmark 통계', reason: '한 device의 평균 TPS와 tail latency·정확도 저하를 분리한다.' },
    ],
    implementation: [
      { articleSlug: 'compression-pipeline', label: 'Compress-to-Release', reason: '가중치·KV·연산·runtime 병목을 분리하고 선택한 압축 artifact를 동일 workload의 memory·latency·quality Pareto와 target-device gate로 검증한다.', addedByCurrent: true },
    ],
    stopReason: '모든 chip ISA와 compiler pass를 먼저 배우지 않는다. Export graph, delegated/fallback op, boundary byte, resident memory, first-token·decode latency와 sustained energy를 설명하면 실제 device 실험으로 올라간다.',
    promotionRule: '새 runtime이나 model이 export IR, backend partition, precision, KV representation 또는 power·thermal 측정 계약을 바꿀 때만 상단과 기반 델타를 갱신한다.',
  },
  {
    id: 'llm-disaggregated-serving',
    category: 'ai',
    subcategories: ['ai-llm-serving', 'ai-llm-serving-runtime', 'ai-llm-serving-operations'],
    title: 'SLO에서 KV 이동까지 내려가는 분산 LLM Serving',
    goal: '평균 tokens/s가 아니라 TTFT·TPOT를 분리하고, prefill/decode 간섭과 KV handoff 비용을 계산해 aggregated·disaggregated topology를 선택한다.',
    asOf: '2026-07-22',
    current: {
      title: 'NVIDIA Dynamo · Disaggregated Serving',
      description: 'Prefill·decode pool, KV-aware router, NIXL transfer와 runtime-reconfigurable xPyD를 engine 위 orchestration layer로 묶은 현재 공개 구현 기준점이다.',
      source: 'NVIDIA Dynamo', published: '2025-03 · live docs', articleSlug: 'llm-disaggregated-serving',
      articleAnchor: 'kv-handoff',
      url: 'https://docs.nvidia.com/dynamo/design-docs/disaggregated-serving',
    },
    canonical: {
      title: 'Mooncake: A KVCache-centric Disaggregated Architecture',
      description: 'Kimi의 long-context workload에서 prefill·decode cluster, multi-tier KV cache와 SLO-aware scheduler를 하나의 production architecture로 설명한 기준점이다.',
      source: 'Moonshot AI · Tsinghua University', published: '2024-06', articleSlug: 'llm-disaggregated-serving',
      articleAnchor: 'routing-state',
      url: 'https://arxiv.org/abs/2407.00079',
    },
    concepts: [
      { articleSlug: 'vllm-serving', label: 'Request 실행', reason: '한 request가 engine, model runner와 output stream을 지나는 실제 runtime boundary를 읽는다.' },
      { articleSlug: 'vllm-paged-attention', label: 'Paged KV memory', reason: '가변 길이 KV를 block으로 할당·공유하고 capacity를 회수하는 방식을 읽는다.' },
      { articleSlug: 'vllm-scheduler', label: 'Iteration scheduler', reason: 'Prefill과 decode를 token budget 안에서 batch·preempt하는 실행 순서를 읽는다.' },
    ],
    foundations: [
      { articleSlug: 'linear-algebra-tensors', label: 'Tensor shape와 byte', reason: 'Layer·KV head·head dimension·dtype에서 token당 KV byte를 계산한다.' },
      { articleSlug: 'gpu-hpc-from-scratch', category: 'gpu', label: 'GPU HPC와 RDMA', reason: '100/200/400GbE, RoCE·InfiniBand와 GPU 간 KV 전송의 물리 경로를 구분한다.', addedByCurrent: true },
      { articleSlug: 'statistics-generalization', label: 'Tail latency와 실험', reason: '평균과 p95·p99, workload drift와 A/B baseline을 구분한다.' },
    ],
    implementation: [
      { articleSlug: 'llm-serving-ops', label: '서빙 운영 제어면', reason: 'Runtime 선택을 release, fleet, gateway, SLO와 recovery 계약으로 닫는다.' },
      { articleSlug: 'observability-aiops', label: 'SLO·Runbook', reason: 'TTFT·TPOT·handoff·cache·saturation 신호를 alert와 복구 행동에 연결한다.' },
    ],
    stopReason: '모든 분산 시스템과 cache 논문의 역사를 읽지 않는다. Mooncake 2024의 phase 분리, KV/token, multi-tier cache, SLO-aware scheduling과 failure gate를 설명하면 필수 역사 하향을 멈춘다. Orca·queueing·virtual memory·RDMA 원문은 profiler나 failure trace가 해당 기반을 직접 요구할 때만 연다.',
    promotionRule: '새 runtime이 request phase, KV ownership·transport, routing signal 또는 SLO/capacity 계약을 실제로 바꿀 때만 현재 상단과 필요한 기반 델타를 갱신한다.',
  },
  {
    id: 'speech-audio',
    category: 'ai',
    subcategories: ['ai-speech-audio'],
    title: 'Production voice agent에서 네 갈래 책임으로 내려가는 Speech · Audio AI',
    goal: '현재 production voice agent의 행동·정책·평가 계약에서 출발해 interaction, 생성, 인식, 표현을 독립적으로 열고 필요할 때만 신호 기반까지 내려간다.',
    asOf: '2026-07-23',
    current: {
      title: 'OpenAI Presence: production voice agent의 정책·승인·개선 loop',
      description: '실시간 voice agent를 모델 demo가 아니라 업무별 권한, 승인 행동, 사람 escalation, simulation·grader와 배포 후 개선 계약으로 검증하는 현재 product 상단이다.',
      source: 'OpenAI', published: '2026-07', articleSlug: 'realtime-duplex-voice-systems',
      url: 'https://openai.com/index/introducing-openai-presence/',
    },
    canonical: {
      title: 'Moshi: a speech-text foundation model for real-time dialogue',
      description: 'User와 model audio stream을 병렬로 모델링하고 Mimi codec, temporal·depth Transformer와 inner monologue를 결합한 공개 full-duplex 연구 기준점이다.',
      source: 'Kyutai', published: '2024', articleSlug: 'paper-moshi-2024',
      url: 'https://arxiv.org/abs/2410.00037',
    },
    concepts: [
      { articleSlug: 'native-speech-generation', label: 'Native Speech Generation', reason: 'Cascade와 Thinker–Talker, semantic state와 multi-codebook acoustic output의 실행 책임을 구분한다.', addedByCurrent: true },
      { articleSlug: 'speech-recognition-objectives', label: 'Speech Recognition Objectives', reason: 'CTC·RNN-T·attention이 frame과 transcript alignment, partial stability를 어떻게 책임지는지 읽는다.', addedByCurrent: true },
      { articleSlug: 'audio-representation-neural-codecs', label: 'Audio Representation · Neural Codec', reason: 'Waveform, STFT·mel, learned latent, RVQ와 codec bitrate의 정보 보존 관계를 계산한다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'signals-systems-convolution', label: '신호와 시스템', reason: 'Sample rate, aliasing, window, spectrum, convolution과 group delay의 물리적 의미를 읽는다.' },
      { articleSlug: 'probability-information-theory', label: '확률과 entropy', reason: 'Alignment path likelihood, autoregressive code probability와 codec bitrate를 읽는다.' },
    ],
    implementation: [
      { articleSlug: 'efficient-inference-on-device', label: 'On-device Runtime', reason: '음성 경로에 쓰는 local model도 resident weight, KV cache, operator coverage, first-token, thermal·energy budget으로 target device 배치를 검증한다.' },
    ],
    stopReason: '음향학과 speech 논문을 시대순으로 전부 읽지 않는다. 현재 failure가 interaction·generation·recognition·representation 중 어디에 있는지 설명하고, sampling·bitrate·latency를 계산할 수 있으면 실험으로 올라간다.',
    promotionRule: '새 model이나 회사 글이 interaction action, interruption cancellation, alignment objective, audio representation 또는 realtime transport 계약을 바꿀 때만 해당 층을 교체하거나 기반 delta를 추가한다.',
  },
  {
    id: 'world-model-physical-ai',
    category: 'ai',
    subcategories: ['ai-world-models'],
    title: '예측을 행동 선택으로 닫는 World Model · Physical AI',
    goal: 'video 생성, latent dynamics, action-conditioned simulation과 robot policy를 구분하고 예측이 planning에 실제로 쓰이는 조건을 검증한다.',
    asOf: '2026-07-21',
    current: {
      title: 'Cosmos 3 · Omnimodal World Models for Physical AI',
      description: 'text·image·video와 physical action을 함께 다루는 world foundation model을 Physical AI용 simulation과 reasoning으로 확장한 현재 범용 상단이다. DreamZero 같은 direct world-action policy의 real closed-loop evidence는 별도 contract로 비교한다.',
      source: 'NVIDIA Research', published: '2026-06', articleSlug: 'world-model-physical-ai',
      url: 'https://research.nvidia.com/labs/cosmos-lab/cosmos3/technical-report.pdf',
    },
    canonical: {
      title: 'V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning',
      description: 'pixel 복원보다 latent prediction을 학습하고 적은 robot action data로 action-conditioned planner를 만드는 현대 최소 기준점이다.',
      source: 'Meta AI', published: '2025-06', articleSlug: 'paper-vjepa2-2025',
      url: 'https://ai.meta.com/research/vjepa/',
    },
    concepts: [
      { articleSlug: 'predictive-world-representations', label: 'Predictive Representation', reason: 'observation·hidden state, masked latent target와 action-free prediction의 경계를 잡는다.', addedByCurrent: true },
      { articleSlug: 'action-conditioned-world-dynamics', label: 'Action-Conditioned Dynamics', reason: 'action frame·unit·timestamp, forward/inverse/joint mode와 rollout objective를 읽는다.', addedByCurrent: true },
      { articleSlug: 'world-model-planning-closed-loop', label: 'Planning · Closed Loop', reason: 'goal, CEM, MPC, uncertainty, constraint와 real feedback을 실행 trace로 닫는다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'robot-camera-geometry-calibration', label: 'Camera Frame · Calibration', reason: 'camera, robot base, end-effector pose와 새 view의 extrinsic error를 검산한다.' },
      { articleSlug: 'probability-information-theory', label: '확률 dynamics', reason: '여러 가능한 미래와 하나의 deterministic prediction을 구분한다.' },
      { articleSlug: 'rl-mdp-bellman', label: 'State · Action · Transition', reason: '예측 모델을 reward와 decision problem으로 확장해야 할 때 MDP contract를 연다.' },
    ],
    implementation: [
      { articleSlug: 'robot-motion-planning', label: 'Closed-loop Planning', reason: 'Predicted rollout을 collision·dynamics cost로 채점하고 실제 관측으로 replanning한다.' },
      { articleSlug: 'robot-system-verification-validation-qualification', label: 'Physical AI Release', reason: 'sensor, planner, controller와 actuator의 요구사항·trace·qualification evidence를 닫는다.' },
    ],
    stopReason: '모든 generative video·model-based RL 논문을 읽지 않는다. V-JEPA 2/2-AC에서 observation, action-conditioned transition, CEM/MPC와 closed-loop evidence를 설명하면 현대 최소 기준에서 멈춘다.',
    promotionRule: '2026-07-30 World Action Planner는 VLM proposal과 imagined rollout search를 바꾸지만 현재 공개 증거가 simulation 중심이라 승격을 보류했다. 이후 새 연구가 action representation, temporal consistency, controllability, planning objective 또는 real-world closed-loop evidence를 바꿀 때 최상단을 교체한다.',
  },
  {
    id: 'ai-agents',
    category: 'ai',
    subcategories: [
      'ai-agents',
      'ai-agents-current',
      'ai-agents-action',
      'ai-agents-coordination',
      'ai-agents-safety',
      'ai-agents-foundations',
      'ai-agents-cases',
    ],
    title: '현재 Runtime에서 최소 기반으로 내려가는 Agent Systems',
    goal: 'model proposal, harness, action surface, durable state, remote task와 human control을 분리하고 실제 effect와 실행 trace로 신뢰성을 검증한다.',
    asOf: '2026-07-25',
    current: {
      title: 'The next evolution of the Agents SDK',
      description: 'Memory, sandbox-aware orchestration, skills, MCP, snapshot·rehydration과 harness/compute 분리를 하나의 현재 agent runtime으로 묶는다.',
      source: 'OpenAI', published: '2026-04', articleSlug: 'agent-runtime-current-first',
      url: 'https://openai.com/index/the-next-evolution-of-the-agents-sdk/',
    },
    canonical: {
      title: 'ReAct: Synergizing Reasoning and Acting in Language Models',
      description: '생각과 tool action, 관측을 번갈아 기록해 외부 환경과 닫힌 loop를 만드는 대표 구조다.',
      source: 'Yao et al.', published: '2022',
      url: 'https://arxiv.org/abs/2210.03629',
      articleSlug: 'paper-react-2022',
    },
    concepts: [
      { articleSlug: 'skills-anatomy', label: 'Agent Skills', reason: '절차·reference·script의 progressive disclosure를 tool capability와 permission에서 분리한다.', addedByCurrent: true },
      { articleSlug: 'llm-harness', label: 'Durable Harness', reason: 'Admission, dispatcher, policy, reducer, checkpoint와 trace를 replay 가능한 runtime으로 묶는다.', addedByCurrent: true },
      { articleSlug: 'computer-use-agent-runtime', label: 'Computer Use', reason: 'Screenshot grounding, approval, ambiguous timeout과 effect verification을 행동 계약으로 닫는다.', addedByCurrent: true },
      { articleSlug: 'multi-agent-implementation', label: 'Long-running · Multi-agent', reason: 'Checkpoint, task envelope, artifact, A2A lifecycle와 merge owner를 구현한다.', addedByCurrent: true },
      { articleSlug: 'prompt-injection-defense', label: 'Prompt Injection 방어', reason: 'untrusted content와 privileged action 사이를 격리한다.', addedByCurrent: true },
      { articleSlug: 'agent-evaluation-trace', label: 'Agent Evaluation & Trace', reason: '최종 state, 실행 trace, 반복 신뢰성과 regression으로 변경이 실제 개선인지 닫는다.', addedByCurrent: true },
      { articleSlug: 'agent-devlog-patterns', label: 'Decision Log', reason: 'Trace에서 발견한 실패와 변경 이유, 다시 적용할 원칙을 재현 가능한 결정 기록으로 남긴다.', addedByCurrent: true },
    ],
    foundations: [
      { articleSlug: 'prompt-engineering', label: 'Prompt Contract', reason: '현재 task의 목표, 성공 기준, trust boundary와 공개 evidence가 막힐 때 내려간다.' },
      { articleSlug: 'xml-prompting', label: 'Semantic Boundary', reason: '긴 context에서 instruction·document·example 역할을 표시하되 authorization과 분리한다.' },
      { articleSlug: 'mcp-protocol', label: 'Tool Protocol', reason: 'Host와 외부 capability 사이의 discovery·schema·result 경계가 막힐 때만 내려간다.' },
      { articleSlug: 'context-engineering', label: 'Context Packet', reason: '각 turn에 어떤 state와 evidence를 넣고 뺄지 막힐 때 내려간다.' },
      { articleSlug: 'agentic-patterns', label: 'Agent Loop', reason: '고정 workflow와 관찰 뒤 경로가 바뀌는 ReAct loop의 최소 차이까지 내려간다.' },
    ],
    implementation: [
      { articleSlug: 'claw-tool-system', label: 'Tool Dispatch 구현', reason: '공통 action contract를 registry, dispatch와 실행 gate가 있는 실제 code path로 검산한다.', addedByCurrent: true },
      { articleSlug: 'claw-permissions', label: 'Permission 구현', reason: 'Authorization 판정과 runtime enforcement를 실제 policy engine 경계에서 검산한다.', addedByCurrent: true },
      { articleSlug: 'claw-subagent-orchestration', label: 'Worker Coordination 구현', reason: 'Delegation packet, 새 Session, allowlist와 background terminal manifest의 실제 경계를 검산한다.', addedByCurrent: true },
      { articleSlug: 'claw-policy-engine', label: 'Policy Gate 구현', reason: 'Lane state와 quality contract가 선언 규칙에서 allow·deny·escalate로 바뀌는 지점을 검산한다.', addedByCurrent: true },
      { articleSlug: 'claw-telemetry', label: 'Trace · Telemetry 구현', reason: 'Opt-in typed event와 sequence-bearing trace가 동기 sink에 기록되고 유실될 수 있는 경계를 검산한다.', addedByCurrent: true },
      { articleSlug: 'claw-recovery', label: 'Bounded Recovery 구현', reason: '분류된 failure가 scenario별 한 번의 simulated recipe, exact result와 event로 닫히고 실제 effect는 외부에 남는 경계를 검산한다.', addedByCurrent: true },
    ],
    stopReason: 'ReAct 2022보다 과거의 planning·RL 계보를 모두 열지 않는다. 현재 실패를 model proposal, action, durability, coordination, safety와 evaluation으로 설명하고 구현할 수 있으면 최소 기반에서 멈춘다.',
    promotionRule: '새 연구가 harness/compute 책임, computer-use observation·commit, remote task lifecycle, oversight·security 또는 trace evaluation의 운영 계약을 바꿀 때 최상단을 교체한다.',
  },
];

export function getTopDownResearchTrack(subcategorySlug: string) {
  return topDownResearchTracks.find((track) => track.subcategories.includes(subcategorySlug));
}

export function getTopDownResearchTrackById(trackId: string) {
  return topDownResearchTracks.find((track) => track.id === trackId);
}
