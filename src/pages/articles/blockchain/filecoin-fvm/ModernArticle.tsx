import ContentBoundary from "@/components/articles/content-boundary";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import { FvmExecutionViz } from "./FvmExecutionViz";
import { fvmTree } from "./fileTrees";
import CallScopeViz from "./viz/CallScopeViz";
import FailureBranchViz from "./viz/FailureBranchViz";

const FIP30 =
  "https://github.com/filecoin-project/FIPs/blob/56863b13e62685f8e8e6b2b2f5048ba142263031/FIPS/fip-0030.md";
const EXECUTOR =
  "https://github.com/filecoin-project/ref-fvm/blob/8fbafbf257333168b4782569415d1ad451c174fa/fvm/src/executor/default.rs";
const EXECUTOR_TRAIT =
  "https://github.com/filecoin-project/ref-fvm/blob/8fbafbf257333168b4782569415d1ad451c174fa/fvm/src/executor/mod.rs";
const CALL_MANAGER =
  "https://github.com/filecoin-project/ref-fvm/blob/8fbafbf257333168b4782569415d1ad451c174fa/fvm/src/call_manager/default.rs";
const MANIFEST =
  "https://github.com/filecoin-project/ref-fvm/blob/8fbafbf257333168b4782569415d1ad451c174fa/fvm/src/machine/manifest.rs";

