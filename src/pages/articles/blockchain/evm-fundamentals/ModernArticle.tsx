import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { teachCodeRefs } from "./teachCodeRefs";
import { EvmStepTraceViz, EvmFailureViz } from "./viz/ModernEvmFundamentalsViz";
export default function ModernEvmFundamentalsArticle() {
 const sidebar=useCodeSidebar();
 return <><article className="space-y-14 [&_section]:space-y-5 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:leading-8">
 <section id="overview" data-teach-level="S"><h2>1. 여러 컴퓨터가 같은 지시를 실행해 같은 결과를 얻습니다</h2>
 <p>장부를 여러 컴퓨터가 복사해 보관한다면 각자가 계산한 다음 값도 같아야 합니다. 한 컴퓨터가 2와 3을 더해 5를 만들고 다른 컴퓨터가 6을 만들면 같은 장부를 유지할 수 없습니다. 모든 참여자가 공유하는 작은 계산 규칙이 필요한 이유입니다.</p>
 <p>실행할 프로그램은 외부 사람이 보낼 수 있으므로 끝없이 계산하거나 장부를 임의로 고치지 못하도록 제한합니다. 한 명령의 의미, 계산 예산, 실패했을 때 되돌릴 범위를 함께 정합니다. 프로그램의 결과가 맞다는 검사와 여러 후보 중 어떤 기록을 채택할지는 각각의 책임입니다.</p>
 <p>이 글에서는 명령 몇 개를 직접 따라가고 실제 참조 구현에 같은 값을 넣어 읽습니다. 먼저 실행 장치의 입구와 출구를 크게 나누겠습니다.</p></section>
 <section id="black-box" data-teach-level="B"><h2>2. 실행 조건을 준비하고, 한 줄씩 계산하고, 결과를 정리합니다</h2>
 <ol className="list-decimal space-y-3 pl-6"><li>누가 무엇을 실행하나 → 호출자의 권한·입력·앞선 장부를 정합니다.</li><li>다음 지시는 무엇인가 → 프로그램의 현재 위치에서 명령을 읽습니다.</li><li>계산 예산이 충분한가 → 비용을 지불하고 값을 바꿉니다.</li><li>어디까지 남길 것인가 → 종료 결과에 따라 변경을 반영하거나 취소합니다.</li></ol>
 <p>명령 계산이 실패하면 중간 변경이 어디까지 남는지가 중요합니다. 그 경계를 보기 전에 돈을 보내지 않고 작은 정수 두 개만 더하는 프로그램부터 실행해 보겠습니다.</p></section>
 <section id="case" data-teach-level="0"><h2>3. 2와 3을 올리고 더하는 데 예산 9를 씁니다</h2>
 <p>프로그램은 ‘2를 올려라, 3을 올려라, 두 값을 더하라, 멈춰라’입니다. 처음 계산 예산을 20으로 두고, 앞의 세 명령은 각각 3, 마지막 명령은 0을 쓴다고 놓습니다(가정). 이 예산은 전체 거래 수수료가 아니라 이미 시작한 한 실행의 예산입니다.</p>
 <p>아직 아무 값도 없는 곳에 2를 놓으면 남은 예산은 17입니다. 3을 그 위에 놓으면 14가 됩니다. 위의 두 값을 꺼내 더한 5를 다시 올리면 11이 남습니다. 멈춘 뒤 값 5는 이 임시 계산 공간에 있을 뿐, 장부의 어떤 칸에도 아직 쓰지 않았습니다.</p>
 <p>20 → 17 → 14 → 11과 빈 공간 → 2 → 2,3 → 5가 이 글에서 계속 추적할 값입니다. 이 변화를 기억할 장치를 하나씩 열어 보겠습니다.</p></section>
 <section id="parts" data-teach-level="1"><h2>4. 지금 위치, 임시 값, 오래 남는 값을 따로 보관합니다</h2>
 <p>프로그램의 어느 명령을 읽는지 표시하는 위치가 필요합니다. 막 계산한 값을 잠깐 쌓아 둘 곳과 바이트 배열로 넓게 쓸 임시 공간도 둡니다. 실행 뒤까지 남겨야 하는 장부 값은 따로 관리합니다. 같은 숫자 5라도 어디에 두었는지에 따라 수명과 비용이 달라집니다.</p>
 <p>현재 위치를 잊으면 같은 명령을 반복하거나 숫자 2를 명령으로 잘못 읽을 수 있습니다. 예산을 기록하지 않으면 반복문이 컴퓨터 자원을 끝없이 사용합니다. 장부의 중간 변경을 되돌릴 기록이 없으면 실패한 프로그램도 돈이나 권한을 바꾼 채 끝날 수 있습니다.</p>
 <p>각 저장소가 필요한 이유는 값의 사용 시점과 되돌릴 범위가 다르기 때문입니다. 다음 절에서는 이것이 실제 명령 형식과 어떻게 연결되는지 봅니다.</p></section>
 <section id="why-parts" data-teach-level="2"><h2>5. 명령 바이트와 숫자 바이트를 구분해야 합니다</h2>
 <p>명령 ‘한 바이트 숫자를 올려라’ 다음에는 숫자 한 바이트가 붙습니다. 따라서 2를 올리는 명령을 실행한 뒤 위치를 한 칸만 옮기면 숫자 2 자체를 다음 명령으로 잘못 읽습니다. 두 칸을 건너뛰어 다음 지시로 가야 합니다. 덧셈 명령에는 뒤따르는 숫자가 없으므로 한 칸만 이동합니다.</p>
 <p>임시 공간과 장부를 분리하면 2+3이라는 계산 결과를 만들기만 하는 것과 그것을 실제 계정 상태에 저장하는 것을 구분할 수 있습니다. 뒤에서 실패하면 해당 호출의 장부 변경은 취소하지만 이미 사용한 계산 비용까지 전부 돌려주는 것은 아닙니다.</p>
 <p>이제 위치와 저장소, 비용에 이름을 붙이면 실제 코드의 변수도 읽을 수 있습니다.</p></section>
 <section id="names" data-teach-level="3"><h2>6. EVM은 정해진 명령 규칙을 실행하는 가상 머신입니다</h2>
 <p>이 규칙을 Ethereum Virtual Machine, 줄여서 EVM이라고 부릅니다. 특정 컴퓨터의 CPU 명령을 그대로 쓰는 대신 모든 클라이언트가 같은 가상 명령의 의미를 구현합니다.</p>
 <dl className="space-y-4"><div><dt className="font-semibold">지금 읽을 위치 → program counter, pc</dt><dd>코드 배열에서 명령이 시작하는 바이트 위치입니다.</dd></div><div><dt className="font-semibold">마지막 값을 먼저 꺼내는 곳 → stack</dt><dd>각 값은 256비트 정수 한 칸입니다. 이 사례에서 오른쪽을 위로 적으면 [2,3]의 3이 먼저 나옵니다.</dd></div><div><dt className="font-semibold">호출 중 쓰는 바이트 배열 → memory</dt><dd>현재 호출이 끝나면 사라집니다. 높은 위치까지 사용하면 확장 비용을 냅니다.</dd></div><div><dt className="font-semibold">계정에 귀속되는 저장 값 → storage</dt><dd>성공한 상태 변경은 거래 뒤에도 남을 수 있습니다. 임시 스택의 5가 자동으로 여기에 쓰이지는 않습니다.</dd></div><div><dt className="font-semibold">실행 자원의 계산 단위 → gas</dt><dd>명령과 메모리·상태 접근의 비용을 세는 단위입니다. 단위당 가격과 곱해야 실제 지불액을 계산할 수 있습니다.</dd></div><div><dt className="font-semibold">각 바이트가 뜻하는 명령 → opcode</dt><dd>한 바이트를 올리는 PUSH1은 0x60, 덧셈 ADD는 0x01, STOP은 0x00입니다.</dd></div></dl>
 <p>호출 환경에는 실행 계정, 최초 송신자와 직접 호출자, 전달 금액·입력 바이트, 블록 정보·호출 깊이·상태 변경 허용 여부도 들어갑니다. 이 값들은 명령이 읽는 문맥이며 스택 자체와는 다릅니다. 이제 같은 2+3을 실제 바이트로 추적합니다.</p></section>
 <section id="machine-step" data-teach-level="4"><h2>7. 60 02 60 03 01 00을 한 명령씩 읽습니다</h2>
 <p>코드 바이트는 16진수로 <code>60 02 60 03 01 00</code>입니다. pc=0에서 PUSH1 뒤의 02를 읽고 [2], pc=2, gas=17이 됩니다. pc=2에서는 03을 올려 [2,3], pc=4, gas=14가 됩니다. pc=4의 ADD가 위의 두 값을 꺼내 [5], pc=5, gas=11을 만듭니다. 마지막 STOP은 실행을 끝냅니다.</p>
 <EvmStepTraceViz />
 <p>이 코드는 반환할 데이터를 만들거나 storage를 쓰는 명령을 포함하지 않습니다. 따라서 ‘스택에 5가 남았다’와 ‘사용자가 호출 결과로 바이트 5를 받았다’도 다릅니다. 외부로 반환하려면 결과를 memory에 쓰고 RETURN이 읽을 위치와 길이를 지정하는 명령이 더 필요합니다.</p>
 <p>2와 3이 아주 큰 정수였다면 정해진 값의 폭이 결과를 바꿉니다. 이 부분을 원문 수학 규칙과 참조 구현으로 확인하겠습니다.</p></section>
 <section id="word-rule" data-teach-level="5"><h2>8. 256비트를 넘은 덧셈 결과는 나머지만 남습니다</h2>
 <ExplainedFormula question="정수 한 칸의 최댓값에 1을 더하면 어떻게 될까요?" idea="결과를 한 칸에 담아야 하므로 2²⁵⁶으로 나눈 나머지를 남깁니다. 작은 2+3에는 효과가 없지만 최댓값을 넘으면 달라집니다." formula={String.raw`z=(x+y)\bmod 2^{256}`} annotatedFormula={String.raw`z=\underbrace{(x+y)}_{\text{두 입력의 합}}\bmod\underbrace{2^{256}}_{\text{한 칸의 표현 범위}}`} operations={[{expression:String.raw`(x+y)`,annotation:["스택에서 꺼낸 두 정수를 더합니다."]},{expression:String.raw`2^{256}`,annotation:["이 값으로 나눈 나머지를 남겨 256비트에 맞춥니다."]}]} terms={[{symbol:"x,y",name:"입력 정수",description:"0 이상 2²⁵⁶ 미만입니다."},{symbol:"z",name:"결과 정수",description:"스택에 넣을 합의 하위 256비트입니다."}]} assumptions={["ADD의 고정 폭 정수 연산을 설명합니다.","실행할 gas와 스택 항목이 충분해야 합니다.","고수준 언어의 오버플로 검사 코드는 별도입니다."]} interpretation="사례에서는 (3+2) mod 2²⁵⁶=5입니다. x=2²⁵⁶−1, y=1이면 0입니다. Solidity 컴파일러는 이 명령 앞뒤에 넘침 검사와 되돌리기 코드를 추가할 수 있습니다." />
 <div id="paper-yellow-paper"><CitationBlock source="Ethereum Yellow Paper · Shanghai efc5f9a, Appendix H.2" citeKey={1} href="https://ethereum.github.io/yellowpaper/paper.pdf"><p>ADD 행의 원문 관계는 μ′ₛ[0] ≡ μₛ[0] + μₛ[1]입니다. 해당 절의 256비트 나머지 규칙과 함께 읽습니다. μₛ[0]=3과 μₛ[1]=2를 넣으면 새 스택 맨 위는 5입니다. 이 문서는 Shanghai 규칙의 형식 명세이며 이후 업그레이드의 모든 명령 비용을 설명하지는 않습니다.</p></CitationBlock></div>
 <p>수식은 새 맨 위 값이 무엇인지 말합니다. 그 앞뒤에 비용 차감과 실행 위치 갱신이 실제로 어디 있는지는 다음 코드에서 확인할 수 있습니다.</p></section>
 <section id="reference-code" data-teach-level="6"><h2>9. add 함수가 두 값을 꺼내고 예산과 위치를 바꿉니다</h2>
 <p>고정한 execution-specs의 Shanghai 구현은 초기화에서 pc=0과 빈 stack·memory를 만들고 message.gas를 남은 예산으로 받습니다. 20이라는 가정은 이 필드에 들어갑니다. 이 글은 Python 참조 구현을 읽어 계산했으며 노드를 실행한 측정 결과를 제시하지 않습니다.</p>
 <div className="flex flex-wrap gap-3"><CodeViewButton label="초기 실행 상태 원문" onClick={()=>sidebar.open("init",teachCodeRefs.init)} /><CodeViewButton label="현재 바이트를 명령으로 선택" onClick={()=>sidebar.open("dispatch",teachCodeRefs.dispatch)} /></div>
 <p>ADD 함수는 x와 y를 stack에서 꺼낸 뒤 gas를 차감합니다. <code>result = x.wrapping_add(y)</code>가 3과 2에서 5를 계산하고 push가 결과를 넣습니다. 마지막 줄이 pc를 1 증가시킵니다. 실제 원문 순서에서는 pop이 비용 검사보다 먼저 보이지만 실패한 실행의 변경은 뒤의 오류 처리 범위에서 취소됩니다.</p>
 <CodeViewButton label="실제 add 함수 35–48행" onClick={()=>sidebar.open("add",teachCodeRefs.add)} />
 <div id="paper-execution-specs"><CitationBlock source="execution-specs · 87aba1a, Shanghai arithmetic.py / interpreter.py" citeKey={2} type="code" href="https://github.com/ethereum/execution-specs/tree/87aba1a38a476b31f819a2390eb481527e6dc683/src/ethereum/forks/shanghai/vm"><p>실제 Python 원문과 라이선스를 보존했습니다. add의 35–48행에 [2,3], pc=4, gas=14를 대응시키면 [5], pc=5, gas=11입니다. 명령별 비용과 블록·거래 검증은 선택한 fork 전체와 함께 확인해야 합니다.</p></CitationBlock></div>
 <p>이제 입력·비용·결과를 같은 코드 경로에 대응시켰습니다. 계산 예산이 부족하거나 호출이 스스로 실패를 선언할 때 무엇이 남는지 확인하겠습니다.</p></section>
 <section id="gas-state" data-teach-level="7"><h2>10. 실행 예산과 되돌릴 범위는 서로 다른 기록입니다</h2>
 <p>처음 예산이 8이었다면 두 번의 PUSH1 뒤 2만 남습니다(가정). ADD에 필요한 3을 낼 수 없어 이 호출은 예외 종료합니다. 성공 사례의 [5]를 정상 결과로 사용하지 않습니다. 실제 거래에는 이 8 외에도 거래 자체의 기본 비용과 전달된 gas의 규칙이 있으므로 이 숫자를 거래 전체 비용으로 읽지 않습니다.</p>
 <p>Memory는 바이트 주소 공간입니다. 이전보다 높은 위치까지 처음 사용하면 확장 비용이 붙습니다. Storage는 장부에 남을 수 있는 값이지만 명령 하나를 실행할 때마다 바로 영구 디스크에 확정한다는 뜻은 아닙니다. 클라이언트는 실행 중 변경을 따로 기록했다가 호출·거래·블록 검증 결과에 따라 반영하거나 되돌립니다.</p>
 <p>어떤 블록을 정식 기록으로 채택할지는 <Link to="/cs/blockchain/node-architecture">실행 노드와 합의 노드의 경계</Link>에서 이어집니다. 프로그램 계산 성공만으로 그 블록이 확정되지는 않습니다.</p></section>
 <section id="release" data-teach-level="7"><h2>11. 정상 종료, REVERT, 예외 종료를 구분합니다</h2>
 <EvmFailureViz />
 <p>STOP과 RETURN은 현재 호출을 정상 종료합니다. REVERT는 해당 호출의 상태 변경을 취소하면서 반환 데이터를 남기는 명시적 실패입니다. gas 부족·알 수 없는 명령·꺼낼 값 부족은 예외 종료로 처리됩니다. 고정한 구현은 예외 종료에서 남은 gas를 0으로 만들고 REVERT에서는 그 줄을 실행하지 않습니다. 두 실패 모두 해당 호출의 변경을 복구합니다.</p>
 <CodeViewButton label="예외·REVERT·상태 복구 원문" onClick={()=>sidebar.open("failure",teachCodeRefs.failure)} />
 <p>하위 호출이 실패해도 상위 호출이 실패 표시를 확인하고 계속할 수 있습니다. 반대로 상위 호출까지 실패하면 앞서 성공한 하위 호출의 변경도 취소될 수 있습니다. 자세한 생성·중첩 호출은 <Link to="/cs/blockchain/evm-advanced">EVM 심화</Link>에서 같은 책임을 확장합니다.</p>
 <p>새 실행기를 검증할 때는 2+3, 256비트 넘침, 스택 부족, memory 확장, storage 쓰기 뒤 REVERT, 하위 호출 gas 부족을 같은 fork의 시험 입력으로 비교합니다. 종료 상태·사용 gas·로그·최종 상태 루트가 모두 맞아야 합니다. 두 클라이언트의 시험을 이 글에서 실제 실행했다고 주장하지 않습니다.</p>
 <ul className="list-disc space-y-3 pl-6"><li>ADD 뒤 스택에 5가 남으면 storage와 반환 데이터에도 5가 기록될까요? (답: 7절)</li><li>같은 프로그램의 시작 예산이 8이면 어느 명령에서 실패할까요? (답: 10절)</li><li>하위 호출의 REVERT가 항상 거래 전체를 실패시킬까요? (답: 11절)</li></ul>
 </section></article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={teachCodeRefs} fileTrees={{}} projectMetas={{"execution-specs":{id:"execution-specs",label:"실행 명세 · 87aba1a",badgeClass:"border-sky-500 text-sky-700"}}} /></>;
}
