import TokenPipelineViz from './viz/TokenPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토크나이저 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>토크나이저(Tokenizer)</strong> — 텍스트를 모델이 처리할 수 있는 정수 시퀀스로 변환하는 전처리 단계<br />
          LLM의 입력은 문자열이 아니라 토큰 ID의 나열<br />
          토크나이저 선택이 모델의 어휘 크기, 다국어 성능, 효율성을 좌우
        </p>

        <h3>왜 문자 단위가 아닌가?</h3>
        <p>
          문자 단위(character-level) → 시퀀스 길이 폭발, 의미 단위 파악 불가<br />
          단어 단위(word-level) → 어휘 크기 폭발, 미등록 단어(OOV) 문제<br />
          <strong>서브워드(subword)</strong> — 자주 나오는 문자열을 하나의 토큰으로 합쳐 두 문제를 동시 해결
        </p>

        <h3>토크나이저 파이프라인</h3>
        <p>
          텍스트 → 정규화(normalization, 유니코드 통일) → 사전 토큰화(pre-tokenization, 공백/구두점 분리) → 서브워드 분할 → 토큰 ID 매핑
        </p>
      </div>
      <div className="not-prose mt-8">
        <TokenPipelineViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">토크나이저 파이프라인 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 4단계 표준 파이프라인
//
// [1] Normalization (정규화)
//     - Unicode NFC/NFD/NFKC/NFKD 통일
//     - Lowercase / Uppercase 변환 (선택적)
//     - 악센트 제거 (예: café → cafe)
//     - 중복 공백 제거
//
// [2] Pre-tokenization (사전 토큰화)
//     - 공백/구두점으로 문자열 분할
//     - "The cat sits." → ["The", "cat", "sits", "."]
//     - Whitespace / Metaspace / ByteLevel 등 방식
//
// [3] Model (서브워드 분할)
//     - BPE / WordPiece / Unigram / 기타
//     - 각 단어 조각을 어휘집 토큰으로 매핑
//     - "unhappiness" → ["un", "##happy", "##ness"]
//
// [4] Post-processing (후처리)
//     - 특수 토큰 추가: [CLS], [SEP], <|bos|>, <|eos|>
//     - 패딩 / 자르기 (max_length)
//     - attention_mask 생성
//
// Hugging Face tokenizers 라이브러리 구조:
//   Tokenizer(
//     normalizer=NFD() + StripAccents(),
//     pre_tokenizer=Whitespace(),
//     model=BPE(vocab, merges),
//     post_processor=TemplateProcessing(...)
//   )`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">토큰 ID 역사와 용어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 주요 토크나이저 용어 정리
//
// vocab / vocabulary
//   토큰 → ID 매핑 테이블. 크기가 곧 임베딩 행렬 크기.
//   예: BERT=30K, GPT-4=~100K, LLaMA=32K, Gemma=256K
//
// BOS / EOS (Beginning/End of Sequence)
//   시퀀스 시작/종료 표시. 생성 모델의 멈춤 신호.
//   예: GPT-2 = '<|endoftext|>' (50256)
//
// UNK (Unknown token)
//   어휘집에 없는 토큰. BPE/WordPiece는 UNK 방지 가능.
//   byte-level BPE는 UNK가 발생하지 않음.
//
// PAD (Padding)
//   배치 내 길이 맞추기용. attention_mask로 마스킹.
//
// Special tokens
//   [CLS]: 분류용 (BERT)
//   [SEP]: 문장 구분 (BERT)
//   <s>, </s>: 시퀀스 경계 (LLaMA, T5)
//   <|system|>, <|user|>, <|assistant|>: chat template
//
// Compression ratio
//   문자 수 / 토큰 수. 높을수록 효율적.
//   영어 GPT-4: 약 4.0 (4자/토큰)
//   한국어 GPT-4: 약 1.2 (1.2자/토큰 — 비효율)
//   한국어 LLaMA-ko: 약 3.5 (한국어 vocab 추가)`}
        </pre>
        <p className="leading-7">
          요약 1: 토크나이저는 <strong>normalize → pre-tokenize → model → post-process</strong> 4단계 파이프라인.<br />
          요약 2: <strong>어휘집 크기</strong>가 임베딩 행렬과 출력 softmax 비용을 결정 — 모델의 실질적 크기 요소.<br />
          요약 3: 한국어 효율은 토크나이저 선택에 좌우 — 같은 문장이라도 2~3배 토큰 수 차이.
        </p>
      </div>
    </section>
  );
}
