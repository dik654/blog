import { useState } from 'react';
import { motion } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ExecutionDetailViz from './viz/ExecutionDetailViz';
import { EXEC_COMPARISONS } from './ExecutionStageData';
import type { CodeRef } from '@/components/code/types';

export default function ExecutionStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <section id="execution-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExecutionStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          ExecutionStage는 앞선 세 Stage의 결과를 조합한다.<br />
          HeadersStage가 저장한 헤더, BodiesStage가 저장한 TX 목록, SendersStage가 복구한 sender 주소를
          하나의 완성 블록(<code>SealedBlockWithSenders</code>)으로 구성한다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계 판단: 배치 누적.</strong> Geth는 블록마다 <code>stateDB.Commit()</code>을 호출해 DB에 기록한다.<br />
          Reth는 <code>BundleState</code>(인메모리 해시맵)에 상태 변경을 누적하고,
          <code>commit_threshold</code>(기본 10,000블록)마다 한 번에 DB에 기록한다.
          <br />
          100,000블록 동기화 시 DB 쓰기 횟수가 약 100,000회에서 약 10회로 줄어든다.
        </p>
        <p className="leading-7">
          revm(Rust EVM 라이브러리)이 실제 TX 실행을 담당한다.<br />
          가스 계산, 잔고 이동, 컨트랙트 코드 실행 등 모든 EVM 연산이 revm에서 처리된다.
          <br />
          ExecutionStage는 "revm에 입력을 넣고 결과를 BundleState에 저장"하는 접착제 역할이다.
        </p>
      </div>

      <div className="not-prose mb-6"><ExecutionDetailViz /></div>

      {/* Geth vs Reth comparison table */}
      <div className="not-prose mb-6">
        <button onClick={() => setShowDetail(!showDetail)}
          className="text-sm font-semibold text-amber-600 dark:text-amber-400 cursor-pointer hover:underline mb-3">
          {showDetail ? '비교표 접기' : 'Geth vs Reth 비교 보기'}
        </button>
        {showDetail && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left px-4 py-2 font-medium">비교 항목</th>
                  <th className="text-left px-4 py-2 font-medium text-foreground/60">Geth</th>
                  <th className="text-left px-4 py-2 font-medium text-amber-600 dark:text-amber-400">Reth</th>
                </tr>
              </thead>
              <tbody>
                {EXEC_COMPARISONS.map((c, i) => (
                  <tr key={i} className="border-t border-border/30">
                    <td className="px-4 py-2 font-medium">{c.aspect}</td>
                    <td className="px-4 py-2 text-foreground/60">{c.geth}</td>
                    <td className="px-4 py-2 text-amber-600 dark:text-amber-400">{c.reth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('execution-stage', codeRefs['execution-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">ExecutionStage::execute()</span>
      </div>
    </section>
  );
}
