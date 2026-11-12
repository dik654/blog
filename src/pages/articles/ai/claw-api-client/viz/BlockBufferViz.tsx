import ApiSceneShell from "./ApiSceneShell";

/**
 * 본문 대응: #anthropic "tool input은 block 종료 전까지 JSON 문자열 조각이다".
 * block 0 `{"path":"src/` → block 1 `{"query":"auth"}` → block 0 `login.ts"}` 순서로 오면
 * index별 buffer 두 개가 필요하고, content_block_stop에서 한 번 parse한다.
 * 문법 완성(parser)과 실행 가능 call commit(runtime)은 다르다.
 */
type BufState = "empty" | "partial" | "parsed" | "dropped" | "committed" | "failed";

const SCENES = [
  {
    label: "block 0 조각",
    summary: "buffer 0 ← {\"path\":\"src/",
    event: "input_json_delta · index 0",
    b0: "{\"path\":\"src/",
    b1: "",
    s0: "partial",
    s1: "empty",
    note: "Tool-use block의 input_json_delta는 완성된 object가 아니라 JSON 문자열 조각입니다. block index 0의 buffer에 그대로 붙여 두고 parse하지 않습니다.",
  },
  {
    label: "block 1 조각이 끼어듦",
    summary: "buffer 1 ← {\"query\":\"auth\"}",
    event: "input_json_delta · index 1",
    b0: "{\"path\":\"src/",
    b1: "{\"query\":\"auth\"}",
    s0: "partial",
    s1: "partial",
    note: "같은 response에 block이 여러 개 있을 수 있어 조각이 섞여 옵니다. buffer를 하나만 썼다면 {\"path\":\"src/{\"query\"… 처럼 섞입니다. block 1 조각은 문법상 닫혀 보여도 아직 block stop 전입니다.",
  },
  {
    label: "block 0 나머지",
    summary: "buffer 0 = {\"path\":\"src/login.ts\"}",
    event: "input_json_delta · index 0",
    b0: "{\"path\":\"src/login.ts\"}",
    b1: "{\"query\":\"auth\"}",
    s0: "partial",
    s1: "partial",
    note: "block 0의 두 번째 조각이 자기 buffer 뒤에 붙어 {\"path\":\"src/login.ts\"}가 됩니다. index별 buffer 덕분에 block 1 조각과 섞이지 않았습니다.",
  },
  {
    label: "block 0 stop",
    summary: "한 번 parse · schema 검증",
    event: "content_block_stop · index 0",
    b0: "{\"path\":\"src/login.ts\"}",
    b1: "{\"query\":\"auth\"}",
    s0: "parsed",
    s1: "partial",
    note: "content_block_stop이 와야 block 0을 한 번 parse하고 schema를 검증합니다. 이것은 parser 입장의 ‘문법 완성’일 뿐이며, message-level error가 뒤따를 수 있으므로 아직 실행 가능한 call로 commit하지 않습니다.",
  },
  {
    label: "갈래 A · message error",
    summary: "success 아님 · executor로 안 감",
    event: "error (message-level)",
    b0: "{\"path\":\"src/login.ts\"}",
    b1: "{\"query\":\"auth\"}",
    s0: "failed",
    s1: "dropped",
    note: "block 1은 stop 없이 error를 만났으므로 incomplete로 폐기하고 executor에 넘기지 않습니다. 정상 stop을 받지 못한 응답은 success로 표시하지 않고 partial output과 failure를 함께 반환합니다.",
  },
  {
    label: "갈래 B · 정상 종료",
    summary: "두 call 모두 commit",
    event: "content_block_stop · index 1 → message_stop",
    b0: "{\"path\":\"src/login.ts\"}",
    b1: "{\"query\":\"auth\"}",
    s0: "committed",
    s1: "committed",
    note: "block 1도 stop되어 parse·schema 검증을 통과하고 message가 정상 종료되면, terminal state에서 두 tool call을 실행 가능한 call로 확정합니다.",
  },
] as const;

const STATE_LABEL: Record<BufState, string> = {
  empty: "비어 있음",
  partial: "조각 누적 중 · parse 안 함",
  parsed: "parse·schema OK · commit 전",
  dropped: "incomplete → 폐기",
  committed: "실행 가능 call로 commit",
  failed: "success로 commit 안 함",
};

const STATE_STYLE: Record<BufState, string> = {
  empty: "border-dashed border-border/60",
  partial: "border-dashed border-[#d97706]",
  parsed: "border-[#2563eb] bg-blue-500/5",
  dropped: "border-[#dc2626] bg-red-500/5",
  committed: "border-[#16a34a] bg-green-500/5",
  failed: "border-[#dc2626] bg-red-500/5",
};

function Buffer({ name, value, state }: { name: string; value: string; state: BufState }) {
  return (
    <div className={`min-w-0 rounded-md border px-3 py-2 ${STATE_STYLE[state]}`}>
      <p className="text-[11px] font-bold text-muted-foreground">{name}</p>
      <p className="min-h-[1.25rem] break-all font-mono text-xs leading-5">{value || " "}</p>
      <p className="mt-1 text-[11px] font-semibold">{STATE_LABEL[state]}</p>
    </div>
  );
}

export default function BlockBufferViz() {
  return (
    <ApiSceneShell
      eyebrow="tool input 조립"
      title="block index마다 buffer를 따로 두고 stop에서만 parse합니다"
      description="위 줄은 방금 도착한 stream event, 아래 두 칸은 block 0·1의 tool input buffer입니다. 조각 내용과 순서는 본문의 예를 그대로 씁니다."
      ariaLabel="두 tool-use block의 partial JSON 조각이 index별 buffer에 누적되고 stop과 terminal에서 확정되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="rounded-md border border-border bg-background px-3 py-2">
              <p className="text-[11px] text-muted-foreground">도착한 event</p>
              <p className="break-words font-mono text-xs font-semibold">{scene.event}</p>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <Buffer name="buffer · block 0" value={scene.b0} state={scene.s0} />
              <Buffer name="buffer · block 1" value={scene.b1} state={scene.s1} />
            </div>
          </div>
        );
      }}
    />
  );
}
