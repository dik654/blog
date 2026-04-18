import TokenPipelineViz from './viz/TokenPipelineViz';
import { PipelineDetailViz } from './viz/TokOverviewViz';
import { VocabDetailViz } from './viz/TokOverviewViz2';
import M from '@/components/ui/math';

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
      </div>
      <PipelineDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">토큰 ID 역사와 용어</h3>
        <M display>
          {`\\text{Compression Ratio} = \\underbrace{\\frac{\\text{문자 수}}{\\text{토큰 수}}}_{\\text{높을수록 효율적}}`}
        </M>
      </div>
      <VocabDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-2">
        <p className="leading-7">
          요약 1: 토크나이저는 <strong>normalize → pre-tokenize → model → post-process</strong> 4단계 파이프라인.<br />
          요약 2: <strong>어휘집 크기</strong>가 임베딩 행렬과 출력 softmax 비용을 결정 — 모델의 실질적 크기 요소.<br />
          요약 3: 한국어 효율은 토크나이저 선택에 좌우 — 같은 문장이라도 2~3배 토큰 수 차이.
        </p>
      </div>
    </section>
  );
}
