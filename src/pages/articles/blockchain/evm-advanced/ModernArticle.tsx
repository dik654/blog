import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import EvmPathLocator, { EvmMapReturn } from "../evm-shared/EvmPathLocator";
import NestedCallFrameTraceViz from "./viz/NestedCallFrameTraceViz";
import { CallContextMatrixViz, CreateLifecycleViz } from "./viz/ModernEvmAdvancedViz";

export default function ModernEvmAdvancedArticle() {
  return (
    <article className="space-y-14">
      <EvmPathLocator current="nested-frames" />

      <section id="overview" className="scroll-mt-20 space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">EVM · 중첩 실행</p>
          <h2 className="text-3xl font-bold tracking-tight">다른 계약의 코드를 실행하면 누구의 상태가 바뀔까요?</h2>
          <p className="max-w-3xl text-lg leading-8 text-foreground/90">
            Alice가 Proxy를 호출하고 Proxy가 Implementation의 코드를 빌려 쓰는 요청 하나를 끝까지 따라갑니다. 핵심은 opcode 이름을 외우는 것이 아니라, 새 실행 프레임의 코드·현재 주소·호출자·값·쓰기 권한을 각각 확인하는 것입니다.
          </p>
        </header>

        <NestedCallFrameTraceViz />

        <p>
          그림의 바깥 거래는 성공하지만 내부 <code>DELEGATECALL</code>은 실패합니다. 모순이 아닙니다. 하위 호출은 성공 여부와 반환 데이터를 상위 프레임에 돌려주고, 상위 코드가 그 실패를 다시 전파할지 처리하고 계속할지 결정하기 때문입니다.
        </p>
        <p>
          각 프레임은 stack·memory·남은 gas·return-data buffer를 따로 가집니다. 상태 변경은 프레임의 checkpoint 뒤에 기록되어, 그 프레임이 실패하면 해당 경계까지 되돌아갑니다. <Link className="text-primary underline underline-offset-4" to="/cs/blockchain/evm-fundamentals#release">EVM 기초의 종료 규칙</Link>을 여러 프레임으로 확장한 모습입니다.
        </p>
      </section>

      <section id="call-context" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 권한</p>
          <h2 className="text-2xl font-bold">실행할 코드와 상태를 기록할 주소는 같은 항목이 아닙니다</h2>
        </header>

        <CallContextMatrixViz />

        <p>
          <code>CALL</code>은 대상 계약의 코드와 상태 문맥으로 들어갑니다. 대상은 상위 프레임의 현재 주소를 <code>msg.sender</code>로 보고, 상위 코드가 명시한 값을 <code>msg.value</code>로 받습니다.
        </p>
        <p>
          <code>DELEGATECALL</code>은 대상의 코드만 가져옵니다. 현재 주소와 storage, <code>msg.sender</code>, <code>msg.value</code>는 상위 프레임 값을 유지합니다. 따라서 Implementation 코드의 <code>SSTORE</code>가 Proxy storage를 바꿉니다. 여기서 “sender를 보존한다”는 말은 무조건 거래를 시작한 계정을 뜻하지 않고, 바로 위 프레임이 가진 sender와 value를 그대로 전달한다는 뜻입니다.
        </p>
        <p>
          <code>STATICCALL</code>은 대상 코드와 대상 storage를 읽되 새 프레임의 <code>msg.value</code>를 0으로 만들고 static 표시를 켭니다. 이 표시는 하위 호출에도 이어집니다. <code>SSTORE</code>·<code>CREATE</code>·로그 기록처럼 상태를 바꾸는 연산이나 0이 아닌 값을 보내는 <code>CALL</code>은 static 문맥에서 예외 종료합니다.
        </p>

        <div id="paper-eip7">
          <CitationBlock source="EIP-7 · DELEGATECALL" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-7">
            <p><strong>확인한 내용:</strong> 대상 코드를 실행하면서 상위 호출의 sender와 value를 전달하는 opcode 의미입니다.</p>
            <p><strong>범위:</strong> DELEGATECALL의 호출 문맥에 한정합니다. Proxy storage layout이나 업그레이드 코드의 안전성을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-eip214">
          <CitationBlock source="EIP-214 · STATICCALL" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-214">
            <p><strong>확인한 내용:</strong> static 표시의 하위 호출 전파, STATICCALL의 value=0, 상태 변경 연산의 예외 종료 조건입니다.</p>
            <p><strong>범위:</strong> 읽기 전용 실행 문맥을 설명합니다. 호출한 코드가 논리적으로 올바르다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="memory-create" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 생성</p>
          <h2 className="text-2xl font-bold">CREATE2 주소와 배포된 코드는 서로 다른 단계에서 결정됩니다</h2>
        </header>

        <CreateLifecycleViz />

        <ExplainedFormula
          question="CREATE2 주소는 왜 아직 실행하지 않은 init code에도 묶일까요?"
          idea={<>같은 deployer와 salt로 서로 다른 설치 프로그램이 같은 주소를 예약하지 못하도록 init code의 hash까지 주소 입력에 넣습니다.</>}
          formula={String.raw`a=last_{20}\left(keccak256(0xff\parallel d\parallel s\parallel keccak256(i))\right)`}
          annotatedFormula={String.raw`a=\underbrace{last_{20}}_{\text{뒤 20 bytes}}\left(keccak256(\underbrace{0xff}_{\text{CREATE와 구분}}\parallel\underbrace{d}_{\text{deployer}}\parallel\underbrace{s}_{\text{32-byte salt}}\parallel\underbrace{keccak256(i)}_{\text{init code에 commit}})\right)`}
          operations={[
            { expression: String.raw`h_i=keccak256(i)`, annotation: ["배포 뒤 남을 runtime code가 아니라", "한 번 실행할 init code bytes를 hash합니다."] },
            { expression: String.raw`u=keccak256(0xff\parallel d\parallel s\parallel h_i)`, annotation: ["고정된 순서와 길이로 네 항목을 붙입니다.", "이 preimage는 항상 85 bytes입니다."] },
            { expression: String.raw`a=last_{20}(u)`, annotation: ["32-byte digest의 뒤 20 bytes가 후보 주소입니다.", "기존 계정과 충돌하면 생성은 실패합니다."] },
          ]}
          terms={[
            { symbol: "d", name: "deployer", description: "CREATE2를 실행한 현재 주소입니다." },
            { symbol: "s", name: "salt", description: "호출자가 정한 32-byte 값입니다." },
            { symbol: "i", name: "init code", description: "새 child frame에서 한 번 실행할 bytes입니다." },
            { symbol: "a", name: "후보 주소", description: "Hash 결과의 마지막 20 bytes입니다." },
          ]}
          assumptions={[
            "EIP-1014가 활성화된 규칙을 사용합니다.",
            "deployer·salt·init code bytes를 정확히 고정합니다.",
            "후보 주소 계산과 account 생성 성공은 별개입니다.",
          ]}
          interpretation="같은 deployer와 salt라도 init code가 한 byte 달라지면 후보 주소가 달라집니다. 같은 후보 주소에 nonce나 code가 이미 있으면 기존 계정을 덮어쓰지 않고 실패합니다."
        />

        <p>
          주소 충돌 검사를 통과한 뒤에야 init code를 child frame에서 실행합니다. 정상 <code>RETURN</code>의 bytes가 runtime code로 저장됩니다. init frame이 <code>REVERT</code>하거나 예외 종료하면 계정 생성과 그 프레임 안의 상태 변경은 취소됩니다.
        </p>

        <ExplainedFormula
          question="높은 memory offset 하나가 왜 예상보다 많은 gas를 쓸까요?"
          idea={<>Memory는 마지막으로 접근한 byte만 만드는 것이 아니라 그 위치를 포함하는 word까지 확장됩니다. 새 누적 비용에서 이미 낸 누적 비용을 뺀 만큼을 이번 연산 전에 지불합니다.</>}
          formula={String.raw`\Delta C_{mem}=C_{mem}(a_{new})-C_{mem}(a_{old}),\quad C_{mem}(a)=3a+\left\lfloor\frac{a^2}{512}\right\rfloor`}
          annotatedFormula={String.raw`\Delta C_{mem}=\underbrace{C_{mem}(a_{new})}_{\text{확장 뒤 누적 비용}}-\underbrace{C_{mem}(a_{old})}_{\text{이미 낸 비용}},\quad C_{mem}(a)=\underbrace{3a}_{\text{선형}}+\underbrace{\left\lfloor\frac{a^2}{512}\right\rfloor}_{\text{큰 memory의 추가 비용}}`}
          operations={[
            { expression: String.raw`a_{new}=ceil((offset+size)/32)`, annotation: ["접근 범위를 포함하는 32-byte word 수를 구합니다."] },
            { expression: String.raw`C_{mem}(a_{new})-C_{mem}(a_{old})`, annotation: ["확장분을 opcode 효과보다 먼저 지불합니다.", "남은 gas가 모자라면 상태 효과 없이 예외 종료합니다."] },
          ]}
          terms={[
            { symbol: "a", name: "활성 memory word 수", description: "Byte offset 자체가 아니라 접근 범위를 덮는 32-byte word 수입니다." },
            { symbol: "ΔCmem", name: "이번 확장 비용", description: "새 누적 비용과 기존 누적 비용의 차이입니다." },
          ]}
          assumptions={[
            "표시한 식은 Yellow Paper Shanghai 규칙의 memory cost 식입니다.",
            "opcode 자체 비용과 복사 word 비용은 별도로 더합니다.",
            "Memory는 프레임 안에서만 유지되며 storage와 다릅니다.",
          ]}
          interpretation="멀리 떨어진 offset을 처음 건드리면 중간 memory까지 한 번에 확장한 비용을 냅니다. 그래서 한 byte 쓰기라도 offset이 매우 크면 out-of-gas가 날 수 있습니다."
        />

        <div id="paper-eip1014">
          <CitationBlock source="EIP-1014 · Skinny CREATE2" citeKey={3} href="https://eips.ethereum.org/EIPS/eip-1014">
            <p><strong>확인한 내용:</strong> 고정 85-byte preimage, 주소 계산식, hash 비용, 기존 nonce·code와의 충돌 규칙입니다.</p>
            <p><strong>범위:</strong> CREATE2 주소와 생성 조건에 한정합니다. 후보 주소에 계약이 반드시 배포되거나 같은 동작을 영구히 유지한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="scroll-mt-20 space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 종료</p>
          <h2 className="text-2xl font-bold">하위 실패는 결과로 돌아오고, 상위 프레임이 전파 여부를 정합니다</h2>
        </header>

        <AlgorithmBlock
          title="CALL 계열 child frame을 열고 결과를 정리하는 절차"
          input={[
            "상위 frame: address·sender·value·static·remaining gas",
            "opcode: CALL | DELEGATECALL | STATICCALL",
            "대상 주소·입력 bytes·전달할 gas",
          ]}
          steps={[
            { code: "child_context = select_context(opcode, parent, target)", note: "호출 종류에 따라 code·현재 주소·sender·value·static 표시를 각각 정합니다." },
            { code: "checkpoint = world_state.checkpoint()", note: "하위 프레임이 바꾼 상태만 되돌릴 수 있도록 실행 전 경계를 남깁니다." },
            { code: "result = execute(child_context, input, child_gas)", note: "Child는 자기 stack·memory·return-data buffer와 gas 예산으로 실행합니다." },
            { code: "if result.failed: world_state.rollback(checkpoint)", note: "REVERT나 예외 종료면 하위 프레임의 상태와 substate를 경계까지 되돌립니다." },
            { code: "parent.push(result.success); parent.return_data = result.output", note: "상위 프레임은 성공 여부와 반환 데이터를 받은 뒤 실패를 전파하거나 다른 경로를 선택합니다." },
          ]}
          output="상위 stack의 success 값 + 상위 return-data buffer + 성공한 경우에만 남는 child state"
        />

        <p>
          <code>REVERT</code>와 예외 종료는 모두 해당 프레임의 상태 변경을 되돌리지만 남은 gas와 반환 데이터 처리까지 같지는 않습니다. 이 글의 사례에서는 Checker의 금지된 <code>SSTORE</code>가 예외 종료하고, Implementation이 받은 실패를 <code>REVERT</code>로 전파합니다. Proxy는 다시 그 실패를 처리해 정상 종료합니다.
        </p>
        <p>
          따라서 거래 receipt의 status가 1이라는 사실만으로 모든 내부 호출이 성공했다고 결론 내릴 수 없습니다. 내부 success 값·return data·logs·최종 storage를 함께 봐야 합니다. 반대로 Proxy까지 실패를 전파하면 Proxy 프레임 안에서 이뤄진 값 이전과 상태 변경도 바깥 checkpoint까지 되돌아갑니다.
        </p>

        <div id="paper-eip211">
          <CitationBlock source="EIP-211 · RETURNDATASIZE and RETURNDATACOPY" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-211">
            <p><strong>확인한 내용:</strong> 프레임별 return-data buffer와 호출 뒤 성공·실패 데이터를 상위 코드가 읽는 방식입니다.</p>
            <p><strong>범위:</strong> 반환 데이터 전달에 한정합니다. 상위 코드가 실패를 올바르게 처리한다는 보장은 없습니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-yellow-paper-advanced">
          <CitationBlock source="Ethereum Yellow Paper · Shanghai version" citeKey={5} href="https://ethereum.github.io/yellowpaper/paper.pdf">
            <p><strong>확인한 내용:</strong> message call·contract creation·memory cost·예외 종료의 형식적 기준입니다.</p>
            <p><strong>범위:</strong> Shanghai 문서에 적힌 규칙입니다. 이후 fork의 활성 규칙과 특정 클라이언트 구현 구조는 별도로 고정해야 합니다.</p>
          </CitationBlock>
        </div>

        <aside className="not-prose border-y border-border py-5" aria-label="이 글을 읽은 뒤 설명할 수 있어야 하는 질문">
          <p className="text-[10px] font-bold text-primary">스스로 확인하기</p>
          <ol className="mt-3 grid gap-3 text-sm leading-6 sm:grid-cols-2">
            <li className="border-l-2 border-border pl-3"><strong>1.</strong> DELEGATECALL 뒤 <code>SSTORE</code>가 왜 Proxy storage를 바꾸나요?</li>
            <li className="border-l-2 border-border pl-3"><strong>2.</strong> STATICCALL 아래의 하위 호출도 왜 쓰지 못하나요?</li>
            <li className="border-l-2 border-border pl-3"><strong>3.</strong> CREATE2 후보 주소를 알아도 왜 배포 성공을 장담할 수 없나요?</li>
            <li className="border-l-2 border-border pl-3"><strong>4.</strong> 내부 호출이 실패했는데 바깥 거래 status가 1일 수 있는 이유는 무엇인가요?</li>
          </ol>
        </aside>

        <p className="text-sm text-muted-foreground">
          이 글은 EIP-7·EIP-214·EIP-1014·EIP-211과 Yellow Paper Shanghai에 적힌 CALL·DELEGATECALL·STATICCALL·CREATE2 경계를 설명합니다. 실제 블록을 어떤 fork 규칙으로 실행하고 결과 묶음을 저장하는지는 실무 트랙에서 이어갑니다.
        </p>

        <EvmMapReturn current="nested-frames" />
      </section>
    </article>
  );
}
