import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { IpcFinalityViz } from "./IpcFinalityViz";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { ipcTree } from "./fileTrees";

const PARENT_CHILD = "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/docs-gitbook/concepts/subnets/parent-child-interactions.md";
const MEMBERSHIP = "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/specs/subnet-validator-membership.md";
const CHECKPOINT = "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/CheckpointingFacet.sol";
const FINALITY = "https://github.com/consensus-shipyard/ipc/blob/bcd7c0d10a93a95b6d28954d482169da4b12479d/contracts/contracts/gateway/router/TopDownFinalityFacet.sol";

export default function ModernFilecoinIpc() {
  const sidebar = useCodeSidebar();
  return <>
  <article className="space-y-14">
    <section id="overview" className="space-y-6"><header className="space-y-3"><p className="text-sm font-semibold text-primary">Parent P 아래 child subnet C에서 Alice가 Bob에게 보내는 한 cross-network message</p><h2 className="text-3xl font-bold tracking-tight">IPC는 chain을 복제하는 기능이 아니라 parent finality와 child checkpoint를 서로 다른 방향으로 운반하는 subnet protocol이다</h2></header><p className="text-lg leading-8 text-foreground/90">
            InterPlanetary Consensus(IPC)의 subnet은 자체 validator와 state를 가진 별도 chain입니다. Child validator는 child
            consensus뿐 아니라 parent finality를 관찰하고 bottom-up checkpoint에는 child state commitment와 queued
            messages를 power quorum으로 묶습니다. local child finality, checkpoint quorum, parent transaction
            inclusion, destination execution은 서로 다른 receipt입니다. Parent가 존재한다고 child의 모든 safety·availability가
            자동 상속되지는 않습니다.
          </p><IpcFinalityViz /><div className="not-prose flex flex-wrap gap-3"><CodeViewButton label="subnet.go — Create·Join·Checkpoint" onClick={() => sidebar.open("ipc-subnet", codeRefs["ipc-subnet"])} /></div><ContentBoundary article="filecoin-ipc" /><div id="paper-ipc-parent-child"><CitationBlock type="code" citeKey={1} source="IPC parent–child interactions · commit bcd7c0d" href={PARENT_CHILD}><p><strong>문제:</strong> Parent와 child가 validator changes, cross-network messages와 state checkpoints를 양방향으로 전달해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned IPC documentation은 checkpointing, parent finality, top-down queue와 bottom-up propagation의 역할을 구분합니다.</p><p><strong>중요 가정:</strong> commit bcd7c0d의 docs와 matching contracts/Fendermint deployment configuration을 함께 고정합니다.</p><p><strong>근거 범위:</strong> 해당 IPC repository snapshot의 parent–child architecture 설명에 한정합니다.</p><p><strong>일반화 금지:</strong> Architecture가 모든 subnet의 경제적 안전성, parent failure 내성 또는 고정 cross-network latency를 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="subnet-artifact" className="space-y-6"><header><p className="text-sm font-semibold text-primary">01 · Subnet artifact</p><h2 className="mt-2 text-2xl font-bold">Subnet ID·genesis·validator power와 gateway addresses를 하나의 boot artifact로 묶는다</h2></header><p>
            Subnet을 “새 RPC URL”로만 다루면 어느 parent 아래 어떤 validator set이 합의하는지 잃습니다. Boot receipt에는 parent subnet
            ID, route, chain ID, genesis state/app hash, permission mode를 기록합니다. 여기에 ordered validators와
            power, gateway/subnet actor addresses, contract commit와 node binary/config digest를 함께 남깁니다.
            Bootstrap 전 staged genesis changes와 bootstrap 후 top-down/bottom-up으로 반영되는 power changes는 구분해 둡니다.
          </p><ExplainedFormula question="한 validator update가 child quorum에 들어갔는지 어떻게 확인할까?" idea={<>서명자 수가 아니라 현재 admitted validator set의 voting power 합을 threshold 함수와 비교합니다.</>} formula={String.raw`W_{sig}=\sum_{v\in V_{valid}}w_v,\qquad accept\iff W_{sig}\ge Q(P)`}
    annotatedFormula={String.raw`W_{sig}=\underbrace{\sum_{v\in V_{valid}}w_v,\qquad accept\iff W_{sig}\ge Q(P)}_{\text{허용 경계 판정}}`}
    operations={[
      { expression: String.raw`\sum_{v\in V_{valid}}w_v,\qquad accept\iff W_{sig}\ge Q(P)`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","서명자 수가 아니라 현재 admitted validator","set의 voting power 합을 threshold 함수와","비교합니다."] },
    ]} terms={[{symbol:"W_{sig}",name:"Signed power",description:"유효한 서로 다른 validator signatures의 voting power 합입니다."},{symbol:"V_{valid}",name:"Valid signers",description:"해당 height·membership revision에 속하고 signature 검증을 통과한 validators입니다."},{symbol:"w_v",name:"Validator power",description:"Validator v의 admitted voting power입니다."},{symbol:"P",name:"Total power",description:"같은 membership revision에서 active validators의 전체 power입니다."},{symbol:"Q(P)",name:"Quorum function",description:"Deployed IPC contract·consensus profile이 정한 required power입니다."},{symbol:"accept",name:"Quorum acceptance",description:"Exact threshold를 만족할 때만 1입니다."}]} assumptions={["Duplicate signer를 한 번만 세고 membership revision과 checkpoint height를 고정합니다.","Q(P)의 구체적 반올림·strictness는 deployed revision에서 읽으며 여기서 임의로 2/3으로 고정하지 않습니다."]} interpretation="Validator가 3명이어도 power가 80·10·10이면 두 명이라는 수만으로 quorum을 판단할 수 없습니다. Exact admitted power와 profile을 기록합니다." /><div id="paper-ipc-membership"><CitationBlock type="code" citeKey={2} source="IPC validator membership specification · commit bcd7c0d" href={MEMBERSHIP}><p><strong>문제:</strong> Parent에서 시작한 validator power changes를 child 기존 validator quorum이 확인하고 다시 parent에 확정해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned specification은 staged genesis, top-down capture, child acknowledgement와 bottom-up checkpoint round trip을 설명합니다.</p><p><strong>중요 가정:</strong> Exact permission mode, active validator limit, deployed gateway/subnet actor revision과 consensus membership을 사용합니다.</p><p><strong>근거 범위:</strong> commit bcd7c0d의 validator membership design snapshot에 한정합니다.</p><p><strong>일반화 금지:</strong> 문서의 design이 모든 배포의 liveness, permissionless security 또는 고정 validator count를 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="topdown" className="space-y-6"><header><p className="text-sm font-semibold text-primary">02 · Parent finality and top-down receipt</p><h2 className="mt-2 text-2xl font-bold">Child가 parent finality height·hash에 합의한 뒤 그 구간의 top-down messages를 실행한다</h2></header><p>
            Parent finality proposal을 관찰했다는 사실과 child consensus가 이를 block execution에 commit했다는 사실은 다릅니다.
            Receipt에는 old/new parent height·block hash, ancestry check, captured top-down queue range,
            validator changes, child consensus block과 apply result를 남기고 낮은 height, 같은 height의 다른 hash,
            ancestry가 끊긴 proposal은 거절합니다.
          </p><ExplainedFormula question="Parent finality update를 어떤 순서 조건으로 받아들일까?" idea={<>Height가 앞으로 가는 것뿐 아니라 기존 committed hash의 descendant인지 함께 검사합니다.</>} formula={String.raw`F_{new}\succ F_{old}\iff h_{new}>h_{old}\land Ancestor(H_{old},H_{new})`}
    annotatedFormula={String.raw`F_{new}\succ F_{old}\iff h_{new}>\underbrace{h_{old}\land Ancestor(H_{old},H_{new})}_{\text{판정 조건 결합}}`}
    operations={[
      { expression: String.raw`h_{old}\land Ancestor(H_{old},H_{new})`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","Height가 앞으로 가는 것뿐 아니라 기존 committed","hash의 descendant인지 함께 검사합니다."] },
    ]} terms={[{symbol:"F_{new}",name:"New parent finality",description:"Child가 새로 commit하려는 parent checkpoint입니다."},{symbol:"F_{old}",name:"Previous finality",description:"Child state에 이미 저장된 parent checkpoint입니다."},{symbol:"h_{new}",name:"New height",description:"새 parent block height입니다."},{symbol:"h_{old}",name:"Old height",description:"기존 committed parent height입니다."},{symbol:"H_{new}",name:"New hash",description:"새 parent block identifier입니다."},{symbol:"H_{old}",name:"Old hash",description:"기존 parent block identifier입니다."},{symbol:"Ancestor",name:"Ancestry predicate",description:"Old block이 new block의 canonical ancestor이면 참입니다."}]} assumptions={["Parent finality source와 confidence rule은 deployment config에서 명시합니다.","Height 증가만으로 reorg 안전성을 증명하지 않으며 hash ancestry evidence가 필요합니다."]} interpretation="높이 120을 저장한 뒤 121이라는 숫자만 온 경우에는 부족합니다. 121 block이 저장된 120 hash를 잇는지 확인해야 합니다." /><div id="paper-ipc-topdown"><CitationBlock type="code" citeKey={3} source="IPC TopDownFinalityFacet · commit bcd7c0d" href={FINALITY}><p><strong>문제:</strong> Parent finality와 그에 연결된 validator changes를 child gateway state에 순서 있게 적용해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned contract source는 parent finality commit과 queued power changes 적용의 system-actor boundary를 구현합니다.</p><p><strong>중요 가정:</strong> Matching diamond facets, LibGateway storage layout, system actor caller와 current membership state를 사용합니다.</p><p><strong>근거 범위:</strong> 해당 Solidity snapshot의 gateway state transition에 한정합니다.</p><p><strong>일반화 금지:</strong> Contract call 성공이 parent RPC truth, child consensus finality 또는 destination application success를 혼자 증명하지 않습니다.</p></CitationBlock></div></section>

    <section id="bottomup" className="space-y-6"><header><p className="text-sm font-semibold text-primary">03 · Bottom-up checkpoint receipt</p><h2 className="mt-2 text-2xl font-bold">Child commitment에 power quorum이 형성된 뒤 relayer가 parent에 제출하고 parent inclusion을 따로 확인한다</h2></header><p>
            Bottom-up receipt에는 child subnet ID, checkpointed height·block hash, state commitment breakdown,
            message batch commitment를 담습니다. activity/validator changes, signer bitmap·powers, relayer
            transaction와 parent inclusion/finality도 같은 자리에 둡니다. Relayer는 이미 형성된 증거를 parent로 운반합니다. 두 relayer가
            같은 checkpoint를 제출해도 idempotency key로 외부 효과는 한 번만 냅니다.
          </p><ExplainedFormula question="Cross-network message의 완료 시간은 왜 한 숫자로 단정할 수 없을까?" idea={<>각 독립 단계의 대기·처리 시간을 더하고 어느 단계까지를 완료로 부르는지 receipt에 명시합니다.</>} formula={String.raw`T_{xnet}=T_{local}+T_{quorum}+T_{relay}+T_{parent}+T_{dest}`}
    annotatedFormula={String.raw`T_{xnet}=\underbrace{T_{local}+T_{quorum}+T_{relay}+T_{parent}+T_{dest}}_{\text{Checkpoint quorum 계산}}`}
    operations={[
      { expression: String.raw`T_{local}+T_{quorum}+T_{relay}+T_{parent}+T_{dest}`, annotation: ["Checkpoint quorum이(가) 식의 결과에 기여하는","방식을 계산합니다.","각 독립 단계의 대기·처리 시간을 더하고 어느 단계까지를","완료로 부르는지 receipt에 명시합니다."] },
    ]} terms={[{symbol:"T_{xnet}",name:"End-to-end time",description:"Local submission부터 chosen destination effect까지의 wall time입니다."},{symbol:"T_{local}",name:"Local inclusion",description:"Source subnet에서 message가 실행·queue되는 시간입니다."},{symbol:"T_{quorum}",name:"Checkpoint quorum",description:"Checkpoint가 만들어지고 required validator power를 모으는 시간입니다."},{symbol:"T_{relay}",name:"Relay delay",description:"Eligible relayer가 parent transaction을 제출할 때까지의 시간입니다."},{symbol:"T_{parent}",name:"Parent inclusion",description:"Parent gateway가 checkpoint를 포함·확정하는 시간입니다."},{symbol:"T_{dest}",name:"Destination execution",description:"다음 subnet에서 message를 받아 최종 effect를 만드는 시간입니다."}]} assumptions={["각 time은 같은 message ID와 monotonic timestamps로 측정합니다.","Checkpoint period, load, fees, reorg와 relayer availability가 바뀌면 값도 바뀝니다."]} interpretation="Child quorum까지 8초여도 relayer가 40초 대기하면 parent receipt는 최소 48초 이후입니다. Source success를 destination success로 표시하면 안 됩니다." /><div id="paper-ipc-checkpoint"><CitationBlock type="code" citeKey={4} source="IPC CheckpointingFacet · commit bcd7c0d" href={CHECKPOINT}><p><strong>문제:</strong> Cryptographically verified child checkpoint를 parent gateway state와 message/activity batches에 반영해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned facet은 system-actor-only checkpoint commit, duplicate/height guards와 state/message/activity events를 구현합니다.</p><p><strong>중요 가정:</strong> Signature/quorum validation은 caller path에서 이미 수행되고 matching gateway storage layout과 contract facets를 사용합니다.</p><p><strong>근거 범위:</strong> Parent gateway의 commitCheckpoint side-effect snapshot에 한정합니다.</p><p><strong>일반화 금지:</strong> Facet 하나가 child quorum correctness, relayer liveness, parent finality 또는 destination execution을 모두 보장하지 않습니다.</p></CitationBlock></div></section>

    <section id="release-gate" className="space-y-6"><header><p className="text-sm font-semibold text-primary">04 · Cross-network release gate</p><h2 className="mt-2 text-2xl font-bold">Local·quorum·relay·parent·destination receipt를 분리하고 실패 지점부터 재개한다</h2></header><p>
            Fixed example에 wrong subnet route, stale membership, duplicate signer, conflicting checkpoint
            hash를 주입합니다. skipped parent height, relayer duplicate, insufficient fee, parent reorg와 destination
            revert도 함께 넣습니다. Release 전에는 source/destination contract commits, genesis digest, validator
            revision과 finality policy를 pin하고 metrics에 단계별 queue/time과 rejection reason을 남깁니다. 실패하면 이전
            contract/node manifest로 rollback하되 already-parent-included message는 재발행하지 않고 destination delivery만
            idempotently resume합니다.
          </p><ExplainedFormula question="Cross-network effect를 최종 완료로 표시할 조건은 무엇일까?" idea={<>서로 다른 receipt 다섯 개를 message identity로 연결해 모두 참일 때만 완료합니다.</>} formula={String.raw`A=L\land Q\land R\land P\land D`}
    annotatedFormula={String.raw`A=\underbrace{L\land Q\land R\land P\land D}_{\text{판정 조건 결합}}`}
    operations={[
      { expression: String.raw`L\land Q\land R\land P\land D`, annotation: ["필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.","서로 다른 receipt 다섯 개를 message","identity로 연결해 모두 참일 때만 완료합니다."] },
    ]} terms={[{symbol:"A",name:"Application acceptance",description:"사용자에게 완료를 표시할 수 있으면 1입니다."},{symbol:"L",name:"Local receipt",description:"Source subnet inclusion·execution과 queue message ID가 유효하면 1입니다."},{symbol:"Q",name:"Quorum receipt",description:"Exact membership에서 checkpoint power quorum이 유효하면 1입니다."},{symbol:"R",name:"Relay receipt",description:"Parent transaction이 expected checkpoint를 운반하면 1입니다."},{symbol:"P",name:"Parent receipt",description:"Gateway commit이 required confidence까지 canonical이면 1입니다."},{symbol:"D",name:"Destination receipt",description:"Destination이 같은 message를 한 번 실행하고 effect를 기록하면 1입니다."}]} assumptions={["모든 receipt가 같은 canonical subnet route와 message nonce/hash를 사용합니다.","Finality confidence와 retry ownership은 deployment policy에 명시합니다."]} interpretation="Q=1이어도 relayer transaction이 reorg되면 P=0이고 A=0입니다. Retry는 누락된 단계부터 하며 이미 완료한 external effect를 중복 실행하지 않습니다." /><aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Article-only 10/10:</strong> subnet boot artifact, power quorum, parent finality, top-down/bottom-up 비대칭, checkpoint·relayer·destination receipt, latency와 rollback을 이 글만으로 답할 수 있습니다.</aside></section>
  </article>
  <CodeSidebar
    codeRefKey={sidebar.codeRefKey}
    codeRef={sidebar.codeRef}
    onClose={sidebar.close}
    onNavigate={sidebar.navigate}
    codeRefs={codeRefs}
    fileTrees={{ ipc: ipcTree }}
    projectMetas={{
      ipc: {
        id: "ipc",
        label: "IPC · Go",
        badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700",
      },
    }}
  />
  </>;
}
