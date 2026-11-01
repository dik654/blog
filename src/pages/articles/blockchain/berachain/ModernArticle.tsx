import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import CosmosEvmLocator, { CosmosEvmMapReturn } from "../CosmosEvmLocator";
import { codeRefs } from "./codeRefs";
import { berachainSources } from "./fileTrees";
import {
  BerachainBoundaryViz,
  BerachainFailureViz,
  BerachainRewardLifecycleViz,
} from "./viz/ModernBerachainViz";

const BEACON_SHA = "0a91d178147821bb41b7e1de092b0a501236b4ee";
const RETH_SHA = "aa9bc73ffd49305ce0953c22b38f2affcbdabbd4";
const CONTRACTS_SHA = "70e392fc83deec6a34bd11613f2a446eb6266588";
const DOCS_SHA = "ec5709d51747490c0a77b765ac026633d4ec438b";

const BEACON_REPO = `https://github.com/berachain/beacon-kit/tree/${BEACON_SHA}`;
const BEACON_BUILDER = `https://github.com/berachain/beacon-kit/blob/${BEACON_SHA}/beacon/validator/block_builder.go`;
const BEACON_WITHDRAWALS = `https://github.com/berachain/beacon-kit/blob/${BEACON_SHA}/state-transition/core/state/statedb.go`;
const RETH_REPO = `https://github.com/berachain/bera-reth/tree/${RETH_SHA}`;
const RETH_POL = `https://github.com/berachain/bera-reth/blob/${RETH_SHA}/src/transaction/pol.rs`;
const RETH_EXECUTOR = `https://github.com/berachain/bera-reth/blob/${RETH_SHA}/src/node/evm/executor.rs`;
const CONTRACTS_REPO = `https://github.com/berachain/contracts/tree/${CONTRACTS_SHA}`;
const DISTRIBUTOR = `https://github.com/berachain/contracts/blob/${CONTRACTS_SHA}/src/pol/rewards/Distributor.sol`;
const CONTROLLER = `https://github.com/berachain/contracts/blob/${CONTRACTS_SHA}/src/pol/rewards/BlockRewardController.sol`;
const BERACHEF = `https://github.com/berachain/contracts/blob/${CONTRACTS_SHA}/src/pol/rewards/BeraChef.sol`;
const REWARD_VAULT = `https://github.com/berachain/contracts/blob/${CONTRACTS_SHA}/src/pol/rewards/RewardVault.sol`;
const STAKING_REWARDS = `https://github.com/berachain/contracts/blob/${CONTRACTS_SHA}/src/base/StakingRewards.sol`;
const DOCS_OVERVIEW = `https://github.com/berachain/docs/blob/${DOCS_SHA}/general/proof-of-liquidity/overview.mdx`;
const DOCS_REWARDS = `https://github.com/berachain/docs/blob/${DOCS_SHA}/general/proof-of-liquidity/block-rewards.mdx`;
const DOCS_VAULTS = `https://github.com/berachain/docs/blob/${DOCS_SHA}/general/proof-of-liquidity/reward-vaults.mdx`;
const DOCS_BGT = `https://github.com/berachain/docs/blob/${DOCS_SHA}/general/tokens/bgt.mdx`;

