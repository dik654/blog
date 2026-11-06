import SceneShell from "./SceneShell";

export interface TraceLine {
  code: string;
  hint: string;
}

export interface TraceCell {
  name: string;
  value: string;
  changed?: boolean;
}

export interface TraceScene {
  label: string;
  summary: string;
  note: string;
  lines: readonly TraceLine[];
  cells: readonly TraceCell[];
}

/** 명령 몇 줄과 그 뒤 저장 자리에 놓인 값을 나란히 보여 줍니다. 값은 본문 사례를 문서 출력에 대입한 것입니다. */
export default function RegisterTrace({
  eyebrow,
  title,
  description,
  ariaLabel,
  scenes,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ariaLabel: string;
  scenes: readonly TraceScene[];
}) {
  return (
    <SceneShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      ariaLabel={ariaLabel}
      scenes={scenes}
      render={(active) => {
        const scene = scenes[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">이번 장면의 명령</p>
              <ol className="space-y-1">
                {scene.lines.map((line) => (
                  <li key={line.code} className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-2 border-l border-primary/60 pl-2">
                    <code className="min-w-0 break-words font-mono text-[11px] font-semibold">{line.code}</code>
                    <span className="text-[11px] leading-5 text-muted-foreground">{line.hint}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-xs font-semibold text-muted-foreground">장면이 끝난 뒤 저장 자리 (● 이번에 바뀜)</p>
              <div className="grid grid-cols-2 gap-1.5">
                {scene.cells.map((cell) => (
                  <div
                    key={cell.name}
                    className={`min-w-0 rounded border px-2 py-1 ${cell.changed ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                  >
                    <span className="block truncate font-mono text-[11px] text-muted-foreground">{cell.changed ? "● " : ""}{cell.name}</span>
                    <span className={`block font-mono text-sm ${cell.changed ? "font-bold" : ""}`}>{cell.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
