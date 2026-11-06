import CellRow, { type CellTone } from "./CellRow";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 원소 4바이트 64개 배열 두 개를 더한다(가정).
 * 64 × 4 = 256바이트, 256 × 2 = 512바이트 읽기, 512 + 256 = 768바이트, 세로 한 줄마다 덧셈 1번 → 64번.
 */
const ROWS = ["입력 A", "입력 B", "결과"] as const;

const SCENES = [
  { label: "배열 하나", summary: "64 × 4 = 256바이트", shown: [true, false, false], note: "칸 하나가 4바이트 원소입니다. 64칸이므로 입력 A 하나가 256바이트입니다." },
  { label: "두 입력 읽기", summary: "256 × 2 = 512바이트", shown: [true, true, false], note: "입력 B도 같은 크기라 읽는 데이터는 512바이트입니다." },
  { label: "결과 쓰기", summary: "512 + 256 = 768바이트", shown: [true, true, true], note: "결과 배열 256바이트를 쓰면 유효 데이터는 모두 768바이트입니다." },
  { label: "덧셈 세기", summary: "세로 한 줄 = 덧셈 1번 → 64번", shown: [true, true, true], note: "같은 번호의 A와 B를 더해 같은 번호의 결과에 씁니다. 표시한 세로줄이 이 글에서 따라갈 37번이고, 이런 줄이 64개입니다." },
] as const;

const BYTES = [256, 256, 256];

export default function ByteTotalViz() {
  return (
    <SceneShell
      eyebrow="데이터 양 세기"
      title="768바이트와 덧셈 64번은 어디서 나올까요"
      description="모든 띠의 가로 위치가 같은 번호 0–63을 뜻합니다. 원소 크기와 개수는 이 글에서 놓은 가정입니다."
      ariaLabel="입력 두 개와 결과 하나의 칸을 세어 768바이트와 덧셈 64번을 얻는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const shownRows: readonly boolean[] = scene.shown;
        const total = shownRows.reduce((sum, shown, row) => sum + (shown ? BYTES[row] : 0), 0);
        return (
          <div className="min-w-0 space-y-2">
            {ROWS.map((name, row) => {
              const tone = (id: number): CellTone => {
                if (!scene.shown[row]) return "off";
                if (index === 3 && id === 37) return "hot";
                return row === 2 ? "soft" : "on";
              };
              return (
                <div key={name} className="grid grid-cols-[3.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs">
                  <span className="font-semibold">{name}</span>
                  <CellRow count={64} tone={tone} />
                  <span className="text-right font-mono">{scene.shown[row] ? BYTES[row] : ""}</span>
                </div>
              );
            })}
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-t border-border pt-2 text-xs font-bold">
              <span>합계</span>
              <span className="text-muted-foreground">{index === 3 ? "37번 줄 = A[37] + B[37]" : "바이트"}</span>
              <span className="text-right font-mono">{total}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
