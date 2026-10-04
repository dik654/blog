import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation-block";
import FlowRail from "../../world-systems/FlowRail";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ModernCRTViz from "./viz/ModernCRTViz";

export default function ModernCRTArticle(){return <article className="space-y-14">
 <section id="overview" data-teach-level="S" className="space-y-5"><h2 className="text-2xl font-bold">1. 원래 수를 모르고 세 나머지만 알 때</h2>
  <p>어떤 물건의 개수를 세지 못했고 세 가지 기록만 남았다고 합시다. 세 개씩 묶으면 두 개, 다섯 개씩 묶으면 세 개, 일곱 개씩 묶으면 두 개가 남습니다. 이 기록만으로 원래 개수를 찾을 수 있을까요?</p>
  <p>23개라면 세 조건을 모두 만족합니다. 128개도 만족합니다. 중국인 나머지 정리는 어떤 조건에서 이런 수를 찾을 수 있고 해가 얼마마다 반복되는지 설명합니다. 이 글은 23을 조립한 뒤 RSA의 같은 값 23을 복원하는 원문 절차에 연결합니다.</p><ContentBoundary article="crt" />
 </section>
 <section id="black-box" data-teach-level="B" className="space-y-5"><h2 className="text-2xl font-bold">2. 계산을 나누는 기준과 합치는 규칙이 필요합니다</h2>
  <p>먼저 큰 수를 여러 기준으로 나누어 작은 나머지들을 얻습니다. 작은 값들에서 필요한 계산을 수행한 다음 기준과 나머지를 함께 받아 큰 값 하나로 합칩니다. 마지막으로 합친 값을 다시 나누어 각 기록과 맞는지 확인합니다.</p>
  <p>나머지를 받은 쪽은 전체 수의 범위도 알아야 합니다. 0부터 104 사이에서 찾는다면 답은 23 하나지만 범위 제한이 없으면 23에 105를 계속 더한 수들도 답입니다. 나머지 세 개가 크기에 관한 모든 정보를 보관하는 것은 아닙니다.</p>
 </section>
 <section id="case" data-teach-level="0" className="space-y-5"><h2 className="text-2xl font-bold">3. 23을 세 번 나누어 기록을 확인합니다</h2>
  <p>23=3×7+2, 23=5×4+3, 23=7×3+2입니다. 따라서 나누는 기준 3·5·7과 나머지 2·3·2가 한 묶음입니다. 기준을 지우고 나머지만 2·3·2로 보관하면 무엇으로 나눈 결과인지 알 수 없습니다.</p>
  <p>105는 세 기준 모두의 배수입니다. 그래서 23에 105를 더한 128도 같은 나머지 2·3·2를 남깁니다. 앞으로 답을 0 이상 105 미만으로 고른다는 약속을 사용합니다(가정).</p>
 </section>
 <section id="picture" data-teach-level="1" className="space-y-5"><h2 className="text-2xl font-bold">4. 작은 기록 세 개가 같은 수를 가리킵니다</h2>
  <FlowRail title="23을 나누고 다시 합치는 흐름" steps={[{actor:"나누기",movement:"23을 3·5·7로 각각 나눕니다.",receives:"기준별 나머지 2·3·2"},{actor:"작은 값의 기록",movement:"각 기준과 나머지를 함께 보관합니다.",receives:"(3,2)·(5,3)·(7,2)"},{actor:"다시 합치기",movement:"세 조건을 동시에 만족하는 0~104의 수를 구합니다.",receives:"23을 얻고 다시 나누어 확인"}]} />
  <p>세 계산을 나눌 수 있다는 점은 큰 정수를 다루는 암호 구현에도 쓰입니다. 다만 수학적으로 합쳐진다는 사실과 각각의 계산이 빠르거나 공격에 안전하다는 사실은 따로 확인해야 합니다.</p>
 </section>
 <section id="need" data-teach-level="2" className="space-y-5"><h2 className="text-2xl font-bold">5. 한 기록을 맞추며 다른 두 기록을 건드리지 않으려면</h2>
  <p>첫 조건을 맞추려고 수를 더하면 다른 조건의 나머지도 바뀔 수 있습니다. 예를 들어 2에서 시작하면 3으로 나눈 나머지는 맞지만 5로 나눈 나머지는 3이 아닙니다. 각 조건에만 영향을 주는 값을 만들면 이 간섭을 없앨 수 있습니다.</p>
  <p>3에 관한 조건만 바꾸려면 5와 7의 배수인 35를 이용합니다. 35는 3으로 나누면 2이므로 두 배인 70을 쓰면 나머지 1이 됩니다. 70은 3에 대해서만 1이고 5·7에 대해서는 0인 조절 값입니다.</p>
 </section>
 <section id="names" data-teach-level="3" className="space-y-5"><h2 className="text-2xl font-bold">6. 같은 나머지를 합동이라 부릅니다</h2>
  <p>나누는 양의 기준을 modulus, 남는 값을 residue라고 합니다. x≡2 (mod 3)은 x를 3으로 나누면 2가 남는다는 뜻이며 x−2가 3의 배수라는 뜻과 같습니다. 두 수가 같은 나머지를 가지면 합동이라고 합니다.</p>
  <p>어느 두 기준을 골라도 최대공약수가 1이면 쌍마다 서로소라고 합니다. 3·5·7은 이 조건을 만족합니다. 중국인 나머지 정리, CRT는 이때 모든 나머지 조합에 답이 있고 기준들의 곱을 주기로 답이 하나씩 있음을 보장합니다.</p>
  <p>3을 기준으로 2에 2를 곱하면 4의 나머지 1이 됩니다. 이런 곱셈 상대를 역원이라고 합니다. 앞에서 35의 나머지 2에 역원 2를 곱해 70을 만든 이유입니다. 자기 조건만 남기는 70 같은 값을 여기서는 선택자라고 부릅니다.</p>
 </section>
 <section id="numerical" data-teach-level="4" className="space-y-5"><h2 className="text-2xl font-bold">7. 세 선택자 70·21·15로 23을 조립합니다</h2>
  <p>전체 곱은 M=3×5×7=105입니다. 첫 기준 3을 빼면 35이고 역원 2를 곱해 70을 얻습니다. 5를 빼면 21이며 이미 5로 나눈 나머지가 1입니다. 7을 빼면 15이며 7로 나눈 나머지가 1입니다.</p>
  <p>선택자 70·21·15에 원하는 나머지 2·3·2를 각각 곱해 더합니다. 2×70+3×21+2×15=233이고 105로 나눈 나머지는 23입니다. 3으로 다시 나누면 뒤의 두 항은 사라지고 첫 항에서 2만 남습니다. 다른 두 기준에서도 같은 일이 일어납니다.</p>
  <ExplainedFormula question="자기 나머지만 남기는 값들을 어떻게 합치나요?" idea="다른 기준들의 배수를 만든 뒤 자기 기준에서 나머지가 1이 되도록 역원을 곱합니다. 원하는 나머지를 그 선택자에 곱해 더합니다." formula={String.raw`M=\prod_i m_i,\quad M_i=M/m_i,\quad y_i=M_i^{-1}\pmod{m_i},\quad x=\left(\sum_i a_iM_iy_i\right)\bmod M`} annotatedFormula={String.raw`\begin{aligned}e_1&=\underbrace{35\cdot2}_{\text{3에서만 나머지 1}}=70\\e_2&=\underbrace{21\cdot1}_{\text{5에서만 나머지 1}}=21\\e_3&=\underbrace{15\cdot1}_{\text{7에서만 나머지 1}}=15\\x&=\underbrace{(2e_1+3e_2+2e_3)}_{\text{원하는 나머지를 곱해 합침}}\bmod105\\&=23\end{aligned}`} operations={[{expression:String.raw`M_i=M/m_i`,annotation:["자기 기준을 제외한 곱을 만듭니다.","다른 모든 기준에서는 나머지가 0입니다."]},{expression:String.raw`M_i y_i\equiv1\pmod{m_i}`,annotation:["자기 기준에서만 1이 되도록 역원을 곱합니다.","이를 aᵢ배 하면 원하는 나머지가 됩니다."]}]} terms={[{symbol:"mᵢ",name:"나누는 기준",description:"사례는 3·5·7이며 모든 쌍이 서로소입니다."},{symbol:"aᵢ",name:"원하는 나머지",description:"사례는 기준별로 2·3·2입니다."},{symbol:"M,Mᵢ",name:"전체 곱과 일부 곱",description:"M=105이며 자기 기준을 제외하면 35·21·15입니다."},{symbol:"yᵢ",name:"역원",description:"사례에서는 각 기준에서 2·1·1입니다."},{symbol:"eᵢ",name:"선택자",description:"Mᵢyᵢ로 계산하며 자기 조건에서 1, 다른 조건에서 0입니다."}]} assumptions={["기준은 1보다 큰 정수이며 어느 두 기준도 서로소입니다.","중간 곱과 합은 정확한 정수로 계산한 뒤 0 이상 M 미만으로 줄입니다.","서로소가 아니면 10절의 양립 가능성 확인과 최소공배수 주기가 필요합니다."]} interpretation="각 선택자는 자기 기준에서만 원하는 나머지를 남깁니다. 합친 23을 다시 3·5·7로 나누어 2·3·2가 나오는지 직접 확인할 수 있습니다." />
  <ModernCRTViz />
 </section>
 <section id="uniqueness" data-teach-level="5" className="space-y-5"><h2 className="text-2xl font-bold">8. 답은 왜 105마다 하나씩 반복되나요?</h2>
  <p>7절의 합을 각 기준으로 나누면 원하는 나머지만 남으므로 답이 적어도 하나 존재합니다. 이제 x와 x′가 둘 다 답이라고 합시다. 두 수의 차이는 3·5·7 각각의 배수입니다.</p>
  <p>세 기준은 쌍마다 서로소이므로 차이는 그 곱 105의 배수여야 합니다. 따라서 서로 다른 두 답이 0~104 안에 함께 있을 수 없습니다. 답 전체는 23+105k이며 k는 임의의 정수입니다. 존재를 보이는 계산과 유일성을 보이는 논리는 서로 다른 역할입니다.</p>
  <p>기준이 일반적인 서로소 정수들이어도 같은 증명이 됩니다. 각 선택자가 자기 조건만 통과시켜 존재를 보이고 두 답의 차이가 모든 기준으로 나누어떨어진다는 사실에서 곱의 배수임을 얻습니다.</p>
 </section>
 <section id="crypto-usage" data-teach-level="6" className="space-y-5"><h2 className="text-2xl font-bold">9. RFC 8017은 같은 23을 두 작은 계산으로 복원합니다</h2>
  <p>작은 RSA 예를 p=5, q=7, n=35, 공개 지수 e=5, 비밀 지수 d=5로 잡습니다(가정). e×d=25는 (p−1)(q−1)=24로 나누면 1입니다. 평문을 나타내는 정수 23을 계산하면 c=23⁵ mod 35=18입니다. 복원은 18⁵ mod 35=23입니다. 실제 키로 쓰기에 너무 작은 교육용 수입니다.</p>
  <p>RFC 8017 §5.1.2의 RSADP는 비밀키를 n·d로 받는 방식과 p·q·dP·dQ·qInv로 받는 방식을 제공합니다. 사례에서 dP=5 mod4=1, dQ=5 mod6=5, qInv=7⁻¹ mod5=3입니다. 큰 기준 35에서 한 번 계산하는 대신 기준 5·7의 결과를 합칩니다.</p>
  <AlgorithmBlock title="RFC 8017 §5.1.2, Step 2.b의 두 소수 분기" input={["c=18, p=5, q=7, dP=1, dQ=5, qInv=3"]} steps={[{code:"m1 = c^dP mod p = 18^1 mod 5 = 3",note:"원문 Step 2.b.i의 첫 번째 작은 거듭제곱입니다."},{code:"m2 = c^dQ mod q = 18^5 mod 7 = 2",note:"같은 단계의 두 번째 결과입니다."},{code:"h = (m1 - m2) * qInv mod p = 3",note:"Step 2.b.iii에서 (3−2)×3의 나머지를 구합니다."},{code:"m = m2 + q * h = 2 + 7 * 3 = 23",note:"Step 2.b.iv에서 원래 정수 23을 얻습니다."}]} output="직접 계산 18^5 mod35와 같은 23. 5·7로 나누면 3·2입니다." />
  <ExplainedFormula question="왜 2에 7의 세 배를 더하나요?" idea="7의 배수를 더하면 7에서의 나머지 2는 그대로입니다. 5에서의 나머지만 3이 되도록 더할 횟수 h를 고릅니다." formula={String.raw`h=((m_1-m_2)q_{\mathrm{inv}})\bmod p,\qquad m=m_2+qh`} annotatedFormula={String.raw`\begin{aligned}h&=\underbrace{(3-2)\cdot3}_{\text{5에서의 차이를 보정}}\bmod5=3\\m&=\underbrace{2+7\cdot3}_{\text{7에서의 나머지 2 유지}}=23\end{aligned}`} operations={[{expression:String.raw`q q_{\mathrm{inv}}\equiv1\pmod p`,annotation:["7×3=21은 5로 나누면 1입니다.","q를 곱할 때 원하는 차이를 남길 수 있습니다."]},{expression:String.raw`m_2+qh`,annotation:["q에서의 나머지 m₂는 변하지 않습니다.","p에서는 m₁−m₂만큼 보정됩니다."]}]} terms={[{symbol:"m₁,m₂",name:"작은 기준의 결과",description:"각각 5에서 3, 7에서 2입니다."},{symbol:String.raw`q_{\mathrm{inv}}`,name:"q의 역원",description:"q=7의 mod5 역원은 3입니다."},{symbol:"h",name:"더할 q의 배수",description:"0 이상 p 미만으로 고른 보정량입니다."},{symbol:"m",name:"합친 정수",description:"0 이상 pq 미만의 결과 23입니다."}]} assumptions={["서로 다른 소수와 같은 키에서 나온 유효한 CRT 매개변수를 사용합니다.","원문의 입력 c는 0 이상 n 미만이어야 합니다. 이 사례는 두 소수만 사용하는 분기입니다."]} interpretation="앞의 세 조건 중 5·7의 나머지 3·2를 합쳐도 0~34에서 23이 됩니다. 여기에 3의 나머지까지 더하면 0~104에서 23을 고르는 처음 문제로 돌아갑니다." />
  <p>원문 Step 1은 입력 c가 0부터 n−1 범위를 벗어나면 오류를 내도록 합니다. 이 글에서는 원문의 수학 절차를 정수 계산으로 재현했으며 특정 암호 라이브러리의 RSA 구현이나 부채널 방어를 실행해 검증한 것은 아닙니다.</p>
  <div id="paper-rfc8017-crt"><CitationBlock source="RFC 8017 · PKCS #1 v2.2, §5.1.2" citeKey={1} href="https://www.rfc-editor.org/rfc/rfc8017.html#section-5.1.2">두 소수 분기의 m₁·m₂·h·m을 같은 입력 18과 결과 23에 대응했습니다. 이 절은 기본 수학 연산을 정의하며 실제 암호화·서명 방식은 별도의 인코딩과 검증 절차를 포함합니다.</CitationBlock></div>
 </section>
 <section id="compatibility" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">10. 기준이 서로소가 아니면 답이 없을 수도 있습니다</h2>
  <p>2로 나눈 나머지가 0이고 4로 나눈 나머지가 1인 수는 없습니다. 첫 기록은 짝수를 요구하고 둘째 기록은 홀수를 요구합니다. 두 기준의 최대공약수로 다시 나눴을 때도 나머지 기록이 같아야 함께 만족시킬 수 있습니다.</p>
  <p>반면 6으로 나누면 2, 9로 나누면 5라는 조건은 가능합니다. 최대공약수 3으로 보면 2와 5의 나머지가 모두 2입니다. 첫 조건에서 x=2+6k이고 둘째에 넣으면 6k≡3 (mod 9)입니다. 3으로 나누어 2k≡1 (mod 3), 따라서 k≡2 (mod 3)입니다.</p>
  <p>이를 되돌리면 x=14+18j입니다. 14는 6으로 나누면 2, 9로 나누면 5입니다. 반복 주기는 두 기준의 곱 54가 아니라 최소공배수 18입니다. 일반화된 CRT는 각 쌍의 기록이 최대공약수 기준에서 같은지 확인하고 해가 있으면 최소공배수를 주기로 답을 구합니다.</p>
 </section>
 <section id="fault-boundary" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">11. 한쪽 결과가 3에서 4로 바뀌면 인수 7이 드러납니다</h2>
  <p>첫 계산 m₁만 잘못되어 3 대신 4가 됐다고 합시다. m₂=2는 그대로이면 h=(4−2)×3 mod5=1, 합친 결과는 2+7×1=9입니다. 결과가 0~34 안에 있다는 검사만으로는 오류를 알 수 없습니다.</p>
  <p>공개 지수로 다시 계산하면 9⁵ mod35=4이며 입력 c=18과 다릅니다. 이 잘못된 결과 9와 공개된 18을 아는 공격자는 gcd(4−18,35)=7을 구합니다. 한쪽 기준 7에서는 계산이 맞고 다른 기준 5에서는 틀려서 차이에서 인수 하나가 남은 것입니다.</p>
  <p>따라서 잘못된 재결합 결과를 밖으로 내보내지 않아야 합니다. 공개 연산으로 되확인하는 방어도 검사 자체가 건너뛰어지거나 함께 망가질 수 있는지 확인해야 합니다. 실행 시간과 메모리 접근에서 비밀이 새는 문제는 별도로 다룹니다. 계산을 무작위로 가리는 blinding과 비밀에 따라 실행 경로가 바뀌지 않는 구현도 검토합니다.</p>
  <p>이 반례는 원시 정수 연산에 관한 것입니다. 실전 RSA 암호화에는 OAEP 같은 인코딩 방식이, 서명에는 해당 서명 규격의 인코딩·검증이 필요합니다. 작은 수의 계산이 맞는 것만으로 안전한 암호 제품이 되지는 않습니다.</p>
 </section>
 <section id="release" data-teach-level="7" className="space-y-5"><h2 className="text-2xl font-bold">12. 같은 답·오류 검출·속도는 따로 비교합니다</h2>
  <p>정확성은 각 나머지를 다시 확인하고 직접 계산과 재결합을 비교합니다. 음수를 0 이상 기준 미만으로 바꾸는 처리, 중간 곱의 넘침, 서로소가 아닌 입력, RSA 입력 범위도 시험합니다. 교육용 검산에서는 23·128, 양립 불가능한 조건, 14+18j, 정상 결과 23과 변조 결과 9를 각각 확인했습니다.</p>
  <p>성능은 같은 키 크기·큰 정수 라이브러리·하드웨어·요청 묶음에서 비교해야 합니다. 절반 크기 수 두 개로 계산하면 유리할 수 있지만 곱셈 알고리즘과 거듭제곱 방법, 메모리 접근, blinding과 오류 검산의 비용도 포함됩니다. 항상 정확히 네 배 빠르다는 결론은 나오지 않습니다.</p>
  <p>워밍업 뒤 같은 입력 묶음에서 직접 방식과 CRT 방식을 번갈아 측정하고 중앙값과 느린 구간을 함께 봅니다. 본문은 산술과 오류 반례를 검산했으며 실제 제품의 지연 시간이나 공격 저항성을 측정한 결과를 제시하지 않습니다.</p>
  <ReviewPrompts questions={["23에 105를 더한 128도 같은 나머지를 가지는데 답이 유일하다는 말은 어떤 범위의 주장일까요? (답: 8절)","6·9의 나머지 2·5에서 반복 주기는 왜 54가 아니라 18일까요? (답: 10절)","RSA의 한쪽 결과가 4로 바뀌면 합친 값은 무엇이며 공개 계산으로 어떤 인수를 얻을까요? (답: 11절)"]}/>
 </section>
 </article>;}
