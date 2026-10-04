import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import FlowRail from "../../world-systems/FlowRail";
import SourceApplication from "../../world-systems/SourceApplication";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import { pinnedCodeRefs as codeRefs } from "./pinnedCodeRefs";

const SOURCE = "https://github.com/eth-infinitism/account-abstraction/tree/1c6b669d0eea734e09a87e095ba15e076151718a";
export default function ModernArticle() {
 const sidebar = useCodeSidebar();
 return <><article className="space-y-14">
  <section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">1. 계정의 서명을 바꿔도 돈을 보내는 모든 권한이 함께 바뀌어야 한다</h2>
   <p>계정은 돈을 보내기 전에 요청자의 권한, 요청의 재사용 여부, 실행 비용을 확인합니다. 양자 공격에 대비한 새 서명을 붙일 때도 이 질문은 남습니다. 서명 하나를 바꾸는 동안 직접 송금·복구·업그레이드에 쓰는 다른 권한을 놓치면 기존 경로로 돈을 움직일 수 있습니다.</p>
   <p>민지의 계정이 0.1 ETH를 보내는 사례를 따라갑니다. 기존 계정이 권한과 돈을 어떻게 관리하는지 확인한 뒤, 새 서명으로 옮길 때 더 확인할 부분을 찾습니다. 공식 자료는 2026-10-04 확인했습니다.</p>
   <p data-stage-bridge="overview" className="text-sm text-muted-foreground">송금 권한을 빠뜨리지 않고 옮겨야 합니다. 요청을 검사하고 돈을 움직이는 역할부터 나눕니다.</p>
  </section>
  <section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">2. 요청 작성, 권한 검사, 실행, 비용 지급은 다른 역할이다</h2>
   <FlowRail title="0.1 ETH 송금 요청이 통과하는 역할" steps={[{actor:"지갑과 제출자",movement:"받는 주소·수량·비용 조건을 서명하고 제출합니다.",receives:"서명된 실행 요청"},{actor:"검사 계약과 계정",movement:"요청의 권한·중복·예치금을 확인합니다.",receives:"실행할 수 있는 요청"},{actor:"계정과 수신자",movement:"승인된 호출을 수행하고 결과를 기록합니다.",receives:"송금 결과와 비용 정산"}]} />
   <p>요청을 대신 제출하는 사람이 계정 주인의 서명 권한까지 얻지는 않습니다. 계정의 송금용 잔액과 수수료를 위해 별도 계약에 맡긴 잔액도 다릅니다. 무엇이 성공했는지 확인하려면 요청별 결과와 외부 거래의 결과를 따로 읽어야 합니다.</p>
   <p data-stage-bridge="black-box" className="text-sm text-muted-foreground">돈과 검사의 역할을 나눴으니 각각의 장부에 숫자를 넣습니다.</p>
  </section>
  <section id="case" data-teach-level="0" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">3. 계정 1 ETH, 비용 예치금 0.02 ETH에서 0.1 ETH를 보낸다</h2>
   <p>이미 만들어진 계정 A의 송금용 잔액은 1 ETH, 별도 비용 예치금은 0.02 ETH라고 합시다. 다음 순번은 7이고 수신자 B는 0 ETH입니다. 계정을 새로 만들거나 다른 사람에게 비용을 맡기지 않고 본인이 서명하는 한 요청을 (가정)합니다.</p>
   <p>요청은 B에게 0.1 ETH를 보내고 비용으로 최대 0.003 ETH를 미리 예약합니다. 검사와 실행·정산을 모두 반영한 최종 청구 비용을 0.001 ETH로 둡니다. 비용이 어떻게 계산되는지는 실제 처리 순서를 읽을 때 확인합니다. 이 숫자는 실측치가 아닙니다.</p>
   <p>송금이 성공하면 A의 송금 잔액은 0.9 ETH, B는 0.1 ETH, 비용 예치금은 0.019 ETH가 됩니다. 예약액 가운데 0.002 ETH는 예치금으로 돌아오며 다음 순번은 8입니다. 예치금 환급은 A의 송금용 잔액으로 바로 출금하는 사건과 다릅니다.</p>
   <p data-stage-bridge="case" className="text-sm text-muted-foreground">송금 0.1과 수수료 0.001을 다른 장부에 적었습니다. 예약과 환급의 중간 상태도 그려 봅니다.</p>
  </section>
  <section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">4. 잔액·예치금·요청 순번이 바뀌는 시점을 나눈다</h2>
   <div className="overflow-x-auto"><table className="w-full min-w-[590px] text-sm"><caption className="mb-3 text-left">설명용 성공 사례. 잔액 단위는 ETH입니다.</caption><thead><tr><th className="p-3 text-left">상태</th><th className="p-3">A 송금 잔액</th><th className="p-3">A 비용 예치금</th><th className="p-3">B</th><th className="p-3">다음 순번</th></tr></thead><tbody>{[["시작","1","0.020","0","7"],["검증·비용 예약","1","0.017 + 예약 0.003","0","8 (잠정)"],["송금·정산 완료","0.9","0.019","0.1","8"]].map(row=><tr key={row[0]} className="border-t">{row.map(cell=><td key={cell} className="p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
   <p>검증 도중의 변경은 상위 거래가 되돌아가면 취소됩니다. 성공한 뒤 세 잔액을 더하면 1.019 ETH입니다. 지급한 비용 0.001 ETH를 더하면 처음 합계 1.02 ETH와 맞습니다. “전송 완료”라는 표시 대신 이 이동과 해당 요청의 성공 여부를 대조합니다.</p>
   <p data-stage-bridge="picture" className="text-sm text-muted-foreground">수량과 순번의 변화가 보였습니다. 이제 같은 서명을 두 번 쓰거나 실패를 성공으로 읽을 때 생기는 문제를 봅니다.</p>
  </section>
  <section id="need" data-teach-level="2" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">5. 서명 성공만으로 재사용 방지와 송금 성공을 보장할 수 없다</h2>
   <p>민지가 0.1 ETH 송금에 한 번 동의한 서명을 누군가 반복 제출할 수 있습니다. 순번 7을 이미 쓴 상태라면 같은 요청이 다시 유효한 서명이어도 거절해야 합니다. 다른 체인이나 다른 검사 계약으로 옮긴 요청도 같은 권한으로 통과해서는 안 됩니다.</p>
   <p>서명과 순번이 맞아도 수신 계약이 송금을 거절하거나 실행 gas가 부족하면 돈은 전달되지 않습니다. 반대로 송금은 실패했어도 요청을 검사하고 실행을 시도한 비용은 발생할 수 있습니다. 오프체인 사전 시험은 비용·권한 문제를 미리 찾는 과정이며 미래 블록의 상태나 실행 성공을 보증하지 않습니다.</p>
   <p data-stage-bridge="need" className="text-sm text-muted-foreground">권한·중복·실행·비용을 구분할 이유를 알았습니다. 실제 인터페이스가 쓰는 이름을 붙입니다.</p>
  </section>
  <section id="names" data-teach-level="3" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">6. 요청 객체, EntryPoint, 예치금, nonce의 이름</h2>
   <p>계정이 검증할 상위 요청 객체가 UserOperation입니다. 제출을 맡는 bundler는 이를 모아 EntryPoint의 handleOps를 부르는 일반 체인 거래를 보냅니다. 계정은 validateUserOp로 권한 결과를 돌려줍니다. 승인된 callData가 계정의 execute로 이어집니다.</p>
   <p>nonce는 재사용을 막는 값입니다. 이 구현은 상위 192비트 key와 하위 64비트 sequence를 나눠 계정·key별 순번을 관리합니다. 본문의 7→8은 key=0에서의 sequence 변화입니다. deposit은 EntryPoint가 관리하는 비용 예치금, prefund는 실행 전 예약할 비용이며 송금할 0.1 ETH와 구분됩니다.</p>
   <p>gas는 실행 자원을 계산하는 단위이고 단위당 가격을 곱해 비용을 구합니다. 1 Gwei는 10억분의 1 ETH입니다. 본문의 계정은 일반적으로 배포된 계정이며, 별도의 서명 집계·paymaster 비용 후원·EIP-7702 위임은 사용하지 않습니다.</p>
   <p>양자내성 서명 중 ML-DSA는 NIST FIPS 204의 표준입니다. 계정 검증 코드를 바꿀 수 있다는 성질과 ML-DSA를 해당 체인에서 실행할 수 있다는 성질은 별개입니다. 서명 원리는 <Link className="underline" to="/cs/crypto/post-quantum-signatures">양자내성 서명</Link>, 위협의 원리는 <Link className="underline" to="/cs/crypto/quantum-computing-and-cryptographic-risk">양자 계산과 암호 위험</Link>으로 이어집니다.</p>
   <p data-stage-bridge="names" className="text-sm text-muted-foreground">이름을 세 장부에 붙였습니다. 실제 코드의 호출 순서로 같은 0.1 ETH 요청을 따라갑니다.</p>
  </section>
  <section id="account-abstraction-validation" data-teach-level="4" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">7. 검증을 통과한 0.1 ETH 요청을 실행하고 정산한다</h2>
   <p>
            지갑은 sender A, nonce 7, B에게 0.1 ETH를 보내는 callData, gas와 비용 조건을 만듭니다. 현재 공개 구현은 이 구조의 해시와 EIP-712
            domain을 결합합니다. domain에는 이름 ERC4337, 버전 1, chainId와 검증 계약 주소가 들어갑니다. 서명 자체는 이 구조 해시에 넣지 않으며
            배포·paymaster가 있는 요청에는 해당 버전의 추가 인코딩 규칙을 따라야 합니다.
          </p>
   <p>bundler의 사전 검사를 통과하면 handleOps가 검증 단계에 들어갑니다. 계정의 validateUserOp는 허용된 EntryPoint 호출인지 확인하고 서명을 검사하며 필요한 부족 예치금을 보냅니다. 이 사례는 deposit이 충분해 추가 입금이 0입니다. EntryPoint는 0.003 ETH 예약을 차감하고 nonce를 검사·갱신한 뒤 반환된 서명·유효 기간 등의 결과를 검사합니다.</p>
   <p>BaseAccount의 _validateNonce는 계정별 정책을 붙이는 빈 확장점입니다. 실제 유일성은 EntryPoint가 부르는 NonceManager가 담당합니다. key=0의 현재 sequence 7과 요청 7이 같아 다음 값을 8로 바꿉니다. 이후 검증이 실패해 전체 handleOps가 revert하면 예치금과 이 변경도 되돌아갑니다.</p>
   <p>모든 검증을 마치면 EntryPoint가 A의 callData를 호출합니다. A의 execute가 자기 잔액에서 B에게 0.1 ETH를 보냅니다. 여기까지가 송금 잔액을 바꾸는 단계입니다.</p>
   <p>다음은 비용 정산입니다. 사전·검증·실행·정산 비용과 해당하는 penalty까지 반영한 청구 gas를 100,000, 적용 가격을 10 Gwei로 가정하면 0.001 ETH입니다. 정산은 이 금액을 청구하고 0.002 ETH를 deposit에 환급합니다.</p>
   <p>마지막에는 요청별 UserOperationEvent의 success와 actualGasCost를 읽습니다. 이 결과를 송금 잔액, 비용 예치금, nonce와 맞춰야 실행과 정산이 모두 맞았는지 알 수 있습니다.</p>
   <div className="overflow-x-auto"><table className="w-full min-w-[570px] text-sm"><caption className="mb-3 text-left">실패한 층위에 따라 남는 결과가 다릅니다.</caption><thead><tr><th className="p-3 text-left">실패</th><th className="p-3 text-left">확인할 결과</th></tr></thead><tbody>{[["잘못된 서명·nonce·prefund","AA24·AA25·AA21 등의 원인과 상위 revert를 구분. 전체 revert면 계정 nonce·deposit 변경도 취소"],["검증 후 수신자 호출 실패","bundle이 성공하면 요청 success=false여도 nonce 8과 해당 실행 시도 비용은 남을 수 있음"],["bundler의 사전 검사 거절","온체인 포함 전의 실패. 요청 receipt가 생겼거나 B가 0.1을 받았다고 표시하지 않음"]].map(row=><tr key={row[0]} className="border-t">{row.map(cell=><td key={cell} className="p-3 align-top">{cell}</td>)}</tr>)}</tbody></table></div>
   <p>전체 bundle 거래가 revert해도 제출자의 체인 거래 gas는 발생할 수 있습니다. 이는 되돌아간 계정 deposit 청구와 다른 비용입니다. 실행 실패 때의 실제 수수료 역시 성공 사례의 0.001과 같다고 단정하지 않고 요청별 기록을 읽습니다.</p>
   <p data-stage-bridge="account-abstraction-validation" className="text-sm text-muted-foreground">같은 순번 7이 어느 실패에서 남고 되돌아가는지 확인했습니다. 공개 원본에서 이 분기들을 직접 찾습니다.</p>
  </section>
  <section id="source" data-teach-level="5" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">8. 실제 원본은 EIP-712 해시와 두 실행 단계를 보여 준다</h2>
   <p>eth-infinitism/account-abstraction의 commit 1c6b669d0eea734e09a87e095ba15e076151718a를 고정했습니다. SimpleAccount는 기존 ECDSA 서명의 예시입니다. 먼저 그 검증·실행 위치를 읽고 9절에서 새 서명에 필요한 변경과 남는 권한을 비교합니다.</p>
   <SourceApplication source="EntryPoint.sol · getUserOpHash, 고정 commit" excerpt="MessageHashUtils.toTypedDataHash(getDomainSeparatorV4(), userOp.hash(overrideInitCodeHash))" application="nonce 7과 0.1 ETH call을 뭉뚱그린 임의의 해시 식으로 대체하지 않습니다. 원본의 타입 인코딩·동적 바이트 해시·domain을 같은 버전으로 계산하고, 다른 chainId나 EntryPoint에서 받은 서명을 거절해야 합니다." />
   <div className="flex flex-wrap gap-3"><CodeViewButton label="EIP-712 userOpHash 원본" onClick={()=>sidebar.open("hash",codeRefs.hash)} /><CodeViewButton label="서명 대상 필드 인코딩" onClick={()=>sidebar.open("fields",codeRefs.fields)} /><CodeViewButton label="validateUserOp의 책임" onClick={()=>sidebar.open("validation",codeRefs.validation)} /><CodeViewButton label="nonce 7에서 8로" onClick={()=>sidebar.open("nonce",codeRefs.nonce)} /></div>
   <div className="flex flex-wrap gap-3"><CodeViewButton label="검증 뒤 실행하는 handleOps" onClick={()=>sidebar.open("loops",codeRefs.loops)} /><CodeViewButton label="실행 실패 뒤 정산" onClick={()=>sidebar.open("execute",codeRefs.execute)} /><CodeViewButton label="prefund 차감과 환급" onClick={()=>sidebar.open("gas",codeRefs.gas)} /></div>
   <div id="paper-erc4337" className="scroll-mt-20 space-y-3"><p>ERC-4337이 다루는 문제는 계정마다 다른 권한·비용 정책을 공통 제출 경로로 실행하는 것입니다. UserOperation·bundler·EntryPoint와 검증 후 실행의 역할을 정의하지만 어떤 양자내성 서명을 골라야 하는지나 그 검증 비용을 정하지 않습니다. 위 코드는 주석상 v0.9인 고정 개발 snapshot이며 특정 체인의 배포와 동일하다고 검증한 결과는 아닙니다.</p><CitationBlock source="ERC-4337 · Final, EIP-712와 EntryPoint" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-4337">2026-10-04 현재 원문의 EIP-712·nonce·검증·실행·환급 설명을 고정 코드와 대조했습니다. 네트워크별 배포 주소·버전은 별도로 확인해야 합니다.</CitationBlock></div>
   <CitationBlock source="eth-infinitism/account-abstraction · pinned 1c6b669" citeKey={2} href={SOURCE}>원문 Solidity 파일과 라이선스를 보존했습니다. 코드 창의 설명 주석은 원본 바이트 바깥에 붙였습니다.</CitationBlock>
   <p data-stage-bridge="source" className="text-sm text-muted-foreground">기존 서명의 검증 위치와 실제 실행 경로를 찾았습니다. 그 위치를 ML-DSA로 바꿀 때 더 필요한 조건을 비교합니다.</p>
  </section>
  <section id="ml-dsa-signature-boundary" data-teach-level="6" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">9. 서명 표준·체인 실행 능력·전환 권한을 따로 확인한다</h2>
   <div id="paper-fips204" className="scroll-mt-20 space-y-3"><p>FIPS 204는 ML-DSA의 키 생성·서명·검증과 인코딩을 정합니다. ML-DSA-44의 공개키는 1,312바이트, 서명은 2,420바이트입니다. 비교용 ECDSA 서명을 65바이트로 두면 서명만 2,355바이트 늘어납니다. 이 차이는 gas나 검증 시간의 측정값이 아닙니다.</p><p>바이트 크기를 확인한 다음에는 서로 같은 규칙으로 서명하고 검증하는지 봅니다. 사용할 표준과 매개변수 묶음, 키와 context, pure/prehash 방식을 고정해야 합니다. 실제 verifier도 그 규칙에 맞는 바이트를 읽어야 합니다.</p><CitationBlock source="NIST FIPS 204 · 최종 표준과 Table 2" citeKey={3} href="https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.204.pdf">Table 2의 ML-DSA-44 공개키·서명 크기를 확인했습니다. 표준 알고리즘의 크기이며 EVM 배포 비용·보안 인증을 뜻하지 않습니다.</CitationBlock></div>
   <div id="paper-erc7562" className="scroll-mt-20 space-y-3"><p>ERC-7562는 bundler가 검증 코드의 환경 의존·저장소 접근·과도한 자원 사용을 제한하는 규칙을 다룹니다. signature가 bytes라는 사실만으로 임의의 verifier가 모든 bundler에서 수락되지는 않습니다. 이 체인에 맞는 bytecode 또는 허용된 precompile, calldata 한도, 검증 gas와 사전 검사 지원을 확인해야 합니다. 이 글은 ML-DSA의 EVM gas를 측정하지 않았습니다.</p><CitationBlock source="ERC-7562 · Account Abstraction Validation Scope Rules" citeKey={4} href="https://eips.ethereum.org/EIPS/eip-7562">2026-10-04의 환경 opcode·저장소·precompile 접근 규칙입니다. 특정 verifier의 호환성을 대신 인증하지 않습니다.</CitationBlock></div>
   <p>공개 SimpleAccount의 _validateSignature는 ECDSA.recover를 사용합니다. 더구나 owner가 execute를 직접 호출할 수 있고 업그레이드도 owner 권한에 연결됩니다. 이 함수를 ML-DSA로 바꾸더라도 옛 owner 직접 실행·복구·업그레이드 경로가 남으면 계정 전체가 양자내성으로 바뀐 것이 아닙니다.</p>
   <CodeViewButton label="ECDSA와 owner 직접 실행 경로" onClick={()=>sidebar.open("owner",codeRefs.owner)} />
   <SourceApplication source="NIST CSWP 39upd1 · Crypto agility의 정의" excerpt="while preserving security and ongoing operations" application="0.1 ETH 요청의 검증자를 교체할 때 기존 순번 7의 연속성, 예치금 0.02와 새 verifier 비용, 잃어버린 키를 복구하는 권한까지 함께 유지해야 합니다. 새 알고리즘 이름만 기록해서는 송금의 보안과 운영을 보존했다고 할 수 없습니다." />
   <div id="paper-crypto-agility" className="scroll-mt-20 space-y-3"><p>이 문서는 교체 능력을 알고리즘 목록보다 넓게 다루며 운영·호환성의 절충을 설명합니다. 2025년판은 2026-06-29의 upd1로 교체됐습니다. 여러 방식을 지원하는 과정의 downgrade 위험도 다루지만 특정 계정의 전환이 안전하다는 증명은 제공하지 않습니다.</p><CitationBlock source="NIST CSWP 39upd1 · 2026-06-29 업데이트" citeKey={5} href="https://csrc.nist.gov/pubs/cswp/39/upd1/considerations-for-achieving-crypto-agility/final">현재 최종판의 정의와 운영 범위를 확인했습니다. 구판의 철회·대체 이력도 구분합니다.</CitationBlock></div>
   <p data-stage-bridge="ml-dsa-signature-boundary" className="text-sm text-muted-foreground">표준의 검증과 계정의 검증은 다른 층위입니다. 마지막으로 실제 전환 정책을 같은 송금 사례에 적용합니다.</p>
  </section>
  <section id="migration-release" data-teach-level="7" className="scroll-mt-20 space-y-5">
   <h2 className="text-2xl font-bold">10. 새 서명 실패와 복구 때도 허용한 권한만 돈을 움직이게 한다</h2>
   <p>전환 중 두 서명을 모두 요구하는 AND 정책을 가정합시다. 같은 nonce 7·0.1 ETH 요청에서 ECDSA=1, ML-DSA=0이면 결과는 0이므로 실행을 허용하지 않습니다. 어느 하나만 통과하면 되는 OR 정책과 결과가 다릅니다. AND는 한 검증의 실패에도 송금이 막히므로 키 백업과 복구 가능성도 함께 시험해야 합니다.</p>
   <p>이전 검사는 알고리즘에서 시작해 실제 송금 결과까지 이어집니다. 각 단계에서 무엇을 바꿔 시험했는지 남깁니다.</p>
   <ol className="list-decimal space-y-3 pl-6 leading-8">
    <li>서명 알고리즘은 공식 벡터로 확인합니다. 서명이 잘렸거나 인코딩이 잘못된 경우에도 올바르게 거절해야 합니다.</li>
    <li>계정은 같은 요청의 chain, EntryPoint, nonce, callData를 하나씩 바꿔 검사합니다. 허용하지 않은 키와 policy 세대, 만료 조건도 시험합니다.</li>
    <li>bundler의 사전 검사 결과를 실제 체인 요청 결과와 대조합니다. 송금 잔액, 예치금, 순번까지 맞아야 어떤 실행이 성공했는지 알 수 있습니다.</li>
   </ol>
   <p>검사를 재현할 이전 문서에는 연결할 체인과 EntryPoint, 계정과 verifier의 주소를 남깁니다. 배포 코드의 hash와 서명 표준, 매개변수와 키 식별자도 기록합니다. 비용 한도와 복구 권한은 운영자가 무엇을 할 수 있는지 정하는 별도 항목입니다.</p>
   <p>오류가 났다고 자동으로 ECDSA-only를 허용하면 공격자가 그 전환을 유도할 수 있습니다. 특히 기존 서명이 더 이상 안전하지 않은 상황에는 그 키만으로 실행·업그레이드·복구하는 모든 경로를 다시 판단해야 합니다.</p>
   <p>비밀키를 분실했는데 복구 권한도 없다면 알고리즘을 교체할 수 있다는 코드만으로 자산을 되찾을 수 없습니다. 반대로 복구자를 너무 넓게 허용하면 그 주체가 송금 권한이 됩니다. 전환은 표준 선택·실행 가능성·키 보관·복구·운영 지원을 함께 결정하는 일입니다.</p>
   <p>키를 합의하는 <Link className="underline" to="/cs/crypto/ml-kem-and-noisy-equations">ML-KEM</Link>이나 통신 경로에서 키를 만드는 <Link className="underline" to="/cs/crypto/quantum-key-distribution">QKD</Link>는 이 송금 요청의 서명 검증을 자동으로 대체하지 않습니다. 각 방식이 해결하는 요청과 남는 신뢰 조건을 구별해야 합니다.</p>
   <p data-stage-bridge="migration-release" className="text-sm text-muted-foreground">0.1 ETH의 권한·순번·비용·복구를 끝까지 연결하면 어떤 변경을 더 확인해야 하는지 설명할 수 있습니다.</p>
   <ReviewPrompts questions={["예약 0.003 ETH와 실제 비용 0.001 ETH가 주어졌을 때 최종 송금 잔액·예치금·순번은 무엇인가요? (답: 3·4절)","수신자 호출이 실패해도 nonce 8과 수수료가 남는 경우는 언제인가요? (답: 7절)","SimpleAccount의 서명 함수만 ML-DSA로 바꾸면 어떤 기존 권한이 남나요? (답: 9·10절)"]} />
  </section>
 </article><CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={{}} projectMetas={{"account-abstraction":{id:"account-abstraction",label:"공식 Solidity · 1c6b669",badgeClass:"border-sky-500 text-sky-700"}}} /></>;
}
