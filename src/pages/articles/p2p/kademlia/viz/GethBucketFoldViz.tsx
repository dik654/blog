import SceneShell from "./SceneShell";

/**
 * 본문 대응: #routing — Go-ethereum v1.17.8 discovery table의 bucket folding.
 * nBuckets=256/15=17, bucketMinDistance=256−17=239.
 * LogDist 240 이하 → 첫 bucket, 241…256 → 나머지 16개 bucket(하나씩).
 * 위 줄은 LogDist 1…256을 같은 폭으로 놓은 축, 아래 줄은 bucket 17칸입니다.
 */
const SCENES = [
  {
    label: "LogDist마다 칸을 둔다면",
    summary: "LogDist 1…256 → 256칸",
    note: "256개 LogDist를 array slot 256개에 하나씩 둘 수도 있습니다. Geth v1.17.8 discovery table은 이렇게 두지 않습니다.",
  },
  {
    label: "bucket은 17개",
    summary: "256/15 = 17 · 256−17 = 239",
    note: "nBuckets는 256/15=17.06…에서 소수점 아래를 버린 17이고, bucketMinDistance는 256−17=239입니다. 아래 줄이 bucket 17칸입니다.",
  },
  {
    label: "LogDist 240 이하는 첫 bucket으로",
    summary: "거리 값 240개 → bucket 1개",
    note: "실제 mapping 식까지 적용하면 LogDist 1…240이 모두 첫 bucket 하나에 접힙니다. 위 축의 240/256=93.75%가 칸 하나로 모입니다.",
  },
  {
    label: "241…256은 하나씩",
    summary: "거리 값 16개 → bucket 16개",
    note: "남은 LogDist 241…256 열여섯 개가 나머지 16개 bucket으로 나뉩니다. 이 접기는 Kademlia 일반 규칙이 아니라 해당 source revision의 구현 선택입니다.",
  },
] as const;

const ON = "#2563eb";
const FOLD = "#d97706";
const OFF = "#94a3b8";
const INK = "#64748b";

const L = 8;
const SPAN = 284;
const ax = (ld: number) => L + ((ld - 1) * SPAN) / 256;
const AX_Y = 40;
const AX_H = 22;
const SLOT_GAP = 2;
const SLOT_W = (SPAN - 16 * SLOT_GAP) / 17;
const SLOT_Y = 126;
const SLOT_H = 22;
const sx = (i: number) => L + i * (SLOT_W + SLOT_GAP);

export default function GethBucketFoldViz() {
  return (
    <SceneShell
      eyebrow="Geth v1.17.8 구현"
      title="LogDist 256개가 bucket 17개로 접힙니다"
      description="위 줄은 LogDist 1…256을 같은 폭으로 늘어놓은 축이고, 아래 줄은 Geth v1.17.8 discovery table의 bucket array 17칸입니다. 칸 크기는 개수 비교용이며 실제 메모리 배치가 아닙니다."
      ariaLabel="Geth discovery table에서 LogDist 1부터 256까지가 bucket 17개로 접히는 대응"
      scenes={SCENES}
      render={(active) => {
        const slotsOn = active >= 1;
        const foldOn = active >= 2;
        const fanOn = active >= 3;
        return (
          <svg viewBox="0 0 300 196" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={L} y={14} fontSize={10} fontWeight={700} fill={INK}>
              LogDist 1…256 (값마다 같은 폭)
            </text>
            <rect x={ax(1)} y={AX_Y} width={ax(241) - ax(1)} height={AX_H} fill={foldOn ? FOLD : ON} fillOpacity={0.18} stroke={foldOn ? FOLD : ON} strokeWidth={1} />
            <rect x={ax(241)} y={AX_Y} width={ax(257) - ax(241)} height={AX_H} fill={ON} fillOpacity={fanOn ? 0.4 : 0.18} stroke={ON} strokeWidth={1} />
            <text x={(ax(1) + ax(241)) / 2} y={AX_Y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={foldOn ? FOLD : ON}>
              LogDist 1 … 240
            </text>
            <text x={L + SPAN} y={AX_Y - 6} textAnchor="end" fontSize={9.5} fontWeight={700} fill={ON}>
              241…256
            </text>
            <text x={ax(1)} y={AX_Y + AX_H + 12} fontSize={9} fill={INK}>
              1
            </text>

            {foldOn && (
              <polygon
                points={`${ax(1)},${AX_Y + AX_H + 18} ${ax(241)},${AX_Y + AX_H + 18} ${sx(0) + SLOT_W},${SLOT_Y - 2} ${sx(0)},${SLOT_Y - 2}`}
                fill={FOLD}
                fillOpacity={0.1}
                stroke={FOLD}
                strokeWidth={1}
              />
            )}
            {fanOn &&
              Array.from({ length: 16 }, (_, j) => (
                <line key={j} x1={ax(241 + j) + 0.55} y1={AX_Y + AX_H} x2={sx(j + 1) + SLOT_W / 2} y2={SLOT_Y - 2} stroke={ON} strokeWidth={0.75} />
              ))}

            <g opacity={slotsOn ? 1 : 0.18}>
              {Array.from({ length: 17 }, (_, i) => {
                const c = i === 0 ? (foldOn ? FOLD : OFF) : fanOn ? ON : OFF;
                return <rect key={i} x={sx(i)} y={SLOT_Y} width={SLOT_W} height={SLOT_H} rx={2} fill={c} fillOpacity={0.15} stroke={c} strokeWidth={1} />;
              })}
              {foldOn && (
                <text x={sx(0)} y={SLOT_Y + SLOT_H + 12} fontSize={9} fontWeight={700} fill={FOLD}>
                  ≤240
                </text>
              )}
              {fanOn && (
                <>
                  <line x1={sx(1)} x2={sx(16) + SLOT_W} y1={SLOT_Y + SLOT_H + 5} y2={SLOT_Y + SLOT_H + 5} stroke={ON} strokeWidth={1} />
                  <text x={(sx(1) + sx(16) + SLOT_W) / 2} y={SLOT_Y + SLOT_H + 17} textAnchor="middle" fontSize={9} fontWeight={700} fill={ON}>
                    241, 242, …, 256 하나씩
                  </text>
                </>
              )}
              <text x={L} y={SLOT_Y + SLOT_H + 34} fontSize={9.5} fontWeight={700} fill={INK}>
                bucket 17칸
              </text>
              <text x={L + SPAN} y={SLOT_Y + SLOT_H + 34} textAnchor="end" fontSize={9} fill={INK}>
                256/15 = 17 · 256−17 = 239
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
