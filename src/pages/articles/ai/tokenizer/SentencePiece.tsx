import UnigramViz from './viz/UnigramViz';
import { UnigramTrainViz, SPFeatureViz } from './viz/SentencePieceDetailViz';
import M from '@/components/ui/math';

export default function SentencePiece() {
  return (
    <section id="sentencepiece" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SentencePiece & Unigram</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SentencePiece</strong> — 2018년 Google이 공개한 언어 독립적 토크나이저 라이브러리.<br />
          핵심 아이디어: 공백을 특수 문자 "▁"(U+2581)로 치환하여 사전 토큰화(pre-tokenization)를 제거.<br />
          영어뿐 아니라 한국어, 일본어, 아랍어 등 어떤 언어든 동일한 파이프라인으로 처리.
        </p>

        <h3>Unigram 모델</h3>
        <p>
          BPE와 반대 방향: <strong>큰 어휘(100만+)에서 시작하여 불필요한 토큰을 제거</strong>.<br />
          EM(Expectation-Maximization) 알고리즘으로 각 토큰의 확률을 추정하고,<br />
          제거 시 전체 손실 증가가 가장 적은 토큰부터 삭제하여 목표 크기(32K~256K)까지 축소.
        </p>
        <M display>
          {`P(\\mathbf{x}) = \\underbrace{\\prod_{i=1}^{n} P(x_i)}_{\\text{각 서브워드 확률의 곱}}`}
        </M>

        <h3>다국어 토큰화 예시</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">언어</th>
                <th className="border border-border px-3 py-2 text-left">입력</th>
                <th className="border border-border px-3 py-2 text-left">SentencePiece 결과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">한국어</td>
                <td className="border border-border px-3 py-2">"안녕하세요"</td>
                <td className="border border-border px-3 py-2 font-mono">["▁안녕", "하세요"]</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">영어</td>
                <td className="border border-border px-3 py-2">"Hello"</td>
                <td className="border border-border px-3 py-2 font-mono">["▁He", "llo"]</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">일본어</td>
                <td className="border border-border px-3 py-2">"こんにちは"</td>
                <td className="border border-border px-3 py-2 font-mono">["▁", "こんにちは"]</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          ▁는 단어 시작을 표시. 공백 기반 사전 토큰화 없이 원시 텍스트를 직접 처리.<br />
          LLaMA, T5, mBART 등이 SentencePiece 채택. BPE 모드와 Unigram 모드 모두 지원.
        </p>
      </div>
      <div className="not-prose mt-8">
        <UnigramViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Unigram 학습 알고리즘</h3>
        <M display>
          {`P(\\mathbf{x}) = \\underbrace{\\prod_{i=1}^{n} P(x_i)}_{\\text{각 토큰 독립 확률의 곱}}, \\quad \\hat{\\mathbf{x}} = \\arg\\max_{\\mathbf{x} \\in S(w)} P(\\mathbf{x})`}
        </M>
      </div>
      <UnigramTrainViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SentencePiece 특징</h3>
      </div>
      <SPFeatureViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-2">
        <p className="leading-7">
          요약 1: <strong>Unigram</strong>은 EM 기반 확률 모델 — 큰 어휘에서 손실 적은 토큰부터 제거.<br />
          요약 2: <strong>SentencePiece</strong>는 공백을 ▁로 바꿔 언어 독립적 처리 — 다국어 표준.<br />
          요약 3: LLaMA-3는 SentencePiece → Tiktoken 전환, 업계 표준이 Tiktoken 방향으로 수렴 중.
        </p>
      </div>
    </section>
  );
}
