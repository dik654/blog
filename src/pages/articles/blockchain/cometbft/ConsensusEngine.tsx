import { CitationBlock } from '../../../../components/ui/citation';
import { CodeViewButton } from '@/components/code';
import TendermintRoundViz from './viz/TendermintRoundViz';
import { ROUND_CODE, STATE_CODE, COMPARISON_TABLE } from './ConsensusEngineData';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

const CELL = 'border border-border px-4 py-2';

export default function ConsensusEngine({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="consensus-engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 엔진 (Tendermint BFT)</h2>
      <div className="not-prose mb-8"><TendermintRoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT 합의 — Tendermint BFT 알고리즘 기반<br />
          <strong>Propose → Prevote → Precommit</strong> 3단계 프로토콜로 동작<br />
          이더리움 Casper FFG가 2 에폭 후 최종성 달성하는 것과 달리 매 블록 즉시 최종성 보장
        </p>
        <CitationBlock source="Buchman et al., &quot;The latest gossip on BFT consensus&quot;, 2018" citeKey={1} type="paper" href="https://arxiv.org/abs/1807.04938">
          <p className="italic">"Tendermint guarantees safety — no two correct processes decide differently — and liveness under partial synchrony"</p>
          <p className="mt-2 text-xs">Tendermint BFT 핵심 보장 — 부분 동기 모델에서 Safety(동일 높이에서 서로 다른 블록 커밋 불가) + Liveness 모두 제공</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">라운드 기반 합의 흐름</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('enter-propose', codeRefs['enter-propose'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterPropose()</span>
          <CodeViewButton onClick={() => onCodeRef('enter-prevote', codeRefs['enter-prevote'])} />
          <span className="text-[10px] text-muted-foreground self-center">defaultDoPrevote()</span>
          <CodeViewButton onClick={() => onCodeRef('enter-precommit', codeRefs['enter-precommit'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterPrecommit()</span>
          <CodeViewButton onClick={() => onCodeRef('finalize-commit', codeRefs['finalize-commit'])} />
          <span className="text-[10px] text-muted-foreground self-center">enterCommit()</span>
        </div>
        <p>
          Height H, Round R:<br />
          1. Propose (리더가 블록 제안)<br />
          Proposer = validators[H + R % len(validators)]<br />
          → 라운드 로빈 방식 리더 선출<br />
          2. Prevote (검증자가 블록 검증 후 투표)<br />
          유효한 블록 → Prevote(block_hash)<br />
          타임아웃/무효 → Prevote(nil)<br />
          +2/3 Prevote 수집 → "Polka" 달성<br />
          3. Precommit (최종 커밋 투표)<br />
          Polka 확인 → Precommit(block_hash)<br />
          → 해당 블록에 "Lock" (이전 Lock 해제)<br />
          +2/3 nil Prevote → Unlock
        </p>
        <CitationBlock source="cometbft/consensus/state.go" citeKey={2} type="code" href="https://github.com/cometbft/cometbft/blob/main/consensus/state.go">
          <pre className="text-xs overflow-x-auto"><code>{STATE_CODE}</code></pre>
          <p className="mt-2 text-xs text-foreground/70">합의 상태 머신의 핵심 구조체.</p>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 Casper FFG와 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>Tendermint BFT</th>
                <th className={`${CELL} text-left`}>Casper FFG + LMD-GHOST</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_TABLE.map(r => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.tendermint}</td>
                  <td className={CELL}>{r.casper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
