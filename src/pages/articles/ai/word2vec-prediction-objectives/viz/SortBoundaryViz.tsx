import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-tree-boundary — 원본 CreateBinaryTree를 [1,8,4,2,1]로 손으로 따라갑니다.
 * 잎 목록은 뒤에서, 부모 목록은 앞에서 읽습니다.
 * 1(번호 4)+2(번호 3)=3 → 3+4(번호 2)=7 → 7+8(번호 1)=15 → 1(번호 0)+15=16.
 * 길이 [1,2,3,4,4], 가중합 1·1+8·2+4·3+2·4+1·4 = 41. 같은 빈도 묶음의 최적값 30.
 */
const LEAVES = [1, 8, 4, 2, 1];
const LENGTHS = [1, 2, 3, 4, 4];
const AMBER = "#d97706";
const BLUE = "#2563eb";
const RED = "#dc2626";

const SCENES = [
  { label: "끝만 읽습니다", summary: "잎은 뒤에서, 부모는 앞에서", usedLeaves: [] as number[], pick: [] as string[], parents: [] as number[], usedParents: 0, note: "원본은 전체를 뒤지지 않고 잎 목록의 뒤쪽 끝과 부모 목록의 앞쪽 끝만 비교합니다. 잎이 큰 순서로 정렬돼 있어야 끝이 곧 최솟값입니다. 이 배열은 번호 0의 1이 맨 앞에 있어 그 전제가 깨집니다." },
  { label: "첫 합치기", summary: "1 + 2 = 3", usedLeaves: [4, 3], pick: ["L4", "L3"], parents: [3], usedParents: 0, note: "번호 4의 1 다음으로 번호 3의 2를 꺼냅니다. 전체에서 두 번째로 작은 값은 번호 0의 1인데 이 칸은 비교 대상에 없었습니다." },
  { label: "둘째 합치기", summary: "3 + 4 = 7", usedLeaves: [4, 3, 2], pick: ["P0", "L2"], parents: [3, 7], usedParents: 1, note: "잎의 끝 4보다 부모의 3이 작아 3을 먼저 꺼내고, 다음은 잎의 4를 꺼냅니다." },
  { label: "셋째 합치기", summary: "7 + 8 = 15", usedLeaves: [4, 3, 2, 1], pick: ["P1", "L1"], parents: [3, 7, 15], usedParents: 2, note: "같은 방식으로 부모의 7과 잎의 8을 합칩니다. 번호 0의 1은 아직도 차례가 오지 않았습니다." },
  { label: "마지막에야 1을 읽습니다", summary: "1 + 15 = 16", usedLeaves: [4, 3, 2, 1, 0], pick: ["L0", "P2"], parents: [3, 7, 15, 16], usedParents: 3, note: "가장 작은 값 중 하나가 마지막 합치기에서 쓰입니다. 그래서 그 단어는 길이 1을 받고, 빈도 8인 단어가 길이 2를 받습니다." },
  { label: "결과 비교", summary: "41 vs 30", usedLeaves: [4, 3, 2, 1, 0], pick: [] as string[], parents: [3, 7, 15, 16], usedParents: 4, note: "길이 [1,2,3,4,4]를 이 빈도에 곱하면 1+16+12+8+4 = 41입니다. 동일한 빈도 묶음을 최소 우선순위 방식으로 병합하면 30입니다. Huffman의 증명이 틀린 것이 아니라 이 입력의 구현이 최소 둘을 고르는 조건을 충족하지 않았습니다." },
];

function Cell({ value, sub, used, picked, empty = false }: { value: string; sub: string; used: boolean; picked: boolean; empty?: boolean }) {
  return (
    <div className={`min-w-0 rounded-md border py-1.5 text-center ${empty ? "border-dashed border-border/60" : ""} ${used && !picked ? "opacity-35" : ""}`} style={picked ? { borderColor: AMBER, backgroundColor: "#d9770622" } : undefined}>
      <span className={`block font-mono text-sm font-bold ${used && !picked ? "line-through" : ""}`}>{value || " "}</span>
      <span className="block text-[11px] leading-4 text-muted-foreground">{sub || " "}</span>
    </div>
  );
}

export default function SortBoundaryViz() {
  return (
    <SceneShell
      eyebrow="정렬 전제가 깨질 때"
      title="빈도 [1,8,4,2,1]에서 맨 앞의 1은 마지막까지 읽히지 않습니다"
      description="위 줄이 번호 순서의 잎 빈도(가정), 아래 줄이 합쳐서 만든 부모입니다. 주황 칸이 이번에 합치는 둘이고 지운 칸은 이미 쓴 값입니다. 문장 끝 번호 0은 정렬에서 빠져 맨 앞에 남습니다."
      ariaLabel="잎과 부모 목록의 끝만 비교해 합치는 과정과 가중합 41을 보여 주는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const last = active === 5;
        return (
          <div className="min-w-0 space-y-3" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">잎 목록 ← 뒤에서 읽음</p>
              <div className="grid grid-cols-5 gap-1.5">
                {LEAVES.map((value, i) => (
                  <Cell key={i} value={String(value)} sub={last ? `길이 ${LENGTHS[i]}` : `번호 ${i}`} used={!last && scene.usedLeaves.includes(i)} picked={scene.pick.includes(`L${i}`)} />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-xs font-bold text-muted-foreground">부모 목록 → 앞에서 읽음</p>
              <div className="grid grid-cols-4 gap-1.5">
                {[0, 1, 2, 3].map((i) => {
                  const value = scene.parents[i];
                  const isNew = !last && i === scene.parents.length - 1;
                  return <Cell key={i} value={value === undefined ? "" : String(value)} sub={isNew ? "새 부모" : ""} used={!last && value !== undefined && i < scene.usedParents} picked={scene.pick.includes(`P${i}`)} empty={value === undefined} />;
                })}
              </div>
            </div>
            <div className={`space-y-1.5 ${last ? "" : "invisible"}`}>
              {[{ name: "원본 함수", value: 41, color: RED }, { name: "최소 둘 병합", value: 30, color: BLUE }].map((row) => (
                <div key={row.name} className="grid grid-cols-[5rem_minmax(0,1fr)_1.5rem] items-center gap-2 text-xs sm:text-sm">
                  <span>{row.name}</span>
                  <div className="h-3.5 min-w-0 rounded-sm bg-muted/40"><div className="h-full rounded-sm" style={{ width: `${(row.value / 41) * 100}%`, backgroundColor: row.color }} /></div>
                  <span className="text-right font-mono font-bold">{last ? row.value : ""}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
