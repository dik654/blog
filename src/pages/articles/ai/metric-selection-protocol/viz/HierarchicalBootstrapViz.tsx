import SceneShell from "./SceneShell";

/**
 * 본문 대응: #receipt — 같은 환경을 5회 실행, 회차마다 40,000건(합계 20만). 실행을 뽑고, 뽑힌 실행 안에서 사례를 다시 뽑는다.
 * 재표집 2,000회, seed 27. 점추정 96ms, 95% 상한 99ms, 허용값 100ms는 글의 가정이다.
 * 어느 실행이 뽑혔는지, 어느 점이 뽑혔는지는 설명용 예다.
 */
const RUNS = [1, 2, 3, 4, 5];
const DRAWN = [
  { run: 2, picked: [1, 1, 0, 1, 1, 0, 1, 1] },
  { run: 2, picked: [0, 1, 1, 1, 0, 1, 1, 1] },
  { run: 4, picked: [1, 0, 1, 1, 1, 1, 0, 1] },
  { run: 5, picked: [1, 1, 1, 0, 1, 0, 1, 1] },
  { run: 1, picked: [1, 1, 0, 1, 1, 1, 1, 0] },
] as const;

const SCENES = [
  { label: "측정은 다섯 번", summary: "5 × 40,000 = 200,000건", stage: 0, note: "같은 cpu-profile-a 환경을 다섯 번 독립 실행하고 회차마다 40,000건을 잽니다. 묶음을 나눈 이유는 실행 간 변동도 구간에 담기 위해서입니다." },
  { label: "1단계: 실행을 뽑습니다", summary: "5개에서 5번, 중복 허용", stage: 1, note: "재표집은 가진 표본에서 중복을 허용해 다시 뽑는 일입니다. 그래서 어떤 실행은 두 번, 어떤 실행은 한 번도 안 뽑힐 수 있습니다. 그림의 실행 번호는 설명용 예입니다." },
  { label: "2단계: 그 안에서 사례를 뽑습니다", summary: "뽑힌 실행 안에서 다시 뽑기", stage: 2, note: "뽑힌 실행마다 그 안의 고객 사례를 다시 뽑습니다. 40,000건을 점 8개로 줄여 그렸습니다. 채운 점은 이번에 한 번 이상 뽑힌 사례, 빈 점은 빠진 사례의 예입니다. 여기서도 중복을 허용하지만 점은 횟수를 나타내지 않습니다." },
  { label: "2,000번 되풀이합니다", summary: "95% 상한 99ms ≤ 100ms", stage: 3, note: "이 두 단계를 정해 둔 2,000회 되풀이해 p95가 표본 변동에 따라 움직이는 95% 구간을 얻습니다. 난수 seed 27로 같은 구간을 재현합니다. 점추정(표본에서 구한 값 하나) 96ms와 구간 상한 99ms는 계산을 설명하기 위한 가정입니다." },
] as const;

function Dots({ picked }: { picked: readonly number[] }) {
  return (
    <span className="mt-1 grid grid-cols-4 justify-items-center gap-1">
      {picked.map((value, index) => (
        <span key={index} className="h-2 w-2 rounded-full border" style={{ borderColor: "#2563eb", backgroundColor: value ? "#2563eb" : "transparent" }} />
      ))}
    </span>
  );
}

export default function HierarchicalBootstrapViz() {
  return (
    <SceneShell
      eyebrow="지연 구간을 만드는 재표집"
      title="실행과 사례를 차례로 다시 뽑는다는 말은 무슨 뜻인가"
      description="p95는 요청 95%가 이 시간 안에 끝나는 지연 경계입니다. 윗줄이 실제로 잰 다섯 번의 실행이고, 아랫줄이 재표집 한 회입니다."
      ariaLabel="다섯 실행과 그 안의 사례를 계층적으로 재표집해 p95 구간을 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const { stage } = SCENES[active];
        return (
          <div className="mx-auto max-w-[540px] space-y-3 text-xs">
            <div>
              <p className="mb-1 font-semibold">잰 실행 · 회차마다 40,000건</p>
              <div className="grid grid-cols-5 gap-1">
                {RUNS.map((run) => (
                  <span key={run} className="rounded border border-border px-1 py-1.5 text-center font-semibold">실행 {run}</span>
                ))}
              </div>
            </div>
            <div className={stage >= 1 ? "" : "opacity-30"}>
              <p className="mb-1 font-semibold">재표집 한 회 (예)</p>
              <div className="grid grid-cols-5 gap-1">
                {DRAWN.map((draw, index) => (
                  <span key={index} className="min-h-[3.75rem] rounded border px-1 py-1.5 text-center font-semibold" style={{ borderColor: stage >= 1 ? "#2563eb" : "#94a3b8", color: stage >= 1 ? "#2563eb" : "#94a3b8" }}>
                    {stage >= 1 ? `실행 ${draw.run}` : "?"}
                    {stage >= 2 && <Dots picked={draw.picked} />}
                  </span>
                ))}
              </div>
            </div>
            <div className={`grid grid-cols-3 gap-1 text-center ${stage >= 3 ? "" : "invisible"}`}>
              {[["점추정", "96ms"], ["95% 상한", "99ms"], ["허용값", "100ms"]].map(([name, value]) => (
                <span key={name} className="rounded border border-border py-1.5">
                  <span className="block text-muted-foreground">{name}</span>
                  <strong className="font-mono">{value}</strong>
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
