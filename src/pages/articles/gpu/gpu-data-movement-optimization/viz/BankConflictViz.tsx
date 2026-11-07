import SceneShell from "./SceneShell";

/**
 * 본문 대응: #shared-to-register — bank conflict. SM당 128 B/clock = bank 32개 × 4 B.
 * 8×8 fp16 행렬 = 128 B, 행 하나 16 B = bank 4개. 흩어지면 128 ÷ 128 = 1 clock(이상 조건), 8행이 같은 bank면 8 clock.
 */
const SCENES = [
  { label: "Bank 32칸", summary: "32 × 4 B = 128 B/clock", note: "Bank는 shared memory를 나눈 칸으로, 칸 하나가 clock마다 4 B를 내줍니다. 8×8 fp16의 한 행은 16 B라 bank 4개에 걸칩니다." },
  { label: "8개 행이 흩어지면", summary: "128 B ÷ 128 B/clock = 1 clock", note: "8개 행이 겹치지 않으면 bank 32개를 한 번씩 써서 행렬 128 B가 한 clock에 나옵니다. 이것은 conflict-free 이상 조건의 상한이고, 행을 놓은 자리는 설명용 배치입니다(가정)." },
  { label: "8개 행이 같은 bank면", summary: "1 clock → 8 clock", note: "같은 bank는 한 clock에 한 번만 읽히므로 행이 한 층씩 차례를 기다립니다. 명령 하나가 8 clock에 걸쳐 실행되어 명령 수를 줄인 이득이 사라집니다." },
] as const;

const X0 = 38;
const CW = 9.4;
const CH = 15;
const Y0 = 22;
const COLORS: readonly string[] = ["#2563eb", "#d97706"];

function RowBlock({ startBank, clock, row, muted = false }: { startBank: number; clock: number; row: number; muted?: boolean }) {
  const x = X0 + startBank * CW;
  const y = Y0 + clock * CH;
  return (
    <g opacity={muted ? 0.4 : 1}>
      <rect x={x + 0.5} y={y + 0.5} width={CW * 4 - 1} height={CH - 1} fill={COLORS[row % 2]} fillOpacity={0.85} />
      <text x={x + CW * 2} y={y + 11.5} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">{`행${row}`}</text>
    </g>
  );
}

export default function BankConflictViz() {
  return (
    <SceneShell
      eyebrow="Bank conflict"
      title="8개 행이 같은 bank에 놓이면 명령 하나가 8 clock으로 늘어납니다"
      description="8×8 행렬 하나(128 B)를 읽는 ldmatrix 한 번을 봅니다. 가로가 bank 32개, 세로가 clock입니다. 색 블록 하나가 행렬의 한 행(16 B)이고, 아래로 쌓일수록 clock이 더 걸립니다."
      ariaLabel="8개 행이 서로 다른 bank에 놓일 때와 같은 bank에 놓일 때의 clock 수 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 346 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={13} fontSize={11} fill="#64748b">bank 0</text>
          <text x={X0 + 32 * CW} y={13} textAnchor="end" fontSize={11} fill="#64748b">bank 31</text>
          {Array.from({ length: 8 }, (_, clock) => (
            <text key={clock} x={X0 - 6} y={Y0 + clock * CH + 11.5} textAnchor="end" fontSize={10} fill="#64748b">{`c${clock + 1}`}</text>
          ))}
          {Array.from({ length: 8 }, (_, clock) =>
            Array.from({ length: 32 }, (_unused, bank) => (
              <rect key={`${clock}-${bank}`} x={X0 + bank * CW} y={Y0 + clock * CH} width={CW} height={CH} fill="none" stroke="#94a3b8" strokeOpacity={0.25} strokeWidth={0.5} />
            )),
          )}
          {active === 0 && <RowBlock startBank={0} clock={0} row={0} />}
          {active === 1 && Array.from({ length: 8 }, (_, row) => <RowBlock key={row} startBank={row * 4} clock={0} row={row} />)}
          {active === 2 && Array.from({ length: 8 }, (_, row) => <RowBlock key={row} startBank={0} clock={row} row={row} />)}
        </svg>
      )}
    />
  );
}
