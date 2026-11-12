import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stdio-jsonrpc — Content-Length frame을 읽고, JSON parse 뒤 jsonrpc 2.0과 response ID를 검사한다.
 * 기다리던 ID는 3. 마지막 장면만 response ID가 2라서 frame과 JSON이 정상이어도 받아들이지 않는다.
 * 84 byte는 아래 McpCorrelationViz와 같은 예시 값이다.
 */
type Status = "wait" | "pass" | "fail";

const CHECKS = [
  { name: "Frame 읽기", detail: "Header와 빈 줄 뒤 84 byte" },
  { name: "JSON parse", detail: "84 byte를 JSON으로 해석" },
  { name: "Version", detail: "jsonrpc가 2.0인가" },
  { name: "Request ID", detail: "기다리던 id 3과 같은가" },
] as const;

const SCENES = [
  {
    label: "Frame 경계만 확인",
    summary: "84 byte 읽음",
    responseId: 3,
    status: ["pass", "wait", "wait", "wait"],
    verdict: "아직 판단 전",
    note: "Content-Length header와 빈 줄을 읽고, header가 지정한 84 byte만큼을 한 message로 읽습니다. 여기까지는 byte 경계가 맞는지만 압니다.",
  },
  {
    label: "JSON과 version 확인",
    summary: "parse · 2.0 통과",
    responseId: 3,
    status: ["pass", "pass", "pass", "wait"],
    verdict: "아직 판단 전",
    note: "읽은 byte를 JSON으로 parse하고 jsonrpc 값이 2.0인지 봅니다. 형식이 맞아도 어느 request의 답인지는 아직 모릅니다.",
  },
  {
    label: "ID가 같을 때",
    summary: "id 3 = 3 → 수용",
    responseId: 3,
    status: ["pass", "pass", "pass", "pass"],
    verdict: "docs.search의 답으로 받음",
    note: "보낸 request ID 3과 response ID 3이 같습니다. 네 검사를 모두 통과해야 이 결과를 docs.search의 답으로 받습니다.",
  },
  {
    label: "ID가 다를 때",
    summary: "id 2 ≠ 3 → 받지 않음",
    responseId: 2,
    status: ["pass", "pass", "pass", "fail"],
    verdict: "docs.search의 답으로 받지 않음",
    note: "Frame 길이도 맞고 JSON도 정상이지만 response ID가 2입니다. 기다리던 ID는 3이므로 이 결과를 docs.search의 답으로 받아들이지 않습니다.",
  },
] as const satisfies readonly {
  label: string;
  summary: string;
  responseId: number;
  status: readonly Status[];
  verdict: string;
  note: string;
}[];

const MARK: Record<Status, { text: string; className: string }> = {
  wait: { text: "대기", className: "border-border text-muted-foreground" },
  pass: { text: "통과", className: "border-emerald-600 text-emerald-700 dark:text-emerald-400" },
  fail: { text: "불일치", className: "border-red-600 font-bold text-red-700 dark:text-red-400" },
};

export default function FrameCheckViz() {
  return (
    <SceneShell
      eyebrow="Frame과 ID 검사"
      title="Frame을 다 읽어도 ID가 다르면 답으로 받지 않습니다"
      description="JSON-RPC는 request마다 id를 붙이고 response가 같은 id를 돌려주는 message 형식입니다. 위 칸은 도착한 frame, 아래 네 줄은 pinned helper가 차례로 하는 검사입니다."
      ariaLabel="Content-Length frame 읽기, JSON parse, version, request ID 검사를 차례로 통과하는지 보여 주는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const statuses: readonly Status[] = scene.status;
        const failed = statuses.includes("fail");
        const done = statuses.every((status) => status === "pass");
        return (
          <div className="min-w-0 space-y-4">
            <div className="min-w-0 rounded-lg border border-border bg-background p-3 font-mono text-xs leading-6">
              <p className="text-[11px] font-sans font-semibold text-muted-foreground">도착한 frame</p>
              <p>Content-Length: 84</p>
              <p className="text-muted-foreground">(빈 줄)</p>
              <p className="break-all">
                {"{"}&quot;jsonrpc&quot;:&quot;2.0&quot;,{" "}
                <span className={scene.responseId === 3 ? "font-bold text-foreground" : "font-bold text-red-700 dark:text-red-400"}>
                  &quot;id&quot;:{scene.responseId}
                </span>
                , &quot;result&quot;:…{"}"}
              </p>
            </div>
            <ol className="min-w-0 space-y-2">
              {CHECKS.map((check, index) => {
                const mark = MARK[statuses[index]];
                return (
                  <li key={check.name} className="grid grid-cols-[1.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}</span>
                    <span className="min-w-0">
                      <span className="block font-semibold">{check.name}</span>
                      <span className="block text-xs leading-5 text-muted-foreground">{check.detail}</span>
                    </span>
                    <span className={`rounded-md border px-1 py-1 text-center text-xs ${mark.className}`}>{mark.text}</span>
                  </li>
                );
              })}
            </ol>
            <p
              className={`rounded-md border px-3 py-2 text-sm font-semibold ${
                failed
                  ? "border-red-600 text-red-700 dark:text-red-400"
                  : done
                    ? "border-emerald-600 text-emerald-700 dark:text-emerald-400"
                    : "border-dashed border-border text-muted-foreground"
              }`}
            >
              결과: {scene.verdict}
            </p>
          </div>
        );
      }}
    />
  );
}
