import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";
import PrysmArchitectureViz from "./viz/PrysmArchitectureViz";

const OWNERS = [
  ["Beacon node", "Gossip·API object를 검증하고 beacon state, fork-choice head, justified·finalized checkpoint를 관리합니다."],
  ["Validator client", "Beacon node가 제공한 duty·domain·signing root를 검토하고 slashing-safe key로 proposal·attestation에 서명합니다."],
  ["Execution client", "Engine API로 받은 execution payload의 transaction·EVM transition과 execution state root를 검증합니다."],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Prysm은 gossip을 받는 프로그램이 아니라 consensus state와 validator duty를 분리한 client다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Ethereum consensus object는 network에서 받았다는 이유만으로 beacon state를 바꾸지 않습니다.
          SSZ decode·topic·fork digest·signature·state-dependent validation을 통과하고, slot·epoch 순서에 맞는
          state transition에 적용된 다음 fork choice와 finality evidence에 반영돼야 합니다. Prysm beacon node는
          이 경로를 구현하고 validator client는 그 state에서 배정된 duty에 서명합니다.
        </p>
        <p>
          이 글에서는 package 이름보다 하나의 beacon block과 attestation을
          <strong> wire bytes→validation→state transition→head/finality→duty→signature</strong> 순서로
          추적합니다. Execution payload의 EVM 실행은 Engine API 너머 execution client가 맡으므로 consensus
          acceptance와 execution validity도 같은 status로 합치지 않습니다.
        </p>
      </div>

      <ContentBoundary article="prysm" />
      <PrysmArchitectureViz />

      <div className="not-prose my-7 grid gap-4 md:grid-cols-3">
        {OWNERS.map(([title, body], index) => (
          <article key={title} className="min-w-0 border-l border-border pl-4">
            <p className="font-mono text-[11px] font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-sm font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 consensus object의 evidence를 끝까지 잇습니다</h3>
        <p>
          Object root 하나에 source peer·gossip topic, fork digest, SSZ type/version, slot·proposer 또는 committee,
          signature domain·signing root, stateless/stateful validation result, pre/post-state root, fork-choice status와
          justified·finalized checkpoint를 연결합니다. Validator duty라면 validator index·epoch·duty type,
          signing data와 slashing-protection decision까지 같은 trace에 둡니다.
        </p>
        <p>
          Decode 성공은 signature 성공이 아니며, state transition 성공은 canonical head 또는 finality가 아닙니다.
          Gossip accept 역시 다른 peer의 처리 완료를 보장하지 않습니다. 단계마다 reject reason과 spec fork,
          state root를 남겨야 restart·replay 뒤 같은 object를 안전하게 dedupe하거나 재검증할 수 있습니다.
        </p>

        <h3>Beacon state, head와 finality는 같은 포인터가 아닙니다</h3>
        <p>
          State transition은 특정 parent state에 block operations를 적용해 post-state를 만듭니다. Fork choice는
          여러 valid branches 가운데 현재 head를 고르며 새 attestation·payload status에 따라 바뀔 수 있습니다.
          Justified·finalized checkpoint는 더 강한 epoch-level evidence를 나타내므로 head가 잠깐 바뀌어도 같은
          속도로 움직이지 않습니다. API와 cache는 head·safe/justified·finalized·state root를 명시해야 합니다.
        </p>

        <h3>Validator client는 duty 계산과 signing authority를 한 프로세스로 뭉치지 않습니다</h3>
        <p>
          Beacon node가 제안한 duty를 그대로 서명하기 전에 chain/fork domain, validator index, slot·epoch,
          signing root와 slashing-protection history를 확인합니다. Remote signer를 쓰더라도 validator client가
          요청 context와 authorization을 검증하고 signer는 허용된 key·domain·monotonic history에만 서명해야
          합니다. Timeout 뒤 blind retry는 동일 duty의 conflicting signature를 만들 수 있으므로 stable duty ID와
          signed-root receipt로 조정합니다.
        </p>

        <h3>Execution payload status는 consensus transition의 별도 dependency입니다</h3>
        <p>
          Bellatrix 이후 계열 fork에서 beacon block은 execution payload를 포함할 수 있고 beacon node는 Engine API로
          execution client와 validity를 교환합니다. Prysm이 EVM transaction을 직접 실행한다고 가정하면 안 되며,
          VALID·INVALID·SYNCING 같은 execution status와 latest valid hash, consensus block root를 함께 기록해야
          optimistic processing과 최종 acceptance 경계를 설명할 수 있습니다.
        </p>

        <h3>Spec fork와 code branch를 함께 고정합니다</h3>
        <p>
          Ethereum consensus specs에는 stable fork와 앞으로의 unstable fork가 함께 보이고 Prysm repository의
          <code>master</code>는 stable, <code>develop</code>은 개발 흐름을 가리킵니다. 분석과 장애 보고에는 Prysm
          release·git SHA, consensus-spec commit·fork name, network/genesis root, feature flags, validator/slashing
          DB schema와 execution-client version을 남깁니다. 미래 fork 문서를 현재 production rule로 섞지 않습니다.
        </p>

        <h3>Release gate는 missed duty 수보다 먼저 consensus parity를 봅니다</h3>
        <p>
          Base와 candidate에 같은 genesis·spec fork·block/attestation fixture·peer schedule·Engine response를 주고
          malformed SSZ, wrong fork digest, bad signature, invalid transition, equivocation, reorg, execution SYNCING/
          INVALID, restart와 signer timeout을 반복합니다. Accepted/rejected object, pre/post-state root, head·finalized
          checkpoint, duty·signing root와 slashing decision parity를 hard gate로 두고 그 뒤 slot processing p95,
          peer score, missed duty와 resource cost를 비교합니다. Gate 실패 시 이전 binary·config·DB snapshot으로
          rollback합니다.
        </p>
        <p>
          Protocol 원리는 <Link to="/blockchain/consensus-mechanisms">PoS 합의</Link>와
          <Link to="/blockchain/bft-theory"> BFT safety·liveness</Link>, execution handoff는
          <Link to="/blockchain/reth"> Reth execution-client 지도</Link>에서 가져옵니다. Prysm 내부는 아래
          SSZ·BLS·P2P·state transition·fork choice·finality·validator·Engine API 글로 내려가면 됩니다.
        </p>
      </div>

      <SeriesReadingMap categorySlug="blockchain" path={SERIES_READING_PATHS.prysm} />

      <div id="paper-prysm-repository" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 코드 · implementation snapshot</p>
        <p className="mt-2 text-sm font-semibold">OffchainLabs/prysm</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 beacon node·validator client·network·state·API 책임이 실제 release에서 어디에 구현됐는지 확인하는 것입니다. Repository는 stable master와 development branch를 구분하므로 분석한 release·SHA를 함께 고정하며 branch head를 production 전체로 일반화하지 않습니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://github.com/OffchainLabs/prysm" target="_blank" rel="noreferrer">공식 repository 보기</a>
      </div>
      <div id="paper-ethereum-consensus-specs" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">공식 규격 · protocol source</p>
        <p className="mt-2 text-sm font-semibold">Ethereum Proof-of-Stake Consensus Specifications</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">문제는 fork별 beacon state transition·fork choice·validator·P2P·execution handoff 규칙을 정의하는 것입니다. 규격은 protocol 정본이지만 Prysm의 package layout·DB schema·performance를 정하지 않으며 stable/unstable fork와 commit을 구분해 읽어야 합니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://ethereum.github.io/consensus-specs/" target="_blank" rel="noreferrer">Consensus specs 보기</a>
      </div>
    </section>
  );
}
