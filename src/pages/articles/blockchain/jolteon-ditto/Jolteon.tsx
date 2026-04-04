import JolteonViz from './viz/JolteonViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const pathCode = `Jolteon 이중 경로:

Fast Path (낙관적, 2단계):
  리더 → Propose(B)
  모든 노드 → Vote(B)
  리더가 n-f 투표 수집 → QC(B) 형성
  → 2단계 완료, 4 message delays
  조건: 모든 정직 노드가 동의해야 함

Slow Path (HotStuff 3단계):
  리더 장애 또는 일부 비동의 시 fallback
  Prepare → Pre-Commit → Commit
  → 7 message delays
  O(n) View Change 유지

전환 규칙:
  Fast path QC 실패 → 자동으로 slow path
  Slow path 완료 후 → 다음 view에서 fast 재시도`;

export default function Jolteon() {
  return (
    <section id="jolteon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Jolteon</h2>
      <div className="not-prose mb-8"><JolteonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Gelashvili et al., FC 2022 — Jolteon" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2106.10362">
          <p className="italic">
            "Jolteon combines the linear view-change of HotStuff with the optimistic responsiveness of PBFT."
          </p>
        </CitationBlock>

        <CodePanel title="Jolteon 이중 경로" code={pathCode}
          annotations={[
            { lines: [3, 8], color: 'emerald', note: 'Fast: 2단계, 4 delays' },
            { lines: [10, 14], color: 'sky', note: 'Slow: 3단계 HotStuff' },
            { lines: [16, 18], color: 'amber', note: '자동 전환 규칙' },
          ]} />
      </div>
    </section>
  );
}
