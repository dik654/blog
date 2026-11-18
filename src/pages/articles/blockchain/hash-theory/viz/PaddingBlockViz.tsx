import SceneShell from "./HashSceneShell";

/**
 * 본문 대응: #padding — 입력 n바이트 뒤에 80 한 바이트, 00 여러 개, 길이 8바이트를 붙여 64바이트 배수로 맞춘다.
 * 필요한 바이트 = n + 1 + 8. 이것이 64 이하면 한 블록, 넘으면 두 블록(이 그림의 길이 범위에서).
 * 3 → 00 52개 · 1블록, 55 → 00 0개 · 1블록, 56 → 00 63개 · 2블록, 64 → 00 55개 · 2블록.
 */
const SCENES = [
  { label: "abc 3바이트", summary: "3 + 1 + 52 + 8 = 64 · 1블록", n: 3, note: "abc 3바이트 뒤에 80, 00 52개, 길이 24비트를 적은 8바이트가 붙어 정확히 한 블록입니다. 80은 1비트 하나와 0비트 일곱 개입니다." },
  { label: "55바이트", summary: "55 + 1 + 0 + 8 = 64 · 1블록", n: 55, note: "끝 표시와 길이를 더하면 남는 칸이 없어 00이 하나도 붙지 않습니다. 한 블록에 들어가는 가장 긴 입력입니다." },
  { label: "56바이트", summary: "56 + 1 + 8 = 65 > 64 · 2블록", n: 56, note: "한 바이트만 늘어도 길이 8바이트가 들어갈 자리가 없어, 00을 채워 두 번째 블록 끝에 길이를 적습니다." },
  { label: "64바이트", summary: "입력이 한 블록을 채워도 패딩 블록 추가", n: 64, note: "입력이 첫 블록을 가득 채워도 패딩을 생략하지 않아 블록이 하나 더 생깁니다. 본문의 63·65바이트도 두 블록입니다." },
] as const;

const BLOCK = 64;
const COLORS = { data: "#2563eb", marker: "#d97706", zero: "#cbd5e1", length: "#16a34a", empty: "transparent" } as const;
type Kind = keyof typeof COLORS;

function layout(n: number) {
  const blocks = Math.ceil((n + 1 + 8) / BLOCK);
  const total = blocks * BLOCK;
  const zeros = total - n - 1 - 8;
  const kinds: Kind[] = Array.from({ length: 2 * BLOCK }, (_, i) =>
    i >= total ? "empty" : i < n ? "data" : i === n ? "marker" : i >= total - 8 ? "length" : "zero",
  );
  return { blocks, zeros, kinds };
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="inline-block h-3 w-3 shrink-0 rounded-sm border border-border" style={{ backgroundColor: color }} />
      <span className="min-w-0 text-muted-foreground">{label}</span>
      <span className="ml-auto font-mono font-semibold">{value}</span>
    </div>
  );
}

export default function PaddingBlockViz() {
  return (
    <SceneShell
      eyebrow="SHA-256 패딩"
      title="끝 표시와 길이 8바이트가 들어갈 자리가 블록 수를 정합니다"
      description="작은 칸 하나가 1바이트이고 큰 사각형 하나가 64바이트 블록입니다. 입력 길이를 바꿔 가며 같은 규칙으로 칸을 채웁니다."
      ariaLabel="입력 3, 55, 56, 64바이트의 SHA-256 패딩 배치와 블록 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { blocks, zeros, kinds } = layout(scene.n);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((block) => (
                <div key={block} className="min-w-0">
                  <p className="mb-1 text-xs font-semibold">
                    블록 {block + 1}
                    {block >= blocks ? <span className="ml-1 font-normal text-muted-foreground">· 없음</span> : null}
                  </p>
                  <div
                    className={`grid grid-cols-8 gap-[2px] rounded-md border p-1 ${block < blocks ? "border-border" : "border-dashed border-border/50"}`}
                  >
                    {kinds.slice(block * BLOCK, (block + 1) * BLOCK).map((kind, i) => (
                      <span
                        key={i}
                        className="aspect-square rounded-[2px]"
                        style={{ backgroundColor: COLORS[kind] }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:gap-x-6">
              <Legend color={COLORS.data} label="입력 바이트" value={`${scene.n}개`} />
              <Legend color={COLORS.marker} label="끝 표시 80" value="1개" />
              <Legend color={COLORS.zero} label="00 채움" value={`${zeros}개`} />
              <Legend color={COLORS.length} label={`길이 ${scene.n * 8}비트`} value="8바이트" />
            </div>
          </div>
        );
      }}
    />
  );
}
