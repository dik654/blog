import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case — 2층 × K·V 2종류 × 2묶음 × 2숫자 × 2바이트 = 32B, 네 자리면 128B.
 * 칸 하나가 1바이트이고 실제 128칸을 그린다.
 */
const SCENES = [
  { label: "숫자 하나", summary: "2B", lines: ["숫자 1개", "= 2바이트"], cells: 2, rows: 1, note: "칸 하나가 1바이트입니다. 값이 무엇이든 숫자 하나는 2바이트로 표현한다고 가정합니다." },
  { label: "묶음 하나", summary: "2 × 2B = 4B", lines: ["묶음 1개", "숫자 2개 × 2B", "= 4바이트"], cells: 4, rows: 1, note: "숫자 두 개가 한 묶음을 이룹니다." },
  { label: "한 종류", summary: "2 × 4B = 8B", lines: ["K 한 종류", "묶음 2개 × 4B", "= 8바이트"], cells: 8, rows: 1, note: "K와 V는 뒤 계산이 다시 참고하는 기록의 두 종류입니다. 이름의 뜻은 6절에서 봅니다. 한 종류에 묶음이 두 개 있습니다." },
  { label: "한 층", summary: "2 × 8B = 16B", lines: ["1층", "K·V 2종류 × 8B", "= 16바이트"], cells: 8, rows: 2, note: "층은 모델 안에서 차례로 거치는 계산 단계입니다. 층마다 K와 V가 모두 있습니다." },
  { label: "입력 한 자리", summary: "2 × 16B = 32B", lines: ["입력 한 자리", "2층 × 16B", "= 32바이트"], cells: 8, rows: 4, note: "입력의 한 자리가 두 층에 기록을 남깁니다. 지금까지 곱한 수를 모으면 2×2×2×2×2 = 32입니다." },
  { label: "입력 네 자리", summary: "4 × 32B = 128B", lines: [], cells: 8, rows: 4, note: "1~4는 위치를 구별하는 번호일 뿐 기록의 값이 아닙니다. 128B는 값이 아니라 자리 수를 센 크기입니다. 층·묶음 수와 크기는 설명용 가정입니다." },
] as const;

const ROW_LABELS = ["1층 K", "1층 V", "2층 K", "2층 V"];

function cellX(col: number, size: number) {
  return col * (size + 1) + Math.floor(col / 2) * (size * 0.2) + Math.floor(col / 4) * (size * 0.35);
}
function rowY(row: number, size: number) {
  return row * (size + 2) + Math.floor(row / 2) * (size * 0.5);
}

function Position({ x, y, size, cells, rows, color }: { x: number; y: number; size: number; cells: number; rows: number; color: string }) {
  return (
    <g>
      {[0, 1, 2, 3].map((row) =>
        Array.from({ length: 8 }, (_, col) => {
          const on = row < rows && col < cells;
          return (
            <rect
              key={`${row}-${col}`}
              x={x + cellX(col, size)}
              y={y + rowY(row, size)}
              width={size}
              height={size}
              rx={1.5}
              fill={on ? color : "none"}
              stroke={on ? "none" : "#94a3b8"}
              strokeOpacity={0.5}
              strokeWidth={1}
            />
          );
        }),
      )}
    </g>
  );
}

export default function KvBytesViz() {
  return (
    <SceneShell
      eyebrow="(가정) 128바이트 세기"
      title="곱셈 다섯 번이 실제 칸 128개가 됩니다"
      description="칸 하나가 1바이트입니다. 파란 칸이 지금 세는 범위입니다."
      ariaLabel="숫자, 묶음, 종류, 층, 입력 자리로 커지는 기록 크기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const lines: readonly string[] = scene.lines;
        return (
          <svg key={scene.label} viewBox="0 0 360 132" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {active < 5 ? (
              <>
                {ROW_LABELS.map((label, row) => (
                  <text key={label} x={38} y={10 + rowY(row, 20) + 15} textAnchor="end" fontSize={12} fill={row < scene.rows ? "currentColor" : "#94a3b8"}>{label}</text>
                ))}
                <Position x={44} y={10} size={20} cells={scene.cells} rows={scene.rows} color="#2563eb" />
                {lines.map((line, index) => (
                  <text key={line} x={242} y={38 + index * 24} fontSize={index === lines.length - 1 ? 16 : 12.5} fontWeight={index === lines.length - 1 ? 700 : 400} fill={index === lines.length - 1 ? "#2563eb" : "currentColor"}>{line}</text>
                ))}
              </>
            ) : (
              <>
                {[0, 1, 2, 3].map((pos) => (
                  <g key={pos}>
                    <text x={6 + pos * 88 + 39} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">{pos + 1}번 자리</text>
                    <Position x={6 + pos * 88} y={22} size={8} cells={8} rows={4} color="#2563eb" />
                    <text x={6 + pos * 88 + 39} y={80} textAnchor="middle" fontSize={12} fill="#64748b">32B</text>
                  </g>
                ))}
                <text x={180} y={112} textAnchor="middle" fontSize={16} fontWeight={700} fill="#2563eb">4 × 32B = 128바이트</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
