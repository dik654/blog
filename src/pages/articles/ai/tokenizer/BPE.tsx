import CodePanel from '@/components/ui/code-panel';
import BPEMergeViz from './viz/BPEMergeViz';

const bpeCode = `# BPE (Byte Pair Encoding) — GPT 계열의 토크나이저
# 1. 초기: 모든 문자를 개별 토큰으로 시작
vocab = {a, b, c, ..., z, ...}        # byte 단위 256개

# 2. 가장 빈번한 인접 쌍을 반복 병합
while len(vocab) < target_size:
    pair = most_frequent_pair(corpus)  # e.g. ('t','h') → 'th'
    vocab.add(merge(pair))             # 'th' 토큰 추가
    corpus = apply_merge(corpus, pair) # 코퍼스 전체에 병합 적용

# 3. GPT-2: byte-level BPE (UTF-8 바이트 기반)
# 어떤 문자열이든 바이트로 분해 가능 → OOV 없음
# GPT-4: tiktoken — cl100k_base (100K 어휘)`;

const bpeAnnotations = [
  { lines: [1, 3] as [number, number], color: 'sky' as const, note: '초기 어휘: byte 단위' },
  { lines: [5, 9] as [number, number], color: 'emerald' as const, note: '빈도 기반 반복 병합' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: 'GPT: byte-level BPE' },
];

export default function BPE() {
  return (
    <section id="bpe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BPE (Byte Pair Encoding)</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        GPT 계열의 토크나이저 — 가장 빈번한 문자 쌍을 반복 병합하여 어휘 구축.<br />
        Byte-level BPE → 어떤 문자열이든 OOV 없음.
      </p>
      <BPEMergeViz />
      <div className="mt-6">
        <CodePanel title="BPE 알고리즘" code={bpeCode} annotations={bpeAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">BPE 학습 알고리즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BPE (Byte Pair Encoding) 학습 과정
//
// 입력: 코퍼스(corpus), 목표 어휘 크기(target_vocab_size)
// 출력: 병합 규칙(merges), 어휘(vocab)
//
// Step 1: 초기화
//   - 코퍼스를 단어 단위로 분할
//   - 각 단어를 문자(또는 byte) 시퀀스로 분해
//   - 예: "low" → ["l", "o", "w", "</w>"]
//   - </w>는 단어 종료 표시
//
// Step 2: 빈도 카운트
//   word_freq = {"low</w>": 5, "lower</w>": 2, ...}
//
// Step 3: 인접 쌍 빈도 계산
//   pair_freq = {
//     ("l","o"): 7, ("o","w"): 7, ("w","</w>"): 5,
//     ("w","e"): 2, ("e","r"): 2, ...
//   }
//
// Step 4: 가장 빈번한 쌍 병합
//   best_pair = argmax(pair_freq) = ("l","o")
//   merges.append(("l","o"))  # 규칙 추가
//   vocab.add("lo")
//
// Step 5: 코퍼스 업데이트
//   word: ["l","o","w","</w>"] → ["lo","w","</w>"]
//
// Step 6: 2~5 반복 until len(vocab) == target
//
// 시간 복잡도:
//   - Naive: O(|corpus| × vocab_size)
//   - Optimized (Hugging Face): O(|unique pairs| log ...)
//   - Tiktoken: Rust 구현으로 매우 빠름

// 추론 시 (인코딩):
//   1. 단어를 문자로 분해
//   2. merges 순서대로 적용
//   3. 더 이상 병합할 쌍이 없을 때까지
//   4. 결과를 vocab ID로 변환`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Byte-level BPE의 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GPT-2 (2019) Byte-level BPE의 핵심 아이디어
//
// 문제:
//   - 문자 기반 BPE는 유니코드 처리 복잡
//   - 이모지, 특수 문자, 신규 언어에서 OOV 발생
//
// 해결:
//   모든 텍스트를 UTF-8 바이트로 변환 후 BPE 적용
//   초기 어휘 = 256개 바이트 + 병합 규칙
//
// 예시:
//   "안녕" → UTF-8 bytes: [236, 149, 136, 235, 133, 149]
//          → 6개 바이트 토큰으로 시작
//          → BPE 병합으로 ["안녕"] 등 subword 학습
//
// 장점:
//   1. OOV 완전 해결 (모든 바이트 표현 가능)
//   2. 언어 독립적
//   3. 이모지, 특수 문자 자연스럽게 처리
//
// 단점:
//   - 비영어(한국어, 중국어)는 바이트 단위 분할로 비효율
//   - 한글 1글자 = 3바이트 → 기본 토큰 수 증가

// GPT-2: ~50K vocab
// GPT-3: ~50K vocab (동일)
// GPT-4 (cl100k_base): ~100K vocab
// GPT-4o (o200k_base): ~200K vocab (다국어 강화)
//
// Tiktoken 사용 예:
//   import tiktoken
//   enc = tiktoken.get_encoding("cl100k_base")
//   tokens = enc.encode("Hello, world!")
//   # [9906, 11, 1917, 0]`}
        </pre>
        <p className="leading-7">
          요약 1: BPE는 <strong>빈도 기반 반복 병합</strong> — 자주 나오는 쌍부터 하나의 토큰으로 합침.<br />
          요약 2: <strong>Byte-level BPE</strong>는 UTF-8 바이트 기반이라 OOV가 원천 차단됨.<br />
          요약 3: GPT-4o의 200K 어휘는 다국어 효율 개선의 결과 — 한국어 토큰 수 ~40% 감소.
        </p>
      </div>
    </section>
  );
}
