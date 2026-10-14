import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 작은 모형(window W = 8, block 4 token)으로 SWA 층과 full 층의 block 수를 나란히 센다.
 * 한 mechanism: 건너뛸 token = n − W + 1, 돌려줄 block = ⌊건너뛸 token ÷ 4⌋ (vLLM get_num_skipped_tokens).
 * 마지막 장면은 gpt-oss-20b의 실제 설정(W = 128, 층 24개 중 절반이 SWA)으로 같은 셈을 한다.
 */
const SCENES = ["창 안쪽 n = 7", "첫 block 반환 n = 12", "계속 반환 n = 20", "gpt-oss-20b 32K"] as const;

const W = 8;
const BLOCK = 4;
const COUNTS = [7, 12, 20] as const;

const NOTES = [
  "token 7개를 계산했고 다음 token은 앞 7개와 자기 자신을 봅니다. 건너뛸 token은 7 − 8 + 1 = 0이라 두 층 모두 block 2개를 그대로 둡니다.",
  "12개를 계산하면 다음 token의 창은 5~12입니다. 건너뛸 token 12 − 8 + 1 = 5 가운데 block 하나(0~3)가 통째로 창 밖이라 SWA 층은 그 block을 돌려줍니다.",
  "20개에서는 건너뛸 token이 13이라 block 3개를 돌려줍니다. SWA 층은 block 2개만 쥐고, full 층은 5개를 모두 쥡니다. 차이는 대화가 길수록 커집니다.",
  "gpt-oss-20b는 24층 가운데 12층이 창 128 token입니다. 32,768 token 대화에서 SWA 12층은 3MiB, full 12층은 768MiB를 씁니다. 전체는 1,536MiB에서 771MiB로 절반쯤이 됩니다.",
] as const;

function blocksFor(n: number) {
  const total = Math.ceil(n / BLOCK);
  const skippedTokens = Math.max(0, n - W + 1);
  const freed = Math.min(Math.floor(skippedTokens / BLOCK), total);
  return { total, freed };
}

export default function WindowBlockReleaseViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const cell = 13;
  const left = 62;

  const row = (label: string, y: number, n: number, release: boolean) => {
    const { total, freed } = blocksFor(n);
    return (
      <g>
        <text x={0} y={y + 18} fontSize={13} fill="currentColor" fontWeight={700}>{label}</text>
        {Array.from({ length: 20 }, (_, token) => {
          const blockIndex = Math.floor(token / BLOCK);
          const computed = token < n;
          const gone = release && blockIndex < freed;
          const inWindow = token >= n - W + 1 && token < n;
          return (
            <rect
              key={`${label}-${token}`}
              x={left + token * cell + blockIndex * 4}
              y={y + 4}
              width={cell - 2}
              height={20}
              fill={!computed ? "none" : gone ? "#9ca3af" : inWindow ? "#2563eb" : "#93c5fd"}
              fillOpacity={!computed ? 0 : gone ? 0.15 : inWindow ? 0.85 : 0.6}
              stroke={computed ? "none" : "#9ca3af"}
              strokeOpacity={0.4}
              strokeDasharray={computed ? undefined : "2 2"}
            />
          );
        })}
        <text x={left} y={y + 40} fontSize={12} fill="#6b7280">
          block {total - (release ? freed : 0)}개 보유{release && freed > 0 ? ` · ${freed}개 반환` : ""}
        </text>
      </g>
    );
  };

  return (
    <VizFrame
      eyebrow="Sliding-window block release"
      title="창 밖으로 완전히 나간 block부터 돌려주므로 SWA 층은 창 크기만큼만 쥡니다"
      description="한 칸이 token 하나, 네 칸 묶음이 block 하나입니다. 진한 파랑은 다음 token의 창 안, 연한 파랑은 아직 쥔 창 밖 token, 회색은 돌려준 block입니다."
      note="W = 8, block 4 token은 셈을 보이려는 작은 모형입니다. 마지막 장면만 gpt-oss-20b 설정과 vLLM 기본 block 16을 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="sliding window 층과 full 층의 block 보유량"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <div className="mt-4">
            {scene < 3 ? (
              <svg viewBox="0 0 360 130" className="w-full max-w-[32rem]" role="img" aria-label={`n = ${COUNTS[scene]}에서 두 층의 block`}>
                {row("SWA 층", 6, COUNTS[scene], true)}
                {row("full 층", 70, COUNTS[scene], false)}
              </svg>
            ) : (
              <svg viewBox="0 0 360 130" className="w-full max-w-[32rem]" role="img" aria-label="gpt-oss-20b 32K 대화의 층별 KV">
                <text x={0} y={22} fontSize={13} fill="currentColor" fontWeight={700}>SWA 12층</text>
                <rect x={90} y={8} width={Math.max(2, (3 / 768) * 262)} height={20} fill="#2563eb" fillOpacity={0.85} />
                <text x={98} y={23} fontSize={12} fill="#6b7280">3MiB · 층마다 block 8개</text>
                <text x={0} y={66} fontSize={13} fill="currentColor" fontWeight={700}>full 12층</text>
                <rect x={90} y={52} width={262} height={20} fill="#93c5fd" fillOpacity={0.7} />
                <text x={96} y={67} fontSize={12} fill="currentColor">768MiB · 층마다 block 2,048개</text>
                <text x={0} y={104} fontSize={12} fill="#6b7280">token·층당 2 × 8 head × 64 × 2 byte</text>
                <text x={0} y={122} fontSize={12} fill="#6b7280">= 2KiB</text>
              </svg>
            )}
          </div>

          <p className="mt-3 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
