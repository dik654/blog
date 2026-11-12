import SceneShell from "./SceneShell";

/**
 * 본문 대응: #distinguishing — 차이가 앞 판례의 필요한 이유와 관련되는지가 구별의 정당성을 가른다.
 * 구급차의 환자 이송 목적은 "개인 이동"과 관련되고, 색상·제조사는 어느 이유와도 무관하다.
 * 구별이 반복돼 예외가 원칙보다 길어지면 예측이 어려워진다. 예외 개수는 그림용 가정.
 */
const REASONS = ["개인 이동", "보행자 위험"] as const;

const SCENES = [
  {
    label: "이유와 관련된 차이",
    summary: "환자 이송 목적 → 구별",
    diff: "환자를 옮기는 구급차",
    hits: [0] as number[],
    verdict: "구별: 앞 판례는 유지, 적용 범위만 좁힘",
    note: "킥보드 사건의 필요한 이유가 개인 이동과 보행자 위험이었다면, 환자를 옮기는 구급차는 '개인 이동'이라는 목적부터 다릅니다. 이 차이가 이유와 직접 관련된다는 점을 근거로 앞 이유가 구급차까지 닿지 않는다고 설명하면 판례를 부정하지 않고 범위를 좁힙니다.",
  },
  {
    label: "이유와 무관한 차이",
    summary: "색상·제조사 → 사실상 회피",
    diff: "색상이 다른 킥보드 · 제조사가 다른 킥보드",
    hits: [] as number[],
    verdict: "이름만 구별: 사실상 판례를 피함",
    note: "색상이나 제조사는 판결 이유 어느 것과도 관련이 없습니다. 이런 차이를 내세우면 앞 판례를 따르지 않으면서도 구별이라고 부르는 셈입니다.",
  },
  {
    label: "구별이 쌓이면",
    summary: "예외 > 원칙 → 정리 필요",
    diff: "",
    hits: [] as number[],
    verdict: "",
    note: "구별이 반복돼 예외 목록이 원칙보다 길어지면 지금 무엇이 규칙인지 예측하기 어려워집니다. 그때는 판례 자체를 정리할 필요가 커집니다. 예외 다섯 줄은 그림을 위한 가정입니다.",
  },
] as const;

const EXCEPTIONS = ["예외 1", "예외 2", "예외 3", "예외 4", "예외 5"] as const;

export default function DistinguishingTestViz() {
  return (
    <SceneShell
      eyebrow="구별의 시험"
      title="구별이 정당한지는 차이가 앞 판례의 이유와 관련되는지로 가립니다"
      description="앞 두 장면의 왼쪽은 킥보드 사건 결론에 필요했던 이유, 오른쪽은 새 사건의 차이입니다. 두 사건은 본문의 가상 사례입니다."
      ariaLabel="새 사건의 차이가 앞 판례의 이유와 관련되는지에 따라 구별과 회피를 가르는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        if (active === 2) {
          return (
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted-foreground">원칙</p>
                <p className="mt-2 rounded-md border-2 border-primary px-3 py-2 text-sm font-semibold">공원 차량 출입 금지</p>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted-foreground">구별로 생긴 예외 (가정)</p>
                <ul className="mt-2 space-y-1">
                  {EXCEPTIONS.map((e) => (
                    <li key={e} className="rounded-md border border-dashed border-amber-600 px-3 py-1 text-xs">
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs font-semibold text-red-700 dark:text-red-400">현재 규칙을 예측하기 어려움</p>
              </div>
            </div>
          );
        }
        const legit = scene.hits.length > 0;
        return (
          <div className="min-w-0">
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-2">
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">필요한 이유</p>
                {REASONS.map((r, i) => (
                  <p
                    key={r}
                    className={`rounded-md px-3 py-2 text-sm ${scene.hits.includes(i) ? "border-2 border-primary bg-primary/[0.08] font-bold" : "border border-border"}`}
                  >
                    {r}
                  </p>
                ))}
              </div>
              <span aria-hidden className={`text-center font-mono text-lg ${legit ? "text-primary" : "text-muted-foreground"}`}>
                {legit ? "←" : "×"}
              </span>
              <div className="min-w-0 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">새 사건의 차이</p>
                <p className={`rounded-md px-3 py-2 text-sm ${legit ? "border-2 border-primary" : "border border-dashed border-red-600"}`}>{scene.diff}</p>
                <p className="text-xs text-muted-foreground">{legit ? "이유와 직접 관련됨" : "어느 이유와도 무관"}</p>
              </div>
            </div>
            <p className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${legit ? "border-primary/60" : "border-red-600/60 text-red-700 dark:text-red-400"}`}>
              {scene.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
