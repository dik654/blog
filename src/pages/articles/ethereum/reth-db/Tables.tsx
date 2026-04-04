import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TablesViz from './viz/TablesViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TABLE_GROUPS, WHY_SEPARATE_TABLES } from './TablesData';

const COLOR_MAP: Record<string, string> = {
  sky: 'border-sky-500/50 bg-sky-500/5',
  emerald: 'border-emerald-500/50 bg-emerald-500/5',
  amber: 'border-amber-500/50 bg-amber-500/5',
};
const BADGE_MAP: Record<string, string> = {
  sky: 'bg-sky-500 text-white',
  emerald: 'bg-emerald-500 text-white',
  amber: 'bg-amber-500 text-white',
};

export default function Tables({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [group, setGroup] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="tables" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tables 매크로 & 스키마</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Reth는 <code>tables!</code> 매크로로 모든 DB 테이블을 선언한다.<br />
          각 테이블의 Key/Value 타입이 컴파일 타임에 결정되므로
          잘못된 타입으로 읽기/쓰기를 시도하면 컴파일 에러가 발생한다.
          <br />
          Geth는 <code>[]byte</code>로 직렬화하므로 타입 오류가 런타임에만 드러난다.{' '}
          <CodeViewButton onClick={() => open('db-tables')} />
        </p>
        <p className="leading-7">
          각 테이블은 MDBX의 named database(dbi, 하나의 DB 파일 안에서 독립적으로 관리되는 B+tree)로 생성된다.<br />
          테이블을 분리하면 각 B+tree가 작아지고, 캐시 효율이 높아진다.<br />
          아래에서 테이블 그룹별 구조를 확인할 수 있다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">테이블 그룹</h3>
      <div className="space-y-2 mb-8">
        {TABLE_GROUPS.map((g, gi) => (
          <motion.div key={gi} onClick={() => setGroup(gi)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${gi === group ? COLOR_MAP[g.color] : 'border-border'}`}
            animate={{ opacity: gi === group ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${gi === group ? BADGE_MAP[g.color] : 'bg-muted text-muted-foreground'}`}>{g.tables.length}</span>
              <span className="font-semibold text-sm">{g.title}</span>
            </div>
            <AnimatePresence>
              {gi === group && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="mt-3 ml-10 space-y-2">
                    {g.tables.map(t => (
                      <div key={t.name} className="text-sm">
                        <span className="font-mono font-semibold text-foreground">{t.name}</span>
                        <span className="text-muted-foreground ml-2">{t.key} → {t.value}</span>
                        <p className="text-xs text-foreground/60 mt-0.5">{t.note}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">설계 판단 Q&A</h3>
      <div className="space-y-2 mb-8">
        {WHY_SEPARATE_TABLES.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <TablesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
