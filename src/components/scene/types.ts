/**
 * Scene — Object × State 엔진 spec (v1, draft)
 *
 * 모든 학문은 "객체가 존재하고, 상태가 변한다" 로 환원된다는 원칙에서 출발.
 * 글마다 손코딩하던 SVG viz 를 declarative spec 으로 통일하는 게 목표.
 *
 * v1 변경 (v0 대비):
 *  - DROP `mutates` — spec 을 monotonic 으로. 상태 변화는 새 object 생성으로만 표현.
 *    잔차·마스킹도 새 object 가 더 교육적 (전/후 둘 다 보임).
 *  - DROP `tensor` kind — multi-head 같은 케이스는 `group of matrix` 로 충분.
 *  - DROP `layout: 'stack' | 'grid'` — 'flow' 만 남김. 필요해지면 그때.
 *  - ADD `InputRef` 와 slicing — Q[i,:] 같은 sub-selection.
 *  - ADD `produces: ObjectId | ObjectId[]` — split 의 1→h 출력.
 *  - ADD `description` on SceneObject — 짧은 label 외에 긴 설명.
 *  - ADD `narration` on Phase — 각 phase 의 한 단락 캡션.
 *  - ADD ops: `activate`, `matmul`. `split-heads` → `split`, `concat-heads` → `concat`.
 *  - 명시: 'flow' layout = 의존 그래프 위상정렬 → 좌→우. 좌표 손박지 않음.
 *
 * 설계 원칙:
 *  1. 의미만 담는다. 색·좌표·픽셀 사이즈는 spec 에 없다. 렌더러가 결정한다.
 *  2. ObjectKind 는 작고 고정. Op 는 registry 로 확장 가능.
 *  3. 시간은 정수 인덱스. 같은 t 인 transition 들은 평행 발생.
 *  4. 의존 그래프로 자동 layout.
 *  5. Spec 은 monotonic. 한 번 등장한 object 는 안 사라지고, 변화는 새 object 로.
 *  6. 도메인별 op 는 나중에 등록 (backprop / diffusion). v1 은 attention 커버 목표.
 */

export type ObjectId = string;

// ------------------------------------------------------------
// Objects — 화면에 존재하는 것들
// ------------------------------------------------------------

export type ObjectKind =
  | 'scalar'        // 단일 숫자. 작은 원 + 값
  | 'vector'        // 1D. 가로 셀 row
  | 'matrix'        // 2D. 셀 grid
  | 'token'         // 이산 심볼. pill
  | 'distribution'  // 정규화된 vector. 막대 그래프 (softmax 의 출력)
  | 'group'         // 다른 object 의 컨테이너. multi-head 등 평행 구조
  | 'label';        // 텍스트 주석 전용. 시각만, 의미적 object 아님

export interface SceneObject {
  id: ObjectId;
  kind: ObjectKind;

  /** 차원. vector=[d], matrix=[r,c]. group/scalar/token/label 은 unused */
  shape?: number[];

  /** 구체 값. 시각화에 의미 있을 때만. matrix 는 2D array */
  values?: number | number[] | number[][];

  /** 화면 라벨. 짧게. 'Q', 'K', 'W_Q', 'softmax(QK^T)' */
  label?: string;

  /** 한 줄 설명 — 이 객체가 무엇인지 ($...$ 안 LaTeX) */
  description?: string;

  /** 왜 이 객체가 존재하는지 — pedagogy. `\n` 으로 줄바꿈 가능 ($...$ 안 LaTeX) */
  why?: string;

  /** 수식 요소별 의미·이유. 각 entry = { tex (수식 부분), note (설명) } */
  notes?: Note[];

  /** 의미 역할. 렌더러가 색·위치 결정에 사용 */
  role?: 'input' | 'param' | 'intermediate' | 'output';

  /** group 일 때 자식들 */
  children?: ObjectId[];
}

