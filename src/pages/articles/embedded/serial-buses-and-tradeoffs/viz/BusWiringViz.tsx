import SceneShell from "./SceneShell";

/**
 * 본문 대응: #spi — I²C는 공유 SDA·SCL 위에서 주소로 센서를 고르고, SPI는 별도 선택 선과 클록·송수신 선을 쓴다.
 * 위치에 뜻은 없고 연결만 뜻이 있습니다. 전원·접지·풀업은 그리지 않습니다.
 */
const SCENES = [
  { label: "I²C", summary: "공유하는 선 2개 · 주소로 고름", bus: "i2c", note: "모든 장치가 같은 두 선에 달립니다. 누구에게 말하는지는 선이 아니라 선 위로 보내는 주소 0x48이 정합니다. 이 방식에서는 주소·응답을 거래마다 세고 풀업과 부하 조건을 확인합니다." },
  { label: "SPI", summary: "클록·송수신 선 + 선택 선", bus: "spi", note: "별도 선택 선으로 장치를 고릅니다. 이 방식에서는 장치가 요구하는 클록 모드와 선택 선 유지 시간을 맞춰야 합니다. 선의 수만 바꿔 같은 센서 거래가 되는 것은 아닙니다." },
] as const;

const W = 360;
const H = 190;
const CTRL = { x: 6, y: 20, w: 70, h: 166 };
const DEV_Y = 108;
const DEV_H = 40;
const A = { x: 112, w: 106 };
const B = { x: 240, w: 106 };

function Box({ x, y, w, h, title, sub, dashed }: { x: number; y: number; w: number; h: number; title: string; sub?: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="none" stroke={dashed ? "#94a3b8" : "#64748b"} strokeWidth={1} strokeDasharray={dashed ? "4 3" : undefined} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 12} textAnchor="middle" fontSize={12} fill="#64748b">{sub}</text>}
    </g>
  );
}

function Wire({ y, label, color, stubs, dir }: { y: number; label: string; color: string; stubs: number[]; dir?: "right" | "left" }) {
  const end = CTRL.x + CTRL.w;
  return (
    <g>
      <line x1={end} x2={B.x + B.w} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      {stubs.map((x) => (
        <g key={x}>
          <line x1={x} x2={x} y1={y} y2={DEV_Y} stroke={color} strokeWidth={1} />
          <circle cx={x} cy={y} r={2.2} fill={color} />
        </g>
      ))}
      {dir === "right" && <path d={`M${end + 44} ${y - 4} L${end + 51} ${y} L${end + 44} ${y + 4} Z`} fill={color} />}
      {dir === "left" && <path d={`M${end + 51} ${y - 4} L${end + 44} ${y} L${end + 51} ${y + 4} Z`} fill={color} />}
      <text x={end + 6} y={y - 4} fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

function SelectWire({ deviceX, y, color, label, dashed }: { deviceX: number; y: number; color: string; label: string; dashed?: boolean }) {
  const end = CTRL.x + CTRL.w;
  const dash = dashed ? "4 3" : undefined;
  return (
    <g>
      <polyline points={`${end},${y} ${deviceX},${y} ${deviceX},${DEV_Y + DEV_H}`} fill="none" stroke={color} strokeWidth={1.25} strokeDasharray={dash} />
      <text x={end + 6} y={y - 3} fontSize={12} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function BusWiringViz() {
  return (
    <SceneShell
      eyebrow="선을 깔아 보면"
      title="누구에게 말하는지를 주소로 고르는가, 선으로 고르는가"
      description="왼쪽이 거래를 시작하는 쪽(컨트롤러), 오른쪽이 장치입니다. 그림의 자리에는 뜻이 없고 연결만 뜻이 있습니다. 두 번째 장치는 설명용 가정이고 전원·접지·풀업은 생략했습니다."
      ariaLabel="I²C의 공유 두 선과 SPI의 클록, 송수신, 선택 선 배선 비교"
      scenes={SCENES}
      render={(active) => {
        const { bus, label, summary } = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${label}: ${summary}`}>
            <Box x={CTRL.x} y={CTRL.y} w={CTRL.w} h={CTRL.h} title="컨트롤러" />
            {bus === "i2c" ? (
              <g>
                <Wire y={44} label="SDA 데이터" color="#2563eb" stubs={[A.x + 34, B.x + 34]} />
                <Wire y={76} label="SCL 박자" color="#64748b" stubs={[A.x + 70, B.x + 70]} />
                <Box x={A.x} y={DEV_Y} w={A.w} h={DEV_H} title="센서 0x48" sub="주소로 선택" />
                <Box x={B.x} y={DEV_Y} w={B.w} h={DEV_H} title="다른 장치" sub="(가정)" dashed />
              </g>
            ) : (
              <g>
                <Wire y={32} label="클록" color="#64748b" dir="right" stubs={[A.x + 24, B.x + 24]} />
                <Wire y={56} label="송신" color="#2563eb" dir="right" stubs={[A.x + 53, B.x + 53]} />
                <Wire y={80} label="수신" color="#16a34a" dir="left" stubs={[A.x + 82, B.x + 82]} />
                <Box x={A.x} y={DEV_Y} w={A.w} h={DEV_H} title="SPI 장치" sub="선택 선으로 고름" />
                <Box x={B.x} y={DEV_Y} w={B.w} h={DEV_H} title="다른 장치" sub="(가정)" dashed />
                <SelectWire deviceX={A.x + 53} y={164} color="#d97706" label="선택 1" />
                <SelectWire deviceX={B.x + 53} y={180} color="#94a3b8" label="선택 2 (가정)" dashed />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
