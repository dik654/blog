import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  GasContextViz,
  LotusMpoolFlowViz,
  MpoolAdmissionViz,
  MpoolRecoveryViz,
  NoncePackageViz,
} from "./LotusMpoolFlowViz";

const LOTUS_COMMIT = "29d72bdf77d13e6e3e20264d7a9167feb2a41ab0";
const LOTUS_MPOOL = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/messagepool/messagepool.go`;
const LOTUS_SELECTION = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/chain/messagepool/selection.go`;
const LOTUS_GAS = `https://github.com/filecoin-project/lotus/blob/${LOTUS_COMMIT}/node/impl/full/gas.go`;
const FIP_0054 = "https://github.com/filecoin-project/FIPs/blob/04872b3795256e9846d3483981070c8d00a0aa1c/FIPS/fip-0054.md";

export default function ModernLotusMpool() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Alice의 nonce 9가 7·8보다 먼저 왔을 때 무엇이 실행 가능한가</p><h2 className="text-3xl font-bold tracking-tight">Mpool은 head가 바뀔 때 nonce chain을 다시 만듭니다</h2></header>
      <LotusMpoolFlowViz />
      <p className="text-lg leading-8 text-foreground/90"><strong>로컬 접수와 블록 포함은 서로 다른 판단입니다.</strong> Alice의 actor nonce가 7이면 nonce 9가 먼저 도착해 보관되더라도 7·8보다 앞서 실행할 수 없습니다. Lotus는 현재 heaviest tipset에서 actor nonce와 잔액, network version을 읽고 메시지를 검사한 뒤 sender별로 끊기지 않은 chain을 만듭니다.</p>
      <p>그다음 block gas와 message 수 한도, fee 순서를 함께 보고 후보를 고릅니다. Head가 바뀌면 이미 적용된 메시지는 pending set에서 빼고, 되돌아온 메시지는 새 actor state에서 다시 검사합니다.</p>
      <p>FVM 메시지가 실행될 때 지키는 규칙은 <a className="text-primary hover:underline" href="/cs/blockchain/filecoin-fvm#message-envelope">FVM message execution envelope</a>에서, 일반적인 local mempool 접수 과정은 <a className="text-primary hover:underline" href="/cs/blockchain/cometbft#mempool">CometBFT mempool</a>에서 이어서 볼 수 있습니다. 여기서는 Lotus v1.38.3의 Mpool 동작만 추적합니다.</p>
      <ContentBoundary article="lotus-mpool" />
      <div id="paper-lotus-mpool-source"><CitationBlock type="code" citeKey={1} source="Lotus messagepool.go · v1.38.3 commit 29d72bd" href={LOTUS_MPOOL}><p><strong>문제:</strong> Untrusted signed message를 현재 chain head와 runtime policy에 맞춰 검증하고 sender별 pending state와 head changes에 일관되게 반영해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 admission checks, push/add paths, nonce·replacement policy, pending retrieval과 apply/revert reconciliation을 구현합니다.</p><p><strong>중요 가정:</strong> Lotus v1.38.3 commit 29d72bd의 network version, actor state, mpool config, wallet/signature rules와 heaviest tipset을 함께 고정합니다.</p><p><strong>근거 범위:</strong> 해당 Lotus snapshot의 local message-pool behavior와 state transition에 한정합니다.</p><p><strong>일반화 금지:</strong> Local acceptance를 block inclusion·execution success·economic optimality·finality로 확대하지 않고, replacement 비율이나 queue 한도를 모든 Lotus version의 상수로 복제하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="admission" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 현재 head에서 접수</p><h2 className="mt-2 text-2xl font-bold">같은 signed message도 판단 시점의 head와 policy를 함께 남깁니다</h2></header>
      <MpoolAdmissionViz />
      <p>
            Alice의 actor nonce가 7이라면 nonce 7인 메시지는 곧바로 실행 후보가 됩니다. 반면 nonce 9만 먼저 도착하면 8이 올 때까지 gap 뒤에
            머뭅니다.
          </p><p>
            Admission은 signature와 CID만 검사하지 않습니다. Sender protocol과 network version별 message size·gas 제약을 확인합니다.
            현재 balance와 required funds, nonce 범위도 함께 봅니다. Duplicate와 same-nonce replacement policy도 확인합니다. Head가 움직이면 같은
            bytes라도 판단이 달라질 수 있으므로 당시 base tipset key와 height를 확인 기록에 남깁니다.
          </p>
      <ExplainedFormula question="같은 message가 어느 chain context에서 admission됐는지 어떻게 재현할까?" idea={<>Signed message identity에 head와 validation policy snapshot을 함께 묶습니다.</>} formula={String.raw`A=H(C_{msg}\|K_H\|h\|N_V\|P_{mpool})`}
      annotatedFormula={String.raw`\underbrace{A}_{\text{접수 확인값}}=H(\underbrace{C_{msg}}_{\text{signed message}}\|\underbrace{K_H\|h}_{\text{판단 시점 head}}\|\underbrace{N_V}_{\text{network version}}\|\underbrace{P_{mpool}}_{\text{local policy}})`}
      operations={[
          { expression: String.raw`H(C_{msg}\|K_H\|h\|N_V\|P_{mpool})`, annotation: ["message에 head·policy snapshot을","함께 묶어 local 판단을 재현","CID 같아도 head·config 바뀌면 A 다름"] },
        ]} terms={[{symbol:"A",name:"Admission digest",description:"한 local admission 판단을 재현하는 확인값입니다."},{symbol:"H",name:"Cryptographic hash",description:"Canonical serialization에 적용한 hash입니다."},{symbol:"C_{msg}",name:"Signed-message CID",description:"From, To, Nonce, Value, Gas fields, method parameters와 signature를 식별합니다."},{symbol:"K_H",name:"Head tipset key",description:"Admission 때 actor state를 읽은 exact heaviest tipset입니다."},{symbol:"h",name:"Head height",description:"Network-version과 base-fee context를 해석할 epoch입니다."},{symbol:"N_V",name:"Network version",description:"Message validity와 actor semantics를 선택하는 version입니다."},{symbol:"P_{mpool}",name:"Mpool policy",description:"Replacement ratio, queue limits와 local configuration snapshot입니다."}]} assumptions={["Fields는 Filecoin canonical message/CID rules와 deterministic policy encoding을 따릅니다.","A는 어느 문맥에서 판단했는지 남기는 값이며 이후 head에서도 message가 유효하거나 포함된다는 증명이 아닙니다."]} interpretation="Signed-message CID가 같아도 head나 mpool config가 바뀌면 admission digest가 달라지므로 stale 판단을 새 head에 재사용하지 않습니다." />
      <p>
            같은 sender와 nonce를 가진 새 메시지도 바로 교체하지 않습니다. 새 fee가 replace-by-fee 기준을 넘고 뒤따르는 nonce chain을
            깨지 않아야 통과합니다. 정확한 기준값은 이 글에서 고정한 설정 파일에서 확인하며, 임의의 퍼센트를 Lotus 전체의 규칙처럼
            적용하지 않습니다.
          </p>
    </section>

    <section id="nonce-packages" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Nonce chain과 block 후보</p><h2 className="mt-2 text-2xl font-bold">Actor nonce부터 끊기지 않은 prefix만 실행할 수 있습니다</h2></header>
      <NoncePackageViz />
      <p>
            Filecoin actor는 sender별 nonce 순서대로 메시지를 실행합니다. Alice의 state nonce가 7이고 pending이 7·9라면 9의 fee가
            아무리 높아도 8 없이 9를 먼저 실행하지 못합니다. Lotus selection은 sender마다 7→8→9처럼 끊기지 않은 package를 만듭니다.
          </p><p>
            그다음 base fee에서 실제로 남는 effective premium과 gas reward를 계산합니다. Block gas limit과 message count도 함께 봅니다.
            이 단계는 각 노드의 local queue에서 후보를 고릅니다. Consensus가 모든 노드에 같은 candidate 순서를 강제하는 것은 아닙니다.
          </p>
      <ExplainedFormula question="Sender의 어떤 pending messages가 하나의 실행 가능한 chain일까?" idea={<>On-chain actor nonce에서 시작해 정확히 1씩 증가하는 prefix만 선택합니다.</>} formula={String.raw`n_i=n_{state}+i,\quad i=0,\ldots,k-1`}
      annotatedFormula={String.raw`\underbrace{n_i}_{\text{i번째 nonce}}=\underbrace{n_{state}}_{\text{on-chain 다음 nonce}}+\underbrace{i}_{\text{prefix 안 위치}},\quad \underbrace{i=0,\ldots,k-1}_{\text{gap 전까지 k개}}`}
      operations={[
          { expression: String.raw`n_{state}+i`, annotation: ["on-chain nonce에서 정확히 1씩 증가","n_state=7이면 7·8·9가 k=3 package"] },
          { expression: String.raw`i=0,\ldots,k-1`, annotation: ["빈 nonce가 나오면 prefix가 끊김","7·9면 7까지만, 9는 8을 기다림"] },
        ]} terms={[{symbol:"n_i",name:"Message nonce",description:"Package 안 i번째 signed message의 nonce입니다."},{symbol:"n_{state}",name:"Actor state nonce",description:"Selection base tipset에서 읽은 sender의 다음 expected nonce입니다."},{symbol:"i",name:"Chain offset",description:"Contiguous prefix 안의 0-based 위치입니다."},{symbol:"k",name:"Package length",description:"Gap, invalid message 또는 budget boundary 전까지 이어지는 메시지 수입니다."}]} assumptions={["모든 messages가 같은 sender이고 base tipset에서 admission checks를 통과했습니다.","Replacement이 있으면 같은 nonce의 winner를 먼저 정한 뒤 contiguous chain을 구성합니다."]} interpretation="n_state=7일 때 7·8·9는 k=3 package지만 7·9는 7까지만 executable prefix이며 9는 nonce 8을 기다립니다." />
      <div id="paper-lotus-selection"><CitationBlock type="code" citeKey={2} source="Lotus selection.go · v1.38.3 commit 29d72bd" href={LOTUS_SELECTION}><p><strong>문제:</strong> Sender nonce dependencies를 보존하면서 block gas/message limits와 fee incentives 안에서 pending messages를 골라야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 actor nonce에서 sender chains를 구성하고 gas reward·performance를 계산해 block candidate selection을 수행합니다.</p><p><strong>중요 가정:</strong> Selection base tipset, actor nonces, base fee, block gas limit, pending set과 Lotus v1.38.3 algorithm/config를 동일하게 고정합니다.</p><p><strong>근거 범위:</strong> commit 29d72bd selection implementation의 package construction과 ordering behavior에 한정합니다.</p><p><strong>일반화 금지:</strong> 선택 순서를 global consensus, guaranteed inclusion, MEV-free ordering 또는 모든 workload의 최적 packing으로 해석하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="gas-estimate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · Gas 값을 해석하는 문맥</p><h2 className="mt-2 text-2xl font-bold">GasLimit·Premium·FeeCap은 서로 다른 질문에 답합니다</h2></header>
      <GasContextViz />
      <p><code>GasEstimateGasLimit</code>은 actor call을 시뮬레이션하고 설정된 여유분을 더하되 block gas limit을 넘지 않게 합니다. <code>GasEstimateGasPremium</code>은 얼마나 빨리 포함할지를, <code>GasEstimateFeeCap</code>은 앞으로 base fee가 오를 위험을 다룹니다.</p><p>값을 계산한 뒤 head가 바뀌면 actor state와 base fee도 달라질 수 있습니다. 확인 기록에는 tipset key와 height, network version을 남깁니다. Estimator revision, overestimation multiplier, observed base fee도 같은 기록에 묶습니다.</p>
      <ExplainedFormula question="Block selection에서 message의 실제 priority contribution을 어떻게 비교할까?" idea={<>Premium claim을 그대로 믿지 않고 fee cap에서 base fee를 낸 뒤 남는 한도와 작은 값을 effective premium으로 사용합니다.</>} formula={String.raw`p_{eff}=\min\!\left(p,\max(f-b,0)\right),\qquad R=p_{eff}G`}
      annotatedFormula={String.raw`p_{eff}=\min\!\left(\underbrace{p}_{\text{제시한 premium}},\underbrace{\max(f-b,0)}_{\text{base fee 뒤 남는 폭}}\right),\qquad R=\underbrace{p_{eff}G}_{\text{gas limit만큼의 보상}}`}
      operations={[
          { expression: String.raw`\max(f-b,0)`, annotation: ["fee cap에서 base fee를 내고 남는","gas당 한도이며 음수면 0입니다"] },
          { expression: String.raw`\min\!\left(p,\max(f-b,0)\right)`, annotation: ["premium claim과 남는 폭 중 작은 값이","실제 priority입니다: min(3, 12−10)=2"] },
          { expression: String.raw`p_{eff}G`, annotation: ["gas당 effective premium에 GasLimit을","곱해 package 비교 점수로 씁니다"] },
        ]} terms={[{symbol:"p_{eff}",name:"Effective gas premium",description:"Base fee를 고려한 token-per-gas priority contribution입니다."},{symbol:"p",name:"GasPremium",description:"Sender가 miner에게 지불하겠다고 제시한 per-gas premium입니다."},{symbol:"f",name:"GasFeeCap",description:"Base fee와 premium을 합쳐 sender가 허용한 maximum per-gas price입니다."},{symbol:"b",name:"Base fee",description:"Selection base tipset의 network base fee입니다."},{symbol:"R",name:"Gas reward score",description:"Pinned selection code가 package comparison에 사용하는 effective premium×gas-limit quantity입니다."},{symbol:"G",name:"GasLimit",description:"Message가 block에서 예약하는 gas units입니다."}]} assumptions={["FIP-0054 semantics와 pinned Lotus selection snapshot을 사용하며 모든 fee field는 같은 token-per-gas 단위를 사용합니다.","R은 actual execution gas used나 guaranteed miner payout이 아니라 selection-time quantity입니다."]} interpretation="p=3, f=12, b=10이면 p_eff=min(3,2)=2입니다. Premium을 3으로 적었어도 fee cap의 남는 폭이 2라서 priority contribution은 gas당 2입니다." />
      <div id="paper-lotus-gas-api"><CitationBlock type="code" citeKey={3} source="Lotus gas.go · v1.38.3 commit 29d72bd" href={LOTUS_GAS}><p><strong>문제:</strong> Client가 execution simulation, premium와 future base-fee risk를 서로 다른 estimators로 계산하고 message fields에 적용해야 합니다.</p><p><strong>핵심 기여:</strong> Pinned source는 GasLimit simulation/overestimation/cap, premium sampling과 fee-cap estimation APIs의 exact paths를 구현합니다.</p><p><strong>중요 가정:</strong> Lotus v1.38.3 estimator code, base tipset, actor state, mpool pending set, network policy와 caller-provided overestimation 값을 고정합니다.</p><p><strong>근거 범위:</strong> commit 29d72bd full-node gas estimation behavior와 error boundary에 한정합니다.</p><p><strong>일반화 금지:</strong> Estimate를 future execution receipt, fixed latency/fee, inclusion guarantee 또는 adversarial base-fee movement의 upper bound로 해석하지 않습니다.</p></CitationBlock></div>
      <div id="paper-filecoin-fip54"><CitationBlock type="paper" citeKey={4} source="FIP-0054 · revision 04872b3" href={FIP_0054}><p><strong>문제:</strong> Legacy selection이 fee cap과 base fee interaction을 충분히 반영하지 못해 실제 miner reward와 message ranking이 어긋날 수 있습니다.</p><p><strong>핵심 기여:</strong> FIP-0054는 effective gas premium을 fee-cap residual로 제한해 block-selection reward 계산을 수정합니다.</p><p><strong>중요 가정:</strong> FIP revision 04872b3, 해당 network upgrade activation과 compatible Lotus implementation을 사용합니다.</p><p><strong>근거 범위:</strong> Filecoin block selection의 effective premium semantics와 migration rationale에 한정합니다.</p><p><strong>일반화 금지:</strong> 이 ranking rule이 fee predictability, fair ordering, inclusion이나 globally optimal block construction을 보장한다고 주장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release-gate" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Head 변경과 복구</p><h2 className="mt-2 text-2xl font-bold">되돌아온 메시지는 새 head에서 다시 검사합니다</h2></header>
      <MpoolRecoveryViz />
      <p>Head에 포함된 메시지는 pending set에서 빠집니다. 그 head가 revert되면 메시지를 후보로 돌려놓되, 이전 판단을 그대로 복사하지는 않습니다. 새 actor nonce와 balance로 먼저 검사하고 base fee와 network policy도 다시 적용합니다. 그래야 현재 head에서 실행 가능한 pending set을 만들 수 있습니다.</p><p>프로세스가 다시 시작될 때도 journal만 믿지 않습니다. 복구한 항목과 현재 head를 대조하고 중복과 누락을 걸러낸 뒤 같은 검사를 거칩니다. 유효성을 확인할 수 없는 항목은 실행 후보로 내보내지 않는 것이 이 메커니즘의 실패 동작입니다.</p>
      <ExplainedFormula question="Head 변경 뒤 pending set을 어떻게 다시 만들까?" idea={<>기존 pending, 되돌아온 메시지, 재시작 journal을 모은 뒤 새 head의 상태로 모두 다시 검사합니다.</>} formula={String.raw`P_{new}=V_{H_{new}}((P_{old}\setminus A)\cup R\cup J)`}
      annotatedFormula={String.raw`\underbrace{P_{new}}_{\text{새 pending set}}=\underbrace{V_{H_{new}}}_{\text{새 head에서 재검사}}(\underbrace{P_{old}\setminus A}_{\text{적용된 메시지 제거}}\cup\underbrace{R}_{\text{revert로 돌아온 메시지}}\cup\underbrace{J}_{\text{재시작 journal}})`}
      operations={[
          { expression: String.raw`P_{old}\setminus A`, annotation: ["새 head에 적용된 메시지를 pending에서 제거","이미 실행된 nonce를 다시 후보로 내지 않음"] },
          { expression: String.raw`(P_{old}\setminus A)\cup R\cup J`, annotation: ["남은 항목과 되돌아온 항목, journal을 합침","이 합집합은 아직 실행 가능한 집합이 아님"] },
          { expression: String.raw`V_{H_{new}}(\cdot)`, annotation: ["새 nonce·balance·base fee·policy로 재검사","통과한 항목만 P_new에 남김"] },
        ]} terms={[{symbol:"P_{new}",name:"새 pending set",description:"새 head에서 다시 검사해 실행 후보로 남은 메시지 집합입니다."},{symbol:"P_{old}",name:"이전 pending set",description:"Head 변경 전 Mpool이 보관하던 메시지 집합입니다."},{symbol:"A",name:"적용된 메시지",description:"새 head의 block에 포함되어 pending에서 제거할 메시지 집합입니다."},{symbol:"R",name:"되돌아온 메시지",description:"Revert된 head에 포함돼 있었으므로 다시 후보가 될 수 있는 메시지 집합입니다."},{symbol:"J",name:"재시작 journal",description:"프로세스 재시작 뒤 복구한 로컬 메시지 기록입니다."},{symbol:"V_{H_{new}}",name:"새 head 검증",description:"현재 actor state와 network policy로 각 항목을 다시 검사하는 함수입니다."}]} assumptions={["이 식은 apply·revert·restart 동작을 한눈에 보여 주는 설명 모델이며 Lotus 소스의 함수식을 그대로 옮긴 것이 아닙니다.","실제 구현은 head change 순서, local/untrusted 경로, config에 따라 추가 검사를 수행합니다."]} interpretation="되돌아온 메시지나 journal 항목은 합집합에 들어왔다는 이유만으로 실행 후보가 되지 않습니다. 새 head의 검사를 통과해야 P_new에 남습니다." />
      <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">이 글을 읽은 뒤 확인할 것:</strong> Local admission과 block inclusion의 차이, nonce 9가 7·8을 기다리는 이유, 세 gas field와 effective premium, head apply·revert 뒤 pending set이 달라지는 과정을 설명할 수 있어야 합니다.</aside>
    </section>
  </article>;
}
