import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlayfs — lowerdir=/l1:/l2:/l3에서 왼쪽이 맨 위, 같은 이름은 위쪽이 가림, 변경은 upper에만.
 * 파일 이름 a.conf·b.conf·c.bin·new.log는 설명용 가정이며 같은 디렉터리 안의 파일로 둔다.
 */
const FILES = ["a.conf", "b.conf", "c.bin", "new.log"] as const;

type Cell = "" | "file" | "hidden";

const LOWER: readonly { name: string; cells: readonly Cell[] }[] = [
  { name: "/l1", cells: ["file", "", "", ""] },
  { name: "/l2", cells: ["", "file", "", ""] },
  { name: "/l3", cells: ["hidden", "", "file", ""] },
];

const SCENES = [
  { label: "옵션의 왼쪽이 맨 위", summary: "lowerdir=/l1:/l2:/l3", merged: [false, false, false, false], upper: false, wiped: false, note: "lowerdir은 읽기 전용 layer들이고, 적은 순서와 쌓이는 순서가 위아래로 대응합니다. 왼쪽 /l1이 맨 위, 오른쪽 /l3이 맨 아래입니다. 이미지의 base layer가 오른쪽 끝에, 마지막 RUN의 layer가 왼쪽 끝에 옵니다." },
  { label: "같은 이름은 위쪽이 보입니다", summary: "a.conf → /l1의 것", merged: [true, true, true, false], upper: false, wiped: false, note: "디렉터리끼리는 합쳐져 세 layer의 파일이 /merged 한 곳에 보입니다. 파일은 위쪽이 아래쪽을 가리므로 /l3의 a.conf는 지워지지 않았지만 보이지 않습니다. 파일 이름은 설명용입니다(가정)." },
  { label: "변경은 upper에만", summary: "new.log → upper", merged: [true, true, true, true], upper: true, wiped: false, note: "컨테이너가 실행 중에 만드는 모든 변경은 쓰기 가능한 upper에만 적힙니다. 아래의 lower 세 줄은 그대로입니다." },
  { label: "컨테이너를 지우면", summary: "upper만 사라집니다", merged: [true, true, true, false], upper: false, wiped: true, note: "컨테이너를 지울 때는 upper만 지웁니다. lower는 다른 컨테이너와 계속 공유하므로 남습니다." },
] as const;

export default function OverlayStackViz() {
  return (
    <SceneShell
      eyebrow="overlayfs"
      title="layer가 쌓이는 순서와 위쪽이 아래쪽을 가리는 모습"
      description="가로줄이 layer이고 세로줄이 파일입니다. 맨 윗줄 /merged가 프로그램이 보는 결과입니다."
      ariaLabel="overlayfs의 merged, upper, lower 층과 파일 가림"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const rowClass = "grid grid-cols-[4.25rem_repeat(4,minmax(0,1fr))] items-stretch gap-1";
        return (
          <div className="min-w-0 space-y-1">
            <div className={rowClass}>
              <span />
              {FILES.map((file) => (
                <span key={file} className="text-center font-mono text-[11px] leading-5 text-muted-foreground">{file}</span>
              ))}
            </div>
            <div className={rowClass}>
              <span className="self-center text-xs font-bold leading-4">/merged<br /><span className="font-normal text-muted-foreground">보이는 결과</span></span>
              {FILES.map((file, i) => (
                <div key={file} className={`flex min-h-9 items-center justify-center rounded border text-center text-[11px] leading-4 ${s.merged[i] ? "border-primary bg-primary/10 font-bold" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                  {s.merged[i] ? (i === 3 ? "upper의 것" : i === 0 ? "/l1의 것" : i === 1 ? "/l2의 것" : "/l3의 것") : "−"}
                </div>
              ))}
            </div>
            <div className={rowClass}>
              <span className={`self-center text-xs font-bold leading-4 ${s.wiped ? "text-red-700 line-through dark:text-red-400" : ""}`}>upper<br /><span className="font-normal text-muted-foreground">쓰기 가능</span></span>
              {FILES.map((file, i) => (
                <div key={file} className={`flex min-h-9 items-center justify-center rounded border text-[11px] leading-4 ${i === 3 && s.upper ? "border-amber-600 font-bold text-amber-700 dark:text-amber-400" : s.wiped ? "border-dashed border-red-600/50 text-muted-foreground/50" : "border-dashed border-border/60 text-muted-foreground/60"}`}>
                  {i === 3 && s.upper ? "새로 적음" : "−"}
                </div>
              ))}
            </div>
            <p className="pt-1 font-mono text-[11px] leading-5 text-muted-foreground">lower · 읽기 전용</p>
            {LOWER.map((layer) => (
              <div key={layer.name} className={rowClass}>
                <span className="self-center font-mono text-xs font-bold leading-4">{layer.name}</span>
                {layer.cells.map((cell, i) => (
                  <div
                    key={FILES[i]}
                    className={`flex min-h-9 items-center justify-center rounded border text-[11px] leading-4 ${
                      cell === "file" ? "border-border bg-muted/40 font-semibold" : cell === "hidden" ? (active === 0 ? "border-border bg-muted/40 font-semibold" : "border-dashed border-border text-muted-foreground line-through") : "border-dashed border-border/40 text-muted-foreground/50"
                    }`}
                  >
                    {cell === "" ? "−" : cell === "hidden" && active > 0 ? "가려짐" : "있음"}
                  </div>
                ))}
              </div>
            ))}
            <p className="pt-1 text-xs leading-5 text-muted-foreground">lower 안에서 /l1이 맨 위(마지막 RUN), /l3이 맨 아래(base layer)입니다.</p>
          </div>
        );
      }}
    />
  );
}
