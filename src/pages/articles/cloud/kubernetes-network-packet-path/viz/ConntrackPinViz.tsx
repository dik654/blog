import SceneShell from "./SceneShell";

/**
 * 본문 대응: #service-path — 기존 연결은 첫 packet의 선택과 conntrack state를 이어 쓴다.
 * 규칙 변경은 Endpoint나 정책 변경을 대표합니다. 새 연결의 목적지는 글이 정하지 않으므로 값을 적지 않습니다.
 */
const SCENES = [
  {
    label: "첫 packet",
    summary: "선택 → 장부에 기록",
    rule: "변경 전",
    oldLane: "규칙이 10.244.2.34:8080을 선택",
    newLane: "아직 없음",
    note: "conntrack은 연결마다 어떤 변환을 했는지 적어 두는 상태 표입니다. 연결의 첫 packet에서 고른 backend가 이 표에 남습니다.",
  },
  {
    label: "규칙 변경",
    summary: "규칙만 바뀜 · 장부 항목은 남음",
    rule: "변경 후",
    oldLane: "연결은 아직 열려 있음",
    newLane: "아직 없음",
    note: "Endpoint나 정책을 바꾼 직후입니다. 규칙은 달라졌지만 열려 있는 연결의 기록이 함께 지워진 것은 아닙니다.",
  },
  {
    label: "기존 연결의 다음 packet",
    summary: "장부를 이어 씀",
    rule: "변경 후",
    oldLane: "장부대로 10.244.2.34:8080",
    newLane: "아직 없음",
    note: "기존 연결은 첫 packet에서 선택한 backend와 conntrack state를 이어 씁니다. 같은 keep-alive 연결(요청이 끝나도 닫지 않고 다시 쓰는 연결)만 시험하면 새 규칙이 적용되지 않은 것처럼 보일 수 있습니다.",
  },
  {
    label: "새 연결",
    summary: "규칙을 다시 통과",
    rule: "변경 후",
    oldLane: "장부대로 10.244.2.34:8080",
    newLane: "변경 후 규칙으로 판정",
    note: "curl --no-keepalive처럼 새 연결을 만들면 Service 선택과 conntrack을 다시 통과합니다. 새 연결과 기존 연결을 나눠 확인하는 이유입니다.",
  },
] as const;

function Lane({ title, value, active }: { title: string; value: string; active: boolean }) {
  return (
    <div className={`rounded-lg border p-2.5 ${active ? "border-blue-600" : "border-border"}`}>
      <p className="text-xs font-bold leading-5">{title}</p>
      <p className={`mt-1 text-xs leading-5 sm:text-sm ${active ? "font-semibold text-blue-700 dark:text-blue-300" : "text-muted-foreground"}`}>{value}</p>
    </div>
  );
}

export default function ConntrackPinViz() {
  return (
    <SceneShell
      eyebrow="연결 상태"
      title="규칙을 바꿔도 기존 연결이 그대로 가는 것처럼 보이는 이유"
      description="위 두 칸은 node가 들고 있는 규칙과 conntrack 장부이고, 아래 두 칸은 그 위를 지나가는 연결입니다. 주소는 3절 사례입니다."
      ariaLabel="규칙 변경 전후에 기존 연결과 새 연결이 서로 다른 근거로 목적지를 정하는 과정"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className={`rounded-lg border p-2.5 ${scene === 1 ? "border-amber-600" : "border-border"}`}>
                <p className="text-xs font-bold leading-5">Service·정책 규칙</p>
                <p className={`mt-1 text-sm font-semibold leading-5 ${item.rule === "변경 후" ? "text-amber-700 dark:text-amber-300" : ""}`}>{item.rule}</p>
              </div>
              <div className={`rounded-lg border p-2.5 ${scene === 2 ? "border-blue-600" : "border-border"}`}>
                <p className="text-xs font-bold leading-5">conntrack 장부의 한 줄</p>
                <p className="mt-1 [overflow-wrap:anywhere] font-mono text-xs leading-5">10.244.1.12:43120 → 10.96.20.15:8080 ⇒ 10.244.2.34:8080</p>
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Lane title="기존 keep-alive 연결" value={item.oldLane} active={scene === 0 || scene === 2} />
              <Lane title="새 연결" value={item.newLane} active={scene === 3} />
            </div>
          </div>
        );
      }}
    />
  );
}
