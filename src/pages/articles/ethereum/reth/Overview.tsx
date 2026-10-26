import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";
import RethArchitectureLocator from "./RethArchitectureLocator";
import RethArchitectureViz, { RethReorgViz, RethTwoPathViz } from "./viz/RethArchitectureViz";

const OWNERS = [
  ["합의 클라이언트", "어느 분기를 현재 정본의 끝(head)으로 볼지 정하고 안전(safe)·확정(finalized) 지점을 관리합니다."],
  ["Reth", "블록 규칙을 확인하고 거래를 실행해 상태·실행 영수증(receipt)·루트와 조회 데이터를 만듭니다."],
  ["Engine API", "두 클라이언트가 실행 데이터 묶음(payload)의 유효성과 head·safe·finalized 위치를 주고받는 통신 경계입니다."],
] as const;

const STATUS = [
  ["수신", "실행 데이터와 부모 블록 해시를 받음", "아직 유효성은 확인하지 않음"],
  ["검증", "블록 머리글·본문·거래 규칙을 통과", "아직 실행 결과는 없음"],
  ["실행", "새 상태·영수증·루트를 계산", "아직 정본이 아닐 수 있음"],
  ["정본", "분기 선택에 따라 head의 조회 시점을 변경", "디스크 저장과는 구분"],
  ["저장", "상태·과거 기록·색인에 반영", "조회 시점 고정과는 구분"],
  ["조회", "블록 해시·상태 루트를 고정해 응답", "한 조회 시점에서만 읽음"],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <RethArchitectureLocator />
      <RethArchitectureViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Reth가 답하는 질문</h2>
        <p className="text-lg leading-8">
          Reth는 Ethereum의 실행 클라이언트입니다. 새 블록 후보를 받으면 프로토콜 규칙을 확인하고, 부모 상태에서 거래를 실행하며,
          새 상태와 실행 영수증(receipt)을 저장한 뒤 JSON-RPC가 같은 장부 시점을 읽게 합니다. 이 글은 제품 설정이 아니라
          <strong> 실행 데이터 묶음(payload) 하나가 입력에서 조회 결과가 되기까지</strong>를 설명합니다.
        </p>
      </div>

      <ContentBoundary article="reth" />

      <div className="not-prose my-8 grid gap-px bg-border p-px md:grid-cols-3" aria-label="Reth와 합의 클라이언트의 책임">
        {OWNERS.map(([title, body], index) => (
          <article key={title} className="min-w-0 bg-background p-4 sm:p-5">
            <p className="font-mono text-[10px] font-black text-primary">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 break-keep text-sm font-bold">{title}</h3>
            <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>Reth와 합의 클라이언트는 같은 일을 하지 않습니다</h2>
        <p>
          합의 클라이언트는 검증자(validator) 메시지와 분기 선택(fork choice)을 바탕으로 어느 체인을 따라갈지 정합니다. Reth는 그 체인의
          실행 데이터 묶음이 EVM 규칙에 맞는지 계산합니다. <code>engine_newPayload</code>는 실행 유효성을 묻고,
          <code>engine_forkchoiceUpdated</code>는 head·safe·finalized 위치를 전달합니다. Reth가 실행 데이터 묶음을 유효하다고 판단해도
          어느 분기가 최종적으로 head가 될지는 합의 계층이 결정합니다.
        </p>
      </div>

      <RethTwoPathViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>두 입력 경로는 같은 실행 결과로 합류합니다</h2>
        <p>
          노드가 오래된 구간을 따라잡을 때는 P2P에서 블록 머리글(header)과 본문(body)을 내려받아 단계별 체크포인트를 전진시킵니다.
          최신 head 부근에서는 합의 클라이언트가 Engine API로 실행 데이터 묶음과 분기 선택 변화를 보냅니다. 시작점과 복구 방식은
          다르지만 같은 블록 바이트, 같은 부모 상태, 같은 분기 규칙이라면 상태 루트(state root)와 실행 영수증이 같아야 합니다.
        </p>

        <h2>한 단계의 성공을 전체 성공으로 부르면 안 됩니다</h2>
        <p>
          블록을 받았다는 사실, 규칙을 통과했다는 사실, EVM 실행이 끝났다는 사실, 정본의 끝(canonical head)이 되었다는 사실, 디스크에 저장됐다는
          사실은 서로 다릅니다. 그래서 블록 해시 하나에 단계별 상태를 이어 붙여야 합니다. 그래야 중단 뒤 검증부터 다시 할지,
          실행 결과를 재사용할지, 잘못된 분기를 되돌릴지 판단할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-8 overflow-hidden border-y border-border" aria-label="한 블록의 처리 상태 구분">
        <div className="hidden grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] gap-px bg-border text-[10px] font-bold text-muted-foreground sm:grid">
          <div className="bg-muted/30 px-3 py-2">상태</div><div className="bg-muted/30 px-3 py-2">확인한 사실</div><div className="bg-muted/30 px-3 py-2">아직 확인하지 않은 사실</div>
        </div>
        {STATUS.map(([state, yes, notYet]) => (
          <div key={state} className="grid gap-2 border-b border-border px-3 py-3 last:border-b-0 sm:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1fr)] sm:gap-0 sm:px-0 sm:py-0">
            <strong className="break-keep text-xs sm:px-3 sm:py-3">{state}</strong>
            <span className="break-keep text-xs leading-5 text-foreground sm:border-l sm:border-border sm:px-3 sm:py-3">{yes}</span>
            <span className="break-keep text-xs leading-5 text-muted-foreground sm:border-l sm:border-border sm:px-3 sm:py-3">{notYet}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>조회 계층(Provider)은 저장소를 감추는 데서 그치지 않고 일관된 조회 시점을 제공합니다</h2>
        <p>
          최신 상태, 닫힌 과거 데이터, 실행 영수증과 각종 색인은 물리적으로 다른 저장 영역에 있을 수 있습니다. RPC가 이 차이를 몰라도 되는
          이유는 조회 계층이 같은 블록 해시와 상태 루트에 속한 자료만 읽는 조회 시점(view)을 제공하기 때문입니다. 분기 재편(reorg) 도중
          이전 블록 머리글과 새 상태가 섞인 답을 내는 대신, 고정한 조회 시점을 끝까지 읽거나 처음부터 다시 시도해야 합니다.
        </p>
      </div>

      <RethReorgViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h2>분기 재편은 정본 포인터 하나만 바꾸는 일이 아닙니다</h2>
        <p>
          새 분기 선택 결과가 다른 분기를 head로 정하면 Reth는 공통 조상 뒤의 이전 실행 결과를 되돌리고 새 분기를 실행합니다.
          정본 해시만 바꾸고 이전 영수증·트라이·색인을 남기면 RPC가 서로 다른 분기의 자료를 섞어 읽을 수 있습니다. 따라서
          되돌리기, 재실행, 저장, 조회 시점 전환이 같은 블록 식별자를 기준으로 이어져야 합니다.
        </p>

        <h2>여기서부터는 책임별로 내려갑니다</h2>
        <p>
          아래 지도는 Reth를 크레이트(crate) 이름순이 아니라 노드 수명주기 순서로 나눕니다. 먼저 노드를 조립하고 체인 규칙을 고른 뒤, P2P 수신과
          동기화, 거래·실행 데이터 처리, 마지막으로 저장·조회·확장 경계를 봅니다. 이 글에서 잡은 한 블록의 흐름을 기준으로 내려가면
          각 세부 글이 전체 구조의 어느 부분인지 잃지 않습니다.
        </p>
      </div>

      <SeriesReadingMap categorySlug="blockchain" path={SERIES_READING_PATHS.reth} />

      <aside id="return-map" className="not-prose my-8 scroll-mt-20 border-y border-border py-5" aria-label="확인한 사실을 Ethereum 구조 지도에 되돌려 놓기">
        <p className="text-[10px] font-bold text-primary">부모 지도에 되돌려 놓기</p>
        <p className="mt-2 max-w-3xl break-keep text-base font-bold leading-7">
          Ethereum 노드는 합의와 실행을 한 프로세스에 섞지 않습니다. 합의 클라이언트가 체인의 위치를 정하고, Reth가 그 위치의 거래를 실행해 상태와 조회 결과를 만듭니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          <Link to="/cs/blockchain/ethereum-architecture" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">직속 부모: Ethereum 전체 구조 ↗</Link>
          <Link to="/cs/blockchain/reth-net" className="inline-flex min-h-11 items-center border-b border-border text-xs font-semibold hover:border-primary hover:text-primary">다음 세부 경로: P2P 수신 ↗</Link>
        </div>
      </aside>

      <div id="paper-reth-repository" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">[O] 공식 코드 · 릴리스를 고정해 읽기</p>
        <p className="mt-2 text-sm font-semibold">paradigmxyz/reth</p>
        <p className="mt-2 max-w-3xl break-keep text-sm leading-6 text-muted-foreground">
          저장소는 네트워크·동기화·실행·저장·RPC의 실제 구현과 릴리스 이력을 제공합니다. 이 글의 역할 지도는 공식 문서 기준이며, 구체적인 구조체와 호출 순서는 분석할 릴리스 태그와 커밋을 먼저 고정한 뒤 세부 글에서 확인합니다.
        </p>
        <a href="https://github.com/paradigmxyz/reth" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-primary hover:underline">공식 저장소</a>
      </div>

      <div id="paper-reth-docs" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">[O] 공식 문서 · 2026-10-27 확인 · v2.8.1 표시 기준</p>
        <p className="mt-2 text-sm font-semibold">Reth Overview · Node Components</p>
        <p className="mt-2 max-w-3xl break-keep text-sm leading-6 text-muted-foreground">
          공식 문서는 Reth를 Engine API와 호환되는 실행 계층 구현으로 설명하고 네트워크·거래 풀·합의 규칙 검증·EVM·RPC를 교체 가능한 구성요소로 나눕니다. 실제 구현을 읽을 때는 계속 변하는 main 브랜치가 아니라 사용할 릴리스 태그와 커밋을 고정해야 합니다.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-primary">
          <a href="https://reth.rs/overview/" target="_blank" rel="noreferrer" className="hover:underline">Reth 개요</a>
          <a href="https://reth.rs/sdk/node-components/" target="_blank" rel="noreferrer" className="hover:underline">Node Components</a>
          <a href="https://github.com/paradigmxyz/reth/releases/tag/v2.8.1" target="_blank" rel="noreferrer" className="hover:underline">v2.8.1 릴리스</a>
        </div>
      </div>
    </section>
  );
}
