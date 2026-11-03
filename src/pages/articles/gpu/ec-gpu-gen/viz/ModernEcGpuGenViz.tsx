import StepViz from "@/components/ui/step-viz";

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", violet: "#7c3aed", red: "#dc2626", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

const STEPS = [
  { label: "Bellperson이 Scalar FFT와 G1·G2 MSM을 요청합니다", body: "build.rs의 SourceBuilder 호출 하나를 끝까지 따라갑니다. 아직 CUDA나 OpenCL 실행 파일은 없습니다." },
  { label: "SourceBuilder가 필요한 field와 연산 template을 모읍니다", body: "Scalar·Fp·Fp2를 중복 없이 등록하고 FFT·G1 MSM·G2 MSM source를 이어 붙입니다." },
  { label: "GpuField의 u32 word 배열을 backend limb로 포장합니다", body: "32-bit 경로는 word 8개를 그대로 쓰고 64-bit 경로는 두 word씩 묶어 4개로 만듭니다. R²는 다시 계산하지 않습니다." },
  { label: "generate가 CUDA fatbin과 OpenCL source로 갈라집니다", body: "CUDA는 build 때 nvcc로 fatbin을 만들고, OpenCL은 kernel.cl을 보존한 뒤 선택한 device에서 runtime compile합니다." },
  { label: "runtime은 한 backend를 고르고 결과를 CPU 기준과 대조합니다", body: "같은 Program API여도 artifact 생애주기는 다릅니다. device·driver·digest·fallback 이유를 실행 영수증에 남깁니다." },
] as const;

type Box = { x: number; y: number; w: number; h: number; title: string; detail: string; color: string };

function DesktopBox({ box, active }: { box: Box; active: boolean }) {
  return <g opacity={active ? 1 : 0.32}><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="12" fill={active ? `${box.color}12` : "#f8fafc"} stroke={active ? box.color : C.line}/><text x={box.x + box.w / 2} y={box.y + 30} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={active ? box.color : C.ink}>{box.title}</text><text x={box.x + box.w / 2} y={box.y + 55} textAnchor="middle" fontSize="8.7" fill={C.muted}>{box.detail}</text></g>;
}

