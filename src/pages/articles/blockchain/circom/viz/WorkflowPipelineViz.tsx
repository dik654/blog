import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const C = {
  write:   '#3b82f6',
  compile: '#10b981',
  setup:   '#f59e0b',
  witness: '#ec4899',
  prove:   '#8b5cf6',
  verify:  '#06b6d4',
};

const STEPS = [
  { label: '1. 회로 작성',    body: 'circuit.circom — 템플릿·시그널·제약을 DSL로 선언. 증명할 관계(예: hash(x)=y)를 수식화.' },
  { label: '2. 컴파일',       body: 'circom circuit.circom --r1cs --wasm --sym\n→ .r1cs (제약), .wasm (증인 계산기), .sym (심볼), .cpp (네이티브)' },
  { label: '3. Trusted Setup', body: 'Powers of Tau (.ptau) + .r1cs → Groth16 / PLONK 회로별 키 생성 (.zkey).\nzkey에서 verification key(.vkey.json) 추출.' },
  { label: '4. 증인 생성',     body: '.wasm 증인 계산기에 input.json 전달 → 모든 시그널 값을 계산하여 witness.wtns 생성.' },
  { label: '5. 증명 생성',     body: 'witness.wtns + proving key(.zkey) → Groth16.prove() → proof.json + public.json.' },
  { label: '6. 검증',         body: 'verification key(.vkey.json) + proof.json + public.json → Groth16.verify() → true / false.' },
];

// ── Arrow helpers ────────────────────────────────────────────────
function Arrow({ x1, y1, x2, y2, color, active, delay = 0 }:
  { x1: number; y1: number; x2: number; y2: number; color: string; active: boolean; delay?: number }) {
  return (
    <motion.line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.3}
      markerEnd={active ? `url(#arr-${color.slice(1)})` : undefined}
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 0.8 : 0.1 }}
      transition={{ duration: 0.35, delay }}
    />
  );
}

