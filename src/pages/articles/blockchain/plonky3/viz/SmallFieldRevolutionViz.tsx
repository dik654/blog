import { useState } from 'react';
import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const SMALL_FIELDS = [
  { name: 'BabyBear', p: '2^31 - 2^27 + 1', bits: 31, color: '#10b981',
    note: '2-adic FFT (2^27). Montgomery 곱셈 최적.' },
  { name: 'KoalaBear', p: '2^31 - 2^24 + 1', bits: 31, color: '#14b8a6',
    note: 'BabyBear 변형. 더 많은 2-adicity 케이스.' },
  { name: 'Mersenne31', p: '2^31 - 1', bits: 31, color: '#6366f1',
    note: '비트 마스크 리덕션. Circle FFT.' },
  { name: 'Goldilocks', p: '2^64 - 2^32 + 1', bits: 64, color: '#f59e0b',
    note: '64-bit 네이티브. 큰 FFT 도메인.' },
];

const STEPS = [
  { label: '전통 SNARK vs Small Field',
    body: '좌측: BN254/BLS12-381 (254-bit, pairing-friendly).\n우측: BabyBear/KoalaBear/Mersenne31/Goldilocks (31~64-bit).\n칩을 클릭해 각 필드 특성 확인.' },
  { label: '1. 왜 small field 인가?',
    body: 'CPU 레지스터 한 번에 들어가는 크기.\n254-bit는 4개 limb 필요, 31-bit는 단일 워드.\nMontgomery 곱셈 / mod reduction 비용이 수~수십 배 차이.' },
  { label: '2. 메모리 & GPU 우위',
    body: '같은 트레이스 폭 기준 4-8x 적은 메모리.\nAVX-512 / CUDA 레인에 필드 원소 패킹 가능.\n→ 더 큰 circuit, 더 빠른 prover.' },
  { label: '3. 단점: security & EVM',
    body: 'Small field 자체는 128-bit security 부족.\nPairing 불가 → EVM verify 비용 높음.\nBN254 wrapper 또는 Groth16 snark-wrap 필요.' },
  { label: '4. 해결책: extension field',
    body: 'F_p 위에 차수 4~5 확장체 F_{p^k} 사용.\n챌린지·FRI 쿼리 포인트는 확장체에서 샘플링.\n트레이스는 base field, 보안은 extension 에서 확보.' },
  { label: '5. 실제 사용처',
    body: 'zkVM: SP1 (BabyBear), Valida, Risc Zero.\nSTARK prover 가속 엔진.\nRecursive proof의 intermediate 레이어 (최종 wrap 전).' },
];

function LargeFieldPanel({ active }: { active: boolean }) {
  return (
    <g opacity={active ? 1 : 0.25}>
      <ModuleBox x={15} y={40} w={170} h={52} color="#ef4444"
        label="전통 SNARK" sub="254~381-bit large field" />
      <DataBox x={25} y={105} w={70} h={24} color="#ef4444" label="BN254" sub="254-bit" />
      <DataBox x={105} y={105} w={70} h={24} color="#ef4444" label="BLS12-381" sub="381-bit" />
      <text x={100} y={152} textAnchor="middle" fontSize={8} fill="#ef4444">
        pairing-friendly
      </text>
      <text x={100} y={164} textAnchor="middle" fontSize={8} fill="#ef4444" opacity={0.7}>
        EVM verify 가능
      </text>
      <text x={100} y={180} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        4 limbs, 느린 곱셈
      </text>
    </g>
  );
}

function SmallFieldPanel({ step, hovered, setHovered }: {
  step: number; hovered: number | null; setHovered: (i: number | null) => void;
}) {
  const chipW = 78, chipH = 28, gap = 6;
  const startX = 295, startY = 60;
  return (
    <g>
      <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
        <ModuleBox x={285} y={20} w={180} h={32} color="#10b981"
          label="Small Field" sub="31~64-bit" />
      </motion.g>
      {SMALL_FIELDS.map((f, i) => {
        const row = Math.floor(i / 2), col = i % 2;
        const x = startX + col * (chipW + gap);
        const y = startY + row * (chipH + gap);
        const isHover = hovered === i;
        const emphasis = step === 1 || step === 2 ? 1 : 0.7;
        return (
          <motion.g key={f.name}
            onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
            style={{ cursor: 'pointer' }}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: isHover ? 1 : emphasis, scale: isHover ? 1.04 : 1 }}
            transition={{ duration: 0.2 }}>
            <rect x={x} y={y} width={chipW} height={chipH} rx={6}
              fill={`${f.color}14`} stroke={f.color} strokeWidth={isHover ? 1.4 : 0.8} />
            <text x={x + chipW / 2} y={y + 12} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={f.color}>{f.name}</text>
            <text x={x + chipW / 2} y={y + 22} textAnchor="middle"
              fontSize={7.5} fill={f.color} opacity={0.8}>{f.bits}-bit</text>
          </motion.g>
        );
      })}
      {/* Memory / GPU highlight at step 2 */}
      <motion.g initial={{ opacity: 0 }}
        animate={{ opacity: step === 2 ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <rect x={285} y={138} width={180} height={44} rx={6}
          fill="#10b98110" stroke="#10b981" strokeWidth={0.8} />
        <text x={375} y={154} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          4-8x less memory
        </text>
        <text x={375} y={168} textAnchor="middle" fontSize={8} fill="#10b981" opacity={0.8}>
          AVX-512 / GPU lane packing
        </text>
        <text x={375} y={178} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          single-word Montgomery mul
        </text>
      </motion.g>
      {/* Why small at step 1 */}
      <motion.g initial={{ opacity: 0 }}
        animate={{ opacity: step === 1 ? 1 : 0 }} transition={{ duration: 0.3 }}>
        <text x={375} y={148} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#10b981">
          fits a single CPU word
        </text>
        <text x={375} y={162} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          no multi-limb arithmetic
        </text>
        <text x={375} y={174} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          ~10x faster field ops
        </text>
      </motion.g>
    </g>
  );
}

