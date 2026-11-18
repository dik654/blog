import SceneShell from "./SceneShell";

/**
 * 본문 대응: #compatibility — x≡0 (mod 2)와 x≡1 (mod 4)는 만나지 않고,
 * x≡2 (mod 6)와 x≡5 (mod 9)는 14, 32, 50에서 만나 18마다 반복한다(곱 54가 아님).
 * 같은 0~54 축 위에 두 조건의 수를 점으로 찍는다.
 */
const W = 360;
const LEFT = 16;
const RIGHT = W - 16;
const MAX = 54;
const px = (v: number) => LEFT + (v / MAX) * (RIGHT - LEFT);
const ROW_A = 44;
const ROW_B = 92;
const AXIS_Y = 120;

const hits = (m: number, r: number) => Array.from({ length: MAX }, (_, i) => i).filter((x) => x % m === r);

const PAIRS = [
  { a: { m: 2, r: 0 }, b: { m: 4, r: 1 } },
  { a: { m: 6, r: 2 }, b: { m: 9, r: 5 } },
] as const;

const SCENES = [
  {
    label: "2와 4: 만나지 않음",
    summary: "짝수 ↔ 홀수",
    pair: 0,
    showMeet: false,
    note: "÷2 나머지 0은 짝수만, ÷4 나머지 1은 홀수만 고릅니다. 두 기준의 최대공약수 2로 보면 기록이 0과 1로 달라서 어디서도 겹치지 않습니다.",
  },
  {
    label: "6과 9: 공약수 3에서 먼저 확인",
    summary: "2 mod 3 = 5 mod 3 = 2",
    pair: 1,
    showMeet: false,
    note: "두 기준의 최대공약수 3으로 다시 나누면 2와 5의 나머지가 모두 2입니다. 기록이 같으니 두 조건을 함께 만족하는 수가 있을 수 있습니다.",
  },
  {
    label: "교점은 18마다",
    summary: "14, 32, 50 → 14 + 18j",
    pair: 1,
    showMeet: true,
    note: "두 줄은 14, 32, 50에서 만나고 간격은 18입니다. 18은 6과 9가 함께 나누는 가장 작은 수(최소공배수)이며, 곱 54 안에 교점이 세 번 들어갑니다.",
  },
] as const;

export default function CompatibilityViz() {
  return (
    <SceneShell
      eyebrow="서로소가 아닐 때"
      title="두 조건이 만나는지와 얼마마다 만나는지를 봅니다"
      description="가로축은 0부터 53까지의 정수입니다. 위 줄과 아래 줄의 점은 각 조건을 만족하는 수이고, 세로선이 두 줄이 겹치는 수입니다. 10절의 예 2·4와 6·9를 그대로 씁니다."
      ariaLabel="2와 4의 조건은 겹치지 않고, 6과 9의 조건은 14, 32, 50에서 18 간격으로 겹침"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { a, b } = PAIRS[scene.pair];
        const listA = hits(a.m, a.r);
        const listB = hits(b.m, b.r);
        const meet = listA.filter((x) => listB.includes(x));
        return (
          <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={ROW_A - 14} fontSize={13} fill="#2563eb" fontWeight={700}>÷{a.m} 나머지 {a.r}</text>
            <text x={LEFT} y={ROW_B - 14} fontSize={13} fill="#d97706" fontWeight={700}>÷{b.m} 나머지 {b.r}</text>
            <line x1={LEFT} x2={RIGHT} y1={ROW_A} y2={ROW_A} stroke="#e2e8f0" strokeWidth={1} />
            <line x1={LEFT} x2={RIGHT} y1={ROW_B} y2={ROW_B} stroke="#e2e8f0" strokeWidth={1} />
            {scene.showMeet &&
              meet.map((x) => (
                <line key={`m${x}`} x1={px(x)} x2={px(x)} y1={ROW_A} y2={AXIS_Y} stroke="#16a34a" strokeWidth={1.25} />
              ))}
            {listA.map((x) => (
              <circle key={`a${x}`} cx={px(x)} cy={ROW_A} r={3} fill="#2563eb" />
            ))}
            {listB.map((x) => (
              <rect key={`b${x}`} x={px(x) - 3} y={ROW_B - 3} width={6} height={6} fill="#d97706" />
            ))}
            <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {(scene.showMeet ? [0, ...meet] : [0, 18, 36]).map((t) => (
              <text
                key={`t${t}`}
                x={px(t)}
                y={AXIS_Y + 18}
                textAnchor="middle"
                fontSize={13}
                fontWeight={scene.showMeet && t !== 0 ? 700 : 400}
                fill={scene.showMeet && t !== 0 ? "#16a34a" : "#64748b"}
              >
                {t}
              </text>
            ))}
            {scene.showMeet &&
              meet.slice(1).map((x, i) => (
                <text key={`g${x}`} x={(px(meet[i]) + px(x)) / 2} y={AXIS_Y - 6} textAnchor="middle" fontSize={12} fill="#16a34a">
                  +{x - meet[i]}
                </text>
              ))}
          </svg>
        );
      }}
    />
  );
}
