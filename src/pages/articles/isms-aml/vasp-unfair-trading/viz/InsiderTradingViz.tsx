import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  info: '#6366f1',
  person: '#10b981',
  block: '#ef4444',
  time: '#f59e0b',
};

const STEPS = [
  { label: '미공개중요정보(MNPI)의 두 요건', body: '"중대한 영향"(materiality) + "공개 전"(non-public)을 동시에 충족해야 규제 대상. 사소한 정보나 이미 공개된 정보는 해당하지 않는다.' },
  { label: '적용 대상: 정보 수령자까지 확대', body: 'VASP 임직원 → 대리인·위탁업체 → 주요주주 → 계약 상대방 → 정보 수령자(2차, 3차). "직접 거래 안 했다"는 변명 불가 -- 타인에게 이용하게 하는 것 자체가 금지.' },
  { label: '정보 공개 기준과 거래 허용 시점', body: '신문: 게재 다음 날 0시+6h. 전자 간행물: 게재+6h. 홈페이지: 공개+24h. 비공개 채팅방 전달은 "공개"로 인정되지 않는다.' },
  { label: '정보 차단벽(Chinese Wall)', body: '상장심사팀 ↔ 트레이딩팀 물리적·시스템·커뮤니케이션 분리. 예외적 공유(Wall Crossing)는 준법감시인 승인 + 거래 제한 + 전 과정 기록 필수.' },
  { label: '정보 생애주기 관리', body: '생성 → 기밀 등급 지정 → 최소 인원 접근(Need-to-Know) → 접근·공유 이력 전 과정 기록 → 공개 → 폐기. 사후 추적 가능해야 한다.' },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} markerEnd="url(#it-arrow)" />;
}

