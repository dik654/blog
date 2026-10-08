import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ReviewPrompts from "../../world-systems/ReviewPrompts";
import ZkCaseDiagram from "../ZkCaseDiagram";

/** 원문 확인: 2026-10-04. 작은 수치는 별도 가정입니다. */
export default function Article() { return <article className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">1. 증거가 작아도 만드는 컴퓨터는 큰 작업 공간이 필요합니다</h2>
<p className="leading-8">몇백 바이트의 증거만 전송하면 된다는 설명을 보고 작은 컴퓨터로도 쉽게 만들 수 있다고 생각하기 쉽습니다. 그러나 결과물의 크기와 그 결과를 만드는 동안 보관한 자료의 크기는 다릅니다.</p>
<p className="leading-8">이 글은 한 작업에서 생성기의 메모리와 확인자의 연산 비용을 각각 계산합니다. 앞의 <a href="/cs/crypto/stark-theory">실행표</a>와 <a href="/cs/crypto/polycommit">커밋먼트</a>가 실제 자원을 얼마나 요구하는지 연결하는 것이 목표입니다.</p>

<p data-stage-bridge="overview" className="text-sm leading-7 text-muted-foreground">전송할 결과와 작업 공간을 나눴습니다. 두 컴퓨터의 서로 다른 장부를 봅니다.</p>
</section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">2. 만드는 쪽은 자료를 펼치고 확인하는 쪽은 증거를 검사합니다</h2>
<p className="leading-8">만드는 쪽에는 실행 기록, 넓게 펼친 평가값, 중간 연산의 입력과 출력이 놓입니다. 확인하는 쪽에는 증거, 공개값, 검증 규칙이 놓입니다. 둘이 같은 크기의 자료를 저장하는 것은 아닙니다.</p>
<p className="leading-8">메모리에서는 어느 시점에 어떤 자료가 동시에 남아 있는지가 중요합니다. 먼저 쓰고 버린 자료와 나중에 생긴 자료를 무조건 더하면 실제 최고점보다 크게 셀 수 있고 동시에 남는 임시 자료를 빼면 부족하게 셉니다.</p>

<p data-stage-bridge="black-box" className="text-sm leading-7 text-muted-foreground">공간의 최고점과 검증 작업을 따로 세기로 했습니다. 크기를 정한 한 사례를 만듭니다.</p>
</section>
<section id="case" data-calculation-explained data-teach-level="0" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">3. 104만 8576행에 64개 값이 있다면</h2>
<p className="leading-8">실행표가 2²⁰=1,048,576행,64열이며 각 값이 4바이트라고 합시다. 원본은 1,048,576행 × 행마다 64개 값 × 값마다 4바이트 = 268,435,456바이트, 즉 256MiB입니다. 표를 8배 많은 위치에서 평가하면 2GiB입니다. 모두 설명용 가정이며 특정 증명기의 실측값은 아닙니다.</p>
<p className="leading-8">넓힌 표의 입력과 출력 두 개를 동시에 보관하면 4GiB이고 원본까지 유지하면 4.25GiB입니다. 최종 증거가 작더라도 이 자료들은 별도로 존재할 수 있습니다. 비교할 검증 사례는 페어링쌍 4개와 공개 입력 3개의 연산으로 정합니다.</p>

<p data-stage-bridge="case" className="text-sm leading-7 text-muted-foreground">원본 256MiB와 중간 4.25GiB를 계산했습니다. 같은 시간에 남는 것을 그립니다.</p>
</section>
<section id="picture" data-teach-level="1" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">4. 순간별로 남은 버퍼를 더하고 가장 큰 순간을 고릅니다</h2>
<p className="leading-8">첫 순간에는 원본 256MiB만 있습니다. 다음에는 2GiB 평가표를 만들고 변환 동안 출력용 2GiB가 추가될 수 있습니다. 변환이 끝난 뒤 입력표를 해제하면 용량이 다시 줄어듭니다.</p>
<p className="leading-8">해시 트리나 곡선 연산의 작업 공간이 그동안 겹치면 최고점은 더 커집니다. 같은 버퍼를 제자리에서 덮어쓰는지, 앞 단계의 값을 후속 검사 때문에 남겨 두는지도 알아야 합니다.</p>
<ZkCaseDiagram title="가정한 평가 단계의 동시 생존량" steps={["원본 256MiB", "평가 2GiB + 출력 2GiB", "원본 포함 4.25GiB"]} arrows={["평가 확장", "동시에 유지"]} />
<p data-stage-bridge="picture" className="text-sm leading-7 text-muted-foreground">총파일 크기 대신 동시 생존량을 세는 방법을 잡았습니다. 두 비용의 연결을 살펴봅니다.</p>
</section>
<section id="need" data-teach-level="2" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">5. 속도를 높이는 선택이 메모리를 늘릴 수 있습니다</h2>
<p className="leading-8">값을 미리 계산해 두면 나중의 곱셈을 줄일 수 있지만 저장할 표가 커집니다. 여러 작업을 동시에 실행하면 장치를 더 잘 사용할 수 있으나 각 작업의 버퍼가 겹칩니다. 병렬성이 커졌다는 말만으로 한 작업의 지연이나 메모리가 줄었다고 할 수 없습니다.</p>
<p className="leading-8">확인 비용을 줄이려고 마지막에 다른 증명으로 감싸면 새 증거를 만드는 시간이 추가됩니다. 생성기의 연산 시간, 메모리, 최종 검증 비용을 한 숫자로 합쳐 최고 방식을 정할 수 없는 이유입니다.</p>

<p data-stage-bridge="need" className="text-sm leading-7 text-muted-foreground">계산·저장·검증의 교환 관계를 확인했습니다. 측정에 쓰는 이름과 단위를 붙입니다.</p>
</section>
<section id="names" data-teach-level="3" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">6. 바이트·대역폭·가스를 다른 단위로 읽습니다</h2>
<p className="leading-8">GPU의 고대역폭 메모리는 HBM이며 용량과 대역폭은 다릅니다. 용량은 바이트, 대역폭은 초당 바이트입니다. GB는 10⁹바이트, GiB는 2³⁰바이트, MiB는 2²⁰바이트이므로 단위를 맞춰 비교해야 합니다.</p>
<p className="leading-8">평가 영역을 확장하는 LDE와 다항식 변환 NTT는 많은 필드값을 읽고 씁니다. 여러 스칼라와 곡선점을 곱해 더하는 MSM은 입력점·스칼라와 중간 버킷을 보관합니다. 출력한 점 하나의 크기만 세면 이 작업 공간을 빠뜨립니다.</p>
<p className="leading-8">Ethereum의 gas는 실행 규칙에서 정한 비용 단위입니다. 초나 GPU의 연산량과 같은 단위가 아닙니다. precompile은 클라이언트가 직접 지원하는 암호 연산이며 규칙이 정한 요율로 비용을 셉니다.</p>

<p data-stage-bridge="names" className="text-sm leading-7 text-muted-foreground">공간·속도·프로토콜 요금을 분리했습니다. 같은 표의 해시와 작업 공간까지 더합니다.</p>
</section>
<section id="mechanism" data-teach-level="4" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">7. 평가표와 해시 자료의 최고점을 계산합니다</h2>
<p className="leading-8">8배 평가표의 행은L=8,388,608개입니다. 한 행을 하나의 32바이트 해시 잎으로 묶고 모든 잎과 내부 노드를 보관하는 완전 이진트리를 가정하면 노드수는 2L−1입니다. 해시 자료는 536,870,880바이트로 512MiB보다 32바이트 작습니다.</p>
<p className="leading-8">원본 256MiB, 평가 버퍼 두 개 4GiB, 이 해시 자료가 모두 같은 순간에 남으면 약 4.75GiB입니다. 한쪽 평가표를 먼저 해제하면 약 2.75GiB로 내려갑니다. 이 두 숫자의 차이는 증명 방식의 이름이 아니라 자료의 생존 시점에서 나옵니다.</p>
<p className="leading-8">변환을 여러 번 왕복하며 읽고 쓰는 총바이트는 이 최고점보다 클 수 있습니다. 반대로 작업을 나누거나 일부만 재계산하면 최고점을 낮추고 추가 연산을 지불할 수 있습니다. 실제 장치에서는 할당기 여유, 실행 중 라이브러리 공간, 전송용 버퍼도 확인합니다.</p>
<ExplainedFormula question="최대 메모리는 어떻게 계산하나요?" idea="각 시점에 살아 있는 버퍼의 크기를 더하고, 시간에 따른 합의 최댓값을 고릅니다." formula={String.raw`M_{\mathrm{peak}}=\max_t\sum_{b\in\mathrm{live}(t)}\mathrm{bytes}(b)`} annotatedFormula={String.raw`M_{\mathrm{peak}}=\max_t\sum_{b\in\mathrm{live}(t)}\mathrm{bytes}(b)`} operations={[{"expression": "\\mathrm{live}(t)", "annotation": ["시각t에 아직 해제되지 않은 버퍼만 셉니다."]}, {"expression": "\\max_t", "annotation": ["모든 순간의 합 중 장치가 감당해야 할 가장 큰 합입니다."]}]} terms={[{"symbol": "b", "name": "버퍼", "description": "원본·평가값·해시·작업공간 등입니다."}, {"symbol": "t", "name": "실행 시점", "description": "같이 살아 있는지 판정합니다."}, {"symbol": "bytes", "name": "크기", "description": "같은 바이트 단위로 더합니다."}]} interpretation="가정한 최고점은 256MiB+4GiB+(512MiB−32B)입니다." assumptions={["각 버퍼의 실제 원소 크기와 패딩을 사용합니다.", "서로 다른 장치의 용량은 한 장치의 자유 공간처럼 합치지 않습니다."]} /><AlgorithmBlock title="메모리 최고점 산정 (의사코드)" input={["버퍼별 바이트 수와 할당·해제 시점"]} steps={[{"code": "각 시점의 할당은 live 집합에 넣고 해제는 제거", "note": "동일 공간 재사용은 중복 합산하지 않습니다."}, {"code": "현재합←Σ bytes(live); peak←max(peak,현재합)", "note": "장치별로 따로 계산합니다."}, {"code": "측정한 할당기·런타임 여유를 추가해 계산값과 실측 최고점 비교", "note": "논리 배열 크기와 프로세스 사용량을 구분합니다."}]} output="장치별 예상 최고점과 남는 여유" />
<p data-stage-bridge="mechanism" className="text-sm leading-7 text-muted-foreground">동시 유지와 먼저 해제의 2GiB 차이를 계산했습니다. 공식 구현 문서의 최고점 식에 다른 암호 작업을 넣습니다.</p>
</section>
<section id="source" data-calculation-explained data-teach-level="5" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">8. MSM은 순차적으로 바뀌는 작업공간의 최댓값을 셉니다</h2>
<p className="leading-8">ICICLE2.8.0 공식 문서는 스칼라와 인덱스가 살아 있는 단계, 스칼라·점·버킷이 살아 있는 단계의 최댓값으로 메모리를 추정합니다. 해당 버전 알고리즘의 생존 시점 사례이며 현재 최신판에 보편적으로 적용되는 공식이라는 뜻은 아닙니다.</p>
<p className="leading-8">같은 2²⁰개 항에 스칼라 32바이트, 점 64바이트, 버킷점 96바이트, 스칼라 256비트, 창 16비트, 사전계산배수 1, 배치 1을 가정합니다. 창 묶음은 16개입니다. 스칼라 32MiB, 인덱스약 384MiB, 점 64MiB, 버킷 96MiB여서 max(32+384,32+64+96)=416MiB입니다.</p>
<p className="leading-8">창을 18비트로 바꾸면 묶음은 15개로 줄지만 버킷은 점마다 96바이트 × 15묶음 × 묶음마다 2¹⁸개 = 377,487,360바이트, 곧 360MiB로 늘어납니다. 인덱스 360MiB와 스칼라 32MiB인 단계는 392MiB, 점과 버킷 단계는 456MiB이므로 새 최고점은 456MiB입니다. 연산 묶음이 줄어도 메모리가 늘어나는 반례입니다.</p>
<div id="source-icicle"><CitationBlock source="ICICLE2.8.0 · MSM / Memory usage estimation" citeKey={1} href="https://dev.ingonyama.com/2.8.0/icicle/primitives/msm"><p className="leading-8">원문: <q>max(scalars + scalarIndices, scalars + points + buckets)</q></p><p className="leading-8">창 16에서는 max(416,192)=416MiB, 창 18에서는 max(392,456)=456MiB입니다. 구체적인 값은 자료형과 파라미터 가정에서 나왔으며 전체 증명기의 실측값은 아닙니다.</p></CitationBlock></div>
<p data-stage-bridge="source" className="text-sm leading-7 text-muted-foreground">공식 식에서 416→456MiB가 되는 조건을 계산했습니다. 확인자의 비용은 다른 식으로 셉니다.</p>
</section>
<section id="comparison" data-teach-level="6" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">9. 페어링쌍 4개와 공개입력 3개의 가스를 따로 계산합니다</h2>
<p className="leading-8">EIP1108의 BN254 연산표에서 페어링 검사는 34,000k+45,000gas입니다. k=4이면 181,000gas입니다. 공개입력 하나마다 스칼라곱 1회와 점덧셈 1회를 하는 검증기 구성을 가정하면 입력 3개는 3×(6,000+150)=18,450gas입니다. 두 원시 연산의 합은 199,450gas입니다.</p>
<p className="leading-8">이는 전체 거래 가스의 실측값이 아닙니다. 호출·메모리·입력검사·ABI·calldata·기본 거래 비용과 구현상의 추가 연산이 남습니다. EIP197에서 한 페어링쌍의 인코딩은 192바이트이므로 4쌍은 768바이트입니다. 이 내부 호출 입력을 전송한 증거의 크기와 동일하다고 보지 않습니다.</p>
<p className="leading-8">같은 형태에서 공개 입력만 8개로 늘리면 181,000+8×6,150=230,200gas로 30,750gas가 추가됩니다. 최종 증거의 군 원소 개수가 같아도 공개 입력의 선형결합 비용은 늘 수 있습니다. 가스 요율은 2026-10-04 확인한 EIP1108의 표를 적용했습니다. 다른 체인·곡선·추후 요율에는 그대로 쓰지 않습니다.</p>
<div id="source-eip1108"><CitationBlock source="EIP1108 · Specification 요율표" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-1108"><p className="leading-8">원문: <q>34 000 * k + 45 000</q></p><p className="leading-8">k=4를 대입하면 181,000gas입니다. ECADD 150, ECMUL 6,000을 공개 입력 3개에 적용한 18,450gas를 더하면 199,450gas입니다.</p></CitationBlock></div><div id="source-eip197"><CitationBlock source="EIP197 · Encoding" citeKey={1} href="https://eips.ethereum.org/EIPS/eip-197"><p className="leading-8">원문: <q>192</q></p><p className="leading-8">페어링 입력 한 쌍 192바이트에 4를 곱하면 768바이트입니다. proof 바이트나 전체 거래 가스와 다른 양입니다.</p></CitationBlock></div>
<p data-stage-bridge="comparison" className="text-sm leading-7 text-muted-foreground">작업 메모리와 원시 검증 가스를 각각 계산했습니다. 마지막으로 압축과 하드웨어 선택의 한계를 봅니다.</p>
</section>
<section id="limits" data-teach-level="7" className="scroll-mt-20 space-y-6">
<h2 className="text-2xl font-bold">10. 검증을 줄이는 선택은 새 비용과 가정을 가져옵니다</h2>
<p className="leading-8">STARK 증거를 Groth16 같은 다른 증명으로 감싸면 온체인 검증 방식과 증거 크기를 바꿀 수 있습니다. 대신 감싸는 증명의 생성 시간·키·준비와 곡선 가정이 추가됩니다. 안쪽이 해시 기반이라는 이유만으로 바깥쪽 곡선까지 양자 내성인 것은 아닙니다.</p>
<p className="leading-8">두 GPU의 메모리를 합한 숫자가 충분해도 한 장치에 동시에 올려야 할 버퍼가 크면 실행에 실패할 수 있습니다. 작업 분할이 가능한지, 공통 자료가 복제되는지, 장치 사이 전송이 얼마나 필요한지를 확인합니다. 연산을 더 병렬화할 때도 HBM 대역폭과 전송 시간을 함께 측정합니다.</p>
<p className="leading-8">Ethereum에서 빠른 블록 증명을 연구하는 목표와 합의 규칙으로 증명을 요구하는 상태도 다릅니다. <a href="/cs/blockchain/ethereum-future-roadmap">현재 채택 상태 정본</a>을 따로 확인합니다. 같은 보안 목표·프로그램·입력·버전·하드웨어에서 생성 시간, 장치별 최대 메모리, 증거 크기, 검증 가스를 각각 기록해야 실제 선택이 가능합니다.</p>

<p data-stage-bridge="limits" className="text-sm leading-7 text-muted-foreground">생성기의 바이트와 검증기의 gas를 각각 계산할 수 있게 됐습니다. 가정을 바꾸어 비용이 움직이는지 확인합니다.</p>
<ReviewPrompts questions={["평가 입력 버퍼 2GiB를 해시 생성 전에 해제하면 가정한 최고점은 왜 달라지나요? (답: 7절)", "MSM 창을 16에서 18로 늘리면 왜 416MiB가 456MiB로 늘 수 있나요? (답: 8절)", "공개 입력을 3개에서 8개로 늘리면 가정한 원시 연산 gas는 얼마나 추가되나요? (답: 9절)"]} />
</section>
</article>; }
