import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import SBERTArchViz from './viz/SBERTArchViz';

export default function SBERT() {
  return (
    <section id="sbert" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sentence-BERT: 샴 네트워크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Sentence-BERT(SBERT) — Reimers & Gurevych (2019)가 제안한 문장 임베딩 모델<br />
          핵심: BERT를 <strong>샴(Siamese) 네트워크</strong>로 재구성하여 문장 단위 벡터를 효율적으로 생성<br />
          "샴(Siamese)" = 쌍둥이 — 동일한 BERT 가중치를 공유하는 두 인코더가 각각 독립적으로 문장을 처리
        </p>

        <CitationBlock source="Reimers & Gurevych, 2019 — Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1908.10084">
          <p className="italic">"SBERT adds a pooling operation to the output of BERT to derive a fixed
          sized sentence embedding."</p>
        </CitationBlock>

        <h3 className="text-lg font-semibold mt-6 mb-3">1. 샴 네트워크 구조</h3>
        <p>
          두 문장을 각각 동일한 BERT에 통과 → 풀링(Mean Pooling) → 고정 벡터 u, v 생성<br />
          추론 시: cosine similarity <M>{'\\cos(u, v)'}</M>로 비교<br />
          가중치를 공유하므로 파라미터 증가 없음 — BERT-base 기준 110M개
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2. 풀링 전략</h3>
        <p>
          논문에서 3가지 비교: [CLS], Mean Pooling, Max Pooling<br />
          <strong>Mean Pooling이 최고 성능</strong> — 모든 토큰의 정보를 균등하게 반영<br />
          핵심: 사전학습된 BERT 위에 풀링을 추가하고, <strong>유사도 태스크로 파인튜닝</strong>하는 것이 차이
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">3. 학습 목표 — Classification (NLI)</h3>
        <p>
          NLI(Natural Language Inference, 자연어 추론) 데이터셋: SNLI(570K) + MultiNLI(430K)<br />
          두 문장의 관계를 entailment(함의) / contradiction(모순) / neutral(중립)로 분류<br />
          입력: 두 벡터 u, v와 element-wise 차이 |u-v|를 concat
        </p>
        <M display>{'\\text{input} = [u; v; |u-v|] \\in \\mathbb{R}^{3d}, \\quad \\text{output} = \\text{softmax}(W \\cdot \\text{input})'}</M>
        <p className="text-sm text-muted-foreground mt-1">
          |u-v|: 두 벡터의 element-wise 절대 차이 — 의미 차이를 명시적으로 포착하는 피처
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">4. 학습 목표 — Regression (STS)</h3>
        <p>
          STS(Semantic Textual Similarity) 데이터셋: 문장 쌍 + 유사도 점수(0~5)<br />
          cosine similarity를 직접 최적화 — MSE 손실 사용
        </p>
        <M display>{'\\mathcal{L} = \\text{MSE}(\\cos(u, v), y) = (\\cos(u, v) - y)^2'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">5. 학습 목표 — Triplet Loss</h3>
        <p>
          세 문장 (anchor, positive, negative)으로 구성<br />
          anchor와 positive 사이 거리를 줄이고, anchor와 negative 사이 거리를 늘림
        </p>
        <M display>{'\\mathcal{L} = \\max(0, \\|a - p\\| - \\|a - n\\| + \\varepsilon)'}</M>
        <p className="text-sm text-muted-foreground mt-1">
          <M>{'\\varepsilon'}</M>(margin) = 보통 1.0 — positive와 negative 사이 최소 거리를 보장하는 여유값
        </p>
      </div>

      <div className="not-prose my-8"><SBERTArchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-lg font-semibold mt-6 mb-3">Cross-Encoder vs Bi-Encoder</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">항목</th>
                <th className="border border-border px-4 py-2 text-left">Cross-Encoder</th>
                <th className="border border-border px-4 py-2 text-left">Bi-Encoder (SBERT)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['입력', '[CLS] A [SEP] B [SEP]', 'A, B 독립 인코딩'],
                ['출력', '유사도 점수 (0~1)', '벡터 u, v → cos(u,v)'],
                ['복잡도', 'O(n²) — 쌍마다 추론', 'O(n) — 벡터 사전 계산'],
                ['정확도', '높음 (STS ρ≈90+)', '약간 낮음 (STS ρ≈85)'],
                ['용도', '리랭킹 (상위 후보 재정렬)', '검색, 클러스터링, 대규모 비교'],
              ].map(([item, cross, bi]) => (
                <tr key={item}>
                  <td className="border border-border px-4 py-2 font-medium">{item}</td>
                  <td className="border border-border px-4 py-2">{cross}</td>
                  <td className="border border-border px-4 py-2">{bi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-7">
          요약 1: SBERT는 <strong>샴 네트워크 + Mean Pooling</strong>으로 문장 벡터 생성 — BERT 대비 STS ρ가 29→85로 도약.<br />
          요약 2: NLI 분류 학습이 가장 효과적 — |u-v| 피처가 <strong>의미 차이를 명시적으로</strong> 학습.<br />
          요약 3: 실전에서는 <strong>Bi-Encoder로 검색 → Cross-Encoder로 리랭킹</strong>하는 2단계 파이프라인이 표준.
        </p>
      </div>
    </section>
  );
}