// ------------------------------------------------------------
// Input reference — slicing 지원
// ------------------------------------------------------------

/**
 * Transition 의 input 은 단순 ObjectId 또는 slice 표기.
 * slice 형식 (v1):
 *   '[i,:]'   → 행 i 전체     (parametric i — 보통 group iteration 안에서 의미)
 *   '[:,j]'   → 열 j 전체
 *   '[0,:]'   → 첫 행 (constant index 도 가능)
 *   '[0]'     → 첫 원소 (vector)
 * 복잡한 numpy 슬라이싱은 v1 미지원. 필요해지면 그때 정의.
 */
export type InputRef =
  | ObjectId
  | { object: ObjectId; slice: string };

// ------------------------------------------------------------
// Transitions — 시간에 따른 상태 변화
// ------------------------------------------------------------

/**
 * Op = 의미적 동사. 렌더러가 op 별로 애니메이션 primitive 를 가진다.
 *
 * canonical input order (어떤 input 이 어떤 역할인지 op 별 규약):
 *   matmul:        [A, B]               → C = A · B
 *   project:       [x, W]               → y = x · W   (W 는 param role 권장)
 *   dot:           [a, b]               → s = a · b   (둘 다 vector)
 *   scale:         [x]      payload.by  → y = x * by  (by 는 scalar)
 *   add:           [a, b]               → y = a + b
 *   multiply:      [a, b]               → y = a ⊙ b   (elementwise)
 *   activate:      [x]      payload.fn  → y = fn(x)   ('tanh'|'relu'|'gelu'|'sigmoid')
 *   softmax:       [x]                  → p = softmax(x)
 *   norm:          [x]      payload.kind→ y = norm(x) ('layer'|'batch'|'l2')
 *   mask:          [x, m]               → y = x where m, else -inf
 *   weighted-sum:  [w, V]               → y = Σ w_i · V_i   (w distribution, V group of vector)
 *   split:         [x]      payload.h   → [x_0..x_{h-1}]    (produces 는 array)
 *   concat:        [...xs]              → y = concat(xs)
 *   residual:      [x, fx]              → y = x + fx
 */
export type Op =
  | 'matmul'
  | 'project'
  | 'dot'
  | 'scale'
  | 'add'
  | 'multiply'
  | 'activate'
  | 'softmax'
  | 'norm'
  | 'mask'
  | 'weighted-sum'
  | 'split'
  | 'concat'
  | 'residual';
// 향후: 'gradient' | 'update' | 'noise-add' | 'denoise-step' | 'sample' …

export interface Transition {
  /** 논리 시각. 같은 t 인 transition 들은 평행 발생 */
  t: number;

  op: Op;

  /** 참여 input. canonical order 는 op 별 규약 참고 */
  inputs: InputRef[];

  /** 새로 생기는 object. split 처럼 다출력은 배열 */
  produces: ObjectId | ObjectId[];

  /** op-specific payload. scale.by, activate.fn, split.h 등 */
  payload?: Record<string, unknown>;

  /** 한 줄 caption — 보통 수식 ($...$ 안 LaTeX) */
  caption?: string;

  /** 왜 이 연산을 하는지 — pedagogy. `\n` 으로 줄바꿈 가능 ($...$ 안 LaTeX) */
  why?: string;

  /** 수식 요소별 의미·이유 */
  notes?: Note[];

  /** 묶음 표시용. phase id 참조. 같은 phase = 시각 그룹 */
  phase?: string;
}

/** 수식 요소 1개당 설명 — caption / description 아래 unordered list 로 렌더 */
export interface Note {
  /** 수식의 부분. $\\sum_k$ 같은 LaTeX (지문에 $ 안 써도 됨) */
  tex: string;
  /** 그 요소가 무엇인지 / 왜 이런지 */
  note: string;
  /**
   * note 가 어느 객체에 attached 되는지. 명시 시 그 객체 옆에 별도 box 로 표시.
   * 생략 시 produces 옆 caption block 안에 list 로 표시.
   */
  target?: ObjectId;
}

