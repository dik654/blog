import WordPieceViz from './viz/WordPieceViz';
import { WordPieceScoreViz, WordPieceHashViz } from './viz/WordPieceDetailViz';
import M from '@/components/ui/math';

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
        <h3 className="text-lg font-semibold mt-6 mb-3">BPE vs WordPiece — 점수 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-5">
            <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mb-3">BPE — 단순 빈도 기준</p>
            <M display>{`\\text{score}_{\\text{BPE}} = \\text{count}(\\text{pair})`}</M>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
              가장 많이 등장하는 인접 쌍부터 병합.<br />
              빈도가 높으면 무조건 우선 — 개별 토큰의 빈도는 고려하지 않음.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-5">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">WordPiece — 우도(likelihood) 기준</p>
            <M display>{`\\text{score}_{\\text{WP}} = \\frac{\\text{count}(\\text{"ab"})}{\\text{count}(\\text{"a"}) \\times \\text{count}(\\text{"b"})}`}</M>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3">
              개별 빈도 대비 함께 나타날 때의 정보 이득이 큰 쌍을 우선 병합.<br />
              흔한 글자끼리의 우연한 조합보다, 의미 단위 결합이 높은 점수를 받음.
            </p>
          </div>
        </div>

        <div className="not-prose rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-5 mb-2">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-300 mb-3">## 접두사 — 토큰화 예시</p>
          <div className="flex items-center gap-2 flex-wrap text-sm mb-3">
            <span className="font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700">"unhappiness"</span>
            <span className="text-neutral-400">→</span>
            <span className="font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200">un</span>
            <span className="font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200">##happy</span>
            <span className="font-mono bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200">##ness</span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            첫 번째 토큰(<code className="text-amber-700 dark:text-amber-300">un</code>)에는 접두사 없음 — 단어의 시작.<br />
            이후 조각에 <code className="text-amber-700 dark:text-amber-300">##</code> 부착 — "이 토큰은 단어 시작이 아님"을 표시.<br />
            디코딩 시 <code className="text-amber-700 dark:text-amber-300">##</code>을 제거하고 이전 토큰에 붙이면 원래 단어 복원.
          </p>
        </div>
      </div>
      <div className="not-prose mt-8">
        <WordPieceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">WordPiece의 우도 점수 원리</h3>
        <M display>
          {`\\underbrace{\\text{score}(a, b) = \\frac{\\text{freq}(ab)}{\\text{freq}(a) \\times \\text{freq}(b)}}_{\\text{PMI (Pointwise Mutual Information) 구조}}`}
        </M>
      </div>
      <WordPieceScoreViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">## 접두사와 디코딩</h3>
      </div>
      <WordPieceHashViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-2">
        <p className="leading-7">
          요약 1: WordPiece는 <strong>우도(likelihood) 비율</strong>로 병합 — 의미 단위에 가까운 토큰 우선.<br />
          요약 2: <strong>## 접두사</strong>로 단어 경계를 복원 — 디코딩 시 공백 위치 자동 결정.<br />
          요약 3: BERT 계열의 핵심 선택 — 의미 이해 태스크(분류, NER)에 적합.
        </p>
      </div>
    </section>
  );
}
