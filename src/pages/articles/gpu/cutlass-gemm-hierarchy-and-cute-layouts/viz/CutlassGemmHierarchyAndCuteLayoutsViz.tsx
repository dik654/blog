import StepViz from "@/components/ui/step-viz";

const C={blue:"#2563eb",violet:"#7c3aed",amber:"#d97706",teal:"#0f766e",red:"#dc2626",ink:"#0f172a",muted:"#64748b",line:"#cbd5e1"} as const;
const tint=(color:string,alpha="12")=>color+alpha;
const palette=[C.blue,C.amber,C.violet,C.teal,C.red] as const;

function MobileRows({step,rows,note}:{step:number;rows:readonly (readonly [string,string,string])[];note:string}){
  return <svg className="block sm:!hidden" viewBox="0 0 300 405" role="img" aria-label={note}>{rows.map(([a,b,c],i)=>{const y=14+i*69,color=palette[i];return <g key={a} opacity={i<=step?1:.3}><rect x="35" y={y} width="230" height="50" rx="9" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/><text x="51" y={y+19} fontSize="9" fontWeight="900" fill={color}>{a}</text><text x="51" y={y+38} fontSize="8.1" fill={C.muted}>{b}</text><text x="245" y={y+31} textAnchor="end" fontSize="9" fontWeight="900" fill={C.ink}>{c}</text></g>})}<text x="150" y="383" textAnchor="middle" fontSize="8.2" fontWeight="800" fill={C.ink}>{note}</text></svg>;
}

const HIERARCHY=[
  {tabLabel:"문제",label:"같은 사례는 M=512, N=640, K=256인 bf16 GEMM입니다",body:"C 전체를 한 번에 계산하지 않고 memory 계층에 맞춰 더 작은 tile로 좁힙니다."},
  {tabLabel:"20 CTA tiles",label:"128×128 output tile로 자르면 4×5=20 threadblock tiles입니다",body:"각 tile은 K를 32씩 여덟 번 진행합니다."},
  {tabLabel:"4 warp tiles",label:"Threadblock tile 하나를 warp 4개가 2×2로 나눠 64×64씩 맡습니다",body:"Shared memory에서 읽은 조각을 각 warp의 register에 둡니다."},
  {tabLabel:"64 MMA",label:"한 64×64×32 warp tile에는 m16n8k16 명령이 4×8×2=64회 필요합니다",body:"M 방향 4, N 방향 8, K 방향 2의 곱입니다."},
  {tabLabel:"lane 5",label:"MMA 결과 128개는 lane당 4개이고 lane 5는 (1,2),(1,3),(9,2),(9,3)을 듭니다",body:"PTX가 고정한 fragment 규칙을 CuTe가 thread-value layout으로 적습니다."},
] as const;

