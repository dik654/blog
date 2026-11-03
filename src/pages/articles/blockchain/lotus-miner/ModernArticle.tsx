import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ModernProviderDutyViz from "./viz/ModernProviderDutyViz";

const LOTUS_COMMIT = "29d72bdf77d13e6e3e20264d7a9167feb2a41ab0";
const SEAL = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/storage/pipeline/states_sealing.go`;
const WINDOW = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/storage/wdpost/wdpost_run.go`;
const WINNING = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/storage/winning_prover.go`;
const CURIO = "https://docs.curiostorage.org/design/sealing";

export default function ModernLotusMinerArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6"><header className="space-y-3"><p className="text-sm font-semibold text-primary">Sector 42의 계산을 다른 worker가 이어받아도 엉뚱한 결과를 채택하지 않는 법</p><h2 className="text-3xl font-bold tracking-tight">저장 제공자의 세 작업은 같은 proof 작업처럼 보여도 완료 조건이 서로 다릅니다</h2></header><p className="text-lg leading-8 text-foreground/90"><strong>핵심은 proof bytes가 만들어진 순간을 완료로 보지 않는 것입니다.</strong> Sealing은 sector가 체인 상태에서 활성화될 때까지, WinningPoSt는 유효한 block 후보에 넘길 입력까지, WindowPoSt는 정해 둔 confidence의 제출 receipt까지 추적합니다. 그래서 scheduler는 작업 종류와 입력 문맥, worker lease, 검증 결과, 외부 효과를 하나의 계약처럼 묶어야 합니다.</p><p className="leading-7 text-muted-foreground">Lotus v1.38.3에는 sector state machine과 두 PoSt 경로가 함께 남아 있습니다. Curio는 sealing을 database-backed HarmonyTasks로 나누는 다른 운영 구조를 제공합니다. 구현 모양은 달라도 “어느 입력으로 만든 결과이며 어디까지 끝났는가”라는 질문은 같습니다.</p><ModernProviderDutyViz /><ContentBoundary article="lotus-miner" /></section>

    <section id="sealing-jobs" className="space-y-6"><header><p className="text-sm font-semibold text-primary">01 · Sector 계산과 체인 상태</p><h2 className="mt-2 text-2xl font-bold">PC1·PC2 산출물이 생겨도 sector가 활성화된 것은 아닙니다</h2></header><p>Sector 42에 pieces를 배치하면 PC1이 replica-specific labels를 만들고 PC2가 encoded replica와 CommD·CommR tree artifacts를 완성합니다. 하지만 여기서 끝나지 않습니다.</p><p>PreCommit message가 포함된 뒤 challenge seed를 기다립니다. Commit proof를 생성·검증하고 ProveCommit이 canonical actor state에 반영돼야 sector가 proving set으로 이동합니다. <a className="text-primary hover:underline" href="/cs/blockchain/proofs-porep">PoRep 정본</a>은 cryptographic phase를 설명하고, 이 글은 그 단계들을 scheduler와 chain milestone에 연결합니다.</p><ExplainedFormula question="재시도한 작업이 이전 sector 산출물을 잘못 가져가지 않게 하려면?" idea={<>Revision, miner·sector, 작업 종류, 선행 산출물 digest와 proof profile을 canonical bytes로 묶어 hash합니다.</>} formula={String.raw`J=H(v\parallel m\parallel s\parallel k\parallel u\parallel p)`}
    annotatedFormula={String.raw`J=H(\underbrace{v}_{\text{schema revision}}\parallel\underbrace{m\parallel s}_{\text{f01000, sector 42}}\parallel\underbrace{k}_{\text{PC1/PC2/commit}}\parallel\underbrace{u}_{\text{선행 artifact}}\parallel\underbrace{p}_{\text{proof profile}})`}
    operations={[
      { expression: String.raw`v\parallel m\parallel s\parallel k\parallel u\parallel p`, annotation: ["버전·제공자·sector·작업 종류와", "선행 산출물·proof 설정을", "순서와 길이가 고정된 bytes로 잇습니다"] },
      { expression: String.raw`H(v\parallel m\parallel s\parallel k\parallel u\parallel p)`, annotation: ["이 bytes를 hash한 값이 작업 J입니다.", "sector 42의 PC2가 다른 PC1 digest를 받으면", "J가 달라져 같은 재시도로 취급하지 않습니다"] },
    ]} terms={[{symbol:"J",name:"Job generation",description:"Worker lease와 output receipt가 참조할 immutable job identity입니다."},{symbol:"v",name:"Revision",description:"Scheduler/source와 artifact schema version입니다."},{symbol:"m,s",name:"Miner and sector",description:"예제 miner f01000과 sector 42의 identity입니다."},{symbol:"k",name:"Task kind",description:"PC1, PC2, commit, Window 또는 Winning처럼 분리된 작업 종류입니다."},{symbol:"u",name:"Upstream digest",description:"같은 sector generation의 승인된 선행 artifact입니다."},{symbol:"p",name:"Proof profile",description:"Registered proof type·parameters·network context입니다."}]} assumptions={["각 field는 type·length·domain이 고정된 canonical encoding입니다.","Lease token은 generation과 함께 fencing되며 hash는 output correctness·fsync를 대신하지 않습니다."]} interpretation="같은 크기의 sector라도 u나 s가 다르면 J가 달라야 합니다. 서로 다른 PC1/PC2 generation을 섞으면 chain submission 전에 거절합니다." /><div id="paper-lotus-sealing"><CitationBlock type="code" citeKey={1} source="Lotus sealing pipeline · v1.38.3 commit 29d72bd" href={SEAL}><p><strong>문제:</strong> Sealing artifacts와 precommit/provecommit messages를 recoverable transitions로 연결해야 합니다.</p><p><strong>핵심 기여:</strong> PC1/PC2, precommit wait, seed/commit와 retry handlers의 pinned Lotus 구현을 제공합니다.</p><p><strong>중요 가정:</strong> v1.38.3 actors/proof APIs, network policy와 storage backend를 고정합니다.</p><p><strong>근거 범위:</strong> Pinned lotus-miner sealing state-machine source입니다.</p><p><strong>일반화 금지:</strong> Curio schema, NI-PoRep 전체, fixed sealing time이나 activation 성공을 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="proof-duties" className="space-y-6"><header><p className="text-sm font-semibold text-primary">02 · 두 PoSt 작업</p><h2 className="mt-2 text-2xl font-bold">Winning과 Window는 목적도 입력도 도착점도 다릅니다</h2></header><div className="grid gap-3 md:grid-cols-2"><article className="rounded-lg border border-border p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">WinningPoSt</p><h3 className="mt-2 font-semibold">한 epoch의 block 생산 자격</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">
            Base tipset과 epoch election randomness, miner, challenged sectors를 고정합니다. Proof는 valid block
            candidate의 한 입력일 뿐 message deadline 전체를 유지하는 증명이 아닙니다.
          </p></article><article className="rounded-lg border border-border p-5"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">WindowPoSt</p><h3 className="mt-2 font-semibold">Deadline sector set의 지속 보관</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">
            고정할 것은 deadline·partition snapshot과 challenge randomness, ordered sectors/CommR, skips/faults입니다.
            추적은 proof message inclusion까지 갑니다.
          </p></article></div><p>
            Wrong type이나 epoch/deadline, randomness, sector order를 하나씩 바꿔 넣으면 independent verifier가 전부 거절해야
            합니다.
          </p><p>
            Winning proof generation이 성공했다고 block assembly·propagation·selection까지 성공한 것은 아닙니다. Window
            proof generation 성공 역시 submission·canonical inclusion·confidence로 확대하지 않습니다.
          </p><div id="paper-lotus-winningpost"><CitationBlock type="code" citeKey={2} source="Lotus WinningPoSt prover · v1.38.3 commit 29d72bd" href={WINNING}><p><strong>문제:</strong> Election randomness에서 challenged sectors와 Winning proof를 계산해야 합니다.</p><p><strong>핵심 기여:</strong> Winning sector challenge와 GenerateWinningPoSt 호출 adapter를 제공합니다.</p><p><strong>중요 가정:</strong> Winning profile, miner, eligible sectors, chain base/randomness와 proof backend를 고정합니다.</p><p><strong>근거 범위:</strong> Pinned WinningPoSt prover adapter behavior입니다.</p><p><strong>일반화 금지:</strong> Election 승리, block assembly·inclusion, Window maintenance나 fixed latency를 보장하지 않습니다.</p></CitationBlock></div><div id="paper-lotus-windowpost"><CitationBlock type="code" citeKey={3} source="Lotus WindowPoSt runner · v1.38.3 commit 29d72bd" href={WINDOW}><p><strong>문제:</strong> Deadline snapshot·randomness·partitions·proof를 chain submission에 연결해야 합니다.</p><p><strong>핵심 기여:</strong> Sector checks, Window proof generation/verification, batching과 message preparation/submission을 구현합니다.</p><p><strong>중요 가정:</strong> Network version, deadline state, proof type, miner, wallet/mpool과 storage availability를 고정합니다.</p><p><strong>근거 범위:</strong> Pinned WindowPoSt runner implementation입니다.</p><p><strong>일반화 금지:</strong> WinningPoSt, all reorg recovery, fixed deadline success나 future architecture를 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="scheduler" className="space-y-6"><header><p className="text-sm font-semibold text-primary">03 · 마감 시간과 재시도</p><h2 className="mt-2 text-2xl font-bold">평균 계산 시간이 아니라 체인 확인까지 남은 여유를 봅니다</h2></header><p>
            Worker A의 lease가 만료되면 worker B가 같은 job을 가져갈 수 있습니다. old lease 결과는 fencing token으로 거절합니다. Output에는
            content digest와 completion marker가 붙고 chain message는 job generation을 idempotency key로 씁니다. Retry
            전에는 actor/mpool을 조회해 이미 포함됐거나 replacement 중인 effect를 확인합니다.
          </p><ExplainedFormula question="Deadline 전에 실제로 남은 운영 여유는 얼마일까?" idea={<>마감까지 남은 시간에서 대기·storage 읽기·proof·제출·체인 확인과 장애 대비 시간을 모두 뺍니다.</>} formula={String.raw`S=t_{close}-t_{now}-T_q-T_r-T_p-T_s-T_c-R`}
    annotatedFormula={String.raw`S=\underbrace{t_{close}-t_{now}}_{\text{deadline까지 120분}}\underbrace{-T_q-T_r-T_p-T_s-T_c}_{\text{5 stage 소요}}\underbrace{-R}_{\text{운영 reserve}}`}
    operations={[
      { expression: String.raw`t_{close}-t_{now}`, annotation: ["pinned chain clock 기준 deadline","close까지 남은 시간. 예제는 120분"] },
      { expression: String.raw`T_q-T_r-T_p-T_s-T_c-R`, annotation: ["queue·read·prove·submit·","confidence·reserve를 차례로 뺍니다.","10+15+25+5+10+20=85분, S=35분"] },
    ]} terms={[{symbol:"S",name:"Deadline slack",description:"모든 필수 stage와 reserve 뒤 남는 시간입니다."},{symbol:"t_{close}-t_{now}",name:"Remaining window",description:"Pinned chain clock에서 deadline close까지의 시간입니다."},{symbol:"T_q,T_r",name:"Queue and read",description:"Task admission/lease와 challenged sector storage read 시간입니다."},{symbol:"T_p,T_s",name:"Prove and submit",description:"Proof generation/verification과 message preparation·send 시간입니다."},{symbol:"T_c",name:"Confidence",description:"Inclusion과 운영 policy의 confirmation 대기입니다."},{symbol:"R",name:"Operations reserve",description:"Retry·reorg·worker/storage fault를 위한 명시적 여유입니다."}]} assumptions={["실제 deadline/profile과 stage overlap을 pinned network·scheduler에서 wall time으로 측정합니다.","예제 숫자는 산술 설명이며 Filecoin protocol 상수가 아닙니다."]} interpretation="120분에서 10+15+25+5+10+20=85분을 빼면 S=35분입니다. S≤0이면 평균 proof가 빨라도 release할 수 없습니다." /><div id="paper-curio-sealing"><CitationBlock type="code" citeKey={4} source="Curio sealing design · official docs" href={CURIO}><p><strong>문제:</strong> 여러 provider nodes가 sealing stages를 durable task system으로 분산해야 합니다.</p><p><strong>핵심 기여:</strong> HarmonyTasks와 database-backed sealing pipeline design을 설명합니다.</p><p><strong>중요 가정:</strong> 2026-11-01에 확인한 문서와 실제 Curio commit·schema·deployment topology를 함께 고정합니다.</p><p><strong>근거 범위:</strong> Curio sealing task orchestration design입니다.</p><p><strong>일반화 금지:</strong> Legacy lotus-miner state 호환, HA 보장 또는 fixed throughput을 뜻하지 않습니다.</p></CitationBlock></div></section>

    <section id="release-gate" className="space-y-6"><header><p className="text-sm font-semibold text-primary">04 · 배포와 되돌리기</p><h2 className="mt-2 text-2xl font-bold">네 가지 실패를 견뎌야 채택합니다</h2></header><p>
            Canary가 고정하는 것은 source/config/database schema와 registered proof·parameters, miner/sector
            inventory, chain head입니다.
          </p><p>
            그 위에서 서로 다른 sectors의 PC1/PC2를 섞고 worker loss 직후 stale lease output을 늦게 도착시킵니다. Winning/Window
            type과 randomness, snapshot을 바꾸고 proof submission 직후 reorg도 일으킵니다. 각 실패는 external effect가 나가기 전에
            typed reason으로 거절되거나 같은 generation으로 안전하게 retry돼야 합니다.
          </p><p>
            같은 sector/profile에서 independent proof verification과 CommD/CommR·actor state parity를 기록합니다.
            queue/read/prove/submit/confidence stage time과 p50/p99, slack도 함께 남깁니다.
          </p><p>
            Scheduler candidate가
            duplicate chain message나 stale artifact acceptance, deadline reserve 부족, restart parity 실패를 보이면 이전
            compatible binary·database schema와 task routing으로 rollback합니다.
          </p><aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">이 글을 읽은 뒤 확인할 것:</strong> Sector 작업 식별자에 넣을 값, sealing부터 activation까지의 경계, Winning과 Window의 차이, 35분 slack 계산, proof 생성과 chain 완료가 다른 이유, 잘못 섞인 산출물과 오래된 lease를 거절하는 지점을 설명할 수 있어야 합니다.</aside></section>
  </article>;
}
