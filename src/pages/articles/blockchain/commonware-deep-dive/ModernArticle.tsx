import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { PrimitiveCompositionViz, ReleaseParityViz } from "./viz/ModernCommonwareOverviewViz";

export default function ModernCommonwareOverviewArticle(){return <article className="space-y-14">
  <section id="overview" className="space-y-6">
    <header className="space-y-3"><p className="text-sm font-semibold text-primary">Commonware · composable Rust primitives</p><h2 className="text-3xl font-bold tracking-tight">Commonware는 완성된 blockchain 하나가 아니라, 필요한 runtime·network·consensus·storage를 조립하는 부품 모음이다</h2></header>
    <p className="text-lg leading-8 text-foreground/90">Alice가 Bob에게 10을 보내는 <code>pay(Alice,Bob,10)</code> 요청을 생각해 보겠습니다. Application은 payload bytes를 만들고, P2P는 known peer에게 전달하며, Simplex는 payload digest의 순서를 합의하고, storage는 실행 결과를 authenticated root에 남깁니다. Commonware가 제공하는 것은 이 책임들을 한 framework가 숨기는 방식이 아니라 trait와 actor boundary로 이어 붙일 수 있는 primitives입니다.</p>
    <p>따라서 “Commonware를 사용했다”는 말만으로 합의 알고리즘, signature scheme, database variant, timeout과 durability가 정해지지는 않습니다. 실제 안전성은 선택한 primitive의 안정성 등급, exact crate version, application의 deterministic validation, 그리고 component 사이 receipt contract를 함께 봐야 합니다.</p>
    <PrimitiveCompositionViz />
    <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>먼저 기억할 경계:</strong> Network가 bytes를 받았다는 사실, consensus가 digest를 finalization했다는 사실, application이 bytes를 실행하고 durable state를 만든 사실은 서로 다른 완료 상태입니다.</aside>
  </section>
  <section id="composition" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">01 · primitive composition</p><h2 className="mt-2 text-2xl font-bold">Runtime Context가 자원을 주고, actor와 trait가 소유권을 드러낸다</h2></header>
    <p>Runtime은 task spawn, clock, random source, network와 storage 같은 실행 능력을 <code>Context</code>로 제공합니다. Application actor는 child context로 namespace를 나누고, consensus의 <code>Automaton</code>은 propose·verify를, <code>Relay</code>는 payload broadcast를, storage batch는 state mutation을 담당합니다. 인터페이스를 바꿔 끼울 수 있다는 말은 의미 계약까지 자동 호환된다는 뜻이 아닙니다.</p>
    <p>예를 들어 consensus는 payload digest만 알고 full bytes의 전달은 Relay가 맡습니다. Notarization을 보았더라도 node가 bytes를 복구하지 못했다면 application validation이나 execution은 아직 끝나지 않았습니다. 반대로 local DB에 payload가 있다고 해서 committee ordering evidence가 생기지도 않습니다.</p>
    <ExplainedFormula question="조립한 node가 같은 입력에 같은 결과를 냈다고 언제 말할 수 있는가?" idea={<>Seed 하나만 같다고 충분하지 않습니다. Pinned code·config에서 외부 event 순서까지 같게 재생하고 observable digest들을 모두 비교합니다.</>} formula={String.raw`\begin{aligned}I&=(v,c,s,E)\\D&=H(M\parallel S\parallel R)\\release&=[D_1=D_2]\end{aligned}`}
    annotatedFormula={String.raw`\begin{aligned}I&=\underbrace{(v,c,s,E)}_{\text{version 계산}}\\D&=\underbrace{H(M\parallel S\parallel R)}_{\text{오른쪽 항으로 결과 계산}}\\release&=\underbrace{[D_1=D_2]}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
    operations={[
      { expression: String.raw`(v,c,s,E)`, annotation: ["version이(가) 식의 결과에 기여하는 방식을 계산합니다.","Seed 하나만 같다고 충분하지 않습니다."] },
      { expression: String.raw`H(M\parallel S\parallel R)`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Seed 하나만 같다고 충분하지 않습니다."] },
      { expression: String.raw`[D_1=D_2]`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","Seed 하나만 같다고 충분하지 않습니다."] },
    ]} terms={[{symbol:"v",name:"version",description:"Commonware exact tag와 application revision입니다."},{symbol:"c",name:"configuration",description:"Committee·timeouts·storage·crypto profile입니다."},{symbol:"s",name:"seed",description:"결정론적 scheduler와 random source의 seed입니다."},{symbol:"E",name:"event trace",description:"Packet·timer·crash·restart 입력의 순서입니다."},{symbol:"M,S,R",name:"observables",description:"Message log, state root와 client receipt입니다."}]} assumptions={["Task가 외부 wall clock·OS randomness를 몰래 읽지 않습니다.","Serialization과 digest domain이 version에 고정됩니다.","같은 fault schedule을 두 run에 적용합니다.","Digest 일치는 protocol correctness proof를 대신하지 않습니다."]} interpretation="v2026.7.0, 같은 config·seed 7·event 40개를 두 번 재생해 message/state/receipt digest가 모두 같으면 parity gate를 통과합니다. State만 같고 receipt가 다르면 통과시키지 않습니다." />
    <div id="paper-commonware-runtime"><CitationBlock source="Commonware monorepo · v2026.7.0 runtime and primitives" citeKey={1} type="code" href="https://github.com/commonwarexyz/monorepo/tree/5950bf7179bb0650a57ed58b9e0478822944b335"><p><strong>문제:</strong> Adversarial distributed system을 구성하면서 runtime·crypto·P2P·consensus·storage 책임을 교체 가능하게 유지해야 합니다.</p><p><strong>기여:</strong> Rust primitives, shared runtime traits와 crate별 stability scope를 제공합니다.</p><p><strong>전제:</strong> 2026-08-14 확인한 tag v2026.7.0, commit 5950bf7과 선택한 feature·configuration을 고정합니다.</p><p><strong>근거 범위:</strong> 해당 snapshot의 public crate interfaces, source와 repository stability 표시에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 조립된 application의 합의 안전성·운영 readiness·고정 성능을 Commonware가 자동 보장한다는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>
  <section id="bridge-boundary" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">02 · bridge assembly boundary</p><h2 className="mt-2 text-2xl font-bold">Bridge validator는 wiring의 예시이지 모든 deployment의 표준 구성이 아니다</h2></header>
    <p>Pinned bridge validator source는 runtime context를 만들고, authenticated networking·crypto scheme·Simplex engine과 application logic을 조립하는 concrete example입니다. Alice의 payload는 network admission 뒤 digest로 합의에 들어가고, application은 ordered digest에 맞는 bytes를 확보해 검증·실행해야 합니다. 이 예는 trait들이 어디서 만나는지 보여 주지만 production key custody, external effect, operator policy까지 대신 결정하지 않습니다.</p>
    <p>특히 certificate를 application commit과 혼동하면 안 됩니다. Consensus finalization은 committee가 같은 payload digest에 합의했다는 evidence이고, durable state root는 storage commit 뒤 얻습니다. Bob에게 보낼 client success는 state root와 request id가 crash recovery 뒤에도 재생되는지 확인한 다음 내보냅니다.</p>
    <div id="paper-commonware-bridge"><CitationBlock source="commonware-bridge validator source · v2026.7.0" citeKey={2} type="code" href="https://docs.rs/crate/commonware-bridge/2026.7.0/source/src/bin/validator.rs"><p><strong>문제:</strong> Commonware primitives로 실행 가능한 validator를 어떻게 조립하는지 concrete wiring이 필요합니다.</p><p><strong>기여:</strong> Runtime, authenticated P2P, cryptography, Simplex와 application components의 construction path를 보여 줍니다.</p><p><strong>전제:</strong> commonware-bridge 2026.7.0 source와 그 dependency versions·example configuration을 사용합니다.</p><p><strong>근거 범위:</strong> Example validator의 component assembly와 startup boundary에 한정합니다.</p><p><strong>말하지 않는 것:</strong> 이 예시가 모든 Commonware deployment의 architecture이거나 운영 key·durability·SLA를 완성한다는 뜻은 아닙니다.</p></CitationBlock></div>
  </section>
  <section id="release" className="space-y-6">
    <header><p className="text-sm font-semibold text-primary">03 · failure, replay, release</p><h2 className="mt-2 text-2xl font-bold">Fault를 seed에 넣고 component receipt가 끊기는 지점을 재현한다</h2></header>
    <p>Release fixture는 proposal 전 packet drop, notarization 뒤 payload loss, storage apply 뒤 commit 전 crash, restart 뒤 duplicate request를 따로 넣습니다. 각 실패에서 network receipt, consensus certificate, storage root와 client reply가 어느 단계까지 만들어졌는지 기록해야 합니다. 재시도는 같은 request id를 사용하고, 이미 durable한 state transition은 다시 적용하지 않습니다.</p>
    <ReleaseParityViz />
    <p>Rollback은 client effect가 외부로 나가기 전 candidate artifact를 이전 version으로 되돌리는 절차입니다. 이미 Bob에게 성공을 알렸다면 database를 조용히 되감는 대신 idempotent replay나 명시적 보상 절차가 필요합니다. Commonware deterministic runtime은 재현 도구이며 real network의 모든 timing을 증명하는 모델은 아닙니다.</p>
    <h3 className="text-xl font-semibold">이 글만으로 확인할 10가지</h3><p>기초 6문제는 primitive 구분, fixed request trace, digest와 bytes, certificate와 state, version pin, parity input을 묻습니다. 심화 4문제는 missing payload, crash window, duplicate replay와 release rollback을 설계하게 합니다.</p>
  </section>
</article>}
