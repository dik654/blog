import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StaticFilesViz from './viz/StaticFilesViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ARCHIVE_STEPS, GETH_FREEZER_COMPARISON } from './StaticFilesData';

const CELL = 'border border-border px-4 py-2';

export default function StaticFiles({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  const [step, setStep] = useState(0);

  return (
    <section id="static-files" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StaticFiles (고대 데이터)</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          이더리움 메인넷은 2015년부터 2,100만 개 이상의 블록을 생성했다.<br />
          이 모든 데이터를 하나의 MDBX에 저장하면 B+tree 깊이가 증가하고
          최신 데이터 조회도 느려진다.
          <br />
          제네시스 블록 데이터와 최신 블록 데이터가
          같은 트리에 섞여 있기 때문이다.
        </p>
        <p className="leading-7">
          <strong>핵심 관찰:</strong> finalized(확정, 되돌릴 수 없는) 블록 이전의 데이터는
          더 이상 변경되지 않는다. 변경 불가능한 데이터를 B+tree에 계속 보관할 이유가 없다.
          <br />
          Reth는 이 데이터를 flat file(단순 연속 바이트 파일)로 아카이브하여
          MDBX에는 최신 데이터만 유지한다.{' '}
          <CodeViewButton onClick={() => open('db-static-file')} />
        </p>
        <p className="leading-7">
          Geth도 동일한 아이디어를 <strong>Freezer</strong>(ancient store)로 구현한다.<br />
          차이점은 Reth가 <code>DashMap</code>(lock-free 동시성 해시맵)으로 세그먼트 경계를 관리하여
          읽기 경로에서 락(lock) 경합이 없다는 점이다.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">아카이브 흐름</h3>
      <div className="space-y-2 mb-8">
        {ARCHIVE_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-3">Reth StaticFiles vs Geth Freezer</h3>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted">
              <th className={`${CELL} text-left`}>속성</th>
              <th className={`${CELL} text-left`}>Reth</th>
              <th className={`${CELL} text-left`}>Geth</th>
            </tr>
          </thead>
          <tbody>
            {GETH_FREEZER_COMPARISON.map(r => (
              <tr key={r.attr}>
                <td className={`${CELL} font-medium`}>{r.attr}</td>
                <td className={CELL}>{r.reth}</td>
                <td className={CELL}>{r.geth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose">
        <StaticFilesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
