import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #fixes — tini를 붙여도 start.sh를 그대로 두면 SIGTERM은 sh에서 멈추고,
 * python은 tini에 입양됐다가 tini가 끝날 때 namespace 정리의 SIGKILL로 죽는다.
 * 마지막 장면은 tini + exec(tini → python PID 2)로 SIGTERM이 python에 닿는 경우와 비교한다.
 * 상태 문구는 본문 10절과 7절의 서술만 옮겼다.
 */
type Tone = "idle" | "signal" | "dead" | "empty";
type Slot = { name: string; pid: string; state: string; tone: Tone };

const SCENES = [
  {
    label: "1. host → tini",
    summary: "SIGTERM이 PID 1인 tini에 도착",
    note: "docker stop의 SIGTERM은 PID 1인 tini에 갑니다. tini는 처리기를 두는 대신 신호를 막아 두고 꺼내 읽으므로(아래에서 설명) 이 SIGTERM은 버려지지 않습니다.",
    slots: [
      { name: "tini", pid: "PID 1", state: "SIGTERM 받음", tone: "signal" },
      {
        name: "sh start.sh",
        pid: "PID 2",
        state: "python을 foreground로 기다리는 중",
        tone: "idle",
      },
      {
        name: "python server.py",
        pid: "sh의 자식",
        state: "요청 처리 중",
        tone: "idle",
      },
    ],
  },
  {
    label: "2. tini → sh",
    summary: "직계 자식 하나에만 전달",
    note: "tini.c 533행은 기본으로 직계 자식 하나에만 kill을 보냅니다. 직계 자식은 sh이므로 SIGTERM은 sh가 받고, 그 아래의 python에는 아무 신호도 가지 않습니다.",
    slots: [
      {
        name: "tini",
        pid: "PID 1",
        state: "sh에게 kill(SIGTERM)",
        tone: "idle",
      },
      {
        name: "sh start.sh",
        pid: "PID 2",
        state: "SIGTERM 받음, trap 없음",
        tone: "signal",
      },
      {
        name: "python server.py",
        pid: "sh의 자식",
        state: "신호 못 받음",
        tone: "idle",
      },
    ],
  },
  {
    label: "3. sh 종료",
    summary: "sh는 기본 동작으로 죽음",
    note: "sh는 PID 1이 아니라 UNKILLABLE 보호가 없습니다. 처리기가 없으니 기본 동작대로 끝납니다. 부모를 잃은 python은 tini에 입양되지만 여전히 SIGTERM을 받은 적이 없습니다.",
    slots: [
      { name: "tini", pid: "PID 1", state: "python을 입양", tone: "idle" },
      {
        name: "sh start.sh",
        pid: "PID 2",
        state: "SIGTERM 기본 동작으로 종료",
        tone: "dead",
      },
      {
        name: "python server.py",
        pid: "tini의 자식",
        state: "입양됨, 신호 못 받음",
        tone: "idle",
      },
    ],
  },
  {
    label: "4. tini 종료",
    summary: "Exited (143), python은 SIGKILL",
    note: "tini는 143을 기록하고 끝납니다. PID 1이 끝나면 커널이 namespace의 나머지를 SIGKILL로 정리하므로 python은 SIGTERM 없이 죽습니다. 종료가 빨라져 고친 것처럼 보이지만 python에게 정리할 기회는 없었습니다.",
    slots: [
      { name: "tini", pid: "PID 1", state: "143 기록하고 종료", tone: "dead" },
      { name: "sh start.sh", pid: "PID 2", state: "이미 종료", tone: "dead" },
      {
        name: "python server.py",
        pid: "tini의 자식",
        state: "namespace 정리 SIGKILL로 종료",
        tone: "dead",
      },
    ],
  },
  {
    label: "비교: tini + exec",
    summary: "SIGTERM이 python에 닿음 (143)",
    note: "start.sh 마지막 줄에 exec를 쓰면 트리가 tini → python이 됩니다. SIGTERM이 python에 닿고, python은 PID 2라서 처리기가 없어도 기본 동작으로 끝나며 tini는 143을 돌려줍니다. 다만 처리기가 없으면 진행 중인 요청은 여전히 마무리되지 않습니다.",
    slots: [
      {
        name: "tini",
        pid: "PID 1",
        state: "python에게 kill(SIGTERM), 143 기록",
        tone: "idle",
      },
      {
        name: "python server.py",
        pid: "PID 2 · sh가 exec로 바뀐 자리",
        state: "SIGTERM 받음 → 기본 동작으로 종료",
        tone: "signal",
      },
    ],
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  note: string;
  slots: readonly Slot[];
}[];

const TONE_CLASS: Record<Tone, string> = {
  idle: "border-border",
  signal: "border-[#2563eb] bg-[#2563eb]/10",
  dead: "border-dashed border-[#dc2626]/70 text-muted-foreground",
  empty: "border-dashed border-border/50 text-muted-foreground/70",
};

const TONE_TAG: Record<Tone, string> = {
  idle: "",
  signal: "신호 도착",
  dead: "종료",
  empty: "",
};

export default function TiniTreeViz() {
  return (
    <SceneShell
      eyebrow="tini · start.sh 그대로"
      title="tini를 붙여도 start.sh를 그대로 두면 SIGTERM은 sh에서 멈춥니다"
      description="위에서 아래로 부모 → 자식입니다. 파란 칸은 그 순간 SIGTERM이 도착한 프로세스, 빨간 점선 칸은 끝난 프로세스입니다."
      ariaLabel="tini 아래에 start.sh를 그대로 둘 때 SIGTERM이 전달되는 순서와 tini + exec 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <ol key={scene.label} className="min-w-0 space-y-0">
              {(scene.slots as readonly Slot[]).map((slot, i) => (
                <li
                  key={i}
                  className="min-w-0"
                  style={{ paddingLeft: `${i * 1.25}rem` }}
                >
                  {i > 0 ? (
                    <div className="ml-4 h-4 w-px bg-[#94a3b8]" aria-hidden />
                  ) : null}
                  <div
                    className={`flex min-h-[3.75rem] min-w-0 flex-col justify-center rounded-lg border px-3 py-2 text-sm ${TONE_CLASS[slot.tone]}`}
                  >
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span
                        className={`font-mono font-semibold ${slot.tone === "dead" ? "line-through" : ""}`}
                      >
                        {slot.name}
                      </span>
                      {slot.pid ? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {slot.pid}
                        </span>
                      ) : null}
                      {TONE_TAG[slot.tone] ? (
                        <span
                          className={`text-xs font-bold ${slot.tone === "signal" ? "text-[#1d4ed8] dark:text-[#93c5fd]" : "text-[#b91c1c] dark:text-[#fca5a5]"}`}
                        >
                          {TONE_TAG[slot.tone]}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs leading-5 text-muted-foreground sm:text-sm">
                      {slot.state}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          ))}
        />
      )}
    />
  );
}
