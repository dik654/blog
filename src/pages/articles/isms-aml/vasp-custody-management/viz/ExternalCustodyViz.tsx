import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  blue: '#3b82f6',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  purple: '#8b5cf6',
};

const STEPS = [
  {
    label: '외부 수탁 구조 — VASP → 수탁기관 위탁',
    body: '전문 수탁기관이 개인키 관리·트랜잭션 서명·물리 보안을 전담. 이용자에 대한 최종 배상 책임은 위탁한 VASP에게 귀속.',
  },
  {
    label: '외부 수탁 3대 조건 — 사고예방·이해상충·재위탁 금지',
    body: '수탁기관은 보안 시스템 구비, 자기 이익 사용 금지, 제3자 재위탁 금지. 재위탁 시 책임 추적 불가능 → 원천 금지.',
  },
  {
    label: '분기별 정기 점검 — 4개 항목 교차 검증',
    body: '잔고 대조(온체인·수탁·내부 3자), 접근 로그, 보안 인증 갱신, SLA 이행. 이상 발견 시 즉시 원인 조사.',
  },
  {
    label: '취약점 분석 평가 — 연 1회 의무',
    body: '네트워크·앱·키관리·물리·인적 보안 5개 영역. 결과보고서 + 보완계획서를 30일 이내 금감원 제출.',
  },
  {
    label: '긴급 전송 중지 — 6단계 비상 프로토콜',
    body: 'Kill Switch → 침해 범위 파악 → 감독기관 신고 → 이용자 공지 → 미침해 자산 이전 → 단계적 재개.',
  },
];

function Arrow({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 4, ay = y2 - uy * 4;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1} />
      <polygon
        points={`${x2},${y2} ${ax - uy * 3},${ay + ux * 3} ${ax + uy * 3},${ay - ux * 3}`}
        fill={color}
      />
    </g>
  );
}

