export const C = {
  cls: '#6366f1',
  qa: '#10b981',
  ner: '#f59e0b',
  gen: '#0ea5e9',
  muted: 'var(--muted-foreground)',
};

export const STEPS = [
  {
    label: '① 문장 분류 + 문장 쌍 분류',
    body: '단일 문장 분류: [CLS] token1 token2 ... [SEP] → [CLS]의 hidden(768) → Dense(num_classes) → Softmax.\n예: SST-2 감정분석(2-class, 94.9%), CoLA 문법성 판단, 스팸 분류.\n문장 쌍: [CLS] premise [SEP] hypothesis [SEP] → segment 0,0,0,1,1,1.\n같은 [CLS] 헤드로 3-way 분류: 수반(entailment) / 모순(contradiction) / 중립(neutral).\nMNLI 정확도 86.7%. QQP(의역 감지), STS-B(유사도 회귀)에도 동일 구조.\n핵심: [CLS] 토큰이 문장 전체의 집약 표현 — 분류 태스크의 유일한 입력.',
  },
  {
    label: '② 질의응답(QA) + NER 토큰 분류',
    body: 'Extractive QA: [CLS] question [SEP] context [SEP] → 각 토큰에 start/end logit 예측.\n손실: start 위치의 CE + end 위치의 CE. 추론: argmax(start) ~ argmax(end) 구간이 정답.\nSQuAD 2.0 F1 83.1. 정답 없음(unanswerable) 판단도 가능.\nNER(Named Entity Recognition): 각 토큰 → Dense(num_tags). BIO 태깅 방식.\nB-PER(사람 시작), I-PER(사람 계속), O(기타), B-LOC(장소 시작), ...\nCoNLL-2003 F1 92.8. WordPiece 분할 시 첫 서브워드만 태깅 대상.',
  },
  {
    label: '③ 파인튜닝 하이퍼파라미터',
    body: 'Learning rate: 2e-5, 3e-5, 5e-5 중 선택. 사전학습(1e-4) 대비 10~50배 작음.\n왜 작은 lr? 사전학습된 가중치를 크게 변경하면 학습된 표현이 파괴됨(catastrophic forgetting).\nBatch size: 16 또는 32. 소규모 태스크(CoLA: 8.5K) 에서는 16 권장.\nEpochs: 2~4. 과적합 방지. 대부분 3 epoch에서 수렴.\nOptimizer: AdamW. Warmup: 전체 step의 10%.\n전체 파라미터를 미세조정 — 출력 헤드만 학습하는 것(linear probing)보다 +10~15% 성능.',
  },
  {
    label: '④ BERT 이후 모델 계보',
    body: '효율화: DistilBERT(6층, 66M, 1.6x), ALBERT(12M, 임베딩 분해+레이어 공유), TinyBERT(2층).\n성능 개선: RoBERTa(NSP 제거, 동적 마스킹), ELECTRA(replaced token detection), DeBERTa(disentangled attn).\n다국어: mBERT(104언어), XLM-R(100언어, RoBERTa 기반), KoBERT(한국어 특화).\n도메인 특화: BioBERT(생의학), SciBERT(과학), FinBERT(금융), LegalBERT(법률).\nLong Context: Longformer(sparse attn, 4K+), BigBird(global+random+window).\n현재: Encoder-only는 검색/분류/임베딩에 우위. 생성은 Decoder-only(GPT/LLaMA) 지배.',
  },
];
