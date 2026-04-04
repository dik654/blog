import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DA_TERMS } from './GlossaryData';

export default function Glossary() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="glossary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-2">핵심 용어 & 배경 지식</h2>
      <p className="text-sm text-foreground/60 mb-6">
        카드를 클릭하면 상세 설명이 펼쳐집니다.<br />
        심화 아티클 링크가 있는 용어는 코드 추적 수준의 별도 글에서 다룹니다.
      </p>

      <div className="space-y-2">
        {DA_TERMS.map((t, i) => (
          <motion.div
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${
              expanded === i ? 'border-sky-500/40 bg-sky-500/5' : 'border-border'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{t.icon}</span>
              <span className="font-semibold text-sm">{t.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">{t.en}</span>
            </div>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{t.desc}</p>
                  <p className="text-xs text-foreground/50 mt-1.5">
                    <span className="text-amber-600 dark:text-amber-400 font-medium">왜 중요한가?</span>{' '}{t.why}
                  </p>
                  {t.articleLink && (
                    <a
                      href={t.articleLink}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      <span>📖</span>
                      <span>심화 아티클: {t.articleTitle}</span>
                      <span className="text-[10px]">→</span>
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
