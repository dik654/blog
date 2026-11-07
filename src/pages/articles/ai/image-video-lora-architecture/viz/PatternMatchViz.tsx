import SceneShell from "./SceneShell";

/**
 * 본문 대응: #video-scope — 짧은 to_q pattern이 video·audio·cross-modal attention에 모두 match합니다.
 * full path 이름은 설명을 위한 가정입니다. 전부 match가 맞는지는 학습 목적에 달려 있습니다.
 */
const PREFIXES = ["video_attn.", "audio_attn.", "cross_modal_attn."];

const SCENES = [
  { label: "video만 배우려는데", summary: "세 경로 모두 match", intent: "video만 학습", pattern: "to_q", status: ["의도 안", "의도 밖", "의도 밖"], note: "pattern은 LoRA를 붙일 module을 고르는 문자열입니다. to_q 하나면 간편하지만 모든 attention에 match해, 의도하지 않은 매체(modality) 경로까지 학습할 수 있습니다." },
  { label: "경로까지 적으면", summary: "video 경로만 match", intent: "video만 학습", pattern: "video_attn.to_q", status: ["의도 안", "제외", "제외"], note: "경로까지 적으면 다른 두 경로는 빠집니다. 이름은 model마다 다르므로, pattern이 실제로 match한 full path를 저장해 확인합니다." },
  { label: "공동 생성이 목적이면", summary: "전부 match가 권장값", intent: "audio-video 공동 생성", pattern: "to_q", status: ["의도 안", "의도 안", "의도 안"], note: "LTX-2의 현재 공개 T2V LoRA 설정은 짧은 pattern이 세 경로에 모두 match한다고 설명합니다. 그 설정의 권장값이며 다른 video backbone의 규칙은 아닙니다." },
] as const;

export default function PatternMatchViz() {
  return (
    <SceneShell
      eyebrow="Target pattern"
      title="짧은 문자열 하나가 생각보다 많은 경로에 붙을 수 있습니다"
      description="진하게 표시한 부분이 pattern과 일치한 곳입니다. full path 이름은 가정입니다."
      ariaLabel="to_q 패턴이 일치하는 attention 경로와 학습 의도의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[560px] space-y-3 text-sm">
            <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-2 gap-y-1 rounded-lg border border-border/70 px-3 py-2">
              <span className="text-muted-foreground">의도</span>
              <span className="font-semibold">{scene.intent}</span>
              <span className="text-muted-foreground">pattern</span>
              <code className="font-mono font-bold text-primary">{scene.pattern}</code>
            </div>
            <ul className="space-y-2">
              {PREFIXES.map((prefix, index) => {
                const status = (scene.status as readonly string[])[index];
                const excluded = status === "제외";
                const outside = status === "의도 밖";
                const full = `${prefix}to_q`;
                const matchStart = excluded ? -1 : full.indexOf(scene.pattern);
                return (
                  <li
                    key={prefix}
                    className={`grid grid-cols-[minmax(0,1fr)_3.75rem] items-center gap-2 rounded-lg border px-3 py-2 ${
                      excluded ? "border-dashed border-border/70" : outside ? "border-red-600/70" : "border-primary/60"
                    }`}
                  >
                    <span className="min-w-0">
                      <code className="block break-all font-mono text-[13px]">
                        {matchStart < 0 ? (
                          <span className="text-muted-foreground">{full}</span>
                        ) : (
                          <>
                            <span className="text-muted-foreground">{full.slice(0, matchStart)}</span>
                            <span className={`font-bold ${outside ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{full.slice(matchStart)}</span>
                          </>
                        )}
                      </code>
                    </span>
                    <span className={`text-right text-xs font-semibold ${excluded ? "text-muted-foreground" : outside ? "text-red-700 dark:text-red-400" : "text-primary"}`}>{status}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }}
    />
  );
}
