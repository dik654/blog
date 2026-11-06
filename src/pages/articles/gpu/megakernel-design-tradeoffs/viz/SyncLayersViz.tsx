import SceneShell from "./SceneShell";

/**
 * 본문 대응: #task-loop — 이름이 비슷한 동기화 네 가지를 범위가 넓은 순서로 놓는다.
 * 같은 시간 띠에서 누가 누구를 기다리는지만 바꿔 그린다. 막대 길이는 모두 그림용 가정이다.
 */
type Kind = "a" | "b" | "wait" | "idle" | "tma";
type Bar = { lane: number; t0: number; t1: number; kind: Kind; label: string };
type Mark = { t: number; from: number; to: number };

const SCENES = [
  { label: "kernel 사이", summary: "다음 kernel 은 앞 kernel 전체를 기다림", note: "같은 stream 의 다음 kernel 은 앞 kernel 의 모든 block 이 끝나고 그 쓰기가 보일 때 시작합니다. 프로그래머가 아무것도 쓰지 않아도 의존이 지켜지는 inter-kernel synchronization 입니다." },
  { label: "grid 전체", summary: "grid.sync() → 모든 block 이 한 지점에", note: "Cooperative launch 로 모든 block 이 동시에 SM 위에 올라와(resident) 있어야 합니다. Operator 경계마다 부르면 지운 kernel 경계를 다시 만든 셈이라 megakernel 의 답이 되지 못합니다." },
  { label: "task 사이", summary: "counter → 필요한 쪽만 기다림", note: "SM1 의 B0 만 A0 의 counter 를 기다리고, 다른 SM 은 자기 의존이 풀리는 대로 다음 task 로 갑니다. 이것이 megakernel 이 쓰는 intra-kernel synchronization 입니다." },
  { label: "block 안", summary: "named barrier → warpgroup 순서", note: "warpgroup 은 block 안의 warp 묶음이고 TMA 는 data 를 나르는 하드웨어 경로입니다. FlashAttention-3 는 producer 가 나른 data 로 consumer 둘이 GEMM 과 softmax 를 번갈아 하도록 이름 붙은 장벽인 named barrier 로 순서를 강제합니다." },
] as const;

const LANES: readonly (readonly string[])[] = [
  ["SM0", "SM1", "SM2", "SM3"],
  ["block0", "block1", "block2", "block3"],
  ["SM0", "SM1", "SM2", "SM3"],
  ["producer", "consumer1", "consumer2", ""],
];

const BARS: readonly (readonly Bar[])[] = [
  [
    { lane: 0, t0: 0, t1: 5, kind: "a", label: "A" },
    { lane: 1, t0: 0, t1: 5, kind: "a", label: "A" },
    { lane: 2, t0: 0, t1: 3, kind: "a", label: "A" },
    { lane: 3, t0: 0, t1: 3, kind: "a", label: "A" },
    { lane: 2, t0: 3, t1: 5, kind: "idle", label: "빔" },
    { lane: 3, t0: 3, t1: 5, kind: "idle", label: "빔" },
    { lane: 0, t0: 5, t1: 9, kind: "b", label: "B" },
    { lane: 1, t0: 5, t1: 9, kind: "b", label: "B" },
    { lane: 2, t0: 5, t1: 9, kind: "b", label: "B" },
    { lane: 3, t0: 5, t1: 9, kind: "b", label: "B" },
  ],
  [
    { lane: 0, t0: 0, t1: 5, kind: "a", label: "일" },
    { lane: 1, t0: 0, t1: 3, kind: "a", label: "일" },
    { lane: 2, t0: 0, t1: 4, kind: "a", label: "일" },
    { lane: 3, t0: 0, t1: 2, kind: "a", label: "일" },
    { lane: 1, t0: 3, t1: 5, kind: "wait", label: "대기" },
    { lane: 2, t0: 4, t1: 5, kind: "wait", label: "" },
    { lane: 3, t0: 2, t1: 5, kind: "wait", label: "대기" },
    { lane: 0, t0: 5, t1: 9, kind: "b", label: "다음 일" },
    { lane: 1, t0: 5, t1: 9, kind: "b", label: "다음 일" },
    { lane: 2, t0: 5, t1: 9, kind: "b", label: "다음 일" },
    { lane: 3, t0: 5, t1: 9, kind: "b", label: "다음 일" },
  ],
  [
    { lane: 0, t0: 0, t1: 5, kind: "a", label: "A0" },
    { lane: 0, t0: 5, t1: 9, kind: "b", label: "B3" },
    { lane: 1, t0: 0, t1: 3, kind: "a", label: "A1" },
    { lane: 1, t0: 3, t1: 5, kind: "wait", label: "대기" },
    { lane: 1, t0: 5, t1: 9, kind: "b", label: "B0" },
    { lane: 2, t0: 0, t1: 3, kind: "a", label: "A2" },
    { lane: 2, t0: 3, t1: 7, kind: "b", label: "B2" },
    { lane: 3, t0: 0, t1: 2, kind: "a", label: "A3" },
    { lane: 3, t0: 2, t1: 6, kind: "b", label: "B1" },
  ],
  [
    { lane: 0, t0: 0, t1: 3, kind: "tma", label: "TMA" },
    { lane: 0, t0: 3, t1: 6, kind: "tma", label: "TMA" },
    { lane: 0, t0: 6, t1: 9, kind: "tma", label: "TMA" },
    { lane: 1, t0: 0, t1: 3, kind: "a", label: "GEMM" },
    { lane: 1, t0: 3, t1: 6, kind: "b", label: "softmax" },
    { lane: 1, t0: 6, t1: 9, kind: "a", label: "GEMM" },
    { lane: 2, t0: 0, t1: 3, kind: "b", label: "softmax" },
    { lane: 2, t0: 3, t1: 6, kind: "a", label: "GEMM" },
    { lane: 2, t0: 6, t1: 9, kind: "b", label: "softmax" },
  ],
];

