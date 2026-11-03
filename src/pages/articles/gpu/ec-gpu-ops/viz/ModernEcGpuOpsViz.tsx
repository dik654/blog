import StepViz from "@/components/ui/step-viz";

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", violet: "#7c3aed", red: "#dc2626", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

const STEPS = [
  { label: "MSM 입력은 point 배열과 scalar 배열입니다", body: "G1 affine point의 x·y와 scalar를 host와 kernel이 합의한 field word 순서로 읽습니다." },
  { label: "gid=6은 window 2와 point group 1을 맡습니다", body: "W=4이면 6 mod 4=2, floor(6/4)=1입니다. c=3이므로 scalar bit 6부터 세 bit를 읽습니다." },
  { label: "이 work item은 자기 bucket 7개만 씁니다", body: "c=3이면 2³−1=7개이고 gid 6의 slice는 global bucket 배열의 42..48입니다." },
  { label: "digit이 3이면 bucket[2]에 point를 mixed-add합니다", body: "커널은 0을 건너뛰고 nonzero index를 1 줄입니다. 덧셈 안에서는 한 work item이 field limbs 전체의 carry를 순서대로 처리합니다." },
  { label: "뒤에서부터 bucket을 누적해 results[6]을 씁니다", body: "Summation-by-parts 결과를 normalize한 뒤 CPU reference와 같은 affine point인지 확인합니다." },
] as const;

type Row = { title: string; detail: string; color: string };
const ROWS: Row[] = [
  { title: "bases · exps", detail: "affine point + scalar", color: C.blue },
  { title: "gid 6", detail: "window 2 · group 1 · bits 6..8", color: C.violet },
  { title: "bucket slice", detail: "7 buckets · global 42..48", color: C.amber },
  { title: "mixed add", detail: "digit 3 → local bucket[2]", color: C.teal },
  { title: "results[6]", detail: "sum → normalize → parity", color: C.red },
];

function Desktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 310" role="img" aria-label="gid 6인 ec-gpu multiexp work item이 입력에서 결과까지 이동하는 과정">
    {ROWS.map((row, index) => { const x = 18 + index * 137; const active = index <= step; return <g key={row.title} opacity={active ? 1 : 0.32}><rect x={x} y="66" width="116" height="82" rx="11" fill={index === step ? `${row.color}12` : "#f8fafc"} stroke={index === step ? row.color : C.line}/><text x={x + 58} y="96" textAnchor="middle" fontSize="10.2" fontWeight="700" fill={index === step ? row.color : C.ink}>{row.title}</text><text x={x + 58} y="122" textAnchor="middle" fontSize="8.3" fill={C.muted}>{row.detail}</text>{index < ROWS.length - 1 && <><line x1={x + 120} y1="107" x2={x + 132} y2="107" stroke={active ? row.color : C.line} strokeWidth="1.2"/><circle cx={x + 132} cy="107" r="2.4" fill={active ? row.color : C.line}/></>}</g>; })}
    {step === 1 && <g><rect x="215" y="184" width="270" height="58" rx="10" fill={`${C.violet}0d`} stroke={C.violet}/><text x="350" y="207" textAnchor="middle" fontSize="9.8" fontWeight="700" fill={C.violet}>window = 6 mod 4 = 2 · group = ⌊6/4⌋ = 1</text><text x="350" y="228" textAnchor="middle" fontSize="8.8" fill={C.muted}>bits = window × c = 2 × 3 = 6</text></g>}
    {step === 2 && <g><rect x="235" y="184" width="230" height="58" rx="10" fill={`${C.amber}0d`} stroke={C.amber}/><text x="350" y="207" textAnchor="middle" fontSize="9.8" fontWeight="700" fill={C.amber}>bucket_len = 2³−1 = 7</text><text x="350" y="228" textAnchor="middle" fontSize="8.8" fill={C.muted}>offset = 7 × gid = 42 · indices 42..48</text></g>}
    {step === 3 && <g><rect x="203" y="184" width="294" height="68" rx="10" fill={`${C.teal}0d`} stroke={C.teal}/><text x="350" y="206" textAnchor="middle" fontSize="9.6" fontWeight="700" fill={C.teal}>ind=3 → ind-- → buckets[2] += point</text><text x="350" y="227" textAnchor="middle" fontSize="8.8" fill={C.ink}>한 work item 안에서 full-limb field add·mul·carry</text><text x="350" y="244" textAnchor="middle" fontSize="8.2" fill={C.muted}>warp lanes가 limb를 하나씩 나눠 갖는 구현이 아님</text></g>}
    {step === 4 && <g><rect x="207" y="184" width="286" height="68" rx="10" fill={`${C.red}0d`} stroke={C.red}/><text x="350" y="206" textAnchor="middle" fontSize="9.6" fontWeight="700" fill={C.red}>acc ← acc + bucket[j] · res ← res + acc</text><text x="350" y="227" textAnchor="middle" fontSize="8.8" fill={C.ink}>j=6 → 0 · summation by parts</text><text x="350" y="244" textAnchor="middle" fontSize="8.2" fill={C.muted}>Jacobian bytes가 아니라 normalize한 affine point를 비교</text></g>}
    <text x="350" y="292" textAnchor="middle" fontSize="8.7" fill={C.muted}>이 사례의 수치는 commit 16d38ef multiexp.cl의 index 식에 직접 대입했습니다.</text>
  </svg>;
}

function Mobile({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 438" role="img" aria-label="모바일용 gid 6 ec-gpu multiexp 경로">{ROWS.map((row, index) => { const y = 16 + index * 79; const active = index <= step; return <g key={row.title} opacity={active ? 1 : 0.32}><rect x="30" y={y} width="240" height="59" rx="10" fill={index === step ? `${row.color}12` : "#f8fafc"} stroke={index === step ? row.color : C.line}/><text x="150" y={y + 24} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={index === step ? row.color : C.ink}>{row.title}</text><text x="150" y={y + 45} textAnchor="middle" fontSize="8.7" fill={C.muted}>{row.detail}</text>{index < ROWS.length - 1 && <><line x1="150" y1={y + 63} x2="150" y2={y + 73} stroke={active ? row.color : C.line} strokeWidth="1.2"/><circle cx="150" cy={y + 73} r="2.4" fill={active ? row.color : C.line}/></>}</g>; })}<text x="150" y="426" textAnchor="middle" fontSize="8.7" fill={step === 4 ? C.red : C.muted}>{step === 4 ? "normalize 뒤 CPU affine point와 비교" : "한 work item의 ownership을 끝까지 추적"}</text></svg>;
}

export function EcGpuOpsMappingViz() { return <StepViz steps={STEPS}>{step => <><Mobile step={step}/><Desktop step={step}/></>}</StepViz>; }
