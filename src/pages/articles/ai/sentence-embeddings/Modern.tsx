import M from '@/components/ui/math';
import ModernModelsViz from './viz/ModernModelsViz';

export default function Modern() {
  return (
    <section id="modern" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">E5, BGE, GTE: 현대 임베딩 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SBERT 이후 문장 임베딩은 <strong>인스트럭션 기반</strong>과 <strong>다단계 대조학습</strong>으로 진화<br />
          핵심 변화: 태스크 접두사(prefix)로 모델에 의도를 전달 → 같은 모델이 검색/분류/클러스터링 모두 수행<br />
          대규모 비지도 데이터 → 지도 파인튜닝 → Hard Negative Mining의 3단계 학습이 표준화
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">1. E5 — Embeddings from bidirectional Encoder representations</h3>
        <p>
          Microsoft (2022). 이름의 유래: "EmbEddings from bidirEctional Encoder rEpresentations" — E가 5번 등장<br />
          핵심 혁신: 모든 입력에 <strong>태스크 접두사</strong>를 부착 — "query:", "passage:", "classification:"<br />
          모델이 접두사를 보고 현재 태스크를 인식 → 같은 벡터 공간에서 태스크별 최적화
        </p>
        <p>
          학습 데이터: CCPairs(Consistency-filtered Colossal Clean Crawled Corpus Pairs) — C4 코퍼스에서 추출한 일관성 있는 텍스트 쌍<br />
          1단계: CCPairs로 대규모 대조학습. 2단계: NLI + STS로 지도 파인튜닝<br />
          E5-large-v2: MTEB 평균 66.2 — 당시 공개 모델 중 최고 성능
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2. BGE — BAAI General Embedding</h3>
        <p>
          BAAI(Beijing Academy of AI, 2023). RetroMAE(Masked Auto-Encoder)로 사전학습<br />
          RetroMAE 핵심: 인코더는 15% 마스킹, 디코더는 50~70% 마스킹으로 복원<br />
          디코더를 어렵게 만들어 인코더가 더 풍부한 문장 표현을 만들도록 유도하는 전략
        </p>
        <p>
          학습: 약 2억 텍스트 쌍으로 대조학습 → 태스크별 파인튜닝 + 어려운 네거티브 마이닝<br />
          "Represent this sentence:" 접두사 사용. 다국어 지원(한국어 포함)이 강점
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">3. GTE — General Text Embeddings</h3>
        <p>
          Alibaba DAMO Academy (2023). Multi-stage contrastive learning이 핵심<br />
          3단계 학습: 비지도(위키피디아/웹) → 지도(NLI/STS) → Hard Negative Mining<br />
          Hard Negative Mining — 의미가 유사해 보이지만 실제로는 관련 없는 문서를 집중적으로 학습
        </p>
        <p>
          다양한 크기 제공: GTE-small(33M), GTE-base(109M), GTE-large(335M)<br />
          효율-성능 균형이 특징 — GTE-base가 다른 모델의 large보다 높은 성능을 보이기도 함
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">4. 인스트럭션 기반 임베딩의 원리</h3>
        <p>
          전통 임베딩: 하나의 벡터 공간에서 모든 태스크 수행 → 검색에 좋은 벡터가 분류에는 약할 수 있음<br />
          인스트럭션 기반: prefix/instruction으로 태스크 의도 전달<br />
          같은 문장이라도 "query:" 접두사 → 검색 최적화 벡터, "classify:" 접두사 → 분류 최적화 벡터
        </p>
        <M display>{'\\text{embed}(\\text{"query: 파이썬"}) \\neq \\text{embed}(\\text{"classify: 파이썬"})'}</M>
        <p className="text-sm text-muted-foreground mt-1">
          접두사가 모델의 attention 패턴을 변경 — 검색 시에는 키워드에, 분류 시에는 주제에 집중
        </p>
      </div>

      <div className="not-prose my-8"><ModernModelsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-lg font-semibold mt-6 mb-3">모델 비교 정리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">모델</th>
                <th className="border border-border px-4 py-2 text-left">사전학습</th>
                <th className="border border-border px-4 py-2 text-left">접두사</th>
                <th className="border border-border px-4 py-2 text-left">특징</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['E5', 'CCPairs (C4)', 'query: / passage:', '최초의 인스트럭션 임베딩'],
                ['BGE', 'RetroMAE', 'Represent this...:', '다국어 강점, 한국어'],
                ['GTE', 'Multi-stage', '태스크별 지시문', '효율-성능 균형, 다양한 크기'],
              ].map(([model, pretrain, prefix, feature]) => (
                <tr key={model}>
                  <td className="border border-border px-4 py-2 font-medium">{model}</td>
                  <td className="border border-border px-4 py-2">{pretrain}</td>
                  <td className="border border-border px-4 py-2 font-mono text-xs">{prefix}</td>
                  <td className="border border-border px-4 py-2">{feature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-7">
          요약 1: 현대 임베딩 모델은 <strong>태스크 접두사</strong>로 동일 모델이 검색/분류/클러스터링 모두 수행.<br />
          요약 2: 학습 파이프라인의 표준: <strong>대규모 비지도 → 지도 파인튜닝 → Hard Negative Mining</strong>.<br />
          요약 3: LLM 기반 임베딩(E5-mistral-7B)이 등장 — 파라미터 규모 증가로 성능 한계를 돌파.
        </p>
      </div>
    </section>
  );
}
