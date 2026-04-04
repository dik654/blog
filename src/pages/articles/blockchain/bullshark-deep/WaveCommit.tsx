import WaveViz from './viz/WaveViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const waveCode = `Bullshark 웨이브 커밋 규칙:

DAG를 2라운드 단위 "웨이브"로 분할:
  Wave w = { Round 2w, Round 2w+1 }

앵커(Anchor):
  각 웨이브의 첫 라운드(짝수)에서 지정
  anchor(w) = leader_of_round(2w)
  → 결정론적 선택 (round % n)

커밋 조건:
  Wave w+1의 앵커가 존재하고,
  Wave w+1의 Round 2(w+1)+1 에서
  f+1 이상의 정점이 anchor(w)에 인과적 연결
  → anchor(w) 커밋!

커밋 후 정렬:
  anchor(w)에서 DAG 역추적
  도달 가능한 모든 미확정 정점 수집
  라운드 오름차순 → 같은 라운드 내 작성자 ID 순`;

export default function WaveCommit() {
  return (
    <section id="wave-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">웨이브 커밋</h2>
      <div className="not-prose mb-8"><WaveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Spiegelman et al., CCS 2022 — §4" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2201.05677">
          <p className="italic">
            "Bullshark achieves optimal amortized latency of 2 rounds in the common case under partial synchrony."
          </p>
        </CitationBlock>

        <CodePanel title="웨이브 커밋 규칙" code={waveCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: '2라운드 = 1웨이브' },
            { lines: [6, 9], color: 'emerald', note: '앵커 선택: 결정론적' },
            { lines: [11, 15], color: 'amber', note: '커밋 조건: f+1 참조' },
            { lines: [17, 20], color: 'violet', note: '정렬: 라운드→작성자 순' },
          ]} />
      </div>
    </section>
  );
}
