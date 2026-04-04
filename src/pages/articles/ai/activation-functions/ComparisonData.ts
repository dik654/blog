export interface FnRow {
  name: string;
  range: string;
  gradient: string;
  pro: string;
  con: string;
  usage: string;
}

export const TABLE_DATA: FnRow[] = [
  {
    name: 'Sigmoid',
    range: '(0, 1)',
    gradient: 'max 0.25',
    pro: '확률 해석 가능',
    con: 'Vanishing, 비영점',
    usage: '이진 분류 출력',
  },
  {
    name: 'Tanh',
    range: '(−1, 1)',
    gradient: 'max 1.0',
    pro: 'Zero-centered',
    con: 'Vanishing',
    usage: 'RNN/LSTM 게이트',
  },
  {
    name: 'ReLU',
    range: '[0, ∞)',
    gradient: '0 or 1',
    pro: '빠름, 기울기 유지',
    con: 'Dying ReLU',
    usage: 'CNN 히든 레이어',
  },
  {
    name: 'Leaky ReLU',
    range: '(−∞, ∞)',
    gradient: '0.01 or 1',
    pro: 'Dying 방지',
    con: '최적 α 미정',
    usage: 'GAN 판별기',
  },
  {
    name: 'GELU',
    range: '≈(−0.17, ∞)',
    gradient: '부드러운 곡선',
    pro: '확률적 게이팅',
    con: '계산 비용 ↑',
    usage: 'BERT, GPT',
  },
  {
    name: 'SwiGLU',
    range: '(−∞, ∞)',
    gradient: '적응적',
    pro: '최고 성능',
    con: '파라미터 ↑',
    usage: 'LLaMA, PaLM',
  },
];
