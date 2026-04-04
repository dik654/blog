import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { vk: '#a855f7', pk: '#ec4899', pipe: '#0ea5e9' };

const VK_FIELDS = ['domain', 'cs_degree', 'fixed_commits', 'permutation_commits'];
const PK_EXTRA = ['fixed_polys', 'fixed_cosets', 'l0', 'l_blind', 'l_last'];

const STEPS = [
  { label: '회로 Configure: 제약 시스템 구성', body: 'ConstraintSystem에 열(Advice/Fixed/Instance), 게이트, 룩업, 퍼뮤테이션을 등록합니다.' },
  { label: 'keygen_vk: VerifyingKey 생성', body: 'domain, cs_degree, fixed/permutation 커밋을 포함. 검증자가 사용하는 최소 키.' },
  { label: 'keygen_pk: ProvingKey 생성 (VK 포함)', body: 'VK + fixed 다항식/코셋, l0/l_blind/l_last 라그랑주 다항식. 증명자 전용 추가 데이터.' },
  { label: '키 구조: VK ⊂ PK', body: 'PK는 VK를 포함하며, 코셋 NTT 뒤 extended 도메인에서 평가된 라그랑주 다항식을 추가로 보유합니다.' },
];

const BW = 100, BH = 130, LH = 18;

export default function Halo2KeygenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Pipeline arrow */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <rect x={10} y={65} width={80} height={32} rx={6}
              fill={C.pipe + '18'} stroke={C.pipe} strokeWidth={step === 0 ? 2 : 1} />
            <text x={50} y={78} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.pipe}>Configure</text>
            <text x={50} y={89} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">제약 등록</text>
          </motion.g>
          {step >= 1 && (
            <motion.line x1={90} y1={81} x2={120} y2={81}
              stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 2"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} />
          )}
          {/* VK box */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <rect x={125} y={20} width={BW} height={BH} rx={7}
                fill={C.vk + '10'} stroke={C.vk} strokeWidth={step === 1 ? 2 : 1} />
              <text x={175} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.vk}>VerifyingKey</text>
              {VK_FIELDS.map((f, i) => (
                <motion.text key={f} x={135} y={54 + i * LH} fontSize={9} fill={C.vk}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: i * 0.06 }}>
                  {f}
                </motion.text>
              ))}
            </motion.g>
          )}
          {/* PK box */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={225} y1={81} x2={260} y2={81}
                stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 2" />
              <rect x={265} y={10} width={BW + 30} height={BH + 20} rx={7}
                fill={C.pk + '08'} stroke={C.pk} strokeWidth={step === 2 ? 2 : 1} />
              <text x={330} y={30} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.pk}>ProvingKey</text>
              {/* VK subset indicator */}
              <rect x={275} y={38} width={85} height={24} rx={4}
                fill={C.vk + '15'} stroke={C.vk} strokeWidth={0.8} strokeDasharray="3 1" />
              <text x={317} y={53} textAnchor="middle" fontSize={6.5} fill={C.vk}>VK (포함)</text>
              {PK_EXTRA.map((f, i) => (
                <motion.text key={f} x={278} y={72 + i * (LH - 4)} fontSize={6.5} fill={C.pk}
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: i * 0.05 }}>
                  + {f}
                </motion.text>
              ))}
            </motion.g>
          )}
          {/* Subset diagram */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={160} y={155} width={120} height={14} rx={7}
                fill={C.pk + '15'} stroke={C.pk} strokeWidth={1} />
              <text x={220} y={165} textAnchor="middle" fontSize={9} fill={C.pk} fontWeight={600}>VK ⊂ PK</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
