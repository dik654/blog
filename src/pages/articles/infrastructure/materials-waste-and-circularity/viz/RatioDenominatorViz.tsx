import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 같은 100kg 사례에서 분모가 바뀌면 80%, 75%, 60%가 나온다.
 * 칸 하나 = 1kg. 앞 60칸 회수, 다음 20칸 처리 잔여, 마지막 20칸 미수거.
 * 80/100 = 80%, 60/80 = 75%, 60/100 = 60%.
 */
const SCENES = [
  {
    label: "수거율",
    summary: "80 ÷ 100 = 80%",
    numerator: 80,
    denominator: 100,
    note: "발생한 100kg 전체가 분모이고 모은 80kg이 분자입니다. 그중 얼마가 재료가 됐는지는 이 숫자로 알 수 없습니다.",
  },
  {
    label: "처리 수율",
    summary: "60 ÷ 80 = 75%",
    numerator: 60,
    denominator: 80,
    note: "분모가 수거한 80kg으로 좁아집니다. 미수거 20kg은 계산 밖이고, 재료가 된 60kg만 분자에 남습니다.",
  },
  {
    label: "실제 재료 회수 비율",
    summary: "60 ÷ 100 = 60%",
    numerator: 60,
    denominator: 100,
    note: "분자는 앞 장면과 같은 60kg인데 분모가 처음 100kg이면 60%입니다. 분모를 생략하면 다른 성과로 읽게 됩니다.",
  },
] as const;

const CELLS = Array.from({ length: 100 }, (_, index) => index);

function cellClass(index: number, numerator: number, denominator: number) {
  if (index < numerator) return "border border-[#1d4ed8] bg-[#2563eb]";
  if (index < denominator) return "border border-[#2563eb] bg-background";
  return "border border-dashed border-[#94a3b8] opacity-50";
}

function Legend({ swatch, children }: { swatch: string; children: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`h-3.5 w-3.5 shrink-0 rounded-[2px] ${swatch}`} aria-hidden />
      <span>{children}</span>
    </li>
  );
}

export default function RatioDenominatorViz() {
  return (
    <SceneShell
      eyebrow="세 비율의 분모"
      title="같은 100kg에서 분모를 바꾸면 세 숫자가 나옵니다"
      description="칸 하나가 1kg, 전체가 사용이 끝난 포장재 100kg입니다(가정)."
      note="계산 밖 칸의 물질이 없어지는 것은 아닙니다. 미수거 20kg과 처리 잔여 20kg의 행선지는 따로 확인합니다."
      ariaLabel="100칸 격자에서 수거율, 처리 수율, 실제 재료 회수 비율의 분자와 분모"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-[minmax(0,10rem)_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-8">
            <div className="grid w-full grid-cols-10 gap-[3px] sm:gap-1" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {CELLS.map((index) => (
                <span key={index} className={`aspect-square rounded-[2px] ${cellClass(index, scene.numerator, scene.denominator)}`} />
              ))}
            </div>
            <div className="min-w-0 text-sm">
              <dl className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <dt className="text-xs text-muted-foreground">분자</dt>
                  <dd className="text-base font-bold text-[#2563eb] dark:text-[#93c5fd]">{scene.numerator}kg</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">분모</dt>
                  <dd className="text-base font-bold">{scene.denominator}kg</dd>
                </div>
              </dl>
              <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <Legend swatch="border border-[#1d4ed8] bg-[#2563eb]">채운 칸: 분자</Legend>
                <Legend swatch="border border-[#2563eb] bg-background">빈 칸: 분모에만</Legend>
                <Legend swatch="border border-dashed border-[#94a3b8] opacity-50">점선 칸: 계산 밖</Legend>
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
