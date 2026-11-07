import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — task가 잠들 때 받는 두 표시. 첫째가 load를, 둘째가 vmstat b를 올린다.
 * 16 vCPU 합산은 3절의 가정: 도는 8 + 디스크 잠 22 = 30, 30 × 2048 = 61,440.
 */
type Tone = "yes" | "no" | "skip";

interface Scene {
  label: string;
  summary: string;
  note: string;
  who: string;
  first: { tone: Tone; text: string };
  second: { tone: Tone; text: string };
  load: string;
  blocked: string;
  ps: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "디스크 응답을 기다리는 잠",
    summary: "load +1 · b +1",
    who: "UNINTERRUPTIBLE, in_iowait 켜짐",
    first: { tone: "yes", text: "예 → nr_uninterruptible +1" },
    second: { tone: "yes", text: "예 → nr_iowait +1" },
    load: "+1",
    blocked: "+1",
    ps: "D",
    note: "두 표시를 모두 받습니다. 그래서 load에도 b에도 나타납니다. 깨어나면 core.c 3665–3666행이 nr_uninterruptible을 다시 내립니다.",
  },
  {
    label: "lock을 기다리는 잠",
    summary: "load +1 · b 그대로",
    who: "UNINTERRUPTIBLE, in_iowait 꺼짐",
    first: { tone: "yes", text: "예 → nr_uninterruptible +1" },
    second: { tone: "no", text: "아니요 → 올리지 않음" },
    load: "+1",
    blocked: "0",
    ps: "D",
    note: "첫 표시만 받고 둘째 표시는 받지 않습니다. 그래서 load에는 들어가도 b에는 없고, D 전체는 ps로 세어야 합니다.",
  },
  {
    label: "TASK_IDLE로 자는 잠",
    summary: "load에 안 들어감",
    who: "UNINTERRUPTIBLE + NOLOAD",
    first: { tone: "no", text: "아니요 → NOLOAD에서 걸러짐" },
    second: { tone: "skip", text: "이 글이 따지지 않음" },
    load: "0",
    blocked: "−",
    ps: "I",
    note: "신호로 깨지 않는 잠이라도 모두 load에 들어가는 것은 아닙니다. (가정) 3절의 22개가 이렇게 잤다면 load는 8이고, 조건을 보이려고 꾸민 반사실입니다. 실제 디스크 대기는 보통 UNINTERRUPTIBLE로 잡니다.",
  },
  {
    label: "16 vCPU · 디스크 대기 22개",
    summary: "(8 + 22) × 2048 = 61,440",
    who: "(가정) 도는 8개 + 디스크 잠 22개",
    first: { tone: "yes", text: "22개 → nr_uninterruptible +22" },
    second: { tone: "yes", text: "22개 → nr_iowait +22" },
    load: "30",
    blocked: "22",
    ps: "D 22개",
    note: "(가정) 돌고 있는 8개와 합쳐 calc_load_tasks는 30이 됩니다. 5초마다 30 × 2048 = 61,440이 calc_load에 들어가고, 3절의 r 8, b 22 장면과 같은 값이 나옵니다.",
  },
];

const BORDER: Record<Tone, string> = { yes: "#2563eb", no: "#94a3b8", skip: "#94a3b8" };

function Mark({ title, source, tone, text }: { title: string; source: string; tone: Tone; text: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-2.5 sm:p-3" style={{ borderColor: BORDER[tone], borderStyle: tone === "yes" ? "solid" : "dashed" }}>
      <p className="text-xs font-bold leading-5 sm:text-sm">{title}</p>
      <p className="mt-1 font-mono text-[11px] leading-4 text-muted-foreground">{source}</p>
      <p className={`mt-2 text-xs font-bold leading-5 ${tone === "yes" ? "text-foreground" : "text-muted-foreground"}`}>{text}</p>
    </div>
  );
}

function Result({ name, value }: { name: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-border pb-2">
      <p className="text-[11px] leading-4 text-muted-foreground">{name}</p>
      <p className="mt-0.5 font-mono text-sm font-bold">{value}</p>
    </div>
  );
}

export default function SleepMarkViz() {
  return (
    <SceneShell
      eyebrow="잠드는 순간의 두 표시"
      title="잠드는 task는 표시 두 개를 따로 받고, 그 표시가 load와 b를 가릅니다"
      description="NOLOAD는 load에 세지 말라는 표시, FROZEN은 커널이 얼려 둔 task의 상태, in_iowait는 I/O 완료를 기다린다는 표시입니다. 줄 번호는 리눅스 v6.12 기준입니다."
      ariaLabel="잠드는 task의 종류에 따라 load, vmstat b, ps 상태가 달라지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              잠드는 task · <span className="font-mono font-bold text-foreground">{scene.who}</span>
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Result name="load에 더하는 수" value={scene.load} />
              <Result name="vmstat b" value={scene.blocked} />
              <Result name="ps 상태" value={scene.ps} />
            </div>
            <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-2 sm:gap-3">
              <Mark title="표시 1 · UNINTERRUPTIBLE이면서 NOLOAD도 FROZEN도 아닌가" source="core.c 6622–6625 · sched.h 2773–2774" tone={scene.first.tone} text={scene.first.text} />
              <Mark title="표시 2 · in_iowait가 켜져 있는가" source="sched.h 2776–2778 · stat.c 177–183" tone={scene.second.tone} text={scene.second.text} />
            </div>
          </div>
        );
      }}
    />
  );
}
