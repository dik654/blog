import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InterconnectDelayViz from "./interconnect-and-rc-delay/viz/InterconnectDelayViz";

/** Invented π wire: Rdrv=500 Ω, Cload=20 fF, Rw=200 Ω, Cw=100 fF. */
export default function InterconnectAndRcDelayArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">트랜지스터가 빨라도 먼 곳의 입력은 늦게 바뀝니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="text-lg leading-8">앞 글까지는 웨이퍼 위에 소자를 만들었습니다. 이제 한 소자의 출력을 다른 소자의 입력까지 배선으로 옮겨야 합니다. 가상 회로에서 출력 저항은 500 Ω, 상대 입력 용량은 20 fF입니다. 배선을 생략하면 저항과 용량의 곱은 10 ps입니다. 여기에 배선 저항 200 Ω과 배선 용량 100 fF를 넣으면 같은 근사식의 시간 척도가 74 ps로 늘어납니다.</p>
      <p className="leading-7">이 74 ps는 실제 칩의 측정 지연도, 출력이 정확히 절반으로 바뀌는 시간도 아닙니다. 분포된 배선을 간단한 π 회로로 바꾼 뒤 구한 <strong>Elmore 지연의 첫 모멘트</strong>입니다. 이 한 사례를 따라가면 길이·금속·절연막이 각각 식의 어느 항을 바꾸는지 보입니다.</p>
      <p className="leading-7"><em>배선은 전기를 전하는 통로이면서, 저항과 주변 용량을 함께 더하는 부품입니다.</em></p>
    </div></section>
    <section id="wire" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">선이 길어지면 저항도, 충전할 용량도 커집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">같은 재료와 단면적의 선에서는 길이가 두 배이면 저항도 두 배입니다. 선과 주변 금속·기판 사이의 용량도 같은 단면 구조라면 길이에 거의 비례합니다. 가상의 200 Ω·100 fF 배선을 두 배 길게 만들면 400 Ω·200 fF로 놓을 수 있습니다. 실제 칩에서는 선폭, 두께, 인접 선, 층과 유전체가 달라지므로 길이만으로 정확한 값을 알 수 없습니다.</p>
      <p className="leading-7">배선 전체 용량을 한 점에 몰면 선 중간의 충전 경로를 잃습니다. 이 글의 π 근사는 100 fF 중 절반을 선의 시작 쪽에, 절반을 끝 쪽에 둡니다. 출력 저항은 배선 용량 전부와 20 fF 입력을 충전하고, 배선 저항은 끝 쪽 배선 용량 절반과 입력 용량을 충전합니다.</p>
      <p className="leading-7"><em>저항은 전하가 지나가는 길을, 용량은 채워야 할 전하의 양을 늘립니다.</em></p>
    </div><CitationBlock source="MIT OpenCourseWare 6.884, Lecture 4, ‘Wires’ (2005), 원본 11–13쪽" citeKey={1} href="https://ocw.mit.edu/courses/6-884-complex-digital-systems-spring-2005/fd75994e0ea84378705dd12ee8c16326_l04_wires.pdf">MIT 공식 강의안은 분포 RC 배선을 π 모형으로 줄이고 Elmore 지연을 계산합니다. 아래의 500 Ω·20 fF·200 Ω·100 fF는 강의안의 측정 사례가 아니라 설명을 위한 가정입니다.</CitationBlock></section>
    <section id="delay" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">누가 어느 용량을 충전하는지 세면 74 ps가 나옵니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">출력 저항 500 Ω이 보는 용량은 배선 100 fF와 입력 20 fF의 합인 120 fF입니다. 이 부분은 60 ps입니다. 배선 저항 200 Ω이 보는 끝 쪽 용량은 배선의 절반 50 fF와 입력 20 fF, 합계 70 fF입니다. 이 부분은 14 ps이므로 전체 Elmore 근사는 74 ps입니다. 1 Ω·1 fF는 1 fs이므로 단위도 맞습니다.</p>
      <p className="leading-7">배선이 없을 때 10 ps와 비교하면 증가분은 64 ps입니다. 그중 50 ps는 <strong>출력 저항이 새 배선 용량을 충전</strong>하는 항이고, 14 ps는 배선 저항을 거치는 항입니다. 저항이 생긴 만큼만 지연이 늘어난다고 생각하면 큰 부분을 놓칩니다.</p>
      <p className="leading-7"><em>배선 자체의 R과 C뿐 아니라, 기존 출력이 새 C를 떠안는 시간도 함께 셉니다.</em></p>
    </div><InterconnectDelayViz /><ExplainedFormula question="이 가상 배선의 Elmore 지연 척도는 얼마입니까?" idea="출력 저항이 보는 전체 용량과 배선 저항이 보는 끝쪽 용량을 따로 곱해 더합니다." formula={String.raw`t_E=t_d+t_w`} annotatedFormula={String.raw`t_E=\underbrace{t_d}_{\text{출력 항}}+\underbrace{t_w}_{\text{배선 항}}`} operations={[{expression:String.raw`C_{\mathrm{all}}=120\,\mathrm{fF}`,annotation:"배선 100 fF와 입력 20 fF를 더합니다."},{expression:String.raw`C_{\mathrm{end}}=70\,\mathrm{fF}`,annotation:"배선의 끝 절반 50 fF와 입력 20 fF를 더합니다."},{expression:String.raw`t_d=60\,\mathrm{ps}`,annotation:"500 Ω×120 fF입니다."},{expression:String.raw`t_w=14\,\mathrm{ps}`,annotation:"200 Ω×70 fF입니다."},{expression:String.raw`t_E=74\,\mathrm{ps}`,annotation:"두 항 60 ps와 14 ps를 합합니다."}]} terms={[{symbol:"tₑ",name:"Elmore 지연 척도",description:"실제 50% 전파 지연과는 다릅니다."},{symbol:"tᵈ",name:"출력 저항 항",description:"Rᵈ(Cʷ+Cᴸ)로 60 ps입니다."},{symbol:"tʷ",name:"배선 저항 항",description:"Rʷ(Cʷ/2+Cᴸ)로 14 ps입니다."}]} assumptions={["한 가닥의 수동 RC 배선을 π 근사로 표현합니다.","저항·용량은 선형이고 유도성·인접 선 결합과 구동기 파형은 제외합니다."]} interpretation="이 근사의 첫 모멘트는 74 ps입니다. 실제 50% 전파 지연은 별도 파형 해석이 필요합니다." /></section>
    <section id="length" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">길이를 두 배로 늘리면 전체는 158 ps입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">같은 단면과 주변 구조를 가정하고 길이만 두 배로 하면 배선은 400 Ω·200 fF입니다. 출력 저항 항은 500 Ω×(200+20) fF=110 ps, 배선 저항 항은 400 Ω×(100+20) fF=48 ps입니다. 합계 158 ps로 기준의 약 2.14배입니다.</p>
      <p className="leading-7">식의 <strong>배선 자체 항 R<sub>w</sub>C<sub>w</sub>/2</strong>만 떼면 기준 10 ps에서 40 ps로 네 배입니다. 길이가 두 배일 때 R과 C가 각각 두 배여서 곱이 네 배가 됩니다. 그러나 전체 74→158 ps에는 길이에 비례하는 출력 저항×배선 용량과 배선 저항×입력 용량, 길이와 무관한 출력 저항×입력 용량도 섞여 있습니다. 전체 지연을 네 배라고 말할 수 없는 이유입니다.</p>
      <p className="leading-7"><em>‘배선 고유 항의 제곱 길이 효과’와 ‘회로 전체의 지연’은 서로 다른 숫자입니다.</em></p>
    </div></section>
    <section id="materials" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">금속과 절연막은 식의 다른 자리를 바꿉니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">가상 기준에서 금속 쪽만 바꿔 배선 저항이 200→140 Ω이 되고 용량이 같다면 60+140×70 fF=69.8 ps입니다. 주변 절연막 쪽만 바꿔 배선 용량이 100→50 fF이고 저항이 같다면 500×70 fF+200×45 fF=44 ps입니다. 둘을 함께 바꾼 가정은 41.3 ps입니다. 이 수치는 재료 변경 효과를 식에서 분리하려는 임의의 수치입니다.</p>
      <p className="leading-7">구리 배선과 낮은 유전율의 절연막을 택하는 이유가 여기에 있습니다. 다만 공정에서 저항은 선폭과 두께·장벽층에, 용량은 간격과 층 구조에도 영향을 받습니다. 인텔의 2002년 원문은 당시 특정 피치의 공정 비교에서 시트 저항과 RC 지연 감소를 보고합니다. 그 보고 값을 위 가상의 30% 저항 감소나 50% 용량 감소로 바꿔 읽어서는 안 됩니다.</p>
      <p className="leading-7"><em>재료의 이름보다 완성된 배선의 R·C·기하를 함께 재는 일이 중요합니다.</em></p>
    </div><CitationBlock source="Intel Technology Journal, 2002 Vol. 6 No. 2, 130 nm logic interconnect, 원본 10–11쪽" citeKey={2} href="https://www.intel.com/content/dam/www/public/us/en/documents/research/2002-vol06-iss-2-intel-technology-journal.pdf">인텔의 원문은 당시 구리·FSG 낮은 유전율 배선의 동일 피치 비교에서 시트 저항과 RC 개선을 보고합니다. 본문 계산의 140 Ω·50 fF는 그 측정값에서 가져온 수치가 아닙니다.</CitationBlock></section>
    <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">정확한 도착 시각은 실제 파형과 배치에서 다시 구합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
      <p className="leading-7">Elmore 식은 수동 RC망의 응답을 비교하는 빠른 척도입니다. 실제 50% 도착 시각에는 구동 트랜지스터의 비선형 출력, 입력 스위칭 문턱, 인접 선 결합, 긴 선의 유도성, 버퍼 삽입과 층별 기하가 관여합니다. 배치 뒤 추출한 R·C망으로 파형과 타이밍을 다시 분석해야 합니다.</p>
      <p className="leading-7">앞의 도핑·노광 글은 소자 자체의 제작 조건을 다뤘고, 이 글은 소자 사이 연결의 시간 비용을 더했습니다. 다음에는 결함 때문에 몇 개의 다이가 실제로 기능하고, 패키징과 시험 뒤 몇 개가 남는지 셉니다.</p>
      <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 기준 74 ps에서 출력 저항이 담당하는 시간은? (답: 3절) 길이를 두 배로 했을 때 네 배가 되는 항은? (답: 4절) 배선 용량만 절반으로 하면 출력 저항 항은 얼마입니까? (답: 5절)</p>
      <p className="leading-7"><Link to="/electronics/semiconductors/doping-and-thermal-budget#limits">앞 글의 확산 경계</Link>와 마찬가지로, 이 글의 π 근사도 실제 구조를 측정한 뒤 적용해야 합니다.</p>
    </div></section>
  </div>;
}
