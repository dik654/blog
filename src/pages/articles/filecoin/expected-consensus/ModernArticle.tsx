import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { ecTree } from "./fileTrees";
import {
  BlockValidationViz,
  ExpectedConsensusTraceViz,
  HeadChangeTraceViz,
  SortitionDistributionViz,
  TipsetCompatibilityViz,
} from "./viz/ModernExpectedConsensusViz";

const LOTUS_COMMIT = "29d72bdf77d13e6e3e20264d7a9167feb2a41ab0";
const LOTUS_SOURCE = `https://github.com/filecoin-project/lotus/tree/${LOTUS_COMMIT}`;
const ELECTION_SOURCE = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/types/electionproof.go`;
const TIPSET_SOURCE = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/types/tipset.go`;
const VALIDATION_SOURCE = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/consensus/filcns/filecoin.go`;
const WEIGHT_SOURCE = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/consensus/filcns/weight.go`;
const EC_SPEC = "https://spec.filecoin.io/algorithms/expected_consensus/";
const FIP_0086 = "https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md";
const GO_F3 = "https://github.com/filecoin-project/go-f3/blob/v0.8.15/README.md";

export default function ModernExpectedConsensusArticle() {
  const sidebar = useCodeSidebar();

  return <>
    <article className="space-y-14">
      <section id="overview" className="scroll-mt-24 space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">한 송금의 전체 경로</p>
          <h2 className="text-3xl font-bold tracking-tight">Expected Consensus는 제안 자격, 유효한 묶음, 현재 체인 선택을 차례로 결정합니다</h2>
        </header>
        <ExpectedConsensusTraceViz />
        <p className="text-lg leading-8 text-foreground/90">
          Alice가 Bob에게 5 FIL을 보내는 메시지를 냈다고 하겠습니다. 저장 제공자는 자신의 유효 저장 기여도인 QAP와 검증 가능한 난수인 VRF 결과로 이번 epoch의 당첨 횟수를 얻습니다. 당첨된 제공자가 block을 만들면 노드는 같은 부모를 가리키는 blocks를 tipset 후보로 묶고, 각 block을 검증한 뒤 누적 weight가 큰 유효 분기를 현재 EC head로 선택합니다.
        </p>
        <p>
          이 글이 답할 질문은 하나입니다. <strong>메시지를 받은 뒤 어떤 증거가 쌓여야 “현재 체인에 포함됐다”와 “되돌릴 수 없게 확정됐다”를 구분할 수 있습니까?</strong> 메시지 접수, block 생성, tipset 구성, 전체 검증, 상태 실행, EC head, F3 확정은 서로 다른 상태입니다.
        </p>
        <ContentBoundary article="expected-consensus" />
      </section>

      <section id="sortition" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · 선출</p>
          <h2 className="mt-2 text-2xl font-bold">QAP 지분을 epoch별 당첨 횟수의 확률 분포로 바꿉니다</h2>
        </header>
        <SortitionDistributionViz />
        <p>
          Provider의 power가 네트워크의 10%라고 해서 열 epoch마다 정확히 한 번 당첨되는 것은 아닙니다. Protocol이 epoch당 기대하는 전체 leader 수를 <code>E</code>라 하면, 한 provider의 Poisson rate는 <code>E × p/P</code>입니다. VRF proof를 hash한 256비트 값을 이 분포의 inverse CDF에 넣어 정수 <code>WinCount</code>를 얻습니다.
        </p>
        <ExplainedFormula
          question="QAP 지분이 p/P인 provider의 epoch별 당첨 횟수는 어떻게 정해집니까?"
          idea={<>전체 기대 leader 수 E에 provider의 QAP 지분 p/P를 곱해 Poisson rate λ를 만듭니다. VRF 결과는 이 분포에서 재현 가능한 지점을 고릅니다.</>}
          formula={String.raw`\lambda=E\frac{p}{P},\qquad \Pr[J=j]=e^{-\lambda}\frac{\lambda^j}{j!}`}
          annotatedFormula={String.raw`\lambda=\underbrace{E}_{\text{epoch당 전체 기대 leader}}\underbrace{\frac{p}{P}}_{\text{provider QAP 지분}},\qquad \Pr[J=j]=\underbrace{e^{-\lambda}\frac{\lambda^j}{j!}}_{\text{j회 당첨 확률}}`}
          operations={[
            { expression: String.raw`E\frac{p}{P}`, annotation: ["E=5, p/P=0.1이면 λ=0.5", "같은 state 기준 시점의 p와 P를 사용"] },
            { expression: String.raw`e^{-0.5}`, annotation: ["0회 확률 ≈ 0.6065", "당첨되지 않는 epoch가 가장 많음"] },
            { expression: String.raw`e^{-0.5}\frac{0.5^j}{j!}`, annotation: ["1회 ≈ 0.3033, 2회 ≈ 0.0758", "VRF hash가 inverse CDF 구간을 선택"] },
          ]}
          terms={[
            { symbol: "E", name: "전체 기대 leader 수", description: "한 epoch에서 네트워크 전체가 기대하는 당첨 수입니다." },
            { symbol: "p", name: "provider QAP", description: "해당 lookback state에서 이 provider가 가진 quality-adjusted power입니다." },
            { symbol: "P", name: "network QAP", description: "같은 state 기준 시점의 eligible quality-adjusted power 합입니다." },
            { symbol: "J", name: "WinCount", description: "Election proof가 주장하고 모든 검증 노드가 다시 계산하는 정수 당첨 횟수입니다." },
          ]}
          assumptions={[
            "p와 P는 같은 lookback state에서 읽고 P는 0보다 큽니다.",
            "Randomness domain, miner address, epoch와 VRF proof가 검증 대상에 결속됩니다.",
            "표시한 확률은 이해를 위한 실수 근삿값이며 consensus 산술은 Lotus의 Q.256 정수 구현을 따릅니다.",
            "WinCount가 1 이상이어도 block 전체 유효성이나 chain 포함은 아직 증명되지 않았습니다.",
          ]}
          interpretation="E=5이고 지분이 10%이면 λ=0.5입니다. 한 epoch에 0회 당첨될 확률이 약 60.65%이므로 지분을 고정된 순번표처럼 해석하면 안 됩니다."
        />
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton label="ComputeWinCount · Q.256 inverse CDF" onClick={() => sidebar.open("ec-compute-win-count", codeRefs["ec-compute-win-count"])} />
          <CodeViewButton label="winnerCheck · VRF와 WinCount 대조" onClick={() => sidebar.open("ec-winner", codeRefs["ec-winner"])} />
        </div>
        <div id="paper-lotus-election-v1383">
          <CitationBlock source="Lotus v1.38.3 · electionproof.go" citeKey={1} type="code" href={ELECTION_SOURCE}>
            <p><strong>문제:</strong> VRF proof와 provider/network power를 모든 노드가 같은 정수 WinCount로 바꿔야 합니다.</p>
            <p><strong>핵심 기여:</strong> Q.256 Poisson inverse CDF, BLAKE2b VRF hash와 <code>MaxWinCount</code> 상한을 구현합니다.</p>
            <p><strong>중요 가정:</strong> Lotus v1.38.3 commit 29d72bd, 같은 power 기준 상태와 <code>BlocksPerEpoch</code>를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 해당 revision의 당첨 횟수 계산 코드에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Beacon availability, provider 자격, WinningPoSt와 block 전체 유효성을 이 함수 하나가 보장하지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="tipset-weight" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · 후보와 선택</p>
          <h2 className="mt-2 text-2xl font-bold">같은 부모에서 실행할 수 있는 blocks만 묶고, 모두 검증한 뒤 weight를 비교합니다</h2>
        </header>
        <TipsetCompatibilityViz />
        <p>
          Lotus v1.38.3의 <code>NewTipSet</code> 생성자는 block이 하나 이상인지, ticket이 있는지, 높이와 parents가 같은지 검사하고 ticket 값과 CID로 결정적 순서를 만듭니다. 이 생성자가 parent state root·receipt root·proof와 messages의 전체 유효성을 모두 확인한다고 이해하면 안 됩니다. 그 검사는 parent state를 읽을 수 있는 consensus validation 단계의 책임입니다.
        </p>
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton label="NewTipSet · 높이와 parents" onClick={() => sidebar.open("ec-tipset-constructor", codeRefs["ec-tipset-constructor"])} />
        </div>

        <BlockValidationViz />
        <p>
          <code>ValidateBlock</code>은 수신 block의 기본 형식과 부모 tipset을 확인한 뒤 lookback state와 beacon을 읽습니다. 높이, timestamp와 parent weight처럼 빠르게 실패할 수 있는 검사를 먼저 처리합니다.
        </p>
        <p>
          그다음 miner 자격, election proof, block 서명, beacon 값, ticket과 WinningPoSt를 각각 검사합니다. 공통 block·message 검사도 같은 부모 문맥에서 실행합니다. 마지막 <code>RunAsyncChecks</code>는 이 결과를 모두 기다립니다.
        </p>
        <p>
          따라서 “서명이 맞는다”, “WinningPoSt가 맞는다”, “height와 parents가 같다” 중 어느 하나도 valid block을 대신하지 않습니다. 모든 검사를 통과한 blocks로 만든 tipset만 state execution과 branch weight 비교에 들어갑니다.
        </p>
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton label="ValidateBlock · 부모 문맥" onClick={() => sidebar.open("ec-validate", codeRefs["ec-validate"])} />
          <CodeViewButton label="병렬 proof·message 검사" onClick={() => sidebar.open("ec-async", codeRefs["ec-async"])} />
          <CodeViewButton label="Weight · 고정 정수 산술" onClick={() => sidebar.open("ec-weight", codeRefs["ec-weight"])} />
        </div>

        <ExplainedFormula
          question="완전히 유효한 두 EC branch 가운데 현재 head는 어떻게 정합니까?"
          idea={<>부모까지의 누적 weight에 network QAP의 log 항과 tipset 전체 WinCount의 증가분을 더합니다. 실제 비교는 Lotus의 consensus-critical 정수 산술을 그대로 재현해야 합니다.</>}
          formula={String.raw`W(T)=W(parent)+(\lfloor\log_2 P\rfloor\ll8)+\frac{(\lfloor\log_2P\rfloor\,r_n\ll8)J_T}{E\,r_d}`}
          annotatedFormula={String.raw`W(T)=\underbrace{W(parent)}_{\text{부모 누적값}}+\underbrace{(\lfloor\log_2P\rfloor\ll8)}_{\text{network power 항}}+\underbrace{\frac{(\lfloor\log_2P\rfloor r_n\ll8)J_T}{E r_d}}_{\text{tipset win 증가분}}`}
          operations={[
            { expression: String.raw`W(parent)`, annotation: ["tipset header의 값을 신뢰하지 않고 다시 계산", "부모 branch까지의 누적 weight"] },
            { expression: String.raw`\lfloor\log_2 P\rfloor\ll8`, annotation: ["parent state의 total QAP P를 읽음", "BitLen−1과 8비트 스케일 사용"] },
            { expression: String.raw`J_T=\sum WinCount`, annotation: ["tipset blocks의 검증된 WinCount 합", "build constants의 비율로 증가분 계산"] },
          ]}
          terms={[
            { symbol: "W(T)", name: "tipset weight", description: "Tipset T까지 누적한 EC fork-choice 값입니다." },
            { symbol: "P", name: "network QAP", description: "Tipset의 parent state에서 읽은 전체 quality-adjusted power입니다." },
            { symbol: "J_T", name: "tipset total wins", description: "Tipset blocks의 검증된 ElectionProof.WinCount 합입니다." },
            { symbol: "r_n/r_d", name: "weight ratio", description: "해당 Lotus build constants에 고정된 분자와 분모입니다." },
          ]}
          assumptions={[
            "비교하는 모든 blocks가 full validation을 통과했습니다.",
            "Tipset은 같은 height와 parents를 공유하고 결정적 순서로 구성했습니다.",
            "Parent state, build constants와 Lotus revision을 함께 고정합니다.",
            "더 큰 weight는 현재 EC head를 정할 뿐 irreversible finality certificate를 만들지 않습니다.",
          ]}
          interpretation="Valid branch Y의 weight가 X보다 커지면 local EC head는 Y로 이동할 수 있습니다. 하지만 invalid Y는 계산값이 커도 후보가 아니며, F3가 확정한 prefix와 충돌하는 Y도 선택할 수 없습니다."
        />

        <div id="paper-filecoin-ec-spec">
          <CitationBlock source="Filecoin Specification · Expected Consensus" citeKey={2} href={EC_SPEC}>
            <p><strong>문제:</strong> Permissionless storage providers의 power를 leader 선출과 heaviest-chain agreement에 연결해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Election proof, compatible tipset, block validation과 chain-weight fork choice의 protocol 의미를 정의합니다.</p>
            <p><strong>중요 가정:</strong> Active network version의 randomness, power state, cryptographic proofs와 block semantics를 따릅니다.</p>
            <p><strong>근거 범위:</strong> EC의 protocol-level 선출·tipset·fork-choice 의미입니다.</p>
            <p><strong>일반화 금지:</strong> Current Lotus API, 고정 confirmation 시간이나 F3 certificate finality를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-lotus-tipset-v1383">
          <CitationBlock source="Lotus v1.38.3 · tipset.go" citeKey={3} type="code" href={TIPSET_SOURCE}>
            <p><strong>문제:</strong> 한 tipset으로 다룰 block headers를 결정적으로 구성해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Non-empty·ticket·height·parents 검사와 ticket/CID 정렬을 구현합니다.</p>
            <p><strong>중요 가정:</strong> 이 함수에 들어오기 전후의 전체 consensus validation을 별도로 수행합니다.</p>
            <p><strong>근거 범위:</strong> Lotus v1.38.3 <code>NewTipSet</code> 생성자의 직접 검사에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> 생성 성공이 proof·messages·state commitments의 전체 유효성을 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-lotus-validation-v1383">
          <CitationBlock source="Lotus v1.38.3 · FilecoinEC validation" citeKey={4} type="code" href={VALIDATION_SOURCE}>
            <p><strong>문제:</strong> 수신 block의 부모 문맥, miner 자격, 난수, proof, 서명과 messages를 같은 network state에서 검증해야 합니다.</p>
            <p><strong>핵심 기여:</strong> 빠른 동기 검사와 여러 독립 비동기 검사를 구성해 모두 성공할 때만 반환합니다.</p>
            <p><strong>중요 가정:</strong> ChainStore·StateManager·beacon·proof verifier가 같은 parent/lookback 문맥을 제공합니다.</p>
            <p><strong>근거 범위:</strong> Commit 29d72bd의 <code>ValidateBlock</code> 경로입니다.</p>
            <p><strong>일반화 금지:</strong> Validation success가 현재 선택 head, message business success나 finality를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-lotus-weight-v1383">
          <CitationBlock source="Lotus v1.38.3 · filcns/weight.go" citeKey={5} type="code" href={WEIGHT_SOURCE}>
            <p><strong>문제:</strong> 유효한 competing tipset branches를 모든 노드가 같은 정수 값으로 비교해야 합니다.</p>
            <p><strong>핵심 기여:</strong> Parent weight, log₂ QAP와 total WinCount 증가분을 consensus-critical 산술로 계산합니다.</p>
            <p><strong>중요 가정:</strong> Lotus v1.38.3 state tree, build constants와 valid tipset 검증 입력을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 해당 revision의 EC chain-weight 계산에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Weight 값은 irreversible finality, 경제적 공격 비용이나 F3 certificate를 대신하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="scroll-mt-24 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · 변화와 확정</p>
          <h2 className="mt-2 text-2xl font-bold">정상 reorg와 null epoch를 처리하면서 확정된 prefix는 보존합니다</h2>
        </header>
        <HeadChangeTraceViz />
        <p>
          EC head가 X에서 Y로 바뀌면 node는 공통 조상 뒤 X의 tipsets를 revert하고 Y의 tipsets를 apply합니다. 송금 M5가 X에만 있었다면 잔액과 실행 결과도 새 head 기준으로 되돌아갑니다. 따라서 사용자 API는 <code>received</code>, <code>validated</code>, <code>EC head included</code>, <code>F3 finalized</code>를 따로 보여 줘야 합니다.
        </p>
        <p>
          한 epoch에 당첨자가 없으면 빈 tipset을 만들지 않습니다. 다음 block의 height는 둘 이상 증가할 수 있고, timestamp와 VM의 cron·state 전이는 건너뛴 epoch 수를 반영합니다. Tipset 개수와 epoch 차이를 같다고 가정하면 parent time과 상태 실행을 잘못 재현하게 됩니다.
        </p>
        <p>
          FIP-0086은 EC가 현재 선택한 chain과 이전에 F3가 확정한 base chain을 F3 입력으로 분리합니다. F3 certificate가 새 prefix를 확정하면 EC fork choice는 그 prefix를 계속 포함하는 branch만 선택해야 합니다. F3가 일시적으로 진행하지 못해도 EC는 새 blocks를 만들 수 있지만, 새 finality가 생긴 것처럼 표시해서는 안 됩니다.
        </p>
        <div className="grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["EC 검증", "invalid block을 weight 경쟁 전에 제거", "validation result"],
            ["EC head", "유효 branch weight가 바뀌면 revert/apply", "head-change trace"],
            ["F3 확정", "certificate가 가리키는 prefix 앞은 되돌리지 않음", "finality certificate"],
          ].map(([title, action, evidence]) => <div key={title} className="bg-background p-4"><p className="text-xs font-black">{title}</p><p className="mt-2 break-keep text-[10px] leading-5 text-muted-foreground">{action}</p><p className="mt-3 border-l-2 border-primary pl-2 font-mono text-[9px] font-bold">{evidence}</p></div>)}
        </div>
        <p>
          검증을 재현하려면 Lotus v1.38.3 commit, network version, build constants와 부모 tipset key를 기록합니다. VRF bytes, power 기준 상태와 각 검사 결과도 같은 기록에 연결합니다.
        </p>
        <p>
          잘못된 election proof, 서로 다른 parents, 틀린 parent weight, null epoch, 유효한 경쟁 branch와 F3 fence를 각각 독립 검증 입력으로 만듭니다. 그러면 잘못된 상태를 어느 경계에서 받아들였는지 찾을 수 있습니다.
        </p>
        <div id="paper-fip0086-ec-boundary">
          <CitationBlock source="FIP-0086 · EC/F3 interface" citeKey={6} href={FIP_0086}>
            <p><strong>문제:</strong> Reorg 가능한 EC chain에 빠른 Byzantine finality를 더하면서 두 protocol의 책임을 분리해야 합니다.</p>
            <p><strong>핵심 기여:</strong> EC proposal, 이전 finalized base, power table과 certificate output 사이의 interface를 정의합니다.</p>
            <p><strong>중요 가정:</strong> 명시한 power-weighted adversary model, EC compatibility와 certificate 검증 규칙을 따릅니다.</p>
            <p><strong>근거 범위:</strong> Revision c856d99의 Final FIP가 정한 protocol 경계입니다.</p>
            <p><strong>일반화 금지:</strong> “수십 초”라는 설계 목표가 모든 network 상태에서의 고정 SLA를 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-gof3-v0815-status">
          <CitationBlock source="go-f3 v0.8.15 · README" citeKey={7} type="code" href={GO_F3}>
            <p><strong>문제:</strong> F3 구현과 mainnet 활성화 여부를 EC 설명과 구분해 확인해야 합니다.</p>
            <p><strong>핵심 기여:</strong> GPBFT·certificate·EC integration 구성과 2025-04-29 epoch 4920480 mainnet 활성화를 명시합니다.</p>
            <p><strong>중요 가정:</strong> go-f3 v0.8.15 tag와 배포 node의 Lotus/F3 integration profile을 별도로 고정합니다.</p>
            <p><strong>근거 범위:</strong> 해당 tag README의 기능 존재와 공개 활성화 상태입니다.</p>
            <p><strong>일반화 금지:</strong> 구현 존재가 현재 노드의 certificate lag, availability나 고정 확정 시간을 증명하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-lotus-source-v1383">
          <CitationBlock source="Lotus source · v1.38.3 commit 29d72bd" citeKey={8} type="code" href={LOTUS_SOURCE}>
            <p><strong>문제:</strong> 선출·tipset·validation·weight 주장을 하나의 재현 가능한 client revision에 고정해야 합니다.</p>
            <p><strong>핵심 기여:</strong> 이 글에서 인용한 Lotus source tree와 dependency 경계를 제공합니다.</p>
            <p><strong>중요 가정:</strong> Network profile, actor bundle, proof parameters와 build configuration을 함께 맞춥니다.</p>
            <p><strong>근거 범위:</strong> Commit 29d72bd의 source behavior에 한정합니다.</p>
            <p><strong>일반화 금지:</strong> Source code가 production availability, 처리량이나 미래 network behavior를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>
    </article>

    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={codeRefs}
      fileTrees={{ lotus: ecTree }}
      projectMetas={{
        lotus: {
          id: "lotus",
          label: "Lotus v1.38.3 · Go",
          badgeClass: "border-blue-500 bg-blue-500/10 text-blue-700",
        },
      }}
    />
  </>;
}
