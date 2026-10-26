import { Link } from "react-router-dom";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";

const GROUP = SERIES_READING_PATHS.reth.groups.find((group) =>
  (group.slugs as readonly string[]).includes("reth-cli"),
);

const NEIGHBORS = [
  { slug: "reth-cli", label: "CLI와 노드 빌더" },
  { slug: "reth-chainspec", label: "체인 규칙" },
  { slug: "reth-alloy-primitives", label: "값과 직렬화" },
] as const;

export default function RethCliLocator() {
  return (
    <aside
      className="not-prose mb-8 border-y border-border py-4 sm:py-5"
      aria-label="Reth 학습 지도에서 현재 글의 위치"
      data-reth-track="practice"
      data-reth-parent={GROUP?.label ?? "노드 조립과 규칙"}
    >
      <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-5 text-muted-foreground" aria-label="Reth 글 위치">
        <Link to="/cs/blockchain" className="hover:text-primary">블록체인</Link>
        <span aria-hidden>›</span>
        <Link to="/cs/blockchain/reth#overview" className="hover:text-primary">Reth 전체 구조</Link>
        <span aria-hidden>›</span>
        <span>실무 트랙</span>
        <span aria-hidden>›</span>
        <strong className="text-foreground" aria-current="page">CLI와 노드 빌더</strong>
      </nav>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-primary/40 px-2 py-1 text-[10px] font-bold text-primary">실무</span>
            <span className="text-[11px] text-muted-foreground">현재 영역 · {GROUP?.label ?? "노드 조립과 규칙"}</span>
          </div>
          <p className="mt-3 max-w-3xl break-keep text-base font-bold leading-7">
            같은 <code>reth node</code> 명령을 다시 실행했을 때 같은 노드가 준비됐다고 무엇으로 확인할까요?
          </p>
          <p className="mt-1 max-w-3xl text-xs leading-6 text-muted-foreground">
            설정값을 읽는 단계와 실행 서비스를 띄우는 단계를 나누고, 각 단계의 소유자와 실패 상태를 남깁니다.
          </p>
        </div>

        <div className="border-l-2 border-primary/45 pl-3">
          <p className="text-[10px] font-bold text-muted-foreground">출발할 개념</p>
          <Link to="/cs/blockchain/reth#overview" className="mt-1 block break-keep text-sm font-bold leading-6 hover:text-primary">
            한 블록의 실행·저장·조회 흐름 ↗
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="같은 영역의 글 순서">
        {NEIGHBORS.map((item, index) => {
          const current = item.slug === "reth-cli";
          return current ? (
            <span key={item.slug} className="min-w-0 bg-primary px-3 py-3 text-primary-foreground" aria-current="page">
              <small className="block text-[9px] font-bold opacity-75">{String(index + 1).padStart(2, "0")} · 현재</small>
              <strong className="mt-1 block break-keep text-xs">{item.label}</strong>
            </span>
          ) : (
            <Link key={item.slug} to={`/cs/blockchain/${item.slug}`} className="min-w-0 bg-background px-3 py-3 hover:bg-muted/50">
              <small className="block text-[9px] font-bold text-muted-foreground">{String(index + 1).padStart(2, "0")} · 다음</small>
              <strong className="mt-1 block break-keep text-xs">{item.label}</strong>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

export function RethCliMapReturn() {
  return (
    <aside className="not-prose my-8 border-y border-border py-5" aria-label="확인한 사실을 Reth 전체 지도에 되돌려 놓기">
      <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
      <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
        CLI는 설정을 NodeConfig로 정리하고, NodeBuilder는 호환되는 부품 조합을 만들며, 실제 준비 상태는 저장소·소켓·서비스를 시작한 런타임이 따로 증명합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
        <Link to="/cs/blockchain/reth#overview" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
          Reth 전체 구조로 돌아가기 ↗
        </Link>
        <Link to="/cs/blockchain/reth-chainspec" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">
          전체 순서의 다음 글: ChainSpec ↗
        </Link>
      </div>
    </aside>
  );
}
