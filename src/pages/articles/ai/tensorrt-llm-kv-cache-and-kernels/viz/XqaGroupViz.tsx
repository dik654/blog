import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * decode step 하나에서 KV head 하나(500 token, head 128, FP16 → K·V 합 250 KiB)를
 * query head 8개가 함께 쓰는 GQA 묶음을 그린다.
 * 장면 1: head마다 따로 읽으면 같은 250 KiB를 8번 요청한다.
 * 장면 2: XQA는 묶음 8개를 한 tile의 행으로 놓고 KV tile을 한 번 읽어 8행에 곱한다.
 * 장면 3: tensor core 행 단위가 16이라 tile 16행 중 8행은 빈 행이다.
 */
const SCENES = ["head마다 따로 읽기", "묶음으로 한 번 읽기", "16행 tile의 빈 행"] as const;

const NOTES = [
  "query head 8개가 같은 KV head를 봅니다. head마다 따로 읽으면 같은 250 KiB를 8번 요청해 KV head 하나에 2,000 KiB를 메모리에 요청합니다. cache가 일부를 받아 줄 수는 있지만 요청 자체는 8배입니다.",
  "XQA는 KV head 하나를 맡은 CTA가 query 8개를 한 tile의 행으로 모읍니다. KV 조각을 shared memory로 한 번 가져와 8행에 함께 곱하므로 요청은 250 KiB 한 번입니다.",
  "tensor core 행렬 곱의 행 단위가 16이라 warpTile.y = roundUp(8, 16) = 16입니다. 유효한 행은 8개뿐이고 나머지 8행은 계산만 하고 버립니다. 메모리를 아낀 대가로 곱셈 칸의 절반을 씁니다.",
] as const;

const Q_COLOR = "#2563eb";
const KV_COLOR = "#d97706";

export default function XqaGroupViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="GQA decode kernel"
      title="query head 8개가 KV 한 조각을 같이 읽으면 요청이 8분의 1이 됩니다"
      description="왼쪽 파란 칸은 KV head 하나를 공유하는 query head 8개, 오른쪽 주황 칸은 그 KV head의 500 token 기록입니다."
      note="500 token·head 128·FP16과 묶음 8은 설명용 가정입니다. 실제 kernel은 KV를 여러 tile로 나눠 반복해 읽습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GQA 묶음과 KV 읽기 횟수"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 480 200" className="mt-4 w-full sm:max-h-[13rem]" role="img" aria-label={SCENES[scene]}>
            {Array.from({ length: scene === 2 ? 16 : 8 }, (_, i) => {
              const valid = i < 8;
              const y = scene === 2 ? 8 + i * 11.5 : 14 + i * 22;
              const h = scene === 2 ? 9.5 : 18;
              return (
                <g key={i}>
                  <rect
                    x={30}
                    y={y}
                    width={62}
                    height={h}
                    rx={2}
                    fill={valid ? Q_COLOR : "none"}
                    fillOpacity={valid ? 0.75 : 0}
                    stroke={valid ? Q_COLOR : "#9ca3af"}
                    strokeDasharray={valid ? undefined : "3 2"}
                    strokeWidth={1}
                  />
                  {scene !== 2 ? (
                    <text x={12} y={y + 13} fontSize={13} fill="#6b7280" textAnchor="middle">
                      q{i}
                    </text>
                  ) : null}
                </g>
              );
            })}

            <rect x={340} y={60} width={120} height={70} rx={3} fill={KV_COLOR} fillOpacity={0.7} />
            <text x={400} y={150} fontSize={13} fill={KV_COLOR} textAnchor="middle">
              KV head · 250 KiB
            </text>

            {scene === 0
              ? Array.from({ length: 8 }, (_, i) => (
                  <line key={i} x1={94} y1={23 + i * 22} x2={338} y2={68 + i * 7} stroke={KV_COLOR} strokeOpacity={0.8} strokeWidth={1} />
                ))
              : null}

            {scene >= 1 ? (
              <g>
                <rect x={25} y={scene === 2 ? 4 : 10} width={72} height={scene === 2 ? 188 : 180} rx={4} fill="none" stroke={Q_COLOR} strokeWidth={1.25} strokeDasharray="4 3" />
                <line x1={99} y1={95} x2={338} y2={95} stroke={KV_COLOR} strokeWidth={1.25} />
                <text x={218} y={88} fontSize={13} fill="#6b7280" textAnchor="middle">
                  CTA 하나 · 한 번 읽기
                </text>
              </g>
            ) : null}

            {scene === 2 ? (
              <text x={110} y={170} fontSize={13} fill="#6b7280">
                유효 8행 + 빈 8행
              </text>
            ) : null}
            {scene === 0 ? (
              <text x={218} y={190} fontSize={13} fill="#6b7280" textAnchor="middle">
                같은 조각을 8번 요청
              </text>
            ) : null}
          </svg>

          <dl className="mt-3 grid grid-cols-3 gap-x-4 gap-y-2 font-mono text-xs">
            <div>
              <dt className="text-muted-foreground">KV 요청</dt>
              <dd className="font-bold text-foreground">{scene === 0 ? "2,000 KiB" : "250 KiB"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">tile 행</dt>
              <dd className="font-bold text-foreground">{scene === 2 ? "16" : scene === 1 ? "8 유효" : "head별 1"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">쓰는 행 비율</dt>
              <dd className="font-bold text-foreground">{scene === 2 ? "8/16" : "—"}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
