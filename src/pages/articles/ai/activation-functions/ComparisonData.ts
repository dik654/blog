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
    name: "Sigmoid",
    range: "(0, 1)",
    gradient: "max 0.25",
    pro: "확률 해석 가능",
    con: "Vanishing, 비영점",
    usage: "이진 분류 출력",
  },
  {
    name: "Tanh",
    range: "(−1, 1)",
    gradient: "max 1.0",
    pro: "Zero-centered",
    con: "Vanishing",
    usage: "RNN 상태·LSTM 후보값",
  },
  {
    name: "ReLU",
    range: "[0, ∞)",
    gradient: "0 or 1",
    pro: "빠름, 기울기 유지",
    con: "Dying ReLU",
    usage: "CNN 히든 레이어",
  },
  {
    name: "Leaky ReLU",
    range: "(−∞, ∞)",
    gradient: "0.01 or 1",
    pro: "음수 기울기 유지",
    con: "최적 α 미정",
    usage: "GAN 판별기",
  },
  {
    name: "GELU",
    range: "≈(−0.17, ∞)",
    gradient: "부드러운 곡선",
    pro: "매끄러운 입력 가중",
    con: "ReLU보다 연산 복잡",
    usage: "BERT, GPT",
  },
  {
    name: "SwiGLU",
    range: "(−∞, ∞)",
    gradient: "두 branch의 곱",
    pro: "feature별 조건부 gate",
    con: "projection·FLOP 증가",
    usage: "LLaMA, PaLM",
  },
];
