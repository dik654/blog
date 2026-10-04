import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";

export default function ModernElGamal(){return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 받는 사람만 풀 수 있는 곱셈 가리개를 만듭니다</h2>
  <p>
            Bob이 공개해 둔 정보만으로 Alice가 비밀 메시지를 보내려고 합니다. 매번 Bob과 먼저 대화할 수는 없습니다. Alice는 새로 고른 비밀로 메시지를 가리고 Bob만
            같은 가리개를 다시 만들어 걷어낼 수 있게 합니다.
          </p>
  <p>ElGamal 암호화는 <Link to="/cs/crypto/diffie-hellman">Diffie–Hellman의 공유값 계산</Link>을 이 목적에 사용합니다. 메시지 10을 두 값 (17,5)로 바꾸고 다시 10으로 복원하는 과정을 따라가겠습니다. 계산이 맞는 이유와 내용이 안전하게 숨겨지는 조건은 각각 확인합니다.</p>
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 수신자는 공개 정보, 송신자는 두 값을 제공합니다</h2>
  <p>Bob은 오래 보관할 비밀과 그 비밀에서 계산한 공개 정보를 만듭니다. Alice는 그 공개 정보를 받아 이번 메시지에만 쓸 새 비밀을 고릅니다. 새 비밀에서 만든 공개값 하나와 가린 메시지 하나를 Bob에게 보냅니다.</p>
  <p>Bob은 첫 번째 값에 자신의 비밀을 적용해 Alice가 사용한 가리개를 재현합니다. 두 번째 값에서 가리개를 제거하면 메시지를 얻습니다. 관찰자에게는 두 값과 Bob의 공개 정보가 모두 보입니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 메시지 10에 가리개 12를 곱해 5를 보냅니다</h2>
  <p>이 절의 숫자는 원리 설명용 가정이며 안전한 매개변수가 아닙니다. 곱한 뒤 23으로 나눈 나머지를 사용합니다. Bob은 비밀 6을 갖고 공개값 5⁶ mod 23=8을 게시합니다. Alice가 보내려는 메시지는 10이고 이번 비밀은 7입니다.</p>
  <p>Alice는 첫 번째 전송값 5⁷ mod 23=17을 만듭니다. 이어 Bob의 공개값으로 8⁷ mod 23=12를 계산합니다. 이것이 메시지를 가릴 값입니다. 10×12=120을 23으로 나누면 나머지는 5이므로 전송할 두 값은 (17,5)입니다.</p>
  <p>Bob은 받은 17에 자신의 비밀 6을 적용해 17⁶ mod 23=12를 얻습니다. 12×2=24의 나머지가 1이므로 2를 곱하면 12의 효과를 없앨 수 있습니다. 받은 5에 2를 곱해 원래 메시지 10을 복원합니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 17은 가리개 재현에, 5는 메시지 복원에 쓰입니다</h2>
  <FlowRail title="같은 메시지 10이 왕복하는 경로" steps={[{actor:"Alice의 준비",movement:"공개값 8과 새 비밀 7로 가리개 12를 만듭니다.",receives:"17과 메시지 10×12의 나머지 5"},{actor:"공개 연결망",movement:"(17,5)를 Bob에게 보냅니다. 관찰자도 두 값을 봅니다.",receives:"가려진 메시지와 재현용 공개값"},{actor:"Bob의 복원",movement:"17⁶으로 12를 재현하고 그 효과를 지우는 2를 곱합니다.",receives:"5×2의 나머지인 메시지 10"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 같은 메시지도 이번에 고른 비밀에 따라 바뀝니다</h2>
  <p>Alice가 이번 비밀을 7 대신 3으로 골랐다면 첫 값은 5³ mod 23=10입니다. 가리개는 8³ mod 23=6이고 가린 메시지는 10×6 mod 23=14입니다. 같은 메시지 10이 이번에는 (10,14)가 됩니다.</p>
  <p>새 비밀을 쓰는 이유는 같은 메시지를 늘 같은 암호문으로 드러내지 않기 위해서입니다. 하지만 두 암호문이 다르다는 사실만으로 안전성이 증명되지는 않습니다. 가리개를 추측할 수 있는지, 암호문을 바꿨을 때 알아챌 수 있는지도 확인해야 합니다.</p>
  <p>Bob의 공개값이 진짜 Bob의 것인지도 먼저 확인해야 합니다. 공격자의 공개값으로 완벽하게 암호화해도 공격자에게 비밀을 보낸 셈입니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 공개키와 임시 비밀이 같은 공유값을 만듭니다</h2>
  <p>Bob의 비밀 6은 개인키 x, 공개값 8은 공개키 y입니다. Alice의 이번 비밀 7은 임시 지수 r, 메시지 10은 M이라고 씁니다. 두 전송값 (17,5)은 암호문 (c₁,c₂)이며 가리개는 yʳ입니다.</p>
  <p>곱셈과 그 효과를 취소하는 연산을 할 수 있는 값들의 공간을 군이라고 부릅니다. 12의 효과를 지우는 2가 이 공간에서의 역원입니다. 여기의 나누기는 실수 나눗셈이 아니라 역원을 곱하는 연산입니다. 선택한 공간과 메시지의 범위를 함께 정해야 합니다.</p>
  <p>같은 메시지가 새 임시 비밀에 따라 다른 암호문이 되는 방식을 확률적 암호화라고 합니다. 임시 지수는 <Link to="/cs/crypto/csprng">암호용 난수 생성기</Link>에서 정해진 분포로 새로 뽑아야 합니다. 시각이나 증가하는 번호를 그대로 지수로 쓰면 관찰자도 가리개를 계산할 수 있습니다.</p>
 </section>
 <section id="encrypt-decrypt" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 5⁶을 7번 적용하는 것과 5⁷을 6번 적용하는 것은 같습니다</h2>
  <p>Alice의 가리개는 (5⁶)⁷의 나머지이고 Bob이 재현한 가리개는 (5⁷)⁶의 나머지입니다. 양쪽 지수는 42로 같습니다. 따라서 메시지에 곱했던 같은 값을 Bob이 제거할 수 있습니다.</p>
  <ExplainedFormula question="수신자가 원래 메시지 10을 되찾는 이유는 무엇인가요?" idea="양쪽이 같은 지수 곱 xr을 사용하므로 재현한 가리개가 정확히 일치합니다. 그 역원을 곱하면 가리개 두 항만 1이 됩니다." formula={String.raw`\begin{aligned}y&=g^x,\quad c_1=g^r,\quad c_2=My^r\\c_1^x&=g^{rx}=y^r\\c_2(c_1^x)^{-1}&=My^r(y^r)^{-1}=M\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}c_1^x&=\underbrace{g^{rx}=y^r}_{\text{같은 12를 재현}}\\M&=\underbrace{c_2}_{\text{받은 5}}\underbrace{(c_1^x)^{-1}}_{\text{12의 역원 2}}\end{aligned}`} operations={[{expression:String.raw`c_1^x`,annotation:["17⁶ mod 23=12입니다.","송신자가 만든 8⁷ mod 23과 같습니다."]},{expression:String.raw`(c_1^x)^{-1}`,annotation:["12×2 mod 23=1이므로 역원은 2입니다.","받은 5에 곱하면 10이 남습니다."]}]} terms={[{symbol:"g,x,y",name:"시작값·개인키·공개키",description:"사례에서 g=5, x=6, y=8입니다."},{symbol:"r",name:"임시 비밀",description:"이번 암호화에 사용한 7입니다. 매번 새로 생성합니다."},{symbol:"M",name:"메시지",description:"정한 공간 안의 값입니다. 사례에서는 10입니다."},{symbol:"c₁,c₂",name:"암호문 두 값",description:"가리개 재현에 쓰는 17과 가린 메시지 5입니다."}]} assumptions={["같은 군에서 곱셈·거듭제곱·역원을 계산합니다. 사례의 모든 결과는 mod 23입니다.","등식은 복호 정확성만 보이며 선택한 공간의 비밀성이나 암호문 진위를 보장하지 않습니다."]} interpretation="r=0을 임의로 넣으면 c₁=1, yʳ=1, c₂=M이 되어 메시지가 드러납니다. 실제 구현은 검토된 규격의 난수 분포와 키·입력 검사 규칙을 따릅니다." />
  <AlgorithmBlock title="작은 사례를 계산하는 절차 — 교육용 의사코드" input={["p=23, g=5, Bob 개인키 x=6, 메시지 M=10, 이번 지수 r=7"]} steps={[{code:"y = powmod(g,x,p) = 8",note:"실제 송신자는 인증된 Bob의 공개키를 받아 씁니다."},{code:"c1 = powmod(g,r,p) = 17; mask = powmod(y,r,p) = 12"},{code:"c2 = M × mask mod p = 5"},{code:"receiverMask = powmod(c1,x,p) = 12"},{code:"inverse = inverseMod(receiverMask,p) = 2"},{code:"message = c2 × inverse mod p = 10"}]} output="전송 (17,5), 복원 10. 이 작은 코드 절차를 실전 암호로 사용하지 않습니다." />
 </section>
 <section id="source" data-teach-level="5/6" className="space-y-5"><h2 className="text-2xl font-bold">8. 원문의 γ·δ에 17·5를 넣어 다시 복호합니다</h2>
  <p>Handbook of Applied Cryptography 8장의 알고리즘 8.17–8.18은 공개키를 (p,α,αᵃ), 암호문을 (γ,δ)로 씁니다. 우리 사례의 g·x·r·M은 원문의 α·a·k·m에 대응합니다. 따라서 γ=αᵏ=17, δ=m(αᵃ)ᵏ=5입니다.</p>
  <p>원문의 복호 단계는 γ의 p−1−a 제곱을 구해 δ에 곱합니다. 우리 값에서는 23−1−6=16이고 17¹⁶ mod 23=2입니다. 이 2를 δ=5에 곱하면 같은 메시지 10이 나옵니다. 0이 아닌 값의 22제곱이 mod 23에서 1이므로 17¹⁶은 17⁶을 취소하는 역원입니다.</p>
  <p>일반 군을 다루는 알고리즘 8.26은 이 단계를 γᵃ의 역원을 구하는 방식으로 씁니다. 8.18의 정수 메시지 표현과 8.26의 군 원소 메시지 조건은 구분해야 합니다. 특히 0을 그대로 곱해 가리면 언제나 0이어서 메시지를 숨기지 못합니다. 복호 가능한 모든 입력이 안전한 메시지 공간인 것은 아닙니다.</p>
  <CitationBlock source="HAC · 알고리즘 8.17–8.18, 8.26" citeKey={1} href="https://cacr.uwaterloo.ca/hac/about/chap8.pdf">원문 기호와 복호 단계를 같은 (17,5) 사례로 대조했습니다. 책의 1990년대 키 크기 권고는 현재 배포 기준으로 사용하지 않습니다.</CitationBlock>
  <div id="paper-elgamal-1985"><CitationBlock source="ElGamal (1985) · A Public-Key Cryptosystem and a Signature Scheme Based on Discrete Logarithms" citeKey={2} href="https://doi.org/10.1109/TIT.1985.1057074">이 구성을 제시한 원 논문의 서지입니다. 이 글의 실제 단계 대조는 위의 저자 공개 HAC 원문을 사용했습니다. 현대의 능동 공격 저항성과 구체적인 구현 안전성은 별도 조건입니다.</CitationBlock></div>
 </section>
 <section id="security" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">9. 작은 사례에서는 메시지의 한 성질이 그대로 보입니다</h2>
  <p>mod 23에서 어떤 수를 제곱해 만들 수 있는 0 아닌 값은 1·2·3·4·6·8·9·12·13·16·18입니다. 공개키 8은 이 목록 안에 있고 8을 몇 번 곱해 만든 가리개도 목록 안에 있습니다. 이 목록은 곱하거나 역원을 취해도 벗어나지 않습니다.</p>
  <p>메시지 10은 목록 밖이고 암호문의 둘째 값 5도 목록 밖입니다. 같은 가리개 12로 메시지 4를 암호화하면 둘째 값은 4×12 mod 23=2로 목록 안입니다. 관찰자는 개인키를 찾지 않고도 10과 4 중 어느 쪽을 가렸는지 구별합니다. 지수만 크게 쓰는 것으로 이런 메시지 공간의 문제를 고칠 수는 없습니다.</p>
  <p>현대의 비밀성 설명은 적절한 군에서 공유값 yʳ을 독립적인 임의 값과 구별하기 어렵다는 DDH 가정을 사용합니다. 정말 임의의 가리개로 곱하면 특정 메시지에 대한 결과가 군 전체에 고르게 퍼집니다. 실제 가리개를 그런 값으로 바꾼 것을 구별할 수 없다면 공격자가 선택한 두 메시지의 암호문도 구별하기 어렵다는 증명으로 이어집니다.</p>
  <p>이것이 선택 평문 공격에 대한 비밀성, IND-CPA의 범위입니다. 충분한 크기, 정확한 메시지 공간, 정해진 난수 생성과 DDH 조건이 필요합니다. DLP는 개인 지수를 찾는 문제, CDH는 공유값을 계산하는 문제, DDH는 그 후보를 구별하는 문제입니다. DLP가 어렵다는 한 문장으로 이 셋을 대신하지 않습니다.</p>
  <CitationBlock source="Boneh–Shoup v0.6 · 연습문제 11.5, §11.5.2" citeKey={3} href="https://crypto.stanford.edu/~dabo/cryptobook/BonehShoup_0_6.pdf">DDH를 사용한 곱셈형 ElGamal의 비밀성 설명을 따릅니다. 본문의 작은 mod 23 예에 그 보안 가정이 성립한다고 주장하지 않습니다.</CitationBlock>
 </section>
 <section id="malleability" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 둘째 값을 두 배로 바꾸면 복호 메시지도 두 배가 됩니다</h2>
  <p>공격자가 (17,5)를 (17,10)으로 바꾸면 Bob은 여전히 가리개 12와 역원 2를 얻습니다. 복호 결과는 10×2 mod 23=20입니다. 원래 메시지 10이 두 배로 바뀌었지만 기본 복호 절차는 오류를 내지 않습니다.</p>
  <p>같은 공개키의 암호문 두 개를 성분별로 곱해도 관계가 보존됩니다. 첫 성분은 gʳ¹gʳ²=gʳ¹⁺ʳ², 둘째 성분은 M₁M₂yʳ¹⁺ʳ²가 되므로 M₁M₂를 암호화한 결과입니다. 이 성질은 곱셈 준동형이라고 부르며 집계에 사용할 수 있지만 일반 통신에서는 내용을 바꿀 수 있다는 뜻입니다. 집계 프로토콜은 입력 범위·올바른 암호화 증명·참여자 규칙을 추가로 검증해야 합니다.</p>
  <p>앞서 만든 메시지 10의 암호문 (17,5)와 메시지 4를 지수 3으로 가린 (10,1)을 곱하면 (9,5)가 됩니다. Bob의 복호값은 17이며 이는 10×4 mod 23입니다. 메시지의 정수 곱 40 전체를 복원한 것이 아니라 선택한 공간의 나머지 17을 얻은 것입니다.</p>
  <p>비밀 지수 7을 재사용하면 또 다른 관계가 보입니다. 메시지 10은 (17,5), 메시지 4는 (17,2)입니다. 관찰자는 2÷5 mod 23=5를 구하며 이는 4÷10 mod 23과 같습니다. 첫 메시지 10을 이미 안다면 10×5 mod 23=4로 둘째 메시지를 복원합니다. 난수 상태가 복제된 서버나 재시작 뒤의 반복도 같은 위험을 만듭니다.</p>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 실제 파일은 검토된 키 생성과 인증 암호화로 연결합니다</h2>
  <p>문자열과 파일은 군 원소 하나와 다릅니다. 보통은 검토된 방식으로 공유 재료를 만들고 KDF로 바이트 키를 얻은 뒤 인증 암호화인 AEAD로 파일을 처리하는 구성을 사용합니다. 공개 입력·문맥·암호문을 어떻게 연결할지는 전체 규격이 정해야 합니다. 임의로 DH와 AEAD를 붙였다는 사실만으로 선택 암호문 공격에 대한 안전성이 증명되지는 않습니다.</p>
  <p>구현을 비교할 때는 같은 알고리즘 버전과 매개변수인지 먼저 확인합니다. 군의 차수나 생성원이 다르면 같은 숫자도 다른 계산을 뜻합니다. 공개키와 암호문을 바이트로 나타내는 방식과 그 입력을 검사하는 규칙도 맞아야 합니다.</p>
  <p>난수 생성기의 동작과 KDF의 입력, 사용할 AEAD 및 추가 인증 정보를 전체 규격으로 정합니다. 특히 다른 수신자의 키나 다른 사용 문맥으로 암호문을 옮겨도 같은 승인으로 받아들이는지 확인해야 합니다.</p>
  <p>선택한 규격에서 허용하지 않는 길이·항등원·부분군 입력을 거절하는지 검사합니다. 인증 태그를 수정한 경우도 거절해야 합니다. X25519를 쓴다면 그 함수의 별도 입력 허용 규칙을 따릅니다.</p>
  <p>공식 시험값과 실패 사례가 맞은 뒤 키 생성·암호화·복호 시간, 암호문 크기와 메모리를 비교합니다. 난수 중복이나 규격 불일치가 나타나면 배포를 중단하고 원인을 확인해야 합니다. 이전 버전으로 되돌리는 것만으로 이미 노출된 메시지나 키가 다시 안전해지지는 않습니다.</p>
  <div id="paper-rfc6090-elgamal"><CitationBlock source="RFC 6090 · Fundamental Elliptic Curve Cryptography Algorithms" citeKey={4} href="https://www.rfc-editor.org/rfc/rfc6090.html">타원곡선 군 연산과 매개변수를 이해하는 보조 자료입니다. 임의의 ElGamal·KDF·AEAD 조합을 표준화한 문서로 사용하지 않습니다.</CitationBlock></div>
  <p>본문의 작은 계산은 별도 정수 연산으로 검산했습니다. 실전 암호 라이브러리를 배포하거나 안전한 통신 규격을 완성한 검증은 아닙니다.</p>
  <ReviewPrompts questions={["(17,5)의 둘째 값만 10으로 바꾸면 Bob은 무엇을 복호하고 왜 오류가 나지 않을까요? (답: 10절)","공개키 8의 가리개로 메시지 10과 4를 숨겼을 때 제곱으로 만들 수 있는 값인지 검사하면 무엇이 드러날까요? (답: 9절)","원문의 γ^(p−1−a)에 17·23·6을 넣으면 어떤 값이 나오며 어떻게 메시지 10을 복원할까요? (답: 8절)"]}/>
 </section>
 </article>;}
