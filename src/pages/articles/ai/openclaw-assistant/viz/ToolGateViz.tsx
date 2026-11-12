import SceneShell from "./SceneShell";

/**
 * 본문 대응: #security-reply "deny가 항상 우선합니다…".
 * 세 판정(tool policy → sandbox → elevated)을 차례로 거친 tool 호출이 어느 칸에서 실행되는지 보입니다.
 * Gateway 프로세스는 모든 장면에서 host 칸에 남습니다.
 */
type Zone = "none" | "host" | "sandbox";
type Verdict = { text: string; tone: "pass" | "block" | "skip" | "info" };

const SCENES = [
  {
    label: "deny된 exec",
    summary: "elevated가 있어도 실행 안 함",
    tool: "exec",
    gates: [
      { text: "deny", tone: "block" },
      { text: "판정하지 않음", tone: "skip" },
      { text: "되살리지 못함", tone: "skip" },
    ],
    zone: "none",
    note: "deny가 항상 우선합니다. Elevated는 실행 위치를 바꾸는 예외일 뿐이라 금지된 tool을 다시 허용하지 않습니다.",
  },
  {
    label: "허용 · sandbox off",
    summary: "기본값이면 host에서 실행",
    tool: "exec",
    gates: [
      { text: "allow", tone: "pass" },
      { text: "mode off (기본)", tone: "info" },
      { text: "해당 없음", tone: "skip" },
    ],
    zone: "host",
    note: "기본 sandbox mode는 off입니다. OpenClaw를 설치했다는 사실만으로 tool이 container 안에서 실행된다고 가정할 수 없습니다.",
  },
  {
    label: "허용 · sandbox on",
    summary: "sandbox backend에서 실행",
    tool: "exec",
    gates: [
      { text: "allow", tone: "pass" },
      { text: "sandbox", tone: "info" },
      { text: "요청 없음", tone: "skip" },
    ],
    zone: "sandbox",
    note: "Sandbox를 켜면 허용된 tool의 실행 위치가 sandbox backend로 바뀝니다. 그래도 Gateway 프로세스는 host에 남습니다.",
  },
  {
    label: "허용 · elevated",
    summary: "exec를 host나 node에서",
    tool: "exec",
    gates: [
      { text: "allow", tone: "pass" },
      { text: "sandbox", tone: "info" },
      { text: "승인 조건 충족", tone: "pass" },
    ],
    zone: "host",
    note: "보통 sandbox에서 실행할 exec를 승인 조건 아래 host나 node에서 실행하도록 하는 것이 elevated입니다.",
  },
  {
    label: "exec가 아닌 tool",
    summary: "elevated 적용 대상 아님",
    tool: "다른 tool (가정)",
    gates: [
      { text: "allow", tone: "pass" },
      { text: "sandbox", tone: "info" },
      { text: "exec 전용", tone: "skip" },
    ],
    zone: "sandbox",
    note: "Elevated는 exec 전용 예외입니다. 다른 tool은 elevated와 관계없이 sandbox 판정대로 실행 위치가 정해집니다.",
  },
] as const satisfies readonly { label: string; summary: string; tool: string; gates: readonly Verdict[]; zone: Zone; note: string }[];

const GATES = ["Tool policy · 호출 가능?", "Sandbox · 어디서?", "Elevated · exec 예외?"] as const;

const TONE: Record<Verdict["tone"], string> = {
  pass: "border-[#16a34a] text-[#15803d] dark:text-[#4ade80]",
  block: "border-[#dc2626] text-[#b91c1c] dark:text-[#f87171]",
  skip: "border-dashed border-border text-muted-foreground",
  info: "border-[#2563eb] text-[#1d4ed8] dark:text-[#60a5fa]",
};

const ZONES: readonly { key: Zone; title: string }[] = [
  { key: "none", title: "실행 안 함" },
  { key: "host", title: "host (또는 node)" },
  { key: "sandbox", title: "sandbox backend" },
];

export default function ToolGateViz() {
  return (
    <SceneShell
      eyebrow="허용 · 위치 · 예외"
      title="deny가 먼저 이기고, 실행 위치는 그다음에 정해집니다"
      description="위 줄은 세 판정의 결과, 아래 줄은 tool이 실제로 실행되는 칸입니다. Gateway 프로세스는 모든 장면에서 host에 있습니다."
      ariaLabel="Tool policy, sandbox, elevated 판정에 따른 tool 실행 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              Model이 제안한 호출: <span className="font-mono font-bold text-foreground">{scene.tool}</span>
            </p>
            <div className="grid grid-cols-3 gap-2">
              {GATES.map((gate, index) => {
                const verdict: Verdict = scene.gates[index];
                return (
                  <div key={gate} className={`min-w-0 rounded-lg border px-2 py-2 ${TONE[verdict.tone]}`}>
                    <p className="break-keep text-[10px] font-bold leading-4 text-muted-foreground sm:text-[11px]">{gate}</p>
                    <p className="mt-1 break-keep text-xs font-bold leading-5">{verdict.text}</p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ZONES.map((zone) => {
                const here = zone.key === scene.zone;
                return (
                  <div key={zone.key} className={`flex min-h-[7.5rem] min-w-0 flex-col rounded-lg border p-2 ${here ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border bg-background"}`}>
                    <p className="break-keep text-[11px] font-bold">{zone.title}</p>
                    <div className="mt-2 flex flex-1 flex-col justify-end gap-1">
                      {zone.key === "host" && <span className="rounded border border-border px-1.5 py-1 text-center text-[10px] leading-4 text-muted-foreground">Gateway 프로세스</span>}
                      {here && <span className="rounded border border-[#2563eb] px-1.5 py-1 text-center font-mono text-[10px] font-bold leading-4 text-[#1d4ed8] dark:text-[#60a5fa]">{scene.zone === "none" ? `${scene.tool} 호출 거부` : `${scene.tool} 실행`}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
