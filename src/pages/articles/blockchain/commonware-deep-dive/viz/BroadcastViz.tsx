import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '기존 브로드캐스트 문제', body: '리더가 전체 블록을 모든 검증자에게 전송 → 대역폭 낭비, 리더 병목, 리더 비응답 시 전체 지연.' },
  { label: 'Ordered Broadcast 구조', body: '다중 시퀀서가 병렬 브로드캐스트. 검증자가 부분 서명 → 임계 서명 조합 → 인증서가 다음 메시지에 연결.' },
  { label: 'DSMR: 3단계 분리', body: 'Replicate(broadcast) → Sequence(consensus) → Execute(vm). 각 단계 독립적으로 병렬화 가능. 리더 느려도 다른 시퀀서가 전파.' },
  { label: 'ZODA: 제로 오버헤드 DA', body: 'Reed-Solomon 인코딩으로 m개 샤드 분할. 각 검증자는 자기 샤드만 저장. KZG 대비 신뢰 설정 불필요, 더 빠른 성능.' },
];

export default function BroadcastViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={30} y={20} width={70} height={30} rx={5} fill={`${C1}12`} stroke={C1} strokeWidth={1} />
              <text x={65} y={39} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>리더</text>
              {[1, 2, 3].map(i => (
                <g key={i}>
                  <line x1={100} y1={35} x2={170} y2={20 + i * 35} stroke={C1} strokeWidth={0.6} />
                  <rect x={170} y={8 + i * 35} width={70} height={24} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.5} />
                  <text x={205} y={24 + i * 35} textAnchor="middle" fontSize={10} fill={C2}>검증자 {i}</text>
                  <text x={252} y={24 + i * 35} fontSize={10} fill="var(--muted-foreground)">전체 블록</text>
                </g>
              ))}
              <rect x={300} y={40} width={120} height={80} rx={5} fill="#ef444410" stroke="#ef4444" strokeWidth={0.6} />
              <text x={360} y={58} textAnchor="middle" fontSize={10} fontWeight={500} fill="#ef4444">문제점</text>
              <text x={360} y={76} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">대역폭 낭비 (중복)</text>
              <text x={360} y={92} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">리더 병목</text>
              <text x={360} y={108} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">리더 비응답 → 지연</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['Seq 1', 'Seq 2'].map((s, i) => (
                <g key={i}>
                  <rect x={20 + i * 100} y={20} width={70} height={28} rx={4}
                    fill={`${C1}12`} stroke={C1} strokeWidth={0.8} />
                  <text x={55 + i * 100} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>{s}</text>
                </g>
              ))}
              <text x={230} y={38} fontSize={10} fill="var(--muted-foreground)">병렬 브로드캐스트 →</text>
              {['V1', 'V2', 'V3'].map((v, i) => (
                <g key={i}>
                  <rect x={300 + i * 48} y={20} width={38} height={28} rx={4}
                    fill={`${C2}08`} stroke={C2} strokeWidth={0.5} />
                  <text x={319 + i * 48} y={38} textAnchor="middle" fontSize={10} fill={C2}>{v}</text>
                </g>
              ))}
              {['Msg → PartialSig', '임계 서명 조합', '인증서 → 다음 메시지'].map((l, i) => (
                <g key={i}>
                  <rect x={80} y={65 + i * 30} width={260} height={22} rx={4}
                    fill={`${[C2, C3, C1][i]}08`} stroke={[C2, C3, C1][i]} strokeWidth={0.6} />
                  <text x={210} y={80 + i * 30} textAnchor="middle" fontSize={10} fill={[C2, C3, C1][i]}>{l}</text>
                </g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'Replicate', sub: 'broadcast', c: C1 },
                { label: 'Sequence', sub: 'consensus', c: C2 },
                { label: 'Execute', sub: 'vm', c: C3 },
              ].map((s, i) => (
                <g key={i}>
                  <rect x={30 + i * 145} y={30} width={120} height={50} rx={5} fill="var(--card)" />
                  <rect x={30 + i * 145} y={30} width={120} height={50} rx={5}
                    fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
                  <text x={90 + i * 145} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.c}>{s.label}</text>
                  <text x={90 + i * 145} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">({s.sub})</text>
                  {i < 2 && <>
                    <text x={157 + i * 145} y={50} fontSize={10} fill="var(--muted-foreground)">독립</text>
                    <line x1={150 + i * 145} y1={55} x2={175 + i * 145} y2={55}
                      stroke="var(--border)" strokeWidth={0.6} />
                  </>}
                </g>
              ))}
              <text x={220} y={115} textAnchor="middle" fontSize={10} fill={C2}>
                각 단계 독립적 — 병렬화 가능, 리더 병목 해소
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={140} y={10} width={140} height={26} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={0.8} />
              <text x={210} y={27} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>리더: D bytes 데이터</text>
              <line x1={210} y1={36} x2={210} y2={52} stroke="var(--border)" strokeWidth={0.6} />
              <rect x={120} y={52} width={180} height={22} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.7} />
              <text x={210} y={67} textAnchor="middle" fontSize={10} fill={C2}>Reed-Solomon → m개 샤드</text>
              {[1, 2, 3, 4].map(i => (
                <g key={i}>
                  <line x1={210} y1={74} x2={50 + i * 90} y2={95} stroke="var(--border)" strokeWidth={0.4} />
                  <rect x={20 + i * 90} y={95} width={60} height={22} rx={3}
                    fill={`${C3}10`} stroke={C3} strokeWidth={0.5} />
                  <text x={50 + i * 90} y={110} textAnchor="middle" fontSize={10} fill={C3}>샤드 {i}</text>
                </g>
              ))}
              <rect x={130} y={135} width={160} height={22} rx={4} fill={`${C2}10`} stroke={C2} strokeWidth={0.7} />
              <text x={210} y={150} textAnchor="middle" fontSize={10} fill={C2}>신뢰 설정 불필요 (vs KZG)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
