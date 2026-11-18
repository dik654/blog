import SceneShell from "./SceneShell";

/**
 * 본문 대응: #constraints — 폭 3의 라운드 배치와 비선형 곱셈 제약 수.
 * 칸 하나 = 한 라운드의 한 칸, 색칠 = 다섯제곱(S-box) 하나 = 곱셈 제약 3개.
 * 4·56·4 → (8×3+56)×3 = 240, 64라운드 전부 full(가상) → 64×3×3 = 576,
 * 원 논문 예 full 8·partial 57 → (24+57)×3 = 243.
 */
const WIDTH = 3;
const PER_SBOX = 3;
const MAX_ROUNDS = 65;

const SCENES = [
  {
    label: "이 소스의 4·56·4",
    summary: "S-box 80개 × 3 = 240",
    front: 4,
    partial: 56,
    back: 4,
    segments: "앞 full 4 · 가운데 partial 56 · 끝 full 4 = 64라운드",
    note: "앞 4개와 끝 4개 full round는 세 칸을 모두 다섯제곱하고, 가운데 56개 partial round는 첫 칸만 다섯제곱합니다. 색칠한 칸은 8×3=24개와 56개를 더한 80개이고, 하나를 곱셈 제약 3개(u=a×a, v=u×u, y=v×a)로 쓴다고 하면 240개입니다.",
  },
  {
    label: "모두 full이라면 (가상)",
    summary: "S-box 192개 × 3 = 576",
    front: 64,
    partial: 0,
    back: 0,
    segments: "64라운드 전부 full (비용 비교용 가정)",
    note: "같은 64라운드의 모든 칸을 다섯제곱한다고 가정하면 64×3=192개 S-box, 제약 576개입니다. 비용을 설명하는 가상 비교이며 이렇게 고친 설정의 보안을 인정한 것이 아닙니다.",
  },
  {
    label: "원 논문 예 (partial 57)",
    summary: "S-box 81개 × 3 = 243",
    front: 4,
    partial: 57,
    back: 4,
    segments: "full 8 (앞뒤 4개씩은 그림용 가정) · partial 57 = 65라운드",
    note: "2021년 원 논문 표 1의 폭 3 예는 partial round가 57개입니다. full 8개의 24개에 57개를 더한 81개 S-box, 제약 243개입니다. partial round 수가 다르므로 이 비용을 56개짜리 소스에 그대로 옮기지 않습니다.",
  },
] as const;

const CELL = 9;
const STEP = 10;
const ROW_H = 18;
const LEFT = 4;
const TOP = 4;
const GRID_W = LEFT * 2 + MAX_ROUNDS * STEP;
const BAR_Y = TOP + WIDTH * ROW_H + 26;
const H = BAR_Y + 30;
const MAX_CONSTRAINTS = 576;

export default function RoundScheduleCostViz() {
  return (
    <SceneShell
      eyebrow="라운드 배치와 곱셈 제약"
      title="색칠한 칸 수에 3을 곱하면 240·576·243이 나옵니다"
      description="세로 세 줄은 폭 3 상태의 세 칸, 가로 한 칸은 라운드 하나입니다. 파란 칸은 다섯제곱(S-box)을 적용한 곳이고 아래 막대는 비선형 곱셈 제약 수입니다."
      note="손으로 전개한 계산값이며 실제 회로를 컴파일해 잰 숫자가 아닙니다. R1CS는 두 선형 결합의 곱이 다른 선형 결합과 같다는 식으로 제약을 쓰는 형식입니다. 상수 덧셈과 상수배는 그 선형 결합에 들어갈 수 있어 세지 않았습니다. 그렇다고 덧셈·메모리 접근·증명 작성 시간이 0이라는 뜻은 아닙니다."
      ariaLabel="폭 3 Poseidon 라운드 배치별 S-box 수와 곱셈 제약 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rounds = scene.front + scene.partial + scene.back;
        const isFull = (round: number) => round < scene.front || round >= scene.front + scene.partial;
        const sboxes = scene.front * WIDTH + scene.partial + scene.back * WIDTH;
        const constraints = sboxes * PER_SBOX;
        const barMax = GRID_W - LEFT * 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${GRID_W} ${H}`} className="h-auto w-full" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: MAX_ROUNDS }, (_, round) =>
                Array.from({ length: WIDTH }, (_, lane) => {
                  const exists = round < rounds;
                  const sbox = exists && (isFull(round) || lane === 0);
                  return (
                    <rect
                      key={`${round}-${lane}`}
                      x={LEFT + round * STEP}
                      y={TOP + lane * ROW_H}
                      width={CELL}
                      height={ROW_H - 3}
                      rx={1.5}
                      fill={!exists ? "none" : sbox ? "#2563eb" : "#cbd5e1"}
                      stroke={exists ? "none" : "#cbd5e1"}
                      strokeWidth={exists ? 0 : 0.75}
                      strokeDasharray={exists ? undefined : "2 2"}
                      opacity={exists ? 1 : 0.6}
                    />
                  );
                }),
              )}
              <rect x={LEFT} y={BAR_Y} width={barMax} height={18} rx={2} fill="#e2e8f0" />
              <rect x={LEFT} y={BAR_Y} width={(constraints / MAX_CONSTRAINTS) * barMax} height={18} rx={2} fill="#2563eb" />
            </svg>
            <div className="mt-3 grid gap-1 text-xs leading-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-4 sm:text-sm">
              <span className="text-muted-foreground">{scene.segments}</span>
              <span className="font-mono font-bold">
                S-box {sboxes}개 × {PER_SBOX} = 제약 {constraints}개
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-2 rounded-[2px]" style={{ backgroundColor: "#2563eb" }} />다섯제곱하는 칸</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-2 rounded-[2px]" style={{ backgroundColor: "#cbd5e1" }} />상수 덧셈·혼합만</span>
              <span>막대 끝 = 576개</span>
            </div>
          </div>
        );
      }}
    />
  );
}
