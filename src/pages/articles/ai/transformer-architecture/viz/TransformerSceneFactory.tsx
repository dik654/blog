import { Scene } from '@/components/scene/Scene';
import type { Op, Scene as SceneSpec, SceneObject, Transition } from '@/components/scene/types';

type SceneKey =
  | 'TransformerBlock'
  | 'OverviewDetail'
  | 'DataPrep'
  | 'DataPrepDetail'
  | 'InputEmbedding'
  | 'InputEmbDetail'
  | 'QKVComputation'
  | 'QKVRoleDetail'
  | 'AttentionScore'
  | 'AttnScoreDetail'
  | 'AttentionFlow'
  | 'SelfAttnImplDetail'
  | 'MultiHeadMerge'
  | 'MultiHeadDetail'
  | 'MaskedAttention'
  | 'MaskedAttnDetail'
  | 'CrossAttention'
  | 'CrossAttnDetail'
  | 'PositionalEncoding'
  | 'PosEncDetail'
  | 'FeedForward'
  | 'FFNDetail'
  | 'LayerNorm'
  | 'LayerNormDetail'
  | 'LinearSoftmax'
  | 'LinearSoftmaxDetail'
  | 'Training'
  | 'TrainingDetail'
  | 'ScalingLaws'
  | 'ScalingDetail'
  | 'EncoderDecoder'
  | 'SummaryDetail';

