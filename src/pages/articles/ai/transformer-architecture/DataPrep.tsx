import DataPrepViz from './viz/DataPrepViz';
import DataPrepDetailViz from './viz/DataPrepDetailViz';
import M from '@/components/ui/math';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Vocabulary 구축 과정</h3>
        <M display>
          {`\\underbrace{\\text{텍스트} \\;\\to\\; \\text{토큰} \\;\\to\\; \\text{ID}}_{\\text{word2idx 매핑}} \\;\\to\\; \\underbrace{\\text{One-hot} \\times E}_{\\text{임베딩 (vocab} \\times d_{\\text{model}}\\text{)}}`}
        </M>
      </div>
      <DataPrepDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: 텍스트 → 토큰 → ID → 임베딩 — <strong>4단계 변환 파이프라인</strong>.<br />
          요약 2: <strong>특수 토큰</strong>(PAD, UNK, SOS, EOS)은 시퀀스 경계 표시 필수.<br />
          요약 3: <strong>Vocabulary 크기</strong>가 임베딩 테이블 크기 결정 — 모델 파라미터의 큰 비중.
        </p>
      </div>
    </section>
  );
}
