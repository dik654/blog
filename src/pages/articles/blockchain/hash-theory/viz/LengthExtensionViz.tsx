import SceneShell from "./HashSceneShell";

/**
 * 본문 대응: #length-extension — 설명용 키 key! 4바이트 + abc 3바이트 = 7바이트, 패딩 57바이트로 64바이트.
 * 기존 결과를 상태로 읽고 ! 를 붙여 총길이 65바이트로 이어 계산한다.
 * 보낼 메시지 = abc + 패딩 57 + ! = 61바이트. 검증자는 키 4바이트를 붙여 65바이트를 해시한다.
 */
type Seg = "key" | "abc" | "pad" | "bang" | "pad2";

const SEGMENTS: readonly { id: Seg; block: 0 | 1; bytes: number; label: string; color: string }[] = [
  { id: "key", block: 0, bytes: 4, label: "키 key!", color: "#7c3aed" },
  { id: "abc", block: 0, bytes: 3, label: "abc", color: "#2563eb" },
  { id: "pad", block: 0, bytes: 57, label: "원래 패딩", color: "#94a3b8" },
  { id: "bang", block: 1, bytes: 1, label: "덧붙인 !", color: "#dc2626" },
  { id: "pad2", block: 1, bytes: 63, label: "새 패딩(총 65바이트 기준)", color: "#cbd5e1" },
];

const SCENES = [
  { label: "원래 인증값", summary: "4 + 3 + 57 = 64바이트 → T", shown: ["key", "abc", "pad"], sent: [] as Seg[], note: "검증자는 키 4바이트와 abc 3바이트에 패딩 57바이트를 붙여 64바이트를 처리하고, 결과 32바이트 T를 인증값으로 씁니다." },
  { label: "공격자가 아는 것", summary: "T → 여덟 u32 시작 상태", shown: ["abc", "pad"], sent: [] as Seg[], note: "공격자는 키 내용을 몰라도 키 길이 4를 맞혔다고 가정하면 원래 패딩을 만들 수 있고, T를 여덟 u32로 읽어 새 시작 상태로 씁니다." },
  { label: "이어서 계산", summary: "! 를 붙이고 총길이 65바이트 → T′", shown: ["abc", "pad", "bang", "pad2"], sent: [] as Seg[], note: "T 상태에서 출발해 두 번째 블록에 ! 와 총길이 65바이트 기준 패딩을 넣어 계산을 잇습니다. 키는 쓰지 않았습니다." },
  { label: "보내는 메시지", summary: "3 + 57 + 1 = 61바이트 + 태그 T′", shown: ["abc", "pad", "bang"], sent: ["abc", "pad", "bang"] as Seg[], note: "abc, 원래 패딩 57바이트, ! 를 합친 61바이트를 보냅니다. abc! 네 바이트를 보내는 것과는 다른 메시지입니다." },
  { label: "검증자의 재계산", summary: "4 + 61 = 65바이트 → T′와 일치", shown: ["key", "abc", "pad", "bang", "pad2"], sent: ["abc", "pad", "bang"] as Seg[], note: "검증자가 키 4바이트를 붙여 65바이트를 해시한 값이 로컬 실행에서 T′와 같았습니다. 원래 패딩된 64바이트는 새 바이트열의 앞부분입니다." },
] as const;

export default function LengthExtensionViz() {
  return (
    <SceneShell
      eyebrow="길이 확장"
      title="원래 패딩을 메시지 안으로 넣으면 키 없이 다음 블록을 이을 수 있습니다"
      description="한 줄이 64바이트 블록 하나이고 칸 폭이 바이트 수(B)에 비례합니다. 칸 아래 청록 띠는 검증자에게 보내는 부분입니다. 키 key!와 메시지 abc는 본문의 설명용 값입니다."
      ariaLabel="SHA-256(key || abc) 인증값에 키 없이 느낌표를 이어 붙이는 길이 확장 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const shown = scene.shown as readonly Seg[];
        return (
          <div className="min-w-0">
            {[0, 1].map((block) => (
              <div key={block} className="mb-2 min-w-0">
                <p className="mb-1 text-xs font-semibold">블록 {block + 1} · 64바이트</p>
                <div className="flex h-9 min-w-0 overflow-hidden rounded-md border border-border">
                  {SEGMENTS.filter((seg) => seg.block === block).map((seg) => {
                    const on = shown.includes(seg.id);
                    return (
                      <div
                        key={seg.id}
                        className="flex h-full min-w-[6px] items-center justify-center overflow-hidden border-r border-background text-[10px] font-semibold last:border-r-0"
                        style={{
                          width: `${(seg.bytes / 64) * 100}%`,
                          backgroundColor: on ? seg.color : "transparent",
                          color: seg.id === "pad2" ? "#0f172a" : "#ffffff",
                        }}
                      >
                        {on && seg.bytes > 30 ? <span className="truncate px-1">{seg.label} {seg.bytes}바이트</span> : null}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-1 flex h-1.5 min-w-0">
                  {SEGMENTS.filter((seg) => seg.block === block).map((seg) => (
                    <div
                      key={seg.id}
                      className="h-full min-w-[6px]"
                      style={{
                        width: `${(seg.bytes / 64) * 100}%`,
                        backgroundColor: scene.sent.includes(seg.id) ? "#0f766e" : "transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] sm:gap-x-6 sm:text-xs">
              {SEGMENTS.map((seg) => {
                const on = shown.includes(seg.id);
                const sent = scene.sent.includes(seg.id);
                return (
                  <div key={seg.id} className={`flex items-start gap-2 ${on ? "" : "opacity-40"}`}>
                    <span className="mt-0.5 inline-block h-3 w-3 shrink-0 rounded-sm border border-border" style={{ backgroundColor: seg.color }} />
                    <span className="min-w-0 leading-4">{seg.label} <span className="font-mono text-muted-foreground">{seg.bytes}B{sent ? " · 보냄" : ""}</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
