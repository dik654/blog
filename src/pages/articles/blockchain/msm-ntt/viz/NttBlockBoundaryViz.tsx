import SceneShell from "./SceneShell";

/**
 * 본문 대응: #parallel-frontier — block 안에서 끝나는 작은 stage는 shared memory와 block barrier로 묶고,
 * 여러 blocks가 참여하는 경계는 kernel launch를 나누거나 cooperative 조건을 검증한다.
 * N=8 radix-2, pair 거리 1·2·4(개요 Viz와 같은 순서). block 하나가 원소 4개를 맡는다고 가정.
 */
const N = 8;
const BLOCK = 4;
const W = 360;
const H = 204;
const KERNEL_Y = 120;
const X0 = 62;
const DX = 37;
const ROW_Y = [56, 100, 150] as const;
const DIST = [1, 2, 4] as const;
const CROSS_COLOR = "#dc2626";
const LOCAL_COLOR = "#2563eb";

const x = (i: number) => X0 + i * DX;
const pairsOf = (d: number) =>
  Array.from({ length: N }, (_, i) => i).filter((i) => i % (2 * d) < d).map((i) => [i, i + d] as const);

const SCENES = [
  { label: "stage 0 · 거리 1", summary: "(0↔1)(2↔3)(4↔5)(6↔7)", note: "짝 네 개가 모두 한 block 안에 있습니다. 같은 block의 thread들이 shared memory에서 값을 바꾸고 block barrier 한 번으로 완료를 맞출 수 있습니다." },
  { label: "stage 1 · 거리 2", summary: "(0↔2)(1↔3)(4↔6)(5↔7)", note: "짝 거리가 2로 늘었지만 여전히 block 안입니다. stage 0의 output을 읽어야 하므로 그 사이에 block barrier가 있어야 하고, 이것으로 충분합니다." },
  { label: "stage 2 · 거리 4", summary: "(0↔4)(1↔5)(2↔6)(3↔7)", note: "짝마다 한쪽이 block A, 다른 쪽이 block B에 있습니다. block barrier는 같은 block 안만 기다리므로 다른 block의 stage 1 완료를 보장하지 못합니다." },
  { label: "그래서 경계가 갈린다", summary: "stage 0–1 한 kernel | 경계 | stage 2", note: "앞의 두 stage는 block barrier로 한 kernel 안에 묶고, block을 건너는 stage 2 앞에서는 kernel launch를 나누거나 cooperative 실행 조건을 검증합니다." },
] as const;

export default function NttBlockBoundaryViz() {
  return (
    <SceneShell
      eyebrow="stage와 block"
      title="짝이 block 밖으로 나가는 stage에서 barrier 종류가 바뀝니다"
      description="N=8 radix-2 NTT를 block 두 개가 나눠 맡는다고 가정합니다(block당 원소 4개). 점 하나가 배열 원소 하나, 곡선 하나가 butterfly 짝 하나이며, 짝 순서는 위 개요 그림을 따릅니다."
      ariaLabel="N=8 NTT의 stage 0, 1은 block 안에서 짝을 이루고 stage 2는 block을 건너는 모습"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 1].map((b) => (
            <g key={b}>
              <rect x={x(b * BLOCK) - 14} y={24} width={DX * (BLOCK - 1) + 28} height={152} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} />
              <text x={x(b * BLOCK) + (DX * (BLOCK - 1)) / 2} y={17} textAnchor="middle" fontSize={11} fill="#64748b">
                block {b === 0 ? "A" : "B"} · 원소 {b * BLOCK}–{b * BLOCK + BLOCK - 1}
              </text>
            </g>
          ))}
          {active === 3 && (
            <g>
              <line x1={6} x2={W - 6} y1={KERNEL_Y} y2={KERNEL_Y} stroke={CROSS_COLOR} strokeWidth={1.25} strokeDasharray="4 3" />
            </g>
          )}
          {DIST.map((d, row) => {
            const on = active === 3 || active === row;
            const y = ROW_Y[row];
            return (
              <g key={d} opacity={on ? 1 : 0.22}>
                <text x={6} y={y + 4} fontSize={11} fontWeight={700} fill="#475569">stage {row}</text>
                {pairsOf(d).map(([a, c]) => {
                  const cross = Math.floor(a / BLOCK) !== Math.floor(c / BLOCK);
                  const lift = 9 + d * 3;
                  return (
                    <path
                      key={`${a}-${c}`}
                      d={`M ${x(a)} ${y} Q ${(x(a) + x(c)) / 2} ${y - lift * 2} ${x(c)} ${y}`}
                      fill="none"
                      stroke={cross ? CROSS_COLOR : LOCAL_COLOR}
                      strokeWidth={1.25}
                      strokeDasharray={cross ? "4 3" : undefined}
                    />
                  );
                })}
                {Array.from({ length: N }, (_, i) => (
                  <g key={i}>
                    <circle cx={x(i)} cy={y} r={4} fill="#475569" />
                    {row === 2 && <text x={x(i)} y={y + 16} textAnchor="middle" fontSize={11} fill="#64748b">{i}</text>}
                  </g>
                ))}
              </g>
            );
          })}
          {active === 3 && (
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={CROSS_COLOR}>가로 빨간 점선 = kernel 경계</text>
          )}
        </svg>
      )}
      note="실선 = block 안의 짝(block barrier로 충분), 점선 = block을 건너는 짝(kernel 분할 또는 cooperative 조건 필요). block 크기 4는 그림을 위한 가정입니다."
    />
  );
}
