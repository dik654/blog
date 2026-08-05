import { useState } from 'react';
import Math from '@/components/ui/math';
import { ConceptPrimer, QuestionLead } from '@/components/learning/ArticleLearning';
import { Misconception } from '@/components/learning/ArticleLearning';

const tokens = ['나는', '따뜻한', '커피를', '아침마다', '천천히', '마신다'];
const centerIndex = 2;

function WindowExplorer() {
  const [windowSize, setWindowSize] = useState(2);
  const contextIndices = tokens.map((_, index) => index).filter((index) => index !== centerIndex && globalThis.Math.abs(index - centerIndex) <= windowSize);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5"><span className="text-sm font-bold">문장이 self-supervised 학습쌍으로 바뀌는 과정</span><span className="font-mono text-[10px] font-bold text-lime-700 dark:text-lime-300">TEXT → PAIRS</span></figcaption>
      <div className="border-b border-border bg-lime-500/[0.035] p-4 sm:p-5">
        <label htmlFor="context-window" className="block text-xs font-semibold text-muted-foreground">context window c · {windowSize}<input id="context-window" type="range" min="1" max="3" step="1" value={windowSize} onChange={(event) => setWindowSize(Number(event.target.value))} className="mt-3 block w-full accent-lime-600" /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap justify-center gap-2">
          {tokens.map((token, index) => {
            const isCenter = index === centerIndex;
            const isContext = contextIndices.includes(index);
            return <span key={`${token}-${index}`} className={`rounded-sm border px-3 py-2 text-sm font-semibold ${isCenter ? 'border-violet-600 bg-violet-600 text-white' : isContext ? 'border-lime-600/50 bg-lime-500/10 text-foreground' : 'border-border text-muted-foreground'}`}>{token}</span>;
          })}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="min-w-0 rounded-md border border-violet-500/25 bg-violet-500/[0.035] p-4"><p className="text-xs font-bold text-violet-700 dark:text-violet-300">Skip-gram · 중심 → 문맥 · {contextIndices.length}쌍</p><div className="mt-3 flex flex-wrap gap-2">{contextIndices.map((index) => <span key={index} className="rounded-sm border border-violet-500/20 bg-background px-2 py-1 text-xs font-medium">커피를 → {tokens[index]}</span>)}</div></div>
          <div className="min-w-0 rounded-md border border-lime-500/30 bg-lime-500/[0.04] p-4"><p className="text-xs font-bold text-lime-700 dark:text-lime-300">CBOW · 문맥 → 중심 · 1쌍</p><p className="mt-3 break-words text-xs font-medium leading-relaxed">[{contextIndices.map((index) => tokens[index]).join(', ')}] → 커피를</p></div>
        </div>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-5"><strong className="text-foreground">Window는 단순 전처리 옵션이 아니다.</strong> 어떤 관계를 positive pair로 정의할지 결정한다. 실제 구현은 최대 크기 <Math>{String.raw`c`}</Math> 안에서 유효 window를 다시 뽑아 가까운 단어가 더 자주 pair가 되게 만들기도 한다.</p>
    </figure>
  );
}

export default function ContextPairs() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">주변 단어를 예측하면 왜 의미 벡터가 생길까?</h2>
      <QuestionLead
        question="단어의 뜻을 label로 주지 않았는데 ‘커피’와 ‘차’가 가까워질 수 있을까?"
        answer="두 단어가 비슷한 주변 단어와 자주 함께 나타나면 같은 context를 잘 예측하려는 gradient를 반복해서 받는다. 그 결과 prediction에 유용한 방향으로 embedding이 가까워진다."
      />
      <ConceptPrimer
        items={[
          { term: '분포 가설', meaning: '비슷한 문맥 분포에서 등장하는 표현은 비슷한 기능이나 의미를 가질 가능성이 높다는 가정이다.', why: '사전 label 없이 context prediction을 의미 학습 신호로 사용하게 한다.' },
          { term: 'corpus', meaning: 'window와 단어 빈도를 셀 실제 텍스트 모음이다.', why: '어떤 관계와 편향이 embedding에 들어갈지 결정하는 관측 데이터다.' },
          { term: 'embedding', meaning: 'token ID를 작은 차원의 학습 가능한 dense vector로 바꾼 표현이다.', why: '단어 관계를 dot product와 거리로 계산할 수 있게 한다.' },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Word2Vec은 사전 정의를 맞히지 않는다. 문장을 훑으며 중심 단어와 주변 단어의 co-occurrence를 prediction example로
          바꾼다. 아래 window를 넓히면 가까운 문법 관계뿐 아니라 더 넓은 topic 관계도 pair에 들어온다. 따라서 window
          크기는 embedding이 담을 관계를 바꾸는 학습 설계다.
        </p>
      </div>
      <WindowExplorer />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>One-hot은 입력 주소이고 embedding은 학습 결과다</h3>
        <p>
          One-hot vector는 각 단어를 구분하는 index 표현이라 서로 다른 단어의 dot product가 모두 0이다. Embedding lookup은
          거대한 one-hot을 실제로 만들지 않고 행렬의 한 행을 고른다. 그 행의 값은 context prediction loss를 줄이는 과정에서
          함께 학습된다.
        </p>
      </div>
      <Misconception>
        “비슷한 context면 같은 의미”는 완전한 정의가 아니다. 반의어처럼 비슷한 문장 자리에 나타나는 단어도 가까워질 수 있고, corpus의 사회적 편향과 빈도 불균형도 그대로 vector에 반영된다.
      </Misconception>
    </section>
  );
}
