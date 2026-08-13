import type { Article } from "../types";

// ── NLP & Attention ──
export const dlNlpArticles: Article[] = [
  {
    slug: "distributional-semantics",
    title: "분산 의미론: 동시발생 행렬에서 단어 벡터까지",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "가정·측정·의미 경계" },
      { id: "distributional", title: "Context matrix·PMI" },
      { id: "dimensionality", title: "SVD·cosine·평가 경계" },
      { id: "neural-approach", title: "SGNS·GloVe·contextual 연결" },
    ],
    component: () => import("@/pages/articles/ai/distributional-semantics"),
  },
  {
    slug: "rnn",
    title: "RNN: 시퀀스를 기억하는 신경망",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "Hidden state는 무엇을 기억하는가" },
      { id: "architecture", title: "Parameter 공유와 시간축 계산" },
      { id: "language-model", title: "다음 token 분포 학습" },
      { id: "bptt", title: "Jacobian 곱과 truncated BPTT" },
    ],
    component: () => import("@/pages/articles/ai/rnn"),
  },
  {
    slug: "lstm",
    title: "LSTM: 장기 의존성을 학습하는 게이트 구조",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "두 recurrent state의 계산 계약" },
      { id: "gates", title: "Channel별 보존·기록·공개 정책" },
      { id: "cell-state", title: "Forget gate와 direct gradient" },
      { id: "variants", title: "GRU·양방향 구조·현대 대안" },
    ],
    component: () => import("@/pages/articles/ai/lstm"),
  },
  {
    slug: "seq2seq",
    title: "Seq2Seq: 시퀀스를 시퀀스로 변환",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "조건부 sequence probability" },
      { id: "encoder", title: "Encoder–decoder state handoff" },
      { id: "decoder", title: "Autoregressive decoding과 search" },
      { id: "training", title: "Teacher forcing과 prefix gap" },
      { id: "limitations", title: "Fixed context에서 attention으로" },
    ],
    component: () => import("@/pages/articles/ai/seq2seq"),
  },
  {
    slug: "attention-theory",
    title: "어텐션 메커니즘 이론: Bahdanau에서 Transformer까지",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "Score → weight → aggregate" },
      { id: "additive", title: "Additive attention" },
      { id: "multiplicative", title: "Dot-product attention" },
      { id: "self-attention", title: "Self-attention과 multi-head" },
    ],
    component: () => import("@/pages/articles/ai/attention-theory"),
  },
  {
    slug: "tokenizer",
    title: "토크나이저: 텍스트를 토큰으로",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "Text·pipeline·model 계약" },
      { id: "bpe", title: "BPE merge와 byte alphabet" },
      { id: "wordpiece", title: "WordPiece greedy match" },
      { id: "sentencepiece", title: "SentencePiece와 Unigram" },
      { id: "comparison", title: "Corpus 평가와 배포" },
    ],
    component: () => import("@/pages/articles/ai/tokenizer"),
  },
  {
    slug: "transformer-architecture",
    title: "Transformer 아키텍처",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "Sequence 계산 경로" },
      { id: "input-contract", title: "ID·position·mask 계약" },
      { id: "position-information", title: "위치 신호의 개입 지점" },
      { id: "attention-boundary", title: "Source·visibility·비용" },
      { id: "transformer-block", title: "두 mixer·residual·norm" },
      { id: "output-head", title: "Logits·loss·decoding 경계" },
      { id: "training", title: "재현 가능한 training recipe" },
      { id: "scaling-laws", title: "Scaling law와 예산 목적" },
      { id: "next-reading", title: "다음 읽기 경로" },
    ],
    component: () => import("@/pages/articles/ai/transformer-architecture"),
  },
  {
    slug: "bert",
    title: "BERT: 양방향 사전학습의 혁신",
    subcategory: "ai-nlp",
    sections: [
      { id: "overview", title: "Representation과 visibility" },
      { id: "input-format", title: "입력·padding 계약" },
      { id: "pre-training", title: "MLM corruption과 recipe 증거" },
      { id: "fine-tuning", title: "Task head와 transfer" },
    ],
    component: () => import("@/pages/articles/ai/bert"),
  },
];
