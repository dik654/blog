import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { giwaNodeTree } from "./fileTrees";
import ModernGiwaNodeViz from "./viz/ModernGiwaNodeViz";

const GIWA_COMMIT = "dcb59ac76a2b1aa7ec5dbc236c03053895b040b8";
const GIWA_DOCS = "https://docs.giwa.io/giwa-chain/en";
const GIWA_DIFFS =
  "https://docs.giwa.io/giwa-chain/en/network-information/diffs-ethereum-giwa";
const OP_DERIVATION = "https://specs.optimism.io/protocol/derivation.html";
const GIWA_NODE = `https://github.com/giwa-io/node/tree/${GIWA_COMMIT}`;
const GIWA_RELEASE = "https://github.com/giwa-io/node/releases/tag/v0.6.1";

export default function ModernGiwaChainArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              GIWA Sepolia 거래 T가 block 120에 보였을 때
            </p>
            <h2 className="break-keep text-3xl font-bold tracking-tight">
              L1에서 만든 payload를 EVM으로 다시 실행합니다
            </h2>
          </header>

          <p className="text-lg leading-8 text-foreground/90">
            한 문장으로 말하면, <strong>op-node</strong>는 “어떤 L2 payload를
            실행해야 하는가”를 정하고 <strong>op-reth</strong>는 “그 payload를
            실행하면 어떤 상태가 되는가”를 계산합니다. 그러면 바로 두 질문이
            생깁니다. Sequencer가 이미 보여 준 block을 왜 다시 만들며, 화면에
            보인 거래를 언제 외부 지급에 써도 되는가입니다.
          </p>

          <p>
            아래에서는 거래 T 하나를 끝까지 따라갑니다. T는 먼저 block 120의
            <strong> unsafe head</strong>에서 보입니다. 이후 op-node가 Sepolia
            L1의 batch에서 같은 payload를 재구성하고, op-reth가 같은 receipt와
            state root를 계산해야 safe로 전진합니다. 마지막에는 해당 L1 origin의
            finality와 애플리케이션 정책까지 확인합니다.
          </p>

          <ModernGiwaNodeViz />
          <ContentBoundary article="giwa-chain" />

          <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
            <strong>먼저 기억할 경계:</strong> RPC가 응답하는 것, Engine JWT가
            맞는 것, 거래가 unsafe에서 보이는 것, L1 데이터에서 재현된 것, 외부
            지급을 허용해도 되는 것은 서로 다른 판정입니다.
          </aside>

          <div id="paper-giwa-docs">
            <CitationBlock
              citeKey={1}
              source="GIWA Documentation · Introducing GIWA"
              href={GIWA_DOCS}
            >
              <p>
                <strong>핵심:</strong> GIWA는 OP Stack 기반 EVM-compatible Layer
                2이며, 현재 공개 node 대상은 GIWA Sepolia입니다.
              </p>
              <p>
                <strong>확인 범위:</strong> 2026-11-01 현재 공식 문서와 공개
                node 저장소에서 Mainnet은 개발 중, Sepolia chain ID는 91342로
                확인했습니다.
              </p>
              <p>
                <strong>확대 금지:</strong> 문서의 1초 block time과 60,000,000
                gas limit은 현재 network profile이지 미래 Mainnet의 영구 SLO가
                아닙니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="node-envelope" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · 같은 chain을 실행할 입력을 먼저 묶는다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Chain ID와 실행 세대를 함께 고정합니다
            </h2>
          </header>

          <p>
            “GIWA node를 실행했다”는 말만으로는 어느 규칙을 검증하는지 알 수
            없습니다. GIWA Sepolia chain ID 91342에 맞는 execution genesis와
            rollup config, Sepolia L1 execution·beacon endpoint, op-node와
            op-reth 버전을 한 세대로 기록해야 합니다. 이 묶음을 여기서는
            <strong> network generation</strong>이라고 부릅니다.
          </p>

          <ExplainedFormula
            question="두 node가 같은 GIWA network generation을 실행한다고 언제 말할까?"
            idea={
              <>
                Chain 정체, rollup 규칙, L1 원천과 두 binary 버전을 정해진
                순서로 묶어 하나의 digest로 비교합니다.
              </>
            }
            formula={String.raw`G=H(chainID\|genesis\|rollupCfg\|L1\|v_{node}\|v_{reth})`}
            annotatedFormula={String.raw`\underbrace{G}_{\text{network generation}}=H(\underbrace{chainID\|genesis}_{\text{chain 정체}}\|\underbrace{rollupCfg}_{\text{L2 재구성 규칙}}\|\underbrace{L1}_{\text{L1 원천}}\|\underbrace{v_{node}\|v_{reth}}_{\text{실행할 binary}})`}
            operations={[
              {
                expression: String.raw`chainID=91342`,
                annotation: [
                  "GIWA Sepolia의 주소 공간을 고릅니다",
                  "이 값만 같아서는 규칙 전체가 같지 않습니다",
                ],
              },
              {
                expression: String.raw`G=H(91342\|genesis\|rollupCfg\|L1\|v_{node}\|v_{reth})`,
                annotation: [
                  "여섯 입력을 정해진 encoding으로 묶습니다",
                  "하나라도 바뀌면 새 generation으로 봅니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "G",
                name: "Network generation",
                description:
                  "Canary와 rollback에서 비교할 node 실행 세대입니다.",
              },
              {
                symbol: "H",
                name: "Hash",
                description: "순서와 길이를 고정한 manifest의 digest입니다.",
              },
              {
                symbol: "rollupCfg",
                name: "Rollup config",
                description:
                  "L1 batch를 L2 payload로 바꾸는 규칙과 activation입니다.",
              },
              {
                symbol: "L1",
                name: "L1 source",
                description: "Sepolia execution·beacon 원천과 신뢰 설정입니다.",
              },
              {
                symbol: "v_{node},v_{reth}",
                name: "Binary versions",
                description: "op-node와 op-reth의 고정 revision입니다.",
              },
            ]}
            assumptions={[
              "Manifest field의 순서·길이·encoding과 domain tag를 고정합니다.",
              "Digest가 같아도 L1 endpoint의 정직성이나 binary의 무결점까지 증명하지는 않습니다.",
            ]}
            interpretation="Genesis가 같아도 rollup config나 L1 원천, binary가 다르면 새 generation입니다. Process health와 chain 이름은 이 비교를 대신하지 못합니다."
          />

          <p>
            2026-10-13에 공개된 GIWA node v0.6.1은 op-node v1.19.5와 op-reth
            v2.3.3을 사용합니다. 이 업데이트가 중요한 이유는 Sepolia의
            Glamsterdam hardfork 뒤 추가된 L1 header fields입니다. 이전
            op-node는 새 header를 검증하지 못해 derivation이 멈추고
            safe·finalized head가 더는 전진하지 않을 수 있습니다.
          </p>

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="실제 GIWA v0.6.1 Compose · op-node와 op-reth 연결"
              onClick={() =>
                sidebar.open("giwa-node-compose", codeRefs["giwa-node-compose"])
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">Engine JWT가 확인하는 것</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                op-node가 op-reth의 private Engine endpoint를 호출할 권한입니다.
                Payload validity, L1 RPC honesty와 finality를 증명하지는
                않습니다.
              </p>
            </article>
            <article className="rounded-lg border border-border p-4">
              <h3 className="font-semibold">Sync mode가 바꾸는 것</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Snap, archive, consensus-driven sync는 시작 시간·disk·history
                보존과 신뢰 경계를 바꿉니다. 어느 mode든 generation과 parity
                검사는 따로 필요합니다.
              </p>
            </article>
          </div>

          <div id="paper-giwa-node-source">
            <CitationBlock
              type="code"
              citeKey={2}
              source="giwa-io/node v0.6.1 · commit dcb59ac"
              href={GIWA_NODE}
            >
              <p>
                <strong>핵심:</strong> 실제 bundle은 JWT generator, op-reth
                v2.3.3, op-node v1.19.5와 Sepolia env를 제공합니다.
              </p>
              <p>
                <strong>업데이트 이유:</strong>{" "}
                <a className="text-primary hover:underline" href={GIWA_RELEASE}>
                  v0.6.1 release
                </a>
                는 Glamsterdam 호환성, 비어 있는 JWT secret 재생성, HTTPS
                sequencer용 CA와 peer 설정 수정을 포함합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> 이 bundle은 Mainnet 준비, endpoint
                가용성, 고정 hardware 용량이나 보안 무결점을 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="derivation-heads" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · 같은 거래를 L1 입력에서 다시 만든다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Sequencer의 답을 L1 batch에서 다시 만듭니다
            </h2>
          </header>

          <p>
            Sequencer는 거래 T가 든 block 120을 먼저 배포합니다. 그래서 사용자는
            빠르게 결과를 볼 수 있지만 이 branch는 아직 교체될 수 있습니다.
            op-node는 L1 block·receipt·beacon data와 batch frame을 읽고 활성화된
            rollup 규칙을 적용해 block 120의 payload를 다시 만듭니다.
          </p>

          <p>
            여기서 op-node와 op-reth의 역할이 갈립니다. op-node는 입력의 순서와
            규칙을 해석해 payload를 정합니다. op-reth는 그 payload를 parent
            state 위에서 EVM으로 실행해 receipt와 state root를 계산합니다. 같은
            L1 view를 보았는데 둘의 결과가 기준 node와 다르면 safe head를
            전진시키면 안 됩니다.
          </p>

          <ExplainedFormula
            question="거래 T가 든 block 120을 같은 결과로 재현하려면 무엇이 같아야 할까?"
            idea={
              <>
                Canonical L1 입력과 batch, rollup config로 payload를 만든 뒤
                같은 parent state에서 실행합니다.
              </>
            }
            formula={String.raw`P_{120}=Derive_v(L1_{o:k},B_{o:k},C),\quad S_{120}=Exec_v(S_{119},P_{120})`}
            annotatedFormula={String.raw`\underbrace{P_{120}}_{\text{재구성한 payload}}=Derive_v(\underbrace{L1_{o:k}}_{\text{canonical L1}},\underbrace{B_{o:k}}_{\text{batch data}},\underbrace{C}_{\text{rollup config}}),\quad \underbrace{S_{120}}_{\text{실행 뒤 state}}=Exec_v(\underbrace{S_{119}}_{\text{parent state}},P_{120})`}
            operations={[
              {
                expression: String.raw`P_{120}=Derive_v(L1_{o:k},B_{o:k},C)`,
                annotation: [
                  "op-node가 L1 data와 config를 읽습니다",
                  "block 120에 실행할 ordered payload를 만듭니다",
                ],
              },
              {
                expression: String.raw`S_{120}=Exec_v(S_{119},P_{120})`,
                annotation: [
                  "op-reth가 parent 119 위에서 payload를 실행합니다",
                  "receipt와 state root를 기준 node와 비교합니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "P_{120}",
                name: "Derived payload",
                description:
                  "Block 120에 들어갈 거래와 system input의 순서입니다.",
              },
              {
                symbol: "L1_{o:k}",
                name: "Canonical L1 inputs",
                description:
                  "Origin o부터 k까지의 block·receipt·beacon data입니다.",
              },
              {
                symbol: "B_{o:k}",
                name: "Batch data",
                description: "Frame과 channel에서 복원한 L2 거래 입력입니다.",
              },
              {
                symbol: "C",
                name: "Rollup config",
                description:
                  "Genesis, block time, addresses와 activation schedule입니다.",
              },
              {
                symbol: "S_{119},S_{120}",
                name: "Execution states",
                description: "실행 전 parent state와 실행 뒤 state입니다.",
              },
            ]}
            assumptions={[
              "두 node가 같은 canonical L1 view, input ordering과 protocol revision을 사용합니다.",
              "필요한 data를 읽을 수 있고 derivation과 EVM execution이 deterministic하다고 둡니다.",
            ]}
            interpretation="Sequencer 응답이 같다는 사실만으로 safe parity가 성립하지 않습니다. L1에서 재구성한 payload, receipt와 state root가 모두 같아야 합니다."
          />

          <p>
            L1 reorg가 생기면 “최근 높이 몇 개를 지운다”로 처리하지 않습니다.
            op-node는 현재 L1 origin과 새 canonical chain의 공통 조상을 찾고, 그
            origin까지 derivation을 되감아 batch를 다시 읽습니다. 따라서 운영
            로그에는 L2 높이뿐 아니라 block hash와 L1 origin을 함께 남겨야
            합니다.
          </p>

          <div id="paper-op-derivation">
            <CitationBlock
              citeKey={3}
              source="OP Stack Specification · Derivation"
              href={OP_DERIVATION}
            >
              <p>
                <strong>핵심:</strong> L1 batch, frame·channel, sequencing
                window와 derivation pipeline이 safe L2 payload를 재현하는 규칙을
                정합니다.
              </p>
              <p>
                <strong>가정:</strong> 정확한 protocol revision, chain config,
                canonical L1 view와 activation schedule을 함께 고정합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> Generic OP 규격은 GIWA-specific
                config, sequencer liveness, execution-client 무결점이나 앱
                안전성을 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="head-policy" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · 보였는지와 확정됐는지를 나눈다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              세 head는 같은 chain 위의 확인 위치입니다
            </h2>
          </header>

          <p>
            예제의 시작점은 unsafe 120, safe 118, finalized 115입니다. 이는
            115가 118의 조상이고 118이 120의 조상이라는 뜻입니다. 높이 차이 5가
            5초를 뜻하거나, finalized 115가 거래 T까지 확정했다는 뜻은 아닙니다.
          </p>

          <ExplainedFormula
            question="Unsafe 120·safe 118·finalized 115를 어떻게 읽어야 할까?"
            idea={
              <>
                세 높이를 confirmation 점수로 더하지 않고 같은 canonical
                ancestry 위의 cursor로 읽습니다.
              </>
            }
            formula={String.raw`H_{finalized}\preceq H_{safe}\preceq H_{unsafe},\quad 115\preceq118\preceq120`}
            annotatedFormula={String.raw`\underbrace{H_{finalized}}_{\text{L1 origin까지 finalized}}\preceq\underbrace{H_{safe}}_{\text{L1 batch에서 재구성}}\preceq\underbrace{H_{unsafe}}_{\text{sequencer 최신}},\quad115\preceq118\preceq120`}
            operations={[
              {
                expression: String.raw`115\preceq118`,
                annotation: [
                  "finalized 115는 safe 118의 canonical ancestor입니다",
                ],
              },
              {
                expression: String.raw`118\preceq120`,
                annotation: [
                  "safe 118은 unsafe 120의 canonical ancestor입니다",
                  "거래 T가 120에 있으면 아직 safe가 아닙니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "H_{unsafe}",
                name: "Unsafe head",
                description: "Sequencer가 만든 최신 L2 head입니다.",
              },
              {
                symbol: "H_{safe}",
                name: "Safe head",
                description: "Canonical L1 batch에서 재구성된 L2 head입니다.",
              },
              {
                symbol: "H_{finalized}",
                name: "Finalized head",
                description: "해당 L1 origin까지 finalized된 L2 head입니다.",
              },
              {
                symbol: "\\preceq",
                name: "Ancestor relation",
                description:
                  "왼쪽 block이 오른쪽 block의 canonical ancestor라는 뜻입니다.",
              },
            ]}
            assumptions={[
              "예제 높이는 단순 ancestry이며 실제 판단은 hash와 L1 origin으로 합니다.",
              "Head label은 현재 GIWA/OP node가 보고한 exact semantics를 따릅니다.",
            ]}
            interpretation="거래 T가 block 120에 있다면 safe head가 120 이상이 되고 ancestry가 일치할 때 비로소 T를 safe라고 부를 수 있습니다."
          />

          <div id="paper-giwa-network-diffs">
            <CitationBlock
              citeKey={4}
              source="GIWA Documentation · Differences from Ethereum"
              href={GIWA_DIFFS}
            >
              <p>
                <strong>핵심:</strong> GIWA의 sequencer, bridge, mempool과
                unsafe·safe·finalized 상태를 Ethereum L1과 구분해 설명합니다.
              </p>
              <p>
                <strong>확대 금지:</strong> Safe·finalized 표시는 withdrawal
                절차 종료, censorship resistance나 application-level
                finality까지 자동 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="application-boundary" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · 거래 확인과 외부 효과 승인을 분리한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              UI 미리보기와 상품 출고·타망 지급은 같은 head 정책을 쓰면 안
              됩니다
            </h2>
          </header>

          <p>
            되돌릴 수 있는 화면 표시라면 unsafe 120을 써도 됩니다. 그러나 상품
            출고나 다른 network 지급처럼 되돌리기 어려운 효과에는 safe 또는
            finalized를 요구해야 합니다. 거래 T의 영수증에는 L2 block hash, L1
            origin, 관측한 head와 application effect ID를 함께 기록합니다.
          </p>

          <ExplainedFormula
            question="거래 T의 외부 효과를 승인할 최소 조건은 무엇일까?"
            idea={
              <>
                올바른 generation, 실행 receipt, 요구한 head와 중복 방지 fence를
                모두 통과할 때만 승인합니다.
              </>
            }
            formula={String.raw`A_T=A_G\land A_{exec}\land A_{head\ge p}\land A_{effect}`}
            annotatedFormula={String.raw`\underbrace{A_T}_{\text{외부 효과 승인}}=\underbrace{A_G}_{\text{generation 일치}}\land\underbrace{A_{exec}}_{\text{receipt 일치}}\land\underbrace{A_{head\ge p}}_{\text{요구 head 통과}}\land\underbrace{A_{effect}}_{\text{중복 실행 방지}}`}
            operations={[
              {
                expression: String.raw`A_{head\ge safe}=0`,
                annotation: [
                  "T는 아직 unsafe 120에만 있습니다",
                  "receipt가 성공이어도 safe 정책은 통과하지 못합니다",
                ],
              },
              {
                expression: String.raw`1\land1\land1\land1=1`,
                annotation: [
                  "네 조건이 모두 참일 때만 외부 효과를 한 번 실행합니다",
                ],
              },
            ]}
            terms={[
              {
                symbol: "A_G",
                name: "Generation match",
                description:
                  "기대한 chain·config·binary 세대와 같으면 1입니다.",
              },
              {
                symbol: "A_{exec}",
                name: "Execution receipt",
                description: "거래 status·logs·block context가 맞으면 1입니다.",
              },
              {
                symbol: "A_{head\\ge p}",
                name: "Head policy",
                description:
                  "앱이 요구한 unsafe·safe·finalized를 통과하면 1입니다.",
              },
              {
                symbol: "A_{effect}",
                name: "Effect fence",
                description: "같은 effect ID를 아직 실행하지 않았으면 1입니다.",
              },
            ]}
            assumptions={[
              "효과의 가치와 되돌림 가능성에 맞춰 policy p를 미리 정합니다.",
              "Block number만 보지 않고 hash·ancestry·L1 origin을 확인합니다.",
            ]}
            interpretation="Unsafe receipt가 성공이어도 앱 정책이 safe라면 승인은 0입니다. 승인이 1이어도 stablecoin 준비금과 상환 가능성까지 참이 되는 것은 아닙니다."
          />

          <p>
            반례를 보면 경계가 선명합니다. App이 unsafe deposit T를 본 즉시 다른
            지급망에서 출금해 주고, 이후 L1 reorg로 T가 사라졌다고 가정해
            봅시다. GIWA 안의 balance는 되돌아가도 이미 나간 외부 지급은
            자동으로 돌아오지 않습니다. Head policy, effect ID와 보상 절차가
            필요한 이유입니다.
          </p>
        </section>

        <section id="release-gate" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              05 · 마지막으로 node bundle을 승격한다
            </p>
            <h2 className="mt-2 break-keep text-2xl font-bold">
              Parity와 reorg 복구를 통과한 세대만 올립니다
            </h2>
          </header>

          <p>
            Canary에는 source SHA, 두 client 버전, genesis·rollup config digest,
            L1 endpoint와 신뢰 설정, JWT 세대, sync mode와 snapshot 세대를 함께
            기록합니다. 같은 L1 origin 구간에서 기준 node와 payload hash,
            receipt, state root와 head 전이를 비교한 뒤에 latency와 disk를
            측정합니다.
          </p>

          <ol className="grid gap-3 sm:grid-cols-2">
            {[
              [
                "Identity 음성 시험",
                "다른 chain ID·genesis/rollup 조합, stale op-geth와 예상하지 못한 activation을 거부합니다.",
              ],
              [
                "Engine handoff 음성 시험",
                "JWT mismatch, Engine disconnect, invalid payload와 L1 endpoint 불일치를 서로 다른 원인으로 기록합니다.",
              ],
              [
                "Reorg·restart 복구",
                "L1 reorg, process crash, snapshot corruption 뒤 공통 origin에서 다시 derivation해 parity를 회복합니다.",
              ],
              [
                "Rollback과 외부 효과",
                "새 write를 멈추고 직전 호환 세대로 돌아가되 이미 실행한 외부 효과부터 reconciliation합니다.",
              ],
            ].map(([title, description]) => (
              <li key={title} className="rounded-lg border border-border p-4">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>

          <p>
            Testnet canary 성공을 Mainnet readiness로 바꾸어 말해서는 안 됩니다.
            Benchmark도 같은 L1 source, head distance, sync mode, snapshot age,
            hardware와 요청 조합에서 p50·p95·p99, reorg catch-up과 disk growth를
            함께 비교해야 합니다.
          </p>

          <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">이 글의 결론:</strong> GIWA
            node는 sequencer의 답을 그대로 저장하는 서버가 아닙니다. op-node가
            L1 입력에서 실행할 payload를 다시 만들고 op-reth가 그 결과를
            재현하며, 앱은 head와 효과의 되돌림 가능성에 맞춰 별도의 승인선을
            둡니다.
          </aside>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "giwa-node": giwaNodeTree }}
        projectMetas={{
          "giwa-node": {
            id: "giwa-node",
            label: "GIWA node · Compose",
            badgeClass: "border-blue-500 bg-blue-500/10 text-blue-700",
          },
        }}
      />
    </>
  );
}
