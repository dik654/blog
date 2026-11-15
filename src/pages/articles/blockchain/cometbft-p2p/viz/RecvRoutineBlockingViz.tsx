import SceneShell from "./SceneShell";

/**
 * 본문 대응: #switch "이 Receive 호출은 MConnection의 같은 recvRoutine에서 실행됩니다."
 * 한 peer connection의 recvRoutine 하나가 packet read → 재조립 → Reactor.Receive를 차례로 수행한다.
 * Receive가 멈추면 같은 peer의 다음 packet(다른 channel 포함)도 읽히지 않고, 다른 peer는 별도 routine이라 계속 읽는다.
 */
type Step = "read" | "receive" | "next";

const SCENES = [
  {
    label: "정상 순서",
    summary: "read → Receive → 다음 read",
    stuck: false,
    focusB: false,
    note: "Peer A의 recvRoutine 하나가 packet을 읽어 message로 조립하고, 같은 흐름 안에서 mempool Reactor.Receive를 호출합니다. Receive가 돌아와야 이 routine이 다음 packet을 읽습니다.",
  },
  {
    label: "Reactor 지연",
    summary: "Receive가 안 끝나면 다음 read도 대기",
    stuck: true,
    focusB: false,
    note: "Mempool Reactor가 오래 멈추면(가정) recvRoutine은 Receive 안에 머뭅니다. 뒤에 도착한 consensus channel packet도 같은 connection의 같은 routine이 읽어야 하므로 함께 기다립니다.",
  },
  {
    label: "다른 peer",
    summary: "peer B는 별도 routine",
    stuck: true,
    focusB: true,
    note: "Peer B는 자기 MConnection과 recvRoutine을 가집니다. Peer A의 지연과 무관하게 packet을 계속 읽습니다. 지연을 공유하는 범위는 같은 peer의 다른 channel입니다.",
  },
] as const;

function StepBox({ label, state }: { label: string; state: "done" | "active" | "wait" | "stuck" }) {
  const cls =
    state === "active"
      ? "border-primary text-primary"
      : state === "stuck"
        ? "border-dashed border-red-600 text-red-700 dark:text-red-400"
        : state === "wait"
          ? "border-dashed border-border text-muted-foreground"
          : "border-border";
  const tag = state === "stuck" ? "멈춤" : state === "wait" ? "대기" : state === "active" ? "진행" : "완료";
  return (
    <div className={`min-w-0 rounded-md border px-2 py-2 text-center text-[11px] leading-4 sm:text-xs ${cls}`}>
      <span className="block break-words font-semibold">{label}</span>
      <span className="mt-1 block font-mono text-[10px]">{tag}</span>
    </div>
  );
}

function Lane({ name, steps, dim }: { name: string; steps: { label: string; key: Step; state: "done" | "active" | "wait" | "stuck" }[]; dim: boolean }) {
  return (
    <div className={`rounded-lg border border-border p-3 transition-opacity motion-reduce:transition-none ${dim ? "opacity-60" : ""}`}>
      <p className="mb-2 text-xs font-bold">{name}</p>
      <div className="grid grid-cols-3 gap-2">
        {steps.map((s) => (
          <StepBox key={s.key} label={s.label} state={s.state} />
        ))}
      </div>
    </div>
  );
}

export default function RecvRoutineBlockingViz() {
  return (
    <SceneShell
      eyebrow="같은 recvRoutine"
      title="느린 Reactor는 그 peer의 다음 packet read를 막습니다"
      description="recvRoutine은 한 peer connection에서 packet을 읽는 routine입니다. 칸은 그 routine이 차례로 하는 일입니다. Peer A와 B는 각자 MConnection을 가진 두 연결입니다."
      ariaLabel="같은 peer의 recvRoutine에서 Reactor.Receive가 멈출 때 다음 packet read와 다른 peer의 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const aSteps = [
          { key: "read" as const, label: "0x30 packet 읽기·조립", state: "done" as const },
          { key: "receive" as const, label: "mempool Reactor.\u200BReceive", state: scene.stuck ? ("stuck" as const) : ("done" as const) },
          { key: "next" as const, label: "다음 packet (consensus)", state: scene.stuck ? ("wait" as const) : ("active" as const) },
        ];
        const bSteps = [
          { key: "read" as const, label: "packet 읽기·조립", state: "done" as const },
          { key: "receive" as const, label: "Reactor.\u200BReceive", state: "done" as const },
          { key: "next" as const, label: "다음 packet", state: "active" as const },
        ];
        return (
          <div className="space-y-3">
            <Lane name="Peer A · recvRoutine" steps={aSteps} dim={scene.focusB} />
            <Lane name="Peer B · 별도 recvRoutine" steps={bSteps} dim={!scene.focusB} />
          </div>
        );
      }}
    />
  );
}
