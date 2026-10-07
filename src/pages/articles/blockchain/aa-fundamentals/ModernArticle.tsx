import { Link } from "react-router-dom";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ContentBoundary from "@/components/articles/content-boundary";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import SourceApplication from "../../world-systems/SourceApplication";
import { codeRefs, teachFileTree } from "./teachCodeRefs";

export default function ModernAA() {
 const sidebar=useCodeSidebar();
 const code=(key:string,label:string)=><div className="not-prose flex flex-wrap items-center gap-2"><CodeViewButton onClick={()=>sidebar.open(key,codeRefs[key])}/><span className="text-sm text-muted-foreground">{label}</span></div>;
 return <article className="space-y-14">
  <section id="overview" data-teach-level="S" className="space-y-5">
   <h2 className="text-2xl font-bold">1. 잠깐 쓰는 열쇠에 지갑 전체를 맡기지 않으려면</h2>
   <p>
            앱을 사용할 때마다 지갑의 모든 돈을 움직일 수 있는 열쇠를 꺼내는 일은 부담스럽습니다. 특정 상대에게 일정 금액만 보내도록 허용하고 시간이 지나면 그 권한이 끝나게 할 수
            있으면 편리합니다. 처음 사용하는 사람의 거래 비용을 서비스가 대신 내주는 기능도 함께 생각해 볼 수 있습니다.
          </p>
   <p>이런 규칙을 계정의 프로그램이 직접 판단하도록 만드는 것이 계정 추상화의 핵심입니다. 이 글에서는 30분 동안 100까지만 보낼 수 있는 열쇠로 40을 보내는 사례를 따라갑니다. 승인한 사람, 요청을 전달한 사람, 실제 비용을 낸 사람이 어떻게 갈리는지 먼저 봅니다.</p>
   <ContentBoundary article="aa-fundamentals" />
  </section>
  <section id="black-box" data-teach-level="B" className="space-y-5">
   <h2 className="text-2xl font-bold">2. 요청을 모으는 쪽과 돈을 움직이는 쪽이 다릅니다</h2>
   <p>사용자는 보낼 곳과 금액을 승인합니다. 전달자는 여러 사용자의 요청을 모아 네트워크에 제출합니다. 공통 처리 창구는 계정에 승인 여부를 묻고 비용을 확보한 뒤 실행을 요청합니다. 마지막으로 계정이 자산을 움직이며 실제 사용한 비용을 정산합니다.</p>
   <p>전달자가 요청을 받았다고 답해도 아직 송금은 끝나지 않았습니다. 앞에서 가능하다고 판단한 요청도 실제 실행 시점에는 잔액이나 권한이 달라질 수 있습니다. 어느 단계까지 끝났는지를 구별해야 재시도와 비용을 판단할 수 있습니다.</p>
  </section>
  <section id="case" data-teach-level="0" className="space-y-5">
   <h2 className="text-2xl font-bold">3. 잔액 200에서 40을 보내고 권한 60을 남깁니다</h2>
   <p>다음은 설명을 위한 가정입니다. Alice의 계정에는 USDC 200개가 있고 Bob은 0개를 갖고 있습니다. USDC는 달러 가치에 맞추려는 토큰이며 여기서는 가격 변동 대신 수량만 셉니다. Alice는 Bob에게만, 30분 동안, 누적 100개까지 보낼 수 있는 임시 열쇠를 미리 등록했습니다(가정).</p>
   <p>현재 사용량은 0이고 다음 요청 번호는 7입니다. 10분째에 7번 요청으로 40개를 보냅니다. 성공하면 Alice 160·Bob 40, 임시 열쇠의 누적 사용량 40·남은 한도 60, 다음 번호 8이 됩니다. 요청 번호가 있어야 같은 서명 자료를 다시 보냈을 때 두 번 송금하지 않습니다.</p>
   <p>
            서비스는 이 요청의 네트워크 비용을 대신 내기로 했습니다. 공통 처리 창구에 예치한 ETH가 0.01이고 최대 예약액은 0.003·실제 청구액은 0.001이라고 합시다(가정).
            정산 후 예치금은 0.009입니다. Alice의 USDC 40과 서비스의 ETH 0.001은 서로 다른 자산의 변화입니다.
          </p>
  </section>
  <section id="picture" data-teach-level="1" className="space-y-5">
   <h2 className="text-2xl font-bold">4. 7번 요청은 권한 검사와 비용 정산을 통과합니다</h2>
   <FlowRail title="같은 40개 송금의 두 장부" steps={[
    {actor:"Alice와 전달자",movement:"7번 요청에 Bob·40개·비용 조건을 묶어 전달합니다.",receives:"서명된 요청"},
    {actor:"처리 창구와 계정",movement:"임시 열쇠의 범위를 확인하고 서비스 예치금에서 최대 0.003 ETH를 확보합니다.",receives:"실행할 수 있는 요청"},
    {actor:"송금과 정산",movement:"USDC 40을 옮기고 ETH 0.001만 청구합니다.",receives:"잔액 160/40·예치금 0.009·다음번호 8"},
   ]} />
   <p>계정은 Bob에게 보낼 자산을 갖고 있고 비용 대납자는 별도의 ETH를 예치합니다. 전달자는 바깥 거래를 제출할 때 네트워크 비용을 먼저 낸 뒤 처리 결과에서 보상받습니다. 세 역할이 같은 주소일 필요는 없습니다.</p>
  </section>
  <section id="need" data-teach-level="2" className="space-y-5">
   <h2 className="text-2xl font-bold">5. 서명이 맞아도 금액과 상대를 확인해야 합니다</h2>
   <p>임시 열쇠의 서명만 확인하면 Bob 대신 공격자에게 200개를 보내는 요청도 통과할 수 있습니다. 이 사례의 계정은 서명과 함께 받을 사람, 호출할 자산 프로그램, 전송 동작, 금액, 만료 시각을 검사해야 합니다.</p>
   <p>40을 보낸 뒤 다른 요청이 70을 더 보내려 한다면 40+70=110으로 한도 100을 넘습니다. 각각의 금액이 100 이하인지만 보는 검사로는 이를 막지 못합니다. 동시에 들어온 요청도 최종 상태에서 순서대로 검사하고 같은 누적 장부를 갱신해야 합니다.</p>
   <p>권한 검사가 없으면 돈을 빼앗기고 비용 확보가 없으면 전달자가 남의 계산 비용을 떠안을 수 있습니다. 그래서 보낼 권한과 비용을 부담할 약속을 각각 검증합니다.</p>
  </section>
  <section id="names" data-teach-level="3" className="space-y-5">
   <h2 className="text-2xl font-bold">6. 이제 UserOperation·bundler·EntryPoint에 이름을 붙입니다</h2>
   <p>사용자가 서명한 요청이 <strong>UserOperation</strong>입니다. 여러 요청을 모아 바깥 거래를 제출하는 전달자는 <strong>bundler</strong>입니다. 계정과 비용 검증을 공통으로 처리하는 계약은 <strong>EntryPoint</strong>입니다. 이 세 역할의 연결을 정한 표준이 ERC-4337입니다.</p>
   <p>규칙을 실행하는 계정은 <strong>smart account</strong>입니다. 비용을 대신 부담하는 계약은 <strong>paymaster</strong>입니다. 요청 번호인 <strong>nonce</strong>는 같은 요청의 재사용을 막습니다. 이 글의 nonce는 key=0인 순서열의 7이며 다른 순서열과는 구별합니다.</p>
   <p>임시로 제한된 열쇠는 <strong>session key</strong>입니다. 이것은 ERC-4337이 모든 계정에 자동 제공하는 기능이 아니라 계정이 구현할 권한 정책입니다. 일반적인 외부 소유 계정인 EOA는 기본 서명 규칙으로 거래를 시작하며, 아래에서 설명할 코드 위임을 통해 프로그램 기능을 연결할 수도 있습니다.</p>
  </section>
  <section id="erc4337" data-teach-level="4" className="space-y-5">
   <h2 className="text-2xl font-bold">7. 7번 요청이 접수에서 실제 송금으로 갑니다</h2>
   <p>Alice의 요청에는 계정 주소, nonce 7, USDC 프로그램의 Bob에게 40 보내기 호출과 비용 조건이 들어갑니다. 서명은 이 내용뿐 아니라 체인 ID와 EntryPoint 주소에도 연결돼야 합니다. 다른 체인이나 다른 처리 계약에서 같은 승인을 재사용하지 않기 위해서입니다.</p>
   <p>Bundler는 먼저 실행을 모의해 서명·예치금·허용된 검증 규칙을 확인합니다. 이를 통과하면 자신의 대기 목록에 넣을 수 있습니다. 제출 직전에 다시 검사하고 <code>handleOps</code>라는 바깥 거래로 요청들을 제출합니다. UserOperation 자체와 이 바깥 거래는 별도의 객체입니다.</p>
   <p>EntryPoint는 계정에 검증을 요청하고 nonce 7을 확인합니다. 대납자의 예치금과 승인도 확인한 뒤 계정의 실행 함수를 호출합니다. 계정은 USDC에 전송을 요청하며 성공 후 잔액은 160·40이 됩니다. 정산 결과에서 성공 여부와 실제 비용을 확인해야 전체 경로가 끝납니다.</p>
   <p>처음 모의했을 때 남은 한도가 100이어도 먼저 포함된 다른 요청이 80을 썼다면 40은 이제 초과입니다. ERC-7562는 검증 과정에서 읽는 상태와 사용하는 연산 등에 제한을 두어 많은 요청을 한꺼번에 무효화하는 공격을 줄입니다. 이 제한이 계정의 송금 권한을 대신 설계해 주지는 않습니다.</p>
   <div id="paper-erc4337-spec" className="scroll-mt-20"><CitationBlock source="ERC-4337 · UserOperation, validation and execution" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-4337">7번 요청의 서명 문맥·처리 순서·비용 정산을 표준과 대조합니다. 2026-10-04 확인.</CitationBlock></div>
   <div id="paper-erc7562-validation" className="scroll-mt-20"><CitationBlock source="ERC-7562 · Account Abstraction Validation Scope Rules" citeKey={2} href="https://eips.ethereum.org/EIPS/eip-7562">Bundler의 요청 수용과 재검증을 위한 규칙입니다. 실제 계정의 권한 정책과 구분합니다.</CitationBlock></div>
  </section>
  <section id="prefund" data-teach-level="5" className="space-y-5">
   <h2 className="text-2xl font-bold">8. 예약한 0.003 ETH 중 0.002 ETH를 돌려줍니다</h2>
   <p>
            네트워크가 받는 gas 요금은 ETH입니다. 사용자가 다른 토큰으로 서비스에 비용을 내더라도 바깥 거래와 EntryPoint 정산의 ETH를 누가 먼저 확보하는지는 별도로
            정해야 합니다. 예치금은 이번 비용의 재원이고 일부 검증 규칙에서 요구하는 stake는 인출 대기 등을 가진 별도의 담보입니다.
          </p>
   <ExplainedFormula question="대납자까지 포함한 7번 요청에 얼마를 예약하나요?" idea="계정 검증·실행·대납자 검증·대납자 후처리·사전 처리의 gas 한도를 더하고 허용한 gas당 최대 가격을 곱합니다." formula={String.raw`C_{max}=(G_v+G_c+G_{pv}+G_{po}+G_{pre})F_{max}`} annotatedFormula={String.raw`\begin{aligned}G&=\underbrace{G_v+G_c+G_{pv}}_{\text{계정 검증·실행·대납 검증}}\\&\quad+\underbrace{G_{po}+G_{pre}}_{\text{대납 후처리·사전 처리}}\\C_{max}&=\underbrace{G F_{max}}_{\text{총 gas에 최대 가격을 곱함}}\end{aligned}`} operations={[{expression:String.raw`\begin{gathered}G_v+G_c+G_{pv}\\+G_{po}+G_{pre}\end{gathered}`,annotation:["20,000+40,000+20,000+20,000+50,000","=150,000 gas입니다(가정)."]},{expression:String.raw`150000\times20`,annotation:["20 Gwei/gas를 곱하면 3,000,000 Gwei,","즉 0.003 ETH를 예약합니다."]}]} terms={[{symbol:"G",name:"총 gas 예산",description:"아래 다섯 처리 예산을 모두 더한 값입니다."},{symbol:"G_v",name:"계정 검증 한도",description:"계정의 승인 검사에 쓸 gas입니다."},{symbol:"G_c",name:"호출 실행 한도",description:"USDC 40 전송을 포함한 계정 실행 예산입니다."},{symbol:"G_{pv}",name:"대납자 검증 한도",description:"비용 대납 승인을 검사하는 gas입니다."},{symbol:"G_{po}",name:"대납자 후처리 한도",description:"실행 후 대납자의 정산 호출 예산입니다."},{symbol:"G_{pre}",name:"사전 처리 비용",description:"자료 전송 등 요청 처리에 배분한 gas입니다."},{symbol:"F_{max}",name:"최대 가격",description:"요청이 허용한 gas당 최대 가격입니다."}]} assumptions={["본문의 gas와 가격은 설명용 가정이며 실측값이 아닙니다.","1 Gwei는 10⁻⁹ ETH입니다. 대납자가 없으면 대납자 전용 예산을 0으로 둡니다."]} interpretation="예치 0.01에서 0.003을 확보하면 일시적으로 0.007이 남습니다. 최종 청구액 0.001을 제외한 0.002를 돌려주면 0.009입니다." />
   {code("prefund","공식 Solidity · 다섯 gas 항의 실제 합계")}
   <p>코드의 <code>_getRequiredPrefund</code>가 바로 다섯 항을 더합니다. 계정 검증·실행·사전 처리만으로 만든 짧은 식은 대납자 전용 항을 0으로 둔 경우에만 완전합니다. 이 사례처럼 paymaster가 있는 요청에는 두 항을 함께 계산해야 합니다.</p>
   {code("settlement","공식 Solidity · 실제 청구액과 남은 예치금 환급")}
   <p>실제 청구 gas를 100,000, 적용 가격을 10 Gwei로 가정하면 0.001 ETH입니다. 여기서 청구 gas에는 후처리·처리 비용·적용되는 미사용 gas 벌칙까지 이미 반영했다고 둡니다. 단순히 토큰 전송 함수가 쓴 gas만 세어 같은 비용이라고 계산하면 안 됩니다.</p>
  </section>
  <section id="source" data-teach-level="6" className="space-y-5">
   <h2 className="text-2xl font-bold">9. 실제 코드는 검증과 실행을 따로 호출합니다</h2>
   <p>원문은 eth-infinitism/account-abstraction commit <code>1c6b669d0eea734e09a87e095ba15e076151718a</code>입니다. <code>handleOps</code>는 먼저 요청들을 검증하고 이후 각각을 실행합니다. <code>BaseAccount.validateUserOp</code>는 EntryPoint가 호출했는지 확인한 뒤 서명을 검사하고 부족한 비용을 보충합니다.</p>
   {code("validation","공식 Solidity · 계정의 승인 검사 호출")}
   {code("nonce","공식 Solidity · nonce 7 검사와 다음 값 8")}
   <p>NonceManager는 계정과 key별 저장된 순서값을 요청과 비교하며 다음 값으로 증가시킵니다. 이후 전체 검증이 되돌려지면 이 증가도 되돌아갑니다. 계정의 기본 <code>_validateNonce</code> 확장 함수와 EntryPoint의 실제 순서 관리는 같은 역할이 아닙니다.</p>
   {code("loops","공식 Solidity · 먼저 검증하고 나중에 실행")}
   {code("execute","공식 Solidity · 계정에서 자산 프로그램 호출")}
   <p>실제 <code>BaseAccount.execute</code>는 target·value·data를 받아 외부 계약을 호출합니다. 사례에서는 target이 USDC 계약, ETH value는 0, data 안에 Bob과 USDC 수량 40이 들어갑니다. 6자리 소수 규칙의 토큰이라면 40개는 원시 정수 40,000,000입니다. 토큰의 단위 설정을 확인한 뒤 인코딩해야 합니다.</p>
   <p>여기서 보존한 <code>SimpleAccount</code>는 owner의 ECDSA 서명을 검사하는 예시입니다. 30분·100개 제한을 구현한 계정은 아닙니다. 아래 절차는 사례의 계정에 추가로 필요한 정책을 설명하며 이 원본에 이미 들어 있다고 주장하지 않습니다.</p>
   <AlgorithmBlock title="임시 열쇠가 허용한 한 번의 전송 검사하기" input={["서명된요청 7, 현재시각 10분, 만료 30분, 현재사용 0, 한도 100"]} steps={[{code:"체인·EntryPoint·계정·nonce·호출·비용 조건을 포함한 서명을 검증",note:"다른 처리 문맥으로 옮긴 요청을 거절합니다."},{code:"등록된 임시 열쇠이고 현재시각 ≤ 만료시각인지 확인",note:"30분을 지난 요청은 거절하는 정책입니다."},{code:"target=USDC,동작=transfer,받는사람=Bob,ETH value=0인지 확인",note:"data를 완전히 해석하고 허용하지 않은 배치·업그레이드 호출은 거절합니다."},{code:"현재사용 + 요청수량 ≤ 100인지 확인",note:"0+40은허용,이미 40을쓴상태의 70은거절합니다."},{code:"사용량을 40으로 갱신하고 외부 호출을 수행",note:"재진입으로 같은 한도를 재사용하지 않도록 호출 전에 갱신하고 실패 때의 복구 규칙을 명시합니다."}]} output="성공시 잔액 160/40·누적사용 40. 실제 요청 번호 관리는 EntryPoint와 일치시킵니다." />
   <p>시간 조건은 ERC-4337의 유효 시간 결과로 전달해야 합니다. 공개 대기 목록의 검증 코드에서는 현재 시각을 직접 읽는 TIMESTAMP 연산이 제한됩니다. 계정은 시작·종료 시각을 검증 결과에 담고 EntryPoint가 그 구간을 검사합니다. 고정한 원본의 시간 경로는 현재 시각이 시작보다 크고 종료 이하인지 확인하므로, 10분은 허용되고 30분이 지난 요청은 거절됩니다.</p>
   {code("validity","공식 Solidity · 계정이 반환한 시간 구간 검사")}
   <p>이 절차에서는 사용량을 계정 실행 안에서 갱신하고 토큰 호출이 실패하면 함께 되돌린다고 가정합니다. EntryPoint 검증 단계에서 이미 증가한 nonce와 사용된 gas는 상위 묶음 거래가 성공하면 남을 수 있습니다. 반면 검증 단계에서 전체 묶음이 실패하면 그 묶음의 계정 상태 변화는 되돌아가지만 제출자의 바깥 거래 비용은 발생할 수 있습니다.</p>
   <CitationBlock source="Account Abstraction 공식 구현 · 1c6b669" citeKey={3} href="https://github.com/eth-infinitism/account-abstraction/tree/1c6b669d0eea734e09a87e095ba15e076151718a/contracts">원본 Solidity와 MIT 고지를 보존했습니다. 본문의 한도 정책은 별도 설계이며 실제 배포·송금을 실행한 결과는 아닙니다.</CitationBlock>
  </section>
  <section id="native-aa" data-teach-level="6" className="space-y-5">
   <h2 className="text-2xl font-bold">10. EIP-7702는 기존 주소에 실행할 코드를 연결합니다</h2>
   <p>ERC-4337은 요청을 묶어 계약으로 처리하는 경로입니다. EIP-7702는 기존 EOA 주소에 어떤 코드를 실행할지 연결하는 규칙입니다. Alice가 기존 주소를 유지하면서 위 기능을 쓰려면 코드 위임과 요청 처리 경로가 함께 사용될 수 있습니다. 코드 연결만으로 session key나 ERC-4337 호환성이 자동 완성되지는 않습니다.</p>
   <p>2026-10-04 확인한 EIP-7702는 Final이며 type-4 거래의 승인 목록을 규정합니다. 승인 항목에는 체인 ID, 위임할 코드의 주소, authority의 nonce와 서명이 들어갑니다. 서명 입력은 <code>keccak256(0x05 || rlp([chain_id,address,nonce]))</code>입니다. 0x05는 승인 용도를 구별하고 RLP는 세 값을 순서가 정해진 바이트로 인코딩합니다.</p>
   <p>체인 ID가 0이면 여러 체인에서 유효하도록 허용한 예외입니다. 같은 주소의 코드·초기 설정이 다른 체인에서 같다는 뜻은 아닙니다. 이 승인 nonce는 7번 UserOperation의 순서열과 구별해야 합니다. 승인 자료에 Bob·USDC 40이 직접 들어 있지 않으므로 위임한 계정 코드가 실제 송금 권한을 별도로 확인해야 합니다.</p>
   <SourceApplication source="EIP-7702 · Behavior" excerpt="the processed delegation indicators is not rolled back" application="Alice의 코드 연결 승인이 처리된 뒤 40개 송금이 실패해도 코드 연결 자체가 자동으로 사라진다고 가정하지 않습니다. 거래 실패 표시만 보고 기존 지갑 상태로 돌아왔다고 판단하면 다음 요청의 권한을 잘못 읽게 됩니다." />
   <p>연결 표시는 <code>0xef0100 || delegate_address</code>이며 호출은 위임된 코드를 Alice 계정의 저장소·잔액 문맥에서 실행합니다. 원래 EOA 키도 바깥 거래와 새 위임을 승인할 수 있는 권한이 남으므로 임시 열쇠만 제한했다고 전체 지갑 권한이 제한되지는 않습니다.</p>
   <p>프로토콜 거래 자체에 검증·실행 단계를 넣는 설계는 native AA라고 부릅니다. EIP-7701은 현재 Withdrawn이고 문서가 후속 EIP-8141로 대체됐다고 밝힙니다. 제안 상태나 예정된 업그레이드를 현재 메인넷 기능으로 읽지 않습니다. 이후 상태를 확인할 때는 <Link to="/cs/blockchain/ethereum-future-roadmap">업그레이드 일정과 EIP 상태를 구분하는 글</Link>의 방법을 적용합니다.</p>
   <div id="paper-eip7702-delegation" className="scroll-mt-20"><CitationBlock source="EIP-7702 · Set Code for EOAs" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-7702">승인 항목·지속되는 코드 연결·실행 실패 시 보존·원래 키의 권한을 확인했습니다.</CitationBlock></div>
   <div id="paper-eip7701-native-status" className="scroll-mt-20"><CitationBlock source="EIP-7701 · Withdrawn, superseded by EIP-8141" citeKey={5} href="https://eips.ethereum.org/EIPS/eip-7701">설계 비교의 근거이며 현재 배포 기능으로 사용하지 않습니다.</CitationBlock></div>
  </section>
  <section id="use-cases" data-teach-level="7" className="space-y-5">
   <h2 className="text-2xl font-bold">11. 배치와 패스키에도 각각의 권한 검사가 필요합니다</h2>
   <p>USDC 40 전송만 허용한 임시 열쇠로 <code>approve</code>를 호출하게 해서는 안 됩니다. approve는 다른 프로그램이 나중에 토큰을 가져갈 수 있도록 허용하는 별도 동작입니다. Alice가 교환을 위해 승인과 swap을 묶고 싶다면 owner가 그 배치를 승인하거나, 제한된 별도 정책을 만들어야 합니다.</p>
   {code("batch","공식 Solidity · 첫 실패에서 전체 배치 되돌리기")}
   <p>원문의 <code>executeBatch</code>는 한 호출이 실패하면 해당 호출 번호와 함께 되돌립니다. 같은 배치 안의 approve가 성공하고 swap이 실패하면 approve도 되돌아갈 수 있습니다. 그러나 악성 상대에게 무제한 승인을 주는 두 호출이 모두 성공하면 원자적인 배치여도 권한은 위험하게 남습니다. 호출별 허용 범위와 전체 예산을 함께 검사해야 합니다.</p>
   <p>패스키는 사용자가 서명하는 방법을 바꿉니다. 계정은 WebAuthn의 공개키·서명뿐 아니라 어느 사이트에서 어떤 요청에 서명했는지 확인해야 합니다. challenge를 7번 UserOperation에 연결하고 origin·relying party·인증 플래그를 검증하는 규칙도 필요합니다. 화면에서 생체인증을 했다는 사실만으로 Bob에게 40을 보내겠다는 의도가 증명되지는 않습니다.</p>
  </section>
  <section id="recovery" data-teach-level="7" className="space-y-5">
   <h2 className="text-2xl font-bold">12. 잃어버린 열쇠를 복구하면 이전 권한도 정리합니다</h2>
   <p>복구용 보호자 A·B·C 중 두 명이 승인하면 새 owner를 등록하는 정책을 가정합시다. 최소 승인 조합은 AB·AC·BC 세 개입니다. 순서를 세면 3×2=6이지만 AB와 BA가 같은 조합이므로 2로 나눠 3이 됩니다. 일반적으로 n명에서 t명을 고르는 경우도 순서가 있는 선택 수 n(n−1)…(n−t+1)를 같은 조합의 순열 수 t!로 나눕니다. 정리하면 n!/(t!(n−t)!)입니다. 여기서 !는 해당 양의 정수까지 연속해서 곱한다는 표기입니다. 0!=1로 정하며, 이 조합식은 정수 0≤t≤n에서 씁니다. 실제 보호자 정책은 양의 승인 기준 t를 선택합니다.</p>
   <p>승인 직후 바꾸지 않고 대기 시간을 두면 정상 owner가 공격을 발견해 취소할 기회가 생깁니다. 다만 owner가 키를 잃은 경우의 복구 가능성과 공격자가 취소를 악용하는 경우를 함께 정해야 합니다. 보호자 세 명의 키가 같은 서버 계정에 보관되면 수학상 세 조합이 있어도 한 번의 침해로 모두 잃을 수 있습니다.</p>
   <p>Alice의 owner를 바꾼 뒤에는 이전 30분짜리 열쇠, 설치한 모듈, 대납 권한과 토큰 승인이 남는지 확인합니다. owner 주소만 바꾸고 이전 열쇠가 계속 60을 보낼 수 있다면 복구 목적을 달성하지 못한 것입니다. 보호자 교체와 계정 코드 업그레이드도 누가 승인하고 기다리는지 별도로 정합니다.</p>
  </section>
  <section id="limits" data-teach-level="7" className="space-y-5">
   <h2 className="text-2xl font-bold">13. 접수 성공, 송금 성공, 비용 확정을 따로 확인합니다</h2>
   <p>
            제출 직후 응답이 끊기면 실패했다고 단정해 새 요청을 만들지 않습니다. 같은 UserOperation hash와 대납 식별자를 보관하고 이벤트·요청 결과를 조회합니다. 결과가
            없으면 아직 모르는 상태로 남기고 예치금 변화와 실제 청구액이 확인된 뒤 비용을 확정합니다. 이 과정이 중복 송금과 중복 대납을 줄입니다.
          </p>
   <p>구현을 비교할 때는 같은 요청 7에 잘못된 체인·이미 쓴 nonce·만료된 열쇠·다른 수신자·한도 초과·대납금 부족을 각각 넣어 봅니다. 성공 사례만 빠르다고 안전한 것은 아닙니다. 코드 위임이나 업그레이드 뒤에도 기존 호출 권한과 저장소 배치가 같은 의미인지 확인해야 합니다.</p>
   <p>이 글은 표준과 고정한 원문을 읽고 가정 금액을 검산했습니다. session key 계약을 배포하거나 실제 송금을 실행한 검증은 아닙니다. 서명 알고리즘 교체까지 확장하려면 <Link to="/cs/blockchain/pq-account">같은 검증·실행 경로에 양자내성 서명을 적용하는 글</Link>에서 기존 owner의 우회 권한도 함께 확인할 수 있습니다.</p>
   <ReviewPrompts questions={["40을 보낸 뒤 같은 열쇠로 70을 더 보내려 하면 서명이 맞아도 왜 거절해야 할까요? (답: 5절)","대납자가 0.01 ETH를 예치하고 0.003을 예약한 뒤 0.001을 청구받으면 얼마가 남을까요? (답: 8절)","EIP-7702 코드 연결 후 40개 송금이 실패하면 코드 연결도 자동으로 사라질까요? (답: 10절)"]} />
  </section>
  <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{"account-abstraction":teachFileTree}}/>
 </article>;
}
