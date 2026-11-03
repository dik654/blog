import StepViz from "@/components/ui/step-viz";

const C = {
  blue: "#2563eb",
  teal: "#0f766e",
  amber: "#d97706",
  red: "#dc2626",
  violet: "#7c3aed",
  ink: "#334155",
  muted: "#64748b",
  line: "#cbd5e1",
};

const TRAFFIC_STEPS = [
  {
    label: "32 MiB FP16 배열에 연산 세 개를 차례로 적용합니다",
    body: "고정 사례는 scale → GELU → clamp입니다. 세 연산 모두 같은 element만 읽는 unary transform이라 두 번째 입력의 traffic은 없습니다.",
  },
  {
    label: "따로 실행하면 각 kernel이 32 MiB를 읽고 다시 씁니다",
    body: "Kernel 세 개 × (read 32 + write 32) MiB = 192 MiB입니다. 중간 배열 두 개가 HBM에 materialize됩니다.",
  },
  {
    label: "합치면 입력 한 번과 최종 출력 한 번만 HBM을 지납니다",
    body: "중간값은 같은 thread의 register에서 다음 연산으로 넘어갑니다. 요청 traffic은 64 MiB입니다.",
  },
  {
    label: "요청량 기준 절감 상한은 192 − 64 = 128 MiB입니다",
    body: "이 값은 실제 DRAM transaction이나 시간 절감이 아닙니다. Cache·write policy와 compiler 결과는 profiler로 따로 확인합니다.",
  },
  {
    label: "이제 질문은 ‘더 합칠까?’가 아니라 ‘실제로 빨라졌나?’입니다",
    body: "Register·spill·resident warps와 같은 정답 조건의 end-to-end median·p95까지 본 뒤 가장 작은 이기는 경계를 채택합니다.",
  },
] as const;

function TrafficDesktop({ step }: { step: number }) {
  const separate = step === 1;
  const fused = step >= 2;
  return (
    <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="32 MiB 배열의 분리 kernel과 fused kernel traffic 비교">
      <rect x="40" y="40" width="620" height="206" rx="14" fill="#f8fafc" stroke={C.line} />
      <text x="70" y="70" fontSize="10" fontWeight="700" fill={C.ink}>고정 workload · FP16 32 MiB</text>
      {!fused ? (
        <>
          {["scale", "GELU", "clamp"].map((label, index) => {
            const x = 82 + index * 190;
            return <g key={label} opacity={step === 0 && index > 0 ? 0.45 : 1}>
              <rect x={x} y="104" width="132" height="66" rx="10" fill={separate ? `${C.blue}10` : "#ffffff"} stroke={separate ? C.blue : C.line} />
              <text x={x + 66} y="132" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{label}</text>
              <text x={x + 66} y="151" textAnchor="middle" fontSize="8.8" fill={C.muted}>read 32 · write 32</text>
              {index < 2 && <><line x1={x + 138} y1="137" x2={x + 178} y2="137" stroke={C.blue} /><circle cx={x + 178} cy="137" r="2.5" fill={C.blue} /></>}
            </g>;
          })}
          <text x="350" y="213" textAnchor="middle" fontSize="12" fontWeight="700" fill={separate ? C.red : C.muted}>{separate ? "3 × 64 MiB = 192 MiB requested traffic" : "같은 element를 세 번 변환"}</text>
        </>
      ) : (
        <>
          <rect x="104" y="100" width="492" height="78" rx="12" fill={`${C.teal}10`} stroke={C.teal} />
          <text x="350" y="128" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.teal}>one fused kernel</text>
          <text x="350" y="151" textAnchor="middle" fontSize="10" fill={C.ink}>HBM read → scale → GELU → clamp → HBM write</text>
          <text x="350" y="211" textAnchor="middle" fontSize="12" fontWeight="700" fill={step === 3 ? C.blue : C.teal}>{step === 3 ? "192 − 64 = 128 MiB saved request bytes" : step === 4 ? "bytes → resources → same-answer elapsed" : "32 + 32 = 64 MiB requested traffic"}</text>
        </>
      )}
      <text x="350" y="272" textAnchor="middle" fontSize="8.8" fill={C.muted}>요청 byte 장부이며 실제 HBM transaction·시간은 측정값으로 교체합니다</text>
    </svg>
  );
}

