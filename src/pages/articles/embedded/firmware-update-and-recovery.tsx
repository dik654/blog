import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import FirmwareRecoveryViz from "./firmware-update-and-recovery/viz/FirmwareRecoveryViz";

/** Hypothetical 4 MiB external-flash layout and MCUboot-style test-swap sequence, not RP2040 bootrom behavior. */
export default function FirmwareUpdateAndRecoveryArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">새 펌웨어가 시작되지 않아도 옛 버전으로 돌아오려면</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글까지 장치는 센서와 제어 작업을 제때 실행했습니다. 이제 v1 펌웨어에 문제가 있어 v2를 넣는다고 합시다. 전원이 다운로드 중이나 이미지 교체 중 끊길 수도 있고, v2가 부팅은 해도 센서를 읽지 못할 수도 있습니다. 출하된 장치의 업데이트는 새 파일을 쓰는 일에서 끝나지 않습니다.</p>
   <p className="leading-7">이 글은 <strong>가상의 RP2040 제품 보드</strong>에 4 MiB 외부 플래시와 이중 이미지 슬롯, MCUboot의 시험 부팅·되돌리기 방식에 해당하는 사용자 부트로더를 설계했다고 가정합니다. RP2040의 내장 부트 ROM이 이 앱 슬롯 전환을 자동 제공한다는 주장은 아닙니다.</p>
   <p className="leading-7"><em>옛 버전을 보존하고, 새 버전은 검증 후 시험하고, 정상 동작을 확인한 뒤 확정합니다.</em></p>
  </div></section>
  <section id="layout" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4 MiB 안에 두 이미지와 복구 공간을 함께 잡습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">가상 외부 플래시 4 MiB는 4096 KiB입니다. 부트·복구 코드 256 KiB, 현재 앱 슬롯 1536 KiB, 후보 앱 슬롯 1536 KiB를 두면 설정·교체 보조 공간으로 768 KiB가 남습니다. 256+1536+1536+768=4096입니다. 이미지 슬롯의 머리말·서명·꼬리말과 플래시 지우기 단위도 자리에서 빠지므로 실제 앱 파일의 최대 크기는 1536 KiB보다 작습니다.</p>
   <p className="leading-7">RP2040은 외부 QSPI 플래시를 XIP로 읽습니다. 칩 안 부트 ROM은 외부 플래시의 다음 부팅 단계를 찾고 USB BOOTSEL 복구 경로도 제공합니다. 이 하드웨어 경로 위에 두 앱 슬롯, 검증 키, 시험·확정 상태를 기록하는 사용자 부트로더와 메모리 배치가 추가로 필요합니다.</p>
   <p className="leading-7"><em>두 번째 앱을 보관할 자리를 먼저 남겨야 현재 앱을 쓰는 동안 후보를 받을 수 있습니다.</em></p>
  </div><FirmwareRecoveryViz /><ExplainedFormula question="가상 4 MiB 플래시에서 두 앱 슬롯 뒤 남는 공간은?" idea="전체 KiB에서 부트·복구와 두 이미지 슬롯을 뺍니다." formula={String.raw`R=F-B-2S`} annotatedFormula={String.raw`\underbrace{R}_{\text{남는 공간}}=F-B-2S`} operations={[{expression:String.raw`F=4\times1024=4096\,\mathrm{KiB}`,annotation:"4 MiB를 KiB로 바꿉니다."},{expression:String.raw`2S=2\times1536=3072\,\mathrm{KiB}`,annotation:"현재·후보 두 슬롯입니다."},{expression:String.raw`R=4096-256-3072=768`,annotation:"설정·교체 보조 영역으로 남기는 가정입니다."}]} terms={[{symbol:"F",name:"외부 플래시 전체",description:"가상 4096 KiB입니다."},{symbol:"B",name:"부트·복구 영역",description:"가상 256 KiB입니다."},{symbol:"S",name:"앱 슬롯 하나",description:"가상 1536 KiB입니다."},{symbol:"R",name:"기타 영역",description:"가상 768 KiB입니다."}]} assumptions={["4 MiB 플래시와 네 구획 크기는 교육용 가정입니다.","정렬·이미지 헤더·트레일러로 실제 저장 가능 크기는 줄어듭니다."]} interpretation="가상 배치의 나머지는 768 KiB입니다. 앱 두 개가 각각 1536 KiB까지 꽉 찬다는 뜻은 아닙니다." /><CitationBlock source="Raspberry Pi, RP2040 Datasheet, XIP flash·Bootrom, 원본 123·129–132·145쪽" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">공식 데이터시트는 외부 QSPI 플래시 XIP, 다음 부팅 단계의 검사, USB BOOTSEL 경로를 설명합니다. 4 MiB와 두 앱 슬롯·자동 되돌리기는 본문에서 가정한 제품 설계입니다.</CitationBlock></section>
  <section id="verify" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">v2를 다 받은 뒤 무결성과 출처를 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">v1을 그대로 둔 채 후보 슬롯에 v2를 내려받습니다. 도중에 전원이 끊겨 후보가 불완전하면 시험 부팅 상태로 표시하지 않고 v1을 계속 실행합니다. 다운로드가 끝났다면 이미지 길이와 해시로 손상을 확인하고 신뢰된 공개 키로 서명을 검증합니다. 해시는 우연한 손상을 찾지만 누가 만든 파일인지 증명하지는 못합니다. 서명 검증이 실패하면 후보를 사용하지 않습니다.</p>
   <p className="leading-7">다운로드 프로토콜, 키를 신뢰할 수 있게 보관하는 방법, 버전·보안 카운터 정책은 제품에서 별도로 정해야 합니다. 후보를 받았다는 사실과 부팅해도 된다는 판단은 서로 다른 상태입니다.</p>
   <p className="leading-7"><em>후보가 완전히 기록되고 검증되기 전에는 작동 중인 v1을 버리지 않습니다.</em></p>
  </div></section>
  <section id="trial" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">v2는 한 번 시험하고 실제 기능을 본 뒤 확정합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">MCUboot의 <strong>swap 방식 시험 업데이트</strong>에서는 유효한 후보를 시험 상태로 표시하면 부트로더가 이미지를 교체해 v2를 실행합니다. 이전 v1은 되돌릴 수 있도록 다른 슬롯에 남습니다. v2가 센서 읽기, 설정 로드, 주기 작업 시작 같은 제품 자가 검사를 통과하면 앱이 이미지 OK를 기록해 v2를 확정합니다. 다음 부팅에도 v2가 유지됩니다.</p>
   <p className="leading-7">v2가 부팅만 하고 자가 검사에 실패하거나 확정 기록 전에 재시작하면, 이 시험·되돌리기 모드에서는 다음 부팅에 v1로 돌아갑니다. 업그레이드를 처음부터 영구로 표시하는 모드나 단순 덮어쓰기 방식에서는 같은 결과를 기대할 수 없습니다. 어느 업데이트 방식을 설정했는지 알아야 합니다.</p>
   <p className="leading-7"><em>‘CPU가 v2로 점프했다’와 ‘v2가 제품 기능을 정상 수행했다’는 확정 기준이 다릅니다.</em></p>
  </div><CitationBlock source="MCUboot, Bootloader design, image swapping·trailers·high-level operation" citeKey={2} href="https://docs.mcuboot.com/design.html">MCUboot 공식 설계 문서는 시험(TEST), 확정(PERM), 되돌리기(REVERT), 이미지 OK 상태와 서명·무결성 검사, 중단된 교체의 재개를 설명합니다. 본문은 그중 시험 swap 방식을 선택한 설계 사례입니다.</CitationBlock></section>
  <section id="power" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">전원이 끊기는 위치마다 돌아오는 경로가 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">다운로드 도중 끊기면 후보 슬롯이 불완전하므로 v1을 유지합니다. 이미 시험 교체를 시작했다가 끊기면 MCUboot의 지원되는 swap 구현은 기록된 교체 상태를 읽어 중단된 작업을 재개합니다. v2를 시험 실행하다 확정 전에 끊기면 다음 부팅에서 v1로 되돌립니다. 확정이 끝난 뒤 재시작하면 v2가 남습니다.</p>
   <p className="leading-7">이 네 지점을 실험으로 끊어 보는 것이 설계 검증입니다. 복구용 BOOTSEL USB 진입은 현장 작업자가 다시 플래시를 쓰는 경로가 될 수 있지만 자동 앱 되돌리기와는 역할이 다릅니다. 외부 플래시가 고장 났거나 부트 코드 자체가 손상된 경우의 복구 정책도 따로 필요합니다.</p>
   <p className="leading-7"><em>복구가 된다는 주장은 ‘어느 단계에서 전원을 끊었는가’까지 시험해야 의미가 있습니다.</em></p>
  </div></section>
  <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">이 설계는 제품의 플래시·부팅·보안 조건에 맞춰야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">RP2040 보드에 이 구조가 내장돼 있다고 볼 수 없습니다. 외부 플래시의 용량·지우기 단위·쓰기 중 코드 실행 제약, 사용자 부트로더 이식, 공개 키 신뢰 경로와 서명 키 관리, 확정 기록의 내구성을 제품 조건에 맞춰 검증해야 합니다. 오래된 버전으로의 보안상 위험과 고장난 v2에서 v1로 되돌아갈 필요도 함께 정책으로 정합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 가상 4 MiB에서 기타 공간은? (답: 2절) v2가 시험 부팅 뒤 확정되지 않으면? (답: 4절) 다운로드 중과 교체 중 전원 차단의 처리가 왜 다릅니까? (답: 3·5절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/scheduling-and-real-time#limits">앞 글의 제때 동작하는 펌웨어</Link>는 새 버전으로 바뀐 뒤에도 자가 검사와 마감 검증을 다시 받아야 합니다.</p>
  </div></section>
 </div>;
}
