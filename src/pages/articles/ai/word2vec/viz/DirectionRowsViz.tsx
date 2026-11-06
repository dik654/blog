import SceneShell from "./SceneShell";
import { U_TABLE, W_TABLE, WORDS } from "./sampleTables";

/**
 * 본문 대응: #dual-tables — 입력 번호는 W에서, 대상 번호는 U에서 읽는다.
 * cat→saw: W[2]·U[3] = 1×0+2×1+0×2 = 2. saw→cat: W[3]·U[2] = 0×2+1×0+1×1 = 1.
 */
const SCENES = [
  { label: "같은 번호, 다른 값", summary: "W[2] ≠ U[2]", w: 2, u: 2, sum: "cat 두 행: [1, 2, 0]과 [2, 0, 1]", note: "이 가정한 표에서 번호 2의 값은 표마다 다릅니다. 두 표는 따로 바뀔 수 있다는 뜻이라 번호 0처럼 우연히 같을 수도 있습니다. 다만 한 쌍을 계산할 때 이 두 행을 함께 읽는 것은 아닙니다." },
  { label: "cat이 입력, saw가 대상", summary: "W[2] · U[3] = 2", w: 2, u: 3, sum: "1×0 + 2×1 + 0×2 = 2", note: "입력 cat은 왼쪽 표에서, 대상 saw는 오른쪽 표에서 읽습니다. W[2]와 U[2]를 모두 읽는 것이 아닙니다." },
  { label: "역할을 바꾸면", summary: "W[3] · U[2] = 1", w: 3, u: 2, sum: "0×2 + 1×0 + 1×1 = 1", note: "역할을 바꾸면 다른 두 행을 읽어 점수가 1이 됩니다. 입력과 예측 방향을 기록해야 계산을 재현할 수 있습니다." },
] as const;

function Table({ title, rows, picked }: { title: string; rows: readonly (readonly number[])[]; picked: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-xs font-semibold text-muted-foreground">{title}</p>
      <div className="space-y-0.5 font-mono text-xs">
        {rows.map((row, index) => {
          const on = index === picked;
          return (
            <div key={WORDS[index]} className="grid grid-cols-[minmax(0,1fr)_repeat(3,1.4rem)] items-center rounded-sm border py-1 pl-1" style={{ borderColor: on ? "#2563eb" : "transparent", backgroundColor: on ? "#2563eb22" : "transparent", fontWeight: on ? 700 : 400 }}>
              <span className="min-w-0 truncate">{index} {WORDS[index]}</span>
              {row.map((value, column) => (
                <span key={column} className="text-center">{value}</span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DirectionRowsViz() {
  return (
    <SceneShell
      eyebrow="표 두 장, 행 두 줄"
      title="입력 번호는 왼쪽 표에서, 대상 번호는 오른쪽 표에서 읽습니다"
      description="왼쪽 W는 입력 역할, 오른쪽 U는 맞혀야 할 대상 역할의 표입니다. 테두리 행을 읽습니다."
      note="표의 값은 3절의 가정이며 학습 결과가 아닙니다. 점수는 두 행을 조합한 값이고 확률로 바꾼 값이 아닙니다."
      ariaLabel="두 표에서 입력과 대상 번호로 행을 읽고 점수를 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <Table title="W · 입력 역할" rows={W_TABLE} picked={scene.w} />
              <Table title="U · 대상 역할" rows={U_TABLE} picked={scene.u} />
            </div>
            <p className="mt-3 text-center font-mono text-sm font-bold">{scene.sum}</p>
          </div>
        );
      }}
    />
  );
}
