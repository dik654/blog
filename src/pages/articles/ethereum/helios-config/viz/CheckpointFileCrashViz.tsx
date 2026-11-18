import HeliosSceneShell from "./HeliosSceneShell";

/**
 * 본문 대응: #persistence "Checkpoint 선택 순서" — explicit → FileDB(정확히 32 bytes) → network default,
 * 그리고 truncate 후 바로 쓰는 save가 12 bytes에서 끊겼을 때 다음 시작이 고르는 값.
 * 32칸 = checkpoint 파일의 byte 하나씩.
 */
const SCENES = [
  {
    label: "시작할 때 고르는 순서",
    summary: "explicit → file → default",
    bytes: 32,
    path: 1,
    note: "config.checkpoint가 없으면(가정) FileDB를 읽습니다. 파일이 정확히 32 bytes이면 그 값을 쓰고, 아니면 network default checkpoint를 반환합니다. config.checkpoint가 있으면 파일까지 내려가지 않습니다.",
  },
  {
    label: "save ① truncate",
    summary: "32 → 0 bytes",
    bytes: 0,
    path: -1,
    note: "새 checkpoint를 저장할 때 FileDB는 같은 파일을 truncate(길이를 0으로 자름)로 엽니다. 이 순간 이전 32 bytes는 이미 사라졌고 새 값은 아직 없습니다.",
  },
  {
    label: "save ② 쓰는 도중 crash",
    summary: "12 / 32 bytes만 남음",
    bytes: 12,
    path: -1,
    note: "곧바로 32 bytes를 쓰는데, 이 도중 crash가 나면 12 bytes만 남을 수 있습니다. Temp file, file fsync, atomic rename, directory fsync가 없으므로 이전 값으로 되돌릴 사본도 없습니다.",
  },
  {
    label: "다음 시작",
    summary: "12 ≠ 32 → network default",
    bytes: 12,
    path: 2,
    note: "다음 시작에서 config.checkpoint가 없으면(가정) FileDB를 읽고, 길이가 32가 아니므로 오류 없이 network default checkpoint를 돌려줍니다. 조용히 default로 돌아갈 수 있다는 뜻이며, 이 동작을 crash-safe persistence로 부르면 안 됩니다.",
  },
] as const;

const SCENE_LIST: readonly (typeof SCENES)[number][] = SCENES;

const LADDER = [
  { q: "config.checkpoint 있음?", yes: "그 값 사용" },
  { q: "FileDB가 정확히 32 bytes?", yes: "파일 값 사용" },
  { q: "그 밖의 경우", yes: "network default" },
] as const;

function ByteBar({ filled }: { filled: number }) {
  const cells = Array.from({ length: 32 }, (_, i) => i < filled);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between font-mono text-[11px] text-muted-foreground sm:text-xs">
        <span>data_dir/checkpoint</span>
        <span className={filled === 32 ? "text-primary" : "font-bold text-red-700 dark:text-red-400"}>{filled} / 32 bytes</span>
      </div>
      <div className="grid grid-cols-[repeat(16,minmax(0,1fr))] gap-0.5 sm:grid-cols-[repeat(32,minmax(0,1fr))]" aria-hidden>
        {cells.map((on, i) => (
          <span key={i} className={`h-4 rounded-[2px] border ${on ? "border-primary bg-primary/70" : "border-dashed border-border"}`} />
        ))}
      </div>
    </div>
  );
}

export default function CheckpointFileCrashViz() {
  return (
    <HeliosSceneShell
      eyebrow="FileDB · 32-byte checkpoint"
      title="저장이 12 bytes에서 끊기면 다음 시작은 조용히 default를 고를 수 있습니다"
      description="위 칸 하나가 checkpoint 파일의 1 byte입니다. 아래 사다리는 시작할 때 checkpoint를 고르는 순서이며, 강조된 줄이 그 장면에서 선택되는 값입니다."
      note="12 bytes는 본문이 든 crash 예시입니다. 각 장면은 config.checkpoint를 지정하지 않은 실행을 가정합니다."
      ariaLabel="checkpoint 선택 순서와 저장 중 crash 뒤의 선택을 보여 주는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENE_LIST[active] ?? SCENE_LIST[0];
        return (
          <div className="min-w-0 space-y-4">
            <ByteBar filled={scene.bytes} />
            <ol className="space-y-1.5">
              {LADDER.map((step, i) => {
                const chosen = scene.path === i;
                const passed = scene.path > i;
                return (
                  <li
                    key={step.q}
                    className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border px-3 py-1.5 text-xs leading-5 sm:text-sm ${
                      chosen
                        ? i === 2 && active === 3
                          ? "border-red-600 bg-red-600/[0.06]"
                          : "border-primary bg-primary/[0.07]"
                        : passed
                          ? "border-border text-muted-foreground"
                          : "border-border/60 text-muted-foreground"
                    }`}
                  >
                    <span className="break-keep">
                      {String(i + 1)}. {step.q}
                      {passed ? (i === 0 ? " → 없음(가정)" : active === 3 ? " → 12 bytes, 아님" : " → 아님") : ""}
                    </span>
                    <span className={`break-keep font-mono text-[11px] sm:text-xs ${chosen ? "font-bold" : ""}`}>{chosen ? `선택: ${step.yes}` : step.yes}</span>
                  </li>
                );
              })}
            </ol>
            <p className="min-h-[1.25rem] font-mono text-[11px] text-muted-foreground sm:text-xs">
              {scene.path < 0 ? "save 진행 중 · 아직 선택 단계가 아닙니다" : "시작 시 checkpoint 선택"}
            </p>
          </div>
        );
      }}
    />
  );
}