export default function ExternalCustodyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 이용자 → VASP → 수탁기관 */}
              <ModuleBox x={10} y={40} w={100} h={44} label="이용자" sub="자산 위탁" color={C.blue} />
              <Arrow x1={110} y1={62} x2={155} y2={62} color={C.blue} />

              <ModuleBox x={160} y={40} w={120} h={44} label="VASP" sub="가상자산사업자" color={C.amber} />
              <Arrow x1={280} y1={62} x2={325} y2={62} color={C.amber} />

              <ModuleBox x={330} y={40} w={130} h={44} label="수탁기관" sub="키 관리 전담" color={C.green} />

              {/* 수탁기관 역할 */}
              <DataBox x={335} y={100} w={120} h={28} label="개인키 관리" color={C.green} />
              <DataBox x={335} y={135} w={120} h={28} label="TX 서명" color={C.green} />
              <DataBox x={335} y={170} w={120} h={28} label="물리 보안" color={C.green} />

              {/* 책임 귀속 화살표 */}
              <AlertBox x={60} y={120} w={200} h={40} label="손해배상 책임 → VASP" sub="수탁기관 과실이어도 VASP 부담" color={C.red} />
              <Arrow x1={160} y1={84} x2={160} y2={120} color={C.red} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>외부 수탁 3대 조건</text>

              {/* 3개 조건 박스 */}
              <ActionBox x={20} y={35} w={130} h={44} label="사고예방 체계" sub="해킹·내부자·침입 방지" color={C.green} />
              <ActionBox x={175} y={35} w={130} h={44} label="이해상충 방지" sub="수탁 자산 사적 사용 금지" color={C.amber} />
              <ActionBox x={330} y={35} w={130} h={44} label="재위탁 금지" sub="제3자 재위탁 불가" color={C.red} />

              {/* 재위탁 금지 상세 */}
              <rect x={100} y={100} width={280} height={50} rx={8} fill="var(--card)" stroke={C.red} strokeWidth={0.8} />
              <text x={240} y={118} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.red}>재위탁 체인 위험</text>
              <text x={240} y={138} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{'A사 → B사 → C사 : 보안 표준 상이 + 책임 추적 불가'}</text>

              <Arrow x1={395} y1={79} x2={370} y2={100} color={C.red} />

              {/* 블록체인 특수성 */}
              <AlertBox x={130} y={165} w={220} h={38} label="블록체인 자산은 복구 불가" sub="전통 금융보다 더 엄격한 재위탁 금지" color={C.red} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>분기별 정기 점검 항목</text>

              {/* 4개 항목 */}
              <StatusBox x={20} y={35} w={200} h={40} label="잔고 대조" sub="온체인 + 수탁기관 + 내부 장부 3자 대조" color={C.green} progress={1} />
              <StatusBox x={20} y={85} w={200} h={40} label="접근 로그 검토" sub="키 접근·서명 이력·관리자 변경" color={C.blue} progress={0.85} />
              <StatusBox x={260} y={35} w={200} h={40} label="보안 인증 갱신" sub="ISMS / SOC 2 만료 여부" color={C.amber} progress={0.7} />
              <StatusBox x={260} y={85} w={200} h={40} label="SLA 이행 여부" sub="가용성·응답시간·장애복구" color={C.purple} progress={0.9} />

              {/* 결과 흐름 */}
              <Arrow x1={120} y1={125} x2={200} y2={150} color={C.green} />
              <Arrow x1={360} y1={125} x2={280} y2={150} color={C.amber} />

              <DataBox x={160} y={145} w={160} h={32} label="이상 발견 시" sub="즉시 원인 조사 착수" color={C.red} />

              {/* 하단 안내 */}
              <rect x={100} y={190} width={280} height={22} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">인증 만료 시 수탁 계약 재검토 또는 대체 기관 준비</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>취약점 분석 평가 (연 1회)</text>

              {/* 5개 평가 영역 */}
              <ActionBox x={10} y={35} w={85} h={36} label="네트워크" sub="방화벽·DMZ" color={C.blue} />
              <ActionBox x={105} y={35} w={85} h={36} label="애플리케이션" sub="거래·API" color={C.blue} />
              <ActionBox x={200} y={35} w={85} h={36} label="키 관리" sub="HSM·Multi-sig" color={C.purple} />
              <ActionBox x={295} y={35} w={85} h={36} label="물리 보안" sub="서버실·CCTV" color={C.green} />
              <ActionBox x={390} y={35} w={80} h={36} label="인적 보안" sub="접근 권한" color={C.amber} />

              {/* 화살표 합류 */}
              {[52, 147, 242, 337, 430].map((cx, i) => (
                <Arrow key={i} x1={cx} y1={71} x2={240} y2={95} color={C.blue} />
              ))}

              {/* 결과 */}
              <ModuleBox x={160} y={95} w={160} h={40} label="전문기관 평가" sub="금융위 고시 지정" color={C.blue} />

              {/* 제출 */}
              <Arrow x1={240} y1={135} x2={140} y2={160} color={C.amber} />
              <Arrow x1={240} y1={135} x2={340} y2={160} color={C.amber} />

              <DataBox x={50} y={155} w={170} h={32} label="결과보고서" sub="위험등급·영향범위·재현성" color={C.amber} />
              <DataBox x={260} y={155} w={170} h={32} label="보완계획서" sub="조치·담당자·완료일" color={C.amber} />

              {/* 기한 */}
              <rect x={130} y={198} width={220} height={18} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">평가 후 30일 이내 금감원 제출</text>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.red}>긴급 전송 중지 프로토콜</text>

              {/* 6단계 세로 흐름 — 2열 3행 */}
              <AlertBox x={20} y={28} w={200} h={36} label="1. Kill Switch 발동" sub="전 지갑 API 비활성화" color={C.red} />
              <Arrow x1={220} y1={46} x2={250} y2={46} color={C.red} />

              <ActionBox x={255} y={28} w={210} h={36} label="2. 침해 범위 파악" sub="어떤 지갑·키가 영향받았는지" color={C.amber} />

              <Arrow x1={360} y1={64} x2={360} y2={80} color={C.amber} />

              <ActionBox x={255} y={82} w={210} h={36} label="3. 감독기관·수사기관 신고" sub="법무팀 / CCO" color={C.blue} />

              <Arrow x1={255} y1={100} x2={225} y2={100} color={C.blue} />

              <ActionBox x={20} y={82} w={200} h={36} label="4. 이용자 공지" sub="중단 사유 + 복구 시점" color={C.blue} />

              <Arrow x1={120} y1={118} x2={120} y2={135} color={C.green} />

              <StatusBox x={20} y={135} w={200} h={40} label="5. 미침해 자산 이전" sub="새 콜드월렛으로 긴급 이동" color={C.green} progress={0.6} />

              <Arrow x1={220} y1={155} x2={250} y2={155} color={C.green} />

              <StatusBox x={255} y={135} w={210} h={40} label="6. 단계적 서비스 재개" sub="경영진·CISO·CCO 합의" color={C.green} progress={1} />

              {/* SLA 안내 */}
              <rect x={100} y={190} width={280} height={22} rx={4} fill="var(--card)" stroke={C.red} strokeWidth={0.5} />
              <text x={240} y={205} textAnchor="middle" fontSize={8} fill={C.red}>수탁기관 응답 SLA: 15분 이내</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