function HierarchyDesktop({step}:{step:number}){
  const nodes=[["GEMM","512×640×256"],["CTA tile","20 = 4×5"],["warp tile","4 × 64²"],["mma","64 / k-chunk"],["lane 5","c0…c3"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 310" role="img" aria-label="GEMM 전체가 threadblock warp MMA lane fragment로 좁혀지는 과정">{nodes.slice(0,-1).map((n,i)=><g key={n[0]} opacity={i<step?1:.25}><line x1={145+i*139} y1="136" x2={179+i*139} y2="136" stroke={palette[i]}/><circle cx={179+i*139} cy="136" r="2.5" fill={palette[i]}/></g>)}{nodes.map(([a,b],i)=>{const x=45+i*139,color=palette[i];return <g key={a} opacity={i<=step?1:.3}>{i===4?<circle cx={x+50} cy="136" r="45" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/>:<rect x={x} y="91" width="100" height="90" rx="13" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/>}<text x={x+50} y="126" textAnchor="middle" fontSize="8.7" fontWeight="900" fill={color}>{a}</text><text x={x+50} y="152" textAnchor="middle" fontSize="8" fontWeight="800" fill={C.ink}>{b}</text></g>})}<text x="360" y="238" textAnchor="middle" fontSize="8.7" fontWeight="900" fill={C.ink}>{["전체 출력","global→shared","shared→register","tensor core","register fragment"][step]}</text><text x="360" y="265" textAnchor="middle" fontSize="8" fill={C.muted}>같은 tile을 memory 계층에 맞춰 좁힙니다</text></svg>;
}

export default function CutlassGemmHierarchyAndCuteLayoutsViz(){return <StepViz steps={HIERARCHY}>{step=><><MobileRows step={step} rows={[["GEMM","512×640×256","전체"],["CTA","128×128","20 tiles"],["Warp","64×64","4 / CTA"],["MMA","16×8×16","64회"],["Lane 5","rows 1·9, cols 2·3","4 regs"]]} note="전체에서 lane의 네 값까지 좁혀 갑니다"/><HierarchyDesktop step={step}/></>}</StepViz>}

const MMA_COUNT=[
  {tabLabel:"warp 몫",label:"128×128 CTA tile을 warp 4개가 2×2로 나누면 warp tile은 64×64입니다",body:"K 깊이 32는 네 warp가 함께 진행합니다."},
  {tabLabel:"M 4번",label:"M 방향은 64행을 명령 한 번의 16행으로 나눠 4번입니다",body:"64÷16=4입니다."},
  {tabLabel:"N 8번",label:"N 방향은 64열을 명령 한 번의 8열로 나눠 8번입니다",body:"64÷8=8입니다."},
  {tabLabel:"K 2번",label:"K 방향은 깊이 32를 명령 한 번의 16으로 나눠 2번입니다",body:"따라서 4×8×2=64 MMA입니다."},
] as const;

function MmaCountDesktop({step}:{step:number}){
  const counts=[["CTA 128×128","2×2 warps","64×64"],["M","64÷16","4"],["N","64÷8","8"],["K","32÷16","2"]] as const;
  return <svg className="!hidden sm:!block" viewBox="0 0 720 285" role="img" aria-label="64×64×32 warp tile의 MMA 명령 64회를 세는 과정">{counts.map(([name,calc,result],i)=>{const x=42+i*169,color=palette[i];return <g key={name} opacity={i<=step?1:.3}><rect x={x} y="74" width="140" height="92" rx="13" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/><text x={x+70} y="103" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={color}>{name}</text><text x={x+70} y="130" textAnchor="middle" fontSize="8.2" fill={C.muted}>{calc}</text><text x={x+70} y="151" textAnchor="middle" fontSize="11" fontWeight="900" fill={C.ink}>{result}</text>{i<3&&<><line x1={x+141} y1="120" x2={x+164} y2="120" stroke={color}/><circle cx={x+164} cy="120" r="2.5" fill={color}/></>}</g>})}<text x="360" y="218" textAnchor="middle" fontSize="9.2" fontWeight="900" fill={C.ink}>{step===3?"M 4 × N 8 × K 2 = 64 MMA / warp / K chunk":"세 축의 반복 횟수를 따로 센 뒤 곱합니다"}</text></svg>;
}

export function MmaCountViz(){return <StepViz steps={MMA_COUNT}>{step=><><MobileRows step={step} rows={[["Warp 몫","128÷2","64×64"],["M 반복","64÷16","4"],["N 반복","64÷8","8"],["K 반복","32÷16","2"]]} note={step===3?"4×8×2 = 64 MMA":"각 축의 반복 횟수를 차례로 셉니다"}/><MmaCountDesktop step={step}/></>}</StepViz>}

const MAINLOOP=[
  {tabLabel:"K 8 chunks",label:"K=256을 bK=32로 나누면 mainloop은 여덟 k-iterations를 돕니다",body:"각 반복은 A 128×32와 B 32×128을 처리합니다."},
  {tabLabel:"A+B 16KiB",label:"한 반복의 A와 B는 각각 8KiB, 합계 16KiB입니다",body:"Thread 128개로 나누면 각 thread는 A 64B와 B 64B를 맡습니다."},
  {tabLabel:"4+4 copies",label:"16B copy atom이면 thread마다 A 4회와 B 4회를 발행합니다",body:"기존 글의 A만 8회라는 장부는 8KiB를 두 배로 세므로 교정했습니다."},
  {tabLabel:"64 MMA",label:"ldmatrix로 fragment를 올린 뒤 warp마다 MMA 64회로 bK=32를 소비합니다",body:"M 4×N 8×K 2의 곱입니다."},
  {tabLabel:"Epilogue",label:"여덟 반복이 끝나면 흩어진 accumulator를 모아 D에 coalesced store합니다",body:"Bias·activation 같은 visitor 연산도 이 마지막 구간에 붙습니다."},
] as const;

function MainloopDesktop({step}:{step:number}){
  return <svg className="!hidden sm:!block" viewBox="0 0 720 320" role="img" aria-label="한 GEMM tile의 여덟 K 반복과 epilogue">{Array.from({length:8},(_,i)=>{const x=58+i*76;return <g key={i} opacity={i<=Math.max(0,step-1)?1:.25}><rect x={x} y="55" width="58" height="44" rx="8" fill={tint(i%2?C.violet:C.blue)} stroke={i%2?C.violet:C.blue}/><text x={x+29} y="82" textAnchor="middle" fontSize="8" fontWeight="900" fill={C.ink}>K{i}</text></g>})}<line x1="70" y1="151" x2="650" y2="151" stroke={C.line}/>{[["A 8KiB",C.blue],["B 8KiB",C.amber],["4+4 copy",C.violet],["64 MMA",C.teal],["D store",C.red]].map(([a,color],i)=>{const x=55+i*139;return <g key={a} opacity={i<=step?1:.3}><circle cx={x+42} cy="190" r="31" fill={i===step?tint(color):"#f8fafc"} stroke={i<=step?color:C.line}/><text x={x+42} y="194" textAnchor="middle" fontSize="8.2" fontWeight="900" fill={color}>{a}</text>{i<4&&<><line x1={x+74} y1="190" x2={x+101} y2="190" stroke={color}/><circle cx={x+101} cy="190" r="2.5" fill={color}/></>}</g>})}<text x="360" y="270" textAnchor="middle" fontSize="8.7" fontWeight="900" fill={C.ink}>한 thread: A 64B + B 64B = 16B copy 4+4회</text></svg>;
}

export function MainloopTraceViz(){return <StepViz steps={MAINLOOP}>{step=><><MobileRows step={step} rows={[["K 분할","256÷32","8 chunks"],["A+B","8+8KiB","16KiB"],["Thread 몫","64+64B","4+4 copy"],["Warp 계산","4×8×2","64 MMA"],["출력","acc→D","epilogue"]]} note="A만 8회가 아니라 A 4회와 B 4회입니다"/><MainloopDesktop step={step}/></>}</StepViz>}

const LAYOUT=[
  {tabLabel:"Shape·stride",label:"CuTe Layout은 coordinate를 index로 보내는 Shape:Stride 함수입니다",body:"Shape는 좌표 범위, stride는 축을 한 칸 갈 때 index가 뛰는 양입니다."},
  {tabLabel:"Column major",label:"(4,8):(1,4)에서 (2,3)은 2×1+3×4=14입니다",body:"첫 축 stride가 1이어서 첫 축이 memory에서 연속입니다."},
  {tabLabel:"Row major",label:"같은 좌표를 (4,8):(8,1)에 넣으면 2×8+3×1=19입니다",body:"모양은 같아도 stride가 바뀌면 물리 위치가 바뀝니다."},
  {tabLabel:"Composition",label:"B가 고른 index를 A의 coordinate로 다시 읽는 것이 A∘B입니다",body:"결과도 Layout이므로 다시 합성할 수 있습니다."},
  {tabLabel:"Divide",label:"128×128 layout을 16×8로 나누면 tile 안 좌표와 tile 번호가 각각 mode가 됩니다",body:"Memory를 옮기지 않고 stride만으로 threadblock·warp·instruction 조각을 표현합니다."},
] as const;

function LayoutDesktop({step}:{step:number}){
  return <svg className="!hidden sm:!block" viewBox="0 0 720 320" role="img" aria-label="CuTe shape stride coordinate index와 logical divide">{Array.from({length:4},(_,r)=>Array.from({length:8},(_,c)=>{const x=74+c*34,y=56+r*34,active=r===2&&c===3;return <g key={r+"-"+c} opacity={step<3?1:.35}><rect x={x} y={y} width="31" height="31" rx="4" fill={active?tint(step===2?C.red:C.blue,"22"):"#f8fafc"} stroke={active?step===2?C.red:C.blue:C.line}/>{active&&<text x={x+15.5} y={y+20} textAnchor="middle" fontSize="8" fontWeight="900" fill={C.ink}>(2,3)</text>}</g>}))}<rect x="407" y="62" width="240" height="122" rx="14" fill="#f8fafc" stroke={palette[step]}/><text x="527" y="92" textAnchor="middle" fontSize="9" fontWeight="900" fill={palette[step]}>{["L(c)=c·stride","column-major","row-major","A(B(c))","(tile, rest)"][step]}</text><text x="527" y="132" textAnchor="middle" fontSize="18" fontWeight="900" fill={C.ink}>{["Shape:Stride","14","19","A ∘ B","16×8"][step]}</text><text x="527" y="158" textAnchor="middle" fontSize="8" fill={C.muted}>{["coordinate → index","2×1 + 3×4","2×8 + 3×1","composition","logical divide"][step]}</text><line x1="350" y1="117" x2="397" y2="117" stroke={palette[step]}/><circle cx="397" cy="117" r="3" fill={palette[step]}/><text x="360" y="249" textAnchor="middle" fontSize="8.7" fontWeight="900" fill={C.ink}>작은 4×8 창으로 같은 tile의 주소 규칙을 확대합니다</text></svg>;
}

export function LayoutMappingViz(){return <StepViz steps={LAYOUT}>{step=><><MobileRows step={step} rows={[["함수","Shape:Stride","coord→index"],["열 우선","2×1+3×4","14"],["행 우선","2×8+3×1","19"],["합성","A(B(c))","A∘B"],["나누기","128² ÷ 16×8","tile+rest"]]} note="좌표는 같아도 stride가 index를 바꿉니다"/><LayoutDesktop step={step}/></>}</StepViz>}

const TV=[
  {tabLabel:"16B atom",label:"Copy atom 한 번은 연속한 fp16 8개, 즉 16B를 옮깁니다",body:"이 8개가 thread 하나의 value layout입니다."},
  {tabLabel:"128 threads",label:"Thread layout을 M 방향 32×K 방향 4로 놓아 128 threads를 배치합니다",body:"한 round에 128×8=1,024 elements를 덮습니다."},
  {tabLabel:"4 rounds",label:"A tile 128×32=4,096 elements는 1,024개짜리 round 네 번이면 끝납니다",body:"Thread마다 A 32 elements=64B, 즉 16B copy 네 번입니다."},
  {tabLabel:"B도 4회",label:"B tile도 32×128=4,096 elements라 thread마다 16B copy 네 번입니다",body:"A와 B를 합치면 한 k-iteration에서 thread당 여덟 번입니다."},
  {tabLabel:"MMA fragment",label:"MMA atom의 C TV layout은 32 lanes×4 values를 16×8 좌표로 보냅니다",body:"TiledMMA가 이를 4×8 output positions로 펼쳐 lane당 accumulator 128개를 만듭니다."},
] as const;

function TvDesktop({step}:{step:number}){
  const bars=[8,128,1024,4096] as const;return <svg className="!hidden sm:!block" viewBox="0 0 720 315" role="img" aria-label="Copy atom의 value layout과 thread layout이 A tile을 네 round로 나누는 과정"><text x="360" y="34" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>A tile 128×32 = 4,096 fp16 elements = 8KiB</text>{bars.map((v,i)=>{const y=62+i*48,color=palette[i];return <g key={v} opacity={i<=Math.min(step,3)?1:.3}><rect x="76" y={y} width={Math.max(64,520*v/4096)} height="28" rx="7" fill={tint(color,"18")} stroke={color}/><text x="86" y={y+19} fontSize="8.2" fontWeight="900" fill={C.ink}>{["8 values / atom","128 threads","1,024 / round","4 rounds = 4,096"][i]}</text></g>})}<rect x="438" y="246" width="206" height="40" rx="9" fill={step===4?tint(C.red):"#f8fafc"} stroke={step===4?C.red:C.line}/><text x="541" y="270" textAnchor="middle" fontSize="8.4" fontWeight="900" fill={C.ink}>{step===4?"C atom: 32 lanes × 4 values":"A 4 copies + B 4 copies / thread"}</text></svg>;
}

export function TvPartitionViz(){return <StepViz steps={TV}>{step=><><MobileRows step={step} rows={[["Value","8 fp16","16B"],["Threads","32×4","128"],["한 round","128×8","1,024"],["A tile","4,096÷1,024","4회"],["C atom","32×4","128"]]} note="TV layout은 누가 어떤 값을 드는지 적습니다"/><TvDesktop step={step}/></>}</StepViz>}

const SWIZZLE=[
  {tabLabel:"128B row",label:"Fp16 64개인 한 행은 128B라 모든 행이 다시 bank 0에서 시작합니다",body:"Shared memory의 32 banks×4B 주기가 정확히 128B입니다."},
  {tabLabel:"8-way conflict",label:"ldmatrix가 여덟 행에서 같은 16B chunk를 읽으면 같은 네 banks에 8개 요청이 겹칩니다",body:"논리적으로 다른 행이어도 물리 bank 번호가 같기 때문입니다."},
  {tabLabel:"XOR",label:"Swizzle<3,3,3>은 물리 chunk를 c XOR (r mod 8)로 바꿉니다",body:"행 번호 아래 3 bits를 16B chunk 번호 3 bits에 섞습니다."},
  {tabLabel:"0…7 chunks",label:"같은 논리 chunk c가 여덟 행에서 서로 다른 물리 chunks c⊕0…c⊕7로 흩어집니다",body:"그래서 같은 순간의 bank 묶음이 겹치지 않습니다."},
  {tabLabel:"같은 계약",label:"쓰기와 읽기가 같은 swizzled layout을 쓰고 TMA descriptor도 같은 mode여야 합니다",body:"Swizzle은 conflict를 피하지만 bank 대역폭 자체를 늘리지는 않습니다."},
] as const;

function SwizzleDesktop({step}:{step:number}){
  return <svg className="!hidden sm:!block" viewBox="0 0 720 320" role="img" aria-label="8개 shared memory 행의 16B chunk를 XOR swizzle해 bank conflict를 피하는 과정"><text x="360" y="32" textAnchor="middle" fontSize="9" fontWeight="900" fill={C.ink}>row r · logical chunk c=0 · physical chunk = c ⊕ (r mod 8)</text>{Array.from({length:8},(_,r)=>{const y=54+r*27,chunk=step>=2?r:0,x=92+chunk*66;return <g key={r}><text x="48" y={y+15} fontSize="8" fontWeight="800" fill={C.muted}>r{r}</text><rect x="92" y={y} width="528" height="20" rx="4" fill="#f8fafc" stroke={C.line}/><rect x={x} y={y} width="62" height="20" rx="4" fill={tint(step>=2?C.teal:C.red,"24")} stroke={step>=2?C.teal:C.red}/><text x={x+31} y={y+14} textAnchor="middle" fontSize="7.8" fontWeight="900" fill={C.ink}>chunk {chunk}</text></g>})}<text x="360" y="291" textAnchor="middle" fontSize="8.6" fontWeight="900" fill={step>=2?C.teal:C.red}>{step>=2?"chunks 0…7 → 서로 다른 bank groups":"chunk 0 × 8 rows → 같은 four banks"}</text></svg>;
}

export function SwizzleBanksViz(){return <StepViz steps={SWIZZLE}>{step=><><MobileRows step={step} rows={[["행 크기","64 fp16×2B","128B"],["기본","chunk 0×8","8-way"],["규칙","c⊕(r mod8)","XOR"],["결과","chunks 0…7","분산"],["계약","copy·read·TMA","같은 mode"]]} note="논리 좌표는 유지하고 물리 chunk bits만 바꿉니다"/><SwizzleDesktop step={step}/></>}</StepViz>}
