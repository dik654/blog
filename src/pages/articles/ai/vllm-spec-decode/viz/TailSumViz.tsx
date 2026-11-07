import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #acceptance-tail — 칸은 "그 위치까지 전부 수락"의 표시 I_i다.
 * 수락 길이 0·2·4인 세 바퀴: 가로 합 평균 = 세로 비율 합 = 2.
 * K=2에서 각 사건 .5: 항상 함께면 .5+.5, 독립이면 .5+.25.
 */
interface Scene extends ShellScene {
  rowName: string;
  rows: readonly (readonly number[])[];
  showRows: boolean;
  columns: readonly string[] | null;
  total: string | null;
}

const THREE = [[0, 0, 0, 0], [1, 1, 0, 0], [1, 1, 1, 1]];
const TOGETHER = [[1, 1], [1, 1], [0, 0], [0, 0]];
const INDEPENDENT = [[1, 1], [1, 0], [0, 0], [0, 0]];

const SCENES: readonly Scene[] = [
  { label: "세 바퀴의 표시", summary: "수락 길이 0 · 2 · 4 (가정)", rowName: "바퀴", rows: THREE, showRows: false, columns: null, total: null, note: "칸은 그 위치까지 전부 수락했을 때 칠합니다. 길이가 2인 바퀴는 첫 두 칸만 칠해집니다. 첫 거부 뒤의 칸은 칠할 수 없으므로 언제나 왼쪽부터 연속으로 칠해집니다." },
  { label: "가로로 먼저 더하기", summary: "(0 + 2 + 4) ÷ 3 = 2", rowName: "바퀴", rows: THREE, showRows: true, columns: null, total: "평균 수락 길이 2", note: "바퀴마다 칠한 칸을 세면 그 바퀴의 수락 길이이고, 세 값을 평균하면 2입니다." },
  { label: "세로로 먼저 더하기", summary: "2/3 + 2/3 + 1/3 + 1/3 = 2", rowName: "바퀴", rows: THREE, showRows: false, columns: ["2/3", "2/3", "1/3", "1/3"], total: "평균 수락 길이 2", note: "같은 칸을 세로로 세면 위치별 비율이 나옵니다. 칠한 칸 6개를 세는 순서만 바꿨으므로 값이 같고, 그래서 위치 사이의 독립을 가정하지 않아도 성립합니다." },
  { label: "교체·보너스 1을 더하기", summary: "2 + 1 = 3", rowName: "바퀴", rows: THREE, showRows: true, columns: ["2/3", "2/3", "1/3", "1/3"], total: "평균 검증 출력 3", note: "교체 토큰이나 보너스는 어느 바퀴든 하나씩 붙습니다. 평균 수락은 2, 평균 검증 출력은 3입니다. 두 지표의 이름을 섞지 않습니다." },
  { label: "K=2 · 항상 함께", summary: "1 + .5 + .5 = 2", rowName: "경우", rows: TOGETHER, showRows: false, columns: [".5", ".5"], total: "평균 확정 2", note: "두 위치의 수락이 각각 절반이고 항상 함께 일어나는 경우입니다. 같은 비중의 네 경우로 나열했습니다(가정). 둘째까지 수락할 확률은 .5입니다." },
  { label: "K=2 · 독립", summary: "1 + .5 + .25 = 1.75", rowName: "경우", rows: INDEPENDENT, showRows: false, columns: [".5", ".25"], total: "평균 확정 1.75", note: "개별 수락 확률은 앞 장면과 같은 절반인데 독립이면 둘째까지 수락할 확률이 .25입니다. 그래서 개별 평균 하나만 보고 연속 수락의 꼬리까지 정할 수 없습니다." },
];

function Matrix({ scene }: { scene: Scene }) {
  const width = scene.rows[0].length;
  const template = { gridTemplateColumns: `3.2rem repeat(${width}, minmax(0, 3.25rem)) 3rem` };
  return (
    <div className="min-w-0">
      <div className="grid items-center gap-1 text-center text-[11px] font-bold text-muted-foreground" style={template}>
        <span />
        {scene.rows[0].map((_, column) => <span key={column}>{column + 1}까지</span>)}
        <span>{scene.showRows ? "합" : ""}</span>
      </div>
      <div className="mt-1 space-y-1">
        {scene.rows.map((row, index) => (
          <div key={index} className="grid items-center gap-1" style={template}>
            <span className="text-xs font-bold">{scene.rowName} {index + 1}</span>
            {row.map((cell, column) => (
              <span key={column} className={`flex h-8 items-center justify-center rounded-md border font-mono text-xs font-bold ${cell ? "border-[#2563eb] bg-[#2563eb]/20" : "border-dashed border-border text-muted-foreground"}`}>
                {cell}
              </span>
            ))}
            <span className="text-center font-mono text-sm font-bold text-[#2563eb]">
              {scene.showRows ? row.reduce<number>((sum, cell) => sum + cell, 0) : ""}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 grid min-h-7 items-center gap-1 text-center font-mono text-xs font-bold text-[#d97706]" style={template}>
        <span className="text-left font-sans text-[11px] text-muted-foreground">{scene.columns ? "비율" : ""}</span>
        {scene.rows[0].map((_, column) => <span key={column}>{scene.columns?.[column] ?? ""}</span>)}
        <span />
      </div>
      <p className="mt-2 min-h-6 border-t border-border pt-2 text-sm font-bold tabular-nums">{scene.total ?? " "}</p>
    </div>
  );
}

export default function TailSumViz() {
  return (
    <SceneShell
      eyebrow="꼬리 확률"
      title="가로로 세든 세로로 세든 같은 칸을 셉니다"
      description="가로줄은 한 바퀴, 세로줄은 위치입니다. 값 1은 그 위치까지 후보가 전부 수락됐다는 표시입니다."
      ariaLabel="수락 표시 칸을 가로와 세로로 더해 평균 수락 길이를 구하는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene) => <Matrix key={scene.label} scene={scene} />)} />
      )}
    />
  );
}
