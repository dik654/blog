import RoundViz from './viz/RoundViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const roundCode = `Narwhal 라운드 기반 DAG:

Round r, Validator i:
  1. 자신의 TX 배치(batch)를 수집
  2. Header 생성:
     header = (round=r, author=i, payload_digests,
               parents=[r-1 라운드 증명서들])
  3. Header를 다른 검증자에게 전파
  4. 2f+1 서명 수집 → Certificate 형성
  5. Certificate를 DAG에 삽입

DAG 구조:
  정점(vertex) = (header, certificate)
  간선(edge) = 이전 라운드 증명서 참조
  → 인과관계 그래프 형성

라운드 진행 조건:
  이전 라운드의 2f+1 증명서 수신 → 다음 라운드 시작
  → 동기 가정 없이 진행 (비동기 안전)`;

export default function RoundStructure() {
  return (
    <section id="round-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 기반 DAG 구조</h2>
      <div className="not-prose mb-8"><RoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al., EuroSys 2022 — §3" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2105.11827">
          <p className="italic">
            "Narwhal ensures that every transaction submitted to any honest validator is eventually available to all honest validators."
          </p>
        </CitationBlock>

        <CodePanel title="라운드 구조" code={roundCode}
          annotations={[
            { lines: [3, 9], color: 'sky', note: 'Header 생성 → 서명 수집' },
            { lines: [11, 14], color: 'emerald', note: 'DAG 구조: 정점 + 간선' },
            { lines: [16, 18], color: 'amber', note: '비동기 안전한 진행 조건' },
          ]} />
      </div>
    </section>
  );
}
