import SceneShell from "./SceneShell";

/**
 * 본문 대응: #impact "Shortcut을 선택하는 여러 computational path로 network를 전개하면".
 * Block마다 residual branch F를 지나거나 shortcut으로 건너뛰는 두 선택이 있다고 보면
 * block n개는 2^n개 path가 된다. block 수는 가정(1·2·3개).
 * n=3: path 8개, F를 지나는 개수 0·1·2·3이 각각 1·3·3·1개.
 */
const MAX_BLOCKS = 3;
const ALL_PATHS: readonly (readonly boolean[])[] = Array.from({ length: 2 ** MAX_BLOCKS }, (_, code) =>
  Array.from({ length: MAX_BLOCKS }, (_, bit) => ((code >> bit) & 1) === 1),
);

const pathsFor = (n: number) =>
  ALL_PATHS.filter((path) => path.slice(n).every((on) => !on))
    .map((path) => path.slice(0, n))
    .sort((a, b) => a.filter(Boolean).length - b.filter(Boolean).length);

const SCENES = [
  { label: "block 1개 (가정)", summary: "path 2개", blocks: 1, note: "Block 하나에서 입력은 residual branch F를 지나거나 shortcut으로 건너뜁니다. 그래서 F를 0번 지나는 길과 1번 지나는 길, 두 개가 생깁니다." },
  { label: "block 2개 (가정)", summary: "path 4개", blocks: 2, note: "Block마다 같은 두 선택이 있으므로 두 block이면 2×2=4개 path입니다. F를 0번 지나는 길 1개, 1번 지나는 길 2개, 2번 지나는 길 1개입니다." },
  { label: "block 3개 (가정)", summary: "path 8개 · F 수별 1·3·3·1개", blocks: 3, note: "세 block이면 8개 path가 길이 0부터 3까지 섞입니다. Block이 3개여도 F를 0번이나 1번만 지나는 짧은 path가 함께 있고, 후속 분석은 이런 짧은 path가 gradient에 기여한다고 봅니다. 다만 이 전개는 identity shortcut을 가정한 관점이며, trained ResNet이 독립 model의 ensemble과 같다는 정의는 아닙니다." },
] as const;

export default function ResidualPathsViz() {
  return (
    <SceneShell
      eyebrow="Path 전개"
      title="Block마다 지나거나 건너뛰면 길이가 다른 path들이 생깁니다"
      description="한 줄이 입력에서 출력까지 가는 path 하나입니다. 칸 F는 그 block의 residual branch를 지난다는 뜻이고, 칸 skip은 shortcut으로 건너뛴다는 뜻입니다. 오른쪽 숫자는 path가 지난 F의 개수입니다."
      ariaLabel="residual block 수에 따라 shortcut 선택으로 생기는 path 개수와 길이"
      scenes={SCENES}
      render={(active) => {
        const n = SCENES[active].blocks;
        const paths = pathsFor(n);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))_3rem] gap-1 text-center text-xs">
              <span />
              {Array.from({ length: MAX_BLOCKS }, (_, block) => (
                <span key={block} className={block < n ? "font-semibold" : "text-muted-foreground/40"}>block {block + 1}</span>
              ))}
              <span className="text-muted-foreground">F 수</span>
              {Array.from({ length: 2 ** MAX_BLOCKS }, (_, row) => {
                const path: readonly boolean[] | undefined = paths[row];
                return [
                  <span key={`l${row}`} className={path ? "text-muted-foreground" : "text-muted-foreground/30"}>path {row + 1}</span>,
                  ...Array.from({ length: MAX_BLOCKS }, (_, block) => {
                    const used = path !== undefined && block < n;
                    const through = used && path[block];
                    return (
                      <span
                        key={`c${row}-${block}`}
                        className={`rounded-sm border py-0.5 font-mono ${used ? (through ? "border-blue-600 bg-blue-600/10 font-bold text-blue-700 dark:text-blue-300" : "border-border text-muted-foreground") : "border-dashed border-border/30 text-transparent"}`}
                      >
                        {used ? (through ? "F" : "skip") : "·"}
                      </span>
                    );
                  }),
                  <span key={`n${row}`} className="font-mono font-bold">{path ? path.filter(Boolean).length : ""}</span>,
                ];
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