const META: Record<SceneKey, { id: string; title: string; caption: string; focus: string }> = {
  TransformerBlock: {
    id: 'transformer-block',
    title: '토큰 묶음에서 block 출력까지',
    caption: '$X$ 에 위치 $P$ 를 더하고, attention 과 FFN 을 residual 로 쌓는다.',
    focus: 'RNN step 을 기다리지 않고 모든 위치의 관계를 한 번에 계산하는 흐름.',
  },
  OverviewDetail: {
    id: 'transformer-overview-detail',
    title: 'Encoder / Decoder 의 최소 조각',
    caption: 'encoder 는 양방향 문맥 $H_{enc}$, decoder 는 causal 문맥과 cross-attention 을 쓴다.',
    focus: '전체 이름보다 먼저 보는 것은 정보가 어느 방향으로 흐르는지다.',
  },
  DataPrep: {
    id: 'data-prep',
    title: '텍스트를 숫자 입력으로 바꾸기',
    caption: '$text \\to token \\to id \\to onehot \\to x$',
    focus: '문자는 곱셈할 수 없으므로 먼저 고정된 id 와 벡터로 바꾼다.',
  },
  DataPrepDetail: {
    id: 'data-prep-detail',
    title: 'Vocabulary 와 특수 토큰',
    caption: '$vocab$ 이 embedding table $E$ 의 행 수를 정한다.',
    focus: 'PAD, BOS, EOS 같은 경계 신호가 있어야 모델이 시퀀스 모양을 구분한다.',
  },
  InputEmbedding: {
    id: 'input-embedding',
    title: '토큰 의미와 위치 더하기',
    caption: '$X = E[token] + P$',
    focus: 'attention 은 집합처럼 병렬 계산되므로 순서 정보 $P$ 를 따로 넣어야 한다.',
  },
  InputEmbDetail: {
    id: 'input-embedding-detail',
    title: 'Sin / Cos 위치 벡터',
    caption: '$P_{pos,2i}=\\sin(pos/10000^{2i/d})$, $P_{pos,2i+1}=\\cos(\\cdot)$',
    focus: '빠른 주파수와 느린 주파수를 섞으면 각 위치가 다른 패턴을 갖는다.',
  },
  QKVComputation: {
    id: 'qkv-computation',
    title: '같은 $X$ 에서 Q/K/V 나누기',
    caption: '$Q=XW_Q$, $K=XW_K$, $V=XW_V$',
    focus: '같은 토큰 표현이라도 찾을 것, 비교 기준, 전달 내용은 서로 다르다.',
  },
  QKVRoleDetail: {
    id: 'qkv-role-detail',
    title: 'Q/K/V 역할 분리',
    caption: '$Q$ 는 찾는 모양, $K$ 는 비교되는 모양, $V$ 는 가져올 내용.',
    focus: '가중치를 세 벌로 둬야 비교 방식과 전달 내용이 묶이지 않는다.',
  },
  AttentionScore: {
    id: 'attention-score',
    title: '점수에서 문맥 벡터까지',
    caption: '$A=\\mathrm{softmax}(QK^T/\\sqrt{d_k})$, $H=AV$',
    focus: '$QK^T$ 는 모든 쌍 비교, softmax 는 행별 선택 비율, $V$ 는 실제 내용이다.',
  },
  AttnScoreDetail: {
    id: 'attention-score-detail',
    title: '왜 $\\sqrt{d_k}$ 로 나누는가',
    caption: '$S=QK^T \\to S/\\sqrt{d_k} \\to A$',
    focus: '차원이 커지면 내적 분산이 커지고 softmax 가 쉽게 포화된다.',
  },
  AttentionFlow: {
    id: 'attention-flow',
    title: '입력 토큰들이 서로 정보를 가져오기',
    caption: '$X \\to Q,K,V \\to A \\to H$',
    focus: '각 위치가 모든 위치에서 필요한 값을 가져와 자기 표현을 갱신한다.',
  },
  SelfAttnImplDetail: {
    id: 'self-attn-impl-detail',
    title: '행렬 연산으로 접은 구현',
    caption: '$QK^T$ 와 $AV$ 두 matmul 이 주요 비용이다.',
    focus: '반복문으로 토큰 쌍을 도는 대신 큰 행렬 곱으로 GPU 에 맡긴다.',
  },
  MultiHeadMerge: {
    id: 'multi-head-merge',
    title: '여러 attention 을 병렬로',
    caption: '$head_i=\\mathrm{Attn}(XW_Q^i,XW_K^i,XW_V^i)$',
    focus: '한 attention 이 한 종류 관계에 치우칠 수 있어 여러 관점을 나란히 둔다.',
  },
  MultiHeadDetail: {
    id: 'multi-head-detail',
    title: 'Head 분리와 $W_O$ 병합',
    caption: '$\\mathrm{Concat}(head_1,\\dots,head_h)W_O$',
    focus: 'head 별 작은 결과를 이어 붙인 뒤 다시 모델 차원으로 섞는다.',
  },
  MaskedAttention: {
    id: 'masked-attention',
    title: '미래 위치 가리기',
    caption: '$S_{masked}=\\mathrm{mask}(S,M)$, $A=\\mathrm{softmax}(S_{masked})$',
    focus: '다음 단어를 맞히는 위치가 정답 미래 토큰을 보면 학습 문제가 새어 나간다.',
  },
  MaskedAttnDetail: {
    id: 'masked-attn-detail',
    title: '$-\\infty$ 가 softmax 에서 0 이 되는 흐름',
    caption: '$j>i$ 위치는 $-\\infty$, 그래서 $\\exp(-\\infty)=0$',
    focus: '마스크는 attention 점수 단계에서 넣어 확률 자체를 0 으로 만든다.',
  },
  CrossAttention: {
    id: 'cross-attention',
    title: 'Decoder query 가 Encoder memory 를 조회',
    caption: '$Q=H_{dec}W_Q$, $K,V=H_{enc}W_{K,V}$',
    focus: '출력 쪽 토큰이 입력 문장의 어느 위치를 참고할지 직접 고른다.',
  },
  CrossAttnDetail: {
    id: 'cross-attn-detail',
    title: '직사각형 attention',
    caption: '$A \\in \\mathbb{R}^{T_{tgt}\\times T_{src}}$',
    focus: 'target 길이와 source 길이가 달라서 self-attention 처럼 정사각형일 필요가 없다.',
  },
  PositionalEncoding: {
    id: 'positional-encoding',
    title: '위치 벡터를 더하는 이유',
    caption: '$X=E+P$',
    focus: '병렬 attention 은 순서를 자동으로 기억하지 못하므로 위치를 입력에 섞는다.',
  },
  PosEncDetail: {
    id: 'pos-enc-detail',
    title: '절대 위치에서 상대 위치 기법으로',
    caption: '$P \\to relative\\ bias \\to RoPE \\to ALiBi$',
    focus: '긴 문맥에서는 위치 숫자를 넣는 방식보다 거리 관계를 score 에 넣는 방식이 중요해진다.',
  },
  FeedForward: {
    id: 'feed-forward',
    title: '각 토큰을 따로 고차원에서 휘게 하기',
    caption: '$FFN(x)=W_2\\,\\phi(xW_1+b_1)+b_2$',
    focus: 'attention 이 섞은 문맥을 각 위치별 작은 MLP 로 다시 변환한다.',
  },
  FFNDetail: {
    id: 'ffn-detail',
    title: '확장, 활성화, 압축',
    caption: '$d_{model}\\to d_{ff}\\to d_{model}$',
    focus: '중간 차원을 키우고 한 번 휘어야 단순 선형 변환보다 많은 패턴을 담는다.',
  },
  LayerNorm: {
    id: 'layer-norm',
    title: 'Feature 차원으로 값의 스케일 맞추기',
    caption: '$\\hat{x}=(x-\\mu)/\\sqrt{\\sigma^2+\\epsilon}$',
    focus: '토큰마다 feature 분포를 맞춰 다음 sublayer 가 안정적인 범위의 값을 받게 한다.',
  },
  LayerNormDetail: {
    id: 'layer-norm-detail',
    title: 'Residual 과 Pre-LN',
    caption: '$y=x+F(\\mathrm{LN}(x))$',
    focus: '원본 경로를 남겨 gradient 가 깊은 stack 을 지나도 끊기지 않게 한다.',
  },
  LinearSoftmax: {
    id: 'linear-softmax',
    title: '마지막 벡터를 단어 확률로',
    caption: '$z=hW_U$, $p=\\mathrm{softmax}(z)$',
    focus: '모델 차원의 벡터를 vocabulary 크기 점수로 바꿔 다음 토큰 후보를 비교한다.',
  },
  LinearSoftmaxDetail: {
    id: 'linear-softmax-detail',
    title: '정답 확률을 loss 로',
    caption: '$L=-\\log p_{target}$',
    focus: '정답에 준 확률이 작을수록 벌점이 커져 그 방향으로 gradient 가 생긴다.',
  },
  Training: {
    id: 'training',
    title: '불안정한 큰 모델을 천천히 움직이기',
    caption: '$\\theta_{t+1}=\\theta_t-\\eta_t\\,\\mathrm{AdamW}(g_t)$',
    focus: '초기에는 작은 step 으로 시작하고, optimizer 상태가 안정되면 크게 탐색한다.',
  },
  TrainingDetail: {
    id: 'training-detail',
    title: 'Warmup, AdamW, Mixed precision',
    caption: '$lr_t$, $m_t$, $v_t$, $\\theta$ update',
    focus: '학습률, 좌표별 스케일, 숫자 정밀도를 같이 조정해야 대규모 학습이 버틴다.',
  },
  ScalingLaws: {
    id: 'scaling-laws',
    title: 'Loss 를 낮추는 세 예산',
    caption: '$L(N,D,C) \\approx aN^{-\\alpha}+bD^{-\\beta}+cC^{-\\gamma}$',
    focus: '파라미터만 키우면 데이터가 병목이 되고, 데이터만 늘리면 모델 용량이 병목이 된다.',
  },
  ScalingDetail: {
    id: 'scaling-detail',
    title: 'Chinchilla 비율',
    caption: '고정 FLOP 에서 $N:D \\approx 1:20$',
    focus: '같은 계산량이면 너무 큰 모델보다 충분한 토큰을 본 작은 모델이 나을 수 있다.',
  },
  EncoderDecoder: {
    id: 'encoder-decoder',
    title: 'Encoder output 을 Decoder 가 읽는 전체 경로',
    caption: '$source \\to H_{enc}$, $target_{<t}\\to H_{dec}\\to p_t$',
    focus: '입력 이해와 출력 생성을 분리하면 번역·요약처럼 source-target 이 나뉜 작업에 맞다.',
  },
  SummaryDetail: {
    id: 'summary-detail',
    title: 'Encoder-only, Decoder-only, Encoder-Decoder',
    caption: '이해 중심, 생성 중심, 변환 중심으로 같은 조각을 다르게 남긴다.',
    focus: 'BERT, GPT, T5 계열은 같은 primitive 를 어떤 방향으로 열어 두느냐가 다르다.',
  },
};

