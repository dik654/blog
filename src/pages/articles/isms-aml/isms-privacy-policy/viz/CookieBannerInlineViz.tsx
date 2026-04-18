import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const C = {
  banner: '#3b82f6',
  consent: '#10b981',
  warn: '#f59e0b',
  deny: '#ef4444',
};

const STEPS = [
  { label: '쿠키 배너 구성 요소', body: '수집 목적(유형별 설명) + 쿠키 유형(필수/분석/기능/광고) + 거부 방법(유형별 토글) + 상세 정보 링크. "수락"과 "거부" 동등 배치 필수.' },
  { label: '거부 시 영향 범위', body: '분석 거부: 통계 제외. 기능 거부: 설정 초기화. 광고 거부: 일반 광고 표시. 필수 거부: 핵심 기능 불가. 각 영향을 처리방침에 명시해야.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#cb-inline-arrow)" />;
}

export default function CookieBannerInlineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="cb-inline-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.banner}>쿠키 배너 필수 구성 요소</text>

              {/* 배너 모의 */}
              <rect x={30} y={28} width={420} height={110} rx={6} fill="none" stroke={C.banner} strokeWidth={1.5} />
              <text x={240} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.banner}>쿠키 동의 배너</text>

              <DataBox x={40} y={50} w={100} h={28} label="수집 목적" color={C.banner} />
              <DataBox x={150} y={50} w={100} h={28} label="쿠키 유형" color={C.banner} />
              <DataBox x={260} y={50} w={80} h={28} label="거부 토글" color={C.consent} />
              <DataBox x={350} y={50} w={90} h={28} label="상세 링크" color={C.banner} />

              {/* 버튼 영역 */}
              <rect x={120} y={95} width={80} height={28} rx={4} fill={C.consent} opacity={0.3} />
              <text x={160} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.consent}>수락</text>

              <rect x={220} y={95} width={80} height={28} rx={4} fill={C.deny} opacity={0.3} />
              <text x={260} y={113} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.deny}>거부</text>

              <text x={340} y={113} fontSize={8} fill={C.warn}>← 동등 크기·위치 필수</text>

              <line x1={30} y1={150} x2={450} y2={150} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={90} y={155} w={300} h={30} label="수락만 크게 표시 + 거부 숨김 → 유효 동의 불인정" sub="" color={C.warn} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.deny}>쿠키 거부 시 영향 범위</text>

              {/* 4가지 유형별 영향 */}
              <DataBox x={15} y={30} w={105} h={36} label="분석 쿠키 거부" color={C.banner} />
              <text x={67} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">통계에서 제외</text>
              <StatusBox x={15} y={90} w={105} h={22} label="서비스 영향 없음" sub="" color={C.consent} />

              <DataBox x={130} y={30} w={105} h={36} label="기능 쿠키 거부" color={C.banner} />
              <text x={182} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">설정 매번 초기화</text>
              <StatusBox x={130} y={90} w={105} h={22} label="불편, 이용 가능" sub="" color={C.warn} />

              <DataBox x={245} y={30} w={105} h={36} label="광고 쿠키 거부" color={C.banner} />
              <text x={297} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">일반 광고 표시</text>
              <StatusBox x={245} y={90} w={105} h={22} label="서비스 영향 없음" sub="" color={C.consent} />

              <DataBox x={360} y={30} w={105} h={36} label="필수 쿠키 거부" color={C.deny} />
              <text x={412} y={80} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">로그인 불가</text>
              <AlertBox x={360} y={90} w={105} h={22} label="서비스 제한" sub="" color={C.deny} />

              <line x1={15} y1={125} x2={465} y2={125} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={145} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">
                각 영향을 처리방침(쿠키 정책)에 구체적으로 명시 의무
              </text>
              <text x={240} y={165} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                필수 쿠키 거부 시 서비스 이용 제한 가능 → 사전 안내 필요
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