function ConsArrow({ step }: { step: number }) {
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: step === 3 ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <AlertBox x={150} y={125} w={180} h={56} color="#ef4444"
        label="small field 단점" sub="<128-bit security, no pairing" />
      <text x={240} y={192} textAnchor="middle" fontSize={7.5} fill="#ef4444" opacity={0.8}>
        EVM verify → BN254 wrap 필요
      </text>
    </motion.g>
  );
}

function ExtensionSolution({ step }: { step: number }) {
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: step === 4 ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <rect x={120} y={120} width={240} height={60} rx={8}
        fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={1} strokeDasharray="4 3" />
      <text x={240} y={140} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
        extension field F_{'{p^k}'} (k=4~5)
      </text>
      <text x={240} y={156} textAnchor="middle" fontSize={8} fill="#8b5cf6" opacity={0.85}>
        challenges & FRI queries → F_{'{p^k}'}
      </text>
      <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        trace는 base field, 보안은 확장체
      </text>
    </motion.g>
  );
}

function UsageStage({ step }: { step: number }) {
  const items = [
    { x: 60, label: 'SP1', sub: 'BabyBear zkVM', color: '#10b981' },
    { x: 170, label: 'Valida', sub: 'zkVM', color: '#14b8a6' },
    { x: 270, label: 'Risc Zero', sub: 'BabyBear', color: '#6366f1' },
    { x: 380, label: 'STARK prover', sub: '가속 엔진', color: '#f59e0b' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }}
      animate={{ opacity: step === 5 ? 1 : 0 }} transition={{ duration: 0.3 }}>
      <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--foreground)">
        실제 사용처
      </text>
      {items.map((it) => (
        <DataBox key={it.label} x={it.x} y={130} w={85} h={30}
          color={it.color} label={it.label} sub={it.sub} />
      ))}
    </motion.g>
  );
}

export default function SmallFieldRevolutionViz() {
  const [hovered, setHovered] = useState<number | null>(null);
  const hoveredField = hovered !== null ? SMALL_FIELDS[hovered] : null;

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-2xl space-y-2">
          <svg viewBox="0 0 480 200" className="w-full" style={{ height: 'auto' }}>
            {/* Large field panel — dimmed when focusing small field advantages */}
            <LargeFieldPanel active={step === 0 || step === 3} />

            {/* Divider */}
            <motion.line x1={240} y1={15} x2={240} y2={185}
              stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 3"
              animate={{ opacity: step === 0 ? 0.8 : 0.25 }} />

            {/* Small field chips (visible all steps, muted at step 3/4 center overlays) */}
            <SmallFieldPanel step={step} hovered={hovered} setHovered={setHovered} />

            {/* Step-specific overlays */}
            <ConsArrow step={step} />
            <ExtensionSolution step={step} />
            <UsageStage step={step} />

            {/* Arrow: small → wrap at step 3 */}
            <motion.g initial={{ opacity: 0 }}
              animate={{ opacity: step === 3 ? 0.7 : 0 }} transition={{ duration: 0.3 }}>
              <line x1={330} y1={100} x2={260} y2={150} stroke="#ef4444"
                strokeWidth={1} strokeDasharray="3 2" markerEnd="url(#arr-red)" />
            </motion.g>
            <defs>
              <marker id="arr-red" markerWidth={6} markerHeight={6}
                refX={5} refY={3} orient="auto">
                <path d="M0,0 L6,3 L0,6 z" fill="#ef4444" />
              </marker>
            </defs>
          </svg>
          {hoveredField && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border px-3 py-2 text-xs font-mono"
              style={{ borderColor: hoveredField.color + '40',
                background: hoveredField.color + '08', color: hoveredField.color }}>
              <span className="font-bold">{hoveredField.name}</span>
              <span className="mx-2 opacity-60">p = {hoveredField.p}</span>
              <span className="text-foreground/60 font-sans">{hoveredField.note}</span>
            </motion.div>
          )}
        </div>
      )}
    </StepViz>
  );
}
