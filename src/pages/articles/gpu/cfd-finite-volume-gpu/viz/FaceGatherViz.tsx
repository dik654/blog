import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gpu-mapping — cell field를 SoA로 연속 배치해도 face의 owner/neighbour index가
 * 흩어져 있으면 face gather가 배열 여기저기를 읽게 된다.
 * cell 8개·face 4개와 index 값은 모두 설명용 가정이다.
 */
const CELLS = 8;
const FIELDS = ["ρ", "ρu", "ρE"] as const;

interface Scene {
  label: string;
  summary: string;
  note: string;
  mode: "cell" | "face";
  pairs: readonly (readonly [number, number])[];
}

const SCENES: readonly Scene[] = [
  {
    label: "Cell update: field별 연속 배열",
    summary: "thread 0–3 → index 0–3",
    note: "Structure of Arrays(SoA)는 ρ·ρu·ρE를 field마다 따로 연속 배열에 두는 배치입니다. Cell 하나를 맡은 이웃 thread들이 각 배열의 이웃 칸을 읽으므로 한 줄의 연속 구간에 모입니다.",
    mode: "cell",
    pairs: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    label: "Face가 순서대로라면 (가정)",
    summary: "owner·neighbour 0–4에 모임",
    note: "Face마다 owner와 neighbour 두 cell의 state를 index로 찾아 읽습니다. Face 순서가 cell 순서와 나란하다면 네 face가 읽는 칸은 0–4 한 구간에 모이고, 이웃 face가 같은 칸을 다시 읽어 cache에서 재사용할 기회가 생깁니다.",
    mode: "face",
    pairs: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    label: "Face가 흩어지면 (가정)",
    summary: "같은 네 face가 0–7 전체를 읽음",
    note: "Unstructured mesh에서 face 순서와 index가 흩어져 있다고 가정하면, 같은 field 배열이 연속이어도 네 face가 배열 끝에서 끝까지 띄엄띄엄 읽습니다. 연속 구간을 한 번에 가져오는 memory transaction과 cache reuse가 나빠질 수 있습니다.",
    mode: "face",
    pairs: [[0, 5], [6, 2], [3, 7], [1, 4]],
  },
];

const FACE_COLORS = ["#2563eb", "#d97706", "#0f766e", "#7c3aed"] as const;

export default function FaceGatherViz() {
  return (
    <SceneShell
      eyebrow="Face gather의 메모리 모양"
      title="배열이 연속이어도 face가 흩어지면 읽는 칸이 흩어집니다"
      description="가로줄 하나가 field 하나의 연속 배열, 칸 번호가 cell index입니다. 점은 아래 목록의 face가 읽는 칸입니다."
      note="Cell 8개·face 4개와 index 값은 설명용 가정입니다. 실제 transaction 수와 cache 적중률은 mesh와 GPU에서 측정해야 합니다."
      ariaLabel="SoA 배열에서 cell update와 정렬된 face, 흩어진 face가 읽는 칸 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const marks = Array.from({ length: CELLS }, (_, index) =>
          scene.mode === "cell"
            ? index < 4
              ? [index]
              : []
            : scene.pairs.flatMap(([owner, neighbour], face) => (owner === index || neighbour === index ? [face] : [])),
        );
        return (
          <div className="min-w-0 space-y-4">
            <div className="space-y-1.5">
              {FIELDS.map((field) => (
                <div key={field} className="grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-2">
                  <span className="text-right font-mono text-xs font-bold">{field}</span>
                  <div className="grid grid-cols-8 gap-px bg-border p-px">
                    {marks.map((faces, index) => (
                      <div key={index} className={`flex h-9 min-w-0 flex-col items-center justify-center ${faces.length ? "bg-background" : "bg-muted/40"}`}>
                        <span className="font-mono text-[10px] text-muted-foreground">{index}</span>
                        <span className="flex h-2 gap-0.5">
                          {faces.map((face) => (
                            <span key={face} className="block h-2 w-2 rounded-full" style={{ backgroundColor: scene.mode === "cell" ? "#2563eb" : FACE_COLORS[face] }} />
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {scene.pairs.map(([owner, neighbour], face) => (
                <div key={face} className={`min-w-0 rounded-md border px-2 py-1.5 text-xs ${scene.mode === "cell" ? "border-border/50 text-muted-foreground" : "border-border bg-background"}`}>
                  <span className="flex items-center gap-1.5 font-mono font-bold">
                    <span className="block h-2 w-2 rounded-full" style={{ backgroundColor: scene.mode === "cell" ? "#94a3b8" : FACE_COLORS[face] }} />
                    {scene.mode === "cell" ? `thread ${face}` : `face ${face}`}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px]">{scene.mode === "cell" ? `cell ${face}` : `(${owner}, ${neighbour})`}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
