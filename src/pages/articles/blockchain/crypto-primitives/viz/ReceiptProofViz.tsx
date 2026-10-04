import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

const scenes = [
  { label: "기록", title: "C의 20을 같은 바이트로 읽습니다", input: "C · 20 → 43 00 00 00 14", operation: "SHA-256(00 || 기록)", output: "C 잎: cef26f74…", note: "00은 기록임을 나타내는 태그입니다. 계정 한 바이트 뒤에 금액을 큰 자리부터 네 바이트로 적습니다." },
  { label: "형제", title: "오른쪽 형제 D를 붙입니다", input: "현재 C · 형제 D", operation: "SHA-256(01 || C 해시 || D 해시)", output: "오른쪽 가지: 2d8c8b6a…", note: "인덱스 2의 낮은 비트는 0입니다. 현재 값이 왼쪽이므로 형제 해시를 뒤에 붙입니다." },
  { label: "루트", title: "왼쪽 가지 AB를 앞에 붙입니다", input: "형제 AB · 현재 CD", operation: "SHA-256(01 || AB 해시 || CD 해시)", output: "루트: 24239f97…", note: "다음 비트는 1입니다. 현재 가지가 오른쪽이므로 형제 해시를 앞에 붙여야 합니다." },
  { label: "승인", title: "루트를 승인한 키와 배치를 확인합니다", input: "receipts-v1 · 배치 1 · 루트", operation: "11 + 4 + 32 = 47바이트에 대한 서명 검사", output: "기록 포함 여부 + 등록된 키의 승인", note: "서명식 외에도 기대한 공개키와 배치를 비교합니다. 이 과정을 통과해도 영수증의 현실 거래가 사실인지까지 증명되지는 않습니다." },
];

export default function ReceiptProofViz() {
  const controls = useAnimatedScenes(scenes.length, 5000);
  const scene = scenes[controls.active];
  return <figure data-viz="receipt-proof" className="my-8 border-y border-border py-4">
    <figcaption className="mb-3 text-sm leading-6">네 기록 A40·B70·C20·D90 가운데 C만 받았을 때의 검증입니다. 그림의 해시는 앞부분만 표시합니다.</figcaption>
    <div data-viz-canvas tabIndex={0} role="group" aria-label="영수증 검증의 네 장면" onKeyDown={controls.onKeyDown} className="flex h-[min(530px,calc(100dvh-150px))] flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary">
      <div className="min-h-0 flex-1 overflow-y-auto px-1 py-3">
        <h3 className="text-lg font-semibold">{scene.title}</h3>
        <div className="my-5 space-y-4">
          <p className="border-b border-border pb-3 text-base">{scene.input}</p>
          <p className="text-sm font-mono leading-7">{scene.operation}</p>
          <p className="border-t border-border pt-3 text-lg font-semibold">{scene.output}</p>
        </div>
        <p className="text-sm leading-7">{scene.note}</p>
      </div>
      <AnimatedSceneControls {...controls} labels={scenes.map(s => s.label)} />
    </div>
  </figure>;
}
