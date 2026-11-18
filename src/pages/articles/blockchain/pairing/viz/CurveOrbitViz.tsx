import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — y²=x³+x를 19로 나눈 곡선의 유한 점 19개와 O.
 * P=(5,4) → 2P=(9,15) → 3P=(9,4) → 4P=(5,15) → 5P=O. 점 목록은 0≤x,y≤18을 모두 대입해 계산했습니다.
 */
const POINTS: ReadonlyArray<readonly [number, number]> = [
  [0, 0], [3, 7], [3, 12], [4, 7], [4, 12], [5, 4], [5, 15], [8, 8], [8, 11], [9, 4],
  [9, 15], [12, 7], [12, 12], [13, 5], [13, 14], [17, 3], [17, 16], [18, 6], [18, 13],
];
const ORBIT: ReadonlyArray<{ name: string; x: number; y: number }> = [
  { name: "P", x: 5, y: 4 },
  { name: "2P", x: 9, y: 15 },
  { name: "3P", x: 9, y: 4 },
  { name: "4P", x: 5, y: 15 },
];

const SCENES = [
  { label: "곡선 위의 점", summary: "유한 점 19개 + O = 20개", shown: 0, note: "19로 나눈 나머지 세계에서는 곡선이 이어진 선이 아니라 흩어진 점입니다. x와 y에 0부터 18까지 넣어 y²=x³+x가 맞는 칸만 찍으면 19개이고, 좌표가 없는 항등원 O를 더해 20개입니다." },
  { label: "처음 점 P", summary: "P=(5,4): 16 = 130 mod 19", shown: 1, note: "P=(5,4)를 넣으면 왼쪽 4²=16, 오른쪽 5³+5=130이고 130을 19로 나눈 나머지도 16입니다. 그래서 P는 곡선의 점입니다." },
  { label: "P를 거듭 더하기", summary: "P → 2P → 3P → 4P", shown: 4, note: "P를 한 번씩 더할 때마다 다른 점으로 옮겨 갑니다. 점선은 더한 순서만 이은 표시이며 곡선 위의 선분이 아닙니다." },
  { label: "다섯 번째에 O", summary: "5P = O → 위수 5", shown: 5, note: "4P=(5,15)에 P=(5,4)를 더하면 x가 같고 y만 반대인 두 점이라 합이 O입니다. 다섯 번 더해 처음으로 O에 돌아오므로 P의 위수는 5입니다." },
] as const;

const W = 360;
const H = 270;
const L = 34;
const T = 18;
const CELL = 13;
const gx = (x: number) => L + x * CELL;
const gy = (y: number) => T + (18 - y) * CELL;
const O_X = 316;
const O_Y = 130;

export default function CurveOrbitViz() {
  return (
    <SceneShell
      eyebrow="19로 나눈 곡선"
      title="P를 다섯 번 더하면 항등원 O로 돌아옵니다"
      description="가로는 x, 세로는 y이며 둘 다 19로 나눈 나머지 0~18입니다. O는 점 덧셈의 항등원으로, 좌표가 없어 격자 밖에 따로 그렸습니다."
      ariaLabel="y²=x³+x mod 19의 점 20개와 P의 다섯 번 반복"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        const path = ORBIT.slice(0, Math.min(shown, 4));
        const reachedO = shown === 5;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: 19 }, (_, i) => (
              <g key={i}>
                <line x1={gx(i)} x2={gx(i)} y1={gy(18)} y2={gy(0)} stroke="#e2e8f0" strokeWidth={0.6} />
                <line x1={gx(0)} x2={gx(18)} y1={gy(i)} y2={gy(i)} stroke="#e2e8f0" strokeWidth={0.6} />
              </g>
            ))}
            {[0, 5, 9, 18].map((v) => (
              <text key={`x${v}`} x={gx(v)} y={gy(0) + 14} textAnchor="middle" fontSize={10} fill="#64748b">{v}</text>
            ))}
            {[0, 4, 15, 18].map((v) => (
              <text key={`y${v}`} x={L - 8} y={gy(v) + 3} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
            ))}
            {POINTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={gx(x)} cy={gy(y)} r={3.2} fill="#94a3b8" />
            ))}
            <rect x={O_X - 26} y={O_Y - 16} width={52} height={32} rx={8} fill={reachedO ? "#dbeafe" : "#ffffff"} stroke={reachedO ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
            <text x={O_X} y={O_Y + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={reachedO ? "#1d4ed8" : "#475569"}>O</text>
            {path.slice(1).map((pt, i) => (
              <line key={pt.name} x1={gx(path[i].x)} y1={gy(path[i].y)} x2={gx(pt.x)} y2={gy(pt.y)} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            ))}
            {reachedO && <line x1={gx(5)} y1={gy(15)} x2={O_X - 26} y2={O_Y} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />}
            {path.map((pt) => (
              <g key={pt.name}>
                <circle cx={gx(pt.x)} cy={gy(pt.y)} r={5} fill="#2563eb" />
                <text x={gx(pt.x) + 8} y={gy(pt.y) - 6} fontSize={11} fontWeight={700} fill="#1d4ed8">{pt.name}</text>
              </g>
            ))}
            {reachedO && <text x={O_X} y={O_Y + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">5P</text>}
          </svg>
        );
      }}
    />
  );
}
