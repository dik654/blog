import SceneShell from "./SceneShell";

/**
 * 본문 대응: #merge-boundary — read-only 조사 두 갈래(UI 오류 경로, server log)는 나눌 수 있고,
 * 같은 file을 두 subagent가 동시에 편집하면 writer·merge·verification owner가 모호해진다.
 * Main은 summary가 아니라 실제 source와 command receipt를 읽은 뒤 최소 diff를 한 writer에게 맡긴다.
 * 칸 위치는 모든 장면에서 고정: 위 = Main, 가운데 = subagent 두 칸, 아래 = 대상 file.
 */
type Tone = "on" | "off" | "warn";

interface Slot {
  title: string;
  detail: string;
  tone: Tone;
}

interface Frame {
  label: string;
  summary: string;
  note: string;
  main: Slot;
  left: Slot;
  right: Slot;
  file: Slot;
}

const SCENES: readonly Frame[] = [
  {
    label: "Read-only로 나눔",
    summary: "input 독립 · output 독립",
    note: "UI 오류 경로 조사와 server log 조사는 서로 다른 자료를 읽고 서로 다른 결과를 냅니다. 둘 다 read-only라 file을 바꾸지 않으므로 두 subagent에게 나눠 맡길 수 있습니다.",
    main: { title: "Main", detail: "두 조사 질문을 나눠 맡김", tone: "on" },
    left: { title: "Subagent A · read-only", detail: "UI 오류 경로 조사", tone: "on" },
    right: { title: "Subagent B · read-only", detail: "server log 조사", tone: "on" },
    file: { title: "Source file", detail: "아무도 쓰지 않음", tone: "off" },
  },
  {
    label: "같은 file을 둘이 편집하면",
    summary: "writer? merge? 검증?",
    note: "두 subagent가 같은 file을 동시에 고치면 어느 쪽이 writer인지, 누가 두 수정을 merge하는지, 누가 결과를 검증하는지가 모호해집니다. output이 서로 독립이 아니게 된 것입니다.",
    main: { title: "Main", detail: "어느 수정을 믿을지 불분명", tone: "warn" },
    left: { title: "Subagent A · 편집", detail: "같은 file 수정", tone: "warn" },
    right: { title: "Subagent B · 편집", detail: "같은 file 수정", tone: "warn" },
    file: { title: "같은 source file", detail: "owner 모호", tone: "warn" },
  },
  {
    label: "Main이 원자료를 다시 읽음",
    summary: "summary가 아니라 source·receipt",
    note: "다시 read-only 분할로 돌아가, 두 조사가 결과를 돌려주면 Main은 요약 문장을 그대로 믿지 않고 실제 source와 command receipt를 직접 읽습니다.",
    main: { title: "Main", detail: "실제 source와 command receipt를 읽음", tone: "on" },
    left: { title: "Subagent A 반환", detail: "summary + receipt", tone: "off" },
    right: { title: "Subagent B 반환", detail: "summary + receipt", tone: "off" },
    file: { title: "Source file", detail: "Main이 직접 확인", tone: "on" },
  },
  {
    label: "한 writer에게 최소 diff",
    summary: "writer 1명",
    note: "확인을 마친 뒤 Main은 바꿀 최소 diff를 writer 한 명에게만 맡깁니다. 두 번째 장면처럼 같은 file의 writer가 둘로 갈리지 않습니다.",
    main: { title: "Main", detail: "최소 diff를 정해 맡김", tone: "on" },
    left: { title: "Writer", detail: "최소 diff 적용", tone: "on" },
    right: { title: "다른 subagent", detail: "편집하지 않음", tone: "off" },
    file: { title: "Source file", detail: "writer 하나만 씀", tone: "on" },
  },
];

const TONE: Record<Tone, string> = {
  on: "border-[#2563eb] bg-[#2563eb]/10",
  off: "border-dashed border-border bg-background",
  warn: "border-[#dc2626] bg-[#dc2626]/10",
};

const TITLE_TONE: Record<Tone, string> = {
  on: "text-[#2563eb]",
  off: "text-muted-foreground",
  warn: "text-[#dc2626]",
};

function Box({ slot }: { slot: Slot }) {
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center text-xs leading-5 transition-colors duration-300 motion-reduce:transition-none ${TONE[slot.tone]}`}>
      <span className={`block font-semibold ${TITLE_TONE[slot.tone]}`}>{slot.title}</span>
      <span className="block text-muted-foreground">{slot.detail}</span>
    </div>
  );
}

function Link({ label, up = false }: { label: string; up?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-muted-foreground" aria-hidden="true">
      <span>{up ? "↑" : "↓"}</span>
      <span>{label}</span>
    </div>
  );
}

export default function ParallelMergeViz() {
  return (
    <SceneShell
      eyebrow="병렬 조사와 편집"
      title="조사는 나누고, 쓰는 사람은 하나로"
      description="위 칸이 Main, 가운데 두 칸이 subagent, 아래 칸이 바뀔 수 있는 source file입니다. 파란 칸은 이 장면에서 일하는 쪽, 빨간 칸은 책임이 모호해진 곳, 점선 칸은 쉬거나 참고만 되는 곳입니다."
      ariaLabel="read-only 병렬 조사, 같은 file 동시 편집, main의 원자료 확인, 단일 writer 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <Box slot={scene.main} />
            <Link label={active === 2 ? "반환을 받아 원자료로 확인" : "맡김"} up={active === 2} />
            <div className="grid grid-cols-2 gap-2">
              <Box slot={scene.left} />
              <Box slot={scene.right} />
            </div>
            <Link label={active === 1 ? "둘 다 씀" : active === 3 ? "writer만 씀" : "읽기만"} />
            <Box slot={scene.file} />
          </div>
        );
      }}
    />
  );
}
