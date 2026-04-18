import TokenizerCompareViz from './viz/TokenizerCompareViz';
import { AlgorithmCompareViz, KoreanEfficiencyViz, SelectionGuideViz } from './viz/TokComparisonViz';
import M from '@/components/ui/math';

const tokenExamples = [
  {
    name: 'GPT-4',
    algo: 'BPE (cl100k_base)',
    color: '#0ea5e9',
    bg: '#f0f9ff',
    tokens: ['인공', '지능', '이', ' 세상', '을', ' 바꾸', '고', ' 있다'],
    count: 8,
    note: '바이트 기반 — 한글 2~3 바이트 단위로 쪼개짐',
  },
  {
    name: 'BERT',
    algo: 'WordPiece (multilingual 30K)',
    color: '#10b981',
    bg: '#ecfdf5',
    tokens: ['인공', '##지', '##능이', '세상', '##을', '바꾸', '##고', '있다'],
    count: 8,
    note: '## 접두사로 단어 내부(subword) 위치 표시',
  },
  {
    name: 'LLaMA',
    algo: 'SentencePiece Unigram (32K)',
    color: '#f59e0b',
    bg: '#fffbeb',
    tokens: ['▁인공지능이', '▁세상을', '▁바꾸고', '▁있다'],
    count: 4,
    note: '어절 단위 — 한국어에 가장 효율적',
  },
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
        <div className="not-prose mt-4 mb-2">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                한국어 토큰화 비교 — <span className="font-mono text-xs font-normal opacity-80">"인공지능이 세상을 바꾸고 있다"</span>
              </p>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {tokenExamples.map((ex) => (
                <div key={ex.name} className="px-4 py-3">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 translate-y-[-1px]"
                      style={{ backgroundColor: ex.color }}
                    />
                    <span className="font-semibold text-sm" style={{ color: ex.color }}>
                      {ex.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {ex.algo}
                    </span>
                    <span className="ml-auto text-xs font-mono font-semibold" style={{ color: ex.color }}>
                      {ex.count} 토큰
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-1.5">
                    {ex.tokens.map((tok, i) => (
                      <span
                        key={i}
                        className="inline-block px-2 py-0.5 rounded text-xs font-mono border"
                        style={{
                          borderColor: ex.color + '40',
                          backgroundColor: ex.bg,
                          color: ex.color,
                        }}
                      >
                        {tok}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {ex.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="not-prose mt-8">
        <TokenizerCompareViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">알고리즘 비교표</h3>
        <M display>
          {`\\underbrace{\\text{BPE: } \\arg\\max \\text{freq}(a,b)}_{\\text{빈도}} \\quad \\underbrace{\\text{WP: } \\frac{\\text{freq}(ab)}{\\text{freq}(a) \\cdot \\text{freq}(b)}}_{\\text{우도}} \\quad \\underbrace{\\text{Uni: } \\arg\\max \\prod P(x_i)}_{\\text{확률}}`}
        </M>
      </div>
      <AlgorithmCompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">한국어 토큰 효율 분석</h3>
      </div>
      <KoreanEfficiencyViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 선택 가이드</h3>
      </div>
      <SelectionGuideViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-2">
        <p className="leading-7">
          요약 1: 세 알고리즘은 <strong>방향·기준·분할 방식</strong>이 달라 용도가 구분됨.<br />
          요약 2: 한국어 효율은 <strong>어휘 크기·다국어 지원·도메인 적합도</strong>에 비례.<br />
          요약 3: API 과금은 토큰 단위 — 한국어 프로젝트는 GPT-4o나 Gemma 기반이 비용 유리.
        </p>
      </div>
    </section>
  );
}
