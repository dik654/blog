import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";
import RethArchitectureViz from "./viz/RethArchitectureViz";

const PATHS = [
  ["Historical sync", "Headers·bodies·senders·execution을 checkpoint가 있는 stage로 전진시키며 긴 과거 구간을 복구합니다."],
  ["Live Engine path", "Consensus client의 forkchoiceUpdated·newPayload를 받아 head 근처 payload를 검증·실행·canonicalize합니다."],
  ["Query path", "Provider가 DB·static history·in-memory state를 같은 block view에 맞춰 RPC와 extension에 노출합니다."],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Reth는 block을 받는 프로그램이 아니라 검증·실행·저장·조회 owner를 조립한 execution client다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum execution client는 P2P로 block을 받는 데서 끝나지 않습니다. Network bytes를 protocol
          object로 검증하고, fork rule에 맞는 EVM transition을 실행하며, canonical chain과 historical data를
          저장한 뒤 Engine API와 JSON-RPC consumer가 같은 state를 읽게 해야 합니다. Reth는 이 책임을
          Rust crate와 node component로 나누고 다시 하나의 lifecycle로 조립합니다.
        </p>
        <p>
          이 글의 목표는 crate 이름을 외우는 것이 아니라 한 block의 evidence를
          <strong> 입력→검증→실행→canonicalization→저장→조회</strong> 순서로 추적하는 것입니다. 긴 과거
          sync와 head 근처 Engine API가 같은 EVM·storage contract에 합류하지만 trigger·retry·rollback은
          다르므로 하나의 pipeline으로 뭉뚱그리지 않습니다.
        </p>
      </div>

      <ContentBoundary article="reth" />
      <RethArchitectureViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Reth가 소유하는 것과 consensus client가 소유하는 것을 나눕니다</h3>
        <p>
          Reth는 Ethereum execution layer의 transaction validity, EVM execution, receipt·state root, execution
          payload와 Engine API를 맡습니다. Beacon consensus client는 fork choice와 finality, validator duty를
          맡고 Engine API로 head·safe·finalized reference와 payload를 교환합니다. 따라서 Reth가 local canonical
          head를 바꿀 수 있어도 consensus finality를 혼자 결정하거나 validator attestation을 만들지는 않습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid gap-4 md:grid-cols-3">
        {PATHS.map(([title, body], index) => (
          <article key={title} className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <h4 className="mt-2 text-sm font-bold">{title}</h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 block receipt는 최소 여섯 단계를 잇습니다</h3>
        <p>
          Block hash 하나에 source peer 또는 Engine request, parent hash·number, header/body validation result,
          chain spec·fork activation, execution output, state root·receipts root, canonical status와 storage checkpoint를
          연결합니다. Query consumer가 읽은 block hash·state root·provider view도 남겨야 reorg 뒤 stale response와
          genuine execution mismatch를 구분할 수 있습니다.
        </p>
        <p>
          수신 성공은 검증 성공이 아니며, 실행 성공은 canonical adoption이 아니고, DB write 성공은 RPC consumer가
          같은 snapshot을 읽었다는 뜻도 아닙니다. 단계별 typed status와 owner를 유지해야 crash 뒤 어느 작업을
          replay하고 어느 결과를 폐기할지 결정할 수 있습니다.
        </p>

        <h3>과거 sync와 live path는 합류점은 같아도 cursor가 다릅니다</h3>
        <p>
          Historical pipeline은 긴 block range를 stage checkpoint로 전진시키고 unwind point에서 잘못된 suffix를 되돌릴 수 있어야
          합니다. Live Engine path는 head 근처 payload와 forkchoice update를 낮은 latency로 처리하면서 safe·finalized marker와
          reorg를 반영합니다. 두 경로는 같은 chain spec·EVM semantics·storage invariants를 공유해야 하며 동일 block을 처리했을 때
          execution output과 state root가 같아야 합니다.
        </p>

        <h3>Provider는 storage 종류를 숨기는 대신 일관된 view를 약속해야 합니다</h3>
        <p>
          최신 mutable state, immutable historical segment, trie·receipt·header index는 서로 다른 storage tier에 놓일 수
          있습니다. Provider abstraction의 핵심은 consumer가 같은 block identifier에서 섞이지 않은 view를 읽는 것입니다. Query 시작 시
          canonical hash·state root·storage generation을 고정하고 reorg나 migration 중 view가 바뀌면 silent mixed
          result보다 retryable error로 끝내는 편이 안전합니다.
        </p>

        <h3>현재 문서와 실제 binary의 version을 함께 기록합니다</h3>
        <p>
          2026-08-14 확인 시 Reth 공식 문서는 v2.5.0을 표시하고 repository는 Storage V2가 새 node의 default라고 설명합니다. 이 숫자를 영구
          사실로 쓰지 않고 실제 run에는 Reth semver·git SHA, chain spec digest, execution/Engine API fork version,
          storage format·schema, pruning profile과 OS·hardware를 기록합니다. Moving main과 최신 문서를 이전 production
          binary의 구조 설명으로 섞지 않습니다.
        </p>

        <h3>Release gate는 sync 속도보다 state parity를 먼저 봅니다</h3>
        <p>
          Base와 candidate에 같은 chain snapshot·peer fixture·Engine sequence·chain spec을 주고 invalid header,
          bad transaction, missing parent, reorg, crash during stage checkpoint, storage migration, restart와 concurrent
          RPC를 반복합니다. Canonical hash·state root·receipts·logs·Engine response와 provider snapshot parity를 hard
          gate로 둔 뒤 stage throughput·head latency·RPC p95·disk amplification을 비교합니다. 실패하면 이전 binary,
          config·chain spec과 호환 storage snapshot으로 rollback하고 migration receipt를 보존합니다.
        </p>
        <p>
          Ethereum protocol의 consensus 경계는 <Link to="/blockchain/ethereum-architecture">Ethereum 구조</Link>,
          state transition 기초는 <Link to="/blockchain/evm">EVM</Link>에서 가져옵니다. Reth 내부를 더 깊게 볼 때는
          아래 지도의 CLI·network·pipeline·execution·provider·RPC·ExEx 글로 내려가면 됩니다.
        </p>
      </div>

      <SeriesReadingMap categorySlug="blockchain" path={SERIES_READING_PATHS.reth} />

      <div id="paper-reth-repository" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 코드 · implementation snapshot</p>
        <p className="mt-2 text-sm font-semibold">paradigmxyz/reth</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 execution node의 network·pipeline·EVM·storage·RPC 책임이 실제 release에서 어디에 구현됐는지 확인하는 것입니다. Repository는 current source와 release history를 제공하지만 main을 production binary와 같다고 가정하지 않으므로 semver·SHA를 함께 고정합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/paradigmxyz/reth" target="_blank" rel="noreferrer">공식 repository 보기</a>
      </div>
      <div id="paper-reth-docs" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 문서 · node·SDK boundary</p>
        <p className="mt-2 text-sm font-semibold">Reth official documentation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 operator 설정과 SDK component·storage·RPC의 current public contract를 찾는 것입니다. 공식 문서는 versioned 동작과 API를 설명하지만 Ethereum protocol 정본 전체나 특정 hardware의 성능을 대신하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://reth.rs/" target="_blank" rel="noreferrer">Reth 공식 문서 보기</a>
      </div>
    </section>
  );
}
