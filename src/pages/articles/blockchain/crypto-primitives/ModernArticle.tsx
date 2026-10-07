import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import ReceiptProofViz from "./viz/ReceiptProofViz";
import { codeRefs, fileTrees, projectMetas } from "./codeRefs";
const RFC="https://www.rfc-editor.org/rfc/rfc8032.html";
const TREE="https://www.rfc-editor.org/rfc/rfc9162.html#section-2.1";
const POSEIDON="https://www.usenix.org/system/files/sec21-grassi.pdf";
const BIP="https://bips.dev/340/";
export default function ModernArticle(){const sidebar=useCodeSidebar();return <div className="space-y-16 [overflow-wrap:anywhere]">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 영수증 한 장이 승인된 묶음에 들어 있는지 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한 가게가 A의 금액 40, B의 70, C의 20, D의 90이라는 네 기록을 한 묶음으로 승인했다고 합시다. C는 다른 사람의 기록 전체를 받지 않고 자신의 금액 20이 이 묶음에 들어 있는지 확인하려 합니다. 검증자는 가게의 공개키를 미리 등록했고 이번에 받아야 할 배치 번호가 1이라는 사실도 알고 있습니다.</p>
<p className="leading-8">검증에는 두 질문이 있습니다. 받은 기록으로 다시 계산한 요약값이 승인된 묶음의 요약값과 같은가, 그리고 그 요약값을 등록된 가게 키가 승인했는가입니다. 첫 질문에는 기록에서 맨 위까지 이어지는 해시 경로를 쓰고 둘째 질문에는 전자서명을 씁니다.</p>
<p className="leading-8">두 검사를 통과해도 실제로 상품을 샀다는 사실까지 자동으로 입증되지는 않습니다. 가게가 처음부터 잘못 기록했을 수 있고 등록한 공개키가 엉뚱한 사람의 것일 수도 있습니다. 어떤 도구가 어느 질문까지 답하는지 같은 영수증을 따라 확인하겠습니다.</p>
</div></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 기록·경로·서명이 들어오고 두 판정이 나옵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">보내는 쪽은 네 기록을 각각 해시한 뒤 두 개씩 묶어 다시 해시합니다. 마지막 하나가 루트입니다. 가게는 용도 이름과 배치 번호와 루트를 이어 서명합니다. C에게는 자신의 기록, D의 해시, AB 가지의 해시와 이 서명을 줍니다.</p>
<p className="leading-8">받는 쪽은 C에서 출발해 두 형제 해시를 차례로 합칩니다. 이렇게 얻은 루트를 메시지에 넣어 서명식을 확인합니다. 마지막에는 서명에 사용한 공개키가 등록된 키인지, 메시지의 용도와 배치가 기대한 값인지 비교합니다. 어느 단계에서 실패했는지를 나눠 두면 잘못된 경로와 잘못된 승인을 구별할 수 있습니다.</p>
<p className="leading-8">여기서 해시는 입력을 고정 길이 값으로 바꾸는 공개 계산입니다. 계산법이나 입력을 아는 사람이 중간 상태를 몰라야 하는 구조는 아닙니다. 비밀이 필요한 서명 쪽에서는 개인키를 따로 관리합니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. C의 20은 정확히 다섯 바이트입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이 글의 영수증 형식을 계정의 ASCII 한 바이트와 금액의 부호 없는 4바이트 정수로 정하겠습니다. 금액은 큰 자리부터 적습니다. A40은 4100000028, B70은 4200000046, C20은 4300000014, D90은 440000005a입니다. 숫자 20을 문자열 “20”으로 적으면 다른 바이트가 됩니다.</p>
<p className="leading-8">기록 앞에는 00 한 바이트를 붙여 SHA-256을 계산합니다. 중간 가지는 01 한 바이트 뒤에 왼쪽과 오른쪽의 32바이트 해시를 붙입니다. 이 태그는 기록과 두 자식의 결합을 서로 다른 종류의 입력으로 구별합니다. 해시를 계산할 때 16진수 글자 자체를 이어 붙이는 것이 아니라 그 글자가 나타내는 바이트를 사용합니다.</p>
<p className="leading-8">서명할 메시지는 ASCII receipts-v1의 11바이트, 배치 번호 1의 00000001 네 바이트, 루트 32바이트입니다. 합계는 47바이트입니다. 이 길이와 순서를 고정했으므로 서로 다른 필드 묶음을 같은 바이트열로 잘못 읽는 일을 피할 수 있습니다.</p>
</div><CodeViewButton label="실제로 실행한 영수증 인코딩" onClick={()=>sidebar.open("receipt",codeRefs["receipt"])}/></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. C에서 루트까지 같은 기록을 따라갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">아래 그림은 C의 기록을 해시하고 D의 해시를 오른쪽에 붙인 다음 AB의 해시를 왼쪽에 붙이는 순서입니다. 현재 값이 왼쪽인지 오른쪽인지에 따라 입력 순서가 달라집니다. 그림의 짧은 해시 표시는 읽기 위한 생략이며 실제 계산은 32바이트 전체를 사용합니다.</p>
</div><ReceiptProofViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 전체를 보내지 않고도 같은 묶음인지 확인하는 이유</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한 장의 기록을 확인하는 데 나머지 세 장의 내용은 필요하지 않습니다. D의 해시와 AB 전체를 대표하는 해시만 있으면 같은 루트에 도착할 수 있습니다. 기록 수가 2의 거듭제곱이고 균형 잡힌 이진 트리라면 필요한 형제 수는 높이와 같습니다.</p>
<p className="leading-8">이번 네 장에서는 형제 두 개, 즉 64바이트가 필요합니다. C의 잎 해시 한 번과 중간 해시 두 번을 계산합니다. 서명 검사는 이 세 번에 포함하지 않습니다. 루트를 매번 신뢰할 수 있게 받아야 하므로 경로를 짧게 만드는 일과 루트의 출처를 확인하는 일을 함께 설계해야 합니다.</p>
<p className="leading-8">해시 충돌을 만들기 어렵다는 가정이 없다면 다른 기록으로 같은 루트를 만들 수 있습니다. 반대로 안전한 해시를 써도 공격자가 자기 루트를 마음대로 제시하게 두면 원래 묶음에 포함되었다는 증거가 되지 않습니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 지금 본 도구와 성질에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">작은 도구 단위를 암호 프리미티브라고 부릅니다. 트리의 맨 아래 값은 잎, 맨 위 요약은 루트이며 같은 루트를 다시 만드는 형제 목록은 Merkle 포함 증명입니다. 전체 기록을 공개하지 않고 일부 기록을 여는 역할을 합니다.</p>
<p className="leading-8">한 번 정한 값에서 다른 값으로 바꾸어 열기 어렵다는 성질은 binding입니다. 공개된 결과만 보고 원래 값을 알아내기 어렵다는 성질은 hiding입니다. 두 성질은 다릅니다. 아래에서 값 20을 숨기지 못하는 실제 해시 예와 두 성질이 갈리는 작은 약정 예를 보겠습니다.</p>
<p className="leading-8">개인키로 메시지에 대한 응답을 만들고 공개키로 확인하는 것은 서명입니다. Schnorr는 이 응답의 대수적 구조를 보여 주고 Ed25519는 곡선·해시·바이트 형식 등을 정한 구체적인 서명 방식입니다. Poseidon은 같은 트리를 증명 회로 안에서 계산할 때 관심을 갖게 되는 해시 설계입니다.</p>
</div></section>
<section id="predictions" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 계산 전에 세 결과를 예상해 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">공개된 C의 해시와 금액 후보 0부터 99만으로 금액을 찾을 수 있을까요? 같은 서명용 임시값으로 두 배치에 응답하면 개인값은 어떻게 될까요? 정확한 길이와 서명식을 만족한 입력은 언제 등록된 가게의 승인으로 받아들일 수 있을까요? 먼저 예상한 뒤 아래 계산과 비교하고 마지막 질문에서 다시 확인해 보세요.</p>
</div></section>
<section id="merkle-commitment" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. C의 경로를 실제 해시와 표준의 규칙에 대입합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">C의 잎은 cef26f74…로 시작합니다. 오른쪽 D의 해시 ecdd654a…를 붙여 얻은 CD는 2d8c8b6a…입니다. 다음에는 AB의 해시 5221fd40…를 앞에 붙입니다. 최종 루트 전체는 <code>24239f9760532472a8a9be49f76a9fe959ac9b42e17ad3bd8c9a0893f4442002</code>입니다.</p>
<p className="leading-8">C의 인덱스를 0부터 세면 2이고 이진수는 10입니다. 아래에서 위로 읽는 비트는 0 다음 1입니다. 첫 0에서는 현재 해시를 앞에 놓고 다음 1에서는 뒤에 놓습니다. 보존한 Python 실행에서 마지막 순서를 뒤집으면 다른 루트가 나옴을 확인했습니다.</p>
<p className="leading-8">RFC 9162의 2.1절은 잎에 00, 내부 노드에 01을 붙이는 정의와 포함 경로의 좌우 결합을 명시합니다. 일반적인 잎 수에서는 트리 크기도 필요하고 경로 길이와 인덱스를 검사합니다. 이번 4개 사례의 비트 규칙을 임의의 불균형 트리에 그대로 적용하지 않습니다.</p>
<p className="leading-8">깊이가 256인 이진 경로에서 모든 형제 해시를 32바이트씩 보낸다면 256×32=8192바이트입니다. 기본값을 압축하는 형식에서는 전송량이 달라집니다. 이 계산은 원시 형제 데이터만 세며 기록·인덱스·서명·인코딩의 부가 정보는 제외합니다.</p>
</div><CodeViewButton label="같은 C 경로와 잘못된 좌우 검사" onClick={()=>sidebar.open("merkle",codeRefs["merkle"])}/><CitationBlock source="RFC 9162 · 2.1.1, 2.1.3절" href={TREE} citeKey={1}>잎과 내부 노드의 태그 및 경로 규칙을 적용했습니다. 이 글의 영수증 형식은 Certificate Transparency의 실제 전송 형식이 아닙니다.</CitationBlock></section>
<section id="hiding" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 해시가 같음을 확인해도 금액이 숨겨지지는 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">C의 계정이 알려져 있고 금액 후보가 0부터 99라면 후보 100개를 같은 형식으로 인코딩하고 해시할 수 있습니다. 실제로 이 100개를 계산하면 공개된 C의 잎과 일치하는 후보는 20 하나입니다. SHA-256의 전체 입력 공간을 뒤진 것이 아니라 작은 후보 목록을 검사한 것입니다.</p>
<p className="leading-8">이것이 7절 첫 질문의 답입니다. 다른 값으로 같은 해시를 만들기 어렵다는 성질과 작은 값의 후보를 알아맞히기 어렵다는 성질은 같지 않습니다. 영수증을 숨겨야 한다면 공개할 데이터와 충분히 예측하기 어려운 무작위 값을 어떻게 결합할지 별도의 방식과 보안 가정을 정해야 합니다.</p>
<p className="leading-8">무작위 값을 붙이는 해시 약정에서도 길이·순서·태그를 고정하고 열 때 같은 값을 제공해야 합니다. 짧거나 반복되는 무작위 값은 후보 검사를 충분히 막지 못할 수 있습니다. “해시했다”는 문장만으로 기밀성을 부여할 수 없습니다.</p>
</div></section>
<section id="pedersen" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 값을 숨기는 것과 바꾸지 못하게 하는 것이 갈리는 예</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">위수가 19인 작은 점 G를 쓰고 H=2G라고 공개했다고 합시다. 값 v와 무작위 값 r로 C=vG+rH를 만듭니다. v=3, r=4라면 C=11G입니다. 그런데 v=5, r=3도 11G입니다. 한 결과를 다른 값으로 열 수 있으므로 binding이 깨졌습니다.</p>
<p className="leading-8">그런데 고정된 v마다 r을 0부터 18까지 균등하게 고르면 v+2r은 19개의 나머지를 한 번씩 모두 지납니다. C의 분포는 v와 무관하게 균등합니다. 따라서 이 모형에서는 H와 G의 관계를 알더라도 한 약정의 완전한 hiding은 유지됩니다. 두 성질을 하나로 묶어 판단하면 이 차이를 놓칩니다.</p>
<p className="leading-8">실제 Pedersen 약정의 binding에는 충분히 큰 소수 위수 군에서 G와 H 사이의 이산로그를 아무도 알지 못한다는 등의 가정이 필요합니다. 같은 r을 두 약정에 재사용하면 차이 C₁−C₂=(v₁−v₂)G가 남아 두 값의 관계가 드러납니다. 각각의 한 값 분포와 여러 약정의 공동 정보도 구별해야 합니다.</p>
</div><ExplainedFormula question="같은 결과를 두 값으로 열 수 있나요?" idea="H=2G라는 관계를 알면 r의 변화로 v의 변화를 상쇄할 수 있습니다." formula={String.raw`C=vG+rH`} annotatedFormula={String.raw`\begin{aligned}C&=vG+rH\\H&=2G\\3G+4H&=11G\\5G+3H&=11G\end{aligned}`} operations={[{expression:"3+2×4=11",annotation:"처음 여는 값은 3과 4입니다."},{expression:"5+2×3=11",annotation:"다른 값 5와 3도 같은 점에 도착합니다."}]} terms={[{symbol:"G,H",name:"군의 점",description:"이 작은 예에서는 H=2G가 알려져 있습니다."},{symbol:"v,r",name:"값과 무작위 스칼라",description:"19로 나눈 나머지로 취급합니다."}]} assumptions={["위수가 19인 작은 군은 설명용이며 안전하지 않습니다.","hiding의 분포 논증은 r을 독립적으로 균등하게 고를 때입니다."]} interpretation="binding 실패와 한 약정의 hiding 유지가 동시에 가능합니다."/></section>
<section id="absence" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 빈 칸을 증명하려면 빈 값의 뜻부터 정해야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이번 네 위치를 계정 A·B·C·D에 고정한 지도라고 바꾸어 생각해 봅시다. C가 없을 때의 잎을 SHA-256(02)로 따로 정하고 같은 위치에서 경로를 계산합니다. C가 존재하면서 금액이 0인 기록은 SHA-256(00 || 4300000000)입니다. 보존한 실행에서 두 경우의 루트는 다릅니다.</p>
<p className="leading-8">빈 잎과 값 0을 같은 것으로 처리하면 “없다”와 “있지만 0이다”를 구별할 수 없습니다. 큰 sparse Merkle tree에서는 키의 어느 비트를 어느 높이에 쓰는지, 빈 하위 트리의 높이별 해시, 키 충돌 시 저장 규칙과 정확한 인코딩도 정해야 합니다.</p>
<p className="leading-8">이 부재 증명도 기대한 루트에 대한 주장입니다. 예전 배치의 빈 칸을 보여 주는 것은 지금도 비어 있다는 증거가 아닙니다. 여기의 작은 빈 태그 예는 고정한 네 칸 모형이며 RFC 9162가 sparse map을 그렇게 정의한다는 뜻은 아닙니다.</p>
</div></section>
<section id="poseidon" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 증명 회로에서는 해시의 안쪽 계산 비용이 달라집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">영수증 경로를 영지식 증명 안에서 확인하려면 해시 계산 자체를 회로의 연산으로 표현해야 합니다. 비트 연산을 체의 덧셈·곱셈으로 풀어 쓰면 비용이 커질 수 있습니다. Poseidon은 이런 환경에서 체의 원소를 직접 섞는 연산을 사용합니다. 지금까지 얻은 SHA-256 루트를 Poseidon의 결과라고 바꾸어 부를 수는 없습니다.</p>
<p className="leading-8">안쪽 연산을 보기 위해 별도의 작은 두 칸 모형을 만들겠습니다. 17로 나눈 나머지에서 입력 (3,4)에 상수 (1,2)를 더하면 (4,6)입니다. 두 칸을 모두 세제곱하면 (13,12)입니다. 행렬의 첫 줄을 (1,2), 둘째 줄을 (3,4)로 두어 섞으면 (3,2)가 됩니다.</p>
<p className="leading-8">같은 (4,6)에서 첫 칸만 세제곱하면 (13,6)이고 같은 행렬을 곱한 결과는 (8,12)입니다. 모든 칸에 비선형 연산을 쓰는 full round와 한 칸에만 쓰는 partial round의 차이를 이 숫자로 볼 수 있습니다. 부분 라운드에서도 뒤의 선형 혼합은 두 칸에 적용합니다.</p>
<p className="leading-8">이 모형의 세제곱은 gcd(3,16)=1이므로 체 전체에서 순열입니다. 행렬의 행렬식은 −2≡15로 0이 아니며 모든 1×1 성분도 0이 아니어서 2×2 MDS 조건을 만족합니다. 실제로 289개 입력을 전부 계산해 두 모형 모두 289개 서로 다른 출력임을 확인했습니다. 그러나 이것은 보안성 검사가 아닙니다. 논문은 MDS인 것만으로 충분하지 않아 추가적인 구조적 공격 조건을 검사합니다.</p>
</div><CodeViewButton label="두 작은 라운드와 289개 입력 전수 계산" onClick={()=>sidebar.open("round",codeRefs["round"])}/><CitationBlock source="Poseidon · USENIX Security 2021, 2.2–2.3절" href={POSEIDON} citeKey={2}>상수 더하기·비선형 층·혼합의 역할을 읽고 설명용 F₁₇ 모형으로 대입했습니다. 이 모형의 상수·행렬·라운드 수는 실제 Poseidon 매개변수가 아닙니다.</CitationBlock></section>
<section id="capacity" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 일부 출력을 버리는 것과 비밀을 숨기는 것은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">두 칸을 모두 내보내는 순열은 입력을 되찾을 수 있습니다. 그런데 위 모형에서 첫 칸만 내보내면 289개 상태가 17개 출력으로 모이고 출력마다 입력이 17개씩 대응합니다. 상태 전체의 가역성과 일부만 출력하는 해시의 압축을 구별해야 합니다.</p>
<p className="leading-8">스펀지에서 입력을 받아들이는 부분은 입력 영역(rate)입니다. 나머지는 보호 영역(capacity)입니다. 공개 해시의 capacity는 개인키처럼 비밀인 공간을 뜻하지 않습니다. 입력과 초기값과 순열을 알면 내부 전체를 계산할 수 있습니다. 숨겨지는 값의 의미와 직접 입출력하지 않는 좌표의 역할을 섞지 않습니다.</p>
<p className="leading-8">이상적인 순열을 가정한 일반적인 용량 경계와 출력의 생일 충돌 경계를 함께 보면, capacity가 c개의 체 원소이고 출력이 n비트일 때 충돌 안전성의 비트 수는 대략 min(c log₂p,n)/2를 넘겨 기대하지 않습니다. 이것은 특정 라운드 수의 Poseidon이 그 안전성을 달성한다는 증명이 아닙니다. 체·너비·상수·행렬·라운드·패딩·용도 구분까지 분석된 인스턴스와 맞아야 합니다.</p>
<p className="leading-8">x⁵은 x², x⁴, x⁵ 순서로 세 번의 체 곱셈으로 계산할 수 있습니다. 너비 t, 전체 라운드 수 R_F, 부분 라운드 수 R_P라면 이 단순 계산법의 비선형 곱셈 수는 3(tR_F+R_P)입니다. 선형 혼합·입력 흡수·여러 순열 호출과 증명 체계의 제약식 비용은 별도로 셉니다. 같은 곱셈 수라고 라운드를 합쳐도 안전성이 유지된다는 뜻은 아니며 CPU 실행 시간도 이 수만으로 결정되지 않습니다.</p>
</div></section>
<section id="schnorr" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 서명 응답이 왜 개인값과 연결되는지 작은 수로 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">다시 47바이트 영수증 메시지로 돌아옵니다. 서명의 식을 손으로 확인하기 위해 23으로 나누는 곱셈 군에서 G=2를 쓰겠습니다. 2의 위수는 11입니다. 개인값 x=3의 공개값은 P=2³=8이고 임시값 k=7에서 R=2⁷=13입니다. 이 작은 군은 안전하지 않으며 실제 Ed25519나 BIP 340의 곡선이 아닙니다.</p>
<p className="leading-8">질문값 e는 ASCII toy-schnorr-v1, R의 한 바이트 0d, P의 한 바이트 08, 같은 47바이트 메시지를 이어 SHA-256으로 정합니다. 결과를 큰 자리부터 정수로 읽고 11로 나누면 e=9입니다. 응답 s=(k+ex) mod 11은 (7+9×3) mod 11=1입니다.</p>
<p className="leading-8">받는 쪽은 2ˢ와 R·Pᵉ를 23으로 나누어 비교합니다. 이번에는 양쪽 모두 2입니다. 오른쪽은 2ᵏ·(2ˣ)ᵉ=2ᵏ⁺ᵉˣ이므로 응답과 맞습니다. 임시값을 먼저 고정하고 메시지·공개값과 함께 해시해 질문을 만드는 방식이 Fiat–Shamir 구조에 해당합니다.</p>
<p className="leading-8">타원곡선의 덧셈 표기로 옮기면 R=kG, P=xG, sG=R+eP입니다. 지수나 스칼라의 나머지는 군의 위수로 계산하고 곱셈 군 원소나 점 좌표의 계산과 구별합니다. 같은 메시지에서 직접 나온 e=9를 사용해야 하며 검증자가 편한 질문값을 선택하는 과정이 아닙니다.</p>
</div><CodeViewButton label="같은 47바이트에서 질문과 응답 계산" onClick={()=>sidebar.open("schnorr",codeRefs["schnorr"])}/></section>
<section id="nonce" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 임시값을 반복하면 두 응답에서 개인값이 나옵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">루트를 그대로 두고 배치 번호만 2로 바꾸겠습니다. 같은 R=13을 재사용하면 새 메시지의 해시 질문은 e₂=5입니다. 응답은 s₂=(7+5×3) mod 11=0입니다. 0이라는 응답 자체가 이 모형에서 금지된 것은 아닙니다. 두 번째 검증식도 양쪽이 1로 맞습니다.</p>
<p className="leading-8">두 응답을 빼면 임시값 k가 사라집니다. s₁−s₂=(e₁−e₂)x mod 11이고 여기서는 1=4x입니다. 4의 역원은 3이므로 x=3을 복원합니다. 이것이 7절 두 번째 질문의 답입니다. 실제 실행에서는 메시지를 바꾼 뒤 옛 응답 s₁=1을 그대로 붙이면 검증이 실패하는 것도 확인했습니다.</p>
<p className="leading-8">이 추출에는 같은 개인키와 같은 임시값, 서로 다른 질문값, 그 차이의 역원이 있다는 조건이 필요합니다. 안전한 크기의 군이어도 이 조건으로 임시값이 재사용되면 위험합니다. 한 번의 숫자 추출을 모든 서명 변형이나 서로 다른 키의 응답에 그대로 적용하지 않습니다.</p>
</div><ExplainedFormula question="두 응답만으로 무엇이 사라지나요?" idea="같은 임시값 k를 빼면 개인값 x가 들어간 일차식만 남습니다." formula={String.raw`x=(s_1-s_2)(e_1-e_2)^{-1}\pmod q`} annotatedFormula={String.raw`\begin{aligned}x&=(s_1-s_2)\\&\quad\cdot(e_1-e_2)^{-1}\pmod q\\q&=11\\x&=(1-0)\cdot4^{-1}\\&=1\cdot3=3\pmod{11}\end{aligned}`} operations={[{expression:"e₁−e₂=4",annotation:"질문 차이는 11에서 0이 아닙니다."},{expression:"4×3≡1 mod 11",annotation:"역원 3을 곱해 개인값을 얻습니다."}]} terms={[{symbol:"q",name:"군의 위수",description:"이 사례는 11이며 바탕 체 23과 다릅니다."},{symbol:"s₁,s₂",name:"같은 임시값의 두 응답",description:"메시지는 배치 번호가 1과 2로 다릅니다."}]} assumptions={["동일한 개인키와 임시값을 사용한 두 응답입니다.","e₁−e₂가 q에서 역원을 가져야 합니다."]} interpretation="임시값 관리 실패는 어려운 이산로그 문제를 일차식으로 바꿀 수 있습니다."/></section>
<section id="bip340" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 비슷한 식을 쓴다고 같은 서명 규격은 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">BIP 340은 secp256k1 위에서 Schnorr 서명을 구체화합니다. 공개키와 R은 x좌표를 중심으로 인코딩하며 짝수 y를 선택하는 규칙을 사용합니다. 실제 검증은 R=sG−eP를 구하고 항등원이 아닌지, y가 짝수인지, x가 서명의 r과 같은지 확인합니다. r은 바탕 체 범위, s는 스칼라 위수 범위로 검사합니다.</p>
<p className="leading-8">질문 해시는 R·공개키·메시지를 포함합니다. BIP의 tagged hash는 태그의 SHA-256 결과를 두 번 앞에 붙이는 형식이며 앞 절의 짧은 toy 태그를 그대로 쓰는 방식과 다릅니다. 개인값과 임시값의 부호 정규화, 보조 입력을 섞는 nonce 생성도 정확한 규칙의 일부입니다.</p>
<p className="leading-8">읽은 현행 BIP는 다양한 메시지 길이를 허용하지만 호출자가 메시지의 용도와 직렬화를 정해야 합니다. 이 글에서는 BIP 참조 구현을 실행하지 않았습니다. 작은 모형의 e=9나 RFC의 Ed25519 서명 바이트를 BIP 340 결과라고 주장하지 않습니다. 특히 단일 서명의 결정적 nonce 방식을 여러 참여자가 함께 서명하는 프로토콜에 그대로 옮기면 안 됩니다.</p>
</div><CitationBlock source="BIP 340 · Default Signing, Verification, Applications" href={BIP} citeKey={3}>공개키를 포함한 질문·x좌표 인코딩·부호 규칙을 작은 모형과 대조했습니다.</CitationBlock></section>
<section id="ed25519" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 실제 RFC 코드에 같은 영수증 메시지를 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">RFC 8032의 6절 Python 예제는 순수 Ed25519를 구현합니다. 32바이트 seed를 SHA-512로 64바이트로 늘린 뒤 앞 절반의 비트를 정해진 방식으로 다듬어 비밀 스칼라 a를 만들고 뒤 절반을 비밀 prefix로 둡니다. aG를 점 인코딩한 32바이트가 공개키입니다.</p>
<p className="leading-8">실행에는 RFC 7.1절 TEST 1의 공개된 seed 9d61b19d…를 사용했습니다. 이 값은 누구나 아는 시험 데이터입니다. 먼저 빈 메시지의 공개키 d75a9801…와 서명 e5564300…가 원문 벡터와 바이트 단위로 같은지 확인했습니다. 그 다음 영수증의 같은 47바이트 메시지를 넣었습니다.</p>
<p className="leading-8">원문의 sign은 prefix와 메시지의 SHA-512를 작은 자리부터 정수로 읽고 군 위수로 나눈 r을 만듭니다. R=rG를 인코딩한 뒤 R·공개키·메시지를 다시 해시해 h를 구하고 S=(r+ha) mod q를 계산합니다. 출력은 R의 32바이트와 S의 little-endian 32바이트를 합친 64바이트입니다.</p>
<p className="leading-8">같은 영수증에서 R의 바이트는 <code>05444fd3690d5fbb20ee936c3c1777b979f7753d6a3fa1b58dc47e9116be00b3</code>이고 S의 바이트는 <code>90f659e0a0f2b45dda55935ac9573abab28abb16e8110b60f45de3bf08ed8e01</code>입니다. 보존한 실행 결과에는 큰 정수 a·r·h·S도 남겨 S=(r+ha) mod q를 실제로 대조했습니다.</p>
</div><CodeViewButton label="RFC의 seed 확장과 공개키 생성" onClick={()=>sidebar.open("expand",codeRefs["expand"])}/><CodeViewButton label="RFC sign에 대응하는 47바이트 흐름" onClick={()=>sidebar.open("sign",codeRefs["sign"])}/><CitationBlock source="RFC 8032 · 5.1.5–5.1.7, 6, 7.1절" href={RFC} citeKey={4}>출판본 코드를 보존하고 공식 빈 메시지 벡터와 별도의 영수증 사례를 Python 3.9.6에서 실행했습니다.</CitationBlock></section>
<section id="source-bug" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 출판본 예제와 명세가 어긋나는 길이 검사를 발견합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">원문 verify는 공개키 길이가 틀리면 예외를 던집니다. 그런데 서명 길이가 64가 아닐 때는 Exception 객체를 만들기만 하고 raise가 없습니다. 다음 줄들은 계속 실행됩니다. 서명의 뒷부분을 little-endian 정수로 읽으므로 정상 서명 뒤에 00 한 바이트를 붙여도 S의 수치는 같습니다.</p>
<p className="leading-8">실제로 위 64바이트 서명 뒤에 00을 붙인 65바이트 입력이 출판본에서 통과했습니다. 공식 정오표 5930은 이 누락을 지적하며 상태는 Verified입니다. 2019년 12월 보고되었고 2021년 5월 확인 기록이 있습니다. 원문 파일은 수정하지 않았으며 별도 함수가 정확한 길이를 검사한 뒤 원문 verify를 부르게 했습니다.</p>
<p className="leading-8">이 명시적 길이 검사에서는 65바이트 입력이 거부되고 정상 64바이트 입력은 통과합니다. 배치 번호만 바꾸거나 S에 군 위수 q를 더한 입력도 거부됩니다. 이 몇 가지 실행이 모든 입력에 대한 정확성이나 부채널 안전성을 보장하는 것은 아닙니다. RFC 자체도 6절 코드를 설명용으로 소개합니다.</p>
</div><CodeViewButton label="missing raise를 그대로 보존한 출판본" onClick={()=>sidebar.open("verify",codeRefs["verify"])}/><CodeViewButton label="길이·메시지·S 범위의 실제 실패 검사" onClick={()=>sidebar.open("negative",codeRefs["negative"])}/><CitationBlock source="RFC 8032 · Verified Erratum 5930" href="https://www.rfc-editor.org/errata/eid5930" citeKey={5}>공식 정오표와 출판본의 차이를 읽고 65바이트 입력으로 재현했습니다.</CitationBlock></section>
<section id="authority" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 서명식의 성공과 가게의 승인을 분리합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">더 강한 경계도 확인할 수 있습니다. Ed25519 항등원 O의 인코딩은 01 뒤에 0이 31바이트인 값입니다. 공개키 A=O, 서명의 R=O, S=0을 주면 S·G=R+hA는 메시지가 무엇이든 O=O가 됩니다. 정확한 64바이트 길이를 지켜도 원문 예제는 이 식을 통과시킵니다.</p>
<p className="leading-8">이것이 등록된 정상 가게 키의 서명을 위조했다는 뜻은 아닙니다. 공개키 자체를 항등원으로 바꾸어 넣은 것입니다. 이번 서비스는 외부에서 등록한 예상 공개키 d75a9801…와 비교하므로 이 입력을 거부합니다. 기대한 배치 번호도 별도로 비교합니다. 7절 마지막 질문의 답은 서명식과 형식만으로 업무상 승인을 결론 내릴 수 없다는 것입니다.</p>
<p className="leading-8">실제 프로토콜은 공개키 등록, 항등원·작은 위수 점의 허용 여부, 하위군 검사, 재생 방지와 키 폐기 시점을 명시해야 합니다. 예제의 길이 검사 함수를 덧붙였다고 이런 정책까지 구현되지는 않습니다. 이 글의 authorize는 예상 키와 예상 메시지를 외부에서 받는 작은 정책 예일 뿐입니다.</p>
</div><CodeViewButton label="항등원 식의 성공과 등록 키 정책의 거부" onClick={()=>sidebar.open("policy",codeRefs["policy"])}/></section>
<section id="variants" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. Ed25519의 변형과 검증식 선택도 입력 규칙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">순수 Ed25519는 메시지를 그대로 해시에 넣고 dom2 부분은 빈 바이트열입니다. Ed25519ctx는 문맥과 플래그 0을, Ed25519ph는 문맥과 플래그 1 및 SHA-512 사전 해시를 사용합니다. ctx에서 문맥이 비어 있어도 dom2 자체가 사라지지는 않습니다. 따라서 단순히 메시지를 먼저 해시한 뒤 순수 Ed25519에 넣는 것은 Ed25519ph와 같지 않습니다.</p>
<p className="leading-8">RFC 5.1.7절은 8을 곱한 검증식 [8][S]G=[8]R+[8][h]A를 제시하면서 8을 곱하지 않은 식을 검사해도 충분하다고 설명합니다. 6절 예제는 후자를 사용합니다. 후자를 통과하면 전자도 통과하지만 허용 입력 집합이 언제나 같지는 않습니다. 여러 노드가 동일한 서명을 같은 결과로 판정해야 하는 시스템에서는 이 선택까지 일치시켜야 합니다.</p>
<p className="leading-8">결정적 nonce는 매 서명마다 새 외부 난수를 얻는 부담을 줄입니다. 처음 seed를 예측하기 어렵게 만드는 일, 비밀 prefix 보호, 결함 주입과 실행 시간·메모리 접근을 통한 누출까지 해결하지는 않습니다. 여기서는 pure 변형만 실행했으며 ctx·ph와 모든 비정상 점 인코딩을 전수 검증하지 않았습니다.</p>
</div></section>
<section id="abelian-group" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">21. 같아 보이는 숫자도 계산하는 세계가 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">작은 Schnorr 예에서는 곱셈 값 P·R을 23으로 나누고 개인값·질문·응답은 11로 나누었습니다. 실제 Ed25519도 좌표의 체 p=2²⁵⁵−19와 스칼라 위수 q=2²⁵²+27742317777372353535851937790883648493이 다릅니다. 같은 정수 자료형으로 저장되더라도 같은 나머지 함수를 써서는 안 됩니다.</p>
<p className="leading-8">곡선 점을 더한다는 것은 좌표를 각각 더하는 일이 아닙니다. 스칼라 a로 점을 곱한다는 것은 군의 덧셈을 a번 반복한다는 뜻입니다. 닫힘·결합법칙·항등원·역원을 가진 연산이 군이고 순서를 바꾸어도 같으면 아벨군입니다. 체에는 덧셈뿐 아니라 0 아닌 원소의 나눗셈도 있습니다. 이 이름들을 단순한 자료형 포함 관계로 읽지 않습니다.</p>
<p className="leading-8">예를 들어 7로 나누는 체에서 3의 역원은 5이므로 2/3은 2×5≡3입니다. 이 나눗셈을 곡선 점에 좌표별로 적용하는 규칙은 없습니다. 점 연산은 <Link to="/cs/crypto/elliptic-curves#concrete">타원곡선 글의 같은 점 더하기</Link>, 역원과 체는 <Link to="/cs/crypto/finite-field-theory#case">유한체의 작은 계산</Link>에서 이어 볼 수 있습니다.</p>
<p className="leading-8">바이트에도 문맥이 있습니다. 영수증의 금액은 big-endian이고 Ed25519의 S는 little-endian입니다. 점을 읽는 함수, 스칼라를 읽는 함수, 루트를 읽는 함수를 구별하고 각 길이와 범위 및 용도 태그를 확인해야 합니다. 같은 32바이트라는 이유만으로 서로 대입하지 않습니다.</p>
</div></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">22. 영수증 한 장에서 확인한 보장과 남은 조건</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이제 C의 다섯 바이트에서 두 형제 해시를 거쳐 루트를 재구성하고 그 루트를 포함한 47바이트 서명을 검사할 수 있습니다. 루트에 대한 포함 여부, 정확한 서명식, 등록된 키와 배치의 일치는 각각 확인하는 조건입니다. 데이터의 현실적 진실성과 모든 가게의 정당한 권한은 이 계산 밖에서 정합니다.</p>
<p className="leading-8">보존한 검산은 SHA-256 경로와 잘못된 좌우, 작은 금액 후보 검사, 빈 값과 0의 구별, 작은 Schnorr의 질문과 nonce 재사용, 두 289상태 순열, Pedersen 분포, RFC 공식 벡터와 영수증 서명을 실제로 실행했습니다. 원문 예제와 덧붙인 길이·업무 정책을 코드에서 나누어 두었습니다.</p>
<p className="leading-8">Poseidon의 작은 라운드와 작은 군은 이해를 위한 모형입니다. 실제 Poseidon의 안전한 매개변수 선택이나 증명 회로 성능 측정, BIP 340 구현 실행, 모든 Ed25519 변형·라이브러리의 검증 정책, 상수 시간 구현 검토는 하지 않았습니다. 실제 제품을 고를 때는 사용하는 버전의 규격과 코드 및 같은 입력의 실패 사례를 다시 맞춰야 합니다.</p>
<p className="leading-8">해시 경로를 성공시킨 뒤 서명 확인을 생략하거나, 서명식을 성공시킨 뒤 공개키 등록을 생략하면 전체 질문에 답할 수 없습니다. 도구의 내부 원리와 그 앞뒤에 붙는 조건을 함께 읽는 것이 암호 프리미티브를 조합하는 핵심입니다.</p>
</div><ReviewPrompts questions={["C의 해시가 공개되고 금액이 0부터 99라고 알려졌다면 금액 20은 숨겨질까요? (답: 9절)","같은 서명용 임시값으로 배치 1과 2에 응답하면 개인값 3을 어떻게 되찾을까요? (답: 15절)","정확한 64바이트 형식과 서명식을 만족하면 등록된 가게의 승인이라고 결론 내릴 수 있을까요? (답: 19절)"]}/><CodeViewButton label="보존한 전체 실행과 판정 범위" onClick={()=>sidebar.open("all-checks",codeRefs["all-checks"])}/></section>
<CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={projectMetas}/></div>;}
