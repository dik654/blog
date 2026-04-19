import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  hdr: '#0ea5e9',
  field: '#10b981',
  values: '#a855f7',
  mmap: '#f59e0b',
  bytes: '#94a3b8',
};

const STEPS = [
  {
    label: '.wtns 파일 헤더',
    body: 'magic = "wtns" (4바이트), version = 2 (4바이트), num_sections = 2.\n포맷 식별 + 버전 호환성 검사 — 잘못된 파일 즉시 거부.',
  },
  {
    label: 'Section 1: Field Info',
    body: 'field_size = 32바이트 (BN128 Fr).\n전체 witness 값들이 어떤 유한체에 속하는지 명시.',
  },
  {
    label: 'Section 2: Witness Values',
    body: 'n_witness — 제약 변수 개수 (회로 크기에 따라 수만~수십만).\nvalues[0..n] — 각 32바이트 little-endian Fr 원소.',
  },
  {
    label: '대형 회로 — mmap 전략',
    body: '2^20+ 제약: .wtns 크기가 GB 단위.\nmmap()으로 파일을 가상 주소공간에 매핑 → 페이지 폴트로 lazy load.\n메모리 사용량 = 파일 크기와 거의 동일 (실제 RSS는 더 작음).',
  },
];

export default function WtnsFormatViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            .wtns 바이너리 포맷 & mmap 전략
          </text>

          {/* 파일 레이아웃 - 항상 표시 */}
          <ModuleBox x={20} y={28} w={440} h={20} label=".wtns binary layout" color={C.bytes} />

          {/* 헤더 */}
          <motion.g initial={false}
            animate={{ opacity: step === 0 ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
            <DataBox x={30} y={56} w={130} h={28} label="magic 'wtns'" sub="4 bytes" color={C.hdr}
              outlined={step === 0} />
            <DataBox x={170} y={56} w={130} h={28} label="version 2" sub="4 bytes" color={C.hdr}
              outlined={step === 0} />
            <DataBox x={310} y={56} w={140} h={28} label="num_sections=2" sub="4 bytes" color={C.hdr}
              outlined={step === 0} />
          </motion.g>

          {/* Section 1 */}
          <motion.g initial={false}
            animate={{ opacity: step === 1 ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
            <DataBox x={30} y={94} w={420} h={28} label="Section 1: field_size = 32 bytes (BN128 Fr)"
              color={C.field} outlined={step === 1} />
          </motion.g>

          {/* Section 2 */}
          <motion.g initial={false}
            animate={{ opacity: step === 2 ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
            <DataBox x={30} y={130} w={130} h={28} label="n_witness" sub="제약 변수 수"
              color={C.values} outlined={step === 2} />
            {[0, 1, 2, 3, 4].map((i) => (
              <DataBox key={i} x={170 + i * 56} y={130} w={50} h={28}
                label={`v[${i}]`} sub="32B Fr" color={C.values} outlined={step === 2} />
            ))}
          </motion.g>

          {/* 어노테이션 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={180} w={460} h={36}
                label="헤더로 포맷 검증 — 잘못된 파일 즉시 거부"
                sub="magic 불일치 → load 실패"
                color={C.hdr} outlined />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={180} w={460} h={36}
                label="필드 메타데이터 — Fr 곱셈 시 modulus 결정"
                color={C.field} outlined />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={180} w={460} h={36}
                label="32바이트 little-endian Fr 원소 n개 — 전체 크기 = 32 · n_witness"
                color={C.values} outlined />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={180} w={220} h={36} label="mmap(file)" sub="가상 주소공간 매핑"
                color={C.mmap} />
              <StatusBox x={250} y={180} w={210} h={36} label="lazy load via page fault"
                sub="필요 영역만 RAM 적재" color={C.mmap} progress={0.4} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
