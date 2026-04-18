import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  hot: '#f59e0b',
  cold: '#6366f1',
  multisig: '#10b981',
  danger: '#ef4444',
};

const STEPS = [
  { label: 'Multi-sig 서명 구조', body: '3-of-5 Multi-sig: 5개 키 중 3개 이상 서명 필수. 단일 키 장악으로는 자금 이동 불가. 내부자 단독 범행 방지.' },
  { label: '이중 기록 체계', body: '온체인(블록체인 원장) + 오프체인(내부 DB). 온체인은 주소만, 내부 로그는 이용자 ID/IP/승인자 포함. 정합성 정기 대조.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#ohc-arrow)" />;
}

export default function OverviewHotColdViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ohc-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Multi-sig: 복수 서명 필수 구조</text>

              {/* 5 key holders */}
              {[0, 1, 2, 3, 4].map(i => (
                <g key={i}>
                  <circle cx={60 + i * 90} cy={50} r={18} fill={i < 3 ? `${C.multisig}20` : 'var(--card)'} stroke={i < 3 ? C.multisig : 'var(--border)'} strokeWidth={0.8} />
                  <text x={60 + i * 90} y={46} textAnchor="middle" fontSize={12} fill={i < 3 ? C.multisig : 'var(--muted-foreground)'}>{'🔑'}</text>
                  <text x={60 + i * 90} y={59} textAnchor="middle" fontSize={7} fill={i < 3 ? C.multisig : 'var(--muted-foreground)'}>키 {i + 1}</text>
                </g>
              ))}

              <text x={240} y={84} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.multisig}>3개 이상 서명 필요 (3-of-5)</text>

              <Arrow x1={240} y1={90} x2={240} y2={110} color={C.multisig} />

              <rect x={130} y={112} width={220} height={35} rx={6} fill="var(--card)" stroke={C.multisig} strokeWidth={0.6} />
              <text x={240} y={130} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">트랜잭션 서명 완성</text>
              <text x={240} y={142} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">필요 서명 수 충족 시 브로드캐스트</text>

              {/* Benefits */}
              <DataBox x={30} y={162} w={130} h={28} label="공격 난이도 급증" color={C.multisig} />
              <DataBox x={175} y={162} w={130} h={28} label="내부자 단독 불가" color={C.multisig} />
              <AlertBox x={320} y={158} w={130} h={32} label="단일 키 체계" sub="한 명 탈취 = 전액 유출" color={C.danger} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">이중 기록 체계</text>

              <ModuleBox x={30} y={35} w={180} h={45} label="온체인 기록" sub="블록체인 원장 (불변)" color={C.cold} />
              <ModuleBox x={270} y={35} w={180} h={45} label="내부 DB 로그" sub="이용자ID / IP / 승인자" color={C.hot} />

              <DataBox x={35} y={95} w={170} h={25} label="주소만 보임 → 실거래자 불명" color={C.cold} />
              <DataBox x={275} y={95} w={170} h={25} label="메타데이터 포함 → 감사 추적" color={C.hot} />

              {/* Consistency check */}
              <Arrow x1={120} y1={120} x2={200} y2={140} color={C.multisig} />
              <Arrow x1={360} y1={120} x2={280} y2={140} color={C.multisig} />

              <rect x={140} y={140} width={200} height={30} rx={6} fill={`${C.multisig}10`} stroke={C.multisig} strokeWidth={0.6} />
              <text x={240} y={159} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.multisig}>정합성 정기 대조</text>

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">불일치 발생 시 즉시 조사 → 내부자 비리/시스템 오류 조기 발견</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
