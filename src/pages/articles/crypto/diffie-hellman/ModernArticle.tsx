import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import ContentBoundary from "@/components/articles/content-boundary";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import DHFlowViz from "./viz/DHFlowViz";

export default function ModernDH() { return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 처음 만난 두 컴퓨터가 같은 비밀을 가지려면</h2>
  <p>두 컴퓨터가 대화를 암호화하려고 합니다. 아직 같은 열쇠를 갖고 있지 않고 연결망에서는 다른 사람이 오가는 값을 모두 볼 수 있습니다. 열쇠 자체를 보내지 않고 양쪽이 같은 결과를 계산할 수 있을까요?</p>
  <p>
            Diffie–Hellman은 각자 숨긴 수와 서로 공개한 값을 조합해 같은 비밀 재료에 도달하는 방법입니다. 먼저 작은 수로 이 흐름을 확인하고 실제 규격에서는 입력 확인·상대
            인증·용도별 열쇠 생성이 어떻게 더해지는지 살펴봅니다.
          </p><ContentBoundary article="diffie-hellman" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 각자 숨기는 수와 밖으로 보내는 값을 나눕니다</h2>
  <p>Alice와 Bob은 같은 계산 규칙을 알고 있습니다. 각자 혼자만 아는 수를 고르고 그 수로 계산한 공개값만 상대에게 보냅니다. 받은 공개값에 자신이 숨긴 수를 다시 적용하면 둘은 같은 결과를 얻습니다.</p>
  <p>관찰자는 규칙과 양쪽 공개값을 모두 봅니다. 하지만 각자 숨긴 수를 모릅니다. 비밀이 어디에 있는지부터 구별해야 공개값을 숨기는 일과 계산 규칙을 비밀로 만드는 일을 혼동하지 않습니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 8과 19를 교환해 양쪽에서 2를 얻습니다</h2>
  <p>
            설명용으로 5를 반복해서 곱한 뒤 23으로 나눈 나머지를 쓰겠습니다(가정). Alice는 6번 곱해 공개값 8을 만들고 Bob은 15번 곱해 19를 만듭니다. 예를 들어
            5²=25의 나머지는 2이고 5⁴의 나머지는 4이므로 5⁶의 나머지는 4×2=8입니다.
          </p>
  <p>Alice는 받은 19를 6번 곱해 나머지 2를 얻습니다. Bob도 받은 8을 15번 곱해 나머지 2를 얻습니다. 밖으로 보낸 것은 8과 19이며 각자 숨긴 6과 15는 보내지 않았습니다.</p>
  <p>23은 손으로 계산하기 위한 작은 수입니다. 이 계산 공간에는 0을 제외한 22개 값밖에 없어 비밀을 금방 찾을 수 있습니다. 결과가 같아지는 원리를 보여 주는 사례이며 실제 보안 설정은 아닙니다.</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 공개값을 바꾸어 받은 뒤 자기 비밀을 적용합니다</h2>
  <FlowRail title="공개된 8·19와 전달하지 않은 6·15" steps={[{actor:"양쪽에서 준비",movement:"Alice는 6을 숨기고 8을 만듭니다. Bob은 15를 숨기고 19를 만듭니다.",receives:"공개할 두 값 8·19"},{actor:"연결망에서 교환",movement:"Alice에게 19, Bob에게 8을 전달합니다. 관찰자도 둘을 봅니다.",receives:"상대가 공개한 값"},{actor:"각자 다시 계산",movement:"Alice는 19⁶, Bob은 8¹⁵을 계산하고 23으로 나눈 나머지를 취합니다.",receives:"양쪽에서 같은 결과 2"}]} />
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 같은 결과를 얻는 것만으로 상대를 알 수는 없습니다</h2>
  <p>공개한 값에서 숨긴 수를 쉽게 알아내면 관찰자도 결과 2를 계산합니다. 그래서 실제로는 거꾸로 계산하기 어려운 수학적 공간을 골라야 합니다. 또한 매번 같은 비밀을 쓰면 한 번의 유출로 여러 대화가 함께 노출될 수 있습니다.</p>
  <p>연결망에서 누군가 19를 자기 값으로 바꾸는 문제도 남습니다. Alice는 계산을 성공해도 누구와 같은 결과를 얻었는지 모를 수 있습니다. 상대의 신원을 확인하는 절차와, 계산 결과를 실제 암호화 열쇠로 바꾸는 절차가 추가로 필요합니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 공개값·공유값·인증에 이름을 붙입니다</h2>
  <p>반복 계산을 시작하는 5를 생성원 g, 숨긴 6·15를 비밀 지수 a·b, 공개한 8·19를 A·B라고 씁니다. mod 23은 23으로 나눈 나머지를 뜻합니다. 양쪽이 얻은 2는 공유값 Z이며 실제 암호화에 넣을 바이트 열쇠와는 구별합니다.</p>
  <p>이 교환이 <strong>DH 키 합의</strong>입니다. 대화마다 새 비밀을 만들면 ephemeral DH라고 부릅니다. 상대 신원과 대화 내용을 확인하는 것은 인증, 공유값에서 용도별 열쇠를 만드는 함수는 KDF입니다. 예측할 수 없는 비밀을 만드는 방법은 <Link to="/cs/crypto/csprng">암호용 난수 생성기</Link>에서 다룹니다.</p>
  <div id="security" className="space-y-4 scroll-mt-20"><p>세 가지 계산 문제도 구분합니다. A에서 a를 찾는 문제는 이산로그 문제(DLP)입니다. A·B만으로 공유값을 만드는 문제는 계산 DH 문제(CDH)입니다. 어떤 후보가 그 공유값인지 구별하는 문제는 판별 DH 문제(DDH)입니다. 이 이름들의 정확한 정의는 <Link to="/cs/crypto/discrete-log#applications">이산로그 가정 설명</Link>과 연결됩니다.</p><p>
            DLP를 풀면 CDH를 풀 수 있고 CDH를 풀면 계산 결과와 후보를 비교해 DDH도 판정할 수 있습니다. 반대로 DLP가 어렵다는 이유만으로 CDH가 어렵다고 결론낼 수는
            없습니다. CDH는 어려운데 DDH 판정은 쉬운 공간도 있으므로 보안 주장은 정확한 공간과 문제를 지정해야 합니다.
          </p></div>
 </section>
 <section id="protocol" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 6번과 15번의 순서가 바뀌어도 총 90번입니다</h2>
  <p>Alice는 Bob이 15번 곱해 만든 값에 다시 6번을 적용합니다. 총 지수는 15×6=90입니다. Bob의 계산도 6×15=90입니다. 중간마다 나머지를 취해도 곱셈의 최종 나머지는 같으므로 양쪽이 5⁹⁰의 나머지 2에 도달합니다.</p>
  <ExplainedFormula question="왜 공개값 8·19에서 같은 결과가 나오나요?" idea="상대가 반복한 횟수와 자신이 반복하는 횟수를 곱하면 두 계산의 총 지수가 같습니다." formula={String.raw`Z=B^a=(g^b)^a=g^{ab}=A^b\pmod p`} annotatedFormula={String.raw`\begin{aligned}Z&=\underbrace{(g^b)^a}_{\text{Bob의 값에 Alice 비밀 적용}}\\&=\underbrace{g^{ab}}_{\text{15×6=6×15}}\\&=\underbrace{(g^a)^b}_{\text{반대쪽도 같은 계산}}\end{aligned}`} operations={[{expression:String.raw`(g^b)^a`,annotation:["19⁶ mod 23을 계산합니다.","19²=16, 19⁴=3이므로 3×16의 나머지는 2입니다."]},{expression:String.raw`(g^a)^b`,annotation:["8¹⁵ mod 23을 계산합니다.","8·18·2·4의 나머지도 2입니다."]}]} terms={[{symbol:"p,g",name:"공개 계산 설정",description:"사례에서 p=23, g=5입니다. 실제로는 크기·공간·인코딩까지 합의합니다."},{symbol:"a,b",name:"비밀 지수",description:"Alice의 6과 Bob의 15이며 실제 비밀은 예측 불가능하게 새로 만듭니다."},{symbol:"A,B",name:"공개값",description:"5⁶의 나머지 8과 5¹⁵의 나머지 19입니다."},{symbol:"Z",name:"공유값",description:"양쪽 결과 2이며 이후 KDF의 입력 재료입니다."}]} assumptions={["양쪽이 같은 계산 공간과 공개 설정을 씁니다.","정확성 등식은 상대의 신원이나 관찰자에 대한 보안성을 증명하지 않습니다."]} interpretation="타원곡선에서는 거듭제곱 대신 점을 반복해서 더하며 [a]([b]G)=[ab]G=[b]([a]G)라는 같은 구조를 사용합니다." />
  <DHFlowViz />
 </section>
 <section id="source" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 1976년 원문의 기호에 같은 6·15를 넣습니다</h2>
  <p>Diffie와 Hellman의 원문 649쪽 식 (7)~(12)는 사용자 i의 공개값을 Yᵢ=αˣⁱ mod q, 공유값을 Kᵢⱼ=αˣⁱˣʲ mod q로 씁니다. 여기서 원문의 q는 우리 사례의 23, α는 5, Xᵢ·Xⱼ는 6·15, Yᵢ·Yⱼ는 8·19입니다.</p>
  <p>원문의 계산 Kᵢⱼ=Yⱼˣⁱ mod q에 대입하면 19⁶ mod 23=2입니다. 반대편 식 Yᵢˣʲ mod q에는 8¹⁵ mod 23=2가 들어갑니다. 이름만 바뀌었고 7절에서 따라간 계산은 그대로입니다.</p>
  <p>원문은 공개 파일에 이름과 공개값을 연결하는 인증 구상도 함께 설명합니다. 그러나 숫자 교환만으로 그 파일의 진위를 보장하지는 않습니다. 또한 이산로그를 풀면 체계가 깨진다는 방향을 설명하고 그 역방향 증명은 없다고 명시합니다. 당시의 공격 비용 추정을 오늘의 매개변수 권고로 사용하지 않습니다.</p>
  <div id="paper-diffie-hellman-1976"><CitationBlock source="Diffie–Hellman (1976) · p.649, 식 (7)~(12)" citeKey={1} href="https://ee.stanford.edu/~hellman/publications/24.pdf">공개 통신으로 공유 재료를 만드는 원래 식에 본문의 숫자를 대입했습니다. 현대 바이트 규칙·KDF·세션 폐기 정책은 후속 규격에서 확인합니다.</CitationBlock></div>
 </section>
 <section id="public-validation" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. X25519에서는 숫자 대신 규정된 32바이트를 넣습니다</h2>
  <p>RFC 7748 §6.1은 Alice의 공개값을 X25519(a,9), Bob의 공개값을 X25519(b,9)로 규정합니다. 받는 값에 자기 비밀을 적용하는 순서는 8·19 사례와 같습니다. 여기의 9는 시작점의 좌표를 인코딩한 것이며 5를 반복해서 곱하는 작은 예와 같은 매개변수는 아닙니다.</p>
  <p>입력과 출력은 32바이트입니다. u 좌표는 낮은 자리 바이트부터 읽고 최상위 비트 처리·정해진 범위 밖 표현의 처리·비밀 스칼라의 비트 조정은 RFC §5를 따릅니다. X25519가 허용하는 비정규 표현을 다른 곡선의 규칙만 보고 거절하면 상호운용성이 달라집니다. 일반적인 곡선 위 점 검사나 부분군 검사를 그대로 복사하지 않습니다.</p>
  <div className="not-prose overflow-x-auto"><table className="w-full text-sm"><caption className="pb-3 text-left font-semibold">RFC 7748 §6.1 원문 벡터와 실제 계산 비교</caption><thead><tr><th className="p-3 text-left">값</th><th className="p-3 text-left">16진수 바이트</th></tr></thead><tbody>{[
   ["Alice의 공개값", "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a"],
   ["Bob의 공개값", "de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f"],
   ["양쪽 공유값", "4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742"],
  ].map(([label,value])=><tr key={label} className="border-t border-border"><td className="p-3">{label}</td><td className="p-3"><code className="break-all">{value}</code></td></tr>)}</tbody></table></div>
  <p>원문에 공개된 두 비밀 입력을 Node v24.13.0의 crypto 함수에 넣어 위 공개값 두 개와 공유값 양쪽 계산을 확인했습니다. 사용한 OpenSSL은 3.5.4입니다. 이는 해당 벡터와 구현의 일치를 확인한 것이며 전체 통신 인증이나 비밀의 메모리 폐기를 시험한 결과는 아닙니다.</p>
  <p>특수한 작은 차수 입력에서는 공유값 전체가 0이 되어 상대 비밀의 기여가 사라질 수 있습니다. RFC는 이 결과를 검사하고 중단할 수 있다고 설명합니다. 사용하는 상위 프로토콜의 의무와 라이브러리 동작을 확인해야 합니다. 이번 Node 실행에서는 0으로 채운 공개 입력이 오류로 거절됐습니다. 이를 모든 라이브러리의 공통 반환 규칙이라고 확대하지 않습니다.</p>
  <div id="paper-rfc7748-x25519"><CitationBlock source="RFC 7748 · §§5, 6.1, 7" citeKey={2} href="https://www.rfc-editor.org/rfc/rfc7748.html">바이트 처리·공개값·공유값·모든 바이트가 0인 결과의 의미를 확인했습니다. 공개값을 인증하는 절차와 실제 대화의 KDF는 별도로 필요합니다.</CitationBlock></div>
 </section>
 <section id="authenticated-transcript" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">10. 중간자는 같은 등식으로 6과 15를 따로 만듭니다</h2>
  <p>8·19 사례로 돌아갑니다. Mallory가 Alice에게 Bob의 19 대신 자신이 만든 10=5³ mod 23을 보낸다고 합시다(가정). Alice는 10⁶ mod 23=6을 얻고 Mallory도 Alice의 8로 8³ mod 23=6을 계산합니다.</p>
  <p>Bob에게는 Alice의 8 대신 17=5⁷ mod 23을 보냅니다. Bob의 17¹⁵ mod 23과 Mallory의 19⁷ mod 23은 모두 15입니다. Alice 쪽 공유값은 6, Bob 쪽은 15이며 Mallory는 둘을 모두 압니다. 각 구간에서 같은 열쇠를 가졌는지 확인하는 절차까지 성공할 수 있습니다.</p>
  <p>이를 막으려면 신뢰할 수 있는 인증 키로 상대의 신원과 대화 기록을 확인해야 합니다. 기록에는 프로토콜 버전, 선택한 알고리즘, Alice·Bob의 신원과 역할, 공개 설정, A=8·B=19를 빠짐없이 넣습니다. 서명 또는 미리 공유한 인증 키의 MAC을 검증하면 공격자가 19를 10으로 바꾼 기록은 같은 승인을 통과하지 못합니다.</p>
  <p>역할을 빼면 보낸 내용을 반대로 되돌리는 공격, 신원을 빼면 서로 다른 상대와 합의했다고 믿는 문제, 협상 내용을 빼면 약한 알고리즘으로 바꾸는 문제가 남을 수 있습니다. 문자열을 단순히 이어 붙여 경계가 모호해지지 않도록 길이와 순서를 정한 인코딩도 필요합니다. 열쇠 확인은 이 인증 문맥 안에서 수행해야 합니다.</p>
 </section>
 <section id="kdf-key-schedule" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">11. 같은 공유값에도 보내는 방향을 붙여 열쇠를 나눕니다</h2>
  <p>
            공유값 2를 그대로 암호화 키로 넣을 수는 없습니다. 필요한 길이와 형태로 바꾸고 보내는 방향과 용도를 구별해야 합니다. HKDF는 먼저 입력 재료를 모아 PRK를 만들고 그
            PRK와 용도 정보로 필요한 길이의 키를 만듭니다. RFC 5869 §3.3은 DH 입력에서 첫 단계를 생략하지 않도록 설명합니다.
          </p>
  <ExplainedFormula question="하나의 공유값에서 방향별 키를 어떻게 구별하나요?" idea="공유 재료를 처리한 결과에 방향·용도·인증된 대화 기록을 추가합니다. 같은 계산을 다시 하면 같은 키이고 방향이 바뀌면 별도 키를 얻도록 설계합니다." formula={String.raw`\begin{aligned}P&=\operatorname{Extract}(salt,Z)\\K&=\operatorname{Expand}(P,info,L)\end{aligned}`} annotatedFormula={String.raw`\begin{aligned}P&=\underbrace{\operatorname{Extract}(salt,Z)}_{\text{공유 재료에서 PRK 생성}}\\K&=\underbrace{\operatorname{Expand}(P,info,L)}_{\text{용도 정보와 필요한 길이 적용}}\end{aligned}`} operations={[{expression:"Z",annotation:["작은 사례의 2를 한 바이트 0x02로 인코딩합니다.","이 입력은 약하므로 결과도 실전 키로 안전하지 않습니다."]},{expression:"info",annotation:["Alice-to-Bob 또는 Bob-to-Alice를 넣고","같은 대화 기록과 함께 인코딩합니다."]}]} terms={[{symbol:"Z",name:"공유 재료",description:"검증한 상대 공개값과 자기 비밀로 얻은 값입니다."},{symbol:"salt",name:"추출 보조 입력",description:"프로토콜이 정한 값이며 일반적으로 비밀일 필요는 없습니다."},{symbol:"P",name:"PRK",description:"Extract에서 얻어 Expand의 비밀 입력으로 쓰는 값입니다."},{symbol:"info,L",name:"용도 정보와 길이",description:"방향·목적·문맥과 출력 바이트 수를 정합니다."}]} assumptions={["해시, salt, info 인코딩, 출력 길이를 같은 프로토콜 설정으로 고정합니다.","KDF는 약한 입력의 비밀량을 늘리거나 인증되지 않은 기록에 신원을 부여하지 않습니다."]} interpretation="HKDF의 Extract는 HMAC(salt,Z)이며 Expand는 앞 블록·info·증가하는 한 바이트 번호에 HMAC을 반복해 필요한 바이트를 얻습니다. 두 단계의 세부 정의는 RFC 5869 §2와 대조합니다." />
  <p>방향 분리만 확인하는 별도 실험에서는 SHA-256, 32바이트 0 salt, 입력 0x02, 길이 32를 사용했습니다. info는 방향 문자열 뒤에 <code>|demo-v1|Alice|Bob|p23|g5|A8|B19</code>를 붙인 ASCII입니다(가정). Alice-to-Bob 결과는 <code>a0d369b9…9265e27</code>, Bob-to-Alice 결과는 <code>0e7f6976…fdc6290</code>로 달랐습니다. 이는 교육용 인코딩이며 배포할 통신 규격은 아닙니다.</p>
  <p>같은 Node 환경에서 RFC 5869 부록 A.1의 SHA-256 예도 실행해 PRK와 42바이트 출력이 원문과 일치함을 확인했습니다. 실제 프로토콜은 인증된 대화의 해시와 길이가 명확한 이름표를 사용할 수 있습니다. 그 해시는 기록을 요약할 뿐, 자체로 상대의 서명을 대신하지 않습니다.</p>
  <div id="paper-rfc5869-hkdf"><CitationBlock source="RFC 5869 · §§2–3, 부록 A.1" citeKey={3} href="https://www.rfc-editor.org/rfc/rfc5869.html">추출·확장 순서와 info의 문맥 구분을 확인했습니다. 난수 생성, 상대 인증, 비밀 폐기는 이 함수 밖의 책임입니다.</CitationBlock></div>
 </section>
 <section id="ephemeral-lifecycle" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 과거 대화를 지키려면 임시 비밀을 남기지 않습니다</h2>
  <p>대화마다 새 a·b를 만들고 인증용 장기 서명 키와 분리합니다. 성공하거나 실패한 뒤에는 임시 비밀과 필요가 끝난 공유값을 지웁니다. 이후 장기 서명 키가 유출돼도 과거 임시 비밀을 복원할 수 없다면 녹음해 둔 과거 통신을 그 키 하나로 풀지 못합니다. 이 성질을 전방향 안전성이라고 부릅니다.</p>
  <p>가상머신 스냅샷이나 오류 덤프에 a=6이 남으면 공개된 19와 함께 과거 공유값 2를 다시 계산할 수 있습니다. 난수 상태를 복제한 두 프로세스가 같은 비밀을 만드는 경우도 확인해야 합니다. 세션 재개용 티켓과 저장한 평문은 각각 별도의 보관·폐기 정책이 필요합니다.</p>
  <p>이 설명은 고전 계산 공격을 기준으로 합니다. 충분한 규모의 양자 컴퓨터가 이산로그를 풀 수 있는 상황에는 X25519도 같은 보호를 제공하지 않습니다. <Link to="/cs/crypto/quantum-computing-and-cryptographic-risk">양자 계산과 암호 위험</Link>에서 알고리즘의 가정과 실제 기계의 조건을 구분합니다.</p>
 </section>
 <section id="dh-release-gate" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">13. 정상 벡터와 공격받은 대화를 각각 확인합니다</h2>
  <p>구현을 바꿀 때는 프로토콜·라이브러리 버전, 계산 공간, 역할, 인증 키, 기록 인코딩과 KDF 설정을 함께 고정합니다. 정상 벡터 다음에는 잘못된 길이, 규격별 비정규 입력, 0 공유값, 역할 교환, 약한 알고리즘 유도, 과거 공개값 재전송, 틀린 서명과 열쇠 확인 실패를 검사합니다.</p>
  <p>
            오류를 모두 같은 빈 값으로 삼지 않고 어떤 단계에서 거절했는지 구분해야 합니다. 난수 복제·종료·재시작 뒤에도 비밀 재사용이나 보관이 생기지 않는지 확인하고 교체 전후 성공
            키와 실패 결과가 맞는지 비교한 다음 시간과 메모리를 잽니다. 인증과 키 생성 순서가 정해진 TLS 1.3이나 검토된 Noise 패턴을 사용하면 이 조합을 직접 새로 설계할
            부담을 줄일 수 있습니다.
          </p>
  <div id="paper-nist-80056a"><CitationBlock source="NIST SP 800-56A Rev. 3 · Pair-Wise Key Establishment" citeKey={4} href="https://csrc.nist.gov/pubs/sp/800/56/a/r3/final">유한체·타원곡선 키 합의의 설정·키 검사·확인 절차를 다룹니다. 해당 표준의 승인 범위를 X25519 입력 규칙 전체와 동일시하지 않습니다. 공식 페이지의 2026-01-06 갱신 계획도 확인했으며 사용할 때의 개정 상태를 다시 확인해야 합니다.</CitationBlock></div>
  <ReviewPrompts questions={["공개값 19 대신 10을 받은 Alice와 중간자는 각각 어떤 계산으로 같은 값을 얻을까요? (답: 10절)","같은 공유값 2에서 방향 이름표만 바꾸면 키는 어떻게 달라지고, 왜 이것만으로 보안이 생기지 않을까요? (답: 11절)","대화가 끝난 뒤 비밀 6이 스냅샷에 남아 있으면 공개값 19로 무엇을 다시 계산할 수 있을까요? (답: 12절)"]}/>
 </section>
 </article>; }
