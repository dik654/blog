import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_LIB = '#10b981';
const C_TOOL = '#6366f1';
const C_FLAG = '#f59e0b';

const LIBS = [
  { name: 'libsodium', desc: 'NaCl 기반, fully CT, 사용 쉬움' },
  { name: 'BearSSL', desc: '임베디드 친화, 100% CT' },
  { name: 'Intel IPP Crypto', desc: 'CT branches 옵션' },
  { name: 'BoringSSL', desc: '선별적 CT (Google)' },
  { name: 'OpenSSL recent', desc: 'CT 개선 진행 중' },
];

const TOOLS = [
  'ctverif (LLVM 기반)',
  'Flow-tracker (dynamic taint)',
  'TIS-Interpreter (symbolic)',
  'Valgrind ctgrind',
];

const FLAGS = [
  '-fno-jump-tables',
  '-fstack-protector-strong',
  '__attribute__((no_optimize))',
];

const STEPS = [
  {
    label: '검증된 constant-time 라이브러리 — 5종',
    body: 'libsodium·BearSSL·Intel IPP·BoringSSL·OpenSSL.\n자체 구현보다 검증된 라이브러리 사용이 안전하다.',
  },
  {
    label: 'CT 검증 도구 — 정적/동적/심볼릭',
    body: 'ctverif는 LLVM IR을 검증.\nctgrind는 valgrind 위에서 메모리 접근 패턴을 추적.',
  },
  {
    label: '컴파일러 flag — 자동 변환',
    body: '-fno-jump-tables: switch가 jump table이 아닌 CT 코드로.\nstack protector·no_optimize 속성으로 보안 보존.',
  },
];

export default function CtLibrariesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {LIBS.map((l, i) => {
                const y = 20 + i * 38;
                return (
                  <motion.g key={l.name} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <ModuleBox x={40} y={y} w={140} h={28} label={l.name} color={C_LIB} />
                    <text x={195} y={y + 18} fontSize={9} fill="var(--foreground)">{l.desc}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_TOOL}>
                CT 검증 도구
              </text>
              {TOOLS.map((t, i) => {
                const y = 36 + i * 42;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <DataBox x={70} y={y} w={340} h={32} label={t} color={C_TOOL} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill={C_FLAG}>
                GCC / Clang flag
              </text>
              {FLAGS.map((f, i) => {
                const y = 50 + i * 50;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
                    <DataBox x={70} y={y} w={340} h={36} label={f} color={C_FLAG} outlined />
                  </motion.g>
                );
              })}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
