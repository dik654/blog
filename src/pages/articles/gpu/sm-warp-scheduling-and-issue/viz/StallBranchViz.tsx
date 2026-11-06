import SceneShell from "./SceneShell";

/**
 * 본문 대응: #profiler-states — 명령을 내지 못한 warp를 네 갈래로 나눈다.
 * 후보였으나 밀림(not selected) / 입력 대기(long·short scoreboard, wait) / pipe 대기(math pipe throttle) / 별도 원인.
 */
const BRANCHES = [
  { head: "명령을 낼 수 있었음", sub: "다른 warp가 선택됨", leaves: [{ name: "Not selected", def: "후보였지만 이번 clock에 밀림" }] },
  {
    head: "입력 결과를 기다림",
    sub: "앞 결과에 대한 의존",
    leaves: [
      { name: "Long scoreboard", def: "L1TEX 경로의 local·global·surface·texture 연산 결과" },
      { name: "Short scoreboard", def: "L1TEX가 아닌 MIO 연산. shared memory가 흔한 원인이나 다른 명령도 포함될 수 있음" },
      { name: "Wait", def: "고정 지연을 가진 실행 의존과 연결" },
    ],
  },
  { head: "실행 pipe를 기다림", sub: "입력은 모두 와도", leaves: [{ name: "Math pipe throttle", def: "해당 pipe가 사용 가능해지기를 기다림" }] },
  { head: "그 밖의 별도 원인", sub: "위 갈래와 따로 읽음", leaves: [{ name: "Barrier 대기", def: "barrier에서 기다림" }, { name: "명령 공급", def: "명령을 가져오지 못한 상태" }] },
] as const;

const SCENES = [
  { label: "후보였지만 밀림", summary: "clock 1의 B·C·D", note: "명령을 낼 수 있었지만 다른 warp가 선택된 경우입니다. 사례의 clock 1에서 A가 선택되면 B·C·D가 여기에 해당하며, 입력이 아직 없어 막힌 상태와 다릅니다." },
  { label: "입력을 기다림", summary: "clock 6의 네 warp", note: "사례의 clock 6은 입력 의존 조건이 실패한 경우이며, 모형은 세 항목 중 어느 것인지 정하지 않습니다. Long scoreboard 비율만으로 어느 load가 몇 clock 걸렸는지나 HBM 메모리 자체의 지연을 직접 측정했다고 말할 수 없습니다." },
  { label: "실행 pipe를 기다림", summary: "입력이 와도 막힐 수 있음", note: "모든 입력이 와도 특정 pipe에 일이 몰리면 발행이 막힐 수 있습니다. 일반적인 발행 이후 대기열의 길이로 설명하지 않습니다." },
  { label: "별도 원인", summary: "barrier · 명령 공급", note: "Barrier 대기와 명령을 가져오지 못한 상태도 별도 원인입니다. 각 항목은 대상 GPU와 도구의 정의를 확인합니다." },
] as const;

export default function StallBranchViz() {
  return (
    <SceneShell
      eyebrow="명령을 내지 못한 warp"
      title="같은 '발행 안 됨'도 어디서 멈췄는지에 따라 이름이 갈립니다"
      description="굵은 글자가 멈춘 이유, 고정폭 이름이 Profiler 항목입니다. L1TEX는 L1 cache·texture 경로, MIO는 그와 다른 메모리 입출력 계열 경로입니다."
      ariaLabel="명령을 내지 못한 warp의 네 갈래와 각 Profiler 항목"
      scenes={SCENES}
      render={(index) => (
        <div className="space-y-2">
          {BRANCHES.map((branch, row) => {
            const on = row === index;
            return (
              <div key={branch.head} className={`grid gap-x-3 gap-y-1 rounded-lg border p-3 sm:grid-cols-[10.5rem_minmax(0,1fr)] ${on ? "border-primary bg-primary/10" : "border-border/60 opacity-60"}`}>
                <div>
                  <p className={`text-sm ${on ? "font-bold" : "font-semibold"}`}>{on ? "▶ " : ""}{branch.head}</p>
                  {on && <p className="text-xs leading-5 text-muted-foreground">{branch.sub}</p>}
                </div>
                {on ? (
                  <ul className="space-y-1">
                    {branch.leaves.map((leaf) => (
                      <li key={leaf.name} className="text-xs leading-5">
                        <span className="font-mono font-bold">{leaf.name}</span>
                        <span className="text-muted-foreground"> · {leaf.def}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-mono text-xs leading-5">{branch.leaves.map((leaf) => leaf.name).join(" · ")}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
