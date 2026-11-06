import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 접근 위치를 모를 때와 먼저 받을 때의 일 순서.
 * 칸은 순서만 나타냅니다. 시간 길이가 아니므로 어느 쪽이 얼마나 빠른지는 그림에서 읽을 수 없습니다.
 */
const WITHOUT = [
  { text: "거래 실행 시작", wait: false },
  { text: "필요한 칸을 처음 발견", wait: false },
  { text: "디스크 읽기를 기다림", wait: true },
  { text: "실행을 이어 감", wait: false },
  { text: "다음 거래로", wait: false },
];
const WITH = [
  { text: "위치·거래별 결과 수신", wait: false },
  { text: "데이터를 미리 읽음", wait: false },
  { text: "여러 검증 작업 준비", wait: false },
  { text: "거짓이 없는지 확인", wait: false, must: true },
];

const SCENES = [
  { label: "위치를 모를 때", summary: "실행 중간에 기다림", lane: 0, note: "거래를 하나씩 실행하다가 필요한 저장 칸(계약이 값을 보관하는 자리)을 처음 발견하면 그때 디스크 읽기를 기다립니다." },
  { label: "접근 목록이 먼저 오면", summary: "준비를 앞당길 수 있음", lane: 1, note: "접근할 위치와 거래별 결과를 담은 목록이 먼저 오면 데이터를 미리 읽고 여러 검증 작업을 준비할 수 있습니다." },
  { label: "그래도 남는 검사", summary: "거짓 값은 확인해야 합니다", lane: 1, note: "목록을 보낸 사람이 거짓 90을 넣었는지 확인하는 일은 여전히 필요합니다. 시간이 얼마나 줄어드는지는 이 그림으로 말할 수 없습니다." },
] as const;

function Lane({ title, on, steps, showMust }: { title: string; on: boolean; steps: readonly { text: string; wait: boolean; must?: boolean }[]; showMust: boolean }) {
  return (
    <div className={`min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${on ? "" : "opacity-40"}`}>
      <p className="mb-2 text-xs font-bold leading-5 text-primary">{title}</p>
      <ol className="space-y-1.5">
        {steps.map((step, index) => {
          const emphasis = step.wait ? { borderColor: "#dc2626", backgroundColor: "#dc262614" } : step.must && showMust ? { borderColor: "#d97706", backgroundColor: "#d9770614" } : undefined;
          return (
            <li key={step.text} className={`rounded-lg border px-2 py-1.5 text-xs font-medium leading-5 sm:text-sm ${emphasis ? "" : "border-border bg-background"}`} style={emphasis}>
              <span className="mr-1 font-mono text-muted-foreground">{index + 1}</span>{step.text}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ReadPrepOrderViz() {
  return (
    <SceneShell
      eyebrow="일의 순서"
      title="접근 위치를 언제 아느냐가 디스크 읽기의 자리를 바꿉니다"
      description="위에서 아래로 일이 진행됩니다. 칸은 순서만 나타내고 시간 길이가 아닙니다."
      ariaLabel="접근 위치를 모를 때와 먼저 받을 때의 작업 순서 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-6">
            <Lane title="위치를 모름" on={scene.lane === 0} steps={WITHOUT} showMust={false} />
            <Lane title="목록을 먼저 받음" on={scene.lane === 1} steps={WITH} showMust={active === 2} />
          </div>
        );
      }}
    />
  );
}
