import M from '@/components/ui/math';
import AnalogyViz from './viz/AnalogyViz';
import StaticVsContextualViz from './viz/StaticVsContextualViz';
import AppsDetailViz from './viz/AppsDetailViz';

export default function Applications({ title }: { title?: string }) {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '활용 & 확장 모델'}</h2>
      <div className="not-prose mb-8"><AnalogyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>코사인 유사도</h3>
        <p>
          벡터를 L2 정규화(단위 벡터로 변환) 후 내적 계산 = 코사인 유사도<br />
          크기가 아닌 방향만 비교 — 의미 유사성 측정에 적합
        </p>
        <M display>{String.raw`\cos(\mathbf{a}, \mathbf{b}) = \frac{\underbrace{\mathbf{a} \cdot \mathbf{b}}_{\text{내적}}}{\underbrace{\|\mathbf{a}\|}_{\text{크기}_a} \cdot \underbrace{\|\mathbf{b}\|}_{\text{크기}_b}}`}</M>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">분자: 내적</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">두 벡터의 원소별 곱의 합 — 방향이 같을수록 큰 값</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">분모: L2 노름</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">벡터 크기로 나눠 정규화 — 결과 범위 [-1, 1]</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">결과 해석</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">1 = 동일 방향, 0 = 직교(무관), -1 = 반대</p>
          </div>
        </div>

        <h3>아날로지 추론 (벡터 산술)</h3>
        <M display>{String.raw`\vec{v}_{\text{왕}} - \vec{v}_{\text{남자}} + \vec{v}_{\text{여자}} \approx \vec{v}_{\text{여왕}}`}</M>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">1단계: 관계 추출</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><M>{String.raw`\vec{v}_{\text{왕}} - \vec{v}_{\text{남자}}`}</M> — "남성" 성분 제거, "왕권" 방향만 남김</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">2단계: 방향 전환</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300"><M>{String.raw`+ \vec{v}_{\text{여자}}`}</M> — "여성" 성분 추가, 결과 벡터 이동</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">3단계: 최근접 검색</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">결과 벡터와 코사인 유사도가 가장 높은 단어 → "여왕"</p>
          </div>
        </div>

        <h3>Doc2Vec — 문서 임베딩으로 확장</h3>
        <p>
          Word2Vec을 확장 — 단어 시퀀스(문장, 단락, 문서) 전체를 하나의 벡터로 표현<br />
          각 문서에 고유한 <code>paragraph vector</code>를 추가하여 단어 예측 시 함께 학습
        </p>
        <M display>{String.raw`P(w_t \mid \underbrace{d_i}_{\text{문서 벡터}},\; w_{t-c},\; \ldots,\; w_{t-1})`}</M>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">PV-DM 구조</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">문서 벡터 <M>{String.raw`d_i`}</M>가 윈도우 내 단어들과 함께 concat/average되어 다음 단어 예측</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">문서 벡터 역할</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">문서 전체의 "주제 기억" — 윈도우가 이동해도 동일 문서면 같은 <M>{String.raw`d_i`}</M> 공유</p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">추론 시</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">새 문서 → 단어 가중치 고정, 문서 벡터만 역전파로 학습 → 고정 길이 벡터 획득</p>
          </div>
        </div>

        <h3>현대 LLM과의 관계</h3>
        <p>
          Word2Vec — 현대 거대 언어 모델의 임베딩 레이어와 직접 연결:
        </p>
        <ul>
          <li><strong>GloVe (2014)</strong> — 전역 동시 출현 행렬 기반, Word2Vec의 단점 보완</li>
          <li><strong>FastText (2016)</strong> — 서브워드 n-gram으로 OOV(미등록어) 문제 해결</li>
          <li><strong>ELMo (2018)</strong> — 문맥 의존 임베딩 (같은 단어도 문맥마다 다른 벡터)</li>
          <li><strong>BERT (2018)</strong> — Transformer 기반 양방향 언어 모델, 모든 레이어가 임베딩</li>
          <li><strong>GPT 시리즈</strong> — 토큰 임베딩 레이어는 Word2Vec과 동일한 역할</li>
        </ul>
        <p>
          Word2Vec이 증명한 "분포 가설 → 선형 벡터 공간"이라는 통찰<br />
          오늘날 모든 NLP 시스템의 근간
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Static vs Contextual Embedding</h3>
        <p>
          "bank"라는 다의어를 통해 비교 — Static은 같은 벡터, Contextual은 맥락마다 다른 벡터<br />
          진화: Word2Vec(2013) → GloVe → FastText → ELMo(2018) → BERT/GPT → LLM embeddings(2024)
        </p>
      </div>
      <StaticVsContextualViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">임베딩의 실무 응용</h3>
      </div>
      <AppsDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Word2Vec → BERT → LLM embedding으로 <strong>contextual 진화</strong>.<br />
          요약 2: <strong>검색·분류·추천·RAG</strong> 등 광범위한 응용.<br />
          요약 3: 현대 NLP 파이프라인의 <strong>첫 단계는 여전히 임베딩</strong>.
        </p>
      </div>
    </section>
  );
}