export default function ModernBerachainArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article>
        <section id="overview" className="mb-16 scroll-mt-20">
          <CosmosEvmLocator
            currentSlug="berachain"
            region="CometBFT block finality와 EVM Reward Vault accounting을 잇는 PoL 경로"
            question="검증자 V가 블록 H42를 만들면 Alice의 WBERA가 H42에서 바로 늘어날까요?"
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="text-lg leading-8">
              결론부터 말하면 아닙니다. H42가 합의된 뒤 다음 블록 H43의 첫 시스템 트랜잭션이 H42 제안자 V의 보상을 계산합니다.
              그중 Reward Vault 몫은 BeraChef 배분을 거쳐 vault에 들어가고, Alice의 지분에는 시간에 따라 적립됩니다.
            </p>
            <p>
              이 글에서는 설명용 상태 하나만 따라갑니다. V의 배분은 Vault A 50%, Vault B 50%이고 Dedicated Emission Stream은
              0%입니다. Alice는 Vault A의 eligible receipt token 1,000개 중 100개를 분배 기간 내내 맡깁니다. 이 수치는 실제
              계정이나 측정값이 아니라 상태 경계를 드러내기 위한 가정입니다.
            </p>
          </div>

          <BerachainRewardLifecycleViz />
          <ContentBoundary article="berachain" />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h2>현재 PoL은 BGT 보상이 아니라 WBERA 보상입니다</h2>
            <p>
              기존 글은 BGT boost와 BGT emission을 현재 구조처럼 설명했습니다. 그러나 고정한 공식 문서 스냅샷은 BGT가 2026년
              7월 8일에 deprecated되었고, 새 Reward Vault emission은 WBERA로 지급된다고 명시합니다. BGT는 과거 구조와 잔여
              allowance를 정리하는 호환 경로로만 남아 있습니다.
            </p>
            <p>
              따라서 현재 경로의 세 역할은 이렇게 나뉩니다. BERA stake는 active validator와 블록 제안 확률에 참여합니다.
              WBERA는 validator operator와 Reward Vault에 지급되는 emission token입니다. Reward Vault의 receipt token은 사용자가
              vault 보상을 나눌 지분을 나타냅니다. HONEY 같은 별도 상품은 이 한 block 보상 추적에 넣지 않습니다.
            </p>
            <p>
              앞 글의 구조와 비교하면 위치가 더 분명해집니다. <Link to="/cs/blockchain/omni-octane#overview">Octane</Link>처럼
              BeaconKit과 execution client가 Engine API로 분리되어 있지만, <Link to="/cs/blockchain/initia-evm#overview">MiniEVM</Link>처럼
              Cosmos application 안에서 EVM을 직접 실행하는 구조는 아닙니다.
            </p>
          </div>

          <div id="paper-berachain-overview" className="scroll-mt-24">
            <CitationBlock citeKey={1} source="Berachain Docs · PoL vNext overview · ec5709d5" href={DOCS_OVERVIEW}>
              <p><strong>문제:</strong> Validator security, block emission, vault allocation과 사용자 yield를 한 흐름으로 연결해야 합니다.</p>
              <p><strong>기여:</strong> 공식 문서는 BERA block production, WBERA emission, BeraChef, Reward Vault와 BGT deprecation을 현재 구조로 정리합니다.</p>
              <p><strong>전제:</strong> Docs commit {DOCS_SHA.slice(0, 8)}와 그 문서가 가리키는 PoL vNext 계약 세대를 기준으로 합니다.</p>
              <p><strong>근거 범위:</strong> 역할과 보상 방향을 설명하는 현재 공개 계약입니다.</p>
              <p><strong>말하지 않는 것:</strong> 표시 APR, token 가격, 특정 validator 수나 parameter가 영구 고정된다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="block-finality" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">H42 합의는 제안자 V를 확정하지만 Alice의 보상까지 확정하지 않습니다</h2>
          <BerachainBoundaryViz />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              CometBFT round가 V를 H42 제안자로 정하면 BeaconKit은 Bera-Reth에 execution payload를 요청합니다. BeaconKit의
              chain spec은 매 block 첫 withdrawal을 EVM inflation withdrawal로 고정하고, payload가 로컬 예상값과 같은지 검사합니다.
              이 withdrawal은 PoL 계약이 쓸 native balance의 공급 경로이지 Alice에게 바로 보내는 transfer가 아닙니다.
            </p>
            <p>
              제안이 timeout되면 같은 height에서 다음 round와 새 proposer가 나올 수 있습니다. 2/3를 초과한 validator voting power가
              precommit해야 H42가 commit됩니다. 이때 확인한 것은 H42의 ordering, execution state와 proposer V입니다. BeraChef weight,
              vault reward rate와 Alice의 earned balance는 별도 상태입니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="BeaconKit payload 원문" onClick={() => sidebar.open("beaconkit-payload", codeRefs["beaconkit-payload"])} />
            <CodeViewButton label="첫 inflation withdrawal 원문" onClick={() => sidebar.open("beaconkit-inflation", codeRefs["beaconkit-inflation"])} />
          </div>

          <div id="paper-berachain-beaconkit" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={2} source="BeaconKit · v1.4.1" href={BEACON_REPO}>
              <p><strong>문제:</strong> CometBFT proposal과 Bera-Reth execution payload를 같은 block으로 검증해야 합니다.</p>
              <p><strong>기여:</strong> <a href={BEACON_BUILDER}>block builder</a>는 Engine API payload를 조립하고, <a href={BEACON_WITHDRAWALS}>withdrawal state</a>는 첫 EVM inflation withdrawal을 계산합니다.</p>
              <p><strong>전제:</strong> Stable tag v1.4.1, commit {BEACON_SHA.slice(0, 8)}, matching Bera-Reth와 chain spec을 함께 고정합니다.</p>
              <p><strong>근거 범위:</strong> Consensus와 execution payload 사이의 공개 구현 경계입니다.</p>
              <p><strong>말하지 않는 것:</strong> Block commit 하나가 Reward Vault allocation이나 사용자 claim까지 완료했다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="system-transaction" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">H43의 첫 시스템 트랜잭션이 H42 제안자의 보상을 실행합니다</h2>

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              Bera-Reth v1.4.4는 H43을 실행하기 전에 <code>prev_proposer_pubkey=V</code>로 PoL transaction을 합성합니다.
              발신자는 protocol <code>SYSTEM_ADDRESS</code>, 목적지는 PoL Distributor, calldata는
              <code>distributeFor(V)</code>입니다. 이 transaction은 일반 사용자가 서명해 mempool에 넣는 요청이 아닙니다.
            </p>
            <p>
              더 중요한 제약은 위치입니다. 합성한 PoL transaction은 H43의 index 0에 들어가야 하며, 없거나 다른 위치에 있거나 hash가
              예상과 다르면 block 검증이 실패합니다. 그래서 외부 bot이 보상 호출을 잊는 문제가 아니라 block validity 자체에 포함된
              state transition입니다.
            </p>
            <p>
              Distributor는 먼저 BlockRewardController를 호출합니다. 고정한 계약 스냅샷에서는 operator base가 0.4 WBERA,
              Reward Vault path가 1.305 WBERA입니다. BeraChef가 준비되지 않았다면 vault path는 0이지만 operator base path는 별도로
              처리됩니다. 선택적 DES 몫을 먼저 계산한 뒤 남은 금액에 V의 active allocation을 적용합니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="PoL transaction 생성 원문" onClick={() => sidebar.open("reth-pol-transaction", codeRefs["reth-pol-transaction"])} />
            <CodeViewButton label="Transaction 0 실행 원문" onClick={() => sidebar.open("reth-pol-first", codeRefs["reth-pol-first"])} />
            <CodeViewButton label="Distributor 경로 원문" onClick={() => sidebar.open("distributor-route", codeRefs["distributor-route"])} />
            <CodeViewButton label="WBERA rate 원문" onClick={() => sidebar.open("reward-controller", codeRefs["reward-controller"])} />
            <CodeViewButton label="BeraChef fallback 원문" onClick={() => sidebar.open("berachef-allocation", codeRefs["berachef-allocation"])} />
          </div>

          <div id="paper-berachain-reth" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={3} source="Bera-Reth · v1.4.4" href={RETH_REPO}>
              <p><strong>문제:</strong> 이전 block 제안자 보상 호출을 누구나 같은 transaction으로 재구성하고 검증할 수 있어야 합니다.</p>
              <p><strong>기여:</strong> <a href={RETH_POL}>PoL transaction builder</a>는 previous proposer pubkey·block number·base fee로 transaction을 만들고, <a href={RETH_EXECUTOR}>executor</a>는 이를 system call과 transaction 0 receipt로 처리합니다.</p>
              <p><strong>전제:</strong> Stable tag v1.4.4, commit {RETH_SHA.slice(0, 8)}, Prague1 이후 chain configuration을 기준으로 합니다.</p>
              <p><strong>근거 범위:</strong> H43의 첫 transaction이 H42 proposer를 참조하는 실행 경로입니다.</p>
              <p><strong>말하지 않는 것:</strong> Transaction 생성만으로 H43 commit이나 vault accounting이 완료됐다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="vault-accounting" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">Vault가 0.6525 WBERA를 받아도 Alice가 즉시 0.06525를 받는 것은 아닙니다</h2>

          <ExplainedFormula
            question="설명용 조건에서 H42 한 block이 Alice의 최종 적립량에 기여하는 WBERA는 얼마입니까?"
            idea={<>DES를 0으로 두고, V가 vault path 1.305 WBERA의 50%를 Vault A에 배분합니다. Alice는 분배 기간 내내 Vault A stake의 10%를 유지합니다.</>}
            formula={String.raw`R_A=1.305\times\frac{5000}{10000}=0.6525,\qquad R_{Alice}=R_A\times\frac{100}{1000}=0.06525\ \mathrm{WBERA}`}
            annotatedFormula={String.raw`\underbrace{R_A}_{\text{Vault A 기여분}}=\underbrace{1.305}_{\text{vault path WBERA}}\times\underbrace{\frac{5000}{10000}}_{\text{V의 50\% allocation}}=0.6525,\qquad\underbrace{R_{Alice}}_{\text{Alice 기여분}}=0.6525\times\underbrace{\frac{100}{1000}}_{\text{stake 10\%}}=0.06525`}
            operations={[
              { expression: String.raw`1.305\times0.5=0.6525`, annotation: ["DES 0% fixture", "Vault A allocation 50%", "Vault B가 나머지 50%"] },
              { expression: String.raw`100/1000=0.1`, annotation: ["Alice stake 100", "Vault A totalSupply 1,000", "분배 기간 동안 변하지 않음"] },
              { expression: String.raw`0.6525\times0.1=0.06525`, annotation: ["한 block 기여분만 고립", "전체 stream 경과 뒤", "Solidity 반올림은 생략"] },
            ]}
            terms={[
              { symbol: "R_A", name: "Vault A에 notify된 기여분", description: "H42 proposer 보상 중 V의 allocation이 Vault A로 보낸 WBERA입니다." },
              { symbol: "R_{Alice}", name: "Alice의 고립 기여분", description: "한 block notification만 떼어 보았을 때 Alice stake가 적립하는 WBERA입니다." },
            ]}
            assumptions={[
              "1.305 WBERA는 contracts commit 70e392fc의 _REWARD_RATE이며 영구 parameter라고 가정하지 않습니다.",
              "BeraChef는 ready이고 V의 active allocation은 Vault A 50%, Vault B 50%입니다.",
              "DES, 기존 leftover reward, 이후 block notification, stake 변화와 incentive token 흐름은 계산에서 제외합니다.",
              "Alice와 totalSupply는 분배 기간 전체에 걸쳐 100과 1,000으로 일정하며 fixed-point 반올림은 생략합니다.",
            ]}
            interpretation="한 block의 vault path 1.305 WBERA 중 Vault A 몫은 0.6525이고, 그 기간의 Alice 지분이 10%라면 고립한 기여분은 0.06525 WBERA입니다. 실제 chain에서는 notification이 계속 겹치므로 earned(account)의 누적 상태를 읽어야 합니다."
          />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              <code>notifyRewardAmount</code>는 새 WBERA를 Alice에게 바로 transfer하지 않습니다. Vault는 현재 reward period에 남은 양과
              새 reward를 합쳐 <code>rewardRate</code>를 다시 정합니다. <code>rewardPerToken</code>은 경과 시간과 전체 stake로 증가하고,
              <code>earned(Alice)</code>는 Alice가 아직 반영하지 않은 reward-per-token 차이에 stake balance를 곱합니다.
            </p>
            <p>
              따라서 “V가 H42를 만들었다”, “Vault A가 H43에서 0.6525 WBERA를 notify받았다”, “Alice가 0.06525 WBERA를 적립했다”,
              “Alice가 WBERA를 claim했다”는 네 문장은 서로 다른 시점과 영수증을 가리킵니다. 한 event를 다른 event의 완료로 확대하면
              사용자 화면과 indexer가 실제 계약 상태보다 앞서갑니다.
            </p>
          </div>

          <div className="not-prose my-6 flex flex-wrap gap-3">
            <CodeViewButton label="Vault 적립 계산 원문" onClick={() => sidebar.open("vault-accounting", codeRefs["vault-accounting"])} />
            <CodeViewButton label="BGT→WBERA 호환 경로" onClick={() => sidebar.open("vault-migration", codeRefs["vault-migration"])} />
          </div>

          <div id="paper-berachain-contracts" className="scroll-mt-24">
            <CitationBlock type="code" citeKey={4} source="Berachain contracts · snapshot 70e392fc" href={CONTRACTS_REPO}>
              <p><strong>문제:</strong> Protocol emission을 validator operator, allocation, vault stream과 사용자 balance로 나눠 기록해야 합니다.</p>
              <p><strong>기여:</strong> <a href={CONTROLLER}>BlockRewardController</a>, <a href={DISTRIBUTOR}>Distributor</a>, <a href={BERACHEF}>BeraChef</a>, <a href={STAKING_REWARDS}>StakingRewards</a>와 <a href={REWARD_VAULT}>RewardVault</a>가 각 상태 전이를 구현합니다.</p>
              <p><strong>전제:</strong> Contracts repository는 release tag가 없어 commit {CONTRACTS_SHA.slice(0, 8)}을 snapshot으로 고정했습니다. 실제 배포 주소·proxy implementation은 별도 확인이 필요합니다.</p>
              <p><strong>근거 범위:</strong> 해당 commit의 공개 Solidity source와 고정 상수·fallback입니다.</p>
              <p><strong>말하지 않는 것:</strong> 이 snapshot이 모든 network의 현재 deployed bytecode와 같거나 보상 수익·원금 안전을 보장한다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>

          <div id="paper-berachain-vault" className="scroll-mt-24">
            <CitationBlock citeKey={5} source="Berachain Docs · Block rewards and Reward Vaults · ec5709d5" href={DOCS_VAULTS}>
              <p><strong>문제:</strong> System transaction에서 들어온 WBERA가 user claimable reward가 되는 시점을 설명해야 합니다.</p>
              <p><strong>기여:</strong> <a href={DOCS_REWARDS}>Block rewards 문서</a>는 previous-block system transaction과 rate를, Reward Vault 문서는 receipt stake·stream·claim 흐름을 설명합니다.</p>
              <p><strong>전제:</strong> Docs commit {DOCS_SHA.slice(0, 8)}과 current contract generation을 함께 봅니다.</p>
              <p><strong>근거 범위:</strong> 공개 문서에 명시된 WBERA emission·vault reward lifecycle입니다.</p>
              <p><strong>말하지 않는 것:</strong> Vault whitelist가 underlying asset 안전, audit 결과나 표시 APR 실현을 보장하지 않습니다.</p>
            </CitationBlock>
          </div>
        </section>

        <section id="failure-boundaries" className="mb-16 scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">실패 지점을 알면 어떤 숫자가 0이고 어떤 상태가 남는지 설명할 수 있습니다</h2>
          <BerachainFailureViz />

          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p>
              H42가 timeout되면 V의 제안은 보상 근거가 되지 않습니다. H42는 확정됐지만 H43의 PoL transaction이 빠졌다면 H43 후보 block이
              유효하지 않습니다. 반면 BeraChef가 준비되지 않은 경우에는 H43 system call 자체가 있다는 사실과 Reward Vault emission 0을
              구분해야 합니다. 이때 operator base path도 같은 0이라고 단정할 수 없습니다.
            </p>
            <p>
              Allocation이 없거나 inactive이면 BeraChef는 baseline을 확인하고, weight가 유효하지 않으면 default allocation으로 돌아갑니다.
              Vault에 stake가 하나도 없으면 notify된 reward는 사라지는 것이 아니라 undistributed 상태로 남고 첫 stake 이후 rate가 설정될 수
              있습니다. Legacy BGT allowance가 남아 있다면 claim 경로가 이를 BERA로 redeem하고 WBERA로 감쌉니다.
            </p>
            <p>
              이 글의 처음 질문으로 돌아가면 답은 명확합니다. V가 H42를 만들었다는 사실만으로 Alice의 WBERA balance가 H42에서 늘지 않습니다.
              최소한 H42 commit, H43 transaction 0의 PoL receipt, Vault A notification, reward-per-token 경과와 Alice claim transfer를 각각
              확인해야 합니다.
            </p>

            <h3>이 글을 읽고 답할 수 있어야 하는 질문</h3>
            <ol>
              <li>검증자 V가 H42를 만들었는데도 Alice의 WBERA가 H42에서 바로 늘지 않는 이유는 무엇입니까? (답: 2·3절)</li>
              <li>Vault A에 0.6525 WBERA가 전달되어도 Alice의 적립액을 즉시 0.06525로 확정할 수 없는 이유는 무엇입니까? (답: 4절)</li>
              <li>현재 WBERA 발행 경로와 과거 BGT 잔액을 정리하는 호환 경로는 어떻게 다릅니까? (답: 1·5절)</li>
            </ol>
          </div>

          <div id="paper-berachain-bgt" className="scroll-mt-24">
            <CitationBlock citeKey={6} source="Berachain Docs · BGT deprecation · ec5709d5" href={DOCS_BGT}>
              <p><strong>문제:</strong> 과거 BGT 기반 PoL 설명과 현재 WBERA 기반 계약을 같은 시점의 구조처럼 섞으면 안 됩니다.</p>
              <p><strong>기여:</strong> 공식 문서는 2026년 7월 8일 BGT deprecation과 새 WBERA emission, 잔여 BGT claim 호환 경로를 구분합니다.</p>
              <p><strong>전제:</strong> Docs commit {DOCS_SHA.slice(0, 8)}의 공개 설명과 contracts snapshot을 함께 대조합니다.</p>
              <p><strong>근거 범위:</strong> BGT의 현재 역할과 migration boundary입니다.</p>
              <p><strong>말하지 않는 것:</strong> 모든 과거 BGT balance가 자동으로 사라졌거나 별도 사용자 조치가 언제나 불필요하다는 뜻은 아닙니다.</p>
            </CitationBlock>
          </div>
        </section>

        <CosmosEvmMapReturn
          currentSlug="berachain"
          closure="Berachain에서는 BERA stake가 block production에 참여하고, 확정된 block의 proposer 보상은 다음 block의 첫 protocol transaction이 WBERA로 실행합니다. BeraChef allocation, Reward Vault의 시간 분배와 사용자 claim은 각각 별도 상태와 영수증입니다."
        />
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ berachain: berachainSources }}
        projectMetas={{
          berachain: {
            id: "berachain",
            label: "Berachain · BeaconKit v1.4.1 · Bera-Reth v1.4.4 · contracts 70e392fc",
            badgeClass: "border-amber-500 bg-amber-500/10 text-amber-700",
          },
        }}
      />
    </>
  );
}
