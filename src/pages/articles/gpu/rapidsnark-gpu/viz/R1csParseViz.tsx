import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  r1cs: '#0ea5e9',
  sparse: '#10b981',
  layout: '#a855f7',
  zkey: '#f59e0b',
  cache: '#ef4444',
};

const STEPS = [
  {
    label: 'R1CS 등식 — A·w ⊙ B·w = C·w',
    body: 'witness 벡터 w와 세 행렬 A, B, C로 표현된 제약.\n각 제약 i에 대해: (A_i · w) · (B_i · w) = (C_i · w).',
  },
  {
    label: '희소 형식 (compressed sparse)',
    body: '각 행 A_i, B_i, C_i는 (인덱스, 계수) 쌍의 리스트.\n대부분의 회로는 행 하나당 비-0 항목 수 ≪ n.\n파일 크기 = O(비-0 항목 수), n^2 아님.',
  },
  {
    label: 'rapidsnark 메모리 레이아웃',
    body: 'struct Constraint { vector<pair<u32, Fr>> a, b, c; };\n전체 제약을 단일 vector에 연속 배치.\nNTT/MSM 단계에서 캐시 친화적 sequential access.',
  },
  {
    label: '.zkey — proving key (CRS)',
    body: 'vk_alpha, vk_beta, vk_delta — 검증 키 원소.\nwitness 변수별 G1/G2 SRS 점.\nA, B, C 다항식의 NTT 평가 형태 계수 배열.',
  },
];

export default function R1csParseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            .r1cs 파싱 & 메모리 레이아웃
          </text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={36} w={130} h={40} label="A · w" color={C.r1cs} outlined />
              <text x={160} y={62} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.r1cs}>⊙</text>
              <DataBox x={170} y={36} w={130} h={40} label="B · w" color={C.r1cs} outlined />
              <text x={310} y={62} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.r1cs}>=</text>
              <DataBox x={320} y={36} w={130} h={40} label="C · w" color={C.r1cs} outlined />
              <DataBox x={20} y={96} w={430} h={36} label="제약마다 위 등식이 성립해야 함" sub="w = witness 벡터" color={C.r1cs} outlined />
              <StatusBox x={20} y={142} w={430} h={36} label="2^20 제약 = ~100만 등식" sub="sparse 행렬로 압축 저장" color={C.r1cs} progress={1} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={36} w={440} h={20} label="A_i (희소 행) — 비-0 항목만" color={C.sparse} />
              {[
                { idx: 3, c: 'a_3' }, { idx: 17, c: 'a_17' }, { idx: 42, c: 'a_42' }, { idx: 89, c: 'a_89' },
              ].map((p, i) => (
                <g key={i}>
                  <DataBox x={30 + i * 110} y={64} w={50} h={28} label={`idx=${p.idx}`} color={C.sparse} outlined />
                  <DataBox x={82 + i * 110} y={64} w={48} h={28} label={p.c} color={C.sparse} outlined />
                </g>
              ))}
              <DataBox x={20} y={104} w={440} h={36} label="평균 비-0 항목 수 ≪ n — 파일 크기 O(non-zeros)" color={C.sparse} outlined />
              <StatusBox x={20} y={150} w={440} h={36} label="압축률 ≈ 100~1000×" sub="조밀 행렬 대비" color={C.sparse} progress={0.95} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={36} w={440} h={20} label="vector<Constraint> — 연속 배치" color={C.layout} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <DataBox key={i} x={20 + i * 76} y={64} w={70} h={32} label={`C[${i}]`} sub="a, b, c" color={C.layout} outlined />
              ))}
              <DataBox x={20} y={104} w={440} h={36} label="cache line(64B)에 인접 제약 함께 적재" sub="prefetch 친화적" color={C.cache} outlined />
              <StatusBox x={20} y={150} w={440} h={36} label="L2/L3 히트율 ↑ — NTT/MSM 입력 준비 가속" color={C.layout} progress={0.85} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={20} y={36} w={440} h={20} label=".zkey 내용" color={C.zkey} />
              <DataBox x={30} y={64} w={130} h={32} label="vk_alpha" sub="G1 검증키" color={C.zkey} outlined />
              <DataBox x={170} y={64} w={130} h={32} label="vk_beta" sub="G2 검증키" color={C.zkey} outlined />
              <DataBox x={310} y={64} w={140} h={32} label="vk_delta" sub="G1 검증키" color={C.zkey} outlined />
              <DataBox x={30} y={104} w={200} h={36} label="witness 별 G1 SRS 점" sub="MSM 입력" color={C.zkey} outlined />
              <DataBox x={250} y={104} w={200} h={36} label="witness 별 G2 SRS 점" sub="pi_B 계산용" color={C.zkey} outlined />
              <DataBox x={30} y={150} w={420} h={36} label="A, B, C 다항식 계수 배열 (NTT eval form)" color={C.zkey} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
