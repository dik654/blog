import M from '@/components/ui/math';
import PoolingCompareViz from './viz/PoolingCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLS 토큰 vs 평균 풀링</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          문장 임베딩(Sentence Embedding) — 가변 길이 문장을 <strong>고정 차원 벡터</strong>로 변환하는 기술<br />
          검색, 클러스터링, 의미 유사도 비교의 기반 — 두 문장의 의미가 비슷하면 벡터도 가깝게 위치해야 함<br />
          BERT는 토큰별 벡터를 출력하지만, 문장 하나를 대표하는 단일 벡터를 얻는 방법이 문제
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">1. [CLS] 토큰 풀링</h3>
        <p>
          BERT의 [CLS] 토큰 — 문장 시작 위치에 삽입되는 특수 토큰<br />
          사전학습 시 NSP(Next Sentence Prediction, 다음 문장 예측) 태스크에서 [CLS] 위에 분류 헤드를 올림<br />
          그래서 "문장 대표"로 쓰이지만, NSP는 두 문장의 연속 관계 판별용 — 의미 유사도와는 목적이 다름
        </p>
        <M display>{'\\text{sentence\\_vec} = h_{[\\text{CLS}]} \\in \\mathbb{R}^{768}'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">2. 평균 풀링 (Mean Pooling)</h3>
        <p>
          모든 토큰의 히든 스테이트를 element-wise 평균 → 문장 벡터<br />
          [CLS]보다 안정적이지만, 빈도 높은 불용어("은", "는", "이", "가")가 평균을 지배하는 문제<br />
          Attention mask를 적용하여 패딩 토큰은 평균에서 제외
        </p>
        <M display>{'\\text{sentence\\_vec} = \\frac{1}{n} \\sum_{i=1}^{n} h_i \\in \\mathbb{R}^{768}'}</M>

        <h3 className="text-lg font-semibold mt-6 mb-3">3. BERT 임베딩의 근본 한계</h3>
        <p>
          Reimers & Gurevych (2019): BERT [CLS] 임베딩 간 cosine similarity로 STS 벤치마크 측정 → <strong>GloVe 평균보다도 낮은 성능</strong><br />
          원인: BERT는 "두 문장을 [SEP]로 연결해 함께 넣고 비교"하도록 학습됨 — 개별 문장의 독립 인코딩이 목적이 아님<br />
          Cross-encoder(두 문장 동시 입력) 방식은 정확하지만 <M>{'O(n^2)'}</M> 비용 — 10,000 문장 쌍 비교에 약 65시간<br />
          문장 임베딩(Bi-encoder) 방식은 각 문장을 한 번만 인코딩 → <M>{'O(n)'}</M> — 동일 작업 약 5초
        </p>
      </div>

      <div className="not-prose my-8"><PoolingCompareViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-lg font-semibold mt-6 mb-3">좋은 문장 임베딩의 3가지 조건</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-6">
          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-3">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">의미 보존</p>
            <p className="text-sm text-muted-foreground">
              유사한 의미의 문장 → 가까운 벡터. "기분이 좋다" ≈ "나는 행복하다"
            </p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">효율적 비교</p>
            <p className="text-sm text-muted-foreground">
              cosine similarity로 즉시 비교 가능. 사전 인덱싱으로 대규모 검색 지원
            </p>
          </div>
          <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 p-3">
            <p className="font-semibold text-amber-700 dark:text-amber-300 mb-1">태스크 범용성</p>
            <p className="text-sm text-muted-foreground">
              검색, 분류, 클러스터링, 중복 탐지 등 다양한 다운스트림 태스크에 활용
            </p>
          </div>
        </div>
        <p className="leading-7">
          요약 1: BERT [CLS] 토큰은 <strong>NSP 목적으로 학습</strong>되어 의미 유사도 비교에 부적합 — STS ρ=29.2.<br />
          요약 2: 문장 임베딩의 핵심은 <strong>독립적 인코딩 + cosine 비교</strong> — Cross-encoder 대비 13,000배 빠름.<br />
          요약 3: Sentence-BERT가 이 간극을 해결 — 다음 섹션에서 샴 네트워크 구조를 분석.
        </p>
      </div>
    </section>
  );
}
