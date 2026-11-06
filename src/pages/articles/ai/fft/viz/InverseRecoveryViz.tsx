import SceneShell from "./SceneShell";
import VectorPath from "./VectorPath";

/**
 * 본문 대응: #case — 네 출력을 위 방향으로 돌려 더하면 입력 하나만 남습니다.
 * 가로 합 4, 8, 12, 16 ÷ 4 = 1, 2, 3, 4. 세로를 버리면 둘째 입력의 가로 합은 12, 결과는 3입니다.
 */
const SCENES: { label: string; summary: string; note: string; rotated: [number, number][]; end: string; turn: string }[] = [
  { label: "첫 입력", summary: "가로 4 ÷ 4 = 1", turn: "돌리지 않음", rotated: [[10, 0], [-2, 2], [-2, 0], [-2, -2]], end: "(4, 0)", note: "세로는 0+2+0−2=0으로 상쇄되고 가로 4가 남습니다. 첫 입력만 네 번 모인 값이라 4로 나누면 1입니다." },
  { label: "둘째 입력", summary: "가로 8 ÷ 4 = 2", turn: "한 칸에 위로 90도", rotated: [[10, 0], [-2, -2], [2, 0], [-2, 2]], end: "(8, 0)", note: "출력의 순서가 한 칸 늘 때마다 위 방향으로 90도씩 돌립니다. 둘째 출력은 (−2,−2), 셋째는 (2,0), 넷째는 (−2,2)가 됩니다." },
  { label: "셋째 입력", summary: "가로 12 ÷ 4 = 3", turn: "한 칸에 반 바퀴", rotated: [[10, 0], [2, -2], [-2, 0], [2, 2]], end: "(12, 0)", note: "한 칸마다 반 바퀴 돌려 더하면 세로가 상쇄되고 가로 12가 남습니다." },
  { label: "넷째 입력", summary: "가로 16 ÷ 4 = 4", turn: "한 칸에 위로 270도", rotated: [[10, 0], [2, 2], [2, 0], [2, -2]], end: "(16, 0)", note: "가로 16이 남습니다. 네 입력 모두 한 출력이 아니라 네 출력을 함께 써서 얻었습니다." },
  { label: "세로를 버리면", summary: "가로 12 ÷ 4 = 3 (2가 아님)", turn: "둘째 입력을 다시 계산", rotated: [[10, 0], [0, -2], [2, 0], [0, 2]], end: "(12, 0)", note: "출력의 세로 성분을 지우면 둘째·넷째 출력에서 회전 후 생겨야 할 가로 −2가 0이 됩니다. 합이 8이 아니라 12가 되어 답이 틀립니다." },
];

const signed = (value: number) => (value < 0 ? `−${Math.abs(value)}` : String(value));

export default function InverseRecoveryViz() {
  return (
    <SceneShell
      eyebrow="되돌리기"
      title="네 출력을 돌려 이으면 입력 하나만 남습니다"
      description="화살표 넷은 돌린 뒤의 네 출력입니다. 세로는 상쇄되어 끝점이 가로축으로 돌아오고, 그 가로 합을 출력 개수 4로 나눕니다."
      ariaLabel="네 출력을 돌려 더해 원래 입력을 복원하는 경로"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps = scene.rotated.map(([dx, dy], index) => ({ dx, dy, label: `${index + 1}` }));
        return (
          <div className="min-w-0">
            <VectorPath steps={steps} width={360} height={150} originX={18} originY={72} unit={19} endLabel={scene.end} endBelow={active === 0 || active === 3} ariaLabel={`${scene.label}: ${scene.summary}`} />
            <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">{scene.turn}</p>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs leading-5">
              {scene.rotated.map(([x, y], index) => (
                <div key={index} className="rounded-lg border border-border bg-background px-1 py-1.5">
                  <span className="block text-muted-foreground">출력 {index + 1}</span>
                  <span className="block font-mono font-semibold">({signed(x)},{signed(y)})</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
