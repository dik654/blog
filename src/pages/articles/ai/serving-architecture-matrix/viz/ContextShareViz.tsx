import SceneShell from "./SceneShell";

/**
 * 본문 대응: why-columns 절 — 요약 행렬과 창 층은 문맥 길이와 무관하거나 W에서 멈추고,
 * 과거 전체를 보는 층만 길이에 비례한다. 문맥이 길수록 고정 몫은 무시할 만해진다.
 * Qwen3.6-35B-A3B: full 10층 × 2 × 2 × 256 × 2 B = 20,480 B/token, 요약 30층 × 2 MiB = 62,914,560 B.
 * gpt-oss-120b: full 18층 × 2 × 8 × 64 × 2 B = 36,864 B/token, 창 18층 × 128 × 2,048 B = 4,718,592 B.
 */
const QWEN_PER_TOKEN = 10 * 2 * 2 * 256 * 2;
const QWEN_FIXED = 30 * 32 * 128 * 128 * 4;
const OSS_PER_TOKEN = 18 * 2 * 8 * 64 * 2;
const OSS_WINDOW = 18 * 128 * 2 * 8 * 64 * 2;

const CONTEXTS = [1024, 8192, 32768, 131072] as const;

const fmt = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${(bytes / 1e6).toFixed(1)} MB`);
const pct = (part: number, whole: number) => `${((part / whole) * 100).toFixed(1)}%`;

const ROWS = [
  {
    model: "Qwen3.6-35B-A3B",
    growLabel: "과거 전체를 보는 10층",
    fixedLabel: "요약 행렬 30층",
    perToken: QWEN_PER_TOKEN,
    fixed: QWEN_FIXED,
  },
  {
    model: "gpt-oss-120b",
    growLabel: "과거 전체를 보는 18층",
    fixedLabel: "최근 128 token 창 18층",
    perToken: OSS_PER_TOKEN,
    fixed: OSS_WINDOW,
  },
] as const;

const SCENE_NOTES = [
  `1K에서는 Qwen3.6-35B-A3B의 요약 행렬 ${fmt(QWEN_FIXED)}이 길이 비례 몫 ${fmt(QWEN_PER_TOKEN * 1024)}보다 큽니다. 두 몫은 ${fmt(QWEN_FIXED)} ÷ ${QWEN_PER_TOKEN.toLocaleString("en-US")} B ≈ ${Math.round(QWEN_FIXED / QWEN_PER_TOKEN).toLocaleString("en-US")} token에서 같아집니다. gpt-oss-120b의 창 층은 128 token에서 이미 멈춰 ${fmt(OSS_WINDOW)}입니다.`,
  "문맥이 8배가 되면 길이 비례 몫도 8배가 됩니다. 요약 행렬과 창 층의 몫은 그대로라 비율만 줄어듭니다.",
  "32K에서 Qwen3.6-35B-A3B도 기록의 90% 넘게가 길이 비례 몫입니다.",
  `128K에서 Qwen3.6-35B-A3B는 ${fmt(QWEN_PER_TOKEN * 131072)} + ${fmt(QWEN_FIXED)}, gpt-oss-120b는 ${fmt(OSS_PER_TOKEN * 131072)} + ${fmt(OSS_WINDOW)}입니다. 고정 몫은 거의 보이지 않습니다. gpt-oss-120b의 창 몫이 이렇게 멈추는 것은 엔진이 창 밖 block을 돌려줄 때이고, 돌려주지 않으면 에이전트 하나가 9.7GB입니다.`,
] as const;

const SCENES = CONTEXTS.map((c, i) => ({
  label: `문맥 ${c / 1024}K`,
  summary: `길이 비례 몫 Qwen3.6\u00a0${pct(QWEN_PER_TOKEN * c, QWEN_PER_TOKEN * c + QWEN_FIXED)} · gpt\u2011oss\u00a0${pct(OSS_PER_TOKEN * c, OSS_PER_TOKEN * c + OSS_WINDOW)}`,
  note: SCENE_NOTES[i],
}));

const GROW = "#2563eb";
const FIXED = "#d97706";

export default function ContextShareViz() {
  return (
    <SceneShell
      eyebrow="Fixed state vs growing KV"
      title="문맥이 길어질수록 고정 몫은 기록에서 사라져 갑니다"
      description="막대 하나가 그 길이의 문맥을 붙잡은 에이전트 하나의 기록 전체(100%)입니다. 파란 부분은 문맥 길이에 비례해 자라는 몫, 주황 부분은 길이와 무관한 몫입니다."
      note="BF16 KV, FP32 요약 행렬 기준의 논리 크기입니다. gpt-oss-120b의 창 몫이 4.7MB에서 멈추는 것은 엔진이 창 밖 block을 돌려줄 때입니다. 1K는 1,024 token입니다."
      ariaLabel="문맥 길이에 따라 길이 비례 몫과 고정 몫이 기록에서 차지하는 비율"
      scenes={SCENES}
      render={(active) => {
        const c = CONTEXTS[active];
        return (
          <div className="space-y-5">
            {ROWS.map((row) => {
              const grow = row.perToken * c;
              const total = grow + row.fixed;
              const growShare = (grow / total) * 100;
              return (
                <div key={row.model} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <span className="font-bold">{row.model}</span>
                    <span className="font-mono text-muted-foreground">합계 {fmt(total)}</span>
                  </div>
                  <div className="mt-2 flex h-5 w-full overflow-hidden rounded-sm bg-muted/40">
                    <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${growShare}%`, backgroundColor: GROW }} />
                    <div className="h-full transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${100 - growShare}%`, backgroundColor: FIXED }} />
                  </div>
                  <div className="mt-2 grid gap-1 text-xs leading-5 sm:grid-cols-2 sm:text-sm">
                    <span>
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: GROW }} />
                      {row.growLabel}: <span className="font-mono font-semibold">{fmt(grow)}</span> ({pct(grow, total)})
                    </span>
                    <span>
                      <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: FIXED }} />
                      {row.fixedLabel}: <span className="font-mono font-semibold">{fmt(row.fixed)}</span> ({pct(row.fixed, total)})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