function Defs() {
  return (
    <defs>
      {Object.values(C).map(c => (
        <marker key={c} id={`arr-${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5"
          markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

// ── Panels per step ──────────────────────────────────────────────
function StepWrite() {
  return (
    <>
      <Defs />
      <ActionBox x={40}  y={85} w={120} h={50} color={C.write} label="에디터" sub="circuit.circom 편집" />
      <Arrow x1={165} y1={110} x2={215} y2={110} color={C.write} active delay={0.15} />
      <DataBox   x={220} y={92}  w={110} h={36} color={C.write} label="circuit.circom" sub="템플릿·시그널·제약" outlined />
      <text x={240} y={180} fontSize={9} fill="var(--muted-foreground)">
        template Multiplier() {`{ signal input a,b; signal output c; c <== a*b; }`}
      </text>
    </>
  );
}

function StepCompile() {
  const outs = [
    { x: 330, y: 30,  label: '.r1cs', sub: '제약 시스템',      col: '#0ea5e9' },
    { x: 330, y: 75,  label: '.wasm', sub: '증인 계산기',      col: '#22c55e' },
    { x: 330, y: 120, label: '.sym',  sub: '심볼 테이블',      col: '#f59e0b' },
    { x: 330, y: 165, label: '.cpp',  sub: 'C++ 네이티브',     col: '#a855f7' },
  ];
  return (
    <>
      <Defs />
      <DataBox   x={20}  y={92}  w={100} h={36} color={C.write}   label="circuit.circom" outlined />
      <ModuleBox x={150} y={86}  w={130} h={48} color={C.compile} label="circom compiler" sub="--r1cs --wasm --sym" />
      {outs.map((o, i) => (
        <motion.g key={o.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.15 + i * 0.1 }}>
          <Arrow x1={285} y1={110} x2={o.x - 5} y2={o.y + 16} color={o.col} active delay={0.15 + i * 0.1} />
          <DataBox x={o.x} y={o.y} w={110} h={32} color={o.col} label={o.label} sub={o.sub} outlined />
        </motion.g>
      ))}
      <Arrow x1={123} y1={110} x2={148} y2={110} color={C.compile} active />
    </>
  );
}

function StepSetup() {
  return (
    <>
      <Defs />
      <DataBox   x={20}  y={45}  w={110} h={34} color="#0ea5e9" label=".r1cs"      sub="제약 시스템" outlined />
      <DataBox   x={20}  y={135} w={110} h={34} color={C.setup} label="powers.ptau" sub="범용 셋업"   outlined />
      <ModuleBox x={175} y={86}  w={130} h={48} color={C.setup} label="Groth16 / PLONK" sub="setup(r1cs, ptau)" />
      <Arrow x1={135} y1={62}  x2={173} y2={100} color={C.setup} active />
      <Arrow x1={135} y1={152} x2={173} y2={120} color={C.setup} active delay={0.1} />
      <Arrow x1={310} y1={102} x2={355} y2={70}  color={C.setup} active delay={0.25} />
      <Arrow x1={310} y1={118} x2={355} y2={150} color={C.setup} active delay={0.25} />
      <DataBox x={360} y={52}  w={110} h={34} color="#8b5cf6" label="circuit.zkey"   sub="proving key"      outlined />
      <DataBox x={360} y={132} w={110} h={34} color="#06b6d4" label="verification_key" sub=".vkey.json"      outlined />
    </>
  );
}

function StepWitness() {
  return (
    <>
      <Defs />
      <DataBox   x={20}  y={45}  w={110} h={34} color="#22c55e" label="circuit.wasm" sub="증인 계산기" outlined />
      <DataBox   x={20}  y={135} w={110} h={34} color={C.witness} label="input.json"  sub="공개+비공개 입력" outlined />
      <ActionBox x={175} y={86}  w={130} h={48} color={C.witness} label="snarkjs wc"     sub="generate_witness.js" />
      <Arrow x1={135} y1={62}  x2={173} y2={100} color={C.witness} active />
      <Arrow x1={135} y1={152} x2={173} y2={120} color={C.witness} active delay={0.1} />
      <Arrow x1={310} y1={110} x2={355} y2={110} color={C.witness} active delay={0.25} />
      <DataBox x={360} y={92} w={110} h={36} color={C.witness} label="witness.wtns" sub="모든 시그널 값" outlined />
    </>
  );
}

function StepProve() {
  return (
    <>
      <Defs />
      <DataBox   x={20}  y={45}  w={110} h={34} color={C.witness} label="witness.wtns" sub="시그널 값"       outlined />
      <DataBox   x={20}  y={135} w={110} h={34} color="#8b5cf6"   label="circuit.zkey"  sub="proving key"     outlined />
      <ModuleBox x={175} y={86}  w={130} h={48} color={C.prove}   label="Groth16.prove" sub="pairing + MSM" />
      <Arrow x1={135} y1={62}  x2={173} y2={100} color={C.prove} active />
      <Arrow x1={135} y1={152} x2={173} y2={120} color={C.prove} active delay={0.1} />
      <Arrow x1={310} y1={102} x2={355} y2={70}  color={C.prove} active delay={0.3} />
      <Arrow x1={310} y1={118} x2={355} y2={150} color={C.prove} active delay={0.3} />
      <DataBox x={360} y={52}  w={110} h={34} color={C.prove}  label="proof.json"   sub="(A, B, C)"      outlined />
      <DataBox x={360} y={132} w={110} h={34} color={C.verify} label="public.json"  sub="공개 입력·출력" outlined />
    </>
  );
}

function StepVerify() {
  return (
    <>
      <Defs />
      <DataBox   x={10}  y={30}  w={120} h={32} color="#06b6d4"   label="verification_key" outlined />
      <DataBox   x={10}  y={95}  w={120} h={32} color={C.prove}   label="proof.json"       outlined />
      <DataBox   x={10}  y={160} w={120} h={32} color={C.verify}  label="public.json"      outlined />
      <ModuleBox x={180} y={86}  w={130} h={48} color={C.verify} label="Groth16.verify"  sub="e(A,B) = e(α,β)·…" />
      <Arrow x1={135} y1={46}  x2={178} y2={100} color={C.verify} active />
      <Arrow x1={135} y1={111} x2={178} y2={111} color={C.verify} active delay={0.08} />
      <Arrow x1={135} y1={176} x2={178} y2={120} color={C.verify} active delay={0.16} />
      <Arrow x1={315} y1={110} x2={360} y2={110} color={C.verify} active delay={0.3} />
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, delay: 0.4 }}>
        <rect x={365} y={88} width={95} height={46} rx={8}
          fill={`${C.verify}1a`} stroke={C.verify} strokeWidth={1.8} />
        <text x={412.5} y={108} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.verify}>true</text>
        <text x={412.5} y={123} textAnchor="middle" fontSize={8}  fill="var(--muted-foreground)">/ false</text>
      </motion.g>
    </>
  );
}

// ── Root ────────────────────────────────────────────────────────
const PANELS = [StepWrite, StepCompile, StepSetup, StepWitness, StepProve, StepVerify];

export default function WorkflowPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Panel = PANELS[step];
        return (
          <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Panel />
          </svg>
        );
      }}
    </StepViz>
  );
}
