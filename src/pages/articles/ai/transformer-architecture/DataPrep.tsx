import DataPrepViz from './viz/DataPrepViz';

export default function DataPrep() {
  return (
    <section id="data-prep" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터 준비</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Transformer에 텍스트를 넣으려면 숫자로 변환해야 한다<br />
          <strong>단어장(Vocabulary)</strong> — 모델이 아는 모든 단어의 목록<br />
          11개 단어장 예시로 전체 과정을 추적한다
        </p>
      </div>

      <DataPrepViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>변환 과정</h3>
        <p>
          문장 → 토큰 분리 → 인덱스 변환 → 원-핫 벡터 → 임베딩 벡터<br />
          원-핫 벡터는 차원이 vocab_size(11)로 크고 희소하다<br />
          임베딩 행렬(11×6)을 곱해 <strong>d_model=6</strong>의 밀집 벡터로 압축한다
        </p>
      </div>
    </section>
  );
}
