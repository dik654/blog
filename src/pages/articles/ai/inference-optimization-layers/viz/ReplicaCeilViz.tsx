import SceneShell from "./SceneShell";

/**
 * 본문 대응: #capacity — 계획 용량 100×0.8=80, 125×0.8=100 요청/s.
 * 부하 180: 2.25→3개, 1.8→2개. 부하 160: 2→2개, 1.6→2개.
 * 180 사례의 반납 1개 × 24시간 × 시간당 2달러 = 하루 48달러.
 */
const AXIS = 240;

const SCENES = [
  { label: "복사본 하나의 몫", summary: "80 → 100 요청/s", load: 0, bill: "−", note: "(별도 용량 가정) 복사본의 처리 용량이 100→125 요청/s로 검증됐고 계획상 80%만 씁니다. 칸 하나가 복사본 하나에 배정할 몫입니다." },
  { label: "부하 180 요청/s", summary: "3개 → 2개", load: 180, bill: "−48달러", note: "변경 전 180÷80=2.25라 올림해 3개, 변경 후 180÷100=1.8이라 2개입니다. 부하가 하루 내내 같고 반납한 GPU 요금이 실제로 사라지며 시간당 2달러라면 하루 24×2=48달러가 줄어듭니다." },
  { label: "부하 160 요청/s", summary: "2개 → 2개", load: 160, bill: "0달러", note: "변경 전 160÷80=2.0, 변경 후 160÷100=1.6이라 올림하면 둘 다 2개입니다. 같은 개선인데 복사본 수는 줄지 않고 이 청구 기준의 절감은 0달러입니다." },
] as const;

function Row({ title, share, load }: { title: string; share: number; load: number }) {
  const count = load === 0 ? 1 : Math.ceil(load / share);
  const ratio = load / share;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
        <span className="font-bold">{title}</span>
        <span className="font-mono text-muted-foreground">{load === 0 ? `칸당 ${share} 요청/s` : `${load}÷${share}=${ratio.toFixed(ratio * 100 % 10 === 0 ? 1 : 2)} → 올림 ${count}개`}</span>
      </div>
      <div className="relative mt-1.5 h-10 w-full rounded-sm bg-muted/40" role="img" aria-label={`${title}: 칸당 ${share} 요청 매초, 칸 ${count}개${load ? `, 부하 ${load}` : ""}`}>
        <div className="absolute inset-y-0 left-0 bg-[#bfdbfe] dark:bg-[#1e3a8a]" style={{ width: `${(load / AXIS) * 100}%` }} />
        <div className="absolute inset-0 flex">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="flex h-full items-center justify-center border border-[#1d4ed8] font-mono text-xs font-bold text-[#1e3a8a] dark:text-[#e2e8f0]" style={{ width: `${(share / AXIS) * 100}%` }}>
              복사본 {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReplicaCeilViz() {
  return (
    <SceneShell
      eyebrow="정수로 줄어드는 용량"
      title="처리 용량이 늘어도 올림한 개수가 바뀌어야 복사본이 줄어듭니다"
      description="복사본(서비스 복사본, replica) 하나에 GPU 하나를 쓴다고 가정합니다. 옅은 파랑이 부하입니다."
      note="부하를 앞 칸부터 채운 것은 필요한 수를 세기 위한 그림이며 실제 배분 방식이 아닙니다. 모든 값은 설명용 가정입니다."
      ariaLabel="부하와 복사본당 계획 용량으로 계산한 필요 복사본 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 text-sm">
            <div className="space-y-3">
              <Row title="변경 전" share={80} load={scene.load} />
              <Row title="변경 후" share={100} load={scene.load} />
            </div>
            <div className="relative mt-1.5 h-5 font-mono text-xs text-muted-foreground">
              <span className="absolute left-0">0</span>
              <span className="absolute right-0">240 요청/s</span>
            </div>
            <p className="mt-1 font-mono text-xs">
              <span className="text-muted-foreground">하루 청구 변화(가정) </span>
              <span className="font-bold">{scene.bill}</span>
            </p>
          </div>
        );
      }}
    />
  );
}
