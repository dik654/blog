import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InterconnectDelayViz from "./interconnect-and-rc-delay/viz/InterconnectDelayViz";

import NumericPath from "../world-systems/NumericPath";

export default function InterconnectAndRcDelayArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 멀리 있는 입력을 바꾸려면 연결선의 전하도 채워야 합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">한 소자의 출력이 바뀌었다고 해서 다른 소자의 입력이 즉시 같은 전압이 되지는 않습니다. 그 사이 선으로 전하가 이동해야 하고 선 자체도 주변과 전하를 저장합니다. 소자만 보던 계산에 연결선의 효과를 더해야 합니다.</p><p className="leading-7">같은 출력과 입력 사이에 선 하나를 추가해 보겠습니다. 어느 저항을 지나 어느 용량이 충전되는지 그린 뒤 시간 척도를 계산합니다. 선을 두 배로 늘리거나 재료를 바꿀 때 같은 식의 어느 항이 달라지는지도 추적하겠습니다.</p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 출력 전압의 변화가 선 끝 입력에 도달합니다</h2>
<NumericPath title="연결을 밖에서 보기" steps={[{"label": "입력", "value": "출력 쪽 전압이 바뀜", "detail": "신호를 보내는 소자가 전하를 공급합니다."}, {"label": "경로", "value": "금속선과 그 주변", "detail": "가는 동안 저항을 거치고 주변 용량을 충전합니다."}, {"label": "관찰", "value": "받는 입력의 전압이 바뀜", "detail": "끝 쪽 파형이 기준 전압에 도달하는 때를 봅니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            이 글은 선형 저항과 용량으로 줄인 회로에서 응답의 시간 척도를 비교합니다. 실제 칩의 입력에서 논리값이 정확히 어느 순간 바뀌는지는 뒤에서 실제 파형과 판정 기준까지 확인해야
            합니다.
          </p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 같은 출력·입력에 200 Ω·100 fF 선을 추가합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">수치는 모두 <strong>가정</strong>입니다. 신호를 보내는 쪽의 출력 저항은 500 Ω, 받는 쪽 입력 용량은 20 fF입니다. 연결선의 영향을 생략하면 둘의 곱은 500×20=10000 fs, 곧 10 ps입니다.</p><p className="leading-7">여기에 저항 200 Ω과 주변 용량 100 fF를 가진 선을 넣습니다. 용량의 절반인 50 fF는 선 시작 쪽, 나머지 50 fF는 끝 쪽에 놓아 근사합니다. 같은 시간 척도로 비교하면 합계는 74 ps입니다. 왜 단순히 저항 두 개와 용량 전체를 한 번 곱한 84 ps가 아닌지 경로를 보겠습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 시작 쪽과 끝 쪽 용량이 거치는 저항이 다릅니다</h2>
<NumericPath title="같은 선의 두 충전 경로" steps={[{"label": "공통 입구", "value": "출력 저항500 Ω", "detail": "시작·끝·받는 입력으로 갈 전하가 모두 지납니다."}, {"label": "첫 갈림", "value": "시작 쪽50 fF", "detail": "이 용량으로 가는 전하는 선의200 Ω을 거치지 않습니다."}, {"label": "선 안쪽", "value": "배선 저항200 Ω", "detail": "끝 쪽 용량으로 갈 전하가 더 거칩니다."}, {"label": "끝 쪽", "value": "50 fF+입력20 fF", "detail": "합계70 fF가 두 저항 뒤에 있습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">물리적으로 연속된 선의 용량을 두 점으로 모아 그렸습니다. 시작 쪽 50 fF와 끝 쪽 70 fF를 나누면 어떤 충전 경로에 선의 저항이 포함되는지 보입니다. 실제 전하는 선을 따라 분포하므로 이 그림은 계산을 위한 근사입니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 전체 용량을 선 끝에 몰면 시작 쪽 경로를 잘못 셉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">120 fF 전부를 700 Ω 뒤에 놓으면 시작 쪽 50 fF도 선 저항 200 Ω을 거친다고 가정하게 됩니다. 이때 생기는 추가 항은 200 Ω×50 fF=10 ps입니다. 그래서 84 ps는 이 두 점 근사에서 구한 74 ps보다 큽니다.</p><p className="leading-7">
            반대로 선의 저항만 더하고 용량을 빠뜨리면 출력을 보내는 소자가 새로 떠안은 100 fF를 계산에서 빠뜨립니다. 각 저항과 그 저항을 거쳐 충전하는 용량을 대응시켜야 두 실수를
            피할 수 있습니다.
          </p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 두 점으로 줄인 선과 그 시간 척도에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">선 전체에 저항과 용량이 퍼져 있다는 표현을 <strong>분포 RC</strong>라고 합니다. 선 저항 양쪽에 용량 절반씩을 놓는 지금의 근사 회로는 모양을 따라 <strong>π 모형</strong>이라고 부릅니다.</p><p className="leading-7">이 선형 RC망에서 저항마다 그 뒤 용량을 곱해 얻는 값은 <strong>Elmore 첫 모멘트</strong>입니다. 정규화한 임펄스 응답을 시간으로 가중 적분한 척도로, 어느 한 전압 문턱에 도착한 시각과는 다릅니다. 아래에서는 짧게 Elmore 값이라고 쓰겠습니다.</p></div>
</section>

<section id="wire" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 같은 배선의 시작과 끝에 용량 절반씩을 둡니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">같은 재료와 단면적의 선에서는 길이가 두 배이면 저항도 두 배입니다. 선과 주변 금속·기판 사이의 용량도 같은 단면 구조라면 길이에 거의 비례합니다. 가상의 200 Ω·100 fF 배선을 두 배 길게 만들면 400 Ω·200 fF로 놓을 수 있습니다. 실제 칩에서는 선폭, 두께, 인접 선, 층과 유전체가 달라지므로 길이만으로 정확한 값을 알 수 없습니다.</p>
      <p className="leading-7">
            배선 전체 용량을 한 점에 모으면 선 중간의 충전 경로를 잃습니다. 이 글의 π 근사는 100 fF 중 절반을 선의 시작 쪽에 절반을 끝 쪽에 둡니다. 출력 저항은 배선 용량
            전부와 20 fF 입력을 충전하고 배선 저항은 끝 쪽 배선 용량 절반과 입력 용량을 충전합니다.
          </p>
      <p className="leading-7"><em>저항은 전하가 지나가는 길을, 용량은 채워야 할 전하의 양을 늘립니다.</em></p>
    </div><CitationBlock source="MIT OpenCourseWare 6.884, Lecture 4, ‘Wires’ (2005), 원본 11–13쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-884-complex-digital-systems-spring-2005/fd75994e0ea84378705dd12ee8c16326_l04_wires.pdf">MIT 공식 강의안은 분포 RC 배선을 π 모형으로 줄이고 Elmore 지연을 계산합니다. 아래의 500 Ω·20 fF·200 Ω·100 fF는 강의안의 측정 사례가 아니라 설명을 위한 가정입니다.</CitationBlock>
</section>

<section id="delay" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 출력의 60 ps와 선 안쪽의 14 ps를 합칩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">출력 저항 500 Ω이 보는 용량은 배선 100 fF와 입력 20 fF의 합인 120 fF입니다. 이 부분은 60 ps입니다. 배선 저항 200 Ω이 보는 끝 쪽 용량은 배선의 절반 50 fF와 입력 20 fF, 합계 70 fF입니다. 이 부분은 14 ps이므로 전체 Elmore 근사는 74 ps입니다. 1 Ω·1 fF는 1 fs이므로 단위도 맞습니다.</p>
      <p className="leading-7">배선이 없을 때 10 ps와 비교하면 증가분은 64 ps입니다. 그중 50 ps는 <strong>출력 저항이 새 배선 용량을 충전</strong>하는 항이고, 14 ps는 배선 저항을 거치는 항입니다. 저항이 생긴 만큼만 지연이 늘어난다고 생각하면 큰 부분을 놓칩니다.</p>
      <p className="leading-7"><em>배선 자체의 R과 C뿐 아니라, 기존 출력이 새 C를 떠안는 시간도 함께 셉니다.</em></p>
    </div><InterconnectDelayViz /><ExplainedFormula question="이 가상 배선의 Elmore 지연 척도는 얼마입니까?" idea="출력 저항이 보는 전체 용량과 배선 저항이 보는 끝쪽 용량을 따로 곱해 더합니다." formula={String.raw`t_E=t_d+t_w`} annotatedFormula={String.raw`t_E=\underbrace{t_d}_{\text{출력 항}}+\underbrace{t_w}_{\text{배선 항}}`} operations={[{expression:String.raw`C_{\mathrm{all}}=120\,\mathrm{fF}`,annotation:"배선 100 fF와 입력 20 fF를 더합니다."},{expression:String.raw`C_{\mathrm{end}}=70\,\mathrm{fF}`,annotation:"배선의 끝 절반 50 fF와 입력 20 fF를 더합니다."},{expression:String.raw`t_d=60\,\mathrm{ps}`,annotation:"500 Ω×120 fF입니다."},{expression:String.raw`t_w=14\,\mathrm{ps}`,annotation:"200 Ω×70 fF입니다."},{expression:String.raw`t_E=74\,\mathrm{ps}`,annotation:"두 항 60 ps와 14 ps를 합합니다."}]} terms={[{symbol:"tₑ",name:"Elmore 지연 척도",description:"실제 50% 전파 지연과는 다릅니다."},{symbol:"tᵈ",name:"출력 저항 항",description:"Rᵈ(Cʷ+Cᴸ)로 60 ps입니다."},{symbol:"tʷ",name:"배선 저항 항",description:"Rʷ(Cʷ/2+Cᴸ)로 14 ps입니다."}]} assumptions={["한 가닥의 수동 RC 배선을 π 근사로 표현합니다.","저항·용량은 선형이고 유도성·인접 선 결합과 구동기 파형은 제외합니다."]} interpretation="이 근사의 첫 모멘트는 74 ps입니다. 실제 50% 전파 지연은 별도 파형 해석이 필요합니다." />
</section>

<section id="source" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문의 π 식에 같은 네 값을 직접 넣습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">MIT 6.884 강의안 12쪽은 <code>Rdriver×Cw/2+(Rdriver+Rw)×(Cw/2+Cload)</code>로 두 경로를 셉니다. 시작 쪽에는 500 Ω×50 fF=25 ps, 끝 쪽에는 (500+200) Ω×(50+20) fF=49 ps를 대입합니다. 합은 74 ps로 앞 계산과 같습니다.</p><p className="leading-7">앞 절은 저항을 기준으로 60+14를 더했고 원문 식은 용량의 위치를 기준으로 25+49를 더했습니다. 식을 전개하면 모두 <code>Rdriver(Cw+Cload)+Rw(Cw/2+Cload)</code>입니다. 같은 회로를 어떤 순서로 세는지 바꾼 것이므로 결과가 일치해야 합니다.</p><p className="leading-7">원문 13쪽의 장비·공정 수치는 이 가상의 네 값과 다릅니다. 본문은 12쪽의 연결 관계와 식을 가져와 별도 수치에 적용했습니다. 같은 식이라는 이유로 74 ps를 원문의 측정 결과라고 쓰지 않습니다.</p></div>
</section>

<section id="length" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 길이를 두 배로 늘리면 전체는 158 ps입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">같은 단면과 주변 구조를 가정하고 길이만 두 배로 하면 배선은 400 Ω·200 fF입니다. 출력 저항 항은 500 Ω×(200+20) fF=110 ps, 배선 저항 항은 400 Ω×(100+20) fF=48 ps입니다. 합계 158 ps로 기준의 약 2.14배입니다.</p>
      <p className="leading-7">식의 <strong>배선 자체 항 R<sub>w</sub>C<sub>w</sub>/2</strong>만 떼면 기준 10 ps에서 40 ps로 네 배입니다. 길이가 두 배일 때 R과 C가 각각 두 배여서 곱이 네 배가 됩니다. 그러나 전체 74→158 ps에는 길이에 비례하는 출력 저항×배선 용량과 배선 저항×입력 용량, 길이와 무관한 출력 저항×입력 용량도 섞여 있습니다. 전체 지연을 네 배라고 말할 수 없는 이유입니다.</p>
      <p className="leading-7"><em>‘배선 고유 항의 제곱 길이 효과’와 ‘회로 전체의 지연’은 서로 다른 숫자입니다.</em></p>
    </div>
</section>

<section id="materials" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 금속과 절연막은 식의 다른 자리를 바꿉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">가상 기준에서 금속 쪽만 바꿔 배선 저항이 200→140 Ω이 되고 용량이 같다면 60+140×70 fF=69.8 ps입니다. 주변 절연막 쪽만 바꿔 배선 용량이 100→50 fF이고 저항이 같다면 500×70 fF+200×45 fF=44 ps입니다. 둘을 함께 바꾼 가정은 41.3 ps입니다. 이 수치는 재료 변경 효과를 식에서 분리하려는 임의의 수치입니다.</p>
      <p className="leading-7">구리 배선과 낮은 유전율의 절연막을 택하는 이유가 여기에 있습니다. 다만 공정에서 저항은 선폭과 두께·장벽층에, 용량은 간격과 층 구조에도 영향을 받습니다. 인텔의 2002년 원문은 당시 특정 피치의 공정 비교에서 시트 저항과 RC 지연 감소를 보고합니다. 그 보고 값을 위 가상의 30% 저항 감소나 50% 용량 감소로 바꿔 읽어서는 안 됩니다.</p>
      <p className="leading-7"><em>재료의 이름보다 완성된 배선의 R·C·기하를 함께 재는 일이 중요합니다.</em></p>
    </div><CitationBlock source="Intel Technology Journal, 2002 Vol. 6 No. 2, 130 nm logic interconnect, 원본 10–11쪽" citeKey={2} href="https://www.intel.com/content/dam/www/public/us/en/documents/research/2002-vol06-iss-2-intel-technology-journal.pdf">인텔의 원문은 당시 구리·FSG 낮은 유전율 배선의 동일 피치 비교에서 시트 저항과 RC 개선을 보고합니다. 본문 계산의 140 Ω·50 fF는 그 측정값에서 가져온 수치가 아닙니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            인텔 원문 10쪽의 30%는 같은 금속 피치에서 비교한 시트 저항 감소이며 11쪽의 50%는 특정 비교에서의 RC 감소입니다. 서로 다른 측정량입니다. 50%를 용량만 절반으로
            줄었다고 읽을 수 없습니다. 본문에서 C를 100→50 fF로 둔 것은 이 차이를 연습하기 위한 독립된 가정입니다.
          </p></div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 정확한 도착 시각은 실제 파형과 배치에서 다시 구합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            배선을 생략한 가장 단순한 500 Ω·20 fF 회로에서도 RC=10 ps와 50% 도달 시각은 다릅니다. 이상적인 순간 전압 변화에 대해 50% 도달 시각은
            RC×ln2≈6.93 ps입니다. 배선을 더한 여러 저장점의 회로의 첫 모멘트에 이 계수 하나를 곱해 정확한 답이라고 할 수는 없습니다.
          </p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
      <p className="leading-7">Elmore 식은 수동 RC망의 응답을 비교하는 빠른 척도입니다. 실제 50% 도착 시각에는 구동 트랜지스터의 비선형 출력, 입력 스위칭 문턱, 인접 선 결합, 긴 선의 유도성, 버퍼 삽입과 층별 기하가 관여합니다. 배치 뒤 추출한 R·C망으로 파형과 타이밍을 다시 분석해야 합니다.</p>
      <p className="leading-7">
            앞의 도핑·노광 글은 소자 자체의 제작 조건을 다뤘고 이 글은 소자 사이 연결의 시간 비용을 더했습니다. 다음에는 결함 때문에 몇 개의 다이가 실제로 기능하고 패키징과 시험 뒤
            몇 개가 남는지 셉니다.
          </p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 기준 74 ps에서 출력 저항이 담당하는 시간은? (답: 8·9절) 길이를 두 배로 했을 때 네 배가 되는 항은? (답: 10절) 배선 용량만 절반으로 하면 출력 저항 항은 얼마입니까? (답: 11절)</p>
      <p className="leading-7"><Link to="/electronics/semiconductors/doping-and-thermal-budget#limits">앞 글의 확산 경계</Link>와 마찬가지로, 이 글의 π 근사도 실제 구조를 측정한 뒤 적용해야 합니다.</p>
    </div>
</section>
</div>;
}
