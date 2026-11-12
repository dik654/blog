import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — x=2, W=1, b=0(가정)에서 z=2, a≈0.880797.
 * 뒤에서 dL/da=3 → ×0.104994 → dL/dz≈0.314981 → dL/db≈0.314981, dL/dW = 0.314981 × x(2) ≈ 0.629962.
 */
const W = 360;
const H = 214;
const FY = 46;
const BY = 92;
const PY = 142;
const NODE = { x: 28, mul: 98, add: 168, sig: 238, a: 312 } as const;

const SCENES = [
  { label: "앞으로: 값을 보냅니다", summary: "2 → z = 2 → a ≈ 0.880797", note: "입력 x=2에 W=1을 곱하고 b=0을 더해 z=2를 만듭니다(가정). Sigmoid를 지나 a≈0.880797이 다음 계산으로 갑니다." },
  { label: "뒤로: 기울기를 곱합니다", summary: "3 × 0.104994 ≈ 0.314981", note: "뒤 계산이 dL/da=3을 보냅니다. Sigmoid 칸은 그 자리의 기울기 da/dz≈0.104994를 곱해 dL/dz≈0.314981을 앞쪽으로 넘깁니다." },
  { label: "W와 b의 몫", summary: "dL/db ≈ 0.314981 · dL/dW ≈ 0.629962", note: "더하기 칸은 받은 0.314981을 b 쪽으로 그대로 넘기고, 곱하기 칸은 W에 곱해졌던 입력 x=2를 한 번 더 곱해 0.629962를 W 쪽으로 넘깁니다. 아직 W와 b를 바꾸지 않았고, 이 값으로 숫자를 바꾸는 일은 optimizer가 맡습니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const AMBER_TEXT = "#b45309";
const MUTED = "#94a3b8";
const LABEL = "#64748b";

function Op({ cx, label }: { cx: number; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={FY} r={14} fill="#ffffff" stroke={LABEL} strokeWidth={1} />
      <text x={cx} y={FY + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1e293b">{label}</text>
    </g>
  );
}

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 4} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2} ${y} L${x2 - dir * 6} ${y - 3.5} L${x2 - dir * 6} ${y + 3.5} Z`} fill={color} />
    </g>
  );
}

export default function ForwardBackwardTraceViz() {
  return (
    <SceneShell
      eyebrow="한 칸의 앞·뒤 계산"
      title="값은 오른쪽으로, 변화율은 왼쪽으로 같은 길을 되짚습니다"
      description="위 줄(파랑)은 앞 계산, 가운데 줄(주황)은 뒤 계산입니다. dL/da는 a가 조금 변할 때 최종 오차 L이 변하는 비율이고, x=2, W=1, b=0, 뒤 변화율 3은 이 글의 가정입니다."
      ariaLabel="입력 2가 곱하기, 더하기, sigmoid를 지나 앞으로 가고 변화율 3이 거꾸로 W와 b까지 돌아오는 과정"
      scenes={SCENES}
      render={(active) => {
        const back = active >= 1;
        const split = active >= 2;
        return (
          <div className="overflow-x-auto">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <rect x={NODE.x - 25} y={FY - 13} width={50} height={26} rx={6} fill="#dbeafe" stroke={BLUE} strokeWidth={1} />
              <text x={NODE.x} y={FY + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e3a8a">x = 2</text>
              <Op cx={NODE.mul} label="×" />
              <Op cx={NODE.add} label="+" />
              <Op cx={NODE.sig} label="σ" />
              <rect x={NODE.a - 44} y={FY - 13} width={88} height={26} rx={6} fill="#dbeafe" stroke={BLUE} strokeWidth={1} />
              <text x={NODE.a} y={FY + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e3a8a">a ≈ 0.880797</text>

              <Arrow x1={NODE.x + 25} x2={NODE.mul - 14} y={FY} color={BLUE} />
              <Arrow x1={NODE.mul + 14} x2={NODE.add - 14} y={FY} color={BLUE} />
              <Arrow x1={NODE.add + 14} x2={NODE.sig - 14} y={FY} color={BLUE} />
              <Arrow x1={NODE.sig + 14} x2={NODE.a - 44} y={FY} color={BLUE} />
              <text x={(NODE.mul + NODE.add) / 2} y={FY - 9} textAnchor="middle" fontSize={11} fill={BLUE}>xW = 2</text>
              <text x={(NODE.add + NODE.sig) / 2} y={FY - 9} textAnchor="middle" fontSize={11} fill={BLUE}>z = 2</text>
              <text x={NODE.a + 44} y={FY - 20} textAnchor="end" fontSize={11} fill={LABEL}>다음 계산으로 →</text>

              {[
                { cx: NODE.mul, text: "W = 1" },
                { cx: NODE.add, text: "b = 0" },
              ].map((p) => (
                <g key={p.text}>
                  <line x1={p.cx} x2={p.cx} y1={PY - 13} y2={FY + 14} stroke={MUTED} strokeWidth={1} />
                  <rect x={p.cx - 25} y={PY - 13} width={50} height={26} rx={6} fill="#f1f5f9" stroke={LABEL} strokeWidth={1} />
                  <text x={p.cx} y={PY + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#1e293b">{p.text}</text>
                </g>
              ))}

              {back && (
                <>
                  <text x={NODE.a + 44} y={BY + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER_TEXT}>dL/da = 3</text>
                  <Arrow x1={NODE.a - 18} x2={NODE.sig + 4} y={BY} color={AMBER} />
                  <text x={NODE.sig} y={BY + 20} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER_TEXT}>× 0.104994</text>
                  <Arrow x1={NODE.sig - 4} x2={NODE.add + 4} y={BY} color={AMBER} />
                  <text x={(NODE.add + NODE.sig) / 2} y={BY - 7} textAnchor="middle" fontSize={11} fontWeight={700} fill={AMBER_TEXT}>0.314981</text>
                </>
              )}
              {split && (
                <>
                  <Arrow x1={NODE.add - 4} x2={NODE.mul + 4} y={BY} color={AMBER} />
                  <text x={(NODE.mul + NODE.add) / 2} y={BY - 7} textAnchor="middle" fontSize={11} fill={AMBER_TEXT}>0.314981</text>
                  <line x1={NODE.mul + 6} x2={NODE.mul + 6} y1={BY + 8} y2={PY - 15} stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 2" />
                  <line x1={NODE.add + 6} x2={NODE.add + 6} y1={BY + 8} y2={PY - 15} stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 2" />
                  <text x={NODE.mul + 22} y={PY + 34} textAnchor="end" fontSize={12} fontWeight={700} fill={AMBER_TEXT}>dL/dW ≈ 0.629962</text>
                  <text x={NODE.mul + 22} y={PY + 50} textAnchor="end" fontSize={11} fill={LABEL}>0.314981 × x(2)</text>
                  <text x={NODE.add - 20} y={PY + 34} textAnchor="start" fontSize={12} fontWeight={700} fill={AMBER_TEXT}>dL/db ≈ 0.314981</text>
                  <text x={NODE.add - 20} y={PY + 50} textAnchor="start" fontSize={11} fill={LABEL}>그대로 넘김</text>
                </>
              )}
            </svg>
          </div>
        );
      }}
    />
  );
}
