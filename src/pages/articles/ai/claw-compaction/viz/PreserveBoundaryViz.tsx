import CompactionSceneShell from "./CompactionSceneShell";

/**
 * 본문 대응: #compact-pipeline "ToolUse와 ToolResult는 둘을 한 쌍으로 보존합니다".
 * 여덟 개 message(가정)에서 최근 4개를 자르면 첫 보존 message가 ToolResult(edit-7)이 되고,
 * guard는 바로 앞 ToolUse를 보고 경계를 한 칸 앞으로 옮겨 5개를 남긴다.
 */
const MESSAGES = [
  { role: "user", text: "로그인 401 원인을 찾아 최소 수정해 줘", kind: "text" },
  { role: "assistant", text: "ToolUse(id=\"search-3\", grep)", kind: "use" },
  { role: "tool", text: "ToolResult(id=\"search-3\")", kind: "result" },
  { role: "assistant", text: "ToolUse(id=\"edit-7\", write_file)", kind: "use" },
  { role: "tool", text: "ToolResult(id=\"edit-7\", \"written\")", kind: "result" },
  { role: "assistant", text: "\"이제 login test를 실행하겠습니다\"", kind: "text" },
  { role: "assistant", text: "ToolUse(id=\"test-8\", bash)", kind: "use" },
  { role: "tool", text: "ToolResult(id=\"test-8\", exit=1)", kind: "result" },
] as const;

const SCENES = [
  {
    label: "최근 4개를 기계적으로 자르면",
    summary: "경계 = 4번 앞",
    boundary: 4,
    note: "기본 snapshot은 최근 4개 message를 원문으로 남깁니다. 단순히 뒤에서 4개를 세면 경계 바로 뒤 첫 message가 edit-7의 ToolResult가 되고, 그 짝인 ToolUse는 summary로 줄일 쪽에 들어갑니다.",
  },
  {
    label: "provider가 받는 요청",
    summary: "짝 없는 ToolResult → 거부",
    boundary: 4,
    note: "다음 요청은 synthetic system summary 뒤에 4~7번을 붙인 모양입니다. 4번 ToolResult 앞에 이를 부른 assistant ToolUse가 없으므로 provider는 orphan result로 보고 요청을 거부합니다.",
  },
  {
    label: "guard가 경계를 한 칸 앞으로",
    summary: "보존 4개 → 5개",
    boundary: 3,
    note: "Pinned 함수는 첫 보존 message가 ToolResult이고 바로 앞 message가 ToolUse이면 경계를 한 칸 앞으로 옮깁니다. 이제 3번 ToolUse와 4번 ToolResult가 함께 원문으로 남고, 0~2번만 summary로 줄입니다.",
  },
  {
    label: "guard가 보는 범위",
    summary: "3번·4번만 확인",
    boundary: 3,
    note: "Guard가 보는 것은 첫 보존 message의 첫 block과 바로 앞 message뿐입니다. edit-7이라는 ID가 정말 일치하는지, session 전체에서 유일한지, 모든 call/result가 짝을 이루는지는 별도의 전역 correlation validator가 확인해야 합니다.",
  },
] as const;

const ROLE_COLOR: Record<string, string> = {
  user: "#2563eb",
  assistant: "#7c3aed",
  tool: "#0f766e",
};

export default function PreserveBoundaryViz() {
  return (
    <CompactionSceneShell
      eyebrow="보존 경계"
      title="최근 N개로 자른 경계가 tool 짝을 가르면 한 칸 앞당깁니다"
      description="한 줄이 message 하나입니다(예시 transcript는 가정). 점선 위는 summary로 줄일 구간, 아래는 원문으로 남는 recent tail입니다. ToolUse는 assistant가 tool을 부르는 message, ToolResult는 그 결과를 돌려주는 message입니다."
      ariaLabel="최근 4개 보존 경계가 ToolResult에서 시작할 때 guard가 경계를 한 칸 앞으로 옮기는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const guardFocus = active === 3;
        const orphan = active <= 1;
        return (
          <ol className="min-w-0 space-y-1">
            {MESSAGES.map((message, index) => {
              const kept = index >= scene.boundary;
              const isOrphan = orphan && index === 4;
              const isLostUse = orphan && index === 3;
              const inGuard = guardFocus && (index === 3 || index === 4);
              const dimForRequest = active === 1 && !kept;
              return (
                <li key={index} className="min-w-0">
                  {index === scene.boundary && (
                    <div className="my-1 flex items-center gap-2" aria-hidden>
                      <span className="h-0 flex-1 border-t border-dashed border-[#d97706]" />
                      <span className="shrink-0 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                        원문 보존 경계 · 아래 {MESSAGES.length - scene.boundary}개
                      </span>
                      <span className="h-0 flex-1 border-t border-dashed border-[#d97706]" />
                    </div>
                  )}
                  <div
                    className={`grid min-w-0 grid-cols-[1rem_minmax(0,1fr)] items-center gap-x-2 rounded-md border px-2 py-1 text-[11px] leading-4 sm:grid-cols-[1.25rem_4.75rem_minmax(0,1fr)] sm:py-1.5 sm:text-xs ${
                      isOrphan
                        ? "border-[#dc2626] bg-red-500/5"
                        : inGuard
                          ? "border-[#2563eb] bg-blue-500/5"
                          : kept
                            ? "border-border bg-background"
                            : "border-dashed border-border/70 bg-muted/30"
                    } ${dimForRequest ? "opacity-35" : ""}`}
                  >
                    <span className="font-mono text-muted-foreground">{index}</span>
                    <span className="hidden font-semibold sm:inline" style={{ color: ROLE_COLOR[message.role] }}>
                      {message.role}
                    </span>
                    <span className="min-w-0 break-words font-mono">
                      <span className="mr-1 font-sans font-semibold sm:hidden" style={{ color: ROLE_COLOR[message.role] }}>
                        {message.role}
                      </span>
                      {message.text}
                      {isOrphan && <span className="ml-1 font-sans font-bold text-red-700 dark:text-red-400">짝 없음</span>}
                      {isLostUse && <span className="ml-1 font-sans font-bold text-amber-700 dark:text-amber-300">summary 쪽으로 감</span>}
                      {inGuard && <span className="ml-1 font-sans font-bold text-blue-700 dark:text-blue-300">guard 확인</span>}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        );
      }}
    />
  );
}
