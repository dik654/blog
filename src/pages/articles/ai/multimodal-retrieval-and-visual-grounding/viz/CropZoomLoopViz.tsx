import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vision-loop — “표 3행의 값은?”을 전체 페이지로 보면 글자가 작을 수 있음 → 표 영역을 찾고
 * 잘라 확대하면 같은 pixel 수를 중요한 영역에 더 많이 씀. 반복은 종료 조건에서 멈춤.
 * 모델이 한 번에 보는 입력을 8×8=64칸, 표가 전체 페이지에서 3×3=9칸을 차지한다고 가정합니다(정사각형이라 확대해도 가로·세로 비율이 같음).
 */
const GRID = "#94a3b8";
const INK = "#64748b";
const ACCENT = "#2563eb";
const TARGET = "#d97706";
const STOP = "#059669";

const N = 8;
const C = 20;
const OX = 14;
const OY = 30;
const SIDE = N * C;
const TABLE = { col: 2, row: 5, cols: 3, rows: 3 } as const;

const SCENES = [
  { label: "전체 페이지", summary: "입력 64칸 중 표는 9칸", note: "모델이 한 번에 보는 pixel 수가 정해져 있다고 가정하고 그것을 8×8=64칸으로 그렸습니다. 페이지 전체를 넣으면 표는 그중 3×3=9칸에만 담겨, 3행의 글자가 몇 pixel 안 되는 크기로 작아질 수 있습니다." },
  { label: "① 영역 찾기", summary: "region = ground(image, question)", note: "Grounding이 질문과 관련된 표 영역을 bounding box로 찾습니다. 아직 답을 읽지 않았고, 다음에 어디를 크게 볼지만 정했습니다." },
  { label: "② 잘라서 확대", summary: "같은 64칸을 모두 표에", note: "찾은 영역만 잘라 같은 입력 크기로 확대합니다. 이제 64칸 전부가 표에 쓰여 3행 글자가 훨씬 많은 pixel로 보입니다. 입력 크기는 그대로이고 배분만 바뀌었습니다." },
  { label: "③ 다시 읽고 멈출지 판단", summary: "멈춤 조건 중 하나 → 답 · 아니면 ①로", note: "확대한 영역으로 다시 답하고 근거가 충분한지 봅니다. 확신도가 기준을 넘거나, 새 영역이 이전보다 작아지지 않거나, 확신도가 더 오르지 않거나, 최대 반복 횟수에 닿으면 멈춥니다. 아니면 더 좁힐 영역을 찾으러 ①로 돌아갑니다." },
] as const;

const W = 360;
const H = 220;

function InputGrid() {
  return (
    <g>
      <rect x={OX} y={OY} width={SIDE} height={SIDE} fill="none" stroke={INK} strokeWidth={1} />
      {Array.from({ length: N - 1 }, (_, index) => (
        <g key={index}>
          <line x1={OX + (index + 1) * C} x2={OX + (index + 1) * C} y1={OY} y2={OY + SIDE} stroke={GRID} strokeWidth={0.5} strokeDasharray="2 2" />
          <line x1={OX} x2={OX + SIDE} y1={OY + (index + 1) * C} y2={OY + (index + 1) * C} stroke={GRID} strokeWidth={0.5} strokeDasharray="2 2" />
        </g>
      ))}
    </g>
  );
}

function FullPage({ boxed }: { boxed: boolean }) {
  const tx = OX + TABLE.col * C;
  const ty = OY + TABLE.row * C;
  const tw = TABLE.cols * C;
  const th = TABLE.rows * C;
  return (
    <g>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((line) => (
        <rect key={line} x={OX + 14} y={OY + 12 + line * 9} width={line % 3 === 2 ? 90 : 128} height={3} fill={INK} fillOpacity={0.35} />
      ))}
      <rect x={tx} y={ty} width={tw} height={th} fill={TARGET} fillOpacity={0.14} stroke={TARGET} strokeWidth={1} />
      {[1, 2, 3, 4].map((row) => (
        <line key={row} x1={tx} x2={tx + tw} y1={ty + row * (th / 5)} y2={ty + row * (th / 5)} stroke={TARGET} strokeWidth={0.5} />
      ))}
      {boxed && <rect x={tx - 4} y={ty - 4} width={tw + 8} height={th + 8} fill="none" stroke={ACCENT} strokeWidth={1.25} strokeDasharray="4 3" />}
      {boxed && (
        <text x={tx + tw + 8} y={ty - 6} fontSize={11.5} fontWeight={700} fill={ACCENT}>
          region
        </text>
      )}
    </g>
  );
}

