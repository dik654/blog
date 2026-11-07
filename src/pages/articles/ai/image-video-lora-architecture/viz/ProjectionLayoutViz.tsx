import SceneShell from "./SceneShell";

/**
 * 본문 대응: #image-scope — U-Net과 DiT의 구성, 분리·fused QKV의 차이.
 * to_q·to_k·to_v·to_out.0은 Diffusers text-to-image 예제의 target입니다.
 * 블록 수는 그림의 가정입니다.
 */
const SCENES = [
  { label: "U-Net 예제", summary: "target 네 개", note: "U-Net은 spatial block과 attention을 섞을 수 있습니다. Diffusers의 text-to-image 예제는 attention 안의 to_q·to_k·to_v·to_out.0을 target으로 둡니다. 이 예제의 출발점일 뿐 모든 image model의 보편 목록은 아닙니다." },
  { label: "DiT", summary: "transformer block 중심", note: "DiT는 transformer block을 중심으로 구성합니다(Q·K·V 분리는 그림의 가정). attention projection만 학습할지 FFN(feed-forward 층) projection까지 넓힐지는 named module과 parameter 수로 확인합니다." },
  { label: "Fused QKV", summary: "Q·K·V가 한 덩어리", note: "Q·K·V를 합친 model과 분리한 model은 다릅니다(칸 배치는 그림의 가정). 이름이 같아도 역할과 layout이 다를 수 있으니 설정 문자열을 복사하기 전에 named module 목록과 실제 trainable parameter 수를 출력합니다." },
] as const;

const BLUE = "#2563eb";
const SLATE = "#64748b";
const LINE = "#94a3b8";

type Block = readonly [string, boolean];
const TOP: readonly (readonly Block[])[] = [
  [["spatial", false], ["attention", true], ["spatial", false], ["attention", false]],
  [["transformer", true], ["transformer", false], ["transformer", false]],
  [["family마다 다름", true]],
];

function Chip({ x, y, w, text, on = true, dashed = false, mono = true }: { x: number; y: number; w: number; text: string; on?: boolean; dashed?: boolean; mono?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={4} fill={on ? BLUE : "none"} fillOpacity={on ? 0.12 : 0} stroke={on ? BLUE : LINE} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "3 3" : undefined} />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" fontSize={12} fontWeight={on ? 700 : 400} fontFamily={mono ? "monospace" : undefined} fill={on ? BLUE : SLATE}>{text}</text>
    </g>
  );
}

export default function ProjectionLayoutViz() {
  return (
    <SceneShell
      eyebrow="실제 module"
      title="같은 attention도 model마다 안쪽 linear 배치가 다릅니다"
      description="projection은 attention 안의 linear weight입니다. Q는 찾는 쪽, K·V는 읽히는 쪽의 표현을 만듭니다. 위 줄은 denoiser, 아래는 표시한 블록의 확대이고 파란 칸이 LoRA target 후보입니다. 블록 수는 가정입니다."
      ariaLabel="U-Net, DiT, fused QKV에서 LoRA target이 되는 projection의 배치"
      scenes={SCENES}
      render={(active) => {
        const blocks = TOP[active];
        const width = (344 - (blocks.length - 1) * 8) / blocks.length;
        const focus = blocks.findIndex((block) => block[1]);
        const focusX = 8 + focus * (width + 8) + width / 2;
        return (
          <svg viewBox="0 0 360 168" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {blocks.map((block, index) => (
              <Chip key={index} x={8 + index * (width + 8)} y={6} w={width} text={block[0]} on={block[1]} dashed={active === 2} mono={false} />
            ))}
            <path d={`M${focusX} 32L${active === 0 ? 96 : 40} 52M${focusX} 32L${active === 0 ? 300 : 320} 52`} fill="none" stroke={LINE} strokeWidth={1} />
            <rect x={8} y={52} width={344} height={110} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
            {active === 2 ? (
              <>
                <Chip x={22} y={94} w={110} text="Q·K·V 합침" mono={false} />
                <text x={77} y={136} textAnchor="middle" fontSize={12} fill={SLATE}>linear 하나</text>
              </>
            ) : (
              <>
                <Chip x={22} y={60} w={76} text={active === 0 ? "to_q" : "Q"} />
                <Chip x={22} y={94} w={76} text={active === 0 ? "to_k" : "K"} />
                <Chip x={22} y={128} w={76} text={active === 0 ? "to_v" : "V"} />
              </>
            )}
            {active !== 2 && <path d="M100 73L122 107M100 141L122 107" fill="none" stroke={LINE} strokeWidth={1} />}
            <path d={`M${active === 2 ? 134 : 100} 107h${active === 2 ? 18 : 22}m-4 -3 4 3 -4 3`} fill="none" stroke={LINE} strokeWidth={1} />
            <Chip x={active === 2 ? 156 : 126} y={94} w={84} text="attention" on={false} mono={false} />
            <path d={`M${active === 2 ? 242 : 212} 107h16m-4 -3 4 3 -4 3`} fill="none" stroke={LINE} strokeWidth={1} />
            <Chip x={active === 2 ? 262 : 232} y={94} w={active === 2 ? 76 : 84} text={active === 0 ? "to_out.0" : "출력"} />
            {active === 1 && <Chip x={232} y={128} w={108} text="FFN 넓힐까?" on={false} dashed mono={false} />}
          </svg>
        );
      }}
    />
  );
}
