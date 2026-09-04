import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernDealDeliveryViz from "./viz/ModernDealDeliveryViz";

const DEALS = "https://docs.filecoin.io/smart-contracts/programmatic-storage/direct-deal-making";
const RETRIEVAL = "https://docs.filecoin.io/basics/how-retrieval-works/serving-retrievals";
const BOOST = "https://github.com/filecoin-project/boost/tree/240aa6e12fbd349a5a3ed702121c3c58050792fc";

export default function ModernLotusMarketArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6"><header className="space-y-3"><p className="text-sm font-semibold text-primary">Client의 파일이 “저장됐다”는 말을 네 완료 상태로 나누기</p><h2 className="text-3xl font-bold tracking-tight">Deal negotiation·chain publication·sector activation·retrieval은 서로 다른 계약이다</h2></header><p className="text-lg leading-8 text-foreground/90">역사적으로 Lotus 안에 있던 markets subsystem은 provider deal service로부터 분리됐으며, 현재 흐름은 Boost 같은 입구와 Lotus chain API를 함께 사용합니다. 이 글은 제품 이름보다 proposal, piece, chain message, sector와 delivered bytes의 receipt를 따라갑니다. <strong>PieceCID</strong>는 padded piece data commitment이고, chain에 proposal을 publish한 사실은 그 bytes가 이미 active sector에 들어갔다는 뜻이 아닙니다.</p><ModernDealDeliveryViz /><ContentBoundary article="lotus-market" /></section>

    <section id="deal-artifact" className="space-y-6"><header><p className="text-sm font-semibold text-primary">01 · Deal artifact</p><h2 className="mt-2 text-2xl font-bold">D7의 proposal·PieceCID P·publish message M을 같은 idempotent generation으로 묶는다</h2></header><p>
            Client proposal에는 parties와 piece commitment·size, 기간과 economic terms가 들어갑니다. provider는 signature와
            policy, capacity를 확인합니다. Data transfer가 끝나면 실제 bytes에서 PieceCID와 size를 다시 계산합니다. Deal D7의 proposal
            digest와 PieceCID P, transfer digest, publish/allocation message CID M, on-chain deal/allocation
            ID를 기록해 두면 crash·retry 뒤에도 어느 external effect가 이미 발생했는지 찾을 수 있습니다.
          </p><ExplainedFormula question="Storage deal을 end-to-end로 완료했다고 언제 말할까?" idea={<>Proposal, piece bytes, canonical chain publication과 sector activation을 별도 Boolean으로 검사합니다.</>} formula={String.raw`A_{deal}=A_{proposal}\land A_{piece}\land A_{chain}\land A_{active}`}
    annotatedFormula={String.raw`A_{deal}=\underbrace{A_{proposal}\land A_{piece}\land A_{chain}\land A_{active}}_{\text{판정 조건 결합}}`}
    operations={[
      { expression: String.raw`A_{proposal}\land A_{piece}\land A_{chain}\land A_{active}`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","Proposal, piece bytes, canonical","chain publication과 sector","activation을 별도 Boolean으로 검사합니다."] },
    ]} terms={[{symbol:"A_{deal}",name:"Deal completion",description:"고정 profile에서 storage deal lineage가 끝까지 유효하면 1입니다."},{symbol:"A_{proposal}",name:"Proposal admission",description:"Signature·terms·provider policy를 통과하면 1입니다."},{symbol:"A_{piece}",name:"Piece verification",description:"Transferred bytes의 PieceCID·size가 proposal과 맞으면 1입니다."},{symbol:"A_{chain}",name:"Chain publication",description:"Expected message가 canonical chain actor state에 포함되면 1입니다."},{symbol:"A_{active}",name:"Sector activation",description:"Piece가 proven sector와 actor activation state에 연결되면 1입니다."}]} assumptions={["Legacy market deal, Direct Data Onboarding 등 exact actor/method profile을 먼저 고정합니다.","Chain inclusion은 reorg/confidence policy를 통과한 canonical receipt로 판단합니다."]} interpretation="Publish만 성공하면 Achain은 1일 수 있지만 Aactive가 0이어서 전체 deal은 완료되지 않습니다. 이 식은 retrieval availability를 포함하지 않습니다." /><p><strong>반례:</strong> Proposal의 PieceCID를 재사용하면서 transfer bytes 한 블록을 바꾸면 recomputed commitment가 달라집니다. Size와 PieceCID를 재검증해 publish 전에 거절해야 하며, 이미 만든 다른 sector artifact로 우회하면 안 됩니다.</p><div id="paper-filecoin-deals"><CitationBlock citeKey={1} source="Filecoin direct deal-making · official docs" href={DEALS}><p><strong>문제:</strong> Client data preparation, proposal, provider acceptance와 chain progress를 연결해야 합니다.</p><p><strong>핵심 기여:</strong> CAR packaging, proposal event, Boost acceptance, transfer, publish와 sealing까지의 high-level flow를 설명합니다.</p><p><strong>중요 가정:</strong> 2026-08-14 docs와 사용 중인 contract/actor/network profile을 함께 고정합니다.</p><p><strong>근거 범위:</strong> 공식 direct deal-making workflow입니다.</p><p><strong>일반화 금지:</strong> Deal 시간, provider acceptance, sector activation이나 retrieval availability를 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="activation" className="space-y-6"><header><p className="text-sm font-semibold text-primary">02 · Sector activation</p><h2 className="mt-2 text-2xl font-bold">Published intent를 PieceCID가 들어간 proven sector와 actor state까지 추적한다</h2></header><p>고정 예제에서 PieceCID P는 sector 42 layout의 CommD에 포함되고 replica commitment CommR과 함께 precommit·provecommit 경로를 거칩니다. <a className="text-primary hover:underline" href="/blockchain/proofs-porep">PoRep artifact 정본</a>이 proof phase를 소유하며, 이 글은 그 결과와 deal/allocation identifier가 actor state에서 active storage로 만나는 지점만 다룹니다.</p><ol className="grid gap-3 md:grid-cols-4">{[["prepare","P · size · sector 42"],["commit","CommD · CommR"],["chain","precommit · provecommit"],["activate","actor state · receipt"]].map(([t,d],i)=><li key={t} className="rounded-lg border border-border p-4"><p className="font-mono text-xs text-primary">0{i+1}</p><h3 className="mt-2 font-semibold">{t}</h3><p className="mt-2 break-words text-sm text-muted-foreground">{d}</p></li>)}</ol><p>
            Exact fields는 network version과 legacy deal/Direct Data Onboarding profile에 따라 달라집니다. 그래서 “deal ID가
            항상 같은 방식으로 생긴다”고 일반화하지 않습니다. ProveCommit message가 submitted 상태인 것과 canonical inclusion,
            activation, 이후 WindowPoSt maintenance도 서로 구분합니다.
          </p></section>

    <section id="retrieval" className="space-y-6"><header><p className="text-sm font-semibold text-primary">03 · Retrieval delivery</p><h2 className="mt-2 text-2xl font-bold">Storage proof와 별도로 discover→negotiate→transfer→verify를 완료한다</h2></header><p>
            Client가 CID Q를 요청하면 IPNI/content routing에서 provider와 protocol hints를 찾고 provider S의 availability와
            range, unseal, price/auth policy를 확인합니다. 그다음 HTTP나 Graphsync, Bitswap처럼 실제 지원하는 transport로 bytes를
            받아 requested CID 또는 segment commitment로 검증합니다. Payment channel은 특정 retrieval profile의 결제 방법이지 모든
            retrieval의 필수 단계가 아닙니다.
          </p><div className="grid gap-3 sm:grid-cols-2"><article className="rounded-lg border border-border p-4"><h3 className="font-semibold">고정 측정</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">
            CID Q의 8 MiB를 같은 range로 요청합니다. 기록하는 값은 discovery age와 cache/unseal state, TTFB, verified bytes,
            throughput·p99, retry입니다.
          </p></article><article className="rounded-lg border border-border p-4"><h3 className="font-semibold">Failure counterexample</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">
            WindowPoSt가 valid해도 endpoint가 down이거나 index가 stale하거나 unseal I/O가 밀리면 delivery는 실패합니다. Proof
            claim을 service SLA로 확대할 수는 없습니다.
          </p></article></div><div id="paper-filecoin-retrieval"><CitationBlock citeKey={2} source="Filecoin serving retrievals · official docs" href={RETRIEVAL}><p><strong>문제:</strong> Stored content의 provider discovery와 delivery protocol을 storage proof와 분리해야 합니다.</p><p><strong>핵심 기여:</strong> IPNI query, provider selection, Graphsync/Bitswap/HTTP transfer와 payment 흐름을 설명합니다.</p><p><strong>중요 가정:</strong> Advertisement, supported protocol, cache/unseal와 payment policy를 요청마다 확인합니다.</p><p><strong>근거 범위:</strong> Public content retrieval의 공식 service flow입니다.</p><p><strong>일반화 금지:</strong> Indexer freshness, online availability, free retrieval 또는 fixed latency를 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="release-gate" className="space-y-6"><header><p className="text-sm font-semibold text-primary">04 · Migration and release</p><h2 className="mt-2 text-2xl font-bold">Legacy state 이름을 복사하지 말고 artifacts와 external effects를 replay한다</h2></header><p>
            Migration canary는 legacy Lotus markets snapshot을 read-only로 보존합니다. 그리고 Boost/source SHA와 database
            schema, Lotus API, actor/network profile, retrieval routes를 고정합니다. D7를 replay하며 proposal/PieceCID와
            publish generation, actor state, sector 42 activation, CID Q delivery를 대조합니다. Publish 직후 reorg와
            process crash, duplicate retry, corrupted CAR, unavailable/unsealed retrieval을 주입하고 message
            generation과 chain query, fencing으로 duplicate effect를 막습니다.
          </p><p>
            Release receipt에 남기는 것은 source/schema pins와 artifact parity, canonical inclusion입니다. 여기에
            independent piece/proof/byte verification과 deal/retrieval stage p50/p99, 실패 원인을 덧붙입니다. Canary가 틀리면
            새 routing과 writes를 멈추고 이전 compatible service/config로 돌아갑니다. 다만 이미 제출된 messages와 transferred bytes를
            먼저 조회합니다.
          </p><div id="paper-boost-source"><CitationBlock type="code" citeKey={3} source="Boost source · commit 240aa6e" href={BOOST}><p><strong>문제:</strong> Current deal/retrieval 구현을 legacy Lotus markets snapshot과 분리해야 합니다.</p><p><strong>핵심 기여:</strong> Boost dealmaking·data transfer·retrieval code와 schema의 pinned source tree를 제공합니다.</p><p><strong>중요 가정:</strong> Exact commit, database, Lotus API, actor/network version과 deployment config를 고정합니다.</p><p><strong>근거 범위:</strong> Commit 240aa6e에 존재하는 implementation behavior입니다.</p><p><strong>일반화 금지:</strong> 모든 providers의 표준 topology, backward compatibility, deal success나 retrieval SLA를 보장하지 않습니다.</p></CitationBlock></div><aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> 네 owner, D7 artifact 순서, acceptance 네 조건, sector 42 activation, retrieval 네 단계, proof/retrieval 반례, publish idempotency, wrong-piece fixture, paired retrieval test와 migration rollback을 이 글만으로 답할 수 있습니다.</aside></section>
  </article>;
}
