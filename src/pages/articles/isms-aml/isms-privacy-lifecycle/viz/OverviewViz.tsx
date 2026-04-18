import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  collect: '#6366f1',
  use: '#0ea5e9',
  store: '#f59e0b',
  destroy: '#ef4444',
  safe: '#10b981',
};

const STEPS = [
  {
    label: '개인정보 생명주기 — 수집 → 이용 → 보관 → 파기',
    body: '개인정보보호법은 각 단계마다 별도 의무를 부과. 수집(동의·최소 수집) → 이용(목적 범위 내) → 보관(안전성 확보) → 파기(복구 불가). ISMS-P 3.x 영역이 전체를 관리.',
  },
  {
    label: '보유기간 = max(수집 목적 기간, 법령 보존 기간)',
    body: '제21조 — 목적 달성 시 즉시 파기 원칙. 단, 특금법 5년(CDD·거래기록), 전자상거래법 5년(계약·대금), 안전성확보기준 2년(접속로그) 등 법령 보존 의무가 있으면 해당 기간까지 보관.',
  },
  {
    label: '보유 → 보존(분리보관) → 파기 전환 흐름',
    body: '보유: 서비스 이용 중 유지. 보존: 목적 달성 후 법령에 따라 분리보관(별도 DB, 최소 인원 접근). 파기: 보존기간 만료 후 복구 불가 삭제. 이 전환이 생명주기 후반부.',
  },
  {
    label: 'ISMS-P 심사 포인트 — 문서화·분리·증적·휴면',
    body: '보유기간 산정 근거 문서화. 분리보관 체계(별도 DB/스키마). 파기 절차·주기·담당자 명시. 파기 대장·확인서 증적. 1년 미접속 휴면계정 분리보관. 블록체인 데이터는 오프체인 저장 원칙.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: {
  x1: number; y1: number; x2: number; y2: number; color: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1} markerEnd="url(#plc-ov-arrow)" />
  );
}

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="plc-ov-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: 4단계 생명주기 흐름 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">개인정보 생명주기 4단계</text>

              <ModuleBox x={10} y={35} w={100} h={50} label="수집" sub="동의·최소 수집" color={C.collect} />
              <Arrow x1={110} y1={60} x2={128} y2={60} color={C.collect} />

              <ModuleBox x={130} y={35} w={100} h={50} label="이용" sub="목적 범위 내" color={C.use} />
              <Arrow x1={230} y1={60} x2={248} y2={60} color={C.use} />

              <ModuleBox x={250} y={35} w={100} h={50} label="보관" sub="안전성 확보" color={C.store} />
              <Arrow x1={350} y1={60} x2={368} y2={60} color={C.store} />

              <ModuleBox x={370} y={35} w={100} h={50} label="파기" sub="복구 불가" color={C.destroy} />

              {/* 흐르는 데이터 */}
              <motion.circle r={4} fill={C.collect} opacity={0.6}
                initial={{ cx: 60 }} animate={{ cx: 420 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} cy={60} />

              <line x1={15} y1={100} x2={465} y2={100} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              {/* ISMS-P 항목 매핑 */}
              <text x={60} y={118} textAnchor="middle" fontSize={9} fill={C.collect} fontWeight={600}>ISMS-P 3.1</text>
              <text x={180} y={118} textAnchor="middle" fontSize={9} fill={C.use} fontWeight={600}>ISMS-P 3.2</text>
              <text x={300} y={118} textAnchor="middle" fontSize={9} fill={C.store} fontWeight={600}>ISMS-P 3.3</text>
              <text x={420} y={118} textAnchor="middle" fontSize={9} fill={C.destroy} fontWeight={600}>ISMS-P 3.3</text>

              {/* 법조문 */}
              <DataBox x={15} y={130} w={90} h={28} label="제15·16·22조" color={C.collect} />
              <DataBox x={135} y={130} w={90} h={28} label="제17·18조" color={C.use} />
              <DataBox x={255} y={130} w={90} h={28} label="제29·21조" color={C.store} />
              <DataBox x={375} y={130} w={90} h={28} label="제21조" color={C.destroy} />

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">이 글에서는 "보관"과 "파기" 단계에 집중</text>
              <rect x={245} y={170} width={110} height={20} rx={4} fill="none" stroke={C.store} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
              <rect x={365} y={170} width={105} height={20} rx={4} fill="none" stroke={C.destroy} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
            </motion.g>
          )}

          {/* Step 1: 보유기간 산정 공식 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보유기간 산정 공식</text>

              {/* 공식 박스 */}
              <rect x={100} y={28} width={280} height={32} rx={8} fill="#6366f112" stroke={C.collect} strokeWidth={1} />
              <text x={240} y={49} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.collect}>보유기간 = max(목적 달성 기간, 법령 보존 기간)</text>

              <line x1={15} y1={75} x2={465} y2={75} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={90} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">VASP 주요 법정 보존 의무</text>

              {/* 법정 보존 항목들 */}
              <ActionBox x={10} y={100} w={140} h={38} label="CDD/거래기록" sub="특금법 — 5년" color={C.store} />
              <ActionBox x={170} y={100} w={140} h={38} label="계약·대금 기록" sub="전자상거래법 — 5년" color={C.store} />
              <ActionBox x={330} y={100} w={140} h={38} label="분쟁처리 기록" sub="전자상거래법 — 3년" color={C.store} />

              <ActionBox x={10} y={150} w={140} h={38} label="접속 로그" sub="안전성 확보 — 2년" color={C.use} />
              <ActionBox x={170} y={150} w={140} h={38} label="통신사실 확인" sub="통비법 — 3~12개월" color={C.use} />

              {/* 5년 강조 */}
              <AlertBox x={330} y={150} w={140} h={38} label="VASP 핵심: 5년" sub="거래종료 후 기산" color={C.destroy} />

              <motion.rect x={325} y={145} width={150} height={48} rx={8}
                fill="none" stroke={C.destroy} strokeWidth={1.5}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }} />
            </motion.g>
          )}

          {/* Step 2: 보유 → 보존 → 파기 전환 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">보유 → 보존 → 파기 전환 흐름</text>

              {/* 보유 상태 */}
              <StatusBox x={15} y={35} w={130} h={55} label="보유 (Active)" sub="서비스 이용 중" color={C.safe} />
              <text x={80} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">활성 DB</text>

              {/* 전환 트리거 */}
              <Arrow x1={145} y1={62} x2={168} y2={62} color={C.store} />
              <text x={157} y={56} textAnchor="middle" fontSize={7} fill={C.store}>목적 달성</text>
              <text x={157} y={75} textAnchor="middle" fontSize={7} fill={C.store}>또는 탈퇴</text>

              {/* 보존 상태 */}
              <StatusBox x={170} y={35} w={140} h={55} label="보존 (Retention)" sub="법령 보존 의무 기간" color={C.store} />
              <text x={240} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">분리보관 DB (접근 제한)</text>

              {/* 파기 트리거 */}
              <Arrow x1={310} y1={62} x2={333} y2={62} color={C.destroy} />
              <text x={322} y={56} textAnchor="middle" fontSize={7} fill={C.destroy}>법정기간</text>
              <text x={322} y={75} textAnchor="middle" fontSize={7} fill={C.destroy}>만료</text>

              {/* 파기 */}
              <StatusBox x={335} y={35} w={130} h={55} label="파기 (Destroy)" sub="복구 불가 삭제" color={C.destroy} />
              <text x={400} y={105} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">파기 대장 기록</text>

              {/* 분리보관 상세 */}
              <line x1={15} y1={120} x2={465} y2={120} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={138} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.store}>분리보관 체계</text>

              <DataBox x={20} y={148} w={130} h={30} label="별도 DB/스키마" color={C.store} />
              <DataBox x={170} y={148} w={140} h={30} label="CPO+법무팀만 접근" color={C.store} />
              <DataBox x={330} y={148} w={130} h={30} label="접근 사유 기록" color={C.store} />

              <motion.circle r={3} fill={C.store} opacity={0.5}
                initial={{ cx: 80, cy: 62 }} animate={{ cx: 400, cy: 62 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }} />
            </motion.g>
          )}

          {/* Step 3: ISMS-P 심사 포인트 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">ISMS-P 3.3 심사 확인 항목</text>

              <ActionBox x={15} y={32} w={140} h={40} label="보유기간 근거" sub="항목별 법적 근거 문서화" color={C.collect} />
              <ActionBox x={170} y={32} w={140} h={40} label="분리보관 체계" sub="별도 DB/테이블 격리" color={C.store} />
              <ActionBox x={330} y={32} w={140} h={40} label="파기 절차" sub="방법·주기·담당자 명시" color={C.destroy} />

              <ActionBox x={15} y={85} w={140} h={40} label="파기 증적" sub="대장·확인서 보관" color={C.destroy} />
              <ActionBox x={170} y={85} w={140} h={40} label="휴면계정 처리" sub="1년 미접속 분리보관" color={C.store} />

              {/* 블록체인 특수성 */}
              <line x1={15} y1={140} x2={465} y2={140} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={15} y={150} w={215} h={45} label="블록체인: 삭제 불가" sub="불변성(Immutability) 충돌" color={C.destroy} />
              <Arrow x1={230} y1={172} x2={248} y2={172} color={C.safe} />
              <StatusBox x={250} y={150} w={220} h={45} label="해법: 오프체인 저장" sub="온체인은 해시/지갑주소만" color={C.safe} />

              <motion.path d="M 245 165 L 245 180" stroke={C.safe} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