// ------------------------------------------------------------
// Phase — 의미 단위 묶음 + narration
// ------------------------------------------------------------

export interface Phase {
  id: string;
  title: string;
  /** 한 단락 narration. 이 phase 전체가 뭘 보여주는지 */
  narration?: string;
}

// ------------------------------------------------------------
// Scene — 한 viz 의 spec
// ------------------------------------------------------------

export interface Scene {
  /** 페이지 내 unique id */
  id: string;

  title?: string;
  caption?: string;
  /** Scene 이 시작되기 전에 독자가 붙잡을 질문. */
  question?: string;
  /** 마지막 step 뒤에 남길 한 문장 결론. */
  takeaway?: string;
  /** step 0 에서 보여줄 해설. 복잡한 그래프가 무엇을 의미하는지 먼저 고정한다. */
  overview?: string;
  /** step 0 에서 함께 보여줄 짧은 범례. */
  legend?: { label: string; description: string }[];
  /** false 면 step 0 에서 전체 transition 화살표를 한꺼번에 그리지 않는다. */
  overviewArrows?: boolean;

  objects: SceneObject[];
  transitions: Transition[];

  /** phase 목록. transition 의 phase 필드가 이걸 참조 */
  phases?: Phase[];
}

// ------------------------------------------------------------
// 사용 예 1 — Q, K, V 생성 (transition 3개, 단순)
// ------------------------------------------------------------

export const EXAMPLE_QKV: Scene = {
  id: 'self-attn-qkv',
  title: 'Self-Attention — Q, K, V 생성',
  caption: '같은 입력 x 가 세 가중치 매트릭스를 통해 Q, K, V 로 변환된다.',

  objects: [
    { id: 'x',  kind: 'vector', shape: [2], values: [0.8, 0.2], label: 'x', role: 'input',
      description: '한 토큰의 임베딩 벡터',
      why: '문장 안 한 단어가 의미 공간의 어디에 있는지 나타내는 숫자 묶음.\nself-attention 은 이 벡터에서 세 가지 역할 (찾을 것 / 비교 기준 / 전달 내용) 의 표현을 뽑아냄' },
    { id: 'Wq', kind: 'matrix', shape: [2, 2], label: 'W_Q', role: 'param',
      description: '학습되는 변환 매트릭스',
      why: '입력 $x$ 의 어느 부분이 "찾고 싶은 정보" 인지 추출하는 변환.\n학습 데이터로부터 어느 부분이 query 로 의미있는지 모델이 알아냄' },
    { id: 'Wk', kind: 'matrix', shape: [2, 2], label: 'W_K', role: 'param',
      description: '학습되는 변환 매트릭스',
      why: '같은 $x$ 에서 "비교 기준" 으로 쓸 부분 추출.\n$W_Q$ 와 별개 학습이라 같은 토큰의 query 모양과 key 모양이 다를 수 있음' },
    { id: 'Wv', kind: 'matrix', shape: [2, 2], label: 'W_V', role: 'param',
      description: '학습되는 변환 매트릭스',
      why: '같은 $x$ 에서 "전달할 정보" 추출.\n$W_K$ 와 분리한 이유: 한 토큰이 "어떻게 비교될지" 와 "무엇을 보낼지" 가 다른 측면일 수 있음' },
    { id: 'Q',  kind: 'vector', shape: [2], values: [0.7, 0.3], label: 'Q', role: 'intermediate',
      description: 'query 벡터 — 이 토큰이 찾는 것',
      why: '다른 토큰들의 key 와 비교돼서 누가 비슷한지 판정에 쓰임' },
    { id: 'K',  kind: 'vector', shape: [2], values: [0.5, 0.6], label: 'K', role: 'intermediate',
      description: 'key 벡터 — 비교될 때 이 토큰의 모습',
      why: '다른 토큰들의 query 와 비교돼서 매칭 점수가 계산됨' },
    { id: 'V',  kind: 'vector', shape: [2], values: [0.4, 0.8], label: 'V', role: 'intermediate',
      description: 'value 벡터 — 전달할 내용',
      why: 'attention 가중치 결정 후, 이 벡터가 가중합되어 출력의 일부가 됨' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['x', 'Wq'], produces: 'Q',
      caption: '$Q = x \\cdot W_Q$',
      why: '매트릭스 곱 = $x$ 의 각 차원에 어떤 가중치 줘서 합산할지 결정.\n결과 $Q$ 의 각 차원이 "찾고 싶은 정보" 의 한 측면을 담음' },
    { t: 1, op: 'project', inputs: ['x', 'Wk'], produces: 'K',
      caption: '$K = x \\cdot W_K$',
      why: '$W_K \\ne W_Q$ 라 같은 입력에서 다른 모양의 표현 나옴.\nQ 와 K 모양이 분리돼야 비교 함수가 자유롭게 학습됨' },
    { t: 2, op: 'project', inputs: ['x', 'Wv'], produces: 'V',
      caption: '$V = x \\cdot W_V$',
      why: 'K 와 분리한 이유: 같은 토큰의 "비교 기준" 과 "전달 내용" 이 다른 측면일 수 있음.\n예: 단어 "사과" — 비교 기준은 "과일류" 일 수 있지만, 전달할 정보는 "빨갛다·달다" 일 수 있음' },
  ],
};

