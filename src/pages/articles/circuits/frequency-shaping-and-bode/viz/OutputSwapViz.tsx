import SceneShell from "./SceneShell";

/**
 * 본문 대응: #other-output — 같은 1 kΩ·1 µF에서 입력 쪽 부품과 접지 쪽 부품을 바꾸고, 접지 쪽 부품 양끝을 출력으로 읽는다.
 * 저역: 1/√(1+x²) = 0.995·0.707·0.0995 / 고역: x/√(1+x²) = 0.0995·0.707·0.995, x = ωRC = 0.1·1·10.
 */
type Part = "R" | "C";

const SCENES = [
  {
    label: "R 먼저, C 양끝 읽기",
    summary: "저역 통과 · 1/(1+jωRC)",
    series: "R" as Part,
    shunt: "C" as Part,
    ratios: [0.995, 0.707, 0.0995],
    note: "앞에서 본 회로입니다. 느린 반복에서는 축전기 전압이 입력을 거의 따라가 0.995가 남고, 빠른 반복에서는 0.0995로 줄어듭니다.",
  },
  {
    label: "C 먼저, R 양끝 읽기",
    summary: "빠른 쪽을 남김 · jωRC/(1+jωRC)",
    series: "C" as Part,
    shunt: "R" as Part,
    ratios: [0.0995, 0.707, 0.995],
    note: "아주 천천히 바뀌면 축전기 임피던스의 크기가 커서 저항에 전압이 거의 남지 않습니다(0.0995). 빨라지면 저항 출력이 입력에 가까워집니다(0.995). 저역 통과와 반대로 빠른 변화를 남기므로 고역 통과 필터라 부릅니다. 경계 fc의 0.707은 그대로입니다.",
  },
] as const;

const ROWS = ["0.1 fc", "fc", "10 fc"] as const;

function Resistor({ vertical, x, y }: { vertical: boolean; x: number; y: number }) {
  const zig = [0, 1, 2, 3, 4, 5].map((i) => `${vertical ? (i % 2 ? 7 : -7) : 6 + i * 8},${vertical ? 6 + i * 8 : i % 2 ? 7 : -7}`);
  const d = vertical
    ? `M0,0 V2 L${zig.join(" L")} L0,52 V56`
    : `M0,0 H2 L${zig.join(" L")} L52,0 H56`;
  return <path transform={`translate(${x} ${y})`} d={d} stroke="currentColor" strokeWidth="1.25" fill="none" />;
}

function Capacitor({ vertical, x, y }: { vertical: boolean; x: number; y: number }) {
  const d = vertical
    ? "M0,0 V24 M-12,24 H12 M-12,32 H12 M0,32 V56"
    : "M0,0 H24 M24,-12 V12 M32,-12 V12 M32,0 H56";
  return <path transform={`translate(${x} ${y})`} d={d} stroke="currentColor" strokeWidth="1.25" fill="none" />;
}

function Schematic({ series, shunt }: { series: Part; shunt: Part }) {
  return (
    <svg viewBox="0 0 300 168" className="h-auto w-full max-w-[22rem]" role="img" aria-label={`입력 뒤에 ${series}, 접지 쪽에 ${shunt}, ${shunt} 양끝을 출력으로 읽는 연결`}>
      <circle cx="36" cy="84" r="18" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <path d="M27 84 q4.5 -9 9 0 t9 0" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <text x="36" y="150" textAnchor="middle" fontSize="12" fill="currentColor">입력 5 V</text>
      <path d="M36 66 V40 H92 M148 40 H236 M36 102 V128 M36 128 H236 M196 40 V56 M196 112 V128" stroke="currentColor" strokeWidth="1.25" fill="none" />
      {series === "R" ? <Resistor vertical={false} x={92} y={40} /> : <Capacitor vertical={false} x={92} y={40} />}
      <g className="text-blue-600 dark:text-blue-400">
        {shunt === "R" ? <Resistor vertical x={196} y={56} /> : <Capacitor vertical x={196} y={56} />}
      </g>
      <text x="120" y="22" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">{series === "R" ? "R 1 kΩ" : "C 1 µF"}</text>
      <text x="160" y="88" textAnchor="end" fontSize="12" fontWeight="700" fill="#2563eb">{shunt === "R" ? "R 1 kΩ" : "C 1 µF"}</text>
      <circle cx="236" cy="40" r="4" fill="#2563eb" />
      <circle cx="236" cy="128" r="4" fill="#2563eb" />
      <text x="250" y="44" fontSize="12" fill="#2563eb">+</text>
      <text x="250" y="132" fontSize="12" fill="#2563eb">−</text>
      <text x="262" y="88" textAnchor="middle" fontSize="12" fontWeight="700" fill="#2563eb">출력</text>
      <path d="M126 128 V140 M114 140 H138 M118 146 H134 M122 152 H130" stroke="currentColor" strokeWidth="1.25" fill="none" />
      <text x="146" y="162" fontSize="11" fill="#64748b">접지</text>
    </svg>
  );
}

export default function OutputSwapViz() {
  return (
    <SceneShell
      eyebrow="출력 부품 바꾸기"
      title="어느 부품의 전압을 읽느냐가 통과 방향을 정합니다"
      description="부품값은 두 장면 모두 1 kΩ·1 µF입니다. 파랑으로 그린 접지 쪽 부품의 양끝이 출력이고, 오른쪽 막대는 세 속도에서 출력÷입력 진폭 비(0~1)입니다."
      note="무부하 이상 부품의 가정 계산입니다. 실제 측정에서는 부하와 신호원의 저항이 이 수치를 바꿀 수 있습니다."
      ariaLabel="저역 통과와 고역 통과 연결의 출력 위치와 세 속도에서의 진폭 비"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="grid min-w-0 items-center gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-6">
            <div className="flex justify-center">
              <Schematic series={s.series} shunt={s.shunt} />
            </div>
            <div className="space-y-2">
              {ROWS.map((row, i) => (
                <div key={row} className="grid grid-cols-[3.25rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
                  <span className="font-mono">{row}</span>
                  <div className="h-4 min-w-0 rounded-sm bg-muted/50">
                    <div className="h-full rounded-sm" style={{ width: `${s.ratios[i] * 100}%`, backgroundColor: "#2563eb" }} />
                  </div>
                  <span className="text-right font-mono font-bold">{s.ratios[i]}</span>
                </div>
              ))}
              <p className="pt-1 text-xs text-muted-foreground">fc ≈ 159 Hz는 두 연결에서 같습니다.</p>
            </div>
          </div>
        );
      }}
    />
  );
}
