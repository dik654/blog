import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-enable, #source-dispatch — 핀 번호 2·사건 비트 11·IRQ 번호 13은 다른 위치를 고른다.
 * 비트 위치 = 4×(gpio%8) + 3, 마스크 = 8<<(4×2) = 8<<8 = 0x800.
 */
const SCENES = [
  { label: "한 핀에 네 칸", summary: "4×2 = 8 → 8번 비트부터", note: "GPIO 사건 표는 핀마다 네 비트씩 배정합니다. 앞의 GPIO0·GPIO1이 네 칸씩 차지하므로 GPIO2의 네 칸은 8번 비트에서 시작합니다." },
  { label: "상승 에지는 네 칸 중 어디", summary: "값 8 = 1000₂ → +3 자리", note: "상승 에지 값 8을 이진수로 쓰면 1000입니다. 네 칸 가운데 가장 위쪽 칸(+3)이 1입니다." },
  { label: "마스크로 찍습니다", summary: "4×2+3 = 11 · 8<<8 = 0x800", note: "마스크는 고를 비트만 1로 둔 값입니다. 8을 8칸 왼쪽으로 밀면 11번 비트만 1인 0x800이 됩니다. SDK가 INTR[0]에 쓰는 값도 이것입니다." },
  { label: "세 번호를 나눕니다", summary: "핀 2 · 비트 11 · IRQ 13", note: "IRQ 번호는 NVIC로 가는 요청의 번호이고 핀 번호와 사건 비트 번호와는 다른 표에 있습니다. 숫자 11이 IRQ 표에도 있지만 GPIO2의 사건 비트와는 다른 위치입니다." },
] as const;

const ACCENT = "#2563eb";
const CELL = 20;
const bitX = (bit: number) => 12 + (15 - bit) * CELL + Math.floor((15 - bit) / 4) * 4;
const BITS = Array.from({ length: 16 }, (_, index) => 15 - index);
const PINS = [3, 2, 1, 0];
const VALUES = [8, 4, 2, 1];
const IRQS = [11, 12, 13, 14, 15];

function Tile({ x, title, value }: { x: number; title: string; value: string }) {
  return (
    <g>
      <rect x={x} y={102} width={96} height={46} rx={8} fill="none" stroke={ACCENT} strokeWidth={1} />
      <text x={x + 48} y={120} textAnchor="middle" fontSize={11} fill="#64748b">{title}</text>
      <text x={x + 48} y={139} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="monospace" fill={ACCENT}>{value}</text>
    </g>
  );
}

export default function EventBitMapViz() {
  return (
    <SceneShell
      eyebrow="GPIO2 상승 에지의 자리"
      title="핀 2의 상승 에지가 왜 11번 비트이고 왜 IRQ 13이 아닐까"
      description="가로 칸은 GPIO 사건 표의 첫 레지스터 INTR[0]의 비트이며 오른쪽이 0번입니다. GPIO4~7이 쓰는 16번 비트 위쪽은 생략했습니다."
      ariaLabel="INTR 레지스터의 비트 배치와 GPIO2 상승 에지 위치, IRQ 번호의 구분"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 232" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {PINS.map((pin) => (
            <text key={pin} x={bitX(pin * 4 + 3) + 2 * CELL} y={16} textAnchor="middle" fontSize={12} fontWeight={pin === 2 ? 700 : 400} fill={pin === 2 ? ACCENT : "#64748b"}>
              GPIO{pin}
            </text>
          ))}
          {BITS.map((bit) => {
            const inPin = bit >= 8 && bit <= 11;
            const lit = active >= 1 && bit === 11;
            return (
              <g key={bit}>
                <rect x={bitX(bit) + 1} y={24} width={CELL - 2} height={26} rx={3} fill={lit ? ACCENT : inPin ? "#2563eb22" : "none"} stroke={inPin ? ACCENT : "#94a3b8"} strokeWidth={1} />
                {active >= 2 && (
                  <text x={bitX(bit) + CELL / 2} y={42} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={lit ? "#ffffff" : "#94a3b8"}>{lit ? 1 : 0}</text>
                )}
                <text x={bitX(bit) + CELL / 2} y={64} textAnchor="middle" fontSize={11} fontWeight={lit ? 700 : 400} fontFamily="monospace" fill={lit ? ACCENT : "#64748b"}>{bit}</text>
              </g>
            );
          })}
          <text x={12} y={84} fontSize={11} fill="#64748b">↑ INTR[0]의 비트 번호</text>

          {active === 0 && (
            <>
              <Tile x={22} title="GPIO0" value="0~3번" />
              <Tile x={128} title="GPIO1" value="4~7번" />
              <Tile x={234} title="GPIO2" value="8~11번" />
            </>
          )}
          {active === 1 &&
            VALUES.map((value, index) => (
              <g key={value}>
                <rect x={92 + index * 46} y={100} width={40} height={30} rx={6} fill={value === 8 ? ACCENT : "none"} stroke={value === 8 ? ACCENT : "#94a3b8"} strokeWidth={1} />
                <text x={112 + index * 46} y={120} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="monospace" fill={value === 8 ? "#ffffff" : "#94a3b8"}>{value === 8 ? 1 : 0}</text>
                <text x={112 + index * 46} y={145} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={value === 8 ? ACCENT : "#64748b"}>+{3 - index}</text>
              </g>
            ))}
          {active === 2 && (
            <>
              <Tile x={22} title="비트 위치" value="4×2+3=11" />
              <Tile x={128} title="민 값" value="8<<8" />
              <Tile x={234} title="마스크" value="0x800" />
            </>
          )}
          {active === 3 && (
            <>
              <Tile x={22} title="핀 번호" value="2" />
              <Tile x={128} title="사건 비트" value="11" />
              <Tile x={234} title="IRQ 번호" value="13" />
            </>
          )}

          <text x={12} y={174} fontSize={11} fill={active === 3 ? "#64748b" : "#cbd5e1"}>NVIC로 가는 IRQ 번호 표 (일부)</text>
          {IRQS.map((irq, index) => {
            const on = active === 3 && irq === 13;
            return (
              <g key={irq}>
                <rect x={12 + index * 44} y={182} width={40} height={26} rx={3} fill={on ? ACCENT : "none"} stroke={active === 3 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} />
                <text x={32 + index * 44} y={200} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={on ? "#ffffff" : active === 3 ? "#64748b" : "#cbd5e1"}>{irq}</text>
              </g>
            );
          })}
          <text x={12} y={226} fontSize={11} fontWeight={700} fill={active === 3 ? ACCENT : "transparent"}>13 = IO_IRQ_BANK0</text>
        </svg>
      )}
    />
  );
}
