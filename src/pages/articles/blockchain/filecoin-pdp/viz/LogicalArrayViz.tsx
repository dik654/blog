import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dataset-artifact — piece 순서와 leaf 수를 이어 붙인 논리 배열에서 전체 73번의 뜻.
 * A(60) 먼저: A 0–59, B 60–99 → 73 = B의 73−60 = 13번.
 * 순서를 B(40) 먼저로 바꾸면: B 0–39, A 40–99 → 73 = A의 73−40 = 33번.
 * leaf 수를 A 80, B 20으로 바꾸면(가정): A 0–79 → 73 = A의 73번.
 */
const TARGET = 73;
const COLS = 10;
const TOTAL = 100;

type Piece = { name: "A" | "B"; leaves: number };

const PIECE_COLOR = { A: "#bfdbfe", B: "#fde68a" } as const;
const PIECE_TEXT = { A: "#1e3a8a", B: "#78350f" } as const;

const SCENES = [
  {
    label: "A 다음 B로 이어 붙이기",
    summary: "A 0–59 · B 60–99",
    note: "등록 순서대로 A의 leaf 60개가 전체 번호 0–59를, B의 40개가 60–99를 차지합니다. 칸 하나가 leaf 하나이고, 한 줄에 10칸씩 놓았습니다.",
    pieces: [{ name: "A", leaves: 60 }, { name: "B", leaves: 40 }] as readonly Piece[],
    showTarget: false,
  },
  {
    label: "전체 73번 찾기",
    summary: "73 − 60 = B의 13번",
    note: "73은 60 이상 100 미만이라 B 구간에 떨어집니다. B의 시작점 60을 빼면 B 안의 13번이고, 제공자는 B의 13번 leaf를 열어야 합니다.",
    pieces: [{ name: "A", leaves: 60 }, { name: "B", leaves: 40 }] as readonly Piece[],
    showTarget: true,
  },
  {
    label: "순서를 바꾸면",
    summary: "B 0–39 · A 40–99 → A의 33번",
    note: "같은 두 root라도 B를 먼저 등록하면 B가 0–39, A가 40–99를 차지합니다. 같은 73번이 이제 A의 73−40 = 33번 leaf를 가리킵니다.",
    pieces: [{ name: "B", leaves: 40 }, { name: "A", leaves: 60 }] as readonly Piece[],
    showTarget: true,
  },
  {
    label: "leaf 수를 바꾸면 (가정)",
    summary: "A 0–79 · B 80–99 → A의 73번",
    note: "A가 80개, B가 20개라고 가정하면 A가 0–79를 차지해 73번은 A 안의 73번입니다. 그래서 dataset의 piece 순서와 leaf 수가 challenge 전에 고정돼 있어야 번호의 뜻이 정해집니다.",
    pieces: [{ name: "A", leaves: 80 }, { name: "B", leaves: 20 }] as readonly Piece[],
    showTarget: true,
  },
] as const;

function locate(pieces: readonly Piece[], index: number) {
  const starts = pieces.map((_, i) => pieces.slice(0, i).reduce<number>((sum, p) => sum + p.leaves, 0));
  const which = pieces.findIndex((p, i) => index >= starts[i] && index < starts[i] + p.leaves);
  return { piece: pieces[which], start: starts[which], starts };
}

export default function LogicalArrayViz() {
  return (
    <SceneShell
      eyebrow="Piece A 60 leaves · Piece B 40 leaves"
      title="전체 번호 73은 piece 순서와 leaf 수가 정해져야 뜻이 생깁니다"
      description="두 piece의 leaf를 등록 순서대로 이어 붙여 0–99 번호를 매긴 논리 배열입니다. 칸 안의 작은 숫자는 그 piece 안의 번호입니다."
      ariaLabel="두 piece를 이어 붙인 100칸 논리 배열에서 73번이 가리키는 piece와 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { starts } = locate(scene.pieces, 0);
        const hit = locate(scene.pieces, TARGET);
        return (
          <div className="min-w-0 space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {scene.pieces.map((piece, i) => (
                <span key={piece.name} className="font-mono">
                  <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm align-middle" style={{ backgroundColor: PIECE_COLOR[piece.name] }} />
                  {piece.name}: 전체 {starts[i]}–{starts[i] + piece.leaves - 1} ({piece.leaves}개)
                </span>
              ))}
            </div>
            <div className="mx-auto grid max-w-[320px] grid-cols-[1.75rem_repeat(10,minmax(0,1fr))] gap-[3px]">
              {Array.from({ length: TOTAL / COLS }, (_, row) => (
                <div key={row} className="contents">
                  <span className="self-center pr-1 text-right font-mono text-[10px] text-muted-foreground">{row * COLS}</span>
                  {Array.from({ length: COLS }, (_, col) => {
                    const index = row * COLS + col;
                    const at = locate(scene.pieces, index);
                    const isTarget = scene.showTarget && index === TARGET;
                    return (
                      <span
                        key={col}
                        className="flex aspect-square min-w-0 items-center justify-center rounded-[2px] font-mono text-[9px] leading-none"
                        style={{
                          backgroundColor: PIECE_COLOR[at.piece.name],
                          color: PIECE_TEXT[at.piece.name],
                          outline: isTarget ? "1.25px solid var(--foreground)" : undefined,
                          outlineOffset: isTarget ? "1px" : undefined,
                          fontWeight: isTarget ? 700 : 400,
                        }}
                      >
                        {index - at.start}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className={`text-center font-mono text-sm ${scene.showTarget ? "" : "invisible"}`}>
              전체 73 → piece {hit.piece.name}, {TARGET} − {hit.start} = <strong>{TARGET - hit.start}번</strong>
            </p>
          </div>
        );
      }}
    />
  );
}