const MARKS: readonly (readonly Mark[])[] = [
  [{ t: 5, from: 0, to: 3 }],
  [{ t: 5, from: 0, to: 3 }],
  [{ t: 5, from: 0, to: 1 }],
  [{ t: 3, from: 0, to: 2 }, { t: 6, from: 0, to: 2 }],
];

const FILL: Record<Kind, { fill: string; stroke: string; dash?: string }> = {
  a: { fill: "#2563eb26", stroke: "#2563eb" },
  b: { fill: "#05966926", stroke: "#059669" },
  wait: { fill: "#d9770626", stroke: "#d97706", dash: "3 2" },
  idle: { fill: "none", stroke: "#94a3b8", dash: "3 2" },
  tma: { fill: "#64748b26", stroke: "#64748b" },
};

const X0 = 62;
const X1 = 350;
const LANE_H = 30;
const px = (t: number) => X0 + ((X1 - X0) * t) / 9;

export default function SyncLayersViz() {
  return (
    <SceneShell
      eyebrow="동기화의 범위"
      title="동기화는 범위에 따라 네 층으로 갈립니다"
      description="위 네 칸은 왼쪽부터 범위가 넓은 순서입니다. grid 는 한 kernel 의 block 전체, SM 은 block 이 올라가 도는 계산 코어 묶음입니다. 붉은 점선까지 기다리며, 막대 길이는 그림용 가정입니다."
      ariaLabel="kernel 사이, grid 전체, task 사이, block 안의 동기화에서 누가 누구를 기다리는지 보여 주는 시간 띠"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-4 gap-1 text-center text-[11px] leading-4">
            {SCENES.map((scene, index) => (
              <span
                key={scene.label}
                className={`rounded border px-1 py-1 ${index === active ? "border-primary bg-primary/10 font-bold" : "border-border text-muted-foreground"}`}
              >
                {scene.label}
              </span>
            ))}
          </div>
          <svg viewBox="0 0 360 128" className="mx-auto mt-3 block w-full max-w-[28rem]" role="img" aria-label={`${SCENES[active].label} 동기화의 시간 띠`}>
            {LANES[active].map((name, lane) => (
              <text key={lane} x={X0 - 5} y={lane * LANE_H + 21} textAnchor="end" fontSize="10.5" fill="currentColor">{name}</text>
            ))}
            {BARS[active].map((bar, index) => {
              const style = FILL[bar.kind];
              return (
                <g key={index}>
                  <rect x={px(bar.t0)} y={bar.lane * LANE_H + 4} width={px(bar.t1) - px(bar.t0) - 1} height={LANE_H - 7} fill={style.fill} stroke={style.stroke} strokeWidth="1" strokeDasharray={style.dash} />
                  {bar.label && (
                    <text x={(px(bar.t0) + px(bar.t1)) / 2} y={bar.lane * LANE_H + 20} textAnchor="middle" fontSize="10.5" fill="currentColor">{bar.label}</text>
                  )}
                </g>
              );
            })}
            {MARKS[active].map((mark, index) => (
              <line key={index} x1={px(mark.t)} y1={mark.from * LANE_H + 1} x2={px(mark.t)} y2={mark.to * LANE_H + LANE_H} stroke="#dc2626" strokeWidth="1.25" strokeDasharray="4 2" />
            ))}
          </svg>
        </div>
      )}
    />
  );
}
