import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlayfs — lower의 100 MiB 파일에 한 줄 덧붙이기. copy_up 순서:
 * 부모 디렉터리 → 같은 메타데이터로 빈 파일 → 데이터 100 MiB → 확장 속성 → 그제야 한 줄.
 */
const STEPS = ["부모 디렉터리", "빈 파일", "데이터 100 MiB", "확장 속성", "한 줄 적기"] as const;

const SCENES = [
  { label: "쓰기 모드로 열면", summary: "upper에 아직 아무것도 없음", done: 0, now: -1, copied: 0, dir: false, file: false, line: false, note: "파일은 읽기 전용 lower에 있고 upper는 비어 있습니다. overlayfs는 한 줄을 적기 전에 먼저 그 파일을 upper로 복사합니다." },
  { label: "자리 만들기", summary: "부모 디렉터리 → 빈 파일", done: 2, now: 1, copied: 0, dir: true, file: true, line: false, note: "upper에 부모 디렉터리를 만들고 같은 메타데이터로 빈 파일을 만듭니다. 아직 데이터는 없습니다." },
  { label: "데이터 복사", summary: "시간은 여기서 듭니다", done: 3, now: 2, copied: 100, dir: true, file: true, line: false, note: "100 MiB를 통째로 복사합니다. 덧붙일 내용은 한 줄뿐이지만 복사량은 파일 전체입니다. 1절에서 걸린 1초는 그 한 줄이 아니라 이 복사였습니다." },
  { label: "그제야 한 줄", summary: "확장 속성 → 한 줄", done: 5, now: 4, copied: 100, dir: true, file: true, line: true, note: "확장 속성까지 복사가 끝나야 한 줄이 적힙니다. lower의 원본은 그대로 남아 있고, 이제부터 /merged에는 upper의 것이 보입니다." },
  { label: "그다음 쓰기", summary: "copy_up 없음 · 빠름", done: 5, now: -1, copied: 100, dir: true, file: true, line: true, note: "그다음부터는 upper의 일반 파일이라 빠릅니다. 파일마다 첫 쓰기에서 한 번씩 치르는 비용이므로, 로그·DB 파일·캐시가 이미지 layer 위에 있으면 첫 쓰기마다 copy_up이 나고 upper가 커집니다." },
] as const;

function FileBar({ percent, color, label }: { percent: number; color: string; label: string }) {
  return (
    <div>
      <div className="h-3 overflow-hidden rounded-sm bg-muted/50">
        <div className="h-full rounded-sm transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
      <span className="mt-1 block font-mono text-xs">{label}</span>
    </div>
  );
}

export default function CopyUpViz() {
  return (
    <SceneShell
      eyebrow="copy_up"
      title="한 줄을 쓰려다 100 MiB를 먼저 복사합니다"
      description="위 띠의 1~4가 copy_up의 순서이고 5가 원래 하려던 쓰기입니다. 아래 두 칸이 lower와 upper에 있는 같은 파일입니다. 파일 크기 100 MiB는 1절의 가정입니다."
      ariaLabel="copy_up 순서와 upper로 복사되는 100 MiB"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-5 gap-1">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className={`flex min-h-[3.25rem] flex-col items-center justify-center rounded-lg border px-0.5 py-1 text-center text-[11px] leading-4 ${
                    i === s.now ? "border-primary bg-primary/10 font-bold" : i < s.done ? "border-border bg-muted/40" : "border-dashed border-border/60 text-muted-foreground/70"
                  }`}
                >
                  <span className="font-mono">{i + 1}</span>
                  <span className="break-keep">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-xs font-bold">lower · 읽기 전용</span>
                <span className="mb-1.5 block text-xs leading-5 text-muted-foreground">원본은 그대로</span>
                <FileBar percent={100} color="#64748b" label="100 MiB" />
              </div>
              <div className={`rounded-lg border px-3 py-2 ${s.dir ? "border-primary" : "border-dashed border-border"}`}>
                <span className="block text-xs font-bold">upper · 쓰기 가능</span>
                <span className="mb-1.5 block text-xs leading-5 text-muted-foreground">{s.file ? (s.line ? "복사본 + 덧붙인 한 줄" : s.copied ? "복사본" : "부모 디렉터리와 빈 파일") : "비어 있음"}</span>
                <FileBar percent={s.copied} color="#d97706" label={s.file ? `${s.copied} MiB${s.line ? " + 한 줄" : ""}` : "파일 없음"} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