// ------------------------------------------------------------
// 사용 예 2 — Scaled Dot-Product Attention (slicing + 다단계)
//   scores = Q · K^T / √d_k
//   A      = softmax(scores)         (행별 분포)
//   output = A · V                    (가중합)
// ------------------------------------------------------------

export const EXAMPLE_SCALED_DOT_PRODUCT_ATTN: Scene = {
  id: 'scaled-dot-product-attn',
  title: 'Scaled Dot-Product Attention',
  caption: 'Q 와 K 의 모든 쌍을 비교해 score 매트릭스 → softmax → V 가중합.',

  phases: [
    { id: 'score',     title: 'Score',     narration: 'Q 의 각 행과 K 의 각 행 내적으로 $(n \\times n)$ 점수 매트릭스 생성. 큰 $d_k$ 에서 softmax 포화 막으려 $\\sqrt{d_k}$ 로 나눔.' },
    { id: 'normalize', title: 'Normalize', narration: 'score 의 각 행을 softmax 로 정규화. 각 query 위치가 모든 key 위치에 어떤 가중치를 주는지 분포로.' },
    { id: 'aggregate', title: 'Aggregate', narration: '정규화된 가중치를 V 에 적용해 가중합. 출력의 각 행이 한 query 위치의 컨텍스트 벡터.' },
  ],

  objects: [
    { id: 'Q', kind: 'matrix', shape: [4, 64], label: 'Q', role: 'input',
      description: 'Query 매트릭스 — 토큰별 질의 벡터를 한 매트릭스에 쌓음',
      why: '한 토큰의 질의 벡터를 한 row 로 두고, $n$ 개 토큰을 세로로 쌓은 형태.\n매트릭스로 묶으면 모든 토큰의 비교를 한 번의 매트릭스 곱으로 처리 가능',
      notes: [
        { tex: '$4$', note: '토큰 수 (예시 시퀀스 길이)' },
        { tex: '$64$', note: '한 토큰의 query 벡터 차원 ($d_k$). 보통 64~128' },
      ],
    },
    { id: 'K', kind: 'matrix', shape: [4, 64], label: 'K', role: 'input',
      description: 'Key 매트릭스 — 토큰별 "비교 기준" 벡터 쌓음',
      why: '각 row 가 한 토큰이 다른 토큰의 query 와 매칭될 때 쓰일 표현.\n$Q$ 와 같은 차원 $d_k$ 라 내적 (= 유사도) 계산 가능',
    },
    { id: 'V', kind: 'matrix', shape: [4, 64], label: 'V', role: 'input',
      description: 'Value 매트릭스 — 토큰별 "전달할 내용" 벡터 쌓음',
      why: '각 row 가 한 토큰이 출력에 기여할 정보.\nK 와 매트릭스를 분리한 이유: 한 토큰이 "어떻게 비교되는지" 와 "무엇을 보낼지" 가 다른 측면일 수 있어서',
    },
    { id: 'scores_raw',  kind: 'matrix', shape: [4, 4],  label: 'QK^T',   role: 'intermediate',
      description: '모든 query–key 쌍의 raw 내적값' },
    { id: 'scores',      kind: 'matrix', shape: [4, 4],  label: 'scores', role: 'intermediate',
      description: '$\\sqrt{d_k}$ 로 나눠 분산 안정화된 점수' },
    { id: 'A',           kind: 'matrix', shape: [4, 4],  label: 'A',      role: 'intermediate',
      description: '각 row 가 합 1 인 attention 가중치 분포' },
    { id: 'O',           kind: 'matrix', shape: [4, 64], label: 'output', role: 'output',
      description: 'attention 출력 — 각 query 위치의 컨텍스트 벡터' },
  ],

  transitions: [
    { t: 0, phase: 'score',     op: 'matmul',  inputs: ['Q', 'K'], produces: 'scores_raw',
      payload: { transposeB: true },
      caption: '$Q \\cdot K^T \\to (n, n)$',
      why: '왜 $K^T$?\nQ 의 각 행 (query 위치) 과 K 의 각 행 (key 위치) 의 내적을 한 번에. 모든 query–key 쌍 유사도를 $(n \\times n)$ 매트릭스에 일괄',
      notes: [
        { tex: '$Q$', note: 'shape $(n, d_k)$. 각 row = 한 query 위치 벡터' },
        { tex: '$K^T$', note: 'shape $(d_k, n)$. 행렬 곱 차원 맞추기 위해 전치' },
        { tex: '$(n, n)$', note: '[i, j] = $i$-query 와 $j$-key 의 내적 (유사도)' },
      ],
    },
    { t: 1, phase: 'score',     op: 'scale',   inputs: ['scores_raw'], produces: 'scores',
      payload: { by: '1/√d_k' },
      caption: '$\\text{scores} = \\text{scores}_{\\text{raw}} / \\sqrt{d_k}$',
      why: '왜 $\\sqrt{d_k}$?\n차원이 크면 내적 분산이 $d_k$ 에 비례해 커진다. softmax 가 한 곳에 쏠려 gradient vanish → 분산을 1 근처로 유지',
      notes: [
        { tex: '$d_k$', note: 'key 벡터의 차원 (예: 64). 큰 모델일수록 큼' },
        { tex: '$\\sqrt{d_k}$', note: '$d_k$ 가 아니라 $\\sqrt{d_k}$ 인 이유: 분산이 $d_k$ 비례 → 표준편차는 $\\sqrt{d_k}$' },
      ],
    },
    { t: 2, phase: 'normalize', op: 'softmax', inputs: ['scores'], produces: 'A',
      payload: { axis: -1 },
      caption: '$A_{ij} = \\frac{e^{s_{ij}}}{\\sum_k e^{s_{ik}}}$',
      why: '왜 softmax?\n각 row 의 점수들을 합 1 인 확률분포로 만들어 가중치 의미 보장. 음수·합 ≠ 1 은 가중합 의미가 깨짐',
      notes: [
        { tex: '$s_{ij}$', note: '$i$-query 와 $j$-key 의 (스케일 후) 점수' },
        { tex: '$e^{s_{ij}}$', note: '왜 exp? 음수도 양수 가중치로 변환 + 큰 점수 ↔ 훨씬 큰 가중치 (지수적 차이)' },
        { tex: '$\\sum_k e^{s_{ik}}$', note: '$i$-row 의 모든 key 위치 합 → 정규화 분모. $k$ 는 행 안 인덱스' },
      ],
    },
    { t: 3, phase: 'aggregate', op: 'matmul',  inputs: ['A', 'V'], produces: 'O',
      caption: '$O = A \\cdot V$',
      why: '왜 $A \\cdot V$?\n각 query 위치의 출력 = key 별 가중치 × value 의 가중합. attention 의 최종 컨텍스트 벡터',
      notes: [
        { tex: '$A_{ij}$', note: '$i$-query 가 $j$-key 에 주는 가중치 (합 1)' },
        { tex: '$V_j$', note: '$j$-key 위치의 value 벡터 (전달할 정보)' },
        { tex: '$O_i$', note: '$\\sum_j A_{ij} \\cdot V_j$ — $i$-위치 출력' },
      ],
    },
  ],
};

