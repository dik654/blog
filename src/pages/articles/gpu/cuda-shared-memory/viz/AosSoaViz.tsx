import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aos-soa — 기록 16 B(x, y, z, mass float). x만 32개 읽기.
 * AoS: 정렬된 512 B, sector 16개, 128/512=25%. SoA: sector 4개, 100%.
 * AoSoA의 묶음 크기 4는 가정입니다.
 */
const AOS = ["x", "y", "z", "m", "x", "y", "z", "m"];
const SOA = ["x", "x", "x", "x", "x", "x", "x", "x"];
const AOSOA = ["x", "x", "x", "x", "y", "y", "y", "y"];
const AOSOA_2 = ["z", "z", "z", "z", "m", "m", "m", "m"];
const SCENES: { label: string; summary: string; note: string; sectors: string[][]; highlight: string }[] = [
  { label: "기록별 배치", summary: "AoS · sector 16개 · 25%", sectors: Array.from({ length: 16 }, () => AOS), highlight: "x", note: "x·y·z·mass를 한 기록으로 묶으면 x 주소가 16바이트씩 떨어집니다. 32개 x를 읽으려면 정렬된 512바이트 범위, sector 16개가 필요하고 유효한 값은 128바이트입니다." },
  { label: "항목별 배치", summary: "SoA · sector 4개 · 100%", sectors: Array.from({ length: 4 }, () => SOA), highlight: "x", note: "x만 별도 배열에 모으면 간격이 4바이트입니다. 같은 32개 값을 정렬된 sector 4개에서 읽습니다." },
  { label: "기록을 통째로 쓰면", summary: "한 기록의 모든 항목이 이웃", sectors: Array.from({ length: 1 }, () => AOS), highlight: "xyzm", note: "한 작업이 기록의 모든 항목을 곧바로 쓴다면 기록별 배치도 유용할 수 있습니다. 어떤 배치가 나은지는 실제로 읽는 항목과 다음 계산의 접근 방식에 달려 있습니다." },
  { label: "묶음 안 항목별", summary: "AoSoA · 묶음 크기 4 (가정)", sectors: [AOSOA, AOSOA_2], highlight: "x", note: "작은 기록 묶음 안에서 항목별 배열을 둡니다. 항목의 연속성과 기록 묶음의 가까운 배치를 절충합니다. 묶음 크기 4는 그림을 위한 가정입니다." },
];

const COLS = 4;
const W = 84;
const SLOT = 10;
const H = 22;
const X0 = 12;
const Y0 = 10;

export default function AosSoaViz() {
  return (
    <SceneShell
      eyebrow="같은 값, 다른 간격"
      title="x만 읽을 때 배치에 따라 걸치는 sector 수가 달라집니다"
      description="칸 하나가 32바이트 sector, 글자 칸 하나가 4바이트 float입니다. m은 mass이고 파란 글자가 이번 작업이 읽는 항목입니다."
      ariaLabel="AoS, SoA, AoSoA 배치에서 x 값이 차지하는 sector"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 360 128" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.sectors.map((slots, index) => {
              const x = X0 + (index % COLS) * W;
              const y = Y0 + Math.floor(index / COLS) * (H + 6);
              return (
                <g key={index}>
                  <rect x={x} y={y} width={W - 4} height={H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} />
                  {slots.map((item, slot) => {
                    const hit = scene.highlight.includes(item);
                    return (
                      <g key={slot}>
                        {hit && <rect x={x + slot * SLOT} y={y + 1} width={SLOT - 0.6} height={H - 2} fill="#2563eb" fillOpacity={0.25} />}
                        <text x={x + slot * SLOT + SLOT / 2} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={hit ? 700 : 400} fill={hit ? "#2563eb" : "#94a3b8"}>{item}</text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
