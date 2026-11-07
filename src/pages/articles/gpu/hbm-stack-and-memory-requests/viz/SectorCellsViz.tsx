import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 4바이트 원소, 32바이트 요청 조각, 128바이트 정렬(가정).
 * 연속 32개 = 원소 0~31 → 조각 4개. 8칸 간격 32개 = 원소 0, 8, …, 248 → 조각 32개.
 * 마지막 원소 번호 31×8 = 248이므로 원소는 최소 249개. 칸 하나가 원소 하나입니다.
 */
const SCENES = [
  { label: "조각 하나에 원소 8개", summary: "32B ÷ 4B = 8개", note: "작은 칸 하나가 4바이트 원소이고, 칸 8개를 묶은 사각형이 NVIDIA 규칙의 32바이트 요청 조각입니다. 시작 주소를 128바이트에 정렬했다고 놓았으므로(가정) 원소 0번이 첫 조각의 맨 앞에 옵니다." },
  { label: "연속으로 32개", summary: "128B → 4 조각", note: "원소 0~31번을 읽습니다. 조각 4개가 8칸씩 꽉 차므로 128바이트가 4 조각에 들어갑니다." },
  { label: "8칸 간격으로 32개", summary: "128B → 32 조각", note: "원소 번호가 8씩 늘면 주소 간격이 32바이트라 조각마다 원소 하나만 걸립니다. 유효한 값은 그대로 128바이트입니다. 조각 수는 요청 단계의 수이며 HBM 명령 수와 같다는 뜻은 아닙니다." },
  { label: "왜 최소 249개인가", summary: "31 × 8 + 1 = 249개", note: "32번째 원소의 번호는 31 × 8 = 248입니다. 번호가 0부터 시작하므로 원소는 최소 249개가 있어야 합니다. 64개 배열 밖을 읽으라는 뜻이 아니라 더 넓은 입력에서 32개를 고르는 변형입니다." },
] as const;

const SECTORS = Array.from({ length: 32 }, (_, index) => index);
const ELEMENTS = Array.from({ length: 8 }, (_, index) => index);
const ROW_Y = [20, 66, 92, 118] as readonly number[];
const SECTOR_W = 38;
const SECTOR_H = 20;
const LEFT = 7;
const STEP = 44;

function isRead(active: number, element: number) {
  if (active === 0) return element < 8;
  if (active === 1) return element < 32;
  return element % 8 === 0 && element <= 248;
}

function isTouched(active: number, sector: number) {
  if (active === 0) return sector === 0;
  if (active === 1) return sector < 4;
  return true;
}

export default function SectorCellsViz() {
  return (
    <SceneShell
      eyebrow="같은 128바이트"
      title="읽는 값이 같아도 걸리는 요청 조각 수는 8배 차이 납니다"
      description="진한 칸이 읽는 원소입니다. 파란 테두리는 이번 요청에 걸린 조각입니다. 두 경우 모두 유효한 값은 원소 32개, 128바이트입니다."
      ariaLabel="연속 읽기와 8칸 간격 읽기가 32바이트 조각에 걸리는 개수 비교"
      scenes={SCENES}
      render={(active) => {
        const wide = active >= 2;
        return (
          <svg viewBox="0 0 360 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={13} fontSize={12} fontWeight={700} fill="#64748b">64개 배열 · 조각 8개</text>
            <text x={LEFT} y={59} fontSize={12} fontWeight={700} fill="#64748b">{wide ? "더 넓은 입력" : "64개 배열 밖"}</text>
            {SECTORS.map((sector) => {
              const row = Math.floor(sector / 8);
              const x = LEFT + (sector % 8) * STEP;
              const y = ROW_Y[row];
              const touched = isTouched(active, sector);
              const outside = row > 0 && !wide;
              return (
                <g key={sector} opacity={outside ? 0.35 : 1}>
                  <rect
                    x={x}
                    y={y}
                    width={SECTOR_W}
                    height={SECTOR_H}
                    rx={2}
                    fill="none"
                    stroke={touched ? "#2563eb" : "#94a3b8"}
                    strokeWidth={touched ? 1.25 : 1}
                    strokeDasharray={outside ? "2 2" : undefined}
                  />
                  {ELEMENTS.map((offset) => {
                    const element = sector * 8 + offset;
                    const beyond = active === 3 && element > 248;
                    return (
                      <rect
                        key={offset}
                        x={x + 2 + (offset % 4) * 8.75}
                        y={y + 2 + Math.floor(offset / 4) * 8.5}
                        width={7.75}
                        height={7.5}
                        fill={isRead(active, element) ? "#2563eb" : beyond ? "none" : "#94a3b8"}
                        fillOpacity={isRead(active, element) ? 1 : beyond ? 0 : 0.25}
                        stroke={beyond ? "#94a3b8" : "none"}
                        strokeWidth={0.75}
                        strokeDasharray={beyond ? "1.5 1.5" : undefined}
                      />
                    );
                  })}
                </g>
              );
            })}
            {active === 3 ? (
              <text x={353} y={152} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">마지막 조각의 첫 칸 = 248번, 뒤 칸은 없어도 됨</text>
            ) : (
              <text x={LEFT} y={152} fontSize={12} fill="#64748b">진한 칸 = 읽는 원소 · 걸린 조각 {active === 0 ? "1개(예)" : active === 1 ? "4개" : "32개"}</text>
            )}
          </svg>
        );
      }}
    />
  );
}