function TrafficMobile({ step }: { step: number }) {
  const rows = step === 0
    ? [["input", "32 MiB FP16"], ["work", "scale → GELU → clamp"], ["output", "32 MiB FP16"]]
    : step === 1
      ? [["scale", "64 MiB"], ["GELU", "+64 MiB"], ["clamp", "+64 MiB"], ["total", "192 MiB"]]
      : step === 2
        ? [["read", "32 MiB"], ["register handoff", "three transforms"], ["write", "32 MiB"], ["total", "64 MiB"]]
        : step === 3
          ? [["separate", "192 MiB"], ["fused", "64 MiB"], ["saved", "128 MiB"], ["scope", "requested bytes"]]
          : [["parity", "same answer"], ["traffic", "actual DRAM"], ["resource", "register · spill"], ["release", "median · p95"]];
  return (
    <svg className="block sm:!hidden" viewBox="0 0 300 350" role="img" aria-label="모바일용 kernel fusion traffic 계산">
      {rows.map(([a, b], index) => {
        const y = 18 + index * (rows.length === 3 ? 92 : 76);
        const active = index === rows.length - 1;
        return <g key={`${a}-${index}`}>
          <rect x="36" y={y} width="228" height="56" rx="10" fill={active ? `${C.teal}10` : "#f8fafc"} stroke={active ? C.teal : C.line} />
          <text x="58" y={y + 24} fontSize="9.6" fontWeight="700" fill={active ? C.teal : C.ink}>{a}</text>
          <text x="244" y={y + 35} textAnchor="end" fontSize="9" fontWeight="700" fill={active ? C.teal : C.muted}>{b}</text>
          {index < rows.length - 1 && <><line x1="48" y1={y + 60} x2="48" y2={y + 72} stroke={C.blue} /><circle cx="48" cy={y + 72} r="2.2" fill={C.blue} /></>}
        </g>;
      })}
    </svg>
  );
}

export function FusionTrafficViz() {
  return <StepViz steps={TRAFFIC_STEPS}>{step => <><TrafficMobile step={step} /><TrafficDesktop step={step} /></>}</StepViz>;
}

const SHAPE_STEPS = [
  { label: "Vertical fusion은 한 producer–consumer 사슬의 왕복을 없앱니다", body: "32 MiB unary 연산 세 개 사례에서 192 MiB가 64 MiB로 줄어듭니다." },
  { label: "Horizontal fusion은 독립 작업을 나란히 묶어 launch를 줄입니다", body: "각 작업의 input·output byte는 그대로일 수 있습니다. Traffic 절감으로 기록하면 안 됩니다." },
  { label: "Epilogue fusion은 accumulator를 store하기 전에 후처리합니다", body: "GEMM output을 HBM에 내렸다 다시 읽는 read+write를 피하는 대표 경계입니다." },
  { label: "다른 block의 결과가 필요하면 같은 handoff가 깨집니다", body: "Row reduction·global synchronization이 끼면 shared memory, extra kernel 또는 cooperative mechanism이 필요합니다." },
] as const;

const SHAPES = [
  ["vertical", "A → B → C", "intermediate HBM ↓", C.blue],
  ["horizontal", "A ∥ B ∥ C", "launch · SM fill", C.amber],
  ["epilogue", "GEMM acc → bias", "output round trip ↓", C.teal],
  ["boundary", "block 0 ? block 1", "global dependency", C.red],
] as const;

function ShapeDesktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="Vertical horizontal epilogue fusion과 경계 비교">
    {SHAPES.map(([name, flow, result, color], index) => {
      const x = 28 + index * 169;
      return <g key={name} opacity={index > step ? 0.42 : 1}>
        <rect x={x} y="64" width="145" height="126" rx="12" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} />
        <text x={x + 72.5} y="94" textAnchor="middle" fontSize="10" fontWeight="700" fill={index === step ? color : C.ink}>{name}</text>
        <text x={x + 72.5} y="129" textAnchor="middle" fontSize="10.5" fontWeight="700" fill={C.ink}>{flow}</text>
        <text x={x + 72.5} y="162" textAnchor="middle" fontSize="8.8" fill={C.muted}>{result}</text>
        {index < SHAPES.length - 1 && <><line x1={x + 149} y1="127" x2={x + 165} y2="127" stroke={color} /><circle cx={x + 165} cy="127" r="2.2" fill={color} /></>}
      </g>;
    })}
    <text x="350" y="232" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={SHAPES[step][3]}>같은 fusion이라는 이름보다 없어진 비용을 먼저 적습니다</text>
  </svg>;
}

