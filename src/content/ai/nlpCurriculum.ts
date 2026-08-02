export interface NlpCurriculumItem {
  slug: string;
  paperSlug?: string;
  label: string;
  question: string;
  outcome: string;
}

export interface NlpCurriculumPhase {
  number: string;
  title: string;
  description: string;
  items: NlpCurriculumItem[];
}

export const nlpCurriculum: NlpCurriculumPhase[] = [
  {
    number: '1',
    title: '텍스트를 계산 가능한 표현으로 바꾼다',
    description: '문자열 경계와 vocabulary를 정하고, count 통계에서 예측 학습으로 넘어가며 vector geometry가 생기는 과정을 이해한다.',
    items: [
      { slug: 'tokenizer', label: 'Tokenizer', question: '연속된 문자열을 어떤 단위의 ID로 나눌까?', outcome: 'Unicode·byte·subword 경계, vocabulary 크기, OOV와 한국어 분절을 비교한다.' },
      { slug: 'distributional-semantics', label: '분포 의미', question: '함께 등장한 횟수가 어떻게 의미 좌표가 될까?', outcome: 'Co-occurrence, PPMI, SVD와 learned embedding의 관계를 계산한다.' },
      { slug: 'word2vec', paperSlug: 'paper-word2vec-2013', label: 'Word2Vec', question: '거대한 동시 등장 표를 만들지 않고 문맥 예측으로 같은 의미 구조를 학습할 수 있을까?', outcome: 'Skip-gram·CBOW, negative sampling gradient와 shifted PMI를 하나의 계산으로 연결한다.' },
    ],
  },
  {
    number: '2',
    title: '순서대로 읽으며 상태를 갱신한다',
    description: '같은 recurrent cell을 시간축으로 재사용하고 장기 gradient가 사라지는 원인과 gate의 해법을 추적한다.',
    items: [
      { slug: 'rnn', paperSlug: 'paper-long-term-dependencies-1994', label: 'RNN', question: '앞에서 읽은 정보를 하나의 hidden state에 어떻게 누적할까?', outcome: 'Recurrent update, language modeling, BPTT와 gradient product를 계산한다.' },
      { slug: 'lstm', paperSlug: 'paper-lstm-1997', label: 'LSTM', question: '필요한 정보만 오래 보존하고 나머지는 어떻게 지울까?', outcome: 'Forget·input·output gate와 cell-state gradient highway를 분리해 본다.' },
    ],
  },
  {
    number: '3',
    title: '고정 압축을 필요한 정보 검색으로 바꾼다',
    description: '입력 전체를 한 vector에 넣는 병목에서 출발해 decoder가 매 step encoder state를 다시 조회하게 만든다.',
    items: [
      { slug: 'seq2seq', paperSlug: 'paper-seq2seq-2014', label: 'Seq2Seq', question: '길이가 다른 입력과 출력을 하나의 조건부 생성 문제로 만들 수 있을까?', outcome: 'Encoder·decoder, teacher forcing, exposure bias와 beam search를 연결한다.' },
      { slug: 'attention-theory', paperSlug: 'paper-bahdanau-attention-2015', label: 'Attention', question: '현재 query에 필요한 memory만 가중합하려면 무엇을 계산할까?', outcome: 'Score, mask, softmax, value 합성과 multi-head의 tensor shape를 계산한다.' },
    ],
  },
  {
    number: '4',
    title: '모든 위치를 병렬로 섞고 사전학습한다',
    description: 'Recurrence를 self-attention block으로 바꾸고 causal·bidirectional mask가 모델의 사용 목적을 어떻게 나누는지 본다.',
    items: [
      { slug: 'transformer-architecture', paperSlug: 'paper-transformer-2017', label: 'Transformer', question: 'Attention, residual, normalization, FFN은 한 block에서 어떤 shape로 흐를까?', outcome: 'QKV부터 decoder-only generation과 KV cache까지 전체 실행 순서를 복원한다.' },
      { slug: 'bert', paperSlug: 'paper-bert-2018', label: 'BERT', question: '오른쪽 문맥까지 보는 encoder는 어떤 사전학습과 downstream 작업에 적합할까?', outcome: 'Bidirectional mask, MLM, special token, fine-tuning head와 한계를 구분한다.' },
    ],
  },
];