export default function InsiderTradingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="it-arrow" viewBox="0 0 10 10" refX={8} refY={5}
              markerWidth={6} markerHeight={6} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: MNPI 두 요건 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">미공개중요정보 판단 기준</text>

              <ModuleBox x={60} y={35} w={150} h={50} label="중대한 영향" sub="투자판단에 중대한 영향" color={C.info} />
              <ModuleBox x={270} y={35} w={150} h={50} label="공개 전" sub="불특정 다수 미공개" color={C.time} />

              <text x={240} y={65} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.block}>+</text>

              <Arrow x1={135} y1={85} x2={200} y2={110} color={C.info} />
              <Arrow x1={345} y1={85} x2={280} y2={110} color={C.time} />

              <AlertBox x={175} y={105} w={130} h={45} label="MNPI 해당" sub="두 요건 동시 충족 시" color={C.block} />

              {/* 대표 유형 */}
              <DataBox x={15} y={170} w={85} h={28} label="상장/상폐" color={C.info} />
              <DataBox x={110} y={170} w={75} h={28} label="에어드롭" color={C.info} />
              <DataBox x={195} y={170} w={75} h={28} label="하드포크" color={C.info} />
              <DataBox x={280} y={170} w={90} h={28} label="파트너십" color={C.info} />
              <DataBox x={380} y={170} w={85} h={28} label="보안 취약점" color={C.block} />
            </motion.g>
          )}

          {/* Step 1: 적용 대상 체인 */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">적용 대상 -- 정보 전달 체인</text>

              {/* 1차: 내부자 */}
              <ModuleBox x={15} y={35} w={85} h={45} label="VASP 임직원" sub="거래소·수탁업체" color={C.person} />
              <Arrow x1={100} y1={57} x2={120} y2={57} color={C.person} />

              <ModuleBox x={123} y={35} w={90} h={45} label="대리인·위탁" sub="업무 대리·수탁자" color={C.person} />
              <Arrow x1={213} y1={57} x2={233} y2={57} color={C.person} />

              <ModuleBox x={236} y={35} w={85} h={45} label="주요주주" sub="의결권 일정비율+" color={C.person} />
              <Arrow x1={321} y1={57} x2={341} y2={57} color={C.person} />

              <ModuleBox x={344} y={35} w={120} h={45} label="계약 상대방" sub="거래 계약 협상 중" color={C.person} />

              {/* 정보 전달 → 수령자 */}
              <Arrow x1={240} y1={80} x2={240} y2={105} color={C.block} />
              <text x={260} y={97} fontSize={8} fill={C.block}>정보 전달</text>

              <AlertBox x={155} y={108} w={170} h={45} label="정보 수령자" sub="2차·3차 수령 포함 -- 전원 처벌 대상" color={C.block} />

              {/* 경고 */}
              <rect x={20} y={175} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill={C.block}>"직접 거래 안 했다" 변명 불가 -- 타인에게 이용하게 하는 것 자체가 금지 행위</text>
            </motion.g>
          )}

          {/* Step 2: 공개 기준 타임라인 */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">정보 공개 기준별 거래 허용 시점</text>

              {/* 신문 */}
              <ActionBox x={15} y={35} w={130} h={40} label="신문 게재(종이)" sub="전통 매체" color={C.time} />
              <Arrow x1={145} y1={55} x2={270} y2={55} color={C.time} />
              <DataBox x={273} y={40} w={180} h={30} label="게재 다음 날 0시 + 6시간" color={C.time} />

              {/* 전자 간행물 */}
              <ActionBox x={15} y={85} w={130} h={40} label="전자 간행물" sub="온라인 언론" color={C.info} />
              <Arrow x1={145} y1={105} x2={270} y2={105} color={C.info} />
              <DataBox x={273} y={90} w={180} h={30} label="게재 시점 + 6시간" color={C.info} />

              {/* 홈페이지 */}
              <ActionBox x={15} y={135} w={130} h={40} label="발행자 홈페이지" sub="접근 빈도 낮음" color={C.block} />
              <Arrow x1={145} y1={155} x2={270} y2={155} color={C.block} />
              <DataBox x={273} y={140} w={180} h={30} label="공개 시점 + 24시간" color={C.block} />

              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">비공개 채팅방·소수 전달은 "공개"로 인정되지 않음 -- 불특정 다수 접근 필수</text>
            </motion.g>
          )}

          {/* Step 3: 정보 차단벽 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">정보 차단벽(Information Barrier)</text>

              {/* 좌: 상장심사팀 */}
              <ModuleBox x={30} y={35} w={140} h={50} label="상장심사팀" sub="상장 여부 결정 권한" color={C.info} />

              {/* 차단벽 */}
              <rect x={210} y={30} width={4} height={65} rx={2} fill={C.block} />
              <rect x={216} y={30} width={4} height={65} rx={2} fill={C.block} />
              <text x={228} y={50} fontSize={8} fontWeight={600} fill={C.block}>차단벽</text>

              {/* 우: 트레이딩팀 */}
              <ModuleBox x={270} y={35} w={140} h={50} label="트레이딩팀" sub="매매 실행 부서" color={C.person} />

              {/* 차단 방법 */}
              <rect x={20} y={105} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />

              <ActionBox x={15} y={115} w={105} h={38} label="물리적 분리" sub="다른 층·출입 카드" color={C.block} />
              <ActionBox x={130} y={115} w={105} h={38} label="시스템 분리" sub="접근 권한 완전 분리" color={C.block} />
              <ActionBox x={245} y={115} w={105} h={38} label="통신 통제" sub="업무 대화·메일 금지" color={C.block} />
              <ActionBox x={360} y={115} w={105} h={38} label="Wall Crossing" sub="예외 시 승인+기록" color={C.time} />

              <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Wall Crossing: 준법감시인 승인 → 수령자 거래 제한 → 전 과정 기록</text>
              <text x={240} y={198} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">증권사에서 1960년대부터 사용한 제도 -- 가상자산에도 동일 적용</text>
            </motion.g>
          )}

          {/* Step 4: 정보 생애주기 */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">미공개정보 생애주기 관리</text>

              {/* 생애주기 플로우 */}
              <ActionBox x={10} y={40} w={75} h={40} label="생성" sub="정보 발생" color={C.info} />
              <Arrow x1={85} y1={60} x2={105} y2={60} color={C.info} />

              <ActionBox x={108} y={40} w={75} h={40} label="기밀 지정" sub="Confidential" color={C.block} />
              <Arrow x1={183} y1={60} x2={203} y2={60} color={C.block} />

              <ActionBox x={206} y={40} w={80} h={40} label="최소 접근" sub="Need-to-Know" color={C.time} />
              <Arrow x1={286} y1={60} x2={306} y2={60} color={C.time} />

              <ActionBox x={309} y={40} w={75} h={40} label="공개" sub="불특정 다수" color={C.person} />
              <Arrow x1={384} y1={60} x2={404} y2={60} color={C.person} />

              <ActionBox x={407} y={40} w={60} h={40} label="폐기" sub="파기 기록" color={C.person} />

              {/* 하단: 관리 요소 */}
              <rect x={20} y={105} width={440} height={1} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="4 3" />
              <text x={240} y={125} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">전 과정 기록 항목</text>

              <DataBox x={20} y={135} w={105} h={28} label="암호화 저장" color={C.info} />
              <DataBox x={140} y={135} w={95} h={28} label="접근 로그" color={C.time} />
              <DataBox x={250} y={135} w={85} h={28} label="공유 이력" color={C.block} />
              <DataBox x={350} y={135} w={110} h={28} label="접근 인원 명단" color={C.person} />

              <text x={240} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">사후 조사 시 "누가, 언제, 어떤 정보에 접근했는가"를 추적할 수 있어야 한다</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
