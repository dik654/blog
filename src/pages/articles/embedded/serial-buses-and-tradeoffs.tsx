import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SerialBusViz from "./serial-buses-and-tradeoffs/viz/SerialBusViz";
import NumericPath from "../world-systems/NumericPath";
import TeachCode from "./serial-buses-and-tradeoffs/TeachCode";

export default function SerialBusesAndTradeoffsArticle(){
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 네 바이트를 얻으려면 그 앞뒤의 거래도 끝나야 합니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">장치가 센서에서 숫자 네 바이트를 가져오려 합니다. 선 위에는 그 네 바이트만 흐르지 않습니다. 어느 센서의 어느 위치를 읽을지 먼저 알리고 상대가 받았는지도 확인해야 합니다. 이 부가 절차와 대기 시간이 실제 완료 시점을 바꿉니다.</p><p className="leading-7">한 번의 읽기를 요청부터 결과까지 따라가겠습니다. 같은 거래를 공식 통신 규격과 실제 SDK에 대응시킨 뒤 다른 두 통신 방식에서는 무엇을 다시 세어야 하는지 비교합니다.</p></div></section>

<section id="outside" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 센서와 위치를 고르면 결과 네 바이트나 실패가 돌아옵니다</h2><NumericPath title="한 번 읽기의 입구와 출구" steps={[{"label": "요청", "value": "센서 번호·읽을 위치·길이", "detail": "어느 장치의 어떤 값을 원하는지 정합니다."}, {"label": "선 위의 거래", "value": "요청을 보내고 응답을 받기", "detail": "사용할 선과 상대의 응답을 기다릴 수 있습니다."}, {"label": "결과", "value": "네 바이트 또는 오류", "detail": "완료 길이와 실패 여부를 확인한 뒤 값을 사용합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 예는 한 프로그램이 버스를 소유하고 한 센서와 정상적으로 거래하는 경우부터 시작합니다. 다른 장치와의 경쟁이나 응답 실패가 있으면 같은 네 바이트 요청도 별도 처리가 필요합니다.</p></div></section>

<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 네 결과 앞에 세 묶음을 보내 총 63칸을 씁니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">센서를 고르는 번호를 0x48, 읽을 시작 위치를 0x10으로 가정합니다. 센서가 위치를 한 바이트로 받고 네 바이트를 연속해서 돌려줄 수 있다고 둡니다. 예를 들어 결과는 0x12·0x34·0x56·0x78입니다. 번호·위치·결과·지원 기능은 모두 설명용 <strong>가정</strong>입니다.</p><p className="leading-7">먼저 센서와 쓰기 방향을 고르는 한 묶음, 위치를 알리는 한 묶음, 같은 센서와 읽기 방향을 고르는 한 묶음을 보냅니다. 그 뒤 결과 네 묶음을 받습니다. 각 묶음의 데이터 8칸과 응답 1칸을 세면 (3+4)×9=63칸입니다.</p><p className="leading-7">한 칸이 2.5 µs라면 순수 클록 시간은 157.5 µs입니다. 읽으려던 32비트만 세면 앞뒤 절차를 빠뜨립니다. 또한 이 계산은 대기까지 포함한 완료 시간의 보장이 아닙니다.</p></div></section>

<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 같은 장치를 고른 채 방향만 바꿔 읽습니다</h2><NumericPath title="0x48의 0x10부터 네 바이트 받기" steps={[{"label": "장치 선택", "value": "쓰려고 한다고 알리기", "detail": "센서를 고르는 번호와 방향을 함께 보냅니다."}, {"label": "위치 지정", "value": "시작 위치 0x10", "detail": "센서 안에서 읽을 곳을 정합니다."}, {"label": "방향 변경", "value": "이제 읽겠다고 알리기", "detail": "같은 번호를 다시 보내며 읽기 방향으로 바꿉니다."}, {"label": "결과 수신", "value": "네 바이트 뒤 종료", "detail": "마지막 바이트 뒤에는 더 받지 않겠다고 알립니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            매 바이트를 보내는 쪽과 그 바이트에 응답하는 쪽을 구별하세요. 장치와 위치를 보낼 때는 센서가 응답하고 결과를 받을 때는 읽는 쪽이 응답합니다. 마지막에도 응답을 위한 시간
            한 칸은 남습니다.
          </p></div></section>

<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 장치 선택과 수신 확인을 빼면 같은 거래가 되지 않습니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 두 선에 여러 센서가 있으면 누구에게 말하는지 정해야 합니다. 센서 안에 여러 값이 있으면 어디부터 읽는지도 알려야 합니다. 위치를 보내는 단계와 결과를 받는 단계의 방향이 다른 이유입니다.</p><p className="leading-7">보낸 쪽이 전기 신호를 냈다는 사실만으로 상대가 바이트를 받았다고 알 수는 없습니다. 다음 단계로 넘어갈 응답이나 실패 표시가 필요합니다. 네 바이트를 다 읽지 못했다면 남은 버퍼를 정상 결과처럼 사용해서도 안 됩니다.</p><p className="leading-7">다른 통신 방식은 장치를 별도 선으로 고르거나 시작·끝 표식을 바이트마다 붙이기도 합니다. 그래서 데이터 네 바이트라는 말만으로 세 방식의 전체 거래 시간을 같게 놓을 수 없습니다.</p></div></section>

<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 공유 선·방향 변경·응답에 이름을 붙입니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">지금 따라온 두 선의 통신 방식을 <strong>I²C</strong>라고 합니다. 데이터가 지나는 선은 <strong>SDA</strong>입니다. 한 칸의 박자를 정하는 선은 <strong>SCL</strong>입니다. 나머지 표기는 앞에서 본 역할에 맞춰 읽습니다.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">규격의 이름</th></tr></thead><tbody><tr><td className="p-3">거래를 시작하고 박자를 만드는 쪽</td><td className="p-3">컨트롤러</td></tr><tr><td className="p-3">번호로 선택되는 센서</td><td className="p-3">타깃</td></tr><tr><td className="p-3">바이트를 받았다는 응답</td><td className="p-3">ACK</td></tr><tr><td className="p-3">더 받지 않거나 받을 수 없다는 응답</td><td className="p-3">NACK</td></tr><tr><td className="p-3">거래 시작·종료</td><td className="p-3">START·STOP</td></tr><tr><td className="p-3">끝내지 않고 다시 시작하는 방향 변경</td><td className="p-3">반복 START</td></tr></tbody></table></div></section>

<section id="i2c" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. I²C는 두 선을 공유하고 주소·응답을 매 거래에 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">
            I²C는 SDA 데이터선과 SCL 클록선을 여러 장치가 공유합니다. 가상 센서의 7비트 주소로 먼저 쓰기 방향을 고르고 한 바이트의 레지스터 위치를 보낸 뒤 반복 START로
            읽기 방향으로 전환합니다. 그다음 네 데이터 바이트를 받습니다. 각 8비트 바이트 뒤에는 응답을 위한 아홉 번째 클록이 있습니다. 마지막 데이터에는 컨트롤러가 NACK으로
            읽기를 마치겠다고 알릴 수 있지만 클록 한 칸은 여전히 필요합니다.
          </p>
   <p className="leading-7">RP2040에서 I2C0의 SDA/SCL을 GPIO16/17에 놓는 것은 가능한 핀 선택의 한 예입니다. 실제 센서의 주소, 레지스터 자동 증가, 전기적 풀업, 속도 허용은 센서 데이터시트를 확인해야 합니다.</p>
   <p className="leading-7">같은 63클록이라도 클록 상한에 따라 시간이 달라집니다. UM10204 Rev. 7.0은 속도 모드를 네 가지로 둡니다. Standard-mode는 100 kbit/s, Fast-mode는 400 kbit/s, Fast-mode Plus(Fm+)는 1 Mbit/s, High-speed(Hs) 모드는 3.4 Mbit/s까지입니다.</p>
   <p className="leading-7">센서와 컨트롤러가 모두 Fm+를 지원한다면 63클록은 63×1 µs=63 µs입니다. Hs 모드는 전용 입출력 단과 별도 전기 특성표(표 12·13)를 따르므로 클록 숫자만 바꿔 적용하지 않습니다.</p>
   <p className="leading-7">400 kHz라는 숫자도 클록 한 주기 2.5 µs 안에 규격의 최소 시간이 들어가야 성립합니다. 표 11(인쇄 44쪽)의 Fast-mode 최소값은 SCL LOW 1.3 µs, HIGH 0.6 µs입니다. 둘을 더하면 1.9 µs이고 2.5−1.9=0.6 µs가 남습니다. 상승·하강 시간과 부하가 이 여유를 넘기면 설정값이 400 kHz여도 그 주기가 유지되지 않습니다.</p>
   <p className="leading-7">버스에 컨트롤러가 둘 이상이면 “다른 장치의 점유”에도 규칙이 있습니다. §3.1.8(인쇄 11쪽)의 <strong>중재(arbitration)</strong>입니다. 컨트롤러는 버스가 비어 있을 때만 거래를 시작합니다. 두 컨트롤러가 거의 동시에 START를 내면 SCL이 HIGH인 동안 비트마다 SDA를 자기가 보낸 값과 비교합니다. HIGH를 보냈는데 SDA가 LOW로 보이면 그 컨트롤러가 진 것이고, SDA 출력을 끄고 버스가 빈 뒤 거래를 처음부터 다시 시작합니다. 이긴 쪽의 거래는 손상되지 않습니다.</p>
   <p className="leading-7">예를 들어 다른 컨트롤러가 주소 0x20(0100000)을, 우리 컨트롤러가 0x48(1001000)을 보낸다고 가정하면 첫 비트에서 우리 쪽이 1, 상대가 0이므로 우리 쪽이 집니다. 그러면 157.5 µs 앞에 상대 거래 전체가 더해집니다.</p>
   <p className="leading-7"><em>I²C의 두 선은 편하지만 주소·응답과 공유 버스의 대기를 함께 셉니다.</em></p>
  </div><CitationBlock source="NXP, UM10204 I²C-bus specification and user manual, Rev. 7.0 (2021), §3(속도 모드)·§3.1.4–3.1.10, 인쇄 9–14쪽, 표 11(44쪽)" citeKey={1} href="https://www.nxp.com/docs/en/user-guide/UM10204.pdf">NXP 공식 규격은 SDA/SCL 두 선, 네 속도 모드(100 kbit/s·400 kbit/s·1 Mbit/s·3.4 Mbit/s), 매 바이트 뒤 아홉 번째 ACK 클록과 반복 START, 다중 컨트롤러의 비트 단위 중재를 설명합니다. 0x20 컨트롤러는 설명용 가정입니다. 본문의 네 바이트 센서 거래는 규격의 실측 사례가 아닙니다.</CitationBlock></section>

<section id="count" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. I²C 400 kHz에서 일곱 묶음은 최소 157.5 µs입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">주소+쓰기, 레지스터 위치, 주소+읽기 세 묶음과 수신 데이터 네 묶음입니다. 각 묶음은 데이터 8클록과 응답 1클록이므로 (3+4)×9=63클록입니다. 클록이 400 kHz라면 1클록이 2.5 µs여서 63×2.5=157.5 µs입니다. 100 kHz라면 630 µs입니다.</p>
   <p className="leading-7">START·반복 START·STOP의 시간, 장치의 클록 스트레칭, 소프트웨어·버스 대기는 위 숫자에 넣지 않았습니다. 배선의 상승 시간이 허용 속도에 맞는지도 확인해야 합니다. 센서가 SCL을 오래 낮게 잡으면 실제 벽시계 시간은 크게 늘 수 있습니다. 157.5 µs는 일정한 비트 클록만 센 하한입니다.</p>
   <p className="leading-7"><em>통신 속도 표기 400 kbit/s를 데이터 네 바이트에 바로 나누면 주소와 응답을 빠뜨립니다.</em></p>
  </div><SerialBusViz /><ExplainedFormula question="이 가상 I²C 읽기의 비트 클록 시간은?" idea="주소·위치·읽기 주소·데이터까지 바이트 묶음을 세고 각각 응답 클록을 붙입니다." formula={String.raw`t_{\mathrm{clk}}=N_{\mathrm{clk}}/f_{\mathrm{SCL}}`} annotatedFormula={String.raw`t_{\mathrm{clk}}=N_{\mathrm{clk}}/f_{\mathrm{SCL}}`} operations={[{expression:String.raw`N_{\mathrm{clk}}=7\times9=63`,annotation:"주소·위치 세 묶음과 데이터 네 묶음입니다."},{expression:String.raw`1/f_{\mathrm{SCL}}=2.5\,\mu s`,annotation:"400 kHz 클록 한 주기입니다."},{expression:String.raw`t_{\mathrm{clk}}=157.5\,\mu s`,annotation:"63×2.5 µs, START·대기는 제외합니다."}]} terms={[{symbol:"N",name:"클록 수",description:"아홉 번째 응답 비트를 포함한 63개입니다."},{symbol:"f",name:"SCL 빈도",description:"가정한 400 kHz입니다."},{symbol:"t",name:"순수 클록 시간",description:"실제 완료 시간의 하한일 뿐입니다."}]} assumptions={["센서가 7비트 주소와 1바이트 위치·4바이트 연속 읽기를 지원합니다.","400 kHz가 유지되고(표 11의 LOW 1.3 µs·HIGH 0.6 µs 이상) 클록 스트레칭·START/STOP 시간과 다른 컨트롤러와의 중재 대기는 제외합니다."]} interpretation="이 가상 I²C 거래의 비트 클록만 157.5 µs입니다. 전체 응답은 더 길 수 있습니다." /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            추가 클록 스트레칭을 200 µs로 가정하면 157.5+200=357.5 µs이며 다른 제어 시간은 아직 남습니다. 반대로 400 kHz가 실제로 측정한 전체 클록 주기를
            뜻한다면 그 주기 안의 상승 시간을 다시 더하지 않습니다. 설정한 속도와 측정한 선의 주기를 구분해야 합니다.
          </p></div></section>

<section id="source-spec" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 규격의 방향 비트와 응답 역할에 같은 일곱 묶음을 넣습니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            NXP UM10204 Rev. 7.0의 §3.1.6은 바이트 뒤 응답 한 칸을 둡니다. §3.1.10의 결합 거래는 방향을 바꿀 때 장치 번호를 다시 보냅니다. 읽기 끝에는
            컨트롤러가 더 받지 않겠다는 NACK을 보냅니다. 이를 같은 센서 번호 0x48에 적용하겠습니다.
          </p><p className="leading-7">
            선 위로 보내는 첫 바이트에는 7비트 번호 뒤에 방향 1비트를 붙입니다. 0x48을 한 자리 왼쪽으로 옮기면 0x90이고 쓰기 비트 0을 붙이면 그대로입니다. 읽기 비트 1을
            붙이면 0x91입니다. 프로그램 API에 넘기는 7비트 번호는 계속 0x48입니다.
          </p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">묶음</th><th className="p-3">선 위의 바이트</th><th className="p-3">아홉 번째 칸</th><th className="p-3">클록 수</th></tr></thead><tbody><tr><td className="p-3">장치+쓰기</td><td className="p-3">0x90</td><td className="p-3">센서가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">시작 위치</td><td className="p-3">0x10</td><td className="p-3">센서가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">장치+읽기</td><td className="p-3">0x91</td><td className="p-3">센서가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">결과 1</td><td className="p-3">0x12</td><td className="p-3">컨트롤러가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">결과 2</td><td className="p-3">0x34</td><td className="p-3">컨트롤러가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">결과 3</td><td className="p-3">0x56</td><td className="p-3">컨트롤러가 ACK</td><td className="p-3">9</td></tr><tr><td className="p-3">결과 4</td><td className="p-3">0x78</td><td className="p-3">컨트롤러가 NACK</td><td className="p-3">9</td></tr></tbody></table></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            표 앞에 START, 위치와 읽기 주소 사이에 반복 START, 마지막 응답 뒤에 STOP이 있습니다. 프로그램의 데이터 배열에는 수신할 네 바이트를 담습니다. 주소와
            방향·응답은 컨트롤러 하드웨어와 드라이버가 만드는 부분입니다.
          </p></div><CitationBlock source="NXP UM10204 Rev. 7.0 · §3.1.6·§3.1.10·그림 13" citeKey={3} href="https://www.nxp.com/docs/en/user-guide/UM10204.pdf">응답 소유자와 방향 변경을 규격에 대조하고, 가정한 주소·위치·결과를 일곱 묶음으로 셌습니다. 특정 센서의 레지스터 형식이나 실측 지연을 규정하는 자료는 아닙니다.</CitationBlock></section>

<section id="source-write" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실제 SDK에 위치 한 바이트를 보내고 거래를 이어 두라고 지정합니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">Pico SDK 2.2.0 commit a1438dff의 i2c.c를 봅니다. 정상 초기화 뒤 i2c_write_blocking에 addr=0x48, src의 한 바이트 0x10, len=1, nostop=true를 넣는 경로입니다. 원문은 7비트 주소를 장치 선택 필드에 쓰고 데이터 명령을 만듭니다. 첫 거래의 restart_on_next는 false로 시작한다고 둡니다.</p></div><TeachCode codeKey="write" label="주소 선택과 위치 쓰기의 실제 원문" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">한 바이트이므로 first와 last가 모두 true입니다. 그러나 nostop도 true여서 last와 !nostop을 함께 요구하는 STOP 비트는 0입니다. 함수 끝에서는 restart_on_next=nostop을 저장합니다. 성공 반환값 1을 확인한 뒤 다음 읽기로 넘어갑니다. 주소나 데이터가 거절되면 반환값을 검사해 다른 처리를 해야 합니다.</p></div><TeachCode codeKey="continue" label="다음 거래의 반복 START를 남기는 원문" /></section>

<section id="source-read" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 같은 주소에서 네 번 읽기를 요청하고 마지막에 끝냅니다</h2><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다음 i2c_read_blocking에는 같은 addr=0x48, len=4, nostop=false를 넣습니다. 첫 읽기 명령은 이전에 저장한 restart_on_next 때문에 RESTART를 세웁니다. 네 명령 모두 읽기 비트를 가지며 마지막 명령만 STOP을 세웁니다. 이것이 앞의 방향 변경과 네 결과 수신에 대응합니다.</p></div><TeachCode codeKey="read" label="네 읽기 명령과 마지막 STOP의 실제 원문" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            원문은 수신 데이터를 한 바이트씩 버퍼에 씁니다. 중간 중단이 없으면 읽은 바이트 수를 반환합니다. 이번 성공 길이는 4입니다. 오류가 나기 전에 일부 버퍼가 바뀌었더라도
            반환값을 확인하기 전에는 완전한 네 바이트 결과로 해석하지 않습니다.
          </p><p className="leading-7">
            일반 blocking 함수는 내부 시간 제한 검사기에 NULL을 넘깁니다. 따라서 157.5 µs라는 계산을 이 API의 시간 제한으로 사용할 수 없습니다. _until 형태는
            절대 시각을 받으므로 요청부터 정한 같은 마감을 두 단계에 전달할 수 있습니다. 반환값과 실제 완료 시각도 확인합니다. 실패 후 버스와 센서 상태의 복구 정책을 따로 정합니다.
          </p></div><TeachCode codeKey="deadline" label="일반 호출과 절대 마감 호출의 원문 차이" /><CitationBlock source="Pico SDK 2.2.0 · a1438dff · i2c.c" citeKey={4} href="https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_i2c/i2c.c">원본 전체와 라이선스를 보존하고 addr 0x48·쓰기 길이 1·읽기 길이 4·nostop 전환을 실제 함수에 적용했습니다. 실제 센서에서 통신하거나 시간을 측정한 결과는 아닙니다.</CitationBlock></section>

<section id="spi" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. SPI는 선택 선과 클록 모드를 맞추고 더 적은 클록을 씁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">
            SPI는 보통 클록, 송신, 수신, 장치 선택 선을 씁니다. 가상의 SPI 장치가 명령 1바이트를 받고 네 바이트를 돌려준다고 놓으면 총 다섯 바이트로 40클록입니다. 1
            MHz에서는 순수 클록 시간 40 µs입니다. 동시 송수신이므로 명령을 보내는 동안 돌아오는 바이트가 버려지는 값일 수 있습니다. 이후 네 바이트를 받으려면 송신 쪽에서 더미
            바이트를 보내 클록을 만들어야 할 수 있습니다.
          </p>
   <p className="leading-7">RP2040 SPI1의 한 핀 조합은 GPIO8 RX, 9 CSn, 10 SCK, 11 TX입니다. 장치마다 명령 형식, CPOL/CPHA 클록 모드, CS 준비·종료 시간이 다릅니다. 40 µs는 그런 조건을 제외한 가상 선로 시간입니다.</p>
   <p className="leading-7"><em>SPI는 높은 비트 클록을 쓸 수 있지만 필요한 선과 장치별 거래 규칙이 달라집니다.</em></p>
  </div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">앞의 I²C는 공유 SDA·SCL 위에서 주소 0x48로 센서를 고릅니다. SPI는 별도 선택 선과 클록·송수신 선을 사용합니다. I²C의 풀업과 부하 조건을 확인하듯 SPI에서는 장치가 요구하는 클록 모드와 선택 선 유지 시간을 맞춰야 합니다. 선의 수만 바꿔 같은 센서 거래가 되는 것은 아닙니다.</p></div></section>

<section id="uart" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. UART 8N1은 네 바이트를 보내도 40비트가 흐릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">UART는 별도의 공유 클록 없이 양쪽이 약속한 보율에 맞춰 비트를 해석합니다. 8N1의 8은 데이터 8비트, N은 패리티 없음, 1은 정지 1비트입니다. 시작 1비트도 필요하므로 한 바이트에 10비트가 흐릅니다. 네 데이터 바이트만 115200 bit/s로 내보내면 40/115200 s≈347.2 µs입니다. RP2040의 UART0 TX/RX를 GPIO0/1에 놓을 수 있습니다.</p>
   <p className="leading-7">하지만 이 네 바이트는 앞의 I²C 레지스터 읽기 요청과 같지 않습니다. 어느 센서의 어느 레지스터인지 알려 주고 프레임 시작과 오류를 검사하려면 UART 위에 별도의 프로토콜 바이트가 필요합니다. 센서가 UART를 지원하지 않으면 이 선택 자체가 불가능합니다.</p>
   <p className="leading-7"><em>UART의 보율과 8N1 프레임만으로 응용 거래의 전체 길이를 정할 수 없습니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, Pico SDK Hardware APIs; RP2040 Datasheet UART, 원본 419–420쪽" citeKey={2} href="https://www.raspberrypi.com/documentation/pico-sdk/hardware.html">공식 SDK는 RP2040 I²C·SPI·UART 컨트롤러와 가능한 GPIO 기능을, 데이터시트는 UART 프레임 설정을 설명합니다. 예제 보율과 세 거래 형식은 가정입니다.</CitationBlock></section>

<section id="choice" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 가장 짧은 클록 시간만으로 버스를 고르지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">
            가상 하한은 I²C 157.5 µs, SPI 40 µs, UART 순수 네 바이트 347.2 µs입니다. 실제 완료 시간은 지원 장치와 배선 수, 주소·선택 방식에 따라
            달라집니다. 풀업과 부하를 확인하고 다른 컨트롤러와의 중재(7절)와 클록 스트레칭, 오류 처리와 소프트웨어 대기도 함께 계산해야 합니다. 앞 글의 1 ms 마감에 I²C 157.5 µs만
            대입해 ‘안전하다’고 결론 내릴 수 없습니다.
          </p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> I²C의 일곱 묶음은 몇 클록입니까? (답: 8·9절) UART 네 바이트는 왜 32비트가 아닙니까? (답: 13절) SPI의 40 µs를 보장 지연으로 쓸 수 있습니까? (답: 12·14절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/timers-and-sampling#limits">앞 글의 샘플 시각</Link>과 이번 거래 완료 시간은 다음 글의 작업 일정에서 함께 계산합니다.</p>
  </div></section>
</div>;
}
