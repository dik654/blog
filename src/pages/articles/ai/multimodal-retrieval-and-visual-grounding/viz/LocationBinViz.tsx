import SceneShell from "./SceneShell";

/**
 * 본문 대응: #grounding Kosmos-2 문단 — 224px 이미지를 가로·세로 32 bin으로 나눔 → 한 칸 224÷32=7px,
 * 칸 수 32×32=1,024 = location token 수. Box 좌표를 칸으로 양자화하므로 칸보다 작은 위치 차이는 사라짐.
 * 두 box의 pixel 좌표는 가정입니다.
 */
const SIZE = 224;
const BINS = 32;
const BIN_PX = SIZE / BINS;
const SCALE = 196 / SIZE;
const OX = 14;
const OY = 28;
const GRID = "#cbd5e1";
const MUTED = "#64748b";
const BOX_A = "#2563eb";
const BOX_B = "#d97706";
const CELL = "#dc2626";

const BOX_ONE = { x1: 66, y1: 45, x2: 150, y2: 160 } as const;
const BOX_TWO = { x1: 69, y1: 47, x2: 152, y2: 158 } as const;

const bin = (value: number) => Math.floor(value / BIN_PX);
const sx = (value: number) => OX + value * SCALE;
const sy = (value: number) => OY + value * SCALE;
const ratio = (value: number) => (value / BIN_PX).toFixed(1);

const SCENES = [
  { label: "224px를 32칸씩", summary: "한 칸 7px · 칸 1,024개", note: "224px를 가로 32칸으로 나누면 한 칸의 폭은 224÷32=7px이고, 세로도 같습니다. 칸은 모두 32×32=1,024개이며 Kosmos-2는 이 칸 하나하나를 location token 하나로 씁니다." },
  { label: "모서리를 칸으로", summary: "(66,45)→9열·6행 · (150,160)→21열·22행", note: "Box의 좌상단과 우하단 pixel 좌표를 7로 나눈 몫이 각각 몇 번째 칸인지 정합니다(0부터 셈). 모서리 하나가 칸 하나, 즉 location token 하나가 되어 text sequence 안에 들어갑니다." },
  { label: "칸 안의 차이는 사라짐", summary: "다른 box · 같은 token", note: "주황 box는 좌상단이 3px·2px, 우하단이 2px·2px 다르지만 모서리가 같은 칸에 떨어집니다. 그래서 파란 box와 같은 token으로 적히고, 7px 칸보다 세밀한 위치 차이는 표현되지 않습니다." },
] as const;

const W = 360;
const H = 248;

function Box({ box, color, dashed }: { box: { x1: number; y1: number; x2: number; y2: number }; color: string; dashed?: boolean }) {
  return <rect x={sx(box.x1)} y={sy(box.y1)} width={(box.x2 - box.x1) * SCALE} height={(box.y2 - box.y1) * SCALE} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />;
}

function CornerCell({ x, y }: { x: number; y: number }) {
  return <rect x={sx(bin(x) * BIN_PX)} y={sy(bin(y) * BIN_PX)} width={BIN_PX * SCALE} height={BIN_PX * SCALE} fill={CELL} fillOpacity={0.55} stroke={CELL} strokeWidth={1} />;
}

function PanelLines({ lines }: { lines: readonly { text: string; color?: string; bold?: boolean }[] }) {
  return (
    <g>
      {lines.map((line, index) => (
        <text key={`${index}-${line.text}`} x={226} y={40 + index * 22} fontSize={12} fontWeight={line.bold ? 700 : 400} fill={line.color ?? "currentColor"}>
          {line.text}
        </text>
      ))}
    </g>
  );
}

