import SceneShell from "./SceneShell";

/**
 * 본문 대응: #post-training — d_t = log(π_T / π_old), ICE-POP은 importance ratio가 0.5–5.0 밖이면 weight 0.
 * 확률·비율 값은 설명용 가정이며 log는 자연로그입니다.
 * y1: ln(0.6/0.3) = +0.69, 비율 1.1 → 사용 / y2: ln(0.1/0.4) = −1.39, 비율 0.9 → 사용 / y3: ln(0.5/0.2) = +0.92, 비율 7.0 → 버림.
 */
const LOW = 0.5;
const HIGH = 5;

const TOKENS = [
  { name: "y₁", teacher: 0.6, old: 0.3, ratio: 1.1 },
  { name: "y₂", teacher: 0.1, old: 0.4, ratio: 0.9 },
  { name: "y₃", teacher: 0.5, old: 0.2, ratio: 7.0 },
] as const;

const SCENES = [
  { label: "Teacher 배정", summary: "math prompt → math teacher", note: "General SFT student가 rollout을 만들고, prompt의 domain에 배정된 teacher 하나가 그 rollout에서 실제로 뽑힌 token마다 log probability를 줍니다." },
  { label: "y₁: teacher가 더 지지", summary: "d = ln(0.6 / 0.3) = +0.69", note: "Teacher가 old student보다 이 token을 더 높게 봅니다. d가 양수이므로 현재 student는 이 token의 확률을 올리는 쪽으로 update됩니다." },
  { label: "y₂: teacher가 덜 지지", summary: "d = ln(0.1 / 0.4) = −1.39", note: "Teacher가 old student보다 이 token을 낮게 봅니다. d가 음수이므로 현재 student는 이 token의 확률을 내리는 쪽으로 update됩니다." },
  { label: "y₃: 비율이 범위 밖", summary: "비율 7.0 > 5.0 → weight 0", note: "d는 +0.92지만 생성 때 정책과 old 정책의 importance ratio가 0.5–5.0 밖이라 ICE-POP이 weight를 0으로 만듭니다. 이 token은 update에 쓰이지 않습니다." },
] as const;

export default function MopdSignalViz() {
  return (
    <SceneShell
      eyebrow="선택 token 하나씩"
      title="뽑힌 token마다 teacher와 old student의 확률을 비교합니다"
      description="π_T는 teacher, π_old는 update 직전 student가 그 token에 준 확률입니다. d = ln(π_T / π_old)의 부호가 방향이고, importance ratio가 0.5–5.0 밖인 token은 버립니다. 확률과 비율은 설명용 가정입니다."
      ariaLabel="세 개의 선택 token에서 teacher와 old student 확률 비교와 ICE-POP 필터"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="mb-3 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 text-xs">
            <span className="rounded-md border border-border bg-background px-2 py-1 font-semibold">math prompt</span>
            <span className="text-center text-muted-foreground">→ student rollout →</span>
            <span className="rounded-md border border-primary bg-background px-2 py-1 font-semibold text-primary">math teacher</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {TOKENS.map((token, index) => {
              const shown = active >= index + 1;
              const current = active === index + 1;
              const d = Math.log(token.teacher / token.old);
              const kept = token.ratio >= LOW && token.ratio <= HIGH;
              const verdict = !kept ? "버림" : d > 0 ? "확률 올림" : "확률 내림";
              const tone = !kept ? "text-amber-700 dark:text-amber-400" : d > 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400";
              return (
                <div
                  key={token.name}
                  className={`min-w-0 rounded-lg border px-2 py-2 text-xs leading-5 ${current ? "border-primary bg-background" : shown ? "border-border bg-background" : "border-dashed border-border/60"}`}
                >
                  <span className="block font-mono text-sm font-bold">{token.name}</span>
                  <span className="flex justify-between gap-1"><span className="text-muted-foreground">π_T</span><span className="font-mono">{shown ? token.teacher.toFixed(1) : "?"}</span></span>
                  <span className="flex justify-between gap-1"><span className="text-muted-foreground">π_old</span><span className="font-mono">{shown ? token.old.toFixed(1) : "?"}</span></span>
                  <span className="flex justify-between gap-1 border-t border-border/60 pt-1"><span className="text-muted-foreground">d</span><span className="font-mono font-bold">{shown ? `${d > 0 ? "+" : "−"}${Math.abs(d).toFixed(2)}` : "?"}</span></span>
                  <span className="flex justify-between gap-1"><span className="text-muted-foreground">비율</span><span className={`font-mono ${shown && !kept ? "font-bold text-amber-700 dark:text-amber-400" : ""}`}>{shown ? token.ratio.toFixed(1) : "?"}</span></span>
                  <span className={`mt-1 block font-semibold ${shown ? tone : "opacity-0"}`}>{verdict}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
            <span className="text-muted-foreground">허용 비율</span>
            <div className="relative h-5 rounded-sm border border-border bg-background">
              <div className="absolute inset-y-0 left-[5%] right-[50%] bg-[#16a34a]/15" />
              <span className="absolute left-[5%] top-0 -translate-x-1/2 font-mono text-[10px] leading-5">0.5</span>
              <span className="absolute left-[50%] top-0 -translate-x-1/2 font-mono text-[10px] leading-5">5.0</span>
              <span className="absolute left-[27%] top-0 -translate-x-1/2 text-[10px] leading-5 text-green-700 dark:text-green-400">사용</span>
              <span className="absolute left-[78%] top-0 -translate-x-1/2 text-[10px] leading-5 text-muted-foreground">버림</span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
