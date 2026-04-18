import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', amber: '#f59e0b' };

const STEPS = [
  {
    label: 'CERT 역할 분담 구조',
    body: '총괄 책임자(CISO)가 의사결정, 기술 분석관이 포렌식, 시스템 운영자가 복구, 커뮤니케이션 담당이 내·외부 연락. 역할을 사전 지정하지 않으면 현장에서 혼선이 발생한다.',
  },
  {
    label: '비상연락망 에스컬레이션',
    body: '사고 인지 → 1시간 내 CISO → 심각도에 따라 경영진 에스컬레이션. 개인정보 유출은 24시간 내 KISA, 금융 사고는 금감원, 범죄 의심은 사이버수사대.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd="url(#ir-cc-arrow)" />;
}

export default function CertContactInline() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ir-cc-arrow" viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={180} y={8} w={120} h={36} label="CERT" sub="침해사고대응팀" color={C.blue} />
              <Arrow x1={210} y1={46} x2={65} y2={68} color={C.blue} />
              <Arrow x1={230} y1={46} x2={185} y2={68} color={C.blue} />
              <Arrow x1={250} y1={46} x2={310} y2={68} color={C.blue} />
              <Arrow x1={270} y1={46} x2={420} y2={68} color={C.blue} />
              <ModuleBox x={15} y={70} w={100} h={40} label="총괄 책임자" sub="CISO" color={C.red} />
              <ModuleBox x={135} y={70} w={100} h={40} label="기술 분석관" sub="포렌식·분석" color={C.amber} />
              <ModuleBox x={260} y={70} w={100} h={40} label="시스템 운영" sub="격리·복구" color={C.green} />
              <ModuleBox x={385} y={70} w={80} h={40} label="커뮤니케이션" sub="공지·신고" color={C.blue} />
              <ActionBox x={15} y={125} w={100} h={26} label="의사결정·보고" color={C.red} />
              <ActionBox x={135} y={125} w={100} h={26} label="증거 수집" color={C.amber} />
              <ActionBox x={260} y={125} w={100} h={26} label="패치·서비스" color={C.green} />
              <ActionBox x={385} y={125} w={80} h={26} label="내·외부 연락" color={C.blue} />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">사전 문서 지정 + 정기 갱신 필수</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={10} y={20} w={80} h={32} label="사고 인지" sub="탐지 시점" color={C.red} />
              <Arrow x1={92} y1={36} x2={128} y2={36} color={C.red} />
              <text x={110} y={28} textAnchor="middle" fontSize={8} fill={C.red}>1시간</text>
              <ModuleBox x={130} y={20} w={80} h={32} label="CISO" sub="심각도 판단" color={C.amber} />
              <Arrow x1={212} y1={36} x2={248} y2={36} color={C.amber} />
              <ModuleBox x={250} y={20} w={80} h={32} label="경영진" sub="에스컬레이션" color={C.blue} />

              <Arrow x1={170} y1={54} x2={80} y2={82} color={C.red} />
              <text x={105} y={72} textAnchor="middle" fontSize={8} fill={C.red}>24h</text>
              <AlertBox x={20} y={84} w={110} h={30} label="KISA 신고" sub="개인정보 유출" color={C.red} />
              <Arrow x1={170} y1={54} x2={230} y2={82} color={C.amber} />
              <AlertBox x={170} y={84} w={110} h={30} label="금감원 보고" sub="금융 사고" color={C.amber} />
              <Arrow x1={170} y1={54} x2={380} y2={82} color={C.blue} />
              <AlertBox x={320} y={84} w={130} h={30} label="경찰 사이버수사대" sub="범죄 의심" color={C.blue} />

              <DataBox x={130} y={136} w={220} h={28} label="연락망 분기 1회 갱신 + 대리인 지정" color={C.green} />
              <text x={240} y={188} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">보고 지연은 피해 확대의 가장 흔한 원인</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
