import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TASKS = [
  { id: 'cls', name: '분류 (SST-2)', color: '#6366f1',
    desc: '[CLS] 출력 → Dense(768, num_classes) → Softmax. 감정분석, 의도분류 등. 정확도 94.9% (SST-2).' },
  { id: 'qa', name: 'QA (SQuAD)', color: '#10b981',
    desc: '[CLS] Question [SEP] Context. 각 토큰에 start/end 확률 예측. SQuAD 2.0 F1 83.1.' },
  { id: 'ner', name: 'NER (CoNLL)', color: '#f59e0b',
    desc: '각 토큰 출력 → Dense(768, num_tags). BIO 태깅 방식. CoNLL-2003 F1 92.8.' },
  { id: 'nli', name: 'NLI (MNLI)', color: '#8b5cf6',
    desc: '[CLS] Premise [SEP] Hypothesis → 3-way 분류(수반/모순/중립). MNLI 정확도 86.7.' },
];

const VARIANTS = [
  { name: 'DistilBERT', params: '66M', speedup: '1.6x', note: '지식 증류로 40% 경량화. 성능 97% 유지.' },
  { name: 'RoBERTa', params: '125M', speedup: '1x', note: 'NSP 제거, 동적 마스킹, 더 큰 배치. BERT 대비 전면 개선.' },
  { name: 'ALBERT', params: '12M', speedup: '5.6x', note: '임베딩 분해 + 레이어 공유. 파라미터 89% 감소.' },
];

export default function FineTuning() {
  const [active, setActive] = useState<string | null>(null);
  const sel = TASKS.find((t) => t.id === active);

  return (
    <section id="fine-tuning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">파인튜닝 패턴과 변형 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          사전학습된 BERT 위에 태스크별 <strong>얇은 출력 레이어</strong>만 추가 — 다양한 NLP 태스크에 적용 가능<br />
          파인튜닝(Fine-tuning, 사전학습 모델을 특정 태스크에 맞게 재학습) 시 전체 파라미터를 2~4 epoch, lr=2e-5로 미세 조정
        </p>
      </div>

      <div className="space-y-1.5 mb-6">
        {TASKS.map((t) => (
          <motion.button key={t.id} whileHover={{ x: 3 }}
            onClick={() => setActive(active === t.id ? null : t.id)}
            className="w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer"
            style={{ borderColor: active === t.id ? t.color : t.color + '30', background: active === t.id ? t.color + '14' : t.color + '06' }}>
            <span className="font-semibold text-xs w-28 flex-shrink-0" style={{ color: t.color }}>{t.name}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-lg border p-3 mb-6 text-sm text-foreground/80"
            style={{ borderColor: sel.color + '30', background: sel.color + '08' }}>
            {sel.desc}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-xl font-semibold mb-3">경량화 변형</h3>
      </div>
      <div className="space-y-2">
        {VARIANTS.map((v) => (
          <div key={v.name} className="flex items-center gap-3 rounded-lg border border-border/40 px-4 py-2.5">
            <span className="font-mono font-bold text-sm text-indigo-400 w-24 flex-shrink-0">{v.name}</span>
            <span className="text-xs font-mono text-emerald-400 w-12">{v.params}</span>
            <span className="text-xs font-mono text-amber-400 w-10">{v.speedup}</span>
            <span className="text-xs text-foreground/60">{v.note}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">태스크별 파인튜닝 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 1. 문장 분류 (Single Sentence Classification)
//
//   입력:  [CLS] token1 token2 ... [SEP]
//   출력 헤드: [CLS] 토큰의 hidden state → Dense(num_classes)
//
//   사용: 감정 분석, 스팸 분류, 언어 감지
//   예시 데이터셋: SST-2, CoLA, TREC
//
// 2. 문장 쌍 분류 (Sentence Pair Classification)
//
//   입력:  [CLS] premise [SEP] hypothesis [SEP]
//   segment: 0,0,0,0,1,1,1,1
//   출력 헤드: [CLS] → Dense(num_classes)
//
//   사용: NLI, 의역 감지, 유사도
//   예시 데이터셋: MNLI, QQP, STS-B
//
// 3. 질의응답 (Extractive QA)
//
//   입력:  [CLS] question [SEP] context [SEP]
//   출력 헤드: 각 토큰 → (start_logit, end_logit)
//   손실: start와 end 위치의 cross entropy
//
//   추론: argmax(start) ~ argmax(end) 구간이 정답
//
//   예시 데이터셋: SQuAD 1.1 / 2.0, NaturalQuestions
//
// 4. Named Entity Recognition (Token Classification)
//
//   입력:  [CLS] token1 token2 ... [SEP]
//   출력 헤드: 각 토큰 → Dense(num_tags)
//
//   BIO 태깅: B-PER, I-PER, O, B-LOC, I-LOC, ...
//
//   예시 데이터셋: CoNLL-2003, OntoNotes

// 파인튜닝 하이퍼파라미터 (논문 권장):
//   - Learning rate: 2e-5, 3e-5, 5e-5 중 선택
//   - Batch size: 16 or 32
//   - Epochs: 2~4
//   - Optimizer: AdamW
//   - Warmup: 10% of steps`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">BERT 이후 모델 계보</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BERT 파생 모델들 (2019~2024)
//
// 효율화:
//   - DistilBERT (2019): 지식 증류, 6 layers, 66M params
//   - MobileBERT (2020): Bottleneck, 25M params
//   - TinyBERT (2019): 2-layer distillation
//   - ALBERT (2019): factorized embedding + shared layers
//
// 성능 개선:
//   - RoBERTa (2019): 더 많은 데이터, 동적 마스킹, NSP 제거
//   - SpanBERT (2019): 연속 span 마스킹
//   - ELECTRA (2020): replaced token detection (더 효율)
//   - DeBERTa (2020): disentangled attention
//
// 다국어:
//   - mBERT: 104개 언어 동시 학습
//   - XLM-R (2019): 100개 언어, RoBERTa 기반
//   - KoBERT, BERT-ko: 한국어 특화
//
// 도메인 특화:
//   - BioBERT: 생의학 논문
//   - SciBERT: 과학 논문
//   - FinBERT: 금융 문서
//   - LegalBERT: 법률 문서
//   - ClinicalBERT: 의료 기록
//
// Long Context:
//   - Longformer (2020): sparse attention, 4K+ tokens
//   - BigBird (2020): global + random + window
//   - LED: Longformer Encoder-Decoder

// 현재 위치 (2024):
//   - Encoder-only BERT 계열: 검색, 분류, 임베딩에 여전히 활용
//   - Decoder-only (GPT/LLaMA): 생성 태스크 지배
//   - Encoder-decoder (T5, BART): 요약, 번역
//
// 트렌드: 거대 LLM에 밀리지만, 효율성 측면에서 여전히 필수
//   - Sentence embedding (SBERT): 검색/유사도
//   - Dense retrieval (DPR, ColBERT)
//   - Reranking (cross-encoder)`}
        </pre>
        <p className="leading-7">
          요약 1: BERT는 <strong>분류·QA·NER·NLI</strong> 등 거의 모든 NLP 태스크의 standard backbone.<br />
          요약 2: <strong>RoBERTa·ELECTRA·DeBERTa</strong>로 개선되며 GLUE 90+ 달성.<br />
          요약 3: LLM 시대에도 <strong>검색·분류·임베딩</strong> 용도로는 BERT 계열이 여전히 우위.
        </p>
      </div>
    </section>
  );
}
