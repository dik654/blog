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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Vocabulary 구축 과정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Vocabulary 생성 단계
//
// Step 1: 텍스트 수집
//   corpus = ["나는 학생이다", "나는 책을 읽는다", ...]
//
// Step 2: 토큰화 (tokenization)
//   tokens = ["나는", "학생이다", "나는", "책을", "읽는다", ...]
//   또는 서브워드 (BPE, WordPiece, SentencePiece)
//
// Step 3: 빈도 계산
//   freq = {"나는": 150, "이다": 100, ..., "저자": 3, ...}
//
// Step 4: 어휘 구축 (상위 N개)
//   vocab = ["<PAD>", "<UNK>", "<SOS>", "<EOS>",
//            "나는", "학생", "책을", ...]
//
// Step 5: 토큰 ↔ ID 매핑
//   word2idx = {"나는": 4, "학생": 5, ...}
//   idx2word = {4: "나는", 5: "학생", ...}

// 특수 토큰:
//   <PAD> (0): 패딩용
//   <UNK> (1): 미등록 단어
//   <SOS> (2): 시퀀스 시작
//   <EOS> (3): 시퀀스 종료
//
// 예시 문장 인코딩:
//   "나는 학생이다"
//   → tokens: ["나는", "학생이다"]
//   → ids: [4, 5]
//   → with special: [2, 4, 5, 3]  # SOS, 나는, 학생이다, EOS

// 실무 vocabulary 크기:
//   BERT-base: 30,522 (WordPiece)
//   GPT-2: 50,257 (BPE)
//   LLaMA: 32,000 (SentencePiece BPE)
//   GPT-4: 100,277 (tiktoken)
//   Gemma: 256,000`}
        </pre>
        <p className="leading-7">
          요약 1: 텍스트 → 토큰 → ID → 임베딩 — <strong>4단계 변환 파이프라인</strong>.<br />
          요약 2: <strong>특수 토큰</strong>(PAD, UNK, SOS, EOS)은 시퀀스 경계 표시 필수.<br />
          요약 3: <strong>Vocabulary 크기</strong>가 임베딩 테이블 크기 결정 — 모델 파라미터의 큰 비중.
        </p>
      </div>
    </section>
  );
}
