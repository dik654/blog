import PlaneBoundary, { type PlaneLine, type PlanePoint } from "./PlaneBoundary";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multilayer — 은닉 뉴런 h₁=NAND(x), h₂=OR(x)가 XOR 네 점을 새 좌표로 옮기면 출력층 AND 하나로 가를 수 있다.
 * (0,0)→(1,0), (0,1)→(1,1), (1,0)→(1,1), (1,1)→(0,1). AND 0.5h₁+0.5h₂−0.7: (1,1)만 z=0.3>0.
 */
const INPUT_POINTS: readonly PlanePoint[] = [
  { x: 0, y: 0, target: 0, tag: "(0,0)", tagSide: "below" },
  { x: 1, y: 0, target: 1, tag: "(1,0)", tagSide: "below" },
  { x: 0, y: 1, target: 1, tag: "(0,1)" },
  { x: 1, y: 1, target: 0, tag: "(1,1)" },
];

const HIDDEN_POINTS: readonly PlanePoint[] = [
  { x: 1, y: 0, target: 0, tag: "(0,0)", tagSide: "below" },
  { x: 1, y: 1, target: 1, tag: "(0,1),(1,0)" },
  { x: 0, y: 1, target: 0, tag: "(1,1)" },
];

const AND_LINE: PlaneLine = { w1: 0.5, w2: 0.5, b: -0.7 };

interface Scene {
  label: string;
  summary: string;
  hidden: boolean;
  split: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "원래 입력 평면",
    summary: "정답 1인 두 점이 대각선 양 끝",
    hidden: false,
    split: false,
    note: "채운 점이 XOR 정답 1, 빈 점이 정답 0입니다. 1인 두 점과 0인 두 점이 서로 엇갈린 대각선에 놓여, 직선 하나로는 1인 두 점만 한쪽에 모을 수 없습니다.",
  },
  {
    label: "은닉층이 새 좌표를 만듭니다",
    summary: "(0,1)과 (1,0)이 같은 점 (1,1)로",
    hidden: true,
    split: false,
    note: "(가정) 두 은닉 뉴런이 NAND와 OR을 그대로 계산한다고 둡니다. 입력마다 (NAND 출력, OR 출력)을 새 좌표로 삼으면 정답 1인 두 입력이 같은 점 (1,1)에 겹칩니다.",
  },
  {
    label: "새 좌표에서는 직선 하나",
    summary: "출력층 AND: 0.5h₁+0.5h₂−0.7",
    hidden: true,
    split: true,
    note: "(가정) 출력층에 5절의 AND 값을 쓰면 경계 h₁+h₂=1.4 하나가 (1,1)만 1 쪽에 둡니다. 원래 평면에서 불가능했던 분리가 새 좌표에서는 됩니다.",
  },
];

export default function HiddenSpaceViz() {
  return (
    <SceneShell
      eyebrow="중간 표현"
      title="은닉층이 XOR 네 점을 새 좌표로 옮기면 직선 하나로 갈립니다"
      description="왼쪽은 입력 (x₁, x₂) 평면, 오른쪽은 두 은닉 뉴런의 출력 (h₁, h₂) 평면입니다. 옅게 칠한 반평면이 출력층이 1로 판정하는 쪽입니다."
      ariaLabel="XOR 입력을 NAND와 OR 은닉 좌표로 옮긴 뒤 AND로 분리하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="mx-auto grid max-w-[560px] grid-cols-2 gap-3">
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">입력 평면</p>
                <svg viewBox="0 0 172 186" className="mt-1 h-auto w-full" role="img" aria-label="XOR 네 입력의 원래 위치">
                  <PlaneBoundary left={8} top={8} size={156} lo={-0.35} hi={1.35} axisX="x₁" axisY="x₂" line={null} points={INPUT_POINTS} />
                </svg>
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold ${scene.hidden ? "text-foreground" : "text-muted-foreground/60"}`}>은닉 평면</p>
                <svg viewBox="0 0 172 186" className="mt-1 h-auto w-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
                  <PlaneBoundary
                    left={8}
                    top={8}
                    size={156}
                    lo={-0.35}
                    hi={1.35}
                    axisX="h₁=NAND"
                    axisY="h₂=OR"
                    line={scene.split ? AND_LINE : null}
                    points={scene.hidden ? HIDDEN_POINTS : []}
                  />
                </svg>
              </div>
            </div>
            <p className="mx-auto mt-2 max-w-[560px] text-xs text-muted-foreground">
              오른쪽 점 옆 글자 = 그 점으로 옮겨 온 원래 입력
            </p>
          </div>
        );
      }}
    />
  );
}
