import type { PaperStudySpec } from './FoundationalPaperStudy';
import DeepSeekV32StudyViz from './viz/DeepSeekV32StudyViz';

const raw = String.raw;

export const deepSeekV32ResearchSpec: PaperStudySpec = {
  documentKind: '현재 기술 보고서',
  shortTitle: 'DeepSeek-V3.2',
  citation: 'DeepSeek-AI — DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models',
  yearVenue: '2025 · Open technical report',
  sourceUrl: 'https://huggingface.co/deepseek-ai/DeepSeek-V3.2/resolve/main/assets/paper.pdf',
  appendixUrl: 'https://api-docs.deepseek.com/news/news251201',
  specialistEntry: {
    title: '앞에서 배운 구조 축을 실제 기술 보고서 한 편에 적용하는 글',
    description: 'DeepSeek-V3.2를 처음부터 모든 세부까지 외우는 글이 아니다. Dense·KV·Sparse MoE의 장부를 가져와 sparse attention, RL runtime과 합성 agent 환경이 각각 어떤 주장을 맡는지 분리해 검산한다.',
    prerequisites: [
      'Dense Transformer에서 attention과 FFN이 서로 다른 부품임을 안다.',
      'KV cache의 저장량과 attention의 직접 가시 범위를 구분한다.',
      'Sparse MoE에서 router, active expert와 GPU 통신을 구분한다.',
    ],
    links: [
      { slug: 'llm-architecture-gallery', title: 'LLM 아키텍처 출발점', reason: '현재 모델을 입력·문맥·용량·상태·깊이 축으로 나누는 순서를 먼저 잡는다.' },
      { slug: 'llm-architecture-sparse-moe', title: 'Sparse MoE', reason: 'V3.2가 상속한 expert routing과 active-path 장부를 먼저 계산한다.' },
    ],
  },
  before: '긴 문맥에서는 dense attention의 core 계산이 sequence length의 제곱으로 커졌다. 한편 reasoning, tool use와 human alignment를 따로 post-training하면 뒤 단계가 앞 능력을 지우거나 sampling과 training runtime의 작은 차이가 RL을 불안정하게 만들 수 있었다.',
  authorIntent: '저자들은 128K 문맥의 attention 비용을 줄이면서 기존 품질을 유지하고, post-training compute를 크게 늘려도 무너지지 않는 RL recipe를 만들며, reasoning과 tool call을 한 trajectory 안에서 학습시키려 했다. 따라서 이 보고서의 주장은 단일 모델 점수가 아니라 architecture, RL system, synthetic environment의 세 계약으로 분리해 읽어야 한다.',
  thesis: '가벼운 indexer가 중요한 과거 token만 고른 뒤 정밀 attention을 수행하고, sampling 시점의 route·mask를 training에 보존하며, 어렵지만 verifier로 검사 가능한 agent 환경을 대규모로 합성하면 long-context 비용과 reasoning·agent 성능을 함께 개선할 수 있다는 주장이다.',
  readerBridge: [
    { term: '문맥 길이', latex: raw`L`, plain: '현재 query보다 앞에 쌓인 token 수다. 128K는 최대 131,072 token 규모를 뜻한다.', role: 'dense attention의 후보 수와 memory traffic을 결정한다.' },
    { term: '선택 수', latex: raw`k`, plain: 'Indexer가 정밀 attention에 넘기는 과거 token 수다. 보고서의 sparse training에서는 query마다 2,048개를 선택한다.', role: 'k가 L보다 훨씬 작을 때 core attention 비용을 줄인다.' },
    { term: 'Sampling policy', latex: raw`\pi_{\mathrm{old}}`, plain: 'RL rollout을 실제로 생성한 시점의 모델과 inference runtime이다.', role: '현재 학습 모델과 확률·expert route·sampling mask가 얼마나 달라졌는지 판단하는 기준이다.' },
    { term: 'Verifier', plain: '후보 답을 사람이 읽지 않아도 test나 constraint로 성공 여부를 판정하는 프로그램이다.', role: '합성 agent task를 대규모 RL reward로 바꾸는 핵심이다.' },
  ],
  reconstruction: [
    { label: 'Base checkpoint', value: 'V3.1-Terminus · 128K', note: '완전히 새로 pre-train하지 않고 long-context checkpoint에서 continued training한다.' },
    { label: 'Indexer warm-up', value: '2.1B tokens · 1,000 steps', note: '본 model을 freeze하고 dense attention 분포를 따라 후보 선택기만 먼저 학습한다.' },
    { label: 'Sparse adaptation', value: '943.7B tokens · k=2,048', note: 'Top-k selection을 켠 뒤 main model과 indexer를 서로 다른 loss로 학습한다.' },
    { label: 'Post-training', value: 'specialist distillation + mixed RL', note: 'reasoning, agent와 alignment data를 한 RL stage에 혼합한다.' },
    { label: 'Agent environments', value: '1,827 env · 4,417 tasks', note: 'tool interface로만 풀 수 있고 verifier가 정답을 검사하는 합성 환경을 만든다.' },
    { label: 'Deployment boundary', value: '128K · token efficiency', note: '긴 trajectory가 context limit과 비용을 다시 병목으로 만든다는 한계를 보고서가 직접 남긴다.' },
  ],
  mechanism: [
    '각 query token과 모든 과거 token 사이에 작은 lightning indexer score를 계산한다. 이 단계는 여전히 L² 후보를 보지만 적은 head, 작은 dimension과 FP8을 사용해 MLA core attention보다 훨씬 싸게 만든다.',
    'Score가 큰 top-k token의 MLA latent KV entry만 모아 정밀 attention을 실행한다. 계산량의 변화는 모든 비교를 없앤 것이 아니라 비싼 비교의 수를 L에서 k로 줄인 것이다.',
    'Warm-up에서는 dense attention의 head별 score를 합치고 L1 normalize한 target distribution을 만든 뒤 KL divergence로 indexer를 distill한다. Sparse stage에서는 선택된 set 안에서 같은 정렬을 유지한다.',
    'Mixed GRPO에서는 rollout을 만든 old policy와 학습 중인 current policy의 차이를 관리한다. 크게 어긋난 negative sequence를 mask하고, sampling 당시 MoE expert route와 top-p mask를 training에서도 다시 사용한다.',
    'Agent cold-start는 기존 reasoning prompt와 tool-call prompt를 결합해 드물게라도 생각 중 tool을 호출하는 trajectory를 만든다. 이후 code, search, interpreter와 synthetic general environment의 outcome reward로 그 행동을 강화한다.',
    'Inference에서는 새 user message가 올 때만 과거 reasoning을 제거하고 tool call과 result는 남긴다. 검색 trajectory가 128K의 80%를 넘으면 summary 또는 discard 전략으로 test-time step을 더 확보한다.',
  ],
  equations: [
    {
      latex: raw`\underbrace{I_{t,s}}_{\text{후보 중요도}}=\sum_{j=1}^{H_I}\underbrace{w^I_{t,j}}_{\text{query별 head 가중치}}\,\underbrace{\operatorname{ReLU}\!\left((q^I_{t,j})^\top k^I_s\right)}_{\text{음수 관련도 제거}}`,
      meaning: 'Lightning indexer는 현재 query t와 과거 token s의 작은 벡터 내적을 계산한다. ReLU는 음수 score를 0으로 만들어 후보 누적에서 제거하면서 throughput이 좋은 단순 비선형성을 사용한다. 여러 indexer head의 결과를 query별 가중치로 합쳐 하나의 선택 순위를 만든다. 이 값은 최종 attention 확률이 아니라 비싼 attention에 들어갈 후보를 고르는 점수다.',
      symbols: [[raw`I_{t,s}`, '현재 query t가 과거 token s를 후보로 볼 중요도'], [raw`H_I`, '작은 indexer head 수'], [raw`q^I,k^I`, '선택만을 위해 만든 저차원 query와 key'], [raw`w^I`, '각 indexer head의 query-dependent 합성 가중치']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{S_t}_{\text{읽을 memory}}&=\operatorname{TopK}_k(I_{t,:})\\[4pt]\underbrace{u_t}_{\text{attention 출력}}&=\operatorname{Attn}\!\left(h_t,\{c_s\mid s\in S_t\}\right)\end{aligned}`,
      meaning: '먼저 모든 index score 중 k개 index를 선택하고, 그 위치의 MLA latent KV entry c만 core attention에 전달한다. 여기서부터는 원문 문장을 옮긴 것이 아니라 선택 연산을 이해하기 위한 교육적 해설이다. TopK는 미분 가능한 평균이 아니라 discrete memory gate로 읽을 수 있으므로 중요한 token recall이 병목이다. k를 키우면 품질 위험은 줄지만 계산과 KV read가 다시 늘어난다.',
      symbols: [[raw`S_t`, 'query t가 선택한 과거 위치 집합'], [raw`k`, 'query당 선택 token 수, 보고서 sparse stage에서는 2,048'], [raw`c_s`, 'MLA가 압축한 과거 key-value latent'], [raw`u_t`, '선택된 memory에서 모은 최종 attention output']],
    },
    {
      latex: raw`\begin{aligned}
\underbrace{q_{t,:}}_{\text{인덱서 확률}}
&=\underbrace{\operatorname{softmax}(I_{t,:})}_{\text{점수 정규화}}\\[6pt]
\underbrace{d_t}_{\text{교사 분포 모방 오차}}
&=\underbrace{D_{\mathrm{KL}}\!\left(p_{t,:}\middle\|q_{t,:}\right)}_{\text{두 분포의 차이}}\\[6pt]
\underbrace{\mathcal L_I}_{\text{전체 학습 오차}}
&=\underbrace{\sum_t d_t}_{\text{질의별 오차 합산}}
\end{aligned}`,
      meaning: '첫 줄은 raw index score I를 합이 1인 후보 확률 q로 바꾼다. 둘째 줄은 기존 dense attention이 실제로 집중한 teacher 분포 p와 q의 차이를 query 하나의 KL divergence d로 잰다. 마지막 줄은 모든 query의 모방 오차를 합쳐 indexer 전용 loss를 만든다. 이렇게 teacher를 따라가게 하면 indexer가 임의의 shortcut만 배우는 위험을 줄일 수 있다. Sparse stage에서는 선택 집합 안으로 제한해 같은 목적을 이어간다.',
      symbols: [[raw`p_{t,:}`, 'main dense attention score를 head 합산 후 L1 normalize한 target'], [raw`q_{t,:}`, 'index score에 softmax를 적용한 indexer의 후보 분포'], [raw`d_t`, 'query t 하나에서 teacher와 indexer가 어긋난 정도'], [raw`D_{\mathrm{KL}}`, '두 확률분포의 불일치를 재는 divergence'], [raw`\mathcal L_I`, 'language modeling loss와 분리된 indexer 전용 loss']],
    },
    {
      latex: raw`\underbrace{C_{\mathrm{dense}}}_{\text{정밀 비교}}\propto L^2,\qquad \underbrace{C_{\mathrm{DSA\ core}}}_{\text{선택 뒤 정밀 비교}}\propto Lk\quad(k\ll L)`,
      meaning: '각 위치가 앞의 모든 위치를 정밀 비교하면 sequence 전체에서 비교 수가 L²로 자란다. DSA core는 query마다 k개만 정밀 비교하므로 Lk가 된다. 다만 indexer 자체는 모든 후보를 훑기 때문에 여전히 L² 항이 있고, 보고서의 speedup은 작은 indexer와 hardware-aligned kernel이 그 항을 싸게 만든다는 시스템 주장까지 포함한다.',
      symbols: [[raw`L`, 'sequence length'], [raw`k`, '선택된 KV 수'], [raw`C`, 'attention 계산량의 비례 관계이며 실제 latency 자체는 아님']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{\hat A_i}_{\text{그룹 상대 성과}}&=R_i-\operatorname{mean}(R)\\[4pt]\underbrace{r_{i,t}}_{\text{policy 변화 비율}}&=\frac{\pi_\theta(o_{i,t}\mid q,o_{i,<t})}{\pi_{\mathrm{old}}(o_{i,t}\mid q,o_{i,<t})}\end{aligned}`,
      meaning: 'GRPO는 같은 질문에서 뽑은 응답들의 평균 reward를 기준으로 각 응답이 상대적으로 나았는지 판단한다. 중요도 비율 r은 rollout을 만든 old policy와 현재 policy가 같은 token에 주는 확률의 변화를 보정한다. 이 비율이 유효하려면 두 runtime이 같은 expert route와 sampling action space를 사용해야 하므로 keep-routing과 keep-sampling-mask가 단순 구현 최적화가 아니라 학습 전제다.',
      symbols: [[raw`R_i`, '응답 i의 outcome reward'], [raw`\hat A_i`, 'group mean보다 좋은지 나쁜지 나타내는 advantage'], [raw`\pi_{\mathrm{old}},\pi_\theta`, 'sampling 당시 policy와 현재 학습 policy'], [raw`r_{i,t}`, 'token별 importance ratio']],
    },
  ],
  mechanismViz: DeepSeekV32StudyViz,
  evidence: [
    { label: 'Sparse parity', question: 'Dense MLA를 DSA로 바꿔도 short·long context 품질이 유지되는가?', intervention: 'V3.1-Terminus와 같은 post-training 전략을 쓴 V3.2-Exp를 표준 benchmark, ChatbotArena와 unseen long-context test에서 비교한다.', observation: '보고서는 표준 성능과 Elo가 비슷하고 AA-LCR와 Fiction.liveBench에서 뚜렷한 long-context regression이 없었다고 보고한다.', supports: 'continued training으로 dense checkpoint를 sparse attention에 적응시킬 수 있다는 parity 주장을 지지한다.', limit: '모든 domain과 context position에서 중요한 token recall이 보존된다는 보장이나 indexer 단독 ablation을 제공하지 않는다.' },
    { label: 'Inference cost', question: '이론 복잡도 감소가 실제 service 비용 감소로 이어지는가?', intervention: 'H800 cluster에서 실제 배포 service를 benchmark하고 GPU 시간당 2달러를 가정해 token position별 prefill·decode 비용을 추정한다.', observation: '문맥 위치가 길어질수록 V3.1 대비 V3.2 비용 곡선의 증가가 완만해지는 Figure 3을 제시한다.', supports: 'DSA와 최적화 kernel이 특정 H800 service에서 end-to-end 이득을 낸다는 주장이다.', limit: '절대 latency, batch·concurrency, energy, 다른 GPU와 공개 재현의 동일 결과를 보장하지 않으며 가격 가정에도 의존한다.' },
    { label: 'Synthetic agents', question: '합성 환경 RL이 생성에 쓰지 않은 실제 agent benchmark로 전이되는가?', intervention: 'V3.2-SFT에 synthetic general-agent task만으로 non-thinking RL을 수행하고 SFT 및 code/search 환경만 학습한 Exp와 비교한다.', observation: 'Tau2Bench, MCP-Mark와 MCP-Universe에서 synthetic-task RL variant가 개선되고 code/search-only variant는 같은 개선을 보이지 않는 Figure 5를 제시한다.', supports: '다양하고 검증 가능한 합성 environment가 out-of-domain tool-use에 기여할 수 있음을 지지한다.', limit: '합성 data의 개별 기여량, contamination 가능성, 모든 실제 environment에서의 안전성과 장기 일반화를 분리하지는 못한다.' },
    { label: 'Context scaling', question: '긴 검색 agent에서 context를 관리하면 단순 병렬 sampling보다 효율적으로 step을 늘릴 수 있는가?', intervention: 'BrowseComp에서 summary, 75% discard, all discard와 parallel-fewest-step을 real step budget별로 비교한다.', observation: 'Summary는 평균 step 140→364와 score 53.4→60.2, discard-all은 67.6을 기록했다고 보고한다.', supports: 'context window를 runtime state budget으로 다루면 serial test-time compute를 늘릴 수 있음을 지지한다.', limit: 'BrowseComp 한 설정의 결과이며 discard가 중요한 state를 잃는 다른 task, 총 token·latency·검색 API 비용까지 최적화했다는 뜻은 아니다.' },
  ],
  implementation: [
    '먼저 작은 dense attention teacher를 고정한다. 각 query의 head attention score를 합치고 sequence 방향으로 normalize해 index target p를 저장한다.',
    '작은 multi-head indexer를 별도 module로 구현하고 main hidden을 detach한다. KL loss만으로 warm-up하며 top-k recall과 teacher mass coverage를 함께 기록한다.',
    'Top-k gather로 선택된 KV만 core attention에 넘긴다. L과 k를 바꿔 output error, recall, FLOPs, KV bytes, kernel latency를 따로 측정한다.',
    'Sparse adaptation에서는 language-model loss가 main model만, index KL이 indexer만 업데이트하는지 gradient hook으로 검증한다.',
    'GRPO 재현은 sampling log에 token log-probability, expert route와 top-p mask를 함께 저장한다. Training에서 하나씩 보존하지 않았을 때 KL, entropy와 reward가 어떻게 흔들리는지 ablation한다.',
    'General-agent synthetic environment는 database, 공개 tool functions, solution과 verifier를 분리한다. Solution을 공개 tool interface로 제한하고 database 우회 접근을 막은 뒤 별도 verification function으로 성공을 판정한다.',
    'Code-agent environment는 실제 GitHub issue와 pull request에서 만든다. Gold patch를 적용했을 때 F2P test가 1개 이상이고 P2F test가 0개인지 확인한다. 이 기준을 general-agent verifier와 같은 pipeline으로 합치지 않는다.',
    'Agent context 실험은 summary·partial discard·full discard를 같은 search API와 real-step budget에서 비교하고 accuracy뿐 아니라 total tokens, wall time와 실패 유형을 기록한다.',
  ],
  assumptions: [
    'Dense attention teacher가 중요한 token을 충분히 반영하며 그 분포를 따라가는 것이 downstream 품질 보존에 유효하다.',
    '작은 FP8 indexer와 top-k gather가 target hardware에서 dense core attention보다 충분히 싸다.',
    'Sampling과 training framework가 log-probability, expert route와 truncation mask를 동일한 의미로 기록하고 재생한다.',
    '합성 verifier가 task의 실제 성공 조건을 측정하며 solution이나 model이 우회 shortcut을 이용하지 못한다.',
    '비교 benchmark의 prompt, context manager, harness와 search environment 차이가 score 해석에 포함된다.',
  ],
  failures: [
    'O(Lk)만 인용하면 O(L²) lightning indexer 비용과 kernel·memory 조건을 숨기게 된다.',
    'Benchmark parity가 중요한 token을 절대 놓치지 않는다는 증명은 아니다. Retrieval recall과 task outcome을 따로 측정해야 한다.',
    'DeepSeek-V3.2-Speciale의 competition score는 더 긴 output budget과 대회별 후처리를 포함한다. IOI는 500개 생성 뒤 50개로, ICPC는 32개 생성 뒤 filter하지만 IMO·CMO는 self-evaluation이 완벽해지거나 revision cap에 닿을 때까지 generate-verify-refine을 반복한다. 이를 하나의 generate-filter protocol이나 단일-pass 효율로 읽으면 안 된다.',
    '보고서가 명시한 internal MCP environment, internal SWE harness와 framework 호환성 차이를 빼면 재현 score를 과하게 일반화한다.',
    'Discard-all의 BrowseComp 결과를 일반 memory 전략으로 복사하면 tool state나 사용자 제약을 잃는 task에서 조용히 실패할 수 있다.',
    '현재 공개 보고서는 pre-training data, 모든 RL hyperparameter와 service kernel 조건을 완전히 공개하지 않아 exact end-to-end reproduction에는 경계가 있다.',
  ],
  legacy: 'V3.2의 지속 가능한 기여는 “sparse attention이 더 빠르다” 한 문장이 아니다. 후보 검색과 정밀 attention을 분리하고, sparse routing이 있는 model에서 sampling runtime의 discrete choice를 RL training까지 보존하며, agent data를 <environment, tools, task, verifier>라는 실행 가능한 IR로 만든 점이 함께 남는다. 반면 어떤 benchmark에서 proprietary model과 비슷하다는 순위는 prompt, token budget, harness와 후속 모델에 따라 가장 빨리 교체되는 상단 근거다.',
  nextReading: '아래로는 Transformer의 dense attention과 KV shape, PPO/GRPO의 importance ratio, RLVR의 verifier 계약만 읽으면 된다. 더 오래된 attention·RL 논문을 모두 필수로 만들지 않는다. 다음 최신 연구가 indexer, routing replay, verifier 또는 context state 계약을 바꿀 때만 기반 델타를 추가한다.',
  nextLinks: [
    { slug: 'llm-architecture-gallery', label: 'LLM 구조 읽는 출발점', reason: '현재 변화를 입력 경계, 문맥 혼합, 용량 배분, 상태 저장, 깊이 혼합의 다섯 축으로 먼저 분해한다.' },
    { slug: 'llm-architecture-dense-transformers', label: 'Dense Transformer 기준점', reason: 'DSA가 교체하는 attention과 그대로 남기는 residual·FFN 경계를 고정한다.' },
    { slug: 'llm-architecture-kv-long-context', label: 'KV Cache와 Long Context', reason: 'MLA latent cache와 sparse attention이 줄이는 서로 다른 메모리·계산 항을 직접 계산한다.' },
    { slug: 'llm-architecture-sparse-moe', label: 'Sparse MoE', reason: '전체 parameter와 token마다 활성화되는 parameter가 분리되는 router·expert 경로와 통신 비용을 읽는다.' },
    { slug: 'llm-architecture-hybrid-linear', label: 'Hybrid·Linear Attention', reason: 'DSA의 선택형 attention과 fixed-state recurrent memory를 같은 최적화로 혼동하지 않게 한다.' },
    { slug: 'post-training-rlvr', label: 'Post-Training RL과 RLVR', reason: 'Outcome reward, verifier와 policy update가 agent 합성 data를 학습 신호로 바꾸는 조건을 읽는다.' },
    { slug: 'agentic-patterns', label: 'Agent loop와 tool use', reason: 'Trajectory, tool result, context state와 verifier를 실제 실행 loop로 연결한다.' },
  ],
  capabilities: [
    'DSA가 없앤 계산과 여전히 남긴 O(L²) 계산을 구분할 수 있다.',
    'Indexer score, top-k selection과 core attention의 tensor 역할을 구현 순서로 설명할 수 있다.',
    'KL distillation이 왜 indexer warm-up에 쓰이는지 설명하고 top-k recall 실험을 설계할 수 있다.',
    'MoE RL에서 keep routing과 sampling mask가 importance sampling의 전제와 연결되는 이유를 설명할 수 있다.',
    'Synthetic agent task의 solution, verifier와 tool interface 사이 shortcut을 검토할 수 있다.',
    'Benchmark score를 model, harness, context policy와 test-time token budget으로 분해해 읽을 수 있다.',
  ],
};
