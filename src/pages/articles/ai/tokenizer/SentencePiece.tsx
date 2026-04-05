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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Unigram 학습 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Unigram Language Model tokenizer 학습
// (Kudo 2018, "Subword Regularization")
//
// 입력: 코퍼스, 목표 어휘 크기
// 출력: 서브워드 집합 V, 각 토큰 확률 P(v)
//
// Step 1: 초기 어휘 집합 생성 (크게)
//   - 모든 가능한 서브워드 후보 추출
//   - 보통 목표 크기의 수십 배 (100만+)
//   - 예: "internationalization" → "i", "in", "int", ..., "ization"
//
// Step 2: EM 알고리즘 (확률 추정)
//   E-step:
//     각 단어 x의 best segmentation 찾기
//     P(segmentation) = ∏ P(x_i)
//     Viterbi로 가장 확률 높은 분할 선택
//
//   M-step:
//     P(v) = count(v) / total_subword_count
//     각 토큰의 확률 재추정
//
// Step 3: 가지치기 (Pruning)
//   for each token v in V:
//     loss_without_v = re-compute corpus likelihood
//     loss_increase = loss_without_v - current_loss
//
//   - loss_increase가 작은 토큰 (덜 중요) 제거
//   - 상위 (1-η) 비율만 유지 (예: 80%)
//
// Step 4: 크기에 도달할 때까지 2~3 반복

// 추론 시:
//   Viterbi로 확률 최대 분할 찾기 (deterministic)
//   또는 샘플링 (stochastic — Subword Regularization)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">SentencePiece 특징</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SentencePiece의 혁신적 설계
//
// 1. Raw text 직접 처리
//    - 공백도 일반 문자로 취급
//    - 공백 → "▁" (U+2581) 특수 문자로 변환
//    - 언어별 전처리(형태소 분석 등) 불필요
//    - 다국어 모델에 완벽히 적합
//
// 2. Reversible (역변환 가능)
//    tokens = sp.encode("Hello world")
//    text = sp.decode(tokens)
//    # text == "Hello world" (정확히 복원)
//
// 3. 두 알고리즘 지원
//    --model_type=bpe       # BPE 모드
//    --model_type=unigram   # Unigram 모드 (기본)
//    --model_type=char      # 문자 단위
//    --model_type=word      # 단어 단위
//
// 4. 서브워드 정규화 (훈련 시)
//    - 샘플링된 분할로 데이터 증강
//    - "Hello" → ["He","llo"] or ["H","ell","o"] 랜덤
//    - 모델 robust하게 학습

// 사용 예:
//   import sentencepiece as spm
//   spm.SentencePieceTrainer.train(
//     input='corpus.txt',
//     model_prefix='mymodel',
//     vocab_size=32000,
//     model_type='unigram',
//     character_coverage=0.9995  # 다국어는 1.0 근처
//   )

// 채택 모델:
//   - T5, mT5 (Unigram, 32K/250K)
//   - ALBERT, XLNet (Unigram, 30K/32K)
//   - LLaMA, LLaMA-2 (BPE 모드, 32K)
//   - LLaMA-3 (Tiktoken으로 전환, 128K)
//   - Gemma (SentencePiece, 256K)
//   - Mistral, Mixtral (BPE 모드, 32K)`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Unigram</strong>은 EM 기반 확률 모델 — 큰 어휘에서 손실 적은 토큰부터 제거.<br />
          요약 2: <strong>SentencePiece</strong>는 공백을 ▁로 바꿔 언어 독립적 처리 — 다국어 표준.<br />
          요약 3: LLaMA-3는 SentencePiece → Tiktoken 전환, 업계 표준이 Tiktoken 방향으로 수렴 중.
        </p>
      </div>
    </section>
  );
}