function ShapeMobile({ step }: { step: number }) {
  const [name, flow, result, color] = SHAPES[step];
  return <svg className="block sm:!hidden" viewBox="0 0 300 310" role="img" aria-label="모바일용 fusion 모양 비교">
    <rect x="38" y="34" width="224" height="62" rx="10" fill={`${color}10`} stroke={color} />
    <text x="150" y="61" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{name}</text>
    <text x="150" y="82" textAnchor="middle" fontSize="9" fill={C.muted}>어떤 관계를 묶나</text>
    <line x1="150" y1="101" x2="150" y2="121" stroke={color} /><circle cx="150" cy="121" r="2.3" fill={color} />
    <rect x="38" y="127" width="224" height="58" rx="10" fill="#f8fafc" stroke={C.line} />
    <text x="150" y="162" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.ink}>{flow}</text>
    <line x1="150" y1="190" x2="150" y2="210" stroke={color} /><circle cx="150" cy="210" r="2.3" fill={color} />
    <rect x="38" y="216" width="224" height="58" rx="10" fill={`${color}0d`} stroke={color} />
    <text x="150" y="251" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{result}</text>
  </svg>;
}

export function FusionShapeViz() {
  return <StepViz steps={SHAPE_STEPS}>{step => <><ShapeMobile step={step} /><ShapeDesktop step={step} /></>}</StepViz>;
}

const RESOURCE_STEPS = [
  { label: "먼저 없앨 수 있는 128 MiB traffic을 이익으로 적습니다", body: "고정 사례의 requested-byte 상한입니다. Cache와 실제 transaction은 측정 전까지 확정하지 않습니다." },
  { label: "Register 32개일 때 단순 register ceiling은 block 8개입니다", body: "가정: SM당 65,536 registers, block당 256 threads. floor(65,536÷(32×256))=8입니다." },
  { label: "Fusion이 72 registers/thread를 쓰면 ceiling은 block 3개입니다", body: "floor(65,536÷(72×256))=3입니다. Allocation granularity·warp·shared limit을 생략한 교육용 상한이지 실제 occupancy 예측이 아닙니다." },
  { label: "Traffic 이익과 residency·spill 손실을 같은 실행에서 비교합니다", body: "Spill이 0이어도 eligible warps와 latency hiding이 나빠질 수 있습니다. Compiler artifact와 profiler, end-to-end를 함께 봅니다." },
] as const;

function ResourceDesktop({ step }: { step: number }) {
  const rows = [
    ["saved request traffic", "128 MiB", C.blue],
    ["separate register ceiling", "32 reg/thread → 8 blocks", C.teal],
    ["fused register ceiling", "72 reg/thread → 3 blocks", C.amber],
    ["release question", "did median · p95 improve?", C.violet],
  ] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="Fusion traffic 절감과 register residency trade-off">
    {rows.map(([a, b, color], index) => {
      const y = 30 + index * 58;
      return <g key={a} opacity={index > step ? 0.4 : 1}>
        <rect x="52" y={y} width="596" height="44" rx="9" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} />
        <text x="72" y={y + 27} fontSize="9.5" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text>
        <text x="626" y={y + 27} textAnchor="end" fontSize="9.5" fontWeight="700" fill={index === step ? color : C.muted}>{b}</text>
        {index < rows.length - 1 && <><line x1="66" y1={y + 48} x2="66" y2={y + 56} stroke={color} /><circle cx="66" cy={y + 56} r="2.1" fill={color} /></>}
      </g>;
    })}
    <text x="350" y="278" textAnchor="middle" fontSize="8.8" fill={C.muted}>Register ceiling은 다른 limit·allocation granularity를 생략한 설명용 계산입니다</text>
  </svg>;
}

function ResourceMobile({ step }: { step: number }) {
  const rows = [
    ["traffic benefit", "128 MiB"],
    ["32 reg/thread", "65,536 ÷ 8,192 = 8 blocks"],
    ["72 reg/thread", "65,536 ÷ 18,432 = 3 blocks"],
    ["decision", "median · p95 · counters"],
  ];
  return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 fusion resource 장부">
    {rows.map(([a, b], index) => {
      const y = 18 + index * 76;
      const color = [C.blue, C.teal, C.amber, C.violet][index];
      return <g key={a} opacity={index > step ? 0.42 : 1}>
        <rect x="34" y={y} width="232" height="56" rx="10" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} />
        <text x="54" y={y + 23} fontSize="9.4" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text>
        <text x="246" y={y + 39} textAnchor="end" fontSize="8.6" fontWeight="700" fill={index === step ? color : C.muted}>{b}</text>
        {index < rows.length - 1 && <><line x1="46" y1={y + 60} x2="46" y2={y + 72} stroke={color} /><circle cx="46" cy={y + 72} r="2.1" fill={color} /></>}
      </g>;
    })}
  </svg>;
}

