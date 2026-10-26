import { Link } from "react-router-dom";

export default function RethArchitectureLocator() {
  return (
    <aside
      className="not-prose mb-9 border-y border-border py-4 sm:py-5"
      aria-label="Ethereum 실행 클라이언트 학습 지도에서 현재 글의 위치"
      data-reth-track="concept"
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/ethereum-architecture" className="hover:text-primary">Ethereum 전체 구조</Link>
        <span aria-hidden>›</span>
        <span>실행 클라이언트</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">Reth</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">개념</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · 실행 노드 내부</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            합의 클라이언트가 건넨 블록은 Reth 안에서 어떻게 검증·실행·저장되어 같은 상태의 조회 결과가 될까요?
          </p>
        </div>
        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">직속 부모 지도</p>
          <Link to="/cs/blockchain/ethereum-architecture" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            Ethereum 실행·합의 구조 ↗
          </Link>
        </div>
      </div>
    </aside>
  );
}
