import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const C = {
  red: '#ef4444',
  green: '#22c55e',
  blue: '#3b82f6',
  amber: '#f59e0b',
  purple: '#8b5cf6',
  cyan: '#06b6d4',
};

const STEPS = [
  {
    label: '증적 폴더 구조 — ISMS 항목번호 = 폴더명',
    body: 'ISMS 인증 기준 번호 체계에 맞춰 폴더를 구성하면, 심사 당일 "2.5.6 증적 보여주세요"에 3초 안에 대응 가능.',
  },
  {
    label: '증적 작성 핵심 4가지',
    body: '날짜/시간 포함, BEFORE 먼저 캡처, 정책-설정 교차확인, 구두 설명은 증거가 아님. 이 4가지를 지켜야 심사를 통과한다.',
  },
  {
    label: '보완조치 프로세스 — 결함에서 인증까지',
    body: '결함 도출 → 결함정리표 → 보완조치 내역서 → 증적 첨부 → 완료 공문. 기간 초과 시 연장 공문 제출.',
  },
  {
    label: '핵심 교훈 — ISMS = 문서화 + 프로세스의 시험',
    body: '잘 해도 증적 없으면 결함. 못 해도 개선 계획 있으면 경결함. 기술적 우수성과 심사 통과는 다른 문제.',
  },
];

/* ── 화살표 유틸 ── */
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

