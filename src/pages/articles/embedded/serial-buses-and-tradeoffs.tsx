import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SerialBusViz from "./serial-buses-and-tradeoffs/viz/SerialBusViz";

/** Invented four-byte payload with three different transaction formats and bit rates. */
export default function SerialBusesAndTradeoffsArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">같은 네 바이트라도 선 위에 놓이는 비트 수가 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글의 ADC 값 말고 외부 센서에서 네 바이트를 가져온다고 가정합니다. I²C, SPI, UART는 이름보다 실제 거래 방식을 먼저 봐야 합니다. 가상 I²C 레지스터 읽기는 주소·읽을 위치·응답 비트 때문에 63클록, SPI 거래는 한 명령과 네 데이터 바이트로 40클록, UART는 순수 데이터 네 바이트를 8N1로 보내 40비트입니다.</p>
   <p className="leading-7">세 계산은 같은 기능을 완전히 구현한 거래가 아닙니다. UART의 네 바이트에는 센서 선택·요청이 빠져 있고, SPI 명령의 뜻은 장치마다 다릅니다. 예제는 각 버스의 <strong>선로 위 최소 시간</strong>을 읽는 연습입니다.</p>
   <p className="leading-7"><em>‘네 바이트를 읽는다’는 말만으로 통신 시간을 비교할 수 없습니다.</em></p>
  </div></section>
  <section id="i2c" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">I²C는 두 선을 공유하고 주소·응답을 매 거래에 넣습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">I²C는 SDA 데이터선과 SCL 클록선을 여러 장치가 공유합니다. 가상 센서의 7비트 주소로 먼저 쓰기 방향을 고르고, 한 바이트의 레지스터 위치를 보낸 뒤 반복 START로 읽기 방향으로 전환합니다. 그다음 네 데이터 바이트를 받습니다. 각 8비트 바이트 뒤에는 응답을 위한 아홉 번째 클록이 있습니다. 마지막 데이터에는 컨트롤러가 NACK으로 읽기를 마치겠다고 알릴 수 있지만 클록 한 칸은 여전히 필요합니다.</p>
   <p className="leading-7">RP2040에서 I2C0의 SDA/SCL을 GPIO16/17에 놓는 것은 가능한 핀 선택의 한 예입니다. 실제 센서의 주소, 레지스터 자동 증가, 전기적 풀업, 속도 허용은 센서 데이터시트를 확인해야 합니다.</p>
   <p className="leading-7"><em>I²C의 두 선은 편하지만 주소·응답과 공유 버스의 대기를 함께 셉니다.</em></p>
  </div><CitationBlock source="NXP, UM10204 I²C-bus specification and user manual, Rev. 7.0 (2021), 원본 1·9–10·15쪽" citeKey={1} href="https://www.nxp.com/docs/en/user-guide/UM10204.pdf">NXP 공식 규격은 SDA/SCL 두 선, 표준·고속 모드, 매 바이트 뒤 아홉 번째 ACK 클록과 반복 START를 설명합니다. 본문의 네 바이트 센서 거래는 규격의 실측 사례가 아닙니다.</CitationBlock></section>
  <section id="count" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">I²C 400 kHz에서 일곱 묶음은 최소 157.5 µs입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">주소+쓰기, 레지스터 위치, 주소+읽기 세 묶음과 수신 데이터 네 묶음입니다. 각 묶음은 데이터 8클록과 응답 1클록이므로 (3+4)×9=63클록입니다. 클록이 400 kHz라면 1클록이 2.5 µs여서 63×2.5=157.5 µs입니다. 100 kHz라면 630 µs입니다.</p>
   <p className="leading-7">START·반복 START·STOP의 시간, 상승 시간, 장치의 클록 스트레칭, 소프트웨어·버스 대기는 위 숫자에 넣지 않았습니다. 센서가 SCL을 오래 낮게 잡으면 실제 벽시계 시간은 크게 늘 수 있습니다. 157.5 µs는 일정한 비트 클록만 센 하한입니다.</p>
   <p className="leading-7"><em>통신 속도 표기 400 kbit/s를 데이터 네 바이트에 바로 나누면 주소와 응답을 빠뜨립니다.</em></p>
  </div><SerialBusViz /><ExplainedFormula question="이 가상 I²C 읽기의 비트 클록 시간은?" idea="주소·위치·읽기 주소·데이터까지 바이트 묶음을 세고 각각 ACK 클록을 붙입니다." formula={String.raw`t_{\mathrm{clk}}=N_{\mathrm{clk}}/f_{\mathrm{SCL}}`} annotatedFormula={String.raw`t_{\mathrm{clk}}=N_{\mathrm{clk}}/f_{\mathrm{SCL}}`} operations={[{expression:String.raw`N_{\mathrm{clk}}=7\times9=63`,annotation:"주소·위치 세 묶음과 데이터 네 묶음입니다."},{expression:String.raw`1/f_{\mathrm{SCL}}=2.5\,\mu s`,annotation:"400 kHz 클록 한 주기입니다."},{expression:String.raw`t_{\mathrm{clk}}=157.5\,\mu s`,annotation:"63×2.5 µs, START·대기는 제외합니다."}]} terms={[{symbol:"N",name:"클록 수",description:"아홉 번째 응답 비트를 포함한 63개입니다."},{symbol:"f",name:"SCL 빈도",description:"가정한 400 kHz입니다."},{symbol:"t",name:"순수 클록 시간",description:"실제 완료 시간의 하한일 뿐입니다."}]} assumptions={["센서가 7비트 주소와 1바이트 위치·4바이트 연속 읽기를 지원합니다.","400 kHz가 유지되고 클록 스트레칭·START/STOP 시간은 제외합니다."]} interpretation="이 가상 I²C 거래의 비트 클록만 157.5 µs입니다. 전체 응답은 더 길 수 있습니다." /></section>
  <section id="spi" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">SPI는 선택 선과 클록 모드를 맞추고 더 적은 클록을 씁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">SPI는 보통 클록, 송신, 수신, 장치 선택 선을 씁니다. 가상의 SPI 장치가 명령 1바이트를 받고 네 바이트를 돌려준다고 놓으면 총 다섯 바이트, 40클록입니다. 1 MHz에서는 순수 클록 시간 40 µs입니다. 동시 송수신이므로 명령을 보내는 동안 돌아오는 바이트가 버려지는 값일 수 있고, 이후 네 바이트를 받으려면 송신 쪽에서 더미 바이트를 보내 클록을 만들어야 할 수 있습니다.</p>
   <p className="leading-7">RP2040 SPI1의 한 핀 조합은 GPIO8 RX, 9 CSn, 10 SCK, 11 TX입니다. 장치마다 명령 형식, CPOL/CPHA 클록 모드, CS 준비·종료 시간이 다릅니다. 40 µs는 그런 조건을 제외한 가상 선로 시간입니다.</p>
   <p className="leading-7"><em>SPI는 높은 비트 클록을 쓸 수 있지만 필요한 선과 장치별 거래 규칙이 달라집니다.</em></p>
  </div></section>
  <section id="uart" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">UART 8N1은 네 바이트를 보내도 40비트가 흐릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">UART는 별도의 공유 클록 없이 양쪽이 약속한 보율에 맞춰 비트를 해석합니다. 8N1은 시작 1비트, 데이터 8비트, 정지 1비트로 한 바이트에 10비트입니다. 네 데이터 바이트만 115200 bit/s로 내보내면 40/115200 s≈347.2 µs입니다. RP2040의 UART0 TX/RX를 GPIO0/1에 놓을 수 있습니다.</p>
   <p className="leading-7">하지만 이 네 바이트는 앞의 I²C 레지스터 읽기 요청과 같지 않습니다. 어느 센서의 어느 레지스터인지 알려 주고 프레임 시작과 오류를 검사하려면 UART 위에 별도의 프로토콜 바이트가 필요합니다. 센서가 UART를 지원하지 않으면 이 선택 자체가 불가능합니다.</p>
   <p className="leading-7"><em>UART의 보율과 8N1 프레임만으로 응용 거래의 전체 길이를 정할 수 없습니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, Pico SDK Hardware APIs; RP2040 Datasheet UART, 원본 419–420쪽" citeKey={2} href="https://www.raspberrypi.com/documentation/pico-sdk/hardware.html">공식 SDK는 RP2040 I²C·SPI·UART 컨트롤러와 가능한 GPIO 기능을, 데이터시트는 UART 프레임 설정을 설명합니다. 예제 보율과 세 거래 형식은 가정입니다.</CitationBlock></section>
  <section id="choice" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">가장 짧은 클록 시간만으로 버스를 고르지 않습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">가상 하한은 I²C 157.5 µs, SPI 40 µs, UART 순수 네 바이트 347.2 µs입니다. 다만 지원 장치, 배선 수, 주소·선택 방식, 풀업과 부하, 다른 장치의 점유, 클록 스트레칭, 오류 처리와 소프트웨어 대기를 넣으면 실제 완료 시간의 순서는 달라질 수 있습니다. 앞 글의 1 ms 마감에 I²C 157.5 µs만 대입해 ‘안전하다’고 결론 내릴 수 없습니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> I²C의 일곱 묶음은 몇 클록입니까? (답: 3절) UART 네 바이트는 왜 32비트가 아닙니까? (답: 5절) SPI의 40 µs를 보장 지연으로 쓸 수 있습니까? (답: 4·6절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/timers-and-sampling#limits">앞 글의 샘플 시각</Link>과 이번 거래 완료 시간은 다음 글의 작업 일정에서 함께 계산합니다.</p>
  </div></section>
 </div>;
}
