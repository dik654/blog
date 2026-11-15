import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #transport-trait — dial 호출과 실제 연결 시작은 다른 순간이다.
 * future는 처음 poll될 때 일을 시작하고, 상위 caller는 Bob의 여러 주소에서 만든 future 일부를 경주시켜
 * 인증까지 끝난 첫 valid output을 고른다. 진 future를 취소하면 socket과 timer도 정리돼야 한다.
 * 주소 개수 3개와 어느 주소가 이기는지는 설명용 가정이다.
 */
type State = "made" | "running" | "idle" | "won" | "cancelled" | "unused";

const STATE_TEXT: Record<State, string> = {
  made: "future 생성 · I/O 없음",
  running: "poll 중 · 연결·인증 진행",
  idle: "poll 안 됨 · 진행 없음",
  won: "인증 완료 · 선택",
  cancelled: "취소 · socket·timer 정리",
  unused: "poll 안 된 채 남음 · 연결 시도 없음",
};

const STATE_CLASS: Record<State, string> = {
  made: "border-border bg-background",
  running: "border-[#2563eb] bg-[#2563eb]/10",
  idle: "border-dashed border-border bg-background",
  won: "border-[#059669] bg-[#059669]/10",
  cancelled: "border-dashed border-[#d97706] bg-[#d97706]/10",
  unused: "border-dashed border-border bg-background",
};

const STATE_TEXT_CLASS: Record<State, string> = {
  made: "text-muted-foreground",
  running: "text-[#2563eb]",
  idle: "text-muted-foreground",
  won: "text-[#059669]",
  cancelled: "text-[#b45309] dark:text-[#f59e0b]",
  unused: "text-muted-foreground",
};

const SCENES = [
  {
    label: "dial 호출",
    summary: "future 3개 · network I/O 0",
    states: ["made", "made", "made"] as State[],
    output: "아직 없음",
    note: "dial은 연결을 바로 시작하지 않고 future를 돌려줄 뿐입니다. v0.57.1 trait 계약상 future는 처음 poll될 때부터 일을 하므로, 지금은 socket도 열리지 않았습니다.",
  },
  {
    label: "일부만 poll",
    summary: "주소 1·2 경주 · 주소 3 멈춤",
    states: ["running", "running", "idle"] as State[],
    output: "아직 없음",
    note: "상위 caller가 future 일부를 동시에 poll해 경주시킵니다. poll하지 않은 주소 3의 future는 만들어졌어도 network I/O가 진행되지 않습니다.",
  },
  {
    label: "첫 valid output",
    summary: "인증까지 끝난 주소 1 선택",
    states: ["won", "running", "idle"] as State[],
    output: "(PeerId, StreamMuxerBox)",
    note: "TCP 연결만 된 것이 아니라 인증까지 끝난 첫 output을 고릅니다. Noise와 Yamux를 조합한 boxed transport의 output은 (PeerId, StreamMuxerBox)입니다.",
  },
  {
    label: "진 쪽 정리",
    summary: "주소 2 취소 → socket·timer 해제",
    states: ["won", "cancelled", "unused"] as State[],
    output: "(PeerId, StreamMuxerBox)",
    note: "진 future를 취소했다면 그 future가 연 socket과 timer도 정리돼야 합니다. 이 정리가 빠지면 연결은 성공해도 자원이 남습니다.",
  },
] as const;

export default function DialRaceViz() {
  return (
    <StepSceneShell
      eyebrow="dial future 경주"
      title="dial은 future를 만들 뿐이고, poll이 연결을 움직입니다"
      description="줄 하나가 Bob의 주소 하나로 만든 dial future입니다. 주소를 3개로 두고 주소 1이 이긴다고 둔 것은 설명용 가정입니다."
      ariaLabel="Bob의 여러 주소에서 만든 dial future가 poll되고 경주하고 정리되는 순서"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-2">
            {scene.states.map((state, index) => (
              <div
                key={index}
                className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 rounded-lg border px-3 py-2 text-xs leading-5 transition-colors duration-300 motion-reduce:transition-none sm:grid-cols-[6rem_minmax(0,1fr)] sm:text-sm ${STATE_CLASS[state]}`}
              >
                <span className="font-bold">주소 {index + 1}</span>
                <span className={`break-keep font-semibold ${STATE_TEXT_CLASS[state]}`}>{STATE_TEXT[state]}</span>
              </div>
            ))}
            <div className="mx-auto h-4 w-px bg-border" aria-hidden />
            <div
              className={`rounded-lg border px-3 py-2 text-center text-xs leading-5 sm:text-sm ${
                active >= 2 ? "border-[#059669] bg-[#059669]/10" : "border-dashed border-border bg-background"
              }`}
            >
              <span className="block font-bold">caller가 받는 output</span>
              <span className={`block font-mono ${active >= 2 ? "text-[#059669]" : "text-muted-foreground"}`}>{scene.output}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
