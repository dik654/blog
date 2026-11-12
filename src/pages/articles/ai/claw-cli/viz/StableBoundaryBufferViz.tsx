import CliSceneShell from "./CliSceneShell";

/**
 * 본문 대응: #rendering "부분 Markdown은 안정된 경계까지만 확정한다".
 * delta 네 조각(가정)이 누적 버퍼에 쌓일 때, 닫힌 block만 확정 화면으로 넘어가고
 * 아직 열린 code fence·링크 괄호는 임시 텍스트로 남는다. 스트림 종료 시 final flush.
 */
const DELTAS = ["설치 방법입니다.↵↵", "```sh↵npm te", "st↵```↵", "자세한 내용은 [문서]("] as const;

const SCENES = [
  {
    label: "첫 delta: 빈 줄로 단락이 닫힙니다",
    summary: "확정 1 block",
    note: "빈 줄까지 왔으므로 parser가 첫 단락을 완전한 block으로 확정할 수 있습니다. 이 부분은 스타일과 들여쓰기를 정해 화면에 반영합니다.",
    confirmed: ["paragraph"],
    pending: "",
  },
  {
    label: "둘째 delta: code fence가 열린 채 끊깁니다",
    summary: "확정 그대로 · 임시 추가",
    note: "여는 ``` 은 왔지만 닫는 ``` 이 아직 없습니다. 닫히지 않은 코드 블록을 지금 확정하면 스타일이 깨질 수 있으므로 임시 텍스트로만 보여 줍니다.",
    confirmed: ["paragraph"],
    pending: "```sh\nnpm te",
  },
  {
    label: "셋째 delta: fence가 닫혀 code block이 확정됩니다",
    summary: "확정 2 block",
    note: "닫는 ``` 이 도착해 code block이 완전해졌습니다. 이제 확정 화면으로 옮기고 임시 영역은 비웁니다.",
    confirmed: ["paragraph", "code"],
    pending: "",
  },
  {
    label: "넷째 delta: 링크의 여는 괄호에서 끊깁니다",
    summary: "확정 그대로 · 임시 추가",
    note: "링크 주소가 아직 오지 않았습니다. 이 줄은 확정할 수 있는 경계가 없으므로 임시 텍스트로 둡니다. 원본 delta는 버퍼에 순서대로 남아 있습니다.",
    confirmed: ["paragraph", "code"],
    pending: "자세한 내용은 [문서](",
  },
  {
    label: "스트림이 끝나 남은 버퍼를 flush합니다",
    summary: "final flush → 확정 3 block",
    note: "종료 신호가 오면 남은 버퍼를 한 번 더 parse해 최종 화면을 확정합니다. 종료뿐 아니라 취소·오류에서도 남은 텍스트를 일관되게 처리합니다.",
    confirmed: ["paragraph", "code", "tail"],
    pending: "",
  },
] as const;

const SEGMENT_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#d97706"] as const;

export default function StableBoundaryBufferViz() {
  return (
    <CliSceneShell
      eyebrow="Stream-safe boundary"
      title="누적 버퍼에서 닫힌 block만 확정 화면으로 넘어갑니다"
      description="모델 응답이 delta 네 조각으로 나뉘어 온다고 가정합니다. ↵는 줄바꿈, 색은 delta 경계입니다. 위에서 아래로 누적 버퍼 → 확정 화면 → 임시 텍스트 순서로 읽습니다."
      ariaLabel="Markdown delta가 누적 버퍼에 쌓이고 안정된 경계까지만 확정되는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const has = (part: string) => (scene.confirmed as readonly string[]).includes(part);
        const deltaCount = Math.min(active + 1, DELTAS.length);
        return (
          <div className="min-w-0 space-y-2 text-xs">
            <div className="rounded-md border border-border px-3 py-2">
              <div className="mb-1 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                <span className="font-bold">누적 버퍼 (원본 delta 순서 보존)</span>
                <span className="font-mono">{active === 4 ? "종료 신호" : `delta ${deltaCount}/4`}</span>
              </div>
              <p className="min-h-[2.5rem] break-all font-mono text-[11px] leading-5">
                {DELTAS.map((delta, index) => (
                  <span
                    key={index}
                    className={index < deltaCount ? "" : "opacity-0"}
                    style={{ color: (SEGMENT_COLORS as readonly string[])[index] }}
                  >
                    <span style={{ textDecoration: index === active ? "underline" : undefined }}>{delta}</span>
                    {index < DELTAS.length - 1 ? <span className="text-muted-foreground/60"> | </span> : null}
                  </span>
                ))}
              </p>
            </div>

            <div className="text-center text-muted-foreground" aria-hidden>↓ parser가 확정할 수 있는 block 경계까지만</div>

            <div className="rounded-md border border-[#16a34a] px-3 py-2">
              <p className="mb-1 text-[10px] font-bold text-[#15803d] dark:text-[#4ade80]">확정된 화면</p>
              <div className="min-h-[6.75rem] space-y-1.5">
                <p className={`leading-5 ${has("paragraph") ? "" : "opacity-0"}`}>설치 방법입니다.</p>
                <pre className={`m-0 whitespace-pre-wrap rounded border border-border bg-muted/40 px-2 py-1 font-mono text-[11px] leading-5 ${has("code") ? "" : "opacity-0"}`}>
                  npm test
                </pre>
                <p className={`leading-5 ${has("tail") ? "" : "opacity-0"}`}>
                  자세한 내용은 [문서]( <span className="text-[10px] text-muted-foreground">← flush로 확정</span>
                </p>
              </div>
            </div>

            <div className="rounded-md border border-dashed border-[#d97706] px-3 py-2">
              <p className="mb-1 text-[10px] font-bold text-[#b45309] dark:text-[#fbbf24]">임시 텍스트 (스타일 미확정)</p>
              <pre className="m-0 min-h-[2.5rem] whitespace-pre-wrap break-all font-mono text-[11px] leading-5 text-muted-foreground">
                {scene.pending || "비어 있음"}
              </pre>
            </div>
          </div>
        );
      }}
    />
  );
}
