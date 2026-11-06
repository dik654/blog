import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #release-boundary — 2개/회 × 8회/장치 × 4장치 = 64개 (가정).
 * 칸 하나가 한 묶음(자료 2개), 가로가 누적 횟수, 세로가 장치.
 */
const SCENES: readonly ShellScene[] = [
  { label: "한 묶음", summary: "2개", note: "장치 하나가 한 번에 읽는 묶음에는 자료가 2개 있습니다. 칸 안의 작은 네모 하나가 자료 하나입니다." },
  { label: "한 장치에서 8회 누적", summary: "2 × 8 = 16개", note: "갱신하기 전에 한 장치에서 묶음을 8번 읽습니다. 가로 한 줄이 한 장치의 몫입니다." },
  { label: "장치 4개", summary: "2 × 8 × 4 = 64개", note: "한 갱신의 자료 수는 64개입니다. 다만 장치 사이에서 이미 평균을 했는지까지 확인해야 같은 64개의 평균이 됩니다." },
];

const ROUNDS = Array.from({ length: 8 }, (_, index) => index);
const DEVICES = Array.from({ length: 4 }, (_, index) => index);

export default function DeviceGridViz() {
  return (
    <SceneShell
      eyebrow="한 갱신의 자료 수"
      title="묶음 크기, 누적 횟수, 장치 수를 곱한 칸이 한 갱신에 들어갑니다"
      description="가로는 누적 횟수, 세로는 장치입니다. 같은 크기와 같은 가중치의 묶음이라고 가정한 숫자입니다 (가정)."
      ariaLabel="묶음 2개, 누적 8회, 장치 4개를 곱한 64개의 자료 격자"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-1">
          {DEVICES.map((device) => (
            <div key={device} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-1">
              <span className={`text-xs ${active === 2 || device === 0 ? "font-semibold" : "text-muted-foreground/50"}`}>장치 {device + 1}</span>
              <div className="grid grid-cols-8 gap-1">
                {ROUNDS.map((round) => {
                  const lit = active === 2 || (device === 0 && (active === 1 || round === 0));
                  return (
                    <div key={round} className={`flex h-7 items-center justify-center gap-px rounded-sm border sm:h-9 ${lit ? "border-primary" : "border-border/40"}`}>
                      <span className="h-3 w-[32%] rounded-[1px]" style={{ backgroundColor: lit ? "#2563eb" : "#cbd5e1", opacity: lit ? 1 : 0.4 }} />
                      <span className="h-3 w-[32%] rounded-[1px]" style={{ backgroundColor: lit ? "#2563eb" : "#cbd5e1", opacity: lit ? 1 : 0.4 }} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    />
  );
}
