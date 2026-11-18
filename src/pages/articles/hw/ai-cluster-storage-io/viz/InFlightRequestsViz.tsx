import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 8GiB/s를 요청 수와 경로 안 요청 수로 바꾼다.
 * 8,192MiB/s ÷ 4MiB = 2,048/s, client 16개면 각 512MiB/s·128/s.
 * Little's law: 2,048/s × 0.004s = 8.192. 4KiB면 8,192MiB/s ÷ 4KiB = 2,097,152/s(1,024배).
 */
const TOTAL_MIB = 8 * 1024;
const REQ_MIB = 4;
const CLIENTS = 16;
const IOPS = TOTAL_MIB / REQ_MIB;
const PER_CLIENT_MIB = TOTAL_MIB / CLIENTS;
const PER_CLIENT_IOPS = IOPS / CLIENTS;
const LATENCY_S = 0.004;
const IN_FLIGHT = IOPS * LATENCY_S;
const GAP_MS = 1000 / IOPS;
const SMALL_IOPS = (TOTAL_MIB * 1024) / 4;
const RATIO = SMALL_IOPS / IOPS;

const SCENES = [
  {
    label: "전체 요구를 client로 나눕니다",
    summary: `${CLIENTS} × ${PER_CLIENT_IOPS}/s = ${IOPS.toLocaleString("en-US")}/s`,
    note: `(가정) 합계 8GiB/s = ${TOTAL_MIB.toLocaleString("en-US")}MiB/s를 client ${CLIENTS}개가 나누면 하나당 ${PER_CLIENT_MIB}MiB/s, 4MiB 요청으로 초당 ${PER_CLIENT_IOPS}개입니다. client 수를 같이 적어야 한 process의 요구인지 전체 요구인지 구분됩니다.`,
  },
  {
    label: "4ms 동안 경로 안에 머무는 요청",
    summary: `${IOPS.toLocaleString("en-US")}/s × 0.004s ≈ ${IN_FLIGHT.toFixed(1)}`,
    note: `초당 ${IOPS.toLocaleString("en-US")}개면 평균 약 ${GAP_MS.toFixed(2)}ms마다 요청 하나가 들어갑니다. 각 요청이 4ms 머물면 경로 안에는 평균 약 ${IN_FLIGHT.toFixed(1)}개가 겹쳐 있습니다(Little's law). iodepth=8을 정답으로 고르라는 뜻이 아니라 achieved depth를 확인할 첫 검산값입니다.`,
  },
  {
    label: "요청을 4KiB로 줄이면",
    summary: `${SMALL_IOPS.toLocaleString("en-US")}/s · ${RATIO.toLocaleString("en-US")}배`,
    note: `4MiB 요청 하나는 4KiB 요청 ${RATIO.toLocaleString("en-US")}개와 같은 byte입니다. 같은 8GiB/s라도 초당 약 210만 개를 처리해야 하므로 처리량은 같고 문제의 모양이 달라집니다.`,
  },
] as const;

const W = 360;
const H = 170;

function Clients() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="client 16개가 각각 초당 128개 요청을 맡는 그림">
      <rect x={20} y={8} width={320} height={26} rx={6} fill="#eff6ff" stroke="#2563eb" strokeWidth={1} />
      <text x={180} y={25} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">합계 8GiB/s · 4MiB 요청 2,048/s</text>
      {Array.from({ length: CLIENTS }, (_, index) => {
        const col = index % 8;
        const row = Math.floor(index / 8);
        const x = 20 + col * 40.5;
        const y = 58 + row * 54;
        return (
          <g key={index}>
            <line x1={x + 17} x2={x + 17} y1={34} y2={y} stroke="#cbd5e1" strokeWidth={1} opacity={row === 0 ? 1 : 0} />
            <rect x={x} y={y} width={34} height={44} rx={4} fill="#ffffff" stroke="#94a3b8" strokeWidth={1} />
            <text x={x + 17} y={y + 19} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#0f172a">512</text>
            <text x={x + 17} y={y + 34} textAnchor="middle" fontSize={9.5} fill="#2563eb">128/s</text>
          </g>
        );
      })}
      <text x={180} y={H - 2} textAnchor="middle" fontSize={10} fill="#64748b">칸 하나 = client 하나 · 위 MiB/s · 아래 4MiB 요청 수</text>
    </svg>
  );
}

