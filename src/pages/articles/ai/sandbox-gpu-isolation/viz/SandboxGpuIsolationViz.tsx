import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["장치 요청", "nvproxy", "VFIO", "DMA 경계", "검증 조합"] as const;
const NOTES = [
  "생성 작업이 GPU 0을 배정받고 CUDA 프로세스가 /dev/nvidia0을 엽니다. CPU 시스템 호출 경계에 GPU 장치·드라이버 경로가 새로 붙는 순간입니다.",
  "gVisor의 nvproxy는 지원하는 NVIDIA ioctl 구조를 해석·복사·검사한 뒤 호스트 커널 드라이버에 전달합니다. 호스트 드라이버와 GPU는 계속 신뢰 경계에 남습니다.",
  "Kata passthrough는 GPU를 VFIO 장치로 묶어 VM 시작 때 연결합니다. 워크로드는 게스트 NVIDIA 드라이버를 사용하며 물리 GPU는 그 VM에 할당됩니다.",
  "IOMMU는 장치의 DMA 주소를 VM에 허용한 메모리로 변환·제한합니다. 하지만 장치 리셋·같은 IOMMU 그룹·NVLink·공유 방식은 별도 조건입니다.",
  "GPU 모델만 맞는 것으로는 부족합니다. 드라이버 ABI, runsc 또는 Kata 릴리스, VMM·IOMMU, 할당·해제·리셋과 금지 요청 결과를 한 조합으로 기록합니다.",
] as const;

function Defs() {
  return <defs><marker id="gpu-boundary-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L8 4L0 8Z" fill="currentColor" /></marker></defs>;
}

