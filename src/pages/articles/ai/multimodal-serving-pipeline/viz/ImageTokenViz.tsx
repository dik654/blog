import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 1,024×1,024 사진 한 장이 Qwen2.5-VL 규칙으로 문장 안 1,369칸이 되기까지를 센다.
 * 한 mechanism: 크기 맞춤 → 14px patch 격자 → 2×2 묶음 → 같은 placeholder 반복.
 * 격자선은 실제 74칸·37칸 간격으로 그려 촘촘함의 차이를 눈으로 비교한다.
 */
const SCENES = ["원본 사진", "28의 배수로 맞춤", "14px patch 격자", "2×2 묶음", "문장 안의 자리"] as const;

const NOTES = [
  "가로·세로 1,024 픽셀 사진 한 장을 질문과 함께 보냅니다. 아직 모델이 읽을 수 있는 단위로 나뉘지 않았습니다.",
  "1,024÷28=36.57을 반올림해 37칸, 37×28=1,036 픽셀로 맞춥니다. 1,036²은 픽셀 상한보다 작아 줄이지 않습니다.",
  "1,036÷14=74이므로 가로 74칸, 세로 74칸, 모두 5,476개의 patch가 vision encoder로 들어갑니다.",
  "이웃한 2×2 patch 네 개를 하나로 합칩니다. 74÷2=37이므로 37×37=1,369개의 embedding이 남습니다.",
  "문장에는 같은 image token이 1,369번 반복해 들어가고, 실행 때 그 자리를 사진 embedding으로 바꿉니다.",
] as const;

const SIDE = 200;
const X0 = 16;
const Y0 = 20;

function gridLines(count: number) {
  const step = SIDE / count;
  return Array.from({ length: count - 1 }, (_, index) => X0 + step * (index + 1));
}

const PATCH_LINES = gridLines(74);
const MERGED_LINES = gridLines(37);

const ROWS: readonly (readonly [string, readonly string[]])[] = [
  ["한 변 픽셀", ["1,024", "1,036", "1,036", "1,036", "1,036"]],
  ["격자", ["—", "—", "74×74", "37×37", "37×37"]],
  ["개수", ["—", "—", "5,476 patch", "1,369 자리", "1,369 token"]],
];

export default function ImageTokenViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const side = scene === 0 ? SIDE * (1024 / 1036) : SIDE;
  const lines = scene === 2 ? PATCH_LINES : scene >= 3 ? MERGED_LINES : [];

  return (
    <VizFrame
      eyebrow="Image to placeholder tokens"
      title="사진 한 장은 문장 안에서 1,369칸을 차지합니다"
      description="왼쪽 정사각형이 사진이고, 선은 실제 칸 수만큼 그은 격자입니다. 오른쪽 표는 각 단계의 수를 셉니다."
      note="Qwen2.5-VL-7B-Instruct의 공개 설정(patch 14, merge 2, 최소 3,136·최대 12,845,056 픽셀)으로 계산했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사진이 patch와 token 자리로 바뀌는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 360 240" className="mx-auto mt-4 w-full sm:max-w-[22rem] text-foreground" role="img" aria-label={NOTES[scene]}>
            {scene < 4 ? (
              <g>
                <rect x={X0} y={Y0} width={side} height={side} fill="#93c5fd" fillOpacity={0.25} stroke="#2563eb" strokeWidth={1} />
                {lines.map((position) => (
                  <g key={position}>
                    <line x1={position} y1={Y0} x2={position} y2={Y0 + SIDE} stroke="#2563eb" strokeOpacity={scene === 2 ? 0.35 : 0.55} strokeWidth={scene === 2 ? 0.4 : 0.6} />
                    <line x1={X0} y1={position - X0 + Y0} x2={X0 + SIDE} y2={position - X0 + Y0} stroke="#2563eb" strokeOpacity={scene === 2 ? 0.35 : 0.55} strokeWidth={scene === 2 ? 0.4 : 0.6} />
                  </g>
                ))}
                {scene === 3 ? (
                  <rect x={X0} y={Y0} width={SIDE / 37} height={SIDE / 37} fill="#d97706" />
                ) : null}
                <text x={X0} y={Y0 + SIDE + 18} fontSize={11} fill="#6b7280">
                  {scene === 0 ? "1,024 px" : "1,036 px"}
                </text>
              </g>
            ) : (
              <g>
                <text x={X0} y={44} fontSize={11} fill="#6b7280">위치 0</text>
                <rect x={X0} y={52} width={14} height={36} fill="#9ca3af" />
                <rect x={X0 + 15} y={52} width={4} height={36} fill="#0d9488" />
                <rect x={X0 + 20} y={52} width={290} height={36} fill="#d97706" fillOpacity={0.85} />
                <rect x={X0 + 311} y={52} width={4} height={36} fill="#0d9488" />
                <rect x={X0 + 316} y={52} width={12} height={36} fill="#9ca3af" />
                <text x={X0 + 165} y={75} fontSize={11} fontWeight={700} fill="#ffffff" textAnchor="middle">image token × 1,369</text>
                <text x={X0} y={108} fontSize={10} fill="#6b7280">텍스트 15</text>
                <text x={X0 + 165} y={108} fontSize={10} fill="#6b7280" textAnchor="middle">위치 16 ~ 1,384</text>
                <text x={X0 + 328} y={108} fontSize={10} fill="#6b7280" textAnchor="end">질문</text>
                <text x={X0} y={140} fontSize={12} fill="currentColor">초록 칸: 사진 시작·끝 표시 token</text>
                <text x={X0} y={160} fontSize={12} fill="currentColor">회색 칸: 일반 text token</text>
                <text x={X0} y={196} fontSize={12} fill="currentColor">1,369칸은 모두 같은 token ID입니다.</text>
                <text x={X0} y={216} fontSize={12} fill="currentColor">어느 사진인지는 ID로 알 수 없습니다.</text>
              </g>
            )}
            {scene === 3 ? (
              <g>
                {[0, 1].map((row) =>
                  [0, 1].map((col) => (
                    <rect key={`${row}-${col}`} x={236 + col * 13} y={186 + row * 13} width={12} height={12} fill="#93c5fd" stroke="#2563eb" strokeWidth={0.8} />
                  )),
                )}
                <text x={274} y={206} fontSize={13} fill="#6b7280">→</text>
                <rect x={292} y={186} width={25} height={25} fill="#d97706" />
                <text x={236} y={232} fontSize={10} fill="#6b7280">patch 4개 → 자리 1개</text>
              </g>
            ) : null}
            {scene < 4 ? (
              <g>
                {ROWS.map(([label, values], rowIndex) => (
                  <g key={label}>
                    <text x={236} y={56 + rowIndex * 52} fontSize={10} fill="#6b7280">{label}</text>
                    <text x={236} y={74 + rowIndex * 52} fontSize={13} fontWeight={700} fill="currentColor">{values[scene]}</text>
                  </g>
                ))}
              </g>
            ) : null}
          </svg>

          <p className="mt-4 min-h-[7rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[3.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
