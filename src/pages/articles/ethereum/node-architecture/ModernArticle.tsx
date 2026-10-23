import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { teachCodeRefs } from "./teachCodeRefs";
import {
  ArchitectureLearningPathsViz,
  BalanceTransitionViz,
  DecisionSeparationViz,
  NodeRequestTraceViz,
  PayloadStateViz,
  StateOwnershipViz,
  SystemBlackBoxViz,
  SystemSettledViz,
} from "./viz/ModernNodeArchitectureViz";

export default function ModernNodeArchitectureArticle() {
  const sidebar = useCodeSidebar();

  return (
    <>
    <article className="space-y-14 [&_section]:space-y-5 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:leading-8">
      <section id="overview" data-teach-level="S">
        <h2>1. 전체 구조</h2>
        <p><strong>A가 B에게 10 ETH를 보내는 송금이 새 블록 후보에 담겼다고 하겠습니다.</strong> 노드 안에서는 한 프로그램이 부모 잔액에서 새 잔액을 계산하고, 다른 프로그램이 여러 후보 가운데 지금 따를 기록을 고릅니다.</p>
        <p>먼저 제품 이름 없이 두 책임과 두 저장소를 봅니다. 네트워크 경계에서는 다른 노드와 후보·거래를 주고받고, 서비스 경계에서는 지갑과 검증자 도구가 결과를 읽습니다.</p>
        <SystemBlackBoxViz />
        <p>기록을 고르는 프로그램은 <strong>합의 클라이언트(CL)</strong>, 거래를 계산하는 프로그램은 <strong>실행 클라이언트(EL)</strong>라고 부릅니다. 가운데 <strong>Engine API</strong>는 후보와 판정을 전달하지만 두 프로그램의 책임이나 저장소를 하나로 합치지는 않습니다.</p>
        <p>이제 지도의 위치를 그대로 둔 채 송금 하나가 새 블록 후보에 담겨 처리되는 과정을 따라갑니다.</p>
      </section>

      <section id="black-box" data-teach-level="B">
        <h2>2. 요청 흐름</h2>
        <p>사용자가 A의 계정에서 B의 계정으로 10 ETH를 보냅니다. 송금은 실행 클라이언트로 들어오고, 이 송금을 담은 새 블록 후보는 합의 클라이언트로 들어옵니다.</p>
        <p>아래 장면을 직접 넘겨 보세요. 지도는 움직이지 않고 송금, 블록 후보, 실행 판정과 기록 선택만 실제 순서에 따라 이동합니다.</p>
        <NodeRequestTraceViz />
        <p>합의 클라이언트는 실행 클라이언트에 “부모 블록 상태에서 이 송금을 실행한 결과가 맞는가?”라고 묻습니다. VALID가 돌아와도 현재 기록이 바로 바뀌지는 않습니다. 합의 클라이언트가 투표와 fork choice 규칙을 반영해 후보를 head로 선택하고 그 결과를 알려야 두 프로그램의 현재 기록이 맞춰집니다. 동기화 중에는 실행 판정이 끝나지 않은 낙관적 head가 보일 수 있고, 제안자 가중치도 짧은 시간의 선택에 영향을 줄 수 있습니다. 이 예시는 실행 검증을 마친 정상 경로만 따라갑니다.</p>
      </section>

      <section id="case" data-teach-level="0">
        <h2>3. 잔액 계산</h2>
        <p>부모 블록에서 A의 잔액은 100 ETH, B의 잔액은 0 ETH입니다. 새 후보에는 A가 B에게 10 ETH를 보내고 처리 비용 0.000042 ETH를 내는 송금 하나가 있다고 가정합니다.</p>
        <BalanceTransitionViz />
        <p>실행 클라이언트가 부모 상태를 갖고 있다면 A 89.999958 ETH, B 10 ETH를 재현할 수 있습니다. 이 계산이 맞다는 사실과 이 후보가 현재 선택된 기록이라는 사실, 더는 되돌리지 않을 기록이라는 사실은 서로 다른 판단입니다.</p>
        <p>금액은 흐름을 설명하기 위한 예시입니다. 실제 송금 종류와 적용 규칙이 달라지면 처리 비용도 달라집니다.</p>
      </section>

      <section id="parts" data-teach-level="1">
        <h2>4. 두 저장소</h2>
        <p>실행 저장소는 블록별 계정 잔액과 프로그램 상태, 실행 결과를 기억합니다. 합의 저장소는 후보와 투표, 현재 따르는 가지, 더 안정적인 지점과 최종 확정 지점을 기억합니다.</p>
        <StateOwnershipViz />
        <p>둘은 같은 블록을 보더라도 답하는 질문이 다릅니다. 실행 저장소의 VALID를 finalized로 읽으면 안 되고, 합의 클라이언트가 후보를 선택했다고 틀린 거래 계산이 맞아지는 것도 아닙니다. head·safe·finalized는 합의 클라이언트가 정하지만, 실행 클라이언트도 <code>forkchoiceUpdated</code>로 전달받은 포인터를 적용하고 저장해 JSON-RPC 조회에 사용합니다.</p>
      </section>

      <section id="why-parts" data-teach-level="2">
        <h2>5. 자료 부족</h2>
        <p>새 후보의 부모 상태가 없으면 실행 클라이언트는 잔액을 다시 계산할 수 없습니다. 이때 후보를 잘못된 기록으로 저장하면 나중에 부모를 받은 뒤에도 올바른 후보를 버릴 수 있습니다. 반대로 아직 계산하지 못한 후보를 성공으로 표시하면 틀린 상태를 받아들일 수 있습니다.</p>
        <DecisionSeparationViz />
        <p>그래서 자료 부족은 SYNCING, 계산 실패는 INVALID, 계산 성공은 VALID로 나눕니다. 부모 상태를 확보한 뒤 같은 후보를 다시 검증하는 실제 복구 경로는 <Link to="/cs/blockchain/reth-sync">Reth 동기화</Link>에서, 메서드별 응답 계약은 <Link to="/cs/blockchain/reth-rpc">Reth RPC 경계</Link>에서 이어서 볼 수 있습니다.</p>
      </section>

      <section id="payload-state" data-teach-level="3">
        <h2>6. 상태 구분</h2>
        <p>실행 판정과 기록 선택을 같은 축에 놓으면 가장 자주 헷갈리는 차이가 보입니다. VALID는 계산 결과이고, head·safe·finalized는 합의 클라이언트가 결정해 실행 클라이언트에도 전달하는 기록 선택 결과입니다.</p>
        <PayloadStateViz />
        <div className="not-prose flex flex-wrap gap-3">
          <CodeViewButton
            label="VALID와 SYNCING을 가르는 실제 분기"
            onClick={() => sidebar.open("validation", teachCodeRefs.validation)}
          />
          <CodeViewButton
            label="head 변경을 적용하는 실제 분기"
            onClick={() => sidebar.open("choice", teachCodeRefs.choice)}
          />
        </div>
        <p>두 버튼은 Reth v2.2.0 고정 소스에서 이 구분이 실제 코드의 어느 분기에 놓이는지 보여 줍니다. 구현 이름과 줄 번호는 바뀔 수 있지만, 실행 판정과 기록 선택을 분리하는 책임은 같은 요청 추적 안에서 확인할 수 있습니다.</p>
        <p>ACCEPTED와 latestValidHash처럼 메서드와 버전에 따라 달라지는 세부 필드는 이 전체 지도에서 멈춥니다. 실제 호출 순서와 버전은 <Link to="/cs/blockchain/prysm-engine-api">Prysm Engine API</Link>, 현재 가지를 고르는 과정은 <Link to="/cs/blockchain/prysm-forkchoice">Prysm 가지 선택</Link>, 최종 확정 조건은 <Link to="/cs/blockchain/prysm-finality">Prysm 최종성</Link>에서 각각 확대합니다.</p>
      </section>

      <section id="release" data-teach-level="4">
        <h2>7. 다시 전체로</h2>
        <p>지금까지 확인한 내용을 처음 지도에 다시 놓아 봅니다. 실행 저장소에는 검증한 계정 상태와 합의 클라이언트에서 전달받아 적용한 head·safe·finalized 포인터가 남습니다. 합의 저장소에는 그 포인터를 결정한 후보·투표·체크포인트가 남습니다. 같은 요청이 다시 들어왔을 때의 중복 처리 방식은 구현과 호출 상태에 따라 달라지므로, 여기서는 두 저장소가 보존하는 근거가 다르다는 점까지만 확정합니다.</p>
        <SystemSettledViz />
        <ul className="list-disc space-y-3 pl-6">
          <li>부모 상태가 없어서 계산하지 못한 후보를 INVALID로 저장해도 될까요? (답: 5절)</li>
          <li>새 후보가 VALID라면 그 후보를 곧바로 finalized로 표시해도 될까요? (답: 6절)</li>
          <li>현재 기록을 누가 결정하고, 실행 클라이언트는 그 결과를 어떻게 조회에 사용할까요? (답: 4절)</li>
        </ul>
        <p>세 질문에 답할 수 있다면 이 글의 목표를 달성한 것입니다. 호출 규격이나 구현 코드가 필요한 경우에만 다음 절에서 필요한 영역을 골라 이어서 보면 됩니다.</p>
      </section>

      <section id="deeper" data-teach-level="5">
        <h2>8. 다음 글</h2>
        <p>여기부터는 선택 사항입니다. 전체 구조만 필요하다면 7절에서 읽기를 마쳐도 됩니다. 구현과 장애 복구까지 확인하려면 아래 지도에서 궁금한 영역을 고르세요.</p>
        <ArchitectureLearningPathsViz />
        <div className="grid gap-3 sm:grid-cols-2">
          <div id="paper-engine-api" className="border-l-2 border-border pl-4">
            <h3 className="font-bold">호출 계약의 근거</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground"><a href="https://github.com/ethereum/execution-apis/tree/5aebdfdd45cadeb723be4bd45b4611b71c8b1c85" target="_blank" rel="noreferrer" className="underline underline-offset-4">Ethereum execution-apis 고정본</a>에서 Engine 메서드, 상태값과 버전별 스키마를 확인합니다.</p>
          </div>
          <div id="paper-reth-node" className="border-l-2 border-border pl-4">
            <h3 className="font-bold">실행 구현의 근거</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground"><a href="https://github.com/paradigmxyz/reth/tree/88505c7fcbfdebfd3b56d88c86b62e950043c6c4" target="_blank" rel="noreferrer" className="underline underline-offset-4">Reth v2.2.0 고정 소스</a>에서 실제 모듈과 분기를 확인합니다. 이 글은 실제 노드 장애 시험을 수행했다는 기록이 아닙니다.</p>
          </div>
        </div>
      </section>
    </article>
    <CodeSidebar
      codeRefKey={sidebar.codeRefKey}
      codeRef={sidebar.codeRef}
      onClose={sidebar.close}
      onNavigate={sidebar.navigate}
      codeRefs={teachCodeRefs}
      fileTrees={{}}
      projectMetas={{
        reth: {
          id: "reth",
          label: "Reth v2.2.0 · Rust",
          badgeClass: "border-orange-500 bg-orange-500/10 text-orange-700",
        },
      }}
    />
    </>
  );
}
