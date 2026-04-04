import ProtocolViz from './viz/ProtocolViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const roundCode = `Tendermint 라운드 구조:

Height H, Round R:
  1. Propose (proposer = validators[H+R % n])
     → 블록 B를 제안 (타임아웃: TimeoutPropose)

  2. Prevote
     → 유효한 제안 수신 시 Prevote(B)
     → 타임아웃 또는 무효 시 Prevote(nil)

  3. Precommit
     → +2/3 Prevote(B) 수신 = Polka → Precommit(B)
     → +2/3 Prevote(nil) → Precommit(nil)

  4. 결과
     → +2/3 Precommit(B) → Commit(B) → Height+1
     → 그 외 → Round+1 (자동 진행)`;

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜 흐름</h2>
      <div className="not-prose mb-8"><ProtocolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Buchman, Kwon, Milosevic — 2018 arXiv" citeKey={1} type="paper"
          href="https://arxiv.org/abs/1807.04938">
          <p className="italic">
            "Tendermint is the first BFT consensus protocol deployed at scale in a blockchain setting."
          </p>
        </CitationBlock>

        <CodePanel title="라운드 구조" code={roundCode}
          annotations={[
            { lines: [4, 5], color: 'sky', note: 'Propose: 결정론적 제안자' },
            { lines: [7, 9], color: 'emerald', note: 'Prevote: 유효성 확인' },
            { lines: [11, 13], color: 'amber', note: 'Precommit: Polka 기반 잠금' },
            { lines: [15, 17], color: 'violet', note: '결과: Commit 또는 Round+1' },
          ]} />
      </div>
    </section>
  );
}
