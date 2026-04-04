import CodePanel from '@/components/ui/code-panel';
import AnalogyViz from './viz/AnalogyViz';
import {
  cosineSimilarityCode, cosineAnnotations,
  analogyCode, analogyAnnotations,
  doc2vecCode, doc2vecAnnotations,
} from './ApplicationsData';

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
        <CodePanel title="코사인 유사도 계산" code={cosineSimilarityCode} annotations={cosineAnnotations} />

        <h3>아날로지 추론 (벡터 산술)</h3>
        <CodePanel title="벡터 산술 — 아날로지 추론" code={analogyCode} annotations={analogyAnnotations} />

        <h3>Doc2Vec — 문서 임베딩으로 확장</h3>
        <p>
          Word2Vec을 확장 — 단어 시퀀스(문장, 단락, 문서) 전체를 하나의 벡터로 표현<br />
          각 문서에 고유한 <code>paragraph vector</code>를 추가하여 단어 예측 시 함께 학습
        </p>
        <CodePanel title="Doc2Vec (PV-DM)" code={doc2vecCode} annotations={doc2vecAnnotations} />

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
    </section>
  );
}
