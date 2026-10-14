import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 16 token block 88개를 한 줄로 그리고 R1과 비교해 재사용되는 block을 칠한다.
 * 한 mechanism: block key = (앞 block hash, token ID, 추가 키). 사진 block에는 (사진 hash, offset)이 추가 키로 붙는다.
 */
const SCENES = ["token ID만 비교", "사진 hash를 키에 넣음", "같은 사진, 다른 질문", "사진 중간에서 끝난 hit"] as const;

const BLOCKS = 88;
const IMAGE_FIRST = 1;
const IMAGE_LAST = 86;

type Kind = "hit" | "wrong" | "miss" | "partial";

interface Row {
  label: string;
  kinds: (index: number) => Kind;
}

const ROWS: readonly (readonly Row[])[] = [
  [{ label: "R3 · 사진 Q · 질문 B", kinds: (index) => (index === 0 ? "hit" : index <= 85 ? "wrong" : "miss") }],
  [{ label: "R3 · 사진 Q · 질문 B", kinds: (index) => (index === 0 ? "hit" : "miss") }],
  [{ label: "R2 · 사진 P · 질문 B", kinds: (index) => (index <= 85 ? "hit" : "miss") }],
  [{ label: "R2 · 사진 P · 질문 B", kinds: (index) => (index <= 85 ? "hit" : index === 86 ? "partial" : "miss") }],
];

const COLORS: Record<Kind, string> = {
  hit: "#2563eb",
  wrong: "#dc2626",
  miss: "#d1d5db",
  partial: "#d97706",
};

const NOTES = [
  "사진 1,369칸은 어느 사진이든 같은 image token ID입니다. ID만 보면 사진 Q를 보낸 R3가 R1의 사진 P 기록 86 block을 잘못 가져갑니다.",
  "사진이 걸친 block마다 (사진 hash, offset)을 추가 키로 넣으면 Q와 P의 키가 갈립니다. 사진이 없는 첫 block 16 token만 재사용합니다.",
  "같은 사진 P에 질문만 다른 R2는 위치 1,385까지 같습니다. 꽉 찬 block만 재사용하므로 86 block, 1,376 token이 hit입니다.",
  "hit이 1,376에서 끝나 사진의 마지막 9칸(1,376~1,384)이 남습니다. 이 9칸의 embedding이 필요하므로 encoder cache에 P가 없으면 사진 전체를 다시 encode합니다.",
] as const;

const CELL = 3.6;
const X0 = 12;

export default function PrefixKeyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const scene = scenes.active;
  const row = ROWS[scene][0];
  const kinds = Array.from({ length: BLOCKS }, (_, index) => row.kinds(index));
  const hits = kinds.filter((kind) => kind === "hit" || kind === "wrong").length;

  return (
    <VizFrame
      eyebrow="Multimodal prefix key"
      title="사진 hash가 키에 있어야 같은 token 열을 구별합니다"
      description="칸 하나가 16 token block이고 위 줄 R1과 비교한 결과를 칠했습니다. 파랑은 맞는 재사용, 빨강은 잘못된 재사용, 주황은 일부만 같은 block입니다."
      note="텍스트 15, 사진 시작 1, 사진 1,369, 사진 끝 1, 질문 20으로 둔 1,406 token 요청입니다(가정)."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="block별 prefix cache 재사용 결과"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 340 150" className="mx-auto mt-4 w-full sm:max-w-[30rem] text-foreground" role="img" aria-label={NOTES[scene]}>
            <text x={X0} y={16} fontSize={11} fill="#6b7280">R1 · 사진 P · 질문 A (저장된 기록)</text>
            {Array.from({ length: BLOCKS }, (_, index) => (
              <rect
                key={`base-${index}`}
                x={X0 + index * CELL}
                y={24}
                width={CELL - 0.6}
                height={22}
                fill={index >= IMAGE_FIRST && index <= IMAGE_LAST ? "#fbbf24" : "#9ca3af"}
                fillOpacity={0.55}
              />
            ))}
            <text x={X0} y={72} fontSize={11} fill="#6b7280">{row.label}</text>
            {kinds.map((kind, index) => (
              <rect key={`row-${index}`} x={X0 + index * CELL} y={80} width={CELL - 0.6} height={22} fill={COLORS[kind]} />
            ))}
            <text x={X0} y={122} fontSize={11} fill="#6b7280">block 0</text>
            <text x={X0 + 43 * CELL} y={122} fontSize={11} fill="#6b7280" textAnchor="middle">사진 block 1~86</text>
            <text x={X0 + BLOCKS * CELL} y={122} fontSize={11} fill="#6b7280" textAnchor="end">87</text>
            <text x={X0} y={142} fontSize={12} fontWeight={700} fill="currentColor">
              재사용 {hits} block · {hits * 16} token
            </text>
          </svg>

          <p className="mt-4 min-h-[8.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