// ------------------------------------------------------------
// 사용 예 3 — Additive (Bahdanau) Attention (활성화 + iteration)
//   각 인코더 h_i 에 대해 e_i = vᵀ tanh(W·s + U·h_i)
//   group 의 자식별로 transition 이 반복되는 패턴
// ------------------------------------------------------------

export const EXAMPLE_ADDITIVE_ATTN: Scene = {
  id: 'additive-attn',
  title: 'Additive (Bahdanau) Attention',
  caption: '디코더 상태 s 와 각 인코더 h_i 의 유사도를 MLP 로 계산.',

  objects: [
    { id: 's',  kind: 'vector', shape: [4], label: 's',  role: 'input',
      description: '디코더 상태 (현재 시점)' },
    { id: 'W',  kind: 'matrix', shape: [4, 4], label: 'W', role: 'param',
      description: '디코더 측 가중치 (학습)' },
    { id: 'U',  kind: 'matrix', shape: [4, 4], label: 'U', role: 'param',
      description: '인코더 측 가중치 (학습)' },
    { id: 'v',  kind: 'vector', shape: [4], label: 'v',  role: 'param',
      description: 'score 합산 벡터' },

    { id: 'H',   kind: 'group', label: 'H', children: ['h1', 'h2', 'h3', 'h4'] },
    { id: 'h1',  kind: 'vector', shape: [4], label: 'h_1', description: '위치 1 인코더 hidden' },
    { id: 'h2',  kind: 'vector', shape: [4], label: 'h_2', description: '위치 2 인코더 hidden' },
    { id: 'h3',  kind: 'vector', shape: [4], label: 'h_3', description: '위치 3 인코더 hidden' },
    { id: 'h4',  kind: 'vector', shape: [4], label: 'h_4', description: '위치 4 인코더 hidden' },

    { id: 'Ws',  kind: 'vector', shape: [4], label: 'W·s', role: 'intermediate' },
    { id: 'e',   kind: 'vector', shape: [4], label: 'e', role: 'intermediate', description: '4-position 정렬 점수' },
    { id: 'α',   kind: 'distribution', shape: [4], label: 'α', role: 'intermediate',
      description: '정규화된 attention 가중치' },
    { id: 'c',   kind: 'vector', shape: [4], label: 'c', role: 'output', description: '컨텍스트 벡터' },
  ],

  transitions: [
    { t: 0, op: 'project', inputs: ['s', 'W'], produces: 'Ws',
      caption: '$W \\cdot s$',
      why: 'Bahdanau 의 MLP 는 디코더 측과 인코더 측을 따로 변환한 뒤 합산. 분리해야 양쪽이 독립적인 의미 공간을 학습' },
    { t: 1, op: 'project', inputs: ['H', 'U'], produces: 'e',
      caption: '$e_i = v^T \\tanh(W s + U h_i)$',
      why: '가장 단순한 유사도는 $s \\cdot h_i$ — 두 벡터의 같은 위치끼리 곱하고 합한 값.\n그 한 가지 모양만으론 모든 종류의 유사도 패턴을 못 표현.\n이 식의 각 조각이 단계적으로 자유도를 추가해서, $s \\cdot h_i$ 보다 다양한 유사도 함수를 학습 가능하게 만듦',
      notes: [
        { tex: '$W s,\\ U h_i$', note: '$s$ 와 $h_i$ 를 각자 다른 매트릭스로 변환한 뒤 더함.\n변환 매트릭스 $W$, $U$ 가 학습되므로, "두 벡터의 어느 부분을 비교할지" 자체를 모델이 결정' },
        { tex: '$\\tanh(\\cdot)$', note: 'S 자 모양으로 휘는 함수.\n왜 필요? 휘지 않으면 (선형) 매트릭스 두 층은 결국 한 매트릭스와 같아짐 — 두 층 쌓은 의미가 사라짐.\ntanh 가 한 번 들어가야 두 층의 효과가 살아남' },
        { tex: '$v^T \\cdot (\\cdots)$', note: '휜 벡터의 각 차원에 학습 가중치 $v$ 곱하고 합 → 스칼라 점수.\n$v$ 가 "어느 차원의 패턴이 점수에 중요한지" 학습' },
        { tex: 'vs $s \\cdot h_i$', note: 'dot product 는 위 식에서 $W = U = I$, tanh 빼고, $v$ 가 전부 1 인 특수 케이스.\n이 식이 그보다 일반적이라 dot product 가 못 잡는 유사도도 학습 가능' },
      ],
    },
    { t: 2, op: 'softmax', inputs: ['e'], produces: 'α',
      caption: '$\\alpha_i = \\mathrm{softmax}(e_i)$',
      why: '왜 정규화? 4 개 score 값을 확률분포로 — 가중합의 의미 (전체 비율) 가 보장돼야 컨텍스트 벡터가 인코더 상태들의 평균적 표현이 됨' },
    { t: 3, op: 'weighted-sum', inputs: ['α', 'H'], produces: 'c',
      caption: '$c = \\sum_i \\alpha_i \\cdot h_i$',
      why: '왜 가중합? 모든 인코더 위치에 attention 부여 후 한 컨텍스트로 압축. 매 디코더 step 마다 $\\alpha$ 가 다시 계산돼 동적 참조' },
  ],
};