function DesktopFlow({ step }: { step: number }) {
  const boxes: Box[] = [
    { x: 24, y: 58, w: 116, h: 82, title: "build.rs", detail: "FFT · G1 MSM · G2 MSM", color: C.blue },
    { x: 166, y: 58, w: 116, h: 82, title: "SourceBuilder", detail: "dedup · template 조립", color: C.violet },
    { x: 308, y: 58, w: 116, h: 82, title: "GpuField words", detail: "one · r2 · modulus", color: C.amber },
    { x: 450, y: 20, w: 120, h: 82, title: "CUDA artifact", detail: "u32 source → fatbin", color: C.teal },
    { x: 450, y: 118, w: 120, h: 82, title: "OpenCL artifact", detail: "u64 source → kernel.cl", color: C.teal },
    { x: 596, y: 58, w: 80, h: 82, title: "Program", detail: "device 실행", color: C.red },
  ];
  const active = [step >= 0, step >= 1, step >= 2, step >= 3, step >= 3, step >= 4];
  return <svg className="!hidden sm:!block" viewBox="0 0 700 300" role="img" aria-label="Bellperson build 요청이 ec-gpu-gen을 거쳐 CUDA 또는 OpenCL program이 되는 과정">
    {boxes.map((box, index) => <DesktopBox key={box.title} box={box} active={active[index]}/>) }
    <g fill="none" strokeWidth="1.2"><line x1="144" y1="99" x2="160" y2="99" stroke={step >= 1 ? C.blue : C.line}/><circle cx="160" cy="99" r="2.5" fill={step >= 1 ? C.blue : C.line}/><line x1="286" y1="99" x2="302" y2="99" stroke={step >= 2 ? C.violet : C.line}/><circle cx="302" cy="99" r="2.5" fill={step >= 2 ? C.violet : C.line}/><path d="M428 99 H438 V61 H444" stroke={step >= 3 ? C.amber : C.line}/><circle cx="444" cy="61" r="2.5" fill={step >= 3 ? C.amber : C.line}/><path d="M438 99 V159 H444" stroke={step >= 3 ? C.amber : C.line}/><circle cx="444" cy="159" r="2.5" fill={step >= 3 ? C.amber : C.line}/><path d="M574 61 H584 V99 H590" stroke={step >= 4 ? C.teal : C.line}/><circle cx="590" cy="99" r="2.5" fill={step >= 4 ? C.teal : C.line}/><path d="M574 159 H584 V99" stroke={step >= 4 ? C.teal : C.line}/></g>
    {step === 2 && <g><rect x="242" y="176" width="216" height="58" rx="10" fill={`${C.amber}0d`} stroke={C.amber}/><text x="350" y="199" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.amber}>u32[8] → CUDA 8 limbs</text><text x="350" y="220" textAnchor="middle" fontSize="9.2" fill={C.ink}>두 word씩 묶기 → OpenCL u64[4]</text></g>}
    {step === 3 && <g><text x="510" y="224" textAnchor="middle" fontSize="9.5" fontWeight="700" fill={C.teal}>compile 시점이 서로 다름</text><text x="510" y="245" textAnchor="middle" fontSize="8.8" fill={C.muted}>build-time nvcc ↔ runtime OpenCL compiler</text></g>}
    {step === 4 && <g><rect x="232" y="214" width="236" height="50" rx="10" fill={`${C.red}0d`} stroke={C.red}/><text x="350" y="236" textAnchor="middle" fontSize="9.3" fontWeight="700" fill={C.red}>Program 통합 ≠ backend parity</text><text x="350" y="254" textAnchor="middle" fontSize="8.6" fill={C.muted}>CPU reference와 proof verifier가 마지막 관문</text></g>}
    <text x="350" y="286" textAnchor="middle" fontSize="8.7" fill={C.muted}>같은 빌드 요청 한 건이 source와 artifact를 거쳐 실행되는 경로</text>
  </svg>;
}

const MOBILE_ROWS = [
  ["build.rs", "Scalar FFT · G1/G2 MSM", C.blue], ["SourceBuilder", "field dedup · source 조립", C.violet], ["GpuField words", "u32[8] → u32[8] / u64[4]", C.amber], ["backend artifact", "CUDA fatbin / OpenCL source", C.teal], ["runtime Program", "device · receipt · CPU parity", C.red],
] as const;

function MobileFlow({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 430" role="img" aria-label="모바일용 ec-gpu-gen artifact 생성 흐름">{MOBILE_ROWS.map(([title, detail, color], index) => { const y = 18 + index * 78; const active = index <= step; return <g key={title} opacity={active ? 1 : 0.32}><rect x="32" y={y} width="236" height="58" rx="10" fill={index === step ? `${color}12` : "#f8fafc"} stroke={index === step ? color : C.line}/><text x="150" y={y + 24} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={index === step ? color : C.ink}>{title}</text><text x="150" y={y + 44} textAnchor="middle" fontSize="8.8" fill={C.muted}>{detail}</text>{index < MOBILE_ROWS.length - 1 && <><line x1="150" y1={y + 62} x2="150" y2={y + 72} stroke={active ? color : C.line}/><circle cx="150" cy={y + 72} r="2.4" fill={active ? color : C.line}/></>}</g>; })}<text x="150" y="418" textAnchor="middle" fontSize="8.8" fill={step === 4 ? C.red : C.muted}>{step === 4 ? "통합 API 뒤에서도 artifact 경로를 따로 검증" : "같은 요청 한 건을 위에서 아래로 추적"}</text></svg>;
}

export function EcGpuGenArtifactViz() { return <StepViz steps={STEPS}>{step => <><MobileFlow step={step}/><DesktopFlow step={step}/></>}</StepViz>; }
