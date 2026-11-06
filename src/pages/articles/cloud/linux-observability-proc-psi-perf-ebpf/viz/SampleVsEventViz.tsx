import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tools-trace — 같은 4초를 카운터·perf 표본·bpftrace 이벤트로 읽는다.
 * 칸 80개(4 CPU × 20번 찍기). 폭주 1초 20칸 = report-gen, 나머지 60칸의 20% = 12칸 = 웹 앱(위치는 가정).
 * 바쁜 칸 32/80 = 40%, report-gen 20/32 = 62.5%.
 */
const ROWS = 4;
const COLS = 20;
const PER_SECOND = 5;
const CELL = 15;
const GX = 44;
const GY = 26;
const RH = 15;

type Kind = "batch" | "web" | "idle";
const kindAt = (row: number, col: number): Kind => (col < PER_SECOND ? "batch" : (col + row * 2) % 5 === 0 ? "web" : "idle");
const CELLS = Array.from({ length: ROWS }, (_, row) => Array.from({ length: COLS }, (_, col) => ({ row, col, kind: kindAt(row, col) }))).flat();
const BATCH = CELLS.filter((cell) => cell.kind === "batch").length;
const WEB = CELLS.filter((cell) => cell.kind === "web").length;
const BUSY = BATCH + WEB;
const SHARE = (BATCH / BUSY) * 100;
const EVENT_TICKS = Array.from({ length: 12 }, (_, i) => GX + 4 + i * 6);

const SCENES = [
  { label: "카운터는 얼마나까지만", summary: `바쁜 칸 ${BUSY} ÷ ${CELLS.length} = 40%`, note: "/proc/stat은 바쁜 양만 말하고 어느 프로세스인지 말하지 않습니다. 그래서 칸은 모두 같은 회색입니다. top은 1초 평균이라 1초 폭주를 다른 프로세스와 섞어 보여 줍니다." },
  { label: "perf · 일정 간격으로 찍어 이름을 셉니다", summary: `report-gen ${BATCH} ÷ 바쁜 칸 ${BUSY} = ${SHARE}%`, note: "표본화는 일정 빈도로 그 순간 CPU에 있던 함수를 적는 일입니다. (가정) 폭주 작업의 프로세스가 report-gen입니다. 표본은 폭주 1초에 몰리고, 쉬는 칸을 빈 칸으로 두면 본문의 '60% 안팎(가정)'과 가까운 비율이 나옵니다." },
  { label: "bpftrace · 이벤트가 날 때 셉니다", summary: "폭주 1초에 같은 CSV 재열기", note: "시간 간격이 아니라 파일을 여는 시스템 콜 openat이 불릴 때마다 셉니다. (가정) 폭주하는 1초마다 report-gen이 같은 CSV 파일 수십 개를 다시 여는 것이 보입니다. 눈금은 몰린 자리만 나타내며 실제 횟수가 아닙니다." },
] as const;

function fillOf(kind: Kind, active: number) {
  if (kind === "idle") return "none";
  if (active === 0) return "#94a3b8";
  return kind === "batch" ? "#d97706" : "#2563eb";
}

export default function SampleVsEventViz() {
  return (
    <SceneShell
      eyebrow="카운터 · 표본 · 이벤트"
      title="같은 4초를 세 방법으로 읽으면 얻는 답이 다릅니다"
      description="가로는 시간, 세로는 CPU입니다. 칸은 CPU마다 1초에 5번 찍은 것으로, 실제 99 Hz보다 성기게 그린 가정입니다. 웹 앱 칸의 위치도 그림용 가정입니다."
      ariaLabel="네 CPU의 4초를 카운터, perf 표본, bpftrace 이벤트로 읽는 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 1, 2, 3].map((second) => (
            <text key={second} x={GX + (second + 0.5) * PER_SECOND * CELL} y={18} textAnchor="middle" fontSize={10} fill="#64748b">{second === 0 ? "1초 · 폭주" : `${second + 1}초`}</text>
          ))}
          {[0, 1, 2, 3].map((row) => (
            <text key={row} x={38} y={GY + row * RH + 11} textAnchor="end" fontSize={9.5} fill="#64748b">CPU{row}</text>
          ))}
          <g opacity={active === 2 ? 0.45 : 1} className="transition-opacity duration-300 motion-reduce:transition-none">
            {CELLS.map(({ row, col, kind }) => (
              <g key={`${row}-${col}`}>
                <rect x={GX + col * CELL + 1} y={GY + row * RH + 1} width={CELL - 2} height={RH - 2} rx={2} fill={fillOf(kind, active)} stroke="#94a3b8" strokeWidth={kind === "idle" ? 0.5 : 0} />
                {active > 0 && kind !== "idle" && (
                  <text x={GX + col * CELL + CELL / 2} y={GY + row * RH + 11} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#ffffff">{kind === "batch" ? "R" : "W"}</text>
                )}
              </g>
            ))}
          </g>
          <g opacity={active === 2 ? 1 : 0.3} className="transition-opacity duration-300 motion-reduce:transition-none">
            <text x={38} y={107} textAnchor="end" fontSize={9.5} fill="#64748b">openat</text>
            <line x1={GX} x2={GX + COLS * CELL} y1={110} y2={110} stroke="#94a3b8" strokeWidth={1} />
            {EVENT_TICKS.map((x) => (
              <line key={x} x1={x} x2={x} y1={97} y2={110} stroke="#d97706" strokeWidth={1.25} />
            ))}
          </g>
          <g fontSize={10}>
            <rect x={GX} y={128} width={11} height={11} rx={2} fill={active === 0 ? "#94a3b8" : "#d97706"} />
            <text x={GX + 15} y={138} className="fill-foreground">{active === 0 ? "바쁨 (이름 모름)" : "R report-gen"}</text>
            {active > 0 && (
              <>
                <rect x={GX + 100} y={128} width={11} height={11} rx={2} fill="#2563eb" />
                <text x={GX + 115} y={138} className="fill-foreground">W 웹 앱</text>
              </>
            )}
            <rect x={GX + 180} y={128} width={11} height={11} rx={2} fill="none" stroke="#94a3b8" strokeWidth={0.5} />
            <text x={GX + 195} y={138} className="fill-foreground">쉬는 칸</text>
          </g>
          <text x={GX} y={160} fontSize={10.5} fontWeight={700} className="fill-foreground">{active === 0 ? "답: 얼마나 바빴나" : active === 1 ? "답: 어느 코드가" : "답: 어떤 이벤트가"}</text>
        </svg>
      )}
    />
  );
}