const O: Record<string, SceneObject> = {
  text: { id: 'text', kind: 'token', label: 'text', role: 'input', description: '원문 문자열', why: '문자는 모델이 바로 곱할 수 없다. 먼저 토큰과 숫자 id 로 바꿔야 한다.' },
  tokens: { id: 'tokens', kind: 'group', label: 'tokens', role: 'input', children: ['t1', 't2', 't3'], description: '분리된 토큰 시퀀스', why: '긴 문자열을 작은 단위로 자르면 각 위치를 독립된 입력으로 다룰 수 있다.' },
  t1: { id: 't1', kind: 'token', label: '나는' },
  t2: { id: 't2', kind: 'token', label: '학생' },
  t3: { id: 't3', kind: 'token', label: '이다' },
  ids: { id: 'ids', kind: 'vector', shape: [3], values: [3, 4, 5], label: 'ids', role: 'intermediate', description: '토큰별 vocabulary index' },
  onehot: { id: 'onehot', kind: 'matrix', shape: [3, 11], label: 'one-hot', role: 'intermediate', description: 'id 위치만 1 인 희소 표현' },
  E: { id: 'E', kind: 'matrix', shape: [11, 6], label: 'E', role: 'param', description: '학습되는 embedding table', why: '행은 vocabulary 항목, 열은 의미 차원. 학습은 각 토큰 id 에 어떤 밀집 벡터를 줄지 정한다.' },
  P: { id: 'P', kind: 'matrix', shape: [3, 6], label: 'P', role: 'input', description: '위치 정보를 담은 벡터', why: 'attention 은 모든 위치를 동시에 보므로 순서를 따로 주지 않으면 같은 토큰들의 순열을 구분하기 어렵다.' },
  Xtok: { id: 'Xtok', kind: 'matrix', shape: [3, 6], label: 'E[token]', role: 'intermediate', description: '토큰 의미 embedding' },
  X: { id: 'X', kind: 'matrix', shape: [3, 6], label: 'X', role: 'input', description: '토큰 의미와 위치가 합쳐진 입력 행렬', why: '각 행은 한 위치의 입력. 모든 위치를 한 행렬로 묶으면 병렬 matmul 이 가능하다.' },
  WQ: { id: 'WQ', kind: 'matrix', shape: [6, 6], label: 'W_Q', role: 'param', description: 'query projection' },
  WK: { id: 'WK', kind: 'matrix', shape: [6, 6], label: 'W_K', role: 'param', description: 'key projection' },
  WV: { id: 'WV', kind: 'matrix', shape: [6, 6], label: 'W_V', role: 'param', description: 'value projection' },
  WO: { id: 'WO', kind: 'matrix', shape: [6, 6], label: 'W_O', role: 'param', description: 'head 병합 뒤 output projection' },
  Q: { id: 'Q', kind: 'matrix', shape: [3, 6], label: 'Q', role: 'intermediate', description: '각 위치가 찾는 정보의 모양' },
  K: { id: 'K', kind: 'matrix', shape: [3, 6], label: 'K', role: 'intermediate', description: '각 위치가 비교될 때 보이는 모양' },
  V: { id: 'V', kind: 'matrix', shape: [3, 6], label: 'V', role: 'intermediate', description: 'attention 뒤 실제로 전달될 내용' },
  S: { id: 'S', kind: 'matrix', shape: [3, 3], label: 'S', role: 'intermediate', description: '모든 query-key 쌍의 점수' },
  Sscaled: { id: 'Sscaled', kind: 'matrix', shape: [3, 3], label: 'S/√d_k', role: 'intermediate', description: '스케일 조정된 점수' },
  M: { id: 'M', kind: 'matrix', shape: [3, 3], label: 'M', role: 'input', description: '미래 위치를 가리는 causal mask' },
  SMasked: { id: 'SMasked', kind: 'matrix', shape: [3, 3], label: 'S_masked', role: 'intermediate', description: '미래 위치가 -∞ 로 바뀐 점수' },
  A: { id: 'A', kind: 'distribution', shape: [3], label: 'A', role: 'intermediate', description: '행별 attention 가중치' },
  H: { id: 'H', kind: 'matrix', shape: [3, 6], label: 'H', role: 'output', description: '문맥을 섞은 출력 표현' },
  heads: { id: 'heads', kind: 'group', label: 'heads', role: 'intermediate', children: ['h1', 'h2', 'h3'] },
  h1: { id: 'h1', kind: 'matrix', shape: [3, 2], label: 'head_1' },
  h2: { id: 'h2', kind: 'matrix', shape: [3, 2], label: 'head_2' },
  h3: { id: 'h3', kind: 'matrix', shape: [3, 2], label: 'head_3' },
  concat: { id: 'concat', kind: 'matrix', shape: [3, 6], label: 'concat', role: 'intermediate', description: 'head 결과를 feature 축으로 이어 붙인 행렬' },
  Henc: { id: 'Henc', kind: 'matrix', shape: [3, 6], label: 'H_enc', role: 'input', description: 'encoder 가 source 문장을 읽고 만든 memory' },
  Hdec: { id: 'Hdec', kind: 'matrix', shape: [2, 6], label: 'H_dec', role: 'input', description: 'decoder 현재 상태' },
  Qdec: { id: 'Qdec', kind: 'matrix', shape: [2, 6], label: 'Q_dec', role: 'intermediate' },
  Kenc: { id: 'Kenc', kind: 'matrix', shape: [3, 6], label: 'K_enc', role: 'intermediate' },
  Venc: { id: 'Venc', kind: 'matrix', shape: [3, 6], label: 'V_enc', role: 'intermediate' },
  Across: { id: 'Across', kind: 'matrix', shape: [2, 3], label: 'A_cross', role: 'intermediate', description: 'target 위치별 source 위치 가중치' },
  Cctx: { id: 'Cctx', kind: 'matrix', shape: [2, 6], label: 'C', role: 'output', description: 'source 문맥을 반영한 decoder 표현' },
  W1: { id: 'W1', kind: 'matrix', shape: [6, 24], label: 'W_1', role: 'param' },
  W2: { id: 'W2', kind: 'matrix', shape: [24, 6], label: 'W_2', role: 'param' },
  Z: { id: 'Z', kind: 'matrix', shape: [3, 24], label: 'xW_1', role: 'intermediate' },
  G: { id: 'G', kind: 'matrix', shape: [3, 24], label: 'φ(xW_1)', role: 'intermediate' },
  F: { id: 'F', kind: 'matrix', shape: [3, 6], label: 'FFN(x)', role: 'output' },
  mu: { id: 'mu', kind: 'scalar', label: 'μ', role: 'intermediate', description: 'feature 평균' },
  sigma: { id: 'sigma', kind: 'scalar', label: 'σ²', role: 'intermediate', description: 'feature 분산' },
  gamma: { id: 'gamma', kind: 'vector', shape: [6], label: 'γ', role: 'param', description: '학습 scale' },
  beta: { id: 'beta', kind: 'vector', shape: [6], label: 'β', role: 'param', description: '학습 shift' },
  Xhat: { id: 'Xhat', kind: 'matrix', shape: [3, 6], label: 'x̂', role: 'intermediate' },
  LN: { id: 'LN', kind: 'matrix', shape: [3, 6], label: 'LN(x)', role: 'intermediate' },
  R: { id: 'R', kind: 'matrix', shape: [3, 6], label: 'x+F(x)', role: 'output', description: '원본 경로가 더해진 residual 출력' },
  WU: { id: 'WU', kind: 'matrix', shape: [6, 11], label: 'W_U', role: 'param', description: 'vocabulary 로 보내는 output projection' },
  z: { id: 'z', kind: 'vector', shape: [11], label: 'z', role: 'intermediate', description: '단어별 logit 점수' },
  p: { id: 'p', kind: 'distribution', shape: [11], label: 'p', role: 'intermediate', description: '다음 토큰 확률 분포' },
  target: { id: 'target', kind: 'token', label: 'target', role: 'input' },
  L: { id: 'L', kind: 'scalar', label: 'L', role: 'output', description: '정답 확률의 negative log loss' },
  g: { id: 'g', kind: 'vector', shape: [6], label: 'g', role: 'intermediate', description: 'gradient' },
  lr: { id: 'lr', kind: 'scalar', label: 'η_t', role: 'param', description: 'step 별 학습률' },
  theta: { id: 'theta', kind: 'vector', shape: [6], label: 'θ', role: 'param', description: '모델 파라미터' },
  theta2: { id: 'theta2', kind: 'vector', shape: [6], label: 'θ_{t+1}', role: 'output', description: 'update 후 파라미터' },
  Adam: { id: 'Adam', kind: 'vector', shape: [6], label: 'AdamW(g)', role: 'intermediate' },
  N: { id: 'N', kind: 'scalar', label: 'N', role: 'input', description: '파라미터 수' },
  D: { id: 'D', kind: 'scalar', label: 'D', role: 'input', description: '학습 토큰 수' },
  Cflop: { id: 'Cflop', kind: 'scalar', label: 'C', role: 'input', description: '연산량' },
  lossCurve: { id: 'lossCurve', kind: 'vector', shape: [3], label: 'L(N,D,C)', role: 'output', description: '예상 loss' },
};