function CroppedTable() {
  const rowH = SIDE / 5;
  return (
    <g>
      <rect x={OX} y={OY} width={SIDE} height={SIDE} fill={TARGET} fillOpacity={0.1} />
      {[1, 2, 3, 4].map((row) => (
        <line key={row} x1={OX} x2={OX + SIDE} y1={OY + row * rowH} y2={OY + row * rowH} stroke={TARGET} strokeWidth={1} />
      ))}
      <line x1={OX + SIDE / 2} x2={OX + SIDE / 2} y1={OY} y2={OY + SIDE} stroke={TARGET} strokeWidth={1} />
      {[1, 2, 3, 4].map((row) => (
        <text key={row} x={OX + 10} y={OY + row * rowH + rowH / 2 + 5} fontSize={13} fontWeight={row === 3 ? 700 : 400} fill={row === 3 ? TARGET : INK}>
          {row}행
        </text>
      ))}
      <rect x={OX + 2} y={OY + 3 * rowH + 2} width={SIDE - 4} height={rowH - 4} fill="none" stroke={ACCENT} strokeWidth={1.25} />
    </g>
  );
}

function Panel({ lines }: { lines: readonly { text: string; color?: string; bold?: boolean }[] }) {
  return (
    <g>
      {lines.map((line, index) => (
        <text key={`${index}-${line.text}`} x={192} y={46 + index * 22} fontSize={12} fontWeight={line.bold ? 700 : 400} fill={line.color ?? "currentColor"}>
          {line.text}
        </text>
      ))}
    </g>
  );
}

function StopBranch() {
  const conditions = ["확신도가 기준을 넘음", "영역이 더 작아지지 않음", "확신도가 더 오르지 않음", "최대 반복 도달"];
  return (
    <g>
      <text x={192} y={40} fontSize={12} fontWeight={700} fill="currentColor">
        하나라도 맞으면 멈춤
      </text>
      {conditions.map((condition, index) => (
        <g key={condition}>
          <rect x={192} y={50 + index * 26} width={156} height={20} rx={4} fill="none" stroke={STOP} strokeWidth={1} />
          <text x={200} y={64 + index * 26} fontSize={11.5} fill={STOP}>
            {condition}
          </text>
        </g>
      ))}
      <text x={192} y={170} fontSize={12} fontWeight={700} fill={STOP}>
        예 → 답을 반환
      </text>
      <text x={192} y={192} fontSize={12} fontWeight={700} fill={ACCENT}>
        아니오 → ①로 돌아가 더 좁힘
      </text>
    </g>
  );
}

export default function CropZoomLoopViz() {
  return (
    <SceneShell
      eyebrow="찾고 · 자르고 · 다시 읽기"
      title="입력 크기는 그대로 두고, 그 pixel을 표에 몰아 줍니다"
      description="왼쪽 정사각형이 모델이 한 번에 보는 입력이고 점선 칸이 그 pixel 묶음입니다. 주황 영역이 질문 ‘표 3행의 값은?’의 표입니다. 64칸과 표가 차지하는 9칸은 가정입니다."
      ariaLabel="전체 페이지에서 표 영역을 찾고 잘라 확대한 뒤 종료 조건으로 반복을 멈추는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={OX} y={20} fontSize={12} fontWeight={700} fill="currentColor">
            {active <= 1 ? "입력 = 페이지 전체" : "입력 = 잘라 낸 표"}
          </text>
          {active <= 1 ? <FullPage boxed={active === 1} /> : <CroppedTable />}
          <InputGrid />
          {active === 0 && (
            <Panel
              lines={[
                { text: "입력 칸 8 × 8 = 64", bold: true },
                { text: `표에 쓰인 칸 ${TABLE.cols} × ${TABLE.rows} = ${TABLE.cols * TABLE.rows}`, color: TARGET, bold: true },
                { text: "3행은 그 안의 한 줄", color: INK },
                { text: "→ 글자가 작을 수 있음", color: INK },
              ]}
            />
          )}
          {active === 1 && (
            <Panel
              lines={[
                { text: "① ground", color: ACCENT, bold: true },
                { text: "질문과 관련된 표를" },
                { text: "box로 찾음" },
                { text: "아직 답은 읽지 않음", color: INK },
              ]}
            />
          )}
          {active === 2 && (
            <Panel
              lines={[
                { text: "② crop_and_zoom", color: ACCENT, bold: true },
                { text: "입력 칸 64 그대로", bold: true },
                { text: `표에 쓰인 칸 ${TABLE.cols * TABLE.rows} → 64`, color: TARGET, bold: true },
                { text: "3행 글자도 가로·세로", color: INK },
                { text: "8 ÷ 3 ≈ 2.7배로 커짐", color: INK },
              ]}
            />
          )}
          {active === 3 && <StopBranch />}
        </svg>
      )}
    />
  );
}