export default function ModernFilecoinFvm() {
  const sidebar = useCodeSidebar();

  return (
    <>
      <article className="space-y-14">
        <section id="overview" className="space-y-6">
          <header className="space-y-3">
            <p className="text-sm font-semibold text-primary">
              Machine 하나 · 순서가 있는 message 여러 건 · 마지막 state root 하나
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              FVM은 message마다 영수증을 만들고 마지막에 state root를 계산합니다
            </h2>
          </header>
          <p className="text-lg leading-8 text-foreground/90">
            Filecoin의 state를 공동 장부라고 생각하면 actor는 장부를 바꾸는
            프로그램이고 message는 그 프로그램에 보내는 요청입니다. FVM은 초기
            장부와 실행 규칙을 고정한 Machine에서 message를 순서대로 처리합니다.
          </p>
          <p>
            여기서 message 한 건의 완료와 전체 실행 묶음의 완료를 구분해야
            합니다. <code>execute_message()</code>는 각 message의 영수증을
            만들고 working state를 다음 message로 넘깁니다. 호출자가 모든
            message를 적용한 뒤 <code>flush()</code>를 불러야 최종 state root가
            나옵니다.
          </p>
          <p>
            이 글은 첫 message에서 actor A가 B를 부른 뒤 실패하고, 두 번째
            message까지 적용한 다음 Machine을 flush하는 사례를 따라갑니다.
            합의가 어느 chain을 선택하는지는
            <a
              className="ml-1 text-primary hover:underline"
              href="/cs/blockchain/consensus-comparison#smr"
            >
              state machine replication 정본
            </a>
            에 맡기고, 여기서는 FVM 내부 실행 경계만 봅니다.
          </p>

          <FvmExecutionViz />

          <div className="not-prose flex flex-wrap gap-3">
            <CodeViewButton
              label="Message executor 발췌"
              onClick={() =>
                sidebar.open("fvm-machine", codeRefs["fvm-machine"])
              }
            />
            <CodeViewButton
              label="Executor와 flush 경계"
              onClick={() => sidebar.open("fvm-flush", codeRefs["fvm-flush"])}
            />
          </div>

          <ContentBoundary article="filecoin-fvm" />

          <div id="paper-fvm-fip30">
            <CitationBlock
              type="paper"
              citeKey={1}
              source="FIP-0030 · Final · revision 56863b1"
              href={FIP30}
            >
              <p>
                <strong>문제:</strong> Filecoin state tree에 message를 적용할
                결정론적 Wasm 실행 계층이 필요합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Machine, Call Manager, Invocation
                Container, Kernel, syscall과 actor의 책임을 정의하고 message 적용과
                마지막 flush를 분리합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> 2024-09-18에 Final로 바뀐 revision
                56863b1과 실제 활성 network version을 함께 확인합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> FVM의 protocol 설계와 책임 경계에
                한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 이 문서는 native user-defined Wasm
                actor를 현재 mainnet에 배포할 수 있다고 말하지 않습니다. Custom
                EVM contract는 FEVM 경로입니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <span id="message-envelope" className="sr-only" aria-hidden="true" />
        <section id="machine-context" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              01 · Machine context
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Message만 같으면 같은 실행일까요?
            </h2>
          </header>
          <p>
            아닙니다. FVM Machine은 초기 state root뿐 아니라 epoch, base fee,
            circulating supply, network version과 blockstore를 입력으로 받습니다.
            Built-in actor manifest도 어떤 code CID를 실행할지 정합니다. 이 문맥이
            다르면 같은 message bytes도 다른 결과를 낼 수 있습니다.
          </p>
          <p>
            Explicit message에는 발신자와 수신자, sequence, value, method, params,
            gas limit, fee cap과 premium이 들어갑니다. Implicit message는 시스템이
            만들며 sequence와 실제 gas 지불 규칙이 다릅니다. 둘을 같은 입력
            유형으로 취급하면 안 됩니다.
          </p>

          <ExplainedFormula
            question="FVM Machine 한 개를 재현하려면 무엇을 고정해야 할까?"
            idea={
              <>
                초기 장부와 chain context, 실행 규칙과 저장소를 한 tuple로
                기록합니다.
              </>
            }
            formula={String.raw`M_0=(S_0,e,b,c,nv,BS,B)`}
            annotatedFormula={String.raw`\underbrace{M_0}_{\text{초기 Machine}}=(\underbrace{S_0}_{\text{초기 state root}},\underbrace{e,b,c}_{\text{epoch·base fee·supply}},\underbrace{nv}_{\text{network version}},\underbrace{BS}_{\text{blockstore}},\underbrace{B}_{\text{actor manifest}})`}
            operations={[
              {
                expression: String.raw`(S_0,e,b,c,nv,BS,B)`,
                annotation: [
                  "초기 state와 chain context를 고정",
                  "실행 규칙·actor code·읽을 block을 고정",
                  "그 뒤 순서가 있는 message를 적용",
                ],
              },
            ]}
            terms={[
              {
                symbol: "M_0",
                name: "Initial Machine",
                description: "Message를 적용하기 전 FVM 실행 인스턴스입니다.",
              },
              {
                symbol: "S_0",
                name: "Initial state root",
                description: "Machine이 처음 읽는 actor state tree의 CID입니다.",
              },
              {
                symbol: "e",
                name: "Epoch",
                description: "실행 시점의 Filecoin chain epoch입니다.",
              },
              {
                symbol: "b",
                name: "Base fee",
                description: "해당 실행 문맥의 base fee입니다.",
              },
              {
                symbol: "c",
                name: "Circulating supply",
                description: "Machine context가 받는 base circulating supply입니다.",
              },
              {
                symbol: "nv",
                name: "Network version",
                description: "적용할 protocol semantics를 고릅니다.",
              },
              {
                symbol: "BS",
                name: "Blockstore",
                description: "State와 actor bytecode를 읽고 새 block을 쓰는 저장소입니다.",
              },
              {
                symbol: "B",
                name: "Actor manifest",
                description: "Built-in actor 이름과 code CID를 연결합니다.",
              },
            ]}
            assumptions={[
              "동일 실행을 비교할 때 message 순서와 외부 randomness 같은 Externs도 같아야 합니다.",
              "이 tuple은 학습용 표기이며 chain에 저장되는 단일 공식 digest를 뜻하지 않습니다.",
            ]}
            interpretation="Message CID 하나만 같다고 실행이 같다고 판단하지 않습니다. Machine context와 message 순서를 함께 고정해야 합니다."
          />

          <div id="paper-fvm-executor">
            <CitationBlock
              type="code"
              citeKey={2}
              source="ref-fvm default executor · fvm@v4.8.4 · commit 8fbafbf"
              href={EXECUTOR}
            >
              <p>
                <strong>문제:</strong> Explicit·implicit message를 사전 검사하고
                actor 호출 결과를 일관된 ApplyRet으로 바꿔야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> 고정 소스는 preflight, actor call,
                receipt 생성과 message-level gas 정산 순서를 보여 줍니다.
              </p>
              <p>
                <strong>중요 가정:</strong> 2026-10-08 공개된 fvm@v4.8.4 tag와
                commit 8fbafbf의 types·Machine·price list를 함께 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> 해당 reference executor의 control
                flow에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 이 구현이 모든 client의 내부 구조,
                actor 안전성이나 처리량을 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <span id="state-commit" className="sr-only" aria-hidden="true" />
        <section id="actor-transaction" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              02 · Actor-call transaction
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              Actor A가 실패하면 무엇이 되돌아갈까요?
            </h2>
          </header>
          <p>
            Executor의 사전 검사는 explicit message의 sender sequence를 올리고 최대
            gas 비용을 먼저 뺍니다. 그다음 Call Manager가 state tree, actor
            events와 state-access tracker의 transaction을 시작하고 actor A를
            호출합니다.
          </p>
          <CallScopeViz />
          <p>
            A가 B를 부른 뒤 성공하지 못하면 이 actor-call transaction에 임시로
            쌓인 변경과 events를 되돌립니다. 그러나 transaction 밖에서 먼저
            반영한 sender sequence와 gas 정산까지 없던 일이 되는 것은 아닙니다.
            따라서 “actor 실패 = message가 state에 아무 영향도 주지 않음”은
            틀린 설명입니다.
          </p>
          <p>
            Message 영수증에는 exit code, return data, gas used와 events root가
            들어갑니다. 최종 state root는 영수증 필드가 아니며, 여러 message를
            적용한 뒤 별도의 flush에서 계산합니다.
          </p>

          <ExplainedFormula
            question="Message 한 건을 적용하면 무엇이 남을까?"
            idea={
              <>
                Working state의 다음 상태와 message 영수증을 함께 얻되, final root는
                아직 만들지 않습니다.
              </>
            }
            formula={String.raw`(\Sigma_i,R_i,G_i)=\operatorname{Apply}_{M_0}(\Sigma_{i-1},m_i)`}
            annotatedFormula={String.raw`\underbrace{(\Sigma_i,R_i,G_i)}_{\text{다음 working state·영수증·gas 결과}}=\underbrace{\operatorname{Apply}_{M_0}}_{\text{고정된 Machine 규칙}}(\underbrace{\Sigma_{i-1},m_i}_{\text{직전 working state·현재 message}})`}
            operations={[
              {
                expression: String.raw`\operatorname{Apply}_{M_0}(\Sigma_{i-1},m_i)`,
                annotation: [
                  "사전 검사와 message-level 효과 반영",
                  "actor-call transaction 실행·필요하면 revert",
                  "receipt와 gas 정산 결과 생성",
                ],
              },
              {
                expression: String.raw`(\Sigma_i,R_i,G_i)`,
                annotation: [
                  "Σᵢ는 다음 message가 볼 working state",
                  "Rᵢ에는 state root가 없음",
                  "Gᵢ는 burn·tip·refund 등 정산 결과",
                ],
              },
            ]}
            terms={[
              {
                symbol: String.raw`\Sigma_{i-1}`,
                name: "Working state before message",
                description: "앞선 message까지 적용된 Machine 내부 상태입니다.",
              },
              {
                symbol: "m_i",
                name: "Current message",
                description: "이번에 적용할 explicit 또는 implicit message입니다.",
              },
              {
                symbol: String.raw`\Sigma_i`,
                name: "Working state after message",
                description: "이번 message와 바깥 gas 효과까지 반영한 다음 상태입니다.",
              },
              {
                symbol: "R_i",
                name: "Message receipt",
                description: "Exit code·return data·gas used·events root를 담습니다.",
              },
              {
                symbol: "G_i",
                name: "Gas outputs",
                description: "Burn, penalty, tip, refund와 gas accounting 결과입니다.",
              },
            ]}
            assumptions={[
              "Actor-call transaction과 message 전체 적용 경계를 구분합니다.",
              "Working state Σ는 매 message 뒤 flush된 공식 state-root CID를 뜻하지 않습니다.",
            ]}
            interpretation="Actor A의 업무 변경이 되돌아가도 sender sequence와 gas 관련 state는 남을 수 있습니다. 영수증과 final state root도 구분해야 합니다."
          />

          <div id="paper-fvm-transaction">
            <CitationBlock
              type="code"
              citeKey={3}
              source="ref-fvm call manager transaction · fvm@v4.8.4 · commit 8fbafbf"
              href={CALL_MANAGER}
            >
              <p>
                <strong>문제:</strong> Nested actor calls의 state, events와 access
                records를 같은 성공·실패 경계로 다뤄야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> <code>with_transaction</code>은 세
                저장 영역을 함께 시작하고 non-success exit code나 execution
                error에서 모두 revert합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> fvm@v4.8.4 commit 8fbafbf의 call
                manager, gas tracker와 state tree 구현을 함께 봅니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Actor-call transaction scope에
                한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> 이 revert를 sender sequence, fee,
                block inclusion까지 포함한 chain 전체 무변화로 확대하지 않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <section id="actor-bundle" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              03 · Actor manifest
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              어떤 actor code를 실행했는지는 어디서 정할까요?
            </h2>
          </header>
          <p>
            Built-in actor manifest는 <code>system</code>, <code>account</code>,
            <code>init</code> 같은 이름을 content-addressed code CID에 연결합니다.
            고정한 ref-fvm 구현은 manifest version 1만 받고, root CID의 block을
            찾지 못하거나 필수 이름이 없으면 Machine 준비를 실패시킵니다.
          </p>
          <p>
            Network upgrade가 actor bundle을 바꾸면 같은 actor 이름도 다른 code
            CID를 가리킬 수 있습니다. 그래서 network version만 적거나 “Wasm
            actor를 실행했다”라고만 쓰면 재현 정보가 부족합니다.
          </p>
          <p>
            FIP-0030의 Final 문서는 native user-defined Wasm actor를 현재 Filecoin
            mainnet에 배포할 수 없다고 명시합니다. 사용자가 배포하는 EVM smart
            contract는 FEVM이 제공하는 foreign-runtime 경로입니다.
          </p>

          <ExplainedFormula
            question="Actor 이름은 어떻게 실제 program으로 이어질까?"
            idea={
              <>
                고정한 manifest 판본에서 actor 이름을 code CID로 해석합니다.
              </>
            }
            formula={String.raw`C_a=\operatorname{Manifest}_{v,B}[name(a)]`}
            annotatedFormula={String.raw`\underbrace{C_a}_{\text{실행할 actor code CID}}=\underbrace{\operatorname{Manifest}_{v,B}}_{\text{version·bundle root 고정}}[\underbrace{name(a)}_{\text{actor 이름}}]`}
            operations={[
              {
                expression: String.raw`\operatorname{Manifest}_{v,B}[name(a)]`,
                annotation: [
                  "manifest version과 root B를 먼저 고정",
                  "actor 이름으로 code CID 조회",
                  "그 CID의 Wasm module을 blockstore에서 읽음",
                ],
              },
            ]}
            terms={[
              {
                symbol: "C_a",
                name: "Actor code CID",
                description: "실제로 불러올 actor Wasm bytecode의 식별자입니다.",
              },
              {
                symbol: "v",
                name: "Manifest version",
                description: "Manifest 자료 구조의 지원 판본입니다.",
              },
              {
                symbol: "B",
                name: "Manifest root CID",
                description: "Actor 이름·code CID 목록을 가리키는 root입니다.",
              },
              {
                symbol: "name(a)",
                name: "Actor name",
                description: "System, account, init 같은 built-in actor 이름입니다.",
              },
            ]}
            assumptions={[
              "Manifest root가 가리키는 block과 actor code blocks를 blockstore에서 읽을 수 있어야 합니다.",
              "Code CID 일치는 actor source audit나 application safety를 증명하지 않습니다.",
            ]}
            interpretation="Network version과 manifest root를 함께 기록해야 어느 actor program을 실행했는지 다시 확인할 수 있습니다."
          />

          <div id="paper-fvm-manifest">
            <CitationBlock
              type="code"
              citeKey={4}
              source="ref-fvm actor manifest · fvm@v4.8.4 · commit 8fbafbf"
              href={MANIFEST}
            >
              <p>
                <strong>문제:</strong> Runtime이 manifest 판본과 required actor
                names를 code CID에 안전하게 연결해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> 고정 소스는 blockstore에서 root를
                읽고 supported version과 required entries를 검증합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> fvm@v4.8.4 commit 8fbafbf의 manifest
                schema와 network configuration을 사용합니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Manifest loading과 lookup 구현에
                한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Manifest가 존재한다고 actor source
                audit, upgrade safety나 arbitrary user code 보안이 증명되지는
                않습니다.
              </p>
            </CitationBlock>
          </div>
        </section>

        <span id="release-gate" className="sr-only" aria-hidden="true" />
        <section id="machine-flush" className="space-y-6">
          <header>
            <p className="text-sm font-semibold text-primary">
              04 · Message receipt와 final root
            </p>
            <h2 className="mt-2 text-2xl font-bold">
              최종 state root는 정확히 언제 생길까요?
            </h2>
          </header>
          <p>
            호출자는 같은 Machine에 message를 순서대로 적용합니다. 각 호출은
            ApplyRet을 돌려주고 그 안의 message receipt가 chain에 기록될 결과를
            담습니다. 다음 message는 앞선 message까지 반영된 working state를
            봅니다.
          </p>
          <p>
            모든 message 적용을 마친 뒤 호출자가 <code>flush()</code>를 부르면
            state tree가 blockstore에 기록되고 final state-root CID가 나옵니다.
            따라서 R₁이 만들어진 시점과 Sfinal이 만들어진 시점은 다릅니다.
          </p>
          <FailureBranchViz />
          <p>
            사전 검사 실패는 actor를 호출하지 않고 조기 ApplyRet을 만들 수
            있습니다. Actor의 non-success exit는 actor-call 변경을 되돌린
            영수증으로 남습니다. 반면 state I/O처럼 executor가 ApplyRet을 만들지
            못하는 오류나 마지막 flush 실패는 호출자가 전체 실행 실패로 다뤄야
            합니다.
          </p>

          <ExplainedFormula
            question="여러 message 실행의 최종 산출물은 무엇일까?"
            idea={
              <>
                각 message의 영수증을 순서대로 얻고, 마지막 working state만 한 번
                flush합니다.
              </>
            }
            formula={String.raw`\Sigma_i,R_i=\operatorname{Apply}(\Sigma_{i-1},m_i),\quad S_{final}=\operatorname{Flush}(\Sigma_n)`}
            annotatedFormula={String.raw`\underbrace{\Sigma_i,R_i}_{\text{message i의 다음 state·영수증}}=\operatorname{Apply}(\underbrace{\Sigma_{i-1},m_i}_{\text{직전 state·현재 message}}),\quad \underbrace{S_{final}}_{\text{최종 state-root CID}}=\operatorname{Flush}(\underbrace{\Sigma_n}_{\text{모든 message 뒤 working state}})`}
            operations={[
              {
                expression: String.raw`\Sigma_i,R_i=\operatorname{Apply}(\Sigma_{i-1},m_i)`,
                annotation: [
                  "m₁부터 mₙ까지 순서대로 적용",
                  "각 message마다 Rᵢ 생성",
                  "다음 message는 Σᵢ에서 시작",
                ],
              },
              {
                expression: String.raw`S_{final}=\operatorname{Flush}(\Sigma_n)`,
                annotation: [
                  "모든 message 적용을 마친 뒤 한 번 flush",
                  "blockstore에 state blocks 기록",
                  "최종 root CID 반환",
                ],
              },
            ]}
            terms={[
              {
                symbol: "n",
                name: "Message count",
                description: "호출자가 이 Machine에 적용한 message 수입니다.",
              },
              {
                symbol: "R_i",
                name: "Receipt i",
                description: "i번째 message의 실행 영수증입니다.",
              },
              {
                symbol: String.raw`\Sigma_n`,
                name: "Final working state",
                description: "모든 message가 적용됐지만 아직 flush 전인 state입니다.",
              },
              {
                symbol: "S_{final}",
                name: "Final state root",
                description: "Flush가 반환한 content-addressed state-tree root입니다.",
              },
            ]}
            assumptions={[
              "같은 초기 Machine context와 같은 message 순서를 사용합니다.",
              "FVM의 final root 계산과 consensus의 chain-head 선택은 서로 다른 책임입니다.",
            ]}
            interpretation="독립 실행을 비교할 때는 receipt 한 건만 보지 않고, 순서가 있는 receipt 목록과 마지막 state root를 함께 확인합니다."
          />

          <div id="paper-fvm-flush">
            <CitationBlock
              type="code"
              citeKey={5}
              source="ref-fvm Executor trait · fvm@v4.8.4 · commit 8fbafbf"
              href={EXECUTOR_TRAIT}
            >
              <p>
                <strong>문제:</strong> Message 적용과 state-tree flush의 API 경계를
                분리해야 합니다.
              </p>
              <p>
                <strong>핵심 기여:</strong> Executor trait는
                <code>execute_message</code>와 <code>flush</code>를 별도 method로
                정의하고, flush가 새 root CID를 반환한다고 명시합니다.
              </p>
              <p>
                <strong>중요 가정:</strong> fvm@v4.8.4 commit 8fbafbf의 Executor
                interface와 caller가 정한 message 순서를 함께 봅니다.
              </p>
              <p>
                <strong>근거 범위:</strong> Reference FVM의 message/flush API
                경계에 한정합니다.
              </p>
              <p>
                <strong>일반화 금지:</strong> Flush 성공이 chain finality나 fork
                choice, block inclusion을 보장하지 않습니다.
              </p>
            </CitationBlock>
          </div>

          <aside className="rounded-lg border border-border bg-muted/20 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">부모 지도에 돌려줄 결론:</strong>{" "}
            Lotus 같은 caller는 FVM에 초기 state와 순서가 있는 message를
            전달합니다. FVM은 message별 receipt와 마지막 state root를 만들지만,
            어느 chain이 정본인지는 합의 계층이 결정합니다.
          </aside>
        </section>
      </article>

      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ "ref-fvm": fvmTree }}
        projectMetas={{
          "ref-fvm": {
            id: "ref-fvm",
            label: "ref-fvm · Rust",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </>
  );
}
