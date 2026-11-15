import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tv-partition — 128×32 halves A tile 을 value (1,8)·thread (32,4) 로 옮기는 자리.
 * 한 번의 copy = 32 thread × 4 thread × 8 halves = 32×32. M 128 ÷ 32 = 4번.
 * partition_S 결과 (value 8, M 4, K 1) = 32 halves = 16B copy 4번.
 * 그림 속 thread 하나의 위치(행 0·첫 16B 칸)는 설명용 가정이다. 본문은 thread layout 의 stride 를 적지 않는다.
 */
const ROWS = 128;
const CHUNKS = 4;
const RH = 2;
const CW = 46;
const X0 = 44;
const Y0 = 24;
const ROUND_COLORS = ["#2563eb", "#0f766e", "#7c3aed", "#d97706"] as const;

const SCENES = [
  { label: "Value layout (1,8)", summary: "8 halves = 16B", stage: 0, note: "K 방향으로 연속한 8 halves가 16B vector copy 한 번입니다. 가로 한 칸이 이 16B이고, K 32는 이런 칸 4개입니다." },
  { label: "Thread layout (32,4)", summary: "32×32 = 1,024 halves", stage: 1, note: "128 thread를 M 방향 32, K 방향 4로 놓으면 한 번의 copy가 행 0–31의 네 칸 전부, 곧 32×32를 덮습니다." },
  { label: "M 방향 4번", summary: "128 ÷ 32 = 4", stage: 2, note: "같은 배치를 M 방향으로 32행씩 내려가며 4번 쓰면 128×32 tile이 끝납니다." },
  { label: "partition_S: thread 하나", summary: "(8, 4, 1) = 32 halves", stage: 3, note: "Thread 하나의 몫은 네 번의 copy에서 같은 자리에 있는 16B 칸 4개입니다. 모양은 (value 8, M 방향 4, K 방향 1)이고 32 halves = 64B, 16B copy 4번입니다. 그림의 위치(행 0·첫 칸)는 가정입니다." },
] as const;

export default function ThreadShareViz() {
  return (
    <SceneShell
      eyebrow="TV partition"
      title="Thread 하나가 128×32 tile에서 맡는 네 칸"
      description="세로는 A tile의 M 128행, 가로는 K 32 halves를 16B씩 나눈 네 칸입니다. Global에서 shared memory로 옮기는 copy를 봅니다."
      ariaLabel="128 by 32 A tile에서 thread 128개가 네 번의 copy로 덮고 thread 하나가 네 칸을 맡는 과정"
      scenes={SCENES}
      render={(active) => {
        const stage = SCENES[active].stage;
        return (
          <svg viewBox={`0 0 340 ${Y0 + ROWS * RH + 30}`} className="mx-auto block w-full max-w-[26rem]" role="img" aria-label="A tile thread 분배">
            {Array.from({ length: CHUNKS }, (_, c) => (
              <text key={`k${c}`} x={X0 + c * CW + CW / 2} y={Y0 - 8} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                K {c * 8}–{c * 8 + 7}
              </text>
            ))}
            {[0, 32, 64, 96, 127].map((r) => (
              <text key={`r${r}`} x={X0 - 5} y={Y0 + r * RH + 6} textAnchor="end" fontSize={9} className="fill-muted-foreground">
                {r}
              </text>
            ))}
            {Array.from({ length: 4 }, (_, round) =>
              Array.from({ length: CHUNKS }, (_, c) => {
                const covered = stage >= 2 || (stage === 1 && round === 0);
                return (
                  <rect
                    key={`${round}-${c}`}
                    x={X0 + c * CW}
                    y={Y0 + round * 32 * RH}
                    width={CW}
                    height={32 * RH}
                    fill={covered ? ROUND_COLORS[round] : "#94a3b8"}
                    fillOpacity={covered ? (stage === 3 ? 0.08 : 0.18) : 0.06}
                    stroke="#94a3b8"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                  />
                );
              }),
            )}
            {Array.from({ length: 4 }, (_, round) => {
              const row = round * 32;
              const show = stage === 3 ? true : stage === 0 && round === 0;
              return show ? (
                <rect key={`m${round}`} x={X0} y={Y0 + row * RH} width={CW} height={5} fill="#dc2626" stroke="#dc2626" strokeWidth={1.25} />
              ) : null;
            })}
            {Array.from({ length: 4 }, (_, round) => {
              const y = Y0 + round * 32 * RH + 34;
              const text =
                stage === 0
                  ? round === 0
                    ? "← 빨간 띠 = 16B 한 번"
                    : ""
                  : stage === 1
                    ? round === 0
                      ? "copy 1: 행 0–31"
                      : ""
                    : stage === 2
                      ? `copy ${round + 1}: 행 ${round * 32}–${round * 32 + 31}`
                      : `16B #${round + 1} (행 ${round * 32})`;
              return (
                <text key={`l${round}`} x={X0 + CHUNKS * CW + 10} y={y} fontSize={10} className="fill-foreground">
                  {text}
                </text>
              );
            })}
            <rect x={X0} y={Y0} width={CHUNKS * CW} height={ROWS * RH} fill="none" stroke="#64748b" strokeWidth={1} />
            <text x={X0} y={Y0 + ROWS * RH + 20} fontSize={9} className="fill-muted-foreground">
              tile 128×32 halves = 8KiB
            </text>
          </svg>
        );
      }}
    />
  );
}
