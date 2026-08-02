import type { Category } from '../types';
import { aiArticles } from './articles';

const ai: Category = {
  slug: 'ai',
  name: 'AI',
  description: '현재 연구·산업 목표에서 시작해 핵심 개념, 최소 기반, 원문 근거와 구현으로 내려가는 탑다운 학습 경로',
  group: 'capability',
  subcategories: [
    { slug: 'ai-systems-foundation', name: '처음 보는 기술 읽기 도구', description: '필수 출발점이 아니라, 낯선 시스템의 입력·상태·계산·전달·검증 위치를 찾을 때 쓰는 선택 안내', icon: '🧭' },
    { slug: 'ai-knowledge-systems', name: '지식 시스템', description: '원문 구조 복구에서 Knowledge IR·RAG·지속 갱신까지 근거를 잃지 않는 경로', icon: '▦' },
    {
      slug: 'ai-robotics',
      name: '로봇 AI',
      description: '현재 VLA 목표에서 perception, planning, runtime, actuator와 검증 책임으로 내려가는 경로',
      icon: '⚙',
      aggregateChildArticles: true,
      childNavigation: {
        mode: 'sequence',
        placement: 'after-track',
        title: '명령이 물리 행동이 되는 실행 순서',
        description: '전체 계약을 먼저 잡고 perception에서 qualification까지 책임 경계를 순서대로 따라갑니다.',
      },
      children: [
        { slug: 'ai-robotics-overview', name: '00 · 전체 실행 계약', description: '현재 VLA에서 observation, policy, controller, actuator와 closed-loop evidence를 구분' },
        { slug: 'ai-robotics-perception-state', name: '01 · Perception · State', description: 'Camera calibration, scene representation, localization, 좌표계와 kinematics' },
        { slug: 'ai-robotics-planning-control', name: '02 · Planning · Control', description: 'Collision-free path, trajectory timing, dynamics, feedback와 constrained control' },
        { slug: 'ai-robotics-runtime-embedded', name: '03 · Runtime · Embedded', description: 'ROS 2 graph, QoS, executor, real-time scheduling과 MCU deadline' },
        { slug: 'ai-robotics-actuation-power', name: '04 · Actuation · Power', description: 'FOC, motor driver, braking, isolation, transmission과 holding brake' },
        { slug: 'ai-robotics-mechanics-qualification', name: '05 · Mechanics · Qualification', description: '구조, fatigue, fracture, composite, tribology와 system qualification' },
      ],
    },
    { slug: 'ai-foundations', name: '딥러닝 공통 기반', description: '공통 관점에서 모델·손실·역전파·표현 학습까지 내려가는 딥러닝 핵심 경로', icon: '🧠' },
    { slug: 'ai-math-foundations', name: '수학 · 과학 보강', description: 'AI에서 쓰는 선형대수·미분·최적화·확률·통계·신호와 시스템을 계산 예제로 보강', icon: '∑' },
    { slug: 'ai-nlp', name: 'NLP · 어텐션', description: 'Transformer, 어텐션 메커니즘, 토큰화', icon: '💬' },
    {
      slug: 'ai-reinforcement-learning', name: '강화학습 · 의사결정', description: '현재 적용 계약에서 policy 제어, offline data, world model, state 추정, 안전과 최소 기반으로 갈라지는 경로', icon: '↻',
      childNavigation: {
        mode: 'catalog',
        placement: 'after-track',
        title: '적용 계약 뒤에 필요한 의사결정 분기만 고릅니다',
        description: '모든 RL 글을 직렬로 읽지 않습니다. 현재 데이터·관측·안전 조건에 맞는 분기 하나를 고르고, 최소 기반은 막힐 때만 엽니다.',
        groups: [
          { id: 'rl-contract', label: '먼저 고정할 계약', description: '이 문제가 정말 RL인지 먼저 판정합니다.', slugs: ['ai-rl-orientation'], role: 'common' },
          { id: 'rl-branches', label: '문제별 학습 분기', description: '현재 데이터와 실패 조건에 맞는 하나를 고릅니다.', slugs: ['ai-rl-policy-control', 'ai-rl-offline', 'ai-rl-world-model', 'ai-rl-state-estimation', 'ai-rl-safety'], role: 'case', collapsed: true },
          { id: 'rl-floor', label: '선택적 계산 바닥', description: 'Return·Bellman·TD가 막힐 때만 내려갑니다.', slugs: ['ai-rl-foundations'], role: 'optional' },
        ],
      },
      children: [
        { slug: 'ai-rl-orientation', name: '00 · 적용 계약', description: '이 문제가 정말 RL인지 판정하고 observation·action·feedback·data access·release gate를 고정' },
        { slug: 'ai-rl-policy-control', name: '01 · Policy · 제어', description: 'PPO와 continuous control에서 rollout, advantage, policy shift와 actuator action을 검산' },
        { slug: 'ai-rl-offline', name: '02 · Demonstration · Offline', description: 'Expert query와 static log의 coverage, support, OPE와 배포 선택을 검산' },
        { slug: 'ai-rl-world-model', name: '03 · World Model · Planning', description: 'Learned dynamics의 model bias, search target과 latent imagination을 검산' },
        { slug: 'ai-rl-state-estimation', name: '04 · State 추정', description: '부분 관측에서 observation과 latent state를 나누고 belief·filter·memory를 검산' },
        { slug: 'ai-rl-safety', name: '05 · Safety · 제약', description: 'Expected constraint, runtime shield와 hardware interlock의 책임을 분리' },
        { slug: 'ai-rl-foundations', name: '06 · 최소 기반', description: '필요할 때만 MDP·return·Bellman과 MC·TD·Q-learning까지 내려가는 계산 바닥' },
      ],
    },
    {
      slug: 'ai-vision', name: '컴퓨터 비전', description: '제품이 요구하는 출력에서 시작해 promptable vision, 객체 탐지와 최소 표현 기반으로 내려가는 경로', icon: '👁️', aggregateChildArticles: true,
      childNavigation: {
        mode: 'catalog',
        placement: 'after-track',
        title: '출력 계약 뒤에 현재 작업 분기를 고릅니다',
        description: '공통 작업 계약을 먼저 고정하고 Promptable·Tracking 또는 Detection 중 필요한 출력을 선택합니다. 표현 기반은 막힐 때만 엽니다.',
        groups: [
          { id: 'vision-contract', label: '공통 작업 계약', description: '좌표·평가·handoff를 먼저 고정합니다.', slugs: ['ai-vision-overview'], role: 'common' },
          { id: 'vision-branches', label: '현재 작업 분기', description: '필요한 출력 형식에 맞는 하나를 고릅니다.', slugs: ['ai-vision-promptable', 'ai-vision-detection'], role: 'case' },
          { id: 'vision-floor', label: '선택적 표현 기반', description: 'Backbone과 feature가 막힐 때만 내려갑니다.', slugs: ['ai-vision-foundations'], role: 'optional' },
        ],
      },
      children: [
        { slug: 'ai-vision-overview', name: '00 · 작업 계약', description: '분류·박스·마스크·ID 중 필요한 출력을 고르고 좌표·평가·handoff를 고정' },
        { slug: 'ai-vision-promptable', name: '01 · Promptable · Tracking', description: 'Text·점·박스 prompt에서 mask와 video identity를 유지하는 현재 경로' },
        { slug: 'ai-vision-detection', name: '02 · Object Detection', description: 'Fixed/open vocabulary 선택에서 real-time detector와 sparse set prediction으로 내려가는 경로' },
        { slug: 'ai-vision-foundations', name: '03 · 표현 · Backbone 기반', description: 'Vision-language alignment, image token, residual path와 convolution의 최소 기반' },
      ],
    },
    {
      slug: 'ai-timeseries',
      name: '시계열 · 예측과 이상',
      description: '미래 값을 예측하는 문제와 운영 사건을 검출하는 문제를 먼저 분리한 뒤, 각 경로에서 필요한 기준선과 시간 기반만 읽는 경로',
      icon: '⌁',
      childNavigation: {
        mode: 'choice',
        placement: 'before-track',
        title: '먼저 운영 결정을 하나 고릅니다',
        description: '숫자 미래가 필요한지, 경보 사건이 필요한지에 따라 평가 단위와 모델 경로가 달라집니다. 두 경로를 모두 선수 과목으로 읽지 않습니다.',
      },
      children: [
        { slug: 'ai-timeseries-forecast', name: '01 · Forecasting', description: 'Forecast origin·rolling backtest에서 확률 예측과 ARIMA·LSTM 기준선으로 내려가는 경로' },
        { slug: 'ai-timeseries-anomaly', name: '02 · Anomaly · Incident', description: 'Alert contract·replay에서 residual event와 ECOD 기준선으로 내려가는 경로' },
      ],
    },
    { slug: 'ai-generative', name: '생성 모델', description: '현재 DiT·Flow Matching·few-step 생성과 평가에서 시작해 Diffusion·ODE·ViT·VAE 최소 기반으로 내려가고, 분포·VAE·GAN 비교는 별도 핵심 경로로 읽는다.', icon: '🎨' },
    {
      slug: 'ai-open-models', name: '오픈 이미지 · 비디오 제작', description: '현재 제작 목표에서 실행 원리, 재현 가능한 workflow, 비용과 적응으로 이어지는 경로', icon: '🖼️',
      childNavigation: {
        mode: 'catalog',
        placement: 'after-track',
        title: '제작 경로를 잡은 뒤 필요한 사례만 엽니다',
        description: '공통 실행·재현 경로는 먼저 읽고, Stable Diffusion은 상속이 막힐 때만, 현재 모델과 제작 사례는 필요한 문제에 맞춰 선택합니다.',
        groups: [
          { id: 'open-media-common', label: '공통 제작 경로', description: '목표 선택과 재현 가능한 workflow를 먼저 고정합니다.', slugs: ['ai-open-models-overview', 'ai-open-models-comfyui'], role: 'common' },
          { id: 'open-media-floor', label: '선택 기준선', description: 'U-Net·SDXL 상속을 확인해야 할 때만 엽니다.', slugs: ['ai-open-models-sd'], role: 'optional' },
          { id: 'open-media-image-cases', label: '현재 이미지 모델 사례', description: 'Typography, style 탐색, 효율 또는 domain 적응 문제가 있을 때만 펼칩니다.', slugs: ['ai-open-models-krea', 'ai-open-models-z-image', 'ai-open-models-ideogram', 'ai-open-models-illustrious'], role: 'case', collapsed: true },
          { id: 'open-media-video-cases', label: '현재 영상·제작 사례', description: '시간 일관성, audio-video 또는 2D 제작 문제가 있을 때만 펼칩니다.', slugs: ['ai-open-models-ltx', 'ai-open-models-wan', 'ai-open-models-animation'], role: 'case', collapsed: true },
        ],
      },
      children: [
        { slug: 'ai-open-models-overview', name: '00 · 목표에서 제작까지', description: '목표 선택, Image/Video branch, 재현, parameter budget과 adaptation' },
        { slug: 'ai-open-models-comfyui', name: '01 · Workflow 실행·재현', description: 'Snapshot, 타입 DAG, 모델 부품, sampling, condition, image edit, postprocess와 dependency release' },
        { slug: 'ai-open-models-sd', name: '기준 Runtime · Stable Diffusion', description: 'Latent diffusion의 관찰 가능한 구현 기준선' },
        { slug: 'ai-open-models-krea', name: '현대 Foundation · Krea 2', description: '넓은 style 분포, architecture ablation, curriculum과 RAW→Turbo handoff' },
        { slug: 'ai-open-models-z-image', name: '효율 Foundation · Z-Image', description: 'Single-stream DiT, Turbo/Edit 변형과 실험 포인트' },
        { slug: 'ai-open-models-ideogram', name: 'Typography · Ideogram 4', description: 'Structured caption, bbox·palette, single-stream flow와 배포 권리' },
        { slug: 'ai-open-models-illustrious', name: '도메인 적응 · Illustrious XL', description: 'SDXL 기반 일러스트·캐릭터와 LoRA 생태계' },
        { slug: 'ai-open-models-ltx', name: 'Video 사례 · LTX', description: 'LTX-2.3 joint audio-video DiT와 공개 trainer' },
        { slug: 'ai-open-models-wan', name: 'Video 사례 · Wan', description: 'Wan2.2 noise-regime MoE와 dense TI2V 구분' },
        { slug: 'ai-open-models-animation', name: '제작 경로 · 2D Animation', description: 'Shot 계약, dataset, condition, 적응·제어, 시간 표현과 release evidence' },
      ],
    },
    {
      slug: 'ai-ocr', name: 'OCR · 문서 AI', description: '페이지를 읽은 결과를 근거가 보존된 장문 문서와 검색 단위로 조립하는 경로', icon: '📄', aggregateChildArticles: true,
      childNavigation: {
        mode: 'sequence',
        placement: 'after-track',
        title: '페이지 입력에서 근거 기반 검색까지',
        description: '문서 계약, 페이지 파싱, 구조 조립, release·RAG를 하나의 증거 보존 순서로 따라갑니다.',
      },
      children: [
        { slug: 'ai-ocr-overview', name: '00 · 문서 계약', description: '목표 질문, 입력 품질, 출력 schema와 전체 실행 경로' },
        { slug: 'ai-ocr-models', name: '01 · Page Parser', description: '페이지에서 text·표·수식·좌표를 복원하는 OCR/VLM' },
        { slug: 'ai-ocr-structure', name: '02 · Document Assembly', description: '페이지 경계, 제목 계층, 표, 그림·캡션과 provenance 복원' },
        { slug: 'ai-ocr-practice', name: '03 · Release · RAG', description: '구조 검증, 회귀 평가, review queue와 근거 기반 검색 연결' },
      ],
    },
    {
      slug: 'ai-llm', name: 'LLM', description: '데이터·구조·post-training·해석과 device·serving의 여섯 경로를 모델 lifecycle과 실행 lifecycle 두 묶음으로 나눠 읽는 경로', icon: '🚀',
      childNavigation: {
        mode: 'choice',
        placement: 'before-track',
        title: '지금 다룰 lifecycle을 먼저 고릅니다',
        description: '모델을 만들고 검증하는 경로와 실행·배포 경로를 섞지 않습니다. 현재 병목이 있는 쪽 하나를 엽니다.',
      },
      children: [
        {
          slug: 'ai-llm-model-building',
          name: '모델 만들기 · 검증',
          description: '데이터 예산, 구조, post-training과 해석 증거를 하나의 model lifecycle로 연결',
          childNavigation: {
            mode: 'sequence',
            placement: 'after-track',
            title: '모델 lifecycle을 데이터에서 인과 증거까지 따라갑니다',
            description: '데이터·구조·post-training·해석은 서로 대체하는 선택지가 아니라 모델을 만들고 검증하는 연속 책임입니다.',
          },
          children: [
            {
              slug: 'ai-llm-data', name: '01 · 데이터 · Pre-training', description: 'LLM이 다음 글 조각을 맞히며 처음 배우는 과정을 이해한 뒤, 학습 data와 재현 가능한 run으로 내려가는 경로', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: 'Pre-training을 이해한 뒤 data와 실행으로',
                description: '다음 token 예측을 반복하는 첫 학습을 이해하고 예산을 정한 뒤, 실제 학습 신호와 재현 가능한 run으로 닫습니다.',
              },
              children: [
                { slug: 'ai-llm-data-scaling', name: '00 · Pre-training은 무엇인가', description: 'LLM이 다음 글 조각을 맞히며 배우는 첫 단계에서 model 크기, 연습 token과 전체 예산을 결정하는 법' },
                { slug: 'ai-llm-data-pipeline', name: '01 · 데이터 신호', description: '수집·추출·중복 제거·혼합·합성·오염 검사를 거쳐 실제 token stream을 만드는 과정' },
                { slug: 'ai-llm-data-training', name: '02 · 학습 실행', description: '유효 token batch, 분산 state, checkpoint·resume와 clean scale-up gate' },
              ],
            },
            {
              slug: 'ai-llm-architectures', name: '02 · LLM 아키텍처', description: 'GPT-2의 dense 기준점에서 KV 효율, Sparse MoE, Hybrid 구조까지 병목을 하나씩 추가하는 경로', icon: '🏗️', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: 'Dense 기준점에 병목 해결 구조를 하나씩 추가합니다',
                description: '현재 구조 질문을 먼저 확인한 뒤 Dense, KV·Context, MoE, Hybrid와 실제 보고서 검산 순서로 내려갑니다.',
              },
              children: [
                { slug: 'ai-llm-architectures-overview', name: '00 · 구조 읽는 출발점', description: '2026년의 다섯 질문에서 최소 기준 계보와 논문 읽는 법으로 내려가는 경로' },
                { slug: 'ai-llm-architectures-dense', name: '01 · Dense 기준점', description: 'GPT-2에서 Llama, Qwen, Gemma, OLMo로 이어지는 decoder 실행 계약' },
                { slug: 'ai-llm-architectures-kv-context', name: '02 · KV와 긴 문맥', description: 'GQA, MLA, local/global attention이 메모리와 가시 범위를 바꾸는 방식' },
                { slug: 'ai-llm-architectures-moe', name: '03 · Sparse MoE', description: 'dense MLP를 router와 expert로 바꿔 모델 용량과 token당 계산을 분리하는 방식' },
                { slug: 'ai-llm-architectures-hybrid', name: '04 · Hybrid와 상태', description: 'attention 일부를 state update로 대체해 긴 문맥 비용을 낮추는 방식' },
                { slug: 'ai-llm-architectures-case-study', name: '05 · 실제 보고서 검산', description: '구조·RL·agent가 결합된 기술 보고서를 원문 수식, 실행 순서, 증거 경계로 다시 읽는 경로' },
              ],
            },
            {
              slug: 'ai-llm-post-training', name: '03 · Reasoning · Post-training', description: '현재 reasoning 병목에서 feedback 계약과 policy update 구현으로 내려가는 독립 경로', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: '현재 병목에서 feedback과 policy update로',
                description: '현재 reasoning 실패를 확인하고 학습 신호를 구분한 뒤 구현 batch를 검산합니다.',
              },
              children: [
                { slug: 'ai-llm-post-training-current', name: '00 · 현재 병목', description: 'RL compute scaling, credit assignment, exploration, overthinking과 monitorability' },
                { slug: 'ai-llm-post-training-foundation', name: '01 · Feedback 계약', description: 'CPT, SFT, 선호 학습, RLHF와 RLVR의 데이터·학습 신호 분리' },
                { slug: 'ai-llm-post-training-implementation', name: '02 · 구현 · 검산', description: 'PPO·GRPO, verifier, rollout data와 Open-R1의 한 batch 실행 경로' },
              ],
            },
            {
              slug: 'ai-llm-interpretability', name: '04 · LLM 해석', description: '관찰 가능한 신호에서 sparse feature와 causal circuit 검증까지', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: '관찰에서 feature와 인과 검증까지',
                description: '현재 증거 강도를 먼저 잡고 readout, sparse feature, causal circuit 순으로 증거를 강화합니다.',
              },
              children: [
                { slug: 'ai-llm-interpretability-current', name: '00 · 현재 증거 지도', description: 'Gemma Scope 2, Circuit Tracing, J-lens를 증거 강도로 읽기' },
                { slug: 'ai-llm-interpretability-readouts', name: '01 · Layer Readout', description: 'Attention, activation, logit, token distribution과 lens family' },
                { slug: 'ai-llm-interpretability-features', name: '02 · Sparse Feature', description: 'SAE reconstruction, sparsity, feature labeling과 steering' },
                { slug: 'ai-llm-interpretability-circuits', name: '03 · Causal Circuit', description: 'Activation patching, attribution graph와 원 모델 인과 검증' },
              ],
            },
          ],
        },
        {
          slug: 'ai-llm-runtime-release',
          name: '실행 · 배포',
          description: '단일 device의 memory·thermal 제약과 분산 serving의 SLO·KV 이동을 분리',
          childNavigation: {
            mode: 'choice',
            placement: 'before-track',
            title: '실행 환경의 병목을 먼저 고릅니다',
            description: '단일 device의 memory·thermal 문제와 분산 serving의 SLO·KV 문제를 별도 경로로 다룹니다.',
          },
          children: [
            {
              slug: 'ai-llm-efficiency', name: '01 · 효율 추론 · On-device', description: 'Device release에서 graph runtime과 memory·속도 예산으로 내려가는 경로', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: 'Device runtime을 고정한 뒤 memory·속도 예산을 줄입니다',
                description: 'Export·backend·fallback과 release 조건을 먼저 잡고 low-bit·KV·speculation을 계산합니다.',
              },
              children: [
                { slug: 'ai-llm-efficiency-runtime', name: '00 · Device Runtime', description: 'Export graph, backend partition, fallback, app integration과 thermal release' },
                { slug: 'ai-llm-efficiency-budget', name: '01 · Memory·속도 예산', description: 'Low-bit, KV cache, MTP, speculative decoding과 CPU·GPU·NPU 배치' },
              ],
            },
            {
              slug: 'ai-llm-serving', name: '02 · 서빙 · 인프라', description: '요청 SLO에서 token runtime과 배포 제어면으로 내려가는 운영 경로', aggregateChildArticles: true,
              childNavigation: {
                mode: 'sequence',
                placement: 'after-track',
                title: 'Request runtime에서 운영 제어면까지',
                description: 'Prefill·decode·KV·scheduler를 먼저 추적하고 release·fleet·gateway·SLO 운영으로 닫습니다.',
              },
              children: [
                { slug: 'ai-llm-serving-runtime', name: '00 · Request Runtime', description: 'Prefill·decode 분리, KV 이동, PagedAttention, scheduler와 speculative decode' },
                { slug: 'ai-llm-serving-operations', name: '01 · 운영 제어면', description: 'Release, GPU fleet, gateway, SLO, 관측과 복구' },
              ],
            },
          ],
        },
      ],
    },
    {
      slug: 'ai-multimodal',
      name: '통합 멀티모달 모델',
      description: 'Text·image·video·audio의 입력 경계에서 visual token, interleaved context, 이해·생성 objective와 공개 code까지 잇는 현재 경로',
      icon: '◇',
    },
    {
      slug: 'ai-speech-audio', name: '음성 · 오디오 AI', description: '실시간 음성 에이전트에서 생성·인식·표현의 독립 책임으로 내려가는 경로', icon: '◉',
      childNavigation: {
        mode: 'choice',
        placement: 'before-track',
        title: '지금 실패한 음성 책임 하나를 고릅니다',
        description: '동시 대화, 생성, 인식, 표현은 서로 다른 시간·품질 계약입니다. 현재 실패를 소유한 분기 하나만 엽니다.',
      },
      children: [
        { slug: 'ai-speech-audio-interaction', name: '01 · 동시 대화', description: '듣기·말하기·중단·도구 위임을 실시간 interaction contract로 검증' },
        { slug: 'ai-speech-audio-generation', name: '02 · 음성 생성', description: '의미 state에서 acoustic code와 waveform으로 나오는 순서를 읽기' },
        { slug: 'ai-speech-audio-recognition', name: '03 · 음성 인식', description: '긴 audio frame과 짧은 transcript의 alignment와 partial commit을 읽기' },
        { slug: 'ai-speech-audio-representation', name: '04 · 오디오 표현', description: '파형을 feature·latent·codec token으로 바꿀 때의 정보와 bitrate를 계산' },
      ],
    },
    { slug: 'ai-world-models', name: '월드 모델 · 피지컬 AI', description: 'video·latent dynamics·행동 조건 예측·planning과 sim-to-real', icon: '◎' },
    {
      slug: 'ai-agents',
      name: '에이전트 시스템 · 공통 계약',
      description: '제품에 공통인 model·tool·state·coordination·safety 계약을 배우는 목표 경로. 특정 코드베이스 구현은 Claw Code에서 다룬다.',
      icon: '🤖',
      aggregateChildArticles: true,
      childNavigation: {
        mode: 'choice',
        placement: 'before-track',
        title: '한 줄로 모든 Agent 글을 읽지 않습니다',
        description: '지금 실패한 책임 하나를 먼저 선택합니다. 각 분기 페이지는 그 문제에 필요한 글만 순서대로 보여 줍니다.',
      },
      children: [
        { slug: 'ai-agents-current', name: '00 · 현재 Runtime', description: 'Model, harness, sandbox, durable state와 protocol의 현재 실행 계약' },
        { slug: 'ai-agents-action', name: '01 · 도구 · Computer Use', description: 'API·shell·GUI 행동을 관찰, 권한, effect evidence와 retry safety로 검증' },
        { slug: 'ai-agents-coordination', name: '02 · 장기 작업 · Coordination', description: '단일·다중 agent의 checkpoint, artifact, task handoff와 worker 결과 병합을 재현 가능한 state로 관리' },
        { slug: 'ai-agents-safety', name: '03 · 안전 · 평가', description: 'Prompt injection containment, approval, trace와 반복 가능한 release evidence' },
        { slug: 'ai-agents-foundations', name: '04 · 공통 기반', description: 'Agent loop, context packet과 prompt의 최소 개념으로 필요한 만큼만 하강' },
        { slug: 'ai-agents-cases', name: '05 · 제품 사례', description: 'Framework, Claude Code와 OpenClaw에서 공통 runtime 책임을 다시 검산' },
      ],
    },
    { slug: 'ai-agents-ops', name: '에이전트 운영 · 증거와 기록', description: '실행 trace, 변경 결정, 복구 결과를 devlog·ADR·telemetry·recovery evidence로 남기는 구현 허브', icon: '📓' },
    {
      slug: 'ai-agents-claw', name: 'Claw Code · Agent Runtime 구현', description: '한 Turn의 state에서 안전한 effect, 확장, 외부 연결, 다중 작업 운영까지 실제 Rust source로 검증', icon: '🦀',
      childNavigation: {
        mode: 'sequence',
        placement: 'after-track',
        title: '한 Turn에서 다중 작업 운영까지 구현 책임을 쌓습니다',
        description: '소유권, side effect, lifecycle, 외부 연결, 운영 순서로 실제 Rust 경계를 검증합니다.',
      },
      children: [
        { slug: 'ai-agents-claw-core', name: '01 · 한 Turn의 소유권', description: '아키텍처 → Session → Compaction → Tool observation' },
        { slug: 'ai-agents-claw-security', name: '02 · 안전한 Side Effect', description: 'Permission → File boundary → Shell containment' },
        { slug: 'ai-agents-claw-lifecycle', name: '03 · 확장과 Lifecycle', description: 'Worker 관찰 → Hook → Plugin trust boundary' },
        { slug: 'ai-agents-claw-infra', name: '04 · Provider · MCP · CLI', description: 'Config → Provider stream → MCP process → Terminal' },
        { slug: 'ai-agents-claw-ops', name: '05 · 다중 작업 운영', description: 'Task record → Worker → Policy → Trace → Recovery' },
      ],
    },
    { slug: 'ai-from-scratch', name: 'DL 구현 (Rust)', description: 'dezero_rs — 딥러닝 프레임워크를 Rust로 직접 구현', icon: '🦀' },
    {
      slug: 'ai-practical', name: '실전 ML', description: '대회·실무에서 바로 쓰는 파이프라인, 모델링, 전략', icon: '🏆',
      childNavigation: {
        mode: 'choice',
        placement: 'before-track',
        title: '지금 개선할 실전 병목 하나를 고릅니다',
        description: '데이터, 모델링, 학습 제어, 검색, 경량화와 대회 전략을 한 줄로 읽지 않고 현재 실험 병목에 맞춰 선택합니다.',
      },
      children: [
        { slug: 'ai-practical-data', name: '데이터 감사 · 개입', description: '공통 데이터 감사에서 피처·증강·희귀 사건의 독립 분기로 확장' },
        { slug: 'ai-practical-tabular', name: '테이블 · 이벤트 모델링', description: '정적 표 기준선과 foundation model 승격, point-in-time feature와 event sequence' },
        { slug: 'ai-practical-pipeline', name: '학습 실행 · 제어', description: '재현 run을 공통 뿌리로 전이·update 시간축·일반화 개입을 분기' },
        { slug: 'ai-practical-cv', name: '실전 CV', description: '이미지 분류, ViT, 멀티뷰, 딥페이크, 비디오' },
        { slug: 'ai-practical-embedding', name: '임베딩 검색 · 적응', description: '이미지·텍스트 검색 계약에서 pair geometry와 domain migration까지' },
        { slug: 'ai-practical-compression', name: '모델 경량화', description: '양자화, 프루닝, 지식 증류, 경량화 파이프라인' },
        { slug: 'ai-practical-llm', name: 'LLM 적응 · Adapter Release', description: '행동 실패를 data·LoRA·QLoRA와 artifact gate로 고쳐 weight를 출시하는 경로. Agent runtime은 에이전트 시스템에서 다룬다.' },
        { slug: 'ai-practical-strategy', name: '대회 전략', description: '교차 검증, 튜닝, 앙상블, 평가 지표, 실험 관리' },
      ],
    },
  ],
  articles: aiArticles,
};

export default ai;
