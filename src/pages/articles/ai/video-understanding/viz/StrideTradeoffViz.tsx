import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling-rate 둘째 문단 — stride를 늘리면 같은 frame budget으로 더 긴 시간을 덮지만
 * 초당 관측 횟수는 줄어든다.
 * T=16 고정, 30fps. 관측 시간 = (T−1)×s/30, 초당 관측 = 30/s.
 * s=1: 0.5 s · 30/s, s=2: 1.0 s · 15/s, s=3: 1.5 s · 10/s(본문 사례), s=6: 3.0 s · 5/s.
 * 두 값의 곱은 늘 T−1=15입니다. s=1·2·6은 비교용 가정입니다.
 */
const T = 16;
const FPS = 30;
const MAX_FRAMES = 90;

const STRIDES = [1, 2, 3, 6] as const;

const SCENES = STRIDES.map((s) => {
  const lastIndex = (T - 1) * s;
  const seconds = lastIndex / FPS;
  const rate = FPS / s;
  const isArticle = s === 3;
  return {
    stride: s,
    lastIndex,
    seconds,
    rate,
    label: isArticle ? "stride 3 · 본문 사례" : `stride ${s} (가정)`,
    summary: `${seconds.toFixed(1)}초 · 초당 ${rate}번`,
    note: isArticle
      ? "본문 사례입니다. 마지막 관측점의 index는 15×3=45이고, 1.5초를 초당 10번씩 봅니다."
      : s < 3
        ? `세 칸 대신 ${s}칸마다 고르면 마지막 index는 15×${s}=${lastIndex}입니다. 관측 시간은 ${seconds.toFixed(1)}초로 짧아지고, 초당 관측은 30÷${s}=${rate}번으로 촘촘해집니다.`
        : `여섯 칸마다 고르면 마지막 index는 15×6=90입니다. 같은 16장으로 3.0초를 덮지만 초당 관측은 30÷6=5번으로 줄어, 관측점 사이가 0.2초로 벌어집니다.`,
  };
});

const X0 = 18;
const X1 = 342;
const fx = (frame: number) => X0 + (frame / MAX_FRAMES) * (X1 - X0);

function Bar({ label, value, max, text, color }: { label: string; value: number; max: number; text: string; color: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_4.5rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_5rem] sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / max) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono font-bold">{text}</span>
    </div>
  );
}

export default function StrideTradeoffViz() {
  return (
    <SceneShell
      eyebrow="같은 16장, 다른 stride"
      title="Stride를 늘리면 덮는 시간은 길어지고 초당 관측은 줄어듭니다"
      description="Model에 넣는 관측점 수(frame budget)를 16개로 고정하고, 30fps 원본에서 몇 칸마다 고를지(stride)만 바꿉니다. 짧은 눈금 하나가 source frame 하나, 긴 파란 눈금이 관측점입니다. stride 1·2·6은 비교용 가정입니다."
      ariaLabel="관측점 16개를 stride 1, 2, 3, 6으로 고를 때 관측 시간과 초당 관측 횟수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const picks = Array.from({ length: T }, (_, i) => i * scene.stride);
        return (
          <div className="min-w-0">
            <p className="text-xs font-bold sm:text-sm">관측점 16개 · 마지막 index {scene.lastIndex}</p>
            <svg viewBox="0 0 360 44" role="img" aria-label={`source frame 0부터 90 가운데 stride ${scene.stride}로 고른 관측점 16개`} className="mt-1 block h-auto w-full">
              {Array.from({ length: MAX_FRAMES + 1 }, (_, frame) => (
                <line key={frame} x1={fx(frame)} y1={26} x2={fx(frame)} y2={32} stroke="#94a3b8" strokeWidth="1" />
              ))}
              <rect x={fx(0)} y={6} width={fx(scene.lastIndex) - fx(0)} height={6} rx={2} fill="#2563eb" opacity={0.25} />
              {picks.map((frame) => (
                <line key={frame} x1={fx(frame)} y1={16} x2={fx(frame)} y2={38} stroke="#2563eb" strokeWidth="1.25" />
              ))}
            </svg>
            <div className="relative mt-1 h-9 text-[11px] leading-4 text-muted-foreground sm:text-xs">
              {[0, 30, 60, 90].map((frame) => (
                <span
                  key={frame}
                  className="absolute top-0 whitespace-nowrap text-center"
                  style={{ left: `${(fx(frame) / 360) * 100}%`, transform: `translateX(${frame === 0 ? "-10%" : frame === MAX_FRAMES ? "-90%" : "-50%"})` }}
                >
                  {frame / FPS}초
                  <span className="block font-mono text-[10px]">index {frame}</span>
                </span>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <Bar label="관측 시간" value={scene.seconds} max={3} text={`${scene.seconds.toFixed(1)} s`} color="#2563eb" />
              <Bar label="초당 관측" value={scene.rate} max={30} text={`${scene.rate} /s`} color="#d97706" />
            </div>
            <p className="mt-3 font-mono text-xs text-muted-foreground">
              {scene.seconds.toFixed(1)} s × {scene.rate} /s = {T - 1} 간격 (늘 T−1)
            </p>
          </div>
        );
      }}
    />
  );
}