export default function LocationBinViz() {
  return (
    <SceneShell
      eyebrow="Kosmos-2 · location token"
      title="좌표는 7px 칸 번호로 바뀌므로, 칸 안의 차이는 남지 않습니다"
      description="왼쪽은 224px 이미지 위의 32×32 칸, 오른쪽은 box 모서리를 칸 번호로 바꾸는 계산입니다. 빨간 칸이 모서리가 떨어진 칸입니다. Box 좌표는 가정입니다."
      ariaLabel="224 픽셀 이미지를 32 곱하기 32 칸으로 나누고 bounding box 모서리를 칸 번호로 양자화하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={OX} y={18} fontSize={12} fontWeight={700} fill="currentColor">
            224 × 224 px
          </text>
          {Array.from({ length: BINS + 1 }, (_, index) => (
            <g key={index}>
              <line x1={sx(index * BIN_PX)} x2={sx(index * BIN_PX)} y1={sy(0)} y2={sy(SIZE)} stroke={index % 8 === 0 ? MUTED : GRID} strokeWidth={index % 8 === 0 ? 1 : 0.5} />
              <line x1={sx(0)} x2={sx(SIZE)} y1={sy(index * BIN_PX)} y2={sy(index * BIN_PX)} stroke={index % 8 === 0 ? MUTED : GRID} strokeWidth={index % 8 === 0 ? 1 : 0.5} />
            </g>
          ))}
          {active === 0 && (
            <g>
              <rect x={sx(0)} y={sy(0)} width={BIN_PX * SCALE} height={BIN_PX * SCALE} fill={CELL} fillOpacity={0.55} />
              <PanelLines
                lines={[
                  { text: "가로 224 ÷ 32 = 7px", bold: true },
                  { text: "세로도 7px" },
                  { text: "빨간 칸 = 7×7px 한 칸", color: CELL },
                  { text: "" },
                  { text: "32 × 32 = 1,024칸", bold: true },
                  { text: "= location token 1,024개" },
                  { text: "굵은 선은 8칸마다", color: MUTED },
                ]}
              />
            </g>
          )}
          {active >= 1 && (
            <g>
              <Box box={BOX_ONE} color={BOX_A} />
              <CornerCell x={BOX_ONE.x1} y={BOX_ONE.y1} />
              <CornerCell x={BOX_ONE.x2} y={BOX_ONE.y2} />
            </g>
          )}
          {active === 2 && <Box box={BOX_TWO} color={BOX_B} dashed />}
          {active === 1 && (
            <PanelLines
              lines={[
                { text: `좌상단 (${BOX_ONE.x1}, ${BOX_ONE.y1})`, color: BOX_A, bold: true },
                { text: `${BOX_ONE.x1}÷7=${ratio(BOX_ONE.x1)} → ${bin(BOX_ONE.x1)}열` },
                { text: `${BOX_ONE.y1}÷7=${ratio(BOX_ONE.y1)} → ${bin(BOX_ONE.y1)}행` },
                { text: `우하단 (${BOX_ONE.x2}, ${BOX_ONE.y2})`, color: BOX_A, bold: true },
                { text: `${BOX_ONE.x2}÷7=${ratio(BOX_ONE.x2)} → ${bin(BOX_ONE.x2)}열` },
                { text: `${BOX_ONE.y2}÷7=${ratio(BOX_ONE.y2)} → ${bin(BOX_ONE.y2)}행` },
                { text: "모서리 2개 → 칸 2개", color: CELL, bold: true },
              ]}
            />
          )}
          {active === 2 && (
            <PanelLines
              lines={[
                { text: `좌상단 (${BOX_TWO.x1}, ${BOX_TWO.y1})`, color: BOX_B, bold: true },
                { text: `${BOX_TWO.x1}÷7=${ratio(BOX_TWO.x1)} → ${bin(BOX_TWO.x1)}열` },
                { text: `${BOX_TWO.y1}÷7=${ratio(BOX_TWO.y1)} → ${bin(BOX_TWO.y1)}행` },
                { text: `우하단 (${BOX_TWO.x2}, ${BOX_TWO.y2})`, color: BOX_B, bold: true },
                { text: `→ ${bin(BOX_TWO.x2)}열 · ${bin(BOX_TWO.y2)}행` },
                { text: "파란 box와 같은 칸", color: CELL, bold: true },
                { text: "= 같은 token", color: CELL, bold: true },
              ]}
            />
          )}
          <text x={OX} y={H - 6} fontSize={11.5} fill={MUTED}>
            열·행 번호는 0부터 셉니다
          </text>
        </svg>
      )}
    />
  );
}