const obj = (...ids: string[]): SceneObject[] => ids.map((id) => O[id]);

function tr(t: number, op: Op, inputs: string[], produces: string | string[], caption: string, why: string): Transition {
  return { t, op, inputs, produces, caption, why };
}

function qkvTransitions(start = 0): Transition[] {
  return [
    tr(start, 'project', ['X', 'WQ'], 'Q', '$Q=XW_Q$', '$X$ 의 각 위치에서 "찾는 모양" 을 뽑는다.\n$W_Q$ 는 어느 feature 조합이 query 로 쓸 만한지 학습한다.'),
    tr(start + 1, 'project', ['X', 'WK'], 'K', '$K=XW_K$', '같은 $X$ 라도 비교될 때 필요한 모양은 다를 수 있다.\n그래서 $W_Q$ 와 별도인 $W_K$ 를 둔다.'),
    tr(start + 2, 'project', ['X', 'WV'], 'V', '$V=XW_V$', '점수 계산에 쓰는 기준과 실제 전달할 내용은 분리한다.\n$V$ 는 attention 가중합에 들어갈 정보다.'),
  ];
}

function attentionTransitions(start = 0, masked = false): Transition[] {
  const base = [
    tr(start, 'matmul', ['Q', 'K'], 'S', '$S=QK^T$', '각 query 행이 모든 key 행과 내적된다.\n결과 $S_{ij}$ 는 위치 $i$ 가 위치 $j$ 를 얼마나 맞는 상대로 보는지다.'),
    tr(start + 1, 'scale', ['S'], 'Sscaled', '$S/\\sqrt{d_k}$', '$d_k$ 가 커지면 내적 분산도 커진다.\n나누지 않으면 softmax 가 한쪽으로 포화되어 gradient 가 작아진다.'),
  ];
  if (masked) {
    base.push(
      tr(start + 2, 'mask', ['Sscaled', 'M'], 'SMasked', '$S_{masked}=S+M$', '미래 위치에는 $-\\infty$ 를 넣는다.\nsoftmax 뒤 그 위치의 확률이 0 이 된다.'),
      tr(start + 3, 'softmax', ['SMasked'], 'A', '$A=\\mathrm{softmax}(S_{masked})$', '각 행을 합 1 인 분포로 바꾼다.\n현재 위치는 과거와 현재 위치만 고를 수 있다.'),
      tr(start + 4, 'matmul', ['A', 'V'], 'H', '$H=AV$', '확률 $A$ 로 value 행들을 평균낸다.\n출력은 미래를 보지 않은 문맥 표현이다.')
    );
  } else {
    base.push(
      tr(start + 2, 'softmax', ['Sscaled'], 'A', '$A=\\mathrm{softmax}(S/\\sqrt{d_k})$', '점수를 행별 확률로 바꾼다.\n각 query 위치마다 어떤 token 에서 정보를 가져올지 정해진다.'),
      tr(start + 3, 'matmul', ['A', 'V'], 'H', '$H=AV$', '$A$ 는 비율, $V$ 는 내용이다.\n가중합 결과가 각 위치의 새 문맥 벡터가 된다.')
    );
  }
  return base;
}

