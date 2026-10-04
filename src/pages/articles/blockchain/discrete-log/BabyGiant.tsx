import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import CryptoFoundationsViz from "../crypto-foundations-viz";

export default function BabyGiant() {
  return <div className="space-y-12 [&_section]:space-y-5 [&_p]:leading-8 [&_h2]:text-2xl [&_h2]:font-bold">
    <section id="forward-cost" data-teach-level="5">
      <h2>8. 만드는 쪽은 반복 횟수의 자릿수만 따라갈 수 있습니다</h2>
      <p>비밀 지수 5를 아는 사람은 3을 다섯 번 곱하지 않아도 됩니다. 5=4+1이므로 3²=9, 3⁴=13을 차례로 계산한 뒤 13×3 mod 17=5를 얻습니다. 제곱을 반복해 필요한 자릿수만 곱하면 됩니다. 다만 실제 비밀을 다루는 구현은 지수의 비트에 따라 처리 시간이나 메모리 접근이 달라지지 않게 만들어야 합니다.</p>
      <ExplainedFormula question="왜 지수의 크기보다 이진수 자릿수가 정방향 비용을 정할까요?" idea="x를 2의 거듭제곱들의 합으로 나누면 g의 연속된 제곱을 한 번씩 만들고 필요한 항만 곱할 수 있습니다." formula={String.raw`x=\sum_{i=0}^{\ell-1}b_i2^i\quad\Rightarrow\quad g^x=\prod_{i:b_i=1}g^{2^i}`} annotatedFormula={String.raw`x=\underbrace{\sum_{i=0}^{\ell-1}b_i2^i}_{\text{지수를 이진수로 분해}}\quad\Rightarrow\quad g^x=\underbrace{\prod_{i:b_i=1}g^{2^i}}_{\text{필요한 제곱만 곱함}}`} operations={[{expression:String.raw`\sum_{i=0}^{\ell-1}b_i2^i`,annotation:["지수의 각 자릿수가 기여하는 반복 횟수를 더합니다."]},{expression:String.raw`\prod_{i:b_i=1}g^{2^i}`,annotation:["1인 자릿수에 해당하는 값을 곱해 같은 결과를 만듭니다."]}]} terms={[{symbol:"bᵢ",name:"이진수 자릿값",description:"0 또는 1입니다."},{symbol:"ℓ",name:"지수의 비트 길이",description:"x가 양수일 때 floor(log₂x)+1입니다."},{symbol:"g^(2^i)",name:"연속 제곱",description:"직전 값을 제곱해 다음 값을 만듭니다."}]} assumptions={["군 연산과 같은 원소인지 비교하는 연산이 정확합니다.","비밀 지수 구현에서는 부채널 방어를 별도로 검토합니다."]} interpretation="같은 예의 x=5=101₂에서는 g와 g⁴만 곱합니다. x=13=1101₂라면 g·g⁴·g⁸입니다. 계산이 빠르다는 사실만으로 역방향의 어려움이 증명되지는 않습니다." />
      <CitationBlock source="Handbook of Applied Cryptography §3.6, pp.103–105" href="https://cacr.uwaterloo.ca/hac/about/chap3.pdf" citeKey={3}><p>이산로그의 원문 관계는 β=αˣ입니다. 여기서 α=3, β=5, x=5를 대입하면 3⁵ mod 17=5가 됩니다. 위의 이진수 분해는 같은 관계를 빠르게 계산하는 항등식입니다. 원문의 표기 α·β와 이 글의 g·Y는 각각 같은 역할입니다.</p></CitationBlock>
      <p>정방향 계산에서는 이미 아는 x의 자릿수를 사용했습니다. 공격자는 그 자릿수를 모르므로 다른 방식으로 후보를 줄여야 합니다.</p>
    </section>
    <section id="baby-giant" data-teach-level="6">
      <h2>9. 네 칸짜리 표와 네 칸씩의 이동을 서로 만나게 합니다</h2>
      <p>후보 16개를 줄줄이 시험하는 대신 지수 x를 4i+j로 나눕니다. 먼저 j=0,1,2,3에 해당하는 1,3,9,10을 저장합니다. 다음에는 Y=5에서 네 번의 곱셈을 한꺼번에 되돌리면서 저장한 값과 만나는지 봅니다. 저장 공간을 써 탐색 시간을 줄이는 방법입니다.</p>
      <CryptoFoundationsViz mode="bsgs-grid" />
      <ExplainedFormula question="중간에서 같은 값을 만나면 왜 숨은 지수를 복원할까요?" idea="Y=gˣ에서 x=im+j를 대입하고 양쪽에 g의 −im 제곱을 곱하면 비교할 값 gʲ가 남습니다." formula={String.raw`m=\lceil\sqrt q\rceil,\quad Y(g^{-m})^i=g^j\quad\Rightarrow\quad x=im+j\pmod q`} annotatedFormula={String.raw`m=\underbrace{\lceil\sqrt q\rceil}_{\text{두 탐색 폭을 맞춤}},\quad \underbrace{Y(g^{-m})^i}_{\text{큰 걸음으로 되돌림}}=\underbrace{g^j}_{\text{저장한 작은 걸음}}\quad\Rightarrow\quad x=im+j\pmod q`} operations={[{expression:String.raw`\lceil\sqrt q\rceil`,annotation:["표의 크기와 큰 걸음 횟수를 비슷하게 맞춥니다."]},{expression:String.raw`Y(g^{-m})^i`,annotation:["공개 값에서 m번의 곱셈씩 되돌립니다."]},{expression:String.raw`g^j`,annotation:["작은 걸음 표에 미리 저장한 값과 비교합니다."]}]} terms={[{symbol:"q",name:"부분군 위수",description:"지수 후보 수이며 이 예에서는 16입니다."},{symbol:"m",name:"분할 폭",description:"ceil(√q)이며 이 예에서는 4입니다."},{symbol:"i, j",name:"큰 걸음과 작은 걸음",description:"만난 두 위치에서 원래 지수를 재구성합니다."}]} assumptions={["Y는 g가 생성하는 알려진 위수 q의 부분군에 있습니다.","역원과 동등성 검사가 정확하고 표의 키가 같은 원소를 같은 표현으로 나타냅니다."]} interpretation="g⁴=13이고 13·4≡1 mod 17이므로 g⁻⁴=4입니다. 5·4≡3은 표의 j=1과 만납니다. 큰 걸음 i=1이므로 x=1·4+1=5입니다." />
      <CitationBlock source="Handbook of Applied Cryptography, Algorithm 3.56, p.105" href="https://cacr.uwaterloo.ca/hac/about/chap3.pdf" citeKey={3}><p>원문 4.2의 판정은 “If γ = αʲ then return(x = im + j).”입니다. 여기서 γ=3, α=3, j=1, i=1, m=4를 넣으면 x=5를 반환합니다. 이 발췌의 기호를 이 글의 예에 대응시켰으며 실제 암호 라이브러리 실행 로그는 아닙니다.</p></CitationBlock>
      <AlgorithmBlock title="Baby-step giant-step (의사코드)" input={["g=3, Y=5, q=16, 연산은 mod 17 (가정)"]} steps={[{code:"m ← ceil(sqrt(q))"},{code:"j=0…m−1마다 table[g^j] ← j를 저장한다"},{code:"factor ← inverse(g^m); current ← Y"},{code:"i=0…m−1에 대해 순서대로 반복한다"},{code:"current가 table에 있으면 x ← i·m + table[current]",note:"x<q이며 g^x=Y인지 확인한 뒤 반환합니다."},{code:"일치하지 않으면 current ← current·factor"}]} output="x=5. 모든 후보를 확인해도 만나지 못하면 입력·부분군 전제를 다시 검사합니다." />
      <p>작은 걸음을 저장하고 큰 걸음으로 이동한다는 뜻에서 Baby-step giant-step이라고 부릅니다. 표와 탐색에 각각 대략 √q 규모가 필요합니다. q=16에서는 작지만 q가 약 2²⁵⁶이면 이 규모만 약 2¹²⁸입니다. 이는 연산 수의 규모이지 실제 초 단위 시간이나 모든 군의 최선 공격 비용을 정한 값은 아닙니다.</p>
      <div id="paper-shanks-bsgs"><CitationBlock source="Shanks (1971) · Class number, a theory of factorization, and genera" href="https://www.ams.org/books/pspum/020/" citeKey={2}><p>중간에서 만나는 방법의 역사적 출처입니다. 위의 단계는 저자가 공개한 Handbook의 Algorithm 3.56에서 확인했습니다. 이 문헌 연결을 현대 구현의 상수 비용이나 특정 곡선의 보안 강도 측정으로 쓰지 않습니다.</p></CitationBlock></div>
      <p>같은 x=5를 실제로 복원했으므로 공격의 원리와 비용을 분리해 볼 수 있습니다. 마지막에는 이 계산이 설명하지 못하는 다른 공격과 프로토콜 조건을 살펴봅니다.</p>
    </section>
  </div>;
}
