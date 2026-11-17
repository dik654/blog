import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-dimensional — 2D RS square(Celestia 계열)와 EIP-7594 PeerDAS의 배치 차이.
 * 2D: k×k source를 행과 열 두 방향으로 확장. PeerDAS: blob 하나가 한 행, 행만 1차원 확장,
 * 여러 행에서 같은 위치의 cell을 열로 묶어 보관하고 표본을 요청.
 * 그림의 blob 4개, 행 길이 4→8칸은 배치를 보이려는 가정입니다.
 */
const SIZE = 8;
const K = 4;
const BLOBS = 4;
const COLUMN = 5;
const SAMPLES = new Set([5, 18, 35, 60]);

const SCENES = [
  {
    label: "2D square",
    summary: "행과 열 두 방향으로 확장",
    note: "Celestia 계열 2D 방식은 4×4 source를 행 방향으로 늘린 뒤 열 방향으로도 늘려 8×8을 만듭니다. 테두리 진한 칸은 cell 단위 sample 예시입니다.",
  },
  {
    label: "PeerDAS 행",
    summary: "blob 하나 = 한 행 · 행만 1차원 확장",
    note: "PeerDAS는 blob마다 그 행을 1차원 erasure code로 늘립니다. 열 방향으로 새 행을 계산해 붙이지 않으므로 아래쪽 확장 영역이 없습니다.",
  },
  {
    label: "PeerDAS 열",
    summary: `같은 위치 cell을 묶은 열 ${COLUMN}`,
    note: "여러 행에서 같은 위치에 있는 cell을 세로로 묶은 것이 열입니다. 이 열 단위로 보관하고 표본을 요청합니다. 행렬 구성·commitment·복원 기준은 2D 방식과 다릅니다.",
  },
] as const;

type Tone = "source" | "rowExt" | "colExt" | "absent";

function toneOf(active: number, r: number, c: number): Tone {
  if (active === 0) {
    if (r < K) return c < K ? "source" : "rowExt";
    return "colExt";
  }
  if (r >= BLOBS) return "absent";
  return c < K ? "source" : "rowExt";
}

const TONE: Record<Tone, string> = {
  source: "border-foreground/30 bg-foreground/10",
  rowExt: "border-[#2563eb]/60 bg-[#2563eb]/15",
  colExt: "border-[#16a34a]/60 bg-[#16a34a]/15",
  absent: "border-dashed border-border bg-transparent",
};

const LEGEND: Record<Tone, string> = {
  source: "원본",
  rowExt: "행 방향 확장",
  colExt: "열 방향 확장",
  absent: "없음",
};

export default function PeerDasLayoutViz() {
  return (
    <SceneShell
      eyebrow="2D square와 PeerDAS"
      title="2D 방식은 두 방향으로 늘리고, PeerDAS는 행만 늘린 뒤 열로 묶습니다"
      description="칸 하나가 cell입니다. 회색은 원본, 파랑은 행 방향 확장, 초록은 열 방향 확장입니다. PeerDAS 쪽 blob 4개와 행 길이 4→8칸은 배치를 보이려는 가정입니다."
      ariaLabel="2D Reed-Solomon square와 PeerDAS의 행 확장, 열 묶음 배치 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[420px]">
          <div className="grid grid-cols-[3.25rem_repeat(8,minmax(0,1fr))] gap-1">
            {Array.from({ length: SIZE }, (_, r) => (
              <div key={r} className="contents">
                <div className="flex items-center text-[10px] text-muted-foreground">
                  {active === 0 ? `행${r}` : r < BLOBS ? `blob ${r + 1}` : ""}
                </div>
                {Array.from({ length: SIZE }, (_, c) => {
                  const tone = toneOf(active, r, c);
                  const sampled = active === 0 && SAMPLES.has(r * SIZE + c);
                  const inColumn = active === 2 && c === COLUMN && tone !== "absent";
                  return (
                    <div
                      key={c}
                      className={`aspect-square min-w-0 rounded-sm border ${TONE[tone]} ${
                        sampled || inColumn ? "outline outline-1 outline-offset-1 outline-[#d97706]" : ""
                      }`}
                    />
                  );
                })}
              </div>
            ))}
            <div />
            {Array.from({ length: SIZE }, (_, c) => (
              <div key={`c${c}`} className={`pt-1 text-center font-mono text-[10px] ${active === 2 && c === COLUMN ? "font-bold text-[#b45309] dark:text-[#fbbf24]" : "text-muted-foreground"}`}>
                {active === 2 && c === COLUMN ? "↑열" : c}
              </div>
            ))}
          </div>
          <div className="mt-3 flex min-h-[2.5rem] flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            {(active === 0 ? (["source", "rowExt", "colExt"] as const) : (["source", "rowExt", "absent"] as const)).map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className={`inline-block h-3 w-3 rounded-sm border ${TONE[t]}`} />
                {t === "absent" ? "열 방향 확장 없음" : LEGEND[t]}
              </span>
            ))}
            <span className={`flex items-center gap-1.5 ${active === 1 ? "invisible" : ""}`}>
              <span className="inline-block h-3 w-3 rounded-sm border border-border outline outline-1 outline-offset-1 outline-[#d97706]" />
              {active === 0 ? "sample cell 예시" : "열 하나"}
            </span>
          </div>
        </div>
      )}
    />
  );
}