function objectsFor(key: SceneKey): SceneObject[] {
  if (key === 'DataPrep' || key === 'DataPrepDetail') return obj('text', 'tokens', 't1', 't2', 't3', 'ids', 'onehot', 'E', 'Xtok');
  if (key === 'InputEmbedding' || key === 'InputEmbDetail' || key === 'PositionalEncoding' || key === 'PosEncDetail') return obj('tokens', 't1', 't2', 't3', 'E', 'Xtok', 'P', 'X');
  if (key === 'QKVComputation' || key === 'QKVRoleDetail') return obj('X', 'WQ', 'WK', 'WV', 'Q', 'K', 'V');
  if (key === 'AttentionScore' || key === 'AttnScoreDetail' || key === 'AttentionFlow' || key === 'SelfAttnImplDetail') return obj('X', 'WQ', 'WK', 'WV', 'Q', 'K', 'V', 'S', 'Sscaled', 'A', 'H');
  if (key === 'MultiHeadMerge' || key === 'MultiHeadDetail') return obj('X', 'heads', 'h1', 'h2', 'h3', 'concat', 'WO', 'H');
  if (key === 'MaskedAttention' || key === 'MaskedAttnDetail') return obj('Q', 'K', 'V', 'S', 'Sscaled', 'M', 'SMasked', 'A', 'H');
  if (key === 'CrossAttention' || key === 'CrossAttnDetail') return obj('Hdec', 'Henc', 'WQ', 'WK', 'WV', 'Qdec', 'Kenc', 'Venc', 'Across', 'Cctx');
  if (key === 'FeedForward' || key === 'FFNDetail') return obj('X', 'W1', 'Z', 'G', 'W2', 'F');
  if (key === 'LayerNorm' || key === 'LayerNormDetail') return obj('X', 'mu', 'sigma', 'gamma', 'beta', 'Xhat', 'LN', 'F', 'R');
  if (key === 'LinearSoftmax' || key === 'LinearSoftmaxDetail') return obj('H', 'WU', 'z', 'p', 'target', 'L');
  if (key === 'Training' || key === 'TrainingDetail') return obj('L', 'g', 'lr', 'theta', 'Adam', 'theta2');
  if (key === 'ScalingLaws' || key === 'ScalingDetail') return obj('N', 'D', 'Cflop', 'lossCurve');
  if (key === 'EncoderDecoder' || key === 'OverviewDetail' || key === 'SummaryDetail') return obj('X', 'Henc', 'Hdec', 'Qdec', 'Kenc', 'Venc', 'Across', 'Cctx', 'WU', 'z', 'p');
  return obj('tokens', 't1', 't2', 't3', 'P', 'X', 'WQ', 'WK', 'WV', 'Q', 'K', 'V', 'S', 'A', 'H', 'F', 'R');
}

