import CodePanel from '@/components/ui/code-panel';
import WordPieceViz from './viz/WordPieceViz';

const wpCode = `# WordPiece — BERT의 토크나이저
# BPE와 유사하나 병합 기준이 다름

# BPE: 단순 빈도 (가장 많이 등장하는 쌍)
score_bpe = count(pair)

# WordPiece: 우도(likelihood) 최대화
score_wp = count("ab") / (count("a") * count("b"))
# 개별 빈도 대비 함께 나타날 때 정보 이득이 큰 쌍을 우선 병합

# "##" 접두사로 단어 내부 조각 표시
"unhappiness" → ["un", "##happy", "##ness"]
# "##"은 이 토큰이 단어 시작이 아님을 의미`;

const wpAnnotations = [
  { lines: [4, 5] as [number, number], color: 'sky' as const, note: 'BPE — 단순 빈도 기준' },
  { lines: [7, 9] as [number, number], color: 'emerald' as const, note: 'WordPiece — 우도 기준' },
  { lines: [11, 13] as [number, number], color: 'amber' as const, note: '## 접두사 — 위치 정보' },
];

export default function WordPiece() {
  return (
    <section id="wordpiece" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WordPiece (BERT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>WordPiece</strong> — Google이 BERT에 사용한 토크나이저<br />
          BPE와 구조적으로 유사하나, 병합 기준을 <strong>우도(likelihood)</strong>로 변경<br />
          개별적으로 흔하지만 함께 나오면 드문 쌍보다, 함께 나올 때 정보가 큰 쌍을 우선
        </p>

        <h3>## 접두사 규칙</h3>
        <p>
          단어의 첫 번째 토큰에는 접두사 없음, 이후 조각에 "##" 부착<br />
          이 규칙으로 디코딩 시 원래 단어 경계를 복원 가능
        </p>
        <CodePanel title="WordPiece vs BPE" code={wpCode} annotations={wpAnnotations} />
      </div>
      <div className="not-prose mt-8">
        <WordPieceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">WordPiece의 우도 점수 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// WordPiece 병합 기준: Pointwise Mutual Information 유사
//
// BPE 방식:
//   score(a, b) = freq(ab)
//   → 단순 빈도. "the", "of", "and" 같은 흔한 쌍이 우선 병합.
//
// WordPiece 방식:
//   score(a, b) = freq(ab) / (freq(a) * freq(b))
//   → 개별 빈도 대비 동시 출현이 높은 쌍을 우선.
//   → "Hello" 쌍처럼 함께 나올 때 정보가 큰 것 선택.
//
// 수학적 의미 (PMI 관점):
//   log(P(a,b) / (P(a) * P(b)))
//   = 두 토큰이 독립이면 0
//   = 함께 자주 나오면 양수 (정보 이득 큼)
//
// 예시:
//   코퍼스에 "the"=10000, "of"=5000, "the of"=500 등장
//   "Hello"=100, "World"=100, "Hello World"=80 등장
//
//   BPE score("the", "of")    = 500
//   BPE score("Hello","World")= 80
//   → "the of" 우선 병합
//
//   WP  score("the", "of")    = 500 / (10000*5000) = 1e-5
//   WP  score("Hello","World")= 80 / (100*100) = 8e-3
//   → "Hello World" 우선 병합 (정보 밀도 높음)

// 결과:
//   WordPiece는 의미 단위에 가까운 토큰을 우선 형성
//   BERT 계열의 의미 이해에 유리`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">## 접두사와 디코딩</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ## 접두사 규칙 (word-piece 표시)
//
// 원본: "unhappiness transformer"
// 토큰화:
//   "un"           ← 단어 시작, 접두사 없음
//   "##happy"      ← 같은 단어 내부, ## 접두사
//   "##ness"       ← 같은 단어 내부
//   "transform"    ← 새 단어 시작
//   "##er"         ← 같은 단어 내부
//
// 디코딩 알고리즘:
//   for token in tokens:
//     if token.startswith("##"):
//       result += token[2:]     # ## 제거 후 직접 붙임
//     else:
//       result += " " + token   # 공백 추가 후 붙임
//
// BERT multilingual vocab 예시:
//   "스타벅스" → ["스타", "##벅", "##스"]
//   "스마트폰" → ["스마트", "##폰"]
//
// BPE의 </w>와 비교:
//   BPE: "low</w>" 형태로 단어 끝 표시
//   WP:  "##low" 형태로 단어 내부 표시
//   → 정보는 같으나 표현 방식 반대
//
// BERT 어휘 크기:
//   - bert-base-uncased: 30,522
//   - bert-base-multilingual: 119,547
//   - KoBERT: 8,002 (한국어 특화)
//
// DistilBERT, RoBERTa, ALBERT, ELECTRA는 WordPiece 혹은 BPE
// (RoBERTa는 byte-level BPE로 변경)`}
        </pre>
        <p className="leading-7">
          요약 1: WordPiece는 <strong>우도(likelihood) 비율</strong>로 병합 — 의미 단위에 가까운 토큰 우선.<br />
          요약 2: <strong>## 접두사</strong>로 단어 경계를 복원 — 디코딩 시 공백 위치 자동 결정.<br />
          요약 3: BERT 계열의 핵심 선택 — 의미 이해 태스크(분류, NER)에 적합.
        </p>
      </div>
    </section>
  );
}
