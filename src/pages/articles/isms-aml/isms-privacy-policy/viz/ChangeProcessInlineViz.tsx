import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  trigger: '#ef4444',
  review: '#6366f1',
  notify: '#f59e0b',
  deploy: '#10b981',
};

const STEPS = [
  { label: '변경 사유 발생 → CPO 검토', body: '새 항목 수집, 제3자 제공 추가, 보유기간 변경 등이 발생하면 CPO가 변경안을 검토하고 법적 적합성을 확인한다.' },
  { label: '사전 고지 → 게시 및 시행', body: '변경 시행 7일 전(중요 사항 30일 전) 홈페이지 공지. 시행일에 처리방침 교체 후 이전 버전은 아카이브 보관.' },
  { label: '심사 증적 세트', body: 'ISMS-P 심사에서 요구하는 변경 이력 증적: 변경 일자, 전후 비교표, 사전 고지 화면 캡처, CPO 검토 서명.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cp-inline-arrow)" />;
}

export default function ChangeProcessInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cp-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">변경 절차 전반부</text>

              <AlertBox x={15} y={30} w={130} h={50} label="변경 사유 발생" sub="수집 추가 / 제공 추가" color={C.trigger} />
              <Arrow x1={145} y1={55} x2={175} y2={55} color={C.trigger} />

              <ActionBox x={178} y={30} w={130} h={50} label="CPO 내부 검토" sub="법적 적합성 확인" color={C.review} />
              <Arrow x1={308} y1={55} x2={338} y2={55} color={C.review} />

              <StatusBox x={341} y={30} w={125} h={50} label="변경안 확정" sub="내부 결재 완료" color={C.deploy} />

              {/* 예시 */}
              <line x1={15} y1={100} x2={465} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">변경 사유 예시</text>

              <DataBox x={30} y={128} w={120} h={26} label="KYC 항목 추가" color={C.trigger} />
              <DataBox x={170} y={128} w={140} h={26} label="제3자 제공처 변경" color={C.trigger} />
              <DataBox x={330} y={128} w={120} h={26} label="보유기간 조정" color={C.trigger} />

              <motion.circle r={3} fill={C.review} opacity={0.4}
                initial={{ cx: 80 }} animate={{ cx: 403 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} cy={55} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">변경 절차 후반부</text>

              <ActionBox x={15} y={35} w={110} h={50} label="사전 고지" sub="공지사항 게시" color={C.notify} />
              <text x={70} y={100} textAnchor="middle" fontSize={8} fill={C.notify}>일반 7일 / 중요 30일</text>

              <Arrow x1={125} y1={60} x2={155} y2={60} color={C.notify} />

              <ActionBox x={158} y={35} w={120} h={50} label="시행일 교체" sub="처리방침 업데이트" color={C.deploy} />

              <Arrow x1={278} y1={60} x2={308} y2={60} color={C.deploy} />

              <StatusBox x={311} y={35} w={150} h={50} label="이전 버전 아카이브" sub="변경 전후 비교 가능" color={C.review} />

              {/* 타임라인 */}
              <line x1={30} y1={130} x2={450} y2={130} stroke="var(--border)" strokeWidth={1.5} />
              <circle cx={100} cy={130} r={4} fill={C.notify} />
              <text x={100} y={150} textAnchor="middle" fontSize={8} fill={C.notify}>고지 시작</text>
              <circle cx={300} cy={130} r={4} fill={C.deploy} />
              <text x={300} y={150} textAnchor="middle" fontSize={8} fill={C.deploy}>시행일</text>
              <circle cx={400} cy={130} r={4} fill={C.review} />
              <text x={400} y={150} textAnchor="middle" fontSize={8} fill={C.review}>아카이브</text>

              <text x={200} y={175} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.notify}>7~30일 사전 고지 기간</text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">ISMS-P 심사 증적 세트</text>

              <DataBox x={30} y={35} w={100} h={40} label="변경 일자" color={C.review} />
              <Arrow x1={130} y1={55} x2={148} y2={55} color={C.review} />

              <DataBox x={150} y={35} w={110} h={40} label="전후 비교표" color={C.review} />
              <Arrow x1={260} y1={55} x2={278} y2={55} color={C.review} />

              <DataBox x={280} y={35} w={110} h={40} label="고지 화면 캡처" color={C.notify} />

              <Arrow x1={240} y1={75} x2={240} y2={95} color={C.deploy} />

              <StatusBox x={150} y={98} w={180} h={42} label="CPO 검토 서명" sub="최종 승인 증적" color={C.deploy} />

              <line x1={15} y1={155} x2={465} y2={155} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.trigger}>
                4가지 세트 미비 시 심사 부적합 판정 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
