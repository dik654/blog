import SceneShell from "./SceneShell";
import { Arrow } from "./VectorPath";

/**
 * 본문 대응: #why — 두 칸 떨어진 출력에서 짝수 위치의 방향은 그대로, 홀수 위치만 반대입니다.
 * 입력을 5, 2, 3, 7로 바꾼 장면은 (가정)이며 5−2+3−7=−1, (5+3)−(2+7)=−1로 검산했습니다.
 */
type Way = [number, number];
const R: Way = [1, 0];
const L: Way = [-1, 0];
const D: Way = [0, 1];
const U: Way = [0, -1];

const SCENES: { label: string; summary: string; note: string; top: Way[]; bottom: Way[]; names: [string, string]; equation: [string, string] }[] = [
  { label: "첫째와 셋째 출력", summary: "4+6=10 · 4−6=−2", names: ["첫째 출력", "셋째 출력"], top: [R, R, R, R], bottom: [R, L, R, L], equation: ["(1+3) + (2+4) = 10", "(1+3) − (2+4) = −2"], note: "위치 0·2의 방향은 같고 위치 1·3만 반대입니다. 그래서 묶음의 합을 다시 구하지 않고 더하기를 빼기로만 바꿉니다." },
  { label: "둘째와 넷째 출력", summary: "같은 두 값을 더하고 빼기", names: ["둘째 출력", "넷째 출력"], top: [R, D, L, U], bottom: [R, U, L, D], equation: ["(1−3) + (돌린 2−4) = (−2, 2)", "(1−3) − (돌린 2−4) = (−2, −2)"], note: "이 쌍에서도 위치 0·2는 그대로이고 위치 1·3만 뒤집힙니다. 묶음의 차 −2를 한 번 돌려 세로 +2로 만들면 더하기와 빼기에 함께 씁니다." },
  { label: "값을 바꿔도", summary: "5, 2, 3, 7 (가정) → 8+9 · 8−9", names: ["첫째 출력", "셋째 출력"], top: [R, R, R, R], bottom: [R, L, R, L], equation: ["(5+3) + (2+7) = 17", "(5+3) − (2+7) = −1"], note: "1을 5로, 4를 7로 바꾸었습니다(가정). 중간 합은 8과 9로 달라져도 방향은 그대로입니다. 절약은 정해진 회전의 주기에서 나옵니다." },
];

const COL_X = [84, 140, 196, 252];
const ROW_Y = [72, 138];

export default function HalfTurnSharingViz() {
  return (
    <SceneShell
      eyebrow="재사용의 이유"
      title="두 칸 떨어진 출력은 홀수 위치의 방향만 뒤집습니다"
      description="칸마다 네 위치의 방향입니다. 연한 파랑이 방향이 그대로인 짝수 위치, 주황이 방향이 반대인 홀수 위치입니다."
      ariaLabel="두 칸 떨어진 출력의 위치별 방향 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 196" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {COL_X.map((x, col) => (
                <g key={col}>
                  <rect x={x - 25} y={30} width={50} height={144} rx={8} fill={col % 2 === 0 ? "#2563eb" : "#d97706"} fillOpacity={0.1} stroke={col % 2 === 0 ? "#2563eb" : "#d97706"} strokeWidth={1} />
                  <text x={x} y={20} textAnchor="middle" fontSize={11} fill="#64748b">위치 {col}</text>
                  <text x={x} y={190} textAnchor="middle" fontSize={11} fontWeight={700} fill={col % 2 === 0 ? "#2563eb" : "#d97706"}>{col % 2 === 0 ? "그대로" : "반대"}</text>
                </g>
              ))}
              {[scene.top, scene.bottom].map((row, rowIndex) => (
                <g key={rowIndex}>
                  <text x={2} y={ROW_Y[rowIndex] + 4} fontSize={10} fontWeight={700} fill="#64748b">{scene.names[rowIndex]}</text>
                  {row.map(([dx, dy], col) => (
                    <Arrow key={col} x1={COL_X[col] - dx * 15} y1={ROW_Y[rowIndex] - dy * 15} x2={COL_X[col] + dx * 15} y2={ROW_Y[rowIndex] + dy * 15} color={col % 2 === 0 ? "#2563eb" : "#d97706"} />
                  ))}
                </g>
              ))}
              <text x={284} y={ROW_Y[0] + 4} fontSize={10} fill="#64748b">더하기</text>
              <text x={284} y={ROW_Y[1] + 4} fontSize={10} fill="#64748b">빼기</text>
            </svg>
            <div className="mt-2 space-y-1 text-center font-mono text-xs leading-5 sm:text-sm">
              <p>{scene.equation[0]}</p>
              <p>{scene.equation[1]}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
