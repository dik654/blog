import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pq 마지막 문단 — 비대칭 거리 계산.
 * q-17의 조각 8개(각 96차원)를 조각별 중심 256개와 비교해 8 × 256 = 2,048칸 조회표를 먼저 만든다.
 * 후보 문서는 코드 8개로 행마다 한 칸씩 읽고, 읽은 8칸을 더해 근사 거리를 얻는다.
 * doc-104의 코드 값은 그림용 가정이다.
 */
const CODES = [214, 71, 8, 199, 33, 250, 5, 122] as const;
const CENTROIDS = 256;

const W = 360;
const H = 266;
const ROW_Y0 = 44;
const ROW_STEP = 23;
const ROW_H = 18;
const Q_X = 6;
const Q_W = 58;
const T_X = 76;
const T_W = 212;
const C_X = 300;
const C_W = 54;

const rowY = (row: number) => ROW_Y0 + row * ROW_STEP;
const cellX = (code: number) => T_X + ((code + 0.5) / CENTROIDS) * T_W;

const SCENES = [
  {
    label: "질의를 조각냅니다",
    summary: "768차원 → 96차원 × 8",
    note: "q-17은 원본 실수 그대로 두고, 문서와 같은 경계로 96차원 조각 8개로 나눕니다. 질의는 원본 값, 문서는 중심 번호로 비교하기 때문에 양쪽 형태가 다르다는 뜻에서 ‘비대칭’ 거리 계산이라고 부릅니다.",
  },
  {
    label: "조회표를 먼저 채웁니다",
    summary: "8 × 256 = 2,048칸",
    note: "각 조각을 그 조각의 중심 256개와 비교한 거리를 한 줄에 적습니다. 줄이 8개이므로 표는 2,048칸이고, 이 표는 q-17 한 건에 대해 한 번 만듭니다.",
  },
  {
    label: "코드로 한 칸씩 읽습니다",
    summary: "doc-104 코드 8개 → 8칸",
    note: "doc-104에 남은 것은 원본 좌표가 아니라 중심 번호 8개입니다(번호 값은 가정). 1번 조각의 번호 214는 1번 줄의 214번 칸을, 2번 조각의 71은 2번 줄의 71번 칸을 가리킵니다.",
  },
  {
    label: "읽은 칸을 더합니다",
    summary: "8칸의 합 = 근사 거리",
    note: "읽은 8칸을 더하면 doc-104의 근사 거리가 나옵니다. 768차원 원본을 되살리지 않았고, 다른 후보도 자기 코드 8개로 같은 표를 읽습니다. 중심으로 근사한 값이므로 원본 거리와 같다는 보장은 없습니다.",
  },
] as const;

export default function PqLookupTableViz() {
  return (
    <SceneShell
      eyebrow="비대칭 거리 계산"
      title="조회표 한 장으로 후보마다 8칸만 읽어 거리를 구합니다"
      description="가로줄 하나가 조각 하나이고, 줄 안의 위치가 중심 번호 0–255입니다. 앞의 가정(d=768, m=8, k=256)을 그대로 씁니다."
      note="doc-104의 코드 값(214, 71, …)은 그림을 위한 가정이며, 칸의 거리 값은 정하지 않았습니다."
      ariaLabel="q-17 조각과 중심 사이 거리 조회표를 doc-104의 PQ 코드로 읽어 더하는 과정"
      scenes={SCENES}
      render={(active) => {
        const showTable = active >= 1;
        const showCodes = active >= 2;
        const showSum = active >= 3;
        return (
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={Q_X + Q_W / 2} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">q-17 조각</text>
              <text x={T_X} y={30} fontSize={11} fontWeight={700} fill={showTable ? "#64748b" : "#94a3b8"}>중심 0</text>
              <text x={T_X + T_W} y={30} textAnchor="end" fontSize={11} fontWeight={700} fill={showTable ? "#64748b" : "#94a3b8"}>255</text>
              <text x={C_X + C_W / 2} y={30} textAnchor="middle" fontSize={11} fontWeight={700} fill={showCodes ? "#b45309" : "#cbd5e1"}>doc-104</text>
              {CODES.map((code, row) => {
                const y = rowY(row);
                const mx = cellX(code);
                return (
                  <g key={row}>
                    <rect x={Q_X} y={y} width={Q_W} height={ROW_H} rx={3} fill={active === 0 ? "#dbeafe" : "#f1f5f9"} stroke={active === 0 ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                    <text x={Q_X + Q_W / 2} y={y + 13} textAnchor="middle" fontSize={11} fill="#1e293b">{`${row + 1}번 조각`}</text>
                    <line x1={Q_X + Q_W + 4} x2={T_X - 4} y1={y + ROW_H / 2} y2={y + ROW_H / 2} stroke={showTable ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                    <rect x={T_X} y={y} width={T_W} height={ROW_H} rx={2} fill={showTable ? (active === 1 ? "#bfdbfe" : "#e0e7ff") : "#ffffff"} stroke={showTable ? "#2563eb" : "#cbd5e1"} strokeWidth={1} strokeDasharray={showTable ? undefined : "3 3"} />
                    {showCodes && (
                      <>
                        <rect x={mx - 2} y={y - 1} width={4} height={ROW_H + 2} fill="#d97706" />
                        <line x1={mx + 2} x2={C_X - 2} y1={y + ROW_H / 2} y2={y + ROW_H / 2} stroke="#d97706" strokeWidth={0.75} strokeDasharray="2 2" />
                        <rect x={C_X} y={y} width={C_W} height={ROW_H} rx={3} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
                        <text x={C_X + C_W / 2} y={y + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e">{code}</text>
                      </>
                    )}
                  </g>
                );
              })}
              <text x={W / 2} y={H - 24} textAnchor="middle" fontSize={11} fontWeight={700} fill={showSum ? "#2563eb" : "#64748b"}>
                {showSum
                  ? "1번 줄[214] + 2번 줄[71] + … + 8번 줄[122] = 근사 거리"
                  : showCodes
                    ? "줄마다 코드가 가리키는 한 칸만 읽습니다"
                    : showTable
                      ? "줄 8개 × 칸 256개 = 2,048개 거리 · 질의당 한 번"
                      : "질의는 원본 값 그대로, 조각 경계만 문서와 같게"}
              </text>
              <text x={W / 2} y={H - 8} textAnchor="middle" fontSize={10} fill="#64748b">
                {showSum ? "후보 하나당 조회 8번 · 덧셈 7번 · 원본 768차원은 복원하지 않음" : "칸 하나 = 한 조각과 한 중심 사이 거리"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
