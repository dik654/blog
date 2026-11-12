import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rc 마지막 문단 — 남은 차이 e^(−t/τ), τ=1 ms(가정한 1 kΩ·1 µF).
 * 칸 100개 = 처음 남은 차이 5 V, 칸 하나 = 0.05 V.
 * 0 ms 100%, 1 ms 36.8%, 2 ms 13.5%, 3 ms 5.0%, 4.605 ms(τ ln100) 1.0%. 칸 수는 반올림.
 */
const SCENES = [
  { label: "닫은 직후", summary: "남은 차이 100칸 · 5 V", cells: 100, gap: "5 V", out: "0 V", note: "칸 100개가 처음 남은 5 V 차이 전체입니다. 칸 하나는 0.05 V입니다. 채워진 칸이 아직 남은 차이, 빈칸이 이미 도착한 몫입니다." },
  { label: "1 ms (1τ)", summary: "36.8% → 약 37칸", cells: 37, gap: "1.84 V", out: "3.16 V", note: "1 ms가 지나면 남은 차이가 처음의 약 36.8%입니다. 63.2%가 도착해 출력은 약 3.16 V입니다." },
  { label: "2 ms (2τ)", summary: "36.8%의 36.8% → 약 14칸", cells: 14, gap: "0.68 V", out: "4.32 V", note: "다음 1 ms에도 그때 남은 차이의 36.8%만 남습니다. 37칸이 약 14칸(13.5%)이 됩니다. 시간마다 같은 양이 아니라 같은 비율이 줄어듭니다." },
  { label: "3 ms (3τ)", summary: "약 5% → 5칸", cells: 5, gap: "0.25 V", out: "4.75 V", note: "3τ에서도 약 5%, 0.25 V가 남습니다. ‘3τ면 완전히 충전’이 아닌 이유가 이 다섯 칸입니다." },
  { label: "4.605 ms", summary: "1% → 1칸", cells: 1, gap: "0.05 V", out: "4.95 V", note: "남은 비율이 0.01이 되는 시각은 τ ln100≈4.605τ입니다. 이 회로에서는 4.605 ms 뒤 한 칸만 남고, 출력은 4.95 V 이상입니다." },
] as const;

export default function RemainingGapGridViz() {
  return (
    <SceneShell
      eyebrow="1 ms마다 같은 비율로 줄어드는 차이"
      title="남은 차이 100칸이 한 칸이 될 때까지"
      description="처음 0 V인 1 µF를 1 kΩ을 거쳐 5 V로 채우는 앞의 회로(가정)입니다. 칸 100개는 5 V까지 남은 차이이고, 시간 상수 τ=RC=1 ms마다 그때 남은 칸의 약 36.8%만 남깁니다."
      note="칸 수는 남은 비율을 반올림했습니다. 2 ms 값(13.5%, 4.32 V)은 본문의 같은 식에 t=2 ms를 넣은 계산입니다."
      ariaLabel="시간 상수마다 남은 전압 차이가 36.8퍼센트씩 남는 과정과 1퍼센트 도달 시각"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="flex min-w-0 flex-row items-start justify-center gap-4 sm:gap-8">
            <div className="grid w-[55%] max-w-[220px] shrink-0 grid-cols-10 gap-[2px] sm:gap-[3px]" role="img" aria-label={`칸 100개 중 ${scene.cells}칸이 남은 차이`}>
              {Array.from({ length: 100 }, (_, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-[2px] border ${index < scene.cells ? "border-[#d97706] bg-[#f59e0b]" : "border-border bg-background"}`}
                />
              ))}
            </div>
            <dl className="grid min-w-0 grid-cols-1 gap-y-3 text-sm sm:w-48">
              <div>
                <dt className="text-xs text-muted-foreground">남은 차이(채운 칸)</dt>
                <dd className="font-mono text-lg font-bold text-[#b45309] dark:text-[#f59e0b]">{scene.gap}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">출력 전압(빈칸)</dt>
                <dd className="font-mono text-lg font-bold">{scene.out}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">칸 하나</dt>
                <dd className="text-xs leading-5">0.05 V · 처음 차이의 1%</dd>
              </div>
            </dl>
          </div>
        );
      }}
    />
  );
}
