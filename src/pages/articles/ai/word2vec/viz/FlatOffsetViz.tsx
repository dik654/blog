import SceneShell from "./SceneShell";
import { U_TABLE, W_TABLE } from "./sampleTables";

/**
 * 본문 대응: #source-pair — C 원문은 표를 한 줄 배열로 두고 번호 × 행 길이로 행의 시작을 찾는다.
 * 입력 행 시작 3×3=9 → W[3]=[0,1,1], 출력 행 시작 2×3=6 → U[2]=[2,0,1], 점수 1.
 */
const LENGTH = 3;

const SCENES = [
  { label: "5행 표가 한 줄로 이어집니다", summary: "행마다 3칸 · 모두 15칸", input: -1, output: -1, note: "행이 3칸씩 바로 이어져 번호 × 행 길이가 그 행의 시작 칸입니다. 행 길이 layer1_size는 가정한 3입니다." },
  { label: "입력 행: 이웃 saw", summary: "l1 = 3 × 3 = 9", input: 3, output: -1, note: "l1 = last_word * layer1_size입니다. 이웃 saw의 번호 3이라 9번 칸부터 W[3] = [0, 1, 1]을 읽습니다." },
  { label: "출력 행: 현재 단어 cat", summary: "2 × 3 = 6", input: 3, output: 2, note: "target = word라 양의 예측 대상은 cat입니다. 번호 2라 6번 칸부터 U[2] = [2, 0, 1]을 읽습니다." },
  { label: "두 조각을 곱해 더합니다", summary: "0×2 + 1×0 + 1×1 = 1", input: 3, output: 2, note: "이 소스의 현재 쌍 점수는 1입니다. 논문 방향 cat→saw의 점수 2라고 적으면 잘못된 추적이 됩니다." },
] as const;

function FlatArray({ name, rows, picked }: { name: string; rows: readonly (readonly number[])[]; picked: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{name}</p>
      <div className="grid gap-x-1" style={{ gridTemplateColumns: `repeat(${rows.length}, minmax(0, 1fr))` }}>
        {rows.map((row, rowIndex) => {
          const on = rowIndex === picked;
          return (
            <div key={rowIndex} className="min-w-0">
              <div className="grid grid-cols-3 text-center font-mono text-[10px] text-muted-foreground">
                {row.map((_, column) => (
                  <span key={column}>{rowIndex * LENGTH + column}</span>
                ))}
              </div>
              <div className="grid grid-cols-3 rounded-sm border text-center font-mono text-xs" style={{ borderColor: on ? "#2563eb" : "#94a3b8", backgroundColor: on ? "#2563eb" : "transparent", color: on ? "#ffffff" : undefined, fontWeight: on ? 700 : 400 }}>
                {row.map((value, column) => (
                  <span key={column} className="py-1.5">{value}</span>
                ))}
              </div>
              <p className="mt-0.5 text-center text-[10px] text-muted-foreground">번호 {rowIndex}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FlatOffsetViz() {
  return (
    <SceneShell
      eyebrow="번호 × 행 길이"
      title="원문은 한 줄 배열에서 행의 시작 칸을 계산합니다"
      description="위 숫자는 칸 번호, 네모 안 숫자는 값입니다. 이 경로의 syn0를 W, syn1neg를 U에 대응시킵니다."
      note="3절의 가정한 표를 원문 점수식에 대입한 계산이며 학습을 켠 실행이 아닙니다."
      ariaLabel="한 줄 배열에서 번호와 행 길이로 입력 행과 출력 행을 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <FlatArray name="syn0 (W)" rows={W_TABLE} picked={scene.input} />
            <FlatArray name="syn1neg (U)" rows={U_TABLE} picked={scene.output} />
          </div>
        );
      }}
    />
  );
}