function Arrow({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeDasharray={dashed ? "4 4" : undefined} markerEnd="url(#gpu-boundary-arrow)" />;
}

function Box({ x, y, w = 104, title, detail, active = false }: { x: number; y: number; w?: number; title: string; detail: string; active?: boolean }) {
  return <g><rect x={x} y={y} width={w} height="48" rx="4" className={active ? "fill-primary/10 stroke-primary" : "fill-background stroke-border"} /><text x={x + w / 2} y={y + 18} textAnchor="middle" className="fill-foreground text-[10px] font-bold">{title}</text><text x={x + w / 2} y={y + 34} textAnchor="middle" className="fill-muted-foreground text-[8.5px]">{detail}</text></g>;
}

const svgClass = "mx-auto h-[14rem] w-auto max-w-full sm:h-[19rem]";

function RequestScene() {
  return <svg viewBox="0 0 360 205" className={svgClass} role="img" aria-label="GPU 0을 배정받은 CUDA 프로세스가 장치 파일을 여는 과정"><Defs /><text x="180" y="26" textAnchor="middle" className="fill-muted-foreground text-[9px]">생성 작업 · GPU 0 배정 완료</text><Box x={12} y={62} title="CUDA 프로세스" detail="모델 생성 코드" /><Arrow x1={116} y1={86} x2={145} y2={86} /><Box x={149} y={62} w={96} title="/dev/nvidia0" detail="장치 파일 열기" active /><Arrow x1={245} y1={86} x2={274} y2={86} /><Box x={278} y={62} w={70} title="GPU 0" detail="아직 명령 전" /><text x="180" y="142" textAnchor="middle" className="fill-foreground text-[9px] font-bold">CPU 샌드박스에 장치 통로가 추가됨</text><text x="180" y="163" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">장치 노출 · ioctl · 드라이버 · DMA를 따로 확인</text></svg>;
}

function NvproxyScene() {
  return <svg viewBox="0 0 360 205" className={svgClass} role="img" aria-label="nvproxy가 GPU ioctl을 검사해 호스트 NVIDIA 드라이버에 전달하는 과정"><Defs /><Box x={6} y={62} w={83} title="CUDA" detail="GPU ioctl" /><Arrow x1={89} y1={86} x2={108} y2={86} /><Box x={112} y={62} w={94} title="nvproxy" detail="해석·복사·검사" active /><Arrow x1={206} y1={86} x2={225} y2={86} /><Box x={229} y={62} w={125} title="호스트 드라이버" detail="NVIDIA KMD" /><path d="M292 110V139H181" fill="none" className="stroke-muted-foreground" markerEnd="url(#gpu-boundary-arrow)" /><Box x={129} y={143} title="GPU" detail="메모리·연산" /><text x="180" y="198" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">허용 ioctl만 중개 · 호스트 드라이버는 경계 안에 남음</text></svg>;
}

function VfioScene() {
  return <svg viewBox="0 0 360 205" className={svgClass} role="img" aria-label="VFIO 장치를 Kata VM에 연결하고 게스트 드라이버가 사용하는 과정"><Defs /><Box x={5} y={62} w={88} title="CUDA" detail="게스트 안" /><Arrow x1={93} y1={86} x2={112} y2={86} /><Box x={116} y={62} w={105} title="게스트 드라이버" detail="NVIDIA KMD" active /><Arrow x1={221} y1={86} x2={240} y2={86} /><Box x={244} y={62} w={110} title="가상 PCI" detail="VMM cold-plug" /><path d="M299 110V139H181" fill="none" className="stroke-muted-foreground" markerEnd="url(#gpu-boundary-arrow)" /><Box x={129} y={143} title="VFIO GPU" detail="VM에 물리 할당" /><text x="180" y="198" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">호스트 일반 드라이버에서 분리 · VM 시작 때 장치 연결</text></svg>;
}

function DmaScene() {
  return <svg viewBox="0 0 360 205" className={svgClass} role="img" aria-label="IOMMU가 GPU DMA 주소를 게스트에 허용된 메모리로 제한하는 과정"><Defs /><Box x={10} y={62} title="GPU" detail="DMA read·write" /><Arrow x1={114} y1={86} x2={141} y2={86} /><Box x={145} y={62} w={92} title="IOMMU" detail="주소 변환·제한" active /><path d="M237 77H268V48H303" fill="none" className="stroke-muted-foreground" markerEnd="url(#gpu-boundary-arrow)" /><path d="M237 99H268V139H303" fill="none" className="stroke-muted-foreground" markerEnd="url(#gpu-boundary-arrow)" /><text x="317" y="43" textAnchor="middle" className="fill-primary text-[9px] font-black">허용</text><text x="317" y="58" textAnchor="middle" className="fill-muted-foreground text-[8px]">게스트 메모리</text><text x="317" y="134" textAnchor="middle" className="fill-foreground text-[9px] font-black">차단</text><text x="317" y="149" textAnchor="middle" className="fill-muted-foreground text-[8px]">호스트 다른 영역</text><text x="180" y="181" textAnchor="middle" className="fill-muted-foreground text-[8.5px]">IOMMU 그룹·장치 리셋·P2P 경로는 별도 검증</text></svg>;
}

function ReceiptScene() {
  const rows = [
    ["장치", "GPU·펌웨어"],
    ["드라이버", "ABI·기능"],
    ["경계", "nvproxy 또는 VFIO"],
    ["수명", "할당·해제·리셋"],
  ];
  return <svg viewBox="0 0 360 205" className={svgClass} role="img" aria-label="GPU 샌드박스 릴리스 조합을 네 개의 근거로 기록"><Defs />{rows.map(([title, detail], index) => { const x = 8 + (index % 2) * 176; const y = 34 + Math.floor(index / 2) * 62; return <Box key={title} x={x} y={y} w={168} title={title} detail={detail} active />; })}<Arrow x1={180} y1={144} x2={180} y2={164} /><g><rect x="111" y="167" width="138" height="30" rx="4" className="fill-primary/10 stroke-primary" /><text x="180" y="186" textAnchor="middle" className="fill-primary text-[9px] font-black">한 조합의 검증 영수증</text></g></svg>;
}

const DRAWINGS = [RequestScene, NvproxyScene, VfioScene, DmaScene, ReceiptScene] as const;

export default function SandboxGpuIsolationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200);
  const Drawing = DRAWINGS[scenes.active];

  return <VizFrame eyebrow="한 장치 · 두 격리 경로" title="GPU를 여는 순간 새 신뢰 경계가 생깁니다" description="GPU 0을 배정받은 같은 CUDA 프로세스를 nvproxy 중개와 VFIO 장치 할당으로 나눠 따라갑니다." note="그림은 메커니즘 비교입니다. GPU·드라이버·런타임 지원 여부와 성능은 고정한 릴리스와 실제 장비에서 별도로 검증해야 합니다." canvasClassName="p-3 sm:p-7">
    <div id={scenes.playbackId} data-viz-canvas data-viz-scene="sandbox-gpu-device-path-viz" data-story-index={scenes.active} tabIndex={0} role="group" aria-label="GPU 장치 요청이 nvproxy 또는 VFIO와 IOMMU를 거치는 과정" onKeyDown={scenes.onKeyDown} className="flex h-auto min-h-0 min-w-0 flex-col overflow-visible outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary sm:h-[min(36rem,calc(100svh-10rem))] sm:min-h-[31rem] sm:overflow-y-auto">
      <div data-viz-live-only className="flex flex-none flex-col justify-center"><p className="text-[11px] font-black text-primary">장면 {String(scenes.active + 1).padStart(2, "0")}</p><h4 className="mt-2 break-keep text-lg font-bold">{SCENES[scenes.active]}</h4><div className="mt-3 border-y border-border py-3"><Drawing /></div><p data-scene-note className="mt-3 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[scenes.active]}</p></div>
      <AnimatedSceneControls {...scenes} labels={SCENES} />
      <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">{SCENES.map((label, index) => <li key={label}><strong>{index + 1}. {label}</strong><span className="mt-1 block text-muted-foreground">{NOTES[index]}</span></li>)}</ol>
    </div>
  </VizFrame>;
}