function Pipe() {
  const left = 30;
  const right = 330;
  const span = right - left;
  const count = Math.ceil(IN_FLIGHT);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="4ms 길이 경로 안에 요청 약 8.2개가 겹쳐 있는 그림">
      <text x={left} y={22} fontSize={10} fill="#64748b">제출</text>
      <text x={right} y={22} textAnchor="end" fontSize={10} fill="#64748b">완료</text>
      <rect x={left} y={36} width={span} height={56} rx={6} fill="#f8fafc" stroke="#94a3b8" strokeWidth={1} />
      {Array.from({ length: count }, (_, index) => {
        const frac = Math.min(1, IN_FLIGHT - index);
        const slot = span / IN_FLIGHT;
        const x = left + 3 + index * slot;
        return (
          <rect key={index} x={x} y={44} width={Math.max(2, slot * frac - 4)} height={40} rx={3} fill="#2563eb" opacity={frac < 1 ? 0.35 : 0.8} />
        );
      })}
      <line x1={left} x2={right} y1={108} y2={108} stroke="#64748b" strokeWidth={1} />
      <line x1={left} x2={left} y1={103} y2={113} stroke="#64748b" strokeWidth={1} />
      <line x1={right} x2={right} y1={103} y2={113} stroke="#64748b" strokeWidth={1} />
      <text x={(left + right) / 2} y={124} textAnchor="middle" fontSize={10.5} fill="#0f172a">평균 응답 시간 L = 4ms</text>
      <text x={(left + right) / 2} y={146} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
        {`약 ${GAP_MS.toFixed(2)}ms마다 하나씩 → 경로 안 평균 ${IN_FLIGHT.toFixed(1)}개`}
      </text>
      <text x={(left + right) / 2} y={164} textAnchor="middle" fontSize={9} fill="#64748b">막대 하나 = 진행 중인 4MiB 요청 · 마지막 옅은 칸 = 0.2개</text>
    </svg>
  );
}

function Split() {
  const cell = 3.2;
  const gridX = 196;
  const gridY = 20;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="4MiB 요청 하나가 4KiB 요청 1,024개와 같은 크기임을 보이는 그림">
      <rect x={34} y={gridY} width={32 * cell} height={32 * cell} rx={2} fill="#2563eb" opacity={0.8} />
      <text x={34 + 16 * cell} y={gridY + 32 * cell + 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#0f172a">4MiB 요청 1개</text>
      <text x={34 + 16 * cell} y={gridY + 32 * cell + 30} textAnchor="middle" fontSize={9.5} fill="#64748b">2,048/s</text>
      <text x={(34 + 32 * cell + gridX) / 2} y={gridY + 16 * cell + 4} textAnchor="middle" fontSize={14} fill="#64748b">=</text>
      {Array.from({ length: 1024 }, (_, index) => (
        <rect key={index} x={gridX + (index % 32) * cell} y={gridY + Math.floor(index / 32) * cell} width={cell - 0.8} height={cell - 0.8} fill="#d97706" opacity={0.75} />
      ))}
      <text x={gridX + 16 * cell} y={gridY + 32 * cell + 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#0f172a">4KiB 요청 1,024개</text>
      <text x={gridX + 16 * cell} y={gridY + 32 * cell + 30} textAnchor="middle" fontSize={9.5} fill="#b45309">{`${SMALL_IOPS.toLocaleString("en-US")}/s`}</text>
      <text x={180} y={H - 4} textAnchor="middle" fontSize={9} fill="#64748b">같은 8GiB/s · 작은 칸 하나 = 4KiB 요청 하나</text>
    </svg>
  );
}

export default function InFlightRequestsViz() {
  return (
    <SceneShell
      eyebrow="처리량을 요청 수로"
      title="8GiB/s는 초당 2,048개, 경로 안 약 8.2개의 요청입니다"
      description="3절의 설명용 숫자(client 16개·4MiB 요청·평균 4ms)를 그대로 씁니다(가정). IOPS는 초당 완료되는 요청 수입니다."
      ariaLabel="8GiB/s를 client별 요청 수, 경로 안 요청 수, 4KiB 요청 수로 바꾸는 계산"
      scenes={SCENES}
      render={(active) => (active === 0 ? <Clients /> : active === 1 ? <Pipe /> : <Split />)}
    />
  );
}
