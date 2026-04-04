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
    </section>
  );
}
