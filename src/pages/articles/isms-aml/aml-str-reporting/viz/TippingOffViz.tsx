import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  safe: '#10b981',
  danger: '#ef4444',
  info: '#6366f1',
  warn: '#f59e0b',
};

const STEPS = [
  { label: 'Tipping-off란 — SAR 사실 누설 금지', body: 'SAR을 제출한 사실을 고객/제3자에게 알리는 행위. 증거 인멸, 자산 도피, 공범 통보, 도주를 유발하여 수사 전체를 무력화할 수 있다.' },
  { label: '위반 vs 허용 — 표현의 경계', body: '"AML 관련 조치" = 위반. "내부 보안 점검으로 제한" = 허용. 핵심: 고객이 SAR 사실을 추론할 수 없어야 한다.' },
  { label: 'Need-to-know — 내부 공유 범위', body: '준법감시인과 AML 담당자만 SAR 사실 인지. CS팀은 "계정 제한" 사실만 전달받아 고객 안내. 정보 확산 = Tipping-off 위험 증가.' },
  { label: 'Safe Harbor — 선의의 보고에 대한 면책', body: '특금법 제4조의3: 합리적 근거에 기반한 선의의 보고는 민·형사 면책. "보고가 미보고보다 안전하다"는 인센티브 구조.' },
  { label: '내부 통제 체계 5단 방어', body: '접근 통제 → CS 스크립트 → 정기 교육 → 감사 로그 → 내부 신고 채널. CS팀 "AML 확인 중" 발언이 가장 흔한 위반 경로.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#to-arrow)" />;
}

export default function TippingOffViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="to-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Tipping-off 개념 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">Tipping-off의 파급 효과</text>

              {/* VASP → 고객에게 SAR 사실 누설 */}
              <ModuleBox x={15} y={30} w={100} h={45} label="VASP 직원" sub="SAR 사실 인지" color={C.info} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Arrow x1={115} y1={52} x2={155} y2={52} color={C.danger} />
                <text x={135} y={45} textAnchor="middle" fontSize={7} fill={C.danger}>누설!</text>
              </motion.g>

              <AlertBox x={158} y={30} w={80} h={45} label="고객" sub="SAR 사실 인지" color={C.danger} />

              {/* 4가지 파급 */}
              <Arrow x1={238} y1={52} x2={275} y2={38} color={C.danger} />
              <Arrow x1={238} y1={52} x2={275} y2={68} color={C.danger} />
              <Arrow x1={238} y1={52} x2={275} y2={98} color={C.danger} />
              <Arrow x1={238} y1={52} x2={275} y2={128} color={C.danger} />

              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <AlertBox x={278} y={18} w={130} h={35} label="증거 인멸" sub="기록 삭제/대화 파기" color={C.danger} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <AlertBox x={278} y={58} w={130} h={35} label="자산 도피" sub="프라이버시코인 교환" color={C.danger} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <AlertBox x={278} y={98} w={130} h={35} label="공범 통보" sub="세탁 네트워크 경고" color={C.danger} />
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <AlertBox x={278} y={138} w={130} h={35} label="도주" sub="국외 도피 시도" color={C.danger} />
              </motion.g>

              {/* 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <Arrow x1={408} y1={110} x2={430} y2={195} color={C.danger} />
                <text x={460} y={200} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>수사 무력화</text>
              </motion.g>

              <text x={100} y={200} fontSize={8} fill="var(--muted-foreground)">처벌: 3년 이하 징역 또는 2천만 원 이하 벌금</text>
            </motion.g>
          )}

          {/* Step 1: 위반 vs 허용 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">고객 안내 시 표현의 경계</text>

              {/* 위반 영역 */}
              <text x={130} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>위반</text>
              <AlertBox x={15} y={45} w={230} h={32} label="'FIU에 보고했습니다'" sub="직접 고지 — 명백한 위반" color={C.danger} />
              <AlertBox x={15} y={82} w={230} h={32} label="'AML 관련 조치가 취해졌습니다'" sub="간접 암시 — 추론 가능" color={C.danger} />
              <AlertBox x={15} y={119} w={230} h={32} label="'자금세탁 의심으로 계정 정지'" sub="의심 사유 직접 고지" color={C.danger} />

              {/* 구분선 */}
              <line x1={255} y1={35} x2={255} y2={170} stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3" />

              {/* 허용 영역 */}
              <text x={365} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.safe}>허용</text>
              <DataBox x={265} y={48} w={200} h={30} label="'내부 보안 점검으로 제한'" color={C.safe} />
              <DataBox x={265} y={88} w={200} h={30} label="'정기 확인 절차'" color={C.safe} />
              <DataBox x={265} y={128} w={200} h={30} label="'자금 출처 서류 제출 요청'" color={C.safe} />

              {/* 핵심 원칙 */}
              <rect x={60} y={170} width={360} height={35} rx={8} fill="var(--card)" stroke={C.warn} strokeWidth={1} />
              <text x={240} y={192} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.warn}>핵심: 고객이 "왜" 조치가 취해졌는지 추론 불가해야 함</text>
            </motion.g>
          )}

          {/* Step 2: Need-to-know */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">SAR 사실 인지 범위 — Need-to-know</text>

              {/* SAR 사실 인지 계층 */}
              <ModuleBox x={170} y={28} w={140} h={38} label="SAR 제출 사실" sub="" color={C.info} />

              {/* 인지 필수 */}
              <Arrow x1={210} y1={66} x2={80} y2={85} color={C.safe} />
              <Arrow x1={270} y1={66} x2={370} y2={85} color={C.safe} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={15} y={88} w={130} h={38} label="준법감시인" sub="필수 인지 — 최종 승인" color={C.safe} />
                <ActionBox x={320} y={88} w={130} h={38} label="AML 담당자" sub="필수 인지 — SAR 작성" color={C.safe} />
              </motion.g>

              {/* 미인지 */}
              <rect x={15} y={140} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={155} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">SAR 사실 미인지 영역</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <DataBox x={15} y={163} w={100} h={28} label="CS팀" color={C.warn} />
                <DataBox x={125} y={163} w={100} h={28} label="운영팀" color={C.warn} />
                <DataBox x={250} y={163} w={100} h={28} label="보안팀" color={C.warn} />
                <DataBox x={360} y={163} w={100} h={28} label="일반 직원" color={C.warn} />
              </motion.g>

              <text x={65} y={205} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">"계정 제한"만 전달</text>
              <text x={175} y={205} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">"조치 실행"만 지시</text>
              <text x={300} y={205} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">분석 결과만 인지</text>
              <text x={410} y={205} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">관련 없음</text>
            </motion.g>
          )}

          {/* Step 3: Safe Harbor */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">Safe Harbor — 선의의 보고 면책</text>

              <ModuleBox x={165} y={28} w={150} h={40} label="특금법 제4조의3" sub="선의 보고 면책 보호" color={C.safe} />

              {/* 보호 범위 */}
              <Arrow x1={200} y1={68} x2={80} y2={90} color={C.safe} />
              <Arrow x1={240} y1={68} x2={240} y2={90} color={C.safe} />
              <Arrow x1={280} y1={68} x2={400} y2={90} color={C.safe} />

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <DataBox x={15} y={95} w={130} h={30} label="오보 면책" color={C.safe} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <DataBox x={175} y={95} w={130} h={30} label="고객 손해 면책" color={C.safe} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <DataBox x={335} y={95} w={130} h={30} label="정보 제공 면책" color={C.safe} />
              </motion.g>

              <text x={80} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">의심이 사실 아니어도</text>
              <text x={240} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">계정 정지 손해 발생해도</text>
              <text x={400} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">개인정보 제공해도</text>

              {/* 한계 */}
              <rect x={40} y={155} width={400} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <AlertBox x={40} y={165} w={190} h={35} label="한계: 선의가 전제" sub="고의 허위/경쟁사 해코지 = 면책 X" color={C.danger} />

              {/* 인센티브 구조 */}
              <rect x={260} y={165} width={180} height={35} rx={8} fill="var(--card)" stroke={C.safe} strokeWidth={1} />
              <text x={350} y={180} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>보고 &gt; 미보고</text>
              <text x={350} y={193} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">보고하는 것이 더 안전한 구조</text>
            </motion.g>
          )}

          {/* Step 4: 내부 통제 체계 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">Tipping-off 방지 5단 방어</text>

              {/* 5단계 방어선 - 좌에서 우로 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <ActionBox x={10} y={35} w={80} h={55} label="접근 통제" sub="SAR 시스템 RBAC" color={C.info} />
              </motion.g>
              <Arrow x1={90} y1={62} x2={105} y2={62} color={C.info} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <ActionBox x={108} y={35} w={80} h={55} label="CS 스크립트" sub="표준 문구 사전 마련" color={C.info} />
              </motion.g>
              <Arrow x1={188} y1={62} x2={203} y2={62} color={C.info} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <ActionBox x={206} y={35} w={80} h={55} label="정기 교육" sub="연 1회 전사 필수" color={C.info} />
              </motion.g>
              <Arrow x1={286} y1={62} x2={301} y2={62} color={C.info} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <ActionBox x={304} y={35} w={80} h={55} label="감사 로그" sub="접근 기록 전수 보관" color={C.info} />
              </motion.g>
              <Arrow x1={384} y1={62} x2={399} y2={62} color={C.info} />

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <ActionBox x={402} y={35} w={68} h={55} label="내부 신고" sub="익명 신고 채널" color={C.info} />
              </motion.g>

              {/* 가장 흔한 위반 경로 */}
              <rect x={15} y={110} width={450} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.danger}>가장 흔한 위반 경로</text>

              <ModuleBox x={40} y={138} w={100} h={40} label="CS팀 직원" sub="고객 문의 응대" color={C.warn} />
              <Arrow x1={140} y1={158} x2={175} y2={158} color={C.danger} />
              <AlertBox x={178} y={138} w={180} h={40} label="'AML 팀에서 확인 중입니다'" sub="AML 언급 → 보고 사실 추론 가능" color={C.danger} />
              <Arrow x1={358} y1={158} x2={380} y2={158} color={C.danger} />

              <rect x={383} y={138} width={80} height={40} rx={8} fill="var(--card)" stroke={C.danger} strokeWidth={1} />
              <text x={423} y={155} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.danger}>위반!</text>
              <text x={423} y={170} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">형사처벌 대상</text>

              {/* 올바른 대안 */}
              <DataBox x={140} y={188} w={200} h={28} label="올바른 표현: '내부 보안 점검'" color={C.safe} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
