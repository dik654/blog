import { CapabilityCheck, ComparisonTable, Misconception, SourceNotes } from '@/components/learning/ArticleLearning';
import ProvenanceViz from './viz/ProvenanceViz';

export default function Provenance() {
  return (
    <section id="provenance" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Claim에서 원문까지 근거 추적</h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          답 끝에 <code>[문서 3]</code>을 붙였다고 근거가 생기지는 않는다. 모델이 실제로 문서 3을 사용했는지,
          문서 3의 어느 문장이 답의 어느 주장을 지지하는지, 중간 요약에서 의미가 바뀌지 않았는지를 따로 확인해야 한다.
          그래서 운영 RAG는 답변 전체가 아니라 <strong>검증 가능한 최소 주장인 claim</strong>을 추적 단위로 쓴다.
        </p>
        <p>
          실행할 때마다 질문, 검색 후보, rerank 결과, LLM에 실제로 넣은 context snapshot, 중간 요약, 최종 답에 stable id를 붙인다.
          그리고 “A가 B의 입력이었다”는 edge를 남기면 전체 과정이 방향성 비순환 그래프(DAG)가 된다.
          최종 claim에서 edge를 거꾸로 따라가면 정확한 source span까지 도달해야 한다.
        </p>
      </div>

      <ProvenanceViz />

      <ComparisonTable
        headers={['상태', '판정 질문', '제품의 행동']}
        rows={[
          ['Supported', '원문 span이 claim 전체를 직접 지지하는가?', 'claim과 source span을 함께 노출한다.'],
          ['Inconclusive', '관련 근거는 있지만 조건·범위·수치가 부족한가?', '불확실성을 표시하고 추가 검색이나 사람 검토로 보낸다.'],
          ['Unsupported', '근거가 없거나 원문과 충돌하는가?', '답에서 제거하거나 명시적으로 답변을 보류한다.'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>최소 provenance schema</h3>
        <ul>
          <li><strong>source_span</strong> — URL·문서 버전·page 또는 line·정확한 text 범위</li>
          <li><strong>chunk</strong> — source span 목록과 chunking 규칙·embedding 버전</li>
          <li><strong>retrieval_run</strong> — query·filter·candidate score·rerank score·선택된 context</li>
          <li><strong>generation_node</strong> — model·prompt version·입력 node id·출력 text</li>
          <li><strong>claim</strong> — 한 번에 참/거짓을 판정할 수 있는 문장과 support edge</li>
        </ul>
        <p>
          source가 갱신되면 문서 전체를 무조건 다시 생성할 필요도 없다. 바뀐 span을 가리키는 chunk와 그 chunk에서 파생된 claim만
          무효화하면 된다. provenance는 출처 UI를 위한 장식이 아니라 재처리 범위와 오류 위치를 줄이는 운영 데이터다.
        </p>
      </div>

      <Misconception>
        GraphRAG는 모든 RAG의 상위호환이 아니다. 여러 문서에 흩어진 관계나 전체 corpus의 주제를 묻는 질문에는 유리하지만,
        정확한 제품 번호나 한 매뉴얼의 절차를 찾는 질문은 sparse·dense 검색과 rerank가 더 단순하고 검증하기 쉽다.
      </Misconception>

      <CapabilityCheck
        items={[
          'citation 문자열과 claim-evidence edge의 차이를 설명한다.',
          '질문에서 source span까지 이어지는 node와 edge를 설계한다.',
          '부분 근거를 claim 전체의 지지로 잘못 판정하지 않는다.',
          'source 변경 시 영향받은 claim만 무효화한다.',
        ]}
      />

      <SourceNotes
        sources={[
          { label: 'Lewis et al. · Retrieval-Augmented Generation', href: 'https://arxiv.org/abs/2005.11401', note: 'parametric memory와 검색되는 non-parametric memory를 결합한 RAG 기준 논문.' },
          { label: 'Microsoft Research · GraphRAG', href: 'https://www.microsoft.com/en-us/research/project/graphrag/', note: 'local retrieval이 놓치는 전역 관계 질문과 knowledge graph 기반 검색의 경계.' },
          { label: 'Microsoft Research · VeriTrail', href: 'https://www.microsoft.com/en-us/research/blog/veritrail-detecting-hallucination-and-tracing-provenance-in-multi-step-ai-workflows/', note: '중간 생성 node를 거쳐 최종 claim을 원문까지 추적하고 오류 위치를 찾는 연구.' },
        ]}
      />
    </section>
  );
}
