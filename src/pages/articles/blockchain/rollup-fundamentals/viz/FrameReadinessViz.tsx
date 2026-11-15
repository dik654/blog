import SceneShell from "./SceneShell";

/**
 * 본문 대응: #derivation-source — 조각 0·1의 도착과 읽기 준비, 그리고 바이트 수.
 * 고정 부분 16+2+4+1=23, frame_data 100(가정) → 조각 123, 두 개 246, version 1바이트 더해 247.
 */
const FIELDS = [
  { name: "channel_id", bytes: 16, color: "#64748b" },
  { name: "frame_number", bytes: 2, color: "#94a3b8" },
  { name: "frame_data_length", bytes: 4, color: "#475569" },
  { name: "frame_data", bytes: 100, color: "#2563eb" },
  { name: "is_last", bytes: 1, color: "#d97706" },
] as const;
const FRAME = FIELDS.reduce<number>((sum, f) => sum + f.bytes, 0);
const FIXED = FRAME - 100;
const TOTAL = 1 + 2 * FRAME;

const SCENES = [
  {
    label: "조각 1만 도착",
    summary: "끝은 알지만 0이 없음",
    has0: false,
    bytes: "none",
    note: "조각 1은 is_last=1이라 채널의 끝 번호를 알려 줍니다. 그러나 조각 0이 빠져 있어 번호가 처음부터 이어지지 않습니다. 완성된 입력으로 읽을 수 없습니다.",
  },
  {
    label: "조각 0 도착",
    summary: "0·1 연속 + 마지막 표시 → 읽기",
    has0: true,
    bytes: "none",
    note: "같은 channel_id의 조각 0을 얻으면 0부터 마지막 조각까지 연속됩니다. 번호 순으로 이어 붙여 압축을 풀면 T1, T2 순서가 나옵니다. 1이 먼저 도착했다는 사실이 실행 순서를 바꾸지 않습니다.",
  },
  {
    label: "조각 하나의 크기",
    summary: `${FIXED} + 100 = ${FRAME}바이트`,
    has0: true,
    bytes: "frame",
    note: "고정 부분은 channel_id 16, frame_number 2, frame_data_length 4, is_last 1을 더한 23바이트입니다. 데이터가 100바이트라면(가정) 조각 하나는 123바이트입니다.",
  },
  {
    label: "게시 데이터 하나",
    summary: `1 + ${FRAME} + ${FRAME} = ${TOTAL}바이트`,
    has0: true,
    bytes: "batch",
    note: "두 조각은 246바이트이고, 한 version 0 게시 데이터에 넣으면 맨 앞 버전 1바이트를 더해 247바이트입니다. 실제 거래 외피와 blob 포장 비용은 이 값에 들어 있지 않습니다.",
  },
] as const;

function Slot({ n, present, last }: { n: number; present: boolean; last: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-md border px-2 py-2 text-center text-xs leading-5 ${
        present ? "border-border" : "border-dashed border-red-600 text-red-700 dark:text-red-400"
      }`}
    >
      <span className="block font-mono font-bold">조각 {n}</span>
      <span className="block font-mono text-[11px]">{present ? `is_last=${last ? 1 : 0}` : "없음"}</span>
    </div>
  );
}

function Segments({ parts, total }: { parts: readonly { key: string; bytes: number; color: string }[]; total: number }) {
  return (
    <div className="flex h-5 w-full overflow-hidden rounded-sm border border-border">
      {parts.map((p) => (
        <div key={p.key} style={{ width: `${(p.bytes / total) * 100}%`, backgroundColor: p.color }} className="h-full border-r border-white last:border-r-0 dark:border-black" />
      ))}
    </div>
  );
}

export default function FrameReadinessViz() {
  return (
    <SceneShell
      eyebrow="Frame 읽기 규칙"
      title="조각 번호가 0부터 마지막까지 이어져야 입력을 읽습니다"
      description="T1과 T2를 담은 압축 데이터를 조각 0과 1로 나눴다고 둡니다(가정). 위 칸은 받은 조각, 아래 띠는 바이트 수에 비례한 길이입니다."
      ariaLabel="조각 0과 1의 도착에 따른 읽기 준비와 조각, 게시 데이터의 바이트 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const frameParts = FIELDS.map((f) => ({ key: f.name, bytes: f.bytes, color: f.color }));
        const batchParts = [
          { key: "version", bytes: 1, color: "#16a34a" },
          { key: "frame0", bytes: FRAME, color: "#2563eb" },
          { key: "frame1", bytes: FRAME, color: "#60a5fa" },
        ];
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] items-center gap-2">
              <Slot n={0} present={scene.has0} last={false} />
              <Slot n={1} present last />
              <div className={`rounded-md border px-2 py-2 text-center text-xs font-bold leading-5 ${scene.has0 ? "border-primary text-primary" : "border-dashed border-border text-muted-foreground"}`}>
                {scene.has0 ? "읽기 준비 → T1, T2" : "읽기 대기"}
              </div>
            </div>
            <div className={`space-y-2 transition-opacity motion-reduce:transition-none ${scene.bytes === "none" ? "opacity-30" : ""}`}>
              <p className="text-[11px] font-bold text-muted-foreground">{scene.bytes === "batch" ? `게시 데이터 ${TOTAL}바이트` : `조각 하나 ${FRAME}바이트`}</p>
              <Segments parts={scene.bytes === "batch" ? batchParts : frameParts} total={scene.bytes === "batch" ? TOTAL : FRAME} />
              <ul className="flex min-h-[3.75rem] flex-wrap content-start gap-x-3 gap-y-1 font-mono text-[11px] leading-5">
                {(scene.bytes === "batch"
                  ? [
                      { k: "version", b: 1, c: "#16a34a" },
                      { k: "조각 0", b: FRAME, c: "#2563eb" },
                      { k: "조각 1", b: FRAME, c: "#60a5fa" },
                    ]
                  : FIELDS.map((f) => ({ k: f.name, b: f.bytes, c: f.color }))
                ).map((item) => (
                  <li key={item.k} className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: item.c }} />
                    {item.k} {item.b}
                    {item.k === "frame_data" ? "(가정)" : ""}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
