import SceneShell from "./SceneShell";

/**
 * 본문 대응: #coalescing — 32 lanes·float 4 B. 직접 전치 37+64×lane: sector 32개, 128/1024=12.5%.
 * 교환 뒤 224+lane: sector 4개, 100%. 4 B 어긋나면 sector 5개, 128/160=80%.
 * 칸 하나가 sector(8 float)이고 안의 칠한 줄이 유효 float입니다.
 */
const direct = Array.from({ length: 32 }, () => [5]);
const full = [0, 1, 2, 3, 4, 5, 6, 7];
const SCENES: { label: string; summary: string; note: string; sectors: number[][]; total: number }[] = [
  { label: "직접 전치", summary: "sector 32개 · 12.5%", sectors: direct, total: 1024, note: "출력 주소가 256바이트씩 떨어져 lane마다 다른 sector에 걸칩니다. 각 sector는 32바이트 중 4바이트만 쓰입니다. 칸 사이의 빈 주소는 그림에서 생략했습니다." },
  { label: "교환한 뒤", summary: "sector 4개 · 100%", sectors: [full, full, full, full], total: 128, note: "출력이 224+lane으로 정렬된 연속 128바이트입니다. 주소가 요구하는 범위가 1024바이트에서 128바이트로 줄었습니다." },
  { label: "시작이 4바이트 어긋나면", summary: "sector 5개 · 128/160 = 80%", sectors: [[1, 2, 3, 4, 5, 6, 7], full, full, full, [0]], total: 160, note: "같은 연속 128바이트라도 시작이 어긋나면 5 sectors를 덮을 수 있습니다. 앞의 계산은 정렬됐다는 조건 위에 있습니다." },
];

const COLS = 8;
const SECTOR_W = 42;
const SLOT_W = 4.8;
const SECTOR_H = 22;
const X0 = 12;
const Y0 = 8;
const METER_Y = 138;
const METER_W = 336;
const BYTE = METER_W / 1024;

export default function SectorCoverageViz() {
  return (
    <SceneShell
      eyebrow="주소가 덮는 범위"
      title="같은 32개 값이라도 걸치는 sector 수가 다릅니다"
      description="칸 하나가 32바이트 sector, 칠한 줄이 lane 하나의 4바이트 값입니다. 아래 막대는 주소가 덮는 범위이며 실제 HBM 전송량의 측정값이 아닙니다."
      ariaLabel="직접 전치, 교환 뒤, 어긋난 시작에서 걸치는 sector 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 176" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.sectors.map((slots, index) => {
              const x = X0 + (index % COLS) * SECTOR_W;
              const y = Y0 + Math.floor(index / COLS) * (SECTOR_H + 6);
              return (
                <g key={index}>
                  <rect x={x} y={y} width={SECTOR_W - 4} height={SECTOR_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {slots.map((slot) => (
                    <rect key={slot} x={x + slot * SLOT_W} y={y + 1} width={SLOT_W - 0.6} height={SECTOR_H - 2} fill="#2563eb" />
                  ))}
                </g>
              );
            })}
            <rect x={X0} y={METER_Y} width={scene.total * BYTE} height={12} rx={2} fill="#94a3b8" opacity={0.35} />
            <rect x={X0} y={METER_Y} width={128 * BYTE} height={12} rx={2} fill="#2563eb" />
            <text x={X0} y={METER_Y + 28} fontSize={11} fontWeight={700} fill="#2563eb">유효 128 B</text>
            <text x={348} y={METER_Y + 28} textAnchor="end" fontSize={11} fontWeight={700} fill="#64748b">걸친 범위 {scene.total.toLocaleString("en-US")} B ({scene.sectors.length}×32)</text>
          </svg>
        );
      }}
    />
  );
}
