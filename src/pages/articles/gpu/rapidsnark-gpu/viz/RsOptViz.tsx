import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  asm: '#0ea5e9',
  ntt: '#10b981',
  pool: '#f59e0b',
  crs: '#a855f7',
  win: '#ef4444',
};

const STEPS = [
  {
    label: '1. ffiasm 어셈블리 — Fp 곱셈',
    body: 'x86-64 ADX/MULX 명령어로 256비트 Montgomery 곱셈 직접 작성.\nGMP 대비 4~5×, 컴파일 타임에 BN128 특화 코드 생성.',
  },
  {
    label: '2. 멀티스레드 NTT — OpenMP',
    body: 'Cooley-Tukey butterfly를 스레드별 독립 구간으로 분할.\n캐시 블로킹: L2에 맞는 단위로 NTT 분할 → 캐시 미스 최소화.\n2^20 NTT: 단일 스레드 800ms → 16스레드 60ms.',
  },
  {
    label: '3. GPU MSM 메모리 풀',
    body: '증명 시작 시 cudaMalloc 1회, 이후 재사용.\ncudaMalloc/cudaFree 오버헤드 제거 (~5ms/회).\n연속 증명 시 GPU 메모리 재할당 없음.',
  },
  {
    label: '4. CRS 사전 변환',
    body: '.zkey 로드 시 affine → Montgomery 좌표 변환을 1회만.\n매 증명마다 반복 변환 방지 (서버 모드에서 효과 큼).\nG2 포인트도 동일하게 사전 변환.',
  },
];

const OPT_NAMES = [
  { id: 'asm', label: 'ffiasm asm', color: C.asm },
  { id: 'ntt', label: 'NTT OpenMP', color: C.ntt },
  { id: 'pool', label: 'GPU mem pool', color: C.pool },
  { id: 'crs', label: 'CRS 사전 변환', color: C.crs },
];

export default function RsOptViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            rapidsnark 4가지 핵심 최적화
          </text>

          {/* 4개 타일 */}
          {OPT_NAMES.map((o, i) => {
            const isActive = i === step;
            const x = 14 + (i % 4) * 116;
            return (
              <motion.g key={o.id} initial={{ opacity: 0.4 }}
                animate={{ opacity: isActive ? 1 : 0.4 }} transition={{ duration: 0.25 }}>
                <rect x={x} y={36} width={108} height={42} rx={6}
                  fill={isActive ? o.color + '20' : 'var(--card)'}
                  stroke={o.color} strokeWidth={isActive ? 1.2 : 0.5} />
                <rect x={x} y={36} width={108} height={4} fill={o.color} opacity={0.85} />
                <text x={x + 54} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={o.color}>{o.label}</text>
                <text x={x + 54} y={73} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{`#${i + 1}`}</text>
              </motion.g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={440} h={36} label="x86-64 ADX/MULX 명령어 — 256비트 Montgomery mul" color={C.asm} outlined />
              <DataBox x={20} y={146} w={210} h={36} label="vs GMP" sub="≈ 4~5×" color={C.asm} outlined />
              <DataBox x={250} y={146} w={210} h={36} label="vs JS BigInt" sub="≈ 100×" color={C.asm} outlined />
              <StatusBox x={20} y={192} w={440} h={36} label="컴파일 타임에 커브별 코드 생성 — BN128 특화" color={C.asm} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={100} w={210} h={36} label="butterfly 분할" sub="스레드별 독립 구간" color={C.ntt} />
              <ActionBox x={250} y={100} w={210} h={36} label="cache blocking" sub="L2 size에 맞춤" color={C.ntt} />
              <DataBox x={20} y={146} w={210} h={36} label="단일 스레드: 800ms" color={C.ntt} outlined />
              <DataBox x={250} y={146} w={210} h={36} label="16T: 60ms" color={C.ntt} outlined />
              <StatusBox x={20} y={192} w={440} h={36} label="≈ 13× 가속" color={C.ntt} progress={0.93} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={440} h={36} label="cudaMalloc 1회 → reuse" sub="첫 증명에만 비용" color={C.pool} outlined />
              <DataBox x={20} y={146} w={210} h={36} label="기존: malloc/free × N" sub="~5ms/회 누적" color={C.pool} outlined />
              <DataBox x={250} y={146} w={210} h={36} label="풀: 0ms 추가" color={C.pool} outlined />
              <StatusBox x={20} y={192} w={440} h={36} label="연속 증명에 큰 이득 (서버 모드)" color={C.pool} progress={1} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={100} w={210} h={36} label="affine 좌표 (.zkey 원본)" color={C.crs} outlined />
              <ActionBox x={250} y={100} w={210} h={36} label="→ Montgomery 변환 1회" color={C.crs} />
              <DataBox x={20} y={146} w={440} h={36} label="이후 모든 증명에 변환된 형태 직접 사용" color={C.crs} outlined />
              <StatusBox x={20} y={192} w={440} h={36} label="서버 모드 prover_server에서 큰 효과" color={C.crs} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
