import { Link } from "react-router-dom";

const PATH = [
  ["문자열", "Tokenizer가 symbol을 고정"],
  ["관측", "어떤 context를 셀지 결정"],
  ["벡터", "가중하고 압축"],
  ["평가", "가까움의 범위를 검사"],
] as const;

export default function DistributionalSeriesLocator() {
  return (
    <aside className="not-prose mb-8 border-y border-border py-5" aria-label="언어 표현 학습 지도에서 현재 글의 위치">
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground" aria-label="언어 표현 글 위치">
        <Link to="/cs/ai/tokenizer" className="hover:text-primary">Tokenizer</Link><span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">분포 의미론</strong><span aria-hidden>›</span>
        <Link to="/cs/ai/word2vec" className="hover:text-primary">Word2Vec</Link><span aria-hidden>›</span>
        <Link to="/cs/ai/bert" className="hover:text-primary">Contextual representation</Link>
      </nav>
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-start">
        <div>
          <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
          <p className="mt-3 break-keep text-base font-bold leading-7">같은 corpus가 어떤 선택을 거쳐 단어 벡터가 되며, 그 벡터의 가까움은 어디까지 말할 수 있을까요?</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">한 3×3 행렬을 count→PPMI→SVD→cosine까지 추적하고, 계산에서 버린 정보도 함께 확인합니다.</p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모</p>
          <Link to="/cs/ai/tokenizer#overview" className="mt-1 block text-sm font-bold leading-6 hover:text-primary">문자열을 vocabulary symbol로 고정하는 과정 ↗</Link>
          <Link to="/cs/ai/math-vectors-inner-products" className="mt-2 block text-xs leading-5 text-muted-foreground hover:text-primary">벡터·내적 선수 지식 ↗</Link>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-px bg-border p-px" aria-label="현재 글의 네 단계">
        {PATH.map(([label, description], index) => <div key={label} className={`min-w-0 bg-background px-2 py-3 ${index === 1 || index === 2 ? "text-primary" : ""}`}>
          <span className="font-mono text-[9px]">0{index + 1}</span><strong className="mt-1 block break-keep text-xs">{label}</strong><span className="mt-1 hidden text-[10px] leading-4 text-muted-foreground sm:block">{description}</span>
        </div>)}
      </div>
    </aside>
  );
}

export function DistributionalMapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 언어 표현 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">언어 표현 지도에 되돌려 놓기</p>
      <p className="mt-2 break-keep text-base font-bold leading-7">단어 벡터는 뜻의 저장소가 아니라 corpus·context·weighting·compression을 거친 측정 결과입니다.</p>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">다음 글에서는 이 행렬을 먼저 만들지 않고 local pair를 예측하면서 비슷한 통계를 학습하는 Word2Vec을 추적합니다.</p>
      <Link to="/cs/ai/word2vec" className="mt-3 inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">Word2Vec 정본으로 이어가기 →</Link>
    </aside>
  );
}
