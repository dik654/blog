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
    </section>
  );
}
