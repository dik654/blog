import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — ‘내일 회의 그대로’를 혼자 읽은 첫 해석과, 앞뒤 메시지 6개(자료 4·참석자 1·시간 1)를 본 뒤 고친 해석.
 * 위 = 부분(메시지 하나), 가운데 = 전체 문맥(메시지 6칸), 아래 = 지금의 해석 세 줄.
 */
type Topic = "자료" | "참석자" | "시간";
type Reading = "유지" | "바뀔 수 있음";

const MESSAGES: readonly Topic[] = ["자료", "자료", "자료", "자료", "참석자", "시간"];

const TOPIC_COLOR: Record<Topic, string> = { 자료: "#d97706", 참석자: "#7c3aed", 시간: "#2563eb" };

const ROWS: readonly { key: Topic; label: string }[] = [
  { key: "시간", label: "회의 시간" },
  { key: "자료", label: "안건 · 자료" },
  { key: "참석자", label: "참석자" },
];

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  contextVisible: boolean;
  readings: Readonly<Record<Topic, Reading>>;
  flagged: readonly Topic[];
  tag: string;
}[] = [
  {
    label: "첫 읽기 · 부분만",
    summary: "모두 유지",
    note: "첫 읽기에서는 메시지 하나만 보고 ‘회의 시간과 안건을 모두 유지한다’고 가정합니다. 독자는 이미 ‘그대로’가 시간·장소·안건 중 무엇을 가리킬지 예상하고 읽습니다.",
    contextVisible: false,
    readings: { 시간: "유지", 자료: "유지", 참석자: "유지" },
    flagged: [],
    tag: "첫 가정",
  },
  {
    label: "전체 문맥 · 앞뒤 6개",
    summary: "자료 4 · 참석자 1 · 시간 1",
    note: "두 번째 읽기에서는 앞뒤 메시지 6개 가운데 4개가 자료 수정, 1개가 참석자 변경, 1개가 시간 확인을 다룬다는 사실을 봅니다. 자료와 참석자 줄이 첫 가정과 맞지 않는 단서가 됩니다.",
    contextVisible: true,
    readings: { 시간: "유지", 자료: "유지", 참석자: "유지" },
    flagged: ["자료", "참석자"],
    tag: "맞지 않는 단서",
  },
  {
    label: "부분을 다시 읽기",
    summary: "시간 유지 · 자료와 참석자는 바뀔 수 있음",
    note: "고친 전체 이해로 같은 메시지를 다시 읽어 ‘시간은 유지하되 자료와 참석자는 바뀔 수 있다’고 해석을 고칩니다. 부분 → 전체 → 부분으로 돌아오는 이 왕복이 해석학적 순환입니다.",
    contextVisible: true,
    readings: { 시간: "유지", 자료: "바뀔 수 있음", 참석자: "바뀔 수 있음" },
    flagged: [],
    tag: "고친 해석",
  },
  {
    label: "아직 확정은 아님",
    summary: "확인 질문 1개",
    note: "메시지 수를 세었다고 뜻이 자동으로 확정되지는 않습니다. 누가 결정 권한을 가졌는지, 팀이 ‘그대로’를 평소 어떻게 썼는지도 확인해야 해서 결정권자에게 질문 1개를 보냅니다.",
    contextVisible: true,
    readings: { 시간: "유지", 자료: "바뀔 수 있음", 참석자: "바뀔 수 있음" },
    flagged: [],
    tag: "확인 전 잠정 해석",
  },
];

export default function ReadingTwiceViz() {
  return (
    <SceneShell
      eyebrow="두 번 읽기"
      title="메시지 하나를 앞뒤 여섯 메시지와 오가며 다시 읽습니다"
      description="위 칸은 부분인 메시지 하나, 가운데 여섯 칸은 전체 문맥인 앞뒤 메시지, 아래 세 줄은 지금의 해석입니다. 여섯 칸은 주제별로 묶었을 뿐 실제 순서가 아닙니다(가정)."
      ariaLabel="‘내일 회의 그대로’의 첫 해석이 앞뒤 메시지 여섯 개를 읽은 뒤 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">부분</span>
              <span className="rounded-md border border-primary/60 px-3 py-1 text-sm font-semibold">‘내일 회의 그대로’</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">전체 문맥 · 앞뒤 메시지 6개</span>
              <div className="mt-1 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
                {MESSAGES.map((topic, index) => (
                  <div
                    key={index}
                    className={`rounded-md border px-1 py-1.5 text-center text-xs ${scene.contextVisible ? "font-semibold" : "border-dashed text-muted-foreground/60"}`}
                    style={scene.contextVisible ? { borderColor: TOPIC_COLOR[topic], color: TOPIC_COLOR[topic] } : undefined}
                  >
                    {scene.contextVisible ? `${topic} ${topic === "시간" ? "확인" : topic === "자료" ? "수정" : "변경"}` : "아직 안 읽음"}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">지금의 해석 · {scene.tag}</span>
              <div className="mt-1 space-y-1">
                {ROWS.map((row) => {
                  const reading = scene.readings[row.key];
                  const flagged = scene.flagged.includes(row.key);
                  return (
                    <div key={row.key} className="grid grid-cols-[6rem_minmax(0,1fr)] items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={`font-semibold ${reading === "바뀔 수 있음" ? "text-amber-700 dark:text-amber-400" : ""}`}>
                        {reading}
                        {flagged ? <span className="ml-2 text-xs font-normal text-red-700 dark:text-red-400">≠ 문맥 단서</span> : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
