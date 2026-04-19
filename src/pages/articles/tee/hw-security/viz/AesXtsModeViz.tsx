import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'AES-XTS 공식 — C = AES_K1(P ⊕ T) ⊕ T, T = AES_K2(tweak)' },
  { label: '이중 키 — K1 (데이터 암호화), K2 (tweak 암호화)' },
  { label: '블록별 독립 암호화 — 같은 평문도 주소 다르면 다른 암호문' },
  { label: '병렬 처리 가능 — 멀티코어/파이프라인 친화' },
  { label: 'XTS vs CTR vs GCM — XTS는 길이 동일·무결성 X, GCM은 MAC 추가' },
];

const FORMULA_BOXES = [
  { name: 'P', sub: 'plaintext', c: '#6b7280' },
  { name: 'T = AES_K2(tweak)', sub: '주소 기반 tweak', c: '#6366f1' },
  { name: 'P ⊕ T', sub: 'XOR 후 입력', c: '#10b981' },
  { name: 'AES_K1(...)', sub: '실제 암호화', c: '#f59e0b' },
  { name: 'C = ⊕ T', sub: '최종 출력', c: '#0ea5e9' },
];

const KEYS = [
  { name: 'K1 — Data Key', sub: '256-bit (XTS-AES-256 시 두 절반 합성)', c: '#6366f1' },
  { name: 'K2 — Tweak Key', sub: 'tweak 값 암호화 전용', c: '#10b981' },
];

const INDEPENDENT = [
  { line: '메모리 주소 A1, A2 다름 → tweak T 다름', c: '#6366f1' },
  { line: '같은 P여도 다른 C 출력', c: '#10b981' },
  { line: 'Rainbow table / dictionary 공격 무력화', c: '#ef4444' },
];

const PARALLEL = [
  { name: 'Block 0', sub: '독립 연산', c: '#6366f1' },
  { name: 'Block 1', sub: '독립 연산', c: '#10b981' },
  { name: 'Block 2', sub: '독립 연산', c: '#f59e0b' },
  { name: 'Block N', sub: '독립 연산', c: '#0ea5e9' },
];

const COMPARE = [
  { name: 'XTS', sub: '길이 동일, 무결성 X', c: '#6366f1' },
  { name: 'CTR', sub: 'stream cipher, 무결성 X', c: '#10b981' },
  { name: 'GCM', sub: 'MAC 추가, 무결성 O', c: '#f59e0b' },
];

export default function AesXtsModeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              AES-XTS Pipeline
            </text>
            {FORMULA_BOXES.map((b, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={50} y={42 + i * 36} width={420} height={28} rx={4}
                  fill={`${b.c}10`} stroke={`${b.c}40`} strokeWidth={0.8} />
                <text x={70} y={61 + i * 36} fontSize={11} fontWeight={700} fill={b.c}
                  style={{ fontFamily: 'monospace' }}>{b.name}</text>
                <text x={300} y={61 + i * 36} fontSize={9.5} fill="var(--muted-foreground)">{b.sub}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              이중 키 구조 — K1 + K2
            </text>
            {KEYS.map((k, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={70 + i * 60} w={420} h={48}
                  label={k.name} sub={k.sub} color={k.c} />
              </motion.g>
            ))}
            <text x={260} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              K1 = K2 사용 금지 (보안성 약화) — 별도 derive 권장
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#f59e0b">
              블록별 독립 암호화
            </text>
            {INDEPENDENT.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 50} width={420} height={36} rx={5}
                  fill={`${p.c}10`} stroke={`${p.c}50`} strokeWidth={0.8} />
                <rect x={50} y={50 + i * 50} width={4} height={36} fill={p.c} />
                <text x={70} y={72 + i * 50} fontSize={11} fontWeight={600} fill={p.c}>{p.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              병렬 처리 가능
            </text>
            {PARALLEL.map((p, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}>
                <DataBox x={20 + i * 125} y={70} w={115} h={48}
                  label={p.name} sub={p.sub} color={p.c} outlined />
              </motion.g>
            ))}
            <text x={260} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              하드웨어 구현 친화 — pipeline depth 깊게 가능
            </text>
            <text x={260} y={175} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              메모리 컨트롤러 내장 AES 엔진의 핵심 설계 이유
            </text>
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              XTS vs CTR vs GCM
            </text>
            {COMPARE.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={c.name} sub={c.sub} color={c.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              메모리 암호화 = XTS/CTR 주류, GCM은 메타데이터 오버헤드 큼
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