export function FusionResourceViz() {
  return <StepViz steps={RESOURCE_STEPS}>{step => <><ResourceMobile step={step} /><ResourceDesktop step={step} /></>}</StepViz>;
}

const RELEASE_STEPS = [
  { label: "Reference와 candidate가 같은 답을 내는지 먼저 검사합니다", body: "Shape·dtype·edge cases와 허용 오차를 고정합니다. 이 관문을 실패하면 속도는 비교하지 않습니다." },
  { label: "Requested 128 MiB가 실제 DRAM 감소로 이어졌는지 봅니다", body: "Requested bytes와 cache·DRAM transaction을 구분하고 같은 profiler 조건에서 비교합니다." },
  { label: "Registers·spill·shared·eligible warps의 대가를 확인합니다", body: "한 counter로 원인을 확정하지 않고 generated artifact와 kernel timeline을 함께 봅니다." },
  { label: "같은 workload의 end-to-end median·p95로 채택합니다", body: "일부 shape가 회귀하면 더 작은 경계로 되돌립니다. CUDA Graph는 남은 CPU submission 비용에 별도로 적용할 수 있습니다." },
] as const;

const RELEASE_ROWS = [
  ["correctness", "same output · tolerance", C.blue],
  ["traffic", "requested vs actual DRAM", C.teal],
  ["resources", "register · spill · warps", C.amber],
  ["release", "end-to-end median · p95", C.violet],
] as const;

function ReleaseDesktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 280" role="img" aria-label="Kernel fusion release gate">
    {RELEASE_ROWS.map(([a, b, color], index) => {
      const x = 28 + index * 169;
      return <g key={a} opacity={index > step ? 0.4 : 1}>
        <rect x={x} y="66" width="145" height="114" rx="12" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} />
        <text x={x + 72.5} y="96" textAnchor="middle" fontSize="10" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text>
        <text x={x + 72.5} y="132" textAnchor="middle" fontSize="8.6" fill={C.muted}>{b}</text>
        <text x={x + 72.5} y="158" textAnchor="middle" fontSize="8.6" fontWeight="700" fill={index === step ? color : C.muted}>{index < step ? "pass" : index === step ? "check now" : "wait"}</text>
        {index < RELEASE_ROWS.length - 1 && <><line x1={x + 149} y1="123" x2={x + 165} y2="123" stroke={color} /><circle cx={x + 165} cy="123" r="2.2" fill={color} /></>}
      </g>;
    })}
    <text x="350" y="228" textAnchor="middle" fontSize="9.2" fontWeight="700" fill={step === 3 ? C.violet : C.red}>{step === 3 ? "가장 큰 kernel이 아니라 가장 작은 이기는 boundary를 release" : "앞 관문 실패 시 뒤 숫자로 정당화하지 않음"}</text>
    <text x="350" y="252" textAnchor="middle" fontSize="8.8" fill={C.muted}>CUDA Graph는 이 뒤에 남은 CPU launch submission을 줄이는 별도 층입니다</text>
  </svg>;
}

function ReleaseMobile({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 340" role="img" aria-label="모바일용 kernel fusion release gate">
    {RELEASE_ROWS.map(([a, b, color], index) => {
      const y = 18 + index * 72;
      return <g key={a} opacity={index > step ? 0.42 : 1}>
        <rect x="34" y={y} width="232" height="52" rx="9" fill={index === step ? `${color}10` : "#f8fafc"} stroke={index === step ? color : C.line} />
        <text x="54" y={y + 22} fontSize="9.5" fontWeight="700" fill={index === step ? color : C.ink}>{a}</text>
        <text x="246" y={y + 39} textAnchor="end" fontSize="8.5" fill={C.muted}>{b}</text>
        {index < RELEASE_ROWS.length - 1 && <><line x1="46" y1={y + 55} x2="46" y2={y + 67} stroke={color} /><circle cx="46" cy={y + 67} r="2.1" fill={color} /></>}
      </g>;
    })}
    <text x="150" y="326" textAnchor="middle" fontSize="8.8" fontWeight="700" fill={step === 3 ? C.violet : C.red}>{step === 3 ? "smallest winning boundary" : "fail → stop"}</text>
  </svg>;
}

export function FusionReleaseViz() {
  return <StepViz steps={RELEASE_STEPS}>{step => <><ReleaseMobile step={step} /><ReleaseDesktop step={step} /></>}</StepViz>;
}