function transitionsFor(key: SceneKey): Transition[] {
  if (key === 'DataPrep' || key === 'DataPrepDetail') {
    return [
      tr(0, 'project', ['text'], 'tokens', '$text\\to tokens$', '문장을 작은 단위로 자른다.\n이 단위가 sequence 의 위치가 된다.'),
      tr(1, 'project', ['tokens'], 'ids', '$tokens\\to ids$', '문자열 대신 vocabulary index 를 쓴다.\nindex 는 embedding table 의 행을 고르는 주소다.'),
      tr(2, 'project', ['ids'], 'onehot', '$ids\\to onehot$', 'one-hot 은 주소를 벡터 곱으로 표현한 형태다.\n실무에서는 보통 직접 행을 gather 한다.'),
      tr(3, 'matmul', ['onehot', 'E'], 'Xtok', '$X_{tok}=onehot\\cdot E$', '희소한 one-hot 을 밀집 벡터로 바꾼다.\n학습은 table $E$ 의 행을 조정한다.'),
    ];
  }
  if (key === 'InputEmbedding' || key === 'InputEmbDetail' || key === 'PositionalEncoding' || key === 'PosEncDetail') {
    return [
      tr(0, 'project', ['tokens', 'E'], 'Xtok', '$X_{tok}=E[token]$', '토큰 id 로 embedding 행을 고른다.\n이 벡터는 단어 의미의 출발점이다.'),
      tr(1, 'add', ['Xtok', 'P'], 'X', '$X=X_{tok}+P$', '같은 단어라도 위치가 다르면 다른 입력이 된다.\n덧셈은 의미 벡터와 위치 벡터를 같은 차원에서 섞는 가장 작은 조작이다.'),
    ];
  }
  if (key === 'QKVComputation' || key === 'QKVRoleDetail') return qkvTransitions();
  if (key === 'AttentionScore' || key === 'AttnScoreDetail') return attentionTransitions();
  if (key === 'AttentionFlow' || key === 'SelfAttnImplDetail') return [...qkvTransitions(), ...attentionTransitions(3)];
  if (key === 'MultiHeadMerge' || key === 'MultiHeadDetail') {
    return [
      tr(0, 'split', ['X'], ['h1', 'h2', 'h3'], '$X\\to head_1,head_2,head_3$', 'feature 차원을 head 로 나눈다.\n각 head 는 작은 공간에서 다른 관계 패턴을 볼 수 있다.'),
      tr(1, 'concat', ['heads'], 'concat', '$\\mathrm{Concat}(head_i)$', '병렬 attention 결과를 다시 한 행렬로 잇는다.\n이 단계까지는 head 별 정보가 나란히 놓인다.'),
      tr(2, 'project', ['concat', 'WO'], 'H', '$H=\\mathrm{Concat}(head_i)W_O$', '$W_O$ 가 head 사이 정보를 섞어 모델 차원 출력으로 되돌린다.'),
    ];
  }
  if (key === 'MaskedAttention' || key === 'MaskedAttnDetail') return attentionTransitions(0, true);
  if (key === 'CrossAttention' || key === 'CrossAttnDetail') {
    return [
      tr(0, 'project', ['Hdec', 'WQ'], 'Qdec', '$Q=H_{dec}W_Q$', 'decoder 현재 위치들이 source 에서 무엇을 찾을지 query 를 만든다.'),
      tr(1, 'project', ['Henc', 'WK'], 'Kenc', '$K=H_{enc}W_K$', 'encoder memory 를 비교 기준으로 바꾼다.'),
      tr(2, 'project', ['Henc', 'WV'], 'Venc', '$V=H_{enc}W_V$', 'encoder memory 에서 실제로 가져올 내용을 만든다.'),
      tr(3, 'matmul', ['Qdec', 'Kenc'], 'Across', '$A=\\mathrm{softmax}(QK^T/\\sqrt{d_k})$', 'target 위치마다 모든 source 위치를 조회한다.\n그래서 행렬 모양은 $T_{tgt}\\times T_{src}$ 다.'),
      tr(4, 'matmul', ['Across', 'Venc'], 'Cctx', '$C=AV$', 'source value 를 target 위치별 가중합으로 가져온다.\n디코더는 이 문맥으로 다음 단어를 고른다.'),
    ];
  }
  if (key === 'FeedForward' || key === 'FFNDetail') {
    return [
      tr(0, 'project', ['X', 'W1'], 'Z', '$Z=XW_1+b_1$', '각 토큰을 독립적으로 넓은 feature 공간으로 보낸다.\n넓은 공간은 조합을 만들 여유를 준다.'),
      tr(1, 'activate', ['Z'], 'G', '$G=\\phi(Z)$', '한 번 휘지 않으면 두 선형층은 한 선형층과 같다.\n활성화가 들어가야 확장층의 의미가 생긴다.'),
      tr(2, 'project', ['G', 'W2'], 'F', '$F=GW_2+b_2$', '넓은 표현을 다시 모델 차원으로 압축한다.\n다음 block 과 residual 이 같은 차원을 기대하기 때문이다.'),
    ];
  }
  if (key === 'LayerNorm' || key === 'LayerNormDetail') {
    return [
      tr(0, 'norm', ['X'], 'Xhat', '$\\hat{x}=(x-\\mu)/\\sqrt{\\sigma^2+\\epsilon}$', '각 토큰의 feature 값을 평균 0, 분산 1 근처로 맞춘다.\n다음 layer 가 입력 크기에 덜 흔들린다.'),
      tr(1, 'multiply', ['Xhat', 'gamma'], 'LN', '$LN(x)=\\gamma\\hat{x}+\\beta$', '정규화만 하면 표현 크기가 고정된다.\n$\\gamma,\\beta$ 로 필요한 scale 과 shift 를 다시 학습한다.'),
      tr(2, 'residual', ['X', 'F'], 'R', '$y=x+F(LN(x))$', '원본 경로를 더하면 gradient 가 우회로를 갖는다.\n깊은 stack 에서 정보와 미분 신호가 사라지는 것을 줄인다.'),
    ];
  }
  if (key === 'LinearSoftmax' || key === 'LinearSoftmaxDetail') {
    return [
      tr(0, 'project', ['H', 'WU'], 'z', '$z=hW_U$', '모델 차원 벡터를 vocabulary 크기의 점수로 바꾼다.\n각 logit 은 한 단어 후보의 비정규화 점수다.'),
      tr(1, 'softmax', ['z'], 'p', '$p=\\mathrm{softmax}(z)$', '점수들을 양수이고 합 1 인 분포로 바꾼다.\n샘플링이나 argmax 는 이 분포 위에서 이루어진다.'),
      tr(2, 'project', ['p', 'target'], 'L', '$L=-\\log p_{target}$', '정답에 낮은 확률을 주면 loss 가 커진다.\n이 스칼라가 backward 의 시작점이다.'),
    ];
  }
  if (key === 'Training' || key === 'TrainingDetail') {
    return [
      tr(0, 'project', ['L'], 'g', '$g=\\nabla_\\theta L$', 'loss 를 낮추려면 파라미터를 어느 방향으로 움직일지 알아야 한다.\n그 방향이 gradient 다.'),
      tr(1, 'scale', ['g', 'lr'], 'Adam', '$\\eta_t\\,\\mathrm{AdamW}(g)$', 'raw gradient 를 그대로 쓰지 않고 moment 와 좌표별 크기로 조정한다.\nwarmup 은 초기 불안정한 큰 step 을 막는다.'),
      tr(2, 'add', ['theta', 'Adam'], 'theta2', '$\\theta_{t+1}=\\theta_t-\\eta_t\\mathrm{AdamW}(g)$', 'gradient 는 loss 증가 방향이다.\n그래서 반대 방향으로 작은 step 을 뺀다.'),
    ];
  }
  if (key === 'ScalingLaws' || key === 'ScalingDetail') {
    return [
      tr(0, 'project', ['N', 'D', 'Cflop'], 'lossCurve', '$L(N,D,C)$', 'loss 는 파라미터 수, 토큰 수, 연산량의 균형에 묶인다.\n한 축만 키우면 다른 축이 병목이 된다.'),
    ];
  }
  if (key === 'EncoderDecoder' || key === 'OverviewDetail' || key === 'SummaryDetail') {
    return [
      tr(0, 'project', ['X'], 'Henc', '$source\\to H_{enc}$', 'encoder 는 source 전체를 양방향으로 읽어 memory 를 만든다.'),
      tr(1, 'project', ['X'], 'Hdec', '$target_{<t}\\to H_{dec}$', 'decoder 는 미래를 보지 않고 지금까지의 target 문맥을 만든다.'),
      tr(2, 'project', ['Hdec'], 'Qdec', '$Q=H_{dec}W_Q$', 'decoder 위치가 source memory 에 물어볼 query 를 만든다.'),
      tr(3, 'matmul', ['Qdec', 'Henc'], 'Across', '$A=\\mathrm{softmax}(QH_{enc}^T)$', 'target 각 위치가 source 어느 위치를 볼지 분포를 만든다.'),
      tr(4, 'matmul', ['Across', 'Henc'], 'Cctx', '$C=AH_{enc}$', 'source memory 를 가중합해 decoder 표현에 넣는다.'),
      tr(5, 'project', ['Cctx', 'WU'], 'z', '$z=CW_U$', '문맥이 반영된 표현을 단어 점수로 바꾼다.'),
      tr(6, 'softmax', ['z'], 'p', '$p=\\mathrm{softmax}(z)$', '다음 토큰 후보 분포가 된다.'),
    ];
  }
  return [...qkvTransitions(), ...attentionTransitions(3), tr(7, 'project', ['H'], 'F', '$F=FFN(H)$', '섞인 문맥을 위치별로 다시 변환한다.'), tr(8, 'residual', ['X', 'F'], 'R', '$Y=X+F$', '원본 경로를 남긴 채 새 정보를 더한다.')];
}

export function TransformerScene({ scene }: { scene: SceneKey }) {
  const meta = META[scene];
  const spec: SceneSpec = {
    id: meta.id,
    title: meta.title,
    caption: meta.caption,
    question: `${meta.title}에서 정보는 어느 입력에서 출발해 어떤 출력으로 바뀌며, 이 구조가 필요한 이유는 무엇일까?`,
    takeaway: meta.focus,
    overview: meta.focus,
    phases: [{ id: 'main', title: meta.title, narration: meta.focus }],
    objects: objectsFor(scene),
    transitions: transitionsFor(scene).map((transition) => ({ ...transition, phase: 'main' })),
  };
  return <Scene spec={spec} />;
}

export type { SceneKey as TransformerSceneKey };