export default function EvidenceViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 루트 */}
              <ModuleBox x={175} y={6} w={130} h={40} label="ISMS 증적" color={C.purple} />

              {/* 하위 폴더 4개 */}
              <DataBox x={10} y={66} w={100} h={30} label="2.5.6 인증/권한" color={C.blue} />
              <DataBox x={125} y={66} w={100} h={30} label="2.6.3 접근통제" color={C.blue} />
              <DataBox x={240} y={66} w={100} h={30} label="2.7.1 암호화" color={C.blue} />
              <DataBox x={355} y={66} w={110} h={30} label="2.8.2 개발보안" color={C.blue} />

              {/* 연결선 */}
              <Arrow x1={240} y1={46} x2={60} y2={66} color={C.purple} />
              <Arrow x1={240} y1={46} x2={175} y2={66} color={C.purple} />
              <Arrow x1={240} y1={46} x2={290} y2={66} color={C.purple} />
              <Arrow x1={240} y1={46} x2={410} y2={66} color={C.purple} />

              {/* 각 폴더 하위 파일 */}
              {[10, 125, 240, 355].map((fx, i) => (
                <g key={i}>
                  <rect x={fx} y={106} width={i === 3 ? 110 : 100} height={46} rx={4} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                  <text x={fx + (i === 3 ? 55 : 50)} y={120} textAnchor="middle" fontSize={8} fill={C.green}>BEFORE.png</text>
                  <text x={fx + (i === 3 ? 55 : 50)} y={133} textAnchor="middle" fontSize={8} fill={C.green}>AFTER.png</text>
                  <text x={fx + (i === 3 ? 55 : 50)} y={146} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">설정.conf</text>
                  <line x1={fx + (i === 3 ? 55 : 50)} y1={96} x2={fx + (i === 3 ? 55 : 50)} y2={106} stroke="var(--border)" strokeWidth={0.8} />
                </g>
              ))}

              {/* 파일명 규칙 */}
              <rect x={40} y={168} width={400} height={36} rx={6} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} />
              <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.amber}>파일명 규칙</text>
              <text x={240} y={197} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">[항목번호]_[설명]_[BEFORE/AFTER]_[날짜].png</text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.blue}>증적 작성 핵심 4가지</text>

              {/* 4개 ActionBox 2x2 그리드 */}
              <ActionBox x={20} y={34} w={200} h={38} label="1. 날짜/시간 포함 캡처" sub="시스템 시계 함께 촬영" color={C.blue} />
              <ActionBox x={260} y={34} w={200} h={38} label="2. BEFORE 먼저 캡처" sub="수정 전 상태를 먼저 기록" color={C.amber} />
              <ActionBox x={20} y={86} w={200} h={38} label="3. 정책 ↔ 설정 교차확인" sub="문서와 현실 불일치 = 결함" color={C.purple} />
              <ActionBox x={260} y={86} w={200} h={38} label="4. 구두 설명 ≠ 증거" sub="화면 캡처 또는 절차서 필수" color={C.red} />

              {/* 화살표 → 결과 */}
              <Arrow x1={120} y1={124} x2={200} y2={150} color={C.green} />
              <Arrow x1={360} y1={124} x2={280} y2={150} color={C.green} />

              {/* 결과 */}
              <StatusBox x={170} y={148} w={140} h={50} label="심사 통과" sub="4가지 모두 충족 시" color={C.green} progress={1} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 메인 플로우 */}
              <AlertBox x={10} y={20} w={80} h={38} label="결함 도출" sub="현장심사 후" color={C.red} />
              <Arrow x1={90} y1={39} x2={108} y2={39} color={C.blue} />

              <ActionBox x={110} y={20} w={85} h={38} label="결함정리표" sub="우선순위 배정" color={C.blue} />
              <Arrow x1={195} y1={39} x2={213} y2={39} color={C.blue} />

              <ActionBox x={215} y={20} w={95} h={38} label="보완조치 내역서" sub="BEFORE→AFTER" color={C.purple} />
              <Arrow x1={310} y1={39} x2={328} y2={39} color={C.blue} />

              <DataBox x={330} y={24} w={70} h={30} label="증적 첨부" color={C.green} />
              <Arrow x1={400} y1={39} x2={415} y2={39} color={C.blue} />

              <ActionBox x={418} y={20} w={55} h={38} label="완료 공문" color={C.green} />

              {/* 최종 */}
              <Arrow x1={445} y1={58} x2={445} y2={75} color={C.green} />
              <StatusBox x={395} y={78} w={80} h={40} label="이행 확인" sub="인증 완료" color={C.green} progress={1} />

              {/* 분기: 기간 초과 */}
              <rect x={10} y={85} width={360} height={70} rx={8} fill="var(--card)" stroke={C.amber} strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={20} y={104} fontSize={10} fontWeight={700} fill={C.amber}>기간 초과 시 (40일 이내 미완료)</text>

              <AlertBox x={20} y={112} w={85} h={34} label="기간 초과" sub="완료 불가 항목" color={C.amber} />
              <Arrow x1={105} y1={129} x2={120} y2={129} color={C.amber} />

              <ActionBox x={122} y={112} w={90} h={34} label="연장 공문" sub="사유 + 계획서" color={C.amber} />
              <Arrow x1={212} y1={129} x2={228} y2={129} color={C.amber} />

              <DataBox x={230} y={114} w={120} h={30} label="최대 40일 추가" sub="1회 한정" color={C.amber} />

              {/* 내역서 상세 */}
              <rect x={10} y={170} width={460} height={38} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={240} y={186} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.purple}>보완 내역서 필수 항목</text>
              <text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">현재 상태(BEFORE) → 조치 내용(설정값·서버·일시) → 조치 후 상태(AFTER) + 증적 첨부</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* 중앙 큰 박스 */}
              <ModuleBox x={105} y={10} w={270} h={54} label="ISMS = 문서화 + 프로세스의 시험" color={C.purple} />

              {/* 주변 교훈 3개 */}
              <DataBox x={15} y={88} w={200} h={34} label="잘 해도 증적 없으면 결함" sub="bcrypt를 써도 증명 못하면 미이행" color={C.red} />

              <DataBox x={260} y={88} w={210} h={34} label="못 해도 개선 계획 있으면 경결함" sub="인지 + 문서화된 계획 = 감경" color={C.green} />

              <DataBox x={105} y={144} w={270} h={34} label="기술적 우수성 ≠ 심사 통과" sub="심사 기준(KISA 검증 목록) 내에서 최선 선택" color={C.amber} />

              {/* 연결선 */}
              <Arrow x1={240} y1={64} x2={115} y2={88} color={C.purple} />
              <Arrow x1={240} y1={64} x2={365} y2={88} color={C.purple} />
              <Arrow x1={240} y1={64} x2={240} y2={144} color={C.purple} />

              {/* 하단 요약 */}
              <rect x={80} y={190} width={320} height={24} rx={6} fill="var(--card)" stroke={C.blue} strokeWidth={0.8} />
              <text x={240} y={206} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.blue}>
                증적을 미리, 매일, 체계적으로 쌓는 것이 핵심
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
