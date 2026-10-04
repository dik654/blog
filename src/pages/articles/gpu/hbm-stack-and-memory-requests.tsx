import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs, fileTrees } from "@/pages/articles/gpu/gpu-execution-sources/codeRefs";
import HbmPhysicalViz from "./gpu-execution-sources/HbmPhysicalViz";

/** teach-system S→B→0…7. Same 64-element trace; official source snapshots pinned. */
export default function Article() {
  const sidebar = useCodeSidebar();
  return <div className="space-y-16">
    <section id="overview" data-teach-level="S" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">1 · 메모리를 높이 쌓으면 프로그램이 왜 빨라질 수 있을까요</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">계산 장치가 값을 기다리는 동안 연산기는 일을 못 합니다. 큰 데이터를 가까운 곳에 두고 넓은 통로로 보내면 많은 계산을 먹여 살릴 수 있습니다. 하지만 통로가 넓다는 사실만으로 요청 하나의 대기 시간까지 짧아지는 것은 아닙니다.</p>
        <p className="leading-8">이 글은 64개 덧셈에 필요한 데이터를 저장 장치에서 가져오는 과정을 따라갑니다. 칩을 쌓는 모습에서 출발해 주소를 받는 제어기와 내부 읽기 동작을 연결합니다. 이어 코드의 접근 순서가 그 길을 어떻게 바꾸는지 계산합니다.</p>
      </div>
      <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대역폭과 한 요청의 대기를 나눌 질문을 세웠습니다. 먼저 계산부와 저장부 사이의 길을 펼칩니다.</p>
    </section>
    <section id="black-box" data-teach-level="B" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">2 · 계산부가 요청하면 저장부는 주소를 찾아 데이터를 보냅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">계산부는 필요한 위치를 요청합니다. 가까운 저장 공간에 없으면 요청이 큰 저장 장치로 내려갑니다. 중간 담당은 요청을 여러 통로에 나눕니다. 읽을 수 있는 순서를 정한 뒤 돌아온 값을 전달합니다.</p>
        <p className="leading-8">프로그램이 만든 연속 번호와 실제 저장 칩 안의 행·열은 서로 다른 주소 표현입니다. 물리 배치를 알아도 각 프로그램 주소가 어느 통로에 연결되는지는 별도의 변환 규칙이 있어야 정할 수 있습니다.</p>
      </div>
      <NumericPath title="데이터를 찾는 큰 경로" steps={[{"label": "계산부", "value": "주소 요청"}, {"label": "중간 담당", "value": "순서와 통로"}, {"label": "큰 저장 장치", "value": "데이터 반환"}]} />
      <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">요청과 물리 위치 사이에 변환이 있다는 점을 잡았습니다. 같은 64개를 읽는 두 접근 순서를 비교합니다.</p>
    </section>
    <section id="case" data-teach-level="0" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">3 · 유효 128바이트를 읽어도 필요한 조각은 4개 또는 32개입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">4바이트 원소 64개를 갖는 배열 두 개를 더합니다(가정). 두 입력 512바이트와 출력 256바이트, 덧셈 64번이 기준입니다. 그중 32개 작업이 입력 하나를 읽는 순간만 확대합니다.</p>
        <p className="leading-8">NVIDIA의 32바이트 요청 조각 규칙을 적용하고 시작 주소가 128바이트에 정렬됐다고 놓습니다. 32개가 연속 원소를 읽으면 128바이트가 4 조각에 들어갑니다. 각 작업의 원소 번호가 8씩 증가하면 주소 간격은 32바이트여서 32 조각에 걸립니다. 유효한 값은 둘 다 128바이트입니다. 뒤 사례는 최소 249개 원소가 들어 있는 넓은 입력에서 32개를 고르는 변형이며 64개 배열 밖을 읽으라는 뜻이 아닙니다.</p>
      </div>
      <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">4개와 32개는 같은 128바이트를 요청하는 두 방식입니다. 이제 저장 장치의 실제 형태를 봅니다.</p>
    </section>
    <section id="picture" data-teach-level="1" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">4 · 여러 층의 저장 칩이 넓은 아래 통로로 연결됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">여러 장의 얇은 저장 칩을 위로 쌓습니다. 층 사이를 관통하는 전기 연결로 아래쪽 인터페이스에 모읍니다. 계산 칩과 쌓인 저장 칩은 넓은 연결판을 통해 가까이 붙습니다. 높이 쌓는 목적에는 작은 바닥 면적에 용량을 넣는 일도 있습니다.</p>
        <p className="leading-8">그림의 네 층은 연결 원리를 보여 주는 모형입니다. 층 수와 실제 용량은 제품마다 다릅니다. 층을 두 배 쌓았다고 외부 통로의 폭과 데이터 속도가 자동으로 두 배가 되지는 않습니다.</p>
      </div>
      <HbmPhysicalViz />
      <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            층 수와 바깥 통로를 구별했습니다. 연결을 넓힐 때 드는 비용을 확인합니다.
          </p>
    </section>
    <section id="need" data-teach-level="2" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">5 · 많은 연결선은 처리량을 키우지만 열과 제조 비용도 늘립니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">좁은 통로의 신호만 빠르게 움직이는 방법에는 전력과 신호 품질 부담이 있습니다. 가까운 거리에서 많은 선을 함께 쓰면 선 하나의 속도에만 의존하지 않고 총 전송량을 늘릴 수 있습니다.</p>
        <p className="leading-8">대신 여러 층의 연결 품질, 쌓인 칩의 수율, 열을 빼내는 경로와 패키지 조립 비용을 관리해야 합니다. 저장 셀의 전하는 시간이 지나면 새므로, 데이터를 유지하는 동작도 계속 필요합니다. 이 동작은 유효 데이터 전송과 같은 통로·시간 자원을 나누어 씁니다. 셀에 전하가 저장되고 누설되는 출발점은 <Link to="/electronics/circuits/storage-elements-and-transients#capacitor">축전기의 전압과 저장 전하</Link>입니다. 실제 DRAM 셀의 크기·누설·감지 회로는 이상적인 축전기 한 개보다 더 많은 조건을 갖습니다.</p>
      </div>
      <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">넓은 통로에도 기다림과 유지 비용이 남습니다. 물리 구조와 명령의 이름을 나눠 붙입니다.</p>
    </section>
    <section id="names" data-teach-level="3" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">6 · 적층과 채널, 행을 여는 동작은 서로 다른 역할입니다</h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table data-role-name-table className="w-full table-fixed text-left text-sm leading-7">
          <caption className="sr-only">앞에서 본 역할에 이름 붙이기</caption>
          <thead className="hidden bg-neutral-50 sm:table-header-group dark:bg-neutral-900"><tr><th scope="col" className="w-[30%] p-3 align-top">앞에서 본 역할</th><th scope="col" className="p-3 align-top">이름과 이 사례에서의 뜻</th></tr></thead>
          <tbody>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">넓은 연결로 전송량을 높인 메모리</th><td className="block break-words p-3 align-top sm:table-cell">High Bandwidth Memory, 줄여서 HBM입니다. 넓은 인터페이스와 적층으로 높은 대역폭을 얻는 메모리 계열입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">층 사이와 칩 사이의 연결</th><td className="block break-words p-3 align-top sm:table-cell">층을 관통하는 전기 연결은 TSV입니다. 계산 칩과 메모리 스택을 연결하는 중간 배선판은 interposer입니다. 수직 연결과 수평 연결이라는 서로 다른 역할입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">명령과 데이터를 나눠 보내는 통로</th><td className="block break-words p-3 align-top sm:table-cell">독립적인 통로는 channel입니다. HBM3의 데이터 폭은 16개 × 64비트 = 1024비트이며, 각 channel을 두 32비트 pseudo-channel로 다룰 수 있습니다. TSV의 전체 개수와 데이터 폭 1024비트는 같은 숫자가 아닙니다. 전원과 제어 등의 연결도 필요합니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">메모리 안의 작업 구역</th><td className="block break-words p-3 align-top sm:table-cell">Bank입니다. 읽으려는 행을 열어 감지한 값을 임시로 잡는 곳은 row buffer입니다. 열린 행에서 필요한 열을 골라 읽고, 다른 행으로 바꾸려면 닫고 다시 여는 시간이 들 수 있습니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">저장한 값을 유지하는 동작</th><td className="block break-words p-3 align-top sm:table-cell">셀 값을 주기적으로 되살리는 동작은 refresh입니다.</td></tr>
            <tr className="block border-t border-neutral-200 sm:table-row dark:border-neutral-800"><th scope="row" className="block break-words px-3 pb-0 pt-3 align-top font-medium sm:table-cell sm:pb-3">주소에 맞춰 명령을 배치하는 곳</th><td className="block break-words p-3 align-top sm:table-cell">GPU 쪽 memory controller는 주소를 통로·bank·행·열로 연결하고 명령 순서와 타이밍 제약을 관리합니다. 프로그램 주소의 일부 비트를 그대로 channel 번호라고 가정할 수는 없습니다.</td></tr>
          </tbody>
        </table>
      </div>
      <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 메모리에도 물리 연결·명령 통로·셀 동작이라는 층이 있습니다. 64개 요청을 이 층들에 통과시킵니다.</p>
    </section>
    <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">7 · 요청을 합친 뒤에도 행을 열고 기다리는 동작이 남습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">앞의 64개 덧셈은 유효 512바이트를 읽고 256바이트를 씁니다. 먼저 작업별 주소가 모이고 cache를 조회합니다. Cache에서 찾지 못한 요청은 메모리 제어기로 내려갑니다. 제어기는 실제 주소를 해석해 해당 channel과 bank의 대기열에 넣습니다.</p>
        <p className="leading-8">필요한 행이 이미 열려 있으면 그 행의 열을 읽을 수 있습니다. 다른 행이 열렸다면 기존 행을 닫는 precharge와 새 행을 여는 activate가 필요합니다. 읽기 명령 뒤 데이터가 통로를 지나 돌아옵니다. Refresh가 필요한 구역은 정해진 타이밍을 지켜야 합니다. 다른 bank의 작업과 겹칠 수 있는 정도는 제품과 controller에 달려 있습니다.</p>
        <p className="leading-8">시작 주소가 128바이트 경계에 맞고 NVIDIA compute capability 6.0 이상의 32바이트 sector 규칙을 적용한다고 놓습니다. 이때 4바이트 원소 32개의 연속 읽기는 요청 단계에서 4 sectors에 걸칩니다. 32바이트 간격 읽기는 32 sectors에 걸칩니다. 전자가 가까운 주소를 합치기 좋다는 것은 계산할 수 있습니다. 그러나 4 sectors가 HBM 명령 4개라는 결론은 아닙니다. 아래 계층의 cache hit, 요청 병합, burst 크기와 쓰기 정책이 물리 전송량을 바꿉니다.</p>
        <p className="leading-8">주소 bit →channel·bank 대응은 GPU별 공개 자료가 있어야 정할 수 있습니다. 자료가 없다면 추측해 그리지 않습니다. 큰 stride가 항상 같은 channel에 몰린다고 단정할 수는 없습니다. 접근 간격을 바꿔 지연과 실제 DRAM byte counter를 측정합니다. 이번 원소 번호 37은 논리 주소의 148바이트 offset까지만 확정할 수 있습니다.</p>
      </div>
      <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">논리 주소 148바이트와 물리 행·열 사이에 남는 정보를 확인했습니다. 공식 인터페이스 수치로 넓은 통로를 계산합니다.</p>
    </section>
    <section id="source" data-teach-level="5" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">8 · HBM3의 1024비트 폭에 가정한 속도를 곱합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">Synopsys의 HBM3 PHY 설명은 16개의 64비트 channel과 32개의 32비트 pseudo-channel을 제시합니다. 두 표현 모두 총 데이터 폭 1024비트입니다. 여기서는 선 하나당 초당 8기가비트를 보낸다고 놓습니다(속도는 계산 가정).</p>
        <p className="leading-8">1024×8Gb/s÷8 =1024GB/s, 즉 스택 하나의 이론상 1.024TB/s입니다. 8개 스택을 같은 조건으로 동시에 쓰면 8.192TB/s가 됩니다. 이것은 신호 데이터 폭으로 구한 상한입니다. Refresh·명령 대기·읽기 쓰기 전환·접근 불균형을 차감한 측정값은 아닙니다.</p>
        <p className="leading-8">64개 덧셈의 768바이트를 1.024TB/s로 나누면 0.75ns입니다. 이 값은 데이터가 통로를 가득 채워 흐르는 정상 상태의 물량 비율입니다. 한 kernel이나 첫 응답이 0.75ns에 끝난다는 예측은 아닙니다. 요청과 주소 해석, 행 동작, 돌아오는 대기가 별도로 있습니다.</p>
      </div>
      <SourceApplication source="Synopsys HBM3 PHY ·interface features" excerpt="16 independent 64-bit memory channels" application="16×64 = 1024비트. 가정한 8Gb/s/pin을 곱하고 8로 나누면 스택당 1.024TB/s입니다. 유효 768바이트를 나눈 0.75ns를 응답 지연으로 오해하지 않습니다." /><CitationBlock source="Synopsys HBM3 PHY ·interface features" citeKey={1} href="https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-phy.html">Synopsys HBM3 PHY ·interface features</CitationBlock>
      <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">폭 × 속도는 처리량 상한이며 첫 값의 도착 시간이 아님을 계산했습니다. 코드에서 세는 바이트와 대조합니다.</p>
    </section>
    <section id="comparison" data-teach-level="6" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">9 · 같은 64개 덧셈의 연산량과 바이트를 같은 경계에서 셉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">NVIDIA vectorAdd 원문은 각 원소마다 입력 둘을 읽고 출력 하나를 씁니다. 사례를 넣으면 64×(4 +4 +4)=768바이트입니다. 원문의 추가 0.0f를 compiler가 제거한 단일 덧셈 경로를 가정하면 덧셈은 64번입니다. 따라서 유효 데이터 기준 연산 강도는 64÷768 =1/12FLOP/B입니다. Cache에서 입력을 재사용한다면 HBM에서 실제로 읽은 양으로 계산한 비율은 달라질 수 있습니다.</p>
        <p className="leading-8">32개 읽기의 stride를 8로 바꾸면 유효 128바이트는 그대로지만 주소가 32 sectors에 흩어집니다. 원문 코드는 연속 접근이며 stride 8은 접근 규칙을 바꾼 사고 실험입니다. 실제 수정에서는 입력 길이를 넓혀 경계 검사를 유지해야 합니다. 연산 강도를 낮추는 추가 전송이 있는지는 선택한 계층의 counter로 확인합니다.</p>
        <p className="leading-8">HBM3E는 HBM3보다 빠른 제품군이지만 모든 칩의 속도·층 수·용량을 같게 쓰지 않습니다. 예를 들어 CDNA4 MI350X·MI355X 백서의 288GB와 8TB/s는 정해진 제품 구성 수치입니다. 위의 가정 계산 8.192TB/s를 그 제품의 보장 실효 대역폭으로 치환하지 않습니다.</p>
        <p className="leading-8">Roofline에서는 같은 관측 경계의 바이트와 해당 연산 종류의 계산 상한을 짝지어 봅니다. 상세 계산은 <Link to="/cs/gpu/gpu-memory-hierarchy-and-roofline#roofline-bound">64개 덧셈의 roofline</Link>로 이어집니다. 메모리 용량은 한 번에 담을 수 있는 양이고 대역폭은 시간당 옮기는 양이므로 서로 대신 쓸 수 없습니다.</p>
        <p className="leading-8">HBM4의 공개 PHY는 32개의 64비트 channel, 총 2048비트 폭을 제시합니다. 같은 8Gb/s/pin을 가정하면 2048×8/8=2048GB/s, 즉 2.048TB/s입니다. 앞의 HBM3보다 폭이 두 배라 나온 계산이며 응답 지연이 절반이라는 뜻은 아닙니다. 이 수치는 인터페이스 계산이고 특정 GPU의 출하나 실측 성능을 뜻하지 않습니다.</p>
      </div>
      <CodeViewButton label="실제 vectorAdd의 입력 2회·출력 1회" onClick={() => sidebar.open("cuda-kernel", codeRefs["cuda-kernel"])} /><SourceApplication source="NVIDIA vectorAdd · 3f1c509 · 52행" excerpt="C[i] = A[i] + B[i] + 0.0f;" application="64개에서 유효 읽기 512B + 쓰기 256B = 768B입니다. compiler가 불필요한 0.0f를 제거한 단일 덧셈 경로를 계산 모델로 두면 64FLOP입니다." /><CitationBlock source="NVIDIA vectorAdd · 3f1c509 · 52행" citeKey={2} href="https://github.com/NVIDIA/cuda-samples/blob/3f1c50965017932fc81e6d94a3fc9e04c105b312/Samples/0_Introduction/vectorAdd/vectorAdd.cu">NVIDIA vectorAdd · 3f1c509 · 52행</CitationBlock><CitationBlock source="Synopsys HBM3 Controller ·command scheduling" citeKey={3} href="https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm3-controller.html">Controller가 관리하는 channel·bank와 메모리 명령 지원 범위를 확인합니다.</CitationBlock><CitationBlock source="AMD CDNA4 Architecture 2258402-C ·11쪽" citeKey={4} href="https://www.amd.com/content/dam/amd/en/documents/instinct-tech-docs/white-papers/amd-cdna-4-architecture-whitepaper.pdf">MI350 계열의 메모리 구성은 해당 SKU 공식 수치에 한정합니다.</CitationBlock><CitationBlock source="Synopsys HBM4 PHY ·2026-10-04 확인" citeKey={5} href="https://www.synopsys.com/designware-ip/interface-ip/hbm/hbm4-phy.html">HBM4의 2048비트 인터페이스와 64개 32비트 pseudo-channel을 확인합니다.</CitationBlock>
      <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물리 통로와 코드의 바이트를 같은 단위로 연결했습니다. 추정할 수 없는 범위를 정리합니다.</p>
    </section>
    <section id="limits" data-teach-level="7" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10 · 메모리 사양은 서로 다른 단위로 읽어야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">층 수가 늘어나는 것은 주로 용량과 패키지 구성의 변화입니다. 외부 폭과 pin 속도가 유지되면 층 수에 비례해 대역폭이 늘지 않습니다. 작은 pointer chasing처럼 다음 주소가 직전 값에 의존하는 작업은 넓은 통로를 채우지 못하고 지연에 묶일 수 있습니다.</p>
        <p className="leading-8">HBM4의 2048비트 구조에 HBM3의 1024비트·16 channels를 그대로 복사하지 않습니다. 공개 표준·PHY 지원과 메모리 제품 생산, GPU 제품 출하는 서로 다른 확인 사항입니다. 실제 부품 선택에는 제조사 part number와 revision, 지원 controller를 함께 기록합니다.</p>
        <p className="leading-8">채널 균형과 refresh의 실제 비용은 설정·온도·주소 변환·접근 패턴을 고정해 측정합니다. 이 글은 실측 대역폭 결과를 제시하지 않습니다. 공개되지 않은 주소 매핑과 controller 스케줄러의 정확한 정책은 남은 정보로 명시합니다.</p>
      </div>
      <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">칩 사진의 적층 모양과 프로그램의 대기를 한 줄의 성능 수치로 합치지 않고 설명할 수 있습니다.</p>
    </section>
    <ReviewPrompts questions={["768B÷1.024TB/s=0.75ns이면 첫 값도 0.75ns 만에 옵니까? (답: 8절)", "32개 작업의 stride 8이 32 sectors면 HBM 명령도 반드시 32개입니까? (답: 7절)", "적층 높이만 두 배가 되면 대역폭도 두 배가 됩니까? (답: 4·10절)"]} />
    <CodeSidebar codeRefKey={sidebar.codeRefKey} codeRef={sidebar.codeRef} onClose={sidebar.close} onNavigate={sidebar.navigate} codeRefs={codeRefs} fileTrees={fileTrees} projectMetas={{ cuda: { id: "cuda", label: "NVIDIA cuda-samples · v13.0", badgeClass: "bg-sky-50 border-sky-300 text-sky-800" }, hip: { id: "hip", label: "ROCm HIP-Examples · pinned source", badgeClass: "bg-amber-50 border-amber-300 text-amber-800" } }} />
  </div>;
}
