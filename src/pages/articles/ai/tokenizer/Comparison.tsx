import CodePanel from '@/components/ui/code-panel';
import TokenizerCompareViz from './viz/TokenizerCompareViz';

const compCode = `# 토크나이저별 한국어 처리 비교
text = "인공지능이 세상을 바꾸고 있다"

# GPT-4 (tiktoken, cl100k_base BPE)
→ ["인공", "지능", "이", " 세상", "을", " 바꾸", "고", " 있다"]
# 8 토큰, 한글 2~3 바이트 단위로 쪼개짐

# BERT (WordPiece, multilingual 30K)
→ ["인공", "##지", "##능이", "세상", "##을", "바꾸", "##고", "있다"]
# 8 토큰, ## 접두사로 단어 내부 표시

# LLaMA (SentencePiece Unigram, 32K)
→ ["▁인공지능이", "▁세상을", "▁바꾸고", "▁있다"]
# 4 토큰! 한국어 어절 단위에 가장 효율적`;

const compAnnotations = [
  { lines: [4, 6] as [number, number], color: 'sky' as const, note: 'GPT-4 BPE — 바이트 기반' },
  { lines: [8, 10] as [number, number], color: 'emerald' as const, note: 'BERT WordPiece — ## 접두사' },
  { lines: [12, 14] as [number, number], color: 'amber' as const, note: 'LLaMA Unigram — 어절 효율적' },
];

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토크나이저 비교 & 한국어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          토크나이저 선택은 모델 성능에 직접적 영향<br />
          특히 <strong>한국어</strong>처럼 교착어(agglutinative, 어근에 접사가 붙는 언어)는 토크나이저에 따라 효율 차이가 극심
        </p>

        <h3>핵심 차이</h3>
        <ul>
          <li><strong>BPE</strong> — 빈도 기반 병합, 바이트 레벨로 OOV 없음</li>
          <li><strong>WordPiece</strong> — 우도 기반 병합, ## 접두사로 위치 정보</li>
          <li><strong>Unigram</strong> — 확률 기반 가지치기, 다국어에 유리</li>
        </ul>
        <CodePanel title="한국어 토큰화 비교" code={compCode} annotations={compAnnotations} />
      </div>
      <div className="not-prose mt-8">
        <TokenizerCompareViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">알고리즘 비교표</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 토크나이저 알고리즘 특성 요약
//
// ┌─────────────┬──────────┬──────────┬──────────┐
// │  측면       │   BPE    │ WordPiece│ Unigram  │
// ├─────────────┼──────────┼──────────┼──────────┤
// │ 학습 방향   │ bottom-up│ bottom-up│ top-down │
// │ 병합 기준   │ 빈도     │ 우도     │ 확률     │
// │ 분할 방식   │ greedy   │ greedy   │ Viterbi  │
// │ 다중 분할   │ 불가     │ 불가     │ 가능     │
// │ OOV 처리    │ byte로   │ [UNK]    │ 낮은확률 │
// │ 채택 모델   │ GPT/RoBERTa│BERT   │ T5/LLaMA │
// └─────────────┴──────────┴──────────┴──────────┘
//
// 병합 방향 비교:
//   BPE/WP: 문자 → 조합 → 단어 (쌓아올림)
//   Unigram: 큰 집합 → 제거 → 최적 집합 (깎아냄)
//
// 분할 알고리즘 비교:
//   BPE/WP: longest-match greedy
//     "unhappy" → try "unhappy", "unhap", ..., "un", "happy"
//   Unigram: Viterbi dynamic programming
//     모든 가능 분할의 확률 계산 → 최대 확률 선택`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">한국어 토큰 효율 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 한국어 문장의 토크나이저별 토큰 수 비교
//
// 문장: "인공지능 모델이 한국어를 자연스럽게 처리합니다."
// 문자 수: 25자 (공백 제외 22자)
//
// GPT-4 (cl100k_base, 100K vocab):
//   [1) 23 tokens
//   [' 인', '공', '지', '능', ' 모', '델', '이', ' 한국', '어', '를',
//    ' 자', '연', '스', '럽', '게', ' 처', '리', '합', '니', '다', '.']
//
// GPT-4o (o200k_base, 200K vocab):
//   약 15 tokens (다국어 개선됨)
//   [' 인공지능', ' 모델이', ' 한국어', '를', ' 자연', '스럽게', ' 처리', '합니다', '.']
//
// BERT (bert-base-multilingual, 119K):
//   약 18 tokens
//   ['인공', '##지', '##능', '모', '##델', '##이', '한국', '##어', '##를', ...]
//
// LLaMA-2 (SentencePiece BPE, 32K):
//   약 21 tokens (한국어 vocab 부족)
//
// LLaMA-3 (Tiktoken, 128K):
//   약 14 tokens (한국어 개선)
//
// Gemma-2 (256K vocab):
//   약 12 tokens (한국어 매우 효율적)
//
// 한국어 특화 모델:
//   KoGPT (tokenizers_ko): 약 10 tokens
//   KoBERT (8K): 약 14 tokens
//   HyperCLOVA: 약 9 tokens (한국어 최적화)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">실무 선택 가이드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 토크나이저 선택 기준
//
// [프로젝트 처음부터 학습]
//   - 다국어 목표 → SentencePiece (Unigram)
//   - 영어 중심 → BPE (byte-level)
//   - 도메인 특화(의학/법률) → 해당 코퍼스로 Unigram 학습
//
// [사전학습 모델 fine-tuning]
//   - 원본 토크나이저 그대로 사용 (변경 금지)
//   - 어휘 추가 가능 (new tokens): 특정 도메인 용어
//   - 토크나이저 바꾸면 임베딩 재학습 필요
//
// [한국어 fine-tuning]
//   - LLaMA 기반: Ko-LLaMA 계열 (vocab 확장)
//   - 영어 모델에 한국어 추가: add_tokens + resize_token_embeddings
//
// [평가 지표]
//   - compression ratio: chars / tokens (높을수록 좋음)
//   - fertility: subwords per word (낮을수록 좋음)
//   - unknown ratio: [UNK] 비율 (0에 가까울수록 좋음)
//
// [비용 계산]
//   - OpenAI API: token 단위 과금
//   - 한국어는 영어 대비 2~3배 비용
//   - GPT-4o로 한국어 비용 크게 절감됨`}
        </pre>
        <p className="leading-7">
          요약 1: 세 알고리즘은 <strong>방향·기준·분할 방식</strong>이 달라 용도가 구분됨.<br />
          요약 2: 한국어 효율은 <strong>어휘 크기·다국어 지원·도메인 적합도</strong>에 비례.<br />
          요약 3: API 과금은 토큰 단위 — 한국어 프로젝트는 GPT-4o나 Gemma 기반이 비용 유리.
        </p>
      </div>
    </section>
  );
}
