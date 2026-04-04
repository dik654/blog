import CodePanel from '@/components/ui/code-panel';
import UnigramViz from './viz/UnigramViz';

const spCode = `# SentencePiece — 언어 독립적 토크나이저 (Google, 2018)
# 공백을 특수 문자 ▁ (U+2581)로 치환 → 사전 토큰화 불필요

# Unigram 모델: 확률적 서브워드 선택
P(x) = Πᵢ P(xᵢ)                     # 각 토큰 독립 확률의 곱
# 큰 어휘에서 시작 → 손실 증가 최소인 토큰 제거 반복

# 예시 (다국어)
"안녕하세요" → ["▁안녕", "하세요"]     # 한국어
"Hello" → ["▁He", "llo"]             # 영어
"こんにちは" → ["▁", "こんにちは"]      # 일본어

# LLaMA, T5, mBART 등이 SentencePiece 채택
# BPE 모드와 Unigram 모드 모두 지원`;

const spAnnotations = [
  { lines: [1, 2] as [number, number], color: 'sky' as const, note: '공백을 ▁로 치환' },
  { lines: [4, 6] as [number, number], color: 'emerald' as const, note: 'Unigram — 확률 기반 분할' },
  { lines: [8, 11] as [number, number], color: 'amber' as const, note: '다국어 처리 예시' },
];

export default function SentencePiece() {
  return (
    <section id="sentencepiece" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SentencePiece & Unigram</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>SentencePiece</strong> — 2018년 Google이 공개한 언어 독립적 토크나이저 라이브러리<br />
          공백을 "▁"로 치환하여 사전 토큰화(pre-tokenization) 단계를 제거<br />
          영어뿐 아니라 한국어, 일본어, 아랍어 등 어떤 언어든 동일하게 처리
        </p>

        <h3>Unigram 모델</h3>
        <p>
          BPE와 반대 방향: <strong>큰 어휘에서 시작하여 불필요한 토큰을 제거</strong><br />
          EM(Expectation-Maximization) 알고리즘으로 각 토큰의 확률을 추정<br />
          제거 시 전체 손실 증가가 가장 적은 토큰부터 삭제
        </p>
        <CodePanel title="SentencePiece & Unigram" code={spCode} annotations={spAnnotations} />
      </div>
      <div className="not-prose mt-8">
        <UnigramViz />
      </div>
    </section>
  );
}
