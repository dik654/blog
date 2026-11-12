import ApiSceneShell from "./ApiSceneShell";

/**
 * 본문 대응: #anthropic "SSE parser는 transport framing과 provider event를 분리한다".
 * HTTP chunk 경계와 SSE event 경계는 일치하지 않는다. 빈 줄이 올 때까지 buffer에 모은 뒤
 * frame 하나를 만들고, 그 다음에 event·data를 provider schema로 parse한다.
 * chunk를 자른 위치와 byte 내용은 설명용 가정.
 */
const CHUNKS = [
  "event: ping\\ndata: {}\\n\\nevent: content_bl",
  "ock_delta\\ndata: {\"index\":0,",
  "\"delta\":…}\\n\\n",
] as const;

const SCENES = [
  {
    label: "chunk 1 도착",
    summary: "frame 1개 완성 · 나머지는 buffer",
    arrived: 1,
    buffer: "event: content_bl",
    frames: ["ping"],
    note: "chunk 1 안에서 빈 줄(\\n\\n)을 하나 찾았으므로 그 앞까지가 완전한 frame 하나입니다. 빈 줄 뒤의 ‘event: content_bl’은 아직 끝나지 않은 다음 frame이라 buffer에 남깁니다.",
  },
  {
    label: "chunk 2 도착",
    summary: "빈 줄 없음 → event 0개",
    arrived: 2,
    buffer: "event: content_block_delta\\ndata: {\"index\":0,",
    frames: ["ping"],
    note: "chunk 2는 buffer 뒤에 이어 붙습니다. event 이름은 완성됐지만 빈 줄이 아직 없으므로 내보낼 frame이 없습니다. 이 시점의 data를 JSON으로 parse하면 실패합니다.",
  },
  {
    label: "chunk 3 도착",
    summary: "frame 2 완성 → schema parse",
    arrived: 3,
    buffer: "",
    frames: ["ping", "content_block_delta"],
    note: "빈 줄이 도착해 두 번째 frame이 완성됩니다. 이제서야 event와 data를 나누고 data를 provider schema로 parse합니다. chunk 3개가 frame 2개가 되었으니 chunk 하나 = event 하나가 아닙니다.",
  },
  {
    label: "Pinned parser에서 보강할 곳",
    summary: "unknown event · buffer 상한",
    arrived: 3,
    buffer: "",
    frames: ["ping", "content_block_delta", "이후 도착한 새 event type (가정)"],
    note: "Pinned SseParser는 frame을 공통 StreamEvent enum으로 곧바로 deserialize하므로 enum에 없는 새 event type은 parse error가 될 수 있고, buffer에도 명시적 최대 크기가 없습니다. 본문은 unknown event를 telemetry에 남기고 건너뛰는 정책과 bounded framing을 보강 지점으로 듭니다.",
  },
] as const;

export default function SseFramingViz() {
  return (
    <ApiSceneShell
      eyebrow="SSE framing"
      title="HTTP chunk가 끊긴 자리와 event가 끝나는 자리는 다릅니다"
      description="SSE에서 event 하나(frame)는 event:·data: 줄들 뒤에 빈 줄이 와야 끝납니다. \n은 줄바꿈 문자이고, 위 칸은 network가 잘라 보낸 HTTP chunk입니다(자른 위치와 내용은 가정)."
      ariaLabel="세 개의 HTTP chunk가 buffer를 거쳐 두 개의 SSE frame이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <p className="mb-1.5 text-[11px] font-bold text-muted-foreground">HTTP chunk (도착 순서)</p>
              <div className="grid min-w-0 gap-1.5 sm:grid-cols-3">
                {CHUNKS.map((chunk, index) => {
                  const arrived = index < scene.arrived;
                  const latest = index === scene.arrived - 1 && active < 3;
                  return (
                    <div
                      key={index}
                      className={`min-w-0 rounded-md border px-2 py-1.5 ${
                        latest ? "border-[#2563eb] bg-blue-500/5" : arrived ? "border-border bg-background" : "border-dashed border-border/60"
                      }`}
                    >
                      <p className="text-[11px] text-muted-foreground">chunk {index + 1}</p>
                      <p className={`break-all font-mono text-[11px] leading-4 ${arrived ? "text-foreground" : "text-muted-foreground/40"}`}>
                        {arrived ? chunk : "아직 안 옴"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <div className="min-w-0 rounded-md border border-dashed border-[#d97706] px-2 py-1.5">
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-300">buffer (빈 줄을 기다리는 중)</p>
                <p className="min-h-[2rem] break-all font-mono text-[11px] leading-4">{scene.buffer || "비어 있음"}</p>
              </div>
              <div className="min-w-0 rounded-md border border-border bg-background px-2 py-1.5">
                <p className="text-[11px] font-bold text-muted-foreground">완성된 frame → provider schema parse</p>
                <ol className="mt-0.5 space-y-0.5">
                  {scene.frames.map((frame, index) => {
                    const unknown = active === 3 && index === 2;
                    return (
                      <li key={frame} className={`font-mono text-[11px] leading-4 ${unknown ? "font-semibold text-red-700 dark:text-red-400" : ""}`}>
                        {index + 1}. {frame}
                        {unknown && <span className="ml-1 font-sans">→ enum에 없으면 parse error 가능</span>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