/**
 * 알려진 한계 (v1 의도적 미커버):
 *  - 반복 N 회 (transformer block × 12, diffusion step × T): phase repeat 미지원. 필요 시 v2.
 *  - 정적 비교 테이블 (Additive vs Dot vs Scaled): Scene 으로 강제 표현 안 함. plain HTML table 권장.
 *  - 수식 derivation 디스플레이 ("0.7×0.8 + 0.3×0.2 = 0.62"): caption 에 문자열로 박는다.
 *  - 그래디언트 역방향 / autodiff 흐름: 'gradient' op 추가 시 처리. v1 에선 미지원.
 *
 * 렌더러 책임 (spec 에 없는 것):
 *  - 색: 단일 accent + role 별 미세 변동 (param 살짝 deemphasized, intermediate / output 강조).
 *  - 좌표: 의존 그래프 위상정렬 → 좌→우 flow.
 *  - 셀 크기 / 간격 / 폰트.
 *  - 애니메이션 타이밍: spring physics. 같은 t 끼리 평행 stagger.
 *  - 캡션 표시: phase narration 은 viz 상단, transition caption 은 진행 중 인 transition 옆.
 *  - 스크롤 in-view 트리거.
 *  - 텍스트 wrap: foreignObject 자동.
 *  - Overflow 방지: object bbox 가 viz 영역 안에 들어가도록 layout 알고리즘이 보장.
 */
