import StepViz from "@/components/ui/step-viz";

const C = { blue: "#2563eb", teal: "#0f766e", amber: "#d97706", violet: "#7c3aed", red: "#dc2626", ink: "#334155", muted: "#64748b", line: "#cbd5e1" };

const STEPS = [
  { tabLabel: "PC1 · labels", label: "PC1은 sector 41의 replica labels와 CommD를 만듭니다", body: "입력에는 PoRep config·paths·prover/sector ID·ticket·pieces가 들어갑니다. 출력 struct는 labels·StoreConfig·comm_d입니다." },
  { tabLabel: "PC2 · CommR", label: "PC2는 같은 PC1 output과 cache에서 CommR을 완성합니다", body: "출력은 SealPreCommitOutput { comm_r, comm_d }입니다. 이름이 같은 다른 retry의 cache를 섞으면 안 됩니다." },
  { tabLabel: "C1 · vanilla", label: "C1은 commitments·ticket·seed로 vanilla proof를 만듭니다", body: "Pieces를 다시 확인하고 vanilla proof를 자체 검증한 뒤 replica_id와 입력 identity를 output에 함께 보존합니다." },
  { tabLabel: "C2 · proof", label: "C2 안에서 Bellperson의 FFT·MSM이 GPU 후보가 됩니다", body: "C1 output과 고정 Groth parameters로 circuit proof를 만들고 bytes로 직렬화합니다. GPU kernel 시간은 C2 전체 시간이 아닙니다." },
  { tabLabel: "Verify · receipt", label: "독립 verifier가 proof bytes와 public inputs를 확인합니다", body: "검증 영수증까지 생겨야 job이 끝납니다. 실패한 retry generation과 stale cache는 다음 phase에서 제외합니다." },
] as const;

const ROWS = [
  ["PC1", "labels · config", "CommD", C.blue],
  ["PC2", "CommR", "CommD", C.teal],
  ["C1", "vanilla proofs", "replica_id", C.amber],
  ["C2", "Groth16", "proof bytes", C.violet],
  ["Verify", "public inputs", "receipt", C.red],
] as const;

function Desktop({ step }: { step: number }) {
  return <svg className="!hidden sm:!block" viewBox="0 0 700 318" role="img" aria-label="sector 41의 Filecoin sealing artifact가 PC1부터 verification까지 이동하는 과정">
    {ROWS.map(([title, line1, line2, color], index) => { const x=18+index*137; const active=index<=step; return <g key={title} opacity={active?1:.32}><rect x={x} y="64" width="116" height="82" rx="11" fill={index===step?`${color}12`:"#f8fafc"} stroke={index===step?color:C.line}/><text x={x+58} y="90" textAnchor="middle" fontSize="13" fontWeight="700" fill={index===step?color:C.ink}>{title}</text><text x={x+58} y="115" textAnchor="middle" fontSize="10.5" fill={C.muted}>{line1}</text><text x={x+58} y="132" textAnchor="middle" fontSize="10.5" fill={C.muted}>{line2}</text>{index<ROWS.length-1&&<><line x1={x+120} y1="105" x2={x+132} y2="105" stroke={active?color:C.line} strokeWidth="1.2"/><circle cx={x+132} cy="105" r="2.4" fill={active?color:C.line}/></>}</g>;})}
    {step===0&&<g><rect x="184" y="184" width="332" height="67" rx="10" fill={`${C.blue}0d`} stroke={C.blue}/><text x="350" y="205" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.blue}>input · sector_id=41 · ticket=T · pieces=P</text><text x="350" y="226" textAnchor="middle" fontSize="10.5" fill={C.ink}>output struct · labels · StoreConfig · comm_d</text><text x="350" y="244" textAnchor="middle" fontSize="9.5" fill={C.muted}>replica와 Merkle cache는 disk에도 생성</text></g>}
    {step===1&&<g><rect x="216" y="184" width="268" height="67" rx="10" fill={`${C.teal}0d`} stroke={C.teal}/><text x="350" y="207" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.teal}>same generation의 PC1 output만 허용</text><text x="350" y="229" textAnchor="middle" fontSize="10.5" fill={C.ink}>SealPreCommitOutput {`{ comm_r, comm_d }`}</text><text x="350" y="246" textAnchor="middle" fontSize="9.5" fill={C.muted}>GPU tree build는 내부 후보일 뿐 phase 계약은 유지</text></g>}
    {step===2&&<g><rect x="188" y="184" width="324" height="67" rx="10" fill={`${C.amber}0d`} stroke={C.amber}/><text x="350" y="205" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.amber}>verify_pieces → prove_all_partitions → self-check</text><text x="350" y="226" textAnchor="middle" fontSize="10.5" fill={C.ink}>vanilla_proofs · comm_r/d · replica_id · seed · ticket</text><text x="350" y="244" textAnchor="middle" fontSize="9.5" fill={C.muted}>C2가 필요한 public/private identity를 함께 전달</text></g>}
    {step===3&&<g><rect x="205" y="184" width="290" height="67" rx="10" fill={`${C.violet}0d`} stroke={C.violet}/><text x="350" y="205" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.violet}>Bellperson · FFT / MSM accelerator candidate</text><text x="350" y="226" textAnchor="middle" fontSize="10.5" fill={C.ink}>MultiProof → proof.write(Vec&lt;u8&gt;)</text><text x="350" y="244" textAnchor="middle" fontSize="9.5" fill={C.muted}>synthesis·I/O·orchestration은 여전히 전체 시간에 포함</text></g>}
    {step===4&&<g><rect x="210" y="184" width="280" height="67" rx="10" fill={`${C.red}0d`} stroke={C.red}/><text x="350" y="205" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.red}>proof bytes + exact public inputs</text><text x="350" y="226" textAnchor="middle" fontSize="10.5" fill={C.ink}>independent verify = true</text><text x="350" y="244" textAnchor="middle" fontSize="9.5" fill={C.muted}>그 뒤에만 deadline·p95·rollback release 판단</text></g>}
    <text x="350" y="294" textAnchor="middle" fontSize="10" fill={C.muted}>화살표는 단순 순서가 아니라 다음 phase가 검증할 producer artifact를 뜻합니다.</text>
  </svg>;
}

function Mobile({ step }: { step: number }) {
  return <svg className="block sm:!hidden" viewBox="0 0 300 438" role="img" aria-label="모바일용 sector 41 Filecoin proof artifact chain">{ROWS.map(([title,line1,line2,color],index)=>{const y=16+index*79;const active=index<=step;return <g key={title} opacity={active?1:.32}><rect x="30" y={y} width="240" height="59" rx="10" fill={index===step?`${color}12`:"#f8fafc"} stroke={index===step?color:C.line}/><text x="150" y={y+23} textAnchor="middle" fontSize="12" fontWeight="700" fill={index===step?color:C.ink}>{title}</text><text x="150" y={y+45} textAnchor="middle" fontSize="10" fill={C.muted}>{line1} · {line2}</text>{index<ROWS.length-1&&<><line x1="150" y1={y+63} x2="150" y2={y+73} stroke={active?color:C.line} strokeWidth="1.2"/><circle cx="150" cy={y+73} r="2.4" fill={active?color:C.line}/></>}</g>})}<text x="150" y="426" textAnchor="middle" fontSize="10" fill={step===4?C.red:C.muted}>{step===4?"검증 영수증까지 만들어야 완료":"sector 41 · retry generation 3"}</text></svg>;
}

export function FilecoinProofFlowViz(){return <StepViz steps={STEPS}>{step=><><Mobile step={step}/><Desktop step={step}/></>}</StepViz>}
