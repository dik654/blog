import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";
import CometBFTArchFlowViz from "./viz/CometBFTArchFlowViz";

const OWNERS = [
  ["입력·gossip", "Mempool과 P2P가 transaction 후보와 consensus message를 전파하지만 실행 결과를 확정하지는 않습니다."],
  ["순서 합의", "Consensus가 proposal·prevote·precommit evidence로 다음 block의 순서를 결정합니다."],
  ["상태 전이", "Application이 ABCI++ 요청에 deterministic하게 답하고 FinalizeBlock 결과와 app hash를 반환합니다."],
  ["영속화", "Block·consensus state·application state가 다음 height의 입력이 되도록 각 owner가 commit receipt를 남깁니다."],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        CometBFT는 transaction을 실행하는 앱이 아니라 순서를 복제하는 엔진이다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사용자가 보낸 transaction 한 건은 곧바로 chain state를 바꾸지 않습니다. 먼저 node가 bytes를
          받아 후보 pool에 넣고, validator들이 어느 block을 다음 순서로 채택할지 합의한 다음,
          application이 그 block을 같은 이전 state에 실행해야 합니다. CometBFT는 이 가운데 Byzantine
          fault-tolerant state machine replication과 application handoff를 맡습니다.
        </p>
        <p>
          이 구분을 놓치면 mempool의 CheckTx를 최종 실행으로, consensus commit을 application disk commit으로,
          P2P 수신을 remote 처리 완료로 오해하기 쉽습니다. 아래에서는 하나의 transaction을
          <strong> 수신→후보→proposal→vote certificate→FinalizeBlock→Commit</strong> 순서로 따라가면서
          각 단계의 owner와 증거를 분리합니다.
        </p>
      </div>

      <ContentBoundary article="cometbft" />
      <CometBFTArchFlowViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>먼저 네 책임을 나눕니다</h3>
      </div>
      <div className="not-prose my-7 grid gap-4 md:grid-cols-2">
        {OWNERS.map(([title, body], index) => (
          <article key={title} className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] font-semibold text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-2 text-sm font-bold">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 transaction의 증거를 끝까지 잇습니다</h3>
        <p>
          예를 들어 <code>alice→bob 10</code>이라는 bytes가 들어오면 mempool admission은 형식과 현재
          application state에서의 기본 유효성을 선별합니다. 이후 proposer가 후보 block을 만들고 application의
          proposal hook이 내용을 준비하거나 검사할 수 있지만, 이 결과만으로 block이 확정되지는 않습니다.
          Validator vote가 consensus rule을 만족해 block 순서가 결정돼야 FinalizeBlock이 authoritative state
          transition을 계산하며, Commit 뒤 app hash가 다음 height의 state identity가 됩니다.
        </p>
        <p>
          따라서 같은 transaction ID에 receive time, CheckTx result, proposal height·round, block hash,
          commit evidence, FinalizeBlock result, app hash와 persistence status를 연결해야 합니다. 어느 단계가
          실패했는지 모르면 재시작 뒤 transaction을 누락하거나 이미 실행된 external effect를 중복할 수 있습니다.
          Application transition은 deterministic해야 하고 외부 side effect는 outbox·idempotency receipt처럼
          합의 state와 별도로 조정해야 합니다.
        </p>

        <h3>Proposal과 실행은 같은 호출이 아닙니다</h3>
        <p>
          PrepareProposal·ProcessProposal은 block 후보를 만들고 검증하는 consensus-time boundary이고,
          FinalizeBlock은 합의된 block의 application transition을 계산하는 execution boundary입니다.
          CheckTx도 admission signal일 뿐 최종 receipt가 아닙니다. 같은 transaction이 후보에서 제외되거나
          다른 height에 포함될 수 있으므로 client는 mempool acceptance가 아니라 committed height·index·app
          result를 확인해야 합니다.
        </p>

        <h3>Version을 고정하지 않은 코드 읽기는 재현할 수 없습니다</h3>
        <p>
          CometBFT의 repository <code>main</code>, release branch, ABCI 문서와 실제 binary가 서로 다른 시점을
          가리키면 method 이름과 lifecycle을 섞게 됩니다. 분석과 장애 보고에는 CometBFT semver·git SHA,
          ABCI protocol version, application binary/config, chain ID·height와 database schema를 함께 남깁니다.
          이 글은 현재 공개 architecture를 설명하지만, 세부 handler·field·constant는 선택한 release의
          공식 문서와 source에서 다시 확인해야 합니다.
        </p>

        <h3>채택 검사는 정상 처리량보다 먼저 safety와 replay를 봅니다</h3>
        <p>
          Base와 candidate에 같은 genesis·validator set·application binary·transaction fixture·network schedule을
          주고 invalid proposal, equivocation, delayed vote, app rejection, crash between FinalizeBlock and Commit,
          restart와 state-sync를 반복합니다. Conflicting committed block 또는 app hash는 0건이어야 하며,
          committed transaction·height·app hash의 parity와 restart recovery를 hard gate로 둡니다. Throughput과
          p95는 그 뒤에 같은 workload에서 비교하고, gate를 넘지 못하면 이전 binary·config·database snapshot으로
          rollback합니다.
        </p>
        <p>
          이론 전제가 필요하면 <Link to="/blockchain/distributed-systems">분산 시스템 기초</Link>,
          <Link to="/blockchain/smr-theory"> SMR</Link>,
          <Link to="/blockchain/bft-theory"> BFT quorum·lock</Link>을 먼저 읽습니다. 구현을 더 깊게 볼 때는
          아래 지도의 type·consensus·ABCI·execution·state 글로 내려가면 됩니다.
        </p>
      </div>

      <SeriesReadingMap categorySlug="blockchain" path={SERIES_READING_PATHS.cometbft} />

      <div id="paper-cometbft-repository" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 코드 · architecture snapshot</p>
        <p className="mt-2 text-sm font-semibold">cometbft/cometbft source repository</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 consensus·mempool·state·P2P 책임이 실제 release에서 어디에 구현됐는지 확인하는 것입니다. Repository는 source와 release history를 제공하지만 main의 현재 코드가 production binary와 같다고 가정할 수 없으므로 version·SHA를 함께 고정합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/cometbft/cometbft" target="_blank" rel="noreferrer">공식 repository 보기</a>
      </div>
      <div id="paper-cometbft-abci-spec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 · application boundary</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Application Blockchain Interface</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 consensus engine과 deterministic application 사이의 request·response·commit 경계를 정의하는 것입니다. 공식 문서는 현재 ABCI lifecycle을 설명하지만 특정 application의 business validity·external effect exactly-once까지 대신 보장하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.cosmos.network/cometbft/latest/spec/abci/Overview" target="_blank" rel="noreferrer">ABCI 공식 문서 보기</a>
      </div>
      <div id="paper-cometbft-consensus-spec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 · consensus boundary</p>
        <p className="mt-2 text-sm font-semibold">CometBFT Byzantine Consensus Algorithm</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 proposal·prevote·precommit과 round change가 어떤 evidence로 block order를 결정하는지 설명하는 것입니다. 규격의 safety·liveness 주장은 해당 validator·timing·fault 전제에 제한되며 application 실행 결과나 모든 network 성능을 고정하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://docs.cosmos.network/cometbft/latest/spec/consensus/Byzantine-Consensus-Algorithm.md" target="_blank" rel="noreferrer">Consensus 공식 문서 보기</a>
      </div>
    </section>
  );
}
