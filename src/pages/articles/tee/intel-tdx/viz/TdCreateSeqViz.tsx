import { motion } from 'framer-motion';

const MNG = '#8b5cf6';
const MEM = '#10b981';
const VP = '#3b82f6';
const MR = '#f59e0b';

interface Step {
  num: number;
  api: string;
  args: string;
  effect: string;
  category: string;
  color: string;
}

const STEPS: Step[] = [
  { num: 1, api: 'TDH.MNG.CREATE', args: '(tdr_pa, hkid)', effect: 'TDR(TD Root) 초기화 + Host KeyID 할당', category: 'MNG', color: MNG },
  { num: 2, api: 'TDH.MNG.ADDCX (×n)', args: '(tdr_pa, tdcs_pa)', effect: 'TDCS 페이지 추가 (TD Control Structure)', category: 'MNG', color: MNG },
  { num: 3, api: 'TDH.MNG.KEYCONFIG', args: '(tdr_pa)', effect: 'MKTME 키 생성 + 활성화', category: 'MNG', color: MNG },
  { num: 4, api: 'TDH.VP.CREATE / ADDCX', args: '(tdvpr_pa, tdr_pa)', effect: 'vCPU 구조체 + 추가 페이지 바인딩', category: 'VP', color: VP },
  { num: 5, api: 'TDH.MNG.INIT', args: '(tdr_pa, td_params)', effect: 'TD_PARAMS 적용 (ATTRIBUTES · XFAM · RTMR)', category: 'MNG', color: MNG },
  { num: 6, api: 'TDH.MEM.PAGE.ADD + MR.EXTEND', args: '(per page)', effect: '초기 이미지 페이지 적재 + MRTD 갱신', category: 'MEM/MR', color: MEM },
  { num: 7, api: 'TDH.MR.FINALIZE', args: '(tdr_pa)', effect: 'MRTD 확정 → 이후 변경 불가', category: 'MR', color: MR },
  { num: 8, api: 'TDH.VP.ENTER', args: '(tdvpr_pa)', effect: 'TD 실행 시작', category: 'VP', color: VP },
];

export default function TdCreateSeqViz() {
  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 380" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={18} textAnchor="middle" fontSize={12} fontWeight={700}
          fill="var(--foreground)">TD 생성 시퀀스 — KVM-TDX 8단계</text>

        {STEPS.map((s, i) => (
          <motion.g key={i}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.1 }}>
            <rect x={20} y={36 + i * 42} width={440} height={36} rx={5}
              fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={0.6} />
            <rect x={20} y={36 + i * 42} width={3.5} height={36} fill={s.color} />

            <circle cx={42} cy={54 + i * 42} r={10} fill={s.color} />
            <text x={42} y={58 + i * 42} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill="white">
              {s.num}
            </text>

            <rect x={60} y={42 + i * 42} width={150} height={14} rx={3}
              fill={s.color} fillOpacity={0.18} stroke={s.color} strokeWidth={0.4} />
            <text x={135} y={52 + i * 42} textAnchor="middle"
              fontSize={7.5} fontFamily="monospace" fontWeight={700} fill={s.color}>
              {s.api}
            </text>

            <text x={215} y={52 + i * 42} fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
              {s.args}
            </text>

            <text x={60} y={67 + i * 42} fontSize={7} fill="var(--muted-foreground)">
              {s.effect}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
